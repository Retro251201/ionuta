// Corpo base "VRoid 1.x Female" (hinzka/52blendshapes-for-VRoid-face, uso libero anche con ridistribuzione e
// modifica, vedi docs/ASSET_CREDITS.md). Produce:
//   extension/assets/avatar/female.vrm   corpo + viso + fisica del seno, senza vestiti né capelli del modello
//   extension/assets/avatar/female.json  misure della testa (capelli e testa fotografica)
//   extension/assets/hair/vroid_long.vrm acconciatura originale del modello (mesh + spring bone)
// Uso: node tools/pipeline/build-female.mjs <percorso del file VRoid_V110_Female_v1.1.3.vrm>
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { readGLB, writeGLB, filterPrimitives, mergePrimitives, rebuild, accessorArray } from './glb-tools.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const src = process.argv[2] || path.join(root, '.cache/models/VRoid_V110_Female.vrm');
export const FEMALE_SOURCE = {
  name: 'VRoid_V110_Female_v1.1.3', author: 'hinzka (modello VRoid Studio 1.x con 52 blendshape)',
  url: 'https://github.com/hinzka/52blendshapes-for-VRoid-face', license: 'uso libero, modifica e ridistribuzione consentite (README del repository)'
};

async function encodeImage(buf, mime, name, maxSize) {
  let img = sharp(buf);
  const meta = await img.metadata();
  if (maxSize && Math.max(meta.width, meta.height) > maxSize) img = img.resize({ width: maxSize, height: maxSize, fit: 'inside' });
  const lossless = /nml|normal|_out|Matcap|Shader_/i.test(name);
  const data = await img.webp(lossless ? { lossless: true } : { quality: 90, alphaQuality: 100, effort: 5 }).toBuffer();
  return data.length < buf.length ? { data, mimeType: 'image/webp' } : null;
}

function headFit(doc) {
  const j = doc.json, names = j.nodes.map((n) => n.name || '');
  const parent = new Map();
  j.nodes.forEach((n, i) => (n.children || []).forEach((c) => parent.set(c, i)));
  const world = (i) => { let p = [0, 0, 0]; for (let k = i; k !== undefined; k = parent.get(k)) { const t = j.nodes[k].translation || [0, 0, 0]; p = [p[0] + t[0], p[1] + t[1], p[2] + t[2]]; } return p; };
  const head = world(names.indexOf('J_Bip_C_Head'));
  let prim = null;
  for (const m of j.meshes) for (const p of m.primitives) if (/Face_00_SKIN/.test((j.materials[p.material] || {}).name || '')) prim = prim || p;
  const pos = accessorArray(doc, prim.attributes.POSITION), idx = accessorArray(doc, prim.indices);
  const lo = [9, 9, 9], hi = [-9, -9, -9];
  for (const i of idx) for (let c = 0; c < 3; c++) { lo[c] = Math.min(lo[c], pos[i * 3 + c]); hi[c] = Math.max(hi[c], pos[i * 3 + c]); }
  const r = (v) => Math.round(v * 10000) / 10000;
  return { w: r(hi[0] - lo[0]), top: r(hi[1] - head[1]), chin: r(lo[1] - head[1]), front: r(-(lo[2] - head[2])), headY: r(head[1]) };
}

async function build(out, keepMat, keepGroup, maxSize) {
  const doc = readGLB(src);
  const fit = headFit(doc);
  filterPrimitives(doc, keepMat);
  const v0 = doc.json.extensions.VRM, names = doc.json.nodes.map((n) => n.name || '');
  v0.secondaryAnimation.boneGroups = v0.secondaryAnimation.boneGroups.filter((g) => keepGroup(g, (g.bones || []).map((b) => names[b])));
  v0.meta.texture = undefined; // niente miniatura da 1,6 MB nel pacchetto
  const merged = mergePrimitives(doc);
  await rebuild(doc, { encodeImage: (b, m, n) => encodeImage(b, m, n, maxSize) });
  doc.json.asset.generator = (doc.json.asset.generator || '') + ' | Desktop Companion asset pipeline (build-female)';
  writeGLB(out, doc.json, doc.bin);
  const tris = doc.json.meshes.reduce((s, m) => s + m.primitives.reduce((q, p) => q + doc.json.accessors[p.indices].count / 3, 0), 0);
  console.log(path.relative(root, out).padEnd(40), (fs.statSync(out).size / 1e6).toFixed(2) + ' MB', `prim ${merged.before}→${merged.after}`, `tri ${tris}`);
  return { fit, tris };
}

const isHair = (names) => names.every((n) => /HairJoint/.test(n));
const base = await build(path.join(root, 'extension/assets/avatar/female.vrm'), (mat) => !/CLOTH|HAIR/.test(mat), (g, names) => g.comment === 'Bust' || (!isHair(names) && !/Tops|Bottoms/.test(g.comment || '')), 2048);
fs.writeFileSync(path.join(root, 'extension/assets/avatar/female.json'), JSON.stringify({ source: FEMALE_SOURCE.name, license: FEMALE_SOURCE.license, fit: base.fit }, null, 1));
const hair = await build(path.join(root, 'extension/assets/hair/vroid_long.vrm'), (mat) => /HAIR/.test(mat), (g, names) => isHair(names), 1024);
const idxFile = path.join(root, 'extension/assets/hair/index.json');
const index = JSON.parse(fs.readFileSync(idxFile, 'utf8')).filter((h) => h.id !== 'vroid_long');
index.unshift({ id: 'vroid_long', name: 'Lunghi morbidi', file: 'hair/vroid_long.vrm', source: FEMALE_SOURCE.name, license: 'free-use', fit: hair.fit, tris: hair.tris });
fs.writeFileSync(idxFile, JSON.stringify(index, null, 1));
console.log('fit', JSON.stringify(base.fit));
