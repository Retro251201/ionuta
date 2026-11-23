// Testa fotografica 3D: geometria del guscio (dati puri) e vincolo d'identità (la texture è il file originale).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { headDepth, FACE_WIDTH } from '../../extension/src/engine3d/custom/photo-head.js';

test('guscio: volume chiuso, fronte davanti al retro, naso in rilievo, bordi che si richiudono', () => {
  const fw = FACE_WIDTH;
  for (let y = -0.02; y < 0.3; y += 0.01) for (let x = -0.15; x <= 0.15; x += 0.01) {
    const d = headDepth(x, y);
    assert.ok(Number.isFinite(d.front) && Number.isFinite(d.back));
    assert.ok(d.front >= d.back, `fronte dietro al retro in ${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const center = headDepth(0, fw * 0.72), nose = headDepth(0, fw * 0.52), cheek = headDepth(fw * 0.3, fw * 0.52);
  assert.ok(center.inside && center.front > fw * 0.3 && center.back < -fw * 0.4, 'cranio con profondità reale');
  assert.ok(nose.front > cheek.front, 'il naso sporge rispetto alla guancia');
  const far = headDepth(fw * 2, fw * 2);
  assert.ok(Math.abs(far.front) < 1e-3 && Math.abs(far.back) < 1e-3, 'lontano dal viso il guscio si riduce a una lamina');
});

test('identità: il motore 3D usa le teste originali, senza copie derivate nel pacchetto', () => {
  const src = fs.readFileSync(new URL('../../extension/src/engine3d/custom/photo-head.js', import.meta.url), 'utf8');
  assert.ok(!/getImageData|putImageData|toDataURL|toBlob/.test(src), 'la testa fotografica non deve rielaborare i pixel');
  const stage = fs.readFileSync(new URL('../../extension/src/stage/stage.js', import.meta.url), 'utf8');
  assert.match(stage, /DC\.headUrl\(e\)/, 'le teste incluse arrivano dal loro file in assets/heads');
  const assets = fs.readdirSync(new URL('../../extension/assets/', import.meta.url));
  assert.ok(!assets.includes('derived'), 'nessuna copia dei volti fuori da assets/heads');
});
