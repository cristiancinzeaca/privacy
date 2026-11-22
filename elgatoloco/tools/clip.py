"""Make a short film clip from a first frame with the MiniMax H3 image-to-video model in a local ComfyUI.

usage: python clip.py FIRST_FRAME.png OUT.mp4 SEED "prompt with a timeline"

The frame is 576 x 1024 (portrait); the clip is about five seconds at 24 frames a second, with sound.
"""
import json, os, sys, time, urllib.parse, urllib.request, uuid

HOST = "http://127.0.0.1:8188"


def post_json(path, data):
    req = urllib.request.Request(HOST + path, json.dumps(data).encode(), {"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())


def upload(path, name):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(path, "rb").read() + \
           (f"\r\n--{b}\r\nContent-Disposition: form-data; name=\"overwrite\"\r\n\r\ntrue\r\n--{b}--\r\n").encode()
    req = urllib.request.Request(HOST + "/upload/image", body, {"Content-Type": "multipart/form-data; boundary=" + b})
    return json.loads(urllib.request.urlopen(req).read())["name"]


def main():
    frame, out, seed, prompt = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
    name = upload(frame, "elgato_" + os.path.basename(frame))
    wf = {
        "6": {"class_type": "UNETLoader", "inputs": {"unet_name": "minimax_h3_fl2va_pruned_int8_convrot.safetensors", "weight_dtype": "default"}},
        "13": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors", "type": "minimax", "device": "default"}},
        "11": {"class_type": "VAELoader", "inputs": {"vae_name": "minimax_h3_video_vae_int8_convrot.safetensors"}},
        "24": {"class_type": "VAELoader", "inputs": {"vae_name": "minimax_h3_audio_vae_fp32.safetensors"}},
        "121": {"class_type": "LoraLoaderModelOnly", "inputs": {"model": ["6", 0], "lora_name": "minimax_h3_fl2v_turbo_8step_v1.0_comfyui_bf16.safetensors", "strength_model": 1.0}},
        "114": {"class_type": "LoadImage", "inputs": {"image": name}},
        "104": {"class_type": "MiniMaxH3ImageToVideo", "inputs": {"clip": ["13", 0], "vae": ["11", 0], "first_frame": ["114", 0], "prompt": prompt, "width": 576, "height": 1024, "length": 124}},
        "15": {"class_type": "RandomNoise", "inputs": {"noise_seed": seed}},
        "16": {"class_type": "BasicGuider", "inputs": {"model": ["121", 0], "conditioning": ["104", 0]}},
        "17": {"class_type": "KSamplerSelect", "inputs": {"sampler_name": "res_multistep"}},
        "9": {"class_type": "BasicScheduler", "inputs": {"model": ["121", 0], "scheduler": "simple", "steps": 6, "denoise": 1.0}},
        "14": {"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["15", 0], "guider": ["16", 0], "sampler": ["17", 0], "sigmas": ["9", 0], "latent_image": ["104", 1]}},
        "10": {"class_type": "VAEDecode", "inputs": {"samples": ["14", 0], "vae": ["11", 0]}},
        "23": {"class_type": "VAEDecodeAudio", "inputs": {"samples": ["14", 0], "vae": ["24", 0]}},
        "91": {"class_type": "CreateVideo", "inputs": {"images": ["10", 0], "audio": ["23", 0], "fps": 24.0}},
        "92": {"class_type": "SaveVideo", "inputs": {"video": ["91", 0], "filename_prefix": "elgatoloco/clip", "format": "mp4", "format.codec": "h264"}},
    }
    pid = post_json("/prompt", {"prompt": wf})["prompt_id"]
    t0 = time.time()
    while True:
        hist = json.loads(urllib.request.urlopen(HOST + "/history/" + pid).read())
        if pid in hist:
            entry = hist[pid]
            if entry.get("status", {}).get("status_str") == "error":
                sys.exit("ComfyUI error: " + json.dumps(entry["status"])[:3000])
            files = [f for o in entry["outputs"].values() for v in o.values() if isinstance(v, list) for f in v if isinstance(f, dict) and str(f.get("filename", "")).endswith(".mp4")]
            if files:
                data = urllib.request.urlopen(HOST + "/view?" + urllib.parse.urlencode({k: files[0][k] for k in ("filename", "subfolder", "type")})).read()
                open(out, "wb").write(data)
                print(f"saved {out} ({len(data)//1024} KB) in {time.time()-t0:.0f}s")
                return
            if entry.get("status", {}).get("completed"):
                sys.exit("finished without a video: " + json.dumps(entry["outputs"])[:1500])
        if time.time() - t0 > 2400:
            sys.exit("timeout")
        time.sleep(4)


if __name__ == "__main__":
    main()
