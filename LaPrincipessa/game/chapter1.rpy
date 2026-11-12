## CAPITOLO 1 — "La saracinesca"
## Prologo (maggio), primo giorno alla Lampo (giugno), ottobre: il giovedì della radio.

label cap1:
    call titolo_capitolo("1", "La saracinesca", "Valdorsa — ottobre")

    # ------------------------------------------------------------------
    # PROLOGO — MAGGIO. LA BIANCANEVE VOLANTE
    # ------------------------------------------------------------------
    scene bg nero with fade
    play music m_comico fadein 1.0
    "Prima di tutto, una cosa che dovete sapere."
    "Il soprannome non me lo sono scelto."
    "Nessuno si sceglie un soprannome. Al massimo te lo meriti. Io me lo sono meritato appeso a un cavo, a tre metri d'altezza, con una gonna gialla."

    scene bg teatro with dissolve
    play ambiente s_folla fadein 1.0
    call didascalia("ITIS «G. MARCONI» — MAGGIO")
    "Recita di fine anno. Aula magna. Duecento sedie di plastica, i genitori con i telefoni già alzati."
    "Lo spettacolo è «Biancaneve». Regia della professoressa Benassi, che insegna italiano e crede ancora nel teatro come in una religione."
    call via_didascalia
    "Io non recito. Io sono il tecnico luci. E il suggeritore. E quello che sistema il microfono quando fischia."
    "Il mio posto è dietro le quinte, al buio, con un cacciavite in tasca. È il posto più bello del mondo."
    "Venti minuti prima dell'inizio, la professoressa Benassi mi trova dietro le quinte. Ha la faccia di chi ha appena visto un fantasma."
    prof "Martina ha la gastroenterite."
    i ironico "Mi dispiace. Le porto una Coca-Cola sgasata?"
    prof "Martina è Biancaneve."
    i imbarazzato "...Ah."
    prof "Tu sai tutte le battute. Le hai suggerite per tre mesi."
    i sclero "No. No, prof. No."
    with vpunch
    prof "Il vestito è di taglia unica. Ti sta benissimo. Fidati."
    "Non mi fido. Ma la professoressa Benassi ha sessantadue anni e la voce di un generale, e cinque minuti dopo sono vestito da Biancaneve."
    show item tiara with dissolve
    "Corpetto blu. Gonna gialla. Le maniche a sbuffo rosse. In testa, una tiara di plastica con i brillantini."
    "Lo so, Biancaneve non ha la tiara. La prof dice che «aiuta il pubblico a capire»."
    hide item with dissolve
    "Il principe è Kevin. Un metro e novantadue, quinta B, prima volta su un palco. Gioca a basket e ha le mani grandi come padelle."
    kevin "Ionuț. Ma tu... io ti devo baciare?"
    i freddo "Kevin. Nessuno bacia nessuno. Mi tocchi la fronte con due dita e io mi sveglio. L'abbiamo provato venti volte."
    kevin "Con Martina, l'abbiamo provato."
    i sarcastico "Fai finta che io sia Martina con la barba."
    "Kevin mi guarda come si guarda un problema di fisica. Poi si apre il sipario."

    stop ambiente fadeout 1.0
    "Il primo atto va bene. Benissimo, anzi. Sono una Biancaneve credibile. Un po' alta, un po' con le spalle larghe, ma credibile."
    "Mangio la mela. Cado. Mi sdraio sulla bara di cartone."
    "Arriva il principe."
    "E il principe si blocca."
    kevin "..."
    "Kevin guarda il pubblico. Il pubblico guarda Kevin. Duecento telefoni guardano Kevin."
    kevin "...Io non mi ricordo niente."
    "Da sdraiato, con gli occhi chiusi, faccio quello che so fare. Suggerisco."
    i comico "{size=-8}«Oh, fanciulla dalla pelle di neve...»{/size}"
    kevin "Cosa?"
    i comico "{size=-8}La battuta. Dilla.{/size}"
    kevin "Oh, fanciulla... della neve... della pelle..."
    "È qui che decido di alzarmi, per prendere in mano la situazione. È qui che sbaglio."
    "La mia tiara si è impigliata nel cavo del sipario. Non lo so ancora."
    "Lo sa la professoressa Benassi, che dalla quinta destra tira la corda per chiudere tutto e salvare il salvabile."
    play sound s_glitch
    scene bg teatro with glitch_t
    with vpunch
    "Il sipario si apre del tutto. Il cavo sale."
    "E io salgo con lui."
    with vpunch
    "Volo sopra il palco come un lampadario. La gonna gialla si apre a ombrello. Le scarpette mi cadono, una in prima fila."
    pubblico "Ooooohhh!"
    "Kevin, sotto di me, alza le braccia. Non per prendermi. Si arrende."
    kevin "Biancaneve, scendi!"
    "Appeso a tre metri, la tiara che mi tira i capelli, guardo giù. Guardo Kevin. Guardo la prof."
    "E improvviso. Non so da dove mi viene. So solo che è vero."
    with flash
    i furioso "Non mi serve un principe!{w} Mi serve un cacciavite!"
    with vpunch
    play sound s_risate
    "Silenzio di un secondo. Poi l'aula magna crolla."
    play sound s_applausi
    pubblico "Ah ah ah ah ah!"
    "Ridono i genitori. Ridono i bidelli. Ride anche Kevin, che si siede sulla bara e piange dal ridere."
    "La prof Benassi, dietro la quinta, si fa il segno della croce. Poi applaude anche lei."
    "Resto lassù per sei minuti, finché il bidello Gianni non arriva con la scala."

    scene cg video_principessa with lento
    play music m_comico2 fadein 1.0
    window hide
    pause 2.0
    window show
    "Qualcuno ha filmato tutto. Tutti hanno filmato tutto."
    "Il video più visto si intitola «BIANCANEVE VOLA AL MARCONI 😂😂». Trentotto secondi. Trecentottantamila visualizzazioni in una settimana."
    "La Gazzetta di Valdorsa mi mette in prima pagina, sotto la notizia di una rotonda nuova."
    "Mia madre lo stampa e lo attacca al frigo. Dice che sono «famoso come un cantante». Poi va a lavorare."
    "Il giorno dopo, all'esame di maturità, il commissario esterno mi guarda e mi chiede: «Lei è quello del cacciavite?»"
    "Prendo sessantotto su cento. Credo che due punti siano per il volo."

    # ------------------------------------------------------------------
    # GIUGNO — PRIMO GIORNO ALLA LAMPO
    # ------------------------------------------------------------------
    scene bg galleria with dissolve
    play music m_galleria fadein 1.0
    play ambiente s_scale_mobili fadein 1.0
    call didascalia("CENTRO COMMERCIALE IL GIRASOLE — GIUGNO")
    "A giugno trovo lavoro. Il primo annuncio a cui rispondo. L'unico, per la verità."
    "«Cercasi ragazzo pratico di elettronica. No perditempo. Riparazioni Lampo, Centro Il Girasole.»"
    call via_didascalia
    "L'insegna è sopra la vetrina, al neon azzurro. Dovrebbe dire LAMPO."
    "Dice LAMP_. La O è bruciata."
    i ironico "{i}Lamp.{/i} Come in inglese. Una lampada. O come l'inizio di qualcosa che non finisce."
    i comico "O come in {i}oddio{/i}, che è la prima cosa che penso."

    scene bg negozio with dissolve
    stop ambiente fadeout 1.0
    play music m_negozio fadein 1.0
    play sound s_campanella
    show rino normale at dx with dissolve
    "Dentro c'è un uomo con i baffi grigi e la radio accesa su Radio Rai. Ripara un telefono con la delicatezza di chi disinnesca una bomba e la stessa voglia."
    r normale "Tu sei Ionuț."
    i imbarazzato "Sì. Buongiorno. Ho il diploma, so saldare, so—"
    r arrabbiato "Sai cos'è uno smartphone?"
    i ironico "...Un telefono?"
    r arrabbiato "Un vetro con l'ansia dentro. Ricordatelo. Io sono Ruggeri. Rino per i clienti che pagano."
    "Il colloquio finisce lì. Credo di essere assunto. Nessuno me lo dice mai ufficialmente."
    show dado ride at sx, entra_sx
    "Dal retro esce un ragazzo con il cappellino al contrario e il telefono in mano. Sta filmando qualcosa. Sta sempre filmando qualcosa."
    "Mi guarda. Mi guarda meglio. Abbassa il telefono."
    show dado comico at sx, saltello
    with vpunch
    d comico "No.{w} NO.{w} Ma tu sei LA PRINCIPESSA!"
    i sclero "No."
    d ride "Sì! Il cacciavite! Il volo! Ho fatto pure il duetto! Rino, guarda chi abbiamo! Biancaneve!"
    r normale "Non so chi sia Biancaneve e non mi interessa. Principessa, siediti lì e smonta quel portatile."
    "Così. In tre secondi. Anche Rino."
    hide dado with dissolve
    "Mi siedo sullo sgabello del bancone. Lo sgabello di Rino. Un pezzo d'arte del 1989, con il cuscino di similpelle rosso."
    play sound s_glitch
    with vpunch
    i furioso "Ahia!"
    "Dal cuscino sporge una vite. Una vite piccola, precisa, appuntita. Una vite che aspettava me da trentacinque anni."
    i arrabbiato "C'è una vite nello sgabello! Mi punge!"
    show dado ride at sx with dissolve
    d ride "Ha sentito il pisello! LA PRINCIPESSA SUL PISELLO!"
    with glitch_t
    play sound s_risate
    "È finita. Lo sento chiaramente. È come quando senti un fusibile che salta."
    "Quel pomeriggio Dado lo racconta alla tabaccheria. Alla sera lo sa la tisaneria. Il giorno dopo la guardia del parcheggio mi saluta con un inchino."
    r normale "La vite la lascio. Così impari a stare dritto."
    "La vite c'è ancora. Il soprannome pure."

    # ------------------------------------------------------------------
    # OTTOBRE — OGGI
    # ------------------------------------------------------------------
    scene bg galleria with fade
    play music m_galleria fadein 2.0
    play ambiente s_folla fadein 1.0
    call didascalia("OTTOBRE — GIOVEDÌ, 8:55")
    "Adesso è ottobre. Fuori c'è la nebbia, quella di Valdorsa, che non sale dal fiume ma sembra uscire dalla terra."
    call via_didascalia
    "Il Centro Commerciale Il Girasole è stato inaugurato nel 2003. C'era la banda, c'era il sindaco, c'era una fontana che faceva i giochi d'acqua."
    "Oggi la fontana è asciutta e qualcuno ci butta dentro gli scontrini."
    "Metà delle vetrine hanno la carta da pacchi sui vetri. Le chiamo «le vetrine con gli occhi chiusi»."
    "La muzak non si ferma mai. Una versione al flauto di una canzone che conoscevi. Non ti ricordi quale. Non te lo ricorderai mai."
    "Mi piace, il Girasole. Non lo dico a nessuno. È un posto dove le cose stanno ferme ad aspettare, come me."
    stop ambiente fadeout 1.0

    show mario normale at dx with dissolve
    "Davanti all'ingresso c'è Mario, la guardia notturna. Smonta alle sette, ma resta sempre fino alle nove a finire il cruciverba."
    "Porta gli occhiali da sole anche dentro. Anche di notte. Dice che è per la discrezione."
    m normale "Buongiorno, Principessa. Notte tranquilla. Un piccione al secondo piano, ma l'abbiamo gestito."
    i ironico "L'avete arrestato?"
    m serio "Gli ho parlato. Ha capito."
    m normale "Ricordati, guagliò. Il centro commerciale di notte è una cattedrale. Senza santi, ma con le scale mobili."
    i enigmatico "Lo dici tutte le mattine."
    m comico "E tutte le mattine è vero. Otto verticale: «si ripara alla Lampo». Sette lettere."
    i sarcastico "Pazienza."
    m comico "Ci sta! Vedi che servi a qualcosa?"
    hide mario with dissolve

    play sound s_annuncio
    show max spaccone at centro with dissolve
    "Nell'atrio centrale, sotto il lucernario, c'è il chiosco di Max. FIX-IT EXPRESS, con un fulmine di plastica. Riparazioni in trenta minuti."
    "Max ha trent'anni, tre catene d'oro e gli occhiali da sole sulla testa. Lui e Mario potrebbero fondare un club."
    x spaccone "Signori! Vetro rotto? Da FIX-IT è subito fixato! Trenta minuti, very top of the gamma!"
    x spaccone "Ehi, Princess! Quando ti stanchi del dinosauro, da me c'è posto! Ti pago in esperienza!"
    i freddo "Mi pagherai in vetri montati storti, Max."
    x comico "Quello era UN vetro. Una volta! Il cliente aveva le mani storte!"
    hide max with dissolve

    scene bg tisaneria with dissolve
    play music m_negozio fadein 1.0
    play sound s_bollitore
    show giulia normale at dx with dissolve
    "Accanto alla Lampo c'è la Tisaneria Luna Nuova. Dall'altra parte un negozio di sigarette elettroniche chiuso da un anno, con un cartello: TORNIAMO SUBITO."
    "Alla tisaneria lavora Giulia. Grembiule nero, occhiaie da filosofa, una tazza in mano che non beve mai."
    "La sera studia filosofia online. Di giorno vende tisane che si chiamano «Abbraccio d'autunno» a signore che non le comprano."
    g normale "Buongiorno, Principessa."
    i arrabbiato "Non—"
    g sorride "Lo so."
    "Ogni mattina. Lo stesso scambio. Ci teniamo tutti e due, credo. È l'unica conversazione della giornata che finisce bene."
    g normale "Oggi è giovedì. Il giovedì succede sempre qualcosa."
    i ironico "L'ultima volta è successo che si è allagato il bagno."
    g seria "Appunto. Qualcosa."
    hide giulia with dissolve

    scene bg negozio with dissolve
    play music m_negozio fadein 1.0
    play sound s_campanella
    "La Lampo apre alle nove. Rino arriva alle nove e venti, con il giornale e il caffè di Giulia, che non paga mai."
    "Dado arriva alle dieci, con una storia diversa ogni giorno. La nonna, il traffico, un'eclissi."
    show dado ride at dx with dissolve
    d ride "Principessa! Oggi facciamo un video. «Riparo un iPhone bendato». Tu mi passi gli attrezzi."
    i sarcastico "Quanti follower hai, Dado?"
    d comico "Trecentododici. Ma di qualità. Tipo, mia nonna ne ha tre di account."
    hide dado with dissolve
    "Io sto al bancone. Cambio batterie, sblocco tasti, tolgo la sabbia dalle console dei bambini tornati dal mare. Ad ottobre c'è ancora sabbia, dentro."

    play music m_triste fadein 2.0
    "La mia vita, in breve."
    "Sono nato a Iași, in Romania. Sono in Italia da quando avevo sette anni. Parlo rumeno solo al telefono con mia nonna, e male."
    "Mio padre sta in Spagna, con un'altra famiglia. Telefona a Natale. È puntuale, almeno."
    "Mia madre si chiama Mirela. Fa la badante di notte al signor Ferretti, che ha novant'anni e la chiama «Rosina». Rosina era sua moglie."
    "Lei torna alle sette di mattina, io esco alle otto e mezza. Ci incrociamo in cucina come due treni su binari vicini."
    "I miei amici sono partiti. Luca a Bologna, ingegneria. Sara a Milano, design. Ci scriviamo. Poi meno."
    "Io sono rimasto. Non so cosa voglio fare. Non so nemmeno se voglio volere qualcosa."
    i malinconico "Per ora aggiusto quello che gli altri rompono."
    i ironico "È un lavoro. Ed è più di quello che fanno certi filosofi."
    play music m_negozio fadein 2.0
    "Questo è un giovedì di ottobre. Piove dalle undici. Nessuno compra niente. Nessuno rompe niente."
    "Poi, alle sei meno un quarto, entra lei."

    # ------------------------------------------------------------------
    # IL GIOVEDÌ DELLA RADIO
    # ------------------------------------------------------------------
    scene bg negozio_sera with dissolve
    stop music fadeout 1.0
    play ambiente s_pioggia fadein 1.0
    play sound s_campanella
    pause 0.8
    play music m_valya fadein 2.0
    show valya seria at dx, entra_dx
    "La campanella suona. Ma suona diversa. Non so spiegarlo. Come se la porta sapesse chi l'ha aperta."
    "È una signora piccola. Fazzoletto a fiori in testa, annodato sotto il mento. Uno sciallone marrone. Un cappotto pesante come una coperta militare."
    "In mano, una borsa della spesa a quadri. Di quelle con le rotelle, ma lei non usa le rotelle. La porta a braccio, come un trofeo."
    "Ha le sopracciglia folte e bianche. E le sopracciglia mi stanno giudicando."
    show ionut imbarazzato at sx with dissolve
    i imbarazzato "Buonasera! Benvenuta alla Lampo. Cioè, alla Lamp. La O è... in ferie."
    v seria "La O è bruciata. L'ho vista da fuori. Lo dica, non si vergogni."
    i comico "La O è bruciata. Mi vergogno."
    v seria "Bene. L'onestà è un inizio."
    "Rino alza la testa dal retro. Sta per venire avanti. Lei alza una mano senza guardarlo."
    v seria "No, non lei. Lei ha i baffi da direttore. Io voglio il ragazzo."
    show rino normale at centro with dissolve
    r normale "Signora, il titolare sono io."
    v seria "Appunto."
    "Rino resta un momento con la bocca aperta. Poi, per la prima volta da giugno, fa un passo indietro."
    r normale "Principessa. È tutta tua."
    hide rino with dissolve
    "Lei appoggia la borsa sul bancone. La apre con cura, come si apre una valigia alla dogana."
    "Tira fuori qualcosa avvolto in uno strofinaccio a righe."

    scene cg primo_incontro with lento
    stop ambiente fadeout 2.0
    window hide
    pause 2.0
    window show
    "È una radio. Una radio portatile, vecchia, con la custodia di finta pelle color vinaccia e la maniglia di cuoio."
    "Sul pannello frontale c'è una scala delle frequenze, i numeri piccoli in fila come soldati. E una scritta in metallo: VEF SPIDOLA."
    v seria "È sovietica. Fatta a Riga. Come me, è vecchia e funziona male."
    i sincero "È bellissima."
    "Mi esce così. Non lo dico come lo dicono i clienti. Lo dico come si dice di un tramonto."
    "Lei mi guarda. Per la prima volta le sopracciglia smettono di giudicare."
    v nostalgica "...Sì. Lo era."

    scene bg negozio_sera with dissolve
    play ambiente s_pioggia fadein 1.0
    show item radio with dissolve
    show ionut ironico at sx
    show valya seria at dx
    "La radio sta tra noi sul bancone. Pesa più di quanto sembra. Le cose vecchie pesano sempre di più. Saranno i ricordi, o il ferro."
    v seria "Mi dia le mani."
    i imbarazzato "...Prego?"
    v arrabbiata "Le mani. Non le mangio. Le faccia vedere."
    "Gliele porgo, sopra il bancone, come un bambino a cui la maestra controlla le unghie."
    "Lei le prende nelle sue. Le sue sono fredde, sottili, piene di vene blu. Le gira. Guarda le dita. I calli del saldatore. Una bruciatura sul pollice."
    v seria "Mani buone."
    "Poi alza gli occhi sulla mia faccia."
    v seria "Faccia da sciocco."
    "Pausa."
    v sorridente "Va bene."
    with glitch_t
    i sclero "Grazie...? Credo?"
    v seria "Come si chiama, lei?"
    i ironico "Io sono—"
    v seria "No, aspetti. Lo vedo da me. Lei è un Ivan."
    i comico "Non sono un Ivan."
    v seria "Tutti i ragazzi gentili e un po' tonti sono Ivan. Ivan lo sciocco, come nelle fiabe. Alla fine sposa la zarevna."
    i sarcastico "Mi accontenterei di un contratto a tempo indeterminato."
    v sorridente "Nu, ladno. Ivan, allora."
    "Dal retro sento Dado che soffoca una risata dentro un sacchetto di patatine."

    show ionut enigmatico at sx
    i enigmatico "Allora. Cosa fa la radio, signora...?"
    v seria "Valentina Petrovna. Orlova. Per gli italiani, signora Bellini. Per lei, signora."
    i imbarazzato "Signora. Cosa fa la radio?"
    v triste "Niente. È questo il problema. Non fa niente da nove anni."
    i ironico "Si accende? Fa rumore? Fa fumo?"
    v seria "Non si accende. Se facesse fumo, la porterei ai pompieri, non a un ragazzo."
    "Giro la radio. Le viti del retro sono originali, a taglio, un po' arrugginite. Nessuno l'ha mai aperta. Si vede."
    i sincero "Posso provarci. Non le prometto niente. Questi pezzi non li fanno più da quarant'anni."
    v seria "Nemmeno me fanno più. Eppure sono qui."
    i ironico "Questo... è un argomento forte."
    "Lei appoggia due dita sulla radio. Leggere. Come si tocca la spalla di qualcuno che dorme."
    v nostalgica "Deve funzionare per Capodanno."
    i comico "Capodanno? Abbiamo più di due mesi. Ce la faccio anche se mi cade sul piede."
    v seria "Non scherzi, Ivan. Per Capodanno. È importante."
    "Lo dice piano. Non come un ordine. Come una cosa che si chiede una volta sola."
    i sincero "...Va bene. Per Capodanno."

    "Scrivo la ricevuta. Nome: BELLINI. Oggetto: radio VEF. Difetto: non si accende. Note: lascio vuoto."
    "Cosa dovrei scrivere? «Importante»?"
    v seria "Quanto costa?"
    i ironico "Prima la apro, poi le dico. Se è una cosa da poco, niente."
    v arrabbiata "Niente non esiste. In Unione Sovietica il niente costava due rubli. Mi dica un prezzo."
    i comico "...Due rubli?"
    v sorridente "Vede che impara."
    hide item with dissolve
    "Poi fruga nella tasca del cappotto. Tira fuori una caramella. Carta azzurra e bianca, un orso disegnato su un pezzo di ghiaccio, tra gli abeti."
    v seria "Mishka na Severe. L'orso al nord. È per lei."
    i imbarazzato "Grazie, ma non—"
    v seria "Non si rifiuta una caramella da una vecchia. Porta sfortuna. A lei, non a me."
    "La posa sul bancone. Vicino alla mia mano. Precisa, come si mette un pezzo sulla scacchiera."
    v seria "Giovedì prossimo torno. Se non ha fatto niente, lo capisco dalla faccia."
    i sarcastico "Ho una faccia da sciocco. Non si capisce mai niente."
    v sorridente "Si capisce tutto, golubchik. È proprio quello il bello."

    play sound s_campanella
    hide valya with dissolve
    "La campanella suona di nuovo. Lei esce nella pioggia senza ombrello. Il fazzoletto le basta."
    "La guardo attraversare la galleria. Passa davanti al chiosco di Max, che apre la bocca per chiamarla. Lei lo guarda. Lui la chiude."
    show dado ride at dx with dissolve
    d ride "Principessaaa! Hai fatto colpo sulla Babushka!"
    i freddo "Dado."
    d comico "Ti ha chiamato Ivan! Ivan lo sciocco! Questo va su TikTok! Hashtag Ivan!"
    i arrabbiato "Dado, se lo metti su TikTok ti smonto il telefono e lo rimonto senza la fotocamera."
    d serio "...Va bene. Va bene. Brr. Ivan il Terribile."
    hide dado with dissolve
    show ionut malinconico at sx
    "Resto con la radio tra le mani. Il negozio è vuoto. Sento la pioggia sul lucernario della galleria e la muzak al flauto, lontana."
    "C'è una sensazione nel petto che non so nominare. Tipo quando si accende un amplificatore e prima del suono c'è quel ronzio. Quel {i}qualcosa sta per arrivare{/i}."
    i malinconico "Ho diciannove anni. Ho appena conosciuto una signora che potrebbe essere la nonna di mia madre."
    i ironico "E ho voglia che sia già giovedì prossimo."
    i comico "Va tutto bene. È il neon. Mi fa male il neon."
    "Metto la caramella in tasca. Non la mangio."

    # ------------------------------------------------------------------
    # CHIUSURA — LA SARACINESCA E IL CALCIO DI RUGGERI
    # ------------------------------------------------------------------
    scene bg saracinesca_notte with fade
    stop music fadeout 1.0
    play music m_comico fadein 1.0
    play ambiente s_neon fadein 1.0
    call didascalia("IL GIRASOLE — 19:58")
    "Alle otto meno due il Girasole chiude. Le luci della galleria si spengono una fila alla volta, come una nave che affonda con educazione."
    call via_didascalia
    "Ed è il momento della saracinesca."
    show rino sera at dx with dissolve
    "Rino prende l'asta col gancio, la infila nell'anello e tira giù. La saracinesca scende con un rumore da treno merci."
    play sound s_saracinesca
    pause 1.5
    play sound s_saracinesca_blocco
    with vpunch
    "E si ferma. A quaranta centimetri da terra. Come sempre."
    "Non trentanove. Non quarantuno. Quaranta. Li ho misurati il secondo giorno. Il metro ce l'avevo in tasca, ovviamente."
    i sarcastico "Rino, quella saracinesca la sistemo io in mezz'ora. È la molla di bilanciamento, ha perso tensione. Basta—"
    r arrabbiato "Non si tocca."
    i ironico "Ma è rotta."
    r arrabbiato "Non è rotta. Ha carattere. Come mia moglie, pace all'anima sua."
    "Poi Rino si schiarisce la voce. Si sistema la giacca. Prende la rincorsa di un passo e mezzo."
    "Ed è il momento sacro. Il calcio di Ruggeri."
    show rino sera at dx, saltello
    r sera "{i}Azzurro... il pomeriggio è troppo azzurro...{/i}"
    play sound s_saracinesca_blocco
    with vpunch
    "Calcio preciso, in basso a destra, a dieci centimetri dall'angolo. Sempre lo stesso punto. È lucido, il punto, come la statua di un santo che la gente tocca."
    r sera "{i}...e lungo per me!{/i}"
    pause 1.0
    "La saracinesca non si muove. Resta a quaranta centimetri."
    i comico "Ha mai funzionato? Una volta, in trentacinque anni?"
    r normale "Nel 2006. La notte dei mondiali."
    i ironico "Quindi funziona solo se l'Italia vince la Coppa del Mondo."
    r sera "Funziona quando ci credi, Principessa. Tu non ci credi abbastanza."
    "Così ci chiniamo. Lui con la schiena che scricchiola, io con la radio di Valya sotto il braccio, avvolta nel mio giubbotto."
    "E passiamo sotto. Come ogni sera. Come due gatti sotto una porta."
    hide rino with dissolve
    show mario notte at dx with dissolve
    "Mario, dalla guardiola, ci guarda sul monitor. Alza il termos per salutarci."
    m notte "Buonanotte, Principessa. Io vedo tutto."
    i ironico "Anche il calcio?"
    m comico "Soprattutto il calcio. Lo rivedo la mattina, al rallentatore. Mi tiene compagnia."
    hide mario with dissolve
    stop ambiente fadeout 1.0

    # ------------------------------------------------------------------
    # IL RITORNO A CASA SOTTO LA PIOGGIA
    # ------------------------------------------------------------------
    scene bg fermata_pioggia with dissolve
    show pioggia
    play ambiente s_pioggia fadein 1.5
    play music m_notte fadein 2.0
    "La fermata del 7 è davanti al parcheggio. Una pensilina di plexiglas graffiata e una panchina dove nessuno si siede, perché è sempre bagnata."
    "Il bus passa ogni quaranta minuti. Quaranta. Come i centimetri. Valdorsa ha un numero preferito."
    "Tengo la radio stretta sotto il giubbotto. La pioggia mi entra nel collo. Alla radio no. Alla radio non deve succedere niente."
    "Mi chiedo dove abiti. Se ha qualcuno che le apre la porta. Se a casa, la sera, parla con qualcuno o con il televisore."
    "Mi chiedo perché me lo chiedo."
    play sound s_bus
    "Arriva il 7. L'autista è sempre lo stesso, un signore che ascolta la radio a volume altissimo. Liscio, fisarmonica."
    "Mi siedo in fondo. Il finestrino è appannato. Ci disegno sopra con il dito, senza pensarci, una piccola antenna."
    "Poi la cancello, perché mi sento stupido."
    call sms("MAMMA", "Ciao amore. Il sig. Ferretti stanotte agitato. In frigo c'è la pasta 🐟 mangia!!")
    "Il pesce è per dire «ti voglio bene». Mia madre usa le emoji come le capitano. Non le correggo. Si capisce lo stesso."
    i malinconico "Anche stanotte casa vuota. Io, la pasta e una radio sovietica."
    i ironico "Sembra il titolo di un film d'essai. Di quelli che vince il premio e non guarda nessuno."
    hide pioggia
    stop ambiente fadeout 2.0

    # ------------------------------------------------------------------
    # CAMERETTA — IL BIGLIETTO 7.077 E IL VANO SIGILLATO
    # ------------------------------------------------------------------
    scene bg cameretta with buio
    play music m_notte fadein 2.0
    play ambiente s_pioggia fadein 2.0
    call didascalia("VIA GRAMSCI 14, TERZO PIANO — 23:40")
    "Casa. Due stanze e una cucina. La pasta fredda, mangiata in piedi davanti al frigo, sotto la foto di me che volo."
    call via_didascalia
    "In camera mia c'è una scrivania che è più laboratorio che scrivania. Il saldatore, la lampada con la lente, i cassetti con le viti divise per misura."
    "È l'unico posto ordinato della mia vita."
    "Stendo un asciugamano. Ci appoggio sopra la radio. La guardo, prima di toccarla, come si guarda un paziente."
    show item radio with dissolve
    i sincero "Allora, signora Spidola. Vediamo cosa ti fa male."
    play sound s_cacciavite
    "Il cacciavite a taglio, quello piccolo, quello buono. Quattro viti sul retro. La prima non vuole. La seconda geme. La terza e la quarta si arrendono."
    "Il pannello posteriore viene via con un piccolo sospiro, come se trattenesse il fiato da anni."
    "Dentro c'è odore di polvere, di metallo e di qualcosa di dolce. Lavanda, forse. O la casa di qualcuno."
    "I condensatori sono gonfi. I transistor sono quelli vecchi, al germanio, piccoli cappelli di metallo. La scala delle frequenze è collegata a un filo di nylon, ancora integro."
    i ironico "Sei messa male. Ma sei messa male come una bella macchina d'epoca. Si può fare."
    hide item with dissolve
    "Poi lo vedo."
    "Infilato tra il telaio e la custodia, piegato in quattro, c'è un foglietto. Ingiallito. Sottile come la carta delle sigarette."
    "Lo apro con le pinzette, perché ho paura che si sbricioli."
    play sound s_statica
    with flash
    "Sopra c'è scritto solo un numero. A penna, con una grafia inclinata e decisa."
    "{b}7.077{/b}"
    "Nient'altro. Né un nome, né una data."
    i enigmatico "Sette-zero-sette-sette."
    i comico "Un numero di telefono troppo corto. Una combinazione troppo lunga. Il prezzo di qualcosa? Settemila e settantasette rubli?"
    "Guardo la scala della radio. I numeri delle onde corte. Il punto in cui l'ago si ferma quando la spegni."
    "Ma è tardi, ho gli occhi stanchi, e non ci arrivo. Non ancora."
    "Rimetto il foglietto esattamente dov'era. Mi sembra giusto. Era lì prima di me."

    show item radio with dissolve
    "Poi giro la radio, per controllare le batterie. Spesso è solo quello. Le batterie, l'ossido, i contatti sporchi."
    "Il vano batterie è sotto. Ha uno sportellino a scatto."
    "Ed è sigillato."
    play sound s_glitch
    with glitch_t
    "Strisce di scotch marrone, vecchio, incrociate tre volte. Lo scotch è diventato duro e trasparente come ambra."
    "Sopra, a pennarello nero, c'è una scritta. Lettere che sembrano le nostre, ma girate al contrario, o rotte a metà. Cirillico."
    "Due parole. Tre righe di scotch. Una chiusura fatta da qualcuno che sapeva cosa stava facendo, e lo voleva fare bene."
    i enigmatico "...Cosa sei, tu?"
    "Le batterie, in quel vano, ci sono di sicuro. Si sentono, se la scuoti. Ma si sente anche un'altra cosa. Più leggera. Più piatta."
    "Il pollice sta già sotto il bordo dello scotch. Un'unghiata e si apre."
    "Non lo faccio."
    "Non so perché. So solo che la signora Valentina Petrovna Orlova, per gli italiani Bellini, per me signora, non mi ha detto niente di questo vano."
    "E chi chiude una cosa così, con tre giri di scotch, non la chiude per sbaglio."
    hide item with dissolve
    i sincero "Va bene. Non ti tocco."
    i ironico "Visto? Sono un Ivan. Un Ivan educato."

    stop music fadeout 3.0
    "Spengo la lampada con la lente. La radio resta sulla scrivania, a pancia in su, aperta, come un animale che si fida."
    "Tiro fuori dalla tasca la caramella. L'orso al nord. La metto sul comodino, vicino al telefono."
    "Fuori piove ancora. Il riscaldamento ticchetta. Da qualche parte, mia madre sta tenendo la mano a un uomo che la chiama con il nome di un'altra."
    "Chiudo gli occhi."
    play music m_neve fadein 3.0
    stop ambiente fadeout 4.0
    scene bg finestra_neve with lentissimo
    show neve_lenta
    pause 1.5
    "Quella notte sogno la neve."
    "Una neve che cade di lato, fitta, sopra un porto che non conosco, e un ago che si muove su una scala di numeri."
    "Quella notte sogno la neve, e non l'ho mai vista davvero."
    hide neve_lenta
    scene bg nero with lentissimo
    stop music fadeout 3.0
    pause 1.0
    return
