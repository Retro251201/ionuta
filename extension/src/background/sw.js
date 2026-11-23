/* Service worker: UNICO writer dello stato persistente (dc_state). Gestisce tick delle
 * statistiche, promemoria, pomodoro, chat (offline/IA), accesso locale, menu contestuali,
 * scorciatoie e finestra desktop. */
importScripts('../shared/heads.generated.js', '../shared/skins.js', '../shared/data.js', 'brain.js');
const K = DC.KEYS;

async function getLocal(key, def) { const r = await chrome.storage.local.get(key); return r[key] === undefined ? DC.clone(def) : r[key]; }
async function getState() { return DC.mergeDeep(DC.clone(DC.DEFAULT_STATE), await getLocal(K.state, {})); }
async function getSettings() { return DC.mergeDeep(DC.clone(DC.DEFAULT_SETTINGS), await getLocal(K.settings, {})); }
async function getProfile() { return getLocal(K.profile, null); }
async function vars() { const s = await getSettings(), p = await getProfile(); return { user: (p && p.username) || 'amico', name: s.name }; }

async function notify(title, message) {
  const s = await getSettings(); if (!s.notifications) return;
  try { chrome.notifications.create('', { type: 'basic', iconUrl: chrome.runtime.getURL('assets/icons/icon128.png'), title, message, priority: 0 }); } catch (e) {}
}
async function emit(ev) { await chrome.storage.local.set({ [K.event]: Object.assign({}, ev, { id: Math.random().toString(36).slice(2), t: Date.now() }) }); }

// ---------- coda di mutazioni (evita race condition tra schede) ----------
let queue = Promise.resolve();
function mutate(fn) {
  const p = queue.then(async () => {
    const s = await getState(), lvl = DC.levelOf(s.xp), events = [];
    const res = await fn(s, events);
    for (const k of Object.keys(s.stats)) s.stats[k] = DC.clamp(s.stats[k]);
    s.coins = Math.max(0, Math.round(s.coins));
    const nl = DC.levelOf(s.xp);
    if (nl > lvl) { s.coins += 10; events.push({ kind: 'levelup', text: DC.line('levelup', { level: nl }) + ' (+10 🪙)' }); }
    for (const a of DC.ACHIEVEMENTS) {
      if (!s.achievements[a.id] && a.check(s)) {
        s.achievements[a.id] = Date.now(); s.coins += 10;
        events.push({ kind: 'achievement', text: DC.line('achievement', { name: a.name }) + ' (+10 🪙)' });
        notify('🏆 Obiettivo sbloccato!', a.icon + ' ' + a.name + ' – ' + a.desc);
      }
    }
    await chrome.storage.local.set({ [K.state]: s });
    for (const ev of events) await emit(ev);
    updateBadge(s);
    return res;
  });
  queue = p.catch((e) => console.error('[DC] mutate', e));
  return p;
}

function doAction(msg) {
  return mutate((s) => {
    const c = s.counters;
    switch (msg.action) {
      case 'pet': c.pets++; s.stats.affection += 0.8; s.stats.happiness += 1.2; s.xp += 1; return { ok: true };
      case 'poke': c.pokes++; s.stats.happiness += 0.3; s.xp += 0.5; return { ok: true };
      case 'throw': c.throws++; s.stats.happiness -= 2; s.stats.affection -= 0.3; s.xp += 1; return { ok: true };
      case 'feed': {
        const it = DC.ITEMS[msg.itemId];
        if (!it || !(s.inventory[msg.itemId] > 0)) return { ok: false, reason: 'none' };
        s.inventory[msg.itemId]--;
        for (const [k, v] of Object.entries(it.effect)) s.stats[k] += v;
        c.feeds++; s.xp += 5; s.stats.affection += 1;
        return { ok: true, item: msg.itemId };
      }
      case 'buy': {
        const it = DC.ITEMS[msg.itemId]; if (!it) return { ok: false, reason: 'unknown' };
        const qty = Math.max(1, Math.min(10, msg.qty || 1));
        if (s.coins < it.price * qty) return { ok: false, reason: 'coins' };
        s.coins -= it.price * qty; s.inventory[msg.itemId] = (s.inventory[msg.itemId] || 0) + qty;
        return { ok: true };
      }
      case 'buyOutfit': {
        const o = DC.OUTFITS.find((x) => x.id === msg.outfitId); if (!o) return { ok: false, reason: 'unknown' };
        if (s.unlockedOutfits.includes(o.id)) return { ok: true, already: true };
        if (s.coins < o.price) return { ok: false, reason: 'coins' };
        s.coins -= o.price; s.unlockedOutfits.push(o.id); return { ok: true };
      }
      case 'game': {
        c.games++; s.xp += 3; s.stats.energy -= 2;
        if (msg.result === 'win') { c.wins++; s.coins += 5; s.stats.happiness += 3; }
        else s.stats.happiness += msg.result === 'lose' ? 5 : 2;
        return { ok: true };
      }
      case 'sleep': s.sleeping = !!msg.value; return { ok: true };
      case 'twirl': c.twirls = (c.twirls || 0) + 1; s.stats.happiness += 0.6; s.xp += 0.5; return { ok: true };
      case 'reset': {
        const fresh = DC.clone(DC.DEFAULT_STATE); fresh.createdAt = Date.now(); fresh.lastTick = Date.now();
        for (const k of Object.keys(s)) delete s[k]; Object.assign(s, fresh); return { ok: true };
      }
      default: return { ok: false, reason: 'unknown action' };
    }
  });
}

// ---------- tick statistiche (ogni minuto) ----------
async function tick() {
  let idle = 'active'; try { idle = await chrome.idle.queryState(120); } catch (e) {}
  const v = await vars();
  return mutate((s, events) => {
    const now = Date.now(); if (!s.createdAt) s.createdAt = now; if (!s.lastTick) s.lastTick = now;
    let mins = (now - s.lastTick) / 60000; s.lastTick = now;
    if (mins <= 0) return;
    const offline = mins > 3; mins = Math.min(mins, 720); const f = offline ? 0.35 : 1, st = s.stats;
    st.hunger -= 0.33 * mins * f;
    if (s.sleeping) {
      st.energy += 1.6 * mins;
      if (st.energy >= 100) { s.sleeping = false; events.push({ kind: 'info', text: DC.line('wake', v) }); }
    } else st.energy -= 0.22 * mins * f * (idle === 'active' ? 1 : 0.5);
    st.happiness -= (0.15 + (st.hunger < 25 ? 0.25 : 0) + (st.energy < 20 ? 0.15 : 0)) * mins * f;
    st.affection -= 0.015 * mins * f;
    if (!offline) {
      s.counters.minutes += mins;
      if (idle === 'active') {
        s.counters.activeMinutes += mins; s.coinAcc = (s.coinAcc || 0) + mins;
        while (s.coinAcc >= 5) { s.coinAcc -= 5; s.coins += 1; }
      }
    }
  });
}

async function updateBadge(s) {
  try {
    s = s || (await getState());
    const p = await getLocal(K.pomo, null);
    if (p && p.running && p.endsAt) {
      const m = Math.max(0, Math.ceil((p.endsAt - Date.now()) / 60000));
      await chrome.action.setBadgeBackgroundColor({ color: p.phase === 'work' ? '#ff5d8f' : '#20c997' });
      await chrome.action.setBadgeText({ text: m + 'm' });
    } else if (s.stats.hunger < 20 || s.stats.happiness < 25) {
      await chrome.action.setBadgeBackgroundColor({ color: '#f59f00' });
      await chrome.action.setBadgeText({ text: '!' });
    } else await chrome.action.setBadgeText({ text: '' });
  } catch (e) {}
}

// ---------- allarmi ----------
async function setupAlarms(force) {
  const st = await getSettings();
  if (!(await chrome.alarms.get('dc_tick'))) chrome.alarms.create('dc_tick', { periodInMinutes: 1 });
  const want = st.reminders.enabled ? { dc_water: Number(st.reminders.water) || 0, dc_posture: Number(st.reminders.posture) || 0 } : { dc_water: 0, dc_posture: 0 };
  for (const [name, mins] of Object.entries(want)) {
    const a = await chrome.alarms.get(name);
    if (!mins) { if (a) await chrome.alarms.clear(name); continue; }
    const period = Math.max(5, mins);
    if (!a || force || a.periodInMinutes !== period) chrome.alarms.create(name, { periodInMinutes: period, delayInMinutes: period });
  }
}

// ---------- pomodoro ----------
const POMO0 = { running: false, phase: 'idle', cycle: 0, endsAt: 0 };
async function pomo(cmd) {
  const set = await getSettings(); let p = await getLocal(K.pomo, POMO0); const v = await vars();
  if (cmd === 'start' || cmd === 'break') {
    const isBreak = cmd === 'break', mins = isBreak ? set.pomodoro.short : set.pomodoro.work;
    p = { running: true, phase: isBreak ? 'short' : 'work', cycle: p.cycle || 0, endsAt: Date.now() + mins * 60000, startedAt: Date.now() };
    await chrome.alarms.create('dc_pomo', { when: p.endsAt });
    await chrome.storage.local.set({ [K.pomo]: p });
    if (!isBreak) await emit({ kind: 'pomo', sub: 'start', text: DC.line('pomo_start', v) });
  } else if (cmd === 'stop') {
    p = Object.assign({}, p, { running: false, phase: 'idle', endsAt: 0 });
    await chrome.alarms.clear('dc_pomo');
    await chrome.storage.local.set({ [K.pomo]: p });
    await emit({ kind: 'pomo', sub: 'stop', text: DC.line('pomo_stop', v) });
  }
  updateBadge();
  return p;
}
async function pomoFinished() {
  const set = await getSettings(); const p = await getLocal(K.pomo, POMO0); const v = await vars();
  if (!p.running) return;
  if (p.phase === 'work') {
    const coins = 15;
    await mutate((s) => { s.counters.pomodoros++; s.coins += coins; s.xp += 20; s.stats.happiness += 5; });
    p.cycle = (p.cycle || 0) + 1;
    const long = p.cycle % Math.max(1, set.pomodoro.cycles) === 0;
    if (set.pomodoro.autoBreak) {
      p.phase = long ? 'long' : 'short'; p.endsAt = Date.now() + (long ? set.pomodoro.long : set.pomodoro.short) * 60000;
      await chrome.alarms.create('dc_pomo', { when: p.endsAt });
    } else Object.assign(p, { running: false, phase: 'idle', endsAt: 0 });
    await chrome.storage.local.set({ [K.pomo]: p });
    const text = DC.line('pomo_work_end', Object.assign({ coins }, v));
    await emit({ kind: 'pomo', sub: 'work_end', text }); notify('🍅 Pomodoro completato!', text);
  } else {
    Object.assign(p, { running: false, phase: 'idle', endsAt: 0 });
    await chrome.storage.local.set({ [K.pomo]: p });
    const text = DC.line('pomo_break_end', v);
    await emit({ kind: 'pomo', sub: 'break_end', text }); notify('☕ Pausa finita', text);
  }
  updateBadge();
}

chrome.alarms.onAlarm.addListener(async (a) => {
  if (a.name === 'dc_tick') { await tick(); }
  else if (a.name === 'dc_pomo') await pomoFinished();
  else if (a.name === 'dc_water' || a.name === 'dc_posture') {
    const kind = a.name === 'dc_water' ? 'water' : 'posture', text = DC.line(kind, await vars());
    await emit({ kind: 'reminder', sub: kind, text });
    notify(kind === 'water' ? '💧 Promemoria acqua' : '🧍 Promemoria postura', text);
  }
});

// ---------- chat ----------
async function chatReply(text, page, opts = {}) {
  text = String(text || '').slice(0, 1500);
  const set = await getSettings(), st = await getState(), prof = await getProfile();
  const ctx = { user: (prof && prof.username) || 'amico', name: set.name, stats: st.stats, level: DC.levelOf(st.xp), coins: st.coins, mood: DC.moodOf(st, st.sleeping), page };
  const hist = await getLocal(K.chat, []);
  let reply;
  const ai = set.ai, local = /localhost|127\.0\.0\.1/.test(ai.endpoint || '');
  if (ai.enabled && ai.endpoint && (ai.apiKey || local)) {
    try { reply = await aiReply(set, ctx, hist, text); }
    catch (e) { reply = DC.Brain.reply(text, ctx) + `\n(⚠️ IA non raggiungibile: ${e.message || e})`; }
  } else reply = DC.Brain.reply(text, ctx);
  if (!opts.noHistory) {
    hist.push({ role: 'user', text, t: Date.now() }, { role: 'assistant', text: reply, t: Date.now() });
    await chrome.storage.local.set({ [K.chat]: hist.slice(-80) });
    await mutate((s) => { s.counters.chats++; s.xp += 1; s.stats.happiness += 0.5; s.stats.affection += 0.2; });
  }
  return reply;
}

async function aiReply(set, ctx, hist, text) {
  const st = ctx.stats;
  let sys = DC.fmt(set.ai.persona, ctx);
  sys += `\nStato (0-100): sazietà ${Math.round(st.hunger)}, energia ${Math.round(st.energy)}, felicità ${Math.round(st.happiness)}, affetto ${Math.round(st.affection)}. Umore: ${ctx.mood}. Livello ${ctx.level}. Data/ora: ${new Date().toLocaleString('it-IT')}.`;
  if (ctx.page && ctx.page.title) sys += ` L'utente sta guardando la pagina "${ctx.page.title}" (${ctx.page.host}).`;
  const messages = [{ role: 'system', content: sys }, ...hist.slice(-12).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: text }];
  const headers = { 'Content-Type': 'application/json' };
  if (set.ai.apiKey) headers.Authorization = 'Bearer ' + set.ai.apiKey;
  const ctrl = new AbortController(), to = setTimeout(() => ctrl.abort(), 25000);
  let r;
  try { r = await fetch(set.ai.endpoint, { method: 'POST', headers, body: JSON.stringify({ model: set.ai.model, messages, max_tokens: 220, temperature: 0.85 }), signal: ctrl.signal }); }
  finally { clearTimeout(to); }
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json();
  const out = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || (j.message && j.message.content);
  if (!out) throw new Error('risposta vuota');
  return String(out).trim().slice(0, 900);
}

// ---------- accesso locale (profilo + password PBKDF2) ----------
const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
async function hashPw(pw, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unb64(salt), iterations }, key, 256));
}
async function getSession() { return (await chrome.storage.session.get(K.session))[K.session] || null; }
let fails = 0, lockUntil = 0;
async function auth(msg) {
  const prof = await getProfile(), sess = await getSession();
  switch (msg.type) {
    case 'auth:status': return { ok: true, hasProfile: !!prof, loggedIn: !!sess, user: (sess && sess.user) || (prof && prof.username) || '' };
    case 'auth:register': {
      if (prof && !sess) return { ok: false, error: 'Esiste già un profilo: accedi oppure reimpostalo.' };
      const u = String(msg.username || '').trim(), pw = String(msg.password || '');
      if (u.length < 2 || u.length > 24) return { ok: false, error: 'Il nome deve avere 2-24 caratteri.' };
      if (pw.length < 4) return { ok: false, error: 'La password deve avere almeno 4 caratteri.' };
      const salt = b64(crypto.getRandomValues(new Uint8Array(16))), iterations = 150000;
      await chrome.storage.local.set({ [K.profile]: { username: u, salt, iterations, hash: await hashPw(pw, salt, iterations), createdAt: Date.now() } });
      await chrome.storage.session.set({ [K.session]: { user: u, t: Date.now() } });
      return { ok: true, user: u };
    }
    case 'auth:login': {
      if (!prof) return { ok: false, error: 'Nessun profilo: creane uno.' };
      if (Date.now() < lockUntil) return { ok: false, error: `Troppi tentativi. Riprova tra ${Math.ceil((lockUntil - Date.now()) / 1000)}s.` };
      const h = await hashPw(String(msg.password || ''), prof.salt, prof.iterations || 150000);
      if (h !== prof.hash || String(msg.username || '').trim().toLowerCase() !== prof.username.toLowerCase()) {
        if (++fails >= 5) { lockUntil = Date.now() + 60000; fails = 0; }
        return { ok: false, error: 'Nome utente o password errati.' };
      }
      fails = 0;
      await chrome.storage.session.set({ [K.session]: { user: prof.username, t: Date.now() } });
      return { ok: true, user: prof.username };
    }
    case 'auth:logout': await chrome.storage.session.remove(K.session); return { ok: true };
    case 'auth:changePassword': {
      if (!prof || !sess) return { ok: false, error: 'Devi aver effettuato l\'accesso.' };
      if ((await hashPw(String(msg.oldPassword || ''), prof.salt, prof.iterations || 150000)) !== prof.hash) return { ok: false, error: 'Password attuale errata.' };
      if (String(msg.newPassword || '').length < 4) return { ok: false, error: 'Nuova password troppo corta.' };
      const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
      await chrome.storage.local.set({ [K.profile]: Object.assign({}, prof, { salt, iterations: 150000, hash: await hashPw(msg.newPassword, salt, 150000) }) });
      return { ok: true };
    }
    case 'auth:reset': {
      await chrome.storage.local.remove(K.profile); await chrome.storage.session.remove(K.session);
      await DC.saveSettings({ requireLogin: false });
      return { ok: true };
    }
  }
  return { ok: false, error: 'comando sconosciuto' };
}

// ---------- finestra desktop ----------
async function openWindow() {
  const r = await chrome.storage.session.get('dc_winId');
  if (r.dc_winId) { try { await chrome.windows.update(r.dc_winId, { focused: true }); return; } catch (e) {} }
  const w = await chrome.windows.create({ url: chrome.runtime.getURL('src/window/window.html'), type: 'popup', width: 460, height: 620 });
  await chrome.storage.session.set({ dc_winId: w.id });
}
chrome.windows.onRemoved.addListener(async (id) => {
  const r = await chrome.storage.session.get(['dc_winId', 'dc_stageWinId']);
  if (r.dc_winId === id) chrome.storage.session.remove('dc_winId');
  if (r.dc_stageWinId === id) chrome.storage.session.remove('dc_stageWinId');
});

// ---------- anteprima 3D ----------
// Il renderer WebGL vive nella pagina src/stage/: il service worker si limita ad aprirla (una sola finestra).
async function openStage() {
  const r = await chrome.storage.session.get('dc_stageWinId');
  if (r.dc_stageWinId) { try { await chrome.windows.update(r.dc_stageWinId, { focused: true }); return; } catch (e) {} }
  const w = await chrome.windows.create({ url: chrome.runtime.getURL('src/stage/stage.html'), type: 'popup', width: 1180, height: 840 });
  await chrome.storage.session.set({ dc_stageWinId: w.id });
}
// Definizione del personaggio 3D in un backup importato: qui solo forma e dimensione, la normalizzazione completa
// avviene nel motore 3D a ogni lettura (core/character-def.js).
function cleanAvatar(a) {
  if (!a || typeof a !== 'object' || Array.isArray(a)) return null;
  try { return JSON.stringify(a).length <= 20000 ? a : null; } catch (e) { return null; }
}

async function toggleEnabled() { const s = await getSettings(); await DC.saveSettings({ enabled: !s.enabled }); }
async function sendToTab(tabId, msg) { try { await chrome.tabs.sendMessage(tabId, msg); } catch (e) {} }
async function activeTab() { const [t] = await chrome.tabs.query({ active: true, lastFocusedWindow: true }); return t; }

// ---------- menu contestuali ----------
async function setupMenus() {
  const s = await getSettings();
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: 'dc_read', title: `🔊 Fai leggere a ${s.name}`, contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'dc_ask', title: `💬 Chiedi a ${s.name}: "%s"`, contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'dc_summon', title: `✨ Chiama ${s.name} qui`, contexts: ['page'] });
  chrome.contextMenus.create({ id: 'dc_window', title: '🪟 Finestra desktop del companion', contexts: ['action'] });
  chrome.contextMenus.create({ id: 'dc_toggle', title: '👁️ Mostra / nascondi companion', contexts: ['action'] });
}
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const id = info.menuItemId, tabId = tab && tab.id;
  if (id === 'dc_read' && tabId != null) sendToTab(tabId, { type: 'speak', text: info.selectionText || '' });
  else if (id === 'dc_ask' && tabId != null) {
    const reply = await chatReply(`Riguardo a questo testo: "${(info.selectionText || '').slice(0, 1200)}" – cosa ne pensi o cosa significa?`, { title: tab.title, host: info.pageUrl ? new URL(info.pageUrl).hostname : '' });
    sendToTab(tabId, { type: 'say', text: reply });
  } else if (id === 'dc_summon' && tabId != null) sendToTab(tabId, { type: 'summon' });
  else if (id === 'dc_window') openWindow();
  else if (id === 'dc_toggle') toggleEnabled();
});

chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd === 'toggle-companion') toggleEnabled();
  else if (cmd === 'open-window') openWindow();
  else if (cmd === 'summon') { const t = await activeTab(); if (t) sendToTab(t.id, { type: 'summon' }); }
});

// ---------- teste personalizzate ----------
// Foto caricate dall'utente (Opzioni > Le tue teste). Il SW valida e salva in dc_customHeads.
// La foto NON viene mai stilizzata: l'editor fa solo ritaglio, scontorno (alpha) e ancoraggio.
const HEAD_RE = /^data:image\/(png|webp);base64,[A-Za-z0-9+/]+=*$/;
const HEAD_MAX_CHARS = 1.5 * 1024 * 1024;
function cleanHead(h, old) {
  if (!h || typeof h !== 'object') throw new Error('Dati non validi');
  const base = old || {};
  const dataUrl = h.dataUrl !== undefined ? String(h.dataUrl) : base.dataUrl;
  if (!dataUrl || !HEAD_RE.test(dataUrl)) throw new Error('Immagine non valida (solo PNG o WebP)');
  if (dataUrl.length > HEAD_MAX_CHARS) throw new Error('Immagine troppo grande (max ~1,5 MB)');
  const num = (v, a, b, d) => { const n = Number(v); return Number.isFinite(n) ? Math.max(a, Math.min(b, n)) : d; };
  const pick = (k, d) => (h[k] !== undefined ? h[k] : base[k] !== undefined ? base[k] : d);
  const skin = String(pick('skin', '#e8c4a8'));
  return {
    id: base.id || 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    custom: true,
    name: String(pick('name', 'La mia foto')).trim().slice(0, 40) || 'La mia foto',
    dataUrl,
    w: Math.round(num(pick('w', 512), 16, 1024, 512)),
    h: Math.round(num(pick('h', 512), 16, 1024, 512)),
    anchorX: num(pick('anchorX', 0.5), 0, 1, 0.5),
    anchorY: num(pick('anchorY', 0.94), 0, 1, 0.94),
    faceW: num(pick('faceW', 0.6), 0.15, 1.2, 0.6),
    skin: /^#[0-9a-f]{6}$/i.test(skin) ? skin : '#e8c4a8',
    createdAt: base.createdAt || Date.now()
  };
}
let headQueue = Promise.resolve();
function headsOp(fn) {
  const p = headQueue.then(async () => {
    const r = await chrome.storage.local.get(K.customHeads);
    return fn(Array.isArray(r[K.customHeads]) ? r[K.customHeads] : []);
  });
  headQueue = p.catch((e) => console.error('[DC] heads', e));
  return p;
}
const saveHeads = (list) => chrome.storage.local.set({ [K.customHeads]: list });
async function heads(msg) {
  switch (msg.type) {
    case 'heads:list': return headsOp(async (list) => ({ ok: true, heads: list }));
    case 'heads:add': return headsOp(async (list) => {
      if (list.length >= DC.MAX_CUSTOM_HEADS) return { ok: false, error: `Puoi salvare al massimo ${DC.MAX_CUSTOM_HEADS} foto` };
      let h; try { h = cleanHead(msg.head); } catch (e) { return { ok: false, error: e.message }; }
      list.push(h);
      try { await saveHeads(list); } catch (e) { return { ok: false, error: 'Spazio insufficiente: ' + (e.message || e) }; }
      await mutate((s) => { s.counters.customHeads = (s.counters.customHeads || 0) + 1; s.xp += 5; s.stats.happiness += 3; });
      if (msg.select) { await DC.saveSettings({ headId: h.id }); await emit({ kind: 'newface', text: DC.line('newface', await vars()) }); }
      return { ok: true, head: h };
    });
    case 'heads:update': return headsOp(async (list) => {
      const i = list.findIndex((x) => x.id === msg.id); if (i < 0) return { ok: false, error: 'Foto non trovata' };
      let h; try { h = cleanHead(msg.head || {}, list[i]); } catch (e) { return { ok: false, error: e.message }; }
      list[i] = h; await saveHeads(list); return { ok: true, head: h };
    });
    case 'heads:remove': return headsOp(async (list) => {
      const next = list.filter((x) => x.id !== msg.id); if (next.length === list.length) return { ok: false, error: 'Foto non trovata' };
      await saveHeads(next);
      const s = await getSettings(); if (s.headId === msg.id) await DC.saveSettings({ headId: 'head_04' });
      return { ok: true };
    });
  }
  return { ok: false, error: 'tipo sconosciuto' };
}
function cleanHeadList(arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const h of arr.slice(0, DC.MAX_CUSTOM_HEADS)) { try { out.push(cleanHead(h, h && h.id ? { id: String(h.id).slice(0, 40), createdAt: h.createdAt } : null)); } catch (e) {} }
  return out;
}

// ---------- router messaggi ----------
async function route(msg) {
  if (!msg || !msg.type) return { ok: false };
  if (msg.type.startsWith('auth:')) return auth(msg);
  if (msg.type.startsWith('heads:')) return heads(msg);
  switch (msg.type) {
    case 'action': return doAction(msg);
    case 'chat': return { ok: true, reply: await chatReply(msg.text, msg.page) };
    case 'pomodoro': return { ok: true, pomo: await pomo(msg.cmd) };
    case 'openWindow': await openWindow(); return { ok: true };
    case 'openStage': await openStage(); return { ok: true };
    case 'openOptions': await chrome.runtime.openOptionsPage(); return { ok: true };
    case 'testAI': {
      const s = await getSettings();
      try { const r = await aiReply(s, { user: 'test', name: s.name, stats: DC.DEFAULT_STATE.stats, level: 1, mood: 'happy' }, [], 'Rispondi solo con: ok, funziono! ✨'); return { ok: true, reply: r }; }
      catch (e) { return { ok: false, error: String(e.message || e) }; }
    }
    case 'clearChat': await chrome.storage.local.set({ [K.chat]: [] }); return { ok: true };
    case 'exportData': return { ok: true, data: await chrome.storage.local.get(null) };
    case 'importData': {
      const d = msg.data; if (!d || typeof d !== 'object' || !d[K.state]) return { ok: false, error: 'File non valido' };
      const allowed = [K.state, K.settings, K.profile, K.chat];
      const clean = {}; for (const k of allowed) if (d[k] !== undefined) clean[k] = d[k];
      if (d[K.customHeads] !== undefined) clean[K.customHeads] = cleanHeadList(d[K.customHeads]);
      if (d[K.avatar] !== undefined) { const a = cleanAvatar(d[K.avatar]); if (a) clean[K.avatar] = a; }
      await chrome.storage.local.set(clean); await setupAlarms(true); await setupMenus(); return { ok: true };
    }
  }
  return { ok: false, error: 'tipo sconosciuto' };
}
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  route(msg).then(sendResponse, (e) => sendResponse({ ok: false, error: String((e && e.message) || e) }));
  return true;
});

// reazioni ai cambi impostazioni
chrome.storage.onChanged.addListener((ch, area) => {
  if (area !== 'local' || !ch[K.settings]) return;
  const o = ch[K.settings].oldValue || {}, n = ch[K.settings].newValue || {};
  if (JSON.stringify(o.reminders) !== JSON.stringify(n.reminders)) setupAlarms(true);
  if (o.name !== n.name) setupMenus();
});

async function init() {
  try { await chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' }); } catch (e) {}
  await setupAlarms(); await setupMenus(); await updateBadge();
}
chrome.runtime.onInstalled.addListener(async (d) => {
  const r = await chrome.storage.local.get([K.state, K.settings]);
  if (!r[K.settings]) await chrome.storage.local.set({ [K.settings]: DC.clone(DC.DEFAULT_SETTINGS) });
  if (!r[K.state]) { const s = DC.clone(DC.DEFAULT_STATE); s.createdAt = s.lastTick = Date.now(); await chrome.storage.local.set({ [K.state]: s }); }
  await init();
  if (d.reason === 'install') chrome.tabs.create({ url: chrome.runtime.getURL('src/options/options.html#benvenuto') });
});
chrome.runtime.onStartup.addListener(init);
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' }).catch(() => {});
