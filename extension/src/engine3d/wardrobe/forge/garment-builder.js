// Garment Builder: interpreta la ricetta di un capo del catalogo e produce una SkinnedMesh pronta da indossare
// (stesso scheletro e stessa bind matrix del corpo → segue animazioni, proporzioni e morph del personaggio).
import { THREE } from '../../lib.js';
import { buildShell, buildSkirt, buildTrim, assignUV, resampleLoop, mergeMeshes } from './garment-forge.js';
import { toGeometry, orientOutward } from './meshdata.js';
import { buildShoe } from './shoes.js';
import { buildSleeves } from './sleeves.js';

const clone = (o) => JSON.parse(JSON.stringify(o));

function setPath(obj, path, value) {
  const ks = path.split('.');
  let o = obj;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] === undefined) return; o = o[ks[i]]; }
  o[ks[ks.length - 1]] = value;
}

/** Applica i parametri regolabili (lunghezze, svasature…) alla ricetta. */
export function resolveRecipe(item, config = {}) {
  const recipe = clone(item.recipe || { parts: [] });
  for (const p of item.params || []) {
    let v = config.params && typeof config.params[p.key] === 'number' ? config.params[p.key] : p.default;
    v = Math.max(p.min, Math.min(p.max, v));
    for (const path of [].concat(p.path)) setPath(recipe, path, p.map === 'neg' ? -v : v);
  }
  return recipe;
}

/** Colori effettivi: default del capo + scelte dell'utente. */
export function resolveColors(item, config = {}) {
  const c = {};
  for (const s of item.colors || []) c[s.key] = (config.colors && config.colors[s.key]) || s.default;
  return c;
}

const colorOf = (colors, ref, fallback) => (!ref ? fallback : ref[0] === '#' ? ref : colors[ref] || fallback);

/**
 * @param {BodyModel} model
 * @param {object} item voce di catalogo (con recipe)
 * @param {object} config {colors, pattern, finish, params}
 * @param {MaterialSystem} materials
 * @returns {{mesh:THREE.SkinnedMesh|null, hide:Float32Array|null, materials:Array, stats:object}}
 */
export function buildGarment(model, item, config, materials, opts = {}) {
  const recipe = resolveRecipe(item, config), colors = resolveColors(item, config);
  const byMat = new Map(); // nome materiale → [MeshData]
  const push = (mat, mesh) => { if (!mesh || !mesh.idx.length) return; orientOutward(mesh); if (!byMat.has(mat)) byMat.set(mat, []); byMat.get(mat).push(mesh); };
  let hide = null, foot = null;
  const tight = opts.compress || 0; // sotto un capospalla: i capi interni perdono volume
  for (const P0 of recipe.parts) {
    const P = { ...P0 };
    let built = null;
    if (P.type === 'shell') {
      if (tight) { P.fit = (P.fit || 0) * (1 - tight); P.ease = (P.ease || 0) * (1 - tight); if (P.sleeveFit) P.sleeveFit = { ...P.sleeveFit, r1: Math.min(P.sleeveFit.r1, 0.05), r0: P.sleeveFit.r0 !== undefined ? Math.min(P.sleeveFit.r0, 0.05) : undefined, sag: 0 }; P.puff = null; }
      if (opts.offsetAdd) P.offset = (P.offset !== undefined ? P.offset : 0.004) + opts.offsetAdd;
      built = buildShell(model, P);
      if (built && P.hide !== false && !P.sheer) {
        if (!hide) hide = new Float32Array(built.hide); else for (let i = 0; i < hide.length; i++) hide[i] = Math.max(hide[i], built.hide[i]);
      }
      if (built) { const r = assignUV(model, built.mesh, P.uv || 'body'); const back = new Map(); r.src.forEach((s, i) => { if (!back.has(s)) back.set(s, i); }); built.loops = built.loops.map((l) => ({ ...l, v: l.v.map((v) => back.get(v)) })); built.mesh = r.mesh; }
    } else if (P.type === 'skirt') {
      built = buildSkirt(model, P);
    } else if (P.type === 'shoe') {
      const parts = buildShoe(model, P);
      for (const part of parts.parts) push(part.mat, part.mesh);
      foot = { lift: parts.lift || 0, pitch: parts.pitch || 0 };
      if (parts.hide) { if (!hide) hide = new Float32Array(parts.hide); else for (let i = 0; i < hide.length; i++) hide[i] = Math.max(hide[i], parts.hide[i]); }
      continue;
    } else if (P.type === 'sleeves') {
      for (const part of buildSleeves(model, P)) push(part.mat || P.mat || 'main', part.mesh);
      continue;
    } else continue; // 'prop' gestiti dal WardrobeManager (oggetti rigidi)
    if (!built) continue;
    push(P.mat || 'main', built.mesh);
    for (const T of P.trims || []) {
      for (let loop of built.loops) {
        if (loop.tag !== T.at) continue;
        let src = built.mesh;
        if (T.type === 'frill' || T.type === 'lace' || T.resample) { const r = resampleLoop(src, loop, T.step || 0.006); src = r.mesh; loop = r.loop; }
        push(T.mat || 'accent', buildTrim(src, loop, T));
      }
    }
  }
  if (!byMat.size) return { mesh: null, hide, foot, materials: [], stats: { tris: 0 } };
  // unione per materiale → gruppi di geometria (superficie + contorno)
  const names = Array.from(byMat.keys()), merged = [];
  for (const nm of names) merged.push(mergeMeshes(byMat.get(nm)).mesh);
  const all = mergeMeshes(merged);
  if (model.applyMorphs) model.applyMorphs(all.mesh);
  const geo = toGeometry(all.mesh, model.flip, model.morphNames || []);
  const mats = [], used = [];
  const defs = item.mats || {};
  names.forEach((nm, k) => {
    const d = defs[nm] || {};
    const isMain = nm === 'main';
    const pattern = d.pattern === '@' || (d.pattern === undefined && isMain) ? (config.pattern || item.pattern || 'solid') : d.pattern || 'solid';
    const finish = d.finish === '@' || (d.finish === undefined && isMain) ? (config.finish || item.finish || 'cotton') : d.finish || item.finish || 'cotton';
    const pair = materials.garment({
      name: item.id + ':' + nm, color: colorOf(colors, d.c || nm, colors.main || '#ffffff'), color2: colorOf(colors, d.c2 || 'accent', '#ffffff'), color3: colorOf(colors, d.c3 || 'detail', '#222222'),
      pattern, finish, opacity: d.opacity, outline: d.outline, emissive: d.emissive ? colorOf(colors, d.emissive, null) : undefined, doubleSide: d.doubleSide
    });
    const r = all.ranges[k];
    pair.forEach((m) => { geo.addGroup(r.start, r.count, mats.length); mats.push(m); used.push(m); });
  });
  const body = model.b;
  const mesh = new THREE.SkinnedMesh(geo, mats);
  mesh.name = 'Garment:' + item.id;
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  mesh.bind(body.skeleton, body.bindMatrix);
  if (geo.morphAttributes.position) mesh.updateMorphTargets();
  return { mesh, hide, foot, materials: used, stats: { tris: all.mesh.idx.length / 3, verts: all.mesh.n } };
}
