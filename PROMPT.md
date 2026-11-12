SEI UN TEAM DI SVILUPPO AUTONOMO. Devi consegnarmi una visual novel in Ren'Py completa, rifinita e SUBITO GIOCABILE, partendo solo da questo prompt. Non farmi domande e non chiedermi conferme: decidi tu tutto. Fermati solo se un problema è davvero impossibile da risolvere da solo. Non finire il lavoro finché il gioco non parte e non è giocabile dall'inizio alla fine senza errori.

=====================================================
0. REGOLE GENERALI
=====================================================
- Lingua del gioco: ITALIANO.
- Uso personale: NON preoccuparti di licenze e copyright. Prendi dalla rete tutto ciò che serve (Google Immagini, Bing, DuckDuckGo, Wikimedia, Pexels, Unsplash, Pixabay, Freesound, archive.org, OpenGameArt, YouTube Audio Library, ecc.).
- Non lasciare MAI placeholder, file mancanti, immagini vuote, scene senza sfondo o personaggi senza sprite. Ogni riferimento nello script deve puntare a un file che esiste davvero.
- FALLBACK OBBLIGATORIO: se un download fallisce o l'immagine è inutilizzabile, prova un'altra fonte o un'altra query (almeno 3 tentativi). Se ancora non va, GENERA tu l'asset con Python (Pillow/numpy: sfondi stilizzati in gradienti, sagome, rumore, dithering, vignettatura) in modo che sia comunque coerente con lo stile. Mai lasciare buchi.
- Lavora a fasi e tieni aggiornato un file PROGRESS.md nella cartella principale (fasi completate, asset scaricati, capitoli scritti, problemi aperti). Se vieni interrotto e ti dico "continua", riparti da PROGRESS.md.
- Puoi installare quello che ti serve (pip: pillow, numpy, opencv-python, rembg, requests, beautifulsoup4, icrawler o simili).
- Nella cartella del progetto trovi:
  * renpy-8.5.3-sdk/  (SDK di Ren'Py già pronto: usalo per creare il progetto, lanciare lint e testare. Se manca qualcosa, installalo/scaricalo tu.)
  * foto_amico/  (5 foto del personaggio principale, vedi sezione 2)

=====================================================
1. STILE E ATMOSFERA (riferimento: Z.A.T.O. // I Love the World and Everything In It)
=====================================================
Apri e studia la pagina Steam https://store.steampowered.com/app/4122860/ZATO_I_Love_the_World_and_Everything_In_It/ (descrizione, screenshot, trailer se riesci) e cerca altre immagini/recensioni del gioco per capirne lo stile. Ricrea quell'atmosfera:
- Estetica malinconica, notturna, urbana, minimalista, quasi "diario di un ricordo": palette scura e desaturata con accenti freddi (blu, ciano, grigio) e qualche tocco caldo (arancio/rosso) nelle scene romantiche.
- Sfondi fotografici/urbani trattati con filtri (alto contrasto, grana, dithering leggero, vignettatura, scanlines/CRT sottili), così tutti gli asset scaricati risultano coerenti tra loro anche se di fonti diverse. Scrivi uno script Python che applichi lo stesso "look" a TUTTI gli sfondi e CG.
- Sprite dei personaggi con lo stesso trattamento grafico (stesso filtro, stessa grana).
- Interfaccia custom (gui.rpy / screens.rpy): finestra di dialogo semitrasparente scura, font pulito (cerca e scarica font gratuiti da Google Fonts; es. monospazio o sans retro), nomi dei personaggi in evidenza, menu principale con titolo del gioco, sfondo animato leggero, schermate Salva/Carica/Opzioni coerenti. Splash iniziale e schermata titolo curati.
- Transizioni (dissolve, fade, flash, shake nei momenti comici/tesi), effetti di testo, musica che cambia con le scene, effetti sonori (campanella del negozio, passi, pioggia, folla del centro commerciale, notifica telefono...).
- Visual novel LINEARE (senza bivi complessi, ma puoi inserire 2-3 scelte "decorative" che cambiano solo qualche battuta). Un solo finale, ben costruito.

=====================================================
2. PERSONAGGIO PRINCIPALE: IONUȚ, detto "LA PRINCIPESSA"
=====================================================
Ionuț è un ragazzo che tutti chiamano scherzosamente "la Principessa" (è un maschio, ovviamente: il soprannome è un tormentone comico, nato da un episodio che racconti tu in modo divertente nel prologo). Ha appena finito la scuola, lavora in un negozio di riparazione (telefoni, computer, console, orologi) dentro un centro commerciale. Carattere: ironico, un po' goffo, sensibile, nasconde la malinconia dietro le battute.

SPRITE: nella cartella foto_amico/ ci sono 5 foto del ragazzo reale. Aprile e guardale tutte (hai capacità di vedere immagini; se serve usa Python per ispezionarle). Hanno quasi sempre il volto coperto da maschere, quindi usale così:
  * foto con maschera V per Vendetta + cappello (2 foto con cappello nero, 1 con cappello bianco) -> espressioni "ironico / enigmatico / sarcastico / imbarazzato nascosto"
  * foto con maschera LED nera con le X luminose + cappello nero -> espressione "arrabbiato / furioso / sclero / notte buia / momento cupo"
  * foto con mezza maschera bianca (Fantasma dell'Opera) senza cappello, faccia visibile -> espressione "sincera / vulnerabile / innamorata / scene romantiche e finale"
Procedura: con Python (rembg o OpenCV, con fallback manuale se rembg non funziona) rimuovi lo sfondo di ogni foto, ritaglia busto/mezzo busto, ridimensiona in modo coerente per Ren'Py (altezza circa 900-1000 px), applica il filtro stilizzato del gioco e salva PNG trasparenti in game/images/. Crea ALMENO 8-10 varianti di sprite (flip orizzontale, versione "sera/ombra", versione "fredda blu", versione "calda", versione "glitch/flash" per i momenti comici, ecc.) modificando luce, colore e filtri via codice, e mappale con nomi chiari (es. "ionut ironico", "ionut arrabbiato", "ionut sincero"...). Usa poi il sprite giusto per ogni battuta importante. Non lasciare mai Ionuț senza sprite quando è in scena.

=====================================================
3. TRAMA (sviluppala tu in profondità: deve essere avvincente, romantica, comica e malinconica insieme)
=====================================================
Ambientazione: oggi, una città italiana di provincia, centro commerciale. Stagione: autunno/inverno, tante sere, luci al neon, pioggia, parcheggi vuoti, il negozio di riparazioni "con la saracinesca che non si chiude bene".

Premessa: durante il lavoro, Ionuț si innamora di una cliente: una NONNINA RUSSA anziana, molto segnata dagli anni, con tante rughe, sciarpona, cappotto pesante, borsa della spesa, fazzoletto in testa, sguardo severo e un po' buffo. Si chiama Valentina Petrovna (la chiamano "Babushka Valya"). Porta ogni settimana un vecchio oggetto da riparare (una radio sovietica, un orologio, un telefono vecchio, una scatola musicale, una videocassetta/registratore...) e dietro ogni oggetto c'è un pezzo della sua storia (la giovinezza, un amore perduto, la patria lontana). L'innamoramento di Ionuț è l'asse romantico/assurdo/tenero della storia: trattalo con sincerità, ironia dolce e malinconia, mai in modo volgare; è un amore "impossibile" e bizzarro che diventa, tra comicità e commozione, una storia di solitudine, ascolto, nostalgia, crescita e di un ragazzo appena uscito dalla scuola che non sa cosa farà della sua vita. Niente contenuti sessuali o espliciti: romanticismo, gesti piccoli, sguardi, tè caldo, canzoni, ricordi.

Personaggi secondari (inventali e dai a ognuno un carattere): il capo del negozio, un collega amico che prende in giro la Principessa, la commessa del negozio accanto, la guardia giurata del centro commerciale, un nipote o un parente di Valentina che complica le cose, un rivale comico, ecc. Ognuno con sprite e immagine.

Struttura: scrivi tu un piano completo PRIMA di programmare (salvalo in STORY_BIBLE.md): personaggi, archi narrativi, 8-10 capitoli, colpi di scena, momenti comici, momento più triste, momento più romantico, finale memorabile (dolce-amaro). Ragiona bene su come rendere la storia coinvolgente, con ritmo, tormentoni ricorrenti (il soprannome, la saracinesca, un oggetto simbolo) e foreshadowing.

LUNGHEZZA: circa 3-5 ore di gioco. Obiettivo realistico: 25.000-40.000 parole di script, divise in 8-10 capitoli, ciascuno in un file separato (es. game/chapter1.rpy ... chapterN.rpy) richiamati da script.rpy. Dialoghi ben ritmati, narrazione in prima persona di Ionuț, battute, silenzi, descrizioni. Non fare riassunti: scrivi le scene per intero. Non fare una demo.

=====================================================
4. ASSET DA SCARICARE (nessuna scena scoperta)
=====================================================
Dalla storia ricava una lista completa (ASSETS.md) e scarica/crea tutto:
- BABUSHKA VALYA: cerca su Google/Bing immagini di una vera nonnina russa anziana, molto rugosa, con fazzoletto/sciarpa, cappotto, in posa ben visibile (primo piano o mezzo busto, sfondo semplice se possibile). Scarica più foto (anche 6-10), scegli le migliori, togli lo sfondo, applica il filtro del gioco e crea varianti di espressione (seria, sorridente, commossa, arrabbiata, nostalgica, di profilo) con ritagli, flip, luce, filtri, crop diversi. Se non trovi abbastanza foto diverse, usa più ricerche diverse.
- Tutti gli ALTRI PERSONAGGI: cerca immagini coerenti (persone reali o illustrazioni, stesso trattamento grafico), con almeno 3-4 varianti ciascuno per i principali.
- SFONDI: almeno 20-30 diversi, coerenti con le scene: interno ed esterno del negozio di riparazioni, corridoi e vetrine del centro commerciale, food court, scale mobili, parcheggio di notte, fermata dell'autobus sotto la pioggia, strada notturna, cameretta di Ionuț, casa di Valentina con tappeti, samovar e foto antiche, cucina, finestra con neve, tetto, stazione, cielo stellato, mercatino, cimitero o chiesa ortodossa (con rispetto), ecc.
- CG / scene speciali: almeno 6-10 immagini speciali per i momenti chiave (primo incontro, tè insieme, radio che si accende, ballo, pioggia, scena finale...), create combinando sfondo + sprite + effetti, oppure scaricate e filtrate.
- OGGETTI/ICONE: radio, orologio, telefono, scatola musicale ecc., con immagini scaricate.
- AUDIO: almeno 8-10 tracce musicali ambient/pianoforte/lo-fi/malinconiche in .ogg/.mp3 (menu, negozio, centro commerciale, notte, casa di Valentina, scena triste, scena romantica, finale) + 15-20 effetti sonori (campanella, pioggia, passi, folla, telefono, saracinesca, radio statica, orologio, ecc.). Converti in .ogg se serve (ffmpeg, scaricalo se non c'è).
- FONT scaricati e configurati nel gui.
Tutto in game/images/, game/audio/, game/gui/, game/fonts/. Usa definizioni "image ..." chiare e un unico file (es. game/assets.rpy) con tutti i nomi.

=====================================================
5. FASI DI LAVORO (esegui in ordine, aggiornando PROGRESS.md)
=====================================================
FASE 1 - Setup: crea il progetto Ren'Py (usa renpy-8.5.3-sdk, es. renpy.sh/renpy.exe con "launch"/"lint" o crea la struttura con lo script di creazione progetto), imposta risoluzione 1920x1080, titolo "La Principessa" (o un titolo migliore che scegli tu), lingua italiana, tema e config.
FASE 2 - Story bible: STORY_BIBLE.md completo (vedi sezione 3).
FASE 3 - Pipeline grafica: script Python per rimuovere sfondi, ritagliare, filtrare in stile Z.A.T.O., generare varianti. Elabora gli sprite di Ionuț dalle 5 foto.
FASE 4 - Download asset: immagini, audio, font, con fallback generativo.
FASE 5 - UI: gui.rpy, screens.rpy, menu, splash, effetti CRT/vignettatura, transizioni custom.
FASE 6 - Scrittura e programmazione di tutti i capitoli, un file per capitolo, usando davvero tutti gli sprite, sfondi, musiche, effetti e CG.
FASE 7 - Verifica: esegui il lint di Ren'Py (renpy.sh <cartella progetto> lint) e correggi TUTTI gli errori e gli avvisi sui file mancanti, indentazioni, label non definite, immagini non trovate. Poi, se puoi, avvia il gioco in modalità test/headless o scorri gli script per controllare che ogni label sia raggiungibile e il gioco arrivi al finale. Controlla anche che nessun file sia corrotto (apri tutte le immagini con Pillow, tutti gli audio con ffprobe).
FASE 8 - Rifinitura: controlla il ritmo della storia, i tormentoni, le battute, il finale. Controlla che nessun personaggio compaia senza sprite e che ogni scena abbia sfondo e musica adatti.
FASE 9 - Consegna: crea un file AVVIA.bat (o AVVIA.sh) che lanci il gioco con l'SDK, e un README.txt cortissimo con una sola riga: come avviarlo. Aggiorna PROGRESS.md con "COMPLETATO".

=====================================================
6. CRITERI DI SUCCESSO (non fermarti finché non sono tutti veri)
=====================================================
[ ] Il gioco parte da menu e arriva al finale senza errori.
[ ] Lint Ren'Py pulito.
[ ] Zero placeholder, zero file mancanti.
[ ] Ogni scena ha sfondo, musica e sprite coerenti con la storia.
[ ] Ionuț usa le sue foto elaborate; Babushka Valya ha immagini scaricate e varianti.
[ ] 3-5 ore di gioco, 8-10 capitoli, storia romantica, divertente, malinconica e con un finale forte.
[ ] Look coerente in stile Z.A.T.O. su tutto.

Quando hai finito, rispondimi solo con: come avviare il gioco e un riassunto di 5 righe di cosa hai fatto e di eventuali asset generati al posto di quelli scaricati.