// Clip di animazione native (dati puri, nessuna dipendenza: testabili in node).
// Ogni clip è una funzione del tempo che restituisce una POSA dell'intero scheletro umanoide in SPAZIO CANONICO
// (personaggio rivolto a +Z, lato sinistro a +X, Y in alto, T-pose a riposo, nomi delle ossa VRM 1.0).
// `bakeClip` la campiona a passo fisso in tracce di quaternioni: è lo stesso formato in cui arriveranno le clip
// retargetizzate da file, quindi l'Animation Controller le tratta allo stesso modo (AnimationMixer + dissolvenze).
//
// Angoli in gradi, come terne [x, y, z] nell'ordine di Eulero della famiglia dell'osso:
//   braccia, mani, dita  'ZYX'  x = torsione lungo l'arto · y = avanti/indietro · z = alza/abbassa
//   gambe, piedi         'ZXY'  x = flessione (avanti −) · y = torsione · z = abduzione
//   busto, collo, testa  'YXZ'  x = inclina avanti (+) · y = gira (a sinistra +) · z = piega di lato
// Specchiare sinistra → destra significa [x, −y, −z].

const RAD = Math.PI / 180;
const TAU = Math.PI * 2;

const FINGERS = ['Index', 'Middle', 'Ring', 'Little'];
const SEGMENTS = ['Proximal', 'Intermediate', 'Distal'];

/** Tutte le ossa animate dalle clip native (le altre restano a riposo). */
export const ANIMATED_BONES = [
  'hips', 'spine', 'chest', 'upperChest', 'neck', 'head',
  ...['left', 'right'].flatMap((s) => [
    s + 'Shoulder', s + 'UpperArm', s + 'LowerArm', s + 'Hand', s + 'UpperLeg', s + 'LowerLeg', s + 'Foot',
    s + 'ThumbMetacarpal', s + 'ThumbProximal', s + 'ThumbDistal',
    ...FINGERS.flatMap((f) => SEGMENTS.map((g) => s + f + g))
  ])
];

export const eulerOrder = (bone) => (/Leg|Foot|Toes/.test(bone) ? 'ZXY' : /Shoulder|Arm|Hand|Thumb|Index|Middle|Ring|Little/.test(bone) ? 'ZYX' : 'YXZ');

// ---------- quaternioni [x, y, z, w] ----------
export function qmul(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
  ];
}
const AXIS = { X: 0, Y: 1, Z: 2 };
/** Eulero in gradi → quaternione; 'ZYX' = matrice Rz·Ry·Rx (stessa convenzione di three.js). */
export function eulerToQuat(x, y, z, order = 'XYZ') {
  const deg = [x, y, z];
  let q = [0, 0, 0, 1];
  for (const ch of order) {
    const h = deg[AXIS[ch]] * RAD * 0.5, r = [0, 0, 0, Math.cos(h)];
    r[AXIS[ch]] = Math.sin(h);
    q = qmul(q, r);
  }
  return q;
}
export function slerp(a, b, t) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const s = d < 0 ? -1 : 1;
  d = Math.abs(d);
  let ka = 1 - t, kb = t;
  if (d < 0.9995) { const th = Math.acos(d), sn = Math.sin(th); ka = Math.sin((1 - t) * th) / sn; kb = Math.sin(t * th) / sn; }
  const q = [a[0] * ka + b[0] * kb * s, a[1] * ka + b[1] * kb * s, a[2] * ka + b[2] * kb * s, a[3] * ka + b[3] * kb * s];
  const n = Math.hypot(q[0], q[1], q[2], q[3]);
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
}
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- pose ----------
/** Posa simmetrica: chiavi senza lato ("UpperArm") scritte per il lato sinistro e specchiate a destra. */
function sym(side) {
  const p = {};
  for (const [k, v] of Object.entries(side)) { p['left' + k] = v.slice(); p['right' + k] = [v[0], -v[1], -v[2]]; }
  return p;
}
function fingers(curl, spread = 0) {
  const p = {};
  FINGERS.forEach((f, i) => {
    p[f + 'Proximal'] = [0, spread * (1.5 - i), -curl];
    p[f + 'Intermediate'] = [0, 0, -curl * 1.15];
    p[f + 'Distal'] = [0, 0, -curl * 0.7];
  });
  p.ThumbMetacarpal = [0, 10 + curl * 0.3, 0]; p.ThumbProximal = [0, 6 + curl * 0.2, 0]; p.ThumbDistal = [0, 4, 0];
  return p;
}
const add = (pose, bone, x, y, z) => { const v = pose[bone] || (pose[bone] = [0, 0, 0]); v[0] += x; v[1] += y; v[2] += z; };

/** In piedi, rilassata: braccia lungo i fianchi, gomiti appena flessi, dita morbide, piedi leggermente divaricati. */
const STAND = {
  hips: [0, 0, 0], spine: [-1, 0, 0], chest: [1.5, 0, 0], upperChest: [0, 0, 0], neck: [2, 0, 0], head: [-1.5, 0, 0],
  ...sym({
    Shoulder: [0, 0, -3], UpperArm: [6, -5, -71], LowerArm: [0, -15, 0], Hand: [0, -4, -2],
    UpperLeg: [0, 5, 2.4], LowerLeg: [0.6, 0, 0], Foot: [0, 0, -2.4],
    ...fingers(15, 2)
  })
};

const LEG_LENGTH = 0.72; // metri (anca → caviglia), per tenere i piedi fermi quando il bacino si sposta

/** Respirazione, spostamento del peso e piccoli movimenti della testa: tutte le frequenze sono multiple di 1/periodo. */
function idlePose(t, period = 8) {
  const w = TAU / period;
  const breath = Math.sin(2 * w * t - 0.4);            // un respiro ogni metà periodo
  const sway = Math.sin(w * t);                        // peso da una gamba all'altra
  const p = {};
  for (const [k, v] of Object.entries(STAND)) p[k] = v.slice();
  // respirazione: il torace si apre, le spalle salgono, testa e braccia compensano
  add(p, 'spine', 0.35 * breath, 0, 0); add(p, 'chest', -1.0 * breath, 0, 0); add(p, 'upperChest', -0.8 * breath, 0, 0);
  add(p, 'neck', 0.6 * breath, 0, 0); add(p, 'head', 0.7 * breath, 0, 0);
  add(p, 'leftShoulder', 0, 0, 1.0 * breath); add(p, 'rightShoulder', 0, 0, -1.0 * breath);
  add(p, 'leftUpperArm', 0, 0, -0.7 * breath); add(p, 'rightUpperArm', 0, 0, 0.7 * breath);
  // spostamento del peso: il bacino trasla e ruota, le gambe compensano perché i piedi restino a terra
  const shift = 0.011 * sway, roll = 1.3 * sway, lean = (Math.asin(shift / LEG_LENGTH) / RAD);
  p.hipsOffset = [shift, -0.0025 * (0.5 - 0.5 * Math.cos(2 * w * t)), 0.002 * Math.sin(2 * w * t + 0.8)];
  add(p, 'hips', 0, 0.8 * sway, roll);
  add(p, 'spine', 0, -0.5 * sway, -0.75 * roll); add(p, 'chest', 0, -0.3 * sway, -0.45 * roll);
  for (const s of ['left', 'right']) { add(p, s + 'UpperLeg', 0, -0.8 * sway, -lean - roll); add(p, s + 'Foot', 0, 0, lean); }
  // testa e collo: sguardo che vaga lentamente
  const turn = 4.2 * Math.sin(w * t + 1.3) + 1.3 * Math.sin(2 * w * t + 0.2), nod = 1.4 * Math.sin(2 * w * t + 2.0), tilt = 1.2 * Math.sin(w * t + 2.6);
  add(p, 'neck', 0.35 * nod, 0.35 * turn, 0.3 * tilt + 0.2 * roll); add(p, 'head', 0.65 * nod, 0.65 * turn, 0.7 * tilt + 0.25 * roll);
  // braccia: oscillazione minima e asimmetrica
  add(p, 'leftUpperArm', 0, 1.2 * Math.sin(w * t + 0.6), 0); add(p, 'rightUpperArm', 0, 1.0 * Math.sin(w * t + 2.2), 0);
  add(p, 'leftLowerArm', 0, -1.5 * Math.sin(2 * w * t + 1.0), 0); add(p, 'rightLowerArm', 0, 1.3 * Math.sin(2 * w * t + 2.9), 0);
  return p;
}

const WAVE_LENGTH = 3.0;
/** Saluto: il braccio destro si alza con il palmo in avanti e l'avambraccio oscilla; il corpo continua a respirare. */
function wavePose(t) {
  const p = idlePose(t);
  const e = smooth(0, 0.5, t) * (1 - smooth(WAVE_LENGTH - 0.6, WAVE_LENGTH, t));
  const swing = Math.sin(TAU * 2.1 * Math.max(0, t - 0.4)) * smooth(0.35, 0.7, t) * (1 - smooth(WAVE_LENGTH - 0.75, WAVE_LENGTH - 0.35, t));
  const target = {
    rightShoulder: [0, 0, -9], rightUpperArm: [-88, 6, -24], rightLowerArm: [0, 68 + 20 * swing, 0], rightHand: [0, 0, -9 * swing],
    ...Object.fromEntries(Object.entries(fingers(2, 5)).map(([k, v]) => ['right' + k, [v[0], -v[1], -v[2]]]))
  };
  p._blend = { weight: e, pose: target };
  add(p, 'head', -1.5 * e, -5 * e, -4 * e); add(p, 'neck', 0, -2 * e, -1.5 * e);
  add(p, 'chest', 0, -2 * e, 1.5 * e); add(p, 'spine', 0, -1 * e, 1.0 * e);
  return p;
}

export const CLIPS = [
  { id: 'idle', name: 'In attesa', category: 'base', loop: true, duration: 8, fps: 15, pose: (t) => idlePose(t) },
  { id: 'wave', name: 'Saluto', category: 'gesto', loop: false, duration: WAVE_LENGTH, fps: 30, pose: wavePose,
    // sorriso morbido per tutta la durata del gesto
    expressions: (t) => { const e = smooth(0.1, 0.5, t) * (1 - smooth(WAVE_LENGTH - 0.6, WAVE_LENGTH - 0.1, t)); return { relaxed: 0.85 * e, aa: 0.18 * e }; } }
];
export const CLIP_BY_ID = Object.fromEntries(CLIPS.map((c) => [c.id, c]));

/** Posa (gradi) → quaternioni per osso, applicando l'eventuale miscela verso una posa bersaglio. */
export function poseToQuats(pose) {
  const out = {};
  for (const bone of ANIMATED_BONES) {
    const v = pose[bone] || [0, 0, 0];
    out[bone] = eulerToQuat(v[0], v[1], v[2], eulerOrder(bone));
  }
  const b = pose._blend;
  if (b && b.weight > 0) for (const [bone, v] of Object.entries(b.pose)) out[bone] = slerp(out[bone], eulerToQuat(v[0], v[1], v[2], eulerOrder(bone)), b.weight);
  return out;
}

/**
 * Campiona una clip a passo fisso.
 * @returns {{id, duration, loop, times:Float32Array, rotations:Object<string,Float32Array>, hips:Float32Array}}
 *   rotations[bone] = quaternioni xyzw consecutivi; hips = spostamenti xyz (metri) rispetto alla posizione di riposo.
 */
export function bakeClip(clip) {
  const n = Math.round(clip.duration * clip.fps) + 1;
  const times = new Float32Array(n), hips = new Float32Array(n * 3), rotations = {};
  for (const bone of ANIMATED_BONES) rotations[bone] = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * clip.duration;
    times[i] = t;
    // l'ultimo fotogramma di una clip ciclica coincide con il primo: nessuno scatto alla ripetizione
    const pose = clip.pose(clip.loop && i === n - 1 ? 0 : t);
    const q = poseToQuats(pose);
    for (const bone of ANIMATED_BONES) {
      const a = rotations[bone], v = q[bone];
      // continuità di segno tra fotogrammi consecutivi (q e −q sono la stessa rotazione)
      if (i > 0 && a[(i - 1) * 4] * v[0] + a[(i - 1) * 4 + 1] * v[1] + a[(i - 1) * 4 + 2] * v[2] + a[(i - 1) * 4 + 3] * v[3] < 0) { v[0] = -v[0]; v[1] = -v[1]; v[2] = -v[2]; v[3] = -v[3]; }
      a.set(v, i * 4);
    }
    hips.set(pose.hipsOffset || [0, 0, 0], i * 3);
  }
  return { id: clip.id, duration: clip.duration, loop: clip.loop, times, rotations, hips };
}
