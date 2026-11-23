// Catalogo del guardaroba: DATI PURI (nessuna dipendenza da three.js) così da poter essere importato anche dal
// service worker per prezzi, livelli e possesso. Le "recipe" sono interpretate dalla Garment Forge.
// API stabile: SLOTS, ITEMS, ITEM_BY_ID, STARTER_ITEMS, itemInfo(id), legacyOutfitItems(outfitId).
import { SLOTS, STYLES, CATEGORIES } from './taxonomy.js';
import { ALL_ITEMS, LEGACY_OUTFITS, PRESET_LOOKS } from './items.js';

export { SLOTS, STYLES, CATEGORIES, PRESET_LOOKS };

export const ITEMS = ALL_ITEMS;
export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

/** Capi gratuiti disponibili dal primo avvio (prezzo 0 e nessun requisito di livello). */
export const STARTER_ITEMS = ITEMS.filter((i) => !i.price && (i.level || 1) <= 1).map((i) => i.id);

/** Dati economici di un capo: {id, slot, price, level, rarity} oppure null se non esiste. */
export function itemInfo(id) {
  const i = ITEM_BY_ID[id];
  return i ? { id: i.id, slot: i.slot, price: i.price || 0, level: i.level || 1, rarity: i.rarity || 'common' } : null;
}

/** Capi 1.0 equivalenti a un outfit della v0.2 (migrazione di ciò che l'utente aveva già sbloccato). */
export function legacyOutfitItems(outfitId) { return (LEGACY_OUTFITS[outfitId] || []).filter((id) => ITEM_BY_ID[id]); }
