"""Record every phrase the game speaks with Piper and pack the clips for the game.

  python voice.py TEXTS.json VOICES_DIR OUT_DIR

TEXTS.json comes from voice_texts.js. For each language OUT_DIR gets <lang>.bin (all MP3 clips, one after
another) and index.json maps  lang -> text -> [offset, length]  into that file.
Needs piper-tts and av (PyAV).
"""
import io, json, os, sys, wave
import av
import numpy as np
from piper import PiperVoice, SynthesisConfig

VOICES = {"ro": "ro_RO-mihai-medium", "es": "es_ES-davefx-medium", "en": "en_US-amy-medium"}


def mp3(pcm, rate):
    buf = io.BytesIO()
    out = av.open(buf, "w", format="mp3")
    st = out.add_stream("mp3", rate=rate)
    st.bit_rate = 48000
    st.layout = "mono"
    frame = av.AudioFrame.from_ndarray(pcm.reshape(1, -1), format="s16", layout="mono")
    frame.sample_rate = rate
    res = av.AudioResampler(format=st.codec_context.format, layout="mono", rate=rate)
    for f in res.resample(frame):
        out.mux(st.encode(f))
    out.mux(st.encode(None))
    out.close()
    return buf.getvalue()


def main():
    texts, voices_dir, out_dir = json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2], sys.argv[3]
    os.makedirs(out_dir, exist_ok=True)
    cfg = SynthesisConfig(length_scale=1.12)  # a little slower, for young listeners
    index = {}
    for lang, name in VOICES.items():
        voice = PiperVoice.load(os.path.join(voices_dir, name + ".onnx"))
        pack, index[lang] = bytearray(), {}
        for t in [x["text"] for x in texts if x["lang"] == lang]:
            wav = io.BytesIO()
            with wave.open(wav, "wb") as w:
                voice.synthesize_wav(t, w, syn_config=cfg)
            wav.seek(0)
            with wave.open(wav, "rb") as r:
                rate, pcm = r.getframerate(), np.frombuffer(r.readframes(r.getnframes()), dtype=np.int16)
            pad = np.zeros(int(rate * 0.08), dtype=np.int16)  # a breath of silence around each clip
            clip = mp3(np.concatenate([pad, pcm, pad]), rate)
            index[lang][t] = [len(pack), len(clip)]
            pack += clip
        open(os.path.join(out_dir, lang + ".bin"), "wb").write(pack)
        print(lang, len(index[lang]), "clips", len(pack) // 1024, "KB")
    json.dump(index, open(os.path.join(out_dir, "index.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    main()
