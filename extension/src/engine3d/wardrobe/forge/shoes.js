// Calzature: una "forma" (last) ottenuta dalle sezioni convesse del piede lungo la sua lunghezza, gonfiata e
// chiusa in punta e sul tallone, con suola separata, plateau e tacco. Il tacco inclina davvero il piede:
// la ricetta restituisce `pitch` (radianti) e `lift` (metri) che il motore applica alle ossa dei piedi e alla radice.
import { MeshData, smoothNormals } from './meshdata.js';
import { PW } from './body-model.js';
import { resolveY } from './garment-forge.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

function hull2(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  lo.pop(); up.pop();
  return lo.concat(up);
}
function rayHull(hull, cx, cy, dx, dy) {
  let best = 0;
  for (let e = 0; e < hull.length; e++) {
    const p = hull[e], q = hull[(e + 1) % hull.length], ex = q[0] - p[0], ey = q[1] - p[1], den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-10) continue;
    const px = p[0] - cx, py = p[1] - cy, r = (px * ey - py * ex) / den, u = (px * dy - py * dx) / den;
    if (r > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.max(best, r);
  }
  return best;
}
function mk(n) { return { pos: new Float32Array(n * 3), uv: new Float32Array(n * 2), pw: new Float32Array(n * 8), base: new Float32Array(n * 3), si: new Uint16Array(n * 4), sw: new Float32Array(n * 4) }; }
function finish(A, idx) {
  const m = new MeshData({ pos: { a: A.pos, k: 3 }, nrm: { a: new Float32Array(A.pos.length), k: 3 }, uv: { a: A.uv, k: 2 }, pw: { a: A.pw, k: 8 }, base: { a: A.base, k: 3 } }, A.si, A.sw, Uint32Array.from(idx));
  m.attrs.nrm.a = smoothNormals(A.pos, m.idx);
  return m;
}

/** Geometria del tacco: inclinazione → sollevamento della radice e lunghezza dello stelo. */
export function heelMath(model, pitchDeg, sole) {
  const M = model.M, A = model.L.leftFoot, a = (pitchDeg || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const ballZ = model.L.leftToes ? model.L.leftToes.z : 0.085, ay = A.y - M.soleY; // quote relative alla pianta del piede
  const dyB = -ay - sole, dzB = ballZ - A.z;
  const lift = -(ay + (dyB * c - dzB * s));
  const dzH = M.heelZ + 0.02 - A.z, heelWorld = ay + (dyB * c - dzH * s) + lift;
  return { pitch: a, lift, stem: a > 0.01 ? Math.max(0, heelWorld / c) : 0 };
}

/**
 * P: { top: quota del bordo (numero o riferimento), topProfile: [[frazione z 0..1, quota], …] (bordo variabile: décolleté),
 *      offset, sole, platform, pitch (gradi), heelWidth, toe: 'round'|'point'|'square', toeLen, toeBulk, soleWide,
 *      plateOnly (solo suola: sandali/geta), mat, soleMat }
 */
export function buildShoe(model, P) {
  const M = model.M, b = model.b, pos = b.pos, I = b.index, pwA = model.pw, bi = model.boneIndex;
  const off = P.offset !== undefined ? P.offset : 0.006, T = (P.sole !== undefined ? P.sole : 0.012) + (P.platform || 0);
  const hm = heelMath(model, P.pitch || 0, T);
  const yTop0 = resolveY(model, P.top !== undefined ? P.top : 'ankle-0.05');
  const sy = M.soleY; // la pianta del piede nudo del modello base non è a quota 0
  const prof = P.topProfile ? P.topProfile.map(([f, y]) => [f, y + sy]) : null;
  const NZ = 26, NA = 28, welt = sy + 0.007;
  const partsUpper = [], partsSole = [];
  const topAt = (f) => {
    if (!prof) return yTop0;
    for (let k = 1; k < prof.length; k++) if (f <= prof[k][0]) return lerp(prof[k - 1][1], prof[k][1], sstep(prof[k - 1][0], prof[k][0], f));
    return prof[prof.length - 1][1];
  };
  const yMax = prof ? Math.max(...prof.map((p) => p[1])) : yTop0;
  for (const sgn of [1, -1]) {
    const legK = sgn > 0 ? PW.legL : PW.legR, key = sgn > 0 ? 'left' : 'right';
    const z0 = M.heelZ + 0.0015, z1 = M.toeZ - 0.0015;
    const slices = Array.from({ length: NZ + 1 }, () => []);
    for (let t = 0; t < I.length; t += 3) {
      const a = I[t], c = I[t + 1], d = I[t + 2];
      if (pwA[a * 8 + legK] < 0.5 || pwA[c * 8 + legK] < 0.5 || pwA[d * 8 + legK] < 0.5) continue;
      if (Math.min(pos[a * 3 + 1], pos[c * 3 + 1], pos[d * 3 + 1]) > yMax + 0.03) continue;
      const za = pos[a * 3 + 2], zc = pos[c * 3 + 2], zd = pos[d * 3 + 2];
      const lo = Math.max(0, Math.ceil(((Math.min(za, zc, zd) - z0) / (z1 - z0)) * NZ)), hi = Math.min(NZ, Math.floor(((Math.max(za, zc, zd) - z0) / (z1 - z0)) * NZ));
      for (let s = lo; s <= hi; s++) {
        const z = lerp(z0, z1, s / NZ);
        for (const [p, q] of [[a, c], [c, d], [d, a]]) {
          const zp = pos[p * 3 + 2], zq = pos[q * 3 + 2];
          if ((zp - z) * (zq - z) > 0 || zp === zq) continue;
          const k = (z - zp) / (zq - zp);
          slices[s].push([pos[p * 3] + (pos[q * 3] - pos[p * 3]) * k, pos[p * 3 + 1] + (pos[q * 3 + 1] - pos[p * 3 + 1]) * k]);
        }
      }
    }
    // --- tomaia ---
    const cols = NA + 1, nU = (NZ + 1) * cols + 2, U = mk(nU), open = new Uint8Array(nU), idxU = [];
    const ext = []; // estensione laterale per fetta (per la suola)
    const cxFoot = sgn * Math.abs(model.L.leftFoot.x);
    for (let s = 0; s <= NZ; s++) {
      const f = s / NZ, z = lerp(z0, z1, f), top = topAt(f);
      const pts = slices[s].map(([x, y]) => [x, Math.min(y, top)]);
      const hull = hull2(pts);
      let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
      for (const p of hull) { xmin = Math.min(xmin, p[0]); xmax = Math.max(xmax, p[0]); ymin = Math.min(ymin, p[1]); ymax = Math.max(ymax, p[1]); }
      if (hull.length < 3) { xmin = cxFoot - 0.01; xmax = cxFoot + 0.01; ymin = sy; ymax = sy + 0.02; }
      const cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
      const kToe = sstep(0.55, 1, f), bulk = off + (P.toeBulk || 0) * kToe + (P.heelBulk || 0) * (1 - sstep(0, 0.3, f));
      const zOut = z + (P.toeLen || 0) * kToe * kToe + (f === 1 ? bulk * 0.6 : 0) - (f === 0 ? bulk * 0.6 : 0);
      const narrow = P.toe === 'point' ? 1 - 0.62 * kToe * kToe : P.toe === 'square' ? 1 : 1 - 0.08 * kToe;
      const wToe = sstep(0.06, 0.095, z);
      for (let k = 0; k < cols; k++) {
        const ph = (k / NA) * Math.PI * 2, dx = Math.cos(ph), dy = Math.sin(ph), i = s * cols + k;
        const r0 = hull.length >= 3 ? rayHull(hull, cx, cy, dx, dy) : 0.008;
        let x = cx + dx * (r0 + bulk), y = cy + dy * (r0 + bulk);
        if (dy > 0.25 && cy + dy * r0 >= top - 0.0012) { open[i] = 1; y = Math.min(y, top + 0.001); }
        y = Math.max(y, welt);
        x = cxFoot + (x - cxFoot) * narrow;
        U.pos.set([x, y, zOut], i * 3); U.base.set([cx + dx * r0, cy + dy * r0, z], i * 3);
        U.uv.set([zOut, ph * 0.035], i * 2);
        U.si[i * 4] = bi[key + 'Foot']; U.sw[i * 4] = 1 - wToe; U.si[i * 4 + 1] = bi[key + 'Toes'] !== undefined ? bi[key + 'Toes'] : bi[key + 'Foot']; U.sw[i * 4 + 1] = wToe;
        U.pw[i * 8 + legK] = 1; U.pw[i * 8 + PW.foot] = 1;
      }
      ext.push({ z: zOut, xmin: cxFoot + (xmin - bulk - cxFoot) * narrow, xmax: cxFoot + (xmax + bulk - cxFoot) * narrow, wToe });
    }
    for (let s = 0; s < NZ; s++) for (let k = 0; k < NA; k++) {
      const a = s * cols + k, c = a + 1, d = a + cols, e = d + 1;
      if (open[a] && open[c] && open[d] && open[e]) continue;
      if (sgn > 0) idxU.push(a, c, d, c, e, d); else idxU.push(a, c, d, c, e, d);
    }
    // chiusure di punta e tallone (ventaglio)
    for (const [s, ci] of [[0, nU - 2], [NZ, nU - 1]]) {
      let ax = 0, ay = 0, az = 0, cnt = 0, allOpen = true;
      for (let k = 0; k < NA; k++) { const i = s * cols + k; ax += U.pos[i * 3]; ay += U.pos[i * 3 + 1]; az += U.pos[i * 3 + 2]; cnt++; if (!open[i]) allOpen = false; }
      U.pos.set([ax / cnt, ay / cnt, az / cnt + (s ? 0.003 : -0.003)], ci * 3); U.base.set([ax / cnt, ay / cnt, az / cnt], ci * 3);
      const src = s * cols;
      for (let q = 0; q < 4; q++) { U.si[ci * 4 + q] = U.si[src * 4 + q]; U.sw[ci * 4 + q] = U.sw[src * 4 + q]; }
      U.pw[ci * 8 + legK] = 1; U.pw[ci * 8 + PW.foot] = 1;
      if (allOpen) continue;
      for (let k = 0; k < NA; k++) { const a = s * cols + k, c = a + 1; if (s) idxU.push(a, c, ci); else idxU.push(c, a, ci); }
    }
    if (!P.plateOnly) partsUpper.push(finish(U, idxU));
    // --- suola (scatola sotto la tomaia) + tacco ---
    const nS = (NZ + 1) * 4, S = mk(nS), idxS = [], wide = P.soleWide !== undefined ? P.soleWide : 0.0025;
    const heelEnd = 0.24, hw = P.heelWidth; // il tacco occupa il primo ~24% della lunghezza
    for (let s = 0; s <= NZ; s++) {
      const f = s / NZ, e = ext[s], heelK = hm.stem > 0 ? 1 - sstep(heelEnd - 0.05, heelEnd + 0.02, f) : 0;
      const yb = sy - T - hm.stem * heelK;
      let xl = e.xmin - wide, xr = e.xmax + wide, xlb = xl, xrb = xr;
      if (heelK > 0 && hw) { const c = (xl + xr) / 2; xlb = lerp(xl, c - hw / 2, heelK); xrb = lerp(xr, c + hw / 2, heelK); }
      const P4 = [[xr, welt + 0.003], [xrb, yb], [xlb, yb], [xl, welt + 0.003]];
      for (let k = 0; k < 4; k++) {
        const i = s * 4 + k;
        S.pos.set([P4[k][0], P4[k][1], e.z], i * 3); S.base.set([P4[k][0], sy, e.z], i * 3); S.uv.set([e.z, k * 0.02], i * 2);
        S.si[i * 4] = bi[key + 'Foot']; S.sw[i * 4] = 1 - e.wToe; S.si[i * 4 + 1] = bi[key + 'Toes'] !== undefined ? bi[key + 'Toes'] : bi[key + 'Foot']; S.sw[i * 4 + 1] = e.wToe;
        S.pw[i * 8 + legK] = 1; S.pw[i * 8 + PW.foot] = 1;
      }
      if (s < NZ) for (let k = 0; k < 4; k++) { const a = s * 4 + k, c = s * 4 + ((k + 1) % 4), d = a + 4, g = c + 4; idxS.push(a, c, d, c, g, d); }
    }
    idxS.push(0, 2, 1, 0, 3, 2); const eI = NZ * 4; idxS.push(eI, eI + 1, eI + 2, eI, eI + 2, eI + 3);
    partsSole.push(finish(S, idxS));
  }
  const join = (list) => {
    const n = list.reduce((s, m) => s + m.n, 0), A = mk(n), idx = [];
    let vo = 0;
    for (const m of list) {
      A.pos.set(m.pos, vo * 3); A.uv.set(m.attr('uv'), vo * 2); A.pw.set(m.attr('pw'), vo * 8); A.base.set(m.attr('base'), vo * 3); A.si.set(m.si, vo * 4); A.sw.set(m.sw, vo * 4);
      for (const i of m.idx) idx.push(i + vo);
      vo += m.n;
    }
    return finish(A, idx);
  };
  const parts = [];
  if (partsUpper.length) parts.push({ mat: P.mat || 'main', mesh: join(partsUpper) });
  parts.push({ mat: P.soleMat || 'sole', mesh: join(partsSole) });
  // nasconde il piede dove la scarpa è chiusa
  let hide = null;
  if (!P.plateOnly) {
    hide = new Float32Array(model.n).fill(-1);
    for (let i = 0; i < model.n; i++) {
      if (pwA[i * 8 + PW.legL] + pwA[i * 8 + PW.legR] < 0.5) continue;
      const f = clamp((pos[i * 3 + 2] - M.heelZ) / (M.toeZ - M.heelZ));
      hide[i] = topAt(f) - pos[i * 3 + 1];
    }
  }
  return { parts, hide, lift: hm.lift, pitch: hm.pitch };
}
