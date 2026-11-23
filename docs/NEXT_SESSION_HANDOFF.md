# Handoff per la prossima sessione

Documento per riprendere il lavoro da una chat **completamente nuova**. Prima leggi `CLAUDE.md` (regole e protocollo
di ripresa), poi questo file. Va riscritto a ogni fine sessione e a ogni checkpoint importante.

| Campo | Valore |
|---|---|
| Data e ora | 2026-11-10 22:00 UTC (fine sessione 2) |
| Ramo di lavoro | `hoplite/kroton-65abd2ec--m1-vertical-slice` (creato da `892c907`, testa del ramo predefinito dopo il merge della PR #1) |
| Ramo predefinito | `hoplite/kalymna-e1397fc3` — linea di integrazione, aggiornata solo tramite Pull Request |
| Ultimo commit di sviluppo | `3563c23` (`feat(M1): v0.3.0 …`) — push verificato: hash locale = hash remoto del ramo di lavoro |
| Commit che contiene questo file | il successivo a `3563c23` (solo documenti): `git log -1 --format=%H -- docs/NEXT_SESSION_HANDOFF.md` |
| Stato del push | **verificato** per `3563c23`; per il commit dei documenti controlla con i comandi in fondo |
| Pull Request | #1 (M0) unita automaticamente in `892c907`. La PR di questo ramo (M1) viene aperta subito dopo questo commit: se risulta unita, tutto è già nel ramo predefinito; se è ancora aperta o manca, porta il ramo di lavoro nel tuo con `git merge --ff-only` (`CLAUDE.md` §3) |
| Versione | 0.3.0 |
| Milestone corrente | **M2 — Character engine** (da iniziare). M0 e M1 completate |

## Ultimo lavoro completato

**M1 — 3D vertical slice**: personaggio 3D animato dentro l'estensione (finestra «Anteprima 3D») con fallback SVG.

## File modificati in questa sessione (dopo il checkpoint M0)

- Nuovi nel motore: `extension/src/engine3d/anim/clips.js`, `anim/animation-controller.js`, `custom/hair-system.js`,
  `wardrobe/wardrobe-manager.js`, `render/camera-controller.js`, `core/character-engine.js`, `save/character-store.js`
- Nuova pagina: `extension/src/stage/stage.html`, `stage.js`, `stage.css`
- Modificati nell'estensione: `wardrobe/catalog/items.js` (6 capi con ricetta), `src/background/sw.js` (`openStage`,
  `dc_avatar` in `importData`), `src/shared/data.js` (`KEYS.avatar`, `quality3d`, versione), `src/popup/*`,
  `src/options/options.html|js`, `manifest.json` (versione)
- Strumenti: `tools/qa/run-qa.mjs` (suite `stage`), `tools/qa/no-webgl.init.js`, `tools/qa/publish-shots.mjs`,
  `tools/dev/char-dev.js`, `tools/dev/shot.mjs` (`--ready`, `--initfile`), `tools/tests/anim-clips.test.mjs`,
  `character-store.test.mjs`, `catalog.test.mjs`, `project.test.mjs`
- Documenti: tutti quelli in `docs/` tranne `HANDOFF.md`, `TODO.md`, `ASSET_PIPELINE.md`; `CLAUDE.md`, `README.md`;
  screenshot `docs/screenshots/30…33_*.jpg`

## Nuove funzionalità

- Finestra **Anteprima 3D** (popup → «🧊 Anteprima 3D»; Opzioni → Aspetto): personaggio VRM con materiali toon,
  contorni e ombre; idle con respirazione, spostamento del peso e battito di ciglia; gesto di saluto con sorriso.
- 9 acconciature 3D con fisica dei capelli; scelta salvata in `dc_avatar` e inclusa nel backup.
- Outfit iniziale a 6 capi su slot indipendenti (maschera del corpo, rimbocco, quota dal pavimento).
- Camera con 3 inquadrature, orbita e zoom; preset Low/Medium/High/Ultra salvato in `dc_settings.quality3d`.
- Fallback automatico al renderer SVG (con la testa fotografica) se WebGL o il modello non sono disponibili.

## Test eseguiti e risultati (2026-11-10, dopo l'ultima modifica al codice)

| Test | Risultato |
|---|---|
| `npm test` | 49/49 superati |
| `npm run qa` | 69/69 superati (suite `legacy` 34, suite `stage` 35; estensione reale, Chrome for Testing 157 headless) |
| `npm run licenses` | 10 modelli, tutti CC0 |
| Verifica visiva | pagina 3D (Low/Medium/High), saluto, 9 acconciature, espressioni, fallback SVG: immagini guardate una per una |
| Non eseguibili qui | GPU reale e prestazioni reali, Windows/macOS, pipeline Python delle teste, voce, IA esterna, scorciatoie |

Un controllo era instabile ed è stato reso deterministico: badge del pomodoro (attesa attiva) e battito di ciglia
(generatore casuale fissato nel test; nel prodotto il doppio battito non può più ripetersi a raffica).

## Bug aperti

Vedi `KNOWN_ISSUES.md`. I più rilevanti per M2: **3D-11** (il personaggio 3D non è ancora il companion), **3D-13**
(solo 2 clip), **3D-12** (testa fotografica non disponibile nel 3D), **3D-9** (prestazioni reali non misurate).

## Decisioni architetturali

- Le clip sono **tracce di quaternioni sulle ossa normalizzate VRM in spazio canonico** (`bakeClip`): quelle native
  nascono da funzioni `pose(t)`, quelle da file dovranno arrivare già campionate nello stesso formato.
- I capelli sono VRM donatori agganciati all'osso testa; del donatore si aggiorna solo lo `springBoneManager`.
- I capi condividono lo scheletro del corpo; il Wardrobe Manager è l'unico a toccare maschera del corpo e quota.
- `dc_avatar` (aspetto) è scritta dalle pagine come le impostazioni; `dc_state` (economia, possesso) resta del service worker.
- Nel motore solo `save/character-store.js` usa `chrome.*`; i dati puri non dipendono da three.js e hanno test in node.
- Integrazione: PR verso il ramo predefinito, unite automaticamente; dopo un merge si prosegue su un ramo
  `…--<descrizione>` creato dal ramo predefinito (`CLAUDE.md` §5).
- Versione 0.3.0 al completamento di M1; la prossima (0.4.0) al completamento di M2.

## Trappole già incontrate (non ripeterle)

- La policy del workspace blocca heredoc eseguiti (`python - <<EOF`, `cat > x <<EOF && node x`): crea i file con lo
  strumento di scrittura e poi eseguili. Push solo con refspec esplicito e nome del ramo scritto per esteso.
- `comando | tail` nasconde l'esito del comando: un controllo QA fallito non ferma la catena.
- Pagine dell'estensione: niente `eval` → `page.waitForFunction(() => …)`, mai stringhe.
- WebGL software a 7–15 FPS: avanzare il tempo con `engine.update(dt)` / `engine.step(n)`, non con attese.
- VRM 0.x: nello spazio del modello il fronte è −Z (x e z dei quaternioni canonici cambiano segno).
- `BodyModel` (creato dal Wardrobe Manager) legge la posa di riposo: va costruito **prima** di avviare le animazioni.
- `[hidden]` va forzato in CSS (`display: none !important`) quando l'elemento ha un `display` proprio.

## Prossimo obiettivo

**M2 — Character engine**, a partire dalla libreria di animazioni reali.

## Comandi di verifica

```bash
git status --short --branch
git fetch origin '+refs/heads/*:refs/remotes/origin/*'
git for-each-ref --sort=-committerdate --format='%(committerdate:iso8601) %(objectname:short) %(refname:short)' refs/remotes/origin
git rev-parse HEAD
git ls-remote --heads origin        # l'hash del ramo di lavoro deve coincidere con HEAD
gh pr list --state all --limit 5
npm install && npm test && npm run qa
node tools/dev/shot.mjs 'extension/src/stage/stage.html?q=medium' /tmp/stage.png --size 560x800 --ready "window.__dcStage && window.__dcStage.ready" --wait 5000   # poi GUARDA l'immagine
```

## EXACT NEXT ACTION

**Costruire la libreria di animazioni retargetizzate dalle clip umanoidi CC0 di Mesh2Motion e renderle riproducibili
nell'Animation Controller e nella finestra di anteprima.**

Fonte già verificata (licenza CC0 per modelli, rig e animazioni: `ASSET_CREDITS.md` §5): un file GLB da ~60 KB per clip in
`https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/main/static/assets/human/animations/<nome>.glb`.
Nomi già visti nel repository: `rest-pose` (posa di riposo del rig: serve al retargeting), `idle-a`, `idle-subtle`,
`idle-listening`, `idle-talking`, `greeting`, `head-nod`, `reject`, `clapping`, `confused`, `angry`, `dizzy`,
`dance-simple`, `dance-arm-pump`, `jog`, `jumping-jacks`, `kneel`, `meditate`, `pray`, `pick-up`, `laytoidle`.
L'elenco completo (camminata, seduta e altre dopo la lettera «r») si ottiene con:
`gh api 'repos/Mesh2Motion/mesh2motion-app/git/trees/main?recursive=1' --jq '.tree[] | select(.path | test("^static/assets/human/")) | .path'`

1. **`tools/pipeline/sources.mjs`** — aggiungere `ANIMATIONS` (id → `{url, license: 'CC0-1.0', author: 'Mesh2Motion'}`)
   per 12–16 clip utili al companion (camminata, corsa/`jog`, seduta, saluto, danza, applauso, cenno, sonno, capogiro…);
   **`fetch-assets.mjs`** le scarica in `.cache/anim/` registrando lo SHA-256.
2. **`tools/pipeline/build-animations.mjs`** (nuovo) — legge i GLB con `glb-tools.mjs` (`readGLB`, `accessorArray`),
   mappa le ossa del rig Mesh2Motion sui nomi umanoidi VRM, calcola da `rest-pose.glb` la correzione verso la T-pose
   canonica, ricostruisce per ogni fotogramma le rotazioni mondiali (FK) e le converte in rotazioni locali del rig
   normalizzato; campiona a 30 fps e scrive `extension/assets/anim/<id>.json` **nello stesso formato di `bakeClip`**
   (`{id, name, category, loop, duration, fps, times, rotations{osso}, hips}`) più `extension/assets/anim/manifest.json`.
   Spostamento del bacino scalato sull'altezza del bacino del VRM; movimento in avanti rimosso (clip sul posto).
3. **`extension/src/engine3d/anim/animation-controller.js`** — `registerClip(baked, meta)` e `async loadLibrary(assets)`
   (legge il manifest, carica le clip alla prima richiesta); `_action()` usa direttamente i dati già campionati;
   `list()` unisce clip native e da file.
4. **`extension/src/stage/stage.js`** — pulsanti delle clip per categoria (fondo / gesti / movimento).
5. **Test** — `tools/tests/anim-library.test.mjs`: ogni file del manifest esiste, quaternioni unitari e continui,
   clip cicliche chiuse, ossa valide, ≤ 150 KB per clip. Suite `stage` di `tools/qa/run-qa.mjs`: camminata con piedi
   in controfase, seduta con bacino più basso di almeno 20 cm, ogni clip senza valori non finiti e con ritorno
   all'idle; foglio visivo con `dev.char.clipSheet(id, tempi)` da **guardare** per ogni clip.
6. **`docs/ASSET_CREDITS.md`** — spostare Mesh2Motion dai candidati agli asset integrati (file, fonte, licenza,
   modifiche) **prima** del commit; `npm run licenses`, `npm test`, `npm run qa` verdi; checkpoint con push verificato.

*Risultato atteso*: nella finestra di anteprima almeno 10 animazioni reali in più, con transizioni morbide, senza
compenetrazioni evidenti dei capi iniziali. *Dipendenze*: nessuna nuova libreria (three in node per la matematica è
già installato); nuovi asset solo quelli elencati, CC0.

**Subito dopo, sempre in M2**: pose statiche e sguardo verso un punto (`VRMLookAt`), umore → espressione, scelta del
renderer `svg | 3d` nelle impostazioni e personaggio 3D nella finestra desktop collegato a bisogni e umore.
