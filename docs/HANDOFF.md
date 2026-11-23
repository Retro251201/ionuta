# HANDOFF – Desktop Companion v0.2.0

> **Documento storico della v0.2** (ancora valido come riferimento per architettura legacy, contratti di storage e
> messaggi, decisioni). Le regole di sviluppo correnti sono in `CLAUDE.md`; lo stato in `PROJECT_STATUS.md`; la ripresa
> del lavoro in `NEXT_SESSION_HANDOFF.md`. I test si eseguono con `npm test` e `npm run qa` (il §9 qui sotto descrive
> la procedura originale, non più in uso).

Documento per chi (umano o IA) continua il progetto. Contiene obiettivo, decisioni con motivazioni, architettura, contratti di messaggi/storage, problemi noti e roadmap.

## 1. Obiettivo originale (richiesta utente, tradotta)
> Estensione Chrome importabile: desktop companion *anime girl* completa di tutte le funzionalità, come quelle su Steam. **La testa del soggetto delle foto deve restare invariata**, riconoscibile come lui, **non cartoon**. Il corpo da anime girl va bene. Mettere accesso (login) e tutto il necessario. Consegnare zip completo con asset, codice e tutti i ragionamenti per continuare in altre chat; verrà migliorato pezzo per pezzo da altri modelli.

Le 5 foto mostrano l'utente con maschere (Guy Fawkes bianca/nera/classica, maschera "fantasma" con barba, maschera neon stile Purge) e cappelli. La "testa" = foto ritagliata **inclusi cappello e maschera**, perché è così che l'utente si è presentato.

## 2. Decisioni chiave e perché
| Decisione | Motivo |
|---|---|
| **Testa = ritaglio PNG della foto reale**, nessuna stilizzazione/AI | Requisito "invariata, riconoscibile, non cartoon". Solo ritaglio + alpha morbido + leggero bilanciamento bordi. |
| Ritaglio con **OpenCV GrabCut + regole cromatiche** (no rembg/mediapipe) | La sandbox non aveva internet → niente modelli di segmentazione. Pipeline riproducibile in `tools/head_pipeline/`. Con internet: rifare i ritagli con rembg (vedi ASSET_PIPELINE.md). |
| **Corpo SVG procedurale** (`src/engine/body.js`) invece di sprite | Nessun asset artistico disponibile; l'SVG permette pose/animazioni infinite, outfit ricolorabili, colore pelle auto-adattato alla testa (`DC.HEADS[i].skin`), scala nitida. |
| Collo/pelle del corpo = colore medio pelle della foto | Raccordo credibile testa reale ↔ corpo anime. |
| **Manifest V3**, content script in tutte le pagine (top frame) + **Shadow DOM chiuso** | Funziona su qualsiasi sito senza conflitti CSS. |
| Logica e stato nel **service worker** (unica fonte di verità) | Più schede = una sola companion logica; mutazioni serializzate (`mutate()` queue). Le schede ascoltano `chrome.storage.onChanged`. |
| "Desktop" = **finestra popup di Chrome** (`src/window/`) | Un'estensione non può disegnare sul desktop del SO né restare always-on-top. Vera versione desktop → wrapper Electron/Tauri (roadmap). |
| Login = **profilo locale singolo**, PBKDF2-SHA256 150k, sessione in `chrome.storage.session` | Nessun backend. È un *privacy gate*, non sicurezza forte: chi ha accesso al profilo Chrome può resettarlo (scelta voluta, documentata). 5 tentativi falliti → blocco 60s. |
| Chat: **Brain offline a regole** + IA opzionale compatibile OpenAI | Funziona subito senza chiavi; con IA diventa conversazionale. Permesso host richiesto solo per l'origine scelta (`optional_host_permissions`). |
| Calcolatrice con parser ricorsivo, **niente eval** | CSP MV3 + sicurezza. |
| Solo italiano in v0.1 | Lingua dell'utente. Testi centralizzati in `DC.LINES` (data.js) e `brain.js` → facile i18n. |
| Nessun permesso `tabs`/`scripting` | Meno avvisi all'installazione; il popup usa `chrome.tabs.query` (activeTab implicito non serve per sendMessage). |

### Decisioni v0.2.0
- **Altre facce = foto dell'utente, non disegni**: invece di generare/ridisegnare volti, l'utente carica le sue foto. L'editor modifica solo il canale alpha e l'inquadratura (ritaglio, zoom, rotazione); i pixel colore restano quelli originali.
- Foto salvate come data URL WebP/PNG in `dc_customHeads` (non nel pacchetto: un'estensione non può scrivere file propri) → permesso `unlimitedStorage`; il SW valida tutto.
- Capelli disegnati **dietro** la foto: incorniciano senza coprire viso/cappelli reali. Default "Lunghi lisci", disattivabili ("Nessuno").
- Corpo: curve morbide e gradienti, proporzioni anime "carine"; niente pose o outfit volgari.

## 3. Mappa file
```
extension/
  manifest.json                MV3, comandi, menu, content script, WAR teste/icone
  assets/heads/head_01..05.png teste ritagliate (alpha), generate da tools/head_pipeline
  assets/icons/icon16..128.png
  src/shared/heads.generated.js  DC.HEADS [{id,name,file,skin,anchor...}] (GENERATO – non editare a mano)
  src/shared/skins.js          DC.OUTFITS (17), HAIR_STYLES, HAIR_COLORS, ACCESSORIES, CUSTOM_HEADS, MAX_CUSTOM_HEADS, allHeads(), headById(), headUrl(h), outfitById()
  src/shared/data.js           DC.KEYS, DEFAULT_SETTINGS/STATE, ITEMS, ACHIEVEMENTS, LINES, MOOD_LABEL, helper (load, send, saveSettings, levelOf…)
  src/shared/auth-ui.js        DC.AuthUI.mount(box, onDone) – form registrazione/login riusabile
  src/shared/ui.css            variabili e componenti comuni (popup/opzioni)
  src/engine/body.js           DC.Body – personaggio SVG: setHead(head,url), setOutfit, setLook({hair,hairColor,accessory}), setPose(pose); statiche VB, FEET_Y, SIT_Y, HIPY, FACE_UNITS, restPose()
  src/engine/companion.js      DC.Companion({mode:'page'|'window'}) – macchina a stati, fisica, input, fumetti, menu, chat, voce, effetti
  src/content/content.js       bootstrap nella pagina
  src/background/sw.js         service worker: stato, tick, azioni, pomodoro, promemoria, auth, IA, menu, comandi, badge, backup
  src/background/brain.js      DC.Brain.reply(text, ctx) – risposte offline + DC.Brain.calc
  src/popup/                   popup a schede (home, negozio, stile, focus, obiettivi, gioco, account)
  src/options/                 impostazioni complete + benvenuto (#benvenuto), #aspetto, #teste
  src/options/head-editor.js   DC.HeadEditor.mount(opts) – editor canvas delle foto (solo ritaglio/alpha/ancora)
  src/window/                  finestra desktop (stanzetta) che riusa companion.js
tools/
  head_pipeline/cutout_heads.py  ritaglio teste (params.json = regioni per foto) --qa per immagini di controllo
  head_pipeline/gen_assets.py    genera heads.generated.js + icone
  grid_sheet.py                  griglia coordinate sulle foto (per tarare params.json)
  qa/run.js, qa/test.html        test end-to-end Playwright (screenshot + chiamate al SW)
```
Ordine di caricamento (content e window): `heads.generated → skins → data → body → companion → content|window`. Tutto è IIFE su `window.DC` (niente bundler, niente moduli ES: semplice da caricare unpacked e da modificare).

## 4. Storage (`chrome.storage.local` salvo dove indicato)
| Chiave | Contenuto |
|---|---|
| `dc_settings` | vedi `DC.DEFAULT_SETTINGS` (name, size, speed, opacity, headId, outfitId, walk, followCursor, physics, siteComments, talkFrequency off/rare/normal/often, hideOnFullscreen, voice, voiceRate, voicePitch, sounds, notifications, disabledSites[], reminders{enabled,water,posture}, pomodoro{work,short,long,cycles,autoBreak}, ai{enabled,endpoint,model,apiKey,persona}, requireLogin, **hairStyle, hairColor, accessory**) – `headId` può essere `head_0x` o `custom_…` |
| `dc_state` | stats{hunger(=sazietà, 100 pieno),energy,happiness,affection}, xp, coins, inventory{itemId:n}, unlockedOutfits[], counters{pets,pokes,feeds,throws,chats,pomodoros,games,wins,minutes,activeMinutes,customHeads,twirls}, achievements{id:ts}, sleeping, lastTick, createdAt, coinAcc |
| `dc_customHeads` | [{id:'custom_…', custom:true, name≤40, dataUrl (data:image/webp|png;base64, ≤~1,5 MB), w, h (16–1024), anchorX, anchorY (0–1, base del collo), faceW (0,15–1,2 frazione della larghezza immagine = larghezza viso), skin '#rrggbb', createdAt}] max 12. Scritta **solo dal SW**; le UI la leggono con `DC.loadCustomHeads()` / `DC.load()` |
| `dc_profile` | {username, salt, hash, iter, createdAt, fails, lockUntil} |
| `dc_chat` | [{role:'user'|'assistant', text, t}] max 80 |
| `dc_event` | ultimo evento broadcast {id,t,kind,sub?,text?} – le schede lo mostrano come fumetto/emote (kinds: levelup, achievement, pomo, reminder, wake, say…) |
| `dc_pomodoro` | {running, phase work/short/long, cycle, endsAt, startedAt} |
| `dc_lastGreet` | anti-spam saluto |
| session: `dc_session` | {user, t} login attivo · session: `dc_winId` id finestra desktop |

## 5. Messaggi verso il service worker (`DC.send(msg)` → risposta)
- `{type:'action', action, ...}` → `{ok, reason?}`
  - `pet` · `poke` · `throw` · `feed {itemId}` (reason `none`) · `buy {itemId, qty?}` (reason `coins`) · `buyOutfit {outfitId}` · `game {result:'win'|'lose'|'draw'}` · `sleep {value:bool}` · `reset`
- `{type:'chat', text, page:{title,host}|null}` → `{ok, reply}` (salva in `dc_chat`)
- `{type:'pomodoro', cmd:'start'|'break'|'stop'}` → `{ok, pomo}`
- `{type:'auth:status'}` → `{ok, hasProfile, loggedIn, user}`
- `auth:register {username, password}` · `auth:login {username, password}` · `auth:logout` · `auth:changePassword {oldPassword,newPassword}` · `auth:reset`
- `action: twirl` → contatore `twirls` (+felicità)
- `{type:'heads:list'}` → `{ok, heads}`
- `{type:'heads:add', head:{name,dataUrl,w,h,anchorX,anchorY,faceW,skin}, select?:bool}` → `{ok, head}` | `{ok:false, error}` (formato, dimensione, limite 12). Con `select` imposta `headId` ed emette evento `newface`.
- `{type:'heads:update', id, head:{campi parziali}}` → `{ok, head}` (valori ri-validati/clampati)
- `{type:'heads:remove', id}` → `{ok}`; se era la testa attiva torna a `head_04`
- `openWindow` · `openOptions` · `testAI` → `{ok, reply|error}` · `clearChat` · `exportData` → `{ok,data}` · `importData {data}`

Verso le schede (`chrome.tabs.sendMessage` / runtime): `{type:'summon'}`, `{type:'say', text}`, `{type:'toggle'}` gestiti da `Companion.handleMessage`.
**Attenzione**: le pagine dell'estensione (es. `window.js`) ricevono anche i `runtime.sendMessage` delle altre pagine: un listener deve rispondere **solo** ai propri tipi, altrimenti ruba la risposta al SW (bug corretto in v0.2.0).

## 6. Engine – concetti
- **Pose** (`body.js`): `{dir, x, y, lean, sqx, sqy, torso, headTilt, headY, aL:[spalla,gomito], aR, lL:[anca,ginocchio], lR, skirt, skirtSx, skirtSy, shadow, item}` in gradi/unità viewBox. `DC.Body.restPose()` di base. Ogni stato in `companion.js` (`tickPose`) costruisce la posa per frame → aggiungere un'animazione = aggiungere un `case`.
- **Stati**: idle, walk, run, peekGo, peek, sit, sleep, wave, dance, twirl, heart, stretch, wobble, eat, pet, poke, nod, look, drag, fall, land, dizzy… scelti in `decide()` pesati per umore.
- **Fisica**: gravità, attrito, rimbalzo sui bordi del viewport; velocità di lancio dagli ultimi campioni del drag; atterraggi duri → dizzy + azione `throw`.
- **Tick** nel SW ogni minuto (`dc_tick`): decadimento bisogni, sonno ricarica energia, offline ridotto (×0.35, max 720 min), monete per tempo attivo (`chrome.idle`).

## 7. Problemi noti / limiti
1. `head_03` ha il bordo destro della corona del cappello leggermente frastagliato (ritaglio classico). Rifare con rembg/SAM.
2. `head_05` non ha collo visibile nella foto → ancorata dal bordo inferiore della maschera.
3. La finestra desktop non può essere always-on-top né trasparente (limite Chrome).
4. Pagine `chrome://`, Chrome Web Store, PDF viewer: niente content script (limite Chrome) → usare la finestra.
5. Foto caricate (data URL) su siti con CSP `img-src` molto restrittiva possono essere bloccate → fallback automatico a `head_04`; nella finestra desktop e nelle pagine dell'estensione funzionano sempre.
9. La gomma magica lavora per colore simile *collegato*: con sfondi complessi serve ritoccare a pennello (manca lo scontorno automatico IA).
10. Le nuove pose sono state verificate nell'harness SVG e in pagina (miko + codini); la seduta con gonne lunghe è adattiva ma non verificata a occhio su tutti gli outfit.
6. Solo italiano; profilo singolo; nessuna sincronizzazione cloud.
7. La voce dipende dalle voci `it-IT` installate nel sistema.
8. QA: test automatici su Chromium headless (screenshot in `docs/screenshots`); non testato su Mac/Windows reali né su siti con CSP estremi (il Shadow DOM con stili inline è compatibile con la maggior parte delle CSP).

## 8. Roadmap suggerita (in ordine)
1. **Qualità teste**: rembg/SAM per alpha perfetto delle teste incluse; editor: lazo, scontorno automatico locale (WASM/ONNX), modifica ancora di foto salvate.
2. **Animazioni**: arrampicarsi sui bordi della finestra, appendersi al bordo superiore, sedersi sugli elementi `h1/img` della pagina (peek e reazione allo scroll fatti in v0.2.0).
3. **Corpo**: espressioni corporee per umore, outfit stagionali a tempo, altri accessori (capelli/cel-shading/accessori base fatti in v0.2.0).
4. **Wrapper desktop reale** (Electron/Tauri) riusando `body.js` + `companion.js` (finestra trasparente, click-through, always-on-top) – adattare `chrome.storage` con un piccolo shim.
5. i18n (en/it) con `_locales` e `chrome.i18n`.
6. Memoria della chat per l'IA (riassunti), voce TTS migliore (ElevenLabs/Piper opzionali), STT.
7. Multi-profilo, sync opzionale (`chrome.storage.sync` per impostazioni leggere).
8. Minigiochi extra (acchiappa la stella, quiz), calendario/umore giornaliero, eventi festivi.
9. Test unitari (node) per data.js / brain.js / sw tick.

## 9. Come testare
```bash
cd tools/qa && python3 -m http.server 8765 &   # serve test.html
node tools/qa/run.js                           # richiede playwright + chromium (adattare executablePath)
```
Manuale: carica `extension/`, apri un sito qualsiasi, prova trascina/lancia, tasto destro, popup, opzioni → IA (es. Ollama locale).

## 10. Regole per chi continua
- Non modificare l'aspetto delle teste (requisito utente): solo ritaglio/alpha/ancoraggio. Vale anche per l'editor delle foto caricate: niente filtri, beauty, stilizzazione.
- Mantieni il SW come unica fonte di verità: le UI mandano messaggi, non scrivono `dc_state` direttamente (eccezione: `saveSettings`).
- Aggiorna `CHANGELOG.md`, `TODO.md` e questo file a ogni sessione; incrementa `version` in manifest e `DC.VERSION` in data.js.
- Verifica sempre con `node --check` su tutti i JS e con `tools/qa/run.js`.
