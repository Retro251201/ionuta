// QA end-to-end: carica l'estensione vera in Chrome headless (WebGL software) e verifica con ASSERZIONI
// le funzioni originali (v0.2) e il motore 3D. Sostituisce tools/qa/run.js (solo screenshot, non più eseguibile).
// Uso: npm run qa            tutte le suite
//      npm run qa -- --suite legacy|stage     una sola suite
//      DC_OUT=dir npm run qa                  cartella degli screenshot (default tools/qa/out, ignorata da git)
// Exit code 1 se almeno un controllo fallisce. Richiede Chrome/Chromium: variabile CHROME (default /usr/local/bin/google-chrome).
import { chromium } from 'playwright-core';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { serve, ROOT } from '../dev/serve.mjs';
import { CHROME, GL_ARGS } from '../dev/shot.mjs';

const EXT = process.env.DC_EXT || path.join(ROOT, 'extension');
const OUT = process.env.DC_OUT || path.join(ROOT, 'tools/qa/out');
const argv = process.argv.slice(2);
const only = argv.includes('--suite') ? argv[argv.indexOf('--suite') + 1].split(',') : null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const checks = [];
let suiteName = '';
function check(name, ok, detail = '') {
  checks.push({ suite: suiteName, name, ok: !!ok, detail: String(detail) });
  console.log((ok ? '  ✓ ' : '  ✗ ') + name + (detail !== '' && detail !== undefined ? ' — ' + detail : ''));
}

/** Messaggi di console/errore da ignorare (rumore del browser headless, non del prodotto). */
const NOISE = [/GPU stall due to ReadPixels/i, /Automatic fallback to software WebGL/i, /GroupMarkerNotSet/i, /Failed to load resource/i,
  // anteprime 3D in iframe chiuse mentre caricano ancora (popup transitorio): cancellazione, non un difetto del prodotto
  /Couldn't load texture blob:/i, /THREE.GLTFLoader: Couldn't load/i];

async function launch() {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'dcprof-'));
  const ctx = await chromium.launchPersistentContext(prof, {
    executablePath: CHROME, headless: false,
    args: ['--headless=new', `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, ...GL_ARGS],
    viewport: { width: 1280, height: 760 }
  });
  const errors = [];
  const watch = (p) => {
    p.on('pageerror', (e) => errors.push(`[pageerror ${p.url()}] ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error' && !NOISE.some((re) => re.test(m.text()))) errors.push(`[console.error ${p.url()}] ${m.text()}`); });
    // le risorse mancanti sono riportate con l'URL esatto (il favicon del server di prova non fa parte del prodotto)
    p.on('requestfailed', (r) => { const ab = (r.failure() && r.failure().errorText) || ''; if (!/favicon\.ico/.test(r.url()) && !/ERR_ABORTED/.test(ab)) errors.push(`[requestfailed] ${r.url()} (${ab})`); });
    p.on('response', (r) => { if (r.status() >= 400 && !/favicon\.ico/.test(r.url())) errors.push(`[http ${r.status()}] ${r.url()}`); });
  };
  ctx.pages().forEach(watch);
  ctx.on('page', watch);
  let sw = ctx.serviceWorkers()[0];
  if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 20000 });
  const id = sw.url().split('/')[2];
  return { ctx, prof, errors, id, ext: (p) => `chrome-extension://${id}/${p}` };
}

// ---------------------------------------------------------------------------------------------------------------
// Suite "legacy": tutto ciò che esisteva nella v0.2 deve continuare a funzionare.
// ---------------------------------------------------------------------------------------------------------------
async function legacy(env, srv) {
  const { ctx, ext, errors } = env;
  await sleep(1500);

  // companion nelle pagine web (content script + Shadow DOM)
  const page = await ctx.newPage();
  await page.goto(srv.url + '/tools/qa/test.html');
  await sleep(4500);
  check('content script: companion 3D (iframe) iniettato nella pagina', await page.evaluate(() => { const h = document.querySelector('#dc-companion-root'); const f = h && h.querySelector('iframe'); return !!(f && /src\/companion\/companion\.html/.test(f.src)); }));
  await page.screenshot({ path: `${OUT}/01_page.png` });

  // popup + messaggi verso il service worker
  const pop = await ctx.newPage();
  await pop.setViewportSize({ width: 380, height: 600 });
  await pop.goto(ext('src/popup/popup.html'));
  await sleep(1200);
  const r = await pop.evaluate(async () => {
    const out = {};
    out.chat1 = await DC.send({ type: 'chat', text: 'quanto fa 12*7+3?' });
    out.chat2 = await DC.send({ type: 'chat', text: 'ciao! come stai?' });
    out.reg = await DC.send({ type: 'auth:register', username: 'Mario', password: 'segreta1' });
    out.status = await DC.send({ type: 'auth:status' });
    await DC.send({ type: 'auth:logout' });
    out.badLogin = await DC.send({ type: 'auth:login', username: 'Mario', password: 'sbagliata' });
    out.login = await DC.send({ type: 'auth:login', username: 'mario', password: 'segreta1' });
    const before = (await chrome.storage.local.get('dc_state')).dc_state;
    out.feed = await DC.send({ type: 'action', action: 'feed', itemId: 'onigiri' });
    out.buy = await DC.send({ type: 'action', action: 'buy', itemId: 'cake' });
    out.pet = await DC.send({ type: 'action', action: 'pet' });
    out.game = await DC.send({ type: 'action', action: 'game', result: 'win' });
    out.buyOutfitFail = await DC.send({ type: 'action', action: 'buyOutfit', outfitId: 'idol' });
    out.pomo = await DC.send({ type: 'pomodoro', cmd: 'start' });
    const st = await chrome.storage.local.get(null);
    out.before = before; out.state = st.dc_state; out.chatLen = (st.dc_chat || []).length; out.profile = st.dc_profile;
    out.alarms = (await chrome.alarms.getAll()).map((a) => a.name);
    // il badge viene aggiornato in modo asincrono dal service worker dopo la risposta
    for (let i = 0; i < 30 && !/m$/.test((out.badge = await chrome.action.getBadgeText({}))); i++) await new Promise((res) => setTimeout(res, 100));
    out.pomoStop = await DC.send({ type: 'pomodoro', cmd: 'stop' });
    out.alarmsAfterStop = (await chrome.alarms.getAll()).map((a) => a.name);
    return out;
  });
  check('chat offline: calcolatrice (12*7+3 = 87)', r.chat1 && r.chat1.ok && /87/.test(r.chat1.reply), r.chat1 && r.chat1.reply);
  check('chat offline: risposta a una frase', r.chat2 && r.chat2.ok && r.chat2.reply.length > 2);
  check('chat: cronologia salvata (4 messaggi)', r.chatLen === 4, r.chatLen);
  check('accesso: registrazione profilo locale', r.reg && r.reg.ok && r.status.loggedIn && r.status.user === 'Mario');
  check('accesso: password salvata solo come hash PBKDF2', r.profile && r.profile.hash && r.profile.salt && !JSON.stringify(r.profile).includes('segreta1'));
  check('accesso: password errata rifiutata', r.badLogin && r.badLogin.ok === false);
  check('accesso: login corretto (nome senza distinzione maiuscole)', r.login && r.login.ok);
  check('bisogni: nutrire consuma l\'oggetto e aumenta la sazietà', r.feed.ok && r.state.inventory.onigiri === r.before.inventory.onigiri - 1 && r.state.stats.hunger > r.before.stats.hunger);
  check('economia: acquisto (torta 15 🪙) e premio vittoria (+5)', r.buy.ok && r.state.inventory.cake === 1, 'monete ' + r.before.coins + ' → ' + r.state.coins);
  check('economia: acquisto negato senza monete', r.buyOutfitFail.ok === false && r.buyOutfitFail.reason === 'coins');
  check('interazioni: carezza e minigioco contati', r.pet.ok && r.state.counters.pets === 1 && r.state.counters.games === 1 && r.state.counters.wins === 1);
  check('obiettivi: "Prima carezza" e "Itadakimasu!" sbloccati', !!r.state.achievements.first_pet && !!r.state.achievements.first_feed);
  check('livelli: XP accumulata', r.state.xp > r.before.xp, r.state.xp);
  check('pomodoro: avvio (allarme + badge minuti)', r.pomo.ok && r.pomo.pomo.running && r.alarms.includes('dc_pomo') && /m$/.test(r.badge), r.badge);
  check('pomodoro: stop rimuove l\'allarme', r.pomoStop.ok && !r.pomoStop.pomo.running && !r.alarmsAfterStop.includes('dc_pomo'));
  check('service worker: tick dei bisogni e promemoria programmati', ['dc_tick', 'dc_water', 'dc_posture'].every((a) => r.alarms.includes(a)), r.alarms.join(','));

  await pop.reload(); await sleep(1200);
  await pop.screenshot({ path: `${OUT}/03_popup_home.png` });
  check('popup: anteprima 3D del personaggio (iframe companion)', await pop.evaluate(() => { const f = document.querySelector('#preview iframe'); return !!(f && /companion\.html/.test(f.src)); }));
  for (const t of ['shop', 'style', 'focus', 'goals', 'game', 'account']) {
    await pop.click(`#tabs button[data-tab="${t}"]`); await sleep(350);
    if (t === 'game') { await pop.click('.rps-b[data-m="rock"]'); await sleep(350); }
    await pop.screenshot({ path: `${OUT}/04_popup_${t}.png` });
  }
  check('popup: 7 schede navigabili', await pop.evaluate(() => document.querySelectorAll('#tabs button').length === 7 && document.querySelector('#tab-account').classList.contains('on')));
  check('popup e opzioni: pulsanti per aprire l\'anteprima 3D', await pop.evaluate(() => !!document.querySelector('.quick [data-q="stage"]')));
  await pop.click('#tabs button[data-tab="home"]');

  // opzioni
  const opt = await ctx.newPage();
  await opt.setViewportSize({ width: 1180, height: 800 });
  await opt.goto(ext('src/options/options.html'));
  await sleep(1200);
  await opt.screenshot({ path: `${OUT}/05_options.png` });
  check('opzioni: pagina caricata con tutte le sezioni', await opt.evaluate(() => ['benvenuto', 'generale', 'aspetto', 'teste', 'comportamento', 'voce', 'promemoria', 'pomodoro', 'ia', 'siti', 'accesso', 'dati'].every((id) => document.getElementById(id))));

  // finestra desktop
  const win = await ctx.newPage();
  await win.setViewportSize({ width: 460, height: 620 });
  await win.goto(ext('src/window/window.html'));
  await win.waitForFunction(() => window.__dcWindow && window.__dcWindow.mode && window.__dcWindow.mode !== 'loading', null, { timeout: 150000 });
  await sleep(1500);
  await win.screenshot({ path: `${OUT}/07_window.png` });
  const winState = await win.evaluate(() => ({ mode: window.__dcWindow.mode, canvas: !!document.querySelector('#view canvas'), clips: window.__dcWindow.engine ? window.__dcWindow.engine.anim.list().length : 0 }));
  check('finestra desktop: personaggio 3D nel renderer WebGL', winState.mode === '3d' && winState.canvas && winState.clips >= 8, `modo ${winState.mode}, ${winState.clips} clip`);

  // outfit / testa / sonno riflessi nella pagina
  await pop.evaluate(async () => { await DC.saveSettings({ headId: 'head_01', outfitId: 'maid' }); await DC.send({ type: 'action', action: 'sleep', value: true }); });
  await page.bringToFront(); await sleep(3000);
  await page.screenshot({ path: `${OUT}/08_page_maid_sleep.png` });
  const slept = await pop.evaluate(async () => (await chrome.storage.local.get('dc_state')).dc_state.sleeping);
  await pop.evaluate(async () => { await DC.saveSettings({ headId: 'head_02', outfitId: 'yukata' }); await DC.send({ type: 'action', action: 'sleep', value: false }); });
  await sleep(2500);
  await page.screenshot({ path: `${OUT}/09_page_yukata.png` });
  check('stato: dormi/sveglia persistito dal service worker', slept === true && (await pop.evaluate(async () => (await chrome.storage.local.get('dc_state')).dc_state.sleeping)) === false);

  // editor fotografico delle teste (solo ritaglio/alpha/ancora: i pixel non vengono alterati)
  const dialogs = [];
  opt.on('dialog', (d) => { dialogs.push(d.message()); d.accept(); });
  await opt.bringToFront();
  await opt.evaluate(() => { location.hash = '#teste'; document.querySelector('#teste').scrollIntoView(); }); await sleep(300);
  await opt.setInputFiles('#heFile', path.join(EXT, 'assets/heads/head_04.png')); await sleep(800);
  await opt.screenshot({ path: `${OUT}/10_editor_frame.png` });
  await opt.click('#heNext'); await sleep(400);
  const cvb = await opt.locator('#heCv').boundingBox();
  await opt.click('[data-tool="magic"]'); await opt.mouse.click(cvb.x + 6, cvb.y + 6); await sleep(200);
  await opt.click('[data-tool="anchor"]'); await opt.mouse.click(cvb.x + cvb.width * 0.5, cvb.y + cvb.height * 0.9); await sleep(200);
  await opt.click('[data-tool="erase"]');
  await opt.mouse.move(cvb.x + 20, cvb.y + cvb.height - 20); await opt.mouse.down(); await opt.mouse.move(cvb.x + 80, cvb.y + cvb.height - 30, { steps: 6 }); await opt.mouse.up();
  await sleep(700);
  await opt.screenshot({ path: `${OUT}/11_editor_cut.png` });
  await opt.fill('#heName', 'Test QA');
  await opt.click('#heSave'); await sleep(1500);
  await opt.screenshot({ path: `${OUT}/12_editor_saved.png` });
  const v2 = await opt.evaluate(async () => {
    const out = {};
    const list = (await DC.send({ type: 'heads:list' })).heads;
    out.listN = list.length; const h = list[0];
    out.head = h && { id: h.id, name: h.name, w: h.w, h: h.h, anchorY: h.anchorY, faceW: h.faceW, skin: h.skin, mime: h.dataUrl.slice(0, 16) };
    out.selected = (await DC.load()).settings.headId === (h && h.id);
    out.bad = await DC.send({ type: 'heads:add', head: { dataUrl: 'data:image/svg+xml;base64,AAAA' } });
    const u = await DC.send({ type: 'heads:update', id: h.id, head: { name: 'Rinominata', faceW: 99 } }); out.upd = u && u.head ? { name: u.head.name, faceW: u.head.faceW } : u;
    out.twirl = await DC.send({ type: 'action', action: 'twirl' });
    out.ach = (await chrome.storage.local.get('dc_state')).dc_state.achievements;
    await DC.saveSettings({ outfitId: 'miko', hairStyle: 'twin', hairColor: '#f4a6c8', accessory: 'cat' });
    return out;
  });
  check('editor foto: testa personalizzata salvata e selezionata', v2.listN === 1 && v2.selected && v2.head && /^data:image\/(webp|png)/.test(v2.head.mime), JSON.stringify(v2.head));
  check('editor foto: formato non ammesso (SVG) rifiutato', v2.bad && v2.bad.ok === false);
  check('editor foto: aggiornamento con valori limitati (faceW ≤ 1.2)', v2.upd && v2.upd.name === 'Rinominata' && v2.upd.faceW === 1.2);
  check('obiettivi: "Proprio io!" dopo il caricamento della foto', !!v2.ach.my_face);
  await opt.evaluate(() => document.querySelector('#aspetto').scrollIntoView()); await sleep(500);
  await opt.screenshot({ path: `${OUT}/13_options_aspetto.png` });
  await page.bringToFront(); await sleep(3000);
  await page.screenshot({ path: `${OUT}/14_page_custom_head.png` });
  await pop.bringToFront(); await pop.reload(); await sleep(1000);
  await pop.click('#tabs button[data-tab="style"]'); await sleep(500);
  await pop.screenshot({ path: `${OUT}/15_popup_style_v2.png`, fullPage: true });

  // backup → azzeramento → ripristino
  const bk = await pop.evaluate(async () => {
    const out = {};
    const exp = await DC.send({ type: 'exportData' });
    out.keys = Object.keys(exp.data).sort();
    const before = exp.data.dc_state;
    await DC.send({ type: 'action', action: 'reset' });
    out.afterReset = (await chrome.storage.local.get('dc_state')).dc_state.counters.pets;
    out.imp = await DC.send({ type: 'importData', data: JSON.parse(JSON.stringify(exp.data)) });
    const after = (await chrome.storage.local.get(null));
    out.restored = after.dc_state.counters.pets === before.counters.pets && after.dc_state.coins === before.coins && after.dc_settings.outfitId === 'miko' && (after.dc_customHeads || []).length === 1;
    out.badImp = await DC.send({ type: 'importData', data: { foo: 1 } });
    return out;
  });
  check('backup: esportazione completa', ['dc_state', 'dc_settings', 'dc_profile', 'dc_chat', 'dc_customHeads'].every((k) => bk.keys.includes(k)), bk.keys.join(','));
  check('ripristino: reset poi import riporta progressi, impostazioni e foto', bk.afterReset === 0 && bk.imp.ok && bk.restored);
  check('ripristino: file non valido rifiutato', bk.badImp.ok === false);

  const rm = await pop.evaluate(async () => {
    const id = (await DC.send({ type: 'heads:list' })).heads[0].id;
    const r = await DC.send({ type: 'heads:remove', id });
    return { r, headId: (await DC.load()).settings.headId, left: (await DC.send({ type: 'heads:list' })).heads.length };
  });
  check('editor foto: rimozione riporta alla testa predefinita', rm.r.ok && rm.headId === 'head_04' && rm.left === 0);
  check('teste originali: i 5 ritagli fotografici sono serviti dal pacchetto', await pop.evaluate(async () => (await Promise.all(DC.HEADS.map((h) => fetch(chrome.runtime.getURL(h.file)).then((x) => x.ok && x.headers.get('content-type') === 'image/png')))).every(Boolean) && DC.HEADS.length === 5));
  check('nessun dialogo di errore inatteso', dialogs.length === 0, dialogs.join(' | '));
  check('console pulita (nessun errore JS, CSP o risorsa mancante)', errors.length === 0, errors.slice(0, 6).join(' || '));
  for (const p of [page, pop, opt, win]) await p.close();
  errors.length = 0;
}

// ---------------------------------------------------------------------------------------------------------------
// Suite "stage": il personaggio 3D dentro l'estensione (rendering, animazioni, capelli, guardaroba, persistenza,
// fallback SVG). Le animazioni sono avanzate a passi fissi, quindi i controlli non dipendono dalla velocità della macchina.
// ---------------------------------------------------------------------------------------------------------------
async function stage(env) {
  const { ctx, ext, errors } = env;
  errors.length = 0;
  // predicati come funzioni: la CSP delle pagine dell'estensione vieta eval, quindi niente espressioni in stringa
  const READY = () => !!(window.__dcStage && window.__dcStage.ready);
  const external = [];
  // stato di partenza noto, indipendente dalle altre suite: impostazioni v0.2 e nessuna definizione 3D salvata
  const setup = await ctx.newPage();
  await setup.goto(ext('src/options/options.html'));
  await sleep(500);
  const prep = (hair) => setup.evaluate(async (h) => { await DC.saveSettings({ hairStyle: h, quality3d: 'medium' }); await chrome.storage.local.remove('dc_avatar'); }, hair);
  const page = await ctx.newPage();
  page.on('request', (r) => { if (!/^(chrome-extension:|data:|blob:)/.test(r.url())) external.push(r.url()); });
  await page.setViewportSize({ width: 560, height: 800 });

  // --- migrazione dalle impostazioni v0.2 ---
  await prep('twin');
  await page.goto(ext('src/stage/stage.html?q=low'));
  await page.waitForFunction(READY, null, { timeout: 150000 });
  const mig = await page.evaluate(async () => ({ hair: window.__dcStage.engine ? window.__dcStage.engine.hair.style : null, source: window.__dcStage.source, written: 'dc_avatar' in (await chrome.storage.local.get('dc_avatar')) }));
  check('migrazione v0.2 → 3D: i codini scelti nel companion classico diventano l\'acconciatura 3D equivalente (senza scrivere nulla)', mig.hair === 'twintail' && mig.source === 'migrated' && !mig.written, `${mig.hair}, ${mig.source}`);

  await prep('long');
  const t0 = Date.now();
  await page.goto(ext('src/stage/stage.html?q=low'));
  await page.waitForFunction(READY, null, { timeout: 150000 });
  const loadMs = Date.now() - t0;

  // --- caricamento ---
  const load = await page.evaluate(() => {
    const s = window.__dcStage, e = s.engine;
    if (!e) return { mode: s.mode, error: s.error };
    const worn = {};
    for (const [slot, w] of e.wardrobe.worn) worn[slot] = { item: w.item.id, tris: w.garment.stats.tris, skinned: !!(w.garment.mesh && w.garment.mesh.isSkinnedMesh && w.garment.mesh.skeleton === e.avatar.bodyMesh.skeleton) };
    return {
      mode: s.mode, source: s.source, headMode: s.def.head.mode, engineHead: e.headMode, photoId: s.def.head.photoId, ident: e.photoHead.identity(),
      animeFaceHidden: e.avatar.faceMeshes.every((m) => !m.visible), hairCut: e.hair.hiddenTriangles || 0, onHeadBone: !!(e.photoHead.current && e.photoHead.current.group.parent === e.avatar.bones.head), dockShown: !document.querySelector('#dock').hidden,
      bones: Object.values(e.avatar.bones).filter(Boolean).length, skinned: e.avatar.bodyMesh.isSkinnedMesh, morphs: Object.keys(e.avatar.face.skin.morphTargetDictionary || {}).length,
      expressions: Object.keys(e.avatar.vrm.expressionManager.expressionMap).length, license: e.avatar.vrm.meta.licenseName,
      hair: e.hair.style, hairMeshes: e.hair.current ? e.hair.current.meshes.length : 0, hairJoints: e.hair.current && e.hair.current.vrm.springBoneManager ? e.hair.current.vrm.springBoneManager.joints.size : 0,
      hairParent: e.hair.current ? e.hair.current.head.parent === e.avatar.bones.head : false,
      worn, clips: e.anim.list().map((c) => c.id), base: e.anim.base, badge: document.querySelector('#badge').textContent
    };
  });
  check('pagina 3D: renderer WebGL attivo nell\'estensione', load.mode === '3d', load.error || `${loadMs} ms · ${load.badge}`);
  if (load.mode !== '3d') { await page.close(); return; }
  check('modello: scheletro umanoide completo, skinning, morph del viso ed espressioni', load.bones >= 50 && load.skinned && load.morphs >= 40 && load.expressions >= 15, `${load.bones} ossa, ${load.morphs} morph, ${load.expressions} espressioni, licenza ${load.license}`);
  check('capelli 3D montati sulla testa con spring bone', load.hair === 'long' && load.hairMeshes > 0 && load.hairJoints > 20 && load.hairParent, `${load.hair}: ${load.hairMeshes} mesh, ${load.hairJoints} giunti`);
  const slots = Object.keys(load.worn);
  check('outfit iniziale: 6 capi reali, skinnati sullo scheletro del corpo', slots.length === 6 && Object.values(load.worn).every((w) => w.tris > 100 && w.skinned), slots.map((s) => `${s}=${load.worn[s].item}`).join(' '));
  check('dati esistenti: chi arriva dalla v0.2 conserva la testa fotografica come modalità attiva', load.source === 'migrated' && load.headMode === 'photo' && load.engineHead === 'photo');
  check('volto: la texture della testa 3D è esattamente il file originale protetto (nessuna copia o rielaborazione)', !!load.ident && load.ident.textureSrc.endsWith('/assets/heads/' + load.photoId + '.png') && load.onHeadBone, load.ident && load.ident.textureSrc);
  check('volto: viso anime nascosto e capelli tagliati davanti alla foto', load.animeFaceHidden && load.hairCut > 100, `${load.hairCut} triangoli di capelli nascosti`);
  check('animazioni: libreria .vrma scaricata caricata e retargettata (pose e gesti)', load.clips.length >= 8 && load.clips.includes('vrma_model') && load.clips.includes('vrma_peace'), `${load.clips.length} clip: ${load.clips.join(', ')}`);

  // --- rendering ---
  const pix = await page.evaluate(() => {
    const e = window.__dcStage.engine;
    e.render.stop(); // da qui in poi il tempo avanza solo a passi fissi
    e.step(2);
    const gl = e.render.renderer.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let filled = 0; const colors = new Set();
    for (let i = 0; i < px.length; i += 4) if (px[i + 3] > 8) { filled++; if (colors.size < 5000) colors.add((px[i] >> 3) << 10 | (px[i + 1] >> 3) << 5 | (px[i + 2] >> 3)); }
    return { w, h, coverage: filled / (w * h), colors: colors.size, stats: e.stats() };
  });
  check('rendering: il canvas contiene il personaggio (non è vuoto né pieno) su sfondo trasparente', pix.coverage > 0.03 && pix.coverage < 0.6 && pix.colors > 60, `${(pix.coverage * 100).toFixed(1)}% dei pixel, ${pix.colors} tonalità, ${pix.w}×${pix.h}`);
  check('rendering: geometria reale in scena', pix.stats.triangles > 20000 && pix.stats.calls > 5, `${pix.stats.triangles} triangoli, ${pix.stats.calls} draw call, preset ${pix.stats.quality}`);
  await page.screenshot({ path: `${OUT}/30_stage_3d.png` });

  // --- animazioni ---
  const anim = await page.evaluate(async () => {
    const e = window.__dcStage.engine, B = e.avatar.bones, Q = B.head.quaternion.constructor, V = B.head.position.constructor;
    const adv = (sec) => { for (let i = 0, n = Math.round(sec * 30); i < n; i++) e.update(1 / 30); };
    const wq = (n) => B[n].getWorldQuaternion(new Q());
    const wp = (n) => B[n].getWorldPosition(new V());
    const names = ['hips', 'spine', 'chest', 'head', 'leftUpperArm', 'rightUpperArm', 'leftUpperLeg', 'rightLowerArm'];
    const out = {};
    const a = names.map(wq), hipsA = wp('hips');
    adv(2);
    const b = names.map(wq);
    out.moved = names.filter((_, i) => a[i].angleTo(b[i]) * 180 / Math.PI > 0.05).length;
    out.hipsShift = hipsA.distanceTo(wp('hips'));
    out.finite = b.every((q) => [q.x, q.y, q.z, q.w].every(Number.isFinite));
    out.armsDown = wp('leftHand').y < wp('leftUpperArm').y - 0.25 && wp('rightHand').y < wp('rightUpperArm').y - 0.25;
    // piedi fermi a terra per un ciclo intero di idle, battito di ciglia presente
    // (generatore casuale fissato: la sequenza dei battiti è la stessa a ogni esecuzione)
    let seed = 20261110;
    e.anim.random = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    e.anim.restartBlink(1);
    const feet = { leftFoot: [], rightFoot: [] }; let blinkMax = 0, blinkOpen = 0, samples = 0, blinks = 0, wasOpen = true;
    const em = e.avatar.vrm.expressionManager;
    for (let i = 0; i < 360; i++) {
      e.update(1 / 30);
      const v = em.getValue('blink'), open = v < 0.05; blinkMax = Math.max(blinkMax, v); if (open) blinkOpen++; else if (wasOpen) blinks++; wasOpen = open; samples++;
      if (i % 6 === 0 && i < 240) for (const f of Object.keys(feet)) feet[f].push(wp(f));
    }
    out.footDrift = Math.max(...Object.values(feet).map((list) => { const c = list.reduce((s, p) => s.add(p), new V()).multiplyScalar(1 / list.length); return Math.max(...list.map((p) => p.distanceTo(c))); }));
    out.blinkMax = blinkMax; out.blinkOpenShare = blinkOpen / samples; out.blinks = blinks;
    // gesto: saluto con dissolvenza, sorriso, ritorno allo stato di fondo
    const done = e.anim.play('wave');
    out.duringWave = e.anim.current;
    let handMax = 0, smile = 0;
    for (let i = 0; i < 60; i++) { e.update(1 / 30); handMax = Math.max(handMax, wp('rightHand').y); smile = Math.max(smile, em.getValue('relaxed')); }
    out.handMax = handMax; out.headY = wp('head').y; out.smile = smile; out.leftHandY = wp('leftHand').y;
    adv(1.6);
    out.waveCompleted = await Promise.race([done, new Promise((r) => setTimeout(() => r('timeout'), 2000))]);
    out.afterWave = e.anim.current; out.handAfter = wp('rightHand').y; out.smileAfter = em.getValue('relaxed');
    // espressione scelta dall'esterno
    e.anim.setExpression('happy', 1); adv(0.6); out.happy = em.getValue('happy');
    e.anim.setExpression(null); adv(0.8); out.happyOff = em.getValue('happy');
    out.unknown = await e.anim.play('inesistente');
    return out;
  });
  check('animazione: lo scheletro si muove tra due istanti (non è un\'immagine statica)', anim.moved >= 5 && anim.finite && anim.hipsShift > 0.0005, `${anim.moved}/8 ossa in movimento, bacino ${(anim.hipsShift * 1000).toFixed(1)} mm`);
  check('animazione: posa di riposo naturale (braccia abbassate, non T-pose)', anim.armsDown);
  check('animazione: piedi fermi a terra durante l\'idle', anim.footDrift < 0.004, `scostamento massimo ${(anim.footDrift * 1000).toFixed(2)} mm`);
  check('animazione: battito di ciglia (occhi chiusi del tutto per un istante, aperti per la gran parte del tempo)', anim.blinkMax > 0.9 && anim.blinks >= 2 && anim.blinks <= 6 && anim.blinkOpenShare > 0.85, `${anim.blinks} battiti in 12 s, chiusura ${anim.blinkMax.toFixed(2)}, occhi aperti ${(anim.blinkOpenShare * 100).toFixed(0)}% del tempo`);
  check('animazione: saluto — la mano destra sale sopra la testa, la sinistra resta giù, il viso sorride', anim.duringWave === 'wave' && anim.handMax > anim.headY && anim.leftHandY < 1.0 && anim.smile > 0.6, `mano ${anim.handMax.toFixed(2)} m, testa ${anim.headY.toFixed(2)} m, sorriso ${anim.smile.toFixed(2)}`);
  check('animazione: a fine gesto torna allo stato di fondo con dissolvenza', anim.waveCompleted === true && anim.afterWave === 'idle' && anim.handAfter < 1.0 && anim.smileAfter < 0.05, `mano ${anim.handAfter.toFixed(2)} m`);
  check('espressioni: impostazione e azzeramento', anim.happy > 0.9 && anim.happyOff < 0.05 && anim.unknown === false);

  // --- guardaroba a slot indipendenti ---
  const ward = await page.evaluate(() => {
    const e = window.__dcStage.engine, w = e.wardrobe, out = {};
    const ids = () => Object.fromEntries(Array.from(w.worn, ([slot, x]) => [slot, x.garment.mesh.uuid]));
    const before = ids(), tris0 = w.visibleBodyTriangles, ground0 = w.groundOffset;
    const shoe0 = w.itemIn('shoes'), leg0 = w.itemIn('legwear'), nSlots0 = w.worn.size;
    out.unequip = w.unequip('shoes');
    const mid = ids();
    out.othersUntouched = Object.keys(mid).every((s) => mid[s] === before[s]) && !('shoes' in mid) && Object.keys(mid).length === nSlots0 - 1;
    out.groundLower = w.groundOffset < ground0; out.rootFollows = Math.abs(e.avatar.root.position.y - w.groundOffset) < 1e-9;
    out.reequip = w.equip('shoes', shoe0);
    // togliendo le calze/calzini torna visibile la pelle delle gambe (maschera del corpo aggiornata)
    w.unequip('legwear'); out.skinBack = w.visibleBodyTriangles - tris0; w.equip('legwear', leg0);
    out.restored = w.visibleBodyTriangles === tris0 && Math.abs(w.groundOffset - ground0) < 1e-9 && w.worn.size === nSlots0;
    out.wrongSlot = w.equip('top', 'bottom_skirt_pleated'); out.unknown = w.equip('top', 'capo_inesistente'); out.badSlot = w.equip('naso', 'top_tshirt_basic');
    // colore di un capo: cambia solo quel capo
    const b2 = ids();
    out.recolor = w.equip('top', 'top_tshirt_basic', { colors: { main: '#c8323c' } });
    const a2 = ids();
    out.recolorOnlyTop = Object.keys(a2).every((s) => (s === 'top') !== (a2[s] === b2[s]));
    out.topColor = w.worn.get('top').garment.materials[0].color.getHexString();
    out.outfitTop = w.outfit.top;
    // rimbocco: togliendo il capo "sotto" la maglia viene ricostruita con l'orlo libero
    const y = (slot) => { const g = w.worn.get(slot).garment.mesh.geometry; g.computeBoundingBox(); return g.boundingBox.min.y; };
    w.equip('bottom', 'bottom_skirt_pleated'); const tucked = y('top');
    w.unequip('bottom'); const loose = y('top');
    w.equip('bottom', 'bottom_skirt_pleated'); out.tuckAgain = Math.abs(y('top') - tucked) < 1e-6;
    out.tucked = tucked; out.loose = loose;
    w.equip('top', 'top_tshirt_basic');
    e.step(1);
    return out;
  });
  check('guardaroba: togliere un capo non tocca gli altri slot; la quota dal pavimento segue le scarpe', ward.unequip.ok && ward.othersUntouched && ward.groundLower && ward.rootFollows, `altri invariati=${ward.othersUntouched} quota=${ward.groundLower} radice=${ward.rootFollows}`);
  check('guardaroba: la maschera del corpo segue i capi (pelle di nuovo visibile senza calze) e si ripristina', ward.reequip.ok && ward.skinBack > 100 && ward.restored, `+${ward.skinBack} triangoli di pelle senza calze`);
  check('guardaroba: capo nello slot sbagliato, capo inesistente e slot sconosciuto rifiutati', !ward.wrongSlot.ok && !ward.unknown.ok && !ward.badSlot.ok);
  check('guardaroba: colore personalizzato applicato al solo capo scelto', ward.recolor.ok && ward.recolorOnlyTop && ward.topColor === 'c8323c' && ward.outfitTop.colors.main === '#c8323c', '#' + ward.topColor);
  check('guardaroba: la maglia si rimbocca nella gonna e torna libera senza gonna', ward.loose < ward.tucked - 0.03 && ward.tuckAgain, `orlo libero a ${ward.loose.toFixed(3)} m, rimboccato a ${ward.tucked.toFixed(3)} m`);

  // --- interfaccia: ogni controllo ha un effetto reale e persistente ---
  await page.evaluate(() => window.__dcStage.engine.render.start());
  await page.click('#hair [data-hair="twintail"]');
  await page.waitForFunction(() => window.__dcStage.engine.hair.style === 'twintail' && window.__dcStage.def.hair.style === 'twintail', null, { timeout: 60000 });
  await page.click('#quality [data-q="high"]');
  const uiHigh = await page.evaluate(async () => {
    const e = window.__dcStage.engine, st = await chrome.storage.local.get(['dc_avatar', 'dc_settings']);
    return { quality: e.render.qualityName, saved: st.dc_settings.quality3d, outline: e.avatar.allOutlineMaterials().some((m) => m.visible), shadows: e.render.renderer.shadowMap.enabled,
      avatarHair: st.dc_avatar && st.dc_avatar.hair.style, avatarHead: st.dc_avatar && st.dc_avatar.head.mode, chip: document.querySelector('#hair [data-hair="twintail"]').classList.contains('on'), stats: document.querySelector('#stats').textContent };
  });
  check('interfaccia: cambio acconciatura applicato e salvato in dc_avatar', uiHigh.avatarHair === 'twintail' && uiHigh.avatarHead === 'photo' && uiHigh.chip);
  check('interfaccia: preset di qualità High (contorni e ombre) applicato e salvato', uiHigh.quality === 'high' && uiHigh.saved === 'high' && uiHigh.outline && uiHigh.shadows);
  await page.click('#quality [data-q="low"]');
  await page.click('#frames [data-frame="face"]');
  await page.click('#clips [data-clip="wave"]');
  const uiLow = await page.evaluate(async () => {
    const e = window.__dcStage.engine, started = e.anim.current;
    e.render.stop();
    for (let i = 0; i < 60; i++) e.update(1 / 30);
    e.step(1);
    const d = e.camera.camera.position.distanceTo(e.camera.controls.target);
    return { quality: e.render.qualityName, outline: e.avatar.allOutlineMaterials().some((m) => m.visible), started, frame: document.body.dataset.frame, dist: d, statsText: document.querySelector('#stats').textContent };
  });
  check('interfaccia: preset Low senza contorni', uiLow.quality === 'low' && !uiLow.outline);
  await page.click('#faces [data-face="3d"]');
  await page.waitForFunction(() => window.__dcStage.engine.headMode === '3d' && window.__dcStage.def.head.mode === '3d', null, { timeout: 60000 });
  const face3d = await page.evaluate(async () => { const e = window.__dcStage.engine; return { visible: e.avatar.face.skin.visible, cut: e.hair.hiddenTriangles, saved: (await chrome.storage.local.get('dc_avatar')).dc_avatar.head.mode }; });
  await page.click('#faces [data-face="head_02"]');
  await page.waitForFunction(async () => window.__dcStage.engine.photoHead.id === 'head_02' && ((await chrome.storage.local.get('dc_settings')).dc_settings || {}).headId === 'head_02', null, { timeout: 60000 });
  const face2 = await page.evaluate(async () => { const e = window.__dcStage.engine, st = await chrome.storage.local.get(['dc_avatar', 'dc_settings']); return { src: e.photoHead.identity().textureSrc, saved: st.dc_avatar.head, headId: st.dc_settings.headId, skin: e.avatar.skinTone }; });
  // guardaroba dall'interfaccia: un look preimpostato e un singolo capo, applicati e salvati
  await page.click('#looks [data-look="date_night"]');
  await page.waitForFunction(() => window.__dcStage.engine.def.outfit.dress && window.__dcStage.engine.def.outfit.dress.item === 'dress_bodycon', null, { timeout: 60000 });
  const look = await page.evaluate(async () => { const st = await chrome.storage.local.get('dc_avatar'); return { saved: st.dc_avatar.outfit.dress && st.dc_avatar.outfit.dress.item, worn: !!window.__dcStage.engine.wardrobe.worn.get('dress') }; });
  check('interfaccia: look preimpostato "Date Night" indossato e salvato in dc_avatar', look.saved === 'dress_bodycon' && look.worn, look.saved);
  await page.click('#wslots [data-slot="shoes"]');
  await page.click('#witems [data-item="shoes_pumps"]');
  await page.waitForFunction(() => window.__dcStage.engine.wardrobe.itemIn('shoes') === 'shoes_pumps', null, { timeout: 60000 });
  const equip = await page.evaluate(async () => { const st = await chrome.storage.local.get('dc_avatar'); return st.dc_avatar.outfit.shoes && st.dc_avatar.outfit.shoes.item; });
  check('interfaccia: cambio di un singolo capo (scarpe → décolleté) applicato e salvato', equip === 'shoes_pumps', equip);
  await page.click('#lights [data-light="neon"]');
  const neon = await page.evaluate(async () => { const e = window.__dcStage.engine, st = await chrome.storage.local.get('dc_settings'); return { id: e.lighting, rim: e.render.lights.rim.color.getHexString(), saved: st.dc_settings.light3d, bg: document.querySelector('.backdrop').style.background.length }; });
  check('interfaccia: preset di luce Neon Night applicato alla scena e salvato', neon.id === 'neon' && neon.rim === '7af7ff' && neon.saved === 'neon' && neon.bg > 20, '#' + neon.rim);
  check('interfaccia: "Viso 3D anime" ripristina viso e capelli completi e viene salvato', face3d.visible && face3d.cut === 0 && face3d.saved === '3d');
  check('interfaccia: scelta di un\'altra foto applicata, salvata e condivisa col companion classico; carnagione dalla foto', face2.src.endsWith('/assets/heads/head_02.png') && face2.saved.mode === 'photo' && face2.saved.photoId === 'head_02' && face2.headId === 'head_02' && face2.skin === '#875f54', face2.skin);
  check('interfaccia: inquadratura "Viso" con transizione della camera', uiLow.frame === 'face' && uiLow.dist < 1.4, `distanza ${uiLow.dist.toFixed(2)} m`);
  check('interfaccia: pulsante "Saluto" avvia il gesto; statistiche reali del renderer', uiLow.started === 'wave' && /FPS · \d+k tri · \d+ draw/.test(uiLow.statsText), uiLow.statsText);
  await page.screenshot({ path: `${OUT}/31_stage_face_wave.png` });

  // --- camera: orbita con il trascinamento, zoom con la rotellina (eventi reali del mouse sul canvas) ---
  const box = await page.locator('#view canvas').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const camState = () => page.evaluate(() => { const e = window.__dcStage.engine; for (let i = 0; i < 30; i++) e.update(1 / 30); const c = e.camera; return { az: c.controls.getAzimuthalAngle(), d: c.camera.position.distanceTo(c.controls.target), frame: document.body.dataset.frame }; });
  const cam0 = await camState();
  await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx + 120, cy, { steps: 8 }); await page.mouse.up();
  await page.mouse.wheel(0, 600);
  await sleep(150);
  const cam1 = await camState();
  check('camera: trascinamento per ruotare e rotellina per lo zoom', Math.abs(cam1.az - cam0.az) > 0.15 && cam1.d > cam0.d * 1.05 && cam1.frame === 'free', `rotazione ${((cam1.az - cam0.az) * 180 / Math.PI).toFixed(0)}°, distanza ${cam0.d.toFixed(2)} → ${cam1.d.toFixed(2)} m`);

  // --- persistenza dopo il ricaricamento, backup e ripristino ---
  await page.goto(ext('src/stage/stage.html'));
  await page.waitForFunction(READY, null, { timeout: 150000 });
  const persisted = await page.evaluate(async () => {
    const s = window.__dcStage, e = s.engine, out = { hair: e.hair.style, quality: e.render.qualityName, source: s.source };
    const exp = await DC.send({ type: 'exportData' });
    out.inBackup = !!(exp.data.dc_avatar && exp.data.dc_avatar.hair.style === 'twintail');
    await chrome.storage.local.remove('dc_avatar');
    out.imp = await DC.send({ type: 'importData', data: JSON.parse(JSON.stringify(exp.data)) });
    out.restored = ((await chrome.storage.local.get('dc_avatar')).dc_avatar || { hair: {} }).hair.style;
    out.badImp = await DC.send({ type: 'importData', data: { ...JSON.parse(JSON.stringify(exp.data)), dc_avatar: 'x'.repeat(50) } });
    out.afterBad = ((await chrome.storage.local.get('dc_avatar')).dc_avatar || { hair: {} }).hair.style;
    e.render.stop(); e.step(2);
    return out;
  });
  check('persistenza: acconciatura e qualità ritrovate dopo il ricaricamento', persisted.hair === 'twintail' && persisted.quality === 'low' && persisted.source === 'saved');
  check('backup e ripristino: la definizione del personaggio 3D è inclusa; dato malformato ignorato', persisted.inBackup && persisted.imp.ok && persisted.restored === 'twintail' && persisted.badImp.ok && persisted.afterBad === 'twintail');
  await page.screenshot({ path: `${OUT}/32_stage_twintail.png` });

  // --- immagini di riferimento ad alta qualità (contorni, ombre, antialiasing) ---
  await page.goto(ext('src/stage/stage.html?q=high'));
  await page.waitForFunction(READY, null, { timeout: 150000 });
  await page.evaluate(() => { const e = window.__dcStage.engine; e.render.stop(); e.step(3); });
  await sleep(1500); // dissolvenze dell'interfaccia concluse
  await page.screenshot({ path: `${OUT}/34_stage_high_full.png` });
  const still = await page.evaluate(() => {
    const e = window.__dcStage.engine;
    e.camera.frame('upper', { animate: false, lift: e.wardrobe.groundOffset });
    e.anim.play('wave', { fade: 0 });
    for (let i = 0; i < 38; i++) e.update(1 / 30);
    e.step(1);
    return { quality: e.render.qualityName, outline: e.avatar.allOutlineMaterials().some((m) => m.visible), tris: e.stats().triangles };
  });
  await sleep(400);
  await page.screenshot({ path: `${OUT}/35_stage_high_wave.png` });
  check('qualità High: contorni toon e ombre attivi nella pagina dell\'estensione', still.quality === 'high' && still.outline && still.tris > 60000, `${still.tris} triangoli con contorni e ombre`);

  // --- cambio modello dal menu: personaggio completo CC0 con la testa fotografica ---
  await page.click('#models [data-model="vivi"]');
  await page.waitForFunction(() => window.__dcStage && window.__dcStage.ready && window.__dcStage.engine && window.__dcStage.engine.model === 'vivi', null, { timeout: 150000 });
  const mdl = await page.evaluate(async () => {
    const e = window.__dcStage.engine, st = await chrome.storage.local.get('dc_avatar');
    return { kind: e.modelKind, wardrobe: !!e.wardrobe, hair: !!e.hair, photo: e.photoHead.active, tris: e.stats().triangles,
      grounded: Math.abs(e.avatar.root.position.y - e.groundOffsetValue()) < 1e-6, rowHidden: document.querySelector('#rowWardrobe').hidden,
      menu: document.querySelectorAll('#models button').length, saved: st.dc_avatar.model };
  });
  check('modello: "Vivi" (personaggio completo) scelto dal menu, con testa fotografica e senza guardaroba modulare', mdl.kind === 'full' && !mdl.wardrobe && !mdl.hair && mdl.photo && mdl.rowHidden && mdl.menu === 9 && mdl.saved === 'vivi' && mdl.grounded, `menu ${mdl.menu} modelli, ${mdl.tris} tri`);
  await page.screenshot({ path: `${OUT}/36_stage_model_vivi.png` });

  // --- rilascio delle risorse GPU ---
  const mem = await page.evaluate(() => {
    const e = window.__dcStage.engine, info = e.render.renderer.info.memory, before = { geometries: info.geometries, textures: info.textures };
    e.dispose();
    return { before, after: { geometries: info.geometries, textures: info.textures } };
  });
  check('memoria GPU: dispose rilascia geometrie e texture', mem.before.geometries >= 8 && mem.after.geometries === 0 && mem.after.textures === 0, `geometrie ${mem.before.geometries}→${mem.after.geometries}, texture ${mem.before.textures}→${mem.after.textures}`);
  check('offline: nessuna richiesta fuori dal pacchetto dell\'estensione', external.length === 0, external.slice(0, 3).join(' '));
  await page.close(); await setup.close();

  // --- apertura dal service worker (pulsanti di popup e opzioni) ---
  const opener = await ctx.newPage();
  await opener.goto(ext('src/options/options.html'));
  await sleep(600);
  const [opened] = await Promise.all([ctx.waitForEvent('page', { timeout: 20000 }), opener.click('#openStage')]);
  await opened.waitForFunction(READY, null, { timeout: 150000 });
  const pagesBefore = ctx.pages().length;
  await opener.evaluate(() => DC.send({ type: 'openStage' }));
  await sleep(1200);
  check('apertura: il pulsante nelle opzioni apre l\'anteprima 3D in una sola finestra', /src\/stage\/stage\.html$/.test(opened.url()) && (await opened.evaluate(() => window.__dcStage.mode)) === '3d' && ctx.pages().length === pagesBefore);
  await opened.close(); await opener.close();

  // --- fallback: dispositivo senza WebGL ---
  const fb = await ctx.newPage();
  await fb.addInitScript({ path: path.join(ROOT, 'tools/qa/no-webgl.init.js') });
  await fb.setViewportSize({ width: 560, height: 800 });
  await fb.goto(ext('src/stage/stage.html'));
  await fb.waitForFunction(READY, null, { timeout: 60000 });
  await sleep(600);
  const fall = await fb.evaluate(() => {
    const s = window.__dcStage;
    return { mode: s.mode, error: s.error, canvas: !!document.querySelector('#view canvas'),
      dockHidden: document.querySelector('#dock').hidden, cardShown: !document.querySelector('#fallback').hidden, badge: document.querySelector('#badge').textContent };
  });
  check('senza WebGL: nessun crash, avviso mostrato e niente canvas 3D', fall.mode === 'svg' && !fall.canvas && fall.cardShown && /WebGL/.test(fall.badge), fall.error || fall.badge);
  check('senza WebGL: comandi 3D nascosti', fall.dockHidden);
  await fb.screenshot({ path: `${OUT}/33_stage_no_webgl.png` });
  await fb.close();

  check('console pulita nel motore 3D (nessun errore JS, CSP o risorsa mancante)', errors.length === 0, errors.slice(0, 6).join(' || '));
  errors.length = 0;
}

const SUITES = { legacy, stage };

// ---------------------------------------------------------------------------------------------------------------
fs.mkdirSync(OUT, { recursive: true });
const srv = await serve(0);
let env;
try {
  env = await launch();
  console.log('Estensione caricata, id', env.id, '· screenshot in', path.relative(ROOT, OUT));
  for (const [name, fn] of Object.entries(SUITES)) {
    if (only && !only.includes(name)) continue;
    suiteName = name;
    console.log(`\n== suite ${name} ==`);
    try { await fn(env, srv); } catch (e) { check(`suite ${name} completata senza eccezioni`, false, (e && e.stack) || e); }
  }
} catch (e) {
  suiteName = 'avvio';
  check('avvio di Chrome con l\'estensione', false, (e && e.stack) || e);
} finally {
  if (env) { await env.ctx.close(); fs.rmSync(env.prof, { recursive: true, force: true }); }
  srv.srv.close();
}
const failed = checks.filter((c) => !c.ok);
console.log(`\nQA: ${checks.length - failed.length}/${checks.length} controlli superati` + (failed.length ? `, ${failed.length} FALLITI:` : '.'));
for (const f of failed) console.log(`  ✗ [${f.suite}] ${f.name} — ${f.detail}`);
fs.writeFileSync(path.join(OUT, 'qa-report.json'), JSON.stringify({ date: new Date().toISOString(), passed: checks.length - failed.length, total: checks.length, checks }, null, 1));
process.exit(failed.length ? 1 : 0);
