# Changelog

Una voce per **versione dell'estensione** (la versione cambia solo al completamento di una milestone: vedi `CLAUDE.md` §11).
Il lavoro in corso tra una versione e l'altra è descritto in `PROJECT_STATUS.md` e `WORK_LOG.md`.

## In sviluppo – verso la 1.0 Premium
- Prossima milestone: M2 (character engine). Vedi `PROJECT_STATUS.md`.

## v0.3.0 – 10 nov 2026 (anteprima del personaggio 3D)
- **Anteprima 3D**: nuova finestra (popup → «🧊 Anteprima 3D», oppure Opzioni → Aspetto) con un vero personaggio 3D
  — mesh, scheletro umanoide, skinning, materiali toon con contorni, ombre — reso in locale con three.js e three-vrm
  inclusi nel pacchetto (nessuna rete).
- **Animazioni scheletriche**: idle con respirazione, spostamento del peso e battito di ciglia; gesto di saluto con
  sorriso e ritorno morbido all'idle.
- **Capelli 3D**: 9 acconciature commutabili con fisica (spring bone); la scelta resta salvata.
- **Outfit iniziale a capi separati** (intimo, T-shirt, gonna a pieghe, calze, mocassini) costruiti sul corpo: ogni
  capo occupa il proprio slot.
- **Camera** con tre inquadrature, rotazione e zoom; **qualità grafica** Low / Medium / High / Ultra con statistiche reali.
- **Fallback**: se WebGL non è disponibile la finestra mostra il personaggio SVG classico con la tua testa fotografica.
- Backup e ripristino includono la configurazione del personaggio 3D (`dc_avatar`).
- Il companion nelle pagine web e nella finestra desktop resta quello SVG: nessuna funzione esistente è cambiata.
- Sviluppo: repository Git con documentazione permanente, 49 test unitari, 69 controlli QA end-to-end, registro delle licenze.

## v0.2.0 – 10 nov 2026 (aspetto + le tue teste)
- **Corpo ridisegnato** (`body.js` riscritto): silhouette morbida con curve di Bézier al posto dei poligoni, gradienti e ombre (cel-shading leggero), mani, collo raccordato alla foto, gambe/braccia affusolate. Stile anime carino, non volgare.
- **Capelli** opzionali disegnati *dietro* la foto (6 stili: nessuno, lunghi lisci, mossi, caschetto, codini, coda alta) + 9 colori; ondeggiano con il movimento (`hairSway`).
- **Accessori** sulla schiena: ali d'angelo, ali da diavoletta, ali di fata, coda di gatto, fiocco gigante (popup/opzioni).
- **11 nuovi outfit** (17 totali): pigiama, tennis, estate, inverno, ufficio, miko, strega, Natale, gotico, cyber, maghetta.
- **Le tue teste**: nuova sezione Opzioni → 📸 con editor canvas (inquadra/zoom/rotazione, gomma magica a tolleranza, gomma e ripristino a pennello, ovale sfumato, ancora collo, guide larghezza viso, campionamento colore pelle, annulla, anteprima dal vivo). Esporta WebP/PNG ≤ 512 px con alpha. **I pixel della foto non vengono modificati** (solo alpha/ritaglio).
- SW: messaggi `heads:list/add/update/remove` con validazione (solo `data:image/png|webp`, ≤ ~1,5 MB, campi limitati), max 12, nuova chiave `dc_customHeads`, inclusa in export/import; permesso `unlimitedStorage`.
- Nuove animazioni: 🌀 giravolta, 💖 cuore, stiracchiata, **peek** (va al bordo e sbircia), **barcollare** con scroll veloce; seduta adattiva per gonne lunghe.
- Nuove frasi, obiettivi 🧺 Collezionista (8 outfit) e 📸 La mia faccia; azione `twirl`.
- Popup Stile: tutte le teste (incluse le tue), capelli, colori, accessori, pulsante "Carica la tua foto". Opzioni: sezione 👗 Aspetto.
- Fallback testa: se un'immagine non si carica (es. CSP del sito) torna alla testa predefinita.
- **Fix**: la finestra desktop rispondeva a *tutti* i messaggi runtime e "rubava" le risposte dei `DC.send` (chat/teste rotte con la finestra aperta). Ora risponde solo a `summon/say/speak`.
- QA estesa (`tools/qa/run.js`): flusso editor end-to-end, heads:* (aggiunta, rifiuto SVG, update con clamp, rimozione con reset a head_04), twirl, screenshot nuovi.

## v0.1.0 – 10 nov 2026 (prima versione completa)
- 5 teste ritagliate dalle foto originali (non modificate) + icone.
- Corpo anime SVG procedurale con 6 outfit e pelle adattata alla testa.
- Companion su ogni pagina: macchina a stati, fisica trascina/lancia, carezze, menu radiale, fumetti, emote, voce, commenti ai siti.
- Service worker: bisogni, livelli, monete, negozio, 15 obiettivi, pomodoro con badge, promemoria acqua/postura, menu contestuali, scorciatoie, notifiche, backup.
- Chat: cervello offline italiano + IA compatibile OpenAI opzionale (preset OpenAI/OpenRouter/Groq/Ollama/LM Studio).
- Accesso: profilo locale con password PBKDF2, blocco tentativi, "richiedi password".
- Popup a 7 schede, pagina opzioni completa con benvenuto, finestra desktop (stanzetta).
- QA Playwright: test funzionali SW (chat, auth, feed, buy, game, pomodoro) superati; fix scroll orizzontale popup e posa seduta.
