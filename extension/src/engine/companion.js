/* Motore del companion: monta un overlay in Shadow DOM, fisica (gravita', lancio, rimbalzi),
 * macchina a stati comportamentale, animazioni procedurali, fumetti, menu radiale, chat,
 * carezze, timer pomodoro. Funziona sia nelle pagine web (mode 'page') sia nella
 * finestra desktop dell'estensione (mode 'window').
 * Tutte le modifiche allo stato persistente passano dal service worker (unico writer). */
(function () {
  const DC = (globalThis.DC = globalThis.DC || {});
  const { VB, FEET_Y } = DC.Body;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const alive = () => { try { return !!(chrome.runtime && chrome.runtime.id); } catch (e) { return false; } };

  const CSS = `
:host{all:initial}
*{box-sizing:border-box;font-family:"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif}
.actor{position:fixed;left:0;top:0;pointer-events:none;will-change:transform;transition:opacity .3s}
.actor.grab .dc-body *{cursor:grabbing}
.dc-body{width:100%;height:100%;display:block;pointer-events:none;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.22))}
.dc-body g *{pointer-events:visiblePainted;cursor:grab}
.dc-body text,.dc-body>ellipse{pointer-events:none!important}
.bubble{position:fixed;left:0;top:0;max-width:250px;padding:9px 13px;background:#fff;color:#2b2b3a;border-radius:15px;font-size:13.5px;line-height:1.38;box-shadow:0 6px 18px rgba(0,0,0,.18);border:2px solid #ffb3d4;pointer-events:none;opacity:0;transform:translateY(6px);transition:opacity .2s,transform .2s;white-space:pre-wrap;word-wrap:break-word;z-index:3}
.bubble.show{opacity:1;transform:none}
.bubble:after{content:"";position:absolute;left:var(--tail,50%);bottom:-10px;margin-left:-9px;border:9px solid transparent;border-top-color:#ffb3d4;border-bottom:0}
.timer{position:fixed;left:0;top:0;padding:2px 8px;border-radius:10px;background:#ff5d8f;color:#fff;font-size:12px;font-weight:700;pointer-events:none;display:none;box-shadow:0 2px 6px rgba(0,0,0,.2);z-index:2}
.fx span{position:fixed;pointer-events:none;font-size:20px;animation:floatUp 1.3s ease-out forwards;z-index:4}
@keyframes floatUp{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx,0px),-80px) scale(1.25)}}
.menu{position:fixed;left:0;top:0;width:0;height:0}
.menu button{position:fixed;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;border:2px solid #ffb3d4;background:#fff;font-size:21px;line-height:1;cursor:pointer;pointer-events:auto;box-shadow:0 4px 12px rgba(0,0,0,.2);animation:menuIn .22s ease-out both;padding:0;color:#222;z-index:5}
.menu button:hover{transform:scale(1.14);background:#fff0f7}
.menu button[data-label]:hover:after{content:attr(data-label);position:absolute;left:50%;top:-26px;transform:translateX(-50%);background:#2b2b3a;color:#fff;font-size:11.5px;padding:3px 8px;border-radius:8px;white-space:nowrap}
.menu button .n{position:absolute;right:-4px;bottom:-4px;background:#ff5d8f;color:#fff;font-size:10px;border-radius:9px;padding:1px 5px;font-weight:700}
@keyframes menuIn{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}
.chat{position:fixed;left:0;top:0;width:300px;height:380px;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.25);display:none;flex-direction:column;pointer-events:auto;overflow:hidden;border:2px solid #ffb3d4;z-index:6;color:#2b2b3a}
.chat.open{display:flex}
.chat-h{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:linear-gradient(90deg,#ff7ab6,#b197fc);color:#fff;font-weight:700;font-size:14px}
.chat-h button{background:transparent;border:0;color:#fff;font-size:15px;cursor:pointer}
.chat-log{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:7px;background:#fff8fc}
.msg{max-width:82%;padding:7px 10px;border-radius:13px;font-size:13px;line-height:1.35;white-space:pre-wrap;word-wrap:break-word}
.msg.me{align-self:flex-end;background:#b197fc;color:#fff;border-bottom-right-radius:4px}
.msg.her{align-self:flex-start;background:#fff;border:1px solid #ffd1e6;border-bottom-left-radius:4px}
.msg.typing{opacity:.6;font-style:italic}
.chat-f{display:flex;gap:6px;padding:8px;border-top:1px solid #ffe0ef;background:#fff}
.chat-f input{flex:1;border:1px solid #ffc2dc;border-radius:10px;padding:8px 10px;font-size:13px;outline:none;color:#222;background:#fff}
.chat-f button{border:0;background:#ff7ab6;color:#fff;border-radius:10px;width:38px;font-size:15px;cursor:pointer}
`;

  class Companion {
    constructor(opts = {}) {
      this.mode = opts.mode || 'page';
      this.mounted = false; this.hiddenTab = false; this.session = null; this.userName = '';
      this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; this.dir = 1; this.dvx = 0;
      this.st = 'idle'; this.stT = 0; this.stDur = 2; this.t = 0; this.walkPh = 0;
      this.talkT = rand(30, 60); this.zzzT = 0; this.mouseX = 0; this.mouseY = 0; this.mouseSeen = false;
      this.samples = []; this.item = ''; this.pomo = null; this.chatOpen = false; this.menuOpen = false;
    }

    async boot() {
      const d = await DC.load(); this.state = d.state; this.settings = d.settings;
      const pr = await chrome.storage.local.get([DC.KEYS.profile, DC.KEYS.pomo]);
      this.userName = (pr[DC.KEYS.profile] && pr[DC.KEYS.profile].username) || '';
      this.pomo = pr[DC.KEYS.pomo] || null;
      this.session = await this.fetchSession();
      this.onStorage = (ch, area) => this.handleStorage(ch, area);
      chrome.storage.onChanged.addListener(this.onStorage);
      this.onMouse = (e) => { this.mouseX = e.clientX; this.mouseY = e.clientY; this.mouseSeen = true; };
      window.addEventListener('mousemove', this.onMouse, { passive: true });
      this.lastScroll = { y: window.scrollY, t: performance.now() };
      this.onScroll = () => this.handleScroll();
      if (this.mode === 'page') window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onFs = () => this.applyVisibility();
      document.addEventListener('fullscreenchange', this.onFs);
      this.evaluate();
    }

    async fetchSession() {
      try { const r = await chrome.storage.session.get(DC.KEYS.session); return r[DC.KEYS.session] || null; }
      catch (e) { const r = await DC.send({ type: 'auth:status' }); return r && r.loggedIn ? { user: r.user } : null; }
    }

    allowed() {
      const s = this.settings;
      if (this.mode === 'page') {
        if (!s.enabled || this.hiddenTab) return false;
        const host = location.hostname;
        if ((s.disabledSites || []).some((d) => d && (host === d || host.endsWith('.' + d)))) return false;
      }
      if (s.requireLogin && !this.session) return false;
      return true;
    }

    evaluate(prev) {
      const ok = this.allowed();
      if (ok && !this.mounted) this.mount();
      else if (!ok && this.mounted) this.unmount();
      else if (ok && prev) this.applySettings(prev);
    }

    handleStorage(ch, area) {
      if (!alive()) return this.destroy();
      if (area === 'session' && ch[DC.KEYS.session]) { this.session = ch[DC.KEYS.session].newValue || null; this.evaluate(); return; }
      if (area !== 'local') return;
      if (ch[DC.KEYS.customHeads]) {
        DC.setCustomHeads(ch[DC.KEYS.customHeads].newValue);
        if (this.mounted && this.body) this.applySettings(this.settings, true);
      }
      if (ch[DC.KEYS.profile]) this.userName = (ch[DC.KEYS.profile].newValue || {}).username || '';
      if (ch[DC.KEYS.settings]) {
        const prev = this.settings;
        this.settings = DC.mergeDeep(DC.clone(DC.DEFAULT_SETTINGS), ch[DC.KEYS.settings].newValue);
        this.evaluate(prev);
      }
      if (ch[DC.KEYS.state]) {
        const prev = this.state;
        this.state = DC.mergeDeep(DC.clone(DC.DEFAULT_STATE), ch[DC.KEYS.state].newValue);
        if (this.mounted && prev.sleeping !== this.state.sleeping) {
          if (this.state.sleeping) { this.setState('sleep'); this.say(DC.line('sleep', this.vars()), 2500); }
          else { this.setState('idle', 2); this.say(DC.line('wake', this.vars())); }
        }
      }
      if (!this.mounted) return;
      if (ch[DC.KEYS.event]) this.onEvent(ch[DC.KEYS.event].newValue);
      if (ch[DC.KEYS.pomo]) { this.pomo = ch[DC.KEYS.pomo].newValue; this.renderTimer(); }
      if (ch[DC.KEYS.chat] && this.chatOpen && !this.thinking) this.renderChat(ch[DC.KEYS.chat].newValue || []);
    }

    // ---------- montaggio ----------
    mount() {
      this.mounted = true;
      const host = (this.hostEl = document.createElement('dc-companion-root'));
      host.style.cssText = 'all:initial;position:fixed;left:0;top:0;width:0;height:0;z-index:2147483646;pointer-events:none;';
      const sh = (this.sh = host.attachShadow({ mode: 'closed' }));
      sh.innerHTML = `<style>${CSS}</style><div class="actor"></div><div class="timer"></div><div class="bubble"></div><div class="fx"></div><div class="menu"></div>
<div class="chat"><div class="chat-h"><span class="chat-title"></span><button class="chat-x" title="Chiudi">✕</button></div><div class="chat-log"></div><form class="chat-f"><input class="chat-in" maxlength="500" autocomplete="off"/><button class="chat-send" type="submit">➤</button></form></div>`;
      const $ = (s) => sh.querySelector(s);
      this.actor = $('.actor'); this.bubble = $('.bubble'); this.timer = $('.timer'); this.fx = $('.fx'); this.menu = $('.menu'); this.chat = $('.chat');
      this.body = new DC.Body(); this.actor.appendChild(this.body.svg);
      this.applySettings(null, true);
      document.documentElement.appendChild(host);
      this.bindEvents();
      const W = this.vw();
      this.x = rand(W * 0.25, W * 0.8); this.vx = 0; this.vy = 0;
      if (this.state.sleeping) { this.y = this.floorY(); this.setState('sleep'); }
      else { this.y = -this.h * 0.15; this.setState('fall'); }
      this.last = performance.now();
      this.raf = requestAnimationFrame((t) => this.frame(t));
      this.timerIv = setInterval(() => this.renderTimer(), 1000);
      this.renderTimer(); this.applyVisibility();
      this.greet();
    }

    unmount() {
      this.mounted = false;
      cancelAnimationFrame(this.raf); clearInterval(this.timerIv); clearTimeout(this.bubbleTo);
      window.removeEventListener('pointerdown', this.onDocDown, true);
      window.removeEventListener('resize', this.onResize);
      if (this.hostEl) this.hostEl.remove();
      this.hostEl = null; this.chatOpen = false; this.menuOpen = false;
    }

    destroy() {
      try { this.unmount(); } catch (e) {}
      try { chrome.storage.onChanged.removeListener(this.onStorage); } catch (e) {}
      window.removeEventListener('mousemove', this.onMouse);
      if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
      document.removeEventListener('fullscreenchange', this.onFs);
    }

    applySettings(prev, force) {
      const s = this.settings;
      const lookChanged = !prev || ['headId', 'outfitId', 'hairStyle', 'hairColor', 'accessory'].some((k) => prev[k] !== s[k]);
      if (force || lookChanged) {
        const head = DC.headById(s.headId);
        this.body.head = head; this.body.headUrl = DC.headUrl(head);
        this.body.outfit = DC.outfitById(s.outfitId);
        this.body.look = { hair: s.hairStyle || 'long', hairColor: s.hairColor || '#3a2a33', accessory: s.accessory || 'none' };
        this.body.rebuild();
      }
      this.h = clamp(Number(s.size) || 260, 120, 560); this.scale = this.h / VB.h; this.w = VB.w * this.scale;
      this.feetOff = (FEET_Y - VB.y) * this.scale;
      this.actor.style.width = this.w + 'px'; this.actor.style.height = this.h + 'px';
      this.actor.style.opacity = clamp(Number(s.opacity) || 1, 0.2, 1);
      this.sh.querySelector('.chat-title').textContent = '💬 ' + s.name;
      this.sh.querySelector('.chat-in').placeholder = `Scrivi a ${s.name}...`;
    }

    applyVisibility() {
      if (!this.hostEl) return;
      this.hostEl.style.display = this.settings.hideOnFullscreen && document.fullscreenElement ? 'none' : '';
    }

    bindEvents() {
      const svg = this.body.svg;
      svg.addEventListener('pointerdown', (e) => this.onDown(e));
      svg.addEventListener('pointermove', (e) => this.onMove(e));
      svg.addEventListener('pointerup', (e) => this.onUp(e));
      svg.addEventListener('pointercancel', (e) => this.onUp(e));
      svg.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); this.openMenu(); });
      const input = this.sh.querySelector('.chat-in');
      for (const ev of ['keydown', 'keyup', 'keypress']) input.addEventListener(ev, (e) => e.stopPropagation());
      this.sh.querySelector('.chat-x').addEventListener('click', () => this.toggleChat(false));
      this.sh.querySelector('.chat-f').addEventListener('submit', (e) => { e.preventDefault(); this.sendChat(input.value); });
      this.onDocDown = (e) => { if (this.menuOpen && !e.composedPath().includes(this.hostEl)) this.closeMenu(); };
      window.addEventListener('pointerdown', this.onDocDown, true);
      this.onResize = () => { this.y = Math.min(this.y, this.floorY()); };
      window.addEventListener('resize', this.onResize);
    }

    vw() { return this.mode === 'window' ? window.innerWidth : document.documentElement.clientWidth || window.innerWidth; }
    vh() { return this.mode === 'window' ? window.innerHeight : document.documentElement.clientHeight || window.innerHeight; }
    floorY() { return this.mode === 'window' ? this.vh() - 30 : this.vh() - 2; }
    vars() { return { user: (this.session && this.session.user) || this.userName || 'amico', name: this.settings.name, level: DC.levelOf(this.state.xp) }; }
    mood() { return DC.moodOf(this.state, this.state.sleeping); }
    action(name, extra) { return DC.send(Object.assign({ type: 'action', action: name }, extra || {})); }

    // ---------- input ----------
    onDown(e) {
      if (e.button !== 0) return;
      e.preventDefault(); e.stopPropagation();
      this.closeMenu();
      const now = performance.now();
      this.press = { x: e.clientX, y: e.clientY, t: now, ox: e.clientX - this.x, oy: e.clientY - this.y };
      try { this.body.svg.setPointerCapture(e.pointerId); } catch (_) {}
      this.samples = [{ x: e.clientX, y: e.clientY, t: now }];
    }

    onMove(e) {
      if (this.press) {
        const dx = e.clientX - this.press.x, dy = e.clientY - this.press.y;
        if (this.st !== 'drag' && Math.hypot(dx, dy) > 6) {
          this.setState('drag'); this.actor.classList.add('grab');
          if (Math.random() < 0.5) this.say(DC.line('grab', this.vars()), 1800);
        }
        if (this.st === 'drag') {
          this.x = e.clientX - this.press.ox;
          this.y = Math.min(this.floorY(), e.clientY - this.press.oy);
          const now = performance.now();
          this.samples.push({ x: e.clientX, y: e.clientY, t: now });
          while (this.samples.length > 6) this.samples.shift();
          const s0 = this.samples[0], dt = Math.max(16, now - s0.t) / 1000;
          this.dvx = (e.clientX - s0.x) / dt;
        }
        return;
      }
      if (e.target === this.body.headImg && !this.state.sleeping) this.petTrack(e);
    }

    onUp(e) {
      if (!this.press) return;
      const p = this.press; this.press = null;
      this.actor.classList.remove('grab');
      try { this.body.svg.releasePointerCapture(e.pointerId); } catch (_) {}
      if (this.st === 'drag') {
        const now = performance.now(), s0 = this.samples[0], sl = this.samples[this.samples.length - 1];
        const dt = Math.max(16, now - s0.t) / 1000;
        let vx = (e.clientX - s0.x) / dt, vy = (e.clientY - s0.y) / dt;
        if (now - sl.t > 120) { vx = 0; vy = 0; }
        if (!this.settings.physics) { vx = 0; vy = 0; }
        this.vx = clamp(vx, -2600, 2600); this.vy = clamp(vy, -2600, 2600);
        this.wasThrown = Math.hypot(vx, vy) > 700;
        if (this.wasThrown) { this.say(DC.line('throw', this.vars()), 1500); this.action('throw'); }
        this.dvx = 0; this.setState('fall');
        return;
      }
      if (performance.now() - p.t < 450) this.onClick();
    }

    onClick() {
      if (this.clickTimer) { clearTimeout(this.clickTimer); this.clickTimer = null; this.toggleChat(); return; }
      this.clickTimer = setTimeout(() => { this.clickTimer = null; this.poke(); }, 260);
    }

    poke() {
      if (this.state.sleeping) { this.emote('❗'); this.say('Mh... ancora cinque minuti... ok ok, mi sveglio!'); this.action('sleep', { value: false }); return; }
      this.setState('poke', 0.6); this.emote(DC.pick(['❗', '💢', '❓', '😳']));
      this.say(DC.line('poke', this.vars()), 2200); this.beep(660, 0.08); this.action('poke');
    }

    petTrack(e) {
      const now = performance.now();
      if (!this.petS || now - this.petS.t > 600) this.petS = { x: e.clientX, dir: 0, strokes: 0, acc: 0, t: now };
      const ps = this.petS, dx = e.clientX - ps.x; ps.x = e.clientX; ps.t = now;
      const d = Math.sign(dx); if (!d) return;
      if (d !== ps.dir) { if (ps.acc > 10) ps.strokes++; ps.dir = d; ps.acc = 0; }
      ps.acc += Math.abs(dx);
      if (ps.strokes >= 3) { ps.strokes = 0; this.pet(); }
    }

    pet() {
      const now = performance.now();
      if (this.lastPet && now - this.lastPet < 700) return;
      this.lastPet = now;
      if (!['drag', 'fall', 'eat'].includes(this.st)) this.setState('pet', 1.6);
      this.hearts(4);
      if (Math.random() < 0.35) this.say(DC.line('pet', this.vars()), 2000);
      this.beep(990, 0.06); this.action('pet');
    }

    summon() {
      if (!this.mounted) { this.hiddenTab = false; this.evaluate(); }
      if (!this.mounted) return;
      this.x = this.mouseSeen ? this.mouseX : this.vw() / 2;
      this.y = Math.min(this.floorY(), (this.mouseSeen ? this.mouseY : 0) + this.h * 0.3);
      this.vx = 0; this.vy = 0; this.setState('fall');
      this.say(DC.line('wave', this.vars()));
    }

    // ---------- menu radiale ----------
    menuItems() {
      const sleeping = this.state.sleeping, running = this.pomo && this.pomo.running;
      const items = [
        { icon: '🍙', label: 'Nutri', fn: () => this.openFeedMenu() },
        { icon: '💬', label: 'Chat', fn: () => this.toggleChat(true) },
        { icon: '💃', label: 'Balla', fn: () => { this.setState('dance', 6); this.say(DC.line('dance', this.vars())); } },
        { icon: '👋', label: 'Saluta', fn: () => { this.setState('wave', 2.4); this.say(DC.line('wave', this.vars())); } },
        { icon: '🌀', label: 'Giravolta', fn: () => this.doTwirl() },
        { icon: '💖', label: 'Cuore', fn: () => this.doHeart() },
        { icon: sleeping ? '☀️' : '😴', label: sleeping ? 'Sveglia' : 'Dormi', fn: () => this.action('sleep', { value: !sleeping }) },
        { icon: '🍅', label: running ? 'Ferma pomodoro' : 'Avvia pomodoro', fn: () => DC.send({ type: 'pomodoro', cmd: running ? 'stop' : 'start' }) }
      ];
      if (this.mode === 'page') {
        items.push({ icon: '🪟', label: 'Finestra desktop', fn: () => DC.send({ type: 'openWindow' }) });
        items.push({ icon: '🙈', label: 'Nascondi in questa scheda', fn: () => { this.say(DC.line('hide', this.vars()), 1600); setTimeout(() => { this.hiddenTab = true; this.evaluate(); }, 1600); } });
        items.push({ icon: '🚫', label: 'Disattiva su questo sito', fn: () => DC.saveSettings({ disabledSites: [...(this.settings.disabledSites || []), location.hostname] }) });
      }
      items.push({ icon: '⚙️', label: 'Impostazioni', fn: () => DC.send({ type: 'openOptions' }) });
      return items;
    }

    openMenu(items) {
      items = items || this.menuItems();
      this.menu.innerHTML = ''; this.menuOpen = true;
      const cx = this.x, cy = this.y - this.h * 0.45, R = Math.max(92, this.w * 0.62), W = this.vw(), H = this.vh();
      items.forEach((it, i) => {
        const a = -Math.PI / 2 + (i * TAU) / items.length;
        const b = document.createElement('button');
        b.innerHTML = it.icon + (it.count != null ? `<span class="n">${it.count}</span>` : '');
        b.setAttribute('data-label', it.label); b.setAttribute('aria-label', it.label);
        b.style.left = clamp(cx + Math.cos(a) * R, 28, W - 28) + 'px';
        b.style.top = clamp(cy + Math.sin(a) * R, 28, H - 28) + 'px';
        b.style.animationDelay = i * 0.02 + 's';
        b.addEventListener('click', (e) => { e.stopPropagation(); if (!it.keep) this.closeMenu(); it.fn(); });
        this.menu.appendChild(b);
      });
    }

    openFeedMenu() {
      const inv = this.state.inventory || {};
      const list = Object.keys(inv).filter((k) => inv[k] > 0 && DC.ITEMS[k]);
      if (!list.length) { this.say(DC.line('nofood', this.vars())); this.emote('🥺'); return; }
      const items = list.map((k) => ({ icon: DC.ITEMS[k].icon, label: DC.ITEMS[k].name, count: inv[k], fn: () => this.feed(k) }));
      items.push({ icon: '↩️', label: 'Indietro', keep: true, fn: () => this.openMenu() });
      setTimeout(() => this.openMenu(items), 0);
    }

    closeMenu() { this.menuOpen = false; if (this.menu) this.menu.innerHTML = ''; }

    async feed(itemId) {
      const r = await this.action('feed', { itemId });
      if (r && r.ok) { this.item = DC.ITEMS[itemId].icon; this.setState('eat', 3.2); this.say(DC.line('eat', this.vars())); this.hearts(2); }
      else this.say(DC.line('nofood', this.vars()));
    }

    // ---------- chat ----------
    async toggleChat(force) {
      this.chatOpen = force != null ? force : !this.chatOpen;
      this.chat.classList.toggle('open', this.chatOpen);
      if (this.chatOpen) {
        const r = await chrome.storage.local.get(DC.KEYS.chat);
        this.renderChat(r[DC.KEYS.chat] || []);
        this.layoutChat();
        setTimeout(() => this.sh.querySelector('.chat-in').focus(), 60);
      }
    }

    renderChat(list) {
      const log = this.sh.querySelector('.chat-log'); log.innerHTML = '';
      if (!list.length) list = [{ role: 'assistant', text: `Ciao! Sono ${this.settings.name}. Scrivimi quello che vuoi 💕` }];
      for (const m of list.slice(-40)) {
        const d = document.createElement('div'); d.className = 'msg ' + (m.role === 'user' ? 'me' : 'her'); d.textContent = m.text; log.appendChild(d);
      }
      if (this.thinking) { const d = document.createElement('div'); d.className = 'msg her typing'; d.textContent = `${this.settings.name} sta scrivendo...`; log.appendChild(d); }
      log.scrollTop = log.scrollHeight;
    }

    async sendChat(text) {
      text = String(text || '').trim(); if (!text || this.thinking) return;
      const input = this.sh.querySelector('.chat-in'); input.value = '';
      const r0 = await chrome.storage.local.get(DC.KEYS.chat);
      this.thinking = true; this.renderChat([...(r0[DC.KEYS.chat] || []), { role: 'user', text }]);
      this.emote('💭');
      const r = await DC.send({ type: 'chat', text, page: this.mode === 'page' ? { title: document.title, host: location.hostname } : null });
      this.thinking = false;
      const reply = (r && r.reply) || 'Uhm... ora non riesco a pensare 😵';
      const r1 = await chrome.storage.local.get(DC.KEYS.chat);
      this.renderChat(r1[DC.KEYS.chat] || [{ role: 'user', text }, { role: 'assistant', text: reply }]);
      this.setState('nod', 1.4); this.say(reply);
    }

    layoutChat() {
      if (!this.chatOpen) return;
      const W = this.vw(), H = this.vh(), cw = Math.min(300, W - 16), ch = Math.min(380, H - 16);
      this.chat.style.width = cw + 'px'; this.chat.style.height = ch + 'px';
      const left = this.x > W / 2 ? this.x - this.w * 0.3 - cw : this.x + this.w * 0.3;
      this.chat.style.left = clamp(left, 8, W - cw - 8) + 'px';
      this.chat.style.top = clamp(this.y - this.h * 0.55 - ch / 2, 8, H - ch - 8) + 'px';
    }

    // ---------- fumetti / effetti ----------
    say(text, ms) {
      if (!this.mounted || !text) return;
      this.bubble.textContent = text; this.bubble.classList.add('show'); this.bubbleOn = true;
      clearTimeout(this.bubbleTo);
      const dur = ms || clamp(1800 + text.length * 55, 2600, 9000);
      this.bubbleTo = setTimeout(() => { this.bubble.classList.remove('show'); this.bubbleOn = false; }, dur);
      if (this.settings.voice && text !== '...') this.speak(text);
    }

    speak(text) {
      try {
        const s = this.settings;
        const clean = String(text).replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').replace(/[*~]/g, '');
        const u = new SpeechSynthesisUtterance(clean); u.lang = 'it-IT'; u.rate = s.voiceRate; u.pitch = s.voicePitch;
        const vs = speechSynthesis.getVoices().filter((v) => /^it/i.test(v.lang));
        const f = vs.find((v) => /female|donna|alice|elsa|isabella|federica|paola|google italiano/i.test(v.name)) || vs[0];
        if (f) u.voice = f;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) {}
    }

    beep(freq, dur) {
      if (!this.settings.sounds) return;
      try {
        this.ac = this.ac || new AudioContext();
        const o = this.ac.createOscillator(), g = this.ac.createGain(), t = this.ac.currentTime;
        o.type = 'sine'; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur);
        g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
        o.connect(g); g.connect(this.ac.destination); o.start(t); o.stop(t + dur + 0.06);
      } catch (e) {}
    }

    headTopPx() { return this.y - this.feetOff + (this.body.headTopUnits() - VB.y) * this.scale; }

    spawnFx(icon, x, y, dx) {
      const s = document.createElement('span'); s.textContent = icon;
      s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.setProperty('--dx', (dx || 0) + 'px');
      this.fx.appendChild(s); setTimeout(() => s.remove(), 1350);
    }
    emote(icon) { this.spawnFx(icon, this.x + this.w * 0.16, this.headTopPx() - 4, 10); }
    hearts(n) { for (let i = 0; i < n; i++) setTimeout(() => this.spawnFx(DC.pick(['❤️', '💕', '💖']), this.x + rand(-30, 20), this.headTopPx() + rand(0, 30), rand(-30, 30)), i * 120); }

    renderTimer() {
      if (!this.timer) return;
      const p = this.pomo;
      if (!p || !p.running || !p.endsAt) { this.timer.style.display = 'none'; return; }
      const rem = Math.max(0, p.endsAt - Date.now()), m = Math.floor(rem / 60000), s = Math.floor((rem % 60000) / 1000);
      this.timer.textContent = (p.phase === 'work' ? '🍅 ' : '☕ ') + m + ':' + String(s).padStart(2, '0');
      this.timer.style.display = 'block';
    }

    async greet() {
      if (document.visibilityState !== 'visible') return;
      const r = await chrome.storage.local.get('dc_lastGreet'), now = Date.now();
      if (now - (r.dc_lastGreet || 0) > 30 * 60 * 1000) {
        await chrome.storage.local.set({ dc_lastGreet: now });
        const h = new Date().getHours();
        const key = h < 5 ? 'night' : h < 12 ? 'morning' : h >= 18 ? 'evening' : 'greet';
        setTimeout(() => { this.say(DC.line(key, this.vars())); this.setState('wave', 2.2); }, 1300);
      } else if (this.mode === 'page' && this.settings.siteComments && Math.random() < 0.35) {
        const rule = DC.SITE_RULES.find(([re]) => re.test(location.hostname));
        if (rule) setTimeout(() => this.say(DC.line(rule[1], this.vars())), 1600);
      }
    }

    onEvent(ev) {
      if (!ev || Date.now() - ev.t > 15000) return;
      if (document.visibilityState !== 'visible') return;
      if (this.mode === 'page' && !document.hasFocus()) return;
      if (ev.kind === 'levelup') { this.setState('dance', 4); this.beep(880, 0.12); setTimeout(() => this.beep(1320, 0.14), 140); }
      else if (ev.kind === 'achievement') { this.emote('🏆'); this.hearts(2); }
      else if (ev.kind === 'reminder') this.setState('wave', 2.4);
      else if (ev.kind === 'newface') { this.doTwirl(true); this.hearts(3); }
      else if (ev.kind === 'pomo' && ev.sub === 'work_end') this.setState('dance', 4);
      if (ev.text) this.say(ev.text);
    }

    handleMessage(msg) {
      if (!msg) return;
      if (msg.type === 'summon') this.summon();
      else if (!this.mounted) return;
      else if (msg.type === 'say') { this.say(msg.text); this.setState('nod', 1.4); }
      else if (msg.type === 'speak') { this.say(msg.text.length > 220 ? msg.text.slice(0, 220) + '…' : msg.text, 9000); this.speak(msg.text); this.setState('nod', 2); }
    }

    // ---------- comportamento ----------
    setState(st, dur) {
      this.st = st; this.stT = 0; this.stDur = dur || 0;
      if (st !== 'run') this.following = false;
      if (st === 'dizzy') { this.emote('💫'); this.say(DC.line('dizzy', this.vars())); }
    }

    moodSpeed() { return { sleepy: 0.6, sad: 0.8, hungry: 0.85, happy: 1.15, love: 1.15 }[this.mood()] || 1; }

    decide() {
      if (this.state.sleeping) return this.setState('sleep');
      const m = this.mood(), s = this.settings;
      const opts = [
        ['idle', 3], ['walk', s.walk ? 4 : 0], ['sit', m === 'sleepy' ? 4 : 1.2], ['wave', 0.4],
        ['dance', m === 'happy' || m === 'love' ? 1.1 : 0.2], ['look', 1.1], ['follow', s.followCursor && this.mouseSeen && s.walk ? 0.7 : 0],
        ['twirl', m === 'happy' || m === 'love' ? 0.6 : 0.25], ['heart', m === 'love' ? 0.7 : 0.12],
        ['stretch', m === 'sleepy' ? 1 : 0.35], ['peek', s.walk ? 0.3 : 0]
      ];
      let tot = opts.reduce((a, o) => a + o[1], 0), r = Math.random() * tot, pick = 'idle';
      for (const [k, w] of opts) { r -= w; if (r <= 0) { pick = k; break; } }
      const W = this.vw(), half = this.w * 0.3;
      if (pick === 'walk') { this.targetX = clamp(rand(half, W - half), half, W - half); this.setState('walk', 14); }
      else if (pick === 'follow') { this.setState('run', 5); this.following = true; this.targetX = this.mouseX; }
      else if (pick === 'sit') this.setState('sit', rand(6, 14));
      else if (pick === 'wave') this.setState('wave', 2.2);
      else if (pick === 'dance') this.setState('dance', 5);
      else if (pick === 'look') this.setState('look', 2.6);
      else if (pick === 'twirl') this.doTwirl(true);
      else if (pick === 'heart') this.doHeart(true);
      else if (pick === 'stretch') { this.setState('stretch', 2.6); if (Math.random() < 0.5) this.say(DC.line('stretch', this.vars())); }
      else if (pick === 'peek') this.startPeek();
      else this.setState('idle', rand(2, 5));
    }

    // ---------- animazioni speciali ----------
    doTwirl(quiet) {
      this.setState('twirl', 1.3);
      if (!quiet || Math.random() < 0.4) this.say(DC.line('twirl', this.vars()), 1800);
      DC.send({ type: 'action', action: 'twirl' });
    }
    doHeart(quiet) {
      this.setState('heart', 2.4); this.hearts(3);
      if (!quiet || Math.random() < 0.6) this.say(DC.line('heart', this.vars()));
    }
    // cucu': cammina fino al bordo piu' vicino, si nasconde a meta' e sbircia
    startPeek() {
      const W = this.vw();
      this.peekSide = this.x < W / 2 ? -1 : 1;
      const half = this.w * 0.3;
      this.targetX = this.peekSide < 0 ? half : W - half;
      this.setState('peekGo', 12);
    }
    handleScroll() {
      const now = performance.now(), y = window.scrollY, ls = this.lastScroll || { y, t: now };
      const dt = Math.max(16, now - ls.t), v = Math.abs(y - ls.y) / dt; // px/ms
      this.lastScroll = { y, t: now };
      if (!this.mounted || v < 4 || !['idle', 'look', 'walk', 'sit'].includes(this.st)) return;
      this.setState('wobble', 0.9);
      if (!this.bubbleOn && Math.random() < 0.3) this.say(DC.line('wobble', this.vars()), 1800);
    }

    onStateEnd() {
      const st = this.st;
      if (st === 'eat') this.item = '';
      if (this.state.sleeping) return this.setState('sleep');
      if (st === 'idle' || st === 'look' || st === 'sit') return this.decide();
      this.setState('idle', rand(1.5, 4));
    }

    talkInterval() { return { off: 1e9, rare: rand(150, 300), normal: rand(60, 140), often: rand(25, 60) }[this.settings.talkFrequency] || 90; }

    randomTalk() {
      if (document.visibilityState !== 'visible' || this.bubbleOn || this.settings.talkFrequency === 'off') return;
      if (['drag', 'fall', 'sleep', 'eat'].includes(this.st)) return;
      if (this.mode === 'page' && !document.hasFocus()) return;
      const m = this.mood();
      const key = { love: DC.pick(['love', 'idle']), happy: DC.pick(['happy', 'idle']), sad: 'sad', hungry: 'hungry', sleepy: 'sleepy' }[m] || 'idle';
      this.say(DC.line(key, this.vars()));
    }

    update(dt) {
      const s = this.settings; this.t += dt; this.stT += dt;
      const floor = this.floorY(), W = this.vw(), half = this.w * 0.3;
      if (this.state.sleeping && ['idle', 'sit', 'look', 'walk'].includes(this.st)) this.setState('sleep');
      switch (this.st) {
        case 'drag': break;
        case 'fall': {
          this.vy += 2300 * dt; this.x += this.vx * dt; this.y += this.vy * dt;
          if (this.x < half) { this.x = half; this.vx = -this.vx * 0.5; }
          if (this.x > W - half) { this.x = W - half; this.vx = -this.vx * 0.5; }
          if (this.vx) this.dir = this.vx > 0 ? 1 : -1;
          if (this.y >= floor) {
            this.y = floor; const impact = this.vy; this.vy = 0; this.vx = 0;
            if (impact > 1500 && this.wasThrown) this.setState('dizzy', 2.6); else this.setState('land', 0.35);
            this.wasThrown = false;
          }
          break;
        }
        case 'walk': case 'run': {
          if (this.following) this.targetX = clamp(this.mouseX, half, W - half);
          const sp = (this.st === 'run' ? 150 : 62) * (Number(s.speed) || 1) * this.moodSpeed();
          const dx = this.targetX - this.x;
          this.walkPh += dt * (this.st === 'run' ? 3.2 : 1.9) * TAU * Math.min(1.5, Number(s.speed) || 1);
          if (Math.abs(dx) < 4 || this.stT > this.stDur) this.setState('idle', rand(2, 5));
          else { this.dir = dx > 0 ? 1 : -1; this.x += this.dir * Math.min(Math.abs(dx), sp * dt); }
          break;
        }
        case 'peekGo': {
          const sp = 70 * (Number(s.speed) || 1) * this.moodSpeed(), dx = this.targetX - this.x;
          this.walkPh += dt * 1.9 * TAU * Math.min(1.5, Number(s.speed) || 1);
          if (Math.abs(dx) < 4) { this.peekX0 = this.x; this.setState('peek', 4.6); }
          else if (this.stT > this.stDur) this.setState('idle', 2);
          else { this.dir = dx > 0 ? 1 : -1; this.x += this.dir * Math.min(Math.abs(dx), sp * dt); }
          break;
        }
        case 'peek': {
          // esce dallo schermo per il 55%, poi rientra sporgendosi
          const T = this.stT, D = this.stDur, out = this.w * 0.42;
          const k = T < 0.6 ? T / 0.6 : T > D - 0.6 ? Math.max(0, (D - T) / 0.6) : 1;
          const ease = k * k * (3 - 2 * k);
          this.dir = -this.peekSide;
          this.x = this.peekX0 + this.peekSide * out * ease;
          if (T > 1.1 && !this.peekSaid) { this.peekSaid = true; this.emote('👀'); if (Math.random() < 0.7) this.say(DC.line('peek', this.vars()), 1800); }
          if (T > D) { this.peekSaid = false; this.x = this.peekX0; this.setState('idle', rand(1.5, 3)); }
          break;
        }
        case 'sleep':
          this.zzzT -= dt; if (this.zzzT <= 0) { this.zzzT = 2.8; this.emote('💤'); }
          break;
        default:
          if (this.stDur && this.stT > this.stDur) this.onStateEnd();
      }
      if (this.st !== 'drag' && this.st !== 'fall' && this.y < floor - 1) this.setState('fall');
      if (this.y > floor) this.y = floor;
      if (this.st !== 'drag' && this.st !== 'peek') this.x = clamp(this.x, half, W - half);
      this.talkT -= dt; if (this.talkT <= 0) { this.talkT = this.talkInterval(); this.randomTalk(); }
    }

    computePose() {
      const P = DC.Body.restPose(), t = this.t, T = this.stT, st = this.st, dir = (P.dir = this.dir);
      const br = Math.sin(t * 2.2), m = this.mood();
      P.y = br * 0.6; P.headTilt = Math.sin(t * 0.8) * 2.5 + (m === 'sad' ? 6 : 0);
      P.aL = [9 + br * 1.5, -8]; P.aR = [-9 - br * 1.5, 8];
      P.item = this.item;
      switch (st) {
        case 'walk': case 'run': case 'peekGo': {
          const ph = this.walkPh, s = Math.sin(ph), amp = st === 'run' ? 30 : 20;
          P.lL = [-amp * s, 6 + 18 * Math.max(0, -Math.cos(ph))]; P.lR = [amp * s, 6 + 18 * Math.max(0, Math.cos(ph))];
          P.aL = [10 + amp * 0.9 * s, -14]; P.aR = [-10 - amp * 0.9 * s, 14];
          P.y = -Math.abs(Math.sin(ph)) * 3; P.lean = dir * (st === 'run' ? 7 : 3);
          P.skirt = -dir * (st === 'run' ? 8 : 4) + 3 * Math.sin(2 * ph); P.headTilt = dir * 2 + s * 2; break;
        }
        case 'sit': case 'sleep': {
          const SY = DC.Body.SIT_Y || 141, L = this.body.skirtLen ? this.body.skirtLen() : 146;
          // la gonna non deve affondare nel pavimento: altezza massima ~ (FEET_Y - vita)
          P.y = SY; P.lL = [-84, 4]; P.lR = [-79, 2];
          P.skirtSy = L > 76 ? clamp((FEET_Y + 4 - (76 + SY)) / (L - 76), 0.18, 0.55) : 1; P.skirtSx = 1.15;
          P.skirt = L > 170 ? -dir * 38 : 0;
          P.aL = [-18 + br, -28]; P.aR = [-26 - br, -22]; P.shadow = 1.3;
          if (st === 'sleep') { P.torso = 7 + br * 1.2; P.headTilt = dir * 16 + Math.sin(t * 0.9) * 2; P.headY = 3; }
          else P.headTilt = Math.sin(t * 0.7) * 4;
          break;
        }
        case 'twirl': {
          const k = Math.min(1, T / this.stDur), c = Math.cos(k * TAU);
          P.sqx = Math.max(0.12, Math.abs(c)); if (c < 0) P.dir = -dir;
          P.y = -Math.sin(k * Math.PI) * 10; P.aL = [70, -10]; P.aR = [-70, 10];
          P.skirtSx = 1 + 0.25 * Math.sin(k * Math.PI); P.skirtSy = 1 - 0.08 * Math.sin(k * Math.PI);
          P.skirt = 8 * Math.sin(k * TAU); P.lL = [6, 2]; P.lR = [-6, 2]; P.hairSway = 10 * Math.sin(k * TAU);
          break;
        }
        case 'heart': P.aL = [16, -124 + 3 * br]; P.aR = [-16, 124 - 3 * br]; P.headTilt = 6 * Math.sin(t * 2); P.y = -Math.abs(Math.sin(t * 4)) * 2; break;
        case 'stretch': {
          const k = Math.sin(Math.min(1, T / this.stDur) * Math.PI);
          P.aL = [20 + 148 * k, -10 * k]; P.aR = [-20 - 148 * k, 10 * k]; P.sqy = 1 + 0.035 * k; P.sqx = 1 - 0.02 * k;
          P.headTilt = -dir * 5 * k; P.headY = -1.5 * k; P.y = -3 * k; break;
        }
        case 'peek': {
          const lean = -this.peekSide * 14 * Math.min(1, this.stT / 1.2);
          P.lean = lean; P.headTilt = lean * 0.9 + 4 * Math.sin(t * 3); P.aR = [-40, 60 + 15 * Math.sin(t * 8)]; break;
        }
        case 'wobble': {
          const k = 1 - Math.min(1, T / this.stDur);
          P.lean = 12 * k * Math.sin(T * 16); P.headTilt = 14 * k * Math.sin(T * 16 + 0.6); P.aL = [50 * k + 10, -20]; P.aR = [-50 * k - 10, 20];
          P.skirt = 10 * k * Math.sin(T * 16); P.hairSway = 12 * k * Math.sin(T * 16); break;
        }
        case 'wave': P.aR = [-152, -22 + 26 * Math.sin(t * 14)]; P.headTilt = -dir * 6; break;
        case 'dance': {
          const ph = t * TAU * 1.8;
          P.y = -Math.abs(Math.sin(ph)) * 9; P.torso = 6 * Math.sin(ph / 2); P.lean = 4 * Math.sin(ph / 2);
          P.aL = [128 + 30 * Math.sin(ph), -24]; P.aR = [-128 + 30 * Math.sin(ph), 24];
          P.lL = [8 + 6 * Math.sin(ph), 0]; P.lR = [-8 + 6 * Math.sin(ph), 0]; P.skirt = 8 * Math.sin(ph / 2); P.headTilt = 8 * Math.sin(ph / 2); break;
        }
        case 'eat': P.aR = [35, 120 + 8 * Math.sin(t * 9)]; P.headTilt = 4 + 3 * Math.sin(t * 9); break;
        case 'pet': P.headTilt = 8 * Math.sin(t * 5); P.aL = [-4, -42]; P.aR = [4, 42]; P.y = -Math.abs(Math.sin(t * 5)) * 2; break;
        case 'poke': { const k = Math.min(1, T / 0.45); P.y = -Math.sin(k * Math.PI) * 18; P.aL = [60, -20]; P.aR = [-60, 20]; P.headTilt = -dir * 8; break; }
        case 'nod': P.headY = Math.abs(Math.sin(t * 7)) * 2.5; P.headTilt = Math.sin(t * 3) * 4; P.aR = [-25, 30]; break;
        case 'look': P.headTilt = 13 * Math.sin(T * 2.2); break;
        case 'drag': {
          const sw = clamp(-this.dvx * 0.03, -40, 40) * dir;
          P.lL = [sw + 7, 10 + Math.abs(sw) * 0.3]; P.lR = [sw - 7, 12];
          P.aL = [140 + 20 * Math.sin(t * 12), -30]; P.aR = [-140 - 20 * Math.sin(t * 12 + 1), 30];
          P.headTilt = clamp(this.dvx * 0.02, -20, 20); P.skirt = clamp(this.dvx * 0.02, -12, 12); P.shadow = 0.5;
          this.dvx *= 0.9; break;
        }
        case 'fall': P.aL = [150, -10]; P.aR = [-150, 10]; P.lL = [14, 20]; P.lR = [-14, 20]; P.skirt = 6 * Math.sin(t * 20); P.sqy = 1.04; P.sqx = 0.97; P.shadow = 0.6; break;
        case 'land': { const k = Math.sin(Math.min(1, T / 0.35) * Math.PI) * 0.12; P.sqx = 1 + k; P.sqy = 1 - k; P.aL = [40, -10]; P.aR = [-40, 10]; break; }
        case 'dizzy': P.headTilt = 12 * Math.sin(t * 6); P.lean = 4 * Math.sin(t * 3); P.aL = [20, -30]; P.aR = [-20, 30]; break;
      }
      return P;
    }

    layoutOverlay() {
      const W = this.vw(), top = this.headTopPx();
      if (this.bubbleOn) {
        const bw = this.bubble.offsetWidth, bh = this.bubble.offsetHeight;
        const left = clamp(this.x - bw / 2, 6, W - bw - 6);
        this.bubble.style.left = left + 'px';
        this.bubble.style.top = Math.max(6, top - bh - 12) + 'px';
        this.bubble.style.setProperty('--tail', clamp(this.x - left, 16, bw - 16) + 'px');
      }
      if (this.timer.style.display !== 'none') {
        this.timer.style.left = clamp(this.x + this.w * 0.22, 4, W - 80) + 'px';
        this.timer.style.top = Math.max(4, top + 6) + 'px';
      }
      if (this.chatOpen) this.layoutChat();
    }

    frame(t) {
      if (!this.mounted) return;
      if (!alive()) return this.destroy();
      const dt = Math.min(0.05, Math.max(0, (t - this.last) / 1000)); this.last = t;
      this.update(dt);
      const pose = this.computePose();
      this.body.setPose(pose);
      this.actor.style.transform = `translate3d(${(this.x - this.w / 2).toFixed(1)}px, ${(this.y - this.feetOff).toFixed(1)}px, 0)`;
      this.layoutOverlay();
      this.raf = requestAnimationFrame((tt) => this.frame(tt));
    }
  }

  DC.Companion = Companion;
})();
