# Problemi noti e limitazioni

Elenco dei problemi **aperti**. Quando ne chiudi uno spostalo in fondo («Chiusi») con il riferimento; quando ne scopri
uno aggiungilo subito. Gravità: 🔴 blocca una milestone · 🟠 visibile all'utente · 🟡 minore · ℹ️ limite strutturale.

## Motore 3D

| # | Gravità | Problema | Dove | Milestone |
|---|---|---|---|---|
| 3D-5 | 🟡 | Mocassini: frange chiare lungo il bordo tra tomaia e suola | `wardrobe/forge/shoes.js` | M4 |
| 3D-6 | 🟠 | Catalogo minimo: solo i 6 capi iniziali. Felpa oversize e abito da maid (già previsti dalla migrazione degli outfit v0.2) non hanno ancora una ricetta, quindi non sono nel catalogo | `wardrobe/catalog/items.js` | M4 |
| 3D-8 | 🟡 | I set di texture del viso e i colori dei capelli non sono applicabili (manca il customizer); le acconciature conservano colori e accessori del modello donatore (orecchie da gatto, fermagli) | `custom/` | M3 |
| 3D-9 | ℹ️ | Prestazioni e memoria GPU non misurate su hardware reale: la QA usa WebGL software (7–15 FPS). Con fotogrammi molto lenti il ciclo di disegno occupa il thread principale e le transizioni dell'interfaccia scattano: manca la riduzione automatica della qualità | `render/rendering-engine.js` | M7 |
| 3D-10 | 🟡 | `@pixiv/three-vrm-animation` è installata ma non usata né inclusa nel bundle | `package.json` | M2 |
| 3D-11 | 🟠 | Il personaggio 3D non è ancora il companion: vive solo nella finestra di anteprima, non è collegato a bisogni, umore, interazioni e pagine web | `src/stage/` | M2 → M5 |
| 3D-12 | 🟠 | Modalità testa fotografica non disponibile nel renderer 3D (la pagina lo dichiara con un avviso): chi usa la foto vede il viso 3D nell'anteprima | manca `avatar/photo-head.js` | M3 |
| 3D-13 | 🟡 | Solo 2 clip di animazione native (`idle`, `wave`); nessuna camminata, seduta, danza | `anim/clips.js` | M2 |
| 3D-14 | 🟡 | Preset `Low` molto sgranato (rapporto pixel 0,72 senza antialiasing) | `render/rendering-engine.js` | M7 |
| 3D-15 | 🟡 | Scarpe con tacco: l'inclinazione del piede (`footPitch`) è calcolata ma non applicata alla posa | `wardrobe/wardrobe-manager.js`, `anim/` | M4 |
| 3D-16 | 🟡 | Nessuna regola di compatibilità tra slot (vestito intero contro sopra/sotto, capospalla): oggi non esistono capi che la richiedano | manca `wardrobe/outfit-compat.js` | M4 |
| 3D-17 | 🟡 | `dc_avatar` è scritta dalla pagina di anteprima (come le impostazioni), non dal service worker; il possesso dei capi a pagamento andrà verificato dal service worker | `save/character-store.js`, `sw.js` | M4 |
| 3D-18 | 🟡 | Il capo `legwear_socks_knee` è una calza sopra il ginocchio (il nome mostrato è corretto, l'id storico no) | `wardrobe/catalog/items.js` | M4 |
| 3D-19 | 🟡 | Maglia rimboccata: leggero rigonfiamento alla vita in alcune pose | `wardrobe/forge/garment-forge.js` | M4 |

## Funzioni v0.2 (ereditati da `HANDOFF.md` §7, ancora validi)

| # | Gravità | Problema |
|---|---|---|
| L-1 | 🟡 | `head_03`: bordo destro della corona del cappello leggermente frastagliato (ritaglio classico) |
| L-2 | ℹ️ | `head_05`: nessun collo visibile nella foto, ancorata al bordo inferiore della maschera (`anchorY` > 1) |
| L-3 | ℹ️ | La finestra desktop non può essere sempre in primo piano né trasparente (limite di Chrome) |
| L-4 | ℹ️ | Pagine `chrome://`, Chrome Web Store e visualizzatore PDF: niente content script → usare la finestra desktop |
| L-5 | 🟡 | Foto caricate (data URL) bloccate dai siti con CSP `img-src` molto restrittiva → ripiego automatico su `head_04` |
| L-6 | 🟡 | Gomma magica dell'editor: lavora per colore collegato; sfondi complessi richiedono il ritocco a pennello |
| L-7 | 🟡 | Seduta con gonne lunghe non verificata a occhio su tutti gli outfit SVG |
| L-8 | ℹ️ | Solo italiano, profilo singolo, nessuna sincronizzazione |
| L-9 | ℹ️ | La voce dipende dalle voci `it-IT` installate nel sistema |
| L-10 | 🟡 | Scorciatoie da tastiera, menu contestuali e sintesi vocale non coperti dai test automatici |
| L-11 | 🟡 | Il badge del pomodoro viene aggiornato senza attendere (`updateBadge()` non atteso in `pomo()`): per qualche decina di millisecondi dopo l'avvio può risultare vuoto |

## Dati, privacy e infrastruttura

| # | Gravità | Problema | Nota |
|---|---|---|---|
| I-1 | 🟠 | Il backup JSON contiene in chiaro la chiave API dell'IA (se l'utente ne ha impostata una) e l'hash del profilo | l'interfaccia lo segnala già; valutare l'esclusione facoltativa della chiave (M7) |
| I-2 | 🟠 | **Il repository GitHub è pubblico** e contiene le fotografie personali del proprietario (`source_photos/`, ritagli, screenshot) | solo il proprietario può renderlo privato (Settings → General → Danger Zone) |
| I-3 | ℹ️ | Il ramo predefinito del repository è un ramo di sessione (`hoplite/kalymna-e1397fc3`): non esiste `main` | l'integrazione avviene tramite Pull Request unite automaticamente (`CLAUDE.md` §5) |
| I-4 | 🟡 | `tools/dev/cache` è un collegamento simbolico a `.cache/` (ignorata da git): su un clone nuovo è interrotto finché non si esegue `fetch-assets.mjs` | innocuo; serve solo agli strumenti di ispezione |
| I-5 | 🟡 | Pipeline Python delle teste non eseguita in questo ambiente (OpenCV assente) | i ritagli esistenti sono protetti da impronte; non serve rigenerarli |
| I-6 | ℹ️ | Lavoro del vecchio account mai pubblicato: non recuperabile (workspace non accessibile) | vedi `WORK_LOG.md` |
| I-7 | 🟡 | `tools/dev/forge-dev.js` contiene ancora copie delle ricette dei capi iniziali (ora nel catalogo) più due ricette di prova (décolleté, stivali) | da riallineare quando il catalogo cresce (M4) |

## Chiusi

| # | Problema | Chiuso con |
|---|---|---|
| T-1 | `npm test`, `npm run qa`, `npm run package` puntavano a file inesistenti; `tools/qa/run.js` non eseguibile | sessione 2, M0 (PR #1) |
| T-2 | Versione del package (1.0.0) diversa dall'estensione (0.2.0) | sessione 2, M0 (PR #1) |
| T-3 | Documentazione di architettura che descriveva moduli inesistenti | sessione 2, M0 (PR #1) |
| 3D-1 | Motore 3D non raggiungibile dall'estensione | sessione 2, M1: pagina `src/stage/` + messaggio `openStage` |
| 3D-2 | Nessuna animazione (T-pose) | sessione 2, M1: `anim/animation-controller.js` |
| 3D-3 | Capelli non montati | sessione 2, M1: `custom/hair-system.js` |
| 3D-4 | Orlo della T-shirt seghettato contro la gonna | sessione 2, M1: rimbocco automatico nel Wardrobe Manager |
| 3D-7 | Definizione di personaggio non salvata né inclusa nel backup | sessione 2, M1: `save/character-store.js`, `importData` |
