// Costruisce gli asset 3D distribuiti nell'estensione a partire dai modelli CC0 scaricati in .cache/models:
//   extension/assets/avatar/base.vrm   corpo + viso (senza vestiti e senza capelli del modello di origine)
//   extension/assets/avatar/base.json  misure della testa (per adattare capelli e testa fotografica)
//   extension/assets/hair/<id>.vrm     una acconciatura per file (mesh capelli + ossa + spring bone) + index.json
//   extension/assets/face/*.webp       texture alternative per iridi, sopracciglia, linea degli occhi, ciglia
// Riduce i draw call fondendo le primitive e ricodifica le texture in WebP.
// Uso: node tools/pipeline/build-avatar.mjs [--no-webp]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { readGLB, writeGLB, filterPrimitives, mergePrimitives, rebuild, accessorArray } from './glb-tools.mjs';
import { MODELS } from './sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cache = path.join(root, '.cache/models');
const noWebp = process.argv.includes('--no-webp');

// Le normal map e le maschere restano lossless; i colori vanno in WebP di alta qualità (alpha preservata).
async function encodeImage(buf, mime, name, maxSize) {
  if (noWebp) return null;
  let img = sharp(buf);
  const meta = await img.metadata();
  if (maxSize && Math.max(meta.width, meta.height) > maxSize) img = img.resize({ width: maxSize, height: maxSize, fit: 'inside' });
  const lossless = /nml|normal|_out|Matcap|Shader_/i.test(name);
  const data = await img.webp(lossless ? { lossless: true } : { quality: 92, alphaQuality: 100, effort: 5 }).toBuffer();
  return data.length < buf.length ? { data, mimeType: 'image/webp' } : null;
}

/** Misure della testa in coordinate relative all'osso Head (larghezza viso, sommità, mento, sporgenza frontale). */
function headFit(doc) {
  const j = doc.json, names = j.nodes.map((n) => n.name || '');
  const parent = new Map();
  j.nodes.forEach((n, i) => (n.children || []).forEach((c) => parent.set(c, i)));
  const world = (i) => { let p = [0, 0, 0]; for (let k = i; k !== undefined; k = parent.get(k)) { const t = j.nodes[k].translation || [0, 0, 0]; p = [p[0] + t[0], p[1] + t[1], p[2] + t[2]]; } return p; };
  const head = world(names.indexOf('J_Bip_C_Head'));
  let prim = null;
  for (const m of j.meshes) for (const p of m.primitives) if (/Face_00_SKIN/.test((j.materials[p.material] || {}).name || '')) prim = prim || p;
  if (!prim) return null;
  const pos = accessorArray(doc, prim.attributes.POSITION), idx = accessorArray(doc, prim.indices);
  const lo = [9, 9, 9], hi = [-9, -9, -9];
  for (const i of idx) for (let c = 0; c < 3; c++) { lo[c] = Math.min(lo[c], pos[i * 3 + c]); hi[c] = Math.max(hi[c], pos[i * 3 + c]); }
  const r = (v) => Math.round(v * 10000) / 10000;
  // i VRM 0.x guardano verso −Z: la sporgenza frontale è −minZ
  return { w: r(hi[0] - lo[0]), top: r(hi[1] - head[1]), chin: r(lo[1] - head[1]), front: r(-(lo[2] - head[2])), headY: r(head[1]) };
}

/** Rimuove dalla texture del corpo l'intimo DIPINTO del modello di origine riempiendolo con il colore della pelle
 *  circostante (diffusione). L'intimo vero è un capo 3D del guardaroba; il corpo resta un manichino senza dettagli. */
async function inpaintPaintedUnderwear(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, S = 256, fx = W / S, fy = H / S;
  const notSkin = (i) => data[i + 2] > data[i] - 14; // bluastro/grigio = tessuto dipinto
  const mask = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) if (notSkin(p * 4)) mask[p] = 1;
  // dilatazione di 4 px per includere il bordo sfumato
  for (let it = 0; it < 4; it++) {
    const m2 = Uint8Array.from(mask);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const p = y * W + x; if (!mask[p] && (mask[p - 1] || mask[p + 1] || mask[p - W] || mask[p + W])) m2[p] = 1; }
    mask.set(m2);
  }
  // mappa a bassa risoluzione dei soli pixel di pelle, poi diffusione nei buchi
  const acc = new Float32Array(S * S * 3), cnt = new Float32Array(S * S);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const p = y * W + x; if (mask[p]) continue; const q = Math.floor(y / fy) * S + Math.floor(x / fx); acc[q * 3] += data[p * 4]; acc[q * 3 + 1] += data[p * 4 + 1]; acc[q * 3 + 2] += data[p * 4 + 2]; cnt[q]++; }
  const known = new Uint8Array(S * S), cur = new Float32Array(S * S * 3);
  for (let q = 0; q < S * S; q++) if (cnt[q] > fx * fy * 0.5) { known[q] = 1; for (let c = 0; c < 3; c++) cur[q * 3 + c] = acc[q * 3 + c] / cnt[q]; }
  let filled = Uint8Array.from(known);
  for (let it = 0; it < 400; it++) {
    const nxt = Float32Array.from(cur), f2 = Uint8Array.from(filled);
    let changed = false;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const q = y * S + x;
      if (known[q]) continue;
      let r = 0, g = 0, b = 0, n = 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= S || yy >= S) continue; const k = yy * S + xx; if (!filled[k]) continue; r += cur[k * 3]; g += cur[k * 3 + 1]; b += cur[k * 3 + 2]; n++; }
      if (n) { nxt[q * 3] = r / n; nxt[q * 3 + 1] = g / n; nxt[q * 3 + 2] = b / n; if (!filled[q]) { f2[q] = 1; changed = true; } }
    }
    cur.set(nxt); filled = f2;
    if (!changed && it > 120) break;
  }
  let n = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (!mask[p]) continue;
    const gx = Math.min(S - 1.001, Math.max(0, x / fx - 0.5)), gy = Math.min(S - 1.001, Math.max(0, y / fy - 0.5)), x0 = Math.floor(gx), y0 = Math.floor(gy), tx = gx - x0, ty = gy - y0;
    for (let c = 0; c < 3; c++) {
      const a = cur[(y0 * S + x0) * 3 + c], b = cur[(y0 * S + x0 + 1) * 3 + c], d = cur[((y0 + 1) * S + x0) * 3 + c], e = cur[((y0 + 1) * S + x0 + 1) * 3 + c];
      data[p * 4 + c] = Math.round((a * (1 - tx) + b * tx) * (1 - ty) + (d * (1 - tx) + e * tx) * ty);
    }
    n++;
  }
  console.log('  intimo dipinto rimosso dalla texture del corpo:', n, 'pixel');
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

async function build(src, out, keep, opts = {}) {
  const doc = readGLB(path.join(cache, src + '.vrm'));
  const fit = headFit(doc);
  filterPrimitives(doc, keep);
  const v0 = doc.json.extensions.VRM;
  if (opts.dropHairSprings && v0) {
    const names = doc.json.nodes.map((n) => n.name || '');
    v0.secondaryAnimation.boneGroups = v0.secondaryAnimation.boneGroups.filter((g) => !(g.bones || []).every((b) => /^HairJoint/.test(names[b])));
  }
  const merged = mergePrimitives(doc);
  await rebuild(doc, { encodeImage: async (b, m, n) => { if (opts.cleanBody && /Body_00$/.test(n)) { const clean = await inpaintPaintedUnderwear(b); return (await encodeImage(clean, 'image/png', n, opts.maxSize)) || { data: clean, mimeType: 'image/png' }; } return encodeImage(b, m, n, opts.maxSize); } });
  doc.json.asset.generator = (doc.json.asset.generator || '') + ' | Desktop Companion asset pipeline (primitive rimosse/fuse, texture WebP)';
  fs.mkdirSync(path.dirname(out), { recursive: true });
  writeGLB(out, doc.json, doc.bin);
  const tris = doc.json.meshes.reduce((s, m) => s + m.primitives.reduce((q, p) => q + doc.json.accessors[p.indices].count / 3, 0), 0);
  console.log(path.relative(root, out).padEnd(44), (fs.statSync(out).size / 1e6).toFixed(2) + ' MB', `prim ${merged.before}→${merged.after}`, `tri ${tris}`);
  return { fit, tris };
}

/** Estrae le texture del viso di un donatore (stessa mappatura UV per tutti i modelli VRoid beta). */
async function faceTextures(src, key, outDir) {
  const doc = readGLB(path.join(cache, src + '.vrm'));
  const parts = { iris: /EyeIris_00$/, eyeline: /FaceEyeline_00$/, eyelash: /FaceEyelash_00$/, brow: /FaceBrow_00$/, highlight: /EyeHighlight_00$/ };
  const out = {};
  for (const im of doc.json.images) {
    for (const [part, re] of Object.entries(parts)) {
      if (!re.test(im.name || '') || out[part]) continue;
      const bv = doc.json.bufferViews[im.bufferView];
      const file = `${key}_${part}.webp`;
      await sharp(doc.bin.slice(bv.byteOffset, bv.byteOffset + bv.byteLength)).resize({ width: 512, height: 512, fit: 'inside' }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(outDir, file));
      out[part] = 'face/' + file;
    }
  }
  return out;
}

// id acconciatura → modello donatore + nome mostrato
export const HAIR_SOURCES = {
  twintail: ['HairSample_Female', 'Codini alti'], pixie: ['Vita', 'Pixie con chignon'], mushroom: ['Vivi', 'Caschetto tondo'], bun: ['Victoria_Rubin', 'Corto con chignon'],
  long: ['Sendagaya_Shino', 'Lunghi lisci'], layered: ['Darkness_Shibu', 'Scalati medi'], short: ['Sakurada_Fumiriya', 'Corto mosso'], boyish: ['Sendagaya_Shibu', 'Corto sbarazzino'], wolf: ['HairSample_Male', 'Wolf cut']
};
const FACE_SOURCES = { classic: ['HairSample_Female', 'Classico'], vita: ['Vita', 'Cyber'], vivi: ['Vivi', 'Dolce'], victoria: ['Victoria_Rubin', 'Brillante'], shino: ['Sendagaya_Shino', 'Intenso'], shibu: ['Darkness_Shibu', 'Notturno'] };

const base = await build('HairSample_Female', path.join(root, 'extension/assets/avatar/base.vrm'), (mat) => !/CLOTH|HAIR/.test(mat), { dropHairSprings: true, cleanBody: true });
fs.writeFileSync(path.join(root, 'extension/assets/avatar/base.json'), JSON.stringify({ source: 'HairSample_Female', license: 'CC0-1.0', fit: base.fit }, null, 1));
const hairIndex = [];
for (const [id, [src, name]] of Object.entries(HAIR_SOURCES)) {
  if (!MODELS[src]) throw new Error('fonte non dichiarata in sources.mjs: ' + src);
  if (!fs.existsSync(path.join(cache, src + '.vrm'))) { console.warn('manca', src, '(esegui fetch-assets)'); continue; }
  const r = await build(src, path.join(root, `extension/assets/hair/${id}.vrm`), (mat) => /HAIR/.test(mat), { maxSize: 1024 });
  hairIndex.push({ id, name, file: `hair/${id}.vrm`, source: src, license: MODELS[src].license, fit: r.fit, tris: r.tris });
}
fs.writeFileSync(path.join(root, 'extension/assets/hair/index.json'), JSON.stringify(hairIndex, null, 1));
const faceDir = path.join(root, 'extension/assets/face');
fs.mkdirSync(faceDir, { recursive: true });
const faceIndex = [];
for (const [key, [src, name]] of Object.entries(FACE_SOURCES)) faceIndex.push({ id: key, name, source: src, license: MODELS[src].license, textures: await faceTextures(src, key, faceDir) });
fs.writeFileSync(path.join(faceDir, 'index.json'), JSON.stringify(faceIndex, null, 1));
console.log('hair', hairIndex.length, 'face sets', faceIndex.length, 'base fit', JSON.stringify(base.fit));
