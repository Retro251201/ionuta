/* Corpo anime vettoriale (SVG) v2: curve morbide, cel-shading, proporzioni slanciate.
 * La testa e' una FOTO reale (PNG/WebP): MAI alterata e MAI specchiata. Quando il corpo
 * si gira a sinistra viene specchiato solo il corpo; la foto resta identica.
 * Capelli/accessori opzionali stanno SEMPRE dietro la foto (non la coprono).
 * Origine (0,0) = punto di attacco del collo. Unita' SVG, y verso il basso. Suola a FEET_Y.
 * API: new DC.Body(); setHead(head,url); setOutfit(o); setLook({hair,hairColor,accessory});
 *      setPose(pose); headTopUnits(); rebuild()
 */
(function () {
  const DC = (globalThis.DC = globalThis.DC || {});
  const NS = 'http://www.w3.org/2000/svg';
  const VB = { x: -125, y: -150, w: 250, h: 405 }; // fondo a y=255
  const FEET_Y = 250;
  const SH = 21.5, SHY = 19; // giunti spalle
  const HIPX = 10.5, HIPY = 96; // giunti anche
  const UA = 44, FA = 40, TH = 76, SN = 70; // braccio, avambraccio, coscia, stinco
  const FACE_UNITS = 56; // larghezza viso in unita'
  const SIT_Y = 141; // offset verticale del rig quando e' seduta a terra

  // profili arti: [w0 (attacco), b (rigonfiamento), w1, w2 (estremita')]
  const W_THIGH = [9.6, 1.3, 7.3, 5.7], W_SHIN = [5.7, 1.9, 3.8, 3.1];
  const W_UARM = [5.3, 0.5, 4.5, 4.0], W_FARM = [4.1, 0.7, 3.4, 2.9];

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function shade(hex, f) {
    hex = String(hex || '#888888');
    if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    const n = parseInt(hex.slice(1, 7), 16) || 0;
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const t = f < 0 ? 0 : 255, p = Math.abs(f);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  const r1 = (v) => Math.round(v * 100) / 100;
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;

  // Path simmetrico: meta' destra (x>=0) da `start` lungo segs ([x,y] = linea, [6 numeri] = cubica),
  // poi la meta' sinistra specchiata a ritroso. start dovrebbe stare su x=0.
  function sym(start, segs) {
    let d = `M ${start[0]} ${start[1]}`;
    const ends = [start];
    for (const s of segs) {
      d += s.length === 2 ? ` L ${s[0]} ${s[1]}` : ` C ${s[0]} ${s[1]} ${s[2]} ${s[3]} ${s[4]} ${s[5]}`;
      ends.push(s.length === 2 ? s : [s[4], s[5]]);
    }
    for (let i = segs.length - 1; i >= 0; i--) {
      const s = segs[i], p = ends[i];
      d += s.length === 2 ? ` L ${-p[0]} ${p[1]}` : ` C ${-s[2]} ${s[3]} ${-s[0]} ${s[1]} ${-p[0]} ${p[1]}`;
    }
    return d + ' Z';
  }
  // larghezza (meta') di un arto al parametro t (0..1)
  function wAt(w, t) {
    const a = w[0], b = w[0] + w[1], c = w[2], d = w[3], u = 1 - t;
    return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
  }
  // arto affusolato completo, origine al giunto, verso +y
  function limb(L, w) {
    const [w0, b, w1, w2] = w;
    return `M ${-w0} 0 C ${-w0 - b} ${r1(L * 0.34)} ${-w1} ${r1(L * 0.68)} ${-w2} ${L} A ${w2} ${r1(w2 * 0.9)} 0 0 0 ${w2} ${L} C ${w1} ${r1(L * 0.68)} ${r1(w0 + b * 0.4)} ${r1(L * 0.34)} ${w0} 0 A ${w0} ${r1(w0 * 0.7)} 0 0 0 ${-w0} 0 Z`;
  }
  // porzione di arto fra t0 e t1 (campionata), allargata di pad; cap tondo in fondo se t1=1
  function limbPart(L, w, t0, t1, pad) {
    pad = pad || 0; const N = 8, R = [], Lf = [];
    for (let i = 0; i <= N; i++) {
      const t = t0 + (t1 - t0) * i / N, x = wAt(w, t) + pad, y = L * t;
      R.push([x, y]); Lf.push([-x, y]);
    }
    let d = `M ${r1(Lf[0][0])} ${r1(Lf[0][1])}`;
    for (let i = 1; i <= N; i++) d += ` L ${r1(Lf[i][0])} ${r1(Lf[i][1])}`;
    const e = R[N][0];
    if (t1 >= 1) d += ` A ${r1(e)} ${r1(e * 0.9)} 0 0 0 ${r1(e)} ${r1(R[N][1])}`; else d += ` L ${r1(e)} ${r1(R[N][1])}`;
    for (let i = N - 1; i >= 0; i--) d += ` L ${r1(R[i][0])} ${r1(R[i][1])}`;
    return d + ' Z';
  }

  // ---- profili del busto (meta' destra) ----
  const SHOULDER = [[10, 7.2, 15, 9.8, 19.5, 12]];
  const FIT = [[23.5, 13.2, 26.2, 16.4, 25.8, 21], [25.4, 26, 21.6, 29, 20.2, 34], [19.3, 39.5, 20.4, 45, 18.8, 50.5], [17.2, 55.5, 14.2, 60, 13.8, 67]];
  const NECKS = {
    round: { s: [0, 10.5], g: [[3.6, 10.5, 6.4, 7.6, 6.8, 4]] },
    crew: { s: [0, 7.5], g: [[3.4, 7.5, 6.2, 6, 6.6, 3.4]] },
    v: { s: [0, 25], g: [[2.4, 19, 5.2, 9, 6.8, 4]] },
    deepv: { s: [0, 42], g: [[3, 30, 6, 12, 7, 3.5]] },
    high: { s: [0, -3.5], g: [[3, -3.5, 5.8, -3.5, 6.1, -2.5], [6.6, 3.5]] }
  };

  // stili legacy -> parti (gli outfit nuovi definiscono `parts` in skins.js)
  const STYLE = {
    sailor: { top: 'blouse', neck: 'round', collar: 'sailor', skirt: 'pleated', len: 146, legs: 'thigh', shoes: 'loafer', sleeve: 'puff', extras: ['hemline'] },
    hoodie: { top: 'hoodie', neck: 'crew', collar: 'hood', skirt: 'shorts', legs: 'knee', shoes: 'sneaker', sleeve: 'baggy', len: 112 },
    casual: { top: 'tee', neck: 'round', collar: 'headphones', skirt: 'pleated', len: 144, legs: 'knee', shoes: 'sneaker', sleeve: 'short', extras: ['gamepad'] },
    maid: { top: 'bodice', neck: 'round', collar: 'maid', skirt: 'puffy', len: 146, legs: 'thigh', shoes: 'mary', sleeve: 'puff', extras: ['apron', 'petticoat'] },
    yukata: { top: 'kimono', neck: 'deepv', collar: 'kimono', skirt: 'long', legs: 'bare', shoes: 'geta', sleeve: 'wide', extras: ['obi'], pattern: 'flowers' },
    idol: { top: 'bodice', neck: 'round', collar: 'idol', skirt: 'tiered', len: 142, legs: 'thigh', shoes: 'boot', bootH: 30, sleeve: 'puff', extras: ['star', 'petticoat'] }
  };
  function specOf(o) {
    const base = STYLE[o.style] || STYLE.sailor;
    const s = Object.assign({}, base, o.parts || {});
    s.extras = (o.parts && o.parts.extras) || base.extras || [];
    if (o.sleeve && !(o.parts && o.parts.sleeve)) s.sleeve = o.style === 'sailor' || o.style === 'maid' || o.style === 'idol' ? 'puff' : o.sleeve === 'long' && o.style === 'hoodie' ? 'baggy' : o.sleeve;
    if (o.parts && o.parts.sleeve) s.sleeve = o.parts.sleeve;
    s.has = (x) => s.extras.indexOf(x) >= 0;
    return s;
  }

  class Body {
    constructor() {
      this.svg = el('svg', { viewBox: `${VB.x} ${VB.y} ${VB.w} ${VB.h}`, class: 'dc-body', overflow: 'visible' });
      this.head = null; this.outfit = null; this.headUrl = '';
      this.look = { hair: 'long', hairColor: '#3a2a33', accessory: 'none' };
      this.pose = Body.restPose();
      this.dir = 1;
    }

    setHead(head, url) { this.head = head; this.headUrl = url; this.rebuild(); }
    setOutfit(outfit) { this.outfit = outfit; this.rebuild(); }
    setLook(look) { this.look = Object.assign({}, this.look, look || {}); this.rebuild(); }

    headMetrics() {
      const h = this.head; if (!h) return { s: 1, w: 100, h: 100, ax: 50, ay: 90 };
      const s = FACE_UNITS / (h.faceW * h.w);
      return { s, w: h.w * s, h: h.h * s, ax: h.anchorX * h.w * s, ay: h.anchorY * h.h * s };
    }

    // ---------- utilita' di disegno ----------
    grad(c, kind) {
      const key = c + '|' + (kind || 'c');
      if (this._g[key]) return this._g[key];
      const id = this.gid + 'g' + (this._n++);
      const v = kind === 'v' || kind === 'hairv';
      const g = el('linearGradient', { id, x1: 0, y1: 0, x2: v ? 0 : 1, y2: v ? 1 : 0 }, this.defs);
      let stops;
      if (kind === 'skin') stops = [[0, shade(c, -0.12)], [0.3, shade(c, 0.1)], [0.62, c], [1, shade(c, -0.2)]];
      else if (kind === 'hair') stops = [[0, shade(c, -0.15)], [0.35, shade(c, 0.12)], [0.65, c], [1, shade(c, -0.25)]];
      else if (kind === 'v') stops = [[0, shade(c, 0.1)], [0.6, c], [1, shade(c, -0.14)]];
      else stops = [[0, shade(c, 0.14)], [0.42, c], [1, shade(c, -0.17)]];
      for (const [o, col] of stops) el('stop', { offset: o, 'stop-color': col }, g);
      return (this._g[key] = `url(#${id})`);
    }
    pattern(type, color) {
      const key = 'p|' + type + '|' + color;
      if (this._g[key]) return this._g[key];
      const id = this.gid + 'p' + (this._n++);
      const sz = { dots: 9, stars: 16, flowers: 22, knit: 6, stripes: 9, hearts: 14 }[type] || 12;
      const p = el('pattern', { id, patternUnits: 'userSpaceOnUse', width: sz, height: type === 'knit' ? 10 : sz }, this.defs);
      if (type === 'dots') { el('circle', { cx: 2.5, cy: 2.5, r: 1.1, fill: color }, p); el('circle', { cx: 7, cy: 7, r: 1.1, fill: color }, p); }
      else if (type === 'stars') {
        el('path', { d: 'M 5 1.5 L 6 4 L 8.6 4.1 L 6.6 5.7 L 7.3 8.3 L 5 6.8 L 2.7 8.3 L 3.4 5.7 L 1.4 4.1 L 4 4 Z', fill: color }, p);
        el('circle', { cx: 12.5, cy: 12.5, r: 0.9, fill: color }, p);
      } else if (type === 'flowers') {
        const fl = (cx, cy, r, op) => {
          for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; el('circle', { cx: r1(cx + Math.cos(a) * r), cy: r1(cy + Math.sin(a) * r), r: r1(r * 0.85), fill: color, opacity: op }, p); }
          el('circle', { cx, cy, r: r1(r * 0.6), fill: '#fff6c8', opacity: op }, p);
        };
        fl(6, 6, 2.4, 0.95); fl(16.5, 16, 1.6, 0.8);
      } else if (type === 'knit') {
        el('path', { d: 'M 1.5 0 Q 4 2.5 1.5 5 Q -1 7.5 1.5 10 M 4.5 0 Q 2 2.5 4.5 5 Q 7 7.5 4.5 10', stroke: color, 'stroke-width': 0.55, fill: 'none', opacity: 0.55 }, p);
      } else if (type === 'stripes') {
        el('rect', { x: 0, y: 0, width: sz, height: 4.5, fill: color }, p);
      } else if (type === 'hearts') {
        el('path', { d: 'M 4 6 C 1 3.6 1.6 1 3 1 C 3.6 1 4 1.6 4 2 C 4 1.6 4.4 1 5 1 C 6.4 1 7 3.6 4 6 Z', fill: color }, p);
      }
      return (this._g[key] = `url(#${id})`);
    }
    // forma con riempimento a gradiente + contorno; opz. pattern sovrapposto
    part(parent, d, color, opt) {
      opt = opt || {};
      const e = el('path', { d, fill: opt.flat ? color : this.grad(color, opt.kind), stroke: opt.noStroke ? 'none' : (opt.stroke || shade(color, -0.4)), 'stroke-width': opt.sw || 0.85, 'stroke-linejoin': 'round', opacity: opt.op }, parent);
      if (opt.pattern) el('path', { d, fill: opt.pattern, stroke: 'none', 'pointer-events': 'none' }, parent);
      return e;
    }
    line(parent, d, color, w, op) { return el('path', { d, fill: 'none', stroke: color, 'stroke-width': w || 0.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: op }, parent); }
    skinPart(parent, d) { return el('path', { d, fill: this.skinF, stroke: this.skinLine, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }, parent); }

    rebuild() {
      if (!this.head || !this.outfit) return;
      const svg = this.svg; while (svg.firstChild) svg.removeChild(svg.firstChild);
      const o = this.outfit, S = (this.S = specOf(o));
      this.o = o;
      this.skin = this.head.skin || '#e8bfa5';
      this.defs = el('defs', null, svg);
      this.gid = 'dcg' + Math.random().toString(36).slice(2, 7); this._g = {}; this._n = 0;
      this.skinF = this.grad(this.skin, 'skin'); this.skinLine = shade(this.skin, -0.34);
      this.patTop = S.pattern && S.patternOn !== 'skirt' ? this.pattern(S.pattern, S.patternColor || o.top2) : null;
      this.patSkirt = S.pattern && S.patternOn !== 'top' ? this.pattern(S.pattern, S.patternColor || o.top2) : null;

      this.shadow = el('ellipse', { cx: 0, cy: FEET_Y + 1.5, rx: 36, ry: 5.5, fill: 'rgba(0,0,0,.2)' }, svg);
      this.rig = el('g', null, svg);
      this.lean = el('g', null, this.rig);
      // dietro a tutto: mantello, ali, coda, fiocco
      this.backFlip = el('g', null, this.lean);
      this.backG = el('g', null, this.backFlip);
      this.drawBack(this.backG);
      // capelli (dietro la foto e dietro il corpo)
      this.hairG = el('g', null, this.lean);
      this.hairSway = el('g', null, this.hairG);
      this.hairFlip = null;
      this.drawHair(this.hairSway);
      // corpo specchiabile
      this.flip = el('g', null, this.lean);
      this.legL = this.buildLeg(this.flip, -HIPX, -1);
      this.legR = this.buildLeg(this.flip, HIPX, 1);
      this.torsoSkinG = el('g', null, this.flip); // pelle del busto: dietro gonna e vestiti
      this.skirtG = el('g', null, this.flip);
      this.drawSkirt(this.skirtG);
      this.torsoG = el('g', null, this.flip);
      this.drawTorso(this.torsoG);
      this.armL = this.buildArm(this.torsoG, -SH, -1);
      this.armR = this.buildArm(this.torsoG, SH, 1);
      // testa: foto reale, fuori dal flip (mai specchiata)
      this.headG = el('g', null, this.lean);
      const m = this.headMetrics();
      this.headImg = el('image', { x: r1(-m.ax), y: r1(-m.ay), width: r1(m.w), height: r1(m.h), preserveAspectRatio: 'none', class: 'dc-head' }, this.headG);
      this.headImg.setAttribute('href', this.headUrl);
      // se la foto non si carica (es. CSP del sito blocca data:), ripiega sulla testa predefinita
      this.headImg.addEventListener('error', () => {
        const def = DC.headById && DC.headById('head_04');
        const url = def && DC.headUrl ? DC.headUrl(def) : '';
        if (url && this.headImg.getAttribute('href') !== url) { this.head = def; this.headUrl = url; this.rebuild(); }
        else this.headImg.style.display = 'none';
      }, { once: true });
      // colletto davanti alla base del collo della foto
      this.frontFlip = el('g', null, this.lean);
      this.collarG = el('g', null, this.frontFlip);
      this.drawCollar(this.collarG);
      this.setPose(this.pose);
    }

    // ---------- capelli ----------
    drawHair(g) {
      const L = this.look || {}, st = L.hair || 'none';
      if (st === 'none') return;
      const c = L.hairColor || '#3a2a33', F = this.grad(c, 'hair'), ln = shade(c, -0.45), hi = shade(c, 0.38);
      const k = FACE_UNITS / 56; // scala rispetto al viso
      const gg = el('g', { transform: `scale(${r1(k)})` }, g);
      const hp = (d) => el('path', { d, fill: F, stroke: ln, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, gg);
      const strands = (ds) => { for (const d of ds) this.line(gg, d, ln, 0.7, 0.45); };
      const shine = (d) => this.line(gg, d, hi, 2.2, 0.45);
      if (st === 'long' || st === 'wavy') {
        hp(st === 'long'
          ? sym([0, -64], [[14, -64, 30, -58, 33.5, -42], [37, -24, 35.5, -2, 35.5, 14], [35.5, 42, 36.5, 72, 33, 106], [31, 110, 28.5, 104, 26, 112], [22, 105, 17, 110, 13.5, 105], [10, 110, 4, 105, 0, 108]])
          : sym([0, -64], [[14, -64, 30, -58, 34, -42], [38, -26, 33, -9, 37.5, 8], [42, 26, 34, 44, 38.5, 62], [43, 80, 34, 94, 37, 110], [31, 117, 25, 106, 19, 114], [13, 107, 6, 112, 0, 107]]));
        strands(['M 27 -40 C 30 0 30 50 28 102', 'M -27 -40 C -30 0 -30 50 -28 102', 'M 18 20 C 19 50 19 80 18 104', 'M -18 20 C -19 50 -19 80 -18 104']);
        shine('M -29 -38 C -32 -24 -32.5 -10 -32 2');
      } else if (st === 'bob') {
        hp(sym([0, -64], [[14, -64, 30, -58, 33.5, -42], [36, -26, 37, -4, 34, 10], [32, 14.5, 28, 12, 25, 15.5], [19, 12, 10, 14, 0, 12]]));
        strands(['M 27 -38 C 30 -20 30 -4 29 10', 'M -27 -38 C -30 -20 -30 -4 -29 10']);
        shine('M -29 -36 C -32 -26 -32 -16 -31.5 -8');
      } else if (st === 'twin') {
        hp(sym([0, -64], [[14, -64, 30, -58, 33, -42], [35, -28, 35, -6, 32, 8], [29, 12, 24, 10, 0, 10]]));
        for (const sd of [1, -1]) {
          const t = el('g', { transform: `scale(${sd} 1)` }, gg);
          const tail = el('g', { class: 'dc-tail' }, t);
          el('path', { d: 'M 27 -50 C 44 -54 56 -36 54 -8 C 52 22 58 52 53 82 C 50 101 45 113 40 124 C 39 110 35 98 34 82 C 32 54 38 26 36 0 C 35 -20 33 -36 27 -50 Z', fill: F, stroke: ln, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, tail);
          this.line(tail, 'M 40 -30 C 47 0 45 40 46 80', ln, 0.7, 0.45);
          this.line(tail, 'M 44 -36 C 49 -24 50 -12 50 -2', hi, 2, 0.45);
          el('circle', { cx: 30, cy: -46, r: 4.3, fill: this.o.accent || '#ff6fae', stroke: shade(this.o.accent || '#ff6fae', -0.4), 'stroke-width': 0.7 }, t);
        }
      } else if (st === 'pony') {
        hp(sym([0, -64], [[14, -64, 30, -58, 33, -42], [35, -28, 35, -6, 32, 8], [29, 12, 24, 10, 0, 10]]));
        this.hairFlip = el('g', null, gg);
        const tail = el('g', { class: 'dc-tail' }, this.hairFlip);
        el('path', { d: 'M -14 -66 C -36 -78 -58 -62 -58 -34 C -58 -6 -50 24 -55 62 C -47 48 -42 26 -41 4 C -40 -20 -34 -42 -14 -52 Z', fill: F, stroke: ln, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, tail);
        this.line(tail, 'M -48 -48 C -52 -20 -49 10 -51 44', ln, 0.7, 0.45);
        el('circle', { cx: -16, cy: -60, r: 4.3, fill: this.o.accent || '#ff6fae' }, this.hairFlip);
      }
    }

    // ---------- accessori posteriori + mantello ----------
    drawBack(g) {
      const S = this.S, o = this.o, acc = (this.look && this.look.accessory) || 'none';
      this.wingL = this.wingR = this.tailG = null;
      if (S.has('cape')) {
        const cc = S.cape || shade(o.top, -0.3), lin = S.lining || o.top2;
        this.part(g, 'M -21 10 C -33 32 -46 92 -56 166 Q 0 178 56 166 C 46 92 33 32 21 10 Q 0 3 -21 10 Z', cc);
        this.part(g, 'M -17 14 C -28 36 -40 94 -49 162 Q 0 172 49 162 C 40 94 28 36 17 14 Q 0 8 -17 14 Z', lin, { noStroke: true });
      }
      if (acc === 'wings' || acc === 'devil' || acc === 'fairy') {
        const mk = (sd) => {
          const root = el('g', { transform: `translate(${sd * 5} 30) scale(${sd} 1)` }, g);
          const w = el('g', null, root);
          if (acc === 'wings') {
            this.part(w, 'M 0 0 C 12 -24 40 -34 62 -30 C 54 -22 57 -15 50 -9 C 55 -4 52 3 44 5 C 47 12 40 17 31 15 C 30 22 20 25 12 18 C 6 13 2 7 0 0 Z', '#ffffff', { stroke: '#b9c7e6' });
            for (const d of ['M 6 2 C 18 -6 34 -12 50 -10', 'M 8 8 C 20 2 32 -1 43 4', 'M 9 13 C 17 10 24 11 30 14']) this.line(w, d, '#c3d0ee', 0.8, 0.9);
          } else if (acc === 'devil') {
            this.part(w, 'M 0 0 C 10 -16 32 -32 58 -36 C 55 -26 58 -17 53 -10 C 47 -13 42 -8 40 -2 C 34 -6 27 -2 25 5 C 19 1 12 3 9 9 C 5 7 2 4 0 0 Z', '#4b2a5e');
            for (const d of ['M 0 0 L 58 -36', 'M 8 -4 L 40 -2', 'M 6 0 L 25 5']) this.line(w, d, '#2a1636', 0.9, 0.9);
          } else {
            el('ellipse', { cx: 26, cy: -16, rx: 26, ry: 12, transform: 'rotate(-28 26 -16)', fill: 'rgba(170,240,255,.45)', stroke: 'rgba(255,255,255,.95)', 'stroke-width': 1 }, w);
            el('ellipse', { cx: 20, cy: 10, rx: 17, ry: 8, transform: 'rotate(22 20 10)', fill: 'rgba(255,190,240,.45)', stroke: 'rgba(255,255,255,.95)', 'stroke-width': 1 }, w);
          }
          return w;
        };
        this.wingR = mk(1); this.wingL = mk(-1);
      }
      if (acc === 'cat') {
        const c = (this.look && this.look.hairColor) || '#3a2a33';
        this.tailG = el('g', null, g);
        this.line(this.tailG, 'M -2 90 C -18 98 -34 92 -38 74 C -42 58 -36 46 -28 40', shade(c, -0.4), 7.4);
        this.line(this.tailG, 'M -2 90 C -18 98 -34 92 -38 74 C -42 58 -36 46 -28 40', c, 5.8);
        this.line(this.tailG, 'M -36 62 C -38 54 -35 47 -30 42', shade(c, 0.3), 2, 0.6);
      }
      if (acc === 'bow' || S.has('backbow')) {
        const c = S.has('backbow') ? o.top2 : (o.accent || '#ff6fae');
        const b = el('g', { transform: 'translate(0 72)' }, g);
        this.part(b, 'M -2 4 L -16 46 L -9 43 L -5 50 L 3 6 Z', shade(c, -0.08));
        this.part(b, 'M 2 4 L 16 46 L 9 43 L 5 50 L -3 6 Z', shade(c, -0.08));
        this.part(b, 'M 0 0 C -10 -14 -38 -16 -38 -2 C -38 12 -12 9 0 0 Z', c);
        this.part(b, 'M 0 0 C 10 -14 38 -16 38 -2 C 38 12 12 9 0 0 Z', c);
      }
    }

    // ---------- gambe ----------
    buildLeg(parent, x, side) {
      const S = this.S, o = this.o; const g = el('g', null, parent);
      const sock = o.socks || '#ffffff', legs = S.legs || 'bare';
      const pantsC = S.pants || o.skirt;
      this.skinPart(g, limb(TH, W_THIGH));
      if (legs === 'thigh' || legs === 'striped') {
        const t0 = 0.74;
        this.part(g, limbPart(TH, W_THIGH, t0, 1, 0.35), sock);
        if (legs === 'striped') el('path', { d: limbPart(TH, W_THIGH, t0, 1, 0.35), fill: this.pattern('stripes', S.stripe2 || '#1b1424') }, g);
        this.part(g, limbPart(TH, W_THIGH, t0, t0 + 0.06, 0.6), S.band || shade(sock, sock === '#ffffff' ? -0.08 : 0.2), { flat: true });
      } else if (legs === 'tights') {
        el('path', { d: limb(TH, W_THIGH), fill: sock, opacity: S.tightsOp || 0.9 }, g);
      } else if (legs === 'pants') {
        this.part(g, limbPart(TH, W_THIGH, 0, 1, 2.1), pantsC, { pattern: this.patSkirt });
      }
      if (S.skirt === 'shorts') this.part(g, limbPart(TH, W_THIGH, 0, 0.27, 1.7), S.shorts || o.skirt);
      const knee = el('g', null, g);
      this.skinPart(knee, limb(SN, W_SHIN));
      if (legs === 'thigh' || legs === 'striped') {
        this.part(knee, limbPart(SN, W_SHIN, 0, 1, 0.35), sock, { noStroke: false, sw: 0.6 });
        if (legs === 'striped') el('path', { d: limbPart(SN, W_SHIN, 0, 1, 0.35), fill: this.pattern('stripes', S.stripe2 || '#1b1424') }, knee);
        el('circle', { cx: 0, cy: 0, r: 5.9, fill: this.grad(sock), stroke: 'none' }, knee);
      } else if (legs === 'knee') {
        this.part(knee, limbPart(SN, W_SHIN, 0.08, 1, 0.4), sock);
        this.part(knee, limbPart(SN, W_SHIN, 0.08, 0.14, 0.7), S.band || shade(sock, -0.1), { flat: true });
      } else if (legs === 'ankle') {
        this.part(knee, limbPart(SN, W_SHIN, 0.8, 1, 0.45), sock);
      } else if (legs === 'tights') {
        el('path', { d: limb(SN, W_SHIN), fill: sock, opacity: S.tightsOp || 0.9 }, knee);
        el('circle', { cx: 0, cy: 0, r: 5.6, fill: sock, opacity: (S.tightsOp || 0.9) * 0.6 }, knee);
      } else if (legs === 'pants') {
        el('circle', { cx: 0, cy: 0, r: 7.6, fill: this.grad(pantsC) }, knee);
        this.part(knee, limbPart(SN, W_SHIN, 0, 0.93, 2.6), pantsC, { pattern: this.patSkirt });
        this.part(knee, limbPart(SN, W_SHIN, 0.86, 0.93, 2.9), o.top2, { flat: true });
      }
      const shoe = el('g', { transform: `translate(0 ${SN})` }, knee);
      this.drawShoe(shoe);
      return { g, knee, x };
    }

    drawShoe(g) {
      const S = this.S, o = this.o, c = o.shoes || '#3a2a22', t = S.shoes || 'loafer';
      const dk = shade(c, -0.45);
      if (t === 'sandal' || t === 'geta') {
        const foot = 'M -3.8 -1.5 C -4.8 2.5 -5.2 5 -4.8 7.2 L 11.2 7.2 C 13.6 7.2 13.8 4.8 12.2 3.4 C 9.4 1.4 5 0.4 2.6 -1.5 Z';
        if (t === 'geta') { this.part(g, foot, '#fbfbfb', { stroke: '#c9c9c9' }); this.part(g, 'M -5.6 7 L 13 7 L 13 9.6 L -5.6 9.6 Z', c, { flat: true }); this.line(g, 'M 1 1 L 6 7', o.top2 || '#d33', 1.4); }
        else { this.skinPart(g, foot); this.part(g, 'M -5.4 7 L 12.8 7 Q 13.8 7.6 13 8.8 L -5.2 8.8 Z', c, { flat: true }); this.line(g, 'M -3.5 2.5 L 3.5 3.8 M 4 1.5 L 9 6.5', c, 1.5); }
        return;
      }
      if (t === 'slipper') {
        this.part(g, 'M -6 -2.5 C -8 3 -7 8.5 -4 8.6 L 12 8.6 C 16 8.6 17 2 13 -0.5 C 9 -3 0 -4.5 -6 -2.5 Z', c, { stroke: shade(c, -0.25) });
        this.part(g, 'M 6 -2 C 4 -10 6 -13 8 -12 C 10 -11 9.5 -6 9 -1.5 Z', c, { stroke: shade(c, -0.25) });
        this.part(g, 'M 9.5 -1 C 9.5 -9 12 -11 13.4 -9.8 C 14.6 -8.6 12.6 -4 11.6 0 Z', c, { stroke: shade(c, -0.25) });
        el('circle', { cx: 9.6, cy: 3, r: 0.9, fill: '#3a2a2a' }, g); el('circle', { cx: 13, cy: 3.2, r: 0.9, fill: '#3a2a2a' }, g);
        el('ellipse', { cx: 11.4, cy: 5.3, rx: 1.2, ry: 0.8, fill: '#ff9cc2' }, g);
        return;
      }
      if (t === 'boot') {
        const H = S.bootH || 30;
        this.part(g, `M -5.4 ${-H} C -5.5 ${-H * 0.5} -5.4 -6 -5.2 1 C -6 4 -6.3 6 -5.9 8.4 L 12.4 8.4 C 15.2 8.4 15.4 4.6 13.2 3 C 10.6 1.2 7 0 4.7 -2 C 4.8 ${-H * 0.4} 5 ${-H * 0.7} 5.4 ${-H} Z`, c, { stroke: dk });
        this.part(g, `M -6.2 6.6 L 13.8 6.6 Q 15 7.6 14.4 9.2 L -6 9.2 Q -6.8 8 -6.2 6.6 Z`, S.sole || dk, { flat: true, noStroke: true });
        if (S.bootFur) this.part(g, `M -7 ${-H - 2} Q 0 ${-H - 5} 7 ${-H - 2} L 7.2 ${-H + 4} Q 0 ${-H + 7} -7.2 ${-H + 4} Z`, '#fbf7f2', { stroke: '#d9cfc4' });
        else this.part(g, `M -5.8 ${-H} L 5.8 ${-H} L 5.6 ${-H + 3.2} L -5.6 ${-H + 3.2} Z`, S.bootTrim || shade(c, 0.22), { flat: true, sw: 0.6 });
        if (S.has('neon')) this.line(g, 'M -6 7 L 14 7', o.top2, 1.1);
        return;
      }
      if (t === 'sneaker') {
        this.part(g, 'M -4.8 -3.5 C -6.2 1 -6.4 5 -5.8 7 L 12.5 7 C 15 7 15.4 4 13.6 2.4 C 11 0.3 7 -0.8 4.5 -3.5 Z', c, { stroke: shade(c, -0.3) });
        this.part(g, 'M -6.2 5.8 L 14 5.8 Q 15.8 6.6 15 8.9 L -5.8 8.9 Q -6.9 7.6 -6.2 5.8 Z', S.sole || '#ffffff', { flat: true, stroke: '#cfcfcf' });
        this.line(g, 'M 2.5 -0.5 L 5.2 1.6 M 4.6 -1.2 L 7.4 1', o.accent || '#555', 1);
        return;
      }
      if (t === 'heel') {
        this.part(g, 'M -4.2 -1.5 C -5.2 1.5 -5.6 3.6 -5 5.4 L -4.3 8.6 L -2.6 8.6 L -1.8 6 C 3 6.6 8 8.4 12 8.4 C 14.2 8.4 14.4 5.6 12.6 4 C 9.6 2 5 0.8 2.4 -0.8 Z', c, { stroke: dk });
        return;
      }
      // loafer / mary jane
      const plat = S.platform ? 2.4 : 0;
      this.part(g, `M -4.6 -2.5 C -5.8 1 -6.2 5 -5.6 ${8 - plat} L 11.5 ${8 - plat} C 14.5 ${8 - plat} 15 4.6 13 2.8 C 10.5 0.8 6 -0.5 3.5 -2.5 Z`, c, { stroke: dk });
      if (plat) this.part(g, 'M -6 5.6 L 13.4 5.6 Q 14.6 7 13.8 9 L -5.8 9 Q -6.6 7.4 -6 5.6 Z', shade(c, 0.12), { flat: true });
      else this.line(g, 'M -5.6 8 L 11.8 8', dk, 1.6);
      if (t === 'mary') { this.line(g, 'M -3.6 -1.2 L 5.6 -0.6', dk, 1.5); el('circle', { cx: 5.4, cy: -0.6, r: 1, fill: shade(c, 0.4) }, g); }
      else this.line(g, 'M 2 0 C 4 0.8 6.5 1.6 8 2.6', shade(c, 0.3), 1.1);
      el('ellipse', { cx: 9, cy: 2.6, rx: 2.6, ry: 1, fill: '#fff', opacity: 0.25 }, g);
    }

    // ---------- gonne ----------
    drawSkirt(g) {
      const S = this.S, o = this.o, c = o.skirt, dk = shade(c, -0.4), t = S.skirt || 'pleated';
      const H = S.len || 146, pat = this.patSkirt;
      if (t === 'none') return;
      if (S.has('petticoat') || S.has('trimSkirt')) {
        const lace = S.lace || '#ffffff', y = H + (t === 'tiered' ? 2 : 4);
        let d = `M -44 ${H - 10} `; const n = 11;
        for (let i = 0; i < n; i++) { const x0 = -46 + 92 * i / n, x1 = -46 + 92 * (i + 1) / n; d += `${i ? '' : `L ${x0} ${y} `}Q ${r1((x0 + x1) / 2)} ${y + 5} ${r1(x1)} ${y} `; }
        d += `L 44 ${H - 10} Z`;
        this.part(g, d, lace, { flat: true, stroke: '#d8d2da', sw: 0.6 });
      }
      if (t === 'pleated') {
        const N = 8, hem = (i) => H + (i % 2 ? -2.2 : 1.6);
        const X = (i, a, b) => -a + (2 * a) * i / N;
        for (let i = 0; i < N; i++) {
          const d = `M ${r1(X(i, 15.5))} 73 L ${r1(X(i, 25.5))} 97 L ${r1(X(i, 43))} ${hem(i)} L ${r1(X(i + 1, 43))} ${hem(i + 1)} L ${r1(X(i + 1, 25.5))} 97 L ${r1(X(i + 1, 15.5))} 73 Z`;
          el('path', { d, fill: i % 2 ? shade(c, -0.1) : this.grad(c, 'v'), stroke: 'none' }, g);
        }
        let out = `M -15.5 72 L 15.5 72 C 21 80 25 90 25.5 97 L 43 ${hem(N)}`;
        for (let i = N - 1; i >= 0; i--) out += ` L ${r1(X(i, 43))} ${hem(i)}`;
        out += ' L -25.5 97 C -25 90 -21 80 -15.5 72 Z';
        el('path', { d: out, fill: pat || 'none', stroke: dk, 'stroke-width': 0.85, 'stroke-linejoin': 'round' }, g);
        for (let i = 1; i < N; i++) this.line(g, `M ${r1(X(i, 25.5))} 97 L ${r1(X(i, 43))} ${hem(i)}`, dk, 0.55, 0.5);
        if (S.has('hemline')) { let d = ''; for (let i = 0; i <= N; i++) d += `${i ? 'L' : 'M'} ${r1(X(i, 41.2))} ${r1(hem(i) - 5)} `; this.line(g, d, S.hemColor || '#ffffff', 1.3, 0.95); }
        if (S.has('sportStripe')) { let d = ''; for (let i = 0; i <= N; i++) d += `${i ? 'L' : 'M'} ${r1(X(i, 41.6))} ${r1(hem(i) - 4)} `; this.line(g, d, o.top2, 1.6); }
        if (S.has('neon')) { let d = ''; for (let i = 0; i <= N; i++) d += `${i ? 'L' : 'M'} ${r1(X(i, 42.6))} ${r1(hem(i) - 1.5)} `; this.line(g, d, o.top2, 1.3); }
      } else if (t === 'flare') {
        const jag = S.has('jagged');
        let d = `M -15 72 L 15 72 C 22 80 25.5 90 26 97 C 33 115 41 132 47 ${H}`;
        const n = jag ? 7 : 6;
        for (let i = 0; i < n; i++) {
          const x0 = 47 - 94 * i / n, x1 = 47 - 94 * (i + 1) / n;
          d += jag ? ` L ${r1((x0 + x1) / 2)} ${H + 7} L ${r1(x1)} ${H}` : ` Q ${r1((x0 + x1) / 2)} ${H + 6} ${r1(x1)} ${H}`;
        }
        d += ' C -41 132 -33 115 -26 97 C -25.5 90 -22 80 -15 72 Z';
        this.part(g, d, c, { pattern: pat });
        for (const x of [-26, -10, 10, 26]) this.line(g, `M ${r1(x * 0.5)} 100 Q ${x} ${r1((100 + H) / 2)} ${r1(x * 1.3)} ${H + 3}`, dk, 0.6, 0.45);
        if (S.fur) this.fluff(g, -47, H + 1, 47, H + 1, 4.4);
      } else if (t === 'puffy' || t === 'tiered') {
        const bell = (top, yTop, w2, yH, scallop) => {
          let d = `M ${-top} ${yTop} L ${top} ${yTop} C ${top + 9} ${yTop + 8} ${w2 - 5} ${yTop + 18} ${w2 - 2} ${r1((yTop + yH) / 2 + 4)} C ${w2 - 0.5} ${yH - 10} ${w2} ${yH - 4} ${w2} ${yH}`;
          for (let i = 0; i < scallop; i++) { const x0 = w2 - 2 * w2 * i / scallop, x1 = w2 - 2 * w2 * (i + 1) / scallop; d += ` Q ${r1((x0 + x1) / 2)} ${yH + 6} ${r1(x1)} ${yH}`; }
          d += ` C ${-w2} ${yH - 4} ${-w2 + 0.5} ${yH - 10} ${-w2 + 2} ${r1((yTop + yH) / 2 + 4)} C ${-w2 + 5} ${yTop + 18} ${-top - 9} ${yTop + 8} ${-top} ${yTop} Z`;
          return d;
        };
        if (t === 'tiered') {
          this.part(g, bell(26, 104, 47, H, 9), shade(c, 0.12), { pattern: pat });
          if (S.trim !== false) this.line(g, `M -46 ${H + 1} Q 0 ${H + 6} 46 ${H + 1}`, o.top2, 2, 0.9);
          this.part(g, bell(15, 72, 40, 120, 7), c, { pattern: pat });
          this.line(g, 'M -39 121 Q 0 127 39 121', o.top2, 1.8, 0.9);
        } else {
          this.part(g, bell(15, 72, 45, H, 9), c, { pattern: pat });
          for (const x of [-24, -8, 8, 24]) this.line(g, `M ${r1(x * 0.45)} 96 Q ${x} ${r1((96 + H) / 2)} ${r1(x * 1.4)} ${H + 3}`, dk, 0.6, 0.45);
          if (S.has('trimSkirt')) this.line(g, `M -43 ${H - 3} Q 0 ${H + 3} 43 ${H - 3}`, o.accent, 1.8, 0.95);
        }
        if (S.has('apron')) {
          let d = 'M -15 76 L 15 76 C 20 92 26 112 28 132'; const n = 6;
          for (let i = 0; i < n; i++) { const x0 = 28 - 56 * i / n, x1 = 28 - 56 * (i + 1) / n; d += ` Q ${r1((x0 + x1) / 2)} 138 ${r1(x1)} 132`; }
          d += ' C -26 112 -20 92 -15 76 Z';
          this.part(g, d, '#ffffff', { stroke: '#cfc9d4' });
          this.line(g, 'M -26 127 Q 0 133 26 127', '#e3dde8', 1, 0.9);
        }
      } else if (t === 'long') {
        const d = 'M -16 72 L 16 72 C 22 80 26 90 26 100 C 25.5 150 25 200 26.5 237 Q 0 241 -26.5 237 C -25 200 -25.5 150 -26 100 C -26 90 -22 80 -16 72 Z';
        this.part(g, d, c, { pattern: pat });
        this.line(g, 'M 8 76 C 12 120 13 180 14.5 238', dk, 0.9, 0.7);
        this.part(g, 'M -26.6 230 Q 0 234 26.6 230 L 26.6 237 Q 0 241 -26.6 237 Z', shade(c, -0.18), { flat: true, noStroke: true });
      } else if (t === 'hakama') {
        const d = 'M -17 70 L 17 70 C 24 78 28 92 28.5 102 L 39 238 Q 0 243 -39 238 L -28.5 102 C -28 92 -24 78 -17 70 Z';
        this.part(g, d, c);
        for (const x of [-20, -9, 3, 14]) this.line(g, `M ${r1(x * 0.7)} 74 L ${r1(x * 1.5)} 238`, dk, 0.7, 0.55);
        this.line(g, 'M 0 150 L 0 240', dk, 0.9, 0.6);
      } else if (t === 'pencil') {
        const d = `M -14 72 L 14 72 C 20 80 24 90 24.5 100 C 24.5 125 23 150 21.5 ${H} L -21.5 ${H} C -23 150 -24.5 125 -24.5 100 C -24 90 -20 80 -14 72 Z`;
        this.part(g, d, c);
        this.line(g, `M 10 104 C 12 130 12 150 11 ${H - 1}`, dk, 0.6, 0.45);
        this.line(g, `M 0 ${H - 16} L 0 ${H}`, dk, 0.8, 0.7);
      } else if (t === 'shorts') {
        this.part(g, 'M -15 72 L 15 72 C 22 80 25 92 26 106 L 3 109 L 0 104 L -3 109 L -26 106 C -25 92 -22 80 -15 72 Z', S.shorts || c);
      }
    }

    fluff(g, x0, y0, x1, y1, r) {
      const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / (r * 1.3)));
      for (let i = 0; i <= n; i++) {
        const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
        el('circle', { cx: r1(x), cy: r1(y + (i % 2 ? 0.8 : -0.6)), r: r1(r * (i % 2 ? 0.95 : 1.1)), fill: '#fbf7f2', stroke: '#ddd3c8', 'stroke-width': 0.5 }, g);
      }
    }

    // ---------- busto ----------
    topOutline(kind, neck, len) {
      const N = NECKS[neck] || NECKS.round;
      if (kind === 'hoodie' || kind === 'sweater' || kind === 'pajama') {
        const wide = kind === 'pajama' ? 27.5 : 29.5, L = len || (kind === 'sweater' ? 132 : kind === 'pajama' ? 100 : 112);
        return sym(N.s, N.g.concat([[11, 7, 19, 9.6, 24, 12.6], [28.5, 15, wide + 0.6, 20, wide, 28], [wide - 0.8, 48, wide - 3, 76, wide - 1.5, L - 4], [wide - 1.4, L, wide - 6, L + 1, 0, L + 1]]));
      }
      if (neck === 'square') {
        return sym([0, 31], [[5, 31, 11, 31, 11.5, 27], [11.5, 20], [15, 20, 19, 26, 20.2, 34], FIT[2], FIT[3], [13.6, 72, 14.6, 77.5, 16, 82], [0, 82]]);
      }
      const tail = kind === 'jacket'
        ? [[13.6, 74, 18.5, 88, 22.5, 104], [14, 106.5, 6, 104.5, 0, 97]]
        : [[13.6, 72, 14.6, 77.5, 16, 82], [0, 82]];
      return sym(N.s, N.g.concat(SHOULDER, FIT, tail));
    }

    drawTorso(g) {
      const S = this.S, o = this.o, c = o.top, dk = shade(c, -0.4), kind = S.top || 'blouse';
      // collo + busto (pelle) nel livello dietro la gonna
      const sg = this.torsoSkinG || g;
      this.skinPart(sg, sym([0, -12], [[5, -12], [5.8, 3], [8, 7, 14, 9.8, 19.5, 12]].concat(FIT, [[13.6, 72, 15.5, 78, 18, 84], [20.5, 89, 23, 94, 24, 102], [0, 102]])));
      el('path', { d: 'M -5.4 -3 Q 0 2.5 5.4 -3 L 5.7 2.6 Q 0 7.5 -5.7 2.6 Z', fill: shade(this.skin, -0.22), opacity: 0.55 }, sg);
      if (S.neck === 'square') this.line(sg, 'M -13 13.5 Q -8 15.5 -3.5 13.8 M 13 13.5 Q 8 15.5 3.5 13.8', shade(this.skin, -0.25), 0.7, 0.6);
      // capo inferiore (giacca: camicetta sotto)
      if (kind === 'jacket') {
        this.part(g, this.topOutline('blouse', 'round', 82), o.top2);
      }
      const out = this.topOutline(kind, kind === 'kimono' ? 'crew' : (S.neck || (kind === 'hoodie' ? 'crew' : 'round')), S.topLen);
      this.part(g, out, c, { pattern: this.patTop });
      // ombre cel e forma
      const isLoose = kind === 'hoodie' || kind === 'sweater' || kind === 'pajama';
      if (!isLoose) {
        el('path', { d: 'M 20.2 34 C 19.3 39.5 20.4 45 18.8 50.5 C 17.2 55.5 14.2 60 13.8 67 C 13.6 72 14.6 77.5 16 82 L 11.5 82 C 10.4 74 10.8 66 12.6 58.5 C 14.8 51 15.6 42 14.4 34 Z', fill: dk, opacity: 0.16 }, g);
        this.line(g, 'M -16.8 45.5 C -13.5 51.5 -7 52.5 -3 48 M 16.8 45.5 C 13.5 51.5 7 52.5 3 48', dk, 0.75, 0.38);
        el('ellipse', { cx: -10, cy: 41.5, rx: 4.5, ry: 2.6, fill: '#fff', opacity: 0.13 }, g);
      } else {
        el('path', { d: 'M 29 28 C 28.2 48 26 76 27.5 104 L 22 104 C 21 80 22 50 24 30 Z', fill: dk, opacity: 0.14 }, g);
        this.line(g, 'M -15 48 C -11 53 -6 53 -3 50 M 15 48 C 11 53 6 53 3 50', dk, 0.7, 0.3);
      }
      if (S.neck === 'square' && S.straps !== false) this.line(g, 'M -11.2 21 L -12.6 9.5 M 11.2 21 L 12.6 9.5', c, 2.4);
      // dettagli per tipo
      if (kind === 'bodice') this.line(g, 'M -9 54 C -8 64 -8 72 -9 82 M 9 54 C 8 64 8 72 9 82', dk, 0.6, 0.35);
      if (kind === 'hoodie') {
        const L = S.topLen || 112;
        this.part(g, `M -16 ${L - 34} L 16 ${L - 34} L 19 ${L - 12} L -19 ${L - 12} Z`, shade(c, -0.06), { sw: 0.7 });
        this.part(g, `M -28.5 ${L - 7} L 28.5 ${L - 7} L 29 ${L + 1} Q 0 ${L + 2.5} -29 ${L + 1} Z`, o.top2, { flat: true, sw: 0.7 });
        this.line(g, 'M -4 12 L -5 36 M 4 12 L 5 36', o.accent, 1.3);
        el('circle', { cx: -5, cy: 37, r: 1.3, fill: o.accent }, g); el('circle', { cx: 5, cy: 37, r: 1.3, fill: o.accent }, g);
      }
      if (kind === 'sweater') {
        const L = S.topLen || 132;
        this.part(g, `M -28 ${L - 7} L 28 ${L - 7} L 28.5 ${L + 1} Q 0 ${L + 2.5} -28.5 ${L + 1} Z`, shade(c, -0.08), { flat: true, sw: 0.7 });
        for (let x = -26; x <= 26; x += 3.2) this.line(g, `M ${r1(x)} ${L - 6} L ${r1(x)} ${L}`, shade(c, -0.25), 0.5, 0.6);
        this.line(g, `M 0 14 L 0 ${L - 8}`, shade(c, -0.18), 3, 0.25);
      }
      if (kind === 'pajama') {
        const L = S.topLen || 100;
        this.line(g, `M 2 10 L 2 ${L}`, shade(c, -0.3), 0.7, 0.7);
        for (let y = 24; y < L - 4; y += 18) el('circle', { cx: 0, cy: y, r: 1.7, fill: o.accent, stroke: shade(o.accent, -0.4), 'stroke-width': 0.5 }, g);
        this.line(g, `M -26.8 ${L - 2} Q 0 ${L + 1.5} 26.8 ${L - 2}`, o.top2, 1.6, 0.95);
      }
      if (kind === 'jacket') {
        this.part(g, 'M 6.8 4 L 13 9 L 10 17 L 13.5 20 L 4 44 L 2.5 40 Z', shade(c, -0.06), { sw: 0.7 });
        this.part(g, 'M -6.8 4 L -13 9 L -10 17 L -13.5 20 L -4 44 L -2.5 40 Z', shade(c, -0.06), { sw: 0.7 });
        this.line(g, 'M 0 44 L 0 97', dk, 0.7, 0.6);
        const bc = S.buttonColor || shade(c, 0.35);
        el('circle', { cx: 1.6, cy: 62, r: 1.5, fill: bc, stroke: shade(bc, -0.4), 'stroke-width': 0.5 }, g);
        el('circle', { cx: 1.6, cy: 76, r: 1.5, fill: bc, stroke: shade(bc, -0.4), 'stroke-width': 0.5 }, g);
        this.line(g, 'M 13 76 L 21 75 M -13 76 L -21 75', dk, 0.7, 0.5);
      }
      if (kind === 'kimono') this.line(g, 'M 7 3 C 4 18 -4 40 -14 60', dk, 0.6, 0.4);
      if (kind === 'tee' && S.has('gamepad')) {
        const a = o.accent || '#20c997';
        this.part(g, 'M -8 46 Q -8 41 -3 41 L 3 41 Q 8 41 8 46 Q 8 51 4 51 L -4 51 Q -8 51 -8 46 Z', a, { flat: true, sw: 0.5, stroke: shade(a, -0.4) });
        this.line(g, 'M -5.5 46 L -2.5 46 M -4 44.5 L -4 47.5', shade(a, -0.6), 0.8);
        el('circle', { cx: 3.5, cy: 45, r: 0.9, fill: shade(a, -0.6) }, g); el('circle', { cx: 5, cy: 47, r: 0.9, fill: shade(a, -0.6) }, g);
      }
      if (kind === 'tee' && S.has('sportStripe')) this.line(g, 'M -20 34 L -15 80 M 20 34 L 15 80', o.top2, 1.2, 0.8);
      // extra
      if (S.has('apron')) {
        this.part(g, 'M -11 36 L 11 36 L 13 76 L -13 76 Z', '#ffffff', { stroke: '#cfc9d4' });
        this.line(g, 'M -11 36 L -14.5 12 M 11 36 L 14.5 12', '#ffffff', 3);
        this.line(g, 'M -11 36 L -14.5 12 M 11 36 L 14.5 12', '#cfc9d4', 0.5, 0.8);
        this.line(g, 'M -10 40 L 10 40', '#e6e0ea', 0.8);
      }
      if (S.has('corset')) {
        this.part(g, 'M -9 50 L 9 50 L 10.5 82 L -10.5 82 Z', shade(c, 0.08), { sw: 0.6 });
        let d = ''; for (let y = 53; y < 80; y += 5) d += `M -3.5 ${y} L 3.5 ${y + 3.5} M 3.5 ${y} L -3.5 ${y + 3.5} `;
        this.line(g, d, o.accent, 0.9);
      }
      if (S.has('neon')) { this.line(g, 'M -19.5 36 C -18.5 50 -14.5 62 -15 82 M 19.5 36 C 18.5 50 14.5 62 15 82', o.top2, 1.2); this.line(g, 'M -12 30 L 12 30', o.accent, 1); }
      if (S.has('obi')) {
        this.part(g, sym([0, 56.5], [[16.4, 56.5], [17, 64, 16.4, 74, 17.8, 83.5], [0, 83.5]]), o.accent);
        this.part(g, sym([0, 56.5], [[16.4, 56.5], [16.6, 58.8], [0, 59.2]]), o.top2, { flat: true, sw: 0.5 });
        this.line(g, 'M -17 71 Q 0 73 17 71', S.cord || shade(o.top2, -0.15), 1.4);
      }
      if (S.has('hakamaTie')) {
        this.part(g, sym([0, 69], [[16.5, 69], [16.8, 72], [16.8, 75, 17, 76, 17.2, 77], [0, 77]]), o.skirt, { flat: true, sw: 0.6 });
        this.bow(g, 0, 76, 0.5, o.skirt, false);
      }
      if (S.has('belt')) {
        this.part(g, sym([0, 73], [[15.6, 73], [15.9, 76, 16, 77, 16.2, 79], [0, 79]]), S.beltColor || '#1d1d24', { flat: true, sw: 0.6 });
        this.part(g, 'M -3 72.4 L 3 72.4 L 3 79.6 L -3 79.6 Z', S.buckle || '#f1c84b', { flat: true, sw: 0.6 });
        el('rect', { x: -1.4, y: 74.4, width: 2.8, height: 3.2, fill: S.beltColor || '#1d1d24' }, g);
      }
      if (S.has('ribbonWaist')) {
        this.part(g, sym([0, 64], [[14.4, 64], [14, 66.5, 13.9, 68.5, 14, 70.5], [0, 70.5]]), o.top2, { flat: true, sw: 0.5 });
        this.bow(g, 9, 67, 0.42, o.top2, true);
      }
      if (S.has('star')) this.star(g, 0, S.collar === 'idol' ? 44 : 40, 5.2, o.accent);
      if (S.has('brooch')) { el('circle', { cx: -8, cy: 24, r: 2, fill: o.accent, stroke: shade(o.accent, -0.4), 'stroke-width': 0.6 }, g); el('circle', { cx: -8, cy: 24, r: 0.8, fill: '#fff', opacity: 0.7 }, g); }
    }

    star(g, cx, cy, R, col) {
      let d = '';
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R; d += `${i ? 'L' : 'M'} ${r1(cx + Math.cos(a) * rr)} ${r1(cy + Math.sin(a) * rr)} `; }
      this.part(g, d + 'Z', col, { stroke: shade(col, -0.45), sw: 0.7 });
      el('circle', { cx: cx - R * 0.2, cy: cy - R * 0.25, r: R * 0.18, fill: '#fff', opacity: 0.7 }, g);
    }

    bow(g, cx, cy, k, col, tails) {
      const b = el('g', { transform: `translate(${r1(cx)} ${r1(cy)}) scale(${r1(k)})` }, g);
      if (tails) {
        this.part(b, 'M -1.5 1 L -7 15 L -3.4 13.6 L -1.2 17 L 1.6 2 Z', shade(col, -0.1));
        this.part(b, 'M 1.5 1 L 7 15 L 3.4 13.6 L 1.2 17 L -1.6 2 Z', shade(col, -0.1));
      }
      this.part(b, 'M 0 0 C -4 -6.5 -12.5 -7 -12.5 -0.5 C -12.5 5.5 -4 5 0 0 Z', col);
      this.part(b, 'M 0 0 C 4 -6.5 12.5 -7 12.5 -0.5 C 12.5 5.5 4 5 0 0 Z', col);
      this.line(b, 'M -3 -1 Q -7 -1.5 -9.5 -3 M 3 -1 Q 7 -1.5 9.5 -3', shade(col, -0.35), 0.7, 0.6);
      el('ellipse', { cx: 0, cy: 0, rx: 2.7, ry: 2.9, fill: shade(col, -0.1), stroke: shade(col, -0.45), 'stroke-width': 0.7 }, b);
    }

    mirror(g, fn) { fn(g); fn(el('g', { transform: 'scale(-1 1)' }, g)); }

    // ---------- colletti (davanti alla base del collo della foto) ----------
    drawCollar(g) {
      const S = this.S, o = this.o, t = S.collar || 'none';
      if (t === 'sailor') {
        const col = S.collarColor || o.top2;
        this.part(g, sym([0, 30], [[3, 22, 5.5, 11, 7, 2.5], [12, 5, 20, 8, 24.5, 12.5], [26.8, 15.5, 26.4, 21, 22.6, 23.2], [16, 25.6, 6, 34, 0, 44]]), col);
        this.mirror(g, (m) => this.line(m, 'M 23.2 15.4 C 24.2 18 23 20.4 21 21.1 C 14.5 23.4 6.8 29.6 2.6 37', S.hemColor || '#ffffff', 1.1));
        this.bow(g, 0, 33, 0.72, o.accent, true);
      } else if (t === 'hood') {
        this.part(g, 'M -17 4 Q 0 21 17 4 Q 25.5 9.5 21.5 18.5 Q 0 31.5 -21.5 18.5 Q -25.5 9.5 -17 4 Z', shade(o.top, -0.04));
        this.line(g, 'M -14 9 Q 0 22 14 9', shade(o.top, -0.35), 0.7, 0.6);
      } else if (t === 'maid') {
        this.mirror(g, (m) => this.part(m, 'M 0 9 C -3 7.5 -5.8 5 -6.8 2 C -12 4 -14.5 9.5 -11.5 14 C -8 18.5 -2.5 15.5 0 9 Z', '#ffffff', { stroke: '#cbc4d0' }));
        this.bow(g, 0, 9.5, 0.55, o.accent, true);
      } else if (t === 'kimono') {
        const col = S.collarColor || o.top2, band = (d) => {
          if (S.underCollar) this.line(g, d, S.underCollar, 7.4);
          this.line(g, d, shade(col, -0.4), 5.6); this.line(g, d, col, 4.4);
        };
        band('M -7 1.5 C -4 14 -1 26 2.5 40');
        band('M 7 1.5 C 4 18 -4 40 -13.6 57');
      } else if (t === 'idol' || t === 'frill') {
        const lace = t === 'frill' ? (S.lace || '#f4f0f2') : '#ffffff';
        this.part(g, 'M -12.5 2.5 Q -13.5 9 -9.5 11 Q -7.5 15.5 -3.2 13.4 Q 0 16.5 3.2 13.4 Q 7.5 15.5 9.5 11 Q 13.5 9 12.5 2.5 Q 6 8 0 8.5 Q -6 8 -12.5 2.5 Z', lace, { stroke: '#cfc8d4' });
        if (t === 'frill') {
          this.part(g, 'M -9 7 Q -9.5 12 -6 13 Q -3 16.5 0 14 Q 3 16.5 6 13 Q 9.5 12 9 7 Q 4.5 10.5 0 10.8 Q -4.5 10.5 -9 7 Z', lace, { stroke: '#cfc8d4' });
          this.bow(g, 0, 12, 0.62, o.accent, true);
          el('ellipse', { cx: 0, cy: 23, rx: 2.6, ry: 3.2, fill: o.accent, stroke: '#d9c27a', 'stroke-width': 0.9 }, g);
        } else this.bow(g, 0, 12.5, S.has('bigbow') ? 1.3 : 0.85, o.accent, true);
      } else if (t === 'shirt' || t === 'polo') {
        const col = S.collarColor || (t === 'polo' ? o.top : o.top2);
        this.mirror(g, (m) => this.part(m, 'M 0.6 8.5 L 6.6 2 L 11.4 5 L 6.2 13.5 Z', col, { stroke: shade(col, -0.35) }));
        if (t === 'polo') { this.line(g, 'M 0 9 L 0 24', shade(o.top, -0.3), 0.6); el('circle', { cx: 0.9, cy: 15, r: 0.9, fill: shade(o.top, -0.25) }, g); el('circle', { cx: 0.9, cy: 21, r: 0.9, fill: shade(o.top, -0.25) }, g); this.mirror(g, (m) => this.line(m, 'M 6.2 3.2 L 10.6 5.6', o.top2, 0.9)); }
        if (S.bow) this.bow(g, 0, 10.5, 0.55, S.bow, true);
        if (S.tie) { this.part(g, 'M -1.8 10 L 1.8 10 L 2.6 13 L 3.8 30 L 0 34.5 L -3.8 30 L -2.6 13 Z', S.tie); }
      } else if (t === 'turtle') {
        this.part(g, 'M -7.2 -2.5 Q 0 -0.5 7.2 -2.5 L 8.8 8.4 Q 0 12 -8.8 8.4 Z', o.top);
        let d = ''; for (let x = -6; x <= 6; x += 2.4) d += `M ${r1(x)} ${r1(-1.6 + Math.abs(x) * 0.05)} L ${r1(x * 1.18)} ${r1(9.6 - Math.abs(x) * 0.12)} `;
        this.line(g, d, shade(o.top, -0.25), 0.55, 0.7);
      } else if (t === 'fur') {
        for (let i = 0; i <= 10; i++) { const u = i / 10, x = -18 + 36 * u, y = 5 + 9 * (1 - Math.pow(2 * u - 1, 2)); el('circle', { cx: r1(x), cy: r1(y), r: i % 2 ? 4 : 4.6, fill: '#fbf7f2', stroke: '#ddd3c8', 'stroke-width': 0.5 }, g); }
        el('circle', { cx: 0, cy: 22, r: 2.3, fill: '#fbf7f2', stroke: '#ddd3c8', 'stroke-width': 0.5 }, g);
      } else if (t === 'high') {
        this.part(g, 'M -7.2 -2 L 7.2 -2 L 9.4 9.4 Q 0 12.5 -9.4 9.4 Z', shade(o.top, 0.06));
        this.line(g, 'M -8.6 6.4 Q 0 9 8.6 6.4', o.top2, 1.1);
      } else if (t === 'peter') {
        this.mirror(g, (m) => this.part(m, 'M 0 9 C -3 7.5 -5.8 5 -6.8 2.5 C -11.5 4 -13.5 8.8 -10.8 12.8 C -7.6 16.4 -2.6 14.8 0 9 Z', o.top2, { stroke: shade(o.accent, -0.2) }));
      } else if (t === 'headphones') {
        const a = o.accent || '#20c997';
        this.mirror(g, (m) => { this.line(m, 'M 9.5 5 C 9.5 0 7.5 -1.5 5.6 -1.5', '#26262e', 2.2); this.part(m, 'M 6.4 4 Q 6 10.6 10.4 12.6 Q 15.4 13.4 15.6 7.6 Q 15.4 2.4 11 2 Q 7.4 1.8 6.4 4 Z', '#26262e', { flat: true, stroke: '#111' }); this.line(m, 'M 8.4 4.8 Q 8.6 10 11.6 10.6', a, 1.2); });
      } else if (t === 'necklace') {
        this.line(g, 'M -6.2 4 Q 0 17 6.2 4', S.chain || '#e0b44c', 0.7);
        el('circle', { cx: 0, cy: 14.4, r: 1.7, fill: o.accent, stroke: '#e0b44c', 'stroke-width': 0.6 }, g);
      }
      if (S.has('scarf')) {
        const sc = S.scarf || o.top2;
        this.part(g, 'M 4 9 L 13.5 9.5 L 16.5 47 L 13 44.5 L 11.2 48.5 L 8 45 Z', shade(sc, -0.05));
        this.part(g, 'M -10 -1.4 Q 0 2.6 10 -1.4 L 12.6 9.6 Q 0 15.5 -12.6 9.6 Z', sc);
        this.line(g, 'M -11.4 4.2 Q 0 9.4 11.4 4.2 M 9 20 L 14.4 20 M 9.8 32 L 15.2 32', shade(sc, 0.3), 1, 0.7);
      }
    }

    // ---------- braccia ----------
    buildArm(parent, x, side) {
      const S = this.S, o = this.o, sl = S.sleeve || 'short', c = S.sleeveColor || o.top;
      const pat = S.patternOn === 'top' ? this.patTop : null;
      const g = el('g', null, parent);
      this.skinPart(g, limb(UA, W_UARM));
      const upper = (p, w0) => {
        const ug = el('g', { transform: 'translate(0 -6)' }, g);
        this.part(ug, limb(UA + 7, [w0 || 5.6 + p, 0.4, 4.6 + p, 4.3 + p]), c, { pattern: pat });
      };
      if (sl === 'puff' || sl === 'puffLong') {
        if (sl === 'puffLong') upper(0.8);
        this.part(g, 'M -6.6 -5.5 C -10 1 -10 10.5 -7 16 Q 0 18.5 7 16 C 10 10.5 10 1 6.6 -5.5 Q 0 -9.5 -6.6 -5.5 Z', c, { pattern: pat });
        this.line(g, 'M -3.5 -6 Q -5 5 -3 15 M 3.5 -6 Q 5 5 3 15', shade(c, -0.35), 0.6, 0.45);
        if (sl === 'puff') this.part(g, 'M -6.8 13.6 Q 0 16.4 6.8 13.6 L 6.3 17.6 Q 0 20.2 -6.3 17.6 Z', S.cuff || o.top2, { flat: true, sw: 0.6 });
      } else if (sl === 'short' || sl === 'cap') {
        const L = sl === 'cap' ? 9 : 15;
        this.part(g, `M -6 -5.5 C -7.6 1 -7.4 ${L - 4} -6.2 ${L} Q 0 ${L + 2} 6.2 ${L} C 7.4 ${L - 4} 7.6 1 6 -5.5 Q 0 -9 -6 -5.5 Z`, c, { pattern: pat });
        if (S.has('sportStripe') || S.cuff) this.line(g, `M -6.1 ${L - 1.6} Q 0 ${L + 0.4} 6.1 ${L - 1.6}`, S.cuff || o.top2, 1.3);
        if (S.fur) this.fluff(g, -6.5, L, 6.5, L, 2.4);
      } else if (sl === 'long' || sl === 'baggy' || sl === 'flare') upper(sl === 'baggy' ? 2.2 : 0.9);
      else if (sl === 'wide') upper(1.4);

      const elbow = el('g', null, g);
      this.skinPart(elbow, limb(FA, W_FARM));
      const hand = el('g', { transform: `translate(0 ${FA})` }, elbow);
      this.skinPart(hand, 'M -2.9 -1 C -3.8 2.5 -3.9 6.5 -2.8 9.2 C -1.9 11.3 1.2 11.6 2.5 9.6 C 3.6 7.8 3.9 3.8 3.1 -1 Z');
      el('ellipse', { cx: r1(-side * 2.3), cy: 4.4, rx: 1.4, ry: 2.8, fill: this.skinF, stroke: this.skinLine, 'stroke-width': 0.5, transform: `rotate(${-side * 12} ${r1(-side * 2.3)} 4.4)` }, hand);
      el('path', { d: 'M -1 6.8 Q 0 8 1.2 6.8', fill: 'none', stroke: this.skinLine, 'stroke-width': 0.4, opacity: 0.6 }, hand);

      if (sl === 'long' || sl === 'baggy' || sl === 'flare' || sl === 'puffLong') {
        const p = sl === 'baggy' ? 2.2 : 0.9;
        this.part(elbow, limb(FA - 3, [4.5 + p, 0.5, 3.9 + p, 3.7 + p]), c, { pattern: pat });
        if (sl === 'baggy') {
          this.part(elbow, `M ${-4.3 - p * 0.6} ${FA - 7} L ${4.3 + p * 0.6} ${FA - 7} L ${3.9 + p * 0.4} ${FA - 0.5} L ${-3.9 - p * 0.4} ${FA - 0.5} Z`, S.cuff || shade(c, -0.08), { flat: true, sw: 0.6 });
          this.line(elbow, `M -2 ${FA - 6.5} L -2 ${FA - 1} M 0 ${FA - 6.5} L 0 ${FA - 1} M 2 ${FA - 6.5} L 2 ${FA - 1}`, shade(c, -0.3), 0.45, 0.6);
        } else if (sl === 'flare') {
          this.part(elbow, `M -4.4 ${FA - 12} L 4.4 ${FA - 12} L 9 ${FA + 1.5} Q 0 ${FA + 4.5} -9 ${FA + 1.5} Z`, c, { pattern: pat });
          if (S.lining) this.line(elbow, `M -8.6 ${FA + 1.2} Q 0 ${FA + 4} 8.6 ${FA + 1.2}`, S.lining, 1.3);
        } else if (sl === 'puffLong') {
          let d = `M -5 ${FA - 3}`; for (let i = 0; i < 5; i++) d += ` q 1 3 2 0`; d += ` L 5 ${FA - 5} L -5 ${FA - 5} Z`;
          this.part(elbow, d, '#ffffff', { flat: true, sw: 0.5, stroke: '#cfc8d4' });
        } else {
          this.part(elbow, `M -4.6 ${FA - 6.5} L 4.6 ${FA - 6.5} L 4.5 ${FA - 2.5} Q 0 ${FA - 1.4} -4.5 ${FA - 2.5} Z`, S.cuff || o.top2, { flat: true, sw: 0.6 });
        }
        if (S.fur) this.fluff(elbow, -5.4, FA - 3, 5.4, FA - 3, 2.3);
      }
      if (S.has('wristband')) this.part(elbow, `M -3.9 ${FA - 6} L 3.9 ${FA - 6} L 3.7 ${FA - 1.5} L -3.7 ${FA - 1.5} Z`, o.top2, { flat: true, sw: 0.5 });
      const item = el('text', { x: 0, y: FA + 13, 'font-size': 14, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, elbow);
      if (sl === 'wide') {
        // manica kimono pendente, disegnata sopra l'avambraccio
        this.part(g, `M -6.6 -4 C -9 14 -10.5 30 -10.5 ${UA + 6} C -10.5 ${UA + 15} 4 ${UA + 20} 12 ${UA + 12} C 11.6 32 9.6 12 6.8 -4 Q 0 -9 -6.6 -4 Z`, c, { pattern: pat });
        this.line(g, `M -7.5 ${UA - 2} C -6 ${UA + 8} 3 ${UA + 12} 10 ${UA + 8}`, shade(c, -0.35), 0.6, 0.5);
        if (S.lining) this.line(g, `M -10.2 ${UA + 8} C -9 ${UA + 15} 4 ${UA + 19} 11.6 ${UA + 12}`, S.lining, 1.2, 0.9);
      }
      return { g, elbow, x, item };
    }

    // ---------- posa ----------
    setPose(p) {
      this.pose = p || Body.restPose(); if (!this.rig) return;
      p = this.pose;
      const dir = p.dir < 0 ? -1 : 1; this.dir = dir;
      this.rig.setAttribute('transform', `translate(${r1(p.x || 0)} ${r1(p.y || 0)}) translate(0 ${FEET_Y}) scale(${r1(p.sqx || 1)} ${r1(p.sqy || 1)}) translate(0 ${-FEET_Y})`);
      this.lean.setAttribute('transform', `rotate(${r1(p.lean || 0)} 0 ${FEET_Y})`);
      const fl = `scale(${dir} 1)`;
      this.flip.setAttribute('transform', fl); this.frontFlip.setAttribute('transform', fl); this.backFlip.setAttribute('transform', fl);
      if (this.hairFlip) this.hairFlip.setAttribute('transform', fl);
      const th = p.torso || 0, rad = th * Math.PI / 180;
      const tT = `rotate(${r1(th)} 0 ${HIPY})`;
      this.torsoG.setAttribute('transform', tT);
      if (this.torsoSkinG) this.torsoSkinG.setAttribute('transform', tT);
      this.collarG.setAttribute('transform', tT);
      this.backG.setAttribute('transform', tT);
      const nx = dir * HIPY * Math.sin(rad), ny = HIPY - HIPY * Math.cos(rad);
      const hT = `translate(${r1(nx)} ${r1(ny + (p.headY || 0))}) rotate(${r1((p.headTilt || 0) + dir * th)})`;
      this.headG.setAttribute('transform', hT);
      this.hairG.setAttribute('transform', hT);
      const t = now();
      const sway = -(p.skirt || 0) * 0.5 - (p.lean || 0) * 0.6 + (p.hairSway || 0) + Math.sin(t * 1.6) * 0.8;
      this.hairSway.setAttribute('transform', `rotate(${r1(sway)} 0 -40)`);
      this.skirtG.setAttribute('transform', `translate(0 76) skewX(${r1(p.skirt || 0)}) scale(${r1(p.skirtSx || 1)} ${r1(p.skirtSy || 1)}) translate(0 -76)`);
      if (this.tailG) this.tailG.setAttribute('transform', `rotate(${r1(8 * Math.sin(t * 2.2))} -2 90)`);
      if (this.wingL) { const w = 4 * Math.sin(t * 3); this.wingL.setAttribute('transform', `rotate(${r1(-w)} -5 30)`); this.wingR.setAttribute('transform', `rotate(${r1(w)} 5 30)`); }
      const setArm = (a, v) => {
        a.g.setAttribute('transform', `translate(${a.x} ${SHY}) rotate(${r1(v[0])})`);
        a.elbow.setAttribute('transform', `translate(0 ${UA}) rotate(${r1(v[1])})`);
      };
      const setLeg = (l, v) => {
        l.g.setAttribute('transform', `translate(${l.x} ${HIPY}) rotate(${r1(v[0])})`);
        l.knee.setAttribute('transform', `translate(0 ${TH}) rotate(${r1(v[1])})`);
      };
      setArm(this.armL, p.aL || [10, -6]); setArm(this.armR, p.aR || [-10, 6]);
      setLeg(this.legL, p.lL || [3, 0]); setLeg(this.legR, p.lR || [-3, 0]);
      const item = p.item || '';
      if (this.armR.item.textContent !== item) this.armR.item.textContent = item;
      this.shadow.setAttribute('rx', r1(36 * (p.shadow == null ? 1 : p.shadow)));
    }

    // y (unita') della sommita' della testa per posizionare fumetti/emote
    skirtLen() { const S = this.spec || {}; return S.skirt === 'none' ? 0 : (S.len || 146); }
    headTopUnits() { const m = this.headMetrics(); return -m.ay + (this.pose.y || 0) + (this.pose.headY || 0); }
  }

  Body.restPose = () => ({ dir: 1, x: 0, y: 0, lean: 0, sqx: 1, sqy: 1, torso: 0, headTilt: 0, headY: 0, aL: [10, -6], aR: [-10, 6], lL: [3, 0], lR: [-3, 0], skirt: 0, item: '' });
  Body.VB = VB; Body.FEET_Y = FEET_Y; Body.SIT_Y = SIT_Y; Body.HIPY = HIPY; Body.FACE_UNITS = FACE_UNITS; Body.shade = shade;
  DC.Body = Body;
})();
