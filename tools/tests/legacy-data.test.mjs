// Dati e logica pura della v0.2 (script IIFE su DC): devono restare stabili mentre si sviluppa il motore 3D.
import test from 'node:test';
import assert from 'node:assert/strict';
import { exists, loadLegacy, LEGACY_SHARED } from './helpers.mjs';

const DC = loadLegacy([...LEGACY_SHARED, 'extension/src/background/brain.js']);

test('teste fotografiche: 5 ritagli inclusi con metadati validi', () => {
  assert.equal(DC.HEADS.length, 5);
  for (const h of DC.HEADS) {
    assert.match(h.id, /^head_0[1-5]$/);
    assert.ok(exists('extension/' + h.file), h.file);
    assert.ok(h.anchorX > 0 && h.anchorX < 1 && h.anchorY > 0 && h.anchorY <= 1.05 && h.faceW > 0);
    assert.match(h.skin, /^#[0-9a-f]{6}$/i);
  }
  assert.equal(DC.headById('inesistente').id, 'head_04', 'la testa predefinita è head_04');
});

test('outfit SVG: 17 outfit con id unici, il primo gratuito', () => {
  assert.equal(DC.OUTFITS.length, 17);
  assert.equal(new Set(DC.OUTFITS.map((o) => o.id)).size, 17);
  assert.equal(DC.OUTFITS[0].id, 'uniform');
  assert.equal(DC.OUTFITS[0].price, 0);
  assert.deepEqual(Array.from(DC.DEFAULT_STATE.unlockedOutfits), ['uniform']);
  assert.equal(DC.outfitById('inesistente').id, 'uniform');
});

test('capelli e accessori SVG', () => {
  assert.deepEqual(Array.from(DC.HAIR_STYLES, (h) => h.id), ['none', 'long', 'wavy', 'bob', 'twin', 'pony']);
  assert.equal(DC.HAIR_COLORS.length, 9);
  assert.deepEqual(Array.from(DC.ACCESSORIES, (a) => a.id), ['none', 'wings', 'devil', 'fairy', 'cat', 'bow']);
});

test('livelli: levelOf e xpForLevel sono coerenti e monotoni', () => {
  assert.equal(DC.levelOf(0), 1);
  for (let lvl = 1; lvl <= 30; lvl++) {
    assert.equal(DC.levelOf(DC.xpForLevel(lvl)), lvl);
    assert.ok(DC.xpForLevel(lvl + 1) > DC.xpForLevel(lvl));
  }
});

test('umore: derivato dai bisogni', () => {
  const s = (o) => ({ stats: { hunger: 80, energy: 80, happiness: 50, affection: 30, ...o } });
  assert.equal(DC.moodOf(s({}), true), 'sleeping');
  assert.equal(DC.moodOf(s({ energy: 10 })), 'sleepy');
  assert.equal(DC.moodOf(s({ hunger: 10 })), 'hungry');
  assert.equal(DC.moodOf(s({ happiness: 10 })), 'sad');
  assert.equal(DC.moodOf(s({ happiness: 90, affection: 90 })), 'love');
  assert.equal(DC.moodOf(s({ happiness: 65 })), 'happy');
  assert.equal(DC.moodOf(s({})), 'neutral');
});

test('obiettivi: 17 definiti, id unici, verificabili sullo stato iniziale', () => {
  assert.equal(new Set(DC.ACHIEVEMENTS.map((a) => a.id)).size, DC.ACHIEVEMENTS.length);
  const st = DC.clone(DC.DEFAULT_STATE);
  for (const a of DC.ACHIEVEMENTS) assert.equal(a.check(st), false, a.id + ' non deve essere sbloccato all\'inizio');
});

test('negozio: oggetti con prezzo ed effetti sui bisogni', () => {
  for (const [id, it] of Object.entries(DC.ITEMS)) {
    assert.ok(it.price > 0 && it.name && it.icon, id);
    for (const k of Object.keys(it.effect)) assert.ok(k in DC.DEFAULT_STATE.stats, `${id}: effetto su statistica sconosciuta ${k}`);
  }
  for (const id of Object.keys(DC.DEFAULT_STATE.inventory)) assert.ok(DC.ITEMS[id], id);
});

test('impostazioni: mergeDeep conserva i default e i dati salvati dagli utenti', () => {
  const saved = { name: 'Aiko', reminders: { water: 30 }, ai: { enabled: true } };
  const s = DC.mergeDeep(DC.clone(DC.DEFAULT_SETTINGS), saved);
  assert.equal(s.name, 'Aiko');
  assert.equal(s.reminders.water, 30);
  assert.equal(s.reminders.posture, DC.DEFAULT_SETTINGS.reminders.posture);
  assert.equal(s.ai.enabled, true);
  assert.equal(s.ai.model, DC.DEFAULT_SETTINGS.ai.model);
  assert.equal(DC.DEFAULT_SETTINGS.ai.enabled, false, 'l\'IA esterna deve essere disattivata per impostazione predefinita (offline)');
  assert.equal(DC.DEFAULT_SETTINGS.ai.apiKey, '');
});

test('chat offline: calcolatrice senza eval', () => {
  assert.equal(DC.Brain.calc('12*7+3'), 87);
  assert.equal(DC.Brain.calc('(2+3)^2'), 25);
  assert.equal(DC.Brain.calc('10:4'), 2.5);
  assert.equal(DC.Brain.calc('3x3'), 9);
  assert.equal(DC.Brain.calc('alert(1)'), null);
  assert.equal(DC.Brain.calc('1/0'), null);
});

test('chat offline: risponde sempre con una frase', () => {
  const ctx = { user: 'Mario', name: 'Yume', stats: DC.DEFAULT_STATE.stats, level: 1, coins: 40, mood: 'happy', page: null };
  for (const q of ['ciao', 'quanto fa 2+2?', 'che ore sono?', 'raccontami una barzelletta', 'come stai?', 'zxcvbnm qwerty']) {
    const r = DC.Brain.reply(q, ctx);
    assert.equal(typeof r, 'string');
    assert.ok(r.length > 1, q);
  }
  assert.match(DC.Brain.reply('quanto fa 2+2?', ctx), /4/);
});
