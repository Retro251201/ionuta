from PIL import Image, ImageDraw
files = ["photo_6021694520552001726_w.jpg","photo_6021694520552001722_w.jpg","photo_6021694520552001723_w.jpg","photo_6021694520552001724_w.jpg","photo_6021694520552001725_w.jpg"]
S = 0.4
W, H = int(1080*S), int(1920*S)
sheet = Image.new("RGB", (W*len(files), H), "white")
for i, f in enumerate(files):
    im = Image.open("/data/dc/source_photos/"+f).convert("RGB").resize((W, H))
    d = ImageDraw.Draw(im)
    for y in range(0, 1920, 100):
        c = (255,0,0) if y % 500 == 0 else (0,255,255)
        d.line([(0, y*S), (W, y*S)], fill=c, width=1)
        d.text((2, y*S+1), str(y), fill=(255,255,0))
    for x in range(0, 1080, 100):
        c = (255,0,0) if x % 500 == 0 else (0,255,255)
        d.line([(x*S, 0), (x*S, H)], fill=c, width=1)
        d.text((x*S+2, 2), str(x), fill=(255,255,0))
    d.text((10, H-20), f"#{i+1}", fill=(255,0,255))
    sheet.paste(im, (i*W, 0))
sheet.save("/data/dc/tools/grid_sheet.png")
print(sheet.size)
