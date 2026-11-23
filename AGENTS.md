# AGENTS.md — istruzioni per gli agenti di sviluppo

Progetto: **Desktop Companion** (verso la *1.0 Premium*) — estensione Chrome MV3 con companion desktop.
Repository: <https://github.com/Retro251201/ionuta>.

Le regole complete, i protocolli e i vincoli stanno in **[`CLAUDE.md`](CLAUDE.md)**: valgono per qualsiasi agente o
modello, non solo per Claude. Questo file ne è il riassunto operativo; in caso di dubbio vale `CLAUDE.md`, e in caso di
conflitto tra documentazione e codice vale il codice.

## Avvio di una sessione

1. Leggi `CLAUDE.md`, poi `docs/PROJECT_STATUS.md` e `docs/NEXT_SESSION_HANDOFF.md`.
2. Controlla Git e trova la revisione più recente (protocollo di ripresa, `CLAUDE.md` §3). Non dare per scontato che
   il ramo predefinito sia il più avanti.
3. `npm install` (se serve), `npm test`, `npm run qa`: la base deve essere verde.
4. Esegui la `EXACT NEXT ACTION` dell'handoff. Non ripetere il bootstrap, non rifare lavoro documentato.

## Durante il lavoro

- Checkpoint piccoli e frequenti: diff → test → documentazione → commit → push con refspec esplicito → **hash remoto
  verificato** (`CLAUDE.md` §4). Il lavoro non pubblicato su GitHub è lavoro che si può perdere.
- Solo operazioni Git non distruttive; mai push sul ramo predefinito, mai force push (`CLAUDE.md` §5).
- Agisci in autonomia sulle scelte tecniche; chiedi solo se manca un'informazione che blocca davvero.

## Vincoli che non si discutono (`CLAUDE.md` §6)

- Le fotografie originali (`source_photos/`, `extension/assets/heads/`) non si toccano, mai.
- Le funzioni della v0.2 restano funzionanti (suite `legacy` verde); il renderer SVG resta come legacy e fallback.
- Prodotto offline: nessun CDN, backend, account o chiave API obbligatori.
- Niente funzioni simulate, pulsanti finti o voci di catalogo fittizie; niente "completato" senza test eseguiti.
- Asset solo con licenza verificata e registrata in `docs/ASSET_CREDITS.md`.
- Personaggi chiaramente adulti; stile sensuale ammesso solo se non esplicito.

## Prima di fermarti

Test → aggiorna `docs/PROJECT_STATUS.md`, `docs/WORK_LOG.md`, `docs/KNOWN_ISSUES.md` → riscrivi
`docs/NEXT_SESSION_HANDOFF.md` con una `EXACT NEXT ACTION` precisa (file, funzione, risultato atteso, test) →
commit → push → verifica dell'hash remoto → Pull Request verso il ramo predefinito aggiornata.

## Comandi

```bash
npm install            # toolchain di sviluppo (l'estensione non richiede build)
npm test               # test unitari
npm run qa             # QA end-to-end sull'estensione reale (Chrome headless; variabile CHROME per il percorso)
npm run licenses       # licenze dichiarate dentro i modelli distribuiti
npm run vendor         # rigenera extension/vendor/three.bundle.js dopo un aggiornamento di three / three-vrm
node tools/dev/serve.mjs                       # server statico per il banco di prova (tools/dev/engine.html)
node tools/dev/shot.mjs '<pagina>' out.png     # screenshot headless per la verifica visiva
```
