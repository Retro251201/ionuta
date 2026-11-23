# Pipeline asset – teste dalle foto

> Questo documento riguarda i **ritagli fotografici** (pipeline Python della v0.1). La pipeline degli asset 3D
> (`tools/pipeline/`: modelli VRM, capelli, texture del viso, bundle vendor) è descritta in
> `TECHNICAL_ARCHITECTURE.md` §4; fonti e licenze in `ASSET_CREDITS.md`.
> I ritagli esistenti sono protetti da impronte SHA-256 (`npm test`): rigenerarli richiede di aggiornare
> consapevolmente `tools/tests/fixtures/protected-assets.sha256.json`.

Requisito: la testa (con cappello/maschera) deve restare **identica alla foto**. La pipeline fa solo: ritaglio → maschera alpha morbida → padding → PNG.

## Passi
```bash
cd tools/head_pipeline
python3 ../grid_sheet.py           # (opz.) griglia con coordinate sulle foto per tarare le regioni
python3 cutout_heads.py --qa       # legge params.json + ../../source_photos → ../../extension/assets/heads/head_0X.png + qa_heads.jpg / qa_dark.jpg
python3 gen_assets.py              # → extension/src/shared/heads.generated.js (DC.HEADS con colore pelle medio) + icone
```
Dipendenze: Python 3, OpenCV (`opencv-python-headless`), numpy, Pillow.

## params.json (per foto)
- regioni in pixel originali (falda del cappello, maschera, corona) usate come rettangolo/seed di GrabCut;
- `cut_y`: taglio inferiore (sotto il mento/collo);
- `dark_hat_above_y`: sopra questa riga i pixel scuri sono considerati cappello (foreground);
- rimozione del legno/sfondo caldo **limitata per tonalità** (una prima versione cancellava la texture del cappello – corretto).

## Mappatura foto → teste
| File | Testa | Nome |
|---|---|---|
| photo_…726_w.jpg | head_01 | Vendetta Bianco |
| photo_…722_w.jpg | head_02 | Fantasma |
| photo_…723_w.jpg | head_03 | Vendetta Nero |
| photo_…724_w.jpg | head_04 | Vendetta Classico (predefinita) |
| photo_…725_w.jpg | head_05 | Purge Neon |

Colori pelle stimati: 01 #b99a7d · 02 #875f54 · 03 #ad927e · 04 #be9580 · 05 #90745f.

## Migliorare con internet
```bash
pip install rembg[cpu] onnxruntime
rembg i source_photos/photo_X.jpg out.png    # poi ritaglia con le stesse regioni/cut_y
```
Oppure Segment Anything (SAM) con prompt a box sulle regioni di params.json. Mantieni stessi nomi file/dimensioni proporzionate e rilancia `gen_assets.py` (ricalcola `skin` e ancoraggi).

## Aggiungere una nuova testa
1. Metti la foto in `source_photos/`, aggiungi una voce in `params.json`.
2. Rilancia i due script. 3. Ricarica l'estensione: appare in Popup → 👗 Stile.

## Alternativa senza Python (v0.2.0): editor nelle opzioni
Opzioni → 📸 **Le tue teste** permette all'utente di aggiungere teste dal browser: inquadra → scontorna (gomma magica / pennello / ovale sfumato) → ancora al collo + larghezza viso → salva. Stesso contratto dei metadati di `heads.generated.js` (`w, h, anchorX, anchorY, faceW, skin`), ma salvato in `dc_customHeads` come data URL. Anche qui: **nessuna modifica ai pixel colore**.
