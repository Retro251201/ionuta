// BodyModel: analisi del corpo base usata dalla Garment Forge e dal Character Customizer.
// Spazio canonico (+Z fronte, +X = lato sinistro del personaggio, Y in alto, metri, T-pose).
// Fornisce: punti di riferimento anatomici, pesi "di parte" per vertice (braccia, gambe, testa…),
// normali lisce, inviluppi convessi del busto/gambe per quota (per capi morbidi e gonne) e raggi di arti.
import { THREE } from '../../lib.js';
import { MeshData, weldIds, smoothNormals } from './meshdata.js';

const PART_OF = {
  hips: 'torso', spine: 'torso', chest: 'torso', upperChest: 'torso', leftShoulder: 'torso', rightShoulder: 'torso', neck: 'neck',
  head: 'head', leftEye: 'head', rightEye: 'head', jaw: 'head',
  leftUpperArm: 'armL', leftLowerArm: 'armL', leftHand: 'handL', rightUpperArm: 'armR', rightLowerArm: 'armR', rightHand: 'handR',
  leftUpperLeg: 'legL', leftLowerLeg: 'legL', leftFoot: 'footL', leftToes: 'footL', rightUpperLeg: 'legR', rightLowerLeg: 'legR', rightFoot: 'footR', rightToes: 'footR'
};
// indici nel pacchetto `pw` (k = 8) interpolato durante i tagli
export const PW = { armL: 0, armR: 1, legL: 2, legR: 3, head: 4, hand: 5, foot: 6, neck: 7 };

const NTH = 96;           // campioni angolari degli inviluppi
const Y0 = 0.02, DY = 0.01; // tabella degli inviluppi per quota

function convexHull(pts) { // pts: [[x,z],...] → poligono convesso antiorario
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  const up = [];
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  lo.pop(); up.pop();
  return lo.concat(up);
}

export class BodyModel {
  constructor(avatar) {
    this.avatar = avatar;
    const b = (this.b = avatar.body);
    const n = (this.n = b.count);
    this.flip = b.flip;
    // --- punti di riferimento (ossa a riposo) ---
    const L = (this.L = {});
    for (const k of Object.keys(avatar.bones)) { const p = avatar.restPosition(k); if (p) L[k] = p.clone(); }
    // --- classificazione delle ossa dello scheletro per parte del corpo ---
    const nodeToHuman = new Map();
    for (const [k, node] of Object.entries(avatar.bones)) if (node) nodeToHuman.set(node, k);
    const bones = b.skeleton.bones;
    this.boneIndex = {};
    const bonePart = bones.map((bone, i) => {
      let o = bone, h = null, finger = false;
      while (o && !(h = nodeToHuman.get(o))) o = o.parent;
      if (nodeToHuman.has(bone)) this.boneIndex[nodeToHuman.get(bone)] = i;
      if (h && /Thumb|Index|Middle|Ring|Little/.test(h)) { finger = true; h = h.startsWith('left') ? 'leftHand' : 'rightHand'; }
      return PART_OF[h] || 'torso';
    });
    // --- pesi di parte per vertice ---
    const pw = new Float32Array(n * 8);
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < 4; k++) {
        const w = b.skinWeight[i * 4 + k];
        if (!w) continue;
        const part = bonePart[b.skinIndex[i * 4 + k]];
        if (part === 'armL' || part === 'handL') pw[i * 8 + PW.armL] += w;
        if (part === 'armR' || part === 'handR') pw[i * 8 + PW.armR] += w;
        if (part === 'legL' || part === 'footL') pw[i * 8 + PW.legL] += w;
        if (part === 'legR' || part === 'footR') pw[i * 8 + PW.legR] += w;
        if (part === 'head') pw[i * 8 + PW.head] += w;
        if (part === 'handL' || part === 'handR') pw[i * 8 + PW.hand] += w;
        if (part === 'footL' || part === 'footR') pw[i * 8 + PW.foot] += w;
        if (part === 'neck') pw[i * 8 + PW.neck] += w;
      }
    }
    this.pw = pw;
    this.weld = weldIds(b.pos);
    this.nrm = smoothNormals(b.pos, b.index, this.weld);
    this._buildEnvelope();
    this._buildLimbs();
    this._measure();
  }

  /** MeshData dell'intero corpo (copia) con attributi ausiliari: nrm liscia, uv, pw, base (posizione sul corpo). */
  baseMesh() {
    const b = this.b;
    return new MeshData({
      pos: { a: Float32Array.from(b.pos), k: 3 }, nrm: { a: Float32Array.from(this.nrm), k: 3 }, uv: { a: Float32Array.from(b.uv), k: 2 },
      pw: { a: Float32Array.from(this.pw), k: 8 }, base: { a: Float32Array.from(b.pos), k: 3 }
    }, Uint16Array.from(b.skinIndex), Float32Array.from(b.skinWeight), Uint32Array.from(b.index));
  }

  // ---------- inviluppi convessi busto+gambe per quota ----------
  _buildEnvelope() {
    const b = this.b, pos = b.pos, pw = this.pw, I = b.index;
    const ny = (this.envNY = Math.ceil((this.L.neck.y + 0.02 - Y0) / DY) + 1);
    const slices = Array.from({ length: ny }, () => []);
    const skip = (v) => pw[v * 8 + PW.armL] + pw[v * 8 + PW.armR] > 0.55 || pw[v * 8 + PW.head] > 0.5;
    for (let t = 0; t < I.length; t += 3) {
      const a = I[t], c = I[t + 1], d = I[t + 2];
      if (skip(a) || skip(c) || skip(d)) continue;
      const ya = pos[a * 3 + 1], yc = pos[c * 3 + 1], yd = pos[d * 3 + 1];
      const lo = Math.max(0, Math.ceil((Math.min(ya, yc, yd) - Y0) / DY)), hi = Math.min(ny - 1, Math.floor((Math.max(ya, yc, yd) - Y0) / DY));
      for (let s = lo; s <= hi; s++) {
        const y = Y0 + s * DY;
        for (const [p, q] of [[a, c], [c, d], [d, a]]) {
          const yp = pos[p * 3 + 1], yq = pos[q * 3 + 1];
          if ((yp - y) * (yq - y) > 0 || yp === yq) continue;
          const k = (y - yp) / (yq - yp);
          slices[s].push([pos[p * 3] + (pos[q * 3] - pos[p * 3]) * k, pos[p * 3 + 2] + (pos[q * 3 + 2] - pos[p * 3 + 2]) * k]);
        }
      }
    }
    this.env = new Float32Array(ny * NTH);
    this.envCz = new Float32Array(ny);
    this.hulls = [];
    for (let s = 0; s < ny; s++) {
      const hull = convexHull(slices[s]);
      this.hulls.push(hull);
      if (hull.length < 3) continue;
      let zmin = Infinity, zmax = -Infinity;
      for (const p of hull) { zmin = Math.min(zmin, p[1]); zmax = Math.max(zmax, p[1]); }
      this.envCz[s] = (zmin + zmax) / 2;
    }
    // asse verticale liscio (media mobile) così le gonne non "serpeggiano"
    const cz = Float32Array.from(this.envCz);
    for (let s = 0; s < ny; s++) { let a = 0, c = 0; for (let k = -6; k <= 6; k++) { const j = s + k; if (j >= 0 && j < ny && this.hulls[j].length >= 3) { a += cz[j]; c++; } } this.envCz[s] = c ? a / c : 0; }
    for (let s = 0; s < ny; s++) {
      const hull = this.hulls[s], cz0 = this.envCz[s];
      if (hull.length < 3) continue;
      for (let ti = 0; ti < NTH; ti++) {
        const th = (ti / NTH) * Math.PI * 2, dx = Math.sin(th), dz = Math.cos(th);
        let best = 0;
        for (let e = 0; e < hull.length; e++) { // intersezione raggio–lato del poligono convesso
          const p = hull[e], q = hull[(e + 1) % hull.length];
          const ex = q[0] - p[0], ez = q[1] - p[1], den = dx * ez - dz * ex;
          if (Math.abs(den) < 1e-9) continue;
          const px = p[0], pz = p[1] - cz0;
          const r = (px * ez - pz * ex) / den, u = (px * dz - pz * dx) / den;
          if (r > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.max(best, r);
        }
        this.env[s * NTH + ti] = best;
      }
    }
  }

  /** Raggio dell'inviluppo convesso (busto/gambe) alla quota y in direzione θ (0 = fronte, π/2 = sinistra). */
  envR(theta, y) {
    const fy = Math.max(0, Math.min(this.envNY - 1.001, (y - Y0) / DY)), s = Math.floor(fy), ky = fy - s;
    let ft = (((theta / (Math.PI * 2)) % 1) + 1) % 1 * NTH;
    const t0 = Math.floor(ft) % NTH, t1 = (t0 + 1) % NTH, kt = ft - Math.floor(ft);
    const e = this.env;
    const a = e[s * NTH + t0] * (1 - kt) + e[s * NTH + t1] * kt, c = e[(s + 1) * NTH + t0] * (1 - kt) + e[(s + 1) * NTH + t1] * kt;
    return a * (1 - ky) + c * ky;
  }
  /** Coordinata z dell'asse verticale del corpo alla quota y. */
  axisZ(y) { const fy = Math.max(0, Math.min(this.envNY - 1.001, (y - Y0) / DY)), s = Math.floor(fy); return this.envCz[s] * (1 - (fy - s)) + this.envCz[s + 1] * (fy - s); }
  /** Massimo dell'inviluppo tra y e yTop: da dove "cade" un tessuto appeso. */
  hangR(theta, y, yTop) { let m = 0; for (let q = y; q <= yTop + 1e-6; q += DY) m = Math.max(m, this.envR(theta, q)); return m; }

  // ---------- arti ----------
  _buildLimbs() {
    const L = this.L, pos = this.b.pos, pw = this.pw, n = this.n;
    this.arm = {};
    for (const [side, key, sgn] of [['L', 'left', 1], ['R', 'right', -1]]) {
      const a = L[key + 'UpperArm'], w = L[key + 'Hand'], dir = w.clone().sub(a), len = dir.length();
      dir.normalize();
      const bins = new Float32Array(24);
      for (let i = 0; i < n; i++) {
        if (!this.b.used[i] || pw[i * 8 + (sgn > 0 ? PW.armL : PW.armR)] < 0.6) continue;
        const px = pos[i * 3] - a.x, py = pos[i * 3 + 1] - a.y, pz = pos[i * 3 + 2] - a.z;
        const t = (px * dir.x + py * dir.y + pz * dir.z) / len;
        if (t < 0 || t > 1) continue;
        const r = Math.hypot(px - dir.x * t * len, py - dir.y * t * len, pz - dir.z * t * len), k = Math.min(23, Math.floor(t * 24));
        bins[k] = Math.max(bins[k], r);
      }
      this.arm[side] = { origin: a.clone(), dir, len, sgn, bins };
    }
    this.leg = {};
    for (const [side, key, sgn] of [['L', 'left', 1], ['R', 'right', -1]]) {
      const hip = L[key + 'UpperLeg'], knee = L[key + 'LowerLeg'], ankle = L[key + 'Foot'];
      const axis = (y) => {
        if (y >= knee.y) { const t = Math.min(1, (y - knee.y) / (hip.y - knee.y)); return [knee.x + (hip.x - knee.x) * t, knee.z + (hip.z - knee.z) * t]; }
        const t = Math.max(0, (y - ankle.y) / (knee.y - ankle.y)); return [ankle.x + (knee.x - ankle.x) * t, ankle.z + (knee.z - ankle.z) * t];
      };
      const bins = new Float32Array(100);
      for (let i = 0; i < n; i++) {
        if (!this.b.used[i] || pw[i * 8 + (sgn > 0 ? PW.legL : PW.legR)] < 0.5) continue;
        const y = pos[i * 3 + 1], c = axis(y), k = Math.min(99, Math.max(0, Math.floor(y * 100)));
        bins[k] = Math.max(bins[k], Math.hypot(pos[i * 3] - c[0], pos[i * 3 + 2] - c[1]));
      }
      this.leg[side] = { hip, knee, ankle, axis, sgn, bins };
    }
  }
  /** Raggio massimo del braccio alla frazione t (0 spalla → 1 polso). */
  armRadius(side, t) { const b = this.arm[side].bins, f = Math.max(0, Math.min(22.999, t * 24 - 0.5)), i = Math.floor(f); return b[i] + (b[i + 1] - b[i]) * (f - i); }
  legRadius(side, y) { const b = this.leg[side].bins, f = Math.max(0, Math.min(98.999, y * 100 - 0.5)), i = Math.floor(f); return b[i] + (b[i + 1] - b[i]) * (f - i); }

  // ---------- misure anatomiche ----------
  _measure() {
    const L = this.L, pos = this.b.pos, n = this.n, M = (this.M = {});
    let crotch = Infinity, top = 0, toeZ = -Infinity, heelZ = Infinity, sole = Infinity;
    for (let i = 0; i < n; i++) if (this.b.used[i]) sole = Math.min(sole, pos[i * 3 + 1]);
    M.soleY = sole; // quota della pianta del piede nudo (il modello base nasce "sollevato" per le scarpe originali)
    for (let i = 0; i < n; i++) {
      if (!this.b.used[i]) continue;
      const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
      if (Math.abs(x) < 0.012 && y > 0.5 && y < L.hips.y + 0.05) crotch = Math.min(crotch, y);
      top = Math.max(top, y);
      if (y < sole + 0.05) { toeZ = Math.max(toeZ, z); heelZ = Math.min(heelZ, z); }
    }
    M.crotchY = crotch; M.topY = top; M.toeZ = toeZ; M.heelZ = heelZ;
    const side = (y) => this.envR(Math.PI / 2, y), front = (y) => Math.max(this.envR(0.3, y), this.envR(-0.3, y));
    let best = Infinity;
    for (let y = L.hips.y + 0.02; y < L.chest.y + 0.1; y += 0.005) if (side(y) < best) { best = side(y); M.waistY = y; }
    best = 0;
    for (let y = crotch; y < M.waistY; y += 0.005) if (side(y) > best) { best = side(y); M.hipY = y; }
    best = 0;
    for (let y = L.chest.y; y < L.upperChest.y + 0.1; y += 0.005) if (front(y) > best) { best = front(y); M.bustY = y; }
    M.underbustY = M.bustY - 0.06;
    M.shoulderX = L.leftUpperArm.x; M.shoulderY = L.leftUpperArm.y; M.wristX = L.leftHand.x;
    M.neckY = L.neck.y; M.kneeY = L.leftLowerLeg.y; M.ankleY = L.leftFoot.y;
    M.armLen = this.arm.L.len;
    M.neckR = Math.max(0.03, this.envR(Math.PI / 2, L.neck.y + 0.02));
  }
}
