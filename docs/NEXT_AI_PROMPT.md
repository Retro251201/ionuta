# Prompt da incollare in una chat nuova

Il progetto vive nel repository, non nella chat. In una sessione nuova (qualsiasi account o modello) basta questo:

```
Progetto: Desktop Companion 1.0 Premium — repository https://github.com/Retro251201/ionuta
Non ripetere il bootstrap del progetto. Segui il protocollo permanente già documentato:
1. Leggi CLAUDE.md, AGENTS.md, docs/PROJECT_STATUS.md e docs/NEXT_SESSION_HANDOFF.md.
2. Controlla Git e individua la revisione più recente (CLAUDE.md §3): se un ramo remoto hoplite/* o una Pull Request
   aperta sono più avanti del ramo di lavoro, portali dentro solo in fast-forward. Se CLAUDE.md non c'è nel ramo
   corrente, il lavoro più recente è su un altro ramo remoto: cercalo con `git ls-remote --heads origin`.
3. Esegui npm install, npm test e npm run qa: la base deve essere verde.
4. Riprendi dalla EXACT NEXT ACTION dell'handoff e prosegui la milestone corrente.
5. Salva con checkpoint piccoli e frequenti (commit + push + hash remoto verificato) e, prima di fermarti, aggiorna
   PROJECT_STATUS, WORK_LOG, KNOWN_ISSUES e NEXT_SESSION_HANDOFF e la Pull Request verso il ramo predefinito.
Alla fine riferisci: recovery, sviluppo, QA, GitHub (ramo, hash, push verificato sì/no) e prossima azione esatta.
```

## Vincoli non negoziabili (riassunto; testo completo in `CLAUDE.md` §6)

1. Le teste in `extension/assets/heads/` e le foto in `source_photos/` sono fotografie reali: non si stilizzano, non si
   ridisegnano, non si modificano. Solo ritaglio, alpha e ancoraggio.
2. Tutte le funzioni della v0.2 restano funzionanti; il renderer SVG resta come legacy e come fallback del 3D.
3. Il service worker è l'unica fonte di verità dello stato; le interfacce comunicano con `DC.send`.
4. Prodotto offline: librerie e asset locali, nessun servizio esterno obbligatorio.
5. Niente funzioni finte, niente asset senza licenza verificata, personaggi chiaramente adulti.
6. Interfaccia e documentazione in italiano.
