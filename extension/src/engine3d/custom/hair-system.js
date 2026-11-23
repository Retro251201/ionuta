// Hair System: acconciature 3D montate sulla testa del personaggio.
// Ogni acconciatura è un VRM "donatore" ridotto ai soli capelli (mesh + ossa + spring bone). L'osso testa del donatore
// viene agganciato all'osso testa dell'avatar e adattato con le misure `fit` calcolate dalla pipeline, così i capelli
// seguono la testa e la loro fisica (spring bone) continua a funzionare con i collider del corpo.
import { THREE } from '../lib.js';
import { Emitter } from '../core/events.js';
import { AssetManager } from '../assets/asset-manager.js';
import { BASE_FIT } from '../avatar/avatar-loader.js';

export class HairSystem extends Emitter {
  /** @param {{avatar: import('../avatar/avatar-loader.js').Avatar, assets: AssetManager}} opts */
  constructor({ avatar, assets }) {
    super();
    this.avatar = avatar;
    this.assets = assets;
    this.index = [];
    this.baseFit = null;
    this.current = null;   // {id, vrm, head, meshes, colliders, tris}
    this.outlineEnabled = true;
    this._token = 0;
  }

  async init() {
    const [index, base] = await Promise.all([this.assets.json('hair/index.json'), this.assets.json(BASE_FIT)]);
    this.index = index;
    this.baseFit = base.fit;
    return this;
  }

  /** Acconciature disponibili nel pacchetto. */
  list() { return this.index.map((h) => ({ id: h.id, name: h.name, tris: h.tris })); }
  get style() { return this.current ? this.current.id : null; }

  /**
   * Monta un'acconciatura (null = nessuna). Restituisce l'id montato; se nel frattempo ne è stata richiesta
   * un'altra, la richiesta superata viene scartata.
   */
  async setStyle(id) {
    const token = ++this._token;
    if (!id) { this._unmount(); this.emit('change', { id: null }); return null; }
    const entry = this.index.find((h) => h.id === id);
    if (!entry) throw new Error('acconciatura sconosciuta: ' + id);
    if (this.current && this.current.id === id) return id;
    const vrm = await this.assets.loadVRM(entry.file);
    if (token !== this._token) { AssetManager.dispose(vrm.scene); return this.style; }
    this._unmount();
    this._mount(entry, vrm);
    this.emit('change', { id });
    return id;
  }

  _mount(entry, vrm) {
    const avatar = this.avatar, head = vrm.humanoid.getRawBoneNode('head'), target = avatar.bones.head;
    const meshes = [];
    vrm.scene.traverse((o) => { if (o.isSkinnedMesh || o.isMesh) { o.frustumCulled = false; o.castShadow = true; o.receiveShadow = false; meshes.push(o); } });
    // Il resto dello scheletro del donatore resta nella scena (serve alle matrici delle ossa) ma non viene animato.
    vrm.scene.name = 'Hair:' + entry.id;
    avatar.root.add(vrm.scene);
    // Adattamento alla testa dell'avatar: scala sulla larghezza del viso, sommità delle teste allineate.
    const f = entry.fit, b = this.baseFit, s = b.w / f.w;
    target.add(head);
    head.quaternion.identity();
    head.scale.setScalar(s);
    // spazio locale dell'osso testa = spazio del modello VRM 0.x (il fronte è −Z)
    head.position.set(0, b.top - f.top * s, -(b.front - f.front * s));
    // I collider del corpo (collo, busto, braccia) devono seguire l'avatar, non lo scheletro fermo del donatore.
    const colliders = [];
    const sb = vrm.springBoneManager;
    if (sb) {
      for (const c of sb.colliders) {
        let inHead = false;
        for (let o = c.parent; o; o = o.parent) if (o === head) { inHead = true; break; }
        if (inHead || !c.parent) continue;
        const dst = avatar.root.getObjectByName(c.parent.name);
        if (dst && dst !== c.parent) { dst.add(c); colliders.push(c); }
      }
      avatar.root.updateMatrixWorld(true);
      sb.reset();
    }
    this.current = { id: entry.id, vrm, head, meshes, colliders, tris: entry.tris, scale: s };
    this.setOutlineEnabled(this.outlineEnabled);
    this._prepareCut();
    this._applyCut();
  }

  /**
   * Taglio dei capelli davanti al viso (testa fotografica): i triangoli che stanno sopra il mento e nella metà
   * anteriore della testa non vengono disegnati, così la foto resta in primo piano e i capelli la incorniciano
   * di lato e da dietro. null = acconciatura completa.
   * @param {{chinY:number, cutZ:number}|null} cut  misure nello spazio dell'osso testa (canonico, fronte +Z)
   */
  setFaceCut(cut) { this.faceCut = cut || null; this._applyCut(); }

  // Posizioni a riposo di ogni vertice nello spazio dell'osso testa dell'avatar (canonico) e indici completi.
  _prepareCut() {
    const c = this.current, avatarHead = this.avatar.bones.head;
    this.avatar.root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(avatarHead.matrixWorld).invert(), v = new THREE.Vector3(), flip = this.avatar.isVRM0 ? -1 : 1;
    c.cut = [];
    for (const m of c.meshes) {
      const g = m.geometry;
      if (!g.index) continue;
      const p = g.attributes.position, local = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        if (m.isSkinnedMesh) m.applyBoneTransform(i, v);
        v.applyMatrix4(m.matrixWorld).applyMatrix4(inv);
        local[i * 3] = v.x * flip; local[i * 3 + 1] = v.y; local[i * 3 + 2] = v.z * flip;
      }
      const full = g.index.array.slice();
      c.cut.push({ mesh: m, full, local });
    }
  }

  _applyCut() {
    const c = this.current;
    if (!c || !c.cut) return;
    const cut = this.faceCut;
    let hidden = 0;
    for (const e of c.cut) {
      const g = e.mesh.geometry, out = g.index.array, full = e.full, L = e.local;
      let n = 0;
      for (let t = 0; t < full.length; t += 3) {
        let keep = true;
        if (cut) {
          keep = false;
          for (let k = 0; k < 3; k++) { const i = full[t + k]; if (L[i * 3 + 1] < cut.chinY || L[i * 3 + 2] < cut.cutZ) { keep = true; break; } }
        }
        if (keep) { out[n++] = full[t]; out[n++] = full[t + 1]; out[n++] = full[t + 2]; } else hidden++;
      }
      g.index.needsUpdate = true;
      const mats = Array.isArray(e.mesh.material) ? e.mesh.material : [e.mesh.material];
      if (g.groups.length) { g.clearGroups(); mats.forEach((_, k) => g.addGroup(0, n, k)); }
      g.setDrawRange(0, n);
    }
    this.hiddenTriangles = hidden;
  }

  _unmount() {
    const c = this.current;
    if (!c) return;
    this.current = null;
    for (const col of c.colliders) if (col.parent) col.parent.remove(col);
    if (c.head.parent) c.head.parent.remove(c.head);
    c.vrm.scene.add(c.head); // riunisce il sottoalbero per rilasciarne geometrie e texture
    AssetManager.dispose(c.vrm.scene);
  }

  setOutlineEnabled(on) {
    this.outlineEnabled = on;
    if (!this.current) return;
    for (const m of this.current.meshes) for (const mat of (Array.isArray(m.material) ? m.material : [m.material])) if (mat && mat.isOutline) mat.visible = on;
  }

  /** Fisica dei capelli: va chiamata dopo l'aggiornamento dell'avatar (la testa deve essere già in posa). */
  update(dt) {
    const c = this.current;
    if (c && c.vrm.springBoneManager) c.vrm.springBoneManager.update(dt);
  }

  /** Riporta i capelli a riposo (dopo un teletrasporto o un cambio di posa istantaneo). */
  resetPhysics() {
    const c = this.current;
    if (c && c.vrm.springBoneManager) { this.avatar.root.updateMatrixWorld(true); c.vrm.springBoneManager.reset(); }
  }

  dispose() { this._token++; this._unmount(); }
}
