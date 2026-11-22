"""Write the list of drawings found in assets/em into game.js (the EMK line).

usage: python em_index.py GAME_JS ASSETS_EM_DIR
"""
import io, os, re, sys
js, d = sys.argv[1:3]
keys = sorted(f[:-5] for f in os.listdir(d) if f.endswith(".webp"))
s = io.open(js, encoding="utf-8").read()
s, n = re.subn(r"const EMK = new Set\('[^']*'\.split\(' '\)\);", "const EMK = new Set('%s'.split(' '));" % " ".join(keys), s)
assert n == 1
io.open(js, "w", encoding="utf-8", newline="\n").write(s)
print(len(keys), "drawings listed")
