// Companion 3D incorporabile (pagina trasparente). Usata sia come overlay nelle pagine web (iframe dal content
// script) sia come anteprima nel popup. Carica il personaggio salvato (modello, volto, outfit), riproduce un'attesa
// e ogni tanto una posa; un clic avvia una reazione. Comunica con chi la ospita via postMessage.
import { CharacterEngine } from '../engine3d/core/character-engine.js';
import { loadCharacter } from '../engine3d/save/character-store.js';
import { THREE } from '../engine3d/lib.js';

const DC = globalThis.DC;
const inExtension = typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id);
const params = new URLSearchParams(location.search);
const $ = (s) => document.querySelector(s);

function resolveHead(h) {
  const e = DC.headById(h.photoId);
  if (!e) return null;
  return { id: e.id, w: e.w, h: e.h, anchorX: e.anchorX, anchorY: e.anchorY, faceW: e.faceW, skin: e.skin, url: inExtension ? DC.headUrl(e) : (e.dataUrl || new URL('../../' + e.file, location.href).href) };
}

let bubbleTimer = null;
function say(text) {
  const b = $('#bubble');
  if (!b || !text) return;
  b.textContent = text; b.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.remove('show'), 4200);
}

const state = (window.__dcCompanion = { ready: false, mode: 'loading', engine: null });

async function boot() {
  const { def } = await loadCharacter();
  const embed = params.get('embed') === '1';      // overlay trascinabile nelle pagine
  const stat = params.get('static') === '1';       // anteprima statica (popup)
  const quality = params.get('q') || 'medium';
  let engine = null;
  try {
    // nelle pagine l'orbita con il mouse è disattivata: il trascinamento sposta il personaggio
    engine = new CharacterEngine($('#view'), { quality, transparent: true, autoPause: true, interactive: !embed && !stat, resolveHead });
    await engine.load(def);
    state.engine = engine; state.mode = '3d';
    document.body.dataset.mode = '3d';
    engine.camera.frame(params.get('frame') || 'full', { animate: false, lift: engine.groundOffsetValue() });

    const gestures = engine.anim.list().filter((c) => !c.loop).map((c) => c.id);
    const playRandom = () => { if (gestures.length) engine.anim.play(gestures[Math.floor(Math.random() * gestures.length)]); };

    // hit-test della sagoma: la pagina ospite chiede se il cursore è sul personaggio (coordinate normalizzate)
    const ray = new THREE.Raycaster();
    const isOver = (nx, ny) => { ray.setFromCamera({ x: nx, y: ny }, engine.render.camera); return ray.intersectObject(engine.avatar.root, true).length > 0; };
    window.addEventListener('message', (e) => { const m = e.data; if (m && m.type === 'dc-hit') parent.postMessage({ type: 'dc-hit-res', over: isOver(m.nx, m.ny) }, '*'); });

    if (embed) {
      // trascinamento: cattura il puntatore e invia gli spostamenti alla pagina ospite; un tocco senza
      // spostamento è una reazione. La pagina companion non ha pannelli: è solo il personaggio.
      const cv = engine.render.canvas;
      let drag = null, moved = false;
      cv.style.cursor = 'grab';
      // mentre l'overlay è interattivo, segnala alla pagina quando il cursore esce dalla sagoma (per ridare i clic al sito)
      cv.addEventListener('pointermove', (e) => {
        if (drag) return;
        const r = cv.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        parent.postMessage({ type: 'dc-hit-res', over: isOver(nx, ny) }, '*');
      });
      cv.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        drag = { id: e.pointerId }; moved = false;
        try { cv.setPointerCapture(e.pointerId); } catch (_) {}
        cv.style.cursor = 'grabbing';
        parent.postMessage({ type: 'dc-drag-start' }, '*');
      });
      cv.addEventListener('pointermove', (e) => {
        if (!drag) return;
        if (Math.abs(e.movementX) + Math.abs(e.movementY) > 0) moved = true;
        parent.postMessage({ type: 'dc-drag-move', dx: e.movementX, dy: e.movementY }, '*');
      });
      const endDrag = (e) => {
        if (!drag) return;
        try { cv.releasePointerCapture(drag.id); } catch (_) {}
        drag = null; cv.style.cursor = 'grab';
        parent.postMessage({ type: 'dc-drag-end' }, '*');
        if (!moved) { playRandom(); if (DC.line) say(DC.line('idle')); } // tocco senza trascinamento = reazione
      };
      cv.addEventListener('pointerup', endDrag);
      cv.addEventListener('pointercancel', endDrag);
      setInterval(() => { if (!document.hidden) playRandom(); }, 15000);
    } else if (!stat) {
      engine.render.canvas.addEventListener('pointerdown', (e) => { if (e.button === 0) { playRandom(); if (DC.line) say(DC.line('idle')); } });
      setInterval(() => { if (!document.hidden) playRandom(); }, 15000);
    }

    // comandi da chi ospita (content script / popup) e dal service worker
    const onMsg = (msg) => {
      if (!msg) return;
      try {
        if (msg.type === 'summon' || msg.type === 'greet') engine.anim.play('vrma_greet');
        else if (msg.type === 'pose') playRandom();
        if (msg.text) say(msg.text);
      } catch (e) {}
    };
    window.addEventListener('message', (e) => onMsg(e.data));
    if (inExtension && chrome.runtime.onMessage) {
      const MINE = new Set(['summon', 'say', 'speak', 'greet', 'pose']);
      chrome.runtime.onMessage.addListener((msg, _s, send) => { if (msg && MINE.has(msg.type)) { onMsg(msg); send && send({ ok: true }); } return false; });
    }
  } catch (e) {
    console.warn('[DC] companion 3D non disponibile', e);
    state.mode = 'error'; state.error = String((e && e.message) || e);
    document.body.dataset.mode = 'error';
  }
  state.ready = true;
}

boot().catch((e) => { console.error('[DC] avvio companion', e); state.mode = 'error'; state.ready = true; document.body.dataset.mode = 'error'; });
