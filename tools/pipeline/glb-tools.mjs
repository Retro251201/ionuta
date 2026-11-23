// Utilità glTF binario (GLB/VRM) per la pipeline asset: lettura/scrittura, filtro e fusione primitive,
// garbage collection di accessor/bufferView/materiali/texture/immagini, ricodifica immagini in WebP.
// Lavora direttamente sul JSON glTF: gli indici dei nodi NON cambiano mai (le ossa restano tutte).
import fs from 'fs';

export function readGLB(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32LE(0) !== 0x46546c67) throw new Error('non è un GLB: ' + file);
  const jl = b.readUInt32LE(12);
  const json = JSON.parse(b.slice(20, 20 + jl).toString('utf8'));
  const bo = 20 + jl;
  const bl = b.readUInt32LE(bo);
  const bin = b.slice(bo + 8, bo + 8 + bl);
  return { json, bin };
}

export function writeGLB(file, json, bin) {
  let js = Buffer.from(JSON.stringify(json), 'utf8');
  const jp = (4 - (js.length % 4)) % 4;
  if (jp) js = Buffer.concat([js, Buffer.alloc(jp, 0x20)]);
  const bp = (4 - (bin.length % 4)) % 4;
  const bb = bp ? Buffer.concat([bin, Buffer.alloc(bp)]) : bin;
  const head = Buffer.alloc(12);
  head.writeUInt32LE(0x46546c67, 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + js.length + 8 + bb.length, 8);
  const jh = Buffer.alloc(8); jh.writeUInt32LE(js.length, 0); jh.writeUInt32LE(0x4e4f534a, 4);
  const bh = Buffer.alloc(8); bh.writeUInt32LE(bb.length, 0); bh.writeUInt32LE(0x004e4942, 4);
  fs.writeFileSync(file, Buffer.concat([head, jh, js, bh, bb]));
}

const COMP = { 5120: [Int8Array, 1], 5121: [Uint8Array, 1], 5122: [Int16Array, 2], 5123: [Uint16Array, 2], 5125: [Uint32Array, 4], 5126: [Float32Array, 4] };
const NCOMP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };

/** Copia tipizzata dei dati di un accessor (senza sparse, con supporto a byteStride). */
export function accessorArray(doc, index) {
  const { json, bin } = doc;
  const a = json.accessors[index];
  const [T, size] = COMP[a.componentType];
  const n = NCOMP[a.type];
  const out = new T(a.count * n);
  if (a.bufferView === undefined) return out;
  const bv = json.bufferViews[a.bufferView];
  const src = bv._data || bin;
  const base = (bv._data ? 0 : bv.byteOffset || 0) + (a.byteOffset || 0);
  const stride = bv.byteStride || n * size;
  const dv = new DataView(src.buffer, src.byteOffset, src.byteLength);
  const rd = { 5120: 'getInt8', 5121: 'getUint8', 5122: 'getInt16', 5123: 'getUint16', 5125: 'getUint32', 5126: 'getFloat32' }[a.componentType];
  for (let i = 0; i < a.count; i++) for (let c = 0; c < n; c++) out[i * n + c] = dv[rd](base + i * stride + c * size, true);
  return out;
}

/** Aggiunge un bufferView+accessor nuovi (i dati restano in memoria fino a rebuild()). */
export function addAccessor(doc, typed, type, extra = {}) {
  const { json } = doc;
  const ct = Object.keys(COMP).find((k) => typed instanceof COMP[k][0]);
  json.bufferViews.push({ buffer: 0, byteLength: typed.byteLength, _data: Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength), ...(extra.target ? { target: extra.target } : {}) });
  const acc = { bufferView: json.bufferViews.length - 1, componentType: Number(ct), count: typed.length / NCOMP[type], type };
  if (extra.minmax) {
    const n = NCOMP[type], min = new Array(n).fill(Infinity), max = new Array(n).fill(-Infinity);
    for (let i = 0; i < typed.length; i++) { const c = i % n; if (typed[i] < min[c]) min[c] = typed[i]; if (typed[i] > max[c]) max[c] = typed[i]; }
    acc.min = min; acc.max = max;
  }
  json.accessors.push(acc);
  return json.accessors.length - 1;
}

/** Tiene solo le primitive per cui keep(nomeMateriale, nomeMesh) è vero; le mesh vuote vengono rimosse. */
export function filterPrimitives(doc, keep) {
  const { json } = doc;
  const meshMap = new Map();
  const meshes = [];
  json.meshes.forEach((m, i) => {
    m.primitives = m.primitives.filter((p) => keep((json.materials[p.material] || {}).name || '', m.name || ''));
    if (m.primitives.length) { meshMap.set(i, meshes.length); meshes.push(m); }
  });
  json.meshes = meshes;
  const removedNodes = new Set();
  json.nodes.forEach((n, i) => {
    if (n.mesh === undefined) return;
    if (meshMap.has(n.mesh)) n.mesh = meshMap.get(n.mesh);
    else { delete n.mesh; delete n.skin; delete n.weights; removedNodes.add(i); }
  });
  const ext = json.extensions || {};
  if (ext.VRM) {
    const v = ext.VRM;
    for (const g of (v.blendShapeMaster && v.blendShapeMaster.blendShapeGroups) || []) {
      g.binds = (g.binds || []).filter((b) => meshMap.has(b.mesh)).map((b) => ({ ...b, mesh: meshMap.get(b.mesh) }));
    }
    if (v.firstPerson && v.firstPerson.meshAnnotations) v.firstPerson.meshAnnotations = v.firstPerson.meshAnnotations.filter((a) => meshMap.has(a.mesh)).map((a) => ({ ...a, mesh: meshMap.get(a.mesh) }));
  }
  if (ext.VRMC_vrm) {
    const v = ext.VRMC_vrm;
    const ex = v.expressions || {};
    for (const set of [ex.preset || {}, ex.custom || {}]) for (const e of Object.values(set)) if (e.morphTargetBinds) e.morphTargetBinds = e.morphTargetBinds.filter((b) => !removedNodes.has(b.node));
    if (v.firstPerson && v.firstPerson.meshAnnotations) v.firstPerson.meshAnnotations = v.firstPerson.meshAnnotations.filter((a) => !removedNodes.has(a.node));
  }
  return doc;
}

/** Fonde le primitive di una mesh che condividono materiale e buffer dei vertici (riduzione dei draw call). */
export function mergePrimitives(doc) {
  const { json } = doc;
  let before = 0, after = 0;
  for (const m of json.meshes) {
    before += m.primitives.length;
    const groups = new Map();
    for (const p of m.primitives) {
      const key = JSON.stringify([p.material, p.attributes, p.targets || null, p.mode === undefined ? 4 : p.mode]);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    const out = [];
    for (const list of groups.values()) {
      if (list.length === 1) { out.push(list[0]); continue; }
      const parts = list.map((p) => accessorArray(doc, p.indices));
      const total = parts.reduce((s, a) => s + a.length, 0);
      const idx = new Uint32Array(total);
      let o = 0;
      for (const a of parts) { idx.set(a, o); o += a.length; }
      out.push({ ...list[0], indices: addAccessor(doc, idx, 'SCALAR', { target: 34963 }) });
    }
    m.primitives = out;
    after += out.length;
  }
  return { before, after };
}

function walkTextureRefs(obj, fn) {
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object') {
      if (/[Tt]exture$/.test(k) && typeof v.index === 'number') v.index = fn(v.index);
      walkTextureRefs(v, fn);
    }
  }
}

/** Rimuove tutto ciò che non è più referenziato e ricostruisce il buffer binario.
 *  opts.encodeImage(async (buf, mime, name) => {data, mimeType} | null) permette di ricodificare le immagini. */
export async function rebuild(doc, opts = {}) {
  const { json, bin } = doc;
  const ext = json.extensions || {};
  // --- materiali ---
  const usedMat = new Set();
  for (const m of json.meshes) for (const p of m.primitives) if (p.material !== undefined) usedMat.add(p.material);
  const matMap = new Map();
  const mats = [];
  (json.materials || []).forEach((m, i) => { if (usedMat.has(i)) { matMap.set(i, mats.length); mats.push(m); } });
  if (ext.VRM && ext.VRM.materialProperties) ext.VRM.materialProperties = ext.VRM.materialProperties.filter((_, i) => usedMat.has(i));
  const keptNames = new Set(mats.map((m) => m.name));
  if (ext.VRM && ext.VRM.blendShapeMaster) for (const g of ext.VRM.blendShapeMaster.blendShapeGroups || []) g.materialValues = (g.materialValues || []).filter((v) => keptNames.has(v.materialName));
  json.materials = mats;
  for (const m of json.meshes) for (const p of m.primitives) if (p.material !== undefined) p.material = matMap.get(p.material);
  if (ext.VRMC_vrm && ext.VRMC_vrm.expressions) {
    const ex = ext.VRMC_vrm.expressions;
    for (const set of [ex.preset || {}, ex.custom || {}]) for (const e of Object.values(set)) for (const key of ['materialColorBinds', 'textureTransformBinds']) if (e[key]) e[key] = e[key].filter((b) => matMap.has(b.material)).map((b) => ({ ...b, material: matMap.get(b.material) }));
  }
  // --- texture ---
  const usedTex = new Set();
  const mark = (i) => { usedTex.add(i); return i; };
  for (const m of json.materials) walkTextureRefs(m, mark);
  if (ext.VRM) {
    for (const mp of ext.VRM.materialProperties || []) for (const v of Object.values(mp.textureProperties || {})) usedTex.add(v);
    if (opts.keepThumbnail && ext.VRM.meta && ext.VRM.meta.texture >= 0) usedTex.add(ext.VRM.meta.texture);
  }
  const texMap = new Map();
  const texs = [];
  (json.textures || []).forEach((t, i) => { if (usedTex.has(i)) { texMap.set(i, texs.length); texs.push(t); } });
  for (const m of json.materials) walkTextureRefs(m, (i) => texMap.get(i));
  if (ext.VRM) {
    for (const mp of ext.VRM.materialProperties || []) for (const k of Object.keys(mp.textureProperties || {})) mp.textureProperties[k] = texMap.get(mp.textureProperties[k]);
    if (ext.VRM.meta) { if (opts.keepThumbnail && texMap.has(ext.VRM.meta.texture)) ext.VRM.meta.texture = texMap.get(ext.VRM.meta.texture); else delete ext.VRM.meta.texture; }
  }
  json.textures = texs;
  // --- immagini ---
  const usedImg = new Set(texs.map((t) => t.source));
  if (ext.VRMC_vrm && ext.VRMC_vrm.meta) { if (opts.keepThumbnail && ext.VRMC_vrm.meta.thumbnailImage !== undefined) usedImg.add(ext.VRMC_vrm.meta.thumbnailImage); else delete ext.VRMC_vrm.meta.thumbnailImage; }
  const imgMap = new Map();
  const imgs = [];
  (json.images || []).forEach((im, i) => { if (usedImg.has(i)) { imgMap.set(i, imgs.length); imgs.push(im); } });
  for (const t of texs) t.source = imgMap.get(t.source);
  if (ext.VRMC_vrm && ext.VRMC_vrm.meta && ext.VRMC_vrm.meta.thumbnailImage !== undefined) ext.VRMC_vrm.meta.thumbnailImage = imgMap.get(ext.VRMC_vrm.meta.thumbnailImage);
  json.images = imgs;
  // --- accessor ---
  const usedAcc = new Set();
  for (const m of json.meshes) for (const p of m.primitives) {
    for (const a of Object.values(p.attributes)) usedAcc.add(a);
    if (p.indices !== undefined) usedAcc.add(p.indices);
    for (const t of p.targets || []) for (const a of Object.values(t)) usedAcc.add(a);
  }
  for (const s of json.skins || []) if (s.inverseBindMatrices !== undefined) usedAcc.add(s.inverseBindMatrices);
  for (const an of json.animations || []) for (const s of an.samplers) { usedAcc.add(s.input); usedAcc.add(s.output); }
  const accMap = new Map();
  const accs = [];
  json.accessors.forEach((a, i) => { if (usedAcc.has(i)) { accMap.set(i, accs.length); accs.push(a); } });
  for (const m of json.meshes) for (const p of m.primitives) {
    for (const k of Object.keys(p.attributes)) p.attributes[k] = accMap.get(p.attributes[k]);
    if (p.indices !== undefined) p.indices = accMap.get(p.indices);
    for (const t of p.targets || []) for (const k of Object.keys(t)) t[k] = accMap.get(t[k]);
  }
  for (const s of json.skins || []) if (s.inverseBindMatrices !== undefined) s.inverseBindMatrices = accMap.get(s.inverseBindMatrices);
  for (const an of json.animations || []) for (const s of an.samplers) { s.input = accMap.get(s.input); s.output = accMap.get(s.output); }
  json.accessors = accs;
  // --- bufferView + buffer ---
  const usedBV = new Set();
  for (const a of accs) { if (a.bufferView !== undefined) usedBV.add(a.bufferView); if (a.sparse) { usedBV.add(a.sparse.indices.bufferView); usedBV.add(a.sparse.values.bufferView); } }
  for (const im of imgs) if (im.bufferView !== undefined) usedBV.add(im.bufferView);
  const data = new Map();
  for (const i of usedBV) { const bv = json.bufferViews[i]; data.set(i, bv._data || bin.slice(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength)); }
  if (opts.encodeImage) {
    for (const im of imgs) {
      if (im.bufferView === undefined) continue;
      const r = await opts.encodeImage(data.get(im.bufferView), im.mimeType, im.name || '');
      if (r) { data.set(im.bufferView, r.data); im.mimeType = r.mimeType; }
    }
  }
  const bvMap = new Map();
  const bvs = [];
  const chunks = [];
  let off = 0;
  json.bufferViews.forEach((bv, i) => {
    if (!usedBV.has(i)) return;
    const d = data.get(i);
    const pad = (4 - (off % 4)) % 4;
    if (pad) { chunks.push(Buffer.alloc(pad)); off += pad; }
    const nb = { ...bv, buffer: 0, byteOffset: off, byteLength: d.length };
    delete nb._data;
    bvMap.set(i, bvs.length); bvs.push(nb); chunks.push(d); off += d.length;
  });
  for (const a of accs) { if (a.bufferView !== undefined) a.bufferView = bvMap.get(a.bufferView); if (a.sparse) { a.sparse.indices.bufferView = bvMap.get(a.sparse.indices.bufferView); a.sparse.values.bufferView = bvMap.get(a.sparse.values.bufferView); } }
  for (const im of imgs) if (im.bufferView !== undefined) im.bufferView = bvMap.get(im.bufferView);
  json.bufferViews = bvs;
  doc.bin = Buffer.concat(chunks);
  json.buffers = [{ byteLength: doc.bin.length }];
  if (imgs.some((im) => im.mimeType === 'image/webp')) {
    json.extensionsUsed = Array.from(new Set([...(json.extensionsUsed || []), 'EXT_texture_webp']));
    for (const t of texs) if (imgs[t.source].mimeType === 'image/webp') t.extensions = { ...(t.extensions || {}), EXT_texture_webp: { source: t.source } };
  }
  return doc;
}
