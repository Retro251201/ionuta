// Definizione di personaggio: l'unico oggetto JSON necessario per ricostruire l'aspetto completo
// (corpo, viso, capelli, pelle, outfit, testa fotografica). Dati puri: importabile anche dal service worker.
// API stabile: CHARACTER_VERSION, defaultCharacter(), normalizeCharacter(def), migrateLegacyAvatar(settings),
// characterItemIds(def).
export const CHARACTER_VERSION = 1;

const DEFAULT_OUTFIT = {
  underTop: { item: 'under_bra_basic' }, underBottom: { item: 'under_brief_basic' },
  top: { item: 'top_tshirt_basic' }, bottom: { item: 'bottom_skirt_pleated' },
  legwear: { item: 'legwear_socks_knee' }, shoes: { item: 'shoes_loafers' }
};

export function defaultCharacter() {
  return {
    v: CHARACTER_VERSION,
    head: { mode: '3d', photoId: 'head_04', photoHair: true, photoScale: 1 }, // mode: '3d' | 'photo'
    body: {},      // id slider → valore (vedi custom/body-sliders.js); assente = default
    face: {},      // id slider → valore (vedi custom/face-sliders.js)
    eyes: { color: '#7a4a2a', style: 'default' },
    brows: { color: '#3a2a33' },
    makeup: { blush: 0.25, blushColor: '#ff8fa3', lips: 0, lipColor: '#d9455f', shadow: 0, shadowColor: '#7a5a9a', liner: 0.5 },
    skin: { tone: '#f6d3c0' },
    hair: { style: 'long', color: '#3a2a33', tipColor: null, streakColor: null, streakAmount: 0 },
    expression: 'neutral',
    outfit: JSON.parse(JSON.stringify(DEFAULT_OUTFIT))
  };
}

const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);
const HEX = /^#[0-9a-fA-F]{6}$/;

function merge(base, over) {
  if (!isObj(over)) return base;
  for (const k of Object.keys(over)) {
    if (isObj(over[k]) && isObj(base[k])) merge(base[k], over[k]);
    else base[k] = over[k];
  }
  return base;
}

/** Completa i campi mancanti, scarta valori non validi e limita le dimensioni (input non fidato: backup importati). */
export function normalizeCharacter(def) {
  const d = defaultCharacter();
  if (!isObj(def)) return d;
  const outfit = isObj(def.outfit) ? def.outfit : null;
  merge(d, { ...def, outfit: undefined });
  d.v = CHARACTER_VERSION;
  if (d.head.mode !== 'photo') d.head.mode = '3d';
  for (const grp of ['body', 'face']) {
    const clean = {};
    for (const [k, v] of Object.entries(isObj(d[grp]) ? d[grp] : {})) if (typeof v === 'number' && isFinite(v) && k.length < 40) clean[k] = Math.max(-1, Math.min(1, v));
    d[grp] = clean;
  }
  for (const [o, k] of [[d.eyes, 'color'], [d.brows, 'color'], [d.skin, 'tone'], [d.hair, 'color']]) if (!HEX.test(o[k] || '')) o[k] = defaultCharacter()[o === d.eyes ? 'eyes' : o === d.brows ? 'brows' : o === d.skin ? 'skin' : 'hair'][k];
  if (outfit) {
    d.outfit = {};
    for (const [slot, e] of Object.entries(outfit)) {
      if (!isObj(e) || typeof e.item !== 'string' || slot.length > 24) continue;
      const entry = { item: e.item.slice(0, 64) };
      if (isObj(e.colors)) { entry.colors = {}; for (const [k, v] of Object.entries(e.colors)) if (HEX.test(v) && k.length < 24) entry.colors[k] = v; }
      if (typeof e.pattern === 'string') entry.pattern = e.pattern.slice(0, 32);
      if (typeof e.material === 'string') entry.material = e.material.slice(0, 32);
      if (isObj(e.params)) { entry.params = {}; for (const [k, v] of Object.entries(e.params)) if (typeof v === 'number' && isFinite(v) && k.length < 24) entry.params[k] = v; }
      d.outfit[slot] = entry;
    }
  }
  return d;
}

/** id dei capi indossati */
export function characterItemIds(def) {
  return Object.values((def && def.outfit) || {}).map((e) => e && e.item).filter(Boolean);
}

const LEGACY_HAIR = { none: null, long: 'long', wavy: 'layered', bob: 'mushroom', twin: 'twintail', pony: 'bun' };

/** Impostazioni v0.2 (headId, outfitId, hairStyle, hairColor, accessory) → definizione 1.0.
 *  Chi aggiorna dalla v0.2 conserva la propria testa fotografica come modalità attiva. */
export function migrateLegacyAvatar(settings) {
  const d = defaultCharacter();
  const s = settings || {};
  d.head.mode = 'photo';
  if (typeof s.headId === 'string') d.head.photoId = s.headId;
  d.head.photoHair = s.hairStyle !== 'none';
  if (LEGACY_HAIR[s.hairStyle]) d.hair.style = LEGACY_HAIR[s.hairStyle];
  if (HEX.test(s.hairColor || '')) d.hair.color = s.hairColor;
  d.legacy = { outfitId: s.outfitId || 'uniform', accessory: s.accessory || 'none' };
  return d;
}
