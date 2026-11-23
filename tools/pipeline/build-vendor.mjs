// Genera extension/vendor/three.bundle.js (three.js + addon + @pixiv/three-vrm) e i file di licenza.
// Uso: npm run vendor
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'extension/vendor');
fs.mkdirSync(out, { recursive: true });
const ver = (p) => JSON.parse(fs.readFileSync(path.join(root, 'node_modules', p, 'package.json'), 'utf8')).version;
await build({
  entryPoints: [path.join(root, 'tools/pipeline/vendor-entry.mjs')],
  bundle: true, format: 'esm', minify: true, target: 'chrome110', legalComments: 'none',
  banner: { js: `/* three.js ${ver('three')} (MIT) + @pixiv/three-vrm ${ver('@pixiv/three-vrm')} (MIT) – vedi vendor/LICENSES.txt */` },
  outfile: path.join(out, 'three.bundle.js')
});
const lic = ['three', '@pixiv/three-vrm', '@pixiv/three-vrm-animation'].map((p) => `===== ${p} ${ver(p)} =====\n` + fs.readFileSync(path.join(root, 'node_modules', p, 'LICENSE'), 'utf8')).join('\n\n');
fs.writeFileSync(path.join(out, 'LICENSES.txt'), lic);
console.log('vendor ok', (fs.statSync(path.join(out, 'three.bundle.js')).size / 1024).toFixed(0) + ' KB');
