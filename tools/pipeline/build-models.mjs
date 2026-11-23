// Modelli "personaggio completo": VRM CC0 già pronti (corpo + viso + capelli + vestiti) tra cui scegliere nel menu.
// Sul modello selezionato il motore applica soltanto la testa fotografica (il volto dell'utente). Qui i modelli
// vengono solo ottimizzati per l'estensione: texture in WebP ridimensionate, primitive fuse, miniatura rimossa.
// Uso: node tools/pipeline/build-models.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { readGLB, writeGLB, mergePrimitives, rebuild } from './glb-tools.mjs';
import { MODELS } from './sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cache = path.join(root, '.cache/models');
const outDir = path.join(root, 'extension/assets/avatar/models');
fs.mkdirSync(outDir, { recursive: true });

// id → [sorgente in sources.mjs, nome mostrato, descrizione breve]
const CHARACTERS = {
  vivi: ['Vivi', 'Vivi', 'Dolce, caschetto castano, abito verde'],
  victoria: ['Victoria_Rubin', 'Victoria', 'Elegante, coda bionda, abito rosa'],
  vita: ['Vita', 'Vita', 'Cyber, pixie bianco, body futuristico'],
  shino: ['Sendagaya_Shino', 'Shino', 'Intensa, capelli lunghi, uniforme'],
  darkness: ['Darkness_Shibu', 'Darkness', 'Gothic, capelli magenta, abito scuro'],
  nyan: ['HairSample_Female', 'Nyan', 'Orecchie da gatto, codini, abito bianco'],
  fumi: ['Sakurada_Fumiriya', 'Fumi', 'Boyish, capelli rosa, look sbarazzino'],
  sendagaya: ['Sendagaya_Shibu', 'Aoi', 'Schoolgirl, caschetto blu notte']
};

async function encodeImage(buf, mime, name) {
  let img = sharp(buf);
  const meta = await img.metadata();
  if (Math.max(meta.width, meta.height) > 1024) img = img.resize({ width: 1024, height: 1024, fit: 'inside' });
  const lossless = /nml|normal|_out|Matcap|Shader_/i.test(name);
  const data = await img.webp(lossless ? { lossless: true } : { quality: 88, alphaQuality: 100, effort: 5 }).toBuffer();
  return data.length < buf.length ? { data, mimeType: 'image/webp' } : null;
}

const index = [];
for (const [id, [src, name, desc]] of Object.entries(CHARACTERS)) {
  const file = path.join(cache, src + '.vrm');
  if (!fs.existsSync(file)) { console.warn('manca', src, '(scaricalo in .cache/models)'); continue; }
  const doc = readGLB(file);
  const v0 = doc.json.extensions.VRM;
  if (v0 && v0.meta) v0.meta.texture = undefined; // via la miniatura
  const merged = mergePrimitives(doc);
  await rebuild(doc, { encodeImage });
  doc.json.asset.generator = (doc.json.asset.generator || '') + ' | Desktop Companion asset pipeline (build-models)';
  const out = path.join(outDir, id + '.vrm');
  writeGLB(out, doc.json, doc.bin);
  const tris = doc.json.meshes.reduce((s, m) => s + m.primitives.reduce((q, p) => q + doc.json.accessors[p.indices].count / 3, 0), 0);
  const mb = fs.statSync(out).size / 1e6;
  console.log((id + '.vrm').padEnd(16), mb.toFixed(2) + ' MB', `prim ${merged.before}→${merged.after}`, `tri ${tris}`);
  index.push({ id, name, desc, file: `avatar/models/${id}.vrm`, kind: 'full', source: src, license: MODELS[src] ? MODELS[src].license : 'CC0-1.0', tris });
}
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 1));
console.log('modelli completi:', index.length);
