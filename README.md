# 🌸 Desktop Companion – Anime Girl (estensione Chrome) · v0.3.0

Una companion in stile *desktop mate* (tipo quelle di Steam) che vive sopra ogni pagina web e in una finestra "desktop".
Il **corpo** è un'anime girl vettoriale animata (SVG procedurale con sfumature morbide, **17 outfit**, capelli e accessori); la **testa** è la **tua foto reale ritagliata, non modificata e non cartoon** (5 varianti dalle foto fornite + **le tue foto caricate dalle opzioni**).

## Installazione (2 minuti)
1. Scarica o clona il repository.
2. Apri `chrome://extensions` → attiva **Modalità sviluppatore** (in alto a destra).
3. **Carica estensione non pacchettizzata** → seleziona la cartella **`extension/`** (quella che contiene `manifest.json`).
4. Fissa l'icona 🌸 nella barra. Si apre la pagina di benvenuto. Ricarica le schede già aperte.

Funziona su Chrome / Edge / Brave / Opera (Chromium ≥ 110).

## Funzioni
| Area | Cosa fa |
|---|---|
| Companion su ogni sito | cammina, corre, si siede, balla, saluta, dorme, **giravolta, cuore, stiracchiata, sbircia dal bordo (peek), barcolla se scorri veloce**; fisica con **trascina e lancia**, rimbalzi, capogiro |
| Interazioni | carezza (muovi il mouse sulla testa), colpetto (clic), chat (doppio clic), menu radiale (tasto destro) |
| Bisogni (tipo Tamagotchi) | sazietà, energia, felicità, affetto che calano nel tempo (anche offline, ridotto); umore che cambia animazioni e frasi |
| Economia | monete (tempo attivo, pomodoro, minigioco), negozio cibo/regali, 17 outfit sbloccabili, livelli/XP |
| Aspetto (v0.2) | corpo ridisegnato (curve morbide, ombre, mani), 6 acconciature dietro la foto + 9 colori, accessori (ali d'angelo/diavoletta/fata, coda di gatto, fiocco), 11 nuovi outfit (pigiama, tennis, estate, inverno, ufficio, miko, strega, Natale, gotico, cyber, maghetta) |
| Le tue teste (v0.2) | Opzioni → 📸 carica una foto: inquadra, gomma magica sullo sfondo, gomma/ripristina, ovale sfumato, ancora al collo, larghezza viso, colore pelle, anteprima dal vivo. **Solo ritaglio/scontorno: la foto non viene alterata** (max 12) |
| 15 obiettivi | con notifiche e ricompense |
| Pomodoro | focus/pause, badge sull'icona, avvisi della companion, contatori |
| Promemoria | acqua e postura configurabili |
| Chat | cervello offline (italiano, calcolatrice, ora/data, battute, motivazione…) **oppure IA** compatibile OpenAI (OpenAI, OpenRouter, Groq, Ollama, LM Studio) |
| Testo selezionato | tasto destro → "Fai leggere" (sintesi vocale) / "Chiedi" |
| Accesso | profilo locale con password (PBKDF2), opzione "richiedi password" (companion nascosta finché non accedi) |
| Finestra desktop | stanzetta in una finestra separata da lasciare in un angolo (Alt+Shift+W) |
| Anteprima 3D (v0.3) | finestra con il **personaggio 3D** animato (idle, saluto), 9 acconciature con fisica dei capelli, camera orbitale, qualità Low→Ultra; tutto in locale; se il 3D non è disponibile mostra il personaggio classico (popup → 🧊 Anteprima 3D) |
| Minigioco | morra cinese |
| Dati | backup/ripristino JSON, reset |

## Scorciatoie
- `Alt+Shift+C` mostra/nascondi · `Alt+Shift+S` chiama nella pagina · `Alt+Shift+W` finestra desktop
(modificabili in `chrome://extensions/shortcuts`)

## Struttura del repository
```
extension/      ← cartella da caricare in Chrome (MV3, nessuna build necessaria)
docs/           ← documentazione permanente: stato, roadmap, architettura, crediti, problemi noti, handoff
tools/          ← pipeline asset, banco di prova 3D, test unitari (tools/tests) e QA end-to-end (tools/qa)
source_photos/  ← foto originali (intoccabili)
CLAUDE.md       ← regole e protocolli di sviluppo · AGENTS.md ← riassunto per qualsiasi agente
```

## Stato dello sviluppo (verso la 1.0 Premium)
La parte classica (v0.2) è completa e verificata. È in corso l'evoluzione verso **Desktop Companion 1.0 Premium**:
personaggio 3D reale (Three.js + VRM, tutto in locale), character creator, guardaroba modulare, animazioni, photo
studio e stanze, mantenendo tutte le funzioni esistenti e il renderer SVG come fallback. La v0.3.0 contiene la prima
fetta: l'anteprima del personaggio 3D. Il companion che vive nelle pagine resta, per ora, quello SVG.
Lo stato reale, milestone per milestone, è in **[`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md)**; il piano in
[`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md); asset e licenze in [`docs/ASSET_CREDITS.md`](docs/ASSET_CREDITS.md).

## Privacy
Tutto resta in `chrome.storage.local` del browser. Nessun server. L'unica rete usata è l'endpoint IA **se** lo attivi tu (permesso richiesto solo per quell'origine).

## Sviluppo
```bash
npm install      # solo toolchain di sviluppo
npm test         # test unitari
npm run qa       # QA end-to-end sull'estensione reale (Chrome headless)
```
Per continuare lo sviluppo (umani o IA): leggi **[`CLAUDE.md`](CLAUDE.md)**, poi `docs/PROJECT_STATUS.md` e
`docs/NEXT_SESSION_HANDOFF.md`. I contratti di storage e messaggi della v0.2 sono in `docs/HANDOFF.md`.
