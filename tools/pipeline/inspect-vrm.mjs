// Stampa metadati di licenza e struttura (mesh, materiali, morph target, spring bone) di file VRM/GLB.
// Uso: node tools/pipeline/inspect-vrm.mjs file1.vrm [file2.vrm ...]
import fs from 'fs';

for (const f of process.argv.slice(2)) {
  const b = fs.readFileSync(f);
  const jl = b.readUInt32LE(12);
  const j = JSON.parse(b.slice(20, 20 + jl).toString('utf8'));
  const ext = j.extensions || {};
  const v0 = ext.VRM, v1 = ext.VRMC_vrm;
  console.log('\n=====', f, (b.length / 1e6).toFixed(1) + 'MB', 'ext:', Object.keys(ext).join(','));
  if (v0 || v1) console.log('META', JSON.stringify(v0 ? v0.meta : v1.meta));
  const acc = j.accessors;
  for (const m of j.meshes || []) {
    const prims = m.primitives.map((p) => `${j.materials[p.material]?.name}:v${acc[p.attributes.POSITION].count}/t${acc[p.indices].count / 3}${p.targets ? '/m' + p.targets.length : ''}`);
    console.log(' MESH', m.name, prims.join(' | '));
    if (m.primitives[0].targets) console.log('   targets:', (m.extras?.targetNames || m.primitives[0].extras?.targetNames || []).join(','));
  }
  console.log(' nodes', j.nodes.length, 'skins', (j.skins || []).length, 'textures', (j.textures || []).length, 'anims', (j.animations || []).map((a) => a.name).join(','));
  console.log(' images', (j.images || []).map((i) => i.name).join(','));
  if (v0) console.log(' springs', v0.secondaryAnimation.boneGroups.length, 'colliderGroups', v0.secondaryAnimation.colliderGroups.length, 'blendshapes', v0.blendShapeMaster.blendShapeGroups.map((g) => g.name).join(','));
  if (v1) {
    const sb = ext.VRMC_springBone;
    console.log(' springs', sb?.springs?.length, 'colliders', sb?.colliders?.length, 'expr', Object.keys(v1.expressions.preset).join(','), Object.keys(v1.expressions.custom || {}).join(','));
  }
}
