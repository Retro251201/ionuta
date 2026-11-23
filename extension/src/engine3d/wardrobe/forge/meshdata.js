// MeshData: rappresentazione "a zuppa di vertici" usata dalla Garment Forge (spazio canonico, +Z = fronte).
// Contiene attributi float generici + skinning; offre taglio lungo un campo scalare (con interpolazione di
// tutti gli attributi, pesi di skinning inclusi), normali saldate e conversione in BufferGeometry.
import { THREE } from '../../lib.js';

export class MeshData {
  /** @param {Object<string,{a:Float32Array|number[],k:number}>} attrs deve contenere almeno `pos` (k=3) */
  constructor(attrs, si, sw, idx) {
    this.attrs = attrs; this.si = si; this.sw = sw; this.idx = idx;
  }
  get n() { return this.attrs.pos.a.length / 3; }
  get pos() { return this.attrs.pos.a; }
  attr(name) { return this.attrs[name] && this.attrs[name].a; }
  addAttr(name, k, fill = 0) { const a = new Float32Array(this.n * k); if (fill) a.fill(fill); this.attrs[name] = { a, k }; return a; }
  clone() {
    const attrs = {};
    for (const [k, v] of Object.entries(this.attrs)) attrs[k] = { a: Float32Array.from(v.a), k: v.k };
    return new MeshData(attrs, Uint16Array.from(this.si), Float32Array.from(this.sw), Uint32Array.from(this.idx));
  }
}

function lerpSkin(si, sw, a, b, t, outI, outW) {
  // unione delle influenze dei due vertici, pesi interpolati, si tengono le 4 maggiori
  const ids = [], ws = [];
  for (let k = 0; k < 4; k++) {
    const wa = sw[a * 4 + k] * (1 - t), ia = si[a * 4 + k];
    if (wa > 0) { const j = ids.indexOf(ia); if (j < 0) { ids.push(ia); ws.push(wa); } else ws[j] += wa; }
    const wb = sw[b * 4 + k] * t, ib = si[b * 4 + k];
    if (wb > 0) { const j = ids.indexOf(ib); if (j < 0) { ids.push(ib); ws.push(wb); } else ws[j] += wb; }
  }
  const order = ids.map((_, i) => i).sort((x, y) => ws[y] - ws[x]).slice(0, 4);
  let sum = 0;
  for (const o of order) sum += ws[o];
  for (let k = 0; k < 4; k++) {
    if (k < order.length) { outI.push(ids[order[k]]); outW.push(ws[order[k]] / (sum || 1)); } else { outI.push(0); outW.push(0); }
  }
}

/**
 * Taglia la mesh tenendo la parte in cui il campo è > 0. I triangoli attraversati vengono tagliati esattamente
 * sull'isolinea 0 (bordi puliti per orli, scolli, polsini).
 * @param {MeshData} mesh
 * @param {Float32Array} f campo per vertice
 * @returns {{mesh:MeshData, border:Array<[number,number]>, map:Int32Array}} border = segmenti orientati sul taglio
 */
export function clipByField(mesh, f) {
  const n = mesh.n, names = Object.keys(mesh.attrs);
  const out = {};
  for (const nm of names) out[nm] = [];
  const oi = [], ow = [], map = new Int32Array(n).fill(-1), idx = [], border = [];
  let count = 0;
  const keep = (v) => {
    if (map[v] >= 0) return map[v];
    for (const nm of names) { const { a, k } = mesh.attrs[nm]; for (let c = 0; c < k; c++) out[nm].push(a[v * k + c]); }
    for (let c = 0; c < 4; c++) { oi.push(mesh.si[v * 4 + c]); ow.push(mesh.sw[v * 4 + c]); }
    return (map[v] = count++);
  };
  const edge = new Map();
  const cut = (a, b) => { // a dentro, b fuori
    const key = a < b ? a * n + b : b * n + a;
    let id = edge.get(key);
    if (id !== undefined) return id;
    const t = f[a] / (f[a] - f[b]);
    for (const nm of names) { const { a: arr, k } = mesh.attrs[nm]; for (let c = 0; c < k; c++) out[nm].push(arr[a * k + c] + (arr[b * k + c] - arr[a * k + c]) * t); }
    lerpSkin(mesh.si, mesh.sw, a, b, t, oi, ow);
    id = count++;
    edge.set(key, id);
    return id;
  };
  const I = mesh.idx;
  for (let t = 0; t < I.length; t += 3) {
    const v = [I[t], I[t + 1], I[t + 2]];
    const inside = [f[v[0]] > 0, f[v[1]] > 0, f[v[2]] > 0];
    const cnt = inside[0] + inside[1] + inside[2];
    if (cnt === 0) continue;
    if (cnt === 3) { idx.push(keep(v[0]), keep(v[1]), keep(v[2])); continue; }
    if (cnt === 1) {
      const i = inside[0] ? 0 : inside[1] ? 1 : 2, a = v[i], b = v[(i + 1) % 3], c = v[(i + 2) % 3];
      const pa = keep(a), ab = cut(a, b), ac = cut(a, c);
      idx.push(pa, ab, ac);
      border.push([ab, ac]);
    } else {
      const i = !inside[0] ? 0 : !inside[1] ? 1 : 2, a = v[i], b = v[(i + 1) % 3], c = v[(i + 2) % 3]; // a fuori
      const pb = keep(b), pc = keep(c), ba = cut(b, a), ca = cut(c, a);
      idx.push(pb, pc, ca, pb, ca, ba);
      border.push([ca, ba]);
    }
  }
  const attrs = {};
  for (const nm of names) attrs[nm] = { a: Float32Array.from(out[nm]), k: mesh.attrs[nm].k };
  return { mesh: new MeshData(attrs, Uint16Array.from(oi), Float32Array.from(ow), Uint32Array.from(idx)), border, map };
}

/** Rimuove i vertici inutilizzati dopo modifiche agli indici. */
export function compact(mesh) {
  const n = mesh.n, map = new Int32Array(n).fill(-1);
  let c = 0;
  for (const i of mesh.idx) if (map[i] < 0) map[i] = c++;
  const attrs = {};
  for (const [nm, { a, k }] of Object.entries(mesh.attrs)) {
    const o = new Float32Array(c * k);
    for (let i = 0; i < n; i++) if (map[i] >= 0) for (let j = 0; j < k; j++) o[map[i] * k + j] = a[i * k + j];
    attrs[nm] = { a: o, k };
  }
  const si = new Uint16Array(c * 4), sw = new Float32Array(c * 4);
  for (let i = 0; i < n; i++) if (map[i] >= 0) for (let j = 0; j < 4; j++) { si[map[i] * 4 + j] = mesh.si[i * 4 + j]; sw[map[i] * 4 + j] = mesh.sw[i * 4 + j]; }
  return new MeshData(attrs, si, sw, Uint32Array.from(mesh.idx, (i) => map[i]));
}

/** id "saldato" per posizione (i vertici duplicati lungo le cuciture UV condividono l'id). */
export function weldIds(pos, eps = 1e-5) {
  const n = pos.length / 3, ids = new Uint32Array(n), m = new Map();
  let c = 0;
  const q = 1 / eps;
  for (let i = 0; i < n; i++) {
    const key = Math.round(pos[i * 3] * q) + '_' + Math.round(pos[i * 3 + 1] * q) + '_' + Math.round(pos[i * 3 + 2] * q);
    let id = m.get(key);
    if (id === undefined) { id = c++; m.set(key, id); }
    ids[i] = id;
  }
  return { ids, count: c };
}

/** Normali lisce pesate per area, continue attraverso le cuciture (vertici saldati per posizione). */
export function smoothNormals(pos, idx, weld = null) {
  const n = pos.length / 3;
  const w = weld || weldIds(pos);
  const acc = new Float32Array(w.count * 3);
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const v of [idx[t], idx[t + 1], idx[t + 2]]) { const k = w.ids[v] * 3; acc[k] += nx; acc[k + 1] += ny; acc[k + 2] += nz; }
  }
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const k = w.ids[i] * 3;
    const l = Math.hypot(acc[k], acc[k + 1], acc[k + 2]) || 1;
    out[i * 3] = acc[k] / l; out[i * 3 + 1] = acc[k + 1] / l; out[i * 3 + 2] = acc[k + 2] / l;
  }
  return out;
}

/** Lisciatura laplaciana delle posizioni (i vertici con `lock[i] > 0` restano fermi in proporzione). */
export function laplacian(mesh, iterations = 1, strength = 0.5, lock = null) {
  const pos = mesh.pos, w = weldIds(pos), nb = Array.from({ length: w.count }, () => new Set());
  const I = mesh.idx;
  for (let t = 0; t < I.length; t += 3) {
    const a = w.ids[I[t]], b = w.ids[I[t + 1]], c = w.ids[I[t + 2]];
    nb[a].add(b); nb[a].add(c); nb[b].add(a); nb[b].add(c); nb[c].add(a); nb[c].add(b);
  }
  const cur = new Float32Array(w.count * 3), lk = new Float32Array(w.count);
  for (let i = 0; i < mesh.n; i++) { const k = w.ids[i] * 3; cur[k] = pos[i * 3]; cur[k + 1] = pos[i * 3 + 1]; cur[k + 2] = pos[i * 3 + 2]; if (lock) lk[w.ids[i]] = Math.max(lk[w.ids[i]], lock[i]); }
  const nxt = new Float32Array(cur.length);
  for (let it = 0; it < iterations; it++) {
    for (let v = 0; v < w.count; v++) {
      const s = nb[v];
      if (!s.size) { nxt[v * 3] = cur[v * 3]; nxt[v * 3 + 1] = cur[v * 3 + 1]; nxt[v * 3 + 2] = cur[v * 3 + 2]; continue; }
      let x = 0, y = 0, z = 0;
      for (const u of s) { x += cur[u * 3]; y += cur[u * 3 + 1]; z += cur[u * 3 + 2]; }
      const k = strength * (1 - lk[v]);
      nxt[v * 3] = cur[v * 3] + (x / s.size - cur[v * 3]) * k;
      nxt[v * 3 + 1] = cur[v * 3 + 1] + (y / s.size - cur[v * 3 + 1]) * k;
      nxt[v * 3 + 2] = cur[v * 3 + 2] + (z / s.size - cur[v * 3 + 2]) * k;
    }
    cur.set(nxt);
  }
  for (let i = 0; i < mesh.n; i++) { const k = w.ids[i] * 3; pos[i * 3] = cur[k]; pos[i * 3 + 1] = cur[k + 1]; pos[i * 3 + 2] = cur[k + 2]; }
}

/** Orienta i triangoli verso l'esterno (rispetto al punto del corpo `base`) e ricalcola le normali. */
export function orientOutward(mesh) {
  const pos = mesh.pos, base = mesh.attr('base'), I = mesh.idx;
  if (!base) return mesh;
  let s = 0;
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    s += nx * (pos[a] - base[a]) + ny * (pos[a + 1] - base[a + 1]) + nz * (pos[a + 2] - base[a + 2]);
  }
  if (s < 0) for (let t = 0; t < I.length; t += 3) { const k = I[t + 1]; I[t + 1] = I[t + 2]; I[t + 2] = k; }
  mesh.attrs.nrm = { a: smoothNormals(pos, I), k: 3 };
  return mesh;
}

/** Unisce più MeshData (stessi attributi) in una sola; restituisce anche gli intervalli di indici per parte. */
export function mergeMeshes(list) {
  const names = Object.keys(list[0].attrs).filter((nm) => list.every((m) => m.attrs[nm]));
  let n = 0, ni = 0;
  for (const m of list) { n += m.n; ni += m.idx.length; }
  const attrs = {};
  for (const nm of names) attrs[nm] = { a: new Float32Array(n * list[0].attrs[nm].k), k: list[0].attrs[nm].k };
  const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), idx = new Uint32Array(ni), ranges = [];
  let vo = 0, io = 0;
  for (const m of list) {
    for (const nm of names) attrs[nm].a.set(m.attrs[nm].a, vo * attrs[nm].k);
    si.set(m.si, vo * 4); sw.set(m.sw, vo * 4);
    for (let i = 0; i < m.idx.length; i++) idx[io + i] = m.idx[i] + vo;
    ranges.push({ start: io, count: m.idx.length });
    vo += m.n; io += m.idx.length;
  }
  return { mesh: new MeshData(attrs, si, sw, idx), ranges };
}

/** Converte in BufferGeometry nello spazio locale della mesh del corpo (flip = −1 per i VRM 0.x). */
export function toGeometry(mesh, flip = 1, morphNames = []) {
  const g = new THREE.BufferGeometry();
  const n = mesh.n, pos = mesh.pos;
  const nrm = mesh.attr('nrm') || smoothNormals(pos, mesh.idx);
  const P = new Float32Array(n * 3), N = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    P[i * 3] = pos[i * 3] * flip; P[i * 3 + 1] = pos[i * 3 + 1]; P[i * 3 + 2] = pos[i * 3 + 2] * flip;
    N[i * 3] = nrm[i * 3] * flip; N[i * 3 + 1] = nrm[i * 3 + 1]; N[i * 3 + 2] = nrm[i * 3 + 2] * flip;
  }
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  if (mesh.attr('uv')) g.setAttribute('uv', new THREE.BufferAttribute(Float32Array.from(mesh.attr('uv')), 2));
  g.setAttribute('skinIndex', new THREE.BufferAttribute(Uint16Array.from(mesh.si), 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(Float32Array.from(mesh.sw), 4));
  g.setIndex(new THREE.BufferAttribute(Uint32Array.from(mesh.idx), 1));
  if (morphNames.length) {
    g.morphAttributes.position = [];
    g.morphTargetsRelative = true;
    for (const nm of morphNames) {
      const src = mesh.attr('morph_' + nm), d = new Float32Array(n * 3);
      if (src) for (let i = 0; i < n; i++) { d[i * 3] = src[i * 3] * flip; d[i * 3 + 1] = src[i * 3 + 1]; d[i * 3 + 2] = src[i * 3 + 2] * flip; }
      const at = new THREE.BufferAttribute(d, 3);
      at.name = nm;
      g.morphAttributes.position.push(at);
    }
  }
  g.computeBoundingSphere();
  return g;
}
