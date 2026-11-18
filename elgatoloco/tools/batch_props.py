"""Generate obstacles, stickers and world icons into raw/. Skips files that already exist.

usage: python batch_props.py [name-prefix]
"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "raw")

STYLE = ("3D animated feature film style render, stylized chunky shapes, rich saturated colors, "
         "soft studio lighting, soft global illumination, professional casual game art, no text")
CUT = "single object, centered, whole object visible, isolated on a pure white seamless background, no ground shadow"

OBST = {  # world -> three obstacles the cat meets on the path
    "words": ["a tangled thorny bramble bush with dark green leaves and purple berries",
              "a giant red mushroom with cream spots blocking the way, with a grumpy cute face",
              "a wooden road barrier painted with orange and yellow stripes"],
    "math": ["a small wall of red clay bricks",
             "a tiny cartoon volcano with glowing orange lava on top",
             "a big block of turquoise blue ice with a frozen golden star inside"],
    "logic": ["a big chunky padlock made entirely of shiny gold, with a thick golden shackle loop on top and a keyhole",
              "a closed arched wooden door with iron studs and a glowing purple gem",
              "a large ornate golden key standing upright"],
    "nature": ["a curling deep blue and turquoise ocean wave, toy-like",
               "a cute red crab raising its claws, big eyes",
               "a cute green baby crocodile with a toothy grin, big eyes"],
    "mix": ["a dark purple storm cloud with a small yellow lightning bolt and a grumpy cute face",
            "a swirling magical violet and magenta whirlwind tornado with sparkles",
            "a big chunky padlock made entirely of shiny gold, with a thick golden shackle loop on top, decorated with a red star"],
}
STICK = {
    "words": ("soft leafy green", ["fox", "owl", "squirrel", "fawn deer", "bear cub", "butterfly"]),
    "math": ("warm peach orange", ["eagle", "mountain goat", "wolf pup", "ram with curled horns", "llama", "small friendly dragon"]),
    "logic": ("deep violet", ["bat", "friendly little spider", "gecko lizard", "mouse", "hedgehog", "small round robot"]),
    "nature": ("turquoise sea blue", ["dolphin", "sea turtle", "octopus", "parrot", "tropical clownfish", "flamingo"]),
    "mix": ("midnight blue starry", ["unicorn", "toy rocket ship", "golden royal crown mascot with red and blue gems, the eyes and smile are on the golden band of the crown itself, floating crown only, nobody wearing it", "ringed planet with a happy face", "glowing golden star with a happy face", "golden trophy cup"]),
}
ICON = {
    "words": "a round leafy tree with red mushrooms at its base",
    "math": "a snowy mountain peak with pine trees",
    "logic": "a cluster of glowing purple and blue crystals",
    "nature": "a tiny tropical island with a palm tree in turquoise water",
    "mix": "a fairytale castle on a fluffy cloud at night",
}

jobs = []
seed = 7000
for w, items in OBST.items():
    for i, d in enumerate(items):
        jobs.append((f"ob_{w}_{i}", f"{d}. {CUT}. {STYLE}"))
jobs.append(("ob_gift", f"a big red gift box with a golden ribbon bow and sparkles. {CUT}. {STYLE}"))
jobs.append(("yarn", f"a round ball of bright blue yarn with a loose thread. {CUT}. {STYLE}"))
jobs.append(("paw", "a single fluffy black cat paw seen from the front held up for a high five, big pink toe beans and pink palm pad, "
             f"paw only, cropped at the wrist. {CUT}. {STYLE}"))
for w, (col, items) in STICK.items():
    for i, d in enumerate(items):
        jobs.append((f"st_{w}_{i}", f"Collectible sticker card art of a cute {d}, big expressive eyes, friendly smile, whole subject visible and centered, "
                     f"simple smooth {col} gradient background with a few soft sparkles, square composition, no border, no frame. {STYLE}"))
for w, d in ICON.items():
    jobs.append((f"ic_{w}", f"Mobile game world icon of {d}, centered, miniature diorama, simple smooth soft gradient background, square composition, no border. {STYLE}"))

only = sys.argv[1] if len(sys.argv) > 1 else ""
os.makedirs(RAW, exist_ok=True)
for n, (name, prompt) in enumerate(jobs):
    out = os.path.join(RAW, name + ".png")
    if not name.startswith(only) or os.path.exists(out):
        continue
    subprocess.run([sys.executable, os.path.join(HERE, "gen.py"), out, "768", "768", str(seed + n), prompt], check=True)
print("done", len(jobs))
