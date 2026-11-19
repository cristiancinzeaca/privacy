"""Prepare the cat sound effects for the game from the raw recordings.

  python sfx_pack.py RAW_DIR OUT_DIR

RAW_DIR holds purr.mp3 (a loopable purr), meows.mp3 (a few meows with pauses), trill.mp3 (happy chirps)
and slap.mp3 (a hand clap). OUT_DIR gets purr.wav (kept as WAV so the loop stays seamless), meow1.mp3,
meow2.mp3 ..., tickle.mp3 and slap.mp3. Needs av (PyAV) and numpy; uses voice_pack.py for loading.
"""
import io, os, sys, wave
import av
import numpy as np
import voice_pack as vp

R = vp.RATE


def norm(x, peak):
    return x * (peak / max(1e-6, float(np.abs(x).max())))


def fade(x, a=0.005, b=0.03):
    x = x.copy(); na, nb = int(R * a), int(R * b)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x


def mp3(x, path):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    buf = io.BytesIO()
    out = av.open(buf, "w", format="mp3")
    st = out.add_stream("mp3", rate=R); st.bit_rate = 96000; st.layout = "mono"
    fr = av.AudioFrame.from_ndarray(pcm.reshape(1, -1), format="s16", layout="mono"); fr.sample_rate = R
    res = av.AudioResampler(format=st.codec_context.format, layout="mono", rate=R)
    for f in res.resample(fr):
        out.mux(st.encode(f))
    out.mux(st.encode(None)); out.close()
    open(path, "wb").write(buf.getvalue())
    print(os.path.basename(path), "%.2fs" % (len(x) / R), len(buf.getvalue()) // 1024, "KB")


def main():
    raw, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    purr = norm(vp.load(os.path.join(raw, "purr.mp3")), 0.5)
    with wave.open(os.path.join(out, "purr.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(R)
        w.writeframes((purr * 32767).astype(np.int16).tobytes())
    print("purr.wav %.2fs" % (len(purr) / R))
    x = vp.load(os.path.join(raw, "meows.mp3"))
    for i, (a, e) in enumerate(vp.segments(x, 0, 0.25, 0.05), 1):
        mp3(fade(norm(x[a:e], 0.6)), os.path.join(out, "meow%d.mp3" % i))
    x = vp.load(os.path.join(raw, "trill.mp3"))
    s = vp.segments(x, 0, 0.25, 0.05)
    mp3(fade(norm(x[s[0][0]:s[-1][1]], 0.6)), os.path.join(out, "tickle.mp3"))
    x = vp.load(os.path.join(raw, "slap.mp3"))
    a, e = vp.segments(x, 0, 0.25, 0.0)[0]
    mp3(fade(norm(x[max(0, a - int(R * 0.004)):e + int(R * 0.25)], 0.85), 0.001, 0.1), os.path.join(out, "slap.mp3"))


if __name__ == "__main__":
    main()
