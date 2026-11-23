// Character Engine: facciata del motore 3D. Crea i moduli, li collega e li aggiorna nell'ordine corretto
// (animazioni → scheletro ed espressioni → fisica dei capelli → camera → disegno) e applica una definizione di
// personaggio (capelli e outfit). Chi ospita il motore (pagine dell'estensione, banco di prova) parla solo con questa classe.
import { RenderingEngine, QUALITY_PRESETS } from '../render/rendering-engine.js';
import { CameraController } from '../render/camera-controller.js';
import { AssetManager } from '../assets/asset-manager.js';
import { loadAvatar } from '../avatar/avatar-loader.js';
import { MaterialSystem } from '../material/material-system.js';
import { WardrobeManager } from '../wardrobe/wardrobe-manager.js';
import { HairSystem } from '../custom/hair-system.js';
import { PhotoHead } from '../custom/photo-head.js';
import { AnimationController } from '../anim/animation-controller.js';
import { LookController } from '../anim/look-controller.js';
import { normalizeCharacter } from './character-def.js';
import { Emitter } from './events.js';
import { LIGHTING_PRESETS, LIGHTING_BY_ID } from '../render/lighting-presets.js';

export { LIGHTING_PRESETS };

export { QUALITY_PRESETS };

export class CharacterEngine extends Emitter {
  /** WebGL 2 è indispensabile (three.js non supporta più WebGL 1). */
  static webglAvailable() {
    try { const c = document.createElement('canvas'); return !!(globalThis.WebGL2RenderingContext && c.getContext('webgl2')); } catch (e) { return false; }
  }

  /**
   * @param {HTMLElement} container
   * @param {{quality?: string, transparent?: boolean, autoPause?: boolean, interactive?: boolean,
   *          resolveHead?: (head: object) => (object|null|Promise<object|null>)}} opts
   *   resolveHead: dalla voce `head` della definizione al descrittore della foto (url, w, h, anchorX, anchorY, faceW)
   */
  constructor(container, opts = {}) {
    super();
    this.container = container;
    this.opts = { quality: 'medium', transparent: true, autoPause: true, interactive: true, ...opts };
    this.ready = false;
    this.def = null;
  }

  /** Crea il renderer, carica il modello e applica la definizione. Lancia un errore se WebGL o il modello mancano. */
  async load(def) {
    if (!CharacterEngine.webglAvailable()) throw new Error('WebGL 2 non disponibile');
    const o = this.opts;
    this.render = new RenderingEngine(this.container, { quality: o.quality, transparent: o.transparent, autoPause: o.autoPause });
    this.assets = new AssetManager();
    this.avatar = await loadAvatar(this.assets);
    this.render.scene.add(this.avatar.root);
    this.materials = new MaterialSystem();
    this.wardrobe = new WardrobeManager({ avatar: this.avatar, materials: this.materials });
    this.hair = new HairSystem({ avatar: this.avatar, assets: this.assets });
    await this.hair.init();
    this.photoHead = new PhotoHead({ avatar: this.avatar, assets: this.assets });
    this.anim = new AnimationController({ avatar: this.avatar });
    this.look = new LookController({ avatar: this.avatar });
    this.camera = new CameraController(this.render, { interactive: o.interactive });
    if (o.interactive) {
      // lo sguardo segue il cursore ovunque sulla pagina (non solo sopra il canvas)
      this._onPointer = (e) => this.look.pointer(e, this.render.canvas);
      addEventListener('pointermove', this._onPointer, { passive: true });
    }
    this.wardrobe.on('change', () => this._ground());
    await this.apply(def);
    if (!this.setLighting(o.lighting)) this.setLighting('studio');
    this.anim.setBase('idle', { fade: 0 });
    this._offUpdate = this.render.onUpdate((dt) => this.update(dt));
    this._applyQuality();
    this.render.on('quality', () => this._applyQuality());
    // qualche passo a vuoto: posa iniziale e capelli già assestati al primo fotogramma visibile
    for (let i = 0; i < 20; i++) this.update(1 / 30);
    this.hair.resetPhysics();
    this.camera.frame('full', { animate: false, lift: this.wardrobe.groundOffset });
    this.render.start();
    this.ready = true;
    this.emit('ready');
    return this;
  }

  /** Applica una definizione di personaggio (normalizzata qui: l'input può venire da un backup). */
  async apply(def) {
    const d = normalizeCharacter(def);
    this.def = d;
    const res = this.wardrobe.setOutfit(d.outfit);
    this._ground();
    await this.hair.setStyle(d.hair.style || null);
    await this._applyHead(d.head);
    this.emit('applied', { def: d, outfitErrors: res.errors });
    return d;
  }

  /** Cambia acconciatura e aggiorna la definizione corrente. */
  async setHair(id) {
    await this.hair.setStyle(id);
    this.hair.setFaceCut(this.photoHead.active ? this.photoHead.hairCut() : null);
    this.def.hair.style = this.hair.style;
    this.hair.setOutlineEnabled(!!this.render.quality.outline);
    return this.def;
  }

  /** Testa: foto originale (modalità 'photo') oppure viso 3D. Se la foto non è risolvibile resta il viso 3D. */
  async _applyHead(head) {
    let desc = null;
    if (head.mode === 'photo' && this.opts.resolveHead) {
      try { desc = await this.opts.resolveHead(head); } catch (e) { console.warn('[DC] testa fotografica non disponibile', e); }
    }
    await this.photoHead.set(desc);
    this.headMode = desc ? 'photo' : '3d';
    this.hair.setFaceCut(desc ? this.photoHead.hairCut() : null);
    this.avatar.setSkinTone(desc && /^#[0-9a-f]{6}$/i.test(desc.skin || '') ? desc.skin : this.def.skin.tone);
    this.emit('head', { mode: this.headMode, id: this.photoHead.id });
  }

  /** Cambia testa: {mode:'photo', photoId} oppure {mode:'3d'}. */
  async setHead(patch) {
    Object.assign(this.def.head, patch);
    await this._applyHead(this.def.head);
    this.def.head.mode = this.headMode;
    return this.def;
  }

  /** Applica un outfit completo e aggiorna la definizione (per i look preimpostati e il randomizer). */
  setOutfit(outfit) {
    const res = this.wardrobe.setOutfit(outfit || {});
    this.def.outfit = this.wardrobe.outfit;
    this.emit('outfit', { outfit: this.def.outfit });
    return res;
  }

  /** Indossa o toglie (id null) un capo in uno slot e aggiorna la definizione. */
  equipItem(slot, id, config = {}) {
    const res = id ? this.wardrobe.equip(slot, id, config) : this.wardrobe.unequip(slot);
    this.def.outfit = this.wardrobe.outfit;
    this.emit('outfit', { outfit: this.def.outfit });
    return res;
  }

  _ground() { this.avatar.root.position.y = this.wardrobe.groundOffset; }

  _applyQuality() {
    const on = !!this.render.quality.outline;
    this.avatar.setOutlineEnabled(on);
    this.materials.setOutlineEnabled(on);
    this.hair.setOutlineEnabled(on);
  }

  setQuality(name) { this.render.setQuality(name); }

  /** Preset di illuminazione: luci della scena e tinta della foto del volto. */
  setLighting(id) {
    const p = LIGHTING_BY_ID[id];
    if (!p) return null;
    this.render.setLighting(p.light);
    this.photoHead.setTint(p.tint);
    this.lighting = id;
    this.emit('lighting', p);
    return p;
  }

  update(dt) {
    this.anim.update(dt);
    this.look.update(dt, this.render.camera);
    this.avatar.update(dt);
    this.hair.update(dt);
    this.camera.update(dt);
  }

  /** Avanza di n fotogrammi in modo deterministico (test e cattura di immagini). */
  step(n = 1, dt = 1 / 30) { for (let i = 0; i < n; i++) this.render.step(dt); }

  /** Numeri reali del renderer per l'interfaccia e per i test. */
  stats() {
    const r = this.render;
    r._readInfo();
    return { fps: r.info.fps, frameMs: r.info.frameMs, calls: r.info.calls, triangles: r.info.triangles, geometries: r.info.geometries, textures: r.info.textures, quality: r.qualityName, pixelRatio: r.size ? r.size.pr : 1 };
  }

  dispose() {
    if (this._offUpdate) this._offUpdate();
    if (this._onPointer) removeEventListener('pointermove', this._onPointer);
    if (this.camera) this.camera.dispose();
    if (this.anim) this.anim.dispose();
    if (this.photoHead) this.photoHead.dispose();
    if (this.hair) this.hair.dispose();
    if (this.wardrobe) this.wardrobe.dispose();
    if (this.avatar) AssetManager.dispose(this.avatar.root);
    if (this.render) this.render.dispose();
    this.ready = false;
  }
}
