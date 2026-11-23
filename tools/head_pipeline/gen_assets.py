#!/usr/bin/env python3
"""Genera extension/src/shared/heads.generated.js (metadati teste + tono pelle)
e le icone dell'estensione a partire dalle teste ritagliate.
Eseguire DOPO cutout_heads.py."""
import json, os, colorsys
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
EXT = os.path.normpath(os.path.join(HERE, "..", "..", "extension"))
meta = json.load(open(os.path.join(HERE, "heads_meta.json")))


def skin_tone(path):
    a = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32) / 255
    h = a.shape[0]
    band = a[int(h * 0.80):int(h * 0.93)]
    px = band[band[..., 3] > 0.95][:, :3]
    good = []
    for r, g, b in px[:: max(1, len(px) // 4000)]:
        hh, ss, vv = colorsys.rgb_to_hsv(r, g, b)
        if (hh < 0.11 or hh > 0.97) and 0.18 < ss < 0.7 and vv > 0.35:
            good.append((r, g, b))
    if len(good) < 30:
        return "#e2b196"
    m = np.median(np.array(good), axis=0)
    # leggero schiarimento per coerenza con lo stile anime del corpo
    m = np.clip(m * 1.04 + 0.02, 0, 1)
    return "#%02x%02x%02x" % tuple(int(v * 255) for v in m)


for m in meta:
    m["skin"] = skin_tone(os.path.join(EXT, m["file"]))

js = "/* FILE GENERATO da tools/head_pipeline/gen_assets.py - non modificare a mano */\n"
js += "(function(){const DC=globalThis.DC=globalThis.DC||{};DC.HEADS=" + json.dumps(meta, indent=1, ensure_ascii=False) + ";})();\n"
open(os.path.join(EXT, "src", "shared", "heads.generated.js"), "w").write(js)
print(json.dumps([(m["id"], m["skin"]) for m in meta]))

# icone: viso di head_04 dentro un cerchio rosa
src = Image.open(os.path.join(EXT, "assets", "heads", "head_04.png")).convert("RGBA")
W, H = src.size
face = src.crop((int(W * 0.12), int(H * 0.08), int(W * 0.88), int(H * 0.08) + int(W * 0.76)))
os.makedirs(os.path.join(EXT, "assets", "icons"), exist_ok=True)
for size in (16, 32, 48, 128):
    S = size * 4
    base = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(base)
    d.ellipse((0, 0, S - 1, S - 1), fill=(255, 122, 182, 255))
    d.ellipse((S * 0.05, S * 0.05, S * 0.95, S * 0.95), fill=(255, 214, 234, 255))
    f = face.resize((int(S * 0.9), int(S * 0.9)), Image.LANCZOS)
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    layer.paste(f, (int(S * 0.05), int(S * 0.07)), f)
    circ = Image.new("L", (S, S), 0)
    ImageDraw.Draw(circ).ellipse((S * 0.05, S * 0.05, S * 0.95, S * 0.95), fill=255)
    layer.putalpha(Image.fromarray(np.minimum(np.asarray(layer.split()[3]), np.asarray(circ))))
    base.alpha_composite(layer)
    base.resize((size, size), Image.LANCZOS).save(os.path.join(EXT, "assets", "icons", f"icon{size}.png"))
print("icons ok")
