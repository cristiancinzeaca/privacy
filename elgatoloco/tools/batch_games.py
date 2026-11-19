"""Generate the art for the mini-games into raw/. Skips files that already exist."""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "raw")
STYLE = ("3D animated feature film style render, stylized chunky shapes, rich saturated colors, "
         "soft studio lighting, soft global illumination, professional casual game art, no text")
CUT = "single object, centered, whole object visible, isolated on a pure white seamless background, no ground shadow"
ICON = "centered, miniature diorama, simple smooth soft gradient background, square composition, no border"

jobs = [
    ("g_mouse", f"a cute chubby little mouse with warm caramel brown fur, big round pink ears, big sparkling eyes, cheeky smile, "
                f"seen from the front, head and upper body, tiny paws raised. {CUT}. {STYLE}"),
    ("g_hedgehog", f"a cute grumpy little hedgehog with dark chocolate brown spikes and an orange face, frowning, seen from the front, "
                   f"head and upper body. {CUT}. {STYLE}"),
    ("g_drop", f"a big glossy deep blue water droplet with a mischievous cute face, teardrop shape pointing up. {CUT}. {STYLE}"),
    ("g_goldfish", f"a cute shiny golden fish with sparkles, side view, big eye, happy. {CUT}. {STYLE}"),
    ("g_star", f"a chunky glossy golden five pointed star with a happy cute face. {CUT}. {STYLE}"),
    ("g_cloud", f"a dark purple storm cloud with a grumpy cute face. {CUT}. {STYLE}"),
    ("ic_run", f"Mobile game icon of a red running sneaker with small white wings jumping over a wooden hurdle, {ICON}. {STYLE}"),
    ("ic_catch", f"Mobile game icon of blue and orange fish raining down from the sky into a wicker basket, {ICON}. {STYLE}"),
    ("ic_whack", f"Mobile game icon of a cute caramel brown mouse peeking out of a round hole in green grass, {ICON}. {STYLE}"),
    ("ic_memory", f"Mobile game icon of two matching playing cards with a golden star on each, one slightly tilted, {ICON}. {STYLE}"),
    ("ic_fly", f"Mobile game icon of a red toy hot air balloon flying between fluffy clouds with a rainbow, {ICON}. {STYLE}"),
    ("ic_cup", f"Mobile game icon of a shiny golden trophy cup with a star and confetti, {ICON}. {STYLE}"),
]
os.makedirs(RAW, exist_ok=True)
for n, (name, prompt) in enumerate(jobs):
    out = os.path.join(RAW, name + ".png")
    if os.path.exists(out):
        continue
    subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), out, "768", "768", str(9100 + n), prompt], check=True)
print("done", len(jobs))
