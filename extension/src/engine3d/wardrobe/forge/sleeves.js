// Maniche "loft": tubi ampi lungo l'asse del braccio (kimono, campana, a pipistrello) quando il semplice
// allargamento della shell non basta. Skinning interpolato tra braccio superiore e avambraccio.
import { MeshData, smoothNormals } from './meshdata.js';
import { PW } from './body-model.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/** P: {from, to (frazioni spalla→polso), r0, r1 (raggi), drop (pendenza inferiore in metri, kimono), curve, segs, rings, mat} */
export function buildSleeves(model, P) {
  const bi = model.boneIndex, out = [];
  const from = P.from !== undefined ? P.from : 0.05, to = P.to !== undefined ? P.to : 0.9, segs = P.segs || 20, rings = P.rings || 10;
  for (const side of ['L', 'R']) {
    const A = model.arm[side], key = side === 'L' ? 'left' : 'right';
    const cols = segs + 1, n = cols * (rings + 1);
    const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), pw = new Float32Array(n * 8), base = new Float32Array(n * 3), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
    const elbowT = model.L[key + 'LowerArm'].clone().sub(A.origin).dot(A.dir) / A.len;
    for (let j = 0; j <= rings; j++) {
      const u = j / rings, t = lerp(from, to, u), k = Math.pow(u, P.curve || 1);
      const r = Math.max(model.armRadius(side, t) + 0.006, lerp(P.r0, P.r1, k)), drop = (P.drop || 0) * k;
      const cx = A.origin.x + A.dir.x * t * A.len, cy = A.origin.y + A.dir.y * t * A.len, cz = A.origin.z + A.dir.z * t * A.len;
      for (let s = 0; s < cols; s++) {
        const a = (s / segs) * Math.PI * 2, i = j * cols + s;
        const down = Math.max(0, -Math.cos(a)); // la parte bassa pende (manica a kimono)
        const yy = Math.cos(a) * r - down * drop, zz = Math.sin(a) * r * (P.flat || 1);
        pos[i * 3] = cx; pos[i * 3 + 1] = cy + yy - (r - model.armRadius(side, t)) * 0.35; pos[i * 3 + 2] = cz + zz;
        base[i * 3] = cx; base[i * 3 + 1] = cy; base[i * 3 + 2] = cz;
        uv[i * 2] = a * 0.06; uv[i * 2 + 1] = t * A.len;
        const low = sstep(elbowT - 0.12, elbowT + 0.12, t);
        si[i * 4] = bi[key + 'UpperArm']; sw[i * 4] = 1 - low; si[i * 4 + 1] = bi[key + 'LowerArm']; sw[i * 4 + 1] = low;
        pw[i * 8 + (side === 'L' ? PW.armL : PW.armR)] = 1;
      }
    }
    const idx = [];
    for (let j = 0; j < rings; j++) for (let s = 0; s < segs; s++) {
      const a = j * cols + s, b = a + 1, c = a + cols, d = c + 1;
      if (A.sgn > 0) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d);
    }
    const mesh = new MeshData({ pos: { a: pos, k: 3 }, nrm: { a: new Float32Array(n * 3), k: 3 }, uv: { a: uv, k: 2 }, pw: { a: pw, k: 8 }, base: { a: base, k: 3 } }, si, sw, Uint32Array.from(idx));
    mesh.attrs.nrm.a = smoothNormals(pos, mesh.idx);
    out.push({ mesh, mat: P.mat });
  }
  return out;
}
