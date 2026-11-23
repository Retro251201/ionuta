// Sviluppo: rende ogni modello candidato (intero, solo corpo, primo piano) per valutarne qualità e completezza.
// Uso: node tools/dev/survey-models.mjs Vita Vivi ...   (file in .cache/models/<nome>.vrm) → /tmp/shots/
import { shoot } from './shot.mjs';

const M = process.argv.slice(2);
const jobs = [];
for (const m of M) {
  jobs.push({ path: `tools/dev/view.html?model=/.cache/models/${m}.vrm&views=front,q3,back`, out: `/tmp/shots/${m}_full.png`, size: '1200x800' });
  jobs.push({ path: `tools/dev/view.html?model=/.cache/models/${m}.vrm&hide=CLOTH%7CHAIR&views=front,side,back`, out: `/tmp/shots/${m}_body.png`, size: '1200x800' });
  jobs.push({ path: `tools/dev/view.html?model=/.cache/models/${m}.vrm&views=front,q3&frame=head`, out: `/tmp/shots/${m}_head.png`, size: '1000x600' });
}
const r = await shoot(jobs);
for (const x of r) console.log(x.ready ? 'ok' : 'FAIL', x.job, x.errs.filter((e) => !/404|Failed to load/.test(e)).join(' | '));
