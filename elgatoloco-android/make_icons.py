"""Launcher icons from the cat's head: python make_icons.py (needs Pillow)."""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
RES = os.path.join(HERE, "app", "src", "main", "res")
head = Image.open(os.path.join(HERE, "..", "elgatoloco", "assets", "cat_head.webp")).convert("RGBA")
head = head.crop(head.getbbox())
BG = (122, 92, 250, 255)


def fitted(size, share):
    """The head centred on a transparent square, filling `share` of it."""
    k = size * share / max(head.size)
    h = head.resize((round(head.width * k), round(head.height * k)), Image.LANCZOS)
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    im.alpha_composite(h, ((size - h.width) // 2, (size - h.height) // 2))
    return im


for name, dp in (("mdpi", 1), ("hdpi", 1.5), ("xhdpi", 2), ("xxhdpi", 3), ("xxxhdpi", 4)):
    d = os.path.join(RES, "mipmap-" + name)
    os.makedirs(d, exist_ok=True)
    fitted(round(108 * dp), 0.52).save(os.path.join(d, "ic_launcher_fg.png"))  # adaptive: safe zone is the middle 61%
    s = round(48 * dp)
    old = Image.new("RGBA", (s * 4, s * 4), (0, 0, 0, 0))
    ImageDraw.Draw(old).ellipse((0, 0, s * 4 - 1, s * 4 - 1), fill=BG)
    old.alpha_composite(fitted(s * 4, 0.74))
    old.resize((s, s), Image.LANCZOS).save(os.path.join(d, "ic_launcher.png"))

store = Image.new("RGBA", (512, 512), BG)
store.alpha_composite(fitted(512, 0.7))
store.save(os.path.join(HERE, "store_icon_512.png"))
print("icons ok")
