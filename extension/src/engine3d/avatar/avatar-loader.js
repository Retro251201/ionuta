// Avatar Loader: carica il modello base VRM (mesh, scheletro umanoide, skinning, materiali MToon) e ne espone
// le parti in modo strutturato agli altri moduli (corpo, parti del viso, ossa, dati di bind per la Garment Forge).
import { THREE, VRM } from '../lib.js';

export const BASE_AVATAR = 'avatar/base.vrm';

const FACE_PARTS = [
  ['mouth', /FaceMouth/], ['eyeWhite', /EyeWhite/], ['eyeline', /FaceEyeline/], ['eyelash', /FaceEyelash/],
  ['brow', /FaceBrow/], ['iris', /EyeIris/], ['highlight', /EyeHighlight/], ['skin', /Face_00_SKIN/], ['extra', /EyeExtra/]
];

export class Avatar {
  constructor(vrm) {
    this.vrm = vrm;
    this.root = vrm.scene;
    this.humanoid = vrm.humanoid;
    this.isVRM0 = vrm.meta && vrm.meta.metaVersion === '0';
    this.face = {};      // nome parte → SkinnedMesh
    this.faceMeshes = []; // tutte le mesh del viso (condividono vertici e morph target)
    this.bodyMesh = null;
    this.materials = { skin: [], outline: [] };
    this._analyze();
  }

  _analyze() {
    const vrm = this.vrm;
    vrm.scene.traverse((o) => {
      o.frustumCulled = false;
      if (!o.isSkinnedMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const name = mats[0].name || '';
      if (/Body_00_SKIN/.test(name)) this.bodyMesh = o;
      for (const [key, re] of FACE_PARTS) if (re.test(name)) { this.face[key] = o; this.faceMeshes.push(o); }
      for (const m of mats) { if (m.isOutline) this.materials.outline.push(m); if (/_SKIN/.test(m.name) && !m.isOutline) this.materials.skin.push(m); }
      o.castShadow = !/Eye|Brow|Mouth|Eyeline|Eyelash/.test(name);
      o.receiveShadow = false;
    });
    if (!this.bodyMesh) throw new Error('mesh del corpo non trovata nel modello base');
    if (this.face.extra) this.face.extra.visible = false; // occhi "speciali" dell'espressione Extra: attivati solo su richiesta
    this.bones = {};
    for (const name of Object.keys(this.humanoid.humanBones)) this.bones[name] = this.humanoid.getRawBoneNode(name);
    this.root.updateMatrixWorld(true);
    const head = new THREE.Vector3(), foot = new THREE.Vector3();
    this.bones.head.getWorldPosition(head); this.bones.leftFoot.getWorldPosition(foot);
    this.metrics = { headY: head.y, hipsY: this.bones.hips.getWorldPosition(new THREE.Vector3()).y, ankleY: foot.y };
    this.body = this._bindData(this.bodyMesh);
    this.metrics.height = this.body.bbox.max.y;
  }

  /** Dati di bind del corpo in spazio canonico (personaggio rivolto a +Z, Y in alto, piedi a y=0). */
  _bindData(mesh) {
    const g = mesh.geometry;
    const flip = this.isVRM0 ? -1 : 1; // i VRM 0.x guardano verso -Z: lo spazio canonico li ruota di 180°
    const src = g.attributes.position, sn = g.attributes.normal;
    const n = src.count;
    const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = src.getX(i) * flip; pos[i * 3 + 1] = src.getY(i); pos[i * 3 + 2] = src.getZ(i) * flip;
      nrm[i * 3] = sn.getX(i) * flip; nrm[i * 3 + 1] = sn.getY(i); nrm[i * 3 + 2] = sn.getZ(i) * flip;
    }
    const bbox = new THREE.Box3();
    const used = new Uint8Array(n);
    const index = Uint32Array.from(g.index.array);
    for (const i of index) used[i] = 1;
    const v = new THREE.Vector3();
    for (let i = 0; i < n; i++) if (used[i]) bbox.expandByPoint(v.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
    return {
      mesh, flip, count: n, pos, nrm, used, index, bbox,
      uv: Float32Array.from(g.attributes.uv.array),
      skinIndex: Uint16Array.from(g.attributes.skinIndex.array),
      skinWeight: Float32Array.from(g.attributes.skinWeight.array),
      boneNames: mesh.skeleton.bones.map((b) => b.name),
      skeleton: mesh.skeleton, bindMatrix: mesh.bindMatrix.clone()
    };
  }

  /** Posizione canonica (a riposo, T-pose) di un osso umanoide. */
  restPosition(humanBone, out = new THREE.Vector3()) {
    const b = this.bones[humanBone];
    if (!b) return null;
    const m = this._rest || (this._rest = this._captureRest());
    return out.copy(m[humanBone]);
  }

  _captureRest() {
    const r = {};
    this.humanoid.resetNormalizedPose();
    this.humanoid.update();
    this.root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(this.root.matrixWorld).invert();
    const rootRot = this.isVRM0 ? -1 : 1;
    for (const [k, b] of Object.entries(this.bones)) {
      if (!b) continue;
      const p = b.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv); // spazio del modello
      r[k] = new THREE.Vector3(p.x * rootRot, p.y, p.z * rootRot);
    }
    return r;
  }

  setOutlineEnabled(on) { for (const m of this.allOutlineMaterials()) m.visible = on; }
  allOutlineMaterials() {
    const out = [];
    this.root.traverse((o) => { if (o.isMesh) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) if (m && m.isOutline) out.push(m); });
    return out;
  }

  update(dt) { this.vrm.update(dt); }
}

export async function loadAvatar(assets, file = BASE_AVATAR) {
  const vrm = await assets.loadVRM(file);
  VRM.VRMUtils.rotateVRM0(vrm);
  vrm.scene.name = 'Avatar';
  return new Avatar(vrm);
}
