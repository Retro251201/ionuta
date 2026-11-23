# Architettura tecnica — Desktop Companion

Riferimento per chi sviluppa. Ogni sezione dichiara se descrive qualcosa di **implementato** (verificato nel codice)
o di **pianificato** (contratto proposto, nessun codice). Lo stato delle milestone è in `PROJECT_STATUS.md`, i problemi
aperti in `KNOWN_ISSUES.md`. I contratti di storage e messaggi della v0.2 sono in `HANDOFF.md` §4–§5 e restano validi.

## 1. Visione d'insieme

```
┌────────────────────────────── Estensione Chrome (Manifest V3) ──────────────────────────────┐
│ service worker  src/background/sw.js   ← UNICO writer di dc_state (monete, XP, possesso)     │
│        ▲ DC.send(msg)                        ▲ chrome.storage.onChanged                       │
│ popup · opzioni · finestra desktop · content script nelle pagine web (companion SVG legacy)  │
│ pagine 3D  src/stage/  →  src/engine3d/ (moduli ES: Three.js + three-vrm, nessun chrome.*)   │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
assets/avatar · assets/hair · assets/face (CC0)        assets/heads (FOTO originali, intoccabili)
```

- **Service worker**: stato, logica persistente, eventi (tick dei bisogni, pomodoro, promemoria, accesso, chat, backup).
  Non esegue mai WebGL.
- **UI**: popup, opzioni, finestra desktop, pagine 3D. Inviano messaggi al service worker, non scrivono `dc_state`.
- **Renderer**: due sistemi paralleli — *SVG legacy* (`src/engine/body.js`, sempre disponibile) e *3D*
  (`src/engine3d/`). Il 3D ricade sull'SVG se WebGL o il modello non sono disponibili.
- **Storage**: `chrome.storage.local` (stato, impostazioni, foto personalizzate, definizione del personaggio 3D),
  `chrome.storage.session` (sessione di accesso, finestre aperte). IndexedDB è previsto per galleria e cache (pianificato).

## 2. Codice v0.2 (implementato, invariato)

Script IIFE sul namespace globale `DC`, senza bundler. Ordine di caricamento:
`heads.generated → skins → data → body → companion → content|window`.

| File | Ruolo |
|---|---|
| `src/shared/data.js` | chiavi di storage, default di impostazioni e stato, oggetti, obiettivi, frasi, helper (`DC.load`, `DC.send`, `DC.saveSettings`, `DC.levelOf`, `DC.moodOf`) |
| `src/shared/skins.js` | 17 outfit SVG, acconciature, colori, accessori, helper delle teste |
| `src/shared/heads.generated.js` | metadati dei 5 ritagli fotografici (GENERATO, non editare) |
| `src/engine/body.js` | `DC.Body`: personaggio SVG procedurale (`setHead`, `setOutfit`, `setLook`, `setPose`) |
| `src/engine/companion.js` | `DC.Companion`: macchina a stati, fisica trascina/lancia, input, fumetti, menu radiale, chat, voce |
| `src/background/sw.js` | service worker (vedi sopra) · `src/background/brain.js` chat offline a regole + calcolatrice senza `eval` |
| `src/content/content.js` | avvio del companion nelle pagine web (Shadow DOM chiuso) |
| `src/popup/`, `src/options/`, `src/window/` | popup a 7 schede, impostazioni + editor fotografico (`head-editor.js`), finestra desktop |

## 3. Motore 3D — `extension/src/engine3d/`

Moduli ES caricati direttamente dalle pagine dell'estensione; le librerie arrivano **solo** da `lib.js`, che riesporta
`extension/vendor/three.bundle.js` (three.js 0.187 + addon + `@pixiv/three-vrm` 3.5.5, rigenerabile con
`npm run vendor`). Nessuna richiesta di rete esterna a runtime.

### 3.1 Convenzioni comuni

- **Spazio canonico**: personaggio rivolto a **+Z**, Y in alto, piedi a `y = 0`, metri, T-pose a riposo. Il modello
  base è un VRM 0.x (nel file guarda verso −Z): `loadAvatar` applica `VRMUtils.rotateVRM0`, e `Avatar.body` espone già
  posizioni e normali in spazio canonico.
- Ogni modulo con stato per-frame espone `update(dt)`; ogni modulo che alloca risorse GPU espone `dispose()`.
- Eventi con `Emitter` (`core/events.js`): `on(type, fn)` restituisce la funzione di disiscrizione. Lo stesso file
  esporta `clamp`, `lerp`, `smoothstep`, `damp`.

### 3.2 Mappa dei moduli

Lo stato di ogni modulo (implementato / parziale / pianificato) è tenuto aggiornato nella tabella «Moduli del motore
3D» di `PROJECT_STATUS.md`; qui sotto ci sono responsabilità e contratti.

| Modulo richiesto | File | Responsabilità |
|---|---|---|
| Rendering Engine | `render/rendering-engine.js` | renderer WebGL, scena, luci, ombre, preset qualità, limite FPS, sospensione, cattura immagini |
| Camera Controller | `render/camera-controller.js` | inquadrature predefinite, orbita, zoom, transizioni |
| Asset Manager | `assets/asset-manager.js` | caricamento pigro locale, cache, rilascio memoria GPU |
| Avatar Loader | `avatar/avatar-loader.js` | carica il VRM base; espone ossa, mesh, dati di bind |
| Animation Controller | `anim/animation-controller.js` | clip scheletriche, miscelazione, stati, espressioni, sguardo |
| Hair System | `custom/hair-system.js` | acconciature (VRM donatori), spring bone dei capelli, colori |
| Material System | `material/material-system.js` | materiali toon dei capi, pattern procedurali, finiture |
| Garment Forge | `wardrobe/forge/*.js` | costruzione dei capi come mesh skinnate sul corpo |
| Catalogo | `wardrobe/catalog/*.js` | dati puri dei capi (importabili anche dal service worker) |
| Wardrobe Manager | `wardrobe/wardrobe-manager.js` | slot, equipaggiamento, maschere del corpo, look |
| Outfit Compatibility | `wardrobe/outfit-compat.js` | regole di compatibilità e sovrapposizione |
| Character Engine | `core/character-engine.js` | facciata: collega i moduli e applica una definizione di personaggio |
| Definizione di personaggio | `core/character-def.js` | schema JSON versionato, default, normalizzazione, migrazione v0.2 |
| Character Customizer | `custom/character-customizer.js` | morph generati e proporzioni ossee per corpo e viso |
| Testa fotografica | `avatar/photo-head.js` | la foto originale ritagliata come testa del personaggio 3D |
| Physics Controller | `physics/physics-controller.js` | spring bone di gonne, nastri, code; collider |
| Photo Studio | `photo/photo-studio.js` | pose, luci, sfondi, scatto e galleria |
| Room System | `room/room-system.js` | ambientazioni 3D, arredi, oggetti interattivi |
| Interaction Controller | `input/interaction-controller.js` | raycast, carezze, clic, trascinamento, sguardo al cursore |
| Save System | `save/save-system.js` | IndexedDB (galleria, look, cache) + ponte verso `chrome.storage` |

### 3.3 Contratti dei moduli implementati

**CharacterEngine** — facciata; chi ospita il motore parla solo con questa classe.
```js
CharacterEngine.webglAvailable() → boolean                 // serve WebGL 2
const engine = new CharacterEngine(container, { quality: 'medium', transparent: true, autoPause: true, interactive: true });
await engine.load(def);          // crea renderer e moduli, carica il modello, applica la definizione; lancia un errore se WebGL/modello mancano
engine.render, engine.assets, engine.avatar, engine.materials, engine.wardrobe, engine.hair, engine.anim, engine.camera, engine.def
await engine.apply(def)          // definizione normalizzata → outfit + acconciatura
await engine.setHair(id)         // cambia acconciatura e aggiorna engine.def
engine.setQuality(name)          // preset + contorni toon di corpo, capi e capelli
engine.update(dt)                // anim → avatar (humanoid, espressioni) → fisica dei capelli → camera
engine.step(n, dt)               // avanza e disegna in modo deterministico (test, cattura)
engine.stats() → {fps, frameMs, calls, triangles, geometries, textures, quality, pixelRatio}
engine.dispose()                 // rilascia tutte le risorse GPU (verificato dalla QA)
eventi: 'ready', 'applied' {def, outfitErrors}
```

**AnimationController** (`anim/animation-controller.js`) + clip native (`anim/clips.js`, dati puri)
```js
const anim = new AnimationController({ avatar, random });   // AnimationMixer sulle ossa NORMALIZZATE del rig VRM
anim.list() → [{id, name, category, loop, duration}]        // oggi: idle (ciclica), wave (gesto)
anim.setBase(id, {fade})         // stato di fondo ciclico
anim.play(id, {fade}) → Promise<boolean>   // clip ciclica = nuovo stato di fondo; gesto = dissolvenza, poi ritorno al fondo
anim.stopGesture(); anim.base; anim.current
anim.setExpression(name|null, weight)      // espressioni VRM del modello, sfumate; i gesti possono aggiungerne di proprie
anim.blinkEnabled; anim.restartBlink(delay); anim.update(dt); anim.dispose()
eventi: 'state' {id}, 'end' {id, completed}
```
Formato delle clip: `{id, name, category, loop, duration, fps, pose(t), expressions?(t)}`. `pose(t)` restituisce angoli di
Eulero in gradi per osso in **spazio canonico** (ordine `ZYX` per braccia e dita, `ZXY` per gambe, `YXZ` per busto e
testa; specchiare = `[x, −y, −z]`) più `hipsOffset` in metri. `bakeClip` le campiona in tracce di quaternioni
(`{times, rotations{osso}, hips}`): **è il formato in cui dovranno arrivare anche le clip retargetizzate da file**.
Per i VRM 0.x il controller inverte x e z di quaternioni e spostamenti.

**HairSystem** (`custom/hair-system.js`)
```js
const hair = new HairSystem({ avatar, assets });  await hair.init();     // legge hair/index.json e avatar/base.json
hair.list() → [{id, name, tris}];  await hair.setStyle(id|null);  hair.style
hair.update(dt)                  // spring bone dei capelli, DOPO avatar.update
hair.resetPhysics(); hair.setOutlineEnabled(bool); hair.dispose()
```
Montaggio: l'osso testa del VRM donatore diventa figlio dell'osso testa dell'avatar, scalato sulla larghezza del viso
(`fit.w`) con le sommità allineate (`fit.top`); i collider del corpo vengono spostati sulle ossa omonime dell'avatar.
Non si chiama mai `vrm.update()` del donatore (riscriverebbe l'osso testa), solo `springBoneManager.update()`.

**WardrobeManager** (`wardrobe/wardrobe-manager.js`)
```js
const wardrobe = new WardrobeManager({ avatar, materials });   // crea il BodyModel
wardrobe.equip(slot, itemId, {colors, pattern, finish, params}) → {ok, error?}   // tocca solo quello slot
wardrobe.unequip(slot) → {ok};  wardrobe.setOutfit(outfit) → {ok, errors};  wardrobe.outfit;  wardrobe.itemIn(slot)
wardrobe.worn                    // Map slot → {item, config, garment}
wardrobe.groundOffset            // quota da dare ad avatar.root perché suole o piedi nudi tocchino il pavimento
wardrobe.visibleBodyTriangles, wardrobe.triangles, wardrobe.footPitch, wardrobe.dispose()
evento: 'change' {slot, item}
```
Dopo ogni modifica ricalcola la maschera del corpo (triangoli di pelle coperti non disegnati), rimbocca nella vita del
capo «sotto» (`item.waist`) le parti `tuckable` del capo «sopra» e aggiorna la quota dal pavimento.

**CameraController** (`render/camera-controller.js`) — `frame('full'|'upper'|'face', {animate, lift})`, `list()`,
`setInteractive(bool)`, `update(dt)`, `controls` (OrbitControls: orbita e zoom, niente pan, mai sotto il pavimento),
evento `'frame' {name|null}` (null = l'utente ha mosso la camera).

**Persistenza** (`save/character-store.js`) — unico modulo del motore che tocca lo storage: `loadCharacter()` →
`{def, source: 'saved'|'migrated'|'default'}` e `saveCharacter(def)`; chiave `dc_avatar` in `chrome.storage.local`
(`localStorage` nel banco di prova). Alla prima apertura la definizione nasce dalle impostazioni v0.2
(`migrateLegacyAvatar`) senza scrivere nulla finché l'utente non cambia qualcosa.

**Pagina di anteprima** (`src/stage/stage.html|js|css`) — ospita il Character Engine; comandi: clip, inquadrature,
acconciature (salvate in `dc_avatar`), qualità (salvata in `dc_settings.quality3d`), statistiche del renderer.
Se `engine.load` fallisce mostra `DC.Body` (renderer SVG) con testa, outfit e capelli delle impostazioni v0.2.
Espone `window.__dcStage = {ready, mode: '3d'|'svg'|'error', error, engine, def, source}` per la QA.
Parametro `?q=low|medium|high|ultra` per forzare il preset senza salvarlo.

**Novità nei contratti v0.2**
- Storage: `dc_avatar` (definizione di personaggio 1.0), `dc_settings.quality3d`; sessione: `dc_stageWinId`.
- Messaggi al service worker: `{type: 'openStage'}` → apre (o porta in primo piano) la finestra di anteprima.
- `importData` accetta anche `dc_avatar` (solo controllo di forma e dimensione: la normalizzazione avviene a ogni lettura).

**RenderingEngine**
```js
const re = new RenderingEngine(container, { quality: 'medium', transparent: true, fps, autoPause: true });
re.scene, re.camera, re.renderer, re.canvas, re.lights {hemi,key,fill,rim}, re.shadowCatcher, re.info {fps,frameMs,calls,triangles,…}
re.onUpdate((dt, t) => {}) → unsubscribe;  re.start(); re.stop(); re.step(dt)   // step = update + render deterministico
re.setQuality('low'|'medium'|'high'|'ultra');  re.quality.{maxPixelRatio,antialias,shadows,shadowSize,outline,bloom,fps,physicsHz,textureAniso,roomDetail}
re.setFpsLimit(n); re.suspend(reason); re.resume(reason); re.suspended
re.setBackground(THREE.Color|Texture|null)        // null = canvas trasparente
re.setShadowCatcher(bool)
re.setLighting({ambient,ambientColor,groundColor,key,keyColor,keyAzimuth,keyElevation,fill,fillColor,rim,rimColor,shadow})
re.capture({width,height,transparent,type,quality,camera}) → Promise<Blob>
re.releaseContext(); re.restoreContext(); re.dispose()
eventi: 'renderer', 'quality', 'resize', 'contextlost', 'contextrestored', 'suspend', 'resume'
```
Sospensione automatica con `document.hidden` e quando il contenitore esce dallo schermo (`autoPause`).

**AssetManager** — `url(rel)` (relativo a `extension/assets/`), `buffer(rel)`, `json(rel)`, `loadVRM(rel)`,
`loadGLTF(rel)`, `image(rel)`, `texture(rel, {srgb, repeat})`, `release(rel)`, `releaseTexture(tex)`,
`AssetManager.dispose(object3d, {keepTextures})`.

**Avatar** (`loadAvatar(assets, file = 'avatar/base.vrm')`)
```js
avatar.vrm            // istanza three-vrm: humanoid, expressionManager, lookAt, springBoneManager
avatar.root           // Object3D da aggiungere alla scena
avatar.bones[name]    // osso "raw" per nome umanoide VRM (54 ossa: hips, spine, chest, …, dita)
avatar.humanoid.getNormalizedBoneNode(name)   // osso normalizzato: è QUI che le animazioni scrivono le rotazioni
avatar.bodyMesh, avatar.face.{skin,mouth,eyeWhite,iris,highlight,brow,eyeline,eyelash,extra}, avatar.faceMeshes
avatar.body           // dati di bind canonici {pos,nrm,uv,skinIndex,skinWeight,index,boneNames,bbox,skeleton,bindMatrix,flip}
avatar.metrics        // {height ≈ 1.63, headY, hipsY, ankleY}
avatar.restPosition('leftUpperArm') → Vector3 canonico in T-pose
avatar.setOutlineEnabled(bool);  avatar.update(dt)   // vrm.update: normalizzato→raw, espressioni, look-at, spring bone
```
Espressioni VRM del modello base: `neutral, aa, ih, ou, ee, oh, blink, blinkLeft, blinkRight, angry, relaxed, happy,
sad, Surprised, Extra` (+ 41 morph target grezzi `Fcl_*` sulle mesh del viso).

**MaterialSystem** — `garment({color,color2,color3,pattern,finish,opacity,outline,emissive,doubleSide})` →
`[superficie, contorno]` MToon; `hard({...})` → materiale PBR per accessori rigidi; `patternTexture(pattern, colori)`;
`setOutlineEnabled(bool)`; `release(materiali)`. 13 finiture (`FINISHES`: cotone, maglia, denim, seta, raso, pelle,
vinile, metallo, velluto, velato, pelliccia, plastica, neon) e 26 pattern (`PATTERNS`) disegnati su canvas.

**Garment Forge** — costruisce i capi direttamente dalla superficie del corpo, quindi ogni capo condivide scheletro e
bind matrix del corpo e ne segue le animazioni.
```js
const model = new BodyModel(avatar);     // punti di riferimento, pesi di parte, inviluppi convessi per quota, misure (model.M)
const g = buildGarment(model, item, config, materials, opts);
// item = voce di catalogo con `recipe: { parts: [...] }`; config = {colors, pattern, finish, params}
// → { mesh: SkinnedMesh|null, hide: Float32Array|null (copertura per vertice del corpo), foot: {lift, pitch}|null, materials, stats }
```
Tipi di parte: `shell` (guscio offset dalla pelle, con regione, scollo, maniche, rimbocco `tuckAt`), `skirt` (gonna a
loft con pieghe e svasatura), `shoe` (suola, tacco, punta), `sleeves`, più i bordi `trims` (fascia, volant, pizzo).
Le quote si esprimono con riferimenti anatomici (`'waist-0.005'`, `'knee+0.14'`, `'bust+0.035'`…) risolti da
`resolveY`. `hide` serve a nascondere i triangoli del corpo coperti (niente compenetrazioni).

**Catalogo** — `SLOTS` (19 slot con `layer`), `CATEGORIES`, `STYLES` (30 famiglie), `RARITIES`, `ITEMS`,
`ITEM_BY_ID`, `STARTER_ITEMS`, `itemInfo(id)`, `legacyOutfitItems(outfitId)`. Dati puri senza three.js.

**Definizione di personaggio** — `defaultCharacter()`, `normalizeCharacter(def)` (input non fidato),
`migrateLegacyAvatar(settings)` (v0.2 → 1.0, conserva la testa fotografica come modalità attiva),
`characterItemIds(def)`. Campi: `head {mode:'3d'|'photo', photoId, photoHair, photoScale}`, `body`, `face` (slider
−1…1), `eyes`, `brows`, `makeup`, `skin`, `hair {style,color,tipColor,streakColor,streakAmount}`, `expression`,
`outfit {slot: {item, colors, pattern, material, params}}`.

### 3.4 Contratti pianificati (nessun codice: proposte da confermare quando si implementano)

**RoomSystem** — `list()`, `load(id, customization)`, `unload()`, `options()`, `setOption(key, value)`,
`getCustomization()`, `pick(raycaster)`, `interact(id)`, `anchors {spawn, seats, bounds}`, `cameraHint`, `update(dt)`.

**Persistenza 1.0 (parte restante)** — `dc_looks` (look salvati), `ownedItems` dentro `dc_state` scritti dal service
worker tramite nuovi messaggi (`wardrobe:buy`, `looks:*`) da documentare quando esisteranno; galleria in IndexedDB.

**Animazioni da file** — pipeline `tools/pipeline/build-animations.mjs` che retargetizza clip con licenza verificata
sul rig VRM e le salva già campionate nel formato di `bakeClip` (`assets/anim/<id>.json` + `manifest.json`), caricate
dall'Animation Controller con `registerClip`.

**Ordine di aggiornamento per frame (completo)** — `anim.update → customizer → avatar.update (humanoid + spring bone) →
hair.update → physics.update → room.update → camera.update → render`.

## 4. Pipeline e strumenti (solo sviluppo)

| Script | Effetto |
|---|---|
| `tools/pipeline/fetch-assets.mjs` | scarica in `.cache/` i sorgenti dichiarati in `sources.mjs` e ne registra lo SHA-256 |
| `tools/pipeline/build-avatar.mjs` | dai VRM CC0 produce `assets/avatar/base.vrm`, `assets/hair/*.vrm`, `assets/face/*.webp` e gli indici |
| `tools/pipeline/build-vendor.mjs` | rigenera `vendor/three.bundle.js` e `vendor/LICENSES.txt` (`npm run vendor`) |
| `tools/pipeline/audit-licenses.mjs` | legge le licenze dichiarate dentro i modelli distribuiti (`npm run licenses`) |
| `tools/pipeline/glb-tools.mjs`, `inspect-vrm.mjs`, `extract-images.mjs` | lettura/scrittura GLB e ispezione |
| `tools/dev/serve.mjs` | server statico con radice = repository |
| `tools/dev/shot.mjs` | screenshot headless di una pagina (WebGL software), con errori JS e risorse mancanti |
| `tools/dev/engine.html` | banco di prova del motore (`window.dev`), moduli aggiuntivi con `?modules=` |
| `tools/dev/forge-dev.js` | banco di prova della Garment Forge (`?modules=/tools/dev/forge-dev.js&wear=…`) |
| `tools/dev/char-dev.js` | banco di prova di animazioni e capelli: fogli di controllo visivo (`dev.char.hairSheet()`, `dev.char.clipSheet(id, tempi)`) |
| `tools/tests/*.test.mjs` | test unitari (`npm test`) |
| `tools/qa/run-qa.mjs` | QA end-to-end sull'estensione reale (`npm run qa`), suite `legacy` e `stage` |
| `tools/qa/no-webgl.init.js` | script iniettato per simulare un dispositivo senza WebGL (verifica del fallback) |
| `tools/qa/publish-shots.mjs` | copia in `docs/screenshots/` gli screenshot QA di riferimento |
| `tools/head_pipeline/*.py` | ritaglio delle teste fotografiche (v0.1; richiede OpenCV) — vedi `ASSET_PIPELINE.md` |
