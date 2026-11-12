"""Conta le parole di dialogo/narrazione negli script Ren'Py (solo il testo tra virgolette delle battute)."""
import re, sys, glob

tot = 0
for f in sys.argv[1:] or sorted(glob.glob("LaPrincipessa/game/chapter*.rpy")):
    n = 0
    for line in open(f, encoding="utf-8"):
        s = line.strip()
        if not s or s.startswith(("#", "$", "call ", "play ", "show ", "scene ", "hide ", "with ", "stop ",
                                  "jump ", "label ", "menu", "pause", "window", "return", "define ", "default ", "if ", "elif ", "else", "voice ", "queue ")):
            if not (s.startswith(("menu",)) is False and False):
                if not s.startswith('"') and ':' not in s[:2]:
                    pass
        m = re.match(r'^(?:[a-z_]+\s+(?:[a-z_]+\s+)*)?"(.*)"(?:\s*:)?\s*(?:with .*)?$', s)
        if m and not s.startswith(("call ", "show ", "scene ", "play ", "image ", "define ", "default ", "$")):
            txt = re.sub(r"\{[^}]*\}", "", m.group(1))
            n += len(txt.split())
    print("%s: %d parole" % (f, n))
    tot += n
if len(sys.argv) != 2:
    print("TOTALE: %d parole" % tot)
