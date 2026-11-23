# Stato del progetto

Stato **reale e verificato** (se questo file e il codice non coincidono, vale il codice: correggi il file).

- **Aggiornato**: 2026-11-10 22:00 UTC — fine sessione 2
- **Versione dell'estensione**: **0.3.0** (`manifest.json` = `DC.VERSION` = `package.json`)
- **Milestone corrente**: **M2 — Character engine** (da iniziare). M0 e M1 completate in questa sessione.
- **Ramo predefinito del repository**: `hoplite/kalymna-e1397fc3` (linea di integrazione, aggiornata tramite Pull Request)

## 1. Milestone

| # | Milestone | Stato | Nota |
|---|---|---|---|
| M0 | Recovery e infrastruttura permanente | ✅ completata | documenti permanenti, test, QA; PR #1 unita |
| M1 | 3D vertical slice | ✅ completata (v0.3.0) | personaggio 3D animato in una pagina dell'estensione, fallback SVG, 69 controlli QA |
| M2 | Character engine | ⚪ da iniziare | pronti: avatar loader, controller delle animazioni, persistenza di `dc_avatar`; mancano clip retargetizzate, pose, sguardo, renderer 3D nella finestra desktop |
| M3 | Character creator | ⚪ non iniziata | pronti: Hair System (9 acconciature commutabili), 6 set di texture del viso (non ancora applicabili) |
| M4 | Wardrobe system | 🟡 anticipata in parte | Wardrobe Manager a slot e Garment Forge funzionanti; catalogo di soli 6 capi iniziali, nessuna interfaccia armadio, nessun acquisto |
| M5 | Animazioni e fisica | ⚪ non iniziata | spring bone dei capelli già attivi |
| M6 | Photo studio e stanze | ⚪ non iniziata | esiste solo `RenderingEngine.capture()` |
| M7 | Integrazione e polish | ⚪ non iniziata | |

> La sessione 1 usava un'altra numerazione nei messaggi di commit («M1» = toolchain e motore, «M2 (parziale)»
> = Garment Forge). La numerazione valida è quella di `DEVELOPMENT_ROADMAP.md`.

## 2. Cosa vede oggi l'utente

- Tutto ciò che c'era nella v0.2 (companion SVG con testa fotografica nelle pagine web e nella finestra desktop,
  bisogni, economia, negozio, obiettivi, pomodoro, promemoria, chat, accesso, backup).
- **Novità 0.3.0 — Anteprima 3D** (popup → «🧊 Anteprima 3D», oppure Opzioni → Aspetto): finestra con il personaggio
  3D animato (idle con respirazione, spostamento del peso e battito di ciglia; gesto di saluto con sorriso), 9
  acconciature con fisica dei capelli, inquadrature e camera orbitale, preset di qualità Low/Medium/High/Ultra con
  statistiche reali. Acconciatura e qualità restano salvate e rientrano nel backup. Senza WebGL la finestra mostra
  il personaggio SVG classico.
- Il personaggio 3D **non è ancora il companion**: non cammina nelle pagine, non reagisce a bisogni e umore, non usa la
  testa fotografica. Il renderer predefinito resta l'SVG.

## 3. Funzioni originali (v0.2) — tutte funzionanti

Verificate il 2026-11-10 con `npm run qa` (suite `legacy`, 34 controlli) sull'estensione reale in Chrome headless.

| Funzione | Stato | Verifica |
|---|---|---|
| Estensione Chrome MV3 (service worker, popup, opzioni, content script) | ✅ | QA: avvio, pagine, console pulita |
| Companion SVG nelle pagine web e nella finestra desktop | ✅ | QA + screenshot |
| Teste fotografiche originali (5) e foto personalizzate | ✅ | QA; impronte SHA-256 identiche al commit di import |
| Editor fotografico (ritaglio, gomma magica, ancora, salvataggio) | ✅ | QA: flusso completo, validazione, limiti |
| Capelli, colori, accessori, 17 outfit SVG | ✅ | QA + test unitari |
| Bisogni, economia e monete, livelli, 17 obiettivi, negozio, minigioco | ✅ | QA + test unitari |
| Pomodoro (allarme, badge) e promemoria acqua/postura | ✅ | QA |
| Chat offline (regole + calcolatrice senza `eval`) | ✅ | QA + test unitari |
| Autenticazione locale (PBKDF2, blocco tentativi) | ✅ | QA |
| Backup, azzeramento e ripristino | ✅ | QA: esporta → reset → importa |
| Scorciatoie e menu contestuali | ⚠️ non coperte dai test automatici | registrate nel manifest; verifica manuale da fare |
| Sintesi vocale, IA esterna facoltativa | ⚠️ non verificabili in headless | codice invariato |

## 4. Moduli del motore 3D (`extension/src/engine3d/`)

| Modulo | File | Stato | Nota |
|---|---|---|---|
| Rendering Engine | `render/rendering-engine.js` | ✅ | preset qualità, limite FPS, sospensione, ombre, cattura |
| Camera Controller | `render/camera-controller.js` | ✅ | 3 inquadrature con transizione, orbita, zoom |
| Asset Manager | `assets/asset-manager.js` | ✅ | caricamento locale, cache, rilascio GPU |
| Avatar Loader | `avatar/avatar-loader.js` | ✅ | VRM base: 54 ossa umanoidi, 41 morph del viso, 15 espressioni |
| Animation Controller | `anim/animation-controller.js`, `anim/clips.js` | 🟡 base | 2 clip native (`idle`, `wave`), stato di fondo + gesti con dissolvenza, battito di ciglia, espressioni. Mancano clip retargetizzate, pose, sguardo, locomozione |
| Hair System | `custom/hair-system.js` | 🟡 base | 9 acconciature montabili con spring bone e collider del corpo. Mancano colori, ciocche, accessori separati |
| Material System | `material/material-system.js` | ✅ | 13 finiture, 26 pattern procedurali |
| Garment Forge | `wardrobe/forge/*.js` | 🟡 prototipo | guscio, gonna, bordi, scarpe, maniche |
| Catalogo | `wardrobe/catalog/*.js` | 🟡 minimo | tassonomia completa (19 slot, 30 stili); **6 capi**, tutti con ricetta costruibile |
| Wardrobe Manager | `wardrobe/wardrobe-manager.js` | 🟡 base | slot indipendenti, maschera del corpo, rimbocco, quota dal pavimento. Mancano compatibilità tra slot, accessori rigidi, tacchi |
| Character Engine | `core/character-engine.js` | ✅ | facciata: carica, applica la definizione, aggiorna i moduli, statistiche, dispose |
| Definizione di personaggio | `core/character-def.js` | ✅ | schema, normalizzazione, migrazione v0.2 |
| Persistenza | `save/character-store.js` | 🟡 base | `dc_avatar` in `chrome.storage.local`, incluso nel backup. Mancano look salvati, IndexedDB |
| Outfit Compatibility, Character Customizer, Testa fotografica 3D, Physics Controller, Photo Studio, Room System, Interaction Controller | — | ⚪ da fare | M2–M6 |

**Integrazione nell'estensione**: pagina `src/stage/stage.html` (ES module, CSP MV3 rispettata, nessuna richiesta
esterna), aperta dal service worker con il messaggio `openStage`. Nessun altro punto dell'estensione usa il 3D.

## 5. Asset presenti

- `assets/avatar/base.vrm` (4,6 MB) — corpo e viso, CC0. **In uso.**
- `assets/hair/*.vrm` — 9 acconciature (0,7–2,2 MB), CC0. **In uso** (caricate solo quando selezionate).
- `assets/face/*.webp` — 6 set di texture del viso. Non ancora usati (M3).
- `assets/heads/*.png` — 5 teste fotografiche originali (intoccabili). In uso nel renderer SVG e nel fallback.
- Nessun file di animazione (le 2 clip sono dati nel codice), nessuna stanza, nessun accessorio rigido.

Licenze e fonti: `ASSET_CREDITS.md`.

## 6. Toolchain e test

| Elemento | Stato |
|---|---|
| Node 24, npm 11; three 0.187.0, @pixiv/three-vrm 3.5.5, esbuild 0.28, playwright-core 1.65, sharp 0.35 | ✅ bundle vendor allineato (test) |
| `npm test` | ✅ **49/49** (2026-11-10) |
| `npm run qa` | ✅ **69/69** (2026-11-10, Chrome for Testing 157 headless): suite `legacy` 34, suite `stage` 35 |
| `npm run licenses` | ✅ 10 modelli, tutti CC0 |
| Verifica visiva | ✅ screenshot di riferimento in `docs/screenshots/30…33_*.jpg` (pagina 3D, saluto, fallback, acconciature) |
| Test su GPU reale, Windows/macOS reali, prestazioni | ⚠️ non eseguibili in questo ambiente (WebGL software: 7–15 FPS) |
| Pipeline Python delle teste | ⚠️ non eseguita (OpenCV assente); non serve rieseguirla |

Cosa copre la suite `stage`: caricamento nell'estensione, scheletro/morph/espressioni, capelli, outfit, migrazione
dalle impostazioni v0.2, pixel del canvas, movimento delle ossa, piedi fermi, battito di ciglia, saluto e ritorno
all'idle, espressioni, indipendenza degli slot, maschera del corpo, colori, rimbocco, comandi dell'interfaccia,
orbita e zoom con il mouse, persistenza dopo il ricaricamento, backup e ripristino, preset High, rilascio della
memoria GPU, assenza di richieste esterne, apertura dal service worker, fallback SVG senza WebGL, console pulita.

## 7. Incoerenze trovate alla ripresa (sessione 2) e come sono state risolte

| Incoerenza | Risoluzione |
|---|---|
| `package.json` 1.0.0 contro estensione 0.2.0 | versioni allineate; un test impone l'uguaglianza (ora 0.3.0) |
| `npm test` e `npm run qa` puntavano a file inesistenti; `tools/qa/run.js` non eseguibile | test unitari e QA con asserzioni scritti da zero |
| `npm run package` puntava a uno script inesistente | voce rimossa; script di pacchetto previsto in M7 |
| `TECHNICAL_ARCHITECTURE.md` descriveva moduli e cartelle mai scritti | documento riscritto: implementato distinto da pianificato |
| Motore 3D presente ma non integrato nell'estensione | integrato in M1 (pagina `src/stage/`) |
| Catalogo con voci senza ricetta costruibile | voci rimosse; un test vieta capi senza ricetta |
