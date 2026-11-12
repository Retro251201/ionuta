"""Costruisce tutti gli sprite dei personaggi + ritratti laterali."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image
from rembg import remove, new_session
from zato import zato_sprite, variant, frame_box

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW = os.path.join(ROOT, "raw")
OUT = os.path.join(ROOT, "LaPrincipessa", "game", "images", "sprites")
SIDE = os.path.join(ROOT, "LaPrincipessa", "game", "images", "side")
os.makedirs(OUT, exist_ok=True); os.makedirs(SIDE, exist_ok=True)
os.environ.setdefault("U2NET_HOME", "/projects/sandbox/work/u2net")
_session = None


def cut(src, crop=None, key=None):
    """Scontorno con BiRefNet-portrait (cache in raw/cut)."""
    global _session
    key = key or os.path.basename(src).rsplit(".", 1)[0]
    cache = os.path.join(RAW, "cut", key + ".png")
    if os.path.exists(cache):
        return Image.open(cache)
    if _session is None:
        _session = new_session("birefnet-portrait")
    im = Image.open(src).convert("RGB")
    if crop:
        W, H = im.size
        im = im.crop((int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H)))
    out = remove(im, session=_session)
    out.save(cache)
    return out


# base: chiave -> (file sorgente, crop relativo, parametri filtro)
F = os.path.join(ROOT, "foto_amico")
PAD_BOTTOM = 304
SOFT = dict(k=6, ms_sp=8, ms_sr=32, canny=(90, 190), dark_ink=20, min_line=14)
BASES = {
    "ionut_v1":  (f"{F}/v_cappello_nero_1.jpg", None, dict(height=680)),
    "ionut_v2":  (f"{F}/v_cappello_nero_2.jpg", None, dict(height=680)),
    "ionut_vb":  (f"{F}/v_cappello_bianco.jpg", None, dict(height=680)),
    "ionut_led": (f"{F}/led_x_cappello_nero.jpg", None, dict(height=680, glow=0.55)),
    "ionut_fa":  (f"{F}/fantasma_mezza_maschera.jpg", None, dict(height=660)),
    "valya_a":   (f"{RAW}/p_valya/12.jpg", None, dict(height=560, bust=(0.36, 0.5), **SOFT)),
    "valya_b":   (f"{RAW}/p_valya/00.jpg", None, dict(height=560, bust=(0.36, 0.5), **SOFT)),
    "valya_g":   (f"{RAW}/p_valya_giovane/05.jpg", (0.5, 0, 1, 1), dict(height=620, sat=0.6, **SOFT)),
    "rino":      (f"{RAW}/p_rino/06.jpg", (0.12, 0, 0.88, 1), dict(height=640, bust=(0.30, 0.5), **SOFT)),
    "dado":      (f"{RAW}/p_dado/04.jpg", None, dict(height=670, **SOFT)),
    "giulia":    (f"{RAW}/p_giulia/09.jpg", (0, 0, 1, 1), dict(height=700, **SOFT)),
    "mario":     (f"{RAW}/p_mario/13.jpg", (0, 0, 1, 0.88), dict(height=690, **SOFT)),
    "arkadij":   (f"{RAW}/p_arkadij/06.jpg", (0.22, 0, 0.92, 1), dict(height=680, **SOFT)),
    "max":       (f"{RAW}/p_max/04.jpg", (0, 0, 1, 0.80), dict(height=700, **SOFT)),
}

# nome sprite -> (base, variante)
SPRITES = {
    # IONUT: V nero -> ironico / enigmatico
    "ionut_ironico": ("ionut_v1", None),
    "ionut_ironico_flip": ("ionut_v1", "flip"),
    "ionut_enigmatico": ("ionut_v2", None),
    "ionut_enigmatico_sera": ("ionut_v2", "ombra"),
    "ionut_sarcastico": ("ionut_vb", None),
    "ionut_imbarazzato": ("ionut_vb", "calda"),
    "ionut_imbarazzato_flip": ("ionut_vb", "calda+flip"),
    "ionut_comico": ("ionut_vb", "glitch"),
    "ionut_freddo": ("ionut_v1", "fredda"),
    # LED -> arrabbiato / cupo
    "ionut_arrabbiato": ("ionut_led", None),
    "ionut_furioso": ("ionut_led", "rossa"),
    "ionut_cupo": ("ionut_led", "ombra"),
    "ionut_sclero": ("ionut_led", "glitch"),
    # Fantasma dell'Opera -> sincero / romantico
    "ionut_sincero": ("ionut_fa", None),
    "ionut_innamorato": ("ionut_fa", "calda"),
    "ionut_vulnerabile": ("ionut_fa", "fredda"),
    "ionut_malinconico": ("ionut_fa", "ombra"),
    "ionut_sincero_flip": ("ionut_fa", "flip"),
    "ionut_ombra": ("ionut_v2", "silhouette"),
    # VALYA
    "valya_seria": ("valya_a", None),
    "valya_sorridente": ("valya_b", None),
    "valya_commossa": ("valya_b", "calda"),
    "valya_arrabbiata": ("valya_a", "rossa"),
    "valya_nostalgica": ("valya_a", "seppia"),
    "valya_profilo": ("valya_a", "flip"),
    "valya_triste": ("valya_a", "fredda"),
    "valya_sera": ("valya_b", "ombra"),
    "valya_ombra": ("valya_a", "silhouette"),
    "valya_giovane": ("valya_g", "seppia"),
    # SECONDARI
    "rino_normale": ("rino", None), "rino_arrabbiato": ("rino", "rossa"),
    "rino_sera": ("rino", "ombra"), "rino_buono": ("rino", "calda+flip"),
    "dado_ride": ("dado", None), "dado_comico": ("dado", "glitch"),
    "dado_sera": ("dado", "ombra"), "dado_serio": ("dado", "fredda+flip"),
    "giulia_normale": ("giulia", None), "giulia_sorride": ("giulia", "calda"),
    "giulia_seria": ("giulia", "fredda"), "giulia_sera": ("giulia", "ombra+flip"),
    "mario_normale": ("mario", None), "mario_notte": ("mario", "ombra"),
    "mario_serio": ("mario", "fredda"), "mario_comico": ("mario", "glitch"),
    "arkadij_freddo": ("arkadij", None), "arkadij_arrabbiato": ("arkadij", "rossa"),
    "arkadij_sera": ("arkadij", "ombra"), "arkadij_triste": ("arkadij", "fredda+flip"),
    "max_spaccone": ("max", None), "max_comico": ("max", "glitch"),
    "max_deluso": ("max", "fredda+flip"), "max_sera": ("max", "ombra"),
}

# ritratti laterali (box nel riquadro di dialogo, come Z.A.T.O.)
# nome -> (sprite, box relativo x0,y0,x1 (quadrato))
SIDES = {
    "ionut_ironico": (0.22, 0.10, 0.80), "ionut_enigmatico": (0.22, 0.12, 0.80),
    "ionut_sarcastico": (0.24, 0.13, 0.80), "ionut_imbarazzato": (0.24, 0.13, 0.80),
    "ionut_comico": (0.24, 0.13, 0.80), "ionut_arrabbiato": (0.18, 0.13, 0.80),
    "ionut_furioso": (0.18, 0.13, 0.80), "ionut_cupo": (0.18, 0.13, 0.80),
    "ionut_sincero": (0.12, 0.05, 0.78), "ionut_innamorato": (0.12, 0.05, 0.78),
    "ionut_vulnerabile": (0.12, 0.05, 0.78), "ionut_malinconico": (0.12, 0.05, 0.78),
    "ionut_freddo": (0.22, 0.10, 0.80), "ionut_sclero": (0.18, 0.13, 0.80),
}


def apply(sp, kind):
    if not kind:
        return sp
    for k in kind.split("+"):
        sp = variant(sp, k)
    return sp


def main(only=None):
    bases = {}
    for key, (src, crop, params) in BASES.items():
        if only and not any(key.startswith(o) for o in only):
            continue
        rgba = cut(src, crop, key)
        bases[key] = zato_sprite(rgba, **params)
        print("base", key, bases[key].size, flush=True)
    for name, (b, kind) in SPRITES.items():
        if b not in bases:
            continue
        sp = apply(bases[b], kind)
        # 304 px trasparenti sotto: con yalign 1.0 la base cade su y=776 (bordo del box testo)
        padded = Image.new("RGBA", (sp.width, sp.height + PAD_BOTTOM), (0, 0, 0, 0))
        padded.paste(sp, (0, 0))
        padded.save(os.path.join(OUT, name + ".png"), optimize=True)
        if name in SIDES:
            x0, y0, x1 = SIDES[name]
            W, H = sp.size
            s = int((x1 - x0) * W)
            face = sp.crop((int(x0 * W), int(y0 * H), int(x0 * W) + s, int(y0 * H) + s))
            bgc = Image.new("RGBA", face.size, (0, 0, 0, 255))
            bgc.alpha_composite(face)
            bgc = bgc.resize((236, 236), Image.NEAREST)
            box = frame_box(frame_box(bgc, 2), 4, gap=0, color=(0, 0, 0))
            box = frame_box(box, 2)
            box.save(os.path.join(SIDE, name + ".png"))
    print("ok")


if __name__ == "__main__":
    main(sys.argv[1:] or None)
