/* Pagina impostazioni: binding generico data-path -> settings (salvataggio immediato). */
(async function () {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const K = DC.KEYS;
  let S;
  const getP = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const patchOf = (p, v) => p.split('.').reverse().reduce((acc, k) => ({ [k]: acc }), v);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function flash() { const s = $('#saved'); s.classList.add('show'); clearTimeout(flash.t); flash.t = setTimeout(() => s.classList.remove('show'), 900); }
  function fill() {
    for (const el of $$('[data-path]')) {
      if (document.activeElement === el) continue;
      const v = getP(S, el.dataset.path);
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.dataset.type === 'lines') el.value = (v || []).join('\n');
      else el.value = v == null ? '' : v;
      const out = $(`output[data-for="${el.dataset.path}"]`); if (out) out.textContent = el.value;
    }
  }
  async function save(el) {
    let v;
    if (el.type === 'checkbox') v = el.checked;
    else if (el.dataset.type === 'num') { v = Number(el.value); if (!isFinite(v)) return; }
    else if (el.dataset.type === 'lines') v = el.value.split(/\n+/).map((x) => x.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase()).filter(Boolean);
    else v = el.value;
    if (el.dataset.path === 'name') v = String(v).trim().slice(0, 20) || 'Yume';
    S = await DC.saveSettings(patchOf(el.dataset.path, v));
    const out = $(`output[data-for="${el.dataset.path}"]`); if (out) out.textContent = el.value;
    flash();
  }
  for (const el of $$('[data-path]')) {
    el.addEventListener(el.type === 'range' ? 'input' : 'change', () => save(el));
  }

  // select dell'aspetto (popolate dai cataloghi condivisi)
  const opt = (v, l) => `<option value="${esc(v)}">${esc(l)}</option>`;
  function fillLookSelects() {
    $('#selHead').innerHTML = DC.allHeads().map((h) => opt(h.id, (h.custom ? '📸 ' : '') + h.name)).join('');
    $('#selHair').innerHTML = DC.HAIR_STYLES.map((x) => opt(x.id, x.name)).join('');
    $('#selHairColor').innerHTML = DC.HAIR_COLORS.map((x) => opt(x.id, x.name)).join('');
    $('#selAcc').innerHTML = DC.ACCESSORIES.map((x) => opt(x.id, (x.icon ? x.icon + ' ' : '') + x.name)).join('');
  }
  fillLookSelects();

  // anteprima
  const body = new DC.Body(); $('#preview').appendChild(body.svg);
  let look = '';
  function applyLook() {
    const k = [S.headId, S.outfitId, S.hairStyle, S.hairColor, S.accessory, (DC.CUSTOM_HEADS || []).map((h) => h.id + h.createdAt).join(',')].join('|');
    if (k === look) return; look = k;
    const h = DC.headById(S.headId);
    body.look = { hair: S.hairStyle, hairColor: S.hairColor, accessory: S.accessory };
    body.outfit = DC.outfitById(S.outfitId); body.setHead(h, DC.headUrl(h));
  }

  // le tue teste (foto caricate)
  $('#maxHeads').textContent = DC.MAX_CUSTOM_HEADS;
  function renderMyHeads() {
    const list = DC.CUSTOM_HEADS || [];
    $('#myHeads').innerHTML = list.length ? list.map((h) => `<div class="mh ${h.id === S.headId ? 'on' : ''}"><img src="${esc(h.dataUrl)}" alt=""><div class="nm" title="${esc(h.name)}">${esc(h.name)}</div>
      <div class="row"><button class="btn" data-use="${esc(h.id)}">${h.id === S.headId ? '✓' : 'Usa'}</button><button class="btn" data-ren="${esc(h.id)}">✏️</button><button class="btn danger" data-del="${esc(h.id)}">🗑️</button></div></div>`).join('')
      : '<p class="muted">Nessuna foto caricata per ora.</p>';
  }
  $('#myHeads').addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.use) { S = await DC.saveSettings({ headId: b.dataset.use }); flash(); }
    else if (b.dataset.ren) {
      const h = DC.headById(b.dataset.ren), n = prompt('Nuovo nome della foto:', h.name); if (n == null) return;
      const r = await DC.send({ type: 'heads:update', id: h.id, head: { name: n } }); if (!r || !r.ok) alert((r && r.error) || 'Errore');
    } else if (b.dataset.del) {
      if (!confirm('Eliminare questa foto?')) return;
      const r = await DC.send({ type: 'heads:remove', id: b.dataset.del }); if (!r || !r.ok) alert((r && r.error) || 'Errore');
    }
  });
  if (DC.HeadEditor) DC.HeadEditor.mount({
    $, previewBox: $('#hePrev'), getLook: () => ({ outfit: DC.outfitById(S.outfitId), look: { hair: S.hairStyle, hairColor: S.hairColor, accessory: S.accessory } }),
    onSave: async (head) => {
      const r = await DC.send({ type: 'heads:add', head, select: true });
      if (!r || !r.ok) { alert('Errore: ' + ((r && r.error) || 'salvataggio non riuscito')); return false; }
      flash(); return true;
    }
  });
  (function anim(t) {
    const s = t / 1000, p = DC.Body.restPose();
    p.aR = [-150 + 25 * Math.sin(s * 6), -30]; p.headTilt = 4 * Math.sin(s * 1.5); p.sqy = 1 + 0.012 * Math.sin(s * 2.2);
    body.setPose(p); requestAnimationFrame(anim);
  })(0);

  // nav attiva
  function navOn() { const h = location.hash || '#benvenuto'; $$('#nav a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === h)); }
  window.addEventListener('hashchange', navOn);

  // voce
  $('#voiceTest').onclick = () => {
    const u = new SpeechSynthesisUtterance(`Ciao! Sono ${S.name}, piacere di conoscerti!`);
    u.lang = 'it-IT'; u.rate = S.voiceRate; u.pitch = S.voicePitch;
    const v = speechSynthesis.getVoices().find((x) => /it/i.test(x.lang) && /female|donna|elsa|alice|google/i.test(x.name)) || speechSynthesis.getVoices().find((x) => /^it/i.test(x.lang));
    if (v) u.voice = v; speechSynthesis.cancel(); speechSynthesis.speak(u);
  };

  // IA
  const PRESETS = {
    openai: { endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
    openrouter: { endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'meta-llama/llama-3.1-8b-instruct' },
    groq: { endpoint: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.1-8b-instant' },
    ollama: { endpoint: 'http://localhost:11434/v1/chat/completions', model: 'llama3.1' },
    lmstudio: { endpoint: 'http://localhost:1234/v1/chat/completions', model: 'local-model' }
  };
  $$('[data-preset]').forEach((b) => (b.onclick = async () => { S = await DC.saveSettings({ ai: PRESETS[b.dataset.preset] }); fill(); flash(); }));
  $('#aiAuth').onclick = async () => {
    const res = $('#aiRes'); res.textContent = '';
    let origin;
    try { const u = new URL(S.ai.endpoint); origin = `${u.protocol}//${u.hostname}/*`; } catch (e) { res.textContent = '❌ Endpoint non valido'; return; }
    let granted = false;
    try { granted = await chrome.permissions.request({ origins: [origin] }); } catch (e) { res.textContent = '❌ ' + e.message; return; }
    if (!granted) { res.textContent = '⚠️ Permesso negato'; return; }
    if (!S.ai.enabled) S = await DC.saveSettings({ ai: { enabled: true } }), fill();
    res.textContent = '⏳ Provo…';
    const r = await DC.send({ type: 'testAI' });
    res.textContent = r && r.ok ? '✅ ' + r.reply : '❌ ' + ((r && r.error) || 'errore');
  };

  // accesso
  async function renderAcc() {
    const st = await DC.send({ type: 'auth:status' }) || {};
    const box = $('#accBox');
    if (st.loggedIn) {
      box.innerHTML = `<div class="acc">Connesso come <b>${esc(st.user)}</b> <button class="btn" id="lo">Esci</button> <button class="btn danger" id="rp">Elimina profilo</button></div><p class="muted">Per cambiare password usa il popup → scheda 👤.</p>`;
      $('#lo').onclick = async () => { await DC.send({ type: 'auth:logout' }); };
      $('#rp').onclick = async () => { if (confirm('Eliminare il profilo?')) { await DC.send({ type: 'auth:reset' }); } };
    } else DC.AuthUI.mount(box, () => {});
  }
  async function gate() {
    const st = await DC.send({ type: 'auth:status' }) || {};
    const locked = S.requireLogin && st.hasProfile && !st.loggedIn;
    $('#gate').classList.toggle('hidden', !locked);
    if (locked) DC.AuthUI.mount($('#gateBox'), () => gate());
    renderAcc();
  }

  $('#wlProfile').onclick = () => { location.hash = '#accesso'; };
  $('#wlWindow').onclick = () => DC.send({ type: 'openWindow' });
  $('#openStage').onclick = () => DC.send({ type: 'openStage' });

  // dati
  $('#exp').onclick = async () => {
    const r = await DC.send({ type: 'exportData' });
    const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `desktop-companion-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  $('#imp').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const r = await DC.send({ type: 'importData', data });
      alert(r && r.ok ? 'Backup importato ✅' : 'Errore: ' + ((r && r.error) || ''));
    } catch (err) { alert('File non valido'); }
    e.target.value = '';
  };
  $('#clearChat').onclick = async () => { await DC.send({ type: 'clearChat' }); flash(); };
  $('#resetState').onclick = async () => { if (confirm('Azzerare livello, monete, inventario, outfit e obiettivi?')) { await DC.send({ type: 'action', action: 'reset' }); flash(); } };
  $('#resetSettings').onclick = async () => {
    if (!confirm('Ripristinare le impostazioni predefinite? (la chiave API verrà cancellata)')) return;
    await chrome.storage.local.set({ [K.settings]: DC.clone(DC.DEFAULT_SETTINGS) }); flash();
  };

  chrome.storage.onChanged.addListener(async (ch, area) => {
    if (area === 'session' || (area === 'local' && ch[K.profile])) gate();
    if (area === 'local' && (ch[K.settings] || ch[K.customHeads])) { S = (await DC.load()).settings; fillLookSelects(); fill(); applyLook(); renderMyHeads(); }
  });

  $('#ver').textContent = ' v' + DC.VERSION;
  S = (await DC.load()).settings;
  fillLookSelects(); fill(); applyLook(); renderMyHeads(); navOn(); gate();
  if (location.hash) { const t = $(location.hash); if (t) t.scrollIntoView(); }
})();
