// Clip di animazione native: dati validi, continui e deterministici (il comportamento nel renderer è verificato dalla QA).
import test from 'node:test';
import assert from 'node:assert/strict';
import { exists } from './helpers.mjs';
import { CLIPS, CLIP_BY_ID, ANIMATED_BONES, bakeClip, eulerToQuat, eulerOrder, poseToQuats, slerp } from '../../extension/src/engine3d/anim/clips.js';

const HAS_THREE = exists('node_modules/three/package.json');
const angleBetween = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180 / Math.PI;
const quatAt = (arr, i) => [arr[i * 4], arr[i * 4 + 1], arr[i * 4 + 2], arr[i * 4 + 3]];

test('eulerToQuat coincide con three.js per gli ordini usati dalle clip', { skip: !HAS_THREE && 'node_modules assente' }, async () => {
  const THREE = await import('three');
  for (const order of ['ZYX', 'ZXY', 'YXZ', 'XYZ']) {
    for (const [x, y, z] of [[10, 20, 30], [-88, 6, -24], [0, 98, 0], [35, -70, 12], [0, 0, 0]]) {
      const q = eulerToQuat(x, y, z, order);
      const t = new THREE.Quaternion().setFromEuler(new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, z * Math.PI / 180, order));
      assert.ok(angleBetween(q, [t.x, t.y, t.z, t.w]) < 1e-4, `${order} [${x},${y},${z}]`);
    }
  }
});

test('ossa animate: nomi umanoidi VRM validi e senza duplicati', { skip: !HAS_THREE && 'node_modules assente' }, async () => {
  const { VRMHumanBoneList } = await import('@pixiv/three-vrm');
  const valid = new Set(VRMHumanBoneList);
  assert.equal(new Set(ANIMATED_BONES).size, ANIMATED_BONES.length);
  for (const b of ANIMATED_BONES) assert.ok(valid.has(b), 'osso non VRM: ' + b);
  assert.equal(eulerOrder('leftUpperArm'), 'ZYX');
  assert.equal(eulerOrder('rightUpperLeg'), 'ZXY');
  assert.equal(eulerOrder('head'), 'YXZ');
});

test('catalogo delle clip: idle ciclica come stato di fondo, saluto come gesto', () => {
  assert.equal(new Set(CLIPS.map((c) => c.id)).size, CLIPS.length);
  assert.equal(CLIP_BY_ID.idle.loop, true);
  assert.equal(CLIP_BY_ID.wave.loop, false);
  for (const c of CLIPS) assert.ok(c.name && c.category && c.duration > 0 && c.fps >= 10, c.id);
});

for (const clip of CLIPS) {
  test(`clip "${clip.id}": tracce complete, quaternioni unitari, movimento fluido e deterministico`, () => {
    const b = bakeClip(clip);
    const n = b.times.length;
    assert.equal(n, Math.round(clip.duration * clip.fps) + 1);
    assert.equal(b.times[0], 0);
    assert.ok(Math.abs(b.times[n - 1] - clip.duration) < 1e-5);
    for (let i = 1; i < n; i++) assert.ok(b.times[i] > b.times[i - 1]);
    assert.deepEqual(Object.keys(b.rotations).sort(), ANIMATED_BONES.slice().sort());
    assert.equal(b.hips.length, n * 3);
    let moving = 0;
    for (const [bone, arr] of Object.entries(b.rotations)) {
      assert.equal(arr.length, n * 4);
      let maxStep = 0, range = 0;
      for (let i = 0; i < n; i++) {
        const q = quatAt(arr, i);
        assert.ok(q.every(Number.isFinite), `${bone}[${i}] non finito`);
        assert.ok(Math.abs(Math.hypot(...q) - 1) < 1e-4, `${bone}[${i}] non unitario`);
        if (i > 0) {
          const p = quatAt(arr, i - 1);
          assert.ok(p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3] > 0, `${bone}[${i}] cambio di segno`);
          maxStep = Math.max(maxStep, angleBetween(p, q));
        }
        range = Math.max(range, angleBetween(quatAt(arr, 0), q));
      }
      // nessuno scatto: velocità angolare sotto 400°/s (un gesto rapido del braccio ne usa circa 300)
      assert.ok(maxStep * clip.fps < 400, `${bone}: scatto di ${(maxStep * clip.fps).toFixed(0)}°/s`);
      if (range > 0.3) moving++;
    }
    assert.ok(moving >= 8, `solo ${moving} ossa si muovono: la clip non è un'animazione`);
    for (const v of b.hips) assert.ok(Number.isFinite(v) && Math.abs(v) < 0.05, 'spostamento del bacino fuori scala');
    // le tracce sono Float32: il confronto di chiusura è per componenti (a meno del segno)
    if (clip.loop) for (const [bone, arr] of Object.entries(b.rotations)) {
      const a = quatAt(arr, 0), z = quatAt(arr, n - 1), s = a[0] * z[0] + a[1] * z[1] + a[2] * z[2] + a[3] * z[3] < 0 ? -1 : 1;
      assert.ok(a.every((v, k) => Math.abs(v - s * z[k]) < 1e-6), bone + ': la clip ciclica non si richiude');
    }
    const again = bakeClip(clip);
    assert.deepEqual(Array.from(again.rotations.head), Array.from(b.rotations.head), 'campionamento non deterministico');
  });
}

test('idle: respirazione e spostamento del peso periodici, braccia abbassate rispetto alla T-pose', () => {
  const c = CLIP_BY_ID.idle;
  const q0 = poseToQuats(c.pose(0)), qA = poseToQuats(c.pose(c.duration / 4)), qB = poseToQuats(c.pose(3 * c.duration / 4));
  assert.ok(angleBetween(q0.leftUpperArm, [0, 0, 0, 1]) > 60, 'braccio sinistro non abbassato');
  assert.ok(angleBetween(q0.rightUpperArm, [0, 0, 0, 1]) > 60, 'braccio destro non abbassato');
  // a un quarto e a tre quarti del ciclo il peso è sulle due gambe opposte
  assert.ok(angleBetween(qA.hips, qB.hips) > 1.5, 'il bacino non si muove');
  assert.ok(Math.abs(c.pose(c.duration / 4).hipsOffset[0] + c.pose(3 * c.duration / 4).hipsOffset[0]) < 1e-9, 'spostamento del peso non simmetrico');
  assert.ok(angleBetween(poseToQuats(c.pose(0.5)).chest, poseToQuats(c.pose(2.5)).chest) > 0.5, 'il torace non respira');
  const a = c.pose(1.37), b = c.pose(1.37 + c.duration);
  for (const bone of ['head', 'chest', 'hips', 'leftUpperLeg']) assert.ok(angleBetween(poseToQuats(a)[bone], poseToQuats(b)[bone]) < 1e-4, bone + ' non periodico');
});

test('saluto: il braccio destro si alza a metà gesto e la clip termina sulla posa di fondo', () => {
  const w = CLIP_BY_ID.wave, idle = CLIP_BY_ID.idle;
  const mid = poseToQuats(w.pose(1.2)), base = poseToQuats(idle.pose(1.2));
  assert.ok(angleBetween(mid.rightUpperArm, base.rightUpperArm) > 60, 'braccio destro non sollevato');
  assert.ok(angleBetween(mid.leftUpperArm, base.leftUpperArm) < 1, 'il braccio sinistro non deve muoversi');
  const end = poseToQuats(w.pose(w.duration)), baseEnd = poseToQuats(idle.pose(w.duration));
  for (const bone of ANIMATED_BONES) assert.ok(angleBetween(end[bone], baseEnd[bone]) < 0.01, bone + ' non torna alla posa di fondo');
  const e = w.expressions(1.2);
  assert.ok(e.relaxed > 0.7 && e.relaxed <= 1, 'sorriso assente a metà gesto');
  assert.ok(w.expressions(0).relaxed < 0.01 && w.expressions(w.duration).relaxed < 0.01, 'il sorriso deve nascere e spegnersi con il gesto');
});

test('slerp: estremi e punto medio', () => {
  const a = eulerToQuat(0, 0, 0), b = eulerToQuat(0, 90, 0);
  assert.ok(angleBetween(slerp(a, b, 0), a) < 1e-6);
  assert.ok(angleBetween(slerp(a, b, 1), b) < 1e-6);
  assert.ok(Math.abs(angleBetween(slerp(a, b, 0.5), a) - 45) < 1e-4);
});
