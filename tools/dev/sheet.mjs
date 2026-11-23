// Foglio di revisione visiva: più screenshot del banco di prova affiancati in un'unica immagine.
// Uso: node tools/dev/sheet.mjs out.jpg 'tools/dev/character.html?az=0' 'tools/dev/character.html?az=90' … [--size 420x640]
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { shoot } from './shot.mjs';

const args = process.argv.slice(2);
let size = '420x640';
const si = args.indexOf('--size');
if (si >= 0) { size = args[si + 1]; args.splice(si, 2); }
const [out, ...pages] = args;
const [w, h] = size.split('x').map(Number);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sheet-'));
const jobs = pages.map((p, i) => ({ path: p, out: path.join(tmp, i + '.png'), size, timeout: 180000 }));
const res = await shoot(jobs);
let bad = 0;
for (const r of res) { if (!r.ready || r.errs.length) { bad++; console.log(r.ready ? 'READY' : 'NOT READY', r.job); for (const e of r.errs) console.log('  !', e); } }
const cols = Math.min(pages.length, 5), rows = Math.ceil(pages.length / cols);
const comps = jobs.filter((j) => fs.existsSync(j.out)).map((j, i) => ({ input: j.out, left: (i % cols) * w, top: Math.floor(i / cols) * h }));
await sharp({ create: { width: cols * w, height: rows * h, channels: 3, background: '#202230' } }).composite(comps).jpeg({ quality: 85 }).toFile(out);
console.log('foglio', out, `${pages.length} viste`, bad ? `${bad} con errori` : 'senza errori');
process.exit(bad ? 1 : 0);
