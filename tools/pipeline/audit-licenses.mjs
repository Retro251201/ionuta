// Verifica delle licenze degli asset 3D distribuiti: legge i metadati VRM DENTRO ogni file sotto extension/assets
// e controlla che dichiarino una licenza ammessa. Usato anche dai test (tools/tests/assets.test.mjs).
// Uso: node tools/pipeline/audit-licenses.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FREE_USE, FREE_USE_FILES } from './provenance.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const ASSET_ROOT = path.join(root, 'extension/assets');
/** Licenze accettate per la redistribuzione nel pacchetto (uso commerciale e modifica consentiti). */
export const ACCEPTED_LICENSES = ['CC0'];

/** JSON del contenitore GLB/VRM (primo chunk). */
export function readGlbJson(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32LE(0) !== 0x46546c67) throw new Error('non è un file GLB: ' + file);
  return JSON.parse(b.slice(20, 20 + b.readUInt32LE(12)).toString('utf8'));
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out); else if (/\.(vrm|glb)$/i.test(e.name)) out.push(f);
  }
  return out;
}

/** Elenco dei modelli distribuiti con i metadati di licenza letti dal file. */
export function auditModels() {
  return walk(ASSET_ROOT).sort().map((file) => {
    const j = readGlbJson(file);
    const ext = j.extensions || {};
    const v0 = ext.VRM, v1 = ext.VRMC_vrm;
    const m = (v0 && v0.meta) || (v1 && v1.meta) || {};
    const license = v0 ? m.licenseName : m.licenseUrl;
    const rel = path.relative(ASSET_ROOT, file).replace(/\\/g, '/');
    const free = FREE_USE_FILES[rel] ? FREE_USE[FREE_USE_FILES[rel]] : null;
    return {
      file: rel, bytes: fs.statSync(file).size,
      vrm: v0 ? '0.x' : v1 ? '1.0' : null, title: m.title || m.name || '', author: m.author || (m.authors || []).join(', ') || '',
      license: free ? free.license : (license || ''), embeddedLicense: license || '',
      commercial: m.commercialUssageName || m.commercialUsage || '', sexual: m.sexualUssageName || '', violent: m.violentUssageName || '',
      allowedUser: m.allowedUserName || m.avatarPermission || '',
      provenance: free ? free.url : null,
      ok: ACCEPTED_LICENSES.includes(license) || !!free
    };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rows = auditModels();
  for (const r of rows) console.log((r.ok ? 'OK  ' : 'NO  ') + r.file.padEnd(22), (r.bytes / 1e6).toFixed(2).padStart(5) + ' MB', `VRM ${r.vrm}`, `titolo="${r.title}"`, `licenza="${r.license}"`, `commerciale=${r.commercial}`, `utenti=${r.allowedUser}`, `sexual=${r.sexual}`, `violent=${r.violent}`);
  const bad = rows.filter((r) => !r.ok);
  console.log(bad.length ? `ERRORE: ${bad.length} modelli senza licenza ammessa` : `Tutti i ${rows.length} modelli dichiarano una licenza ammessa (${ACCEPTED_LICENSES.join(', ')}).`);
  process.exit(bad.length ? 1 : 0);
}
