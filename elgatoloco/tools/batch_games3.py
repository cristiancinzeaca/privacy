"""Art for the kart race and the block game: raw/<name>.png, then a transparent webp in the game's assets.

usage: python batch_games3.py ASSETS_DIR [name-prefix]
"""
import os, subprocess, sys
from post import cutout

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "raw")
OUT = sys.argv[1]
ONLY = sys.argv[2] if len(sys.argv) > 2 else ""
STYLE = ("3D animated feature film style render, stylized chunky shapes, rich saturated colors, "
         "soft studio lighting, soft global illumination, professional casual game art, no text")
CUT = "single object, centered, whole object visible, isolated on a pure white seamless background, no ground shadow"
KART = ("driving a small chunky toy go-kart with four fat black tyres, rear view seen from behind and slightly above, "
        "the kart drives straight away from the camera, back of the driver's head with two pointy cat ears, symmetrical")
BLOCK = "a glossy rounded jelly toy cube with a cute happy face with big eyes on its front, flat front view, symmetrical, perfectly square shape"
jobs = [
    ("k_player", 256, f"a cute black cat with a red collar {KART}, bright red kart. {CUT}. {STYLE}"),
    ("k_rival_0", 256, f"a cute orange tabby cat {KART}, bright blue kart. {CUT}. {STYLE}"),
    ("k_rival_1", 256, f"a cute brown striped tabby cat {KART}, bright green kart. {CUT}. {STYLE}"),
    ("k_rival_2", 256, f"a cute pink cartoon cat {KART}, bright purple kart. {CUT}. {STYLE}"),
    ("k_rival_3", 256, f"a cute golden yellow cat {KART}, bright orange kart. {CUT}. {STYLE}"),
    ("k_cone", 128, f"a chunky orange traffic cone with one white stripe. {CUT}. {STYLE}"),
    ("k_tree", 200, f"a small round leafy green cartoon tree with a short brown trunk. {CUT}. {STYLE}"),
    ("k_tyres", 160, f"a stack of three colorful racing tyres painted red, yellow and blue. {CUT}. {STYLE}"),
    ("k_bush", 160, f"a round green bush with pink and yellow flowers. {CUT}. {STYLE}"),
    ("b_0", 160, f"{BLOCK}, bright cherry red. {CUT}. {STYLE}"),
    ("b_1", 160, f"{BLOCK}, bright royal blue. {CUT}. {STYLE}"),
    ("b_2", 160, f"{BLOCK}, bright emerald green. {CUT}. {STYLE}"),
    ("b_3", 160, f"{BLOCK}, bright orange yellow. {CUT}. {STYLE}"),
    ("b_4", 160, f"{BLOCK}, bright violet purple. {CUT}. {STYLE}"),
]
for n, (name, size, prompt) in enumerate(jobs):
    if not name.startswith(ONLY):
        continue
    raw = os.path.join(RAW, name + ".png")
    if not os.path.exists(raw):
        subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), raw, "768", "768", str(9500 + n), prompt], check=True)
    cutout(raw, os.path.join(OUT, name + ".webp"), size)
print("done")
