// Rendering Engine: renderer WebGL, scena, luci dinamiche, ombre, preset di qualità (Low/Medium/High/Ultra),
// limite FPS configurabile, sospensione automatica quando la scena non è visibile, gestione della perdita
// del contesto GPU e cattura di immagini ad alta risoluzione.
import { THREE, EffectComposer, RenderPass, UnrealBloomPass, OutputPass } from '../lib.js';
import { Emitter } from '../core/events.js';

export const QUALITY_PRESETS = {
  low: { label: 'Low', maxPixelRatio: 0.85, antialias: false, shadows: false, shadowSize: 0, outline: false, bloom: false, fps: 30, physicsHz: 30, textureAniso: 1, roomDetail: 0 },
  medium: { label: 'Medium', maxPixelRatio: 1.25, antialias: true, shadows: true, shadowSize: 1024, outline: true, bloom: false, fps: 30, physicsHz: 60, textureAniso: 2, roomDetail: 1 },
  high: { label: 'High', maxPixelRatio: 1.75, antialias: true, shadows: true, shadowSize: 2048, outline: true, bloom: false, fps: 60, physicsHz: 60, textureAniso: 4, roomDetail: 2 },
  ultra: { label: 'Ultra', maxPixelRatio: 2.5, antialias: true, shadows: true, shadowSize: 4096, outline: true, bloom: true, fps: 60, physicsHz: 90, textureAniso: 8, roomDetail: 3 }
};

export class RenderingEngine extends Emitter {
  /**
   * @param {HTMLElement} container elemento che ospita il canvas (lo riempie)
   * @param {{quality?:string, transparent?:boolean, fps?:number, autoPause?:boolean}} opts
   */
  constructor(container, opts = {}) {
    super();
    this.container = container;
    this.transparent = opts.transparent !== false;
    this.qualityName = opts.quality || 'medium';
    this.quality = { ...QUALITY_PRESETS[this.qualityName] };
    this.fpsLimit = opts.fps || this.quality.fps;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(26, 1, 0.05, 80);
    this.camera.position.set(0, 1.0, 4.2);
    this.clock = { last: 0, time: 0 };
    this._updaters = new Set();
    this._suspend = new Set();
    this._running = false;
    this._frame = this._frame.bind(this);
    this.info = { fps: 0, frameMs: 0, calls: 0, triangles: 0, geometries: 0, textures: 0 };
    this._fpsAcc = { n: 0, t: 0 };
    this._buildLights();
    this._createRenderer();
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(container);
    if (opts.autoPause !== false) {
      this._onVis = () => (document.hidden ? this.suspend('hidden') : this.resume('hidden'));
      document.addEventListener('visibilitychange', this._onVis);
      if (document.hidden) this.suspend('hidden');
      this._io = new IntersectionObserver((es) => { for (const e of es) (e.isIntersecting ? this.resume('offscreen') : this.suspend('offscreen')); });
      this._io.observe(container);
    }
  }

  // ---------- renderer ----------
  _createRenderer() {
    const old = this.renderer;
    if (old) { old.domElement.remove(); old.dispose(); }
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;outline:none;touch-action:none';
    this.container.appendChild(canvas);
    const r = new THREE.WebGLRenderer({ canvas, antialias: !!this.quality.antialias, alpha: true, premultipliedAlpha: true, powerPreference: this.qualityName === 'low' ? 'low-power' : 'high-performance', stencil: false });
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.setClearColor(0x000000, 0);
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer = r;
    this.canvas = canvas;
    this._aa = !!this.quality.antialias;
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.contextLost = true; this.emit('contextlost'); });
    canvas.addEventListener('webglcontextrestored', () => { this.contextLost = false; this._composer = null; this.emit('contextrestored'); this.requestRender(); });
    this._applyQuality();
    this.resize();
    this.emit('renderer', r);
  }

  _buildLights() {
    const L = (this.lights = {});
    L.hemi = new THREE.HemisphereLight(0xffffff, 0xb9a9c9, 0.95);
    L.key = new THREE.DirectionalLight(0xfff4ea, 1.9);
    L.key.position.set(1.6, 3.2, 2.6);
    L.key.castShadow = true;
    const sc = L.key.shadow.camera;
    sc.left = -1.6; sc.right = 1.6; sc.top = 2.2; sc.bottom = -0.4; sc.near = 0.5; sc.far = 9;
    L.key.shadow.bias = -0.0004; L.key.shadow.normalBias = 0.02; L.key.shadow.radius = 4;
    L.fill = new THREE.DirectionalLight(0xcfe0ff, 0.45);
    L.fill.position.set(-2.4, 1.4, 1.5);
    L.rim = new THREE.DirectionalLight(0xffe6f6, 0.55);
    L.rim.position.set(-0.6, 2.4, -3);
    this.scene.add(L.hemi, L.key, L.key.target, L.fill, L.rim);
    // "Shadow catcher": piano invisibile che riceve solo l'ombra (funziona anche su sfondo trasparente).
    this.shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(2.4, 48), new THREE.ShadowMaterial({ opacity: 0.28, transparent: true, depthWrite: false }));
    this.shadowCatcher.rotation.x = -Math.PI / 2;
    this.shadowCatcher.position.y = 0.001;
    this.shadowCatcher.receiveShadow = true;
    this.shadowCatcher.name = 'ShadowCatcher';
    this.scene.add(this.shadowCatcher);
  }

  /** Preset di illuminazione parametrico (usato da Photo Studio e stanze). Valori parziali ammessi. */
  setLighting(p = {}) {
    const L = this.lights;
    const col = (l, c) => { if (c !== undefined) l.color.set(c); };
    if (p.ambient !== undefined) L.hemi.intensity = p.ambient;
    col(L.hemi, p.ambientColor); if (p.groundColor !== undefined) L.hemi.groundColor.set(p.groundColor);
    if (p.key !== undefined) L.key.intensity = p.key;
    col(L.key, p.keyColor);
    if (p.keyAzimuth !== undefined || p.keyElevation !== undefined) {
      const az = (p.keyAzimuth !== undefined ? p.keyAzimuth : this._keyAz || 30) * Math.PI / 180, el = (p.keyElevation !== undefined ? p.keyElevation : this._keyEl || 48) * Math.PI / 180;
      this._keyAz = p.keyAzimuth !== undefined ? p.keyAzimuth : this._keyAz; this._keyEl = p.keyElevation !== undefined ? p.keyElevation : this._keyEl;
      const d = 4.4;
      L.key.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d + 0.6, Math.cos(az) * Math.cos(el) * d);
    }
    if (p.fill !== undefined) L.fill.intensity = p.fill;
    col(L.fill, p.fillColor);
    if (p.rim !== undefined) L.rim.intensity = p.rim;
    col(L.rim, p.rimColor);
    if (p.shadow !== undefined) this.shadowCatcher.material.opacity = p.shadow;
    this.requestRender();
  }

  // ---------- qualità ----------
  setQuality(name) {
    if (!QUALITY_PRESETS[name]) return;
    const prevFps = this.quality.fps;
    this.qualityName = name;
    this.quality = { ...QUALITY_PRESETS[name] };
    if (this.fpsLimit === prevFps) this.fpsLimit = this.quality.fps;
    if (this._aa !== !!this.quality.antialias) this._createRenderer(); else { this._applyQuality(); this.resize(); }
    this.emit('quality', this.quality);
    this.requestRender();
  }

  _applyQuality() {
    const q = this.quality, r = this.renderer;
    r.shadowMap.enabled = !!q.shadows;
    this.lights.key.castShadow = !!q.shadows;
    this.shadowCatcher.visible = !!q.shadows && this._catcherWanted !== false;
    if (q.shadows && this.lights.key.shadow.mapSize.x !== q.shadowSize) {
      this.lights.key.shadow.mapSize.set(q.shadowSize, q.shadowSize);
      if (this.lights.key.shadow.map) { this.lights.key.shadow.map.dispose(); this.lights.key.shadow.map = null; }
    }
    r.shadowMap.needsUpdate = true;
    this._composer = null;
  }

  setShadowCatcher(on) { this._catcherWanted = on; this.shadowCatcher.visible = on && !!this.quality.shadows; this.requestRender(); }
  setFpsLimit(fps) { this.fpsLimit = Math.max(5, Math.min(144, fps | 0)); }

  /** Sfondo: null = trasparente, altrimenti colore/texture (stanze e photo studio). */
  setBackground(bg) {
    this.scene.background = bg || null;
    this.transparent = !bg;
    this.requestRender();
  }

  // ---------- ciclo ----------
  onUpdate(fn) { this._updaters.add(fn); return () => this._updaters.delete(fn); }
  start() { if (this._running) return; this._running = true; this.clock.last = 0; if (!this._suspend.size) this._raf = requestAnimationFrame(this._frame); }
  stop() { this._running = false; cancelAnimationFrame(this._raf); }
  /** Sospende rendering e animazioni per un motivo (hidden, offscreen, sleep…); riprende quando tutti i motivi cadono. */
  suspend(reason = 'manual') {
    if (this._suspend.has(reason)) return;
    this._suspend.add(reason);
    cancelAnimationFrame(this._raf);
    this.emit('suspend', reason);
  }
  resume(reason = 'manual') {
    if (!this._suspend.delete(reason)) return;
    if (!this._suspend.size && this._running) { this.clock.last = 0; this._raf = requestAnimationFrame(this._frame); this.emit('resume', reason); }
  }
  get suspended() { return this._suspend.size > 0; }
  requestRender() { this._dirty = true; }

  _frame(t) {
    if (!this._running || this._suspend.size) return;
    this._raf = requestAnimationFrame(this._frame);
    const c = this.clock;
    if (!c.last) { c.last = t - 1000 / this.fpsLimit; }
    const elapsed = t - c.last;
    if (elapsed < 1000 / this.fpsLimit - 1.5) return; // limite FPS
    c.last = t;
    this.step(Math.min(elapsed / 1000, 0.1));
    const a = this._fpsAcc;
    a.n++; a.t += elapsed;
    if (a.t >= 1000) { this.info.fps = Math.round((a.n * 1000) / a.t); a.n = 0; a.t = 0; this._readInfo(); }
  }

  /** Avanza la simulazione di dt secondi e disegna (usato anche dai test per avanzare in modo deterministico). */
  step(dt) {
    const t0 = performance.now();
    this.clock.time += dt;
    for (const fn of this._updaters) fn(dt, this.clock.time);
    this.render();
    this.info.frameMs = performance.now() - t0;
  }

  render() {
    if (this.contextLost) return;
    const useBloom = this.quality.bloom && !this.transparent;
    if (useBloom) {
      if (!this._composer) this._buildComposer();
      this._composer.render();
    } else this.renderer.render(this.scene, this.camera);
    this._dirty = false;
  }

  _buildComposer() {
    const s = this.renderer.getSize(new THREE.Vector2());
    const comp = new EffectComposer(this.renderer);
    comp.setPixelRatio(this.renderer.getPixelRatio());
    comp.setSize(s.x, s.y);
    comp.addPass(new RenderPass(this.scene, this.camera));
    comp.addPass(new UnrealBloomPass(new THREE.Vector2(s.x, s.y), 0.22, 0.6, 0.9));
    comp.addPass(new OutputPass());
    this._composer = comp;
  }

  _readInfo() {
    const i = this.renderer.info;
    this.info.calls = i.render.calls; this.info.triangles = i.render.triangles;
    this.info.geometries = i.memory.geometries; this.info.textures = i.memory.textures;
  }

  resize() {
    const w = Math.max(1, this.container.clientWidth), h = Math.max(1, this.container.clientHeight);
    const pr = Math.min(window.devicePixelRatio || 1, this.quality.maxPixelRatio) * (this.qualityName === 'low' ? 0.85 : 1);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this._composer) { this._composer.setPixelRatio(pr); this._composer.setSize(w, h); }
    this.size = { w, h, pr };
    this.emit('resize', this.size);
    if (this._running && !this._suspend.size) this.render();
  }

  /** Libera la memoria GPU senza distruggere la scena (schede in background). ripristino con restoreContext(). */
  releaseContext() { if (!this.contextLost) this.renderer.forceContextLoss(); }
  restoreContext() { if (this.contextLost) this.renderer.forceContextRestore(); }

  /**
   * Cattura un'immagine della scena a risoluzione arbitraria.
   * @returns {Promise<Blob>}
   */
  async capture({ width = 1920, height = 1080, transparent = false, type = 'image/png', quality = 0.95, camera = null } = {}) {
    const r = this.renderer, cam = camera || this.camera;
    const prevPR = r.getPixelRatio(), prevSize = r.getSize(new THREE.Vector2()), prevAspect = cam.aspect, prevBg = this.scene.background;
    const prevCatcher = this.shadowCatcher.material.opacity;
    const max = r.capabilities.maxTextureSize;
    const k = Math.min(1, max / Math.max(width, height));
    r.setPixelRatio(1); r.setSize(Math.round(width * k), Math.round(height * k), false);
    cam.aspect = width / height; cam.updateProjectionMatrix();
    if (transparent) this.scene.background = null;
    r.render(this.scene, cam);
    const blob = await new Promise((res) => r.domElement.toBlob(res, type, quality));
    this.scene.background = prevBg; this.shadowCatcher.material.opacity = prevCatcher;
    r.setPixelRatio(prevPR); r.setSize(prevSize.x, prevSize.y, false);
    cam.aspect = prevAspect; cam.updateProjectionMatrix();
    this.render();
    return blob;
  }

  dispose() {
    this.stop();
    this._ro.disconnect();
    if (this._io) this._io.disconnect();
    if (this._onVis) document.removeEventListener('visibilitychange', this._onVis);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
