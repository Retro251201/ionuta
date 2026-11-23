// Camera Controller: inquadrature predefinite con transizione morbida, orbita e zoom con il mouse/tocco.
import { THREE, OrbitControls } from '../lib.js';
import { Emitter, damp } from '../core/events.js';

/** Inquadrature: punto guardato (metri, spazio canonico), distanza e angoli di partenza. */
export const FRAMES = {
  full: { name: 'Figura intera', target: [0, 0.84, 0], distance: 4.15, azimuth: 0, elevation: 1 },
  upper: { name: 'Mezzo busto', target: [0, 1.24, 0], distance: 2.3, azimuth: 8, elevation: 2 },
  face: { name: 'Viso', target: [0, 1.49, 0], distance: 1.05, azimuth: 0, elevation: 1 }
};

export class CameraController extends Emitter {
  /** @param {import('./rendering-engine.js').RenderingEngine} render */
  constructor(render, { interactive = true } = {}) {
    super();
    this.render = render;
    this.camera = render.camera;
    this.interactive = interactive;
    this.frameName = 'full';
    this._goal = null;
    this._attach();
    this._offRenderer = render.on('renderer', () => this._attach()); // il canvas cambia quando cambia l'antialiasing
    this.frame('full', { animate: false });
  }

  _attach() {
    const prev = this.controls, target = prev ? prev.target.clone() : new THREE.Vector3(0, 0.86, 0);
    if (prev) prev.dispose();
    const c = (this.controls = new OrbitControls(this.camera, this.render.canvas));
    c.target.copy(target);
    c.enableDamping = true; c.dampingFactor = 0.09;
    c.enablePan = false;
    c.minDistance = 0.55; c.maxDistance = 7.5;
    c.minPolarAngle = 0.12 * Math.PI; c.maxPolarAngle = 0.6 * Math.PI; // mai sotto il pavimento
    c.rotateSpeed = 0.7; c.zoomSpeed = 0.8;
    c.enabled = this.interactive;
    c.addEventListener('start', () => { this._goal = null; this.frameName = null; this.emit('frame', { name: null }); });
    c.update();
  }

  setInteractive(on) { this.interactive = on; this.controls.enabled = on; }

  /** Posizione della camera per un'inquadratura (l'altezza tiene conto della quota del personaggio). */
  _pose(f, lift = 0) {
    const az = f.azimuth * Math.PI / 180, el = f.elevation * Math.PI / 180;
    const target = new THREE.Vector3(f.target[0], f.target[1] + lift, f.target[2]);
    // nelle finestre strette la figura intera deve restare dentro l'inquadratura anche in larghezza
    const fit = this.camera.aspect < 0.62 ? 0.62 / this.camera.aspect : 1;
    const d = f.distance * fit;
    const position = new THREE.Vector3(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d).add(target);
    return { target, position };
  }

  /** Passa a un'inquadratura predefinita. */
  frame(name, { animate = true, lift = this.lift || 0 } = {}) {
    const f = FRAMES[name];
    if (!f) return false;
    this.frameName = name;
    this.lift = lift;
    const pose = this._pose(f, lift);
    if (animate) this._goal = pose;
    else { this._goal = null; this.camera.position.copy(pose.position); this.controls.target.copy(pose.target); this.controls.update(); }
    this.emit('frame', { name });
    return true;
  }

  list() { return Object.entries(FRAMES).map(([id, f]) => ({ id, name: f.name })); }

  update(dt) {
    const g = this._goal;
    if (g) {
      const p = this.camera.position, t = this.controls.target;
      p.set(damp(p.x, g.position.x, 6, dt), damp(p.y, g.position.y, 6, dt), damp(p.z, g.position.z, 6, dt));
      t.set(damp(t.x, g.target.x, 6, dt), damp(t.y, g.target.y, 6, dt), damp(t.z, g.target.z, 6, dt));
      if (p.distanceToSquared(g.position) < 1e-6 && t.distanceToSquared(g.target) < 1e-6) this._goal = null;
    }
    this.controls.update();
  }

  dispose() { this._offRenderer(); this.controls.dispose(); }
}
