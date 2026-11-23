// Definizione di personaggio 1.0: default, normalizzazione di input non fidato (backup importati) e migrazione v0.2.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTER_VERSION, defaultCharacter, normalizeCharacter, migrateLegacyAvatar, characterItemIds } from '../../extension/src/engine3d/core/character-def.js';
import { ITEM_BY_ID, SLOTS } from '../../extension/src/engine3d/wardrobe/catalog/index.js';

test('default: versione, modalità testa e outfit iniziale presente nel catalogo', () => {
  const d = defaultCharacter();
  assert.equal(d.v, CHARACTER_VERSION);
  assert.equal(d.head.mode, 'photo', 'il volto predefinito è la foto originale');
  assert.equal(d.head.photoId, 'head_02');
  const slots = new Set(SLOTS.map((s) => s.id));
  for (const [slot, e] of Object.entries(d.outfit)) {
    assert.ok(slots.has(slot), 'slot sconosciuto: ' + slot);
    assert.ok(ITEM_BY_ID[e.item], 'capo iniziale non in catalogo: ' + e.item);
    assert.equal(ITEM_BY_ID[e.item].slot, slot);
  }
  assert.notEqual(defaultCharacter().outfit, d.outfit, 'ogni chiamata restituisce una copia');
});

test('migrazione v1 → v2: il viso anime salvato dalla v1 torna alla testa fotografica; v2 rispetta la scelta', () => {
  assert.equal(normalizeCharacter({ v: 1, head: { mode: '3d', photoId: 'head_02' } }).head.mode, 'photo');
  assert.equal(normalizeCharacter({ v: 1, head: { mode: '3d', photoId: 'head_02' } }).head.photoId, 'head_02');
  assert.equal(normalizeCharacter({ v: 2, head: { mode: '3d' } }).head.mode, '3d');
  assert.equal(normalizeCharacter({ v: 2, head: { mode: 'photo', photoId: 42 } }).head.photoId, 'head_04');
});

test('normalizzazione: input non valido → default completo', () => {
  for (const bad of [null, undefined, 42, 'x', []]) assert.deepEqual(normalizeCharacter(bad), defaultCharacter());
});

test('normalizzazione: slider limitati a [-1, 1], valori non numerici scartati', () => {
  const d = normalizeCharacter({ body: { height: 5, waist: -9, bad: 'x', nan: NaN }, face: { eyes: 0.25 } });
  assert.deepEqual(d.body, { height: 1, waist: -1 });
  assert.deepEqual(d.face, { eyes: 0.25 });
});

test('normalizzazione: colori non validi sostituiti, modalità testa sconosciuta → 3d', () => {
  const d = normalizeCharacter({ eyes: { color: 'red' }, hair: { color: '#12345' }, skin: { tone: '#abcdef' }, head: { mode: 'hologram' }, v: CHARACTER_VERSION });
  const def = defaultCharacter();
  assert.equal(d.eyes.color, def.eyes.color);
  assert.equal(d.hair.color, def.hair.color);
  assert.equal(d.skin.tone, '#abcdef');
  assert.equal(d.head.mode, '3d');
  assert.equal(normalizeCharacter({ head: { mode: 'photo', photoId: 'custom_x' } }).head.mode, 'photo');
});

test('normalizzazione: outfit ripulito (voci e colori non validi rimossi, stringhe limitate)', () => {
  const d = normalizeCharacter({ outfit: {
    top: { item: 'top_tshirt_basic', colors: { main: '#ff0000', bad: 'rosso' }, pattern: 'x'.repeat(100), params: { len: 0.4, bad: 'no' } },
    bottom: 'gonna', shoes: { item: 42 }, legwear: { item: 'y'.repeat(200) }
  } });
  assert.deepEqual(Object.keys(d.outfit).sort(), ['legwear', 'top']);
  assert.deepEqual(d.outfit.top.colors, { main: '#ff0000' });
  assert.equal(d.outfit.top.pattern.length, 32);
  assert.deepEqual(d.outfit.top.params, { len: 0.4 });
  assert.equal(d.outfit.legwear.item.length, 64);
  assert.deepEqual(normalizeCharacter({ outfit: {} }).outfit, {}, 'un outfit vuoto esplicito resta vuoto');
});

test('migrazione v0.2: la testa fotografica resta la modalità attiva e i capelli vengono mappati', () => {
  const d = migrateLegacyAvatar({ headId: 'custom_abc', outfitId: 'maid', hairStyle: 'twin', hairColor: '#f4a6c8', accessory: 'cat' });
  assert.equal(d.head.mode, 'photo');
  assert.equal(d.head.photoId, 'custom_abc');
  assert.equal(d.head.photoHair, true);
  assert.equal(d.hair.style, 'twintail');
  assert.equal(d.hair.color, '#f4a6c8');
  assert.deepEqual(d.legacy, { outfitId: 'maid', accessory: 'cat' });
  const none = migrateLegacyAvatar({ hairStyle: 'none' });
  assert.equal(none.head.photoHair, false);
  assert.equal(migrateLegacyAvatar(undefined).head.photoId, 'head_04');
  assert.deepEqual(normalizeCharacter(d).head, d.head, 'il risultato della migrazione è già normalizzato');
});

test('characterItemIds: elenco dei capi indossati', () => {
  assert.deepEqual(characterItemIds({ outfit: { top: { item: 'a' }, bottom: null, shoes: { item: 'b' } } }), ['a', 'b']);
  assert.deepEqual(characterItemIds(null), []);
});
