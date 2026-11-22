"""Cut drawings out of their white backdrop with the BiRefNet matting model (ONNX, runs on the processor).

usage: python matte.py MODEL.onnx RAW_DIR OUT_DIR [SIZE] [name ...]

Every RAW_DIR/<name>.png becomes OUT_DIR/<name>.webp: transparent, trimmed, at most SIZE pixels a side.
The model file is BiRefNet-general-bb_swin_v1_tiny from the rembg project's releases. Needs onnxruntime, numpy, Pillow.
"""
import os, sys
import numpy as np
import onnxruntime as ort
from PIL import Image

MEAN = np.array([0.485, 0.456, 0.406], np.float32); STD = np.array([0.229, 0.224, 0.225], np.float32)


def matte(sess, im):
    x = np.asarray(im.resize((1024, 1024), Image.LANCZOS), np.float32) / 255
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None]
    y = sess.run(None, {sess.get_inputs()[0].name: x})[-1][0, 0]
    a = 1 / (1 + np.exp(-y))
    a = (a - a.min()) / max(1e-6, a.max() - a.min())
    return Image.fromarray((a * 255).astype(np.uint8)).resize(im.size, Image.LANCZOS)


def main():
    model, raw, out = sys.argv[1:4]
    size = int(sys.argv[4]) if len(sys.argv) > 4 else 160
    only = sys.argv[5:]
    sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
    os.makedirs(out, exist_ok=True)
    for f in sorted(os.listdir(raw)):
        k = f[:-4]
        if not f.endswith(".png") or (only and k not in only):
            continue
        dst = os.path.join(out, k + ".webp")
        if not only and os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(os.path.join(raw, f)):
            continue
        im = Image.open(os.path.join(raw, f)).convert("RGB")
        a = np.asarray(matte(sess, im), np.float32) / 255
        a = np.clip((a - 0.08) / 0.84, 0, 1)
        rgb = np.asarray(im, np.float32)
        bg = np.median(np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]), axis=0)
        aa = np.clip(a, 0.05, 1)[..., None]
        fg = np.where(a[..., None] < 0.999, (rgb - (1 - aa) * bg) / aa, rgb)  # take the backdrop's tint out of soft edges
        pic = Image.fromarray(np.dstack([np.clip(fg, 0, 255), a * 255]).astype(np.uint8), "RGBA")
        box = pic.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
        if not box:
            print("EMPTY", k); continue
        pic = pic.crop(box); pic.thumbnail((size, size), Image.LANCZOS)
        pic.save(dst, "WEBP", quality=90, method=6)
        print(k, pic.size, flush=True)


if __name__ == "__main__":
    main()
