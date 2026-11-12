label cap4:
    call titolo_capitolo("4", "Il numero che non esiste", "Valdorsa — novembre")

    # ------------------------------------------------------------------
    # 1. TISANERIA — il consiglio di Giulia
    # ------------------------------------------------------------------
    scene bg tisaneria with dissolve
    play music m_negozio fadein 1.0
    call didascalia("TISANERIA LUNA NUOVA — 10:40")
    "Martedì mattina. Il Girasole è vuoto come una chiesa il lunedì."
    "Rino è dal commercialista. Dado è «in pausa», cioè su TikTok. Io sono qui."
    call via_didascalia
    "La Tisaneria Luna Nuova profuma di cannella, di carta bagnata e di gente che ha letto troppi libri."
    "Su una lavagnetta c'è scritto: {i}TISANA DELLA CALMA — 3,50 €{/i}. Sotto, a gessetto più piccolo: {i}non garantita{/i}."

    show ionut imbarazzato at sx with dissolve
    show giulia normale at dx with dissolve
    g "Buongiorno, Principessa."
    i imbarazzato "Non—"
    g "Lo so."
    "Giulia asciuga una tazza che è già asciutta. Lo fa da tre minuti. È il suo modo di dire che mi sta ascoltando."
    i ironico "Ti posso chiedere un consiglio? Per un amico."
    g sorride "Certo. Come si chiama il tuo amico?"
    i imbarazzato_flip "...Kevin."
    g "Kevin. Quello alto un metro e novantadue che ti ha lasciato appeso al sipario."
    i comico "Un altro Kevin. Un Kevin generico. Ce ne sono tanti."
    g normale "Va bene. Cosa ha fatto Kevin?"
    "Prendo fiato. Il fiato non basta. Ne prendo un altro."
    i imbarazzato "Kevin... diciamo che Kevin pensa sempre a una persona. Una persona che è venuta in negozio."
    i imbarazzato "Kevin le ripara le cose. E quando le ripara gli sembra di riparare anche... boh. Il mondo. Una cosa così."
    g "Romantico, Kevin."
    i ironico "E il problema è che questa persona è... diversa. Da Kevin."
    g "Diversa come?"
    i comico "Diversa di... qualche anno."
    g seria "Quanti?"
    i imbarazzato_flip "Sessantacinque. Circa. Kevin non ha fatto il conto preciso. Kevin ha fatto il conto preciso."
    "Giulia posa la tazza. Questa è una cattiva notizia: Giulia non posa mai la tazza."
    g seria "Ionuț."
    i imbarazzato "Kevin."
    g "Ionuț. Stai parlando della signora russa."
    "Silenzio. Il frigorifero delle bibite ronza in si bemolle. L'ho accordato io, una volta, per noia."
    show ionut sincero at sx
    i sincero "...Sì."
    g normale "Bene. Adesso ti faccio un tè, perché questa conversazione merita un tè."
    play sound s_bollitore
    "Accende il bollitore. Io guardo le bustine nel barattolo come se una di loro potesse saltare fuori e salvarmi."
    i sincero "Non è una cosa strana, giuro. Cioè, è strana. Ma non è {b}quella{/b} cosa strana."
    i sincero "Io non... non è che la guardo e penso... no. È che quando entra lei il negozio sta zitto. Io sto zitto. E io non sto mai zitto."
    g "Questo l'ho notato. Ci sentiamo da qui, quando parli da solo con le schede madri."
    i comico "Le schede madri hanno bisogno di incoraggiamento."
    play sound s_tazza
    "Mi mette davanti una tazza. È verde. Sa di menta e di qualcosa di amaro che non chiedo cos'è."
    g "Posso farti una domanda? Una sola. Poi torno ad asciugare tazze asciutte."
    i sincero "Vai."
    g seria "Ti sei innamorato di lei o di una storia?"
    "La domanda resta lì, sul bancone, tra la tazza e il registratore di cassa."
    i malinconico "...Che differenza c'è?"
    g "Le storie non invecchiano."
    "Lo dice piano. Senza cattiveria. Come si dice a qualcuno che ha la camicia abbottonata male."
    g normale "Lei ha ottantaquattro anni, Ionuț. Ha una radio, un orologio fermo e un uomo di cui non dice il nome."
    g "È una storia bellissima. Io me ne innamorerei subito. Ma le storie finiscono quando chiudi il libro. Le persone no. Le persone si stancano, si ammalano, dimenticano."
    i malinconico "E quindi?"
    g sorride "E quindi niente. Non ti ho detto di smettere. Ti ho detto di sapere di cosa ti sei innamorato. È diverso."
    "Bevo il tè. Scotta. Lo bevo lo stesso, perché è più facile che rispondere."
    i ironico "Hai mai pensato di fare la psicologa?"
    g "Studio filosofia. Noi facciamo le domande e poi andiamo a casa. Le risposte sono un problema vostro."
    i comico "Quanto ti devo?"
    g normale "Tre e cinquanta. La tisana della calma."
    i sarcastico "Non ha funzionato."
    g sorride "C'è scritto sulla lavagna. Non garantita."

    # ------------------------------------------------------------------
    # 2. NEGOZIO — il telefono a disco
    # ------------------------------------------------------------------
    scene bg negozio with dissolve
    play music m_negozio fadein 1.0
    call didascalia("RIPARAZIONI LAMPO — GIOVEDÌ, 16:20")
    "Giovedì. Il giorno di Valya."
    "Non c'è niente di scritto. Nessun appuntamento. Ma il giovedì io arrivo dieci minuti prima e mi pettino. Sotto il cappello. Che senso ha, non lo so."
    call via_didascalia
    show rino normale at dx with dissolve
    r "Principessa, hai sistemato il tablet della signora Ghidoni?"
    i ironico "Sì. Aveva una fetta di prosciutto dentro la porta di ricarica."
    r arrabbiato "Una fetta intera?"
    i comico "Mezza. L'altra mezza non l'abbiamo trovata. Ho paura a chiedere."
    r normale "Vetri con l'ansia dentro. E adesso anche col prosciutto."

    play sound s_campanella
    stop music fadeout 1.0
    "La campanella della porta. Rino si gira. Io non mi giro, perché so già chi è dal modo in cui la campanella suona: piano, come se chiedesse il permesso."
    play music m_valya fadein 2.0
    hide rino with dissolve
    show ionut sincero at sx with dissolve
    show valya seria at dx with dissolve
    v "Buongiorno, Ivan."
    i sincero "Buongiorno, signora Valya."
    "Oggi ha il fazzoletto blu con le rose gialle. E la borsa a quadri, come sempre. Dentro la borsa c'è qualcosa di pesante: lo capisco da come le tira la spalla."
    v "Ho una cosa. Non è rotta. È... muta."
    "Tira fuori un telefono. Un telefono vero, di quelli che pesano come un mattone."
    show item telefono with dissolve
    "Rosso. Rosso pompiere. Col disco dei numeri bianco, i buchi consumati dalle dita, e una cornetta attaccata con un filo a molla che sembra un ricciolo."
    i comico "Bozhe moy."
    v sorridente "Bravo. Impara."
    v seria "Era al centralino del porto. Quando hanno cambiato tutto, nel settantuno, li buttavano via. Io ne ho preso uno. Nessuno ha detto niente."
    i ironico "Lei ha rubato un telefono all'Unione Sovietica?"
    v "Ho salvato un telefono dall'Unione Sovietica. È diverso, ty durak."
    "Lo giro. Sotto c'è una targhetta di metallo con delle lettere che non so leggere e un numero di serie."
    i sincero "Cosa vuole che faccia?"
    v "Voglio chiamare un numero."
    i sincero "Un numero."
    v "Due. Diciassette. Zero quattro."
    "Lo dice come si dice una preghiera che si sa da bambini. Senza pensarci. Con le mani ferme sul bancone."
    v nostalgica "Il centralino del porto di Murmansk. Il mio. Millenovecentosessantotto."
    "Io guardo il telefono. Poi guardo lei. Poi guardo di nuovo il telefono, perché è più facile."
    i malinconico "Signora Valya... sono passati più di cinquant'anni."
    v seria "Lo so contare, Ivan. Faccia il collegamento. Il resto è affare mio."

    hide item with dissolve
    show bg laboratorio with dissolve
    "Nel retrobottega c'è una scatola che Rino chiama «il cimitero degli adattatori». Spine, prolunghe, cavi che non vanno da nessuna parte."
    "Trovo una presa tripolare, un vecchio convertitore da impulsi a toni e un cacciavite che mi guarda con fiducia."
    i comico "Non mi serve un principe. Mi serve un cacciavite."
    play sound s_cacciavite
    "Il telefono russo parla a impulsi: ogni numero è una serie di clic. Le linee di adesso vogliono i toni. Il convertitore traduce. È un interprete, in pratica."
    "Ci metto venti minuti. Valya non si siede. Sta in piedi nella porta del laboratorio e guarda le mie mani, come la prima volta."
    v "Mani buone."
    i ironico "Faccia da sciocco?"
    v sorridente "Quella non cambia. Ma ci si abitua."

    scene bg negozio with dissolve
    show ionut ironico at sx
    show valya seria at dx
    show item telefono
    with dissolve
    "Attacco il telefono alla linea fissa di Rino. Rino ha ancora la linea fissa. Rino avrà la linea fissa anche dopo la fine del mondo."
    show rino arrabbiato at centro with dissolve
    r "Principessa. Mi dici che stai chiamando la Russia col mio telefono?"
    i comico "Col telefono della signora. Sulla sua linea. È una collaborazione."
    r "Sai quanto costa al minuto la Russia?"
    v seria "Signor Ruggeri. Le pago io la Russia."
    "Rino apre la bocca. La richiude. Fa un verso che non è una parola."
    r normale "...Ladno."
    i sarcastico "Rino, ma lei sa il russo?"
    r "So quando ho perso, Principessa. È una lingua internazionale."
    hide rino with dissolve

    "Scrivo il prefisso su un foglietto: zero zero sette, otto uno cinque due. Russia, Murmansk."
    "Valya lo guarda come si guarda un estraneo che ti dà indicazioni nella tua città."
    v "Prima non serviva."
    i sincero "Prima era tutto lì. Adesso c'è... in mezzo un po' di mondo."
    "Lei solleva la cornetta. La appoggia all'orecchio, sotto il fazzoletto. Infila un dito nel primo buco."
    play sound s_disco_telefono
    "Il disco gira, torna indietro. Ticchetta. Un suono che non sentivo da quando ero piccolo, a Iași, a casa della nonna."
    play sound s_disco_telefono
    "Zero. Zero. Sette. Otto, uno, cinque, due."
    "Poi si ferma. Un secondo intero. Il dito sopra il disco come sopra un tasto del pianoforte."
    play sound s_disco_telefono
    "Due."
    play sound s_disco_telefono
    "Diciassette."
    play sound s_disco_telefono
    "Zero quattro."
    stop music fadeout 1.5
    "Silenzio. Il fruscio della linea. Il negozio trattiene il fiato. Anche il neon della LAMP_ smette di ronzare, giuro."
    pause 1.0
    "Poi la voce. Una voce di donna, in italiano, gentile e piatta come una cosa che non ha mai avuto un corpo."
    voce "Il numero selezionato è inesistente."
    voce "Il numero selezionato è inesistente."
    "Valya non riattacca. Ascolta. Due volte. Tre."
    i vulnerabile "Signora Valya..."
    "Lei abbassa la cornetta. La posa sul telefono con cura, come si mette a letto un bambino."
    show valya sorridente
    "E poi ride."
    "Non è la risata di quando Max è rimasto pietrificato davanti al chiosco. Non è la risata da ragazza."
    "È una risata che comincia nel posto sbagliato. Corta. Con un buco in mezzo."
    v sorridente "Certo."
    show valya triste
    v triste "Neanche io esisto più, lì."
    hide item with dissolve
    "Non so cosa dire. È la prima volta da giugno che non so cosa dire, e me ne accorgo perché il silenzio ha un suono, e il suono è il mio cuore."
    i sincero "Magari hanno solo cambiato i numeri. Succede. Mettono una cifra davanti, e..."
    v seria "Ivan."
    i sincero "Sì."
    v "Non mi aggiusti questo. Questo non si aggiusta. Va bene così."
    "Apre la borsa. Tira fuori una caramella Mishka. L'orso nella neve, sulla carta. La posa sul bancone, vicino al telefono rosso."
    v "Per il disturbo."
    i malinconico "Non è un disturbo."
    v sorridente "Allora per la pazienza. Nu, ladno. Ce l'ha, la pazienza. Non so dove la tiene, con quella faccia."

    "E lì, in quel momento, la mia bocca fa una cosa senza chiedermi il permesso."
    show ionut imbarazzato at sx
    i imbarazzato "Sabato... ha da fare? Sabato pomeriggio?"
    v seria "Sabato io faccio la spesa, guardo il telegiornale e litigo con la vicina del terzo piano. Perché?"
    i imbarazzato_flip "Pensavo... al food court. Di sopra. C'è da mangiare. C'è il sushi. Ci sono le... sedie."
    "Ho appena venduto il food court del Girasole citando le sedie. Rino, dal retro, tossisce in un modo che sembra una risata."
    v "Le sedie."
    i comico "Sono comode. Relativamente."
    "Valya mi guarda a lungo. Le sopracciglia fanno il loro lavoro: giudicano."
    v sorridente "Alle quattro. Sia puntuale, Ivan. In Unione Sovietica i ragazzi erano puntuali."
    hide valya with dissolve
    play sound s_campanella
    "La campanella. Va via."
    "Io resto lì con la caramella in mano e un pensiero solo, enorme, scritto in maiuscolo:"
    show ionut sclero at sx with vpunch
    i sclero "{b}È UN APPUNTAMENTO.{/b}"
    show ionut imbarazzato at sx
    "...No. Non è un appuntamento. È un pomeriggio. Al food court. Con una signora. È un servizio alla clientela."
    "Lo dico a me stesso tre volte. Non lo dico a nessun altro. Questa è la definizione esatta di appuntamento."

    # ------------------------------------------------------------------
    # 3. FOOD COURT — l'appuntamento che non si dice
    # ------------------------------------------------------------------
    scene bg foodcourt with dissolve
    play music m_galleria fadein 1.0
    play ambiente s_folla fadein 1.0
    call didascalia("IL GIRASOLE, PRIMO PIANO — SABATO, 15:52")
    "Arrivo con otto minuti di anticipo. Lei è già lì."
    call via_didascalia
    show ionut ironico at sx with dissolve
    show valya seria at dx with dissolve
    "Seduta al tavolo più pulito di tutto il food court. Non so come abbia fatto a trovarlo. Io lavoro qui da cinque mesi e non sapevo che esistesse un tavolo pulito."
    v "In ritardo."
    i comico "Sono in anticipo di otto minuti."
    v "Io di venti. Quindi lei è in ritardo di dodici."
    i ironico "Questa è matematica sovietica."
    v sorridente "È l'unica che funziona."
    "Il food court del Girasole, il sabato, è un posto pieno di luce gialla e di bambini che urlano per una patatina."
    "C'è una piadineria, un kebab, un posto di hamburger con un pagliaccio scolorito e il sushi. Il sushi si chiama SAKURA EXPRESS. Ha un gatto dorato che saluta."
    v seria "Quel gatto mi sta salutando da quando sono arrivata. Non ci conosciamo."
    i comico "È giapponese. Saluta tutti."
    v "In Russia salutare tutti è sospetto."

    "Prendo il sushi. Un vassoio misto, perché sembra la cosa più da appuntamento. Che non è."
    "Lo poso davanti a lei. Lei lo guarda come un ispettore delle ferrovie guarda un biglietto falso."
    v seria "Questo è pesce."
    i ironico "Sì."
    v "Crudo."
    i ironico "Sì."
    v "Con il riso freddo. E un'alga. E lei lo ha pagato."
    i comico "Undici e novanta."
    v arrabbiata "Bozhe moy. A Murmansk il pesce crudo lo mangiavano i gabbiani. Gratis. E sembravano contenti, ma erano gabbiani."
    "Prende un pezzo con le bacchette. Con le bacchette. Al primo colpo. Con una precisione da chirurgo."
    i sincero "Lei sa usare le bacchette?"
    v seria "Ivan, io ho collegato duecento spine al minuto con le dita congelate. Due bastoncini non mi fanno paura."
    "Mastica. Lentamente. Il food court intero sembra aspettare il verdetto. Anche il gatto dorato, che per un momento giuro che si ferma."
    v "..."
    v sorridente "Non è cattivo."
    i comico "Davvero?"
    v seria "Non ho detto buono. Ho detto non cattivo. Sono due cose diverse, come in politica."

    # --- la gag della pianta ---
    "È in quel momento che la vedo."
    "Una pianta. Un ficus finto, enorme, in un vaso di plastica vicino alle scale mobili. Niente di strano: il Girasole è pieno di piante finte."
    "Solo che questa pianta ha le catene d'oro."
    hide valya
    hide ionut
    show dado comico at sx2 with dissolve
    show max spaccone at dx2 with dissolve
    "E un paio di occhiali da sole. E un telefono che spunta tra le foglie, con la lucina rossa della registrazione accesa."
    d "Spostati, mi copri l'inquadratura!"
    x "Bro, sono io che ho l'angolo migliore, io ho fatto un corso di fotografia online, very professional."
    d "Hai fatto un video di dieci minuti su YouTube!"
    x comico "Era un corso. Il tipo aveva la barba. Se uno ha la barba è un corso."
    d ride "Zitto, guarda, guarda! Lei mangia il sushi! La Principessa le ha preso il sushi!"
    x "Il sushi al primo appuntamento è una mossa very top, devo ammetterlo. Very top of the gamma."
    hide dado
    hide max
    show ionut sclero at sx
    show valya seria at dx
    with dissolve
    i sclero "..."
    "Voglio morire. In modo silenzioso. Dentro il wasabi."
    v seria "Ivan."
    i imbarazzato "Sì."
    v "La pianta ha le catene d'oro."
    i imbarazzato_flip "...Sì."
    v "E parla."
    i comico "È una pianta molto... evoluta."
    "Valya posa le bacchette. Si pulisce la bocca col tovagliolo, piegandolo in quattro. Poi si alza."
    show valya arrabbiata at dx, entra_dx
    "Cammina verso il ficus. Passo lento, preciso. Il passo di una che ha attraversato il porto di Murmansk col vento contro."
    "Il ficus trema. Si sente un «oddio» bisbigliato che è chiaramente la voce di Dado."
    v arrabbiata "Signor Bonetti."
    x "{size=-8}Io non sono qui.{/size}"
    v "Signor Davide."
    d "{size=-8}Neanche io.{/size}"
    v "Le piante, da noi, crescevano a meno trenta e non facevano rumore. Imparate dalle piante. Andate via."
    play sound s_passi
    "Il ficus si divide in due. Una metà scappa verso la piadineria. L'altra metà inciampa nel vaso, si rialza, dice «sorry, madame» e scappa verso il kebab."
    show valya seria at dx
    "Valya torna a sedersi. Si sistema il fazzoletto. Riprende le bacchette."
    v seria "Dove eravamo?"
    i comico "Al pesce non cattivo."
    v sorridente "Ah, sì."
    "Io rido. Rido davvero, per la prima volta in tutta la settimana. Lei mi guarda ridere e non dice niente, ma le si stringono gli occhi."

    # --- le scale mobili ---
    scene bg scalemobili with dissolve
    play ambiente s_scale_mobili fadein 1.0
    show ionut ironico at sx with dissolve
    show valya seria at dx with dissolve
    "Dopo, le propongo di fare un giro. Per scendere al piano terra ci sono le scale mobili."
    "Valya si ferma davanti al primo gradino. Lo guarda scorrere. Lo guarda come si guarda un cane che non si conosce."
    v seria "No."
    i sincero "Sono solo scale."
    v "Sono scale che si muovono da sole. Una scala che fa la fatica per te."
    v arrabbiata "Decadenza."
    i comico "Si chiama progresso."
    v seria "In Unione Sovietica il progresso era una scala normale e tu salivi. Con le gambe. Il progresso eri tu."
    i ironico "La metropolitana di Mosca ha le scale mobili più lunghe del mondo. L'ho visto in un documentario."
    "Valya mi guarda. Le sopracciglia si alzano di un millimetro. Per le sue sopracciglia un millimetro è un terremoto."
    v "...Quelle erano diverse."
    i sarcastico "Diverse come?"
    v sorridente "Erano nostre."
    "E poi mi prende il braccio. Così, senza chiedere. La sua mano pesa meno di un uccello."
    v seria "Lei mi tiene, Ivan. Se cado, la denuncio."
    i sincero "Va bene."
    play sound s_scale_mobili
    "Mettiamo il piede sul gradino insieme. Lei stringe. Io stringo. Scendiamo, lentissimi, anche se le scale vanno alla loro velocità e basta."
    "Una bambina sul gradino sopra di noi ci guarda e dice alla mamma: «Guarda, il nonno col cappello aiuta la nonna»."
    i comico "...Il nonno."
    v sorridente "Le sta bene. Il cappello la invecchia."

    # --- la neve che cade di lato (di nuovo) ---
    scene bg foodcourt_sera with dissolve
    play music m_valya fadein 2.0
    play ambiente s_folla fadein 1.0 volume 0.4
    "Torniamo su. Ci risediamo. Fuori, dalle vetrate grandi del food court, comincia a far buio. Sono le cinque e mezza ed è già sera. Novembre fa così."
    show ionut sincero at sx with dissolve
    show valya nostalgica at dx with dissolve
    "Valya guarda il cielo grigio sopra il parcheggio. Le si addolcisce la faccia. Lo so riconoscere, ormai: è la faccia di quando va a nord."
    v nostalgica "Qui la pioggia cade dritta. Come una persona stanca."
    i sincero "Da voi no?"
    v nostalgica "Da noi c'era la neve. Sei mesi di neve. E la notte, a dicembre, non finiva mai. Il sole non si alzava. Si affacciava appena, come un vicino curioso."
    v "E io andavo al lavoro alle sei, al centralino, e facevo la strada lungo il porto..."
    "E io lo so. Lo so prima che lo dica."
    "Lo so perché lo ha già detto."
    "Tre settimane fa. In laboratorio. Con la Spidola accesa che faceva il fruscio. Seduta su quella sedia, con le mani sulla borsa, con questa stessa faccia."
    v nostalgica "A Murmansk la neve non cade dal cielo: cade di lato, come se anche lei stesse cercando qualcuno."
    stop music fadeout 1.0
    play music m_triste fadein 1.0
    show ionut malinconico at sx
    "..."
    "Le stesse parole."
    "La stessa pausa prima di {b}fretta{/b}. Lo stesso dito che disegna nell'aria una linea storta, da sinistra a destra."
    "Come un nastro. Come una cassetta che qualcuno ha riavvolto senza dirmelo."
    v nostalgica "Era bello, sa? Tutti camminavano piegati. Sembrava che il mondo intero andasse a trovare qualcuno."
    "La volta scorsa ho riso, a questa frase. Ho detto che era bellissima. Lei ha detto: «Lo so, l'ho inventata io»."
    "Adesso non rido. Non dico niente."
    "Potrei dirlo. «Me l'ha già raccontata, signora.» È una frase semplice. Sei parole. Le diciamo tutti, ai nonni, alle zie, ridendo."
    "Ma lei è così contenta di raccontarla. Ha gli occhi lontani e caldi. Non posso rubarle questo. Non posso dirle che il nastro si è riavvolto."
    i malinconico "...È bellissima."
    show valya sorridente
    v sorridente "Lo so. L'ho inventata io."
    "Uguale. Anche questo, uguale."
    "Mi guardo le mani. Sono mani buone. Sanno aggiustare un condensatore, un orologio fermo, un telefono che parla una lingua morta."
    "Questa cosa no. Per questa cosa non esiste il cacciavite."
    pause 1.0
    stop music fadeout 2.0
    play music m_galleria fadein 2.0
    v seria "Ivan, perché fa quella faccia? Il sushi le è rimasto sullo stomaco?"
    show ionut ironico at sx
    i ironico "Undici e novanta. Mi è rimasto sul portafoglio."
    v sorridente "Ty durak."
    "E ride. La risata da ragazza, stavolta. E io le vado dietro, perché è più facile."

    # ------------------------------------------------------------------
    # 4. FERMATA SOTTO LA PIOGGIA
    # ------------------------------------------------------------------
    scene bg fermata_pioggia with dissolve
    show pioggia
    stop ambiente fadeout 1.0
    play music m_notte fadein 2.0
    play ambiente s_pioggia fadein 2.0
    call didascalia("FERMATA VIA EMILIA OVEST — 18:40")
    "Quando usciamo dal Girasole piove. Non la pioggerella di Valdorsa che ti bagna di lato e ti fa venire la tosse."
    "Piove sul serio. Piove come se qualcuno lassù avesse aperto un rubinetto e se ne fosse andato in vacanza."
    call via_didascalia
    show ionut sincero at sx with dissolve
    show valya seria at dx with dissolve
    "La pensilina della fermata ha il tetto rotto a metà. La metà buona è occupata da un signore con un cane bagnato e da un cartello pubblicitario di un'assicurazione."
    "Rimaniamo nella metà rotta."
    v seria "Il 7 passa alle sette meno dieci."
    i sincero "Sono le sei e quaranta."
    v "Allora aspettiamo. Aspettare è una cosa che so fare. Ho molta esperienza."
    play sound s_tuono
    show bg fermata_pioggia with flash
    "Un tuono. Lungo, basso, che fa vibrare i vetri della pensilina. Il cane del signore guaisce."
    "Valya si stringe nel cappotto. Il fazzoletto si sta bagnando. Le spalle anche. È piccola, sotto la pioggia. Molto più piccola che dietro il bancone."
    "E io ho un ombrello. Un ombrello pieghevole, nero, con una stecca storta, comprato al cinese per tre euro."
    "E ho una giacca. Una giacca di jeans imbottita, che è la cosa più calda che possiedo."
    "Lei non ha niente. Ha detto «a me la pioggia non fa niente, io sono di Murmansk». Ma trema."

    menu:
        "Le do l'ombrello.":
            $ scelta_pioggia = "ombrello"
            "Apro l'ombrello. La stecca storta fa un rumore di protesta. Glielo metto in mano e chiudo le sue dita sul manico."
            i sincero "Lo tenga lei. Io sono giovane. Mi asciugo in fretta."
            v seria "E lei?"
            i comico "Io resto qui fuori. A crescere. Come le piante del signor Bonetti."
        "Mi tolgo la giacca e gliela metto sulle spalle.":
            $ scelta_pioggia = "giacca"
            "Mi sfilo la giacca di jeans. In un secondo la pioggia mi entra nella maglietta e scopre dei punti della mia schiena che non sapevo di avere."
            "Gliela appoggio sulle spalle, sopra il cappotto. Le arriva quasi alle ginocchia."
            i sincero "Così. Almeno le spalle."
            v seria "Lei si ammala."
            i comico "Io ho gli anticorpi della Romania. Siamo un popolo resistente. Soprattutto alla logica."

    window hide
    scene cg pioggia_ombrello with lento
    pause 2.0
    window show
    "Stiamo così. Fermi. La pioggia fa un rumore di applausi su tutto: sul tetto rotto, sulle macchine, sul cartello dell'assicurazione."
    if scelta_pioggia == "ombrello":
        "Lei sotto l'ombrello nero, dritta, con le due mani sul manico come una sentinella. Io accanto, fuori, che gocciolo dal cappello."
        "La stecca storta fa colare un filo d'acqua esattamente sulla mia spalla sinistra. Ha una mira perfetta. Anche l'ombrello è sovietico, dentro."
    else:
        "Lei con la mia giacca addosso, enorme, che le fa le spalle da pugile. Io accanto in maglietta, che divento trasparente un pezzo alla volta."
        "Si stringe il colletto sotto il mento. Annusa la stoffa, piano, come si annusa una casa nuova."
    "Valya non guarda la strada. Guarda me. Per molto tempo. Abbastanza da farmi diventare rosso sotto la maschera, anche se è buio e non si vede."
    "Poi dice una cosa. Piano. Quasi non la sento, col rumore della pioggia."
    v "Lei è gentile come un uomo di un altro secolo."
    "Fa una pausa. Corruga la fronte, come se cercasse una parola su uno scaffale troppo alto."
    v "Quale secolo, non lo so."
    "Non so se è un complimento. Non so se è una cosa triste. Credo che sia tutte e due, che è il modo in cui lei dice quasi tutto."
    if scelta_pioggia == "ombrello":
        v "Anche lui... anche gli uomini, da noi, davano l'ombrello. E poi si bagnavano con orgoglio. Era uno sport nazionale."
    else:
        v "Anche lui... anche gli uomini, da noi, davano la giacca. Poi tossivano tutto l'inverno e dicevano che non era niente. Era uno sport nazionale."
    "Si ferma. Io me ne accorgo, di quel «lui» che è scappato e che lei rimette subito a posto, come una tazza sullo scaffale."
    "Faccio finta di niente. Oggi è il giorno in cui faccio finta di niente."

    scene bg fermata_pioggia with dissolve
    show pioggia
    show ionut sincero at sx
    show valya sorridente at dx
    with dissolve
    play sound s_tuono
    show bg fermata_pioggia with flash
    i sincero "Lei mi ha fatto passare una bella giornata, signora Valya."
    v seria "Io ho criticato il pesce, le scale e una pianta."
    i comico "Appunto. Una bellissima giornata."
    v sorridente "Nu, ladno. Anche per me. Non lo dica a nessuno. Soprattutto alla pianta."
    play sound s_bus
    "Due fari gialli nella pioggia. Il 7. Arriva sbuffando, si ferma con un sospiro di freni, apre le porte con la fatica di un vecchio."
    if scelta_pioggia == "ombrello":
        "Valya chiude l'ombrello. Fa per ridarmelo. Io scuoto la testa."
        i sincero "Lo tenga. Me lo ridà giovedì."
        v seria "Giovedì. Va bene. Ma la stecca gliela ripara lei."
    else:
        "Valya si toglie la giacca dalle spalle. Fa per ridarmela. Io scuoto la testa."
        i sincero "La tenga. Me la ridà giovedì."
        v seria "Giovedì. Va bene. Ma la lavo io. Sa di saldatore."
    "Sale i due gradini dell'autobus. Uno. Due. Si tiene alla sbarra. Si gira."
    v sorridente "Ivan."
    i sincero "Sì?"
    v sorridente "Grazie per le sedie."
    hide valya with dissolve
    play sound s_bus
    "Le porte si chiudono. L'autobus riparte. Dal finestrino appannato vedo il fazzoletto blu con le rose gialle, una macchia di colore nel grigio."
    "Poi niente. Le luci rosse dietro, che si allungano sull'asfalto bagnato. Poi neanche quelle."

    show ionut malinconico at centro with dissolve
    play music m_triste2 fadein 3.0
    "Io resto lì."
    "Il signore col cane è salito sullo stesso autobus. La pensilina è tutta mia: la metà rotta e la metà buona."
    "Potrei andare nella metà buona. Non ci vado."
    if scelta_pioggia == "ombrello":
        "Non ho più l'ombrello. La pioggia mi entra nel colletto, nelle scarpe, nel cappello. Mi riempie le tasche."
    else:
        "Non ho più la giacca. La maglietta è un'idea, ormai. Ho freddo fino alle ossa, e anche un po' più in là."
    "E penso alla voce del telefono. «Il numero selezionato è inesistente.»"
    "Penso alla neve che cade di lato. Due volte. Le stesse parole."
    "Penso a Giulia: «Le storie non invecchiano.»"
    "Ha ragione. Le storie no."
    "Le persone sì. Si stancano. Dimenticano. Raccontano due volte la stessa cosa e non se ne accorgono, e tu che te ne accorgi hai due possibilità: dirlo o startene zitto."
    "Io sono stato zitto. Non so se ho fatto bene."
    "So solo che lo rifarei. Cento volte. Ogni volta che vuole."
    play sound s_tuono
    show bg fermata_pioggia with flash
    "Il cielo fa un altro tuono, più lontano, come uno che brontola andando via."
    i malinconico "Raccontamela pure cento volte, Valya."
    i sincero "Io ogni volta faccio finta che sia la prima."
    pause 1.0
    "Rimango sotto la pioggia finché il prossimo autobus non arriva. Non lo prendo. Né quello, né quello dopo."
    "A Valdorsa la pioggia cade dritta. Come una persona stanca."
    "Stasera, per la prima volta, mi sembra che cada un po' di lato."
    stop ambiente fadeout 3.0
    stop music fadeout 3.0
    scene bg nero with lentissimo
    pause 1.0
    return
