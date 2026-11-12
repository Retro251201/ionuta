label cap10:
    call titolo_capitolo("10", "Tutto quello che si può aggiustare", "Valdorsa — febbraio")

    # ------------------------------------------------------------
    # 1. FEBBRAIO — IL MESSAGGIO
    # ------------------------------------------------------------
    scene bg finestra_neve with lento
    show neve_lenta
    play ambiente s_vento fadein 3.0
    window hide
    pause 2.0
    call sms("ARKADIJ", "Stanotte la zia Valya se n'è andata. Nel sonno. L'infermiera dice che sorrideva. Il funerale è sabato, a San Nicola. Volevo che lo sapesse da me.")
    play music m_triste fadein 4.0
    pause 4.0
    window hide
    pause 3.0
    hide neve_lenta with lentissimo
    pause 2.0
    scene bg nero with lentissimo
    stop ambiente fadeout 3.0
    pause 2.0
    stop music fadeout 3.0
    pause 1.0

    # ------------------------------------------------------------
    # 2. IL FUNERALE — SAN NICOLA
    # ------------------------------------------------------------
    scene bg chiesa_ortodossa with lento
    show neve_lenta
    play sound s_campane
    call didascalia("CHIESA ORTODOSSA DI SAN NICOLA — SABATO, 10:00")
    window show

    "Sabato mattina, prima di uscire, apro il barattolo delle caramelle."
    "È pieno. Fino al tappo. Ci ho dovuto premere sopra il palmo, l'ultima volta, per farcele stare."
    "Ne prendo una. L'orso tra i ghiacci, la carta blu. La metto nella tasca interna della giacca, quella del diploma."
    call via_didascalia

    "La chiesa di San Nicola è una ex cappella di campagna, dietro la statale. I romeni ci vengono la domenica, i moldavi, gli ucraini, i russi."
    "Da fuori sembra un garage che si è messo la cupola per una festa. Una cupola piccola, azzurra, con la neve sopra come zucchero a velo."
    "Le campane suonano in un modo che non conosco. Non a distesa. A grappoli. Come qualcuno che bussa e poi ci ripensa, e poi bussa ancora."

    i malinconico "Mia nonna, a Iași, mi portava in una chiesa così. Io contavo le candele per non annoiarmi."
    i malinconico "Non mi ricordo quante erano. Mi ricordo che lei mi teneva la mano anche quando non serviva."

    play music m_triste2 fadein 3.0
    "Davanti alla porta, nella neve, ci sono già tutti."

    show rino normale at dx with dissolve
    "Rino è in giacca. Una giacca grigia, di un altro decennio, che gli tira sulle spalle. La cravatta l'ha annodata come si chiude un sacchetto dell'umido."
    "Non l'ho mai visto in giacca. Credo nemmeno lui."
    r normale "Non dire niente, Principessa."
    i sincero "Non dico niente."
    r normale "Era di quando mi sono sposato. Allora ero più magro. E più scemo."
    "Mi mette una mano sulla spalla. Pesa come una borsa degli attrezzi. La lascia lì."

    show dado serio at sx with dissolve
    "Dado ha le mani in tasca. Tutte e due. Le tira fuori, le guarda, le rimette dentro."
    "Senza il telefono in mano non sa dove tenerle. Sembra uno che ha perso un dito."
    d serio "L'ho lasciato in macchina. Spento. Spento spento, eh. Non in silenzioso."
    i sincero "Lo so, Dado."
    d serio "Mia nonna dice che ai funerali le mani servono per tenere quelle degli altri."
    d serio "Io non ho mai capito se era una cosa bella o una minaccia."

    hide dado with dissolve
    hide rino with dissolve
    show giulia seria at dx with dissolve
    "Giulia ha un cappotto nero al posto del grembiule nero. Per il resto è uguale. Le occhiaie, la sciarpa, la bocca che non spreca niente."
    "Tiene in mano un thermos."
    g seria "Tè del Grande Nord. Tè nero, scorza d'arancia, un cucchiaio di lamponi."
    g seria "Non so se in chiesa si può. Non so cosa si fa, ai funerali ortodossi. Ho letto tre articoli e si contraddicono."
    i malinconico "Si sta in piedi. Si accendono le candele. Si piange senza fare rumore."
    g seria "Questo lo so fare."
    "Non mi dice «mi dispiace». Nessuno, qui, mi dice «mi dispiace». È il regalo più grande che mi potessero fare."

    hide giulia with dissolve
    show mario serio at sx with dissolve
    "Poi c'è Mario. Ci metto un secondo a riconoscerlo."
    "Non ha gli occhiali da sole."
    "Ha gli occhi azzurri. Chiarissimi. Stanchi. Occhi da mare del Nord, su una faccia di Napoli."
    m serio "Ue', guagliò. Che guardi?"
    i sincero "Lei ha gli occhi, Mario."
    m serio "Eh. Tengo pure le sopracciglia. Ma non lo dico in giro."
    m serio "La discrezione è per i vivi. Ai morti si va a faccia scoperta. Così ti riconoscono, se vogliono."

    show max deluso at dx with dissolve
    "Accanto a lui, Max. Senza catene d'oro. Senza occhiali. Senza una parola d'inglese."
    "Ha un cappotto blu, troppo leggero per febbraio, e un mazzo di garofani bianchi che deve aver pagato una fortuna."
    x deluso "Il fioraio voleva mettermi il fiocco rosa. Gli ho detto: è per una signora seria."
    x deluso "Lei a me mi ha detto che non so riparare nemmeno la mia faccia."
    x deluso "Aveva ragione. Ci sto lavorando."
    "È la frase più sincera che Max abbia mai pronunciato. Non ride nessuno. Ci sarebbe da ridere, e non ride nessuno, ed è giusto così."
    hide max with dissolve
    hide mario with dissolve

    stop music fadeout 3.0
    scene bg chiesa_interno with lento
    play sound s_campane
    pause 1.5

    "Dentro fa caldo. Cera e incenso. Le icone guardano da tutte le parti, con occhi grandi che non giudicano. Aspettano."
    "Non ci sono panche. La gente sta in piedi, come Valya ha detto che si fa. Signore col fazzoletto in testa. Un vecchio con le medaglie sul cappotto."
    "Le candele sono sottili come matite gialle. Si comprano all'ingresso, si accendono una dall'altra e si piantano nella sabbia."
    "Ne accendo una. Mi trema la mano, e la fiamma trema con me. Poi smette lei, e smetto anch'io."

    play music m_valya fadein 4.0
    "Il coro comincia. Quattro voci, da dietro una specie di parete di icone. Non c'è un organo. Non c'è niente. Solo voci."
    "Non capisco le parole. Capisco «Valentina». Capisco «vechnaya pamyat»: Giulia me lo traduce all'orecchio. Memoria eterna."
    i malinconico "Memoria eterna."
    i malinconico "Proprio a lei, che la memoria la perdeva a pezzi. Come una radio che va e viene."
    "Il prete gira intorno alla bara con l'incensiere. Il fumo sale, si allarga sotto la cupola, sembra nebbia del fiume."
    "La bara è aperta. Non mi avvicino subito. Poi mi avvicino."
    "Ha il fazzoletto a fiori. Qualcuno le ha messo il fazzoletto a fiori. Le sopracciglia, finalmente, non giudicano niente."
    "Sembra una che ascolta."
    "Le sfioro la mano. È fredda come la neve di Murmansk che non ho mai visto, e che cadeva di lato."
    i sincero "Spasibo, Valentina Petrovna."
    i sincero "Lo so, lo pronuncio male. Lei me lo diceva sempre."

    stop music fadeout 3.0
    scene bg chiesa_ortodossa with dissolve
    show neve_lenta
    play ambiente s_vento fadein 2.0

    "Fuori ha ricominciato a nevicare, piano. Arkadij mi aspetta vicino al cancello."
    show ionut malinconico at sx with dissolve
    show arkadij triste at dx with dissolve
    "Ha il cappotto scuro di sempre. Il telefono non c'è. Ha gli occhi rossi di chi ha deciso di non piangere e non ci è riuscito."
    "In mano ha la borsa della spesa a quadri. La borsa di Valya."
    a triste "Signor Ionuț."
    i malinconico "Ionuț basta. Il signore era Aldo."
    a triste "...Ionuț."
    "Apre la borsa. Dentro c'è la Spidola, con la sua custodia di finta pelle consumata agli angoli."
    show item radio with dissolve
    a triste "Ha lasciato scritto che è sua. In un foglio, nel cassetto del comodino. Con la firma e la data. Come un contratto."
    a triste "Mia zia faceva così. Anche la lista della spesa la firmava."
    i sincero "Non posso..."
    a triste "Non è una domanda. È un'eredità. Le eredità non si rifiutano. Si portano."
    "La prendo. Pesa come la prima volta, sul bancone, in ottobre. Uguale. Non so perché pensavo che sarebbe stata più leggera."
    hide item with dissolve
    a triste "E c'è questa."
    "Una busta. Carta azzurra, un po' ingiallita sui bordi. Sopra, una calligrafia dritta, da scuola sovietica, a inchiostro blu:"
    "{b}Per Ionuț. Da aprire dopo.{/b}"
    a triste "Data di novembre. Il quattordici. Era ancora... lei."
    a triste "Io a novembre ero a Milano a chiudere un fondo pensione. Lei scriveva lettere per dopo."
    a triste "Io non c'ero, Ionuț. Lei c'era."
    "Non so cosa rispondere. Allora non rispondo. Lui annuisce, come se avessi detto la cosa giusta."
    hide arkadij with dissolve
    hide ionut with dissolve

    # ------------------------------------------------------------
    # 3. LA LETTERA DI VALYA
    # ------------------------------------------------------------
    stop ambiente fadeout 2.0
    scene bg cameretta with fade
    play ambiente s_orologio fadein 2.0
    "La apro a casa. Sul letto. Con la Spidola accanto, accesa, sui 7.077. Fruscio basso."
    "Non so perché. Mi sembra maleducato leggerla senza che lei ascolti."

    scene cg lettera with lento
    play music m_neve fadein 4.0
    pause 1.5

    v "Caro Ionuț, Printsessa,"
    "Mi fermo subito. Rileggo."
    "A novembre lei ancora non mi chiamava così. Mi chiamava Ionuț, con la Ț che le veniva come uno starnuto."
    "Il nome nuovo l'aveva già deciso. Lo teneva da parte. Come una caramella."
    v "ti chiamo così qui, sulla carta, perché a voce ancora non oso. Una donna della mia età deve avere un po' di pudore. Poco. Un cucchiaino."
    v "Se leggi questa lettera, io non ci sono più, oppure ci sono ma non so chi sei. Il dottore dice che una delle due arriverà presto. Spero la prima. È più elegante."
    v "Scrivo adesso, finché le parole stanno ferme. Tra un po' cominciano a scappare come le galline di mia madre."

    v "La prima cosa. La radio."
    v "Tu credi di averla riparata. È vero, sei bravo, hai mani buone. Ma la radio non era rotta, golubchik. La radio aspettava che qualcuno avesse pazienza."
    v "Tu sei stato il primo, dopo Aldo, che si è seduto davanti al fruscio senza cambiare stazione."
    v "Non è una cosa piccola. Quasi nessuno sa ascoltare. Ascoltano per rispondere. Tu ascolti per sentire."
    v "È un mestiere, Printsessa. Non lo insegnano all'ITIS."

    v "La seconda cosa. Lev."
    v "Lev parlava con il cielo. Io gli rispondevo con le spine del centralino e con il cuore di una ragazza di ventisei anni, che è un cuore molto rumoroso."
    v "Una notte di dicembre la sua voce si è fermata dopo quattro minuti e diciassette secondi. Poi solo fruscio. Mi hanno detto che era morto. Io ho fermato l'orologio di mio padre, perché almeno una cosa nel mondo stesse con me."
    "Leggo questa riga tre volte."
    "Lei non lo sapeva. Quando l'ha scritta, non sapeva dei quarantadue Capodanni. Del fischio stonato ogni anno, dalla stessa frequenza, verso una donna che non poteva sentire."
    "Io lo so. E lei l'ha saputo. Alla fine. Alle Magnolie, con i fuochi fuori dalla finestra."
    "Mi fa male e mi fa bene nello stesso punto, come quando premi su un livido per vedere se c'è ancora."

    v "La terza cosa. Aldo."
    v "Aldo non sapeva cantare e non sapeva fare il tè. Però per vent'anni mi ha scritto una lettera ogni domenica, e la domenica che non arrivava la lettera arrivava lui."
    v "Ho amato due uomini, Printsessa. Uno nel cielo e uno nella cucina. Non devi scegliere quale era quello vero. Erano veri tutti e due. Il cuore non è un appartamento: non c'è un solo letto."

    if scelta_bevanda == "te":
        v "Saluta la ragazza della tisaneria. Il suo tè del primo giovedì era quasi giusto. Dille che i lamponi vanno messi prima, non dopo. Lei lo sa già, ma glielo dico io per avere l'ultima parola."
    else:
        v "Il caffè che mi hai portato il primo giovedì, dalla macchinetta, era il peggiore che ho bevuto dal 1971. L'ho bevuto tutto. Così capisci quanto mi eri già simpatico."

    v "L'ultima cosa. Tu."
    v "Lo so che ti sei innamorato di me. Una vecchia lo vede dalle orecchie. Le tue diventano rosse quando entro, come le luci del porto."
    v "Non ridere. Non vergognarti. È stata una gentilezza grande, e io l'ho presa tutta, come il caffè."
    v "Ma adesso ascoltami bene, ty durak."
    stop ambiente fadeout 2.0
    v "Non innamorarti delle vecchie, Printsessa. Innamorati della vita: è vecchia anche lei, e ha bisogno di qualcuno che la ripari."
    pause 1.0
    v "L'orologio di mio padre è nella busta. Te lo lascio. Non metterlo all'ora giusta."
    v "Lascia l'orologio alle 4:17. Ma tu vai avanti."
    v "Esci. Studia. Sbaglia. Fatti chiamare Principessa da gente che ti vuole bene, finché non diventa un nome e non una risata."
    v "E se un Capodanno ti senti solo, accendi la radio. Non è rotta. Sta ascoltando."
    v "Con affetto, e con le sopracciglia,"
    v "Valentina Petrovna Orlova Bellini. Murmansk 1942, Valdorsa per sempre."
    v "P.S. La saracinesca: in basso a sinistra, non a destra. Il signor Ruggeri sbaglia lato da trent'anni. Non dirglielo. O sì."

    pause 1.0
    "Nella busta, avvolto in un fazzoletto, c'è il Pobeda."
    show item orologio with dissolve
    play sound s_orologio
    "Lo appoggio all'orecchio. Batte. Tic, tic, tic, piccolo e testardo. Le lancette ferme sulle 4:17."
    "Il cuore va. Il tempo resta dov'è. L'avevo aggiustato così io, a novembre, senza capire perché."
    "Adesso capisco."
    hide item with dissolve
    "Piango per un'ora. Poi rido, per il P.S. Poi piango di nuovo, ma diverso. Più leggero. Come la pioggia quando diventa neve."
    stop music fadeout 4.0

    # ------------------------------------------------------------
    # 4. IL CIMITERO
    # ------------------------------------------------------------
    scene bg cimitero with lento
    show neve_lenta
    play ambiente s_vento fadein 2.0
    play sound s_passi_neve
    call didascalia("CIMITERO DI VALDORSA — DOMENICA")
    "Il giorno dopo torno da solo. Cioè, quasi."
    call via_didascalia

    "L'hanno messa accanto ad Aldo. La lapide è nuova, la sua è vecchia. Sembrano due vicini di casa che si salutano dal balcone."
    "ALDO BELLINI, 1938 — 2015. Ingegnere."
    "VALENTINA PETROVNA ORLOVA BELLINI, 1942 — e poi la data di adesso. Sotto, in cirillico, due parole che non so leggere."
    play music m_speranza fadein 4.0
    "Tiro fuori la caramella dalla tasca della giacca. Ci ha dormito dentro due giorni. La carta è un po' stropicciata. L'orso ha l'aria di uno che ha viaggiato."
    "La appoggio sul marmo, nella neve. Esattamente al centro, come lei la metteva sul bancone."
    show ionut sincero at sx with dissolve
    i sincero "Una a settimana. Facciamo che adesso tocca a me."
    i sincero "Il barattolo è pieno, Valentina Petrovna. Non c'entrava più niente. Ho dovuto premere."
    i sincero "Non le mangio. Lo so che lei direbbe di mangiarle. Non le mangio lo stesso."

    play sound s_passi_neve
    show arkadij sera at dx, entra_dx
    "Sento dei passi dietro di me. Arkadij. Senza borsa, senza telefono, con le mani rosse dal freddo."
    a sera "Le ho sempre trovate nelle tasche dei suoi cappotti. Pensavo fosse una mania da vecchia."
    i malinconico "Era una mania da vecchia. Le manie da vecchia sono importanti."
    "Lui guarda la caramella. Fa un mezzo sorriso, il primo che gli vedo."
    a sera "Ho venduto l'appartamento di via dei Tigli. Il samovar no. Il samovar viene a Milano, sul mio tavolo. Non so nemmeno come si accende."
    i sincero "Con pazienza. Come tutto quello che è di lei."
    a sera "Le devo delle scuse. Per ottobre, per dicembre. Per il parcheggio."
    i sincero "Lei aveva paura per lei. Anche io avevo paura per lei. Eravamo dalla stessa parte, solo girati male."
    "Arkadij mi tende la mano. Io la guardo un secondo di troppo, come uno che controlla se una spina è collegata."
    "Poi la stringo."
    "Ha una stretta forte, fredda, un po' imbarazzata. Una stretta da uomo che firma contratti e non sa firmare le paci."
    "Dura più di quanto si usa. Nessuno dei due la lascia per primo."
    a sera "Se un giorno passa da Milano, il tè lo faccio io. Male."
    i sincero "Allora ci metta la marmellata. Prima, non dopo."
    hide arkadij with dissolve
    "Se ne va lungo il vialetto. La neve gli copre le orme quasi subito."
    "Io resto ancora un po'. Ascolto. Il cimitero di Valdorsa, a febbraio, fa un rumore bianco che somiglia moltissimo a un fruscio."
    hide ionut with dissolve
    stop music fadeout 3.0
    stop ambiente fadeout 3.0

    # ------------------------------------------------------------
    # 5. MARZO — LA LAMPO
    # ------------------------------------------------------------
    scene bg negozio with fade
    play music m_negozio fadein 2.0
    call didascalia("RIPARAZIONI LAMPO — MARZO")
    "Marzo arriva in ritardo, come gli autobus della linea 4."
    call via_didascalia

    "Il trentuno si avvicina. Dovremmo essere fuori. Al posto nostro, le sigarette elettroniche al gusto cheesecake."
    "Solo che a gennaio la catena delle sigarette al gusto cheesecake è fallita. Prima ancora di aprire. Hanno chiuso quaranta negozi in un giorno."
    "La direzione del Girasole, con trenta vetrine vuote e la carta da pacchi alle finestre, ha scoperto all'improvviso di volerci bene."
    "Rinnovo di un anno. Affitto ridotto. «Valorizzazione delle realtà storiche del territorio». Siamo una realtà storica. Lo ha scritto un geometra."

    show rino buono at dx with dissolve
    show ionut ironico at sx with dissolve
    r buono "Principessa. Vieni qua. Siediti."
    "Mi indica lo sgabello. Quello con la vite che punge."
    i sarcastico "Mi sta licenziando sulla vite? È una tortura medievale?"
    r normale "Siediti e basta."
    "Mi siedo. La vite punge. Rino tira fuori un foglio a quadretti, piegato in quattro. Ci sono dei conti a matita, cancellati e riscritti."
    r normale "Io ho sessantadue anni. Ho la schiena di un frigorifero e la pazienza di un citofono."
    r normale "Voglio andare a pescare. Al Po. Senza prendere niente, che i pesci non li sopporto."
    r buono "Tu ti prendi la Lampo. Non tutta. Un pezzo all'anno. Un quinto. Paghi quello che puoi, quando puoi. Il resto lo segno qui."
    show ionut sincero
    "Mi passa il foglio. In alto, in stampatello storto, c'è scritto: RIPARAZIONI LAMPO — PIANO PRINCIPESSA."
    i sincero "Rino... io non so nemmeno se..."
    r normale "Non sai. Lo so. Nessuno sa. Io nel '89 non sapevo cos'era un transistor. Lo chiamavo «quel coso con le zampe»."
    r normale "Però. Condizioni."
    r arrabbiato "Uno: ti iscrivi a quel corso. L'ITS. Elettronica. Due sere a settimana e il sabato, a Bologna. Mario dice che c'è il treno delle sei e venti."
    r arrabbiato "Due: la patente da radioamatore. Così smetti di usare quella di Mario come se fosse il tuo motorino."
    r normale "Tre: la radio la tieni accesa. In negozio. Non Radio Rai, quella me la porto al fiume. La sua."
    i sincero "...Tutto qua?"
    r buono "Quattro: non fare quella faccia. Mi viene da piangere e ho sessantadue anni. Va' a lavorare."
    "Si alza. Va nel retro. Lo sento soffiarsi il naso come una tromba di Gerico. Dice che è l'allergia. A marzo. Ai condensatori."
    hide rino with dissolve

    show dado ride at dx with dissolve
    d ride "PRINCIPESSA! Hai sentito? Sei il CAPO! Ti devo dare del lei? Ti devo fare l'inchino?"
    i ironico "Puoi cominciare a pulire il saldatore. Sono tre anni che è incrostato."
    d comico "Il potere ti ha già cambiato. Lo sapevo. Faccio un video."
    i sincero "Dado."
    d serio "Scherzo. Il telefono sta nel cassetto, guarda. Da febbraio lo apro solo a pranzo."
    hide dado with dissolve

    "Il ventidue marzo viene la mamma."
    "Non è mai venuta, in nove mesi. Turno di notte dal signor Ferretti, sonno di giorno, la vita in mezzo come una fetta di prosciutto sottile."
    "Ha preso un giorno libero. Il primo dell'anno, dice. Lo dice come si dice una bugia innocente: era il primo dell'anno scorso."
    play sound s_campanella
    "Entra. Il campanello fa il suo verso da gallina. Lei sobbalza, poi ride."
    "Ha il cappotto buono e le mani screpolate dalla candeggina. Guarda gli scaffali, i telefoni smontati, la radio di Valya sul bancone che frusciava piano."
    if scelta_mamma == "verita":
        "Da quella telefonata di dicembre, quella in cui le ho detto la verità, ci parliamo. Non tanto. Ma ogni giorno. Dieci minuti, tra il suo turno e il mio."
        "Lei sa di Valya. Sa tutto. Non mi ha mai detto che ero ridicolo. Mi ha detto che anche lei, a diciannove anni, si era innamorata di una cosa che non poteva avere: l'Italia."
        "Tocca il bancone con il palmo, come si tocca il muso di un cavallo. Poi mi guarda. Non dice niente per un po'."
        mamma "Hai le mani di tuo nonno. Lui aggiustava le biciclette di tutto il quartiere. Gratis. Per questo eravamo poveri."
        i sincero "Allora siamo una famiglia di tradizione."
    else:
        "Da quella telefonata di dicembre, quella in cui ho fatto una battuta invece di dirle la verità, ci scriviamo. Battute. Emoji sbagliate. È il nostro modo."
        "Ma oggi lei non fa battute. Tocca il bancone con il palmo, come si tocca il muso di un cavallo. Guarda la radio. Guarda me."
        mamma "Non fare lo spiritoso, Ionuț. Fammi vedere dove lavori. Fammi vedere tutto."
        i sincero "...Va bene. Tutto. Anche le cose rotte."
    "Le faccio vedere tutto. Il saldatore incrostato. Il barattolo delle Mishka, pieno. Il Pobeda nel cassetto, che batte alle 4:17."
    "Rino le offre il suo caffè. Lei lo beve tutto per gentilezza. Poi gli parla di me in romeno, e Rino annuisce come se capisse. Forse capisce."
    hide ionut with dissolve
    stop music fadeout 3.0

    # ------------------------------------------------------------
    # 6. LA SARACINESCA
    # ------------------------------------------------------------
    scene bg saracinesca_notte with fade
    play ambiente s_neon fadein 2.0
    call didascalia("IL GIRASOLE — 21:40")
    "Quella sera resto io a chiudere. Da solo. Rino è già al fiume con la testa."
    call via_didascalia

    "Sopra di me, l'insegna. RIPARAZIONI LAMP, e poi il buco nero della O. Come in «oddio». Come in «ora che faccio»."
    "Sul bancone ho una O nuova. Tubo di vetro, gas neon, trasformatore. L'ho ordinata a gennaio e non avevo mai avuto il coraggio di montarla."
    play sound s_neon
    with flash
    "La O si accende. Rosa, un po' tremolante, poi ferma."
    "RIPARAZIONI LAMPO. Per la prima volta da quando esisto, il negozio si chiama come si chiama."
    show mario notte at dx with dissolve
    m notte "Uh. Oddio."
    i comico "Esatto. Come in «oddio». Adesso ce l'ha."
    m notte "Pare un negozio serio. Mi fa impressione. Bravo, guagliò. Io vedo tutto."
    hide mario with dissolve

    "Poi la saracinesca."
    play sound s_saracinesca
    "La tiro giù. Scende. Si ferma. Quaranta centimetri da terra."
    play sound s_saracinesca_blocco
    "Il calcio di Ruggeri non lo faccio. Niente «Azzurro». Niente ombrello sovietico. Mi inginocchio."
    play music m_speranza fadein 3.0
    show item cacciavite with dissolve
    "Il cacciavite a taglio, quello col manico rosso. Non mi serve un principe. Me l'ero detto appeso a un sipario. Non sapevo che era una promessa."
    "Smonto il carter laterale. In basso a sinistra, come diceva il P.S. Non a destra. Rino ha preso a calci il lato sbagliato per trent'anni."
    play sound s_cacciavite
    "Dentro c'è la guida. Una lamella è piegata di tre millimetri, verso l'interno. Tre millimetri. Trent'anni di calci per tre millimetri."
    "Lavoro un'ora e mezza. Senza fretta. La pazienza, dice Valya, è un mestiere. Non lo insegnano all'ITIS. Lo insegna una radio che fruscia."
    play sound s_cacciavite
    "Raddrizzo la lamella con la pinza, un millimetro alla volta. Ingrasso il cuscinetto della molla, secco come un biscotto."
    hide item with dissolve
    "Rimonto il carter. Mi alzo. Ho le ginocchia nere e la schiena di Rino."
    show ionut sincero at centro with dissolve
    i sincero "Allora. Vediamo se obbedisci."
    play sound s_saracinesca
    "La tiro giù."
    "Scende. Passa i quaranta centimetri senza nemmeno accorgersene."
    "Trenta. Venti. Dieci."
    with vpunch
    "Tocca terra. Un rumore pulito, pieno, come una porta che si chiude in una casa dove tutti stanno bene."
    "Chiusa. Fino in fondo."
    i malinconico "..."
    "Resto a guardarla. Una parete di metallo grigio, liscia, perfetta. Dietro, il negozio al buio. La radio, il barattolo, l'orologio."
    "È giusta. È chiusa per bene. E non mi piace per niente."
    "Così mi chino, la riprendo per la maniglia e la tiro su."
    play sound s_saracinesca
    "Quaranta centimetri. Li misuro a occhio. Ormai so quanti sono, quaranta centimetri, meglio di quanto so la mia altezza."
    "Mi fermo lì."
    "Da sotto, una lama di luce esce dal negozio sul pavimento della galleria: la lampadina della scrivania, che lascio sempre accesa, e il led verde della Spidola."
    show ionut innamorato
    i innamorato "Per far passare la luce."
    "Lo dico a voce alta. Non c'è nessuno. C'è la luce, ed è abbastanza."
    "Domani Rino la vedrà a quaranta centimetri e penserà che non l'ho aggiustata. Gli darà un calcio dal lato sbagliato. Lo lascerò fare."
    "Ci sono cose che si aggiustano e poi si lasciano un po' aperte. Apposta."
    hide ionut with dissolve
    stop music fadeout 3.0
    stop ambiente fadeout 3.0

    # ------------------------------------------------------------
    # 7. EPILOGO — 31 DICEMBRE, UN ANNO DOPO
    # ------------------------------------------------------------
    scene bg nero with lentissimo
    pause 1.0
    call didascalia("31 DICEMBRE — UN ANNO DOPO")
    pause 2.0
    call via_didascalia

    scene bg tetto_notte with lento
    show neve_lenta
    play ambiente s_vento fadein 3.0
    play music m_finale fadein 4.0

    "Il tetto del Girasole, a fine dicembre, è uguale a un anno fa. Le stesse antenne, le stesse pozzanghere ghiacciate, la stessa insegna gialla del girasole che ronza al contrario."

    scene cg tutti_sul_tetto with dissolve
    show layer master at ricordo
    "Un anno fa eravamo in sei, qui sopra. Max scivolava, Rino cantava, Dado filmava senza pubblicare, Mario dava ordini come un comandante di porto."
    "E io correvo giù per le scale con una radio in braccio, verso una donna che aspettava da cinquantasei anni."
    show layer master at normale
    scene bg tetto_notte with dissolve
    show neve_lenta

    "Stasera siamo in tre. Rino è al veglione dei pescatori del Po. Dado è a casa con la nonna, che ha detto: «Il Capodanno si fa in famiglia, poi vai dove vuoi». Max è in Thailandia. Dice."

    show mario notte at dx with dissolve
    m notte "Allora, operatore. Sei pronto?"
    i ironico "Mi chiami operatore un'altra volta e le smonto la guardiola."
    m notte "Ti ho chiamato Principessa per un anno. Adesso tieni la patente. Ti spetta il titolo. IU4PRN. Lo hai scelto tu."
    i imbarazzato "È uscito a caso. Me l'ha assegnato il Ministero."
    m comico "Eh, a caso. P, R, N. Il Ministero sa tutto, guagliò. Pure io vedo tutto. Ma il Ministero di più."
    "Mario ha gli occhiali da sole. Di notte. Sul tetto. Sotto la neve. Li ha rimessi il giorno dopo il funerale, «per la discrezione». Io sono contento che siano tornati."

    show giulia sera at sx with dissolve
    "Giulia arriva dalla scaletta di servizio con il thermos. Il cappotto nero, la sciarpa, il naso rosso."
    g sera "Tè del Grande Nord. I lamponi li ho messi prima. Mi sono adeguata alla volontà della defunta."
    i sincero "Gliel'ho detto io?"
    g sorride "Me l'hai letto. Tre volte. A febbraio, a marzo, e ad agosto quando eri ubriaco di limoncello."
    i imbarazzato "Non ero ubriaco. Ero... sentimentale."
    g sera "Eri sentimentale in piedi su una sedia."
    "Quest'anno Giulia ha dato quattro esami. Io due all'ITS, e quello di radio, con Mario fuori dall'aula che sudava più di me."
    "Tra noi c'è una cosa che non si dice. Non l'abbiamo detta nemmeno quest'anno. Però stiamo vicini, sulle scale mobili, e nessuno dei due si sposta."

    "Sotto la giacca, nel taschino, il Pobeda batte. Tic, tic. Le lancette sulle 4:17."
    "Al polso ho un orologio digitale da nove euro, preso da Max con lo «sconto amici». Quello va avanti. Segna 23:58."
    "Ho anche una caramella in tasca. L'ultima del barattolo. L'ho tirata fuori stasera."

    play sound s_radio_sintonia
    "Mario accende il trasmettitore. Le lucine si svegliano. Io ruoto la manopola fino al numero."
    "7.077. Banda dei quaranta metri."
    play ambiente s_statica fadein 2.0
    "Il fruscio arriva come arriva sempre. Come un mare visto da lontano. Come qualcuno che respira nell'altra stanza."
    "Da qualche parte, a nord, nevica di lato."

    stop music fadeout 3.0
    pause 1.0
    play sound s_fuochi
    with flash
    "Mezzanotte. In città partono i fuochi. Verdi, rossi, bianchi, sopra i capannoni e la tangenziale."
    "Premo il tasto del microfono."
    show ionut sincero at centro with dissolve
    i sincero "CQ, CQ. Qui IU4PRN, Valdorsa, Italia. Sui sette zero sette sette."
    i sincero "Non cerco nessuno in particolare. Cioè. Sì."
    "Poi fischio."
    "Fischio Notti di Mosca. Male. Malissimo. Salto due note, come il carillon prima della riparazione. Una la prendo di naso."
    "Mario chiude gli occhi dietro gli occhiali. Giulia si morde il labbro per non ridere. Ride lo stesso, piano, nel thermos."
    "Arrivo alla fine. Più o meno. Lev fischiava meglio. Lev aveva quarantadue anni di allenamento."
    "Mi avvicino al microfono. Respiro."
    show ionut malinconico
    i malinconico "Valya, ty slyshish?"
    "Lascio il tasto."
    play sound s_statica
    "Fruscio."
    "Solo fruscio."
    "Nessuna voce. Nessun «slyshu». Il cielo della pianura che soffia piano dentro l'altoparlante, con la neve dentro."
    "La radio non è rotta. Sta ascoltando."
    pause 1.5

    play music m_notti_mosca_radio fadein 4.0
    "Una mano mi trova la mano. Fredda, con i guanti tagliati sulle dita, quelli della tisaneria."
    "Giulia. Non dice niente. Non stringe forte. La lascia lì, come un ferro da stiro tiepido."
    "Come faceva lei, sul bancone, il primo dicembre."
    show ionut innamorato
    "Sorrido. Sotto la mezza maschera, dalla parte scoperta. Quella che si vede."
    "Tiro fuori la caramella. L'orso tra i ghiacci, la carta blu. La scarto. La mangio."
    i innamorato "Questa la mangio. Stasera."
    "Mario spegne il trasmettitore. Il fruscio si chiude come una porta socchiusa. Quaranta centimetri. Per far passare la luce."
    hide ionut with dissolve

    scene bg cielo_stelle with lentissimo
    show neve_lenta
    pause 2.0
    "Sopra di noi, il cielo. Pieno di onde che non si vedono. Di voci di cinquant'anni fa che ancora viaggiano, da qualche parte, più in là di Plutone."
    "Il Pobeda batte nel taschino. Le 4:17. E io vado avanti."
    "Ci sono cose che non si aggiustano. Si ascoltano."
    pause 1.5

    g "Andiamo, Principessa."
    pause 1.0
    i innamorato "Andiamo."

    stop ambiente fadeout 4.0
    stop music fadeout 6.0
    scene bg nero_totale with lentissimo
    pause 2.0
    return
