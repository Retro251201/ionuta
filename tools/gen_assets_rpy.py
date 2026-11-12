"""Genera game/assets.rpy con TUTTE le definizioni di immagini e audio, dai file reali."""
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
G = os.path.join(ROOT, "LaPrincipessa", "game")


def ls(d, ext):
    p = os.path.join(G, d)
    return sorted(f[: -len(ext)] for f in os.listdir(p) if f.endswith(ext))


out = ["## FILE GENERATO da tools/gen_assets_rpy.py — non modificare a mano.",
       "## Elenco unico di tutti gli asset del gioco.", ""]

out.append("## SFONDI: pannello 1464x604 incorniciato su nero (layout Z.A.T.O.)")
for n in ls("images/bg", ".jpg"):
    out.append('image bg %s = Composite((1920, 1080), (0, 0), Solid("#000"), (228, 138), "images/bg/%s.jpg", (0, 0), "images/ui/panel_frame.png")' % (n, n))
out.append('image bg nero_totale = Solid("#000")')
out.append("")

out.append("## CG a schermo intero")
for n in ls("images/cg", ".jpg"):
    out.append('image cg %s = "images/cg/%s.jpg"' % (n, n))
out.append("")

out.append("## SPRITE (base appoggiata sul bordo del box di testo, y=776)")
for n in ls("images/sprites", ".png"):
    tag, attr = n.split("_", 1)
    out.append('image %s %s = "images/sprites/%s.png"' % (tag, attr, n))
out.append("")

out.append("## RITRATTI nel box di dialogo (solo Ionuț, quando non è in scena)")
side = set(ls("images/side", ".png"))
mapping = {}
for n in ls("images/sprites", ".png"):
    if not n.startswith("ionut_"):
        continue
    attr = n[6:]
    base = attr.replace("_flip", "").replace("_sera", "")
    if "ionut_" + attr in side:
        mapping[attr] = "ionut_" + attr
    elif "ionut_" + base in side:
        mapping[attr] = "ionut_" + base
    elif attr == "ombra":
        mapping[attr] = "ionut_enigmatico"
for attr, f in sorted(mapping.items()):
    out.append('image side ionut %s = "images/side/%s.png"' % (attr, f))
out.append("")

out.append("## OGGETTI (appaiono al centro del pannello)")
for n in ls("images/items", ".png"):
    out.append('image item %s = At("images/items/%s.png", oggetto)' % (n, n))
out.append("")

out.append("## MUSICA")
for n in ls("audio/music", ".ogg"):
    out.append('define audio.m_%s = "audio/music/%s.ogg"' % (n, n))
out.append("")
out.append("## EFFETTI SONORI")
for n in ls("audio/sfx", ".ogg"):
    out.append('define audio.s_%s = "audio/sfx/%s.ogg"' % (n, n))
out.append("")

open(os.path.join(G, "assets.rpy"), "w").write("\n".join(out) + "\n")

# ASSETS.md (riepilogo leggibile)
md = ["# ASSETS — La Principessa", "", "Tutti gli asset passano dalla pipeline `tools/zato.py` (look Z.A.T.O.).", ""]
for title, d, ext in (("Sfondi (bg)", "images/bg", ".jpg"), ("CG", "images/cg", ".jpg"),
                      ("Sprite", "images/sprites", ".png"), ("Ritratti", "images/side", ".png"),
                      ("Oggetti", "images/items", ".png"), ("Musica", "audio/music", ".ogg"),
                      ("Effetti sonori", "audio/sfx", ".ogg")):
    items = ls(d, ext)
    md.append("## %s (%d)" % (title, len(items)))
    md.append(", ".join("`%s`" % i for i in items))
    md.append("")
md += ["## Fonti",
       "- Ionuț: le 5 foto in `foto_amico/` (scontorno BiRefNet-portrait, cel-shading, varianti di luce/colore/glitch/silhouette).",
       "- Valya e personaggi secondari: foto reali da Bing Immagini (vedi `raw/p_*/sources.json`), scontornate e filtrate.",
       "- Sfondi e oggetti: foto da Bing Immagini senza watermark (domini stock esclusi), vedi `raw/b_*/sources.json`, `raw/i_*/sources.json`.",
       "- CG: composte via script (sfondo + sprite + effetti) in `tools/build_bg.py`.",
       "- UI (cornici, grana, scanlines, logo, menu): generate via script in `tools/build_ui.py`.",
       "- Musica: Kevin MacLeod (incompetech.com); \"Podmoskovnye vechera\" di V. Troshin (1956) da archive.org; versione \"radio\" filtrata con ffmpeg.",
       "- Effetti: anteprime HQ da Freesound.org (vedi `raw/sfx/sources.json`), normalizzati e convertiti in OGG.",
       "- Font: Courier Prime (Google Fonts)."]
open(os.path.join(ROOT, "ASSETS.md"), "w").write("\n".join(md) + "\n")
print("assets.rpy ok")
