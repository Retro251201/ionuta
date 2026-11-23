// Sviluppo: stampa scheletro, mesh e primitive del modello base (per progettare loader e forge).
import { shoot } from './shot.mjs';

const model = process.argv[2] || 'HairSample_Female';
const r = await shoot([{
  path: `tools/dev/view.html?model=/.cache/models/${model}.vrm`,
  eval: `(() => {
    const vrm = window.__vrm, out = {};
    out.human = {};
    for (const [k, v] of Object.entries(vrm.humanoid.humanBones)) { const p = new THREE.Vector3(); v.node.getWorldPosition(p); out.human[k] = v.node.name + ' @' + p.toArray().map(n => n.toFixed(3)).join(','); }
    out.meshes = [];
    vrm.scene.traverse(o => { if (!o.isSkinnedMesh) return; const g = o.geometry; g.computeBoundingBox();
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      out.meshes.push({ name: o.name, parent: o.parent.name, verts: g.attributes.position.count, tris: g.index.count / 3, groups: g.groups.map(x => x.start/3 + '+' + x.count/3 + ':' + ms[x.materialIndex].name).join(' | '), bbox: [g.boundingBox.min.toArray().map(n => +n.toFixed(3)), g.boundingBox.max.toArray().map(n => +n.toFixed(3))], morphs: g.morphAttributes.position ? g.morphAttributes.position.length : 0, bones: o.skeleton.bones.length, attrs: Object.keys(g.attributes).join(',') }); });
    out.headChildren = vrm.humanoid.getRawBoneNode('head').children.map(c => c.name);
    out.springs = vrm.springBoneManager ? vrm.springBoneManager.joints.size : 0;
    out.colliders = vrm.springBoneManager ? vrm.springBoneManager.colliders.map(c => c.parent.name + ':' + c.shape.type + ':' + (c.shape.radius||0).toFixed(3)) : [];
    out.matTypes = {}; vrm.scene.traverse(o => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { out.matTypes[m.name] = m.type + (m.map ? ' map' + m.map.image.width : '') + (m.transparent ? ' transp' : '') + (m.alphaTest ? ' cutout' : ''); }); });
    out.expr = Object.keys(vrm.expressionManager.expressionMap);
    return out; })()`
}]);
const o = r[0].ev;
console.log(JSON.stringify(o, null, 1));
console.log(r[0].errs.join('\n'));
