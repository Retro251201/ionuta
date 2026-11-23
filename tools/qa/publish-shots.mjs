// Copia in docs/screenshots (JPEG) gli screenshot QA di riferimento prodotti da `npm run qa` in tools/qa/out.
// Va eseguito solo quando le immagini di riferimento devono cambiare (nuova milestone, interfaccia modificata).
// Uso: node tools/qa/publish-shots.mjs
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { ROOT } from '../dev/serve.mjs';

const OUT = process.env.DC_OUT || path.join(ROOT, 'tools/qa/out');
const DOCS = path.join(ROOT, 'docs/screenshots');
const SHOTS = [
  ['34_stage_high_full.png', '30_stage_3d_full.jpg'],
  ['35_stage_high_wave.png', '31_stage_3d_wave.jpg'],
  ['33_stage_fallback_svg.png', '32_stage_fallback_svg.jpg'],
  ['hair_sheet.png', '33_hair_styles_3d.jpg']
];
for (const [src, dst] of SHOTS) {
  const from = path.join(OUT, src);
  if (!fs.existsSync(from)) { console.log('manca', src, '(esegui prima npm run qa)'); continue; }
  await sharp(from).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(DOCS, dst));
  console.log(dst, (fs.statSync(path.join(DOCS, dst)).size / 1024).toFixed(0) + ' KB');
}
