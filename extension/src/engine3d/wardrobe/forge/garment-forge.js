// Garment Forge: costruisce i capi come vere mesh 3D skinnate sullo scheletro del personaggio, a partire da
// "ricette" dichiarative (dati puri del catalogo). Tre famiglie di costruzione:
//   shell  → regione del corpo ritagliata con bordi esatti, estrusa e "drappeggiata" (magliette, pantaloni, calze…)
//   skirt  → superficie loft attorno al corpo con profilo, svasatura, pieghe e balze (gonne, vestiti, cappotti)
//   trim   → bordi lungo gli orli (fasce, costine, volant, pelliccia)
// Scarpe e accessori rigidi sono in shoes.js / props.js. Tutto in spazio canonico (vedi body-model.js).
import { MeshData, clipByField, smoothNormals, laplacian, mergeMeshes, compact } from './meshdata.js';
import { PW } from './body-model.js';

const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const BIG = 9;

/** Risolve quote espresse come numero o come 'waist-0.03', 'knee+0.1', 'floor'. */
export function resolveY(model, e) {
  if (typeof e === 'number') return e;
  const m = /^([a-zA-Z]+)\s*([+-]\s*[\d.]+)?$/.exec(String(e).trim());
  if (!m) throw new Error('quota non valida: ' + e);
  const M = model.M;
  const base = { floor: 0, ankle: M.ankleY, knee: M.kneeY, crotch: M.crotchY, hip: M.hipY, waist: M.waistY, underbust: M.underbustY, bust: M.bustY, shoulder: M.shoulderY, neck: M.neckY, top: M.topY }[m[1]];
  if (base === undefined) throw new Error('punto di riferimento sconosciuto: ' + m[1]);
  return base + (m[2] ? parseFloat(m[2].replace(/\s/g, '')) : 0);
}

// ------------------------------------------------------------------ regione (campi scalari sul corpo)
/** Costruisce i campi della regione sul corpo: ogni componente è una distanza con segno (>0 = dentro) con un'etichetta di bordo. */
export function regionFields(model, R) {
  const n = model.n, pos = model.b.pos, pw = model.pw, M = model.M, comps = [];
  const add = (tag, fn) => { const f = new Float32Array(n); for (let i = 0; i < n; i++) f[i] = fn(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], i); comps.push({ tag, f }); };
  const isFront = (y, z) => z - model.axisZ(y);
  add('neck', (x, y, z, i) => (0.5 - pw[i * 8 + PW.head]) * 0.2);
  if (R.top !== undefined && R.strapless === undefined) { const yt = resolveY(model, R.top); add('top', (x, y) => yt - y); }
  if (R.bottom !== undefined) {
    const yb = resolveY(model, R.bottom), hl = R.hemSlant || 0, hc = R.hemCurve || 0; // orlo inclinato/curvo
    add('hem', (x, y, z) => y - (yb + hl * x + hc * Math.abs(x) + (R.hemBack ? (isFront(y, z) < 0 ? R.hemBack : 0) : 0)));
  }
  // maniche: frazione spalla→polso (0 = senza maniche)
  const sl = R.sleeve === undefined ? null : R.sleeve;
  if (sl !== null) {
    const t = sl === 'none' ? 0 : sl, xEnd = sl === 'none' ? M.shoulderX - (R.armhole || 0.012) : lerp(M.shoulderX, M.wristX, t);
    const slL = R.sleeveL !== undefined ? lerp(M.shoulderX, M.wristX, R.sleeveL) : xEnd, slR = R.sleeveR !== undefined ? lerp(M.shoulderX, M.wristX, R.sleeveR) : xEnd;
    add(sl === 'none' || t < 0.02 ? 'armhole' : 'cuff', (x, y) => {
      const lim = x > 0 ? slL : slR;
      // scalfo: leggermente più profondo sotto l'ascella
      const curve = sl === 'none' ? clamp((M.shoulderY - y) * 0.25, 0, 0.02) : 0;
      return lim - curve - Math.abs(x);
    });
  }
  if (R.armFrom !== undefined) { const xs = lerp(M.shoulderX, M.wristX, R.armFrom); add('cuff', (x, y, z, i) => (pw[i * 8 + PW.armL] + pw[i * 8 + PW.armR] > 0.3 ? Math.abs(x) - xs : -1)); }
  if (R.armTo !== undefined) { const xe = lerp(M.shoulderX, M.wristX, R.armTo); add('cuff2', (x) => xe - Math.abs(x)); }
  if (R.side) { const s = R.side === 'L' ? 1 : -1; add('side', (x) => s * x + 0.002); }
  if (R.legsOnly) add('top', (x, y, z, i) => (pw[i * 8 + PW.legL] + pw[i * 8 + PW.legR] - 0.5) * 0.1);
  if (R.noFeet) { const ya = resolveY(model, R.noFeet === true ? 'ankle+0.01' : R.noFeet); add('hem', (x, y, z, i) => (pw[i * 8 + PW.foot] > 0.5 || y < ya ? y - ya : BIG)); }
  if (R.stirrup) add('hem', (x, y, z) => (y < M.soleY + 0.07 && (z > 0.03 || z < -0.045) ? -1 : BIG)); // sottopiede: piede e tallone scoperti
  if (R.toeless) add('hem', (x, y, z) => (y < M.soleY + 0.09 ? 0.055 - z : BIG));
  // scollo
  if (R.strapless !== undefined) {
    const ys = resolveY(model, R.strapless), sweet = R.sweetheart || 0, st = R.straps, hal = R.halter;
    add('neck', (x, y, z, i) => {
      const front = isFront(y, z) > 0;
      let line = ys + (front ? sweet * (Math.cos(clamp(Math.abs(x) / 0.085, 0, 1) * Math.PI) * -0.5 + 0.5) - sweet * 0.5 : (R.backDrop || 0) * -1);
      let f = line - y;
      if (st) {
        const xs = hal ? lerp(st.x, M.neckR + 0.012, clamp((y - ys) / (M.neckY + 0.03 - ys))) : (front ? st.x : (st.xBack !== undefined ? st.xBack : st.x));
        const fs = st.w / 2 - Math.abs(Math.abs(x) - xs);
        const lim = hal && !front ? ys + 0.02 - y : BIG; // l'halter non scende sulla schiena
        f = Math.max(f, Math.min(fs, lim, (0.4 - (pw[i * 8 + PW.armL] + pw[i * 8 + PW.armR])) * 0.1));
      }
      return f;
    });
  } else if (R.neck) {
    const N = R.neck, hw = (N.width || 0.14) / 2, yTop = M.neckY + (N.rise !== undefined ? N.rise : 0.035), df = N.depth !== undefined ? N.depth : 0.05, db = N.back !== undefined ? N.back : 0.02;
    const shape = { v: (u) => u, crew: (u) => Math.sqrt(u), scoop: (u) => Math.sqrt(Math.sqrt(u)), square: (u) => (u > 0.12 ? 1 : u / 0.12), boat: (u) => Math.sqrt(u) }[N.shape || 'crew'];
    add('neck', (x, y, z) => {
      const ax = Math.abs(x);
      if (ax >= hw) return BIG;
      const u = 1 - ax / hw, k = sstep(-0.02, 0.02, isFront(y, z));
      return yTop - lerp(db, df, k) * shape(u) - y;
    });
  }
  if (R.offShoulder) { const yo = resolveY(model, R.offShoulder); add('neck', (x, y, z, i) => (pw[i * 8 + PW.armL] + pw[i * 8 + PW.armR] > 0.5 ? BIG : yo - y)); }
  if (R.openFront) {
    const O = R.openFront, g0 = (O.gap || 0.02) / 2, yl = O.lapelFrom !== undefined ? resolveY(model, O.lapelFrom) : 9, slope = O.lapel || 0;
    add('placket', (x, y, z) => (isFront(y, z) > 0 ? Math.abs(x) - (g0 + Math.max(0, y - yl) * slope) : BIG));
  }
  if (R.backless !== undefined) { const yb = resolveY(model, R.backless), bw = R.backWidth || 0.11; add('back', (x, y, z) => (isFront(y, z) < -0.01 && Math.abs(x) < bw ? yb - y + sstep(bw * 0.6, bw, Math.abs(x)) * 0.3 : BIG)); }
  for (const c of R.cutouts || []) {
    const cy = resolveY(model, c.y), cx = c.x || 0, rx = c.rx, ry = c.ry, face = c.face || 'front', mir = c.mirror;
    add('cutout', (x, y, z) => {
      const fr = isFront(y, z);
      if ((face === 'front' && fr < 0) || (face === 'back' && fr > 0)) return BIG;
      const dx = ((mir ? Math.abs(x) : x) - cx) / rx, dy = (y - cy) / ry;
      return (Math.sqrt(dx * dx + dy * dy) - 1) * Math.min(rx, ry);
    });
  }
  if (R.legGap !== undefined) add('hem', (x, y, z, i) => (y < M.crotchY ? BIG : BIG)); // riservato
  // combinazione (intersezione)
  const F = new Float32Array(n).fill(BIG);
  for (const c of comps) for (let i = 0; i < n; i++) if (c.f[i] < F[i]) F[i] = c.f[i];
  return { F, comps };
}

// ------------------------------------------------------------------ shell
function chainLoops(border) {
  // segmenti orientati [a,b] → anelli/catene ordinati
  const next = new Map();
  for (const [a, b] of border) if (a !== b) next.set(a, b);
  const starts = new Set(next.keys());
  for (const b of next.values()) starts.delete(b);
  const loops = [], seen = new Set();
  const walk = (s) => {
    const loop = [s];
    seen.add(s);
    let c = next.get(s);
    while (c !== undefined && !seen.has(c)) { loop.push(c); seen.add(c); c = next.get(c); }
    return { v: loop, closed: c === s };
  };
  for (const s of starts) loops.push(walk(s));
  for (const s of next.keys()) if (!seen.has(s)) loops.push(walk(s));
  return loops.filter((l) => l.v.length >= 3);
}

/**
 * Parte "shell": regione del corpo ritagliata, estrusa lungo le normali e drappeggiata.
 * @returns {{mesh:MeshData, loops:Array<{tag,v:number[],closed}>, hide:Float32Array}} hide = campo per nascondere il corpo sotto
 */
export function buildShell(model, P) {
  const M = model.M, base = model.baseMesh();
  const tuckY = P.tuckAt !== undefined && P.tuckAt !== null ? resolveY(model, P.tuckAt) : null; // rimboccato nella vita del capo sotto
  const region = tuckY !== null ? { ...(P.region || {}), bottom: tuckY - 0.035, hemSlant: 0, hemCurve: 0, hemBack: 0 } : P.region || {};
  const { F, comps } = regionFields(model, region);
  comps.forEach((c, k) => { base.attrs['f' + k] = { a: c.f, k: 1 }; });
  const { mesh, border } = clipByField(base, F);
  if (!mesh.idx.length) return null;
  const n = mesh.n, pos = mesh.pos, nrm = mesh.attr('nrm'), pw = mesh.attr('pw');
  const off = P.offset !== undefined ? P.offset : 0.004, fit = P.fit || 0, ease = P.ease || 0;
  const yHang = resolveY(model, P.hangFrom || 'bust+0.02');
  const SF = P.sleeveFit, LF = P.legFit, flare = tuckY !== null ? 0 : P.flare || 0, yHem = region.bottom !== undefined ? resolveY(model, region.bottom) : 0;
  const puff = P.puff; // {at: t, r: metri, w: ampiezza} maniche a sbuffo
  for (let i = 0; i < n; i++) {
    const tk = tuckY !== null ? sstep(tuckY - 0.005, tuckY + 0.08, pos[i * 3 + 1]) : 1;
    const o = tuckY !== null ? Math.min(off, 0.0035) + (off - Math.min(off, 0.0035)) * tk : off;
    let x = pos[i * 3] + nrm[i * 3] * o, y = pos[i * 3 + 1] + nrm[i * 3 + 1] * o, z = pos[i * 3 + 2] + nrm[i * 3 + 2] * o;
    const aL = pw[i * 8 + PW.armL], aR = pw[i * 8 + PW.armR], arm = aL + aR, leg = pw[i * 8 + PW.legL] + pw[i * 8 + PW.legR];
    // --- busto: caduta morbida dal punto più sporgente sopra ---
    if ((fit > 0 || ease > 0 || flare) && arm < 0.9 && y > M.crotchY - 0.02) {
      const cz = model.axisZ(y), dx = x, dz = z - cz, r = Math.hypot(dx, dz), th = Math.atan2(dx, dz);
      const fe = fit * tk * sstep(yHang + 0.07, yHang, y) * (1 - arm) * (1 - arm);
      let rt = Math.max(r, lerp(r, model.hangR(th, y, yHang) + off, fe)) + ease * tk * (1 - arm) * sstep(M.shoulderY + 0.02, M.shoulderY - 0.1, y);
      if (flare) rt += flare * sstep(yHem + 0.14, yHem, y) * (1 - arm);
      const k = rt / (r || 1);
      x = dx * k; z = cz + dz * k;
    }
    // --- maniche: raggio minimo lungo l'asse del braccio + cedimento per gravità ---
    if (arm > 0.05 && (SF || puff)) {
      const A = model.arm[aL > aR ? 'L' : 'R'], px = x - A.origin.x, py = y - A.origin.y, pz = z - A.origin.z;
      const t = (px * A.dir.x + py * A.dir.y + pz * A.dir.z) / A.len;
      const ax = A.dir.x * t * A.len, ay = A.dir.y * t * A.len, az = A.dir.z * t * A.len;
      const rx = px - ax, ry = py - ay, rz = pz - az, r = Math.hypot(rx, ry, rz) || 1e-5;
      let target = r;
      if (SF) { const te = SF.end || 1; target = Math.max(target, lerp(SF.r0 !== undefined ? SF.r0 : r, SF.r1, Math.pow(clamp(t / te), SF.curve || 1))); }
      if (puff) target = Math.max(target, r + puff.r * Math.exp(-Math.pow((t - puff.at) / (puff.w || 0.12), 2)));
      const bl = sstep(0.02, SF && SF.blend !== undefined ? SF.blend : 0.22, t) * clamp(arm * 1.4);
      const k = lerp(1, target / r, bl), sag = (SF && SF.sag ? SF.sag : 0) * (target - r) * bl;
      x = A.origin.x + ax + rx * k; y = A.origin.y + ay + ry * k - sag; z = A.origin.z + az + rz * k;
    }
    // --- gambe: pantaloni larghi ---
    if (LF && leg > 0.05 && y < M.crotchY + 0.05) {
      const side = pw[i * 8 + PW.legL] > pw[i * 8 + PW.legR] ? 'L' : 'R', G = model.leg[side], c = G.axis(y);
      const dx = x - c[0], dz = z - c[1], r = Math.hypot(dx, dz) || 1e-5;
      let target = r, prevY = null, prevR = null;
      for (const [ky, kr] of LF.profile) { const yy = resolveY(model, ky); if (prevY !== null && y <= prevY && y >= yy) { target = Math.max(r, lerp(prevR, kr, (prevY - y) / (prevY - yy || 1))); } prevY = yy; prevR = kr; }
      if (prevY !== null && y < prevY) target = Math.max(r, prevR);
      const bl = sstep(M.crotchY + 0.04, M.crotchY - 0.1, y) * clamp(leg * 1.3), k = lerp(1, target / r, bl);
      x = c[0] + dx * k; z = c[1] + dz * k;
      if (G.sgn * x < 0.003) x = G.sgn * 0.003; // non attraversare la mezzeria
    }
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
  }
  const smoothIt = P.smooth !== undefined ? P.smooth : fit > 0.3 ? 2 : 0;
  if (smoothIt) {
    const lock = new Float32Array(n), f = (k) => mesh.attr('f' + k);
    for (let i = 0; i < n; i++) { let m = BIG; for (let k = 0; k < comps.length; k++) m = Math.min(m, Math.abs(f(k)[i])); lock[i] = 1 - sstep(0, 0.03, m); }
    laplacian(mesh, smoothIt, 0.5, lock);
  }
  mesh.attrs.nrm.a = smoothNormals(pos, mesh.idx);
  // etichetta dei bordi: componente il cui campo è più vicino a zero
  const loops = chainLoops(border).map((l) => {
    const cnt = {};
    for (const v of l.v) { let best = BIG, tag = ''; comps.forEach((c, k) => { const a = Math.abs(mesh.attr('f' + k)[v]); if (a < best) { best = a; tag = c.tag; } }); cnt[tag] = (cnt[tag] || 0) + 1; }
    const tag = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
    return { tag, v: l.v, closed: l.closed };
  });
  return { mesh, loops, hide: F };
}

// ------------------------------------------------------------------ UV in metri (pattern continui attorno al corpo)
/** Assegna UV "fisiche" (1 unità = 1 metro): cilindriche attorno a busto, braccia e gambe; duplica i vertici sulle cuciture. */
export function assignUV(model, mesh, mode = 'body') {
  const pos = mesh.pos, pw = mesh.attr('pw'), I = mesh.idx, M = model.M;
  const corner = (v, type) => {
    const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
    if (type === 1 || type === 2) { // braccia: angolo attorno all'asse × raggio medio, lunghezza lungo l'asse
      const A = model.arm[type === 1 ? 'L' : 'R'], py = y - A.origin.y, pz = z - A.origin.z;
      return [Math.atan2(pz, py) * 0.05, Math.abs(x) - M.shoulderX];
    }
    if (type === 3 || type === 4) { const c = model.leg[type === 3 ? 'L' : 'R'].axis(y); return [Math.atan2(x - c[0], z - c[1]) * 0.075, y]; }
    return [Math.atan2(x, z - model.axisZ(y)) * 0.15, y];
  };
  const wrapLen = [TAU * 0.15, TAU * 0.05, TAU * 0.05, TAU * 0.075, TAU * 0.075];
  const out = { map: new Map(), src: [], uv: [] }, idx = new Uint32Array(I.length);
  for (let t = 0; t < I.length; t += 3) {
    let aL = 0, aR = 0, lL = 0, lR = 0, yAvg = 0;
    for (let k = 0; k < 3; k++) { const v = I[t + k]; aL += pw[v * 8 + PW.armL]; aR += pw[v * 8 + PW.armR]; lL += pw[v * 8 + PW.legL]; lR += pw[v * 8 + PW.legR]; yAvg += pos[v * 3 + 1] / 3; }
    let type = 0;
    if (mode === 'body') {
      if (aL > 1.5) type = 1; else if (aR > 1.5) type = 2;
      else if (yAvg < M.crotchY - 0.01 && lL + lR > 1.5) type = lL > lR ? 3 : 4;
    }
    const u0 = corner(I[t], type)[0];
    for (let k = 0; k < 3; k++) {
      const v = I[t + k], uv = corner(v, type);
      let shift = 0;
      if (uv[0] - u0 > wrapLen[type] / 2) shift = -1; else if (uv[0] - u0 < -wrapLen[type] / 2) shift = 1;
      const key = v * 20 + type * 3 + (shift + 1);
      let id = out.map.get(key);
      if (id === undefined) { id = out.src.length; out.map.set(key, id); out.src.push(v); out.uv.push(uv[0] + shift * wrapLen[type], uv[1]); }
      idx[t + k] = id;
    }
  }
  const n2 = out.src.length, attrs = {};
  for (const [nm, { a, k }] of Object.entries(mesh.attrs)) { const o = new Float32Array(n2 * k); for (let i = 0; i < n2; i++) for (let j = 0; j < k; j++) o[i * k + j] = a[out.src[i] * k + j]; attrs[nm] = { a: o, k }; }
  attrs.uv = { a: Float32Array.from(out.uv), k: 2 };
  const si = new Uint16Array(n2 * 4), sw = new Float32Array(n2 * 4);
  for (let i = 0; i < n2; i++) for (let j = 0; j < 4; j++) { si[i * 4 + j] = mesh.si[out.src[i] * 4 + j]; sw[i * 4 + j] = mesh.sw[out.src[i] * 4 + j]; }
  return { mesh: new MeshData(attrs, si, sw, idx), src: out.src };
}

// ------------------------------------------------------------------ gonna (loft)
/**
 * Parte "skirt": superficie loft attorno al corpo dalla vita verso il basso.
 * Parametri principali: top, length|bottom, gap, flare, curve, pleats{count,depth}, ruffle{count,amp}, bell,
 * from (inizio svasatura 0..1: sirena), tiers, hemDrop (orlo più lungo dietro), slit{angle,width,from}, open{angle,width}, legFollow.
 */
export function buildSkirt(model, P) {
  const M = model.M, bi = model.boneIndex;
  const yTop = resolveY(model, P.top || 'waist'), len0 = P.length !== undefined ? P.length : yTop - resolveY(model, P.bottom);
  const pleat = P.pleats, segs = pleat ? pleat.count * 2 : P.segs || 72;
  const rings = P.rings || Math.max(6, Math.round(len0 / 0.035));
  const gap = P.gap !== undefined ? P.gap : 0.008, flare = P.flare || 0, curve = P.curve || 1, from = P.from || 0, bell = P.bell || 0;
  const legFollow = P.legFollow !== undefined ? P.legFollow : 0.75;
  const holdY = P.holdUntil !== undefined && P.holdUntil !== null ? resolveY(model, P.holdUntil) : null;
  const cols = segs + 1, n = cols * (rings + 1);
  const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), pw = new Float32Array(n * 8), base = new Float32Array(n * 3);
  const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
  const open = P.open; // apertura completa (cappotti/kimono): {angle, width} in radianti
  const Rw = model.envR(Math.PI / 2, yTop) + gap; // raggio di riferimento per le UV
  for (let j = 0; j <= rings; j++) {
    const t = j / rings;
    for (let s = 0; s < cols; s++) {
      const th = (s / segs) * TAU + (P.phase || 0), dx = Math.sin(th), dz = Math.cos(th);
      const frontness = Math.cos(th); // 1 fronte, −1 retro
      const len = len0 + (P.hemDrop ? P.hemDrop * (0.5 - 0.5 * frontness) : 0) + (P.hemSide ? P.hemSide * Math.sin(th) : 0);
      const y = yTop - t * len;
      let r = model.hangR(th, Math.max(0.03, y), yTop) + gap;
      const hold = holdY !== null ? sstep(holdY + 0.01, holdY - 0.06, y) : 1; // sotto un top non rimboccato resta aderente
      const ft = from ? sstep(from, 1, t) : t;
      r += (flare * Math.pow(ft, curve) + bell * Math.sin(Math.PI * Math.min(1, t * 1.05))) * hold;
      if (P.tiers) { const k = Math.floor(t * P.tiers - 1e-6); r += k * (P.tierStep || 0.02) + (t * P.tiers - k) * (P.tierFlare || 0.03); }
      if (pleat) r += hold * (s % 2 ? 1 : -1) * pleat.depth * sstep(0, pleat.start !== undefined ? pleat.start : 0.25, t) * (0.4 + 0.6 * t);
      if (P.ruffle) r += P.ruffle.amp * Math.sin(th * P.ruffle.count) * sstep(P.ruffle.from !== undefined ? P.ruffle.from : 0.6, 1, t);
      const i = j * cols + s, cz = model.axisZ(Math.max(0.03, y));
      pos[i * 3] = dx * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = cz + dz * r;
      const rb = model.envR(th, Math.max(0.03, y));
      base[i * 3] = dx * rb; base[i * 3 + 1] = y; base[i * 3 + 2] = cz + dz * rb;
      uv[i * 2] = (s / segs) * TAU * Rw * (P.uvScale || 1); uv[i * 2 + 1] = y;
      // skinning: bacino in alto, le cosce trascinano la stoffa via via più in basso
      const li = legFollow * sstep(0.0, 0.85, clamp((yTop - y) / Math.max(0.2, yTop - M.kneeY))) * sstep(M.hipY + 0.06, M.crotchY - 0.02, y);
      const sL = sstep(-0.35, 0.35, dx), low = sstep(M.kneeY + 0.02, M.kneeY - 0.22, y) * 0.65;
      const wl = li * sL, wr = li * (1 - sL), domL = sL >= 0.5;
      si[i * 4] = bi.hips; sw[i * 4] = 1 - li;
      si[i * 4 + 1] = bi.leftUpperLeg; sw[i * 4 + 1] = wl * (domL ? 1 - low : 1);
      si[i * 4 + 2] = bi.rightUpperLeg; sw[i * 4 + 2] = wr * (domL ? 1 : 1 - low);
      si[i * 4 + 3] = domL ? bi.leftLowerLeg : bi.rightLowerLeg; sw[i * 4 + 3] = (domL ? wl : wr) * low;
      pw[i * 8 + PW.legL] = wl; pw[i * 8 + PW.legR] = wr;
    }
  }
  const idx = [];
  const inGap = (th, G) => { if (!G) return false; let d = Math.abs((((th - G.angle) % TAU) + TAU + Math.PI) % TAU - Math.PI); return d < G.width / 2; };
  for (let j = 0; j < rings; j++) {
    const t = (j + 0.5) / rings;
    for (let s = 0; s < segs; s++) {
      const th = ((s + 0.5) / segs) * TAU + (P.phase || 0);
      if (inGap(th, open)) continue;
      if (P.slit && t > (P.slit.from || 0) && inGap(th, { angle: P.slit.angle, width: P.slit.width * sstep(P.slit.from || 0, 1, t) })) continue;
      const a = j * cols + s, b = a + 1, c = a + cols, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const mesh = new MeshData({ pos: { a: pos, k: 3 }, nrm: { a: new Float32Array(n * 3), k: 3 }, uv: { a: uv, k: 2 }, pw: { a: pw, k: 8 }, base: { a: base, k: 3 } }, si, sw, Uint32Array.from(idx));
  mesh.attrs.nrm.a = smoothNormals(pos, mesh.idx);
  const ring = (j) => Array.from({ length: segs }, (_, s) => j * cols + s);
  return { mesh, loops: [{ tag: 'waist', v: ring(0).reverse(), closed: !open }, { tag: 'hem', v: ring(rings), closed: !open }], hide: null };
}

// ------------------------------------------------------------------ bordi (trim)
function loopFrames(mesh, loop) {
  // per ogni vertice dell'anello: posizione, normale del capo, tangente, direzione "fuori dal capo" lungo la superficie
  const pos = mesh.pos, nrm = mesh.attr('nrm'), v = loop.v, m = v.length, fr = [];
  for (let k = 0; k < m; k++) {
    const a = v[(k - 1 + m) % m], b = v[k], c = v[(k + 1) % m];
    const i0 = loop.closed || k > 0 ? a : b, i1 = loop.closed || k < m - 1 ? c : b;
    let tx = pos[i1 * 3] - pos[i0 * 3], ty = pos[i1 * 3 + 1] - pos[i0 * 3 + 1], tz = pos[i1 * 3 + 2] - pos[i0 * 3 + 2];
    const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
    const nx = nrm[b * 3], ny = nrm[b * 3 + 1], nz = nrm[b * 3 + 2];
    // d = n × t
    let dx = ny * tz - nz * ty, dy = nz * tx - nx * tz, dz = nx * ty - ny * tx;
    const dl = Math.hypot(dx, dy, dz) || 1;
    fr.push({ v: b, p: [pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]], n: [nx, ny, nz], d: [dx / dl, dy / dl, dz / dl] });
  }
  return fr;
}

function outwardSign(mesh, loop, fr) {
  // il verso "fuori dal capo" è opposto al baricentro dei triangoli adiacenti al bordo
  const set = new Set(loop.v), pos = mesh.pos, I = mesh.idx;
  let s = 0, cnt = 0;
  const at = new Map(fr.map((f) => [f.v, f]));
  for (let t = 0; t < I.length && cnt < 400; t += 3) {
    for (let k = 0; k < 3; k++) {
      const f = at.get(I[t + k]);
      if (!f) continue;
      const cx = (pos[I[t] * 3] + pos[I[t + 1] * 3] + pos[I[t + 2] * 3]) / 3 - f.p[0], cy = (pos[I[t] * 3 + 1] + pos[I[t + 1] * 3 + 1] + pos[I[t + 2] * 3 + 1]) / 3 - f.p[1], cz = (pos[I[t] * 3 + 2] + pos[I[t + 1] * 3 + 2] + pos[I[t + 2] * 3 + 2]) / 3 - f.p[2];
      s += cx * f.d[0] + cy * f.d[1] + cz * f.d[2]; cnt++;
    }
  }
  return s > 0 ? -1 : 1;
}

/**
 * Bordo lungo un anello: 'band' (fascia/costina), 'frill' (volant ondulato), 'fur' (bordo gonfio), 'lace' (pizzo a punte).
 * T: {type, width, thick, inset, waves, amp}
 */
export function buildTrim(mesh, loop, T) {
  const fr = loopFrames(mesh, loop), m = fr.length, sgn = outwardSign(mesh, loop, fr);
  const type = T.type || 'band', w = T.width || 0.012, h = T.thick !== undefined ? T.thick : 0.003, inset = T.inset !== undefined ? T.inset : w * 0.5;
  // profilo: lista di [s lungo d (fuori = +), quota lungo n]
  let prof;
  if (type === 'band' || type === 'rib') prof = [[-inset, 0.0005], [-inset, h], [w - inset, h], [w - inset, -h * 0.4]];
  else if (type === 'fur') { prof = []; for (let k = 0; k <= 8; k++) { const a = (k / 8) * Math.PI * 1.25 - Math.PI * 0.12; prof.push([-inset + (w / 2) * (1 - Math.cos(a)), Math.sin(a) * h * 2.2 + h * 0.3]); } }
  else prof = [[-inset * 0.6, h * 0.5], [0, h], [w * 0.5, h], [w, h * 0.6]];
  const waves = T.waves || 0, amp = T.amp || 0, np = prof.length, cols = loop.closed ? m + 1 : m, n = cols * np;
  const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), pw = new Float32Array(n * 8), base = new Float32Array(n * 3), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
  const spw = mesh.attr('pw'), sbase = mesh.attr('base');
  let arc = 0;
  for (let c = 0; c < cols; c++) {
    const f = fr[c % m], prev = fr[(c - 1 + m) % m];
    if (c > 0) arc += Math.hypot(f.p[0] - prev.p[0], f.p[1] - prev.p[1], f.p[2] - prev.p[2]);
    for (let k = 0; k < np; k++) {
      const i = c * np + k, u = k / (np - 1);
      let s = prof[k][0], e = prof[k][1];
      if (type === 'frill' || type === 'lace') {
        const ph = waves ? (c / m) * TAU * waves : arc / 0.012;
        if (type === 'frill') e += Math.sin(ph) * amp * u * u * 3;
        else s -= (1 - Math.abs(Math.sin(ph * 0.5))) * w * 0.45 * (k === np - 1 ? 1 : 0);
      }
      if (type === 'fur') { const j = Math.sin(c * 12.9898 + k * 78.233) * 43758.5453; e += ((j - Math.floor(j)) - 0.5) * h * 0.5; }
      pos[i * 3] = f.p[0] + f.d[0] * sgn * s + f.n[0] * e; pos[i * 3 + 1] = f.p[1] + f.d[1] * sgn * s + f.n[1] * e; pos[i * 3 + 2] = f.p[2] + f.d[2] * sgn * s + f.n[2] * e;
      uv[i * 2] = arc; uv[i * 2 + 1] = u * w;
      for (let q = 0; q < 4; q++) { si[i * 4 + q] = mesh.si[f.v * 4 + q]; sw[i * 4 + q] = mesh.sw[f.v * 4 + q]; }
      for (let q = 0; q < 8; q++) pw[i * 8 + q] = spw[f.v * 8 + q];
      for (let q = 0; q < 3; q++) base[i * 3 + q] = sbase[f.v * 3 + q];
    }
  }
  const idx = [];
  for (let c = 0; c < cols - 1; c++) for (let k = 0; k < np - 1; k++) {
    const a = c * np + k, b = a + 1, d = a + np, e2 = d + 1;
    if (sgn > 0) idx.push(a, d, b, b, d, e2); else idx.push(a, b, d, b, e2, d);
  }
  const out = new MeshData({ pos: { a: pos, k: 3 }, nrm: { a: new Float32Array(n * 3), k: 3 }, uv: { a: uv, k: 2 }, pw: { a: pw, k: 8 }, base: { a: base, k: 3 } }, si, sw, Uint32Array.from(idx));
  out.attrs.nrm.a = smoothNormals(pos, out.idx);
  return out;
}

/** Ricampiona un anello a passo costante (volant e pizzi regolari). Aggiunge i vertici interpolati alla mesh. */
export function resampleLoop(mesh, loop, step) {
  const pos = mesh.pos, v = loop.v, m = v.length;
  const pts = [];
  const lim = loop.closed ? m : m - 1;
  const names = Object.keys(mesh.attrs);
  const arrs = {};
  for (const nm of names) arrs[nm] = Array.from(mesh.attrs[nm].a);
  const si = Array.from(mesh.si), sw = Array.from(mesh.sw);
  let count = mesh.n;
  const out = [];
  for (let k = 0; k < lim; k++) {
    const a = v[k], b = v[(k + 1) % m];
    const d = Math.hypot(pos[b * 3] - pos[a * 3], pos[b * 3 + 1] - pos[a * 3 + 1], pos[b * 3 + 2] - pos[a * 3 + 2]);
    const parts = Math.max(1, Math.round(d / step));
    out.push(a);
    for (let q = 1; q < parts; q++) {
      const t = q / parts;
      for (const nm of names) { const kk = mesh.attrs[nm].k, A = mesh.attrs[nm].a; for (let c = 0; c < kk; c++) arrs[nm].push(A[a * kk + c] + (A[b * kk + c] - A[a * kk + c]) * t); }
      const src = t < 0.5 ? a : b;
      for (let c = 0; c < 4; c++) { si.push(mesh.si[src * 4 + c]); sw.push(mesh.sw[src * 4 + c]); }
      out.push(count++);
    }
  }
  if (!loop.closed) out.push(v[m - 1]);
  const attrs = {};
  for (const nm of names) attrs[nm] = { a: Float32Array.from(arrs[nm]), k: mesh.attrs[nm].k };
  return { mesh: new MeshData(attrs, Uint16Array.from(si), Float32Array.from(sw), mesh.idx), loop: { tag: loop.tag, v: out, closed: loop.closed } };
}

export { mergeMeshes, compact };
