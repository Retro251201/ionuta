# Registro degli asset, degli autori e delle licenze

Regola: **nessun asset entra nel repository senza una riga in questo registro** con fonte, autore, licenza e verifica.
Un asset è "integrato" solo se il file è nel pacchetto ed è usato dal codice; i semplici candidati stanno nella sezione 5.
`npm test` controlla che ogni modello distribuito dichiari una licenza ammessa nei propri metadati e che ogni fonte sia
citata qui; `npm run licenses` stampa i metadati letti dai file.

Ultima verifica: **2026-11-10** (lettura dei metadati dei file + pagine ufficiali indicate).

## 1. Librerie distribuite nell'estensione

| Libreria | Versione | Licenza | File distribuito | Fonte |
|---|---|---|---|---|
| three.js | 0.187.0 | MIT (© three.js authors) | `extension/vendor/three.bundle.js` | npm `three` |
| @pixiv/three-vrm | 3.5.5 | MIT (© pixiv Inc.) | `extension/vendor/three.bundle.js` | npm `@pixiv/three-vrm` |

Testi di licenza: `extension/vendor/LICENSES.txt` (rigenerato da `npm run vendor`). Il bundle include anche gli addon
di three.js (GLTFLoader, OrbitControls, BufferGeometryUtils, SkeletonUtils, RoomEnvironment, EffectComposer e pass),
coperti dalla stessa licenza MIT.

Solo sviluppo (non distribuite): esbuild (MIT), playwright-core (Apache-2.0), sharp (Apache-2.0),
@pixiv/three-vrm-animation (MIT, non ancora usata).

## 2. Modelli 3D distribuiti

Tutti derivano dai **modelli di esempio di VRoid Studio (versione beta)** di **pixiv Inc. (VRoid Project)**, pubblicati
con licenza **CC0 1.0** (pubblico dominio: modifica, redistribuzione e uso commerciale consentiti, attribuzione non richiesta).

- Verifica 1 — metadati VRM dentro ogni file: `licenseName: "CC0"`, `commercialUssageName: "Allow"`,
  `allowedUserName: "Everyone"` (output di `npm run licenses`).
- Verifica 2 — pagine ufficiali VRoid FAQ (pixiv): «The CC license for this model is CC0» e «To the extent possible
  under law, pixiv Inc. has waived all copyright and related or neighboring rights to …»
  (<https://vroid.pixiv.help/hc/en-us/articles/4402614652569>, sezione *Sample Models for old beta*). pixiv chiede
  soltanto un «uso di buon senso».
- Copia dei file usata dalla pipeline: <https://github.com/madjin/vrm-samples> (cartella `vroid/beta/`), URL esatti in
  `tools/pipeline/sources.mjs`, impronte SHA-256 dei sorgenti in `tools/pipeline/sources.sha256.json`.

| File nel pacchetto | Sorgente (chiave in `sources.mjs`) | Cosa è stato tenuto | Modifiche della pipeline |
|---|---|---|---|
| `avatar/base.vrm` | HairSample_Female | corpo + viso (scheletro umanoide, 41 morph del viso, espressioni) | rimossi vestiti e capelli; primitive fuse; texture in WebP; intimo dipinto rimosso dalla texture del corpo (riempimento con il colore della pelle) |
| `hair/twintail.vrm` | HairSample_Female | sola acconciatura + ossa e spring bone dei capelli | primitive fuse, texture WebP ≤ 1024 px |
| `hair/pixie.vrm` | Vita | come sopra | come sopra |
| `hair/mushroom.vrm` | Vivi | come sopra | come sopra |
| `hair/bun.vrm` | Victoria_Rubin | come sopra | come sopra |
| `hair/long.vrm` | Sendagaya_Shino | come sopra | come sopra |
| `hair/layered.vrm` | Darkness_Shibu | come sopra | come sopra |
| `hair/short.vrm` | Sakurada_Fumiriya | come sopra | come sopra |
| `hair/boyish.vrm` | Sendagaya_Shibu | come sopra | come sopra |
| `hair/wolf.vrm` | HairSample_Male | come sopra | come sopra |

Texture del viso `extension/assets/face/<set>_{iris,eyeline,eyelash,brow,highlight}.webp` (512 px), estratte dagli
stessi modelli: `classic` ← HairSample_Female · `vita` ← Vita · `vivi` ← Vivi · `victoria` ← Victoria_Rubin ·
`shino` ← Sendagaya_Shino · `shibu` ← Darkness_Shibu.

Indici generati: `assets/avatar/base.json`, `assets/hair/index.json`, `assets/face/index.json`
(script: `tools/pipeline/build-avatar.mjs`).

**Nota d'uso.** Dai modelli donatori si riusano soltanto geometrie e texture (corpo generico, acconciature, texture
degli occhi): il personaggio di Desktop Companion è un personaggio **adulto** originale e non riprende nomi, identità o
schede dei personaggi di esempio di pixiv.

### 2-bis. Corpo base adulto (concessione d'uso libera, non CC0)

Il corpo base predefinito del motore 3D è un **modello di esempio VRoid Studio 1.x** ripubblicato da **hinzka**
nel repository *52blendshapes-for-VRoid-face* (con 52 blendshape facciali "Perfect Sync"). Non è CC0, ma il README
del repository concede **uso personale e commerciale, modifica, redistribuzione e vendita, senza attribuzione**.

- Fonte e termini: <https://github.com/hinzka/52blendshapes-for-VRoid-face> (chiave `VRoid_V110_Female_v1.1.3` in
  `tools/pipeline/provenance.mjs`, usata dall'audit e dai test).
- Nota: i metadati VRM del file ereditano l'impostazione predefinita di VRoid Studio (`licenseName` restrittivo);
  la concessione reale è quella del README, registrata qui e in `provenance.mjs`.

| File nel pacchetto | Sorgente | Cosa è stato tenuto | Modifiche della pipeline |
|---|---|---|---|
| `avatar/female.vrm` | VRoid_V110_Female_v1.1.3 | corpo + viso (54 ossa, 124 morph del viso, 70 espressioni) e fisica spring del seno | rimossi vestiti e capelli; primitive fuse; texture WebP ≤ 2048 px; miniatura rimossa (`tools/pipeline/build-female.mjs`) |
| `hair/vroid_long.vrm` | VRoid_V110_Female_v1.1.3 | sola acconciatura originale (mesh + ossa e spring bone) | primitive fuse, texture WebP ≤ 1024 px |

## 3. Contenuti generati dal progetto (nessun asset esterno)

| Contenuto | Come nasce | Licenza |
|---|---|---|
| Capi d'abbigliamento 3D | generati a runtime dalla Garment Forge a partire dal corpo base (ricette nel catalogo) | parte del progetto |
| Pattern e finiture dei tessuti | disegnati su canvas dal Material System | parte del progetto |
| Personaggio SVG, outfit, capelli e accessori della v0.2 | disegno procedurale in `src/engine/body.js` | parte del progetto |
| Animazioni native (`idle`, `wave`) | clip scritte nel codice del motore (`anim/clips.js`) | parte del progetto |

## 4. Fotografie dell'utente

| File | Origine | Note |
|---|---|---|
| `source_photos/photo_*.jpg` (5) | fotografie fornite dal proprietario del progetto | **originali intoccabili**; dati personali del proprietario: non riutilizzarle altrove |
| `extension/assets/heads/head_01…05.png` | ritagli delle foto (solo scontorno e alpha, `tools/head_pipeline/`) | pixel mai alterati; impronte in `tools/tests/fixtures/protected-assets.sha256.json` |
| `extension/assets/icons/icon*.png` | generate da `tools/head_pipeline/gen_assets.py` | — |
| `docs/screenshots/*.jpg` | screenshot QA (v0.2 e, dal n. 30, motore 3D) | quelli della v0.2 e il fallback SVG contengono i ritagli delle foto |

## 5. Candidati verificati ma NON integrati

Non sono nel pacchetto e non sono usati dal codice: sono qui solo perché la licenza è già stata controllata.

| Risorsa | Autore | Licenza | Fonte | Uso previsto |
|---|---|---|---|---|
| Animazioni umanoidi di Mesh2Motion (un file GLB da ~60 KB per clip, più `rest-pose.glb`) | Scott Petrovic / Mesh2Motion | **CC0** per modelli, rig e animazioni (README: «The art assets (3d models, rigs, animations) are all licensed under CC0»); codice MIT | <https://github.com/Mesh2Motion/mesh2motion-app>, cartella `static/assets/human/animations/` | retargeting di camminata, corsa, seduta, saluto, danza… sul rig VRM (milestone M2: vedi `NEXT_SESSION_HANDOFF.md`) |

## 6. Procedura per aggiungere un asset

1. Verifica la licenza alla fonte ufficiale (non solo su un mirror) e, se il formato lo prevede, nei metadati del file.
2. Aggiungi la fonte a `tools/pipeline/sources.mjs` (URL, licenza, autore) e scaricala con `fetch-assets.mjs`
   (registra lo SHA-256). I sorgenti restano in `.cache/` (ignorata da git): nel pacchetto entra solo il risultato della pipeline.
3. Aggiungi la riga in questo registro **prima** del commit.
4. `npm run licenses` e `npm test` devono passare.
