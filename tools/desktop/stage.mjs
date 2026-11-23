// Prepara la cartella dell'app desktop da pacchettizzare: desktop/ (processo principale) + extension/ (motore 3D,
// modelli, animazioni, foto). Usato dall'installer (electron-builder) e dal pacchetto portatile (build.mjs).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const STAGE = path.join(root, 'dist/.stage');

export function stageApp() {
  fs.rmSync(STAGE, { recursive: true, force: true });
  fs.mkdirSync(STAGE, { recursive: true });
  for (const f of ['main.js', 'preload.js', 'package.json']) fs.copyFileSync(path.join(root, 'desktop', f), path.join(STAGE, f));
  fs.cpSync(path.join(root, 'extension'), path.join(STAGE, 'extension'), { recursive: true });
  return STAGE;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log('app pronta in', path.relative(root, stageApp()));
