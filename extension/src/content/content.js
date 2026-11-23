/* Companion nelle pagine web: inietta il personaggio 3D come overlay (iframe trasparente verso una pagina
 * dell'estensione che esegue il motore 3D). Niente più renderer 2D. Un solo companion per pagina (frame principale).
 * Il content script gestisce posizione, trascinamento, mostra/nascondi e inoltra i comandi al 3D via postMessage. */
(function () {
  if (window.top !== window) return;
  if (window.__dcCompanionLoaded) return;
  window.__dcCompanionLoaded = true;
  if (!/^https?:|^file:/.test(location.protocol)) return;

  const W = 300, H = 480;
  const host = document.createElement('div');
  host.id = 'dc-companion-root';
  host.style.cssText = `position:fixed;right:18px;bottom:0;width:${W}px;height:${H}px;z-index:2147483646;pointer-events:none;`;
  const frame = document.createElement('iframe');
  frame.title = 'Desktop Companion';
  frame.setAttribute('allowtransparency', 'true');
  frame.style.cssText = 'width:100%;height:100%;border:0;background:transparent;pointer-events:auto;';
  try { frame.src = chrome.runtime.getURL('src/companion/companion.html'); } catch (e) { return; }
  host.appendChild(frame);

  function mount() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', mount, { once: true }); return; }
    if (!host.isConnected) document.documentElement.appendChild(host);
  }
  mount();

  let hidden = false;
  const setHidden = (v) => { hidden = v; host.style.display = hidden ? 'none' : 'block'; };

  // visibilità legata all'impostazione `enabled` (scorciatoia Alt+Shift+C → toggle nel service worker)
  try {
    chrome.storage.local.get('dc_settings', (r) => { const s = r && r.dc_settings; if (s && s.enabled === false) setHidden(true); });
    chrome.storage.onChanged.addListener((ch, area) => { if (area === 'local' && ch.dc_settings && ch.dc_settings.newValue) setHidden(ch.dc_settings.newValue.enabled === false); });
  } catch (e) {}

  // posizione orizzontale trascinabile con Alt+trascina sul bordo inferiore (semplice, non invasivo)
  const send = (msg) => { try { frame.contentWindow && frame.contentWindow.postMessage(msg, '*'); } catch (e) {} };

  if (chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
      try {
        if (!msg) { /* noop */ }
        else if (msg.type === 'toggle-companion' || msg.type === 'toggle') setHidden(!hidden);
        else if (msg.type === 'hide') setHidden(true);
        else if (msg.type === 'show') setHidden(false);
        else if (msg.type === 'summon') { setHidden(false); send({ type: 'summon', text: msg.text }); }
        else send(msg); // say/speak/pose → inoltra al 3D
      } catch (e) {}
      sendResponse && sendResponse({ ok: true });
      return false;
    });
  }
})();
