// Sviluppo: estrae le immagini di un GLB/VRM in una cartella. Uso: node tools/pipeline/extract-images.mjs file.vrm outDir
import fs from 'fs';
import path from 'path';
import { readGLB } from './glb-tools.mjs';

const [file, out] = process.argv.slice(2);
const { json, bin } = readGLB(file);
fs.mkdirSync(out, { recursive: true });
json.images.forEach((im, i) => {
  const bv = json.bufferViews[im.bufferView];
  const ext = im.mimeType === 'image/webp' ? 'webp' : im.mimeType === 'image/jpeg' ? 'jpg' : 'png';
  const f = path.join(out, `${im.name || 'img' + i}.${ext}`);
  fs.writeFileSync(f, bin.slice(bv.byteOffset, bv.byteOffset + bv.byteLength));
  console.log(f, bv.byteLength);
});
