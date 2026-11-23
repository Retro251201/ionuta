# Roadmap di sviluppo — Desktop Companion 1.0 Premium

Sequenza obbligata di milestone concrete. Lo **stato reale** di ciascuna è in `PROJECT_STATUS.md`; qui ci sono
contenuti, priorità e **criteri di completamento**. Regole:

- Una milestone è completa solo se **tutti** i criteri sono soddisfatti e verificati da test eseguiti (automatici dove
  possibile, più verifica visiva sugli screenshot). Niente funzioni fondamentali simulate.
- Non si inizia una milestone nuova per aumentare l'elenco delle funzioni: prima qualità reale, poi quantità.
- Ogni milestone preserva le funzioni v0.2 (suite `legacy` verde) e il funzionamento offline.
- La versione dell'estensione si incrementa al completamento di ogni milestone (vedi `CLAUDE.md` §11).

Priorità trasversali, in ordine: **1.** conservazione dei dati e del lavoro (Git, backup, migrazioni) ·
**2.** stabilità delle funzioni esistenti · **3.** qualità visiva del personaggio · **4.** profondità della
personalizzazione · **5.** quantità di contenuti.

---

## M0 — Recovery e infrastruttura permanente

Rendere il progetto trasferibile tra account e sessioni.

- [x] Recupero del ramo precedente e verifica dei commit su GitHub
- [x] Audit del codice (funzioni reali vs dichiarate) e delle incoerenze
- [x] Verifica delle funzioni esistenti (QA end-to-end sull'estensione reale)
- [x] Toolchain verificata (versioni, bundle vendor, script npm funzionanti)
- [x] `CLAUDE.md`, `AGENTS.md` e documenti permanenti in `docs/`
- [x] Test automatici di base (`npm test`, `npm run qa`)
- [x] Primo checkpoint con push verificato e handoff iniziale

**Criteri**: una sessione nuova, senza contesto, riesce a capire stato e prossima azione leggendo solo il repository;
`npm test` e `npm run qa` passano; l'hash remoto coincide con quello locale.

## M1 — 3D vertical slice ✅ (v0.3.0)

Un vero personaggio 3D renderizzato dentro l'estensione, dall'inizio alla fine, su una fetta sottile ma reale.

- [x] Three.js + WebGL con librerie **locali** (bundle vendor)
- [x] Caricamento locale di un modello VRM con licenza verificata (CC0)
- [x] Camera (inquadrature, orbita, zoom), illuminazione, ombre, materiali toon
- [x] Personaggio presentabile: corpo, viso, capelli e un outfit iniziale
- [x] Animazione scheletrica di base (idle con respirazione e battito di ciglia, transizione verso il saluto)
- [x] Pagina dell'estensione che ospita il renderer (`src/stage/`), raggiungibile da popup e opzioni
- [x] **Fallback SVG** automatico quando WebGL o il modello non sono disponibili
- [x] Test automatici (unitari + QA sul renderer nell'estensione reale) e screenshot QA

**Criteri**: nell'estensione caricata in Chrome la pagina 3D mostra il personaggio animato senza errori JS/CSP e senza
richieste di rete esterne; con WebGL disattivato compare il personaggio SVG; il companion SVG nelle pagine web e tutte
le funzioni v0.2 continuano a funzionare; le ossa si muovono davvero tra due fotogrammi (test).

## M2 — Character engine

- Libreria di animazioni scheletriche reali: clip **retargetizzate** da fonti con licenza verificata (camminata,
  corsa, seduta, saluto, danza, sonno, stiracchiata…) oltre alle clip native — **prossima attività**
- Avatar loader robusto (errori, modelli multipli, rilascio memoria)
- Pose statiche e gestione delle espressioni facciali supportate dal modello (15 espressioni VRM + morph `Fcl_*`)
- Sguardo verso un punto (occhi + testa), umore → espressione
- Configurazione persistente: definizione di personaggio in `chrome.storage.local` (`dc_avatar`) con migrazione dalle
  impostazioni v0.2 e inclusione in backup/ripristino (**fatto in M1**); look e possesso tramite service worker (M4)
- Scelta del renderer (`svg` | `3d`) nelle impostazioni; finestra desktop con il personaggio 3D collegato a bisogni e umore

**Criteri**: ogni clip elencata è riproducibile e visibilmente corretta; le transizioni sono sfumate; la definizione
di personaggio sopravvive a riavvio, backup e ripristino; i dati v0.2 esistenti migrano senza perdite (test).

## M3 — Character creator

- Corpo: altezza, proporzioni, corporatura, spalle, vita, fianchi, gambe, braccia (morph target generati e/o
  proporzioni ossee — non una scala uniforme del modello), sempre entro proporzioni adulte
- Viso: forma, occhi (forma, colore, set di texture), sopracciglia, naso, bocca, trucco, dettagli
- Capelli: acconciature (corti, medi, lunghi, raccolti, code, frange), colori personalizzati, ciocche, accessori
- Colori di pelle, occhi, capelli; anteprima 3D centrale; salvataggio e ripristino
- Modalità testa fotografica selezionabile come alternativa al viso 3D

**Criteri**: ogni controllo produce un cambiamento **visibile e persistente**; nessun controllo decorativo; i capi
indossati seguono le modifiche del corpo; test sulla persistenza e sui limiti dei valori.

## M4 — Wardrobe system

- Wardrobe Manager a **slot indipendenti** (19 slot già definiti nella tassonomia)
- Regole di compatibilità e sovrapposizione (vestito intero vs sopra/sotto, capospalla, calze sotto le scarpe…),
  risoluzione del clipping (maschere del corpo, rimbocco, compressione dei capi interni)
- Catalogo reale: ogni voce ha una ricetta costruibile dalla Garment Forge; copertura progressiva delle categorie e
  delle 30 famiglie di stile; accessori rigidi (cappelli, occhiali, gioielli, ali, code)
- Materiali, colori, pattern, varianti e parametri regolabili per capo
- Armadio con **miniature reali** renderizzate, filtri, ricerca
- Inventario ed economia: possesso e acquisto tramite service worker (monete/livelli esistenti), capi iniziali gratuiti,
  migrazione degli outfit v0.2 già sbloccati
- Look salvati

**Criteri**: cambiare un capo non modifica gli altri slot; nessun capo mostrato è fittizio (test: ogni voce del
catalogo si costruisce senza errori); nessuna compenetrazione evidente nelle pose di riferimento; acquisti e look
persistono e rientrano nel backup.

## M5 — Animazioni e fisica

- Macchina a stati del companion in 3D (idle, cammina, corre, siede, dorme, saluta, balla, si stiracchia, reagisce…)
  collegata a bisogni e umore come nella v0.2
- Blending e transizioni; pose speciali (fotografica, elegante, kawaii, idol, rilassata, fashion, combattimento)
- Fisica secondaria con Spring Bone: capelli, gonne, nastri, fiocchi, accessori pendenti; collider del corpo
- Interazioni: trascinamento, clic, carezza, richiamo, menu radiale, sguardo al cursore
- Ottimizzazione: frequenza della fisica per preset, sospensione fuori schermo

**Criteri**: nessuna animazione fatta di rotazioni casuali; la fisica è stabile a 30 e 60 FPS; le interazioni v0.2
hanno un equivalente 3D funzionante.

## M6 — Photo studio e stanze

- Photo studio: camera libera, rotazione, zoom, inquadrature, pose, espressioni, luci, sfondi, scatto e salvataggio
  dell'immagine, galleria locale (IndexedDB)
- Stanze 3D: camera giapponese moderna, kawaii, appartamento elegante, studio, fantasy, cyberpunk, minimalista,
  giardino, spiaggia, notturna — con arredi, luci, oggetti interattivi e personalizzazione
- Asset di ambiente solo con licenza verificata o generati proceduralmente in locale

**Criteri**: lo scatto produce un file immagine reale alla risoluzione richiesta; ogni stanza elencata è caricabile e
navigabile; gli oggetti interattivi reagiscono davvero.

## M7 — Integrazione e polish

- Interfaccia definitiva (dark mode elegante, identità giapponese contemporanea, transizioni, layout responsive,
  character creator con viewport 3D centrale, armadio con miniature)
- 3D come renderer predefinito **dopo** test reali, con fallback SVG; companion 3D nelle pagine web (iframe/overlay)
  compatibilmente con MV3 e con le CSP dei siti
- Prestazioni: LOD, texture compresse dove opportuno, riduzione dei draw call, gestione memoria GPU, preset qualità
- Backup/ripristino completi di tutti i nuovi dati; migrazioni verificate
- Test completi, screenshot QA aggiornati, documentazione utente italiana, limiti documentati
- Script di pacchetto e **ZIP installabile**; versione 1.0.0

**Criteri**: checklist QA di `CLAUDE.md`/parte 19 del brief interamente eseguita e documentata; nessun errore in
console; funzionamento offline verificato; ZIP installato e provato da zero.

---

## Fuori roadmap (solo dopo la 1.0, come progetti separati)

Wrapper desktop reale (Electron/Tauri) con finestra trasparente e sempre in primo piano; i18n inglese; sincronizzazione
opzionale; voci TTS migliori. Il backlog storico della v0.2 è in `TODO.md`.
