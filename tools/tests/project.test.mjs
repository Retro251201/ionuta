// Integrità del progetto: manifest MV3, coerenza delle versioni, pagine dell'estensione, vincolo offline,
// toolchain vendor e protezione delle fotografie originali.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import { read, readJson, exists, sha256, walk, loadLegacy } from './helpers.mjs';

const manifest = readJson('extension/manifest.json');

test('manifest: Manifest V3 con service worker e file esistenti', () => {
  assert.equal(manifest.manifest_version, 3);
  const files = [manifest.background.service_worker, manifest.action.default_popup, manifest.options_page,
    ...Object.values(manifest.icons), ...manifest.content_scripts.flatMap((c) => c.js)];
  for (const f of files) assert.ok(exists('extension/' + f), 'file del manifest mancante: ' + f);
});

test('manifest: nessun permesso host obbligatorio e nessuna CSP permissiva', () => {
  assert.deepEqual(manifest.host_permissions || [], [], 'i permessi host devono restare facoltativi (privacy)');
  const csp = JSON.stringify(manifest.content_security_policy || {});
  assert.ok(!/unsafe-eval|https?:\/\//.test(csp.replace(/wasm-unsafe-eval/g, '')), 'CSP con eval o origini remote: ' + csp);
});

test('versioni: manifest.json, DC.VERSION e package.json coincidono', () => {
  const DC = loadLegacy(['extension/src/shared/data.js']);
  assert.equal(DC.VERSION, manifest.version);
  assert.equal(readJson('package.json').version, manifest.version);
  assert.equal(readJson('package-lock.json').version, manifest.version);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
});

test('pagine dell\'estensione: solo script/stili locali esistenti, nessuno script inline (CSP MV3)', () => {
  const pages = walk('extension/src', (f) => f.endsWith('.html'));
  assert.ok(pages.length >= 3);
  for (const page of pages) {
    const html = read(page);
    assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html), 'script inline in ' + page);
    const refs = [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/gi), ...html.matchAll(/<link[^>]*\bhref="([^"]+)"/gi)].map((m) => m[1]);
    for (const ref of refs) {
      assert.ok(!/^(https?:)?\/\//.test(ref), `risorsa remota in ${page}: ${ref}`);
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(page), ref.split(/[?#]/)[0]));
      assert.ok(exists(target), `risorsa mancante in ${page}: ${ref}`);
    }
  }
});

test('offline: il motore 3D e le sue pagine non contengono URL remoti', () => {
  const ALLOWED = [/http:\/\/www\.w3\.org\//];
  const files = [...walk('extension/src/engine3d', (f) => f.endsWith('.js')), ...walk('extension/src/stage', (f) => /\.(js|html|css)$/.test(f))];
  assert.ok(files.length > 0);
  for (const f of files) {
    for (const m of read(f).matchAll(/https?:\/\/[^\s'"`)]+/g)) assert.ok(ALLOWED.some((re) => re.test(m[0])), `URL remoto in ${f}: ${m[0]}`);
  }
});

test('moduli ES del motore 3D: ogni import relativo punta a un file esistente', () => {
  const files = [...walk('extension/src/engine3d', (f) => f.endsWith('.js')), ...walk('extension/src/stage', (f) => f.endsWith('.js'))];
  let count = 0;
  for (const f of files) {
    for (const m of read(f).matchAll(/(?:from|import)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(f), m[1]));
      assert.ok(exists(target), `import interrotto in ${f}: ${m[1]}`);
      count++;
    }
    assert.ok(!/from\s+['"](three|@pixiv)/.test(read(f)), `${f}: le librerie 3D si importano solo da engine3d/lib.js`);
  }
  assert.ok(count > 20);
});

test('vendor: il bundle locale corrisponde alle versioni installate di three e three-vrm', { skip: !exists('node_modules/three/package.json') && 'node_modules assente (npm install)' }, () => {
  const banner = read('extension/vendor/three.bundle.js').slice(0, 200);
  const three = readJson('node_modules/three/package.json').version, vrm = readJson('node_modules/@pixiv/three-vrm/package.json').version;
  assert.ok(banner.includes(`three.js ${three} `), `bundle non allineato a three ${three}: esegui "npm run vendor"`);
  assert.ok(banner.includes(`three-vrm ${vrm} `), `bundle non allineato a three-vrm ${vrm}: esegui "npm run vendor"`);
  const lic = read('extension/vendor/LICENSES.txt');
  assert.ok(lic.includes(`three ${three}`) && lic.includes(`@pixiv/three-vrm ${vrm}`) && /MIT/.test(lic));
});

test('fotografie originali: sorgenti e ritagli delle teste invariati byte per byte', () => {
  const expected = readJson('tools/tests/fixtures/protected-assets.sha256.json');
  assert.equal(Object.keys(expected).length, 10);
  for (const [file, hash] of Object.entries(expected)) {
    assert.ok(exists(file), 'file protetto mancante: ' + file);
    assert.equal(sha256(file), hash, 'file protetto modificato: ' + file);
  }
  assert.deepEqual(walk('source_photos'), Object.keys(expected).filter((f) => f.startsWith('source_photos/')).sort());
});

test('repository: nessun segreto o file di ambiente tracciabile', () => {
  const ignore = read('.gitignore');
  for (const p of ['node_modules/', '.env']) assert.ok(ignore.includes(p), '.gitignore deve escludere ' + p);
  for (const f of walk('.', (x) => /(^|\/)\.env(\.|$)/.test(x) && !x.includes('node_modules/'))) assert.fail('file di ambiente nel repository: ' + f);
});
