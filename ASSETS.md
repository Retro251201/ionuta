# ASSETS — La Principessa

Tutti gli asset passano dalla pipeline `tools/zato.py` (look Z.A.T.O.).

## Sfondi (bg) (50)
`bianco`, `cameretta`, `cameretta_giorno`, `casa_valya`, `casa_valya_sera`, `chiesa_interno`, `chiesa_ortodossa`, `chiosco_max`, `cielo_stelle`, `cimitero`, `cucina_ionut`, `cucina_valya`, `fermata_pioggia`, `finestra_neve`, `fiume_nebbia`, `foodcourt`, `foodcourt_sera`, `galleria`, `galleria_natale`, `galleria_notte`, `galleria_vuota`, `guardiola`, `ingresso_valya`, `laboratorio`, `laboratorio_notte`, `magazzino`, `mercatino`, `murmansk`, `murmansk_porto`, `negozio`, `negozio_buio`, `negozio_sera`, `nero`, `ospedale`, `parcheggio_neve`, `parcheggio_notte`, `radio_shack`, `residenza`, `residenza_notte`, `saracinesca`, `saracinesca_notte`, `scalemobili`, `stazione`, `strada_notte`, `strada_pioggia`, `teatro`, `tetto`, `tetto_notte`, `tisaneria`, `urss_strada`

## CG (15)
`ballo`, `finale_radio`, `foto_lev`, `lettera`, `murmansk_valya`, `ospedale`, `parcheggio_neve`, `pioggia_ombrello`, `primo_incontro`, `radio_accesa`, `te_insieme`, `tetto_antenna`, `tutti_sul_tetto`, `vhs_matrimonio`, `video_principessa`

## Sprite (53)
`arkadij_arrabbiato`, `arkadij_freddo`, `arkadij_sera`, `arkadij_triste`, `dado_comico`, `dado_ride`, `dado_sera`, `dado_serio`, `giulia_normale`, `giulia_sera`, `giulia_seria`, `giulia_sorride`, `ionut_arrabbiato`, `ionut_comico`, `ionut_cupo`, `ionut_enigmatico`, `ionut_enigmatico_sera`, `ionut_freddo`, `ionut_furioso`, `ionut_imbarazzato`, `ionut_imbarazzato_flip`, `ionut_innamorato`, `ionut_ironico`, `ionut_ironico_flip`, `ionut_malinconico`, `ionut_ombra`, `ionut_sarcastico`, `ionut_sclero`, `ionut_sincero`, `ionut_sincero_flip`, `ionut_vulnerabile`, `mario_comico`, `mario_normale`, `mario_notte`, `mario_serio`, `max_comico`, `max_deluso`, `max_sera`, `max_spaccone`, `rino_arrabbiato`, `rino_buono`, `rino_normale`, `rino_sera`, `valya_arrabbiata`, `valya_commossa`, `valya_giovane`, `valya_nostalgica`, `valya_ombra`, `valya_profilo`, `valya_sera`, `valya_seria`, `valya_sorridente`, `valya_triste`

## Ritratti (14)
`ionut_arrabbiato`, `ionut_comico`, `ionut_cupo`, `ionut_enigmatico`, `ionut_freddo`, `ionut_furioso`, `ionut_imbarazzato`, `ionut_innamorato`, `ionut_ironico`, `ionut_malinconico`, `ionut_sarcastico`, `ionut_sclero`, `ionut_sincero`, `ionut_vulnerabile`

## Oggetti (12)
`cacciavite`, `carillon`, `cassetta`, `foto_antica`, `orologio`, `radio`, `samovar`, `smartphone`, `te`, `telefono`, `tiara`, `vhs`

## Musica (19)
`comico`, `comico2`, `finale`, `galleria`, `menu`, `natale`, `negozio`, `neve`, `notte`, `notti_mosca`, `notti_mosca_radio`, `ricordo`, `romantico`, `speranza`, `tensione`, `tensione2`, `triste`, `triste2`, `valya`

## Effetti sonori (38)
`annuncio`, `applausi`, `battito`, `bollitore`, `bus`, `cacciavite`, `campane`, `campanella`, `carillon`, `cassa`, `cassetta`, `cuore_monitor`, `disco_telefono`, `folla`, `fuochi`, `glitch`, `nastro`, `neon`, `notifica`, `orologio`, `passi`, `passi_neve`, `pioggia`, `porta`, `radio_sintonia`, `risate`, `saracinesca`, `saracinesca_blocco`, `scale_mobili`, `schiaffo`, `sirena`, `statica`, `tazza`, `telefono_squillo`, `traffico`, `tuono`, `vento`, `vibrazione`

## Fonti
- Ionuț: le 5 foto in `foto_amico/` (scontorno BiRefNet-portrait, cel-shading, varianti di luce/colore/glitch/silhouette).
- Valya e personaggi secondari: foto reali da Bing Immagini (vedi `raw/p_*/sources.json`), scontornate e filtrate.
- Sfondi e oggetti: foto da Bing Immagini senza watermark (domini stock esclusi), vedi `raw/b_*/sources.json`, `raw/i_*/sources.json`.
- CG: composte via script (sfondo + sprite + effetti) in `tools/build_bg.py`.
- UI (cornici, grana, scanlines, logo, menu): generate via script in `tools/build_ui.py`.
- Musica: Kevin MacLeod (incompetech.com); "Podmoskovnye vechera" di V. Troshin (1956) da archive.org; versione "radio" filtrata con ffmpeg.
- Effetti: anteprime HQ da Freesound.org (vedi `raw/sfx/sources.json`), normalizzati e convertiti in OGG.
- Font: Courier Prime (Google Fonts).
