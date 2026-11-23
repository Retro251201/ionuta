// Catalogo del guardaroba (dati puri): tassonomia valida, id unici, capi iniziali e migrazione v0.2 coerenti.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SLOTS, STYLES, CATEGORIES, ITEMS, ITEM_BY_ID, STARTER_ITEMS, itemInfo, legacyOutfitItems } from '../../extension/src/engine3d/wardrobe/catalog/index.js';
import { RARITIES } from '../../extension/src/engine3d/wardrobe/catalog/taxonomy.js';
import { loadLegacy } from './helpers.mjs';

const slotIds = new Set(SLOTS.map((s) => s.id)), styleIds = new Set(STYLES.map((s) => s.id));
const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])), rarityIds = new Set(RARITIES.map((r) => r.id));

test('tassonomia: slot, categorie e stili con id unici; ogni categoria punta a uno slot esistente', () => {
  assert.equal(slotIds.size, SLOTS.length);
  assert.equal(styleIds.size, STYLES.length);
  assert.equal(Object.keys(catById).length, CATEGORIES.length);
  assert.equal(STYLES.length, 30, 'le 30 famiglie di stile richieste');
  for (const c of CATEGORIES) assert.ok(slotIds.has(c.slot), `categoria ${c.id}: slot ${c.slot}`);
  for (const s of SLOTS) assert.ok(s.name && s.icon && typeof s.layer === 'number', s.id);
});

test('capi: id unici e campi validi', () => {
  assert.equal(new Set(ITEMS.map((i) => i.id)).size, ITEMS.length);
  for (const it of ITEMS) {
    assert.match(it.id, /^[a-z0-9_]+$/);
    assert.ok(it.name, it.id);
    assert.ok(slotIds.has(it.slot), `${it.id}: slot ${it.slot}`);
    assert.ok(catById[it.category], `${it.id}: categoria ${it.category}`);
    assert.ok(it.styles.length > 0 && it.styles.every((s) => styleIds.has(s)), `${it.id}: stili ${it.styles}`);
    assert.ok(Number.isInteger(it.price) && it.price >= 0, it.id);
    assert.ok(rarityIds.has(it.rarity || 'common'), it.id);
    assert.equal(ITEM_BY_ID[it.id], it);
  }
});

test('capi iniziali: gratuiti e di livello 1', () => {
  assert.ok(STARTER_ITEMS.length >= 6);
  for (const id of STARTER_ITEMS) assert.deepEqual({ price: itemInfo(id).price, level: itemInfo(id).level }, { price: 0, level: 1 });
  assert.equal(itemInfo('inesistente'), null);
});

test('nessun capo fittizio: ogni voce ha una ricetta costruibile e colori validi', () => {
  const PART_TYPES = new Set(['shell', 'skirt', 'shoe', 'sleeves']);
  for (const it of ITEMS) {
    assert.ok(it.recipe && Array.isArray(it.recipe.parts) && it.recipe.parts.length > 0, it.id + ': ricetta mancante');
    for (const p of it.recipe.parts) assert.ok(PART_TYPES.has(p.type), `${it.id}: tipo di parte sconosciuto "${p.type}"`);
    assert.ok(Array.isArray(it.colors) && it.colors.length > 0, it.id + ': colori mancanti');
    assert.equal(it.colors[0].key, 'main', it.id);
    for (const c of it.colors) { assert.ok(c.key && c.name, it.id); assert.match(c.default, /^#[0-9a-f]{6}$/i, `${it.id}.${c.key}`); }
    if (it.waist) assert.equal(it.slot, 'bottom', it.id + ': solo i capi "sotto" dichiarano la vita');
  }
});

test('migrazione v0.2: gli outfit mappati esistono sia nel catalogo 1.0 sia tra gli outfit SVG', () => {
  const DC = loadLegacy();
  const legacyIds = new Set(DC.OUTFITS.map((o) => o.id));
  for (const id of ['uniform', 'hoodie', 'maid']) {
    assert.ok(legacyIds.has(id));
    for (const item of legacyOutfitItems(id)) assert.ok(ITEM_BY_ID[item], item);
  }
  assert.ok(legacyOutfitItems('uniform').length >= 4);
  assert.deepEqual(legacyOutfitItems('inesistente'), []);
});
