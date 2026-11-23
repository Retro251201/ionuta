// Screenshot headless di una pagina del repo (WebGL via SwiftShader).
// Uso: node tools/dev/shot.mjs <percorso-relativo?query> <out.png> [--size 1280x800] [--wait 500] [--eval "js"] [--timeout 90000] [--ready "espressione js"] [--initfile script.js]
// La pagina deve impostare window.__ready = true quando ha finito (o soddisfare l'espressione --ready); errori JS e risorse mancanti vengono stampati.
import { chromium } from 'playwright-core';
import { serve } from './serve.mjs';
import fs from 'fs';
import path from 'path';

export const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';
export const GL_ARGS = ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--lang=it-IT'];

export async function shoot(jobs, opts = {}) {
  const s = await serve(0);
  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: GL_ARGS });
  const results = [];
  try {
    for (const job of jobs) {
      const [w, h] = (job.size || '1280x800').split('x').map(Number);
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: job.dpr || 1 });
      const errs = [];
      page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
      page.on('console', (m) => { const t = m.text(); if (m.type() === 'error') errs.push('console.error: ' + t); else if (job.log || opts.log) console.log('[page]', t); });
      page.on('requestfailed', (r) => errs.push('requestfailed: ' + r.url()));
      page.on('response', (r) => { if (r.status() >= 400) errs.push('http ' + r.status() + ': ' + r.url()); });
      // script eseguito prima della pagina, es. tools/qa/no-webgl.init.js per simulare l'assenza di WebGL
      if (job.initfile) await page.addInitScript({ path: path.resolve(job.initfile) });
      await page.goto(s.url + '/' + job.path.replace(/^\//, ''));
      let ready = true;
      try { await page.waitForFunction(job.ready || 'window.__ready === true', null, { timeout: job.timeout || 120000 }); } catch (e) { ready = false; errs.push('timeout waiting ' + (job.ready || '__ready')); }
      let ev;
      if (job.eval) { try { ev = await page.evaluate(job.eval); } catch (e) { errs.push('eval: ' + e.message); } }
      if (job.wait) await page.waitForTimeout(job.wait);
      if (job.out) { fs.mkdirSync(path.dirname(job.out), { recursive: true }); await page.screenshot({ path: job.out }); }
      results.push({ job: job.path, ready, errs, ev });
      await page.close();
    }
  } finally { await browser.close(); s.srv.close(); }
  return results;
}

if (process.argv[1] && process.argv[1].endsWith('shot.mjs')) {
  const a = process.argv.slice(2); const job = { path: a[0], out: a[1] };
  for (let i = 2; i < a.length; i += 2) job[a[i].replace(/^--/, '')] = /^\d+$/.test(a[i + 1]) ? Number(a[i + 1]) : a[i + 1];
  const r = await shoot([job]);
  for (const x of r) { console.log(x.ready ? 'READY' : 'NOT READY', x.job); if (x.ev !== undefined) console.log('eval →', typeof x.ev === 'string' ? x.ev : JSON.stringify(x.ev)); for (const e of x.errs) console.log('  !', e); }
}
