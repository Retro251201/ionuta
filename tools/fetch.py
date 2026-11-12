"""Scarica immagini candidate da Bing Immagini (fallback: Wikimedia Commons).

uso: python fetch.py queries.json   ->  raw/<nome>/NN.jpg + raw/<nome>/sheet.jpg
"""
import io, json, os, re, sys, html, hashlib
from concurrent.futures import ThreadPoolExecutor
import requests
from PIL import Image, ImageDraw

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124 Safari/537.36"}
BLACK = ["alamy", "dreamstime", "shutterstock", "istockphoto", "gettyimages", "vecteezy",
         "depositphotos", "123rf", "ftcdn", "stock.adobe", "bigstock", "agefotostock", "pond5",
         "canstock", "storyblocks", "megapixl", "superstock", "featurepics", "pinimg", "yayimg"]
ROOT = os.path.join(os.path.dirname(__file__), "..", "raw")


def bing(q, n=30, extra=""):
    urls = []
    for first in (1, 36):
        try:
            r = requests.get("https://www.bing.com/images/search",
                             params={"q": q, "form": "HDRSC2", "first": first, "qft": extra},
                             headers=UA, timeout=20)
            urls += [html.unescape(u) for u in re.findall(r'murl&quot;:&quot;(.*?)&quot;', r.text)]
        except Exception:
            pass
        if len(urls) >= n:
            break
    return urls[:n]


def commons(q, n=20):
    try:
        r = requests.get("https://commons.wikimedia.org/w/api.php", headers=UA, timeout=20, params={
            "action": "query", "generator": "search", "gsrsearch": q, "gsrnamespace": 6,
            "gsrlimit": n, "prop": "imageinfo", "iiprop": "url", "iiurlwidth": 1600, "format": "json"})
        pages = r.json().get("query", {}).get("pages", {}).values()
        return [p["imageinfo"][0].get("thumburl") or p["imageinfo"][0]["url"] for p in pages]
    except Exception:
        return []


def grab(url, minside):
    try:
        r = requests.get(url, headers=UA, timeout=20)
        im = Image.open(io.BytesIO(r.content))
        im.load()
        im = im.convert("RGB")
        if min(im.size) < minside:
            return None
        return im
    except Exception:
        return None


def run(name, queries, n=14, minside=450, source="bing", extra=""):
    out = os.path.join(ROOT, name)
    os.makedirs(out, exist_ok=True)
    urls = []
    for q in queries:
        u = bing(q, 30, extra) if source == "bing" else commons(q)
        if not u:  # fallback
            u = commons(q)
        urls += u
    seen, uniq = set(), []
    for u in urls:
        if any(b in u.lower() for b in BLACK):
            continue
        if u not in seen:
            seen.add(u); uniq.append(u)
    with ThreadPoolExecutor(12) as ex:
        ims = list(ex.map(lambda u: grab(u, minside), uniq[:n * 3]))
    got, hashes = [], set()
    for u, im in zip(uniq, ims):
        if im is None:
            continue
        h = hashlib.md5(im.resize((16, 16)).tobytes()).hexdigest()
        if h in hashes:
            continue
        hashes.add(h)
        got.append((u, im))
        if len(got) >= n:
            break
    meta = {}
    for i, (u, im) in enumerate(got):
        fn = "%02d.jpg" % i
        im.save(os.path.join(out, fn), quality=93)
        meta[fn] = u
    json.dump(meta, open(os.path.join(out, "sources.json"), "w"), indent=1)
    # contact sheet numerato
    cols, tw, th = 5, 300, 300
    rows = max(1, (len(got) + cols - 1) // cols)
    sheet = Image.new("RGB", (cols * tw, rows * th), (30, 30, 30))
    d = ImageDraw.Draw(sheet)
    for i, (_, im) in enumerate(got):
        t = im.copy(); t.thumbnail((tw - 6, th - 6))
        x, y = (i % cols) * tw, (i // cols) * th
        sheet.paste(t, (x + 3, y + 3))
        d.rectangle((x + 3, y + 3, x + 40, y + 30), fill=(255, 0, 0))
        d.text((x + 8, y + 8), "%02d" % i, fill=(255, 255, 255))
    sheet.save(os.path.join(out, "sheet.jpg"), quality=85)
    return name, len(got)


if __name__ == "__main__":
    jobs = json.load(open(sys.argv[1]))
    with ThreadPoolExecutor(6) as ex:
        for name, k in ex.map(lambda j: run(j["name"], j["q"], j.get("n", 14), j.get("min", 450),
                                             j.get("src", "bing"), j.get("extra", "")), jobs):
            print(name, k, flush=True)
