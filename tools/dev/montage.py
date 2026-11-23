#!/usr/bin/env python3
"""Sviluppo: unisce più immagini in una griglia etichettata. Uso: montage.py out.jpg cols larghezzaCella img1 img2 ..."""
import sys
from PIL import Image, ImageDraw

out, cols, cw = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
files = sys.argv[4:]
ims = []
for f in files:
    im = Image.open(f).convert('RGB')
    im = im.resize((cw, round(im.height * cw / im.width)), Image.LANCZOS)
    ims.append((f, im))
ch = max(i.height for _, i in ims)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * ch), (20, 20, 28))
d = ImageDraw.Draw(sheet)
for k, (f, im) in enumerate(ims):
    x, y = (k % cols) * cw, (k // cols) * ch
    sheet.paste(im, (x, y))
    d.rectangle([x, y, x + 8 * len(f.split('/')[-1]) + 8, y + 14], fill=(0, 0, 0))
    d.text((x + 4, y + 2), f.split('/')[-1], fill=(255, 255, 120))
sheet.save(out, quality=88)
print(out, sheet.size)
