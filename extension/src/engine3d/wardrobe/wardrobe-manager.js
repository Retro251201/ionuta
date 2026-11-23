// Wardrobe Manager: guardaroba a SLOT INDIPENDENTI. Ogni slot ospita al più un capo; indossare, cambiare o togliere
// un capo non tocca gli altri slot. I capi sono costruiti dalla Garment Forge sullo scheletro del corpo, quindi ne
// seguono animazioni e proporzioni. Dopo ogni modifica il manager aggiorna:
//  · la maschera del corpo (i triangoli di pelle coperti non vengono disegnati → nessuna compenetrazione),
//  · il rimbocco dei capi "sopra" nella vita del capo "sotto",
//  · la quota del personaggio rispetto al pavimento (piedi nudi o suola delle scarpe).
// Regole di compatibilità tra slot (vestito intero, capospalla…) → wardrobe/outfit-compat.js (milestone M4).
import { THREE } from '../lib.js';
import { Emitter } from '../core/events.js';
import { BodyModel } from './forge/body-model.js';
import { buildGarment } from './forge/garment-builder.js';
import { ITEM_BY_ID, SLOTS } from './catalog/index.js';

const SLOT_IDS = new Set(SLOTS.map((s) => s.id));
const HIDE_MARGIN = 0.012; // metri di copertura oltre i quali la pelle sotto un capo viene nascosta

export class WardrobeManager extends Emitter {
  /** @param {{avatar: import('../avatar/avatar-loader.js').Avatar, materials: import('../material/material-system.js').MaterialSystem}} opts */
  constructor({ avatar, materials }) {
    super();
    this.avatar = avatar;
    this.materials = materials;
    this.model = new BodyModel(avatar);
    this.worn = new Map(); // slot → {item, config, garment}
    const geo = avatar.bodyMesh.geometry;
    this._fullIndex = geo.index.array.slice();
    // un solo buffer di indici riusato a ogni cambio (niente buffer GPU orfani)
    this._index = new THREE.BufferAttribute(this._fullIndex.slice(), 1);
    geo.setIndex(this._index);
    this.groundOffset = -this.model.M.soleY;
    this.footPitch = 0;
  }

  /** Stato corrente nel formato della definizione di personaggio: {slot: {item, colors?, pattern?, material?, params?}}. */
  get outfit() {
    const o = {};
    for (const [slot, w] of this.worn) o[slot] = { item: w.item.id, ...w.config };
    return o;
  }
  itemIn(slot) { const w = this.worn.get(slot); return w ? w.item.id : null; }

  /** Indossa un capo nel suo slot (sostituendo l'eventuale capo presente). Gli altri slot restano come sono. */
  equip(slot, itemId, config = {}) {
    const item = ITEM_BY_ID[itemId];
    if (!SLOT_IDS.has(slot)) return { ok: false, error: 'slot sconosciuto: ' + slot };
    if (!item) return { ok: false, error: 'capo non presente nel catalogo: ' + itemId };
    if (item.slot !== slot) return { ok: false, error: `${itemId} si indossa nello slot ${item.slot}` };
    this._remove(slot);
    this._wear(slot, item, config);
    this._rebuildDependents(slot);
    this._refresh();
    this.emit('change', { slot, item: itemId });
    return { ok: true };
  }

  unequip(slot) {
    if (!this.worn.has(slot)) return { ok: false, error: 'slot vuoto' };
    this._remove(slot);
    this._rebuildDependents(slot);
    this._refresh();
    this.emit('change', { slot, item: null });
    return { ok: true };
  }

  /** Applica un outfit completo cambiando solo gli slot diversi. Le voci non valide vengono saltate e riportate. */
  setOutfit(outfit = {}) {
    const errors = [];
    for (const slot of Array.from(this.worn.keys())) if (!outfit[slot]) this._remove(slot);
    for (const [slot, e] of Object.entries(outfit)) {
      if (!e || !e.item) continue;
      const { item: id, ...config } = e;
      const cur = this.worn.get(slot);
      if (cur && cur.item.id === id && JSON.stringify(cur.config) === JSON.stringify(config)) continue;
      const item = ITEM_BY_ID[id];
      if (!item || item.slot !== slot || !SLOT_IDS.has(slot)) { errors.push({ slot, item: id }); continue; }
      this._remove(slot);
      this._wear(slot, item, config);
    }
    for (const slot of ['bottom']) this._rebuildDependents(slot);
    this._refresh();
    this.emit('change', { slot: null });
    return { ok: errors.length === 0, errors };
  }

  // Ricetta adattata al contesto: un "sopra" rimboccabile entra nella vita del capo "sotto" indossato.
  _contextual(item) {
    if (item.slot !== 'top') return item;
    const bottom = this.worn.get('bottom'), waist = bottom && bottom.item.waist;
    if (!waist || !item.recipe.parts.some((p) => p.tuckable)) return item;
    return { ...item, recipe: { ...item.recipe, parts: item.recipe.parts.map((p) => (p.tuckable ? { ...p, tuckAt: waist } : p)) } };
  }

  _wear(slot, item, config) {
    const garment = buildGarment(this.model, this._contextual(item), config, this.materials);
    if (garment.mesh) this.avatar.bodyMesh.parent.add(garment.mesh);
    this.worn.set(slot, { item, config, garment });
  }

  _remove(slot) {
    const w = this.worn.get(slot);
    if (!w) return;
    const g = w.garment;
    if (g.mesh) { if (g.mesh.parent) g.mesh.parent.remove(g.mesh); g.mesh.geometry.dispose(); }
    this.materials.release(g.materials);
    this.worn.delete(slot);
  }

  _rebuildDependents(changed) {
    if (changed !== 'bottom') return;
    const top = this.worn.get('top');
    if (top && top.item.recipe.parts.some((p) => p.tuckable)) { this._remove('top'); this._wear('top', top.item, top.config); }
  }

  _refresh() {
    // --- maschera del corpo ---
    const full = this._fullIndex, out = this._index.array, hides = [];
    for (const w of this.worn.values()) if (w.garment.hide) hides.push(w.garment.hide);
    let n = 0;
    for (let t = 0; t < full.length; t += 3) {
      const a = full[t], b = full[t + 1], c = full[t + 2];
      let covered = false;
      for (const h of hides) if (h[a] > HIDE_MARGIN && h[b] > HIDE_MARGIN && h[c] > HIDE_MARGIN) { covered = true; break; }
      if (!covered) { out[n++] = a; out[n++] = b; out[n++] = c; }
    }
    this._index.needsUpdate = true;
    const body = this.avatar.bodyMesh, geo = body.geometry, mats = Array.isArray(body.material) ? body.material : [body.material];
    geo.clearGroups();
    mats.forEach((_, k) => geo.addGroup(0, n, k));
    geo.setDrawRange(0, n);
    this.visibleBodyTriangles = n / 3;
    // --- quota rispetto al pavimento ---
    const shoes = this.worn.get('shoes'), foot = shoes && shoes.garment.foot;
    this.groundOffset = (foot ? foot.lift : 0) - this.model.M.soleY;
    this.footPitch = foot ? foot.pitch : 0;
  }

  /** Triangoli totali dei capi indossati (per le statistiche di prestazione). */
  get triangles() { let n = 0; for (const w of this.worn.values()) n += w.garment.stats.tris || 0; return n; }

  dispose() {
    for (const slot of Array.from(this.worn.keys())) this._remove(slot);
    this._refresh();
  }
}
