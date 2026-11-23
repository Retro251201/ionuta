// Asset Manager: caricamento pigro (lazy) degli asset LOCALI del pacchetto, cache con conteggio dei
// riferimenti e rilascio della memoria GPU. Nessuna richiesta di rete esterna: tutto è sotto extension/assets.
import { THREE, GLTFLoader, VRM, VRMA } from '../lib.js';

const ASSET_BASE = new URL('../../../assets/', import.meta.url);

export class AssetManager {
  constructor() {
    this._buffers = new Map(); // url → Promise<ArrayBuffer>
    this._json = new Map();
    this._textures = new Map(); // url → { promise, refs }
    this.vrmLoader = new GLTFLoader();
    this.vrmLoader.register((p) => new VRM.VRMLoaderPlugin(p, { autoUpdateHumanBones: true }));
    this.gltfLoader = new GLTFLoader();
    this.vrmaLoader = new GLTFLoader();
    this.vrmaLoader.register((p) => new VRMA.VRMAnimationLoaderPlugin(p));
    this.stats = { requests: 0, bytes: 0 };
  }

  url(rel) { return /^(data:|blob:|https?:|chrome-extension:|\/)/.test(rel) ? rel : new URL(rel, ASSET_BASE).href; }

  /** Byte grezzi (in cache: un VRM può essere ri-istanziato senza rileggere il file). */
  buffer(rel) {
    const u = this.url(rel);
    if (!this._buffers.has(u)) {
      this.stats.requests++;
      this._buffers.set(u, fetch(u).then((r) => { if (!r.ok) throw new Error('asset mancante: ' + rel + ' (' + r.status + ')'); return r.arrayBuffer(); }).then((b) => { this.stats.bytes += b.byteLength; return b; }));
      this._buffers.get(u).catch(() => this._buffers.delete(u));
    }
    return this._buffers.get(u);
  }

  json(rel) {
    const u = this.url(rel);
    if (!this._json.has(u)) this._json.set(u, fetch(u).then((r) => { if (!r.ok) throw new Error('asset mancante: ' + rel); return r.json(); }));
    return this._json.get(u);
  }

  /** Nuova istanza VRM (scene graph proprio) dal file in cache. */
  async loadVRM(rel) {
    const buf = await this.buffer(rel);
    const gltf = await this.vrmLoader.parseAsync(buf, this.url(rel).replace(/[^/]*$/, ''));
    if (!gltf.userData.vrm) throw new Error('VRM non valido: ' + rel);
    return gltf.userData.vrm;
  }

  /** Scena glTF generica (nuova istanza a ogni chiamata). */
  async loadGLTF(rel) {
    const buf = await this.buffer(rel);
    return this.gltfLoader.parseAsync(buf, this.url(rel).replace(/[^/]*$/, ''));
  }

  /** Animazione VRM (.vrma): restituisce il primo oggetto VRMAnimation del file. */
  async loadVRMA(rel) {
    const buf = await this.buffer(rel);
    const gltf = await this.vrmaLoader.parseAsync(buf, this.url(rel).replace(/[^/]*$/, ''));
    const list = gltf.userData.vrmAnimations;
    if (!list || !list.length) throw new Error('nessuna animazione VRM in ' + rel);
    return list[0];
  }

  /** Dimentica i byte di un file (libera RAM dopo l'istanziazione, se non serve ricaricarlo). */
  release(rel) { this._buffers.delete(this.url(rel)); }

  image(rel) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => rej(new Error('immagine non caricabile: ' + String(rel).slice(0, 80)));
      im.src = this.url(rel);
    });
  }

  texture(rel, { srgb = true, repeat = false } = {}) {
    const u = this.url(rel);
    let e = this._textures.get(u);
    if (!e) {
      e = { refs: 0, promise: this.image(u).then((im) => {
        const t = new THREE.Texture(im);
        t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 4; t.needsUpdate = true; t.userData.assetUrl = u;
        return t;
      }) };
      this._textures.set(u, e);
    }
    e.refs++;
    return e.promise;
  }

  releaseTexture(tex) {
    const u = tex && tex.userData && tex.userData.assetUrl;
    const e = u && this._textures.get(u);
    if (!e) { if (tex) tex.dispose(); return; }
    if (--e.refs <= 0) { tex.dispose(); this._textures.delete(u); }
  }

  /** Rilascia geometrie, materiali e texture di un sottoalbero (memoria GPU). */
  static dispose(obj, { keepTextures = false } = {}) {
    if (!obj) return;
    obj.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of mats) {
        if (!keepTextures) for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
        if (!keepTextures && m.uniforms) for (const u of Object.values(m.uniforms)) if (u && u.value && u.value.isTexture) u.value.dispose();
        m.dispose();
      }
      if (o.skeleton && o.skeleton.boneTexture) o.skeleton.boneTexture.dispose();
    });
    if (obj.parent) obj.parent.remove(obj);
  }
}
