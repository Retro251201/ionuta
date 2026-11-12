label cap7:
    call titolo_capitolo("7", "VHS", "Valdorsa — dicembre")

    # ------------------------------------------------------------------
    # 1. NEGOZIO — la cassetta del matrimonio
    # ------------------------------------------------------------------
    scene bg galleria_natale with dissolve
    play music m_galleria fadein 1.0
    call didascalia("IL GIRASOLE — 19 DICEMBRE, 17:10")
    "Mancano sei giorni a Natale. Al Girasole lo sanno solo le luci: metà sono accese, l'altra metà fa finta di riposare."
    call via_didascalia
    "Da quando Valya mi ha chiamato Lyova, è passata una settimana. Io conto i giorni. Lei, credo, conta le parole che le restano."

    scene bg negozio_sera with dissolve
    play music m_negozio fadein 1.0

    play sound s_campanella
    stop music fadeout 1.0
    "La campanella. Piano, come se chiedesse il permesso."
    play music m_valya fadein 2.0
    hide rino with dissolve
    show ionut sincero at sx with dissolve
    show valya seria at dx with dissolve
    v "Buonasera, Printsessa. Buonasera, signor Ruggeri."
    r "Buonasera, signora. La lascio al suo tecnico di fiducia."
    "Rino sparisce nel retro. È il suo modo di essere gentile: andarsene."
    v "Ho una cosa. Non so se è ancora viva."
    "Tira fuori dalla borsa a quadri una scatola di plastica nera. Sopra c'è un'etichetta scritta a penna, in corsivo, con una calligrafia da maestra."
    show item vhs with dissolve
    "Una videocassetta. VHS. {i}Matrimonio — 3 settembre 1994.{/i}"
    i ironico "Una VHS. Signora Valya, questa è archeologia."
    v "Anche io sono archeologia, ty durak. Eppure cammino."
    v nostalgica "È il matrimonio. Con Aldo. Non la guardo da... da quando lui è andato via. Il videoregistratore di casa ha mangiato una cassetta di Celentano e poi è morto."
    i sincero "Di dolore, immagino."
    v sorridente "Di vergogna. Era una cassetta brutta."
    "Rido. Lei quasi. Le sopracciglia si alzano di mezzo millimetro, che per Valya è una risata."
    i sincero "In magazzino abbiamo ancora un videoregistratore. Rino non butta niente. Dice che le cose vecchie tornano di moda, come i baffi."
    v seria "Allora lo accendiamo. Voglio vedere se mi ricordo bene la sua faccia."
    "Lo dice senza tristezza. Come si dice: voglio vedere se ho chiuso il gas."
    hide item with dissolve

    scene bg magazzino with dissolve
    play ambiente s_neon fadein 1.0
    "Il videoregistratore è sotto una coperta, come un canarino che dorme. È un Panasonic grigio, col display verde che dice 0:00 da circa il 2006."
    show ionut sincero at sx with dissolve
    show valya seria at dx with dissolve
    "Lo collego a un televisore da quattordici pollici. Soffio sulle testine. Pulisco con un cotton fioc e l'alcol, piano."
    play sound s_cassetta
    "Infilo la cassetta. Il videoregistratore la prende con un rumore di denti, ci pensa, la tira dentro."
    play sound s_nastro
    "Il nastro gira. Righe bianche. Poi neve. Poi, all'improvviso, una chiesa."
    stop music fadeout 2.0
    stop ambiente fadeout 1.0

    scene cg vhs_matrimonio with lento
    play music m_ricordo fadein 2.0
    pause 1.0
    "La chiesa è piccola, con le pareti gialle. C'è il sole di settembre che entra storto dalle finestre."
    "In fondo alla navata c'è una donna di cinquantadue anni con un vestito color crema e un mazzo di fiori bianchi."
    "Sorride. Sorride {b}tanto{/b}. Non le ho mai visto quella faccia. Nessuno, credo, le ha visto quella faccia da trent'anni."
    "Accanto a lei c'è lui."
    "Aldo Bellini. Alto. Molto alto. Capelli tutti, folti, grigi solo ai lati, come uno che li ha scelti grigi apposta."
    "Ha una giacca blu e un garofano all'occhiello. Ride a una cosa che dice il prete. Si piega quando ride, come un albero buono col vento."
    "Poi si gira verso la telecamera e fa l'occhiolino. A chi riprende. A me. A trent'anni di distanza."
    voce "Aldo, sta' fermo che non viene!"
    "Valya, nel video, gli dà una gomitata. Lui le prende la mano. E non gliela lascia più, per tutta la cerimonia."

    scene bg magazzino with dissolve
    show ionut comico at sx with glitch_t
    play music m_comico fadein 0.5
    "Io guardo questo signore enorme, morto da dieci anni, che fa l'occhiolino."
    "E sento una cosa. Nello stomaco. Piccola, verde, ridicola."
    i comico "...Era alto, eh."
    show valya sorridente at dx with dissolve
    v "Un metro e ottantotto. Ai lampadari ci arrivava senza sedia."
    i comico "Bello. Bello che arrivava ai lampadari. Utile, anche."
    show ionut sclero at sx with vpunch
    i sclero "Faceva anche sport? Tipo il canottaggio? Ha salvato dei bambini da un incendio? Così, per sapere con chi competo."
    v seria "Con chi... cosa?"
    show ionut imbarazzato at sx
    i imbarazzato "Niente. Una parola che ho sentito in tv. Competo. Vuol dire... ammiro."
    v "Non vuol dire ammiro."
    i imbarazzato_flip "No. Non vuol dire ammiro."
    "Valya mi guarda da sotto il fazzoletto. Poi fa una cosa che non fa mai: ride. Con la bocca aperta. Come una ragazza."
    v sorridente "Bozhe moy. Sei geloso di Aldo."
    i comico "Assolutamente no. Io non sono geloso dei morti. È una regola. Ho tante regole."
    "Sullo schermo Aldo, giovane di trent'anni fa, prova a infilarle l'anello e sbaglia dito. Tutti ridono. Valya ride nel video e Valya ride qui, nello stesso momento."
    "Due risate uguali, a trent'anni di distanza. Non so perché, ma mi passa la gelosia. Resta solo una cosa calda, sotto le costole."

    stop music fadeout 2.0
    play music m_valya fadein 2.0
    show ionut sincero at sx with dissolve
    show valya nostalgica at dx
    v "Aldo faceva il ragù la domenica. Cominciava alle sette di mattina. Diceva che il ragù è come un matrimonio: se hai fretta, viene male."
    v "Aggiustava tutto. La lavatrice, le persiane, il rubinetto. Una volta il mio umore. Con un ombrello e una canzone di Modugno."
    v "Solo la radio non l'ha mai toccata. Mai. Sapeva che non era sua."
    "La radio. La Spidola che dorme nel laboratorio, a due metri da noi, col vano batterie sigillato."
    i sincero "Lo sapeva? Di... prima?"
    v seria "Aldo sapeva tutto. Non chiedeva niente. Sono gli uomini più rari, Printsessa. Quelli che sanno e non chiedono."
    "Si ferma. Si guarda le mani. Sono mani piccole, con le nocche grosse e un anello d'oro sottile, consumato."
    v nostalgica "Era un uomo buono."
    v "Ho avuto due amori, Printsessa. Uno nel cielo e uno nella cucina."
    v sorridente "Sono stata fortunata, sai?"
    "Io non dico niente. Nel cielo, penso. Uno che parlava con le onde. E uno che faceva il ragù e non chiedeva."
    i malinconico "Fortunata è una bella parola."
    v seria "È una parola che si dice dopo. Quando c'eri, sembrava solo fatica."
    play sound s_nastro
    "Il nastro finisce. Righe. Neve. Il videoregistratore sputa la cassetta con un clac soddisfatto, come uno che ha fatto il suo dovere."
    show item vhs with dissolve
    "Gliela porgo. Lei non la prende."
    v "Tienila tu. Per adesso."
    i sincero "Perché?"
    v "Perché io la so a memoria. Per adesso."
    "Il secondo {i}per adesso{/i} è più piano del primo. Lo sento lo stesso."
    hide item with dissolve

    # ------------------------------------------------------------------
    # 2. RETROBOTTEGA — le scuse di Dado
    # ------------------------------------------------------------------
    scene bg laboratorio with fade
    play music m_triste fadein 2.0
    call didascalia("RIPARAZIONI LAMPO — 19:40")
    "Valya è andata via con l'autobus delle sette e venti. Le ho portato la borsa fino alla fermata. Mi ha detto che cammino come un airone."
    call via_didascalia
    "Nel laboratorio c'è Dado. È seduto sul mio sgabello, quello con la vite che punge. Non si lamenta. Questo è già un segnale."
    show ionut freddo at sx with dissolve
    show dado serio at dx with dissolve
    i freddo "Il mio sgabello."
    d "Sì. Scusa. Mi alzo."
    "Non si alza. Resta lì. Si gratta la nuca."
    d "Ionuț."
    "Dado non mi chiama mai Ionuț. Mi chiama Principessa, Princi, Sua Altezza, Biancaneve, Vostra Maestà del Saldatore. Mai Ionuț."
    d "Ho tolto il video. Ieri sera. Tutto. Anche dagli altri account che l'avevano ricaricato, ho scritto a tutti. Alcuni l'hanno tolto. Altri no."
    i freddo "Okay."
    d "Non è okay. Lo so che non è okay."
    "Aspetto la battuta. Dado ha sempre una battuta dopo una frase seria, come un cane che si scrolla dopo il bagno."
    "Non arriva."
    d "Ti devo chiedere scusa. Sul serio. Non tipo «dai, scusa, bro». Sul serio."
    d "Ho visto voi due che ridevate al food court, e ho pensato: questa è una storia. Ha tutto. La gente piangerà. E ho premuto il tasto."
    d "Non ho pensato che era {b}vostra{/b}. Che non era mia."
    show ionut sincero at sx
    "Mi siedo sul bancone. Lui sul mio sgabello. Per un po' sentiamo solo il neon che ronza."
    d "Io vivo con mia nonna. Lo sai, no?"
    i sincero "Lo so. Dici sempre che è per lo stipendio."
    d "È per lo stipendio. Ed è anche che... boh. Mia nonna si chiama Ines. Ha ottantasette anni. Mi ha cresciuto lei, quando i miei hanno deciso di odiarsi a tempo pieno."
    d "Guarda tutti i miei video. Tutti. È una dei miei trecentododici follower. Commenta sempre la stessa cosa: «bravo amore della nonna». Con tre cuori. Sempre tre."
    d "Sotto quello di voi due non ha commentato. Ho pensato che non l'avesse visto."
    d "Poi a cena, mentre tagliava la carne, ha detto: «Davide, quella signora non ti ha dato il permesso. E se fossi io?»"
    "Dado si guarda le scarpe. Sono scarpe bianche, enormi, con le luci dentro. Adesso sono spente."
    d "E se fosse lei. Una che si dimentica le cose. Ridotta a dei commenti di gente che non la conosce. «Che tenera la nonnina.» «Che schifo il ragazzo.»"
    "Lo guardo. Dado ha ventitré anni e sembra averne dodici. Ha gli occhi rossi, ma non per il telefono."
    i sincero "Perché me lo dici solo adesso?"
    d "Perché prima facevo il buffone. È più facile. Lo sai anche tu, che è più facile."
    "Lo so. Lo so benissimo. Ho una maschera di V per Vendetta sul cappello proprio per quello."
    "Silenzio. Poi gli tendo la mano. Lui la guarda come se fosse un componente che non sa dove montare."
    i sincero "Scuse accettate. Ma la prossima volta che vuoi fare un video su di me, fammi vedere prima la miniatura."
    d "Niente prossima volta. Giuro."
    "Mi stringe la mano. Ha la mano sudata e la stretta forte. Dado è così: sbagliato in tutto, tranne nella stretta."
    d "Ionuț. Lei come sta? Davvero?"
    "Ci penso. Penso al per adesso. Al Lyova. Al fazzoletto grigio."
    i malinconico "Non lo so. Davvero."
    "Lui annuisce. Prende il telefono, lo guarda, lo rimette a faccia in giù."
    d "Salutami tua mamma."
    "Esce. Senza una battuta. È la prima volta in tre anni. Mi fa più paura di qualunque battuta."
    hide dado with dissolve

    # ------------------------------------------------------------------
    # 3. CUCINA — la telefonata con la mamma
    # ------------------------------------------------------------------
    scene bg cucina_ionut with fade
    play music m_notte fadein 2.0
    play ambiente s_orologio fadein 1.0
    call didascalia("CASA — 22:50")
    "Casa nostra è un bilocale al terzo piano di via Gramsci. Cucina, camera mia, camera della mamma. Il bagno lo contiamo come mezza stanza."
    "La mamma la notte non c'è. Fa la badante notturna dal signor Ferretti, novant'anni, via Mazzini 12. Torna alle otto di mattina, quando io esco."
    call via_didascalia
    "Mangio la pastasciutta fredda in piedi, davanti al frigo aperto, perché la luce del frigo fa compagnia."
    "Sul frigo c'è un magnete di Iași e uno di Rimini. Tra i due, la lista della spesa scritta in rumeno e in italiano mischiati. {i}Lapte. Pane. Detersivo per piatti. Să mănânci!{/i}"
    "L'ultima vuol dire: mangia. Non è una cosa da comprare. È un ordine."
    stop ambiente fadeout 1.0
    play sound s_telefono_squillo
    show item smartphone with dissolve
    "Il telefono vibra. MAMMA. Con un cuore giallo e una pentola, perché quando ha salvato il contatto non trovava l'emoji giusta."
    hide item with dissolve
    i ironico "Pronto, mamma."
    mamma "Puiule. Hai mangiato?"
    i ironico "Sto mangiando. In diretta. Senti?"
    "Faccio rumore con la forchetta sul piatto. Lei ride. Ha la voce bassa, di quando non deve svegliare nessuno."
    mamma "Il signor Ferretti dorme. Stanotte è agitato. Ha chiamato Lina tre volte."
    i sincero "Chi è Lina?"
    mamma "La moglie. È morta nel novantotto. Io ho detto: Lina è andata a prendere il pane. Lui si è calmato."
    "Mi fermo con la forchetta a mezz'aria."
    i malinconico "Gli hai detto una bugia."
    mamma "Gli ho detto una cosa che lo fa dormire. Alla sua età, è la stessa cosa."
    mamma "E tu? Ti sento strano. Da giorni ti sento strano. Il lavoro?"
    "Potrei dire: tutto bene. L'ho detto per dodici anni. È la mia frase migliore, insieme al cacciavite."
    "Oppure potrei..."

    menu:
        "Dirle la verità.":
            $ scelta_mamma = "verita"
            show ionut vulnerabile at centro with dissolve
            i vulnerabile "Mamma... c'è una signora. Viene in negozio. Le riparo le cose."
            i vulnerabile "Ha ottantaquattro anni. È russa. Si sta dimenticando di tutto. E io le voglio bene in un modo che non so spiegare. E ho paura."
            "L'ho detto. Al telefono, davanti al frigo aperto, con la pasta fredda nel piatto. Dodici anni di «tutto bene», buttati via in due frasi."
            mamma "...Puiule."
            mamma "Lo so."
            i vulnerabile "Come, lo sai?"
            mamma "Ti ho visto. Nel video del tuo amico scemo. Ti ho visto come la guardavi. Io quella faccia la conosco."
            mamma "È la faccia che facevi da piccolo quando nonna Floarea ti raccontava le storie. Come se avessi paura che finissero."
        "Fare una battuta.":
            $ scelta_mamma = "battuta"
            show ionut comico at centro with dissolve
            i comico "Il lavoro va benissimo. Mi sono fidanzato con una radio sovietica. Ci sposiamo a giugno. Tu porti le sarmale."
            "Rido da solo. Il frigo ronza. La mamma non ride."
            mamma "Ionuț."
            mamma "Quando fai le battute, ti sento la voce di quando avevi sette anni. Il primo giorno di scuola qui. Facevi ridere tutta la classe per non piangere."
            show ionut vulnerabile at centro with dissolve
            i vulnerabile "...Non è vero."
            mamma "Ho visto il video del tuo amico scemo. La signora russa. Ti ho visto come la guardavi."
            "Il frigo smette di ronzare. Lo fa ogni tanto, da solo, come se ascoltasse."
            i vulnerabile "Le voglio bene, mamma. Si sta dimenticando di tutto. E io ho paura."

    show ionut malinconico at centro
    mamma "Hai paura perché le vuoi bene. Si chiama così, la paura buona. Io ce l'ho tutte le notti."
    i malinconico "Per il signor Ferretti?"
    mamma "Anche. E per la signora Cattani, prima. E per il signor Boni, prima ancora. Te lo ricordi il signor Boni? Ti insegnava a giocare a briscola."
    "Me lo ricordo. Avevo nove anni. La mamma mi portava con sé quando non sapeva a chi lasciarmi. Io facevo i compiti sul tavolo della cucina di Boni."
    "Lui barava a briscola e mi faceva vincere. Poi un giorno non c'era più, e la mamma ha cominciato a lavorare per un'altra famiglia, in un'altra cucina."
    "E io facevo i compiti su un altro tavolo. Accanto a un altro vecchio che non era mio nonno."
    stop music fadeout 3.0
    "Ed è lì, con la forchetta in mano, che capisco una cosa che forse sapevano tutti tranne me."
    play music m_triste2 fadein 3.0
    "Io sono cresciuto nelle cucine degli altri. Tra gente che se ne andava. Mia madre teneva la mano ai vecchi degli altri, e io stavo nell'altra stanza, ad aspettare che finisse."
    "Valya non è un caso. Valya è la casa dove finalmente qualcuno guarda {b}me{/b}, invece di essere guardato."
    "Il mio amore è anche la mia solitudine. Hanno la stessa faccia. Indossano lo stesso fazzoletto."
    i malinconico "Mamma... tu non sei mai stanca?"
    mamma "Sempre. Ma il signor Ferretti stanotte ha detto grazie. Non sa a chi. Io l'ho preso lo stesso."
    if scelta_mamma == "verita":
        mamma "Grazie che me l'hai detto, puiule. Sono anni che non mi dici niente di vero. Mi mancava la tua voce vera."
        i sincero "Anche a me, mamma. Mi mancava la mia."
    else:
        mamma "La prossima volta fammi pure la battuta. Ma poi dimmi la cosa vera. Io aspetto, sono brava ad aspettare."
        i sincero "Va bene. Prima la battuta, poi la cosa vera. Come il ragù."
        mamma "Cosa c'entra il ragù?"
        i sincero "Niente. Me l'ha detto una signora."
    mamma "Adesso vai a dormire. Domattina ti lascio il caffè. E mangia qualcosa di caldo, la pasta fredda è da disperati."
    i ironico "Come sai che è fredda?"
    mamma "Sono tua madre. Io vedo tutto."
    "Lo dice come Mario. Le persone che fanno la notte dicono tutte la stessa frase."
    mamma "Te iubesc, puiule."
    i sincero "Anch'io. Saluta Lina, se torna dal pane."
    "Lei ride. Chiude. Io resto con il telefono in mano e la luce del frigo addosso, come un santo di un presepe sbagliato."

    # ------------------------------------------------------------------
    # 4. LA PRIMA NEVE — la telefonata di Mario
    # ------------------------------------------------------------------
    scene bg finestra_neve with lentissimo
    show neve
    play ambiente s_vento fadein 3.0
    play music m_neve fadein 3.0
    call didascalia("NOTTE — 01:58")
    "Non dormo. Il soffitto della mia camera ha una crepa a forma di Italia, senza la Sicilia. La guardo da un'ora."
    call via_didascalia
    "Poi mi accorgo che la luce è cambiata. È più bianca. Più morbida. Come se qualcuno avesse abbassato il volume del mondo."
    "Mi alzo. Vado alla finestra."
    "Nevica."
    "La prima neve dell'anno. Anzi, la mia prima neve vera: a Iași nevicava, ma ero troppo piccolo; qui, in dodici anni, solo pioggia e nebbia e quella cosa grigia che Rino chiama «la merenda del diavolo»."
    "Penso a Valya. A Murmansk la neve cade di lato, mi ha detto. Due volte, con le stesse parole. Qui cade dritta. Forse è più educata."
    play sound s_vento
    "Il vento fa vibrare il vetro. Io ci appoggio la fronte. È freddo come una moneta."

    play sound s_telefono_squillo
    stop music fadeout 1.0
    "Il telefono. Alle due di notte."
    show item smartphone with dissolve
    "Sullo schermo: MARIO GUARDIA. Con un'emoji del poliziotto che ci ha messo lui, per la discrezione."
    hide item with dissolve
    play music m_tensione fadein 1.0
    i cupo "Mario?"
    m "Guagliò. Scusa l'ora. Stai sveglio?"
    i cupo "Adesso sì."
    m "Senti a me. C'è una signora nel parcheggio. Da sola. Col fazzoletto in testa e la borsa della spesa a quadri."
    "Il mondo, che era già silenzioso, si ferma del tutto."
    m "La vedo dalle telecamere. Cammina avanti e indietro vicino alla rotonda dei carrelli. Da venti minuti. Nella neve."
    i furioso "È lei. È Valya."
    m "Lo so che è lei. Io vedo tutto. Sono sceso, ma quando mi ha visto con la divisa si è spaventata. Si è messa a urlare in russo. È scappata dietro i cassonetti."
    m "Non voglio chiamare i carabinieri, che la spaventano peggio. Chiedeva di qualcuno. Un nome. Non ho capito bene."
    "Lo so già, il nome. Lo so prima che lui lo dica."
    m "Ljova. Lev. Una cosa così."
    i cupo "Arrivo. Tienila d'occhio. Non toccarla. Arrivo."
    m "Corri, guagliò. Fa meno quattro."

    # ------------------------------------------------------------------
    # 5. LA CORSA
    # ------------------------------------------------------------------
    scene bg strada_notte with flash
    show neve
    play ambiente s_vento fadein 0.5
    play music m_tensione2 fadein 0.5
    play sound s_passi
    "Scarpe da ginnastica senza calze. Il giubbotto sopra il pigiama. Il cappello. Le chiavi no, le chiavi le ho dimenticate. Pazienza."
    "Il Girasole è a due chilometri e trecento metri. Lo so perché li ho fatti a piedi ogni volta che perdevo il bus."
    play sound s_passi_neve
    "La neve scricchiola. È un rumore che non conoscevo: come mordere un biscotto con i piedi."
    show ionut sclero at centro, trema with vpunch
    i sclero "Perché sono uscito di casa? Cosa ci faceva di notte? Chi l'ha lasciata uscire? Ha la porta con tre serrature, ha le chiavi sul gancio a forma di gallo..."
    hide ionut with dissolve
    play sound s_passi_neve
    "Le gambe mi bruciano. I polmoni mi bruciano. Il cappello mi cade, torno indietro a prenderlo, perché senza cappello non sono io, e lei potrebbe non riconoscermi."
    "Poi penso che non mi riconoscerà comunque. E corro più forte."

    # ------------------------------------------------------------------
    # 6. IL PARCHEGGIO NELLA NEVE
    # ------------------------------------------------------------------
    scene bg parcheggio_neve with dissolve
    show neve
    play music m_neve fadein 2.0
    call didascalia("PARCHEGGIO DEL GIRASOLE — 02:21")
    "Il parcheggio è un lenzuolo. Le strisce bianche sono sparite sotto altre cose bianche. I lampioni fanno cerchi arancioni nella neve."
    call via_didascalia
    show mario notte at dx with dissolve
    "Mario è sotto la pensilina dei carrelli, col cappellino SECURITY pieno di neve e gli occhiali da sole. Anche adesso."
    m "Là. Dietro l'ultimo lampione. Io sto qua. Con me non vuole parlare."
    i cupo "Grazie, Mario."
    m serio "Vai piano, guagliò. È lei, ma non è tutta qui."
    hide mario with dissolve
    play sound s_passi_neve
    "Cammino. Piano. Le orme di lei sono piccole e storte e fanno dei cerchi. Avanti e indietro. Come qualcuno che aspetta un mezzo che non arriva."

    scene cg parcheggio_neve with lento
    show neve_lenta
    window hide
    pause 2.0
    window show
    "Valya è in piedi sotto l'ultimo lampione, nel cerchio arancione. Senza cappotto."
    "Ha la vestaglia di lana marrone, le pantofole di feltro, il fazzoletto a fiori legato male. La borsa della spesa a quadri, vuota, al braccio."
    "Guarda la strada. Ha la faccia di chi controlla un orario."
    "La neve le si posa sulle spalle, sul fazzoletto, sulle ciglia. Lei non la scuote via. A Murmansk la neve non si scuote. Ci si vive dentro."

    scene bg parcheggio_neve with dissolve
    show neve
    show ionut sincero at sx with dissolve
    show valya ombra at dx with dissolve
    i sincero "...Valya?"
    "Si gira. Mi guarda. Per un secondo vedo i suoi occhi che cercano, sfogliano, come le dita su una rubrica."
    show valya commossa at dx with dissolve
    v "Ah. Eccoti. Finalmente."
    v "Il tram è in ritardo. Il numero tre. Quello che va al porto. Sono qui da un'ora, ho le mani di ghiaccio."
    "Il tram. A Valdorsa non c'è mai stato un tram. Il binario più vicino è quello della stazione, e lì passano solo i regionali per Bologna, in ritardo."
    i vulnerabile "Valya, qui non c'è il tram."
    v seria "Come non c'è? C'è sempre stato. Davanti alla panetteria Karelija. Tu sei sempre stato uno che si perde, Lyova."
    stop music fadeout 2.0
    "Lyova."
    "Il nome arriva con la neve. Si posa addosso a me come se mi stesse aspettando."
    v sorridente "Hai il naso rosso. Sei venuto a piedi dalla nave? Ty durak. Ti prendi la febbre e poi chi parla con le onde?"
    "Ha la voce di una ragazza. Non di una vecchia che fa la ragazza. Proprio di una ragazza di ventiquattro anni, in un parcheggio, alle due di notte, che è felice di vedere il suo ragazzo."
    "Sta tremando. Le labbra sono viola."
    play music m_valya fadein 3.0
    "Mi tolgo il giubbotto. Sotto ho solo il pigiama con le renne che mi ha regalato la mamma. Il freddo mi entra nelle ossa come un'idea."
    "Glielo metto sulle spalle. Glielo chiudo davanti, piano, bottone per bottone. Lei mi lascia fare. Mi guarda le mani."
    v commossa "Mani buone."
    "Lo stesso che mi ha detto il primo giorno. Mani buone. Faccia da sciocco. Va bene."
    "Potrei dirlo. Potrei dirle: Valya, sono Ionuț. Il ragazzo della Lampo. La Principessa. Siamo a Valdorsa, Lev non c'è, il tram non c'è, Murmansk è lontana quattromila chilometri."
    "Potrei metterla all'ora giusta. Come si fa con gli orologi."
    "Ma lei mi ha detto di non farlo. Lo lasci alle 4:17. Deve solo battere."
    v "Lyova? Sei tu?"
    show ionut malinconico at sx
    "Non la correggo."
    show ionut sincero at sx with dissolve
    i sincero "Sì."
    i sincero "Sono qui."
    "Lei chiude gli occhi. Appoggia la testa sul mio petto. Pesa niente. Pesa quanto un uccellino e quanto cinquantotto anni."
    v sorridente "Lo sapevo che venivi. Me l'avevi promesso. Ogni anno, alla stessa ora."
    "Non so di cosa parla. Non ancora. Le metto una mano sulla schiena, sopra il giubbotto, e sento il suo cuore che batte veloce, come un orologio caricato troppo."
    i sincero "Andiamo al caldo, va bene? Il tram oggi non passa. C'è troppa neve."
    v "Troppa neve. A Murmansk non è mai troppa."
    "Ride. Piano. Poi le cedono le ginocchia, all'improvviso, come una marionetta a cui si tagliano i fili."
    show valya triste at dx with vpunch
    "La prendo prima che tocchi terra. È così leggera che quasi cado indietro io."
    i vulnerabile "Mario! MARIO!"

    # ------------------------------------------------------------------
    # 7. L'AMBULANZA — Arkadij al telefono
    # ------------------------------------------------------------------
    stop music fadeout 1.0
    play music m_tensione fadein 1.0
    show mario serio at centro, entra_dx with dissolve
    m "Ho già chiamato. Ho chiamato appena l'ho vista cadere. Stanno arrivando."
    "Mario si toglie la giacca della divisa e la mette per terra. Ci appoggiamo sopra Valya, col giubbotto, nella neve. Lui si inginocchia. Gli occhiali da sole li ha in tasca."
    m "Respira. Il polso è veloce ma c'è. Parlale, guagliò. La voce aiuta. Sulle navi si faceva così."
    hide mario with dissolve
    i vulnerabile "Valya. Valya, guarda me."
    v "...Lyova. Fa freddo, nella cabina della radio."
    i vulnerabile "Lo so. Adesso arriva il caldo. Arriva il tram. Quello rosso."
    play sound s_sirena
    "Da lontano, la sirena. Prima piccola, come una zanzara. Poi grande. Poi luci blu che girano sulla neve e la fanno diventare un'altra cosa."
    "Due infermieri. Una barella. Una coperta argentata che fa un rumore di carta di caramella."
    infermiera "Come si chiama la signora?"
    i cupo "Valentina Petrovna Orlova. Ottantaquattro anni. È confusa. Era al freddo da almeno mezz'ora."
    infermiera "Lei è il nipote?"
    "Domanda semplice. Ha una risposta semplice. No."
    i cupo "No. Sono... no. C'è un nipote. Lo chiamo io."
    infermiera "La portiamo all'ospedale civile. Pronto soccorso. Non può salire, mi dispiace. Solo i familiari."
    "La caricano. Lei apre gli occhi per un attimo e guarda il soffitto dell'ambulanza, bianco, pieno di luci."
    v "Bozhe moy. Che bel centralino."
    play sound s_porta
    "Le porte si chiudono. La sirena riparte. Le luci blu girano, girano, poi diventano piccole, poi diventano niente."
    stop ambiente fadeout 2.0
    "Resto nel parcheggio, in pigiama con le renne. Il mio giubbotto se n'è andato con lei. Mi sembra giusto."

    scene bg parcheggio_neve with dissolve
    show neve_lenta
    play music m_triste fadein 3.0
    "In tasca ho il telefono e un biglietto da visita. Me l'ha lasciato Arkadij sul bancone, la settimana scorsa, con un gesto da notaio. Non pensavo di usarlo. Non così."
    "{i}Arkadij N. Orlov — Consulente finanziario — Milano.{/i} Un numero di cellulare. Le dita mi tremano. Sbaglio due volte."
    play sound s_telefono_squillo
    a "Pronto. Chi è."
    "Non è una domanda. È una voce che sa già che qualcosa è successo."
    i cupo "Sono Ionuț. Il ragazzo della Lampo."
    "Silenzio. Lo sento respirare. Sento una macchina che passa, dalla sua parte. Forse non dorme neanche lui."
    i cupo "Valya era nel parcheggio del Girasole. In vestaglia. Nella neve. Cercava il tram per il porto. È svenuta. L'hanno portata all'ospedale civile."
    a "...È viva?"
    i cupo "Sì. Respira. Parlava."
    a "Cosa diceva?"
    "Penso a cosa rispondere. Penso al nome. Penso che non è mio, quel nome, e che non posso darlo a lui."
    i malinconico "Parlava del freddo."
    a "Arrivo. Un'ora e mezza. Meno, se non nevica in autostrada."
    "Una pausa. Lunga. Nella pausa c'è tutto quello che ci siamo detti nel parcheggio, una settimana fa. Ragazzo. Truffatore. Torni a fare il ragazzo."
    a "Lei era lì."
    i cupo "Mi ha chiamato la guardia. Ero il più vicino."
    a "Non era il più vicino. Io lo so dove abita, l'ho fatto controllare."
    "Non dico niente. Lui nemmeno. Poi:"
    a "Grazie."
    "Lo dice piano, come una parola straniera che ha imparato da poco e non sa se ha l'accento giusto."
    a "Non vada all'ospedale stanotte. Non la fanno entrare. Ci penso io. Vada a casa, Ionuț. Si metta qualcosa addosso. La sento battere i denti da qui."
    "Chiude. È la prima volta che mi chiama per nome. Io mi accorgo solo adesso che batto i denti."

    show mario notte at dx with dissolve
    m "Guagliò. Vieni in guardiola. Ho il termos. Il caffè fa schifo, ma è caldo."
    i malinconico "Mario... l'ho chiamata ancora signora Valya, all'infermiera. Valentina Petrovna. Ma con lei ho fatto finta di essere un altro."
    m serio "Hai fatto bene."
    i malinconico "Ho mentito."
    m "No. Le hai fatto compagnia nella sua frequenza. Quando uno trasmette, non gli chiedi di cambiare banda. Ti sintonizzi tu."
    "Lo guardo. Lui si rimette gli occhiali da sole. Alle tre meno un quarto. Nella neve."
    m "Per la discrezione."
    hide mario with dissolve
    "Sotto l'ultimo lampione, sopra le sue orme, ce ne sono di nuove. Le mie. Grandi e dritte. Tra un'ora la neve avrà coperto tutte e due."
    "Mia madre adesso è nella cucina del signor Ferretti, e gli tiene la mano, e gli dice che Lina è andata a prendere il pane."
    "Io stanotte ho detto a una donna che ero un uomo morto da tanto tempo. Forse è la stessa cosa. Forse è il mestiere di famiglia."
    stop music fadeout 4.0
    "Il tram per il porto non passa. Non è mai passato."
    "Ma io ero lì. Questo, almeno, era vero."

    scene bg nero_totale with lentissimo
    play ambiente s_vento fadein 2.0
    pause 2.0
    "Sono qui."
    pause 1.5
    stop ambiente fadeout 3.0
    pause 2.0
    return
