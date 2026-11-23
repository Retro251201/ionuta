#!/usr/bin/env python3
"""Pipeline offline per ritagliare le teste dalle foto (nessun modello AI richiesto).

GrabCut (OpenCV) inizializzato con poligoni manuali (params.json) + guided filter
per bordi morbidi + sfumatura sul taglio del collo. Produce PNG RGBA in
extension/assets/heads/ e stampa i metadati (ancora collo, scala) da copiare in
extension/src/shared/skins.js (HEADS).

Uso:  cd tools/head_pipeline && python3 cutout_heads.py [--qa]
Se in futuro e' disponibile internet: sostituire grabcut() con rembg/mediapipe
(vedi docs/ASSET_PIPELINE.md) mantenendo lo stesso formato di output.
"""
import json, os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(HERE, "..", "..", "source_photos")


def guided_filter(I, p, r, eps):
    k = (r, r)
    mI = cv2.boxFilter(I, -1, k); mp = cv2.boxFilter(p, -1, k)
    cIp = cv2.boxFilter(I * p, -1, k) - mI * mp
    vI = cv2.boxFilter(I * I, -1, k) - mI * mI
    a = cIp / (vI + eps); b = mp - a * mI
    return cv2.boxFilter(a, -1, k) * I + cv2.boxFilter(b, -1, k)


def grabcut(img, item, scale=0.5, iters=8):
    small = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    m = np.full(small.shape[:2], cv2.GC_BGD, np.uint8)
    cv2.fillPoly(m, [(np.array(item["outer"]) * scale).astype(np.int32)], cv2.GC_PR_FGD)
    for poly in item["sure_fg"]:
        cv2.fillPoly(m, [(np.array(poly) * scale).astype(np.int32)], cv2.GC_FGD)
    m[int(item["cut_y"] * scale):, :] = cv2.GC_BGD
    bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(small, m, None, bgd, fgd, iters, cv2.GC_INIT_WITH_MASK)
    fg = np.where((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    # componente connessa piu' grande
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    if n > 1:
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fg = np.where(lab == big, 255, 0).astype(np.uint8)
    # riempi i buchi
    inv = cv2.bitwise_not(fg); h, w = inv.shape
    ff = inv.copy(); cv2.floodFill(ff, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 0)
    fg = cv2.bitwise_or(fg, ff)
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, ker)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, ker)
    return cv2.resize(fg, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_LINEAR)


def refine(img, fg, cut_y):
    I = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    p = fg.astype(np.float32) / 255.0
    a = guided_filter(I, p, 9, 1e-3)
    a = np.clip((a - 0.12) / 0.8, 0, 1)
    # sfuma il taglio del collo (coperto dal colletto dell'outfit)
    fade = 40
    ys = np.arange(a.shape[0])[:, None]
    ramp = np.clip((cut_y - ys) / fade, 0, 1)
    a *= ramp
    a[a < 0.02] = 0
    return a


def main():
    params = json.load(open(os.path.join(HERE, "params.json")))
    out_dir = os.path.normpath(os.path.join(HERE, params["out_dir"]))
    os.makedirs(out_dir, exist_ok=True)
    meta = []
    qa = []
    for item in params["heads"]:
        img = cv2.imread(os.path.join(SRC_DIR, item["src"]))
        fg = grabcut(img, item)
        if item.get("dark_hat_above_y"):
            # cappello scuro: rimuove travi di legno (chiare/sature) sopra la tesa
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            yl = item["dark_hat_above_y"]
            hh, ss, vv = hsv[:yl, :, 0], hsv[:yl, :, 1], hsv[:yl, :, 2]
            wood = (hh >= 3) & (hh <= 28) & (ss > 80) & (vv > 80)
            wood = cv2.dilate(wood.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
            before = int((fg[:yl] > 0).sum())
            fg[:yl][wood] = 0
            fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
            n, lab, stats, _ = cv2.connectedComponentsWithStats((fg > 127).astype(np.uint8), 8)
            if n > 1:
                big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
                fg = np.where(lab == big, 255, 0).astype(np.uint8)
            fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
            print(item["id"], "wood px removed:", before - int((fg[:yl] > 0).sum()), file=sys.stderr)
        a = refine(img, fg, item["cut_y"])
        ys, xs = np.where(a > 0.05)
        pad = 6
        x0, x1 = max(0, xs.min() - pad), min(img.shape[1], xs.max() + pad)
        y0, y1 = max(0, ys.min() - pad), min(img.shape[0], ys.max() + pad)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        rgba = np.dstack([rgb, (a * 255).astype(np.uint8)])[y0:y1, x0:x1]
        # ancora del collo: centro della fascia opaca 60px sopra il taglio
        row = int(item["cut_y"] - 60)
        cols = np.where(a[row] > 0.5)[0]
        nx = float(cols.mean()) if len(cols) else (x0 + x1) / 2
        s = min(1.0, params["max_height"] / rgba.shape[0])
        im = Image.fromarray(rgba)
        if s < 1:
            im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        path = os.path.join(out_dir, item["id"] + ".png")
        im.save(path, optimize=True)
        m = {
            "id": item["id"], "name": item["name"], "file": "assets/heads/" + item["id"] + ".png",
            "w": im.width, "h": im.height,
            "anchorX": round((nx - x0) / (x1 - x0), 4),
            "anchorY": round((row - y0) / (y1 - y0), 4),
            "faceW": round(item["face_w"] / (x1 - x0), 4),
        }
        meta.append(m)
        qa.append(im)
        print(json.dumps(m))
    json.dump(meta, open(os.path.join(HERE, "heads_meta.json"), "w"), indent=2)
    if "--qa" in sys.argv:
        H = 420
        tiles = []
        for im in qa:
            r = H / im.height
            t = im.resize((round(im.width * r), H))
            for bg in [(255, 0, 255), (30, 30, 40), (240, 240, 240)]:
                c = Image.new("RGB", t.size, bg); c.paste(t, (0, 0), t); tiles.append(c)
        W = sum(t.width for t in tiles[:3])
        rows = [tiles[i:i + 3] for i in range(0, len(tiles), 3)]
        sheet = Image.new("RGB", (max(sum(t.width for t in r) for r in rows), H * len(rows)), "white")
        for ri, r in enumerate(rows):
            x = 0
            for t in r:
                sheet.paste(t, (x, ri * H)); x += t.width
        sheet = sheet.resize((sheet.width // 2, sheet.height // 2))
        sheet.save(os.path.join(HERE, "qa_heads.jpg"), quality=80)
        print("QA sheet:", sheet.size)


if __name__ == "__main__":
    main()
