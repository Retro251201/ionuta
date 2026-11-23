// Pacchetto dell'app desktop: copia desktop/ + extension/ in una cartella di staging e crea l'app con
// @electron/packager. Uso: node tools/desktop/build.mjs [win32|linux|darwin] (default: win32)
// Uscita: dist/Desktop Companion-<piattaforma>-x64/ e lo ZIP corrispondente.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { packager } from '@electron/packager';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const platform = process.argv[2] || 'win32';
const stage = path.join(root, 'dist/.stage');
fs.rmSync(stage, { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });
for (const f of ['main.js', 'preload.js', 'package.json']) fs.copyFileSync(path.join(root, 'desktop', f), path.join(stage, f));
fs.cpSync(path.join(root, 'extension'), path.join(stage, 'extension'), { recursive: true });

const out = await packager({
  dir: stage, out: path.join(root, 'dist'), platform, arch: 'x64', overwrite: true, asar: false, prune: false,
  name: 'Desktop Companion', appCopyright: 'Uso personale', quiet: true
});
for (const dir of out) {
  const zip = dir + '.zip';
  fs.rmSync(zip, { force: true });
  execFileSync('zip', ['-qr', path.basename(zip), path.basename(dir)], { cwd: path.dirname(dir) });
  console.log('pronto:', path.relative(root, dir), '·', (fs.statSync(zip).size / 1e6).toFixed(0) + ' MB zip');
}
fs.rmSync(stage, { recursive: true, force: true });
