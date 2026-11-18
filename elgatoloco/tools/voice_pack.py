"""Cut long recordings (many phrases separated by pauses) into one clip per phrase and pack them for the game.

  python voice_pack.py LANG MANIFEST.json OUT_DIR

MANIFEST.json is a list of batches: [{"file": "batch1.mp3", "texts": ["phrase", ...]}, ...]; each recording
must hold its phrases in that order with a pause of about a second between them. OUT_DIR gets <LANG>.mp3 (all
clips, one after another) and index.json is updated with  LANG -> text -> [offset, length].
Needs av (PyAV) and numpy.
"""
import io, json, os, sys
import av
import numpy as np

RATE = 24000


def load(path):
    c = av.open(path)
    res = av.AudioResampler(format="s16", layout="mono", rate=RATE)
    out = [f.to_ndarray().reshape(-1) for fr in c.decode(c.streams.audio[0]) for f in res.resample(fr)]
    return np.concatenate(out).astype(np.float32) / 32768


def segments(x, count=0, min_gap=0.35, pad=0.07):
    """Spans of speech separated by at least min_gap seconds of near silence."""
    win = int(RATE * 0.02)
    n = len(x) // win
    rms = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1))
    loud = rms > max(0.012, rms.max() * 0.04)
    spans, start, quiet = [], None, 0
    for i, v in enumerate(loud):
        if v:
            if start is None:
                start = i
            quiet = 0
        elif start is not None:
            quiet += 1
            if quiet * 0.02 >= min_gap:
                spans.append((start, i - quiet + 1))
                start, quiet = None, 0
    if start is not None:
        spans.append((start, n - quiet))
    # a phrase may hold a short pause of its own: when the count is known, close the shortest gaps first
    while count and len(spans) > count:
        k = min(range(len(spans) - 1), key=lambda i: spans[i + 1][0] - spans[i][1])
        spans[k:k + 2] = [(spans[k][0], spans[k + 1][1])]
    p = int(pad / 0.02)
    return [(max(0, a - p) * win, min(n, b + p) * win) for a, b in spans if (b - a) * 0.02 > 0.05]


def mp3(x):
    pcm = (x * (0.6 / max(1e-6, float(np.abs(x).max()))) * 32767).astype(np.int16)  # headroom: never clips
    fade = int(RATE * 0.01)
    env = np.ones(len(pcm), np.float32); env[:fade] = np.linspace(0, 1, fade); env[-fade:] = np.linspace(1, 0, fade)
    pcm = (pcm * env).astype(np.int16)
    buf = io.BytesIO()
    out = av.open(buf, "w", format="mp3")
    st = out.add_stream("mp3", rate=RATE)
    st.bit_rate = 64000
    st.layout = "mono"
    frame = av.AudioFrame.from_ndarray(pcm.reshape(1, -1), format="s16", layout="mono")
    frame.sample_rate = RATE
    res = av.AudioResampler(format=st.codec_context.format, layout="mono", rate=RATE)
    for f in res.resample(frame):
        out.mux(st.encode(f))
    out.mux(st.encode(None))
    out.close()
    return buf.getvalue()


def main():
    lang, manifest, out_dir = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8")), sys.argv[3]
    base = os.path.dirname(os.path.abspath(sys.argv[2]))
    pack, entries, ok = bytearray(), {}, True
    for b in manifest:
        x = load(os.path.join(base, b["file"]))
        segs = segments(x, len(b["texts"]))
        print(b["file"], "phrases", len(b["texts"]), "found", len(segs), "seconds %.1f" % (len(x) / RATE))
        if len(segs) != len(b["texts"]):
            ok = False
            print("  MISMATCH; spans (s):", " ".join("%.1f-%.1f" % (a / RATE, e / RATE) for a, e in segs))
            continue
        for t, (a, e) in zip(b["texts"], segs):
            clip = mp3(x[a:e])
            entries[t] = [len(pack), len(clip)]
            pack += clip
    if not ok:
        sys.exit("nothing written: fix the mismatched batches first")
    os.makedirs(out_dir, exist_ok=True)
    idx_path = os.path.join(out_dir, "index.json")
    index = json.load(open(idx_path, encoding="utf-8")) if os.path.exists(idx_path) else {}
    index[lang] = entries
    open(os.path.join(out_dir, lang + ".mp3"), "wb").write(pack)
    json.dump(index, open(idx_path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(lang, len(entries), "clips", len(pack) // 1024, "KB")


if __name__ == "__main__":
    main()
