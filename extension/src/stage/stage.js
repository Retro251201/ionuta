// Anteprima 3D: ospita il Character Engine in una pagina dell'estensione. Se WebGL o il modello non sono
// disponibili passa da solo al renderer SVG classico (DC.Body), così la pagina non resta mai vuota.
// La pagina funziona anche servita in locale (banco di prova): in quel caso non usa le API dell'estensione.
import { CharacterEngine, QUALITY_PRESETS, LIGHTING_PRESETS } from '../engine3d/core/character-engine.js';
import { loadCharacter, saveCharacter } from '../engine3d/save/character-store.js';

const DC = globalThis.DC; // script v0.2 caricati dalla pagina: impostazioni e renderer SVG
const inExtension = typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id);
const params = new URLSearchParams(location.search);
const $ = (s) => document.querySelector(s);

/** Stato della pagina, letto anche dalla QA automatica. */
const state = (window.__dcStage = { ready: false, mode: 'loading', error: null, engine: null, def: null, source: null });

const FRAME_ICONS = {
  full: '<svg viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2.2"/><path d="M12 7v7m0 0-3 7m3-7 3 7M7.5 10.5 12 9l4.5 1.5"/></svg>',
  upper: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.2"/><path d="M5 21c0-4.4 3.1-7.5 7-7.5s7 3.1 7 7.5"/></svg>',
  face: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9 10.5h.01M15 10.5h.01M9 15c1.6 1.4 4.4 1.4 6 0"/></svg>'
};

function button(label, attrs = {}) {
  const b = document.createElement('button');
  b.type = 'button';
  if (label) b.textContent = label;
  for (const [k, v] of Object.entries(attrs)) b.setAttribute(k, v);
  return b;
}
const mark = (box, value, attr) => box.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.getAttribute(attr) === value));

async function loadSettings() {
  if (inExtension) return (await DC.load()).settings; // carica anche le teste fotografiche dell'utente
  return DC.clone(DC.DEFAULT_SETTINGS);
}

/** Voce `head` della definizione → foto originale da usare come texture (testa inclusa nel pacchetto o caricata). */
function resolveHead(h) {
  const e = DC.headById(h.photoId);
  if (!e) return null;
  return { id: e.id, w: e.w, h: e.h, anchorX: e.anchorX, anchorY: e.anchorY, faceW: e.faceW, skin: e.skin, url: inExtension ? DC.headUrl(e) : e.dataUrl || new URL('../../' + e.file, location.href).href };
}

function buildFaceUi(engine) {
  const box = $('#faces');
  const heads = [...DC.HEADS, ...(DC.CUSTOM_HEADS || [])];
  for (const h of heads) {
    const b = button('', { 'data-face': h.id, title: h.name, 'aria-label': h.name });
    const img = document.createElement('img');
    img.src = resolveHead({ photoId: h.id }).url; img.alt = '';
    b.append(img, document.createTextNode(h.name));
    box.appendChild(b);
  }
  box.appendChild(button('Viso 3D anime', { 'data-face': '3d' }));
  const current = () => (engine.headMode === 'photo' ? engine.photoHead.id : '3d');
  box.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b || b.dataset.face === current()) return;
    b.classList.add('busy');
    try {
      await engine.setHead(b.dataset.face === '3d' ? { mode: '3d' } : { mode: 'photo', photoId: b.dataset.face });
      state.def = await saveCharacter(engine.def);
      // stessa testa anche nel companion classico delle pagine web
      if (inExtension && b.dataset.face !== '3d') await DC.saveSettings({ headId: b.dataset.face });
    } catch (err) { console.error('[DC] cambio volto', err); }
    b.classList.remove('busy');
    mark(box, current(), 'data-face');
  });
  mark(box, current(), 'data-face');
}

// ---------- renderer 3D ----------
function build3dUi(engine, settings) {
  const { anim, camera, hair, render } = engine;
  buildFaceUi(engine);

  const clips = $('#clips');
  for (const c of anim.list()) clips.appendChild(button(c.name, { 'data-clip': c.id, title: c.loop ? 'Stato di fondo' : 'Gesto' }));
  clips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) anim.play(b.dataset.clip); });
  anim.on('state', ({ id }) => mark(clips, id, 'data-clip'));
  mark(clips, anim.current, 'data-clip');

  const frames = $('#frames');
  for (const f of camera.list()) { const b = button('', { 'data-frame': f.id, title: f.name, 'aria-label': f.name }); b.innerHTML = FRAME_ICONS[f.id] || ''; frames.appendChild(b); }
  frames.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) camera.frame(b.dataset.frame, { lift: engine.wardrobe.groundOffset }); });
  const showFrame = (name) => { mark(frames, name, 'data-frame'); document.body.dataset.frame = name || 'free'; };
  camera.on('frame', ({ name }) => showFrame(name));
  showFrame(camera.frameName);

  const hairBox = $('#hair');
  for (const h of hair.list()) hairBox.appendChild(button(h.name, { 'data-hair': h.id }));
  hairBox.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b || b.dataset.hair === hair.style) return;
    b.classList.add('busy');
    try {
      await engine.setHair(b.dataset.hair);
      state.def = await saveCharacter(engine.def); // la scelta resta salvata (e finisce nel backup)
    } catch (err) { console.error('[DC] cambio acconciatura', err); }
    b.classList.remove('busy');
    mark(hairBox, hair.style, 'data-hair');
  });
  mark(hairBox, hair.style, 'data-hair');

  const lights = $('#lights'), backdrop = document.querySelector('.backdrop');
  for (const l of LIGHTING_PRESETS) lights.appendChild(button(l.name, { 'data-light': l.id }));
  const showLight = (p) => { backdrop.style.background = p.backdrop; mark(lights, p.id, 'data-light'); };
  engine.on('lighting', showLight);
  showLight(LIGHTING_PRESETS.find((l) => l.id === engine.lighting) || LIGHTING_PRESETS[0]);
  lights.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    engine.setLighting(b.dataset.light);
    if (inExtension) await DC.saveSettings({ light3d: b.dataset.light });
  });

  const quality = $('#quality');
  for (const [id, q] of Object.entries(QUALITY_PRESETS)) quality.appendChild(button(q.label, { 'data-q': id }));
  quality.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    engine.setQuality(b.dataset.q);
    mark(quality, render.qualityName, 'data-q');
    if (inExtension) await DC.saveSettings({ quality3d: render.qualityName });
  });
  mark(quality, render.qualityName, 'data-q');

  const stats = $('#stats');
  const tick = () => {
    const s = engine.stats();
    stats.textContent = `${s.fps || '–'} FPS · ${Math.round(s.triangles / 1000)}k tri · ${s.calls} draw`;
    stats.title = `${s.fps} fotogrammi al secondo · ${s.triangles} triangoli · ${s.calls} draw call · ${s.textures} texture`;
  };
  tick(); setInterval(tick, 1000);

  const dock = $('#dock');
  dock.hidden = false;
  // il personaggio resta sopra il pannello dei comandi: l'area 3D finisce dove inizia il pannello
  const fit = () => document.documentElement.style.setProperty('--dock', Math.round(innerHeight - dock.getBoundingClientRect().top) + 'px');
  new ResizeObserver(fit).observe(dock);
  addEventListener('resize', fit);
  fit();
  const active = hairBox.querySelector('button.on');
  if (active) hairBox.scrollLeft = Math.max(0, active.offsetLeft - hairBox.offsetLeft - 12); // acconciatura attiva in vista
  $('#badge').textContent = 'Renderer 3D · WebGL 2';
  render.on('contextlost', () => { $('#badge').textContent = 'Contesto grafico perso…'; });
  render.on('contextrestored', () => { $('#badge').textContent = 'Renderer 3D · WebGL 2'; });
}

// ---------- fallback SVG ----------
function showFallback(settings, reason) {
  const body = new DC.Body();
  $('#svgHost').appendChild(body.svg);
  const head = DC.headById(settings.headId);
  body.look = { hair: settings.hairStyle || 'long', hairColor: settings.hairColor || '#3a2a33', accessory: settings.accessory || 'none' };
  body.outfit = DC.outfitById(settings.outfitId);
  body.setHead(head, inExtension ? DC.headUrl(head) : head.dataUrl || '../../' + head.file);
  const animate = (t) => {
    const s = t / 1000, p = DC.Body.restPose();
    p.sqy = 1 + 0.012 * Math.sin(s * 2.2); p.sqx = 1 - 0.006 * Math.sin(s * 2.2);
    p.headTilt = 2.5 * Math.sin(s * 0.9); p.aR = [-10 - 4 * Math.sin(s * 1.3), 6]; p.aL = [10 + 3 * Math.sin(s * 1.1), -6];
    p.skirt = 1.5 * Math.sin(s * 1.7);
    body.setPose(p);
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
  $('#fallbackReason').textContent = reason ? 'Motivo: ' + reason : '';
  $('#fallback').hidden = false;
  $('#badge').textContent = 'Renderer SVG (fallback)';
}

async function boot() {
  const settings = await loadSettings();
  const { def, source } = await loadCharacter();
  state.def = def; state.source = source;
  const wanted = params.get('q') || settings.quality3d;
  const quality = QUALITY_PRESETS[wanted] ? wanted : 'medium';
  let engine = null;
  try {
    engine = new CharacterEngine($('#view'), { quality, resolveHead, lighting: params.get('light') || settings.light3d });
    await engine.load(def);
    state.engine = engine;
    state.mode = '3d';
    build3dUi(engine, settings);
  } catch (e) {
    // WebGL assente, contesto negato o modello non caricabile: il prodotto continua con il renderer classico
    console.warn('[DC] renderer 3D non disponibile, passo al renderer SVG:', e);
    if (engine) { try { engine.dispose(); } catch (err) { /* renderer mai creato */ } }
    $('#view').replaceChildren();
    state.engine = null;
    state.mode = 'svg';
    state.error = String((e && e.message) || e);
    showFallback(settings, state.error);
  }
  document.body.dataset.mode = state.mode;
  if (inExtension) document.title = `${settings.name} – Anteprima 3D`;
  state.ready = true;
}

boot().catch((e) => {
  console.error('[DC] avvio dell\'anteprima 3D', e);
  state.mode = 'error'; state.error = String((e && e.message) || e); state.ready = true;
  document.body.dataset.mode = 'error';
  $('#badge').textContent = 'Errore di avvio';
});
