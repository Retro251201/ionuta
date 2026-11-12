label cap6:
    call titolo_capitolo("6", "Arkadij", "Valdorsa — dicembre")

    # ------------------------------------------------------------------
    # 1. CAMERETTA / NEGOZIO — il video di Dado
    # ------------------------------------------------------------------
    scene bg cameretta_giorno with dissolve
    play ambiente s_traffico fadein 1.0
    call didascalia("VIA GRAMSCI 14 — 7:12")
    "Martedì. Mi sveglia il telefono."
    "Non suona. Vibra. Vibra come un frullatore lasciato acceso sul comodino."
    call via_didascalia
    play sound s_vibrazione
    show item smartphone with dissolve
    "Stamattina ne ho centoquarantasette."
    i comico "...Bozhe moy."
    "Il primo è di Dado. È delle due di notte."
    call sms("DADO", "PRINCI SVEGLIATIIII 🔥🔥🔥 guarda il mio profilo SUBITO")
    call sms("DADO", "siamo a 40k!!! QUARANTAMILA!!! la nonna dice che sono famoso")
    "Apro il link. Si apre TikTok. Si apre una musica di pianoforte triste, di quelle che si mettono sotto i cani abbandonati."
    "E poi si apre la mia faccia."
    play music m_tensione2 fadein 1.0
    "Cioè: la mia maschera. Il cappello nero. La V di Vendetta, di spalle, dietro il bancone della Lampo."
    "E davanti a me, con il fazzoletto blu e le rose gialle, Valya."
    "La scritta in sovrimpressione, bianca, tremolante, con un cuore spezzato alla fine:"
    "{b}LA PRINCIPESSA E LA BABUSHKA 💔 storia vera{/b}"
    "Sotto, la voce di Dado. La voce che usa per i video, mezzo tono più bassa del normale, come un documentario sui pinguini."
    d "«Lui ha diciannove anni. Lei ottantaquattro. Ogni giovedì entra in negozio con un oggetto rotto. Ma forse quello che vuole aggiustare... è un'altra cosa.»"
    "Sei secondi di me che le passo una caramella. Tre secondi di lei che sorride. Dissolvenza. Cuore. Pianoforte."
    "Quattrocentomila visualizzazioni."
    i sarcastico "Il video di Biancaneve ne aveva fatte trecentottantamila. Complimenti, Ionuț. Hai battuto te stesso."
    "Poi scendo nei commenti. Che è la cosa che non bisogna mai fare. Come aprire il vano batterie di una radio con scritto sopra «non aprire»."
    play sound s_notifica
    "{i}«piango è la cosa più bella che ho visto oggi»{/i}"
    play sound s_notifica
    "{i}«raga ma è legale??»{/i}"
    play sound s_notifica
    "{i}«il ragazzo punta all'eredità 100 per cento, guardate gli occhi»{/i}"
    i freddo "Ho una maschera. Non si vedono gli occhi."
    play sound s_notifica
    "{i}«mia nonna è morta l'anno scorso, vorrei che qualcuno l'avesse guardata così»{/i}"
    "Questo lo leggo due volte. Poi passo oltre, in fretta, perché mi si chiude la gola e sono le sette del mattino."
    play sound s_notifica
    play sound s_notifica
    "{i}«che schifo, ma la famiglia di questa signora dov'è???»{/i}"
    play sound s_notifica
    "{i}«dove si trova questo negozio? Valdorsa? la conosco la vecchina, abita in via dei tigli»{/i}"
    "Quest'ultimo ha trecento like."
    "Via dei Tigli. Il civico no, per fortuna. Ma il nome della via sì, scritto lì, da uno sconosciuto con la foto di un pesce."
    play sound s_notifica
    pause 0.3
    play sound s_notifica
    pause 0.3
    play sound s_notifica
    call sms("MAMMA", "Puiule ma sei tu nel video??? La signora Ferretti figlia me l'ha mandato 😳 chi è la nonna?? 🐻")
    call sms("GIULIA", "Hai visto. Lo so che hai visto. Non fare niente di stupido prima del caffè.")
    hide item with dissolve
    show ionut arrabbiato at centro with dissolve
    "Importa solo una cosa: che Dado apre il negozio alle nove, e io alle nove meno un quarto sarò davanti alla saracinesca."

    scene bg negozio with dissolve
    stop ambiente fadeout 1.0
    play music m_comico2 fadein 1.0
    call didascalia("RIPARAZIONI LAMPO — 8:58")
    "Dado arriva alle otto e cinquantotto. Ha gli occhiali da sole. Ha un caffè grande. Ha la faccia di uno che ha vinto qualcosa."
    call via_didascalia
    show dado ride at dx with dissolve
    d "PRINCIPESSAAAA! Il mio re! La mia regina! Il mio algoritmo!"
    show ionut furioso at sx, trema with dissolve
    i furioso "Toglilo."
    d comico "Buongiorno anche a te, eh. Hai visto i numeri? Mi hanno scritto da una pagina che si chiama «Storie che scaldano». Duecentomila follower, Princi."
    i furioso "Dado. Toglilo. Adesso."
    d ride "Ma sei matto? È la cosa più bella che ho fatto in vita mia! Ho fatto anche il montaggio col pianoforte. Il pianoforte, Princi!"
    i arrabbiato "Non le hai chiesto niente. Non mi hai chiesto niente."
    d comico "Ma è una cosa bella! È... tenera! La gente piange! Ho fatto piangere quattrocentomila persone!"
    i furioso "C'è uno che ha scritto la sua via."
    "Dado si ferma. Il caffè resta a metà strada tra il bancone e la bocca."
    d "...Cosa?"
    i arrabbiato "Via dei Tigli. Nei commenti. Trecento like. C'è gente che scrive che le voglio rubare la casa. C'è gente che vuole sapere dove abita."
    i furioso "Lei ha ottantaquattro anni, Dado. Non sa neanche cos'è TikTok. Pensa che internet sia una cosa che si accende con un interruttore."
    i furioso "SI VEDE APPENA?"
    with vpunch
    "Rino esce dal retrobottega con un saldatore in mano. Lo tiene come un'arma, per abitudine."
    show rino arrabbiato at centro with dissolve
    r "Cos'è 'sto casino alle nove di mattina?"
    d comico "Niente, capo. La Principessa è emotiva."
    r "La Principessa è sempre emotiva. Cosa c'è?"
    i arrabbiato "Dado ha messo su internet un video della signora Valya. Con me. Col pianoforte."
    r "Col cosa?"
    d "Col pianoforte. Di sottofondo. Fa atmosfera."
    r normale "Davide. Io non so cos'è il tikitoki. Ma se è quella roba dei vetri con l'ansia dentro, toglilo."
    d "Capo, ma sono quattrocentomila..."
    r arrabbiato "Toglilo, ho detto. Quella signora paga in contanti e saluta quando entra. È l'unica cliente educata che ho avuto dal novantasei."
    hide rino with dissolve
    "Dado prende il telefono. Lo guarda come si guarda un cane che bisogna portare dal veterinario."
    d serio "...Va bene. Lo tolgo."
    i cupo "Grazie."
    "Ma tutti e due sappiamo una cosa che non diciamo."
    "Su internet niente si elimina. Si sposta. L'hanno già scaricato, ricaricato, tagliato, messo su altre pagine con altre musiche."
    "Da qualche parte, adesso, la mia schiena e il fazzoletto di Valya stanno facendo piangere qualcuno su un treno per Bari."
    d comico "Princi... dai. Non volevo. Cioè, volevo. Ma non volevo così."
    i cupo "Lo so."
    "Lo so davvero. Il problema è proprio questo. Dado non è cattivo. Dado è uno che vede una cosa bella e la vuole far vedere a tutti, come un bambino con un sasso lucido."
    "Solo che il sasso era lei."
    hide dado with dissolve

    # ------------------------------------------------------------------
    # 2. NEGOZIO — entra Arkadij
    # ------------------------------------------------------------------
    scene bg negozio_sera with fade
    play music m_negozio fadein 1.0
    call didascalia("RIPARAZIONI LAMPO — 17:40")
    "Il pomeriggio passa come passano i pomeriggi di dicembre al Girasole: lentissimo, e poi è buio."
    call via_didascalia
    play sound s_campanella
    stop music fadeout 0.5
    "La campanella."
    "Non suona come quella di Valya. Non chiede il permesso. Suona e basta, come una cosa che è stata pagata."
    play music m_tensione fadein 2.0
    show arkadij freddo at dx with dissolve
    "Entra un uomo con un cappotto scuro lungo fino al ginocchio. Quarant'anni, forse qualcosa di più. Capelli corti, sciarpa grigia, scarpe che non hanno mai visto una pozzanghera."
    "Sta parlando al telefono. Non lo mette giù quando entra. Parla in italiano, a voce bassa, con le parole di chi ha fretta."
    a "...No, il rogito dopo le feste. Sì. Le mando io la planimetria. Arrivederci."
    "Mette giù. Poi guarda me."
    show ionut freddo at sx with dissolve
    a "Lei è quello del video."
    i ironico "Dipende dal video. Ne ho fatti due. Uno da Biancaneve, l'altro da Biancaneve con una signora."
    a "Il secondo."
    "Non sorride. Non è uno che non ha capito la battuta. È uno che ha deciso di non pagarla."
    a "Mi chiamo Arkadij Nikolaevič Orlov. Valentina Petrovna è mia prozia. La sorella di mio nonno."
    "Orlov. Come lei. Lo stesso cognome che c'è sul campanello di via dei Tigli, scritto a mano sotto «Bellini»."
    i sincero "Ah. Piacere. Io sono Ionuț. Lei è... la signora Valya mi ha parlato di un nipote a Milano."
    a "Pronipote. Le ha parlato di me?"
    i imbarazzato "Una volta. Ha detto che lei «lavora coi soldi degli altri e dorme poco»."
    "Tira fuori il telefono. Me lo mette davanti, sul vetro del bancone, accanto al Samsung rotto. Sullo schermo c'è il video. Lui, almeno, l'ha scaricato."
    show item smartphone with dissolve
    a "Me l'ha mandato una collega stamattina. Con scritto «ma non è la tua zia?». Lo sa cosa vuol dire, ricevere questo alle otto di mattina, in riunione?"
    i cupo "Non l'ho fatto io. L'ha fatto un mio collega. L'abbiamo tolto."
    a "Lo so che l'avete tolto. Ce ne sono altre undici copie. Le ho contate."
    hide item with dissolve
    a "Ma il video non è il problema, signor... Ionuț. Il video è solo il modo in cui l'ho saputo."
    i freddo "Saputo cosa?"
    a "Che c'è un ragazzo di diciannove anni che passa i pomeriggi con mia zia. Che va a casa sua. Che si fa offrire il tè. Che le ripara le cose, gratis."
    i arrabbiato "Non gratis. Paga. Rino le fa la ricevuta."
    a "Peggio. Allora è un rapporto commerciale."
    "Lo dice senza alzare la voce. È questo che mi spaventa. Le persone che urlano, le capisco. Quelle che parlano piano, hanno già deciso."
    a "Sa quante ne vedo, di storie così? Faccio il consulente finanziario. Le vedo tutte le settimane."
    a "Persone sole. Anziane. Con una casa di proprietà e nessuno vicino. E poi arriva qualcuno di gentile."
    i furioso "Io non sono «qualcuno di gentile»."
    a "No? Cos'è, allora?"
    "Non lo so. È la risposta vera. Non lo so cosa sono. Lo stavo chiedendo anche io, al soffitto, da un mese."
    i arrabbiato "Sono quello che le aggiusta la radio."
    a "Gliela aggiusta da ottobre. Che radio è, un'astronave?"

    show arkadij triste
    a "Le racconto una cosa. Poi lei fa quello che vuole."
    a "Mia zia aveva un'amica. Galina Sergeevna. Ucraina, di Char'kov. Vivevano vicine, a Valdorsa, si facevano compagnia la domenica."
    a "Tre anni fa Galina conosce un ragazzo. Simpatico. Le porta la spesa. La chiama «nonnina». Le sistema il televisore. Le insegna a fare le videochiamate."
    a "Dopo otto mesi lei firma una procura. A lui. Un «nipote acquisito», l'ha chiamato il notaio. Il notaio, eh. Non io."
    "Si ferma. Si guarda le mani."
    a "Le ha venduto l'appartamento. Le ha svuotato il conto. Le ha lasciato solo il gatto."
    a "Galina è morta in una casa di riposo pubblica a Reggio, in una stanza con altre tre. Il gatto l'hanno dato al canile. Nessuno l'ha più preso."
    a freddo "Mia zia è andata a trovarla ogni settimana. In autobus. Ottanta chilometri. Fino alla fine."
    a "E adesso guardi. Adesso è lei che ha un ragazzo simpatico che le sistema le cose."
    show ionut cupo at sx
    i cupo "...Io non sono così."
    a "Lo diceva anche lui. Testuale. «Io non sono così». L'ho letto nei verbali."
    "Non ho niente da dire. Ho tutta la verità del mondo e nessuna prova. Ho una caramella Mishka in tasca e un barattolo pieno a casa. Non si mostrano in tribunale."
    a "Le dico cosa succede adesso, così non ci sono equivoci."
    a "Ho già parlato con la Residenza Le Magnolie. Hanno un posto da gennaio. È una struttura buona, con personale qualificato. Ci sono infermieri di notte."
    a "L'appartamento di via dei Tigli lo vendo. I soldi servono per la retta. Tutto verrà fatto da me, con un notaio vero, davanti a mia zia."
    i arrabbiato "Lei lo sa che non vuole? Gliel'ha chiesto?"
    a "Mia zia non vuole niente da quando è morto Aldo. Non vuole uscire, non vuole il medico, non vuole le badanti. Ne ha cacciate tre."
    a "Se aspetto che voglia, aspetto il funerale."
    a "Non torni a casa sua. Non la chiami. Se le serve una riparazione, la porto io in un centro autorizzato."
    i furioso "Lei non può decidere chi—"
    a "Posso decidere chi entra in casa di una donna di ottantaquattro anni che vive da sola. Sì. È esattamente quello che posso decidere."
    "Prima di uscire posa un biglietto da visita sul bancone. Lo allinea al bordo con due dita, come un notaio che chiude un atto."
    a "Se ha qualcosa da dirmi, lo dica a questo numero. Non a lei."
    play sound s_campanella
    hide arkadij with dissolve
    "La campanella suona di nuovo. La porta si chiude da sola."
    "Resto con il Samsung in mano. Ho stretto così forte che il vetro nuovo, quello che avevo appena montato, ha una crepa."
    i sclero "...Fantastico. Adesso ho rotto anche questo."
    "Non mi serve un principe. Mi serve un cacciavite. E stavolta non so dove infilarlo."

    # ------------------------------------------------------------------
    # 3. PARCHEGGIO — il litigio
    # ------------------------------------------------------------------
    scene bg parcheggio_notte with fade
    stop music fadeout 1.0
    play ambiente s_vento fadein 1.0
    call didascalia("PARCHEGGIO NORD — 20:15")
    "Alle otto chiudiamo. Il calcio di Ruggeri, «Azzurro», la saracinesca a quaranta centimetri. Stasera nessuno ride."
    "Esco dal lato nord, quello dei dipendenti. Il parcheggio è vuoto, giallo di lampioni, con le strisce che nessuno ha mai ridipinto."
    call via_didascalia
    "Tranne una macchina. Una berlina scura, ferma sotto l'unico lampione che funziona bene. Il motore acceso. Lo schermo di un telefono che illumina un volto."
    "Ci vado lo stesso."
    play music m_tensione2 fadein 1.0
    play sound s_passi
    show ionut arrabbiato at sx with dissolve
    "Busso al finestrino. Lui alza un dito: un attimo. Finisce la telefonata. Poi scende, lentamente, e si abbottona il cappotto."
    show arkadij sera at dx with dissolve
    a "Non dovrebbe essere qui."
    i arrabbiato "Lavoro qui. È lei che non dovrebbe essere qui. Mi aspettava?"
    a "Aspettavo una telefonata da New York. Lei è arrivato prima."
    i arrabbiato "Lei non mi conosce."
    a "No. Ed è questo il punto. Nessuno la conosce. Mia zia la conosce da ottobre. Due mesi."
    i furioso "Due mesi in cui c'ero. Lei dov'era? Negli ultimi dieci anni, dov'era?"
    "L'ho detto. È uscito. Come un fusibile che salta: prima il clic, poi il buio."
    "Lui non si muove. Ma la mascella sì. Una volta."
    a "A Milano. A lavorare. A pagare le bollette di via dei Tigli, il condominio, la signora delle pulizie che lei manda via ogni volta."
    i furioso "Le bollette. Bravo. E le ha mai chiesto cosa ascolta alla radio? Le ha mai chiesto chi è l'uomo nella foto girata verso il muro?"
    a "Lei ha visto le foto in casa sua."
    "Ecco. L'ho fatto di nuovo. Gli ho dato esattamente la prova che cercava."
    a "È stato in casa sua. Ha visto le foto. Sa dove tiene le cose."
    i furioso "Le ho portato un orologio! Rino mi ha mandato! Quattro piani a piedi, l'ascensore era rotto, mi ha fatto il tè, io ho bevuto il tè! È un reato, il tè?"
    a "Galina diceva le stesse cose. «Mi porta la spesa. Beviamo il tè.» Le stesse identiche parole."
    show ionut sclero at sx, trema
    i sclero "IO NON SONO QUEL RAGAZZO!"
    with hpunch
    play sound s_glitch
    "La voce rimbalza sulle saracinesche dei magazzini. Un piccione vola via dal lampione. Lontano, un allarme di macchina si accende e si spegne, offeso."
    i sclero "Io non voglio la sua casa! Non voglio i suoi soldi! Non so neanche quanti soldi ha! Io voglio solo che la radio funzioni per Capodanno, perché lei me l'ha chiesto!"
    i sclero "È l'unica cosa che mi ha chiesto! L'unica! E io gliela faccio, mi sente? Gliela faccio!"
    with hpunch
    "Sto ansimando. La maschera LED si appanna dall'interno. Le X lampeggiano come una slot machine rotta."
    "Lui aspetta. Aspetta che finisca, come si aspetta che passi un camion prima di attraversare."
    a "Ha finito?"
    show ionut arrabbiato at sx
    "Non rispondo. Non ho più fiato per rispondere."
    a "Le dico una cosa, e poi me ne vado. Non gliela dico per cattiveria."
    a "Lei ha diciannove anni. Ha una maschera in testa. Urla in un parcheggio. E mi dice che si prende cura di una donna di ottantaquattro anni."
    a "Lei non si prende cura di nessuno. Lei sta giocando a una storia. Una storia bella, con la radio e la neve. La capisco. Anche io da ragazzo leggevo."
    "Apre la portiera. Si ferma. Mi guarda per la prima volta senza fretta."
    show arkadij freddo
    a "Lei è un ragazzo. Torni a fare il ragazzo."
    play sound s_porta
    hide arkadij with dissolve
    "La portiera si chiude con quel suono morbido delle macchine care. I fari mi passano sopra. Poi niente."
    stop music fadeout 2.0
    "Resto nel parcheggio vuoto. Il vento porta una busta di plastica da una parte all'altra delle strisce, come se cercasse il suo posto."
    show ionut cupo at sx
    i cupo "«Torni a fare il ragazzo.»"
    i cupo "Come se fosse un posto. Come se ci fosse un indirizzo."
    stop ambiente fadeout 2.0

    # ------------------------------------------------------------------
    # 4. NEGOZIO — Valya contro Arkadij
    # ------------------------------------------------------------------
    scene bg negozio with fade
    play music m_negozio fadein 1.0
    call didascalia("RIPARAZIONI LAMPO — GIOVEDÌ, 16:05")
    "Giovedì."
    "Mercoledì non è successo niente. Il video aveva cinquecentomila visualizzazioni su una pagina di Napoli. Dado non ha fatto battute per un giorno intero. Rino dice che è un record."
    call via_didascalia
    "Oggi è giovedì e io non mi sono pettinato sotto il cappello. Non so se verrà. Non so se gliel'hanno detto. Non so cosa le hanno detto."
    show dado serio at estrema_dx with dissolve
    show rino normale at centro with dissolve
    d serio "Princi. Se viene, io sto in laboratorio. Giuro. Non esco neanche per fare pipì."
    r "Se viene, voi due state zitti e io le faccio la ricevuta. Siamo un negozio, non una telenovela."
    play sound s_campanella
    "La campanella."
    "Piano. Come una che chiede il permesso."
    "No."
    play sound s_campanella
    "Due volte. Forte. Come una che il permesso se l'è già preso."
    stop music
    hide dado
    hide rino
    show arkadij freddo at sx with dissolve
    "Entra prima Arkadij. Tiene la porta aperta. Ha la faccia di un uomo che ha guidato da Milano con un passeggero che non gli ha parlato per tutto il tempo."
    play music m_comico fadein 0.5
    show valya arrabbiata at dx, entra_dx with dissolve
    "Poi entra lei."
    "Fazzoletto viola. Sciallone. Borsa a quadri. E una faccia che non le ho mai visto: le sopracciglia non giudicano più. Hanno già emesso la sentenza."
    v arrabbiata "Printsessa. Buongiorno."
    i imbarazzato "...Buongiorno, signora Valya."
    v "Lei stia lì. Con lei parlo dopo. Adesso parlo con questo."
    "«Questo» è Arkadij Nikolaevič Orlov, consulente finanziario, un metro e ottantacinque, cappotto da milleduecento euro."
    "«Questo» si toglie i guanti come se fossero due bandiere bianche."
    a "Zia, per favore, non qui..."
    show valya arrabbiata at dx, saltello
    v arrabbiata "Arkasha! Ty chto, s uma soshyol?!"
    with hpunch
    "Non so il russo. Ma «Arkasha» con quel tono lo capisco benissimo. È lo stesso tono che usava mia nonna a Iași quando dicevo «Ionuțel» alla gallina."
    v "Ty priyekhal iz Milana, chtoby mne skazat', gde mne zhit'? Mne?!"
    a "Zia, ne krichi, pozhaluysta, tut lyudi..."
    v "Pust' slushayut! Pust' vse slushayut!"
    "Si gira verso il negozio. Verso Rino, verso me, verso la porta del laboratorio dove Dado si è nascosto e da cui spunta mezza faccia."
    v arrabbiata "Ascoltate tutti. Questo signore crede che io sia un mobile. Un armadio. Si sposta, si vende, si porta alle Magnolie."
    v "Ya ne shkaf, Arkasha! Ya — tvoya tyotya! Ya tebya na rukakh derzhala!"
    a "Lo so, zia. Lo so che mi hai tenuto in braccio."
    v "Allora lo dica in italiano, così capiscono tutti. Mi ha tenuto in braccio. Gli ho cambiato i pannolini, a Leningrado, nel millenovecentottantacinque."
    show rino normale at centro with dissolve
    r "Signora, vuole... sedersi? Le porto una sedia?"
    v arrabbiata "Dopo, signor Ruggeri. Spasibo. Adesso sono in piedi e resto in piedi."
    hide rino with dissolve
    v "Arkasha. Kto tebe dal pravo? Chi ti ha dato il diritto di venire qui e minacciare questo ragazzo?"
    a arrabbiato "Non l'ho minacciato. Gli ho parlato. Zia, c'è un video. Ci sono migliaia di persone che ti guardano. C'è chi scrive dove abiti."
    v "E allora? Che guardino. Ho ottantaquattro anni, mi hanno guardato in tanti. Anche il KGB, e loro erano più bravi di questi del telefono."
    show arkadij arrabbiato at sx
    a arrabbiato "Zia, ascoltami. Ricordi Galina? Ricordi cosa le è successo?"
    "Lei si ferma. Una frazione di secondo. Come un disco che salta."
    v seria "Galya era sola. Galya non aveva nessuno. Io ho... io avevo..."
    v arrabbiata "Io ho la testa! Ancora! Io so chi è buono e chi no! Ho lavorato al centralino del porto quindici anni, ho sentito le voci di tutti gli uomini di Murmansk!"
    v "So riconoscere un bugiardo dal modo in cui dice «pronto». Questo ragazzo non sa neanche mentire. Ci prova, ma diventa rosso sotto la maschera."
    i imbarazzato_flip "Non si vede, sotto la maschera."
    v "Si vede, ty durak. Si vede da qui."
    v arrabbiata "Kak tebe ne stydno, Arkasha. Stydno! Ty dazhe ne pozvonil mne na den' rozhdeniya!"
    a triste "...Ti ho mandato i fiori."
    v "I fiori li manda la segretaria. Lo so. Sul biglietto c'era scritto «Valentina Orlova». Tu mi chiamavi «tyotya Valya». Da piccolo. Con la erre sbagliata."
    "Arkadij non risponde. Si guarda le scarpe. Le scarpe che non hanno mai visto una pozzanghera."
    "Per un secondo, sotto il cappotto, c'è un bambino di Leningrado con la erre sbagliata."
    stop music fadeout 2.0

    show valya triste at dx
    "Poi lei si ferma."
    "Non di colpo. Come si ferma una trottola: prima ondeggia, poi rallenta, poi cerca qualcosa con la mano."
    v triste "...Signor Ruggeri. Adesso la sedia, sì."
    "Rino è già lì. La sedia è il suo sgabello, quello con la vite che punge. L'ha girato dalla parte buona."
    "Valya si siede. Si toglie il fazzoletto. Ha i capelli bianchissimi, sottili, raccolti con una forcina di metallo."
    play music m_triste2 fadein 3.0
    v "Bozhe moy. Che giornata."
    "Mi avvicino. Non so perché. Le mani lo fanno prima di me, come quando prendo un condensatore che sta per cadere."
    hide arkadij with dissolve
    show ionut sincero at sx with dissolve
    "Mi inginocchio accanto alla sedia. Le porgo il suo fazzoletto, che le è scivolato sulla gonna."
    "Lei lo prende. Mi guarda. Sorride, piano, come sorride nella foto girata verso il muro. Non l'ho mai vista, quella foto. Ma lo so che sorride così."
    v nostalgica "Spasibo, Lyova."
    stop music
    window hide
    pause 3.0
    window show
    "..."
    "Nessuno respira."
    "Rino tiene la mano sullo schienale dello sgabello e non la toglie."
    "Dado è sulla porta del laboratorio. Non sta ridendo. Ha il telefono in mano, abbassato, spento."
    "..."
    "Lyova."
    "Non so chi sia Lyova. So solo che non è il mio nome, e che lei l'ha detto come si dice il nome di qualcuno che è entrato in cucina dopo tanto tempo."
    show valya seria at dx
    v seria "...Ionuț."
    "Lo dice lentamente. Ogni lettera. Come se lo leggesse da un'etichetta."
    v "Ionuț. Scusi. Ho... sono stanca. È stato il viaggio. La macchina di Arkasha è troppo calda, fa venire sonno."
    v "Lei non... non ci faccia caso."
    i vulnerabile "Non ci faccio caso."
    "Ci faccio caso. Ci farò caso per il resto della mia vita."
    v triste "Nu, ladno. Lyova... Lev. Era un nome. Un nome di prima. Lei non lo conosce."
    i malinconico "No. Non lo conosco."
    v "Meglio. Era uno sciocco. Parlava col cielo."
    "Ride. La risata da ragazza. Ma dura poco, e alla fine si incrina, come una frequenza che si perde."
    "Mi alzo. E vedo Arkadij."
    show valya triste at dx2
    show arkadij triste at sx2 with dissolve
    "È rimasto vicino alla porta. Non si è mosso. Ha visto tutto."
    "Ha la faccia di uno che ha ricevuto un referto e lo ha già letto tre volte in macchina."
    "E capisco una cosa che non volevo capire."
    "Non è venuto per me. Io sono la scusa. Io sono la cosa facile, quella con la maschera e il video."
    "È venuto per questo. Per il nome sbagliato. Per l'ombrello dimenticato, le storie ripetute, le badanti cacciate, e chissà quante altre cose che non mi ha raccontato ma che adesso gli leggo in faccia."
    a triste "Zia. Andiamo a casa. Ti preparo il tè."
    v seria "Tu non sai fare il tè, Arkasha. Lo fai come gli inglesi."
    a "Imparerò."
    "Lei si alza. Rimette il fazzoletto, annoda sotto il mento con due dita che tremano un poco. Riprende la borsa a quadri."
    "Prima di uscire, apre la borsa. Tira fuori una caramella. La posa sul bancone, come ogni settimana."
    v sorridente "Per Printsessa. Non la mangi tutta in una volta."
    i sincero "Non la mangio mai."
    v "Lo so. Le conserva. Siete strani, voi ragazzi."
    play sound s_campanella
    hide valya with dissolve
    "La campanella. Piano, stavolta."
    "Arkadij le tiene la porta. Prima di uscire si volta verso di me. Non dice niente. Ma non è più lo sguardo del parcheggio."
    "È lo sguardo di uno che è arrivato tardi a un incidente e trova un altro, sul posto, che ha già chiamato l'ambulanza. E non sa se ringraziarlo o odiarlo."
    hide arkadij with dissolve
    "La porta si chiude."
    "Rino si siede sul suo sgabello. Si punge con la vite. Non dice niente."
    show dado serio at dx with dissolve
    d serio "...Princi. Chi è Lyova?"
    i malinconico "Non lo so."
    d "Ah."
    hide dado with dissolve
    "Io prendo la caramella. Mishka na Severe. L'orso al nord, sul pack, con la stella sopra."
    "Me la giro tra le dita fino alla chiusura."
    stop music fadeout 2.0

    # ------------------------------------------------------------------
    # 5. STRADA SOTTO LA PIOGGIA — il tempo
    # ------------------------------------------------------------------
    scene bg strada_pioggia with lento
    show pioggia
    play ambiente s_pioggia fadein 2.0
    play music m_triste fadein 3.0
    call didascalia("VIA EMILIA — 20:40")
    "Stasera non prendo il bus. Cammino."
    "Sono quattro chilometri dal Girasole a casa. Piove quella pioggia di dicembre che non cade: si appoggia. Ti si posa addosso come una coperta bagnata."
    call via_didascalia
    show ionut malinconico at centro with dissolve
    play sound s_passi
    "Ho tolto la maschera LED. Le X si sono spente da sole a metà di via Matteotti. Batteria scarica. Anche lei."
    "Penso ad Arkadij."
    "Ho passato due giorni a odiarlo. Mi ero preparato bene, avevo tutto: il cappotto, i guanti, la voce bassa, la berlina che chiude piano le portiere."
    "Poi l'ho visto vicino alla porta, con la faccia del referto."
    i malinconico "Il cattivo sarebbe facile."
    "Lo dico ad alta voce. Alla pioggia. Alla vetrina di una lavanderia a gettoni dove una lavatrice gira da sola, illuminata, come un acquario."
    i malinconico "Il cattivo si può picchiare."
    "Si può urlargli contro in un parcheggio. Gli si può fare un video. Gli si possono scrivere commenti. Si può vincere."
    "Ma Arkadij non è il cattivo. Arkadij è uno che ha avuto paura prima di me. Ha solo scelto un modo diverso di averla."
    "Io la mia paura l'ho messa in una radio. Lui l'ha messa in un contratto con le Magnolie."
    "E tutti e due, per mesi, abbiamo fatto finta che la paura fosse l'altro."
    show ionut vulnerabile at centro
    i vulnerabile "Il tempo no."
    "Il tempo non si picchia. Non ha la faccia. Non ha il cappotto. Non entra dalla porta facendo suonare la campanella."
    "Il tempo entra dentro le persone e sposta i nomi. Prende «Ionuț» e ci mette sopra «Lyova», come si mette un'etichetta nuova su una scatola vecchia."
    "E tu non puoi farci niente. Non c'è un condensatore da cambiare. Non c'è una saldatura fredda. Non c'è un cacciavite abbastanza piccolo."
    play sound s_tuono
    with flash
    "Un tuono, lontano, verso il fiume."
    "Mi fermo sotto una pensilina dove non passa più nessun autobus dal duemilaotto."
    "Tiro fuori la caramella dalla tasca. La carta è un po' bagnata. L'orso è ancora lì, sul suo pezzo di ghiaccio, con la stella sopra."
    "Lyova."
    "Lev. Un uomo che parlava col cielo. Uno sciocco."
    "Io non so niente di lui. Ma stasera, sotto questa pensilina, mi sento più vicino a lui che a chiunque altro al mondo."
    "Perché anche io, adesso, sto parlando a qualcuno che forse non può sentirmi."
    play sound s_vibrazione
    show item smartphone with dissolve
    "Il telefono vibra. Penso: Dado. Penso: altri commenti. Penso: la mamma."
    call sms("NUMERO SCONOSCIUTO", "Sono Orlov. La zia dorme. Ha chiesto se la radio sarà pronta per Capodanno. Le ho detto di sì. Non mi faccia passare per bugiardo.")
    "Lo leggo una volta. Lo leggo due volte."
    "Non c'è un grazie. Non c'è una scusa. Non c'è neanche un punto esclamativo. È il messaggio più freddo che abbia mai ricevuto."
    "Ed è il primo, da martedì, che mi fa venire voglia di piangere."
    hide item with dissolve
    show ionut sincero at centro
    i sincero "Sarà pronta."
    "Sarà pronta. Non so ancora come. Non so cosa c'è nel vano batterie con lo scotch, non so cosa vuol dire sette-zero-sette-sette, non so chi aspetta, lei, a Capodanno."
    "So solo una cosa, l'unica che so fare davvero."
    "Che le cose rotte, a volte, non vanno aggiustate. Vanno tenute accese. Finché qualcuno, dall'altra parte, risponde."
    hide ionut with dissolve
    "Rimetto la caramella in tasca. Non la mangio."
    "Esco dalla pensilina. La pioggia mi trova subito, come una vecchia amica."
    stop music fadeout 3.0
    stop ambiente fadeout 3.0
    hide pioggia
    scene bg nero with lentissimo
    pause 1.0
    return
