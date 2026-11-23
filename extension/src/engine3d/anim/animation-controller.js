// Animation Controller: animazioni scheletriche del personaggio.
// Un THREE.AnimationMixer anima le ossa NORMALIZZATE del rig umanoide VRM (three-vrm le copia poi sulle ossa reali);
// uno stato di fondo ciclico (idle) resta sempre attivo e i gesti vi si sovrappongono con dissolvenze incrociate.
// Battito di ciglia ed espressioni passano dall'expression manager del modello.
import { THREE } from '../lib.js';
import { Emitter, damp } from '../core/events.js';
import { CLIPS, CLIP_BY_ID, bakeClip } from './clips.js';

const BLINK = { close: 0.07, hold: 0.045, open: 0.13 };

export class AnimationController extends Emitter {
  /** @param {{avatar: import('../avatar/avatar-loader.js').Avatar, random?: () => number}} opts */
  constructor({ avatar, random = Math.random }) {
    super();
    this.avatar = avatar;
    this.random = random;
    this.mixer = new THREE.AnimationMixer(avatar.root);
    this._actions = new Map(); // id → AnimationAction
    this._base = null;
    this._gesture = null;
    this._expr = new Map();    // nome → {value, target}
    this._blink = { t: 1.2 + random() * 2, phase: 0, value: 0, double: false };
    this.blinkEnabled = true;
    this.fade = 0.3;
    const hips = avatar.humanoid.getNormalizedBoneNode('hips');
    this._hipsRest = hips.position.clone();
    this._onFinished = (e) => this._finished(e.action);
    this.mixer.addEventListener('finished', this._onFinished);
  }

  /** Clip esterne (file .vrma) registrate in aggiunta a quelle native. id → {clip, def}. */
  _ext = new Map();

  /** Registra una AnimationClip di three.js (es. da un .vrma) come clip riproducibile. */
  addClip({ id, name, clip, loop = false, category = 'motion' }) {
    if (!id || !clip) return false;
    this._ext.set(id, { clip, def: { id, name: name || id, loop, category, duration: clip.duration } });
    return true;
  }

  /** Clip disponibili (native + esterne). */
  list() {
    return [...CLIPS.map((c) => ({ id: c.id, name: c.name, category: c.category, loop: c.loop, duration: c.duration })),
      ...[...this._ext.values()].map((e) => ({ ...e.def }))];
  }
  get base() { return this._base ? this._base.id : null; }
  get current() { return this._gesture ? this._gesture.id : this.base; }

  /** Costruisce (una sola volta) la AnimationClip di three.js per una clip nativa. */
  _action(id) {
    let a = this._actions.get(id);
    if (a) return a;
    // clip esterna (.vrma): la AnimationClip è già retargettata sul VRM corrente da createVRMAnimationClip
    const ext = this._ext.get(id);
    if (ext) {
      a = this.mixer.clipAction(ext.clip);
      a.id = id; a.def = ext.def;
      if (ext.def.loop) a.setLoop(THREE.LoopRepeat, Infinity); else { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
      this._actions.set(id, a);
      return a;
    }
    const def = CLIP_BY_ID[id];
    if (!def) return null;
    const baked = bakeClip(def), hum = this.avatar.humanoid, tracks = [];
    // i VRM 0.x guardano verso −Z: lo spazio canonico va ruotato di 180° attorno a Y (x e z cambiano segno)
    const k = this.avatar.isVRM0 ? -1 : 1;
    for (const [bone, src] of Object.entries(baked.rotations)) {
      const node = hum.getNormalizedBoneNode(bone);
      if (!node) continue; // osso facoltativo assente nel modello
      const v = new Float32Array(src.length);
      for (let i = 0; i < src.length; i += 4) { v[i] = src[i] * k; v[i + 1] = src[i + 1]; v[i + 2] = src[i + 2] * k; v[i + 3] = src[i + 3]; }
      tracks.push(new THREE.QuaternionKeyframeTrack(node.name + '.quaternion', baked.times, v));
    }
    const hp = new Float32Array(baked.hips.length), r = this._hipsRest;
    for (let i = 0; i < hp.length; i += 3) { hp[i] = r.x + baked.hips[i] * k; hp[i + 1] = r.y + baked.hips[i + 1]; hp[i + 2] = r.z + baked.hips[i + 2] * k; }
    tracks.push(new THREE.VectorKeyframeTrack(hum.getNormalizedBoneNode('hips').name + '.position', baked.times, hp));
    const clip = new THREE.AnimationClip(id, baked.duration, tracks);
    a = this.mixer.clipAction(clip);
    a.id = id; a.def = def;
    if (def.loop) a.setLoop(THREE.LoopRepeat, Infinity); else { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
    this._actions.set(id, a);
    return a;
  }

  /** Stato di fondo ciclico a cui si torna dopo ogni gesto. */
  setBase(id, { fade = this.fade } = {}) {
    const a = this._action(id);
    if (!a || !a.def.loop) return false;
    if (this._base === a) return true;
    const prev = this._base;
    this._base = a;
    a.reset().play();
    if (this._gesture) a.setEffectiveWeight(0);
    else if (prev) a.crossFadeFrom(prev, fade, false);
    this.emit('state', { id: this.current });
    return true;
  }

  /**
   * Riproduce una clip. Le clip cicliche diventano lo stato di fondo; i gesti partono in dissolvenza dallo stato
   * corrente e, finiti, tornano allo stato di fondo.
   * @returns {Promise<boolean>} risolta a fine gesto (true = completato, false = interrotto o clip sconosciuta)
   */
  play(id, { fade = this.fade } = {}) {
    const a = this._action(id);
    if (!a) return Promise.resolve(false);
    if (a.def.loop) { if (this._gesture) this._endGesture(fade, false); return Promise.resolve(this.setBase(id, { fade })); }
    const from = this._gesture || this._base;
    if (this._gesture && this._gesture !== a) this._resolveGesture(false);
    a.reset().play();
    a.setEffectiveWeight(1);
    if (from && from !== a) a.crossFadeFrom(from, fade, false);
    this._gesture = a;
    this.emit('state', { id });
    return new Promise((res) => { a._done = res; });
  }

  /** Interrompe il gesto in corso e torna allo stato di fondo. */
  stopGesture({ fade = this.fade } = {}) { if (this._gesture) this._endGesture(fade, false); }

  _finished(action) { if (action === this._gesture) this._endGesture(this.fade, true); }
  _resolveGesture(ok) { const g = this._gesture; if (g && g._done) { const f = g._done; g._done = null; f(ok); } }
  _endGesture(fade, completed) {
    const g = this._gesture;
    this._resolveGesture(completed);
    this._gesture = null;
    if (this._base) { this._base.enabled = true; this._base.setEffectiveTimeScale(1); this._base.setEffectiveWeight(1); this._base.crossFadeFrom(g, fade, false); } else g.fadeOut(fade);
    this.emit('end', { id: g.id, completed });
    this.emit('state', { id: this.current });
  }

  /** Espressione del viso (nomi VRM del modello: happy, sad, angry, relaxed, Surprised…); null le azzera. */
  setExpression(name, weight = 1) {
    for (const e of this._expr.values()) e.user = 0;
    if (name) this._slot(name).user = Math.max(0, Math.min(1, weight));
  }
  _slot(name) { let e = this._expr.get(name); if (!e) this._expr.set(name, (e = { value: 0, user: 0, clip: 0 })); return e; }

  update(dt) {
    this.mixer.update(dt);
    const em = this.avatar.vrm.expressionManager;
    if (!em) return;
    // espressioni guidate dal gesto in corso (es. sorriso durante il saluto) sopra quella scelta dall'esterno
    const g = this._gesture, fromClip = g && g.def.expressions ? g.def.expressions(g.time) : null;
    for (const e of this._expr.values()) e.clip = 0;
    if (fromClip) for (const [name, v] of Object.entries(fromClip)) this._slot(name).clip = v;
    for (const [name, e] of this._expr) { e.value = damp(e.value, Math.max(e.user, e.clip), 14, dt); em.setValue(name, e.value < 0.002 ? 0 : e.value); }
    // "happy" chiude già gli occhi: il battito non deve sommarsi (le palpebre andrebbero oltre la chiusura)
    const happy = this._expr.get('happy');
    if (this.blinkEnabled) em.setValue('blink', this._blinkStep(dt) * (1 - (happy ? happy.value : 0)));
  }

  _blinkStep(dt) {
    const b = this._blink;
    b.t -= dt;
    if (b.phase === 0) {
      if (b.t <= 0) { b.phase = 1; b.t = BLINK.close; }
    } else if (b.phase === 1) {
      b.value = 1 - Math.max(0, b.t) / BLINK.close;
      if (b.t <= 0) { b.phase = 2; b.t = BLINK.hold; }
    } else if (b.phase === 2) {
      b.value = 1;
      if (b.t <= 0) { b.phase = 3; b.t = BLINK.open; }
    } else {
      b.value = Math.max(0, b.t) / BLINK.open;
      if (b.t <= 0) {
        // intervallo irregolare tra due battiti; ogni tanto un doppio battito, mai una raffica
        b.double = !b.double && this.random() < 0.12;
        b.phase = 0; b.value = 0; b.t = b.double ? 0.18 : 2.4 + this.random() * 3.6;
      }
    }
    return b.value;
  }

  /** Fa ripartire il ciclo del battito di ciglia tra `delay` secondi (usato anche dai test con `random` fissato). */
  restartBlink(delay = 1) { this._blink = { t: delay, phase: 0, value: 0, double: false }; }

  dispose() {
    this.mixer.removeEventListener('finished', this._onFinished);
    this.mixer.stopAllAction();
    for (const a of this._actions.values()) this.mixer.uncacheClip(a.getClip());
    this._actions.clear();
  }
}
