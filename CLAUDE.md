# CLAUDE.md — Desktop Companion 1.0 Premium

Documento principale per **ogni** sessione di sviluppo (Claude o altro agente). Leggilo per intero prima di toccare il
codice. È scritto per chi **non ha mai visto** le conversazioni precedenti: il repository è la memoria del progetto.

> **Regola principale: il progetto deve sopravvivere a qualsiasi cambio di account, chat, modello o disponibilità di
> crediti.** GitHub conserva il lavoro, la documentazione conserva il contesto, il codice è la fonte di verità.

## 1. Identità

| | |
|---|---|
| Nome | **Desktop Companion** (obiettivo: *Desktop Companion 1.0 Premium*) |
| Repository | <https://github.com/Retro251201/ionuta> |
| Cos'è | Estensione Chrome **Manifest V3** (caricabile "non pacchettizzata" dalla cartella `extension/`) con un companion in stile *desktop mate* |
| Stato | v0.2 (personaggio SVG + testa fotografica) funzionante e protetta; motore 3D in sviluppo a milestone → vedi `docs/PROJECT_STATUS.md` |
| Lingua | Interfaccia e documentazione in **italiano** |

## 2. Obiettivo del prodotto

Trasformare il progetto in un companion desktop con un **vero personaggio 3D** personalizzabile (mesh, scheletro,
skinning, materiali, capelli, viso, espressioni), **guardaroba modulare a slot indipendenti**, animazioni scheletriche con
fisica secondaria, photo studio, stanze 3D e un'interfaccia da videogioco giapponese premium — **mantenendo tutte le
funzioni esistenti**, funzionando **completamente offline** e restando un prodotto installabile, non una demo.

## 3. Protocollo di ripresa (all'inizio di OGNI sessione)

Non ripetere il bootstrap del progetto: esegui questi passi e poi lavora.

1. **Leggi** in ordine: questo file → `AGENTS.md` → `docs/PROJECT_STATUS.md` → `docs/NEXT_SESSION_HANDOFF.md`
   (poi, se servono, `docs/DEVELOPMENT_ROADMAP.md`, `docs/TECHNICAL_ARCHITECTURE.md`, `docs/KNOWN_ISSUES.md`).
2. **Controlla Git** (solo comandi non distruttivi):
   ```bash
   git status --short --branch
   git fetch origin '+refs/heads/*:refs/remotes/origin/*'
   git for-each-ref --sort=-committerdate --format='%(committerdate:iso8601) %(objectname:short) %(refname:short)' refs/remotes/origin
   git log --graph --decorate --oneline -15 --all
   gh pr list --state all --limit 10
   ```
3. **Individua la revisione più recente.** Il ramo predefinito del repository *non* è necessariamente il più avanti:
   se un ramo remoto `hoplite/*` (o una PR aperta) contiene commit più recenti del tuo ramo di lavoro, portali nel tuo
   ramo **solo in fast-forward**: `git merge --ff-only origin/<ramo-più-recente>`. Se il fast-forward non è possibile,
   fermati e analizza (niente reset, niente force push).
4. **Verifica la base**: `npm install` (se manca `node_modules/`), poi `npm test` e `npm run qa`. Devono passare
   prima di iniziare; se non passano, il primo compito è capire perché.
5. **Riprendi dalla `EXACT NEXT ACTION`** di `docs/NEXT_SESSION_HANDOFF.md`. Non ricominciare la roadmap, non rifare
   lavoro già documentato, non ricreare codice esistente senza una motivazione tecnica.
6. Se la documentazione e il codice non coincidono, **vale il codice**: correggi la documentazione nello stesso checkpoint.

Modifiche del vecchio account mai pubblicate su GitHub non sono recuperabili: non fingere di averle, documenta la perdita
in `docs/WORK_LOG.md`.

## 4. Salvataggio continuo (priorità assoluta)

Il budget di crediti è limitato e la sessione può interrompersi in qualsiasi momento: lavora in **unità piccole,
indipendenti e recuperabili**.

**Ciclo di checkpoint** (dopo ogni funzione significativa, correzione importante, migrazione, integrazione di asset,
prima di operazioni rischiose e prima di fermarti):

1. Modifica il codice. 2. Rileggi il diff (`git diff --stat`, `git diff`). 3. Esegui i test pertinenti (§9).
4. Aggiorna la documentazione toccata (§12). 5. Commit descrittivo. 6. Push. 7. **Verifica l'hash remoto.**

```bash
git add -A && git commit -m "feat: …"
git rev-parse --abbrev-ref HEAD                          # nome del ramo di lavoro, es. hoplite/xxxx
git push origin HEAD:refs/heads/hoplite/xxxx             # refspec esplicito con il nome scritto per esteso, mai --force
git rev-parse HEAD
git ls-remote origin refs/heads/hoplite/xxxx             # i due hash devono coincidere
```

- Nei workspace Hoplite la policy blocca i comandi Git costruiti dinamicamente (variabili di shell, script generati al
  volo) e ogni push verso il ramo predefinito: scrivi sempre il nome del ramo per esteso e crea gli script con lo
  strumento di scrittura dei file, non con heredoc eseguiti nello stesso comando.
- Non dire "salvato" se il lavoro è solo nel workspace: **salvato = hash locale uguale all'hash remoto**.
- Se il push fallisce: conserva il commit locale, non sovrascrivere il remoto, individua la causa, riprova in modo non
  distruttivo e scrivi chiaramente nell'handoff che il checkpoint remoto non è verificato.
- Non puoi leggere il credito residuo e non puoi intercettarne l'esaurimento: non aspettare l'ultimo momento.
- Prefissi dei commit: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`, `checkpoint:` (messaggi in italiano o inglese, ma descrittivi).
- **Mai nel repository**: password, token, chiavi API, file `.env`, dati personali nuovi, cache, `node_modules/`.

**Fine sessione** (anche anticipata): smetti di iniziare cose nuove → stabilizza la modifica corrente → test → aggiorna
`PROJECT_STATUS.md`, `WORK_LOG.md`, `KNOWN_ISSUES.md` → riscrivi `NEXT_SESSION_HANDOFF.md` con una `EXACT NEXT ACTION`
precisa → commit → push → verifica → apri/aggiorna la Pull Request verso il ramo predefinito (§5).

## 5. Regole Git

- **Vietati**: `git reset --hard`, `git clean -fd`, force push, cancellazione di rami, riscrittura di commit pubblicati,
  merge indiscriminati. Non eliminare modifiche locali senza averle esaminate.
- **Modello dei rami**: ogni sessione lavora sul proprio ramo (`hoplite/<nome>` creato dalla piattaforma). Il **ramo
  predefinito** del repository (`hoplite/kalymna-e1397fc3`: non esiste `main`) è la linea di integrazione: ci si arriva
  **solo tramite Pull Request**, mai con push diretti (la policy del workspace li blocca). Non creare rami inutili.
- **Le PR collegate alla sessione vengono unite automaticamente** dalla piattaforma (squash) appena sono pronte. Quindi:
  salva i checkpoint con push sul ramo di lavoro e apri la PR quando un blocco di lavoro è completo e verde; una volta
  unita, la sessione successiva parte già dal lavoro più recente.
- **Dopo un merge il ramo di lavoro è consumato.** Per proseguire nella stessa sessione crea un ramo di proseguimento
  dal ramo predefinito aggiornato e apri una nuova PR:
  ```bash
  git fetch origin hoplite/kalymna-e1397fc3
  git checkout --no-track -b hoplite/<ramo-della-sessione>--<breve-descrizione> origin/hoplite/kalymna-e1397fc3
  ```
- Se una PR non è stata unita (o il lavoro è solo su un ramo remoto), vale il passo 3 del protocollo di ripresa.
- I rami delle sessioni precedenti restano come sono: sono la cronologia del progetto.

## 6. Vincoli non negoziabili

1. **Fotografie originali intoccabili.** `source_photos/` e `extension/assets/heads/` non si modificano, non si
   ridisegnano, non si stilizzano, non si sostituiscono con immagini generate; i pixel non cambiano mai (un test ne
   controlla l'impronta SHA-256). L'editor fotografico modifica solo ritaglio, canale alpha e ancoraggio.
2. **La modalità fotografica deve continuare a funzionare.** Testa fotografica e viso 3D sono due modalità distinte
   (`head.mode: 'photo' | '3d'`); non simulare integrazioni tecnicamente impossibili.
3. **Non rimuovere funzioni esistenti**: estensione MV3, companion SVG, editor foto, personalizzazioni, capelli, outfit,
   animazioni, bisogni, economia e monete, livelli, obiettivi, negozio, pomodoro, promemoria, chat offline,
   autenticazione locale, finestra companion, scorciatoie, salvataggio, backup e ripristino. La suite `legacy` di
   `npm run qa` le verifica: deve restare verde.
4. **Migrazione graduale 2D → 3D.** Il renderer SVG resta come sistema *legacy* funzionante e come *fallback* quando
   WebGL o il modello non sono disponibili. Il 3D diventa predefinito solo dopo test reali.
5. **Offline e privacy.** Nessuna dipendenza online obbligatoria a runtime: niente CDN, niente download al primo avvio,
   niente account, niente chiavi API obbligatorie, niente backend. Librerie e asset sono locali. I dati restano in
   `chrome.storage` / IndexedDB. L'IA esterna in chat è facoltativa e disattivata per impostazione predefinita.
6. **Niente finzioni.** Nessun pulsante finto, nessuna voce di catalogo senza un capo realmente costruibile, nessuna
   schermata decorativa, nessuna funzione dichiarata "completata" senza test eseguiti. Una libreria presente non è una
   funzione implementata. Se qualcosa è impossibile, spiegane il limite e realizza l'alternativa migliore.
7. **Asset solo con licenza verificata** (autore, fonte, URL, licenza, modifica, redistribuzione, uso commerciale,
   attribuzione) e registrati in `docs/ASSET_CREDITS.md` *prima* del commit. Mai modelli estratti da giochi commerciali.
   Un asset è "integrato" solo se il file è nel pacchetto ed è usato dal codice.
8. **Personaggi chiaramente adulti.** Proporzioni, catalogo e testi devono rappresentare una persona adulta; gli
   slider del character creator vanno limitati a proporzioni adulte. Sono ammessi stili sensuali **non espliciti**;
   niente nudità esplicita (il corpo base è un manichino senza dettagli anatomici, l'intimo è un capo 3D).
9. **Limiti di Chrome MV3 rispettati**: nessun overlay "sempre in primo piano" su altre applicazioni; un eventuale
   wrapper Electron/Tauri è un progetto separato che non deve compromettere l'estensione.
10. **Stabilità e conservazione dei dati vengono prima di qualsiasi migrazione**: i dati già salvati dagli utenti
    (`dc_state`, `dc_settings`, `dc_customHeads`, …) devono restare leggibili; ogni cambio di schema ha una migrazione
    retrocompatibile e un test.

## 7. Architettura in breve

Dettagli e contratti in `docs/TECHNICAL_ARCHITECTURE.md` (che distingue **implementato** da **pianificato**).

```
extension/                      ← la cartella da caricare in Chrome
  manifest.json                 MV3
  src/background/sw.js          service worker: UNICO writer di dc_state; tick, pomodoro, promemoria, auth, chat, backup
  src/shared/                   dati e helper v0.2 (script IIFE sul namespace globale DC)
  src/engine/                   renderer SVG legacy (body.js) + comportamento del companion (companion.js)
  src/content|popup|options|window/   interfacce v0.2
  src/engine3d/                 motore 3D a moduli ES (Three.js + three-vrm): rendering, avatar, animazioni, capelli, guardaroba
  src/stage/                    pagina di anteprima del personaggio 3D, con ripiego automatico sul renderer SVG
  vendor/three.bundle.js        three.js + addon + @pixiv/three-vrm in un unico file locale (npm run vendor)
  assets/avatar|hair|face/      modelli e texture 3D (CC0) · assets/heads/ FOTO originali (intoccabili)
tools/pipeline/                 pipeline asset e vendor (solo sviluppo)
tools/dev/                      banco di prova del motore, server statico, screenshot headless
tools/tests/                    test unitari (node --test)
tools/qa/                       QA end-to-end sull'estensione reale (Chrome headless)
tools/head_pipeline/            pipeline Python dei ritagli fotografici (v0.1)
source_photos/                  fotografie originali (intoccabili)
docs/                           documentazione permanente
```

Separazione dei ruoli: **service worker** = stato, logica persistente, eventi (mai WebGL); **UI** = interfaccia e
controlli; **renderer** = scena, personaggio, animazioni; **storage** = dati, configurazioni, backup.

## 8. Regole tecniche

- **Due mondi di codice.** Le parti v0.2 sono script IIFE su `globalThis.DC` (caricabili da SW, content script e
  pagine senza bundler): restano tali. Il motore 3D (`src/engine3d/`) è fatto di **moduli ES** caricati direttamente
  dalle pagine dell'estensione; non usa `chrome.*` (così è testabile nel banco di prova e in node), con una sola
  eccezione: `save/character-store.js`, il ponte verso lo storage. I dati puri (`anim/clips.js`,
  `core/character-def.js`, `wardrobe/catalog/`) non dipendono nemmeno da three.js e hanno test unitari.
- **Niente bundler a runtime.** Le librerie 3D si importano **solo** da `src/engine3d/lib.js` (che riesporta
  `vendor/three.bundle.js`). Per aggiornare three/three-vrm: `npm install …` → `npm run vendor` → `npm test`.
- **Non mettere tutto in un file.** Un modulo per responsabilità (Rendering Engine, Avatar Loader, Animation
  Controller, Wardrobe Manager, …); ogni modulo con stato per-frame espone `update(dt)`, ogni modulo che alloca
  risorse GPU espone `dispose()`.
- **Spazio canonico**: personaggio rivolto a **+Z**, Y in alto, piedi a `y = 0`, metri. Il modello base è un VRM 0.x
  (nel file guarda verso −Z): le conversioni sono già gestite da `avatar-loader.js` e dal controller delle animazioni.
- **Il service worker è l'unica fonte di verità** di `dc_state` (monete, XP, possesso): le interfacce inviano messaggi
  con `DC.send(...)`, non scrivono lo stato (eccezione storica: `DC.saveSettings`). Ogni listener di pagina risponde
  solo ai propri tipi di messaggio.
- **CSP MV3**: niente `eval`, niente script inline nelle pagine HTML, niente codice remoto.
- **Input non fidato** (backup importati, definizioni di personaggio): sempre normalizzato e limitato
  (`normalizeCharacter`, `cleanHead`).
- **Prestazioni**: preset Low/Medium/High/Ultra, limite FPS, sospensione quando la scena non è visibile, rilascio
  della memoria GPU (`AssetManager.dispose`), niente lavoro per-frame inutile.
- Commenti e testi in italiano, sintetici; segui lo stile del file che modifichi.

## 9. Test obbligatori

| Comando | Cosa verifica | Quando |
|---|---|---|
| `npm test` | Test unitari: manifest, versioni, pagine, vincolo offline, bundle vendor, **impronte delle foto**, dati v0.2, definizione di personaggio, catalogo, licenze e indici degli asset, registro crediti | prima di ogni commit |
| `npm run qa` | Estensione reale in Chrome headless: suite `legacy` (funzioni v0.2) e suite `stage` (motore 3D: rendering, animazioni, guardaroba, persistenza, fallback); fallisce su errori JS/CSP/risorse mancanti. `-- --suite legacy` o `stage` per una sola | prima di ogni push che tocca `extension/` |
| `npm run licenses` | Licenze dichiarate dentro i modelli distribuiti | dopo ogni modifica agli asset |
| `node tools/dev/shot.mjs '<pagina>' out.png` | Screenshot headless per la verifica **visiva** (guardare davvero l'immagine) | dopo ogni modifica visibile |

- Chrome: variabile `CHROME` (default `/usr/local/bin/google-chrome`). WebGL gira in software (SwiftShader): lento
  (7–15 FPS), quindi nei test il tempo avanza a passi fissi (`engine.update(dt)`, `engine.step(n)`), mai con attese.
- Le pagine dell'estensione vietano `eval`: con Playwright usa predicati-funzione (`waitForFunction(() => …)`), non stringhe.
- Controlla **l'esito di ogni comando**, non solo l'ultimo di una catena: `comando | tail` restituisce l'esito di `tail`.
- Aggiungi un test per ogni funzione nuova e per ogni bug corretto. Non dichiarare superati test non eseguiti; non
  dichiarare funzionante una schermata solo perché si apre.
- Gli screenshot QA di riferimento stanno in `docs/screenshots/`; quelli temporanei in `tools/qa/out/` (ignorata da git).

## 10. Roadmap

Sequenza obbligata, dettagli e criteri di completamento in `docs/DEVELOPMENT_ROADMAP.md`:
**M0** recovery e infrastruttura permanente → **M1** 3D vertical slice → **M2** character engine → **M3** character
creator → **M4** wardrobe system → **M5** animazioni e fisica → **M6** photo studio e stanze → **M7** integrazione,
polish e release. Una milestone non è completa se contiene funzioni fondamentali simulate o non testate; non iniziarne
di nuove solo per aumentare l'elenco delle funzioni dichiarate. **Lo stato reale è in `docs/PROJECT_STATUS.md`.**

## 11. Versioni

- La versione del prodotto è quella di `extension/manifest.json`; `DC.VERSION` (`src/shared/data.js`), `package.json`
  e `package-lock.json` devono coincidere (un test lo controlla).
- Si incrementa **solo al completamento di una milestone** (0.2.0 legacy → 0.3.0 con M1 … → 1.0.0 con M7), mai a ogni checkpoint.
- Lo ZIP installabile si crea solo per release o consegne significative.

## 12. Documenti permanenti (tenerli veri)

| File | Contenuto | Aggiornare quando |
|---|---|---|
| `CLAUDE.md` | Regole e protocolli (questo file) | cambia una regola o l'architettura di base |
| `AGENTS.md` | Istruzioni per qualsiasi agente; rimanda qui | cambia il flusso di lavoro |
| `docs/PROJECT_STATUS.md` | Stato **reale**: milestone, funzioni, test | a ogni checkpoint che cambia lo stato |
| `docs/NEXT_SESSION_HANDOFF.md` | Ripresa da una chat nuova, con `EXACT NEXT ACTION` | a ogni fine sessione (e a ogni checkpoint importante) |
| `docs/DEVELOPMENT_ROADMAP.md` | Milestone, priorità, criteri | cambia il piano o si completa una milestone |
| `docs/TECHNICAL_ARCHITECTURE.md` | Architettura implementata + contratti pianificati | si aggiunge o cambia un modulo |
| `docs/ASSET_CREDITS.md` | Asset, autori, licenze | **prima** di committare un asset |
| `docs/KNOWN_ISSUES.md` | Bug e limiti aperti | si scopre o si chiude un problema |
| `docs/WORK_LOG.md` | Cronologia sintetica | a ogni sessione |
| `docs/CHANGELOG.md` | Novità per versione | a ogni cambio di versione |
| `docs/HANDOFF.md`, `docs/ASSET_PIPELINE.md`, `docs/TODO.md` | Riferimento della v0.2 (contratti storage/messaggi, pipeline foto, backlog) | se cambiano quei contratti |

Non documentare funzioni inesistenti. Non sovrascrivere un documento senza averlo letto.

## 13. Ambiente di sviluppo

- Node ≥ 20 (`npm install` installa three, three-vrm, esbuild, playwright-core, sharp — solo sviluppo).
- Provare l'estensione a mano: `chrome://extensions` → Modalità sviluppatore → *Carica estensione non pacchettizzata* → cartella `extension/`.
- Banco di prova del motore 3D senza estensione: `node tools/dev/serve.mjs` → `http://127.0.0.1:8765/tools/dev/engine.html`.
- La pipeline Python delle teste (`tools/head_pipeline/`) richiede OpenCV, numpy e Pillow; serve solo per rigenerare i ritagli (di norma **non** va rieseguita).
