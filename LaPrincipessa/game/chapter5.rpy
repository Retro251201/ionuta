label cap5:
    call titolo_capitolo("5", "Notti di Mosca", "Valdorsa — dicembre")

    # ------------------------------------------------------------
    # 1. MATTINA — GLI ADDOBBI A METÀ
    # ------------------------------------------------------------
    scene bg galleria_natale with dissolve
    play music m_natale fadein 2.0
    play ambiente s_folla fadein 2.0
    call didascalia("IL GIRASOLE — 8:52")

    "Il primo dicembre il Girasole si mette il vestito della festa."
    "Lo stesso vestito da quindici anni. Un po' stretto sui fianchi."
    "Sopra l'atrio pendono sei stelle cometa. Ne funzionano tre."
    "La renna vicino alle scale mobili ha il naso rosso che lampeggia. Gli occhi no. Sembra una renna con un segreto."
    "Sulla fontana spenta c'è la scritta luminosa BUON NATALE. Accese ci sono solo «BUO NATA E»."

    call via_didascalia

    i ironico "Sembra il nome di un cantante neomelodico."
    i ironico "Stasera al Girasole, in esclusiva: {b}Buo Nata E{/b}."

    show giulia normale at dx with dissolve
    g normale "Hanno risparmiato sulle consonanti. È la crisi."
    i sarcastico "Anche noi abbiamo un'insegna in crisi. Ci manca una O."
    g sorride "Voi siete avanguardia. Loro sono solo stanchi."
    g seria "Rino è arrivato alle sette e mezza. Con una busta in mano. Non mi ha salutato."
    i imbarazzato "Rino non saluta mai."
    g seria "Di solito mi dice che il mio tè sa di erba tagliata. Oggi niente."
    "Giulia torna dietro il suo bancone. Io guardo la renna. La renna guarda me, con il naso."
    hide giulia with dissolve

    scene bg negozio with dissolve
    stop ambiente fadeout 1.0
    play sound s_campanella

    "Alla Lampo c'è odore di stagno e di caffè bruciato. Come sempre."
    "Diverso è Rino. È seduto sul suo sgabello, quello con la vite che punge, e non si lamenta della vite."

    show rino normale at dx with dissolve
    show dado ride at sx with dissolve

    d ride "Oh, la Principessa! Hai visto la renna? Ha un occhio solo che—"
    r normale "Dado. Sta' zitto un attimo."
    d serio "...Va bene."
    "Dado sta zitto. Questo, da solo, è più inquietante di qualunque notizia."

    r normale "È arrivata la raccomandata della direzione."
    r normale "Disdetta del contratto. Il trentuno marzo ci vogliono fuori."
    r normale "Al posto nostro mettono le sigarette elettroniche. Quelle col gusto di cheesecake."

    stop music fadeout 3.0
    "..."
    "Il frigorifero dei condensatori ronza. Fuori qualcuno passa con un carrello che cigola."
    "Nessuno dice niente per un tempo lunghissimo. Forse dieci secondi."

    d serio "Ma... si può fare ricorso, no? Un avvocato. Un video. Faccio un video, Rino, lo faccio virale—"
    r arrabbiato "Non si fa niente. Trentasei anni. Ci stava che finisse."
    r normale "I negozi sono come le lampadine. A un certo punto fanno {i}tic{/i}, e basta."
    i malinconico "Rino..."
    r normale "Niente facce, Principessa. Chiudiamo mezz'ora. Vi offro il caffè. Il mio, non quello della tua amica."

    scene bg saracinesca with dissolve
    play ambiente s_neon fadein 1.0

    "Usciamo. Rino tira giù la saracinesca come ogni sera, anche se sono le nove di mattina."
    play sound s_saracinesca
    "Scende. Si ferma. Quaranta centimetri da terra. Ovviamente."
    play sound s_saracinesca_blocco
    "Rino prende la rincorsa. Due passi. Canta."
    r normale "{i}Azzurro... il pomeriggio è troppo azzurro...{/i}"
    "Il calcio di Ruggeri. Basso, a destra, preciso come un rigore di altri tempi."
    play sound s_saracinesca
    with vpunch
    "E la saracinesca... si chiude."
    "Fino in fondo. Senza un rumore storto. Per la prima volta, il calcio di Ruggeri funziona. Senza l'ombrello di Valya."
    show rino sera at centro with dissolve
    "Rino la guarda."
    "Non come si guarda una cosa che finalmente funziona."
    "La guarda come si guarda un amico che ti dà ragione nel momento sbagliato."
    r sera "Ma va' a quel paese, va'."
    r sera "Trentasei anni che ti prendo a calci. E aspetti adesso."
    "Lo dice piano, alla saracinesca. Poi si mette le mani in tasca e va verso il bar."
    "Io e Dado restiamo lì, davanti a una porta chiusa per bene. È la cosa più triste che abbia mai visto riparata."
    hide rino with dissolve
    stop ambiente fadeout 2.0

    # ------------------------------------------------------------
    # 2. IL CARILLON
    # ------------------------------------------------------------
    scene bg negozio_sera with dissolve
    call didascalia("RIPARAZIONI LAMPO — 18:40")
    "Il pomeriggio passa come passano i pomeriggi brutti. Lento, e poi tutto insieme."
    call via_didascalia

    play sound s_campanella
    play music m_valya fadein 2.0
    show ionut ironico at sx with dissolve
    show valya seria at dx, entra_dx

    "Il campanello fa il suo verso da gallina. Entra il fazzoletto a fiori. Poi la borsa a quadri. Poi lei."
    v seria "Buonasera, Ionuț."
    i imbarazzato "Buonasera, signora Valentina. Oggi niente Ivan?"
    v seria "Ivan era per i primi tempi. Adesso so come si chiama. Non si monti la testa."
    "Mi guarda. Le sopracciglia fanno il loro lavoro di ispezione."
    v seria "Lei ha la faccia di un negozio che chiude."
    i sarcastico "...Ha parlato con Rino?"
    v seria "No. Ho guardato la vetrina. Il signor Ruggeri ha tolto il presepe. Un uomo che toglie il presepe il primo dicembre ha ricevuto una lettera."
    i malinconico "A marzo. Le sigarette elettroniche."
    v triste "Bozhe moy. Fumare la frutta. Che secolo."
    "Non dice «mi dispiace». Appoggia una mano sul bancone, vicino alla mia. Non la tocca. La lascia lì, come un ferro da stiro tiepido."

    v sorridente "Nu, ladno. Le ho portato un lavoro. Le cose rotte aiutano, quando tutto il resto è rotto."
    "Dalla borsa tira fuori una scatolina di legno chiaro, con un pattinatore di latta sul coperchio."

    show item carillon with dissolve

    v nostalgica "Un carillon. Lo carichi, prego. Piano. È vecchio quasi come me."
    "Giro la chiavetta. Tre giri. Il pattinatore comincia a girare su se stesso, un po' storto."
    play sound s_carillon
    "La melodia esce piccola, d'argento. La conosco anche senza conoscerla. Una canzone che sa di treno di notte."
    "Poi, a metà frase, un buco. Una nota che non c'è. E subito dopo un altro."
    "Come uno che sale le scale al buio e salta due gradini."

    v nostalgica "«Podmoskovnye vechera». Notti di Mosca. Millenovecentocinquantasei."
    v nostalgica "Il carillon l'ha comprato Aldo, a un mercatino di Bologna. Aldo non sapeva cantare. Stonava anche il «tanti auguri»."
    v sorridente "Allora ha comprato una scatola che cantava al posto suo."
    i sincero "E sapeva che era la sua canzone?"
    v profilo "Sapeva che era la mia canzone. Non ha mai chiesto perché."
    v profilo "Era un uomo così. Lasciava le porte chiuse, se non le aprivi tu."
    "C'è una porta anche adesso, in quello che dice. La vedo. Non la apro."

    hide item with dissolve
    "Apro invece il fondo del carillon. Due viti piccolissime. Dentro: il cilindro con le sue spine d'ottone e il pettine d'acciaio."
    i ironico "Il pettine ha due denti rotti. Il quindicesimo e il sedicesimo. Per questo la canzone zoppica."
    v seria "Si può aggiustare?"
    i sincero "Non si trovano pettini di ricambio. Però si può trapiantare un dente da un altro carillon. Lo saldo, e poi lo limo finché non canta giusto."
    v sorridente "Un trapianto. Come i cuori."
    i imbarazzato "Più o meno. I cuori di solito non si accordano con la lima."
    v seria "Lo voglio sentire intero, Ionuț. Una volta. Tutta la canzone, senza buchi."
    v seria "Giovedì passo a prenderlo. Alla chiusura. Prima ho il dottore."
    i sincero "Sarà pronto."

    "Si avvia. Sulla porta si ferma, torna indietro e posa una caramella sul bancone. L'orso tra i ghiacci, la carta blu."
    "Come ogni settimana. La metto nel barattolo con le altre. Ce ne sono sette."
    hide valya with dissolve
    stop music fadeout 2.0

    # ------------------------------------------------------------
    # 3. LA NOTTE IN LABORATORIO E IN GUARDIOLA
    # ------------------------------------------------------------
    scene bg laboratorio_notte with fade
    play ambiente s_neon fadein 2.0
    call didascalia("LABORATORIO — 23:47")
    play music m_notte fadein 2.0

    "Rino mi ha lasciato le chiavi senza fare domande."
    "«Chiudi tu, Principessa. Tanto adesso la saracinesca si chiude. Bastarda.»"
    call via_didascalia

    "Il donatore è un carillon di plastica a forma di palla di neve, preso dal magazzino. Suona «Jingle Bells». Made in China, 2009."
    "Gli chiedo scusa prima di aprirlo. Non è una cosa che dico in giro."
    play sound s_cacciavite
    "Stacco due denti dal suo pettine. Sono un po' più spessi. Li assottiglio con la carta vetrata, sotto la lente."
    "Lo stagno d'argento fa un filo di fumo che sa di caramella bruciata."
    "Il primo dente regge. Il secondo si piega. Lo raddrizzo con le pinzette, trattenendo il respiro come se dormisse."

    show mario notte at dx with dissolve
    m notte "Uè. C'è luce alla Lampo all'una meno un quarto. O sono i ladri, o è la Principessa."
    i comico "Sono un ladro, Mario. Rubo denti ai carillon."
    m comico "Bravo. Il crimine organizzato del futuro."
    "Mario porta gli occhiali da sole anche adesso. Dice che è per la discrezione. Tiene il termos sotto il braccio come un neonato."
    m notte "Che stai facendo, di preciso?"
    i sincero "Devo accordare due denti. Ma il negozio ronza, il frigo ronza, il neon ronza. Non sento niente."
    m serio "E allora vieni da me. In guardiola c'è solo il ronzio mio."

    scene bg guardiola with dissolve
    stop ambiente fadeout 1.0
    play ambiente s_orologio fadein 1.0
    show mario notte at dx with dissolve
    show ionut ironico at sx with dissolve

    "La guardiola è una scatola di vetro con dodici monitor in bianco e nero. Corridoi vuoti, parcheggi vuoti, la renna."
    "Su una mensola c'è un vecchio ricetrasmettitore, con un adesivo: IZ4MRO."
    m notte "Il centro commerciale di notte è una cattedrale. Senza santi, ma con le scale mobili."
    m notte "Siediti. Caffè?"
    i ironico "Sono le due."
    m comico "Appunto. A quest'ora il caffè non sveglia. Fa compagnia."

    "Appoggio il pettine su un panno. Faccio vibrare il dente nuovo con l'unghia."
    "Ping. Un suono piccolo, un po' basso. Sull'app dell'accordatore la lancetta trema a sinistra."
    i sincero "È calante. Devo limare la punta. Se limo la punta sale, se limo la base scende."
    m serio "Come la gente. Togli un poco di peso in cima, e diventa più leggera."
    "Limo. Ping. Limo. Ping."
    m serio "Fermo. Quello è giusto. La lancetta sbaglia, il tuo orecchio no."
    i imbarazzato "Come fai a saperlo?"
    m serio "Diciott'anni marconista sulle navi, guagliò. Di notte, in mezzo all'oceano, il morse lo senti col corpo prima che con le orecchie."

    "Mario versa il caffè in due tappi di termos. Guarda i monitor. Uno sfarfalla."
    m notte "Lo sai perché a me piace il turno di notte?"
    m notte "Perché di notte le cose dicono la verità."
    m notte "Di giorno il centro fa il simpatico. Musichetta, offerte, «buone feste». Di notte senti le tubature, i frigoriferi, la scala mobile che si lamenta."
    m serio "Senti cosa è stanco. Cosa sta per rompersi. Pure le persone, eh. Di notte uno non ce la fa a fare finta."
    i malinconico "..."
    m serio "Tipo tu, adesso. Non stai aggiustando un carillon."
    i imbarazzato "Sto aggiustando un carillon, Mario. Ce l'ho in mano. È un carillon."
    m comico "Io vedo tutto. Dodici telecamere. Ti ho visto la settimana scorsa quando lei è uscita. Sei rimasto dieci minuti a guardare la porta."
    i imbarazzato_flip "C'era... un problema alla porta."
    m serio "Eh. Il problema alla porta."

    "Il secondo dente lo accordo in silenzio. Mario fischietta piano la nota giusta, per aiutarmi. Fischia bene. Fischia come uno che lo faceva per lavoro."
    "Alle tre e venti rimonto il pettine. Avvito il fondo."
    "Ho la chiavetta tra le dita. Basterebbe un giro per sapere se ho fatto bene."
    i sincero "No. Non lo provo."
    m serio "E perché?"
    i sincero "Perché la prima volta intera deve sentirla lei."
    "Mario non dice niente. Si toglie gli occhiali, li pulisce col fazzoletto, se li rimette. Per Mario è un discorso lunghissimo."
    stop music fadeout 2.0
    stop ambiente fadeout 2.0

    # ------------------------------------------------------------
    # 4. GIOVEDÌ — VALYA ARRIVA TARDI
    # ------------------------------------------------------------
    scene bg galleria_notte with fade
    play ambiente s_pioggia fadein 2.0
    call didascalia("IL GIRASOLE — GIOVEDÌ, 20:06")

    "Il Girasole chiude alle otto. Alle otto e sei le vetrine sono buie, e la renna lampeggia per nessuno."
    "Rino è andato via presto. Dado pure. Ho la saracinesca a metà e il carillon in una scatola da scarpe, avvolto in un panno."
    call via_didascalia
    "Lei non è venuta. Mi dico che ha avuto un contrattempo. Mi dico che è il dottore. Me lo dico molte volte."

    play sound s_passi
    "Poi, dal fondo del corridoio, dei passi corti. Il rumore di una borsa a quadri che strofina contro un cappotto."
    play music m_valya fadein 2.0
    show ionut sincero_flip at sx with dissolve
    show valya sera at dx, entra_dx

    "È bagnata. Il fazzoletto è scuro di pioggia, il cappotto fuma un poco sotto la luce di sicurezza."
    v sera "Sono in ritardo. Lo so. Non me lo dica."
    i sincero "Non glielo dico. Ma è fradicia."
    v seria "Pioveva. A Valdorsa piove come si piange ai funerali: per educazione, e senza smettere."
    i sincero "Non aveva l'ombrello?"
    v seria "Certo che avevo l'ombrello. Io ho sempre..."
    "Si guarda la mano destra. La mano dove di solito c'è l'ombrello. La guarda come se qualcuno l'avesse svuotata mentre dormiva."
    v triste "L'avevo. In farmacia. O sul bus. O..."
    v triste "Bozhe moy. Non lo so."

    if scelta_pioggia == "ombrello":
        "È l'ombrello che le ho dato io, alla fermata. Quello blu con una stecca storta. Non dico niente."
        "Non me ne importa niente dell'ombrello. Mi importa della faccia che fa adesso."
    else:
        "È l'ombrello nero col manico di legno. Quello che ha messo in riga la nostra saracinesca con un colpo solo."
        "Senza ombrello, lei sembra disarmata. Lo sembra anche a se stessa."

    "Per un secondo ha negli occhi una paura che non le ho mai visto. Poi la piega e la mette via, come si piega un fazzoletto."
    v seria "Nu, ladno. Gli ombrelli sono come i gatti. Tornano quando vogliono."
    i ironico "O fanno una nuova vita con un'altra signora."
    v sorridente "Traditori. Come la sua saracinesca."
    "Ride, e io rido con lei, un po' troppo forte. E poi non diciamo più niente dell'ombrello."

    show mario notte at centro with dissolve
    m notte "Buonasera, signora. Il centro è chiuso."
    v seria "Lo vedo, giovanotto. Ho gli occhi vecchi, non ciechi."
    m comico "Però stasera, guarda un po', io non vedo niente. Proprio niente. Le telecamere del corridoio B si guastano ogni tanto."
    m notte "Tipo per una mezz'oretta."
    m notte "E le luci di Natale le ho spente io. Consumano. Lasciamo solo quelle di sicurezza."
    "Mi guarda da sopra gli occhiali da sole. Per la prima volta vedo i suoi occhi. Sono gentili. Poi se ne va lungo il corridoio, fischiettando."
    hide mario with dissolve
    stop music fadeout 3.0

    # ------------------------------------------------------------
    # 5. LA GALLERIA VUOTA — IL BALLO
    # ------------------------------------------------------------
    scene bg galleria_vuota with lento
    stop ambiente fadeout 3.0
    show vignetta

    "La galleria vuota è un posto che non conosce nessuno."
    "Le scale mobili ferme. La fontana senza acqua. Sopra di noi le stelle cometa spente, appese ai fili come pesci addormentati."
    "Restano le luci di sicurezza, verdi, basse. E la pioggia sul lucernario, lontana, come un applauso nell'altra stanza."

    show ionut sincero at sx with dissolve
    show valya sera at dx with dissolve

    "La faccio sedere sul bordo della fontana. Le porgo la scatola."
    show item carillon with dissolve
    i sincero "Lo carichi lei."
    v nostalgica "Spasibo."
    "Tre giri. Le sue dita sono rosse di freddo. Sbagliano la chiavetta la prima volta."
    "Il pattinatore si mette a girare."

    play sound s_carillon
    pause 1.5
    play music m_notti_mosca fadein 4.0

    "La melodia esce. Piccola, d'argento."
    "Arriva al punto dove prima c'era il buco."
    "E non c'è più il buco."
    "Il quindicesimo dente. Il sedicesimo. Due note piccolissime, accordate in una guardiola alle due di notte da un ragazzo e da un marconista."
    "Lei chiude gli occhi."
    hide item with dissolve
    v nostalgica "...Intera."
    "Lo dice in un soffio. Come si dice il nome di qualcuno che dorme."

    "La canzone va avanti. Lei apre gli occhi e mi guarda come se avesse deciso una cosa."
    v seria "Lei balla, Ionuț?"
    i imbarazzato "No. Cioè, una volta. Alla recita. Ma ero appeso a un cavo, non conta."
    v sorridente "Bene. Neanche io ballo. Da trentun anni."
    "Si alza. Si toglie il fazzoletto bagnato e lo piega sul bordo della fontana. Ha i capelli bianchi, raccolti stretti."
    "Mi tende la mano. Il palmo in giù, come fanno nei film in bianco e nero."
    v seria "Allora non balliamo. Facciamo solo i passi."

    window hide
    scene cg ballo with lento
    pause 2.0
    window show

    "Le prendo la mano."
    "È leggera. Molto più leggera di quanto pensassi. Come un uccellino che non ha ancora deciso se fidarsi."
    "Ha le dita fredde e la pelle sottile, che si sposta sopra le ossa."
    "L'altra mano me la mette sulla spalla. Io la mia non so dove metterla."
    v seria "Qui. Sulla schiena. Non sono di vetro."
    i imbarazzato "...Sicura?"
    v sorridente "No. Ma faccia finta."

    "Appoggio la mano sulla sua schiena. Il cappotto è umido. Sa di lana bagnata, di lavanda e di autobus."
    "È l'odore più bello che abbia mai sentito, e non lo dirò mai a nessuno."
    "..."
    v seria "Raz."
    "Un passo a destra."
    v seria "Dva."
    "Un passo indietro. Le pesto quasi il piede."
    v sorridente "Tri. Ty durak. Raz..."
    "Notti di Mosca non è un valzer. Lo so perché ho contato le battute stanotte, con la lima in mano. Lei la balla lo stesso in tre."
    "Ha ragione lei. In tre viene meglio."

    "Raz, dva, tri."
    "La galleria gira piano intorno a noi. La vetrina col cartello CEDESI. La renna. Il neon della Lampo, LAMP_, che ci guarda come un fratello minore."
    "Lei mi arriva al petto. Il suo respiro è corto, regolare."
    "Raz, dva, tri."
    "Il carillon è finito da un po'. La canzone no. Esce dagli altoparlanti del centro, piano, con un'orchestra intera."
    "Mario. Io vedo tutto, dice. Vede anche quando serve un'orchestra."

    v nostalgica "{i}Ne slyshny v sadu dazhe shorokhi...{/i}"
    "Canta sottovoce. Una voce incrinata, bassa, che stona un poco. A diciannove anni doveva essere bellissima. Adesso è vera."
    v nostalgica "Vuol dire: nel giardino non si sente nemmeno un fruscio. Tutto è fermo fino al mattino."
    i innamorato "...Anche qui."
    v sorridente "Anche qui. Raz, dva..."

    "Non so quanto dura. Un minuto, dieci."
    "So che a un certo punto smetto di contare."
    "So che le sue dita si stringono un po' sulla mia spalla, quando giriamo."
    "So che una stella cometa sopra di noi fa {i}tic{/i} e si accende da sola, per un secondo, e poi si spegne di nuovo."
    "Come se anche lei avesse voluto vedere."
    "{w=0.5}...{w=0.5}tri."

    stop music fadeout 6.0
    pause 2.0
    "Ci fermiamo perché la musica si ferma. Non perché lo decidiamo noi."
    "Lei non lascia subito la mia mano. Io nemmeno."

    # ------------------------------------------------------------
    # 6. LA DICHIARAZIONE
    # ------------------------------------------------------------
    scene bg galleria_vuota with lento
    show vignetta
    play ambiente s_pioggia fadein 3.0
    show ionut ironico at sx with dissolve
    show valya sera at dx with dissolve

    "Adesso dovrei fare una battuta. Ne ho pronte almeno quattro. Sono il campione regionale delle battute al momento sbagliato."
    i ironico "Be', per uno che di solito vola appeso a un sipario, non sono andato malissimo, no? Cioè, le ho pestato un piede solo e—"
    "Mi fermo. La battuta mi muore in bocca, come un fiammifero bagnato."
    "Mi tocco la faccia. La maschera. Quella col sorriso stampato e i baffetti, che metto per far ridere Dado e non far preoccupare mia madre."
    "La tolgo."

    play music m_romantico fadein 3.0
    show ionut sincero with dissolve
    pause 1.0

    "L'aria della galleria è fredda sulla guancia. Mi sento nudo. Mi sento ridicolo. Mi sento come mi sento sempre, ma stavolta si vede."
    i sincero "Signora Valentina. Valya. Io..."
    i sincero "Allora. Io sono innamorato di lei."
    with vpunch
    i imbarazzato "Cioè. No, aspetti, l'ho detto male. L'ho detto troppo presto. Avevo un ordine. C'era un'introduzione."
    i sincero "Però è vero. Anche detto male è vero."
    "Lei non ride. Non sorride. Mi guarda e basta, con quelle sopracciglia che stavolta non giudicano."
    i sincero "Lo so che è assurdo. Lo so che ho diciannove anni e che lei ha visto Gagarin in diretta. Lo so che Dado mi prenderebbe in giro per i prossimi dieci anni."
    i sincero "Lo so che è una cosa ridicola. Ma il giovedì è il giorno più importante della settimana, da ottobre. Tutti gli altri giorni sono... i giorni prima del giovedì."

    if scelta_pioggia == "ombrello":
        i innamorato "Quella sera alla fermata le ho dato il mio ombrello. Sono tornato a casa bagnato fino alle mutande."
        i innamorato "Ero felice. Felice come un idiota. Mia madre pensava che avessi la febbre."
        i sincero "E stasera, quando ha detto che l'aveva perso, ho pensato: non importa. Gliene compro cento. Basta che torni lei."
    else:
        i innamorato "Quella sera alla fermata le ho messo la mia giacca sulle spalle. Il bus aveva i finestrini appannati, e lei ci ha disegnato un punto."
        i innamorato "Solo un punto. Sono tornato a casa in maglietta, sotto l'acqua, e non sentivo il freddo."
        i sincero "La giacca ce l'ho ancora. Non l'ho lavata. Questo non dovevo dirlo."

    i vulnerabile "Non le chiedo niente. Davvero. Non so nemmeno cosa si chiede, in questi casi."
    i vulnerabile "Volevo solo che lo sapesse. Senza la maschera. Una volta."
    stop music fadeout 3.0
    "..."
    "La pioggia sul lucernario. Il ronzio delle luci di sicurezza. Il mio cuore, che fa un rumore da lavatrice."

    play music m_valya fadein 3.0
    v seria "Ionuț."
    "È la prima volta che dice il mio nome così. Come se lo posasse su un tavolo, con cura."
    v seria "Adesso ti do del tu. Perché quello che ti dico è serio, e le cose serie si dicono vicino."
    "Fa un passo verso di me. Mi prende il mento con due dita, come si fa con i bambini quando devono guardarti."
    v seria "Io ho ottantaquattro anni. Tu diciannove."
    v seria "Insieme facciamo centotré."
    v sorridente "Troppi per l'amore. Troppo pochi per la saggezza."
    "Mi viene da ridere e da piangere nello stesso momento. Non faccio nessuna delle due cose. Resto lì, col mento tra le sue dita."

    v commossa "Ma io ti voglio bene. Questo lo sai, vero?"
    v commossa "Ti voglio bene come... no. Non come qualcosa. Ti voglio bene e basta."
    v nostalgica "Questa cosa che c'è tra noi non ha nome."
    v nostalgica "I russi hanno parole per tutto. Per la neve che cade di lato. Per la tristezza senza motivo. Per la nostalgia di un posto dove non sei mai stato."
    v sorridente "Per questa no."
    i malinconico "...Neanche i romeni."
    v sorridente "Allora siamo pari. Due popoli di poeti, e nessuna parola."

    "Infila la mano nella tasca del cappotto. Tira fuori una caramella. Carta blu, l'orso tra i ghiacci."
    "Non la posa sul bancone. Non c'è un bancone."
    "Mi prende la mano, me la apre, e la mette lì. In mezzo al palmo. Poi mi richiude le dita sopra, una per una."
    v seria "Questa non va nel barattolo. Questa la mangi. Stasera."
    i innamorato "...Sì."
    v sorridente "Brava."
    i imbarazzato "...Brava?"
    v sorridente "Mi hanno detto che tutti ti chiamano «la Principessa». Il signor Ruggeri. Il ragazzo dei video. La ragazza del tè."
    v sorridente "Io ti ho sempre chiamato Ivan, o Ionuț. Ma stasera hai ballato come una principessa vera. Male, e con dignità."
    v commossa "Printsessa."
    "Lo dice con la erre arrotolata e le esse dolci. In bocca a lei non è una presa in giro. È una parola che tiene caldo."
    i innamorato "..."
    "Per la prima volta in sei mesi quel soprannome non mi brucia."

    v seria "E adesso, Printsessa, una signora di ottantaquattro anni deve tornare a casa prima che il suo cuore faccia altre sciocchezze."
    v seria "E non ho l'ombrello. Bozhe moy."

    show mario notte at centro with dissolve
    m comico "Problema risolto. Oggetti smarriti del Girasole: quarantadue ombrelli. Prego, signora, scelga pure."
    v sorridente "Lei è un uomo pericoloso, giovanotto."
    m comico "Lo dicono tutte. Il taxi è fuori. Pagato."
    "Lei si rimette il fazzoletto, ancora umido. Mi fa un buffetto sulla guancia scoperta. Sulla guancia vera, stavolta."
    hide valya with dissolve
    hide mario with dissolve
    "La guardo andare via, piccola, con un ombrello a pois di qualcun altro."
    "La caramella mi scalda la mano. La scarto. Sa di cioccolato e di nocciola, come sempre."
    "Ma non è come sempre."
    stop music fadeout 3.0
    stop ambiente fadeout 3.0

    # ------------------------------------------------------------
    # 7. IL TETTO — MARIO
    # ------------------------------------------------------------
    scene bg tetto with fade
    play ambiente s_vento fadein 2.0
    call didascalia("TETTO DEL GIRASOLE — 23:58")
    play music m_notte fadein 3.0

    "Mario ha le chiavi di tutto. Anche della porta di ferro in cima alla scala antincendio."
    "Sul tetto ha smesso di piovere. Ci sono i condizionatori grandi come furgoni, le pozzanghere, e un'antenna storta che Mario chiama «la mia fidanzata»."
    call via_didascalia

    show mario notte at dx with dissolve
    show ionut malinconico at sx with dissolve

    m notte "Allora?"
    i malinconico "Allora le ho detto tutto."
    m notte "E lei?"
    i sincero "Mi ha detto che insieme facciamo centotré anni. Che sono troppi per l'amore e troppo pochi per la saggezza."
    m comico "Uh. Quella donna lì doveva fare la parroca."
    i malinconico "E mi ha dato una caramella. In mano."
    m serio "In mano. Non sul bancone."
    i sincero "Non sul bancone."
    m serio "Eh. Allora ti è andata bene, guagliò."

    "Ci sediamo su un bancale. Mario apre il termos. L'ultimo caffè della notte, nei due tappi."
    i vulnerabile "Mario. Sono ridicolo?"
    i vulnerabile "Un ragazzo di diciannove anni che si dichiara a una signora di ottantaquattro in un centro commerciale chiuso. Sotto una renna con un occhio solo."
    i ironico "Detta così, sembra un video di Dado."
    m serio "Detta così, sì."
    "Mario si toglie gli occhiali da sole. Li piega e se li mette nel taschino."
    m serio "Sai quante persone ho visto passare sotto quelle telecamere, in nove anni? Migliaia. Coppie che litigano per il parcheggio. Gente che si sposa e si annoia."
    m serio "Tutti a fare le cose giuste, nell'ordine giusto, all'età giusta. E dentro, niente. Fruscio."
    m notte "Tu stasera hai fatto ballare una vecchia che non ballava da trent'anni. Le hai riattaccato due denti alla canzone sua."
    m notte "E non le hai chiesto niente in cambio."

    scene bg cielo_stelle with lento
    stop music fadeout 2.0
    play music m_speranza fadein 3.0

    "Alziamo la testa. Le nuvole si sono aperte sopra la pianura. Per una volta la nebbia è scesa nei campi e il cielo è rimasto pulito."
    "Ci sono le stelle. Poche, perché c'è il parcheggio illuminato. Ma ci sono."
    m serio "Non è una cosa ridicola, guagliò."
    m serio "È una cosa rara."
    "Lo dice guardando in alto. Come uno che ha passato metà della vita a mandare segnali nel buio, senza sapere chi c'era dall'altra parte."
    i sincero "Rara come?"
    m comico "Come una radio sovietica che funziona. Come una saracinesca che si chiude. Come Rino che offre il caffè."
    i comico "Quindi tre volte in tutta la storia."
    m serio "E due erano questa settimana. Pensaci."

    "Ci penso."
    "La Lampo chiude a marzo. La saracinesca ha deciso di funzionare solo adesso, per farci un dispetto. E una signora ha perso l'ombrello e non sa dove."
    "Lo so. Ci penso anche a quello. Lo metto da parte, come lei ha messo da parte la paura, piegata in quattro."
    "Stanotte no."
    "Stanotte ho in bocca il sapore di una caramella russa e nelle orecchie una canzone del 1956, intera, senza buchi."
    "Raz, dva, tri."
    "Ho la faccia scoperta al freddo e non mi viene in mente nessuna battuta."
    "Per la prima volta, non mi serve."
    i innamorato "Mario."
    m notte "Eh."
    i innamorato "Grazie per l'orchestra."
    m comico "Io? Io non ho fatto niente. Io stasera non vedevo niente, ricordi?"
    "Poi fischietta. Piano, nel vento. Le prime note di Notti di Mosca."
    "E stavolta non manca nessun dente."

    stop music fadeout 4.0
    stop ambiente fadeout 4.0
    scene bg nero with lentissimo
    pause 1.0
    return
