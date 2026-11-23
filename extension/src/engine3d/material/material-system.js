// Material System: materiali toon (MToon) per capi e accessori, pattern procedurali generati in locale su canvas
// (righe, quadri, pois, stelle, fiori, maglia, denim, pizzo…), finiture (cotone, seta, pelle, latex, metallo, velato).
// Le texture sono in cache per chiave e rilasciate quando nessun capo le usa più.
import { THREE, VRM } from '../lib.js';

const hex = (c) => new THREE.Color(c);
const rgb = (c) => { const k = hex(c); return [Math.round(k.r * 255), Math.round(k.g * 255), Math.round(k.b * 255)]; };
function shadeOf(color, amount = 0.72, hueShift = -0.03) {
  const c = hex(color), h = {};
  c.getHSL(h);
  return new THREE.Color().setHSL((h.h + hueShift + 1) % 1, Math.min(1, h.s * 1.15 + 0.03), h.l * amount);
}

/** Finiture: parametri MToon per tipo di tessuto. */
export const FINISHES = {
  cotton: { name: 'Cotone', toony: 0.9, shift: -0.05, shade: 0.74, rim: 0.0, rimPow: 5 },
  knit: { name: 'Maglia', toony: 0.8, shift: 0.0, shade: 0.78, rim: 0.05, rimPow: 4 },
  denim: { name: 'Denim', toony: 0.85, shift: -0.05, shade: 0.68, rim: 0.0, rimPow: 5 },
  silk: { name: 'Seta', toony: 0.55, shift: -0.1, shade: 0.62, rim: 0.35, rimPow: 3 },
  satin: { name: 'Raso', toony: 0.45, shift: -0.12, shade: 0.55, rim: 0.5, rimPow: 2.5 },
  leather: { name: 'Pelle', toony: 0.6, shift: -0.15, shade: 0.45, rim: 0.4, rimPow: 4 },
  latex: { name: 'Vinile lucido', toony: 0.35, shift: -0.2, shade: 0.35, rim: 0.9, rimPow: 2.2 },
  metal: { name: 'Metallo', toony: 0.4, shift: -0.2, shade: 0.4, rim: 1.0, rimPow: 1.8 },
  velvet: { name: 'Velluto', toony: 0.7, shift: 0.05, shade: 0.5, rim: 0.3, rimPow: 1.5 },
  sheer: { name: 'Velato', toony: 0.9, shift: 0, shade: 0.8, rim: 0.1, rimPow: 3, opacity: 0.45 },
  fur: { name: 'Pelliccia', toony: 0.95, shift: 0.1, shade: 0.85, rim: 0.15, rimPow: 2 },
  plastic: { name: 'Plastica', toony: 0.5, shift: -0.1, shade: 0.6, rim: 0.5, rimPow: 3 },
  glow: { name: 'Neon', toony: 0.9, shift: 0.3, shade: 0.95, rim: 0.6, rimPow: 2, emissive: 0.9 }
};

/** Pattern disponibili: {name, size (metri della piastrella), draw(ctx, S, colori)} */
export const PATTERNS = {
  solid: { name: 'Tinta unita' },
  stripes: { name: 'Righe', size: 0.05, draw: (g, S, c) => { g.fillStyle = c[1]; g.fillRect(0, 0, S, S / 2); } },
  stripes_v: { name: 'Righe verticali', size: 0.04, draw: (g, S, c) => { g.fillStyle = c[1]; g.fillRect(0, 0, S / 2, S); } },
  pinstripe: { name: 'Gessato', size: 0.022, draw: (g, S, c) => { g.fillStyle = c[1]; g.fillRect(0, 0, S * 0.08, S); } },
  sailor: { name: 'Righe marinare', size: 0.07, draw: (g, S, c) => { g.fillStyle = c[1]; g.fillRect(0, S * 0.1, S, S * 0.28); } },
  plaid: { name: 'Scozzese', size: 0.09, draw: (g, S, c) => {
    g.globalAlpha = 0.55; g.fillStyle = c[1]; g.fillRect(0, S * 0.1, S, S * 0.3); g.fillRect(S * 0.1, 0, S * 0.3, S);
    g.globalAlpha = 0.9; g.fillStyle = c[2] || '#ffffff'; g.fillRect(0, S * 0.72, S, S * 0.035); g.fillRect(S * 0.72, 0, S * 0.035, S);
    g.globalAlpha = 0.5; g.fillStyle = '#000'; g.fillRect(0, S * 0.56, S, S * 0.02); g.fillRect(S * 0.56, 0, S * 0.02, S); g.globalAlpha = 1;
  } },
  gingham: { name: 'Vichy', size: 0.03, draw: (g, S, c) => { g.globalAlpha = 0.5; g.fillStyle = c[1]; g.fillRect(0, 0, S, S / 2); g.fillRect(0, 0, S / 2, S); g.globalAlpha = 1; } },
  dots: { name: 'Pois', size: 0.045, draw: (g, S, c) => { g.fillStyle = c[1]; for (const [x, y] of [[0.25, 0.25], [0.75, 0.75]]) { g.beginPath(); g.arc(x * S, y * S, S * 0.13, 0, 7); g.fill(); } } },
  stars: { name: 'Stelle', size: 0.07, draw: (g, S, c) => { g.fillStyle = c[1]; for (const [x, y, r] of [[0.25, 0.25, 0.13], [0.75, 0.72, 0.09]]) star(g, x * S, y * S, r * S); } },
  hearts: { name: 'Cuori', size: 0.07, draw: (g, S, c) => { g.fillStyle = c[1]; for (const [x, y] of [[0.25, 0.28], [0.75, 0.78]]) heart(g, x * S, y * S, S * 0.12); } },
  flowers: { name: 'Fiori', size: 0.09, draw: (g, S, c) => { for (const [x, y, r] of [[0.25, 0.25, 0.1], [0.75, 0.7, 0.085]]) { g.fillStyle = c[1]; for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; g.beginPath(); g.arc(x * S + Math.cos(a) * r * S * 0.7, y * S + Math.sin(a) * r * S * 0.7, r * S * 0.55, 0, 7); g.fill(); } g.fillStyle = c[2] || '#ffe58a'; g.beginPath(); g.arc(x * S, y * S, r * S * 0.4, 0, 7); g.fill(); } } },
  sakura: { name: 'Sakura', size: 0.11, draw: (g, S, c) => { g.fillStyle = c[1]; for (const [x, y, r, rot] of [[0.22, 0.22, 0.11, 0.3], [0.7, 0.62, 0.09, 1.1], [0.42, 0.82, 0.05, 2]]) for (let k = 0; k < 5; k++) { const a = rot + (k / 5) * Math.PI * 2; g.save(); g.translate(x * S + Math.cos(a) * r * S * 0.6, y * S + Math.sin(a) * r * S * 0.6); g.rotate(a); g.beginPath(); g.ellipse(0, 0, r * S * 0.55, r * S * 0.36, 0, 0, 7); g.fill(); g.restore(); } } },
  argyle: { name: 'Rombi', size: 0.07, draw: (g, S, c) => { g.fillStyle = c[1]; g.beginPath(); g.moveTo(S / 2, 0); g.lineTo(S, S / 2); g.lineTo(S / 2, S); g.lineTo(0, S / 2); g.fill(); g.strokeStyle = c[2] || '#fff'; g.lineWidth = S * 0.012; g.beginPath(); g.moveTo(0, 0); g.lineTo(S, S); g.moveTo(S, 0); g.lineTo(0, S); g.stroke(); } },
  checker: { name: 'Scacchi', size: 0.05, draw: (g, S, c) => { g.fillStyle = c[1]; g.fillRect(0, 0, S / 2, S / 2); g.fillRect(S / 2, S / 2, S / 2, S / 2); } },
  knit: { name: 'Trama a maglia', size: 0.014, draw: (g, S, c) => { g.strokeStyle = c[1]; g.globalAlpha = 0.35; g.lineWidth = S * 0.09; for (const x of [0.25, 0.75]) { g.beginPath(); g.moveTo(x * S - S * 0.2, 0); g.quadraticCurveTo(x * S, S * 0.7, x * S + S * 0.2, 0); g.stroke(); g.beginPath(); g.moveTo(x * S - S * 0.2, S); g.quadraticCurveTo(x * S, S * 1.7, x * S + S * 0.2, S); g.stroke(); } g.globalAlpha = 1; } },
  denim: { name: 'Trama denim', size: 0.02, draw: (g, S, c) => { g.strokeStyle = c[1]; g.globalAlpha = 0.25; g.lineWidth = S * 0.05; for (let k = -1; k < 5; k++) { g.beginPath(); g.moveTo(k * S * 0.25, 0); g.lineTo(k * S * 0.25 + S, S); g.stroke(); } g.globalAlpha = 1; } },
  camo: { name: 'Mimetico', size: 0.16, draw: (g, S, c) => { let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647); for (let k = 0; k < 16; k++) { g.fillStyle = k % 2 ? c[1] : c[2] || c[1]; const x = rnd() * S, y = rnd() * S, r = S * (0.08 + rnd() * 0.1); for (const [ox, oy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) { g.beginPath(); g.ellipse(x + ox, y + oy, r, r * 0.6, rnd() * 3, 0, 7); g.fill(); } } } },
  hex: { name: 'Esagoni tech', size: 0.05, draw: (g, S, c) => { g.strokeStyle = c[1]; g.lineWidth = S * 0.03; const r = S / 3.46; for (const [cx, cy] of [[S / 2, S / 2], [0, 0], [S, 0], [0, S], [S, S]]) { g.beginPath(); for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + Math.PI / 6; g.lineTo(cx + Math.cos(a) * r * 1.9, cy + Math.sin(a) * r * 1.0 * 1.72); } g.closePath(); g.stroke(); } } },
  circuit: { name: 'Circuiti', size: 0.12, draw: (g, S, c) => { g.strokeStyle = c[1]; g.fillStyle = c[1]; g.lineWidth = S * 0.018; let s = 11; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647); for (let k = 0; k < 9; k++) { let x = Math.floor(rnd() * 8) * S / 8, y = Math.floor(rnd() * 8) * S / 8; g.beginPath(); g.moveTo(x, y); for (let q = 0; q < 3; q++) { if (rnd() > 0.5) x += S / 8 * (1 + Math.floor(rnd() * 2)); else y += S / 8 * (1 + Math.floor(rnd() * 2)); g.lineTo(x, y); } g.stroke(); g.beginPath(); g.arc(x, y, S * 0.02, 0, 7); g.fill(); } } },
  lace: { name: 'Pizzo', size: 0.035, alpha: true, draw: (g, S, c) => { g.clearRect(0, 0, S, S); g.strokeStyle = c[0]; g.fillStyle = c[0]; g.lineWidth = S * 0.05; for (const [x, y] of [[0.5, 0.5], [0, 0], [1, 0], [0, 1], [1, 1]]) { g.beginPath(); g.arc(x * S, y * S, S * 0.32, 0, 7); g.stroke(); g.beginPath(); g.arc(x * S, y * S, S * 0.09, 0, 7); g.fill(); } g.lineWidth = S * 0.025; g.beginPath(); g.moveTo(0, S / 2); g.lineTo(S, S / 2); g.moveTo(S / 2, 0); g.lineTo(S / 2, S); g.stroke(); } },
  fishnet: { name: 'Rete', size: 0.018, alpha: true, draw: (g, S, c) => { g.clearRect(0, 0, S, S); g.strokeStyle = c[0]; g.lineWidth = S * 0.09; g.beginPath(); g.moveTo(0, 0); g.lineTo(S, S); g.moveTo(S, 0); g.lineTo(0, S); g.stroke(); } },
  gradient: { name: 'Sfumatura', size: 1.0, draw: (g, S, c) => { const gr = g.createLinearGradient(0, 0, 0, S); gr.addColorStop(0, c[1]); gr.addColorStop(0.5, c[0]); gr.addColorStop(1, c[1]); g.fillStyle = gr; g.fillRect(0, 0, S, S); } },
  glitter: { name: 'Glitter', size: 0.06, draw: (g, S, c) => { let s = 3; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647); for (let k = 0; k < 90; k++) { g.globalAlpha = 0.3 + rnd() * 0.7; g.fillStyle = k % 3 ? '#ffffff' : c[1]; const r = S * (0.004 + rnd() * 0.01); g.fillRect(rnd() * S, rnd() * S, r, r); } g.globalAlpha = 1; } },
  scales: { name: 'Squame', size: 0.03, draw: (g, S, c) => { g.strokeStyle = c[1]; g.lineWidth = S * 0.05; for (const [x, y] of [[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]]) { g.beginPath(); g.arc(x * S, y * S, S * 0.5, 0, Math.PI); g.stroke(); } } },
  seigaiha: { name: 'Onde giapponesi', size: 0.06, draw: (g, S, c) => { g.strokeStyle = c[1]; g.lineWidth = S * 0.03; for (const [x, y] of [[0.5, 0.5], [0, 0], [1, 0], [0, 1], [1, 1], [0.5, 1.5], [0, 1], [1, 1]]) for (const r of [0.48, 0.34, 0.2]) { g.beginPath(); g.arc(x * S, y * S, S * r, Math.PI, 0); g.stroke(); } } },
  asanoha: { name: 'Asanoha', size: 0.06, draw: (g, S, c) => { g.strokeStyle = c[1]; g.lineWidth = S * 0.02; const L = (a, b, d, e) => { g.beginPath(); g.moveTo(a * S, b * S); g.lineTo(d * S, e * S); g.stroke(); }; L(0, 0, 1, 1); L(1, 0, 0, 1); L(0.5, 0, 0.5, 1); L(0, 0.5, 1, 0.5); L(0, 0, 0.5, 0.25); L(1, 0, 0.5, 0.25); L(0, 1, 0.5, 0.75); L(1, 1, 0.5, 0.75); L(0, 0, 0.25, 0.5); L(0, 1, 0.25, 0.5); L(1, 0, 0.75, 0.5); L(1, 1, 0.75, 0.5); } }
};
function star(g, x, y, r) { g.beginPath(); for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 - Math.PI / 2, q = k % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.closePath(); g.fill(); }
function heart(g, x, y, r) { g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.6, y - r * 0.2, x - r * 0.7, y - r * 1.2, x, y - r * 0.35); g.bezierCurveTo(x + r * 0.7, y - r * 1.2, x + r * 1.6, y - r * 0.2, x, y + r * 0.9); g.fill(); }

export class MaterialSystem {
  constructor() {
    this._tex = new Map(); // chiave → {tex, refs}
    this.outlineEnabled = true;
    this.all = new Set();
    this.anisotropy = 4;
  }

  /** Texture pattern piastrellabile (in cache). colors = [base, secondario, terzo]. */
  patternTexture(pattern, colors) {
    const P = PATTERNS[pattern];
    if (!P || !P.draw) return null;
    const key = pattern + '|' + colors.join(',');
    let e = this._tex.get(key);
    if (!e) {
      const S = 256, cv = document.createElement('canvas');
      cv.width = cv.height = S;
      const g = cv.getContext('2d');
      g.fillStyle = colors[0]; g.fillRect(0, 0, S, S);
      P.draw(g, S, colors);
      const tex = new THREE.CanvasTexture(cv);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = this.anisotropy;
      tex.repeat.set(1 / P.size, 1 / P.size);
      tex.userData.key = key;
      e = { tex, refs: 0 };
      this._tex.set(key, e);
    }
    e.refs++;
    return e.tex;
  }

  /**
   * Coppia [superficie, contorno] MToon per un capo.
   * @param {{color:string, color2?:string, color3?:string, pattern?:string, finish?:string, opacity?:number, doubleSide?:boolean, outline?:number, emissive?:string}} o
   */
  garment(o) {
    const F = FINISHES[o.finish] || FINISHES.cotton, P = PATTERNS[o.pattern] || PATTERNS.solid;
    const hasTex = !!P.draw, base = hex(o.color);
    const map = hasTex ? this.patternTexture(o.pattern, [o.color, o.color2 || '#ffffff', o.color3 || '#222222']) : null;
    const opacity = o.opacity !== undefined ? o.opacity : F.opacity !== undefined ? F.opacity : 1;
    const transparent = opacity < 1, cutout = !!P.alpha;
    const params = {
      color: hasTex ? new THREE.Color(1, 1, 1) : base, map,
      shadeColorFactor: hasTex ? new THREE.Color(F.shade, F.shade * 0.94, F.shade * 0.98) : shadeOf(o.color, F.shade),
      shadeMultiplyTexture: map,
      shadingToonyFactor: F.toony, shadingShiftFactor: F.shift, giEqualizationFactor: 0.9,
      parametricRimColorFactor: new THREE.Color(F.rim, F.rim, F.rim), parametricRimFresnelPowerFactor: F.rimPow, parametricRimLiftFactor: 0, rimLightingMixFactor: 0.6,
      side: o.doubleSide === false ? THREE.FrontSide : THREE.DoubleSide,
      transparent, opacity, alphaTest: cutout ? 0.5 : 0, depthWrite: !transparent || opacity > 0.9
    };
    if (F.emissive || o.emissive) { params.emissive = hex(o.emissive || o.color); params.emissiveIntensity = F.emissive || 0.8; }
    const surf = new VRM.MToonMaterial(params);
    surf.name = 'garment:' + (o.name || '');
    surf.userData.pattern = map;
    const out = [surf];
    const ow = o.outline !== undefined ? o.outline : 0.0011;
    if (ow > 0 && !transparent) {
      const ol = new VRM.MToonMaterial({ ...params, side: THREE.BackSide, outlineWidthMode: 'worldCoordinates', outlineWidthFactor: ow, outlineColorFactor: shadeOf(o.color, 0.32), outlineLightingMixFactor: 0.3 });
      ol.isOutline = true;
      ol.name = surf.name + ' (Outline)';
      ol.visible = this.outlineEnabled;
      out.push(ol);
    }
    for (const m of out) this.all.add(m);
    return out;
  }

  /** Materiale PBR semplice per accessori rigidi lucidi (metalli, gemme, lenti). */
  hard(o) {
    const m = new THREE.MeshStandardMaterial({ color: hex(o.color), metalness: o.metal !== undefined ? o.metal : 0.2, roughness: o.rough !== undefined ? o.rough : 0.4, transparent: o.opacity !== undefined && o.opacity < 1, opacity: o.opacity !== undefined ? o.opacity : 1, emissive: hex(o.emissive || '#000000'), emissiveIntensity: o.emissive ? 1 : 0, side: o.doubleSide ? THREE.DoubleSide : THREE.FrontSide });
    this.all.add(m);
    return m;
  }

  setOutlineEnabled(on) { this.outlineEnabled = on; for (const m of this.all) if (m.isOutline) m.visible = on; }

  release(materials) {
    for (const m of materials) {
      this.all.delete(m);
      const tex = m.userData && m.userData.pattern;
      if (tex) { const e = this._tex.get(tex.userData.key); if (e && --e.refs <= 0) { e.tex.dispose(); this._tex.delete(tex.userData.key); } }
      m.dispose();
    }
  }
}
