// Look Controller: il personaggio segue con lo sguardo il cursore (o un punto qualsiasi) con un piccolo ritardo
// naturale. Collo e testa ruotano sopra l'animazione in corso (rotazione aggiuntiva sulle ossa normalizzate, dopo
// il mixer); con il viso 3D anche gli occhi seguono il bersaglio tramite il LookAt del VRM. Senza input per un
// po' lo sguardo torna verso l'utente con piccoli spostamenti casuali (saccadi lente).
import { THREE } from '../lib.js';
import { damp } from '../core/events.js';
import { eulerToQuat } from './clips.js';

const MAX_YAW = 32, MAX_PITCH = 18;           // gradi complessivi (collo + testa)
const SPLIT = { neck: 0.4, head: 0.6 };
const IDLE_AFTER = 3.5;                         // secondi senza movimenti prima di tornare a guardare l'utente

export class LookController {
  /** @param {{avatar: import('../avatar/avatar-loader.js').Avatar, random?: () => number}} o */
  constructor({ avatar, random = Math.random }) {
    this.avatar = avatar;
    this.random = random;
    this.enabled = true;
    this.strength = 1;            // 0..1 (le clip possono attenuare lo sguardo)
    this.target = { x: 0, y: 0 }; // -1..1, coordinate dello schermo (destra +, su +)
    this.value = { x: 0, y: 0 };
    this._idle = 0;
    this._wander = { x: 0, y: 0, t: 1.5 };
    const h = avatar.humanoid;
    this.nodes = { neck: h.getNormalizedBoneNode('neck'), head: h.getNormalizedBoneNode('head') };
    this._q = new THREE.Quaternion();
    this._eyeTarget = new THREE.Object3D();
    const lk = avatar.vrm.lookAt;
    if (lk) { lk.autoUpdate = true; lk.target = this._eyeTarget; }
  }

  /** Bersaglio in coordinate normalizzate dello schermo (-1..1). */
  lookAt(x, y) {
    this.target.x = Math.max(-1, Math.min(1, x));
    this.target.y = Math.max(-1, Math.min(1, y));
    this._idle = 0;
  }

  /** Bersaglio da un evento del puntatore rispetto a un elemento (di solito il canvas). */
  pointer(e, el) {
    const r = el.getBoundingClientRect();
    // il viso sta nel terzo superiore dell'inquadratura: il centro dello sguardo è lì, non al centro del canvas
    this.lookAt(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1) + 0.45);
  }

  update(dt, camera) {
    this._idle += dt;
    let tx = this.target.x, ty = this.target.y;
    if (this._idle > IDLE_AFTER) {
      const w = this._wander;
      w.t -= dt;
      if (w.t <= 0) { w.x = (this.random() - 0.5) * 0.35; w.y = (this.random() - 0.5) * 0.2; w.t = 1.2 + this.random() * 2.8; }
      tx = w.x; ty = w.y;
    }
    const k = this.enabled ? this.strength : 0;
    // ritardo naturale: la testa insegue il bersaglio con uno smorzamento morbido
    this.value.x = damp(this.value.x, tx * k, 5, dt);
    this.value.y = damp(this.value.y, ty * k, 5, dt);
    const flip = this.avatar.isVRM0 ? -1 : 1;
    for (const [bone, share] of Object.entries(SPLIT)) {
      const node = this.nodes[bone];
      if (!node) continue;
      const q = eulerToQuat(-this.value.y * MAX_PITCH * share, this.value.x * MAX_YAW * share, 0, 'YXZ');
      this._q.set(q[0] * flip, q[1], q[2] * flip, q[3]);
      node.quaternion.multiply(this._q);
    }
    // occhi (solo viso 3D): un punto davanti alla camera, spostato verso il bersaglio
    if (camera && this.avatar.vrm.lookAt) {
      const head = this.avatar.bones.head.getWorldPosition(new THREE.Vector3());
      const toCam = camera.position.clone().sub(head);
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), toCam).normalize();
      this._eyeTarget.position.copy(camera.position)
        .addScaledVector(right, this.value.x * toCam.length() * 0.6)
        .addScaledVector(new THREE.Vector3(0, 1, 0), this.value.y * toCam.length() * 0.4);
      this._eyeTarget.updateMatrixWorld();
    }
  }
}
