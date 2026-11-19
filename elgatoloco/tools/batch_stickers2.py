"""Stickers for levels 7-12 of every world: generates raw/st_<world>_<6..11>.png and
writes the game's 256 px webp next to the others. Skips pictures that already exist.

usage: python batch_stickers2.py ASSETS_DIR
"""
import os, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "raw")
OUT = sys.argv[1]
STYLE = ("3D animated feature film style render, stylized chunky shapes, rich saturated colors, "
         "soft studio lighting, soft global illumination, professional casual game art, no text")
STICK = {
    "words": ("soft leafy green", ["fluffy rabbit", "badger", "raccoon", "green tree frog", "red ladybug", "garden snail"]),
    "math": ("warm peach orange", ["penguin chick", "snow leopard cub", "polar bear cub", "happy snowman with a carrot nose", "beaver", "baby bison"]),
    "logic": ("deep violet", ["small green snake", "glowing firefly beetle", "chubby caterpillar", "friendly little ghost",
                              "small creature made of blue crystals", "baby purple dragon"]),
    "nature": ("turquoise sea blue", ["blue whale calf", "red crab", "round pufferfish", "seal pup", "baby shark", "little monkey"]),
    "mix": ("midnight blue starry", ["small friendly blue alien with two big eyes and one antenna, sitting in a tiny silver flying saucer", "crescent moon with a happy sleepy face", "blazing comet with a happy face",
                                     "rainbow with a happy face and two small clouds", "little wizard cat in a starry hat", "golden magic lamp with a happy face"]),
}
os.makedirs(RAW, exist_ok=True)
n = 0
for w, (col, items) in STICK.items():
    for i, d in enumerate(items, 6):
        raw, n = os.path.join(RAW, f"st_{w}_{i}.png"), n + 1
        if not os.path.exists(raw):
            prompt = (f"Collectible sticker card art of a cute {d}, big expressive eyes, friendly smile, whole subject visible and centered, "
                      f"simple smooth {col} gradient background with a few soft sparkles, square composition, no border, no frame. {STYLE}")
            subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), raw, "768", "768", str(9300 + n), prompt], check=True)
        dst = os.path.join(OUT, f"st_{w}_{i}.webp")
        Image.open(raw).convert("RGB").resize((256, 256), Image.LANCZOS).save(dst, "WEBP", quality=90, method=6)
        print(dst, flush=True)
print("done")
