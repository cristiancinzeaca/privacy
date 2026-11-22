"""Re-encode a film clip smaller for the game: 432 x 768, H.264 around 700 kbit/s, mono AAC, index at the front.

usage: python shrink.py IN.mp4 OUT.mp4      (needs PyAV)
"""
import sys
import av

src, dst = sys.argv[1], sys.argv[2]
inp = av.open(src); out = av.open(dst, "w", options={"movflags": "+faststart"})
vi = inp.streams.video[0]; ai = inp.streams.audio[0] if inp.streams.audio else None
vo = out.add_stream("libx264", rate=24); vo.width, vo.height, vo.pix_fmt = 432, 768, "yuv420p"
vo.options = {"crf": "22", "preset": "slow", "profile": "main"}
ao = None
if ai:
    ao = out.add_stream("aac", rate=44100); ao.bit_rate = 64000; ao.layout = "mono"
    res = av.AudioResampler(format=ao.codec_context.format or "fltp", layout="mono", rate=44100)
for packet in inp.demux():
    for frame in packet.decode():
        if packet.stream.type == "video":
            f = frame.reformat(width=432, height=768, format="yuv420p"); f.pts = None
            out.mux(vo.encode(f))
        elif ao:
            for f in res.resample(frame):
                out.mux(ao.encode(f))
out.mux(vo.encode(None))
if ao:
    out.mux(ao.encode(None))
out.close(); inp.close()
print("written", dst)
