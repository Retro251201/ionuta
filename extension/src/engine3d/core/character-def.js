// Definizione di personaggio: l'unico oggetto JSON necessario per ricostruire l'aspetto completo
// (corpo, viso, capelli, pelle, outfit, testa fotografica). Dati puri: importabile anche dal service worker.
// API stabile: CHARACTER_VERSION, defaultCharacter(), normalizeCharacter(def), migrateLegacyAvatar(settings),
// characterItemIds(def).
// v2: la testa fotografica (il volto dell'utente) è la modalità predefinita anche nel renderer 3D.
export const CHARACTER_VERSION = 3;

/** Modelli selezionabili nel menu. kind 'full' = personaggio completo CC0 (corpo, viso, capelli, vestiti già
 *  pronti: sopra ci va solo il volto fotografico); kind 'base' = corpo personalizzabile con guardaroba e capelli. */
export const CHARACTER_MODELS = [
  { id: 'vivi', name: 'Vivi', file: 'avatar/models/vivi.vrm', kind: 'full' },
  { id: 'victoria', name: 'Victoria', file: 'avatar/models/victoria.vrm', kind: 'full' },
  { id: 'vita', name: 'Vita', file: 'avatar/models/vita.vrm', kind: 'full' },
  { id: 'shino', name: 'Shino', file: 'avatar/models/shino.vrm', kind: 'full' },
  { id: 'female', name: 'Corpo personalizzabile', file: 'avatar/female.vrm', kind: 'base' }
];
export const MODEL_BY_ID = Object.fromEntries(CHARACTER_MODELS.map((m) => [m.id, m]));
export const DEFAULT_MODEL = 'vivi';

const DEFAULT_OUTFIT = {
  underTop: { item: 'bra_lace' }, underBottom: { item: 'panties_lace' },
  top: { item: 'top_crop' }, bottom: { item: 'bottom_mini' },
  legwear: { item: 'legwear_thigh_highs' }, shoes: { item: 'shoes_ankle_boots' }
};

export function defaultCharacter() {
  return {
    v: CHARACTER_VERSION,
    model: DEFAULT_MODEL, // quale personaggio/corpo (vedi CHARACTER_MODELS)
    head: { mode: 'photo', photoId: 'head_04', photoHair: true, photoScale: 1 }, // mode: '3d' | 'photo'
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
  const from = Number.isInteger(def.v) ? def.v : 1;
  merge(d, { ...def, outfit: undefined });
  d.v = CHARACTER_VERSION;
  if (typeof d.model !== 'string' || !MODEL_BY_ID[d.model]) d.model = DEFAULT_MODEL;
  // v1 → v2: fino alla v1 il 3D non sapeva mostrare la foto e salvava sempre il viso anime: si passa alla foto
  if (from < 2) d.head.mode = 'photo';
  if (d.head.mode !== 'photo') d.head.mode = '3d';
  if (typeof d.head.photoId !== 'string' || d.head.photoId.length > 64) d.head.photoId = 'head_04';
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
  d.model = 'female'; // chi arriva dalla v0.2 aveva capelli e outfit scelti: resta sul corpo personalizzabile
  d.head.mode = 'photo';
  if (typeof s.headId === 'string') d.head.photoId = s.headId;
  d.head.photoHair = s.hairStyle !== 'none';
  if (LEGACY_HAIR[s.hairStyle]) d.hair.style = LEGACY_HAIR[s.hairStyle];
  if (HEX.test(s.hairColor || '')) d.hair.color = s.hairColor;
  d.legacy = { outfitId: s.outfitId || 'uniform', accessory: s.accessory || 'none' };
  return d;
}
