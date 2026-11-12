label cap3:
    call titolo_capitolo("3", "Pobeda", "Valdorsa — novembre")

    # --- SCENA 1: il giovedì dell'orologio ---------------------------------
    scene bg galleria with dissolve
    play music m_galleria fadein 1.0
    call didascalia("IL GIRASOLE — GIOVEDÌ, 10:12")
    "Novembre, a Valdorsa, non è un mese. È una condizione."
    "La nebbia entra nel centro commerciale dalle porte automatiche, come un cliente che non compra niente e resta lì a guardare."
    call via_didascalia
    "Le vetrine con la carta da pacchi sono diventate undici. Le ho contate. È il genere di cosa che fai quando aspetti il giovedì."
    i ironico "Non che io aspetti il giovedì."
    i ironico_flip "Il giovedì è un giorno come un altro. Viene dopo il mercoledì. È scientifico."

    scene bg negozio with dissolve
    play music m_negozio fadein 1.0
    show rino normale at dx with dissolve
    r normale "Principessa, smettila di guardare la porta. La porta non si ripara guardandola."
    i imbarazzato "Non guardavo la porta. Controllavo la... corrente d'aria."
    r "La corrente d'aria è la stessa dal 1989. Mettiti al banco."
    show dado ride at sx with dissolve
    d ride "Lascialo stare, Rino. È giovedì. La Principessa aspetta la sua dama."
    i sarcastico "Dado, tu hai trecentododici follower e tre di loro sono tua nonna con tre account diversi."
    d comico "Quattro. Uno lo usa per i gattini."
    hide dado with dissolve
    hide rino with dissolve

    "La Spidola è nel retro, sotto un panno, come un canarino che deve dormire."
    "Da quando si è accesa fa solo fruscio. Io la lascio accesa un'ora al giorno, a volume basso. Lei ascolta. Io la ascolto ascoltare."
    "Non lo dico a nessuno, perché detto ad alta voce sembra la frase di uno che ha bisogno di uscire di più."

    play sound s_campanella
    play music m_valya fadein 2.0
    show valya seria at dx, entra_dx
    "Alle dieci e trentuno la campanella suona."
    "Fazzoletto a fiori. Sciallone. Ombrello nero lungo come una spada da cerimonia. La borsa a quadri."
    show ionut imbarazzato at sx with dissolve
    v seria "Buongiorno, Ivan."
    i imbarazzato "Buongiorno, signora Valentina. Ionuț. Ma va bene anche Ivan. Va benissimo Ivan."
    v "Lo so che va bene. Non chiedevo il permesso."
    v "La radio?"
    i sincero "Fa fruscio. Tutti i giorni. Un'ora."
    v sorridente "Brava. Sta imparando la pazienza. Anche tu, mi sembra."
    "Mi dà del tu quando è contenta e del lei quando sta per giudicarmi. Ho imparato a riconoscere il cambio come si riconosce un temporale."
    v seria "Oggi le porto un'altra cosa. Una cosa piccola."

    "Fruga nella borsa. Escono, nell'ordine: un pacchetto di fazzoletti, una mela, un mazzo di chiavi con un orsetto di plastica, e una caramella."
    "La caramella la posa sul bancone, come sempre. Mishka. L'orso al nord. Non dice niente, e io non dico niente. È il nostro trattato."
    "Poi tira fuori un fazzoletto di stoffa, piegato in quattro. Lo apre come si apre una lettera."
    show item orologio with dissolve
    play sound s_orologio
    "Un orologio da polso. Cassa d'acciaio graffiata, quadrante color crema, numeri sottili. Una scritta in cirillico sotto il dodici."
    i comico "Pobeda."
    v "Sa leggere il russo, Ivan?"
    i imbarazzato "Lo so leggere sugli orologi. È tipo il mio unico russo. Pobeda, Raketa, Vostok. Li compro su internet quando sono triste. Cioè. Quando sono annoiato."
    v seria "Pobeda vuol dire vittoria. Era di mio padre. Lo hanno dato a lui dopo la guerra, con una stretta di mano e niente pane."
    "Lo giro tra le dita. Le lancette sono ferme."
    "Le quattro e diciassette."
    hide item with dissolve
    i sincero "Si è fermato da tanto?"
    v "Da tanto."
    "Non aggiunge altro. Il silenzio dura il tempo di un respiro lungo. Il neon sopra di noi ronza come un insetto che vuole entrare in una frase."
    v seria "Lo ripari. Ma non lo metta all'ora giusta."
    i comico "In che senso? Lo... metto all'ora sbagliata?"
    v "Lo lasci alle quattro e diciassette. Deve solo...{w} battere."
    "Lo dice piano. La parola battere, in bocca a lei, non sembra una parola da orologio."
    i sincero "Va bene. Alle quattro e diciassette."
    v sorridente "Spasibo, dorogoy."
    "Dorogoy. Caro. Me lo ha detto Giulia la settimana scorsa, col traduttore del telefono, e io ho fatto finta che non mi importasse per circa diciotto ore."
    "Non capisco perché un orologio debba camminare senza andare da nessuna parte."
    "Lo metto in una bustina con il suo nome. Scrivo «ORLOVA — 4:17» col pennarello. Poi lo riscrivo, perché la prima volta la mano mi ha tremato."
    hide ionut with dissolve
    v seria "Adesso vado. Devo comprare il pane e i fiammiferi. In questo palazzo di vetro non vendono fiammiferi, ma io controllo ogni volta. Per principio."
    hide valya with dissolve
    play sound s_campanella
    "Esce. Prende l'ombrello come se lo portasse in battaglia."
    "E io, senza nessun motivo tecnico, la seguo."

    # --- SCENA 2: Max Fixer ----------------------------------------------
    scene bg chiosco_max with dissolve
    play music m_comico fadein 0.5
    play ambiente s_folla fadein 1.0
    "Nell'atrio centrale, tra la fontana spenta e le scale mobili, c'è il chiosco di Max Bonetti."
    "FIX-IT EXPRESS. RIPARAZIONI IN 30 MINUTI. Il fulmine sull'insegna lampeggia anche quando lui non c'è. Lui c'è sempre."
    "Max ha trent'anni, tre catene d'oro e un paio di occhiali da sole che non toglie neanche sotto i neon. Si fa chiamare Max Fixer. Davvero."
    show max spaccone at dx, entra_dx
    x spaccone "Signoraaa! Signora bella! Un momento, un momentino!"
    show valya seria at sx with dissolve
    "Valya si ferma. Non perché lui l'abbia chiamata. Si ferma come si ferma un rompighiaccio: per decidere da che parte passare."
    x "Ho visto che lei frequenta la LAMP, eh. Quella senza la O. Che tristezza, signora. Molto vintage, ma non nel senso cool."
    x spaccone "Da noi c'è lo sconto Over Ottanta! Riparazioni in trenta minuti, garanzia, assistenza, very top of the gamma!"
    i comico "Top of the gamma. Non esiste in nessuna lingua. Ho controllato. Anche in rumeno."
    x "Oh, ciao Princess! Anche tu qui? Fai il giro del regno?"
    i sarcastico "Faccio il giro di quelli che dicono «very top» senza permesso."
    x spaccone "Signora, mi ascolti. Lei mi porta l'oggetto, io lo apro, lo guardo, lo sistemo, bam, mezz'ora, fatto. Telefoni, tablet, smartwatch..."
    v seria "Orologi?"
    x "Orologi? Ma certo! Le cambio la pila in due minuti. Due! Cronometrati!"
    v "Il mio orologio non ha la pila."
    x comico "Ah. E come... va?"
    v "Va con le mani di un uomo."
    "Max apre la bocca. La richiude. Si aggiusta una catena, per sicurezza."
    x spaccone "Va be', signora, tecnologia superata. Glielo dico da amico. Da noi c'è il futuro. Il futuro, signora!"
    v seria "Giovanotto."
    "Solo questo. Giovanotto. L'atrio diventa improvvisamente più piccolo."
    show valya seria at sx, primo_piano
    v "Io ho visto riparare un rompighiaccio nucleare a meno quaranta gradi, con le mani nude e una chiave inglese che pesava come un bambino."
    v "Lei non sa riparare nemmeno la sua faccia."
    show max comico at dx, trema
    with hpunch
    play sound s_risate
    "Silenzio. Poi, da qualche parte dietro la fontana, una signora con il carrello ride. Ride forte. Ride come se avesse aspettato questo momento dal 2009."
    x comico "Io... la mia faccia è... la mia faccia va benissimo, signora."
    v "È rotta da dentro. Si vede dagli occhiali. Uno porta gli occhiali da sole al chiuso solo quando ha qualcosa da nascondere o niente da guardare."
    show valya seria at sx
    x comico "Sono... per lo stile."
    v "Nu, ladno. Lo stile è una cosa che si ripara con l'età. Tanti auguri."
    hide valya with dissolve
    "Se ne va. L'ombrello tocca il pavimento ogni due passi. Tic. Tic. Sembra un metronomo che ha appena vinto una guerra."
    show max deluso at dx
    x deluso "Princess."
    i ironico "Dimmi, Max."
    x "Quella signora. Dove l'hai trovata?"
    i ironico_flip "Non l'ho trovata. È entrata."
    x deluso "Vorrei che entrasse anche da me. Una volta. Così, per sapere com'è."
    "Per la prima volta da quando lo conosco, Max Fixer si toglie gli occhiali da sole. Ha gli occhi di un cucciolo bagnato."
    "Se li rimette subito."
    hide max with dissolve
    stop ambiente fadeout 1.0
    i comico "Ho appena assistito a un omicidio. Senza sangue. Con un ombrello come testimone."

    # --- SCENA 3: il laboratorio -----------------------------------------
    scene bg laboratorio with dissolve
    play music m_negozio fadein 1.0
    call didascalia("LABORATORIO — VENERDÌ, 13:40")
    "Pausa pranzo. Toast della macchinetta, lente d'ingrandimento, cacciavite da orologiaio."
    call via_didascalia
    show item cacciavite with dissolve
    play sound s_cacciavite
    "Apro il fondello del Pobeda con un panno e tanta educazione. Dentro c'è un movimento semplice e onesto, quindici rubini, niente di inutile."
    "La molla di carica è sana. Il bilanciere è fermo, ma non rotto. L'olio, dopo tanti anni, è diventato una specie di miele scuro."
    hide item with dissolve
    "Non si è rotto. Si è stancato. Lo capisco. Anch'io il lunedì."
    "Lo smonto pezzo per pezzo e metto ogni vite in una vaschetta numerata. Rino mi ha insegnato così: «Se non ricordi da dove viene una vite, la vite se lo ricorda e si vendica.»"
    show dado comico at dx with dissolve
    d comico "Che fai, Principessa? Chirurgia su una formica?"
    i ironico "Pulisco l'orologio della signora Orlova."
    d ride "Ah, la Babushka! Quella che ha cancellato Max dalla faccia della Terra! Me l'hanno raccontato quelli della profumeria. Lo dicono in tre versioni."
    i comico "In una lei lo colpisce con l'ombrello?"
    d ride "In due. Nella terza lui piange. Io voto la terza."
    d comico "E dimmi, che ora segna, il gioiello?"
    i sincero "Le quattro e diciassette. E resta lì."
    d "Cioè lo ripari e non lo metti all'ora?"
    i sincero "Me l'ha chiesto lei."
    d comico "Bro. È la cosa più russa che abbia mai sentito. E io ho visto un video di un orso che guida un trattore."
    hide dado with dissolve
    "Rimonto tutto. Una goccia d'olio nuovo sui perni. Carico la corona: dodici giri, piano, come si accarezza un gatto che non ti conosce."
    "Poi sollevo il bilanciere con la punta della pinzetta."
    play ambiente s_orologio fadein 0.5
    "Tic."
    "Tic. Tic. Tic."
    "Le lancette, prima, le avevo bloccate col dito dove stavano. Le quattro e diciassette. Il cuore gira. L'ora resta."
    i sincero "Batte."
    "Lo dico ad alta voce, da solo, nel retro di un negozio in un centro commerciale mezzo vuoto. Mi sento ridicolo. Mi sento anche bene. Sono due cose che, da novembre, vanno insieme."
    stop ambiente fadeout 1.0

    # --- SCENA 4: la saracinesca -----------------------------------------
    scene bg saracinesca_notte with dissolve
    play music m_comico2 fadein 1.0
    call didascalia("LAMPO — GIOVEDÌ, 19:30")
    "Una settimana dopo. Ora di chiusura."
    call via_didascalia
    show rino sera at dx with dissolve
    "Rino tira giù la saracinesca come ogni sera: con la dignità di un capitano che ammaina la bandiera di una nave che affonda da trent'anni."
    play sound s_saracinesca
    pause 1.0
    play sound s_saracinesca_blocco
    with hpunch
    "Quaranta centimetri da terra. Sempre quaranta. Ci si potrebbe calibrare un righello."
    r sera "Ladra. Bastarda. Traditrice."
    i ironico "Il calcio di Ruggeri?"
    r sera "Il calcio di Ruggeri."
    "Prende la rincorsa. Due passi. Canticchia."
    r "Azzurro... il pomeriggio è troppo azzurro..."
    play sound s_saracinesca_blocco
    with vpunch
    r arrabbiato "...e lungo per me! Niente. Niente! Cambio canzone. Dico davvero, stavolta cambio canzone."
    i comico "Sono trentasei anni che dici di cambiare canzone."
    r arrabbiato "Trentasette, Principessa. Non togliermi gli anni, sono l'unica cosa che ho accumulato."

    play sound s_passi
    show valya seria at sx with dissolve
    "Tic. Tic. Un ombrello sul pavimento della galleria."
    v seria "Buonasera. Ivan, l'orologio?"
    i imbarazzato "Signora! È pronto. Batte. Cioè, cammina. Cioè, fa quello che mi ha chiesto. Però è dentro, e la saracinesca è..."
    v "È rotta."
    r arrabbiato "Non è rotta, signora. Ha un carattere."
    v seria "Anche mio marito aveva un carattere. Lo aggiustavo lo stesso."
    "Valya guarda la saracinesca. La guarda come ha guardato Max: dall'alto, anche se è alta un metro e cinquantadue."
    "Poi alza l'ombrello e lo cala. Un colpo solo. Secco. Sul bordo in basso a destra."
    play sound s_schiaffo
    pause 0.3
    play sound s_saracinesca
    with flash
    pause 1.5
    "La saracinesca scende. Fino in fondo. Si chiude perfettamente, con un clac educato, come una porta di casa che ti riconosce."
    show rino arrabbiato at dx, trema
    r arrabbiato "..."
    i sclero "..." with glitch_t
    "Rino guarda la saracinesca. Guarda Valya. Guarda la saracinesca. Si tocca i baffi, come per controllare di averli ancora."
    r arrabbiato "Trentasette anni."
    v seria "In Unione Sovietica le saracinesche obbedivano."
    show valya sorridente at sx, saltello
    v sorridente "Bisogna solo dire le cose con convinzione."
    show rino normale at dx
    r normale "Signora, mi... mi insegni. La prego. Ho sessantun anni, posso ancora imparare."
    v seria "No. Lei canta. Una saracinesca non vuole essere cantata. Vuole essere comandata."
    i comico "Rino, credo che tu abbia appena perso una guerra fredda."
    r normale "Zitto. Riapri, che devi prendere l'orologio della signora."
    i imbarazzato "Riapro? Ma se la riapro poi non si chiude più!"
    v "Allora la chiudo io un'altra volta. Ho tempo. Ho ottantaquattro anni: ho soltanto tempo, e poco."
    "Lo dice ridendo. Ma è la risata di una ragazza che ha appena detto una cosa vera, e la nasconde."

    play sound s_saracinesca
    "Riapro. Prendo la bustina. Valya allunga la mano, poi la ritira."
    v seria "Domani. Oggi sono stanca, e l'autobus mi aspetta. Domani passo io."
    v "Abito in via dei Tigli. Quarto piano, senza ascensore. Ogni giorno quattro piani: è la mia ginnastica sovietica."
    hide valya with dissolve
    "Se ne va. Tic, tic, nella galleria che si spegne a pezzi."
    show rino buono at dx
    r buono "Principessa."
    i ironico "Sì?"
    r buono "Domattina alle dieci glielo porti tu. A casa. Ti segno l'uscita come consegna."
    i imbarazzato "Noi facciamo consegne a domicilio? Da quando?"
    r buono "Da adesso. Una cliente di ottantaquattro anni non fa quattro piani a piedi due volte per un orologio, Principessa. Non nel mio negozio."
    "Poi, sottovoce, guardando la saracinesca chiusa:"
    r normale "E chiedile come ha fatto. Ma senza farti vedere che te l'ho chiesto io."
    hide rino with dissolve

    # --- SCENA 5: le scale -----------------------------------------------
    scene bg ingresso_valya with dissolve
    play music m_valya fadein 2.0
    play sound s_passi
    call didascalia("VIA DEI TIGLI 14 — SABATO, 10:02")
    "Il palazzo è degli anni Sessanta. Mattoni color biscotto, citofono con i nomi scritti a mano, odore di cera e di minestra."
    call via_didascalia
    "Primo piano. Un cane abbaia dietro una porta. Gli faccio ciao. Non apprezza."
    "Secondo piano. Una signora apre lo spioncino. Lo sento proprio: il clic dello spioncino. In provincia è più veloce di internet."
    "Terzo piano. Il fiato inizia a mancare. Ho diciannove anni. Devo fare qualcosa della mia vita, e forse la prima cosa è salire le scale più spesso."
    i comico "Quarto piano. Lei li fa tutti i giorni. A ottantaquattro anni. Con la borsa della spesa."
    i sarcastico "Io, a ottantaquattro anni, sarò un ologramma su un divano."
    "Sulla porta c'è una targhetta d'ottone: BELLINI — ORLOVA. Il nome di lui, poi il suo. Nessuno ha cambiato la targhetta."
    play sound s_porta
    show valya sorridente at dx with dissolve
    v sorridente "Ivan. Sei puntuale. Quasi tedesco."
    i imbarazzato "Buongiorno. Il signor Ruggeri dice che facciamo consegne a domicilio. Da ieri sera."
    v "Lo so. Il signor Ruggeri ha paura di me. È un uomo intelligente. Entra. Scarpe fuori."
    "Mi danno un paio di pantofole da uomo, di feltro, troppo grandi. Le guardo. Lei vede che le guardo."
    v nostalgica "Erano di Aldo. Non le usa più nessuno. Le pantofole si offendono, se non le usa nessuno."

    # --- SCENA 6: la casa di Valya ----------------------------------------
    scene bg casa_valya with dissolve
    show vignetta
    "La casa di Valya è un'altra nazione."
    "Ci sono tappeti appesi ai muri. Non per terra: ai muri. Rossi, con disegni che girano su sé stessi come pensieri insonni."
    "Una vetrina con i bicchieri buoni, che non si usano mai. Un pianoforte chiuso, con sopra un centrino e un vaso senza fiori."
    "E l'odore. Cavolo, lavanda, cera, e qualcosa di dolce sotto, che non so nominare. Odore di una vita che si è fermata in un posto e ha deciso di restarci."
    show item samovar with dissolve
    "Sul tavolo della sala c'è un samovar d'ottone, grande come un bambino seduto. Brilla. È l'unica cosa della casa che sembra più giovane di lei."
    i comico "È... un samovar vero. Funziona?"
    show valya seria at dx with dissolve
    v seria "Tutto qui funziona, Ivan. Tranne la radio. E me, certi giorni."
    hide item with dissolve
    show ionut sincero at sx with dissolve
    "Le porgo la bustina. «ORLOVA — 4:17». Lei la apre con due dita, come una cosa che potrebbe scottare."
    show item orologio with dissolve
    play ambiente s_orologio fadein 1.0
    "Si porta l'orologio all'orecchio. Chiude gli occhi."
    "Tic. Tic. Tic."
    "La guardo ascoltare un orologio. Non ho mai visto nessuno ascoltare niente così. Neanche io, la musica, quando avevo quindici anni e pensavo di morire."
    show valya commossa at dx
    v commossa "Batte."
    i sincero "Batte. E segna sempre le quattro e diciassette. Come ha detto lei."
    v "Spasibo, golubchik."
    hide item with dissolve
    stop ambiente fadeout 2.0
    "Golubchik. Questa non la conosco. Me la segno nella testa per chiederla a Giulia, insieme a tutte le altre cose che non posso chiedere a nessuno."
    i sincero "Perché le quattro e diciassette?"
    show valya seria at dx
    v seria "Perché a quell'ora una cosa si è fermata. E io non ho voluto che ripartisse senza di lei."
    v "Basta. Tè. Adesso si beve il tè. Nelle case russe, prima il tè, poi le domande. E, se va bene, niente domande."

    # --- CG: il tè insieme ------------------------------------------------
    play sound s_bollitore
    scene cg te_insieme with lento
    "Il tè non va nella tazza. Va in un bicchiere di vetro, dentro un portabicchiere d'argento con il manico, lavorato a foglie."
    "Lei versa l'essenza scura dalla teiera piccola, poi l'acqua calda dal samovar. Lo fa senza guardare, come si fa una firma."
    play sound s_tazza
    v sorridente "E adesso la marmellata."
    i comico "Nel tè?"
    v "Nel tè. Di lamponi. Fatta da me ad agosto. Non mettere lo zucchero, Ivan, sei già abbastanza dolce di faccia."
    "Un cucchiaino di marmellata gira nel bicchiere e il tè diventa rosso scuro, come un tramonto a cui hanno spento l'audio."
    "Lo assaggio. È buonissimo. È buono in un modo che fa venire voglia di stare zitti."
    i sincero "È il tè di Giulia. Cioè, è il tè che Giulia cerca di fare. Lei lo chiama Tè del Grande Nord."
    v sorridente "La ragazza del tè è brava. Ma è giovane. La marmellata bisogna averla aspettata."
    "Restiamo così. Lei soffia sul bicchiere. Io soffio sul mio. Fuori, la nebbia appoggia la fronte alle finestre."
    v nostalgica "Io ho visto Gagarin, sai? In televisione. In diretta, quando è tornato dal cielo."
    v "C'era una sola televisione al circolo del porto. Eravamo in cento, davanti. Gli uomini piangevano. I ragazzi salivano sulle sedie."
    v "Io avevo diciannove anni e pensavo: adesso si può andare dappertutto. Anche nel cielo. Anche lontano."
    i sincero "E poi?"
    v seria "E poi si è capito che il cielo è lontano soprattutto quando vuoi tornare."
    "Non so cosa voglia dire. Annuisco lo stesso. Con lei annuisco molto. È più facile che parlare, e meno pericoloso."

    # --- le foto ------------------------------------------------------------
    scene bg casa_valya with dissolve
    show vignetta
    play music m_ricordo fadein 2.0
    show valya nostalgica at dx with dissolve
    show ionut sincero at sx with dissolve
    "Sul mobile vicino alla finestra ci sono le foto. Tante. Cornici d'argento, di legno, una di plastica a forma di cuore che deve essere stata un regalo di qualcuno senza gusto e con molto amore."
    show item foto_antica with dissolve
    "Persone in bianco e nero, con cappotti pesanti e facce che non sorridono, perché allora sorridere in foto costava."
    "Un uomo con la divisa e i baffi. Una donna col fazzoletto che è identica a Valya, ma più vecchia di una guerra."
    v nostalgica "Mio padre. Quello dell'orologio. E mia madre, che cantava male e cucinava benissimo. Le persone si equilibrano."
    hide item with dissolve
    "Poi, in mezzo, una foto a colori. Colori anni Novanta, un po' slavati."
    "Una sala del comune. Valya, con un tailleur azzurro e un mazzo di fiori bianchi. Accanto a lei un uomo alto, coi capelli bianchi già allora, che ride. Ride così tanto che è mosso."
    v sorridente "Aldo. Il giorno del matrimonio. Millenovecentonovantaquattro."
    v "Ci siamo conosciuti nel settantaquattro. Ci siamo sposati vent'anni dopo. Lettere, telefonate, visti negati. I russi non volevano farmi uscire, gli italiani non volevano farmi entrare."
    v nostalgica "Lui aspettava. Scriveva ogni domenica. Ottocento lettere, più o meno. Le ho tutte di là."
    i comico "Ottocento. Io non rispondo neanche ai vocali di mia madre."
    v seria "Allora sei un ragazzo moderno. Che peccato."
    "Lo dice senza cattiveria. Come una diagnosi."
    "Guardo Aldo. Alto, gentile, mosso dalla sua stessa risata. E sento una cosa nel petto che non ha nessun diritto di esistere."
    i imbarazzato "Sembrava... simpatico."
    v sorridente "Era un uomo buono. Riparava i frigoriferi delle navi. Diceva che il freddo è l'unica cosa che si può costruire."
    v nostalgica "È morto nel duemilaquindici. Da allora la radio non l'ho più accesa."

    "In fondo al mobile, dietro le altre, c'è una cornice piccola. Una sola."
    "È girata verso il muro."
    "Vedo solo il retro di cartone, con il piedino e un pezzetto di scotch ingiallito. Come il vano della radio."
    i sincero "E quella?"
    show valya seria at dx
    "Valya non si volta. Non guarda la foto, non guarda me. Guarda il suo bicchiere, che è vuoto."
    v seria "Quella guarda il muro."
    i vulnerabile "Perché?"
    v "Perché preferisce così. Alcune foto, Ivan, vanno guardate. Altre ti guardano. E io non ho più l'età per farmi guardare."
    "Non insisto. Ho promesso di non aprire una radio. Mi sembra che le regole di questa casa siano le stesse."
    v sorridente "Un altro tè?"
    i sincero "Sì. Grazie. Spasibo."
    v sorridente "Bozhe moy, parla russo! Con l'accento di Iași, ma parla russo."
    "Ride. Ride come una ragazza. Ed è lì, in quel momento preciso, che qualcosa nel mio stomaco fa un rumore di ingranaggio."

    # --- SCENA 7: congedo --------------------------------------------------
    scene bg casa_valya_sera with fade
    play music m_valya fadein 1.0
    show valya sera at dx with dissolve
    "Resto fino a che le finestre diventano blu. Mi fa vedere come si lucida il samovar, con il bicarbonato e un panno di lana."
    "Mi fa portare giù la spazzatura, perché «visto che hai le gambe giovani». Mi fa risalire, perché ho dimenticato la sciarpa. Quattro piani. Due volte."
    v sera "Vai a casa, Ivan. Tua madre ti aspetta."
    i sincero "Mia madre lavora di notte. Fa la badante. A un signore di novant'anni."
    v "Allora tua madre aspetta lui. E chi aspetta te?"
    "Non rispondo. Lei non insiste. Mi aggiusta il cappello come si aggiusta un quadro storto."
    v sorridente "Fai attenzione al fiume. Con la nebbia, il fiume sembra una strada. Non lo è."
    i ironico "Lo terrò presente. Non camminerò sul fiume."
    v "Bravo. Lo faceva solo uno, e l'hanno trattato male lo stesso."
    hide valya with dissolve
    play sound s_porta
    "La porta si chiude. Clac. Come la saracinesca. Con convinzione."

    # --- SCENA 8: il fiume nella nebbia -----------------------------------
    scene bg fiume_nebbia with lento
    play music m_notte fadein 3.0
    play ambiente s_vento fadein 2.0
    call didascalia("ARGINE DEL FIUME — 18:47")
    "Torno a piedi lungo l'argine. Quaranta minuti. Potrei prendere il bus. Non lo prendo."
    call via_didascalia
    "La nebbia è così fitta che i lampioni sembrano idee lontane. Il fiume si sente ma non si vede. Fa un rumore lento, di uno che sta pensando."
    "Ho ancora in bocca il sapore dei lamponi."
    "Penso al bicchiere d'argento. Alle pantofole di Aldo. Alla foto girata verso il muro. Al modo in cui ha detto batte."
    "Penso alla sua risata. E il mio cervello, che è un pezzo d'elettronica fatto male, mette due fili insieme per sbaglio."
    "Un cortocircuito."
    play sound s_battito
    pause 1.0
    show ionut sincero at centro with dissolve
    i sincero "Oh."
    i vulnerabile "Oh, no."
    play music m_comico2 fadein 0.3
    show ionut sclero at centro, trema
    with vpunch
    play sound s_glitch
    i sclero "No. No no no no. NO." with glitch_t
    i sclero "Non è quello. Non può essere quello. Te l'avevo detto, cervello. Ti avevo dato istruzioni precise!"
    i furioso "Ricapitoliamo. Con calma. Da tecnico."
    i furioso "Lei ha ottantaquattro anni. Io diciannove. La differenza è sessantacinque. Sessantacinque è un'età. È l'età della pensione!"
    show ionut sclero at centro, saltello
    with vpunch
    i sclero "Quando lei aveva la mia età, l'uomo non era ancora andato sulla Luna! La Luna era ancora intatta, quando lei aveva la mia età!"
    i sclero "Io ho un abbonamento a Netflix diviso con tre persone. Lei ha un samovar!"
    i arrabbiato "Forse è il tè. Forse nella marmellata c'era qualcosa. Una sostanza sovietica. Un siero della verità del KGB."
    i comico "No. La marmellata era solo marmellata."
    play sound s_glitch
    show ionut sclero at centro
    with glitch_t
    i sclero "Va bene. Va bene. Soluzioni. Mi trasferisco. Vado a Bologna, come tutti. Studio ingegneria. Mi faccio crescere la barba. Divento un'altra persona."
    i sclero "No, aspetta: chiamo Dado. No. Dado lo mette su TikTok. Chiamo Giulia. No. Giulia mi fa una domanda e io muoio."
    i furioso "Chiamo mia madre. «Ciao mamma, sono innamorato di una vedova russa del 1942.» E lei mi manda l’emoji del cocomero perché non sa cosa vuol dire."
    with vpunch
    i sclero "Sono un perito elettronico con sessantotto su cento! Non sono attrezzato per questo! Nessuno ci ha fatto un modulo, su questo!"

    stop music fadeout 2.0
    "Mi fermo."
    "Il fiume continua. Il vento sposta un po' di nebbia, poi la rimette a posto. Un'anatra, da qualche parte, fa un verso offeso."
    show ionut malinconico at centro with dissolve
    pause 1.5
    "E il panico se ne va, così come è venuto. Lascia dietro di sé una cosa più semplice. Più spaventosa."
    play music m_neve fadein 3.0
    i malinconico "..."
    "Non voglio niente da lei. Non voglio baciarla. Non voglio portarla al cinema. Non voglio salvarla da niente."
    "Voglio solo esserci, il giovedì. Voglio sapere cosa vuol dire golubchik. Voglio sentire il tic dell'orologio quando lei lo appoggia all'orecchio."
    "Voglio che qualcuno, una volta, mi guardi come lei guarda quella radio. Come una cosa che non è rotta. Che sta ascoltando."
    show ionut innamorato at centro
    i innamorato "Sono..."
    "La parola non esce. Si ferma a quaranta centimetri da terra, come una saracinesca."
    "Ci vorrebbe un colpo d'ombrello."
    i innamorato "Sono innamorato."
    "Lo dico al fiume. Il fiume non risponde. È un buon ascoltatore. Come una radio accesa senza stazione."
    hide ionut with dissolve
    stop ambiente fadeout 3.0
    "Nella tasca della giacca trovo la caramella Mishka. Non ricordo di averla presa dal bancone. Forse me l'ha messa lei, mentre mi aggiustava il cappello."
    "L'orso sulla carta guarda verso un nord che non ho mai visto."
    "La rimetto in tasca. Non la mangio. Certe cose non si mangiano. Si conservano."
    scene bg nero with lentissimo
    pause 1.0
    "Ho diciannove anni, una maschera da teatro e un cacciavite."
    "E sono innamorato di una donna che ha visto Gagarin in televisione in diretta."
    stop music fadeout 4.0
    pause 2.0
    return
