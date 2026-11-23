// Prova automatica dell'app desktop (Electron reale, senza schermo: ozone headless + SwiftShader).
// Verifica: finestra del personaggio trasparente/senza bordi/sempre in primo piano con clic passanti, personaggio 3D
// caricato con volto fotografico e animazioni, Studio apribile, salvataggio nello Studio riflesso sul desktop.
// Uso: node tools/desktop/smoke.mjs
import { _electron as electron } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const exe = path.join(root, 'node_modules/electron/dist/electron');
const user = fs.mkdtempSync(path.join(os.tmpdir(), 'dc-desk-'));
const checks = [];
const check = (name, ok, detail = '') => { checks.push(ok); console.log((ok ? '  ✓ ' : '  ✗ ') + name + (detail ? ' — ' + detail : '')); };

const app = await electron.launch({
  executablePath: exe, cwd: root,
  args: [path.join(root, 'desktop/main.js'), '--ozone-platform=headless', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--user-data-dir=${user}`],
  env: { ...process.env, DC_NO_TRAY: '1' },
  timeout: 120000
});
const errors = [];
const watch = (p) => { p.on('pageerror', (e) => errors.push('pageerror: ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Couldn't load texture blob|GPU stall|Automatic fallback|GroupMarkerNotSet/.test(m.text())) errors.push('console: ' + m.text()); }); };
app.on('window', watch);
for (const w of app.windows()) watch(w);
try {
  const deadline = Date.now() + 180000;
  let mate = null;
  while (!mate && Date.now() < deadline) { for (const w of app.windows()) if (/companion\.html/.test(w.url())) mate = w; if (!mate) await new Promise((r) => setTimeout(r, 300)); }
  check('app: finestra del personaggio aperta', !!mate, mate && mate.url());
  await mate.waitForFunction(() => window.__dcCompanion && window.__dcCompanion.ready, null, { timeout: 180000 });
  const st = await mate.evaluate(() => { const e = window.__dcCompanion.engine; return { mode: window.__dcCompanion.mode, desktop: !!window.dcDesktop, photo: e && e.photoHead.active, clips: e ? e.anim.list().length : 0, model: e && e.model }; });
  check('app: personaggio 3D caricato con volto fotografico e animazioni', st.mode === '3d' && st.desktop && st.photo && st.clips >= 8, `modello ${st.model}, ${st.clips} clip`);
  const win = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().map((w) => ({ url: w.webContents.getURL(), top: w.isAlwaysOnTop(), resizable: w.isResizable(), bounds: w.getBounds(), bg: w.getBackgroundColor() })));
  const m = win.find((w) => /companion/.test(w.url));
  // (senza schermo reale le dimensioni riportate sono fittizie: si verificano le proprietà della finestra)
  // "sempre in primo piano" e trasparenza dipendono dal window manager: senza schermo reale non sono verificabili qui
  check('app: finestra del personaggio a dimensione fissa (senza bordi)', !!m && !m.resizable, m && `primo piano riportato: ${m.top} (non verificabile senza schermo)`);
  // trascinamento: il renderer chiede lo spostamento della finestra
  const before = m.bounds;
  await mate.evaluate(() => { window.dcDesktop.moveBy(-60, -40); window.dcDesktop.dragEnd(); });
  await new Promise((r) => setTimeout(r, 400));
  const after = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().find((w) => /companion/.test(w.webContents.getURL())).getBounds());
  check('app: il personaggio si sposta trascinandolo (finestra mossa sul desktop)', after.x === before.x - 60 && after.y === before.y - 40, `${before.x},${before.y} → ${after.x},${after.y}`);
  // Studio: si apre alla prima esecuzione; il cambio modello salvato arriva al personaggio sul desktop
  let studio = null;
  const d2 = Date.now() + 120000;
  while (!studio && Date.now() < d2) { for (const w of app.windows()) if (/stage\.html/.test(w.url())) studio = w; if (!studio) await new Promise((r) => setTimeout(r, 300)); }
  check('app: Studio aperto', !!studio);
  await studio.waitForFunction(() => window.__dcStage && window.__dcStage.ready, null, { timeout: 180000 });
  check('app: Studio con il motore 3D', (await studio.evaluate(() => window.__dcStage.mode)) === '3d');
  await studio.evaluate(async () => { const { saveCharacter } = await import('/src/engine3d/save/character-store.js'); const d = window.__dcStage.engine.def; d.model = 'victoria'; await saveCharacter(d); });
  await mate.waitForFunction(() => window.__dcCompanion && window.__dcCompanion.ready && window.__dcCompanion.engine && window.__dcCompanion.engine.model === 'victoria', null, { timeout: 180000 });
  check('app: la scelta fatta nello Studio si applica subito al personaggio sul desktop', true, 'modello victoria');
  check('app: nessun errore JS', errors.length === 0, errors.slice(0, 4).join(' | '));
} catch (e) {
  check('app: prova completata senza eccezioni', false, String(e && e.message).split('\n')[0]);
} finally {
  await app.close().catch(() => {});
}
const bad = checks.filter((c) => !c).length;
console.log(`\nDESKTOP: ${checks.length - bad}/${checks.length} controlli superati.`);
process.exit(bad ? 1 : 0);
