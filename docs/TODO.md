# TODO – backlog storico della v0.2

> Il piano di sviluppo verso la 1.0 Premium è in `DEVELOPMENT_ROADMAP.md`; i problemi aperti in `KNOWN_ISSUES.md`.
> Qui resta il backlog delle migliorie alla parte v0.2 (priorità decrescente), da riprendere quando la roadmap lo consente.

- [x] ~~Test unitari node per data.js/brain.js~~ → sessione 2 (`tools/tests/`, `npm test`); restano tick del SW e `cleanHead`, coperti solo dalla QA end-to-end.
- [x] ~~Caricamento foto personalizzata dalle opzioni (ritaglio in-browser)~~ → v0.2.0
- [x] ~~Capelli opzionali dietro la testa + cel-shading del corpo~~ → v0.2.0
- [x] ~~Animazioni: peek, reazione allo scroll~~ → v0.2.0 (restano arrampicata/appesa/seduta su elementi)
- [x] ~~Nuovi outfit~~ → v0.2.0 (17 totali)
- [ ] Rifare l'alpha delle teste incluse con rembg/SAM (soprattutto head_03 bordo destro).
- [ ] Editor teste: lazo/poligono, scontorno automatico (modello ONNX locale, es. MODNet/rembg in WASM), modifica ancora di una foto già salvata.
- [ ] Foto caricate su siti con CSP `img-src` restrittiva: valutare rendering via `createImageBitmap` + canvas (oggi fallback alla testa predefinita).
- [ ] Verificare a occhio le nuove pose in pagina (seduta con gonne lunghe miko/strega, cuore, giravolta, peek su schermi piccoli).
- [ ] Animazioni: arrampicata sui bordi, appesa in alto, seduta su elementi della pagina (h1/img).
- [ ] Espressioni del corpo (spalle/postura per umore), outfit stagionali a tempo.
- [ ] i18n inglese (`_locales`).
- [ ] Wrapper Electron/Tauri per un vero desktop (trasparente, always-on-top, click-through).
- [ ] Memoria a lungo termine per l'IA (riassunto della chat nel prompt).
- [ ] Altri minigiochi + eventi stagionali.
- [ ] Verifica su Windows/macOS reali e siti con CSP restrittive.
- [ ] Pagina "statistiche" con grafici (umore/giorni).
