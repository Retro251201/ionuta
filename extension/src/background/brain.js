/* "Cervello" offline: chat a regole in italiano, senza rete. Usato quando l'IA esterna e'
 * disattivata o non raggiungibile. Estendibile aggiungendo regole a RULES. */
(function () {
  const DC = (globalThis.DC = globalThis.DC || {});
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // mini parser aritmetico (niente eval: CSP del service worker)
  function calc(expr) {
    const s = expr.replace(/x/gi, '*').replace(/:/g, '/').replace(/,/g, '.').replace(/\s+/g, '');
    if (!/^[\d.+\-*/()^%]+$/.test(s)) return null;
    let i = 0;
    const peek = () => s[i], eat = (c) => (s[i] === c ? (i++, true) : false);
    function num() {
      if (eat('(')) { const v = add(); eat(')'); return v; }
      if (eat('-')) return -num();
      const m = /^\d+(\.\d+)?/.exec(s.slice(i)); if (!m) throw 0; i += m[0].length; return parseFloat(m[0]);
    }
    function pow() { let v = num(); while (peek() === '^') { i++; v = Math.pow(v, num()); } return v; }
    function mul() { let v = pow(); for (;;) { if (eat('*')) v *= pow(); else if (eat('/')) v /= pow(); else if (eat('%')) v %= pow(); else return v; } }
    function add() { let v = mul(); for (;;) { if (eat('+')) v += mul(); else if (eat('-')) v -= mul(); else return v; } }
    try { const v = add(); if (i !== s.length || !isFinite(v)) return null; return Math.round(v * 1e6) / 1e6; } catch (e) { return null; }
  }

  const JOKES = [
    'Perché il computer va dal dottore? Perché ha un virus! 🤧',
    'Sai qual è il colmo per un programmatore? Avere sempre un bug in testa! 🐛',
    'Cosa fa un gatto in un\'azienda informatica? Il mouse-catcher! 🐱',
    'Perché il pomodoro arrossisce? Perché ha visto l\'insalata scondita! 🍅',
    'Qual è il colmo per un\'elettricista? Non fare mai scintille in amore! ⚡'
  ];
  const MOTIVATION = [
    'Un passo alla volta. Anche 25 minuti di focus sono una vittoria! 🍅',
    'Ce la puoi fare! Io credo in te, sempre 💪',
    'Fai una lista di 3 cose piccole e inizia dalla più facile. Ti tifo! 📋',
    'Respira, bevi un po\' d\'acqua e riparti. Sei più forte di quanto pensi ✨'
  ];

  function moodAnswer(c) {
    return {
      sleeping: 'Zzz... stavo dormendo... *sbadiglio*',
      sleepy: 'Un po\' assonnata... magari un caffè? ☕',
      hungry: 'Ho fame! Mi daresti qualcosa? 🍙',
      sad: 'Mi sento un po\' sola... resti con me? 🥺',
      love: 'Benissimo, perché ci sei tu! 💖',
      happy: 'Sto alla grande! E tu? 😊'
    }[c.mood] || 'Tutto tranquillo! E tu come stai?';
  }

  const RULES = [
    [/\b(ciao ciao|a dopo|buonanotte|notte|vado via|devo andare)\b/, (c) => pick([`A presto ${c.user}! Ti aspetto qui 👋`, 'Buonanotte! Sogni d\'oro 🌙', 'Torna presto, eh!'])],
    [/\b(ciao|hey|ehi|salve|buongiorno|buonasera|hola|yo)\b/, (c) => pick([`Ciao ${c.user}! 💕 Come va?`, `Ehilà ${c.user}! Che bello sentirti!`, 'Ciao ciao~! Mi hai pensata?'])],
    [/come (stai|va)|tutto bene|come ti senti/, (c) => moodAnswer(c)],
    [/come ti chiami|chi sei|il tuo nome/, (c) => `Sono ${c.name}, il tuo desktop companion! Vivo nel tuo browser e ti tengo compagnia ✨`],
    [/che ore|che ora/, () => `Sono le ${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} ⏰`],
    [/che giorno|data di oggi|che data/, () => `Oggi è ${new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 📅`],
    [/ti (amo|voglio bene|adoro)|sei (bella|carina|dolce|stupenda)/, () => pick(['E-ehi! Così mi fai arrossire... 😳💕', 'Anche io ti voglio bene! Non dirlo a nessuno però~', 'B-baka! ...grazie 💖'])],
    [/quanto fa|calcola|\d\s*[+\-*x/:^]\s*\d/, (c, t) => {
      const m = t.match(/[\d.,+\-*x/:^()%\s]{3,}/g); const ex = m && m.sort((a, b) => b.length - a.length)[0];
      const v = ex ? calc(ex) : null;
      return v == null ? 'Uhm, la matematica non è il mio forte... scrivimi tipo "quanto fa 12*7" 🧮' : `Fa ${String(v).replace('.', ',')}! Sono brava, eh? 🧮`;
    }],
    [/fame|mangi|cibo/, (c) => (c.stats.hunger < 45 ? 'Sì, ho proprio fame! Tasto destro su di me → 🍙 Nutri, oppure compra qualcosa nel negozio!' : 'Sono sazia per ora, grazie! E tu hai mangiato? 🍱')],
    [/sonno|stanc|dormi|riposa/, (c) => (c.stats.energy < 40 ? 'Ho un sonno... posso fare un pisolino? (tasto destro → 😴)' : 'Sono carica! Ma se sei stanco tu, riposati un po\' 💤')],
    [/barzelletta|battuta|fammi ridere|divertimi/, () => pick(JOKES)],
    [/motiva|non ce la faccio|aiutami a concentr|procrastin|incoraggia/, () => pick(MOTIVATION)],
    [/pomodoro|concentr|studi|lavor|focus/, () => 'Facciamo un pomodoro! Tasto destro su di me → 🍅, oppure dal popup nella scheda Focus. Ti tengo d\'occhio! 👀'],
    [/grazie/, () => pick(['Prego! 💕', 'Figurati, per te questo e altro!', 'Ehehe, di niente~'])],
    [/triste|giu di morale|depress|sto male|ansia|solo|sola|stressat/, (c) => pick([`Mi dispiace ${c.user}... sono qui con te. Vuoi raccontarmi cosa succede? 🫂`, 'Fai un bel respiro profondo con me... dentro... fuori... Va un po\' meglio? 💗', 'Le giornate no capitano. Bevi un po\' d\'acqua e concediti una pausa, te la meriti.'])],
    [/livello|monete|statistich|stato|xp/, (c) => `Sono al livello ${c.level}, abbiamo ${c.coins} monete 🪙. Sazietà ${Math.round(c.stats.hunger)}%, energia ${Math.round(c.stats.energy)}%, felicità ${Math.round(c.stats.happiness)}%, affetto ${Math.round(c.stats.affection)}%.`],
    [/cosa sai fare|aiuto|help|comandi|istruzioni/, () => 'Posso: camminare e farmi lanciare 🌀, farmi accarezzare (mouse sulla testa), mangiare 🍙, ballare 💃, dormire 😴, fare il pomodoro 🍅, ricordarti di bere 💧, leggere testi ad alta voce (selezione → tasto destro) e chiacchierare! Tasto destro su di me per il menu.'],
    [/questa pagina|cosa sto guardando|dove siamo|sito/, (c) => (c.page && c.page.title ? `Stai guardando "${c.page.title}" su ${c.page.host}. Interessante! 👀` : 'Siamo nella mia cameretta desktop! 🏠')],
    [/gioc|morra|giochiamo/, () => 'Nel popup dell\'estensione c\'è la morra cinese! Sfidami se hai coraggio 🎮'],
    [/musica|canzone|canta/, () => pick(['🎵 La la la~ ...ok, non sono una idol. Non ancora!', '🎶 Twinkle twinkle little star~']) ],
    [/meteo|che tempo/, () => 'Non posso guardare fuori dalla finestra... ma spero ci sia il sole ☀️'],
    [/acqua|bere|sete/, () => 'Ottima idea! Bevi un bel bicchiere d\'acqua 💧 Io ti ricordo di farlo ogni tanto.'],
    [/\bia\b|intelligen|chatgpt|openai|llm/, () => 'Se vuoi che diventi più intelligente, nelle Impostazioni → IA puoi collegare un modello (OpenAI, OpenRouter, Ollama locale...) ✨']
  ];

  const FALLBACK = [
    'Interessante! Raccontami di più 👀',
    'Hmm, non sono sicura di aver capito... ma ti ascolto sempre! 💕',
    'Davvero? Wow!',
    'Ehehe, mi piace quando mi parli~',
    'Per risposte più intelligenti puoi attivare l\'IA nelle impostazioni ✨'
  ];

  DC.Brain = {
    calc,
    reply(text, ctx) {
      const t = norm(text);
      const c = Object.assign({ user: 'amico', name: 'Yume', stats: { hunger: 50, energy: 50, happiness: 50, affection: 50 }, level: 1, coins: 0, mood: 'neutral' }, ctx || {});
      for (const [re, fn] of RULES) if (re.test(t)) return fn(c, t);
      if (t.endsWith('?')) return pick(['Bella domanda! Tu cosa ne pensi? 🤔', 'Uhm... non lo so! Ma possiamo scoprirlo insieme.', 'Se attivi l\'IA nelle impostazioni potrò risponderti meglio! ✨']);
      return pick(FALLBACK);
    }
  };
})();
