// Asset 3D distribuiti: licenze verificate dentro i file, indici coerenti con i file presenti, fonti dichiarate
// e registro docs/ASSET_CREDITS.md allineato.
import test from 'node:test';
import assert from 'node:assert/strict';
import { read, readJson, exists, walk } from './helpers.mjs';
import { auditModels, ACCEPTED_LICENSES } from '../pipeline/audit-licenses.mjs';
import { MODELS } from '../pipeline/sources.mjs';
import { FREE_USE, FREE_USE_SOURCES } from '../pipeline/provenance.mjs';

const knownSource = (s) => !!MODELS[s] || FREE_USE_SOURCES.has(s);

const models = auditModels();

test('licenze: ogni modello distribuito dichiara nei propri metadati una licenza ammessa', () => {
  assert.ok(models.length >= 10);
  for (const m of models) {
    // ammessi: licenza CC0 nei metadati, oppure concessione d'uso libera documentata (provenance.mjs)
    assert.ok(m.ok, `${m.file}: licenza "${m.embedddedLicense || m.license}" non ammessa né documentata`);
    if (ACCEPTED_LICENSES.includes(m.embeddedLicense)) assert.equal(m.commercial, 'Allow', m.file + ': uso commerciale non consentito');
    else assert.ok(m.provenance, m.file + ': concessione d\'uso senza URL di provenienza');
  }
});

test('fonti: ogni sorgente della pipeline ha URL, licenza CC0, autore e impronta SHA-256', () => {
  const sums = readJson('tools/pipeline/sources.sha256.json');
  for (const [name, src] of Object.entries(MODELS)) {
    assert.match(src.url, /^https:\/\//, name);
    assert.equal(src.license, 'CC0-1.0', name);
    assert.ok(src.author, name);
    assert.match(sums[name] || '', /^[0-9a-f]{64}$/, 'impronta mancante per ' + name);
  }
});

test('capelli: indice coerente con i file e con le fonti dichiarate', () => {
  const index = readJson('extension/assets/hair/index.json');
  assert.ok(index.length >= 9);
  assert.equal(new Set(index.map((h) => h.id)).size, index.length);
  for (const h of index) {
    assert.ok(exists('extension/assets/' + h.file), h.file);
    assert.ok(knownSource(h.source), 'fonte non dichiarata: ' + h.source);
    assert.ok(h.license === 'CC0-1.0' || FREE_USE_SOURCES.has(h.source), h.id + ': licenza ' + h.license);
    for (const k of ['w', 'top', 'chin', 'front', 'headY']) assert.equal(typeof h.fit[k], 'number', `${h.id}.fit.${k}`);
    assert.ok(h.tris > 0 && h.tris < 40000, h.id + ': numero di triangoli fuori budget');
  }
  const files = walk('extension/assets/hair', (f) => f.endsWith('.vrm')).map((f) => f.replace('extension/assets/', ''));
  assert.deepEqual(files, index.map((h) => h.file).sort(), 'file dei capelli non elencati nell\'indice (o viceversa)');
});

test('viso: ogni set di texture esiste ed è dichiarato', () => {
  const index = readJson('extension/assets/face/index.json');
  assert.ok(index.length >= 6);
  const listed = new Set();
  for (const set of index) {
    assert.ok(MODELS[set.source], set.source);
    assert.deepEqual(Object.keys(set.textures).sort(), ['brow', 'eyelash', 'eyeline', 'highlight', 'iris']);
    for (const f of Object.values(set.textures)) { assert.ok(exists('extension/assets/' + f), f); listed.add('extension/assets/' + f); }
  }
  for (const f of walk('extension/assets/face', (x) => x.endsWith('.webp'))) assert.ok(listed.has(f), 'texture non elencata: ' + f);
});

test('avatar base: misure della testa presenti', () => {
  const base = readJson('extension/assets/avatar/base.json');
  assert.ok(MODELS[base.source]);
  assert.ok(base.fit.w > 0.1 && base.fit.w < 0.3 && base.fit.top > 0 && base.fit.chin < 0);
});

test('registro crediti: docs/ASSET_CREDITS.md cita ogni fonte e ogni libreria distribuita', () => {
  const credits = read('docs/ASSET_CREDITS.md');
  for (const name of Object.keys(MODELS)) assert.ok(credits.includes(name), 'fonte non registrata in ASSET_CREDITS.md: ' + name);
  for (const name of Object.keys(FREE_USE)) assert.ok(credits.includes(name), 'fonte non registrata in ASSET_CREDITS.md: ' + name);
  for (const lib of ['three.js', '@pixiv/three-vrm']) assert.ok(credits.includes(lib), lib);
  for (const m of models) assert.ok(credits.includes(m.file), 'file non registrato in ASSET_CREDITS.md: ' + m.file);
});
