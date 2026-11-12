"""Elementi UI in stile Z.A.T.O.: cornici, grana, scanlines, logo, menu."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from zato import zato_photo, FULL

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
G = os.path.join(ROOT, "LaPrincipessa", "game")
UI = os.path.join(G, "images", "ui")
GUI = os.path.join(G, "gui")
os.makedirs(UI, exist_ok=True); os.makedirs(GUI, exist_ok=True)
FONT = os.path.join(G, "fonts", "CourierPrime-Bold.ttf")
LINE = (216, 216, 216, 255)


def box(w, h, fill=(0, 0, 0, 255), border=LINE, bw=2, double=False):
    im = Image.new("RGBA", (w, h), fill)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w - 1, h - 1), outline=border, width=bw)
    if double:
        d.rectangle((6, 6, w - 7, h - 7), outline=border, width=bw)
    return im


def panel_only(lay):
    """Tiene l'overlay solo dentro il pannello dello sfondo (come Z.A.T.O.)."""
    m = Image.new("L", FULL, 0)
    ImageDraw.Draw(m).rectangle((228, 138, 1691, 741), fill=255)
    out = Image.new("RGBA", FULL, (0, 0, 0, 0))
    out.paste(lay, (0, 0), Image.composite(lay.getchannel("A"), Image.new("L", FULL, 0), m))
    return out


def main():
    # cornice del pannello sfondo (solo bordo, trasparente dentro)
    fr = Image.new("RGBA", FULL, (0, 0, 0, 0))
    ImageDraw.Draw(fr).rectangle((226, 136, 1693, 743), outline=LINE, width=2)
    fr.save(os.path.join(UI, "panel_frame.png"))
    # box generici (9-slice in Ren'Py)
    box(64, 64).save(os.path.join(GUI, "box.png"))
    box(64, 64, fill=(0, 0, 0, 230)).save(os.path.join(GUI, "box_trasp.png"))
    box(64, 64, fill=(232, 232, 232, 255), border=(232, 232, 232, 255)).save(os.path.join(GUI, "box_hover.png"))
    box(64, 64, fill=(0, 0, 0, 0)).save(os.path.join(GUI, "box_vuoto.png"))
    # textbox: rettangolo aperto in basso
    tb = Image.new("RGBA", (1470, 310), (0, 0, 0, 255))
    d = ImageDraw.Draw(tb)
    d.line((0, 0, 1469, 0), fill=LINE, width=2)
    d.line((0, 0, 0, 309), fill=LINE, width=2); d.line((1468, 0, 1468, 309), fill=LINE, width=2)
    tb.save(os.path.join(GUI, "textbox.png"))
    box(260, 96).save(os.path.join(GUI, "namebox.png"))
    # grana animata (4 frame) + scanlines + vignettatura
    rng = np.random.default_rng(7)
    for i in range(4):
        n = rng.integers(0, 255, (540, 960, 1), dtype=np.uint8).repeat(3, 2)
        a = (rng.random((540, 960)) < 0.5).astype(np.uint8) * 20
        im = Image.fromarray(np.dstack([n, a])).resize(FULL, Image.NEAREST)
        im.save(os.path.join(UI, "grana%d.png" % i))
    sc = np.zeros((1080, 1920, 4), np.uint8); sc[::3, :, 3] = 26
    Image.fromarray(sc).save(os.path.join(UI, "scanlines.png"))
    y, x = np.ogrid[-1:1:1080j, -1:1:1920j]
    v = np.clip((x ** 2 + y ** 2) ** 1.1 * 0.55, 0, 1)
    vg = np.zeros((1080, 1920, 4), np.uint8); vg[..., 3] = (v * 200).astype(np.uint8)
    Image.fromarray(vg).save(os.path.join(UI, "vignetta.png"))
    # pioggia e neve in overlay (2 frame ciascuno)
    for i in range(2):
        lay = Image.new("RGBA", FULL, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        for _ in range(700):
            px, py = rng.integers(-100, 1920), rng.integers(-60, 1080); L = rng.integers(25, 70)
            d.line((px, py, px + L * 0.25, py + L), fill=(200, 215, 255, 110), width=2)
        lay = panel_only(lay)
        lay.save(os.path.join(UI, "pioggia%d.png" % i))
        lay = Image.new("RGBA", FULL, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        for _ in range(380):
            px, py = rng.integers(0, 1920), rng.integers(0, 1080); r = rng.integers(2, 7)
            d.rectangle((px, py, px + r, py + r), fill=(250, 250, 255, int(rng.integers(150, 255))))
        lay.save(os.path.join(UI, "neve_full%d.png" % i))
        lay = panel_only(lay)
        lay.save(os.path.join(UI, "neve%d.png" % i))
    # flash bianco granuloso
    w = np.clip(235 + rng.normal(0, 12, (540, 960, 1)), 0, 255).astype(np.uint8).repeat(3, 2)
    Image.fromarray(w).resize(FULL, Image.NEAREST).save(os.path.join(UI, "flash.png"))

    # LOGO "LA PRINCIPESSA" con aberrazione cromatica (come il logo di Z.A.T.O.)
    f = ImageFont.truetype(FONT, 150)
    f2 = ImageFont.truetype(os.path.join(G, "fonts", "CourierPrime-Regular.ttf"), 40)
    W, H = 1300, 300
    def layer(color, dx, dy):
        im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.text((20 + dx, 10 + dy), "LA PRINCIPESSA", font=f, fill=color)
        return im
    logo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    logo.alpha_composite(layer((230, 40, 80, 200), -6, 0))
    logo.alpha_composite(layer((40, 200, 230, 200), 6, 0))
    logo.alpha_composite(layer((245, 245, 245, 255), 0, 0))
    # tagli orizzontali (glitch) sul logo
    a = np.asarray(logo).copy()
    for yy in rng.integers(20, 170, 6):
        t = int(rng.integers(3, 9)); a[yy:yy + t] = np.roll(a[yy:yy + t], int(rng.integers(-25, 25)), axis=1)
    logo = Image.fromarray(a)
    d = ImageDraw.Draw(logo)
    d.text((28, 200), "// tutto quello che si può aggiustare", font=f2, fill=(235, 235, 235, 255))
    logo.save(os.path.join(UI, "logo.png"))

    # SFONDO MENU: saracinesca di notte + Ionuț e Valya
    base = zato_photo(Image.open(os.path.join(ROOT, "raw", "b_galleria_notte", "00.jpg")), "viola", FULL, seed=9).convert("RGBA")
    spr = os.path.join(G, "images", "sprites")
    io = Image.open(os.path.join(spr, "ionut_sincero.png")).convert("RGBA"); io = io.crop(io.getbbox())
    io = io.resize((int(io.width * 1.2), int(io.height * 1.2)), Image.NEAREST)
    va = Image.open(os.path.join(spr, "valya_nostalgica.png")).convert("RGBA"); va = va.crop(va.getbbox())
    va = va.resize((int(va.width * 1.1), int(va.height * 1.1)), Image.NEAREST)
    base.alpha_composite(va, (1920 - va.width - 40, 1080 - va.height + 60))
    base.alpha_composite(io, (max(1060, 1920 - va.width - io.width + 120), 1080 - io.height + 60))
    vgn = Image.open(os.path.join(UI, "vignetta.png"))
    base.alpha_composite(vgn)
    # banda scura a sinistra per i pulsanti
    band = np.zeros((1080, 1920, 4), np.uint8)
    band[..., 3] = (np.clip(1 - np.linspace(0, 1, 1920) * 1.8, 0, 1) * 215).astype(np.uint8)[None, :]
    base.alpha_composite(Image.fromarray(band))
    base.convert("RGB").save(os.path.join(UI, "menu_bg.jpg"), quality=92)
    # sfondo menu di gioco (salva/carica/opzioni): nero con grana e pannello
    gm = Image.new("RGBA", FULL, (0, 0, 0, 255))
    gm.alpha_composite(Image.open(os.path.join(UI, "grana0.png")))
    gm.convert("RGB").save(os.path.join(UI, "game_menu_bg.jpg"), quality=90)
    # icona finestra
    rad = Image.open(os.path.join(G, "images", "items", "radio.png")).convert("RGBA")
    ic = Image.new("RGBA", (256, 256), (0, 0, 0, 255)); r2 = rad.copy(); r2.thumbnail((236, 236), Image.NEAREST)
    ic.alpha_composite(r2, ((256 - r2.width) // 2, (256 - r2.height) // 2))
    ImageDraw.Draw(ic).rectangle((0, 0, 255, 255), outline=LINE, width=6)
    ic.save(os.path.join(GUI, "window_icon.png"))
    print("ui ok")


if __name__ == "__main__":
    main()
