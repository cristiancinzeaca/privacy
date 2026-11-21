"""Icons for the block-popping game and the kart race: raw/ic_<name>.png, then the game's webp.

usage: python batch_games2.py ASSETS_DIR
"""
import os, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "raw")
OUT = sys.argv[1]
STYLE = ("3D animated feature film style render, stylized chunky shapes, rich saturated colors, "
         "soft studio lighting, soft global illumination, professional casual game art, no text")
ICON = "centered, miniature diorama, simple smooth soft gradient background, square composition, no border"
jobs = [
    ("ic_blocks", f"Mobile game icon of a small stack of glossy rounded toy cubes in red, blue, green, yellow and purple, one cube bursting into sparkles, {ICON}. {STYLE}"),
    ("ic_kart", f"Mobile game icon of a cute orange tabby kitten wearing a tiny helmet driving a small red go-kart on a race track with a checkered flag, {ICON}. {STYLE}"),
]
size = Image.open(os.path.join(OUT, "ic_run.webp")).size
for n, (name, prompt) in enumerate(jobs):
    raw = os.path.join(RAW, name + ".png")
    if not os.path.exists(raw):
        subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), raw, "768", "768", str(9400 + n), prompt], check=True)
    Image.open(raw).convert("RGB").resize(size, Image.LANCZOS).save(os.path.join(OUT, name + ".webp"), "WEBP", quality=90, method=6)
    print(name, size, flush=True)
print("done")
