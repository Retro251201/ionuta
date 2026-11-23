/* Widget riutilizzabile per l'accesso (popup e opzioni). */
(function () {
  const DC = (globalThis.DC = globalThis.DC || {});
  DC.AuthUI = {
    async mount(box, onDone) {
      const st = await DC.send({ type: 'auth:status' });
      const reg = !st.hasProfile;
      box.innerHTML = `
        <div class="auth">
          <div class="auth-title">${reg ? '✨ Crea il tuo profilo' : '🔐 Accedi'}</div>
          <p class="muted">${reg ? 'Il profilo resta solo su questo computer (password cifrata con PBKDF2).' : 'Bentornato! Inserisci le tue credenziali.'}</p>
          <input class="a-user" placeholder="Nome utente" maxlength="24" value="${reg ? '' : (st.user || '').replace(/"/g, '')}">
          <input class="a-pass" type="password" placeholder="Password">
          ${reg ? '<input class="a-pass2" type="password" placeholder="Ripeti password">' : ''}
          <button class="btn primary a-go">${reg ? 'Crea profilo' : 'Entra'}</button>
          <div class="a-err"></div>
          ${reg ? '' : '<button class="link a-reset">Password dimenticata? Reimposta profilo</button>'}
        </div>`;
      const $ = (s) => box.querySelector(s), err = $('.a-err');
      const go = async () => {
        err.textContent = '';
        const username = $('.a-user').value, password = $('.a-pass').value;
        if (reg && password !== $('.a-pass2').value) { err.textContent = 'Le password non coincidono.'; return; }
        const r = await DC.send({ type: reg ? 'auth:register' : 'auth:login', username, password });
        if (r && r.ok) onDone && onDone(r); else err.textContent = (r && r.error) || 'Errore';
      };
      $('.a-go').addEventListener('click', go);
      box.querySelectorAll('input').forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); }));
      const rs = $('.a-reset');
      if (rs) rs.addEventListener('click', async () => {
        if (!confirm('Reimpostare il profilo? I dati del companion (livello, monete, outfit) restano, ma nome e password verranno cancellati.')) return;
        await DC.send({ type: 'auth:reset' }); DC.AuthUI.mount(box, onDone);
      });
    }
  };
})();
