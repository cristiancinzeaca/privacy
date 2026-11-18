"""Generate one image with Z-Image Turbo through a local ComfyUI server.

usage: python gen.py OUT.png WIDTH HEIGHT SEED "prompt"
"""
import json, sys, time, urllib.parse, urllib.request

HOST = "http://127.0.0.1:8188"


def post(path, data):
    req = urllib.request.Request(HOST + path, json.dumps(data).encode(), {"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())


def get(path):
    return urllib.request.urlopen(HOST + path).read()


def main():
    out, w, h, seed, prompt = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
    wf = {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": "z_image_turbo_bf16.safetensors", "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "lumina2"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": "ae.safetensors"}},
        "4": {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": ["1", 0], "shift": 3.0}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": prompt}},
        "6": {"class_type": "ConditioningZeroOut", "inputs": {"conditioning": ["5", 0]}},
        "7": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "8": {"class_type": "KSampler", "inputs": {"model": ["4", 0], "positive": ["5", 0], "negative": ["6", 0],
                                                   "latent_image": ["7", 0], "seed": seed, "steps": 8, "cfg": 1.0,
                                                   "sampler_name": "res_multistep", "scheduler": "simple", "denoise": 1.0}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "SaveImage", "inputs": {"images": ["9", 0], "filename_prefix": "elgatoloco/probe"}},
    }
    pid = post("/prompt", {"prompt": wf})["prompt_id"]
    t0 = time.time()
    while True:
        hist = json.loads(get("/history/" + pid))
        if pid in hist:
            entry = hist[pid]
            status = entry.get("status", {})
            if status.get("status_str") == "error":
                sys.exit("ComfyUI error: " + json.dumps(status)[:2000])
            imgs = [i for o in entry["outputs"].values() for i in o.get("images", [])]
            if imgs:
                img = imgs[0]
                data = get("/view?" + urllib.parse.urlencode(img))
                open(out, "wb").write(data)
                print(f"saved {out} ({len(data)//1024} KB) in {time.time()-t0:.0f}s")
                return
        if time.time() - t0 > 900:
            sys.exit("timeout")
        time.sleep(2)


if __name__ == "__main__":
    main()
