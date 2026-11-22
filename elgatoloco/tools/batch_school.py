"""Banner pictures for the chapters of the cat school: RAW/ch_<path><n>.png, then ASSETS/ch_<path><n>.webp (600 x 300).

usage: python batch_school.py RAW_DIR ASSETS_DIR
"""
import os, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW, OUT = sys.argv[1], sys.argv[2]
STYLE = ("3D animated feature film style render, stylized chunky shapes, rich saturated colors, soft warm lighting, "
         "soft global illumination, professional casual game art, wide banner composition, no text, no letters, no numbers, no characters")
JOBS = [
    ("ch_m0", "a sunny playroom corner with a wooden abacus with colorful beads and a few bright toy cubes on a soft rug"),
    ("ch_m1", "an apple orchard on a sunny day with wicker baskets full of shiny red apples under the trees"),
    ("ch_m2", "a calm blue pond with a few yellow rubber ducks swimming away between green lily pads"),
    ("ch_m3", "a cheerful toy steam train with many colorful wagons riding over green hills"),
    ("ch_m4", "a cozy candy shop with shelves of big glass jars full of colorful sweets"),
    ("ch_m5", "a garden with neat equal rows of big sunflowers under a blue sky"),
    ("ch_m6", "a picnic blanket on the grass with a round cake cut into equal slices and small plates around it"),
    ("ch_r0", "a cozy reading corner with a pile of colorful closed books, a soft cushion and a warm lamp"),
    ("ch_r1", "two big colorful jigsaw puzzle pieces sliding together with a soft glow between them"),
    ("ch_r2", "a little wooden treehouse with a lantern and shelves of colorful books among green leaves"),
    ("ch_r3", "a small paper boat sailing on a blue river that flows out of a big open book"),
    ("ch_r4", "a magical open storybook with a tiny castle, trees and golden stars rising out of its pages"),
]
os.makedirs(RAW, exist_ok=True)
for n, (name, what) in enumerate(JOBS):
    raw = os.path.join(RAW, name + ".png")
    if not os.path.exists(raw):
        subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), raw, "1024", "512", str(7300 + n), f"{what}. {STYLE}"], check=True)
    Image.open(raw).convert("RGB").resize((600, 300), Image.LANCZOS).save(os.path.join(OUT, name + ".webp"), "WEBP", quality=78, method=6)
print("done")
