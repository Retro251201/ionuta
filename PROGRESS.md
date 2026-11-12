# PROGRESS — La Principessa (visual novel Ren'Py)

## STATO: COMPLETATO

## Fasi
- [x] FASE 0 — PROMPT.md e 5 foto (foto_amico/) recuperati dagli allegati; SDK Ren'Py 8.5.3 in renpy-8.5.3-sdk/ (non versionato: AVVIA lo scarica)
- [x] Studio stile Z.A.T.O. (6 screenshot Steam + header): pannello incorniciato 1464x604, box testo nero con bordo chiaro, nome "[NOME]", font tipo Courier, sfondi foto in gradient-map monocromatico + grana RGB + pixel 2x, sprite cel-shading con contorno bianco che escono dalla cornice, ritratto nel box di dialogo
- [x] FASE 1 — progetto LaPrincipessa/ (1920x1080, italiano), options/gui/screens custom
- [x] FASE 2 — STORY_BIBLE.md (10 capitoli, archi, tormentoni, foreshadowing)
- [x] FASE 3 — pipeline: tools/zato.py (filtri), build_sprites.py (scontorno BiRefNet-portrait), build_bg.py (sfondi/CG/oggetti), build_ui.py (UI)
- [x] FASE 4 — 51 sfondi, 15 CG, 53 sprite (19 di Ionuț dalle sue foto) + 19 ritratti, 12 oggetti, 19 musiche, 38 effetti, font Courier Prime → ASSETS.md, game/assets.rpy
- [x] FASE 5 — UI: menu con logo glitch e neve, grana animata + scanlines, title card, SMS, didascalie, scelte, salva/carica/opzioni/cronologia in stile
- [x] FASE 6 — 10 capitoli, 37.700 parole (~3.000 blocchi di dialogo), 3 scelte decorative
- [x] FASE 7 — lint pulito; partita completa automatica headless (Xvfb + llvmpipe) dal menu ai titoli di coda senza errori; 168 immagini e 57 audio verificati
- [x] FASE 8 — continuità tra capitoli corretta (frase della neve, 4:17, Magnolie, biglietto di Arkadij, saracinesca), overlay pioggia/neve dentro il pannello, layout menu e salvataggi
- [x] FASE 9 — AVVIA.bat / AVVIA.sh, README.txt

## Capitoli (parole)
1 La saracinesca 3710 · 2 Spidola 3555 · 3 Pobeda 3596 · 4 Il numero che non esiste 3766 · 5 Notti di Mosca 3746 · 6 Arkadij 3914 · 7 VHS 3935 · 8 Il nastro 3957 · 9 Trasmissione 3557 · 10 Tutto quello che si può aggiustare 3969

## Asset generati invece che scaricati
- Le 15 CG sono composizioni via script (sfondi + sprite + effetti); l'antenna della CG del tetto è disegnata.
- Tutta la UI (cornici, grana, scanlines, vignettatura, logo, sfondo menu, icona).
- Versione "radio" di Notti di Mosca: filtrata con ffmpeg dalla registrazione del 1956.

## Note tecniche
- Python: /projects/sandbox/work/venv. U2NET_HOME=/projects/sandbox/work/u2net. Lint: serve HOME scrivibile.
- Test headless: game/zz_autotest.rpy (attivo solo con LP_AUTOTEST=1 / LP_MENUSHOT=1).
- NON aggiungere guisupport.rpy del template: rigenera le immagini gui sovrascrivendo quelle custom.
