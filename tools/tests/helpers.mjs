// Utilità condivise dai test unitari (node --test). Nessuna dipendenza esterna.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
export const readJson = (rel) => JSON.parse(read(rel));
export const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
export const sha256 = (rel) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');

/** Elenco ricorsivo dei file (percorsi relativi alla radice del repository, con "/"). */
export function walk(rel, filter = () => true) {
  const out = [];
  const rec = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const f = dir + '/' + e.name;
      if (e.isDirectory()) rec(f); else if (filter(f)) out.push(f);
    }
  };
  if (exists(rel)) rec(rel);
  return out.sort();
}

export const LEGACY_SHARED = ['extension/src/shared/heads.generated.js', 'extension/src/shared/skins.js', 'extension/src/shared/data.js'];

/** Carica gli script IIFE della v0.2 (namespace globale DC) in un contesto isolato e restituisce DC. */
export function loadLegacy(files = LEGACY_SHARED, extra = {}) {
  const ctx = vm.createContext({ console, setTimeout, clearTimeout, ...extra });
  for (const f of files) vm.runInContext(read(f), ctx, { filename: f });
  return ctx.DC;
}
