## CAPITOLO 2 — "Spidola"
## Ottobre. La riparazione, la scritta sul vano batterie, il primo fruscio,
## Murmansk, "Ionuț è Ivan", il bus, la notte.

label cap2:
    call titolo_capitolo("2", "Spidola", "Valdorsa — ottobre")

    ## ------------------------------------------------------------------
    ## 1. LABORATORIO — la riparazione
    ## ------------------------------------------------------------------
    scene bg laboratorio with dissolve
    play music m_negozio fadein 2.0
    call didascalia("LAMPO — RETROBOTTEGA, LUNEDÌ 13:05")

    "La pausa pranzo alla Lampo dura quaranta minuti."
    "Rino la passa in macchina ad ascoltare Radio Rai col sedile reclinato. Dado la passa a filmarsi mentre mangia."
    "Io la passo qui, nel retrobottega, con una radio sovietica aperta sul banco come un paziente."
    call via_didascalia

    show item radio with dissolve
    "Si chiama VEF Spidola. L'hanno costruita a Riga, all'inizio degli anni Sessanta, quando una radio a transistor era il futuro e stava in una mano."
    "Pesa come un mattone pieno. Ha la scocca color crema, una maniglia di cuoio crepata e l'odore di una soffitta in cui nessuno sale da anni."
    "Ho svitato le due viti del retro con la delicatezza con cui si toglie il cappotto a qualcuno che dorme."
    hide item with dissolve

    i sincero "Allora. Vediamo dove ti fa male."

    "Dentro c'è una città."
    "La barra di ferrite dell'antenna, lunga come una matita, con le bobine avvolte in filo verde. Il condensatore variabile, con le lamelle che si infilano una nell'altra come le pagine di un libro chiuso."
    "Il commutatore delle bande è un tamburo che gira con uno scatto: onde lunghe, onde medie, e poi le corte, a fette. 25 metri. 31. 41. 49."
    "E i condensatori elettrolitici. Sono gonfi, panciuti come i vecchi al bar. Uno ha pianto una specie di catrame marrone sul circuito."
    play sound s_cacciavite
    i ironico "Voi siete in pensione da prima che nascesse mia madre. Mi dispiace, signori. Si va a casa."

    "Li sostituisco uno alla volta. Quelli nuovi sono la metà, blu, lucidi. In mezzo ai vecchi componenti sembrano nipoti in visita."
    "I transistor invece sono al germanio. Il germanio ha paura del caldo: se lo saldi piano, muore."
    "Allora saldo veloce, e tengo il piedino con la pinzetta, che si prende il calore al posto suo."
    "È come tenere la mano a qualcuno dal dentista. Non serve a niente, tecnicamente. Ma serve."

    "Il tester dice che uno dei due transistor finali è morto davvero."
    "Nel cassetto di Rino con scritto RICAMBI 1989 trovo un AC128 ancora nella bustina. Un germanio italiano, quasi coetaneo. Va bene. Si faranno compagnia."

    "Poi c'è la funicella."
    "Quella che collega la manopola alla lancetta della scala si è spezzata. La lancetta è ferma in mezzo al nulla, tra Varsavia e Londra."
    "In italiano, la scala delle frequenze si chiama {b}scala parlante{/b}. Lo so dal secondo anno, e solo adesso mi accorgo di quanto sia bello."
    "Una scala che parla. Sopra ci sono i nomi delle città: Moskva, Riga, Kiev, Praga, Roma. Una cartina che si gira con un pollice."
    "Nella banda dei 41 metri, poco prima del 7.1, c'è un segno a matita. Piccolo. Premuto forte, come da qualcuno che non voleva sbagliarsi."
    "Sette, zero, sette, sette. Come il biglietto che ho trovato dentro, l'altra notte."

    show dado ride at dx, entra_dx with dissolve
    d ride "Eccolo. Il dottor Frankenstein della pausa pranzo."
    i sarcastico "Ciao, Dado."
    d comico "Sono tre giorni che parli con quella cosa. Ti sei fidanzato con una radio?"
    i ironico "Almeno lei non mi filma mentre mangio."
    d ride "Dai, fammi fare un video. “La Principessa e il frigorifero comunista.” Tre milioni di view. Minimo."
    i sarcastico "Hai trecentododici follower, Dado."
    d comico "Trecentotredici. Mia nonna si è fatta il profilo."
    show dado ride at dx, saltello
    d ride "Comunque, per la cronaca. “Non mi serve un principe, mi serve un cacciavite.” Lo dicevi tu. Adesso hai il cacciavite. E il principe è una radio."
    i imbarazzato "Questo non ha senso."
    d ride "Ha un senso bellissimo. Lo metto in descrizione."
    hide dado with dissolve

    "Dado se ne va ridendo, e la porta del retro sbatte, e la radio sul banco non dice niente."
    "Non mi offendo. Di solito chi non dice niente è chi ascolta meglio."

    ## Di notte, dopo la chiusura
    scene bg laboratorio_notte with fade
    play music m_notte fadein 2.0
    play ambiente s_neon fadein 1.0
    call didascalia("LAMPO — MARTEDÌ, 22:30")
    "Il martedì resto dopo la chiusura. Rino mi lascia le chiavi con la faccia di chi lascia le chiavi della macchina a un figlio che non ha la patente."
    r normale "Non dar fuoco a niente, Principessa. L'assicurazione è scaduta nel 2019."
    call via_didascalia
    "Di notte il centro commerciale fa rumori che di giorno nasconde. Le scale mobili spente scricchiolano. I frigoriferi del bar ronzano in do minore."
    "Pulisco il commutatore delle bande con lo spray disossidante. Ogni scatto del tamburo, dopo, è più netto. Come una gola che si schiarisce."
    "Poi rimetto in tensione la funicella nuova: tre giri attorno al perno della manopola, uno attorno alla puleggia, una molla piccola come un'unghia a tenerla tirata."
    "Giro. La lancetta parte da Londra e arriva a Moskva senza inciampare. Torno indietro. Moskva, Kiev, Praga, Roma."
    i malinconico "Viaggiare così. Con un pollice."

    show mario notte at dx, entra_dx with dissolve
    m notte "Guagliò. Sono le undici meno un quarto."
    i imbarazzato "Mario! Mi hai fatto prendere un colpo."
    m notte "Io vedo tutto. Telecamera sette. Da un'ora parli con un elettrodomestico."
    i ironico "Non è un elettrodomestico. È una Spidola."
    m comico "Una Spidola! Bella. Sulle navi ce n'erano, i marinai russi le scambiavano per sigarette. Bel suono, onde corte buone."
    m notte "L'hai accesa?"
    i sincero "Non ancora. Potrei. Ho finito quasi tutto."
    m notte "E allora?"
    i sincero "Allora... la prima volta che si accende, credo che debba esserci lei."
    "Mario abbassa gli occhiali da sole di un centimetro. È il massimo dello stupore che gli ho mai visto."
    m serio "Questa è una cosa da marconista, sai? Certe radio le accendi solo quando c'è chi deve sentire."
    m notte "Buonanotte, Principessa. Chiudi bene. Che tanto la saracinesca non chiude."
    hide mario with dissolve
    stop ambiente fadeout 1.0

    ## Giulia e la scritta
    scene bg laboratorio with dissolve
    play music m_negozio fadein 1.0
    call didascalia("LAMPO — RETROBOTTEGA, MERCOLEDÌ 16:40")
    "Il mercoledì pomeriggio Giulia chiude la tisaneria per dieci minuti e mi porta un tè che non ho ordinato."
    "È una cosa che fa da giugno. Non ne parliamo. Se ne parlassimo, smetterebbe."
    call via_didascalia

    show ionut ironico at sx with dissolve
    show giulia normale at dx with dissolve
    g normale "Buongiorno, Principessa."
    i sarcastico "Non—"
    g sorride "Lo so."
    g normale "Allora? Il paziente?"
    i sincero "Respira. Quasi. Gli manca una cosa sola, ma non posso toccarla."

    "Le giro la radio. Sul retro c'è il vano delle batterie, chiuso da tre strisce di scotch telato, ormai gialle come un'unghia di fumatore."
    "Sopra, a pennarello, una parola. Lettere che sembrano le nostre e non lo sono: una H che non è una H, una P che non è una P, una specie di b con accanto una stanghetta."
    "Ci ho provato da solo, con l'alfabeto cirillico su Wikipedia. Mi è venuto fuori qualcosa come un nome di farmaco."

    g seria "Fermo. Ho il traduttore con la fotocamera."
    "Giulia inquadra la scritta. Il telefono ci pensa un secondo, poi sovrappone le parole italiane sopra quelle russe, storte, come un sottotitolo."
    g normale "Si legge “NE OTKRYVAT'”. Tutto attaccato quasi."
    g seria "Vuol dire: {b}non aprire{/b}."
    i malinconico "Ah."
    g normale "Il punto esclamativo ce l'ha aggiunto il telefono. Per entusiasmo."

    "Restiamo a guardare lo scotch. Ha delle impronte sopra, vecchie, schiacciate nella colla."
    "Qualcuno ha chiuso questa cosa con le dita, e ha premuto. Tanto."

    g seria "Quindi lo apri."
    i sincero "No."
    g normale "No?"
    i sincero "Le batterie gliele faccio arrivare da fuori. Saldo due fili ai contatti dall'interno e metto un portabatterie sul retro. Brutto, ma educato."
    i ironico "Il vano resta chiuso. È casa sua. Io sono l'idraulico, mica il ladro."
    g sorride "Sei il primo uomo che conosco che rispetta le istruzioni."
    i imbarazzato "Di solito non le leggo. Queste erano scritte a mano."
    g normale "Ecco. È questa la differenza."

    "Giulia prende la tazza vuota e se ne va. Sulla porta si gira."
    g seria "Ionuț. Chi è la signora?"
    i sincero "Non lo so ancora."
    g normale "Mh. È la risposta più onesta che ti ho sentito dire da giugno."
    hide giulia with dissolve
    "Resto solo con la radio e con la parola che non devo aprire."
    i malinconico "Va bene. Non ti apro. Promesso."
    "Prometto a una radio. Lo scrivo qui così almeno qualcuno lo sa."
    hide ionut with dissolve

    ## ------------------------------------------------------------------
    ## 2. IL GIOVEDÌ — la scelta, la radio accesa
    ## ------------------------------------------------------------------
    scene bg negozio_sera with fade
    play music m_negozio fadein 1.0
    play ambiente s_neon fadein 1.0
    call didascalia("LAMPO — GIOVEDÌ, 18:42")
    "Giovedì."
    "Ho pulito il bancone due volte. Ho messo la radio al centro, poi un po' a sinistra, poi di nuovo al centro."
    call via_didascalia
    show rino normale at dx with dissolve
    r normale "Principessa, non sta arrivando il Papa."
    i imbarazzato "Lo so."
    r normale "E allora smettila di spostare quel coso. Mi fai venire il mal di mare."
    hide rino with dissolve
    show dado ride at dx, entra_dx with dissolve
    d ride "Ma hai messo il profumo?"
    i imbarazzato "È il sapone del bagno della galleria."
    d comico "Sai di ospedale al limone. Romanticissimo."
    i sarcastico "Non è un appuntamento, Dado. È una consegna."
    d ride "Certo. E io sono un influencer."
    "Si mette dietro lo scaffale delle cover con il telefono in mano. Lo guardo. Lo rimette in tasca. Per stavolta."
    hide dado with dissolve
    "Alle sette meno dieci il neon sopra la porta fa il suo solito tic. LAMP_, con la O che manca. Come in {i}oddio{/i}."

    stop ambiente fadeout 1.0
    play sound s_campanella
    stop music fadeout 1.5
    pause 0.8
    play music m_valya fadein 2.0
    show valya seria at dx, entra_dx with dissolve
    "Entra con il fazzoletto a fiori, lo sciallone, la borsa a quadri. Lo sguardo è sempre quello: un'ispezione ministeriale."
    show ionut imbarazzato at sx with dissolve
    v seria "Buonasera, Ivan."
    i imbarazzato "Buonasera, signora. Prego. Si accomodi. Cioè, si accomodi in piedi, perché non abbiamo... c'è lo sgabello. Ma lo sgabello punge."
    v seria "Punge?"
    i comico "Ha una vite. È una vite con una personalità."
    "Si siede lo stesso. Con lei, la vite non si permette."

    i sincero "Posso offrirle qualcosa? Prima di... prima della radio."
    v seria "Se insiste."

    menu:
        "Le porto il tè di Giulia.":
            $ scelta_bevanda = "te"
            i sincero "Due minuti. C'è una ragazza qui accanto che fa il tè come si deve."
            scene bg tisaneria with dissolve
            show giulia normale at dx with dissolve
            "Corro alla Luna Nuova. Giulia mi ascolta, guarda dalla vetrina il fazzoletto a fiori, e non fa domande."
            g seria "Russa?"
            i sincero "Di Murmansk, credo."
            g normale "Allora tè nero, scorza d'arancia e un cucchiaio di confettura di lamponi dentro. L'ho letto da qualche parte, al Nord fanno così."
            g sorride "Lo chiamo Tè del Grande Nord. L'ho appena inventato. Due euro."
            hide giulia with dissolve
            scene bg negozio_sera with dissolve
            show ionut sincero at sx
            show valya seria at dx
            with dissolve
            play sound s_tazza
            "Valya beve un sorso. Le sopracciglia si fermano a metà del loro giudizio."
            v nostalgica "...Con la marmellata. Come a casa. Chi gliel'ha detto?"
            i sincero "La ragazza del tè."
            v sorridente "Brava ragazza. Si tenga stretta quella ragazza, Ivan."
            i imbarazzato "Non è... noi non... è la vicina."
        "Le prendo un caffè alla macchinetta.":
            $ scelta_bevanda = "caffe"
            i comico "Torno subito. C'è una macchinetta in fondo alla galleria. È famosa."
            "È famosa perché nessuno ha mai capito cosa esca dal tasto CAFFÈ LUNGO. Sessanta centesimi. Una lotteria."
            play sound s_tazza
            show ionut comico at sx
            show valya seria at dx
            with dissolve
            "Valya annusa il bicchierino di plastica come se fosse una prova da tribunale."
            v seria "Bozhe moy. Questo caffè ha fatto la guerra."
            i comico "Quale guerra?"
            v seria "Tutte."
            "Lo beve lo stesso. Tutto, fino in fondo, senza fare una smorfia. Poi posa il bicchiere con dignità."
            v sorridente "Spasibo, Ivan. Era terribile. Lo berrei di nuovo."

    v seria "Allora. La mia radio."
    i sincero "Ho cambiato i condensatori, un transistor e la funicella della scala. Ho pulito il commutatore. E il vano batterie..."
    "Lei mi guarda. Non sbatte le palpebre."
    i sincero "Non l'ho aperto. C'era scritto di no. Le ho messo le batterie da fuori, qui dietro."
    "Un silenzio lungo. Il neon fa tic."
    "Valya prende la radio e la gira tra le mani. Passa il pollice sullo scotch giallo, lentamente, come si controlla che un bambino abbia ancora la febbre."
    "Poi guarda il portabatterie nuovo, nero, avvitato sul retro. È brutto. Lo sappiamo tutti e due."
    v seria "È brutto."
    i imbarazzato "È educato."
    v commossa "Ha mantenuto una promessa che io non le ho chiesto."
    v seria "...Nu, ladno. Accenda."

    "Giro la manopola del volume. C'è uno scatto, piccolo e preciso, come una chiave in una serratura buona."
    stop music fadeout 1.0
    play sound s_radio_sintonia
    window hide
    scene cg radio_accesa with lento
    play ambiente s_statica fadein 2.0
    pause 2.0
    window show
    "Fruscio."
    "Nessuna stazione. Nessuna voce. Solo quel suono largo e bianco, come il mare sentito da molto lontano."
    "Giro la manopola della sintonia. La lancetta corre sulla scala parlante, passa Roma, passa Praga. Il fruscio cambia colore, ma resta fruscio."
    i imbarazzato "Aspetti, forse è l'antenna, qui dentro il centro c'è troppo cemento, se la porto fuori—"
    "Una mano si posa sulla mia. Piccola, fredda, con la pelle sottile come la carta delle caramelle."
    v seria "Lasci."
    "Valya ha chiuso gli occhi. Ascolta il niente con la faccia di chi ascolta una canzone."
    v nostalgica "Non è rotta."
    v nostalgica "{b}Sta ascoltando.{/b}"
    pause 1.5
    "Non so cosa rispondere. Allora sto zitto anch'io, e ascoltiamo in due."
    "È la prima volta in vita mia che il silenzio non mi mette fretta."

    ## ------------------------------------------------------------------
    ## 3. MURMANSK — il ricordo
    ## ------------------------------------------------------------------
    v nostalgica "Lei lo sa, Ivan, cos'è la notte polare?"
    i sincero "Quando non viene mai giorno."
    v nostalgica "Quaranta giorni. Il sole non sale. Il cielo diventa blu, poi più blu, poi nero. E a mezzogiorno accendi la lampada per leggere la lettera."

    stop ambiente fadeout 2.0
    window hide
    scene bg murmansk with lentissimo
    show layer master at ricordo
    play music m_ricordo fadein 3.0
    play ambiente s_vento fadein 2.0
    pause 1.5
    window show
    call didascalia("MURMANSK — 1966")
    v nostalgica "Io avevo ventiquattro anni. Lavoravo al centralino del porto. Turno di notte, che lassù vuol dire tutti i turni."
    show valya giovane at centro with dissolve
    call via_didascalia
    v "Murmansk è l'ultima città del mondo, Ivan. Dopo, c'è solo il mare, e il mare lassù non gela mai, perché arriva una corrente calda da lontano."
    v "Una corrente calda che parte da voi, dal Messico, dall'America. Fa tutta quella strada per tenere aperto il nostro porto. Gentile, no?"
    v "D'estate il sole non tramonta, e la gente non dorme e diventa un po' matta. D'inverno il sole non sorge, e la gente dorme poco lo stesso."
    "Nella sua voce c'è un'altra ragazza. Ha le guance rosse di freddo e una treccia che le esce dal colbacco. Non sorride. Ma sta per farlo."
    v "C'era una stufa, e c'era il pannello. Cento buchi, cento spine. Le navi chiamavano, il porto rispondeva, e in mezzo c'ero io."
    vg "Centralino del porto. Parli pure."
    v "Le dita, d'inverno, diventavano di legno. Le spine erano di ottone, e l'ottone a meno trenta morde."
    v "Allora le scaldavo sotto le ascelle. Tutte le ragazze facevamo così. Sembravamo galline."
    v "La caposala si chiamava Zinaida Fëdorovna. Diceva: «Ragazze, una telefonista non ha freddo. Ha un dovere.» E poi si metteva il cappotto sopra il cappotto."
    v "Io ero brava. Riconoscevo le navi dalla voce del marconista. Questa è la Kola, questa è la Sibir. Una voce, una nave."

    if scelta_bevanda == "te":
        v "E bevevamo il tè con la marmellata dentro, bollente, da bicchieri che bruciavano. Come questo, Ivan. Proprio come questo."
    else:
        v "E bevevamo un caffè che era peggio del suo, Ivan. Molto peggio. E lo bevevamo lo stesso, perché era caldo."

    scene bg murmansk_porto with dissolve
    show layer master at ricordo
    show neve
    play ambiente s_vento fadein 1.0
    "Il porto, nella sua voce, è nero e arancione. Le gru, i lampioni, il ghiaccio sull'acqua che scricchiola come un pavimento vecchio."
    v nostalgica "E la neve. Voi qui non lo sapete, com'è la neve."
    v nostalgica "Lassù il vento viene dal mare e non si ferma mai. Allora la neve non può scendere giù tranquilla, come nei vostri presepi."
    v nostalgica "A Murmansk la neve non cade dal cielo: cade di lato, come se anche lei stesse cercando qualcuno."
    pause 1.0
    "Lo dice piano, come una cosa imparata a memoria tanto tempo fa."
    "Me la immagino. Una neve che passa davanti alle finestre senza toccare terra, che attraversa la città in orizzontale, con fretta, bussando a tutti i vetri."

    window hide
    scene cg murmansk_valya with lento
    show layer master at ricordo
    pause 2.0
    window show
    v nostalgica "Di notte, quando le navi dormivano, al centralino arrivava anche la radio costiera. Voci dalle navi lontane. Numeri, meteo, ghiaccio."
    v nostalgica "E una notte c'era un uomo che parlava con le onde."
    i sincero "Con le onde?"
    v sorridente "Con le onde, sì. Non con me. Non ancora. Diceva la posizione della nave, la temperatura, il vento. E poi, alla fine, diceva una cosa in più."
    v nostalgica "Una cosa che non serviva a niente. Che non era nel regolamento."
    i sincero "Cosa diceva?"
    "Valya apre la bocca. Poi la chiude. Nel ricordo, la ragazza con la treccia si porta le cuffie alle orecchie con tutte e due le mani."
    v triste "...Questo un'altra volta, Ivan."
    stop ambiente fadeout 2.0
    stop music fadeout 3.0
    pause 1.0

    ## ------------------------------------------------------------------
    ## 4. "IONUȚ È IVAN"
    ## ------------------------------------------------------------------
    scene bg negozio_sera with lento
    show layer master at normale
    play ambiente s_statica fadein 1.0
    show item radio with dissolve
    "Quando torno nella Lampo, la radio è ancora accesa sul bancone e fruscia per conto suo."
    "Valya la spegne. Lo scatto, piccolo e preciso. Il silenzio che resta è diverso da quello di prima."
    stop ambiente fadeout 0.5
    hide item with dissolve
    play music m_valya fadein 2.0
    show ionut sincero at sx
    show valya seria at dx
    with dissolve
    v seria "Le sue mani sono ancora buone, Ivan. La faccia invece è sempre da sciocco."
    i comico "Grazie. Ci lavoro tutti i giorni, alla faccia."
    v seria "Mi dica una cosa. Lei è fidanzato, Ivan?"
    show ionut imbarazzato at sx, saltello
    i imbarazzato "Io? No. Cioè. No. Ho avuto... c'era una ragazza in quarta, ma era più una questione di banco. Di posizione del banco. Eravamo vicini e—"
    i imbarazzato "No."
    "Sto parlando troppo. Quando sono nervoso parlo troppo. È un difetto di fabbrica, non ha ricambi."
    v seria "Strano. Un ragazzo con le mani così."
    i imbarazzato "E comunque, signora, non per correggerla, eh. Ma io non mi chiamo Ivan."
    v seria "Lo so."
    i comico "Lo... sa?"
    v seria "Si chiama Ionuț. L'ho sentito dire alla ragazza del tè, quando sono passata davanti."
    v sorridente "Ionuț è Ivan, non faccia il difficile."
    pause 0.5
    "Poi ride."
    "Non tanto. Un secondo solo, con la mano davanti alla bocca. Ma per quel secondo ha vent'anni, e io capisco perché nel ricordo c'era una treccia."
    i sincero "...Va bene. Ivan."
    v seria "Bravo. Ty durak."
    i ironico "Questa so cosa vuol dire. Me l'ha detto Google."
    v sorridente "Google non sa niente. Vuol dire una cosa più gentile di quello che dice Google."

    "Mette la mano nella borsa e posa una caramella sul bancone. Carta azzurra, un orso bianco su un lastrone di ghiaccio. Mishka na Severe."
    "L'orso al nord. Come la settimana scorsa."
    v seria "Per il lavoro. Il conto lo faccia a parte, la caramella non è un pagamento."
    i sincero "Allora cos'è?"
    v seria "È una caramella, Ivan."
    v seria "Ionuț da dove viene? Non da qui. Lei dice le erre come una persona che le ha imparate da grande."
    i sincero "Iași. In Romania. Sono qui da quando avevo sette anni."
    v nostalgica "Iași. Fa freddo, a Iași?"
    i sincero "D'inverno sì. Mi ricordo poco. Mi ricordo il cortile di mia nonna con la neve, e un cane che si chiamava Lupu e non era un lupo."
    i malinconico "Qui la neve non la fa quasi mai. Io ormai non so più com'è. So com'è nei film."
    v seria "Allora lei è come me. Uno che viene da un posto freddo e vive in un posto tiepido."
    v nostalgica "Non è male, il tiepido. Ma la notte ci si ricorda."
    "Lo dice guardando la radio spenta, non me. Poi si alza, e si sistema il fazzoletto con due gesti precisi."
    v seria "Per Capodanno deve funzionare. Questo non è cambiato."
    i sincero "Funziona già."
    v seria "Funziona {i}adesso{/i}. Lei me la tiene ancora un po'. Controlli che non si stanchi."
    i ironico "Va bene. La faccio stare a riposo. Niente sforzi, niente onde lunghe."
    v sorridente "Ty durak."

    ## ------------------------------------------------------------------
    ## 5. LA CHIUSURA E IL BUS
    ## ------------------------------------------------------------------
    scene bg saracinesca_notte with fade
    play music m_notte fadein 2.0
    show rino sera at centro with dissolve
    play sound s_saracinesca
    "Alle otto Rino abbassa la saracinesca. La saracinesca scende, scende, e si ferma a quaranta centimetri da terra. Come sempre."
    play sound s_saracinesca_blocco
    r sera "{i}Azzurro... il pomeriggio è troppo azzurro...{/i}"
    play sound s_saracinesca_blocco
    show rino arrabbiato at centro, trema with hpunch
    "Il calcio di Ruggeri. In basso a destra, preciso. Non succede niente."
    r arrabbiato "Domani la sistemo."
    "Lo dice da giugno. Valya guarda la saracinesca a lungo, con le labbra strette."
    v seria "Bozhe moy."
    "Non aggiunge altro. Ma la saracinesca, giuro, si sente giudicata."
    hide rino with dissolve

    scene bg parcheggio_notte with dissolve
    play ambiente s_vento fadein 1.0
    show valya sera at dx with dissolve
    show ionut sincero at sx with dissolve
    i sincero "La accompagno al bus. Le porto la borsa."
    v sera "Non serve."
    i ironico "Lo so che non serve. È per fare esercizio. Ho le braccia da perito elettronico, guardi."
    "Me la dà. Pesa come se dentro ci fosse un motore."
    i comico "Signora, ma cosa c'è qui dentro? Un mattone?"
    v sera "Pane nero."
    i comico "...Pesa come un mattone."
    v sorridente "Il pane nero deve pesare. Se è leggero, è una bugia."

    "Attraversiamo il parcheggio piano. Lei a passi corti, io a passi corti per non superarla."
    "I lampioni fanno coni gialli nella nebbia. Ogni cono è una stanza, e noi attraversiamo le stanze una alla volta."

    scene bg fermata_pioggia with dissolve
    show pioggia
    stop ambiente fadeout 0.5
    play ambiente s_pioggia fadein 1.0
    show ionut sincero at sx
    show valya sera at dx
    with dissolve
    "Alla fermata comincia a piovere. Una pioggia piatta, emiliana, che non ha nessuna fretta di cercare qualcuno."
    v sera "Qui la pioggia cade dritta. È una pioggia senza fantasia."
    i sincero "Com'è la neve che cade di lato? Cioè, di persona."
    v nostalgica "Di persona ti entra nel collo. Bellissima, e ti entra nel collo. Come tutte le cose belle di lassù."

    if scelta_bevanda == "te":
        v sorridente "Dica alla ragazza del tè che la marmellata era giusta. Non troppa. Di solito gli italiani esagerano."
    else:
        v sorridente "E domani butti via quella macchinetta, Ivan. Per il bene del popolo."

    i sincero "Signora Valentina. Posso chiederle una cosa?"
    v sera "Può chiedere. Io posso non rispondere. È la democrazia."
    i sincero "Perché proprio per Capodanno?"
    "Lei guarda la strada, dove dovrebbe arrivare il bus. I fari delle macchine scivolano sull'asfalto bagnato."
    v triste "Perché il prossimo, forse, non lo riconosco."
    i vulnerabile "In che senso?"
    v seria "Nel senso che sono vecchia, Ivan. I vecchi dicono queste cose per far stare zitti i giovani. Funziona?"
    i malinconico "...Funziona."
    v sorridente "Brava la vecchia."
    play sound s_bus
    "Il bus arriva con il suo sospiro di freni. Le porte si aprono. Le restituisco la borsa."
    "Lei sale il primo gradino, poi si gira. È più alta di me, adesso, per un attimo."
    "Allunga la mano e mi dà un buffetto sulla guancia. Due colpetti leggeri, con le dita fredde."
    "Attraverso la maschera che non sa che porto. O forse lo sa benissimo."
    v sorridente "Buonanotte, Ivan."
    i vulnerabile "...Buonanotte."
    hide valya with dissolve
    "Le porte si chiudono. Il bus si porta via il fazzoletto a fiori e il pane nero."
    "Rimango sotto la pensilina, con la guancia che scotta in un punto preciso, grande come due dita."
    hide ionut with dissolve
    hide pioggia
    stop ambiente fadeout 2.0

    ## ------------------------------------------------------------------
    ## 6. LA NOTTE IN CAMERETTA
    ## ------------------------------------------------------------------
    scene bg cameretta with buio
    show layer master at notte_blu
    play music m_notte fadein 2.0
    call didascalia("CASA — 01:12")
    "Non dormo."
    "Il soffitto della mia camera ha una crepa a forma di Italia, se la guardi con generosità. Stanotte sembra più la Norvegia."
    call via_didascalia
    "La mamma è dal signor Ferretti, come tutte le notti. La casa è così silenziosa che sento il frigorifero pensare."

    play sound s_vibrazione
    "Il telefono vibra sul comodino."
    call sms("MAMMA", "Il sig. Ferretti dorme finalmente 🙏 Hai mangiato?? C'è la minestra in frigo 🎃")
    call sms("MAMMA", "Ti voglio bene puiule. Dormi 🦷")
    i ironico "Il dente. Mi vuole bene con un dente."
    "Non le ho mai detto che le sue emoji sono sbagliate. Mi piacciono così. Sono le emoji di una persona che scrive al buio, tra una medicina e l'altra."
    "Le rispondo: “Mangiato. Dormo. Anch'io.” Due bugie e una verità. Lei sa benissimo qual è la verità."

    "Penso alla domanda di Giulia. {i}Chi è la signora?{/i}"
    "So quanti anni ha la sua radio, di che anno sono i transistor, dove si è spezzata la funicella. Di lei so una città, un centralino e un uomo senza nome."
    "E un segno a matita poco prima del 7.1, premuto forte. Quello non me l'ha spiegato. Non gliel'ho chiesto."
    "Ci sono domande che si fanno con il cacciavite. Altre bisogna aspettare che te le risponda qualcuno, e non sai nemmeno se succederà."
    "Sul comodino c'è il barattolo dei bulloni. Stasera l'ho svuotato e ci ho messo dentro due caramelle Mishka."
    "Da stasera è il barattolo delle caramelle. Due orsi al nord, in un barattolo che sa ancora di ferro."
    "Chiudo gli occhi. Sento il fruscio. Non c'è nessuna radio accesa, ma lo sento lo stesso, largo e bianco, come il mare da lontano."
    "E dentro il fruscio c'è lei. La mano fredda sulla mia. “Lasci.” La risata di un secondo. Le dita sulla guancia."
    "La ragazza con la treccia, che sta per sorridere."
    pause 1.0
    stop music fadeout 3.0
    "E poi arriva un pensiero."
    "Arriva di lato, come la neve. Senza bussare."
    play sound s_battito
    show ionut cupo at centro with dissolve
    "Mi tiro su di scatto. Il cuore mi batte forte come quando la tiara si è impigliata nel sipario."
    i cupo "No."
    i cupo "No no no."
    show ionut sclero at centro, trema with vpunch
    i sclero "Ionuț. Calmo. Ragiona da perito. Analisi del guasto."
    i sclero "Ho diciannove anni. Lei ne ha..."
    "...tanti."
    show ionut vulnerabile at centro with dissolve
    i vulnerabile "Non è quello."
    i vulnerabile "Non può essere quello."
    pause 1.0
    "È che sono solo, e lei è sola, e una radio ha fatto rumore. Tutto qui. È un problema di segnale, non di cuore."
    "Lo dico al soffitto. Il soffitto non ci crede. Neanche la Norvegia."
    hide ionut with dissolve
    "Spengo la luce."
    "Nel buio, da qualche parte, qualcosa sta ascoltando."
    show layer master at normale
    scene bg nero with lentissimo
    pause 1.0
    return
