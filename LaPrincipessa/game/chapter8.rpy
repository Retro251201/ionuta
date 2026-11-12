## CAPITOLO 8 — "Il nastro"
## Dicembre, Natale. L'ospedale, la saracinesca, il vano batterie aperto,
## la voce di Lev sulla cassetta, la rivelazione dei 42 anni di trasmissioni.

label cap8:
    call titolo_capitolo("8", "Il nastro", "Valdorsa — Natale")

    # ------------------------------------------------------------
    # 1. OSPEDALE — IL CORRIDOIO
    # ------------------------------------------------------------
    scene bg ospedale with lento
    play ambiente s_cuore_monitor fadein 2.0
    play music m_triste fadein 3.0
    call didascalia("OSPEDALE DI VALDORSA — 23 DICEMBRE, 16:40")

    "Nel corridoio di Medicina c'è un albero di Natale di plastica, alto come un bambino. Lampeggia a un ritmo che non riesco a seguire."
    "Da una porta socchiusa arriva un bip. Regolare. Paziente. Il rumore di qualcuno che conta per te."

    call via_didascalia

    "Nella tasca della giacca ho una caramella Mishka. La giro tra le dita come se fosse un sasso portafortuna."

    play sound s_passi
    show ionut malinconico at sx with dissolve
    show arkadij triste at dx, entra_dx

    "Arkadij esce dalla stanza in fondo. Senza cappotto. Senza telefono in mano, per la prima volta."
    "Ha la camicia stropicciata e la barba di due giorni. Sembra un uomo a cui hanno tolto le batterie."

    a triste "Lei."
    i sincero "Buonasera."
    a triste "Non è sera. Sono le cinque meno venti."
    i ironico "In ospedale è sempre sera. Lo dice il colore dei muri."
    a triste "..."

    a triste "È stabile. Così dicono. Ipotermia lieve, una botta al fianco. Niente di rotto."
    a triste "Il problema non è il fianco."
    i malinconico "Lo so."
    a freddo "No. Lei non lo sa. Io sono qui da sabato notte. Lei no."
    "Ha ragione. E lo dice senza cattiveria, come si legge un estratto conto."

    a triste "Ieri mattina ha chiesto di lei. «Dov'è il ragazzo con la maschera». Così ha detto."
    a triste "Oggi non ha chiesto di nessuno."
    "Il bip dalla porta socchiusa continua. Uno. Uno. Uno."
    a triste "Ha detto all'infermiera che deve tornare al centralino. Che le navi chiamano e non c'è nessuno."
    a triste "L'infermiera le ha detto che ci pensa lei, alle navi. E lei si è calmata. Capisce? Si è calmata."

    "Arkadij si passa una mano sugli occhi. Una sola volta, veloce, come per togliere un moscerino."
    a triste "Cinque minuti."
    i sincero "Come?"
    a triste "Cinque minuti. Non la agiti. Non le dica chi è, se non lo chiede. Non pianga lì dentro."
    a triste "Io sono stanco, signor... Principessa. Sono troppo stanco anche per avere ragione."
    i sincero "Grazie."
    a triste "Non mi ringrazi. Entri, prima che cambi idea."

    hide arkadij with dissolve
    hide ionut with dissolve

    # ------------------------------------------------------------
    # 1b. LA STANZA — «LEI CHI È?»
    # ------------------------------------------------------------
    stop music fadeout 2.0
    window hide
    scene cg ospedale with lento
    pause 2.0
    window show

    "La stanza è piccola. Due letti, uno vuoto. La finestra dà sul parcheggio, e sul parcheggio nevica piano."
    "Lei è lì."
    "Senza il fazzoletto a fiori. Non l'avevo mai vista senza. Ha i capelli bianchi, sottilissimi, raccolti con una molletta di plastica dell'ospedale."
    "È più piccola. Non è possibile che una persona diventi più piccola in quattro giorni. Eppure."
    "Il monitor accanto al letto disegna una linea verde che sale e scende. Come la lancetta della Spidola quando cerca una stazione."

    play music m_triste fadein 3.0
    scene bg ospedale with dissolve
    show ionut sincero at sx with dissolve
    show valya triste at dx with dissolve

    i sincero "Valya."
    "Lei gira la testa. Lentamente. Mi guarda."
    "E nello sguardo non c'è niente. Né il giudizio delle sopracciglia, né l'ironia. Una finestra pulita. Dietro, nessuno."
    v seria "Buongiorno."
    i sincero "Buongiorno... Sono venuto a vedere come sta."
    v seria "Sto bene, grazie. È gentile."
    "Una pausa. Lei mi studia, educata, come si studia uno sconosciuto in sala d'attesa."
    v seria "Lei chi è?{w} È del gas?"

    stop music fadeout 1.0
    "..."
    "Il bip continua. Uno. Uno. Uno."
    "Il mondo, invece, si ferma. A quaranta centimetri da terra."
    "..."

    play music m_triste2 fadein 2.0
    i malinconico "No, signora.{w} Non sono del gas."
    v seria "Ah. Meno male. Il gas l'ho già pagato. Aldo paga sempre tutto il primo del mese."
    i sincero "Sono... uno che ripara le cose. Le radio."
    v sorridente "Le radio! Bene. Bravo. Un mestiere serio."
    v sorridente "Allora lei è un bravo ragazzo."
    "Me lo dice come l'avrebbe detto a chiunque. Al postino. Al ragazzo del gas."

    "Non so cosa fare con le mani. Le metto in tasca. Trovo la caramella. La tiro fuori."
    i sincero "Questa è sua. Credo."
    v sorridente "Mishka! L'orsetto al nord. Spasibo, golubchik."
    "Golubchik. Lo dice e per un secondo mi si apre il cuore come una porta."
    "Poi lei appoggia la caramella sul comodino, accanto al bicchiere di plastica, e non la guarda più."

    v seria "Lei sa dov'è Aldo?"
    i malinconico "Aldo..."
    v seria "Doveva venire alle quattro. Aldo è puntuale, è ingegnere. Gli ingegneri muoiono, ma in orario."
    v sorridente "Questa è una battuta sua. Me la diceva sempre. Io non ridevo, così rideva lui per due."
    "Aldo è morto nel 2015. Me l'ha raccontato lei, a novembre, con il bicchiere d'argento in mano."
    "Non c'è nessuna regola, per questo. Nessun cartello sul lavaggio delle mani."
    i sincero "Arriva. Ha trovato traffico."
    v seria "Nu, ladno. Il traffico, in Italia. Bozhe moy."

    "Lei guarda la finestra. La neve. Le si accende qualcosa negli occhi, piccolo, come la spia rossa di un amplificatore."
    show valya nostalgica with dissolve
    v nostalgica "Nevica. Allora stanotte Lyova chiama."
    i malinconico "..."
    v nostalgica "Quando nevica così, la propagazione è buona. Lo dice lui. Io non so cosa vuol dire, ma lui lo dice con una voce..."
    v nostalgica "Lei lo conosce, Lyova? È sul {i}Lenin{/i}. Il rompighiaccio. È radiotelegrafista."
    i sincero "Ne ho sentito parlare. Dicono che è bravo."
    v sorridente "È il più bravo. Fischia, alla radio. Il capitano si arrabbia. Lui fischia lo stesso."
    "Ride. Una risata da ragazza. La risata di una telefonista di ventisei anni con le dita gelate."
    "E io sono lì, con la mia faccia da sciocco, a farle da ponte radio verso il 1968."

    show valya triste with dissolve
    "Poi qualcosa le scivola via dalla faccia. Un'onda che si ritira."
    v triste "Mama..."
    v triste "Mia madre sa che sono qui? Deve dirglielo. Che ho chiuso il centralino. Che ho chiuso bene, con la chiave."
    i sincero "Glielo dico io. Stia tranquilla."
    v triste "Me lo promette?"
    "Promettere. Io sono quello che mantiene le promesse. Il vano chiuso. Lo scotch intatto. NE OTKRYVAT'."
    i sincero "Glielo prometto."
    v seria "Lei è gentile. Come un uomo di un altro secolo."
    "Me l'ha già detto. Alla fermata, sotto la pioggia. Allora sapeva chi ero."

    "Chiude gli occhi. Il respiro si allunga. La linea verde rallenta un poco, si fa più morbida."
    "Dorme."
    "Resto in piedi, accanto al letto, con le mani in tasca e niente dentro le mani."
    "Le sistemo la coperta sulla spalla. È tutto quello che so fare. Il resto non ha viti."

    play sound s_porta
    show arkadij triste at centro with dissolve
    "La porta si apre. Arkadij non dice niente. Guarda l'orologio, poi me. Sono passati sette minuti."
    a triste "Allora?"
    i malinconico "Mi ha chiesto se ero del gas."
    a triste "...A me ha chiesto se ero il nuovo dottore. Le ho detto di sì. Era più semplice."
    "Restiamo lì, due uomini che non si sopportano, a guardare una donna che dorme."
    a triste "Appena la dimettono la porto alle Magnolie. Prima di Capodanno. C'è una stanza al piano terra. Con la finestra."
    i sincero "Sul parcheggio?"
    a triste "Sul giardino."
    i sincero "Meglio."
    "È l'unica cosa su cui siamo mai stati d'accordo."

    stop ambiente fadeout 3.0
    stop music fadeout 3.0
    scene bg nero with lentissimo
    pause 1.0

    # ------------------------------------------------------------
    # 2. LA SARACINESCA — NESSUNO RIDE
    # ------------------------------------------------------------
    scene bg saracinesca_notte with fade
    play ambiente s_neon fadein 1.0
    call didascalia("IL GIRASOLE — 24 DICEMBRE, 18:05")

    "La vigilia di Natale il Girasole chiude alle sei. Gli altoparlanti suonano {i}Jingle Bells{/i} per l'ultima volta, con una nota storta che c'è da sempre."

    call via_didascalia

    play music m_neve fadein 2.0
    show rino sera at dx with dissolve
    show dado serio at sx with dissolve

    "Siamo in tre davanti alla Lampo. Dado non ha il telefono in mano. Rino non ha il giornale sotto il braccio."
    "Nessuno ha detto niente di Valya, tutto il giorno. Se ne è parlato così tanto in silenzio che il negozio è diventato stretto."
    r sera "Bon. Andiamo a casa, che è Natale."
    "Prende la maniglia e tira giù."

    play sound s_saracinesca
    "La saracinesca scende. Lenta. Rumore di ferro stanco."
    play sound s_saracinesca_blocco
    with vpunch
    "E si ferma."
    "Quaranta centimetri da terra. Come prima. Come sempre. Come se dicembre non fosse successo."
    "..."
    "Di solito qui Dado ride. Di solito Rino prende la rincorsa e canta {i}Azzurro{/i}. Di solito io faccio una battuta sulla O che manca."
    "Stasera Rino guarda la saracinesca e non prende la rincorsa."
    "Io non trovo la battuta. La cerco, in tasca, nella testa. Non c'è. È rimasta in una stanza d'ospedale, accanto a una caramella."

    show giulia sera at centro with dissolve
    "Giulia esce dalla tisaneria con la sciarpa già al collo. Vede la saracinesca. Vede noi."
    g sera "Ah."
    "Solo questo. Ah. Giulia ha studiato filosofia per tre anni per arrivare a una sillaba perfetta."
    d serio "Lei l'aveva chiusa con un colpo d'ombrello. Vi ricordate?"
    r sera "Me lo ricordo sì."
    d serio "«In Unione Sovietica le saracinesche obbedivano.»"
    "Lo dice con la voce di Valya. Male. Nessuno ride. Neanche lui."
    r sera "Lasciala così. Tanto chi vuoi che entri, la notte di Natale. I ladri sono a casa con la nonna."

    "Rino si fruga nella tasca del giaccone. Tira fuori un mazzo di chiavi con un portachiavi della Lambretta."
    show rino buono with dissolve
    r buono "Tieni, Principessa."
    i sincero "Sono le chiavi del negozio."
    r buono "Ah sì? Non me n'ero accorto. Vecchiaia."
    r buono "La radio della signora è sul ripiano in alto, dietro le cuffie. Se stanotte ti serve il saldatore, il saldatore è lì."
    r sera "Io non ti ho dato niente. Domani le trovo nella cassetta della posta."
    i sincero "Rino..."
    r sera "Niente facce. Buon Natale."

    g seria "Ionuț."
    "Non Principessa. Ionuț. Giulia lo dice una volta all'anno, e sempre al momento giusto."
    g seria "Se ti serve qualcuno che ti dica che è un'idea stupida, ho il telefono acceso."
    i ironico "E se è un'idea bella?"
    g sera "Allora non chiamare. Le idee belle si rovinano a dirle."

    hide giulia with dissolve
    hide rino with dissolve
    hide dado with dissolve
    stop music fadeout 2.0
    "Se ne vanno. Tre schiene nel parcheggio, sotto la neve che non attacca."
    "Io resto davanti alla saracinesca, con le chiavi in mano e quaranta centimetri di buio davanti ai piedi."

    call sms("MAMMA", "Buon Natale amore mio 🎄 sono dal sig. Ferretti, stanotte non dorme. Il panettone è sul frigo 🐙")
    call sms("MAMMA", "Papà ha chiamato? Se chiama rispondi. Ti voglio bene puiule ❤️")
    "Papà non ha chiamato. Chiamerà domani, alle undici, per tre minuti, con dei bambini spagnoli che urlano dietro."

    # ------------------------------------------------------------
    # 3. NOTTE DI NATALE — IL VANO BATTERIE
    # ------------------------------------------------------------
    play sound s_saracinesca
    scene bg negozio_buio with buio
    stop ambiente fadeout 1.0
    play ambiente s_vento fadein 2.0
    call didascalia("RIPARAZIONI LAMPO — 24 DICEMBRE, 23:20")

    "Mi infilo sotto la saracinesca come un gatto. Un gatto alto un metro e ottantadue, con le ginocchia sbagliate."
    "Dentro, la Lampo di notte è un altro posto. Le spie rosse dei caricatori. Il neon dell'insegna che entra dalla vetrina: LAMP_. Rosso su tutto."

    call via_didascalia
    play music m_notte fadein 3.0

    "Non accendo la luce grande. Accendo solo la lampada da banco, quella col braccio snodato. Fa un cerchio giallo sul bancone. Fuori dal cerchio, niente."
    "La Spidola è dove ha detto Rino. Dietro le cuffie. Valya l'aveva lasciata qui la settimana scorsa, per l'ultima regolazione prima di Capodanno."
    "La prendo con due mani. La appoggio nel cerchio di luce."
    show item radio with dissolve

    "L'ho riparata tutta, tranne una cosa."
    "La giro."
    "Il vano batterie. Tre strisce di scotch telato, gialle come un'unghia di fumatore. Due parole scritte a penna, con una calligrafia dritta e severa."
    "NE OTKRYVAT'. Non aprire."
    hide item with dissolve

    show ionut cupo at sx with dissolve
    "A ottobre ho detto a Giulia: è casa sua, io sono l'idraulico, mica il ladro."
    i cupo "E adesso cosa sono?"
    "La radio non risponde. Fa bene."

    "Penso a lei che mi chiede se sono del gas."
    "Penso che tra sette giorni è Capodanno, e lei voleva la radio per Capodanno, «perché il prossimo forse non lo riconosco»."
    "Aveva sbagliato di poco. Non ha riconosciuto neanche questo."
    i cupo "Se c'è qualcosa, lì dentro, è suo. Non mio."
    show ionut malinconico with dissolve
    i malinconico "Ma lei non se lo ricorda più. Allora qualcuno se lo deve ricordare al posto suo."
    "È un ragionamento. Non so se è un ragionamento giusto. So che è quasi mezzanotte, la notte di Natale, e che nessun altro lo farà."

    play sound s_cacciavite
    "Prendo il cutter. La lama più piccola."
    "Lo scotch è diventato duro, vetroso. Non si stacca: si spezza a scaglie, come la crosta del pane vecchio."
    i malinconico "Scusa, Valya."
    "Lo sportellino fa clic."

    "Dentro ci sono due pile piatte da quattro volt e mezzo, sovietiche, gonfie e bianche di ossido. Morte da trent'anni."
    "E sotto le pile, avvolta in un fazzoletto di cotone a quadretti, la cosa leggera e piatta che sentivo scuotendo la radio a ottobre."

    show item cassetta with dissolve
    play sound s_cassetta
    "Una cassetta."
    "Sull'etichetta, a penna, la stessa calligrafia dritta dello scotch:"
    "{b}31.XII.1968 — L.{/b}"
    "Trentuno dicembre millenovecentosessantotto. L."
    i malinconico "Lev."
    "Non me l'ha mai detto, il nome. Ha detto «un uomo che parlava con le onde». Ha detto «Lyova», a me, nel parcheggio, sotto la neve."
    "Lyova è il diminutivo di Lev. L'ho cercato a novembre, di nascosto, come si cerca il nome di un rivale."

    "Giro la cassetta verso la luce. Dalla finestrella si vede il nastro."
    "Spezzato. Due capi arricciati, come i baffi di un gatto offeso."
    hide item with dissolve

    # ------------------------------------------------------------
    # 4. LA RIPARAZIONE DEL NASTRO
    # ------------------------------------------------------------
    stop music fadeout 2.0
    "Rino me l'ha insegnato a giugno, il secondo giorno. Mi ha detto: «Principessa, i giovani non sanno più giuntare un nastro. È come non saper fare un nodo»."
    "Io ho detto che i nastri non li usa più nessuno. Lui mi ha guardato come si guarda uno che sputa in chiesa."
    "Poi mi ha insegnato lo stesso."

    play music m_ricordo fadein 2.0
    play sound s_cacciavite
    "Prima, le cinque viti della cassetta. Piccole, a croce, arrugginite. Il cacciavite da orologiaio. Piano, che la plastica vecchia si crepa."
    "Raddrizzo i due capi tra le dita. Non bisogna toccare il lato opaco, quello che ha la voce. Le dita hanno il grasso, e il grasso cancella."
    "Forbici. Un taglio in diagonale su tutti e due i capi, così combaciano. «In diagonale, Principessa, che la testina non inciampa.»"
    "Lo scotch sul lato lucido. Un pezzetto largo come un'unghia. Lo premo con il dorso della pinzetta. Taglio quello che avanza."
    "Rimetto le bobine. Chiudo il guscio. Avvito le cinque viti. Riavvolgo con una matita infilata nel buco, girando piano, come si carica un orologio."

    play sound s_nastro
    "Il nastro scorre. La giunta passa da una bobina all'altra senza strapparsi."
    i sincero "Ecco. Riparata."
    "Adesso mi serve qualcosa per ascoltarla."

    "La piastra della Lampo mangia i nastri. Lo sa tutto il centro."
    play sound s_telefono_squillo
    "Prendo il telefono. Ci sono due persone sveglie al Girasole la notte di Natale. Una sono io."

    m notte "Guardiola, Esposito. Io vedo tutto."
    i sincero "Mario. Sono io. Sono in negozio."
    m notte "Lo so, guagliò. Ti vedo dalla telecamera quattro da un'ora e mezza. Pensavo che stessi facendo l'intervento a cuore aperto a qualcuno."
    i sincero "Più o meno. Hai ancora quel registratore a cassette? Quello vecchio, con la maniglia?"
    "Silenzio. Poi il rumore di un termos che si chiude."
    m notte "Il Philips del settantatré. Ce l'ho su, in stazione. Sali. E porta quello che hai trovato."
    i ironico "Come sai che ho trovato qualcosa?"
    m notte "Telecamera quattro. E poi ti tremavano le mani. Le mani non mentono, nemmeno in bianco e nero."

    # ------------------------------------------------------------
    # 4b. RADIO SHACK — LA VOCE DI LEV
    # ------------------------------------------------------------
    stop music fadeout 2.0
    stop ambiente fadeout 2.0
    scene bg radio_shack with fade
    play ambiente s_statica fadein 2.0
    call didascalia("STAZIONE IZ4MRO — 25 DICEMBRE, 0:41")

    "La stazione di Mario è uno sgabuzzino sopra la guardiola, dietro una porta con scritto QUADRI ELETTRICI — PERICOLO."
    "Dentro c'è un tavolo pieno di apparecchi con le lancette, un microfono a gelato e una cartina del mondo con le spille colorate."

    call via_didascalia

    show mario notte at dx with dissolve
    show ionut sincero at sx with dissolve

    m notte "Buon Natale, Principessa."
    i sincero "Buon Natale."
    m notte "Fammi vedere."
    "Gli do la cassetta. Lui si alza gli occhiali sulla fronte. È la prima volta che gli vedo gli occhi. Stanchi, gentilissimi."
    show mario serio with dissolve
    m serio "Trentuno dodici sessantotto. L."
    m serio "Questa è una copia, guagliò. Nel sessantotto, a Murmansk, le cassette non le aveva nessuno. Avranno registrato su bobina, e poi qualcuno l'ha riversata, anni dopo."
    i malinconico "Qualcuno che non voleva perderla."
    m serio "E che poi l'ha chiusa in una radio con tre giri di scotch. Per non sentirla."
    "Le due cose insieme. Non perderla e non sentirla. Mi sembra la cosa più russa e più umana che abbia mai sentito."

    play sound s_cassetta
    "Mario infila la cassetta nel Philips. Il vano si chiude con un clac grasso, anni settanta."
    m serio "Pronto?"
    i sincero "No."
    m serio "Bravo. Nessuno è mai pronto. Si preme lo stesso."

    play sound s_nastro
    pause 1.0
    "Fruscio. Il fruscio di un nastro, sopra il fruscio di una radio, sopra il fruscio di cinquantasette anni."
    "Poi una voce."

    play music m_notti_mosca_radio fadein 4.0
    lev "Valya. Valya, ty slyshish menya?"
    "È giovane. Questa è la prima cosa. Ho sempre immaginato Lev vecchio, chissà perché. È un ragazzo. Avrà ventotto anni. Ride mentre parla."
    lev "Eto Lev. S {i}Lenina{/i}. Sem' nol' sem' sem'... Ty slyshish?"
    "Sotto la voce si sente qualcosa che batte, metallico. Il ghiaccio contro lo scafo, forse. O un motore. O il cuore di una nave."
    lev "S Novym godom, Valyusha. S Novym godom, moya devochka."
    "Non capisco le parole. Capisco tutto il resto."
    lev "Kazhdyy god. V eto zhe vremya. Poka ty mne ne otvetish'."

    "Poi smette di parlare. E comincia a fischiare."
    "{i}Notti di Mosca.{/i} La canzone del carillon. La canzone del ballo, nella galleria vuota, raz, dva, tri."
    "Fischia bene. Meglio di me. Meglio di chiunque. Ogni tanto il segnale svanisce e la melodia va sott'acqua, poi torna su a respirare."
    "Mario non si muove. Ha la mano ferma sul tavolo, accanto al tasto STOP, come uno che fa la guardia a una culla."

    lev "Valya... ty slyshish?"
    "Fruscio."
    lev "Ya zdes'. Ya vsegda zdes'. Priyom."
    "Fruscio. Una scarica. Una parola che comincia e non finisce."
    play sound s_statica
    with glitch_t
    "E poi niente."

    stop music
    play sound s_nastro
    "Il nastro gira a vuoto. Il fruscio pulito di un nastro vergine. Mario preme STOP."
    "Clac."
    "Guardo il contatore. Mario ha il cronometro dell'orologio da polso acceso, perché Mario è stato marconista e i marconisti contano tutto."
    m serio "Quattro minuti..."
    m serio "...e diciassette secondi."

    stop ambiente fadeout 2.0
    "..."
    show ionut malinconico with dissolve
    "Quattro e diciassette."
    "L'orologio Pobeda di suo padre. Fermo alle quattro e diciassette. «Lo ripari, ma non lo metta all'ora giusta. Deve solo battere.»"
    "Ho creduto per due mesi che fosse un'ora. Un'ora della notte, la più brutta, quella in cui era successo qualcosa."
    "Non era un'ora."
    "Era quanto è durato. L'ultima volta che ha sentito la sua voce. Quattro minuti e diciassette secondi."
    "Ha fermato il tempo esattamente lì. E per cinquantasette anni ha lasciato che il cuore dell'orologio battesse, con le lancette ferme. Come lei."
    i malinconico "Ho capito l'orologio, Mario."
    m serio "Lo vedo, guagliò."

    "Prendo il telefono. Apro la stessa app che Giulia ha usato a ottobre per tradurre lo scotch. Mario riavvolge."
    play ambiente s_statica fadein 1.0
    play sound s_nastro
    "La seconda volta la sento così. Con le parole storte del telefono, raddrizzate da me."
    play music m_notti_mosca_radio fadein 2.0
    lev "Valya, mi senti? Sono Lev. Dal {i}Lenin{/i}. Sette-zero-sette-sette. Mi senti?"
    lev "Buon anno, Valyusha. Buon anno, bambina mia."
    lev "Ogni anno, alla stessa ora. Finché non mi rispondi."
    lev "Sono qui. Sono sempre qui. Passo."
    stop music fadeout 3.0
    "Il telefono scrive «Passo» con la maiuscola, come si chiude una trasmissione."
    "Nessuno ha risposto. Il nastro finisce con una domanda."

    # ------------------------------------------------------------
    # 5. LA RIVELAZIONE — SETTE-ZERO-SETTE-SETTE
    # ------------------------------------------------------------
    m serio "Ripeti il numero."
    i sincero "Quale numero?"
    m serio "Quello che dice lui. Sem' nol' sem' sem'. L'ho sentito due volte e non ci credevo."
    i sincero "7.077. C'era scritto anche su un biglietto, dentro la radio. Il primo giorno."
    "Mario si toglie del tutto gli occhiali. Li posa sul tavolo con cura, come si posa una cosa che si può rompere."
    m serio "Settemilasettantasette chilohertz. Quaranta metri."
    i ironico "Mario, io sono perito elettronico, non ho fatto il militare. Traduci."
    show mario normale with dissolve
    m normale "È banda radioamatori, guagliò. La banda dei quaranta metri. Di notte, d'inverno, va lontano. Murmansk-Napoli, Murmansk-Valdorsa. Facile."
    show mario serio with dissolve
    m serio "Ma un radiotelegrafista di un rompighiaccio nucleare che parla su una banda di amatori, a una ragazza, nel sessantotto..."
    i malinconico "Che succede a uno così?"
    m serio "Non lo so. Ma non succede niente di buono."

    play music m_tensione2 fadein 2.0
    "Mario accende il computer. Un vecchio fisso con la ventola che fa il rumore di un frullatore triste."
    m serio "I radioamatori sono gente strana. Scriviamo tutto. Ogni contatto, ogni segnale, ogni fischio. Ora, frequenza, nominativo. Lo chiamiamo il log."
    m serio "Ci sono archivi. Forum. Gente che ha scansionato i quaderni del nonno. Se qualcuno, in cinquant'anni, ha sentito un russo che fischia sui 7.077..."
    i sincero "Qualcuno l'avrà scritto."
    m normale "Esatto. Io vedo tutto. Ma loro vedono di più."

    "Scrive. «7077 kHz» «31 December» «whistling» «Valya». In inglese, in italiano, in un russo fatto con il traduttore."
    "Primo risultato. Un forum tedesco. Un thread del 2003, intitolato: {i}Der Pfeifer von Murmansk{/i}."
    "Il fischiatore di Murmansk."

    m serio "Guarda qua."
    "Un signore di Amburgo ha scansionato il suo log. Calligrafia minuta, a matita:"
    "«31.12.1981 — 21:00 UTC — 7.077 — UA1LS — Murmansk — fischia melodia russa, chiama “Valya”. Nessuna risposta. QSL non inviata.»"
    m serio "Ventuno UTC. È mezzanotte a Murmansk. In punto."
    "Sotto, le risposte. Decine. Gente da tutta Europa, e dal Canada, e dal Giappone."
    "«Sentito anche io, 1977, da Oslo.» «1986, Trieste, segnale debole, ma era lui.» «1994. Non risponde mai a nessuno. Aspetta solo una persona.»"
    i malinconico "Ogni anno."
    m serio "UA1LS. È il suo nominativo. Lev Sokolov. L e S."

    "Mette le date in fila su un foglio a quadretti, col pennarello."
    "1974. 1975. 1976. 1979. 1980. 1983. 1985. 1988. 1990. 1991. 1995. 1999. 2002. 2006. 2008."
    m serio "Il primo log è del settantaquattro. L'ultimo..."
    "Scorre. Scorre. Si ferma."
    m serio "Trentuno dicembre duemiladieci. Un ragazzo polacco. «UA1LS, segnale molto debole. Voce anziana. Fischia, tossisce, ricomincia. Chiama Valya. 73.»"
    m serio "Settantatré vuol dire «saluti». Tra di noi."

    stop music fadeout 2.0
    "Io non riesco a parlare."
    "Il settantaquattro. L'anno in cui Valya ha conosciuto Aldo, l'ingegnere dell'impianto frigorifero, a Murmansk."
    "Lui chiamava. E lei, dall'altra parte della stessa città, aveva già smesso di ascoltare. Perché le avevano detto che era morto."

    m serio "C'è un altro post. Sotto. L'ultimo del thread."
    m serio "Gennaio duemilaundici."
    "Lo traduce piano, a voce alta, dal russo-inglese di qualcuno che scrive piangendo."

    play music m_triste2 fadein 3.0
    m serio "«Mi chiamo Irina Sokolova. Lev Arkad'evič era mio nonno. È morto la settimana scorsa, a settant'anni.»"
    m serio "«Nel 1969 lo hanno arrestato per contatti radio non autorizzati. Quattro anni di campo. Quando è tornato, non gli hanno più permesso di imbarcarsi.»"
    m serio "«A nessuno di noi ha mai detto per chi trasmetteva. Diceva solo: una ragazza del centralino. Le avevano detto che io ero morto, diceva. Ma una radio non si sa mai chi la sente.»"
    m serio "«Ogni Capodanno trasmetteva per una donna di nome Valya. Anche l'ultimo, quando non riusciva più a stare seduto.»"
    m serio "«Se qualcuno l'ha mai sentita, questa Valya, scrivetemi.»"
    "..."
    m serio "Nessuno le ha risposto, guagliò. Il thread finisce lì."

    "Sotto il post c'è una foto. Mario ci clicca sopra. Si apre lenta, a strisce, dall'alto in basso."

    stop ambiente fadeout 2.0
    window hide
    scene cg foto_lev with lentissimo
    pause 3.0
    window show

    "Un ragazzo con il colbacco e un maglione a collo alto, appoggiato alla ringhiera di una nave. Dietro, il ghiaccio, bianco fino alla fine del mondo."
    "Ride. Ha gli occhi stretti per il sole o per il vento."
    "Non è bello come Aldo. È più bello di Aldo. Non so spiegarlo. È la faccia di uno che fischia mentre il capitano si arrabbia."
    "Lev Arkad'evič Sokolov. Lev non era morto nel sessantanove."
    "Lo avevano portato via. E quando era tornato, aveva messo un'antenna alla finestra e aveva ricominciato."
    "Ogni trentuno dicembre. A mezzanotte. Sui 7.077."
    "Per quarantadue anni."
    "Quarantadue Capodanni a chiedere al buio se qualcuno lo sentiva. E lei non lo ha mai saputo."

    # ------------------------------------------------------------
    # 6. IONUȚ PIANGE — SEI GIORNI
    # ------------------------------------------------------------
    scene bg radio_shack with dissolve
    play ambiente s_statica fadein 3.0
    show mario notte at dx with dissolve
    show ionut vulnerabile at sx with dissolve

    "Non me ne accorgo subito."
    "Me ne accorgo perché la foto sullo schermo diventa sfocata, e lo schermo di Mario è vecchio, ma non così vecchio."
    "Sto piangendo."
    "Non ho pianto per mio padre che se n'è andato in Spagna. Non ho pianto ieri, davanti a una donna che mi chiedeva se ero del gas."
    "Piango adesso. Per un uomo che non ho mai conosciuto, che è morto quando io avevo quattro anni, che fischiava meglio di me."
    "La maschera mi si appanna dall'interno. Non la tolgo. Non serve. Mezza faccia è già scoperta, ed è la metà che piange."

    i vulnerabile "Lui la chiamava, Mario."
    i vulnerabile "Lei aveva chiuso la radio con lo scotch, e lui la chiamava. Ogni anno. Lei ha sposato un altro, ed era giusto, e lui la chiamava lo stesso."
    i vulnerabile "E nessuno gliel'ha detto. A nessuno dei due."
    m notte "Lo so."
    i vulnerabile "Non è giusto."
    m notte "No. Non è giusto."
    "Mario non mi dice che va tutto bene. Non mi dà una pacca. Mi passa il tappo del termos pieno di caffè, e resta lì."
    "È la cosa più gentile che qualcuno abbia mai fatto per me. Dopo una caramella sul bancone."

    stop music fadeout 3.0

    show mario serio with dissolve
    m serio "Principessa. Lo sai che giorno è oggi?"
    i vulnerabile "Natale."
    m serio "E Capodanno quand'è?"
    "Lo guardo. Lui non sorride. Guarda la spilla rossa su Murmansk, sulla cartina del mondo."
    m serio "Io ho l'abilitazione. Ho un trasmettitore. Ho un tetto con un'antenna che la direzione non sa che c'è."
    m serio "E tu hai una cassetta con la sua voce. E una radio che lei riconosce anche quando non riconosce te."
    i sincero "Mario..."
    m serio "Non dico niente. Dico solo i fatti. Io sono un uomo di fatti. E di cruciverba."

    "Prendo la cassetta dal Philips. La giro tra le dita, come facevo con la caramella in ospedale."
    "{b}31.XII.1968 — L.{/b}"
    "«Ogni anno, alla stessa ora. Finché non mi rispondi.»"
    "Lei non ha mai risposto. Non perché non volesse. Perché nessuno le ha mai detto che c'era qualcuno da cui tornare."

    show ionut sincero with dissolve
    i sincero "Lei ha detto che voleva la radio per questo Capodanno. Perché il prossimo forse non lo riconosce."
    i sincero "Non riconosce me. Va bene. Io sono arrivato tardi, sono arrivato in ottobre."
    i sincero "Ma lui... lui è arrivato prima di tutto. Lui forse lo riconosce."
    m normale "Forse."
    i sincero "Forse basta."
    m normale "Guagliò. Nella vita, forse basta quasi sempre."

    play music m_speranza fadein 4.0
    "Rimetto la cassetta nel suo fazzoletto a quadretti. La metto nella tasca interna della giacca, quella con la cerniera. Accanto al cuore, come nei film brutti."
    "Domani c'è da chiamare Max, che ha un amplificatore e un'antenna «professional». Da parlare con Rino, che ha un magazzino. Da convincere Arkadij, che ha ragione su quasi tutto."
    "Da salire su un tetto, nella neve, a mezzanotte."
    "So giuntare un nastro. So tenere ferme le lancette e lasciare che il cuore batta."
    "È poco. È quello che ho."

    stop ambiente fadeout 3.0
    scene bg tetto_notte with lentissimo
    show neve_lenta
    play ambiente s_vento fadein 2.0

    "Usciamo sul tetto, io e Mario, a guardare l'antenna sbilenca che la direzione non sa che c'è."
    "Il cielo sopra Valdorsa è basso e arancione, come sempre. Ma da qualche parte, sopra, sui quaranta metri, la notte è buona."
    "Lo direbbe Lev. Quando nevica così, la propagazione è buona."
    m notte "Buon Natale, Principessa."
    i sincero "Buon Natale, Mario."

    "Oggi è il venticinque dicembre."
    "Un uomo ha chiamato una donna per quarantadue anni, e lei non l'ha mai sentito."
    "Stavolta qualcuno lo sentirà."
    pause 1.0
    "{b}Mancano sei giorni a Capodanno.{/b}"

    stop music fadeout 4.0
    stop ambiente fadeout 4.0
    hide neve_lenta
    scene bg nero with lentissimo
    pause 1.5
    return

