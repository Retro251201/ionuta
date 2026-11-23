/* Finestra "desktop": stessa engine delle pagine, in una finestra popup di Chrome. */
(function () {
  const c = new DC.Companion({ mode: 'window' });
  c.boot().catch((e) => console.warn('[DC] window boot', e));
  // Rispondi SOLO ai messaggi destinati alla companion: altrimenti questa pagina "ruberebbe"
  // la risposta ai DC.send() delle altre pagine dell'estensione (bug v0.1: chat/teste rotte con finestra aperta).
  const MINE = new Set(['summon', 'say', 'speak']);
  chrome.runtime.onMessage.addListener((msg, _s, send) => {
    if (!msg || !MINE.has(msg.type)) return false;
    try { c.handleMessage(msg); } catch (e) {}
    send({ ok: true }); return false;
  });
  const clock = document.getElementById('clock');
  const tickClock = () => { clock.textContent = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }); };
  tickClock(); setInterval(tickClock, 10000);
  setTimeout(() => { document.getElementById('hint').style.opacity = '0'; }, 7000);
  DC.load().then(({ settings }) => { document.title = settings.name + ' – Desktop Companion'; });
})();
