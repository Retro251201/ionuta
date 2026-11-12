# Guida per scrivere un capitolo de "La Principessa"

Leggi PRIMA `/projects/sandbox/ionuta/STORY_BIBLE.md` per intero (personaggi, tormentoni, il tuo capitolo e quelli vicini).

## Il file
- Scrivi SOLO `LaPrincipessa/game/chapterN.rpy` (sovrascrivi lo stub). Non toccare altri file.
- Struttura:
```
label capN:
    call titolo_capitolo("N", "Titolo del capitolo", "Valdorsa — mese")
    ...scene...
    return
```
- Indentazione: 4 spazi, mai tab. Nessuna label con nome già usato altrove: se ti servono label interne usa il prefisso `capN_` (es. `capN_dopo_scelta`).
- Variabili tue: `default capN_qualcosa = ...` (prefisso obbligatorio). Le scelte decorative globali sono già definite: `scelta_bevanda` ("te"/"caffe"), `scelta_pioggia` ("ombrello"/"giacca"), `scelta_mamma` ("verita"/"battuta").

## Lunghezza e scrittura
- **3.200–3.800 parole** di testo (narrazione + dialoghi) per capitolo. Scene intere, non riassunti. Controlla con lo script di lint (stampa il conteggio).
- Italiano. Narrazione in **prima persona, presente**, voce di Ionuț: ironica, frasi brevi, silenzi, malinconia improvvisa. Stile Z.A.T.O.: righe asciutte, pause `...`, `{w}` per le esitazioni, ogni tanto una parola in `{b}grassetto{/b}`.
- Ogni battuta/riga ≤ 220 caratteri (il box mostra ~3 righe). Spezza le righe lunghe in più battute.
- Valya parla un italiano preciso e antiquato con parole russe traslitterate (mai cirillico nel dialogo): *nu, ladno*, *bozhe moy*, *ty durak*, *spasibo*, *dorogoy*, *golubchik*, *Printsessa* (dal cap. 5).
- Comicità + malinconia + tenerezza. Niente volgarità, niente contenuti sessuali. Parolacce leggere ok (Rino, Dado).
- Caratteri speciali: per scrivere `[` usa `[[`; per `{` usa `{{`. Le virgolette dentro una battuta: usa « » oppure “ ”. Non usare `%` da solo.

## Personaggi (variabili Character)
`i` Ionuț · `v` Valya · `vg` Valya giovane (ricordi) · `r` Rino · `d` Dado · `g` Giulia · `m` Mario · `a` Arkadij · `x` Max · `lev` Lev (voce su nastro/radio) · `mamma` (solo telefono) · `prof` prof.ssa Benassi · `kevin` · `voce` (voci registrate, altoparlanti) · `tutti` · `infermiera` · `pubblico`.
- Narrazione: riga tra virgolette senza personaggio → `"Testo."`

## Sprite (base sul bordo del box, il cappello esce dalla cornice come in Z.A.T.O.)
- Mostra: `show valya seria at dx with dissolve` · cambia espressione: `show valya sorridente` oppure direttamente `v sorridente "Battuta."` (lo sprite deve già essere in scena).
- Posizioni: `centro`, `sx`, `dx`, `sx2`, `dx2`, `estrema_sx`, `estrema_dx`. Massimo 3 sprite insieme (di solito 1-2).
- Effetti posizionali combinabili: `at dx, saltello` (gag), `at sx, trema` (paura/rabbia), `at dx, entra_dx` (entra da destra), `at sx, entra_sx`, `at primo_piano` (close-up enorme, momenti forti).
- **Ionuț** quando NON è in scena compare automaticamente nel riquadro-ritratto del box quando parla: scrivi sempre la sua battuta con l'espressione, es. `i sarcastico "..."`. Se invece lo mostri (`show ionut sincero at sx`), l'attributo cambia lo sprite.
  Regola: nelle scene a due importanti mostra lo sprite di Ionuț (es. a sinistra) e l'altro a destra; nelle scene di passaggio basta il ritratto.

Attributi disponibili (usa SOLO questi):
- `ionut`: ironico, ironico_flip, enigmatico, enigmatico_sera, sarcastico, imbarazzato, imbarazzato_flip, comico, freddo · arrabbiato, furioso, cupo, sclero · sincero, sincero_flip, innamorato, vulnerabile, malinconico · ombra (silhouette nera)
  - V per Vendetta = maschera sociale/ironia; LED con le X = rabbia/notte/paura; mezza maschera bianca (sincero...) = quando smette di recitare (con Valya, momenti veri).
- `valya`: seria, sorridente, commossa, arrabbiata, nostalgica, profilo, triste, sera, ombra · `valya giovane` (solo nei ricordi del 1966-68)
- `rino`: normale, arrabbiato, sera, buono
- `dado`: ride, comico, sera, serio
- `giulia`: normale, sorride, seria, sera
- `mario`: normale, notte, serio, comico
- `arkadij`: freddo, arrabbiato, sera, triste
- `max`: spaccone, comico, deluso, sera
- Varianti "sera"/"notte"/"ombra" per le scene notturne; "comico"/"glitch" per le gag (con `with vpunch` o `with glitch_t`).

## Sfondi (`scene bg NOME with dissolve`)
negozio, negozio_sera, negozio_buio, laboratorio, laboratorio_notte, magazzino, saracinesca, saracinesca_notte, galleria, galleria_notte, galleria_vuota, galleria_natale, foodcourt, foodcourt_sera, scalemobili, chiosco_max, parcheggio_notte, parcheggio_neve, fermata_pioggia, strada_notte, strada_pioggia, fiume_nebbia, cameretta, cameretta_giorno, cucina_ionut, casa_valya, casa_valya_sera, ingresso_valya, cucina_valya, finestra_neve, tetto, tetto_notte, radio_shack, guardiola, stazione, cielo_stelle, mercatino, chiesa_ortodossa, chiesa_interno, ospedale, residenza, residenza_notte, tisaneria, teatro, murmansk, murmansk_porto, urss_strada, cimitero, nero, bianco, nero_totale (nero senza cornice)
- `scene` cancella sprite, oggetti e overlay: rimettili dopo se servono.

## CG a schermo intero (`scene cg NOME with lento`)
video_principessa, primo_incontro, radio_accesa, te_insieme, pioggia_ombrello, ballo, parcheggio_neve, ospedale, tetto_antenna, finale_radio, foto_lev, lettera, vhs_matrimonio, tutti_sul_tetto, murmansk_valya
- Dopo una CG torna a uno sfondo con `scene bg ... with dissolve`. Ogni CG va usata nel capitolo indicato dalla bible (puoi riusarne qualcuna come richiamo).

## Oggetti (al centro del pannello)
`show item radio with dissolve` … `hide item with dissolve`
radio, orologio, telefono, carillon, vhs, cassetta, samovar, tiara, smartphone, foto_antica, te, cacciavite

## Atmosfera (overlay, dopo `scene`)
`show pioggia`, `show neve`, `show neve_lenta`, `show vignetta` → `hide pioggia` ecc.
Filtro ricordo su tutto lo schermo: `show layer master at ricordo` … `show layer master at normale`. Notte: `at notte_blu`.

## Transizioni ed effetti
`with dissolve`, `with fade`, `with flash` (lampo bianco), `with flash_rosso`, `with flash_lungo`, `with lento`, `with lentissimo`, `with buio`, `with pixel`, `with glitch_t`, `with vpunch`, `with hpunch`, `with scivola`.
Pause: `pause 1.0`. Box nascosto per un'immagine: `window hide` … `window show`.

## Audio
- Musica: `play music m_NOME fadein 1.0` / `stop music fadeout 2.0`. Brani:
  m_menu (tema), m_negozio (quotidiano), m_galleria (muzak del centro), m_notte, m_valya (tema di Valya, valzer d'inverno), m_comico, m_comico2, m_tensione, m_tensione2, m_triste, m_triste2, m_romantico, m_ricordo (flashback), m_natale, m_speranza, m_neve (pianoforte lento), m_finale, m_notti_mosca (la canzone "Notti di Mosca", 1956), m_notti_mosca_radio (la stessa, filtrata come una radio lontana con fruscio)
- Effetti singoli: `play sound s_NOME`. Ambienti in loop: `play ambiente s_pioggia fadein 1.0` / `stop ambiente fadeout 1.0`.
  s_campanella (porta del negozio), s_pioggia*, s_tuono, s_folla*, s_applausi, s_risate, s_passi, s_passi_neve, s_saracinesca, s_saracinesca_blocco, s_cassa, s_bollitore, s_vento*, s_telefono_squillo, s_disco_telefono, s_campane, s_fuochi, s_sirena, s_porta, s_cassetta, s_nastro, s_annuncio, s_traffico*, s_orologio*, s_statica*, s_radio_sintonia, s_carillon, s_notifica, s_vibrazione, s_cacciavite, s_neon*, s_bus, s_battito*, s_glitch, s_schiaffo, s_tazza, s_scale_mobili*, s_cuore_monitor*  (* = adatti al loop sul canale `ambiente`)
- Ogni scena deve avere musica o ambiente adatti; cambia musica quando cambia l'umore.

## Helper
- SMS/chat: `call sms("MAMMA", "Hai mangiato? 🍝")` (attende un clic). Usa emoji semplici o niente emoji.
- Didascalia luogo/ora: `call didascalia("IL GIRASOLE — 19:58")` … `call via_didascalia`.
- Title card: già all'inizio del capitolo con `call titolo_capitolo`.

## Scelte decorative (solo cap. 2, 4, 7)
```
    menu:
        "Le porto il tè di Giulia.":
            $ scelta_bevanda = "te"
            i sincero "..."
        "Le prendo un caffè alla macchinetta.":
            $ scelta_bevanda = "caffe"
            i comico "..."
```
Poi `if scelta_bevanda == "te":` per variare 1-3 battute.

## Verifica (obbligatoria)
`bash /projects/sandbox/ionuta/tools/lint_chapter.sh N`
Correggi TUTTI gli errori del tuo file (immagini inesistenti, indentazione, label duplicate, parse error). Ripeti finché il lint non riporta errori nel tuo file. Il conteggio parole viene stampato in fondo.
