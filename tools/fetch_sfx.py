"""Scarica effetti sonori (anteprime HQ) da Freesound e li converte in OGG."""
import json, os, re, subprocess, sys
import requests

UA = {"User-Agent": "Mozilla/5.0"}
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW = os.path.join(ROOT, "raw", "sfx")
OUT = os.path.join(ROOT, "LaPrincipessa", "game", "audio", "sfx")
FF = "/projects/sandbox/work/ffmpeg"
os.makedirs(RAW, exist_ok=True); os.makedirs(OUT, exist_ok=True)

# nome -> (query, durata min, durata max, loop?)
Q = {
    "pioggia": ("rain on window loop", 20, 300, True),
    "tuono": ("thunder clap distant", 3, 25, False),
    "folla": ("shopping mall crowd ambience", 20, 300, True),
    "applausi": ("applause audience theater", 4, 30, False),
    "risate": ("audience laughter", 2, 20, False),
    "passi": ("footsteps running corridor", 3, 20, False),
    "passi_neve": ("footsteps snow", 3, 25, False),
    "campanella": ("shop door bell", 1, 6, False),
    "saracinesca": ("roller shutter closing", 2, 15, False),
    "saracinesca_blocco": ("metal shutter stuck clank", 1, 8, False),
    "cassa": ("cash register", 1, 6, False),
    "bollitore": ("kettle boiling", 4, 30, False),
    "vento": ("winter wind howling loop", 15, 300, True),
    "telefono_squillo": ("old telephone ring bell", 2, 15, False),
    "disco_telefono": ("rotary phone dial", 2, 15, False),
    "campane": ("orthodox church bells", 5, 60, False),
    "fuochi": ("fireworks new year", 8, 60, False),
    "sirena": ("ambulance siren passing", 4, 30, False),
    "porta": ("door open close", 1, 6, False),
    "cassetta": ("cassette tape insert play button", 1, 8, False),
    "nastro": ("tape rewind", 2, 12, False),
    "annuncio": ("airport announcement chime ding dong", 1, 6, False),
    "traffico": ("city traffic night ambience", 15, 300, True),
    "orologio": ("clock ticking", 5, 60, True),
    "statica": ("radio static noise", 5, 60, True),
    "radio_sintonia": ("radio tuning shortwave", 3, 20, False),
    "carillon": ("music box", 5, 60, False),
    "notifica": ("phone notification", 0.3, 3, False),
    "vibrazione": ("phone vibrate", 1, 5, False),
    "cacciavite": ("screwdriver small screw", 1, 10, False),
    "neon": ("neon light buzz flicker", 3, 30, True),
    "bus": ("bus doors closing", 2, 15, False),
    "battito": ("heartbeat", 3, 20, True),
    "glitch": ("glitch digital noise", 0.3, 4, False),
    "schiaffo": ("cartoon slap comic", 0.2, 3, False),
    "tazza": ("tea cup spoon", 1, 8, False),
    "scale_mobili": ("escalator", 5, 60, True),
    "cuore_monitor": ("hospital heart monitor beep", 5, 60, True),
}


def search(q):
    h = requests.get("https://freesound.org/search/", params={"q": q}, headers=UA, timeout=30).text
    res = []
    for m in re.finditer(r'data-mp3="([^"]+)-lq\.mp3".*?data-title="([^"]*)"\s*data-duration="([\d.]+)"', h, re.S):
        res.append((m.group(1) + "-hq.mp3", m.group(2), float(m.group(3))))
    return res


def main(names=None):
    meta = {}
    for name, (q, dmin, dmax, loop) in Q.items():
        if names and name not in names:
            continue
        try:
            res = [r for r in search(q) if dmin <= r[2] <= dmax]
        except Exception as e:
            res = []
        if not res:
            print("NESSUN RISULTATO", name); continue
        url, title, dur = res[0]
        raw = os.path.join(RAW, name + ".mp3")
        open(raw, "wb").write(requests.get(url, headers=UA, timeout=60).content)
        dst = os.path.join(OUT, name + ".ogg")
        cut = ["-t", "45"] if dur > 45 else []
        flt = "loudnorm=I=-20:TP=-2,afade=t=in:d=0.05"
        if not loop:
            flt += ",afade=t=out:st=%f:d=0.6" % max(0.1, min(dur, 45) - 0.6)
        subprocess.run([FF, "-y", "-loglevel", "error", "-i", raw, *cut, "-af", flt, "-ac", "2", "-ar", "44100",
                        "-c:a", "libvorbis", "-q:a", "5", dst], check=True)
        meta[name] = {"url": url, "title": title, "dur": dur}
        print(name, "<-", title, dur, flush=True)
    old = json.load(open(os.path.join(RAW, "sources.json"))) if os.path.exists(os.path.join(RAW, "sources.json")) else {}
    old.update(meta)
    json.dump(old, open(os.path.join(RAW, "sources.json"), "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1:] or None)
