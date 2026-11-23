/* Bootstrap nelle pagine web: un solo companion per pagina (solo frame principale). */
(function () {
  if (window.top !== window) return;
  if (window.__dcCompanionLoaded) return;
  window.__dcCompanionLoaded = true;
  if (!/^https?:|^file:/.test(location.protocol)) return;
  const c = new DC.Companion({ mode: 'page' });
  c.boot().catch((e) => console.warn('[DC] boot error', e));
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    try { c.handleMessage(msg); } catch (e) {}
    sendResponse({ ok: true });
  });
})();
