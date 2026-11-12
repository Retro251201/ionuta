"""
Pipeline grafica "stile Z.A.T.O." per La Principessa.

Look di riferimento (studiato dagli screenshot Steam di Z.A.T.O.):
  * sfondi fotografici trasformati in gradient-map monocromatici (blu neve,
    ambra, rosso, seppia, verde...), ombre schiacciate a nero pieno,
    grana colorata RGB a "puntini", leggera pixelatura 2x;
  * sprite in cel-shading piatto con linee d'inchiostro nere, contorno nero
    sottile + contorno bianco esterno, pixelatura 2x, colori smorzati;
  * CG a schermo intero con lo stesso trattamento.

Tutte le immagini del gioco passano da qui, cosi' fonti diverse diventano
coerenti tra loro.
"""
import numpy as np
import cv2
from PIL import Image, ImageOps

PANEL = (1464, 604)      # area sfondo dentro la cornice (come Z.A.T.O.)
FULL = (1920, 1080)

PALETTES = {
    # nero -> scuro -> medio -> chiaro -> quasi bianco
    "blu":    ["#000000", "#0a1650", "#2a4fbf", "#8eaaf0", "#f0f4ff"],
    "ambra":  ["#000000", "#3d1600", "#b45e0c", "#efae45", "#fff3cf"],
    "rosso":  ["#000000", "#330400", "#9c2f0b", "#ec9157", "#fff1e3"],
    "seppia": ["#000000", "#261a12", "#735743", "#d5c0a3", "#fbf5ec"],
    "verde":  ["#000000", "#0b2618", "#4a8a63", "#a6d9bb", "#f1fff7"],
    "ciano":  ["#000000", "#031c26", "#0f7383", "#7ad4da", "#effcff"],
    "viola":  ["#000000", "#24061c", "#702553", "#d283ad", "#fff0f8"],
    "grigio": ["#000000", "#1a1a1a", "#666666", "#c6c6c6", "#ffffff"],
    "notte":  ["#000000", "#050a24", "#1b2f78", "#5a74c4", "#dfe6ff"],
}


def _hex(c):
    c = c.lstrip("#")
    return np.array([int(c[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255.0


def gradient_map(L, pal):
    stops = [_hex(c) for c in PALETTES[pal]]
    pos = np.linspace(0, 1, len(stops))
    out = np.zeros(L.shape + (3,), np.float32)
    for ch in range(3):
        out[..., ch] = np.interp(L, pos, [s[ch] for s in stops])
    return out


def cover(img, size):
    return ImageOps.fit(img, size, Image.LANCZOS, centering=(0.5, 0.5))


def zato_photo(img, pal, size=PANEL, pixel=2, crush=0.17, grain=0.33,
               levels=6, gamma=1.0, seed=0, contrast=1.0, centering=(0.5, 0.5)):
    """Foto -> sfondo/CG in stile Z.A.T.O."""
    rng = np.random.default_rng(seed)
    img = ImageOps.fit(img.convert("RGB"), size, Image.LANCZOS, centering=centering)
    w, h = size[0] // pixel, size[1] // pixel
    small = img.resize((w, h), Image.LANCZOS)
    a = np.asarray(small).astype(np.uint8)
    a = cv2.bilateralFilter(a, 7, 45, 7)
    lab = cv2.cvtColor(a, cv2.COLOR_RGB2LAB)
    clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(6, 6))
    Lc = clahe.apply(lab[..., 0]).astype(np.float32) / 255.0
    # normalizzazione robusta: ogni foto occupa tutto il range tonale
    lo, hi = np.percentile(Lc, 2), np.percentile(Lc, 98.5)
    L = np.clip((Lc - lo) / max(hi - lo, 1e-3), 0, 1)
    L = np.clip((L - 0.5) * contrast + 0.5, 0, 1) ** gamma
    # ombre schiacciate a nero pieno (inchiostro)
    L = np.where(L < crush, 0, (L - crush) / (1 - crush))
    rgb = gradient_map(L, pal)
    # grana colorata, piu' forte sui mezzi toni
    amp = grain * (4 * L * (1 - L))[..., None] + 0.03
    rgb = rgb + rng.normal(0, 1, rgb.shape).astype(np.float32) * amp * 0.5
    # posterizzazione per canale: la grana diventa dithering a puntini
    rgb = np.round(np.clip(rgb, 0, 1) * (levels - 1)) / (levels - 1)
    rgb[L <= 0] = _hex(PALETTES[pal][0])
    out = Image.fromarray((rgb * 255).astype(np.uint8))
    return out.resize(size, Image.NEAREST)


# --------------------------------------------------------------------------
# SPRITE
# --------------------------------------------------------------------------

def _kmeans_colors(px, k, seed=0):
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    cv2.setRNGSeed(seed)
    _, lab, cen = cv2.kmeans(px.astype(np.float32), k, None, crit, 4,
                             cv2.KMEANS_PP_CENTERS)
    return lab.ravel(), cen


def zato_sprite(rgba, height=660, k=7, pixel=2, sat=0.72, canny=(70, 160),
                bottom_cut=True, warm=0.0, seed=0, crop=None, ms_sp=6,
                ms_sr=26, dark_ink=28, min_line=12, glow=0, bust=None):
    """Foto scontornata (RGBA) -> sprite cel-shading con contorno bianco."""
    im = rgba.convert("RGBA")
    if crop:
        im = im.crop(crop)
    bb = im.getbbox()
    im = im.crop(bb)
    # spazio per il contorno
    W = int(im.width * height / im.height)
    hs, ws = height // pixel, W // pixel
    pad = 6
    small = im.resize((ws, hs), Image.LANCZOS)
    canvas = Image.new("RGBA", (ws + 2 * pad, hs + 2 * pad), (0, 0, 0, 0))
    canvas.paste(small, (pad, pad), small)
    a = np.asarray(canvas).astype(np.uint8)
    rgb, alpha = a[..., :3].copy(), a[..., 3]
    mask = alpha > 110
    if bust:
        # sagoma a busto: testa ovale + spalle che si allargano (niente lati dritti)
        H2, W2 = mask.shape
        yy, xx = np.mgrid[0:H2, 0:W2]
        ny = (yy - pad) / max(hs, 1)
        nx = (xx - W2 / 2) / max(ws, 1)
        head_w, sh_w = bust
        hw = head_w + (sh_w - head_w) * np.clip((ny - 0.55) / 0.3, 0, 1) ** 1.5
        top = np.where(ny < 0.32, np.sqrt(np.clip(1 - ((0.32 - ny) / 0.34) ** 2, 0, 1)), 1)
        mask &= np.abs(nx) <= hw * top
    # niente contorno sul taglio inferiore (lo sprite poggia sul box testo)
    if bottom_cut:
        last = pad + hs - 1
        mask[last:, :] = False
        col = mask[last - 1, :]
        for y in range(last, a.shape[0]):
            mask[y, :] = False
    sm = rgb
    for _ in range(2):
        sm = cv2.bilateralFilter(sm, 7, 30, 7)
    sm = cv2.pyrMeanShiftFiltering(sm, ms_sp, ms_sr)
    # quantizzazione colori (cel shading piatto) in Lab
    lab = cv2.cvtColor(sm, cv2.COLOR_RGB2LAB)
    pts = lab[mask]
    labels, cen = _kmeans_colors(pts, k, seed)
    q = lab.copy()
    q[mask] = cen[labels].astype(np.uint8)
    lab_full = np.zeros(mask.shape, np.int32) - 1
    lab_full[mask] = labels
    qrgb = cv2.cvtColor(q, cv2.COLOR_LAB2RGB).astype(np.float32) / 255.0
    # colori smorzati, leggermente caldi come le pelli di Z.A.T.O.
    hsv = cv2.cvtColor(qrgb, cv2.COLOR_RGB2HSV)
    hsv[..., 1] *= sat
    # i bianchi (maschere, camicie) restano neutri come nel disegno a mano
    hi = np.clip((hsv[..., 2] - 0.55) / 0.3, 0, 1)
    hsv[..., 1] *= (1 - 0.8 * hi)
    hsv[..., 2] = np.where(hsv[..., 2] > 0.62, np.minimum(1, hsv[..., 2] * 1.12), hsv[..., 2])
    qrgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    if warm:
        qrgb = np.clip(qrgb + np.array([0.06, 0.02, -0.04]) * warm, 0, 1)
    # linee d'inchiostro: soglia adattiva + bordi tra regioni di colore
    g = cv2.cvtColor(sm, cv2.COLOR_RGB2GRAY)
    lines = cv2.Canny(g, canny[0], canny[1]) > 0
    # solo i neri molto scuri diventano macchie d'inchiostro piene
    lines |= (g < dark_ink)
    lines &= cv2.erode(mask.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    # pulizia trattini isolati
    n, cc, stats, _ = cv2.connectedComponentsWithStats(lines.astype(np.uint8), 8)
    keep = np.zeros(n, bool)
    keep[1:] = stats[1:, cv2.CC_STAT_AREA] >= min_line
    lines = keep[cc]
    ink = np.array([0.07, 0.065, 0.075])
    qrgb[lines] = ink
    if glow:  # fili LED luminosi della maschera
        hsv0 = cv2.cvtColor(rgb.astype(np.float32) / 255.0, cv2.COLOR_RGB2HSV)
        led = (hsv0[..., 2] > glow) & mask
        led[: int(mask.shape[0] * 0.30), :] = False   # niente cappello
        led[int(mask.shape[0] * 0.62):, :] = False
        qrgb[led] = np.array([0.80, 0.98, 1.0])
        halo = cv2.GaussianBlur(led.astype(np.float32), (0, 0), 3) * 1.4
        halo = np.clip(halo, 0, 1)[..., None] * mask[..., None]
        qrgb = np.clip(qrgb + halo * np.array([0.15, 0.55, 0.7]), 0, 1)
    # contorni: nero 1px + bianco 2px (a mezza risoluzione)
    m8 = mask.astype(np.uint8)
    k3 = np.ones((3, 3), np.uint8)
    blk = cv2.dilate(m8, k3, iterations=1).astype(bool)
    wht = cv2.dilate(m8, k3, iterations=3).astype(bool)
    if bottom_cut:
        cut = pad + hs - 1
        blk[cut:, :] = False
        wht[cut:, :] = False
    out = np.zeros(mask.shape + (4,), np.float32)
    out[wht] = [0.97, 0.97, 0.95, 1]
    out[blk & ~mask] = [*ink, 1]
    out[mask, :3] = qrgb[mask]
    out[mask, 3] = 1
    img = Image.fromarray((out * 255).astype(np.uint8), "RGBA")
    img = img.resize((img.width * pixel, img.height * pixel), Image.NEAREST)
    bb = img.getbbox()
    img = img.crop((bb[0], bb[1], bb[2], bb[3]))
    return img


# --------------------------------------------------------------------------
# VARIANTI
# --------------------------------------------------------------------------

def _arr(img):
    return np.asarray(img).astype(np.float32) / 255.0


def _img(a):
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), "RGBA")


def _body(a):
    # pixel del corpo: alpha eroso dello spessore dei contorni (bianco+nero)
    m = (a[..., 3] > 0.5).astype(np.uint8)
    pad = np.pad(m, ((8, 0), (8, 8)), constant_values=0)   # bordo inferiore aperto
    er = cv2.erode(pad, np.ones((3, 3), np.uint8), iterations=6)[8:, 8:-8]
    return er.astype(bool)


def variant(sprite, kind, seed=0):
    a = _arr(sprite)
    b = _body(a)
    rgb = a[..., :3]
    if kind == "flip":
        return ImageOps.mirror(sprite)
    if kind == "ombra":       # sera / ombra: blu scuro
        rgb[b] = rgb[b] * np.array([0.42, 0.47, 0.70])
    elif kind == "fredda":    # luce fredda blu/ciano
        L = rgb[b].mean(-1, keepdims=True)
        rgb[b] = 0.45 * rgb[b] + 0.55 * L * np.array([0.72, 0.92, 1.22])
    elif kind == "calda":     # luce calda arancio (scene romantiche)
        rgb[b] = np.clip(rgb[b] * np.array([1.12, 0.96, 0.78]) + np.array([0.05, 0.02, 0]), 0, 1)
    elif kind == "rossa":     # rabbia / tensione
        L = rgb[b].mean(-1, keepdims=True)
        rgb[b] = 0.35 * rgb[b] + 0.65 * L * np.array([1.5, 0.55, 0.45])
    elif kind == "silhouette":  # nera con contorno bianco (come Z.A.T.O.)
        rgb[b] = np.array([0.02, 0.02, 0.025])
    elif kind == "seppia":    # ricordo
        L = rgb[b].mean(-1, keepdims=True)
        rgb[b] = L * np.array([1.1, 0.95, 0.75])
    elif kind == "glitch":    # momenti comici
        rng = np.random.default_rng(seed)
        out = a.copy()
        out[..., 0] = np.roll(a[..., 0], 8, axis=1)
        out[..., 2] = np.roll(a[..., 2], -8, axis=1)
        h = a.shape[0]
        for _ in range(9):
            y = rng.integers(0, h - 30)
            t = rng.integers(6, 30)
            s = rng.integers(-40, 40)
            out[y:y + t] = np.roll(out[y:y + t], s, axis=1)
        out[::4, :, :3] *= 0.75      # scanlines
        return _img(out)
    a[..., :3] = rgb
    return _img(a)


def frame_box(img, border=2, gap=0, color=(225, 225, 225)):
    """Cornice sottile chiara (come pannelli e ritratti di Z.A.T.O.)."""
    w, h = img.size
    out = Image.new("RGBA", (w + 2 * (border + gap), h + 2 * (border + gap)), color + (255,))
    if gap:
        inner = Image.new("RGBA", (w + 2 * gap, h + 2 * gap), (0, 0, 0, 255))
        out.paste(inner, (border, border))
    out.paste(img, (border + gap, border + gap), img if img.mode == "RGBA" else None)
    return out
