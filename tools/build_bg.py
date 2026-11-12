"""Sfondi, CG e oggetti in stile Z.A.T.O."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from zato import zato_photo, zato_sprite, variant, PANEL, FULL

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW = os.path.join(ROOT, "raw")
G = os.path.join(ROOT, "LaPrincipessa", "game", "images")
SPR = os.path.join(G, "sprites")
for d in ("bg", "cg", "items"):
    os.makedirs(os.path.join(G, d), exist_ok=True)
os.environ.setdefault("U2NET_HOME", "/projects/sandbox/work/u2net")

# nome -> (sorgente, palette, crop relativo, extra)
BG = {
    "negozio": ("b_negozio/00", "ambra", None, {}),
    "negozio_sera": ("b_negozio/00", "blu", None, {}),
    "negozio_buio": ("b_negozio/00", "notte", None, dict(gamma=1.4)),
    "laboratorio": ("b_laboratorio/00", "ambra", None, {}),
    "laboratorio_notte": ("b_laboratorio/00", "ciano", None, {}),
    "magazzino": ("b_magazzino/05", "seppia", None, {}),
    "saracinesca": ("b_saracinesca/02", "grigio", None, {}),
    "saracinesca_notte": ("b_saracinesca/02", "blu", None, dict(gamma=1.3)),
    "galleria": ("b_galleria/06", "ambra", None, {}),
    "galleria_notte": ("b_galleria_notte/06", "blu", None, {}),
    "galleria_vuota": ("b_galleria_notte/00", "ciano", None, {}),
    "galleria_natale": ("b_galleria/01", "rosso", None, {}),
    "foodcourt": ("b_foodcourt/06", "rosso", None, {}),
    "foodcourt_sera": ("b_foodcourt/05", "viola", None, {}),
    "scalemobili": ("b_scalemobili/04", "ambra", None, {}),
    "chiosco_max": ("b_chiosco/03", "viola", None, {}),
    "parcheggio_notte": ("b_parcheggio/06", "blu", None, {}),
    "parcheggio_neve": ("b_parcheggio/07", "grigio", None, dict(gamma=0.9)),
    "fermata_pioggia": ("b_fermata/00", "blu", None, {}),
    "strada_notte": ("b_strada/00", "ambra", None, {}),
    "strada_pioggia": ("b_strada/00", "notte", None, {}),
    "fiume_nebbia": ("b_fiume/00", "seppia", None, {}),
    "cameretta": ("b_cameretta/01", "notte", None, {}),
    "cameretta_giorno": ("b_cameretta/01", "seppia", None, {}),
    "cucina_ionut": ("b_cucina/05", "grigio", None, {}),
    "casa_valya": ("b_casa_valya/06", "rosso", None, {}),
    "casa_valya_sera": ("b_casa_valya/06", "notte", None, {}),
    "ingresso_valya": ("b_casa_valya/02", "ambra", None, {}),
    "cucina_valya": ("b_samovar/00", "ambra", None, {}),
    "finestra_neve": ("b_finestra_neve/00", "blu", None, {}),
    "tetto": ("b_tetto/00", "ciano", None, {}),
    "tetto_notte": ("b_tetto/00", "notte", None, {}),
    "radio_shack": ("b_radiotower/07", "verde", None, {}),
    "guardiola": ("b_guardiola/01", "verde", None, {}),
    "stazione": ("b_stazione/00", "ambra", None, {}),
    "cielo_stelle": ("b_cielo/06", "notte", None, dict(crush=0.05)),
    "mercatino": ("b_mercatino/00", "ambra", None, {}),
    "chiesa_ortodossa": ("b_chiesa_ortodossa/01", "blu", None, {}),
    "chiesa_interno": ("b_chiesa_interno/05", "ambra", None, {}),
    "ospedale": ("b_ospedale/01", "verde", None, {}),
    "residenza": ("b_residenza/00", "seppia", None, {}),
    "residenza_notte": ("b_residenza/00", "notte", None, {}),
    "tisaneria": ("b_tisaneria/04", "rosso", None, {}),
    "teatro": ("b_teatro/01", "rosso", None, {}),
    "murmansk": ("b_murmansk/06", "seppia", None, {}),
    "murmansk_porto": ("b_murmansk/00", "grigio", None, {}),
    "urss_strada": ("b_urss_strada/01", "seppia", None, {}),
    "cimitero": ("b_cimitero/02", "grigio", None, {}),
}

# oggetti: nome -> (sorgente, crop)
ITEMS = {
    "radio": ("i_radio/00", None), "orologio": ("i_orologio/07", None),
    "telefono": ("i_telefono/03", None), "carillon": ("i_carillon/00", None),
    "vhs": ("i_vhs/02", None), "cassetta": ("i_cassetta/05", None),
    "samovar": ("i_samovar/01", None), "tiara": ("i_tiara/01", None),
     "smartphone": ("i_smartphone/01", None),
    "foto_antica": ("i_foto_antica/05", None), "te": ("i_te/05", None),
    "cacciavite": ("i_cacciavite/00", None),
}


def src(path, crop=None):
    im = Image.open(os.path.join(RAW, path + ".jpg")).convert("RGB")
    if crop:
        W, H = im.size
        im = im.crop((int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H)))
    return im


def build_bgs():
    for i, (name, (p, pal, crop, extra)) in enumerate(BG.items()):
        out = zato_photo(src(p, crop), pal, PANEL, seed=i, **extra)
        out.save(os.path.join(G, "bg", name + ".jpg"), quality=92)
    Image.new("RGB", PANEL, (0, 0, 0)).save(os.path.join(G, "bg", "nero.jpg"), quality=95)
    # "bianco" accecante per flash/ricordi
    a = np.full((PANEL[1] // 2, PANEL[0] // 2, 3), 238, np.uint8)
    a = np.clip(a + np.random.default_rng(1).normal(0, 9, a.shape), 0, 255).astype(np.uint8)
    Image.fromarray(a).resize(PANEL, Image.NEAREST).save(os.path.join(G, "bg", "bianco.jpg"), quality=92)
    print("bg", len(BG) + 2)


_sess = None


def cutout(path, crop=None):
    global _sess
    from rembg import remove, new_session
    key = path.replace("/", "_")
    cache = os.path.join(RAW, "cut", key + ".png")
    if os.path.exists(cache):
        return Image.open(cache)
    if _sess is None:
        _sess = new_session("isnet-general-use")
    out = remove(src(path, crop), session=_sess)
    out.save(cache)
    return out


def build_items():
    for name, (p, crop) in ITEMS.items():
        rgba = cutout(p, crop)
        sp = zato_sprite(rgba, height=420, bottom_cut=False, k=7, ms_sr=30,
                         canny=(80, 180), dark_ink=22, min_line=10, sat=0.8)
        if max(sp.size) > 620:
            sp.thumbnail((620, 520), Image.NEAREST)
        sp.save(os.path.join(G, "items", name + ".png"))
    print("items", len(ITEMS))


# ---------------------------------------------------------------- CG
def spr(name, h=None):
    im = Image.open(os.path.join(SPR, name + ".png")).convert("RGBA")
    im = im.crop(im.getbbox())   # toglie il margine trasparente
    if h:
        im = im.resize((int(im.width * h / im.height), h), Image.NEAREST)
    return im


def item(name, h):
    im = Image.open(os.path.join(G, "items", name + ".png")).convert("RGBA")
    return im.resize((int(im.width * h / im.height), h), Image.NEAREST)


def full(p, pal, crop=None, **kw):
    return zato_photo(src(p, crop), pal, FULL, **kw).convert("RGBA")


def rain(img, n=900, seed=3, color=(200, 215, 255, 120)):
    rng = np.random.default_rng(seed)
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for _ in range(n):
        x, y = rng.integers(-100, img.width), rng.integers(-60, img.height)
        L = rng.integers(25, 70)
        d.line((x, y, x + L * 0.25, y + L), fill=color, width=2)
    img.alpha_composite(lay)
    return img


def snow(img, n=500, seed=4):
    rng = np.random.default_rng(seed)
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for _ in range(n):
        x, y = rng.integers(0, img.width), rng.integers(0, img.height)
        r = rng.integers(2, 6)
        d.rectangle((x, y, x + r, y + r), fill=(250, 250, 255, int(rng.integers(140, 255))))
    img.alpha_composite(lay)
    return img


def vignette(img, k=0.55):
    w, h = img.size
    y, x = np.ogrid[-1:1:h * 1j, -1:1:w * 1j]
    v = np.clip(1 - k * (x ** 2 + y ** 2) ** 1.2, 0, 1)
    a = np.asarray(img).astype(np.float32)
    a[..., :3] *= v[..., None]
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def scan(img, step=3, k=0.82):
    a = np.asarray(img).astype(np.float32)
    a[::step, :, :3] *= k
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def glow(img, color, center, radius, strength=0.6):
    w, h = img.size
    y, x = np.ogrid[0:h, 0:w]
    d = np.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2) / radius
    g = np.clip(1 - d, 0, 1) ** 2 * strength
    a = np.asarray(img).astype(np.float32)
    a[..., :3] = np.clip(a[..., :3] + g[..., None] * np.array(color, np.float32), 0, 255)
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def font(sz, bold=False):
    f = "CourierPrime-Bold.ttf" if bold else "CourierPrime-Regular.ttf"
    return ImageFont.truetype(os.path.join(ROOT, "LaPrincipessa", "game", "fonts", f), sz)


def paste(base, im, x, y):
    base.alpha_composite(im, (int(x), int(y)))


def save_cg(img, name):
    img.convert("RGB").save(os.path.join(G, "cg", name + ".jpg"), quality=92)


def build_cgs():
    # 1. il video della Principessa (prologo)
    c = full("b_teatro/01", "rosso")
    s = spr("ionut_imbarazzato", 1000); paste(c, s, 960 - s.width // 2, 1080 - s.height + 40)
    t = item("tiara", 190); t = t.rotate(-8, Image.NEAREST, expand=True); paste(c, t, 960 - t.width // 2 + 10, 80)
    d = ImageDraw.Draw(c)
    d.rectangle((40, 40, 1880, 1040), outline=(240, 240, 240), width=3)
    d.ellipse((80, 80, 120, 120), fill=(230, 30, 30)); d.text((140, 74), "REC  00:00:47", font=font(44, True), fill="white")
    d.text((1380, 74), "♥ 12.483", font=font(44, True), fill="white")
    d.text((80, 960), "#laprincipessa  #recitascolastica  #biancaneve", font=font(38), fill="white")
    save_cg(scan(vignette(c)), "video_principessa")

    # 2. primo incontro: Valya al bancone con la radio
    c = full("b_negozio/00", "ambra")
    s = spr("valya_seria", 1050); paste(c, s, 260, 1080 - s.height + 60)
    r = item("radio", 420); paste(c, r, 1180, 1080 - r.height - 40)
    save_cg(vignette(c, 0.45), "primo_incontro")

    # 3. la radio che si accende
    c = full("i_radio/00", "ciano", None, crush=0.12)
    c = glow(c, (40, 200, 220), (1150, 380), 700, 0.9)
    save_cg(scan(vignette(c)), "radio_accesa")

    # 4. tè insieme
    c = full("b_samovar/00", "ambra")
    c = glow(c, (255, 150, 60), (900, 400), 900, 0.5)
    tg = item("te", 520); paste(c, tg, 1250, 1080 - tg.height - 60)
    save_cg(vignette(c), "te_insieme")

    # 5. pioggia alla fermata
    c = full("b_fermata/00", "blu")
    a = spr("ionut_ombra", 560); b = spr("valya_ombra", 470)
    paste(c, a, 700, 1080 - a.height - 120); paste(c, b, 1040, 1080 - b.height - 120)
    c = rain(c, 1400)
    save_cg(vignette(c), "pioggia_ombrello")

    # 6. il ballo nella galleria vuota
    c = full("b_galleria_notte/00", "ciano")
    a = spr("ionut_innamorato", 900); b = ImageOps.mirror(spr("valya_commossa", 760))
    paste(c, a, 330, 1080 - a.height + 30); paste(c, b, 1000, 1080 - b.height + 30)
    c = glow(c, (255, 170, 90), (960, 300), 800, 0.45)
    save_cg(vignette(c), "ballo")

    # 7. parcheggio nella neve
    c = full("b_parcheggio/07", "notte")
    b = spr("valya_ombra", 300); paste(c, b, 900, 640)
    c = snow(c, 900)
    save_cg(vignette(c, 0.7), "parcheggio_neve")

    # 8. ospedale
    c = full("b_ospedale/01", "verde")
    b = spr("valya_triste", 1000); paste(c, b, 960 - b.width // 2, 1080 - b.height + 80)
    save_cg(scan(vignette(c, 0.7)), "ospedale")

    # 9. tetto: l'antenna
    c = full("b_tetto/00", "notte")
    d = ImageDraw.Draw(c)
    for w, col in ((11, (245, 245, 240)), (5, (10, 10, 12))):   # antenna Yagi disegnata
        d.line((1380, 1080, 1380, 140), fill=col, width=w)
        for i, y in enumerate(range(200, 520, 64)):
            L = 230 - i * 22
            d.line((1380 - L, y, 1380 + L, y), fill=col, width=w)
        d.line((1380, 420, 1180, 1080), fill=col, width=max(3, w - 4))
    a = spr("ionut_ombra", 520); m = variant(spr("mario_normale", 520), "silhouette")
    paste(c, a, 420, 1080 - a.height); paste(c, m, 760, 1080 - m.height)
    c = snow(c, 500)
    save_cg(vignette(c), "tetto_antenna")

    # 10. finale: Valya ascolta la radio
    c = full("b_residenza/00", "notte")
    c = glow(c, (255, 170, 80), (1250, 760), 650, 0.7)
    b = spr("valya_commossa", 980); paste(c, b, 330, 1080 - b.height + 60)
    r = item("radio", 380); paste(c, r, 1150, 1080 - r.height - 40)
    c = snow(c, 250)
    save_cg(vignette(c), "finale_radio")

    # 11. la foto di Valya e Lev
    c = full("i_foto_antica/05", "seppia")
    save_cg(vignette(c, 0.6), "foto_lev")

    # 12. la lettera
    c = full("i_lettera/00", "seppia")
    save_cg(vignette(c, 0.6), "lettera")

    # 13. VHS del matrimonio (schermo CRT)
    c = Image.new("RGBA", FULL, (0, 0, 0, 255))
    tv = zato_photo(src("i_foto_antica/02"), "ambra", (1500, 900), centering=(0.5, 0.2)).convert("RGBA")
    tv = scan(tv, 3, 0.6)
    paste(c, tv, 210, 90)
    d = ImageDraw.Draw(c)
    d.rectangle((206, 86, 1714, 994), outline=(225, 225, 225), width=3)
    d.text((260, 120), "PLAY ▶", font=font(56, True), fill=(230, 255, 230))
    d.text((1300, 900), "12.06.1994", font=font(52, True), fill=(255, 220, 120))
    save_cg(c, "vhs_matrimonio")

    # 14. il grande cast del finale (tetto)
    c = full("b_tetto/00", "ciano")
    xs = [120, 420, 720, 1020, 1320]
    for n, x in zip(["dado_ride", "giulia_sorride", "ionut_sincero", "mario_normale", "rino_buono"], xs):
        s = spr(n, 640); paste(c, s, x + 240 - s.width // 2, 1080 - s.height)
    c = snow(c, 400)
    save_cg(vignette(c, 0.4), "tutti_sul_tetto")

    # 15. Murmansk 1968: Valya giovane
    c = full("b_murmansk/06", "seppia")
    s = spr("valya_giovane", 980); paste(c, s, 1300 - s.width // 2, 1080 - s.height + 40)
    c = snow(c, 600)
    save_cg(scan(vignette(c)), "murmansk_valya")
    print("cg ok")


if __name__ == "__main__":
    what = sys.argv[1:] or ["bg", "items", "cg"]
    if "bg" in what: build_bgs()
    if "items" in what: build_items()
    if "cg" in what: build_cgs()
