// Crea l'installer dell'app desktop con electron-builder.
// Uso: node tools/desktop/installer.mjs [win|linux]   (default: win → Desktop-Companion-Setup-<versione>.exe)
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { build, Platform } from 'electron-builder';
import sharp from 'sharp';
import { stageApp } from './stage.mjs';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const target = process.argv[2] || 'win';

// icona 256×256 (minimo richiesto dall'installer Windows) generata dall'icona dell'estensione
const iconDir = path.join(root, 'desktop/build');
fs.mkdirSync(iconDir, { recursive: true });
await sharp(path.join(root, 'extension/assets/icons/icon128.png')).resize(256, 256, { kernel: 'lanczos3' }).png().toFile(path.join(iconDir, 'icon.png'));

stageApp();
const config = JSON.parse(fs.readFileSync(path.join(root, 'desktop/electron-builder.json'), 'utf8'));
config.electronVersion = require('electron/package.json').version;
config.directories = { app: path.join(root, 'dist/.stage'), output: path.join(root, 'dist/installer'), buildResources: iconDir };
config.win.icon = path.join(iconDir, 'icon.png');
config.linux.icon = path.join(iconDir, 'icon.png');

const out = await build({ targets: (target === 'linux' ? Platform.LINUX : Platform.WINDOWS).createTarget(), config, publish: 'never' });
for (const f of out.filter((f) => /\.(exe|AppImage)$/.test(f))) console.log('installer pronto:', path.relative(root, f), '·', (fs.statSync(f).size / 1e6).toFixed(0) + ' MB');
