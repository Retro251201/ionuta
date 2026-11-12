label cap9:
    call titolo_capitolo("9", "Trasmissione", "Valdorsa — 31 dicembre")

    # ------------------------------------------------------------
    # 1. IL PIANO
    # ------------------------------------------------------------
    scene bg negozio with dissolve
    play music m_comico fadein 1.5
    call didascalia("RIPARAZIONI LAMPO — 31 DICEMBRE, 8:40")

    "L'ultimo giorno dell'anno la Lampo apre lo stesso."
    "Rino dice che il trentuno la gente rompe più telefoni del solito. Per i brindisi. Per i video dei fuochi. Per la disperazione."
    call via_didascalia

    "Stamattina, però, nessuno ripara niente."
    "Sul bancone, al posto dei telefoni, c'è una cartina del Girasole stampata da Mario, piena di frecce a pennarello. Sembra il piano di una rapina."

    show mario serio at dx with dissolve
    show dado ride at sx with dissolve

    m serio "Allora. Silenzio in aula. Ripassiamo."
    d ride "Io faccio il palo. Ho sempre sognato di fare il palo."
    m comico "Tu fai l'autista, Dado. Il palo lo faccio io. Io vedo tutto."
    "Mario si tocca gli occhiali da sole. Sono le nove meno venti, dentro un negozio senza finestre."

    m serio "Primo. Io ho l'abilitazione. IZ4MRO, regolare, pagata, timbrata. Posso trasmettere sui quaranta metri, e i 7.077 sono dentro."
    m serio "Secondo. Il trasmettitore ce l'ho. Il mio vecchio Yaesu, quello della guardiola. Lo faccio andare in AM, come una volta."
    i ironico "Perché in AM?"
    m serio "Perché la Spidola è una signora del millenovecentosessanta, guagliò. Se le mandi la banda laterale sente solo papere che litigano."
    m serio "Terzo. Serve un'antenna. Fuori, in alto, lunga. Il punto più alto di Valdorsa che non sia un campanile è il tetto di questo centro."

    "Lo dice con orgoglio. Come se il tetto del Girasole fosse il Monte Bianco."

    m serio "Quarto. Serve il permesso per salire sul tetto."
    d comico "E chi te lo dà? Il direttore è alle Maldive. Ha messo la foto con l'ananas."
    m comico "Il permesso lo do io. Sono la vigilanza notturna. Scrivo sul registro «sopralluogo antenne, ore 23». Firmo. Approvo. Mi stringo la mano."
    "Mario si stringe la mano da solo. Dado applaude."

    m serio "Quinto. Il più difficile."
    "Si toglie gli occhiali. Non lo fa quasi mai."
    m serio "La Spidola deve stare accanto a lei. Accesa. Sintonizzata. A mezzanotte."
    m serio "E lei sta alle Magnolie. Con un pronipote che, l'ultima volta, ci voleva denunciare tutti."

    "Silenzio. Il frigo dei condensatori ronza la sua nota di sempre."
    i cupo "Ci parlo io, con Arkadij."
    d serio "Principessa... l'ultima volta che ci hai parlato gli hai dato del «salvadanaio col cappotto»."
    i imbarazzato "Era un complimento. I salvadanai sono utili."
    m serio "Senti a me. Con quell'uomo niente battute. Gli porti la cosa vera. La gente col cappotto scuro, alla cosa vera, non è abituata."
    "Mario rimette gli occhiali. Guarda l'orologio, quello digitale, non quello di Valya."
    m comico "Mancano quindici ore e venti minuti. In marina, con quindici ore, ci rifacevamo un motore."
    d ride "E in quindici ore io mi rifaccio una vita. Andiamo!"
    "Nessuno si muove per tre secondi. Poi ci muoviamo tutti insieme, in tre direzioni diverse."

    hide dado with dissolve
    hide mario with dissolve

    # --- Max ---
    scene bg chiosco_max with dissolve
    play music m_galleria fadein 1.5
    play ambiente s_folla fadein 1.0

    "Il problema dell'antenna lo risolve la persona da cui non vorrei mai essere aiutato."
    "Il chiosco FIX-IT EXPRESS brilla come un acquario. Sul bancone, un cartello nuovo: SALDI DI CAPODANNO, CAMBIO VETRINO + BACIO DELLA FORTUNA."

    show max spaccone at dx with dissolve
    show ionut ironico at sx with dissolve

    x spaccone "Princess! Che onore. Sei venuto ad arrenderti? Ti faccio un contratto, very flexible."
    i sarcastico "Mi serve un'antenna, Max. E un amplificatore."
    x spaccone "Ah. Ah ah. La Lampo viene a chiedere la tecnologia al Fix-It. Me lo segno. Lo faccio incorniciare."
    i sincero "È per la signora Valentina."

    show max deluso
    "Max smette di ridere. Si toglie gli occhiali da sole, poi se li rimette subito, come se si fosse accorto di essere nudo."
    x deluso "La Babushka? Quella che mi ha detto che non so riparare la mia faccia?"
    i sincero "Lei."
    x deluso "...Aveva ragione, tra l'altro. Ci ho pensato un mese."

    "Va sul retro. Rumore di scatoloni. Una bestemmia soffocata, molto educata. Torna con una valigia di alluminio e un rotolo di cavo."
    show max comico
    x comico "Amplificatore lineare. Era di mio zio, quello del CB. Ottocento watt. Very top of the gamma."
    x comico "E l'antenna dipolo, professionale. Ancora nel cellophane. L'ho comprata per sentire le partite dalla Calabria."
    i comico "E le hai sentite?"
    x deluso "Non l'ho mai montata. Soffro di vertigini anche sullo sgabello."

    "Mi mette tutto tra le braccia. Pesa come un frigorifero piccolo."
    x spaccone "Per la Babushka, questo e altro."
    x spaccone "Ma non ditelo in giro. Ho una reputazione."
    i sincero "Grazie, Max. Davvero."
    x comico "Stasera vengo anch'io. Qualcuno deve controllare che non me la rompete."
    hide max with dissolve
    hide ionut with dissolve
    stop ambiente fadeout 1.0

    # --- Rino e il magazzino ---
    scene bg magazzino with dissolve
    play sound s_porta

    "Rino non dice niente per tutta la mattina. Poi, a mezzogiorno, mi tira un mazzo di chiavi."
    "Una è lunga, di ferro, con un cartellino scritto a mano: MAGAZZINO — NON ROMPETE LE PALLE."

    show rino normale at dx with dissolve
    r normale "Lì dentro c'è tutto quello che ho buttato in trentasei anni senza buttarlo."
    r normale "Cavi coassiali. Connettori. Un palo di alluminio di quando c'era la TV via satellite. Prendi quello che serve."
    i sincero "Rino... grazie."
    r arrabbiato "Non mi ringraziare. Così il magazzino si svuota e a marzo trasloco meno roba."
    "Il magazzino sa di polvere, di plastica vecchia e di qualcosa che assomiglia al passato."
    "Su uno scaffale c'è un barattolo pieno di viti. Sull'etichetta, una calligrafia di donna: «Rino, ordina questo schifo». Non chiedo."
    r buono "E Principessa..."
    r buono "Il palo è pesante. Non fare l'eroe. Chiama Dado."
    i ironico "Dado non è uno che solleva le cose. Dado le filma mentre le sollevano gli altri."
    r buono "Allora chiama me."
    "Lo dice guardando lo scaffale. Mai me."
    hide rino with dissolve

    # --- Giulia ---
    scene bg tisaneria with dissolve
    play music m_negozio fadein 1.5

    show giulia seria at dx with dissolve
    "Giulia ha il numero di Arkadij. Gliel'ha lasciato lui, a Natale, «per qualunque cosa riguardi la zia». Lo ha detto a lei. Non a me."
    "Ha senso. Lei sembra una persona affidabile. Io sembro uno che vola appeso a un sipario."

    g seria "Scrivo io. Tu metteresti tre punti esclamativi e una citazione di Dostoevskij."
    i imbarazzato "Uno solo. Di punto esclamativo."
    g seria "Appunto."
    "Scrive. Cancella. Riscrive. La guardo battere sul telefono con il pollice, la fronte storta."
    g normale "«Buongiorno. Sono Giulia, della tisaneria. Ionuț vorrebbe parlarle di persona, oggi. Riguarda una cosa di sua zia, molto vecchia. Cinque minuti. Non è una truffa. Glielo garantisco io.»"
    i sincero "«Glielo garantisco io»?"
    g sorride "Ho una faccia da garanzia. Lo dicono tutti."

    play sound s_vibrazione
    "La risposta arriva dopo undici minuti. Li contiamo tutti e due, senza dirlo."
    call sms("ARKADIJ ORLOV", "Alle 15. Le Magnolie. Cinque minuti.")
    g seria "Vai. E togliti quella faccia da funerale. Mettiti quella da tecnico."
    i ironico "Ho solo quelle due."
    g sorride "Lo so. Usa la seconda."
    hide giulia with dissolve
    stop music fadeout 2.0

    # ------------------------------------------------------------
    # 2. ARKADIJ ALLE MAGNOLIE
    # ------------------------------------------------------------
    scene bg residenza with fade
    play music m_tensione fadein 2.0
    call didascalia("RESIDENZA LE MAGNOLIE — 15:00")

    "Le Magnolie è un edificio color salmone con le piante finte all'ingresso."
    "Odore di minestrina e disinfettante. Una televisione accesa da qualche parte trasmette un concerto di Capodanno registrato l'anno scorso."
    call via_didascalia

    show arkadij freddo at dx with dissolve
    show ionut freddo at sx with dissolve

    "Arkadij è in piedi nel corridoio, il telefono in mano, il cappotto ancora addosso. Come se non volesse restare."
    a freddo "Cinque minuti, ho detto. Ne sono già passati due ad aspettarla."
    i freddo "Il bus. Il trentuno passa ogni quaranta minuti."
    a freddo "Mi dica."

    "Gli dico tutto. La cassetta nel vano batterie. Il nastro spezzato. Lev. I registri dei radioamatori. I quarantadue anni."
    "Parlo troppo, come sempre quando ho paura. Lui mi lascia finire. È peggio di un'interruzione."

    a freddo "E lei vorrebbe salire su un tetto, la notte di Capodanno, con una guardia giurata e un venditore di cover per telefoni."
    a freddo "E trasmettere la voce di un morto a una donna di ottantaquattro anni che la settimana scorsa non sapeva in che anno fosse."
    i sincero "Detto così sembra brutto."
    show arkadij arrabbiato
    a arrabbiato "Detto in qualunque modo è brutto. No."
    a arrabbiato "Mia zia è fragile. Il medico dice niente emozioni forti. Niente. E lei mi porta un fantasma."
    a arrabbiato "Si rende conto di cosa può succedere? Se si agita? Se non capisce? Se crede che sia vero?"

    show ionut cupo
    "La maschera LED mi pesa sulla faccia. Dietro le X sento salire una cosa calda e stupida. Ho voglia di urlare. Di dargli ragione. Tutte e due."
    i cupo "È vero."
    a freddo "Prego?"
    i cupo "Non è un fantasma. È lui. È la sua voce. L'ha registrata per lei."

    "Tiro fuori il telefono. Mario ci ha passato la cassetta stanotte, digitalizzata. Quattro minuti e diciassette secondi."
    show item smartphone with dissolve
    i sincero "Un minuto. Solo uno. Poi me ne vado e non mi vede più."
    "Arkadij guarda il telefono come si guarda una siringa. Non dice sì. Non dice no."
    "Premo play."

    stop music fadeout 1.0
    play sound s_nastro
    hide item with dissolve
    play ambiente s_statica fadein 1.0
    "Il fruscio esce dal piccolo altoparlante. Un mare lontano, dentro un corridoio di linoleum."
    lev "Valya... ty slyshish menya?"
    "Una voce giovane. Roca di freddo. Ride un po', come chi si vergogna di parlare a una macchina."
    lev "Ogni anno, alla stessa ora.{w} Finché non mi rispondi."
    "Poi il fischio. Notti di Mosca, stonata sulla terza nota, come la fischierebbe chiunque con le labbra gelate."
    stop ambiente fadeout 2.0

    play music m_triste fadein 2.0
    show arkadij sera
    "Arkadij non si muove. Il telefono, nella sua mano, vibra per una chiamata di Milano. Lo lascia vibrare."
    a sera "...Lev."
    a sera "Mio nonno Nikolaj. Il fratello di mia nonna... cioè, il nipote di zia Valya. Io avevo sei anni."
    a sera "D'estate andavamo a Murmansk. Lui beveva il tè col cucchiaio dentro e raccontava cose che i grandi non volevano sentire."
    a sera "Diceva che la zia Valya aspettava uno che parlava col cielo."
    a sera "Io pensavo fosse una favola. Uno che parla col cielo. Pensavo... un angelo. Un pilota."
    "Si siede sulla sedia di plastica del corridoio. Il cappotto si apre. Sotto ha una cravatta storta. Non l'avevo mai visto storto."

    show arkadij triste
    a triste "Non sono mai venuto a trovarla, sa? Per dieci anni. Un bonifico a Natale. Una telefonata a Pasqua."
    a triste "Poi mi chiamano dall'ospedale e io arrivo, col cappotto, e decido tutto in tre giorni. Come uno che sistema una pratica."
    a triste "E trovo un ragazzo che le ripara le radio e la porta al food court."
    i vulnerabile "Non volevo prendere il suo posto."
    a triste "Non c'era nessun posto. Era vuoto. Lei ci si è seduto e basta."

    "Restiamo in silenzio. La televisione nella sala comune passa a un valzer."
    a triste "Se le fa male, domani la riporto io a Milano. Con me. E lei non la vede più."
    a triste "Se le fa bene..."
    a triste "...non lo so.{w} Non lo so più cosa le fa bene."
    "Si alza. Si sistema la cravatta, ma resta storta."
    a sera "Il turno di notte è dell'infermiera Paola. Le dirò di lasciarla entrare alle undici e mezza. Io sarò qui."
    a sera "E la radio... la porti. È sua. Non è mai stata mia."
    i sincero "Spasibo, Arkadij Nikolaevič."
    a sera "Il russo lo parla malissimo."
    i ironico "Lo so. Me l'ha insegnato una signora molto severa."
    "Per un secondo, uno solo, gli angoli della sua bocca si muovono. Poi risponde al telefono di Milano e mi dà le spalle."
    hide arkadij with dissolve
    hide ionut with dissolve
    stop music fadeout 2.0

    # ------------------------------------------------------------
    # 3. IL TETTO — 23:30
    # ------------------------------------------------------------
    scene bg tetto_notte with fade
    show neve
    play ambiente s_vento fadein 2.0
    call didascalia("TETTO DEL GIRASOLE — 23:30")

    "Sul tetto del Girasole nevica di lato."
    "Ci penso subito. Lei lo diceva della neve di Murmansk, due volte, parola per parola. «Cade di lato.» Adesso la vedo anch'io."
    call via_didascalia

    play music m_comico2 fadein 2.0
    scene cg tutti_sul_tetto with lento
    show neve
    pause 1.5

    "Siamo tutti qui. Non so quando è successo che diventassimo un «tutti»."
    "Mario in mezzo, col cappellino SECURITY sopra il passamontagna, dà ordini come su una nave."
    "Rino tiene il palo di alluminio. Giulia tiene la torcia e un termos. Dado tiene il telefono. Max tiene la valigia dell'amplificatore e la sua dignità. Male."

    m "Più a sinistra il palo, Rino! Il dipolo va steso verso est!"
    r "Est dov'è?"
    m "Dove c'è il cartello dell'Esselunga."
    r "Ah. Lì. Sempre stato l'est, l'Esselunga."

    "Max avanza verso il parapetto con la valigia, piano, come un astronauta. Dice «very safe, very safe» a ogni passo."
    "Al quinto «very safe» il piede gli parte."
    play sound s_passi_neve
    with vpunch
    x "Uooooh—{w} Mamma!"
    "Finisce seduto nella neve, la valigia stretta al petto come un neonato. Non la molla. Questo glielo devo riconoscere."
    d "L'ho ripresa! L'ho ripresa al rallentatore! Sembri un cigno, Max! Un cigno ferito!"
    x "Cancella. Cancella o ti cambio il vetrino con quello di un Nokia."
    g "Hai salvato l'amplificatore. Sei un eroe, Max."
    x "...Davvero?"
    g "No. Ma è Capodanno."

    "Rino pianta il palo nel supporto di cemento della vecchia parabola. Lo stringe con la chiave inglese. Il palo si piega di lato, come tutto stasera."
    "Allora Rino fa due passi indietro. Prende la rincorsa. E canta."
    r "{i}Azzurro... il pomeriggio è troppo azzurro... e lungo per me...{/i}"
    play sound s_saracinesca_blocco
    with hpunch
    "Il calcio di Ruggeri. Basso, a destra. Sul palo."
    "Il palo si raddrizza. Perfetto. Dritto come un soldato."
    "Silenzio sul tetto. Solo il vento."
    d "...Ha funzionato."
    r "Certo che ha funzionato. Con le saracinesche no, ma con i pali sì. È una tecnica specifica."
    m "Rino, tu stasera sei un marconista onorario."
    r "Io stasera sono uno che ha freddo ai piedi. Muoviamoci."

    play music m_speranza fadein 3.0
    scene cg tetto_antenna with lento
    show neve
    pause 1.0

    "Il dipolo è steso. Due fili sottili nel buio, tirati sopra il parcheggio, con la neve che ci si posa sopra e poi scivola via."
    "Sotto, la città è tutta finestre gialle. Qualcuno spara già i primi petardi, impaziente."
    "Mario apre la valigia di Max, collega il cavo di Rino, accende lo Yaesu. Le lucine verdi si accendono una a una."
    m "Ottocento watt, dice Max. Lo metto a cinquanta."
    x "Cinquanta? È come comprare una Ferrari e andare in seconda!"
    m "Non dobbiamo arrivare a Murmansk, Max. Dobbiamo arrivare in via delle Magnolie. Tre chilometri e quattrocento metri."
    m "E poi, a mezzanotte, mezza Europa è su questa banda a farsi gli auguri. Dobbiamo essere gentili. E precisi."

    "Mario infila la chiavetta col file della cassetta nel registratore digitale. Poi si gira verso di me."
    m "Io a mezzanotte in punto mando il nastro. Una volta sola, intero. Tu là devi solo avere la radio accesa sui sette-zero-sette-sette."
    m "La Spidola ha la scala dei quarantun metri. Arriva al pelo. Sta sul bordo, guagliò. Girala piano."
    i sincero "Piano. Lo so."
    m "Lo so che lo sai."

    scene bg tetto_notte with dissolve
    show neve
    show dado comico at sx with dissolve
    "Dado ha ripreso tutto. Max nella neve. Il calcio al palo. Giulia che versa il tè nei tappi del termos. Mario che parla alle lucine verdi."
    i ironico "Quanti follower fai, con questa roba?"
    show dado serio
    d serio "Boh. Tanti."
    "Guarda lo schermo. Poi blocca il telefono e se lo mette in tasca."
    d serio "Questo non lo pubblico. Questo è per noi. Per quando saremo vecchi e scemi."
    i sincero "Tu sei già scemo."
    d ride "Allora per quando saremo vecchi. Andiamo, Principessa. Il furgone è giù. Ho pure messo le catene. Più o meno."
    hide dado with dissolve

    show giulia sera at dx with dissolve
    "Prima di andare passo davanti a tutti. Non so bene come si saluta, in queste occasioni. Non c'è un manuale."
    "Rino mi fa un cenno col mento. Max alza il pollice dalla neve. Mario si tocca il cappellino, come un capitano."
    g sera "Ionuț."
    "Non mi ha mai chiamato per nome. Mai. In sei mesi."
    g sera "Stai attento al ghiaccio. E... dille buon anno da parte della ragazza del tè."
    i sincero "Glielo dico."
    g sorride "E bevi qualcosa di caldo. Hai la faccia blu."
    hide giulia with dissolve

    # --- Il furgone ---
    scene bg strada_notte with dissolve
    show neve
    stop ambiente fadeout 1.0
    play music m_neve fadein 2.0
    call didascalia("VIA EMILIA — 23:47")

    "Il furgone della Lampo ha trent'anni, un tergicristallo solo e il riscaldamento che soffia aria tiepida sui piedi e niente sulla faccia."
    "Dado guida curvo sul volante, come una nonna. Non l'ho mai visto guidare piano. Stasera va a trenta."
    call via_didascalia

    d "Tutto bene, lì? Con la principessa sovietica?"
    "Sulle mie ginocchia c'è la Spidola. Avvolta nella sciarpa di lana di mia madre."
    "Il vano batterie è chiuso. Ho rimesso lo scotch, sopra, con la scritta. Non aprire. Non serve più, ma mi sembrava giusto."
    i malinconico "Dado. Se non funziona?"
    d serio "Se non funziona, le tieni la mano lo stesso. Funziona sempre, quello. Me l'ha detto mia nonna."
    d serio "Poi mi ha detto anche di comprare il pane, ma quello lo ascolto meno."
    "Ride da solo. Il tergicristallo superstite va su e giù, su e giù, come un metronomo."
    call sms("MAMMA", "Buon anno amore mio 🎄🐟🎆 il signor Ferretti dorme. Tu dove sei??")
    "Mia madre ha messo un pesce tra gli auguri. Non so perché. Non lo sa neanche lei."
    "Le scrivo: «Da un'amica. Ti racconto domani. Tutto.» Poi aggiungo: «Ti voglio bene.» Lo cancello. Lo riscrivo. Lo mando."
    "Mancano nove minuti. Il furgone slitta un po' su una rotonda e Dado dice una parolaccia lunghissima, in tre tempi, come un'opera lirica."
    "Alla radio del furgone qualcuno conta già i minuti. Dado la spegne. Non c'è bisogno di dirgli perché."
    stop music fadeout 3.0

    # ------------------------------------------------------------
    # 4. LA RESIDENZA — 23:58
    # ------------------------------------------------------------
    scene bg residenza_notte with fade
    play ambiente s_orologio fadein 2.0
    call didascalia("LE MAGNOLIE, STANZA 14 — 23:58")

    "La stanza quattordici ha una luce sola, accesa sopra il letto."
    "Fuori dalla finestra la neve continua, di lato. Dall'altra parte del corridoio, Arkadij è seduto sulla sedia di plastica. Non entra."
    call via_didascalia

    "L'infermiera Paola mi ha aperto la porta laterale senza fare domande. Ha cinquant'anni, le scarpe di gomma e un cerchietto con le corna di renna."
    infermiera "Il nipote ha detto che lei è quello della radio. Dieci minuti. Se si agita, suono e lei esce. D'accordo?"
    i sincero "D'accordo."
    infermiera "E niente botti in camera. Ne ho già sequestrati due al signor Gualtieri."
    "Si allontana nel corridoio scuotendo le corna di renna. Le scarpe di gomma fanno un rumore piccolo, da topo gentile."

    play music m_valya fadein 3.0
    show valya sera at dx with dissolve
    show ionut sincero at sx with dissolve

    "Lei è sveglia. Seduta contro i cuscini, lo scialle sulle spalle, le mani appoggiate sulla coperta come due cose che non sono sue."
    "Mi guarda entrare. Nei suoi occhi non c'è niente che mi conosca."
    v sera "È già mattina?"
    i sincero "No. È quasi mezzanotte. È Capodanno, signora Valentina."
    v sera "Capodanno..."
    v profilo "Allora deve venire qualcuno. A Capodanno viene sempre qualcuno."
    i sincero "Sì. Lo so."

    "Appoggio la Spidola sul comodino. Accanto al bicchiere d'acqua e alla dentiera nel suo astuccio. Accanto alla foto di Aldo."
    show item radio with dissolve
    "La pelle rossa un po' scolorita. La maniglia di cuoio. La scala delle frequenze, con i nomi delle città scritti in cirillico. Riga, Mosca, Leningrado."
    "Lei la guarda. Le sopracciglia si muovono appena. Come se avesse sentito una parola in una lingua che parlava da bambina."

    play sound s_radio_sintonia
    stop music fadeout 2.0
    "Accendo. Clic."
    "Giro la manopola. Piano."
    play ambiente s_statica fadein 2.0
    "Fruscio."
    "Fischi. Una voce tedesca che ride. Un pezzo di morse, veloce come pioggia sulla lamiera."
    "Sette-zero-sei-cinque. Sette-zero-sette."
    "Sette-zero-sette-sette."
    "Mi fermo. Tolgo le dita dalla manopola come da un fornello."
    hide item with dissolve

    "Fruscio."
    "Solo fruscio. Il mare lontano. Il respiro di qualcosa di grande che dorme."
    v sera "...Non è rotta."
    "Lo dice piano. Alla radio, non a me."
    v profilo "Sta ascoltando."

    "Il telefono vibra in tasca. Mario. Un messaggio solo."
    call sms("MARIO IZ4MRO", "Pronto. 60 secondi.")

    "Fuori, la città comincia a contare."
    "Lo sento attraverso il vetro, dalle case, dalle macchine ferme, da una festa al terzo piano di fronte."
    voce "{i}Dieci!{/i}"
    "Lei non si muove."
    voce "{i}Nove!{/i}"
    voce "{i}Otto!{/i}"
    "Le prendo la mano. È fredda. È leggerissima."
    voce "{i}Sette!{/i}"
    voce "{i}Sei!{/i}"
    "Non so più se respiro."
    voce "{i}Cinque!{/i}"
    voce "{i}Quattro!{/i}"
    voce "{i}Tre!{/i}"
    "Il fruscio."
    voce "{i}Due!{/i}"
    "Il fruscio."
    voce "{i}Uno!{/i}"
    "..."

    play sound s_fuochi
    with flash
    "Fuori, il cielo si rompe."
    "Rosso. Verde. Oro. I fuochi si aprono sopra i tetti e la neve li riflette, tutta insieme, come se si fosse accesa anche lei."
    "Dentro, la stanza resta zitta."
    "Il fruscio."
    "{w=1.0}Il fruscio."
    "{w=1.0}..."

    stop ambiente fadeout 3.0
    play music m_notti_mosca_radio fadein 2.0
    "E poi, dal fruscio, una cosa."
    "Un fischio."
    "Lontanissimo. Stonato sulla terza nota."
    "Notti di Mosca."

    lev "Valya..."
    "{w=1.0}..."
    lev "Valya, ty slyshish?"

    window hide
    scene cg finale_radio with lentissimo
    pause 3.0
    window show

    "Lei si raddrizza."
    "Lentamente. Come una telefonista del porto quando entra il capoturno."
    "La schiena lontana dai cuscini. Il mento su. Lo scialle che le scivola da una spalla, e non se ne accorge."
    "Ha gli occhi aperti. Guarda un punto dell'aria, sopra la radio, oltre la finestra, oltre i fuochi."
    "Un punto dove non c'è niente."
    "Un punto dove c'è tutto."

    lev "Valya, ty slyshish menya?{w} Ogni anno, alla stessa ora."
    "{w=0.5}..."
    lev "Finché non mi rispondi."

    "Le sue labbra si muovono prima della voce."
    "{w=1.0}..."
    v "Slyshu."
    "{w=1.0}..."
    v "Slyshu, Lyova."
    "{w=1.5}..."
    v "{b}Slyshu.{/b}"

    "Il fischio riprende. Finisce la canzone. Stavolta senza buchi."
    "Poi il fruscio si richiude sopra la voce, piano, come l'acqua sopra un sasso."
    "Quarantadue anni di Capodanni. Quattro minuti e diciassette secondi."
    "Lei ha risposto."
    stop music fadeout 6.0
    pause 2.0

    # ------------------------------------------------------------
    # 5. MOYA PRINTSESSA
    # ------------------------------------------------------------
    scene bg residenza_notte with lento
    play ambiente s_statica fadein 3.0
    play music m_valya fadein 4.0
    show valya commossa at dx with dissolve
    show ionut sincero at sx with dissolve

    "Per un po' resta così. Dritta. Con le lacrime che scendono senza fretta, come se avessero aspettato il loro turno."
    "Poi si gira verso di me."
    "Guarda la mia mano sulla sua. Poi la mia faccia. La mezza maschera, il mio mezzo viso da sciocco."
    "E qualcosa, nei suoi occhi, si accende. Come una lucina verde su un vecchio apparecchio."
    v commossa "Ionuț."
    "{w=1.5}..."
    v commossa "Moya Printsessa."

    show ionut vulnerabile
    "Non piango. Cioè, sì. Ma in silenzio. Come mi ha insegnato lei, senza saperlo: le cose importanti si fanno piano."
    i vulnerabile "Buon anno, signora Valentina."
    v sorridente "Buon anno, golubchik. Ty durak. Hai la faccia blu."
    i vulnerabile "È il tetto. Nevica di lato."
    v sorridente "Lo so. Te l'avevo detto. Due volte, forse."
    "Ride. Una risata piccola. Sembra una ragazza."

    v nostalgica "L'hai trovato tu, vero? Nella radio. Sotto lo scotch."
    i vulnerabile "Ho rotto la promessa. Mi dispiace."
    v nostalgica "Le promesse si rompono come i nastri, Printsessa. Poi qualcuno con le mani buone le aggiusta con lo scotch."
    v commossa "Lui non era morto. Vero? Allora."
    i sincero "No. Ha trasmesso ogni anno. Fino al duemiladieci. Sempre alle stesse ore. Sempre la stessa domanda."
    "Lei chiude gli occhi. Per un momento ho paura di averla persa di nuovo."
    v commossa "Bozhe moy. Quarantadue inverni."
    v commossa "E io qui, con la radio rotta. Pensavo che fosse il cielo a non parlare. Ero io che non ascoltavo."
    v sorridente "Nu, ladno. Adesso lo so. Adesso ho risposto."

    v seria "Spasibo, Ionuț."
    v seria "Per la radio. Per l'orologio. Per il carillon senza buchi. Per tutte le cose che hai aggiustato e per quelle che non si potevano."
    i sincero "Non ho fatto niente. L'ha fatto Mario. E Rino. E Max, pensi. E Giulia le manda gli auguri. E Dado guida a trenta all'ora."
    v sorridente "Allora hai fatto la cosa più difficile. Li hai fatti salire su un tetto."

    show valya commossa
    v commossa "Adesso ascoltami bene. Perché domani forse non sarò io a dirtelo."
    v commossa "Lui ha aspettato. Io ho aspettato. Abbiamo aspettato tanto, tutti e due, da due parti del mondo."
    v commossa "Tu non devi aspettare niente, Printsessa. Non me. Non nessuno."
    v commossa "Adesso puoi smettere di aspettare."
    "Me lo dice tenendomi la mano. Stringe. Più forte di quanto creda possibile, per mani così."
    i vulnerabile "...Va bene."
    v sorridente "Bravo. Hai detto «va bene» come un russo. Senza crederci."

    "Si appoggia di nuovo ai cuscini. Le sistemo lo scialle sulla spalla."
    "La Spidola fruscia piano sul comodino. Non la spengo. Non me lo chiede."
    v sera "Lasciala. Così ascolta lei, mentre dormo."
    v sera "Resti un poco?"
    i sincero "Resto."

    stop music fadeout 5.0
    "Fuori i fuochi diventano radi. Uno ogni tanto. Poi uno ogni molto."
    "La festa del terzo piano canta una canzone che non conosco. Poi smette."
    "Lei mi tiene la mano. Il pollice si muove sulle mie nocche, avanti e indietro, come si accarezza un gatto o si sintonizza una radio."
    v sera "Raz... dva... tri..."
    "Conta i passi del ballo, a occhi chiusi. Raz, dva, tri. Più piano ogni volta."
    v sera "...raz..."
    "Poi il pollice si ferma."
    "Il respiro diventa lungo. Regolare. Quello di chi dorme davvero, per la prima volta da tanto."

    hide valya with lentissimo
    "Non lascio la mano."
    "Sulla porta, a un certo punto, c'è Arkadij. Non entra. Guarda la zia che dorme. Guarda me. Annuisce una volta, e se ne va piano."
    "Nella tasca della giacca trovo una caramella Mishka. Non so quando ce l'abbia messa. Non so se ce l'abbia messa lei."
    "La lascio sul comodino. Accanto alla radio."

    scene bg nero with lentissimo
    "Ci sono notti in cui non si aggiusta niente."
    "{w=1.0}Si sta seduti. Si tiene una mano. Si ascolta il fruscio."
    "{w=1.0}E basta così."
    stop ambiente fadeout 6.0
    pause 2.0
    scene bg nero_totale with buio
    pause 2.0

    return
