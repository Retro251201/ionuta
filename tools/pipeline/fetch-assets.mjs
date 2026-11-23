// Scarica in .cache/ i sorgenti dichiarati in sources.mjs (solo sviluppo). Uso: node tools/pipeline/fetch-assets.mjs
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { MODELS } from './sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, '.cache/models');
fs.mkdirSync(dir, { recursive: true });
const sums = {};
for (const [name, m] of Object.entries(MODELS)) {
  const f = path.join(dir, name + '.vrm');
  if (!fs.existsSync(f)) {
    const r = await fetch(m.url);
    if (!r.ok) { console.error('ERRORE', name, r.status); continue; }
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  }
  const b = fs.readFileSync(f);
  sums[name] = crypto.createHash('sha256').update(b).digest('hex');
  const j = JSON.parse(b.slice(20, 20 + b.readUInt32LE(12)).toString('utf8'));
  const meta = (j.extensions.VRM || j.extensions.VRMC_vrm).meta;
  console.log(name.padEnd(20), (b.length / 1e6).toFixed(1).padStart(5) + ' MB', 'licenza nel file:', meta.licenseName || meta.licenseUrl, '| sha256', sums[name].slice(0, 16));
}
fs.writeFileSync(path.join(root, 'tools/pipeline/sources.sha256.json'), JSON.stringify(sums, null, 1) + '\n');
