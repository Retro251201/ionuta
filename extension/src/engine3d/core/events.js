// Emettitore di eventi minimale usato da tutti i moduli del motore.
export class Emitter {
  constructor() { this._l = new Map(); }
  on(type, fn) {
    if (!this._l.has(type)) this._l.set(type, new Set());
    this._l.get(type).add(fn);
    return () => this.off(type, fn);
  }
  off(type, fn) { const s = this._l.get(type); if (s) s.delete(fn); }
  emit(type, data) {
    const s = this._l.get(type);
    if (!s) return;
    for (const fn of Array.from(s)) { try { fn(data); } catch (e) { console.error('[DC3D] listener', type, e); } }
  }
}

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
/** Smorzamento esponenziale indipendente dal frame rate. */
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
