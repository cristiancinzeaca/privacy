"""Post-process generated art for the game.

  python post.py cutout IN.png OUT.webp [SIZE]   remove the light backdrop, trim, resize
  python post.py strip  IN.png OUT.webp          make a seamlessly tiling strip (image + mirror)

Needs Pillow, numpy and scipy.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage


def cutout(src, dst, size=512, holes=False):
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    h, w, _ = im.shape
    lum = im @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    sat = im.max(2) - im.min(2)
    # backdrop colour: median of the border pixels
    border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
    bg = np.median(border, axis=0)
    bgl = float(bg @ np.array([0.299, 0.587, 0.114]))
    # candidate backdrop pixels: light and unsaturated (also catches soft floor shadows)
    cand = (lum > 80) & (sat < 55)
    lab, _ = ndimage.label(cand)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    region = np.isin(lab, edge[edge > 0])
    if holes:  # also clear large enclosed backdrop areas (e.g. inside a padlock shackle)
        sizes = np.bincount(lab.ravel())
        big = np.nonzero(sizes > 1500)[0]
        region |= np.isin(lab, big[big > 0])
    region = ndimage.binary_opening(region, iterations=1) | region
    # soft matte: inside the backdrop region alpha falls with lightness (dark fur edge -> opaque)
    a = np.ones((h, w), np.float32)
    soft = np.clip((bgl - lum) / max(bgl - 45.0, 1.0), 0, 1)
    a[region] = soft[region]
    # kill faint leftovers (floor shadow) far from the subject
    solid = ~region
    near = ndimage.binary_dilation(solid, iterations=3)
    a[region & ~near] = 0
    a = ndimage.gaussian_filter(a, 0.6)
    a[solid & ndimage.binary_erosion(solid, iterations=2)] = 1
    # decontaminate edge colours (remove backdrop tint)
    aa = np.clip(a, 0.05, 1)[..., None]
    fg = np.where((a[..., None] < 0.999), (im - (1 - aa) * bg) / aa, im)
    out = np.dstack([np.clip(fg, 0, 255), a * 255]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")
    box = Image.fromarray((a > 0.04).astype(np.uint8) * 255).getbbox()
    img = img.crop(box)
    img.thumbnail((size, size), Image.LANCZOS)
    img.save(dst, "WEBP", quality=90, method=6)
    print(dst, img.size)


def strip(src, dst):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    out = Image.new("RGB", (w * 2, h))
    out.paste(im, (0, 0))
    out.paste(im.transpose(Image.FLIP_LEFT_RIGHT), (w, 0))
    out.save(dst, "WEBP", quality=82, method=6)
    print(dst, out.size)


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "cutout":
        cutout(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 512, "holes" in sys.argv[5:])
    elif cmd == "strip":
        strip(sys.argv[2], sys.argv[3])
    else:
        sys.exit(__doc__)
