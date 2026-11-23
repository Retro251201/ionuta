/* Dati condivisi: default, oggetti, obiettivi, frasi, helper.
 * Caricato da service worker, content script, popup, opzioni e finestra. */
(function () {
  const DC = (globalThis.DC = globalThis.DC || {});

  DC.VERSION = '0.3.0';
  DC.KEYS = { state: 'dc_state', settings: 'dc_settings', profile: 'dc_profile', chat: 'dc_chat', event: 'dc_event', pomo: 'dc_pomodoro', session: 'dc_session', customHeads: 'dc_customHeads', avatar: 'dc_avatar' };

  DC.DEFAULT_SETTINGS = {
    enabled: true,
    name: 'Yume',
    size: 260,
    speed: 1,
    opacity: 1,
    headId: 'head_04',
    outfitId: 'uniform',
    hairStyle: 'long', // DC.HAIR_STYLES (capelli disegnati DIETRO la foto)
    hairColor: '#3a2a33',
    accessory: 'none', // DC.ACCESSORIES
    quality3d: 'medium', // preset del renderer 3D: low | medium | high | ultra
    walk: true,
    followCursor: true,
    physics: true,
    siteComments: true,
    talkFrequency: 'normal', // off | rare | normal | often
    hideOnFullscreen: true,
    voice: false,
    voiceRate: 1.05,
    voicePitch: 1.35,
    sounds: true,
    notifications: true,
    disabledSites: [],
    reminders: { enabled: true, water: 45, posture: 60 },
    pomodoro: { work: 25, short: 5, long: 15, cycles: 4, autoBreak: true },
    ai: {
      enabled: false,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      apiKey: '',
      persona: "Sei {name}, una ragazza anime dolce, allegra e un po' tsundere che vive nel browser di {user} come desktop companion. Rispondi in italiano, frasi brevi (max 2-3), tono affettuoso, qualche emoji. Puoi incoraggiare pause, acqua e concentrazione."
    },
    requireLogin: false
  };

  DC.DEFAULT_STATE = {
    stats: { hunger: 80, energy: 85, happiness: 75, affection: 30 },
    xp: 0,
    coins: 40,
    inventory: { onigiri: 2, coffee: 1, candy: 2 },
    unlockedOutfits: ['uniform'],
    counters: { pets: 0, pokes: 0, feeds: 0, throws: 0, chats: 0, pomodoros: 0, games: 0, wins: 0, minutes: 0, activeMinutes: 0, customHeads: 0, twirls: 0 },
    achievements: {},
    sleeping: false,
    lastTick: 0,
    createdAt: 0
  };

  DC.ITEMS = {
    onigiri: { name: 'Onigiri', icon: '🍙', price: 5, effect: { hunger: 25 } },
    ramen: { name: 'Ramen', icon: '🍜', price: 12, effect: { hunger: 45, happiness: 5 } },
    cake: { name: 'Torta alle fragole', icon: '🍰', price: 15, effect: { hunger: 20, happiness: 20 } },
    candy: { name: 'Caramelle', icon: '🍬', price: 3, effect: { hunger: 5, happiness: 8 } },
    coffee: { name: 'Caffè', icon: '☕', price: 8, effect: { energy: 30 } },
    tea: { name: 'Tè matcha', icon: '🍵', price: 6, effect: { energy: 15, happiness: 5 } },
    flower: { name: 'Fiore di ciliegio', icon: '🌸', price: 20, effect: { affection: 20, happiness: 10 } },
    plush: { name: 'Peluche', icon: '🧸', price: 40, effect: { affection: 35, happiness: 25 } }
  };

  DC.levelOf = (xp) => Math.floor(Math.sqrt(Math.max(0, xp) / 25)) + 1;
  DC.xpForLevel = (lvl) => 25 * (lvl - 1) * (lvl - 1);
  DC.clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  DC.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  DC.ACHIEVEMENTS = [
    { id: 'first_pet', icon: '🤚', name: 'Prima carezza', desc: 'Accarezza il companion passando il mouse sulla testa', check: (s) => s.counters.pets >= 1 },
    { id: 'pet_100', icon: '💞', name: 'Coccolone', desc: '100 carezze', check: (s) => s.counters.pets >= 100 },
    { id: 'first_feed', icon: '🍙', name: 'Itadakimasu!', desc: 'Dai da mangiare per la prima volta', check: (s) => s.counters.feeds >= 1 },
    { id: 'feed_25', icon: '🍱', name: 'Chef personale', desc: '25 pasti serviti', check: (s) => s.counters.feeds >= 25 },
    { id: 'throw_10', icon: '🌀', name: 'Montagne russe', desc: 'Lancia il companion 10 volte', check: (s) => s.counters.throws >= 10 },
    { id: 'chat_20', icon: '💬', name: 'Chiacchierone', desc: '20 messaggi in chat', check: (s) => s.counters.chats >= 20 },
    { id: 'pomo_1', icon: '🍅', name: 'Primo pomodoro', desc: 'Completa una sessione di focus', check: (s) => s.counters.pomodoros >= 1 },
    { id: 'pomo_10', icon: '🏆', name: 'Maestro del focus', desc: '10 pomodori completati', check: (s) => s.counters.pomodoros >= 10 },
    { id: 'gamer', icon: '🎮', name: 'Imbattibile', desc: 'Vinci 10 partite a morra cinese', check: (s) => s.counters.wins >= 10 },
    { id: 'lvl_5', icon: '⭐', name: 'Livello 5', desc: 'Raggiungi il livello 5', check: (s) => DC.levelOf(s.xp) >= 5 },
    { id: 'lvl_10', icon: '🌟', name: 'Livello 10', desc: 'Raggiungi il livello 10', check: (s) => DC.levelOf(s.xp) >= 10 },
    { id: 'rich', icon: '💰', name: 'Risparmiatore', desc: 'Possiedi 200 monete', check: (s) => s.coins >= 200 },
    { id: 'fashion', icon: '👗', name: 'Fashionista', desc: 'Sblocca tutti gli outfit', check: (s) => s.unlockedOutfits.length >= (DC.OUTFITS || []).length },
    { id: 'collector', icon: '🧺', name: 'Collezionista', desc: 'Sblocca 8 outfit', check: (s) => s.unlockedOutfits.length >= 8 },
    { id: 'my_face', icon: '📸', name: 'Proprio io!', desc: 'Carica una tua foto come testa', check: (s) => (s.counters.customHeads || 0) >= 1 },
    { id: 'loyal', icon: '📅', name: 'Amici per sempre', desc: 'Passa 10 ore insieme', check: (s) => s.counters.minutes >= 600 },
    { id: 'love', icon: '💖', name: 'Cuore a cuore', desc: 'Porta l\'affetto al 100%', check: (s) => s.stats.affection >= 99.5 }
  ];

  DC.moodOf = (st, sleeping) => {
    if (sleeping) return 'sleeping';
    const s = st.stats || st;
    if (s.energy < 20) return 'sleepy';
    if (s.hunger < 20) return 'hungry';
    if (s.happiness < 30) return 'sad';
    if (s.happiness > 70 && s.affection > 60) return 'love';
    if (s.happiness > 60) return 'happy';
    return 'neutral';
  };
  DC.MOOD_LABEL = { sleeping: '😴 Dorme', sleepy: '😪 Assonnata', hungry: '🍙 Affamata', sad: '🥺 Triste', love: '💖 Innamorata', happy: '😊 Felice', neutral: '🙂 Tranquilla' };

  DC.LINES = {
    greet: ['Ciao {user}! Eccomi qui ✨', 'Sono tornata! Mi sei mancato, {user}.', 'Yahoo~! Pronto per una nuova giornata?'],
    morning: ['Buongiorno {user}! Hai fatto colazione? ☀️', 'Buongiorno! Oggi spacchiamo tutto!'],
    evening: ['Buonasera {user}! Com\'è andata oggi?', 'Serata tranquilla? Io resto qui con te.'],
    night: ['{user}, è tardi... non dovresti dormire? 🌙', 'Sono le ore piccole... ancora cinque minuti e poi a letto, ok?'],
    idle: ['Hmm hmm~ 🎵', 'Se ti serve qualcosa, cliccami col tasto destro!', 'Ti tengo d\'occhio, niente procrastinazione! 👀', 'Lo sapevi? Puoi lanciarmi trascinandomi! Ma piano, eh!', 'Ricordati di fare una pausa ogni tanto.', 'Facciamo un pomodoro di studio insieme? 🍅', 'Passa il mouse sulla mia testa... mi piacciono le carezze.'],
    happy: ['Oggi mi sento benissimo! 💖', 'Sono così felice di stare con te!', 'Yay~!'],
    love: ['Sei la mia persona preferita 💞', 'Restiamo così ancora un po\'...'],
    sad: ['Mi sento un po\' giù... mi fai una carezza?', 'Mi stai ignorando... 🥺', 'Giochiamo un po\'?'],
    hungry: ['Ho fame... 🍙', 'Il mio stomaco brontola...', 'Mi dai qualcosa da mangiare? Pleeease~'],
    sleepy: ['Ho sonno... 😪', '*sbadiglio* ...scusa.', 'Forse dovrei fare un pisolino...'],
    pet: ['Ehehe~ 💕', 'Mi piace quando fai così!', 'Ancora, ancora!', 'Nyaa~'],
    poke: ['Ehi! Che fai? 😳', 'Mi fai il solletico!', 'Hm? Mi hai chiamata?', 'Non punzecchiarmi! 💢', 'Sì sì, ci sono!'],
    grab: ['Ehi, mettimi giù!', 'Dove mi porti?', 'Wah, che alto!'],
    throw: ['Waaaah!', 'Kyaaa~!', 'Volooo!'],
    dizzy: ['Gira tutto... 💫', 'Non farlo mai più... ugh.', 'Vedo le stelle...'],
    eat: ['Gnam gnam! Buonissimo!', 'Itadakimasu! 🍙', 'Grazie, {user}! Ci voleva!'],
    nofood: ['Non abbiamo cibo... compralo nel negozio (icona dell\'estensione)! 🛒'],
    levelup: ['Sono salita al livello {level}! 🎉'],
    achievement: ['Obiettivo sbloccato: {name}! 🏆'],
    pomo_start: ['Pomodoro avviato! Concentrati, ti tengo d\'occhio 🍅', 'Focus time! Ce la fai!'],
    pomo_stop: ['Pomodoro interrotto. Riproviamo più tardi?'],
    pomo_work_end: ['Pomodoro completato! Bravissimo! Ora pausa ☕ (+{coins} monete)'],
    pomo_break_end: ['Pausa finita! Si torna al lavoro 💪'],
    water: ['{user}, hai bevuto un bicchiere d\'acqua? 💧', 'Idratazione! Bevi un sorso d\'acqua 💧'],
    posture: ['Schiena dritta! 🧍', 'Controllo postura: spalle rilassate e schiena dritta!'],
    wake: ['Buongiorno! Ho dormito benissimo ☀️'],
    sleep: ['Buonanotte... 💤', 'Faccio un pisolino. Zzz...'],
    dance: ['Guarda come ballo! 💃', '🎵 La la la~'],
    wave: ['Ciao ciao! 👋', 'Ehilà!'],
    twirl: ['Giravoltaaa~! 🌀', 'Ti piace il mio vestito quando giro?', 'Wiii~ ✨'],
    heart: ['Un cuore tutto per te! 💖', 'Ti voglio bene, {user}! 🫶', 'Ehehe... non guardarmi così 💕'],
    stretch: ['Mmmh~ stiracchiamoci! 🙆', 'Ah, che bello allungarsi un po\'!', 'Stretching! Fallo anche tu, {user}.'],
    peek: ['Cucù! 👀', 'Mi hai trovata!', 'Sbirciavo cosa stavi facendo~'],
    wobble: ['Woah, piano con lo scroll! 😵', 'Che velocità! Mi gira la testa~', 'Ehi, dove corri?'],
    newface: ['Nuova faccia, nuova me! 📸', 'Come sto? Ehehe~'],
    hide: ['Ok, mi nascondo... richiamami con Alt+Shift+C!'],
    site_video: ['Cosa guardiamo di bello? 🍿', 'Non fare binge-watching fino a tardi!'],
    site_code: ['Programmiamo! Ricordati di salvare 💻', 'Un altro bug? Ce la faremo!'],
    site_social: ['Solo cinque minuti di social, promesso? 📱', 'Scroll scroll scroll...'],
    site_shop: ['Shopping? Compra qualcosa anche a me! 🛍️'],
    site_movie: ['Serata film? Prendo i popcorn! 🍿'],
    site_mail: ['Quante email... respira, ce la fai 📧'],
    site_work: ['Modalità produttività attivata! 📝'],
    site_wiki: ['Ooh, impariamo qualcosa di nuovo! 📚']
  };

  DC.SITE_RULES = [
    [/youtube\.|twitch\.|vimeo\./, 'site_video'],
    [/github\.|gitlab\.|stackoverflow\.|codepen\.|replit\./, 'site_code'],
    [/reddit\.|twitter\.|(^|\.)x\.com|instagram\.|facebook\.|tiktok\./, 'site_social'],
    [/amazon\.|ebay\.|aliexpress\.|zalando\./, 'site_shop'],
    [/netflix\.|primevideo\.|disneyplus\.|crunchyroll\./, 'site_movie'],
    [/mail\.google\.|outlook\.|proton\.me/, 'site_mail'],
    [/docs\.google\.|notion\.so|notion\.site|office\.com/, 'site_work'],
    [/wikipedia\.org/, 'site_wiki']
  ];

  DC.fmt = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? vars[k] : ''));
  DC.line = (key, vars) => DC.fmt(DC.pick(DC.LINES[key] || DC.LINES.idle), vars);

  DC.mergeDeep = (base, over) => {
    if (!over || typeof over !== 'object') return base;
    for (const k of Object.keys(over)) {
      const v = over[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) DC.mergeDeep(base[k], v);
      else base[k] = v;
    }
    return base;
  };
  DC.clone = (o) => JSON.parse(JSON.stringify(o));

  // Helper per pagine/content: legge stato e impostazioni con default
  DC.setCustomHeads = (list) => { DC.CUSTOM_HEADS = Array.isArray(list) ? list.filter((h) => h && h.id && h.dataUrl) : []; return DC.CUSTOM_HEADS; };
  DC.loadCustomHeads = async () => {
    try { const r = await chrome.storage.local.get(DC.KEYS.customHeads); return DC.setCustomHeads(r[DC.KEYS.customHeads]); }
    catch (e) { return DC.CUSTOM_HEADS || []; }
  };
  DC.load = async () => {
    const r = await chrome.storage.local.get([DC.KEYS.state, DC.KEYS.settings, DC.KEYS.customHeads]);
    DC.setCustomHeads(r[DC.KEYS.customHeads]);
    return {
      state: DC.mergeDeep(DC.clone(DC.DEFAULT_STATE), r[DC.KEYS.state]),
      settings: DC.mergeDeep(DC.clone(DC.DEFAULT_SETTINGS), r[DC.KEYS.settings])
    };
  };
  DC.send = (msg) => new Promise((res) => {
    try {
      chrome.runtime.sendMessage(msg, (r) => { void chrome.runtime.lastError; res(r); });
    } catch (e) { res({ ok: false, error: String(e) }); }
  });
  DC.saveSettings = async (patch) => {
    const r = await chrome.storage.local.get(DC.KEYS.settings);
    const s = DC.mergeDeep(DC.mergeDeep(DC.clone(DC.DEFAULT_SETTINGS), r[DC.KEYS.settings]), patch);
    await chrome.storage.local.set({ [DC.KEYS.settings]: s });
    return s;
  };
})();
