/* Popup dell'estensione: stato, negozio, stile, pomodoro, obiettivi, gioco, accesso. */
(async function () {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const K = DC.KEYS;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const STAT_LAB = { hunger: '🍙 Sazietà', energy: '⚡ Energia', happiness: '😊 Felicità', affection: '💖 Affetto' };
  const STAT_COL = { hunger: '#f59f00', energy: '#4dabf7', happiness: '#20c997', affection: '#ff5d8f' };
  const CNT_LAB = { pets: '🤚 Carezze', pokes: '👉 Colpetti', feeds: '🍙 Pasti', throws: '🌀 Lanci', chats: '💬 Messaggi', pomodoros: '🍅 Pomodoro', games: '🎮 Partite', wins: '🏅 Vittorie' };
  const PHASE = { work: '🍅 Focus', short: '☕ Pausa breve', long: '🛋️ Pausa lunga', idle: 'Pronto' };
  let S, ST, P = null, CHAT = [], AUTH = {}, lookKey = '';
  const bodies = [];

  function toast(text) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = text; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }
  async function loadAll() {
    const d = await DC.load(); S = d.settings; ST = d.state;
    const r = await chrome.storage.local.get([K.pomo, K.chat]); P = r[K.pomo] || null; CHAT = r[K.chat] || [];
  }

  // ---------- anteprime ----------
  function makePreview(box) { const b = new DC.Body(); box.innerHTML = ''; box.appendChild(b.svg); bodies.push(b); return b; }
  function applyLook() {
    const key = [S.headId, S.outfitId, S.hairStyle, S.hairColor, S.accessory, (DC.CUSTOM_HEADS || []).map((h) => h.id + h.createdAt).join(',')].join('|');
    if (key === lookKey) return; lookKey = key;
    const h = DC.headById(S.headId), o = DC.outfitById(S.outfitId);
    for (const b of bodies) {
      b.look = { hair: S.hairStyle || 'long', hairColor: S.hairColor || '#3a2a33', accessory: S.accessory || 'none' };
      b.outfit = o; b.setHead(h, DC.headUrl(h));
    }
  }
  function animate(t) {
    const s = t / 1000;
    for (const b of bodies) {
      const p = DC.Body.restPose();
      p.sqy = 1 + 0.012 * Math.sin(s * 2.2); p.sqx = 1 - 0.006 * Math.sin(s * 2.2);
      p.headTilt = 2.5 * Math.sin(s * 0.9); p.aR = [-10 - 4 * Math.sin(s * 1.3), 6]; p.aL = [10 + 3 * Math.sin(s * 1.1), -6];
      p.skirt = 1.5 * Math.sin(s * 1.7);
      if (ST && ST.sleeping) { p.headTilt = 12; p.aL = [4, -2]; p.aR = [-4, 2]; }
      b.setPose(p);
    }
    requestAnimationFrame(animate);
  }

  // ---------- render ----------
  function render() {
    $('#cName').textContent = S.name;
    $('#mood').textContent = DC.MOOD_LABEL[DC.moodOf(ST, ST.sleeping)] || '';
    $('#coins').textContent = ST.coins;
    const lv = DC.levelOf(ST.xp), a = DC.xpForLevel(lv), b = DC.xpForLevel(lv + 1);
    $('#lvl').textContent = lv; $('#xpbar').style.width = Math.round(((ST.xp - a) / (b - a)) * 100) + '%';
    $('#xpbar').parentElement.title = `XP ${Math.floor(ST.xp)} / ${b}`;
    $('#qToggle').textContent = S.enabled ? '👁️ Nascondi' : '👁️ Mostra';
    $('#qSleep').textContent = ST.sleeping ? '☀️ Sveglia' : '😴 Dormi';
    applyLook(); renderStats(); renderInv(); renderShop(); renderStyle(); renderPomo(); renderGoals(); renderChat(); renderReminders();
  }
  function renderStats() {
    $('#stats').innerHTML = Object.keys(STAT_LAB).map((k) => {
      const v = Math.round(ST.stats[k]);
      return `<div class="stat"><div class="lab"><span>${STAT_LAB[k]}</span><b>${v}%</b></div><div class="bar"><i style="width:${v}%;background:${STAT_COL[k]}"></i></div></div>`;
    }).join('');
  }
  function renderInv() {
    const ent = Object.entries(ST.inventory).filter(([id, n]) => n > 0 && DC.ITEMS[id]);
    $('#inv').innerHTML = ent.length ? ent.map(([id, n]) => `<button class="it" data-id="${id}" title="${esc(DC.ITEMS[id].name)}">${DC.ITEMS[id].icon}<b>×${n}</b></button>`).join('') : '<span class="muted">Zaino vuoto — passa al negozio 🛒</span>';
  }
  const effText = (e) => Object.entries(e).map(([k, v]) => `${STAT_LAB[k].split(' ')[0]} ${v > 0 ? '+' : ''}${v}`).join(' · ');
  function renderShop() {
    $('#shop').innerHTML = Object.entries(DC.ITEMS).map(([id, it]) => `
      <div class="card"><div class="row2"><span class="ic">${it.icon}</span><span class="muted">hai ${ST.inventory[id] || 0}</span></div>
      <div class="nm">${esc(it.name)}</div><div class="eff">${effText(it.effect)}</div>
      <button class="btn primary" data-buy="${id}" ${ST.coins < it.price ? 'disabled' : ''}>Compra · ${it.price} 🪙</button></div>`).join('');
  }
  function renderStyle() {
    $('#heads').innerHTML = DC.allHeads().map((h) => `<button data-head="${esc(h.id)}" class="${h.id === S.headId ? 'on' : ''} ${h.custom ? 'custom' : ''}" title="${esc(h.name)}${h.custom ? ' (tua foto)' : ''}"><img src="${esc(DC.headUrl(h))}" alt="${esc(h.name)}"></button>`).join('');
    $('#hairs').innerHTML = DC.HAIR_STYLES.map((x) => `<button data-hair="${x.id}" class="${x.id === S.hairStyle ? 'on' : ''}">${esc(x.name)}</button>`).join('');
    $('#hairColors').innerHTML = DC.HAIR_COLORS.map((x) => `<button data-hcolor="${x.id}" class="${x.id === S.hairColor ? 'on' : ''}" title="${esc(x.name)}" style="background:${x.id}"></button>`).join('');
    $('#hairColors').style.display = S.hairStyle === 'none' ? 'none' : '';
    $('#accs').innerHTML = DC.ACCESSORIES.map((x) => `<button data-acc="${x.id}" class="${x.id === S.accessory ? 'on' : ''}">${x.icon || ''} ${esc(x.name)}</button>`).join('');
    $('#outfits').innerHTML = DC.OUTFITS.map((o) => {
      const own = ST.unlockedOutfits.includes(o.id), on = o.id === S.outfitId;
      const sw = [o.top, o.top2, o.accent, o.skirt].map((c) => `<i style="background:${c}"></i>`).join('');
      return `<button data-outfit="${o.id}" class="${on ? 'on' : ''}"><span>${o.icon} ${esc(o.name)}<span class="sw">${sw}</span></span><span class="muted">${on ? '✓ indossato' : own ? 'Indossa' : o.price + ' 🪙'}</span></button>`;
    }).join('');
  }
  const mmss = (ms) => { const t = Math.max(0, Math.round(ms / 1000)); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
  function renderPomo() {
    const run = P && P.running && P.endsAt;
    $('#pomoPhase').textContent = PHASE[run ? P.phase : 'idle'];
    $('#pomoTime').textContent = run ? mmss(P.endsAt - Date.now()) : mmss(S.pomodoro.work * 60000);
    $('#pomoStop').disabled = !run;
    const cyc = S.pomodoro.cycles; const c = (P && P.cycle) || 0;
    $('#pomoInfo').textContent = `Ciclo ${c % cyc}/${cyc} · Pomodoro completati: ${ST.counters.pomodoros} · Focus ${S.pomodoro.work}m / pausa ${S.pomodoro.short}m / lunga ${S.pomodoro.long}m`;
  }
  function renderReminders() {
    const set = (id, prop, v) => { const el = $(id); if (document.activeElement !== el) el[prop] = v; };
    set('#remOn', 'checked', !!S.reminders.enabled); set('#remWater', 'value', S.reminders.water); set('#remPosture', 'value', S.reminders.posture);
  }
  function renderGoals() {
    const got = DC.ACHIEVEMENTS.filter((a) => ST.achievements[a.id]).length;
    $('#goalsCount').textContent = `Sbloccati ${got} / ${DC.ACHIEVEMENTS.length}`;
    $('#ach').innerHTML = DC.ACHIEVEMENTS.map((a) => `<div class="a ${ST.achievements[a.id] ? '' : 'lock'}" title="${esc(a.desc)}"><b>${a.icon} ${esc(a.name)}</b>${esc(a.desc)}</div>`).join('');
    const c = ST.counters, h = Math.floor(c.minutes / 60), m = Math.floor(c.minutes % 60);
    $('#counters').innerHTML = Object.entries(CNT_LAB).map(([k, l]) => `<span>${l}</span><b>${Math.floor(c[k] || 0)}</b>`).join('') + `<span>⏱️ Tempo insieme</span><b>${h}h ${m}m</b>`;
  }
  function renderChat() {
    const box = $('#chatlog');
    const last = CHAT.slice(-20);
    box.innerHTML = last.length ? last.map((m) => `<div class="m ${m.role}">${esc(m.text)}</div>`).join('') : `<span class="muted">Saluta ${esc(S.name)}! 👋</span>`;
    box.scrollTop = box.scrollHeight;
  }

  // ---------- account ----------
  async function renderAccount() {
    AUTH = await DC.send({ type: 'auth:status' }) || {};
    const box = $('#account');
    if (!AUTH.loggedIn) {
      box.innerHTML = `<p class="muted">${AUTH.hasProfile ? '' : 'Crea un profilo: il companion ti chiamerà per nome e potrai proteggerlo con una password.'}</p><div id="accAuth"></div>`;
      return DC.AuthUI.mount($('#accAuth'), () => { renderAccount(); toast('Benvenuto! 💕'); });
    }
    box.innerHTML = `
      <div class="acc-box"><div>Connesso come <b>${esc(AUTH.user)}</b> 💖</div>
        <label class="row"><input type="checkbox" id="reqLogin" ${S.requireLogin ? 'checked' : ''}> Richiedi password per usare il companion</label>
        <button class="btn" id="logout">Esci</button></div>
      <h3>Cambia password</h3>
      <div class="acc-box"><input type="password" id="pwOld" placeholder="Password attuale"><input type="password" id="pwNew" placeholder="Nuova password">
        <button class="btn" id="pwGo">Aggiorna</button><div class="a-err" id="pwErr"></div></div>
      <h3>Zona pericolosa</h3>
      <button class="btn danger" id="accReset">Elimina profilo</button>`;
    $('#reqLogin').onchange = (e) => DC.saveSettings({ requireLogin: e.target.checked });
    $('#logout').onclick = async () => { await DC.send({ type: 'auth:logout' }); gate(); };
    $('#pwGo').onclick = async () => {
      const r = await DC.send({ type: 'auth:changePassword', oldPassword: $('#pwOld').value, newPassword: $('#pwNew').value });
      $('#pwErr').textContent = r && r.ok ? '' : (r && r.error) || 'Errore'; if (r && r.ok) { toast('Password aggiornata ✅'); $('#pwOld').value = $('#pwNew').value = ''; }
    };
    $('#accReset').onclick = async () => { if (confirm('Eliminare il profilo (nome e password)? I progressi del companion restano.')) { await DC.send({ type: 'auth:reset' }); renderAccount(); } };
  }

  async function gate() {
    await loadAll();
    AUTH = await DC.send({ type: 'auth:status' }) || {};
    if (S.requireLogin && AUTH.hasProfile && !AUTH.loggedIn) {
      $('#app').classList.add('hidden'); $('#login').classList.remove('hidden');
      DC.AuthUI.mount($('#login'), () => gate());
    } else {
      $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
      render(); renderAccount();
    }
  }

  // ---------- eventi ----------
  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tab]'); if (!b) return;
    $$('#tabs button').forEach((x) => x.classList.toggle('on', x === b));
    $$('.tab').forEach((t) => t.classList.toggle('on', t.id === 'tab-' + b.dataset.tab));
    localStorage.setItem('dc_tab', b.dataset.tab);
  });
  const lastTab = localStorage.getItem('dc_tab'); if (lastTab) { const b = $(`#tabs button[data-tab="${lastTab}"]`); if (b) b.click(); }

  document.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.q) {
      const q = t.dataset.q;
      if (q === 'toggle') await DC.saveSettings({ enabled: !S.enabled });
      else if (q === 'sleep') await DC.send({ type: 'action', action: 'sleep', value: !ST.sleeping });
      else if (q === 'window') { await DC.send({ type: 'openWindow' }); window.close(); }
      else if (q === 'stage') { await DC.send({ type: 'openStage' }); window.close(); }
      else if (q === 'summon') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        try { await chrome.tabs.sendMessage(tab.id, { type: 'summon' }); window.close(); } catch (err) { toast('Non disponibile in questa pagina 🙅'); }
      }
    } else if (t.classList.contains('it')) {
      const r = await DC.send({ type: 'action', action: 'feed', itemId: t.dataset.id });
      toast(r && r.ok ? `${DC.ITEMS[t.dataset.id].icon} Gnam gnam!` : 'Niente da mangiare…');
    } else if (t.dataset.buy) {
      const r = await DC.send({ type: 'action', action: 'buy', itemId: t.dataset.buy });
      toast(r && r.ok ? `Comprato ${DC.ITEMS[t.dataset.buy].icon}!` : 'Monete insufficienti 🪙');
    } else if (t.dataset.head) {
      await DC.saveSettings({ headId: t.dataset.head });
    } else if (t.dataset.hair) {
      await DC.saveSettings({ hairStyle: t.dataset.hair });
    } else if (t.dataset.hcolor) {
      await DC.saveSettings({ hairColor: t.dataset.hcolor });
    } else if (t.dataset.acc) {
      await DC.saveSettings({ accessory: t.dataset.acc });
    } else if (t.id === 'addHead') {
      chrome.tabs.create({ url: chrome.runtime.getURL('src/options/options.html#teste') }); window.close();
    } else if (t.dataset.outfit) {
      const o = DC.outfitById(t.dataset.outfit);
      if (!ST.unlockedOutfits.includes(o.id)) {
        if (ST.coins < o.price) return toast(`Servono ${o.price} 🪙`);
        if (!confirm(`Comprare "${o.name}" per ${o.price} monete?`)) return;
        const r = await DC.send({ type: 'action', action: 'buyOutfit', outfitId: o.id });
        if (!r || !r.ok) return toast('Acquisto non riuscito');
        toast('Nuovo outfit sbloccato! ✨');
      }
      await DC.saveSettings({ outfitId: o.id });
    } else if (t.dataset.m) playRps(t.dataset.m);
  });

  $('#pomoStart').onclick = () => DC.send({ type: 'pomodoro', cmd: 'start' });
  $('#pomoBreak').onclick = () => DC.send({ type: 'pomodoro', cmd: 'break' });
  $('#pomoStop').onclick = () => DC.send({ type: 'pomodoro', cmd: 'stop' });
  const saveRem = () => DC.saveSettings({ reminders: { enabled: $('#remOn').checked, water: Math.max(0, +$('#remWater').value || 0), posture: Math.max(0, +$('#remPosture').value || 0) } });
  ['#remOn', '#remWater', '#remPosture'].forEach((s) => $(s).addEventListener('change', saveRem));

  async function sendChat() {
    const inp = $('#chatIn'), text = inp.value.trim(); if (!text) return;
    inp.value = ''; CHAT.push({ role: 'user', text }); renderChat();
    const r = await DC.send({ type: 'chat', text, page: null });
    if (!r || !r.ok) toast('Errore chat');
  }
  $('#chatGo').onclick = sendChat;
  $('#chatIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

  // ---------- morra cinese ----------
  const RPS = { rock: '✊', paper: '✋', scissors: '✌️' }, BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
  const score = { w: 0, l: 0, d: 0 };
  async function playRps(me) {
    const her = Object.keys(RPS)[Math.floor(Math.random() * 3)];
    const result = me === her ? 'draw' : BEATS[me] === her ? 'win' : 'lose';
    score[result[0]]++;
    const msg = { win: ['Hai vinto! +5 🪙 …la prossima vinco io! 😤', 'Nooo! Hai vinto tu! 😭'], lose: ['Ho vinto io! Ehehe~ ✌️', 'Sono troppo forte! 😜'], draw: ['Pareggio! Ancora una! 🤝', 'Ci leggiamo nel pensiero? 👀'] }[result];
    $('#rpsRes').innerHTML = `<div class="big">${RPS[me]} vs ${RPS[her]}</div>${msg[Math.floor(Math.random() * msg.length)]}`;
    $('#rpsScore').textContent = `Sessione: ${score.w} vittorie · ${score.l} sconfitte · ${score.d} pareggi`;
    await DC.send({ type: 'action', action: 'game', result });
  }

  $('#openOptions').onclick = () => chrome.runtime.openOptionsPage();
  $('#ver').textContent = 'v' + DC.VERSION;

  let deb;
  chrome.storage.onChanged.addListener((ch, area) => {
    if (area === 'session') { gate(); return; }
    if (area !== 'local') return;
    clearTimeout(deb); deb = setTimeout(async () => { await loadAll(); if (!$('#app').classList.contains('hidden')) render(); if (ch[K.settings] || ch[K.profile]) renderAccount(); }, 60);
  });
  setInterval(() => { if (S && !$('#app').classList.contains('hidden')) renderPomo(); }, 1000);

  makePreview($('#preview')); makePreview($('#preview2'));
  await gate();
  requestAnimationFrame(animate);
})();
