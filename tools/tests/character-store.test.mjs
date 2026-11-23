// Persistenza della definizione di personaggio (`dc_avatar`): lettura, migrazione dalla v0.2 e scrittura normalizzata.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCharacter, saveCharacter, AVATAR_KEY } from '../../extension/src/engine3d/save/character-store.js';
import { defaultCharacter, CHARACTER_VERSION } from '../../extension/src/engine3d/core/character-def.js';

/** chrome.storage.local minimo, in memoria. */
function fakeChrome(initial = {}) {
  const data = { ...initial };
  globalThis.chrome = { storage: { local: {
    async get(keys) { const out = {}; for (const k of [].concat(keys)) if (k in data) out[k] = JSON.parse(JSON.stringify(data[k])); return out; },
    async set(obj) { for (const [k, v] of Object.entries(obj)) data[k] = JSON.parse(JSON.stringify(v)); }
  } } };
  return data;
}

test('installazione nuova senza impostazioni: personaggio predefinito', async () => {
  fakeChrome();
  const r = await loadCharacter();
  assert.equal(r.source, 'default');
  assert.deepEqual(r.def, defaultCharacter());
});

test('utente v0.2: la definizione nasce dalle sue impostazioni e conserva la testa fotografica', async () => {
  const data = fakeChrome({ dc_settings: { headId: 'custom_abc', outfitId: 'miko', hairStyle: 'twin', hairColor: '#f4a6c8', accessory: 'cat' } });
  const r = await loadCharacter();
  assert.equal(r.source, 'migrated');
  assert.equal(r.def.head.mode, 'photo');
  assert.equal(r.def.head.photoId, 'custom_abc');
  assert.equal(r.def.hair.style, 'twintail');
  assert.equal(r.def.hair.color, '#f4a6c8');
  assert.equal(r.def.v, CHARACTER_VERSION);
  assert.ok(!(AVATAR_KEY in data), 'la lettura non deve scrivere nulla');
  assert.deepEqual(data.dc_settings.headId, 'custom_abc', 'le impostazioni v0.2 restano intatte');
});

test('salvataggio: scrive la definizione normalizzata e la rilegge identica', async () => {
  const data = fakeChrome({ dc_settings: { hairStyle: 'long' } });
  const def = (await loadCharacter()).def;
  def.hair.style = 'bun';
  def.body = { height: 9 };          // fuori scala → limitato
  def.eyes.color = 'non-un-colore';  // non valido → sostituito
  const saved = await saveCharacter(def);
  assert.equal(saved.body.height, 1);
  assert.equal(saved.eyes.color, defaultCharacter().eyes.color);
  assert.deepEqual(data[AVATAR_KEY], saved);
  const again = await loadCharacter();
  assert.equal(again.source, 'saved');
  assert.deepEqual(again.def, saved);
  assert.equal(again.def.hair.style, 'bun');
});

test('dato salvato corrotto: viene normalizzato, mai propagato', async () => {
  fakeChrome({ [AVATAR_KEY]: { v: 99, head: { mode: 'boh' }, outfit: { top: { item: 5 } }, hair: { color: 'x' } } });
  const r = await loadCharacter();
  assert.equal(r.source, 'saved');
  assert.equal(r.def.v, CHARACTER_VERSION);
  assert.equal(r.def.head.mode, '3d');
  assert.deepEqual(r.def.outfit, {});
  assert.equal(r.def.hair.color, defaultCharacter().hair.color);
});
