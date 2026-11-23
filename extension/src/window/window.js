// Finestra "desktop": ospita il personaggio 3D (Character Engine) come nelle pagine dell'anteprima.
// Legge il personaggio salvato (modello, volto, outfit), mostra un'animazione di attesa e ogni tanto una posa;
// un clic sul personaggio avvia una reazione. Se WebGL o il modello non sono disponibili ripiega sul companion 2D.
import { CharacterEngine } from '../engine3d/core/character-engine.js';
import { loadCharacter } from '../engine3d/save/character-store.js';

const DC = globalThis.DC;
const inExtension = typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id);
const $ = (s) => document.querySelector(s);

function resolveHead(h) {
  const e = DC.headById(h.photoId);
  if (!e) return null;
  return { id: e.id, w: e.w, h: e.h, anchorX: e.anchorX, anchorY: e.anchorY, faceW: e.faceW, skin: e.skin, url: inExtension ? DC.headUrl(e) : (e.dataUrl || new URL('../../' + e.file, location.href).href) };
}

const clockEl = $('#clock');
const tickClock = () => { clockEl.textContent = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }); };
tickClock(); setInterval(tickClock, 10000);
setTimeout(() => { const h = $('#hint'); if (h) h.style.opacity = '0'; }, 7000);

let bubbleTimer = null;
function say(text) {
  const b = $('#bubble');
  if (!b || !text) return;
  b.textContent = text; b.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.remove('show'), 4200);
}

async function loadSettings() {
  if (inExtension) return (await DC.load()).settings;
  return DC.clone(DC.DEFAULT_SETTINGS);
}

async function boot() {
  const settings = await loadSettings();
  const { def } = await loadCharacter();
  let engine = null;
  try {
    engine = new CharacterEngine($('#view'), { quality: settings.quality3d && ['low', 'medium', 'high', 'ultra'].includes(settings.quality3d) ? settings.quality3d : 'medium', transparent: true, autoPause: true, interactive: true, resolveHead });
    await engine.load(def);
    document.body.dataset.mode = '3d';
    window.__dcWindow = { engine, mode: '3d' };

    // gesti/pose disponibili (clip non in loop): una ogni tanto, e una a ogni clic sul personaggio
    const gestures = engine.anim.list().filter((c) => !c.loop).map((c) => c.id);
    const playRandom = () => { if (gestures.length) engine.anim.play(gestures[Math.floor(Math.random() * gestures.length)]); };
    let idleTimer = setInterval(() => { if (!document.hidden) playRandom(); }, 14000);
    engine.render.canvas.addEventListener('pointerdown', (e) => { if (e.button === 0) { playRandom(); if (DC.LINES) say(DC.line ? DC.line('idle') : ''); } });

    // messaggi dal service worker (saluto, frasi)
    if (inExtension) {
      const MINE = new Set(['summon', 'say', 'speak']);
      chrome.runtime.onMessage.addListener((msg, _s, send) => {
        if (!msg || !MINE.has(msg.type)) return false;
        try { if (msg.type === 'summon') engine.anim.play('vrma_greet'); else playRandom(); if (msg.text) say(msg.text); } catch (e) {}
        send({ ok: true }); return false;
      });
      DC.load().then(({ settings: s }) => { document.title = (s.name || 'Companion') + ' – Desktop Companion'; });
    }
  } catch (e) {
    console.warn('[DC] finestra: renderer 3D non disponibile', e);
    if (engine) { try { engine.dispose(); } catch (_) {} }
    $('#view').replaceChildren();
    window.__dcWindow = { engine: null, mode: 'error', error: String((e && e.message) || e) };
    document.body.dataset.mode = 'error';
  }
}

boot().catch((e) => { console.error('[DC] avvio finestra', e); document.body.dataset.mode = 'error'; });
