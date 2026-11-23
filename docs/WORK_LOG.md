# Diario di lavoro

Cronologia sintetica, una voce per sessione (la più recente in alto). I dettagli tecnici stanno nei commit; lo stato
corrente in `PROJECT_STATUS.md`; la prossima azione in `NEXT_SESSION_HANDOFF.md`.

## Sessione 2 — 2026-11-10 (20:52–22:00 UTC) · rami `hoplite/kroton-65abd2ec` e `hoplite/kroton-65abd2ec--m1-vertical-slice`

Nuovo account dopo l'esaurimento dei crediti del precedente. Nessuna memoria della chat precedente.

| Commit | Contenuto |
|---|---|
| `e9d77c5` → `892c907` (PR #1, squash) | **M0**: recovery, documenti permanenti, test unitari, QA end-to-end, verifica licenze |
| `d04f21b` | **M1**: animazioni, capelli 3D, guardaroba a slot, camera, Character Engine, pagina di anteprima con fallback SVG |
| `3563c23` | **M1**: suite QA `stage`, versione 0.3.0, screenshot di riferimento, documenti |

**M1 — 3D vertical slice (completata, v0.3.0)**
- Animation Controller con clip native `idle` e `wave` (AnimationMixer sulle ossa normalizzate VRM), battito di
  ciglia, espressioni; Hair System (9 acconciature VRM con spring bone); Wardrobe Manager a slot indipendenti con
  maschera del corpo e rimbocco; Camera Controller; Character Engine; persistenza di `dc_avatar`.
- Pagina `src/stage/` nell'estensione, aperta da popup e opzioni (`openStage`), con ripiego automatico sul renderer SVG.
- Catalogo ridotto ai 6 capi realmente costruibili (rimosse felpa e abito da maid, senza ricetta).
- QA: 69 controlli (34 `legacy`, 35 `stage`); 49 test unitari. Due controlli instabili resi deterministici
  (badge del pomodoro, battito di ciglia).
- Verificata la presenza delle animazioni umanoidi CC0 di Mesh2Motion (un GLB per clip): base della prossima attività.

**Git e piattaforma**
- La PR #1 è stata unita automaticamente dalla piattaforma (squash) mentre lo sviluppo di M1 era in corso: il lavoro
  è proseguito su un ramo di proseguimento creato dal ramo predefinito aggiornato (regola ora in `CLAUDE.md` §5).
- La policy del workspace blocca gli heredoc eseguiti e i push senza refspec esplicito (annotato in `CLAUDE.md` §4).

**Recovery**
- Remoto `Retro251201/ionuta` con un solo ramo, `hoplite/kalymna-e1397fc3` (che è anche il ramo predefinito), fermo a
  `7dfe127`; nessuna Pull Request, nessun tag, nessuna modifica locale. Il ramo di questa sessione parte dallo stesso commit.
- Audit del codice: funzioni v0.2 integre; motore 3D presente ma solo nel banco di prova (dettagli in `PROJECT_STATUS.md` §6).
- Lavoro non pubblicato del vecchio account: il vecchio workspace non è accessibile. La documentazione di architettura
  citava file mai arrivati su GitHub (`src/stage/`, `core/character-engine.js`, `assets/anim/manifest.json`,
  `PROJECT_STATUS.md`, `KNOWN_ISSUES.md`, `MESSAGES.md`, `tools/qa/run-qa.mjs`, `tools/pipeline/package-zip.mjs`):
  o non sono mai stati scritti o sono andati persi con il workspace. **Non recuperabili.**

**M0 — infrastruttura permanente**
- Scritti `CLAUDE.md`, `AGENTS.md`, `docs/DEVELOPMENT_ROADMAP.md`, `PROJECT_STATUS.md`, `ASSET_CREDITS.md`,
  `KNOWN_ISSUES.md`, `WORK_LOG.md`, `NEXT_SESSION_HANDOFF.md`; riscritta `TECHNICAL_ARCHITECTURE.md`.
- Test unitari (`tools/tests/`, 35 test) e QA end-to-end con asserzioni (`tools/qa/run-qa.mjs`, 33 controlli sulla v0.2).
- Verifica delle licenze dentro i file (`tools/pipeline/audit-licenses.mjs`): 10 modelli, tutti CC0; riscontro sulle
  pagine ufficiali VRoid. Verificata anche la licenza CC0 delle animazioni Mesh2Motion (non integrate).
- Corrette le incoerenze di versione e gli script npm rotti.

## Sessione 1 — 2026-11-10 (19:24–20:09 UTC) · ramo `hoplite/kalymna-e1397fc3` · account precedente

Ricostruita dai commit (la chat non è disponibile).

| Commit | Contenuto |
|---|---|
| `c9cea07` | Import dello ZIP originale **Desktop Companion v0.2.0**, non modificato (estensione MV3 completa, foto, pipeline Python, screenshot QA) |
| `62924b0` | Toolchain npm, bundle vendor (three 0.187 + three-vrm 3.5.5), pipeline asset (avatar base e 9 acconciature CC0), Rendering Engine, Avatar Loader, Asset Manager, strumenti `tools/dev` |
| `391fe66` | Tassonomia del catalogo (19 slot, 30 stili) e schema della definizione di personaggio |
| `7dfe127` | Garment Forge (guscio, gonna a loft, bordi, calzature, maniche), Material System, texture del corpo ripulita, 6 set di texture del viso, misure delle teste per i capelli |

Numerazione delle milestone usata in quei messaggi («M1», «M2 parziale») **diversa** da quella attuale: vedi
`PROJECT_STATUS.md` §1.

## Prima del repository — v0.1.0 e v0.2.0

Sviluppate in chat senza Git e consegnate come ZIP (vedi `CHANGELOG.md` e `HANDOFF.md`).
