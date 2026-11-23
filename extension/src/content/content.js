/* Companion 3D nelle pagine web: non una finestra, ma un personaggio che galleggia sopra la pagina.
 * È un overlay trasparente (iframe verso una pagina dell'estensione che esegue il motore 3D) con PASS-THROUGH reale:
 * la pagina resta cliccabile ovunque tranne SULLA SAGOMA del personaggio. Si trascina, reagisce al clic e risponde
 * ai comandi del service worker (richiamo vicino al cursore, frasi, mostra/nascondi). */
(function () {
  if (window.top !== window) return;
  if (window.__dcCompanionLoaded) return;
  window.__dcCompanionLoaded = true;
  if (!/^https?:|^file:/.test(location.protocol)) return;

  const W = 260, H = 420;
  const host = document.createElement('div');
  host.id = 'dc-companion-root';
  host.style.cssText = `position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:2147483646;pointer-events:none;will-change:transform;`;
  const frame = document.createElement('iframe');
  frame.title = 'Desktop Companion';
  frame.setAttribute('allowtransparency', 'true');
  // pointer-events parte da "none": la pagina è cliccabile; si attiva solo quando il cursore è sulla sagoma
  frame.style.cssText = 'width:100%;height:100%;border:0;background:transparent;pointer-events:none;';
  try { frame.src = chrome.runtime.getURL('src/companion/companion.html?embed=1&q=low'); } catch (e) { return; }
  host.appendChild(frame);

  // ---- posizione (persistita per sito), parte in basso a destra ----
  let pos = { x: Math.max(8, window.innerWidth - W - 18), y: Math.max(8, window.innerHeight - H) };
  const KEY = 'dc_pos';
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s.x === 'number') pos = s; } catch (e) {}
  const clamp = () => { pos.x = Math.min(Math.max(8 - W * 0.4, pos.x), window.innerWidth - W * 0.6); pos.y = Math.min(Math.max(8, pos.y), window.innerHeight - H * 0.55); };
  const place = () => { clamp(); host.style.transform = `translate(${pos.x}px, ${pos.y}px)`; };
  const savePos = () => { try { localStorage.setItem(KEY, JSON.stringify(pos)); } catch (e) {} };

  function mount() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', mount, { once: true }); return; }
    if (!host.isConnected) document.documentElement.appendChild(host);
    place();
  }
  mount();
  window.addEventListener('resize', place);

  let hidden = false;
  const setHidden = (v) => { hidden = v; host.style.display = hidden ? 'none' : 'block'; };

  // ---- pass-through: hit-test della sagoma mentre il cursore si avvicina ----
  const send = (msg) => { try { frame.contentWindow && frame.contentWindow.postMessage(msg, '*'); } catch (e) {} };
  let overChar = false, dragging = false, lastX = 0, lastY = 0, pending = false;
  const setInteractive = (on) => { if (frame.style.pointerEvents !== (on ? 'auto' : 'none')) frame.style.pointerEvents = on ? 'auto' : 'none'; };

  document.addEventListener('pointermove', (e) => {
    lastX = e.clientX; lastY = e.clientY;
    if (hidden || dragging) return;
    const lx = e.clientX - pos.x, ly = e.clientY - pos.y;
    if (lx < 0 || ly < 0 || lx > W || ly > H) { if (overChar) { overChar = false; setInteractive(false); } return; }
    // dentro il riquadro: chiedi all'iframe se il cursore è sulla sagoma (coordinate normalizzate -1..1)
    if (frame.style.pointerEvents === 'auto') return; // già interattivo: ci pensa l'iframe a disattivarsi quando esce
    if (pending) return; pending = true;
    requestAnimationFrame(() => { pending = false; send({ type: 'dc-hit', nx: (lx / W) * 2 - 1, ny: -((ly / H) * 2 - 1) }); });
  }, true);

  // ---- messaggi dall'iframe (hit-test, trascinamento) ----
  window.addEventListener('message', (e) => {
    const m = e.data;
    if (!m || e.source !== frame.contentWindow) return;
    if (m.type === 'dc-hit-res') { overChar = m.over; setInteractive(m.over || dragging); }
    else if (m.type === 'dc-drag-start') dragging = true;
    else if (m.type === 'dc-drag-move') { pos.x += m.dx; pos.y += m.dy; place(); }
    else if (m.type === 'dc-drag-end') { dragging = false; savePos(); setInteractive(false); }
  });

  // ---- comandi dal service worker (scorciatoie, menu contestuale, chat) ----
  if (chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
      try {
        if (!msg) { /* noop */ }
        else if (msg.type === 'toggle-companion' || msg.type === 'toggle') setHidden(!hidden);
        else if (msg.type === 'hide') setHidden(true);
        else if (msg.type === 'show') setHidden(false);
        else if (msg.type === 'summon') { setHidden(false); pos = { x: lastX - W / 2, y: lastY - H * 0.8 }; place(); send({ type: 'summon', text: msg.text }); } // vieni vicino al cursore
        else send(msg); // say / speak / pose → inoltra al 3D
      } catch (e) {}
      sendResponse && sendResponse({ ok: true });
      return false;
    });
  }

  // visibilità legata all'impostazione `enabled` (scorciatoia Alt+Shift+C)
  try {
    chrome.storage.local.get('dc_settings', (r) => { const s = r && r.dc_settings; if (s && s.enabled === false) setHidden(true); });
    chrome.storage.onChanged.addListener((ch, area) => { if (area === 'local' && ch.dc_settings && ch.dc_settings.newValue) setHidden(ch.dc_settings.newValue.enabled === false); });
  } catch (e) {}
})();
