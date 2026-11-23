// Ponte di persistenza della definizione di personaggio (chiave `dc_avatar`). È l'unico punto del motore 3D che
// tocca lo storage: nell'estensione usa chrome.storage.local, nel banco di prova (pagina servita in locale)
// ripiega su localStorage. Ogni lettura e ogni scrittura passa da normalizeCharacter (input non fidato).
import { normalizeCharacter, defaultCharacter, migrateLegacyAvatar } from '../core/character-def.js';

export const AVATAR_KEY = 'dc_avatar';
const SETTINGS_KEY = 'dc_settings';

const store = () => (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local ? chrome.storage.local : null);

/**
 * Definizione salvata; alla prima apertura chi arriva dalla v0.2 la ottiene dalle proprie impostazioni
 * (testa fotografica e capelli scelti), gli altri ricevono il personaggio predefinito.
 * @returns {Promise<{def: object, source: 'saved'|'migrated'|'default'}>}
 */
export async function loadCharacter() {
  const s = store();
  if (!s) {
    try { const raw = localStorage.getItem(AVATAR_KEY); if (raw) return { def: normalizeCharacter(JSON.parse(raw)), source: 'saved' }; } catch (e) { /* dato corrotto → default */ }
    return { def: defaultCharacter(), source: 'default' };
  }
  const r = await s.get([AVATAR_KEY, SETTINGS_KEY]);
  if (r[AVATAR_KEY]) return { def: normalizeCharacter(r[AVATAR_KEY]), source: 'saved' };
  if (r[SETTINGS_KEY]) return { def: normalizeCharacter(migrateLegacyAvatar(r[SETTINGS_KEY])), source: 'migrated' };
  return { def: defaultCharacter(), source: 'default' };
}

/** Salva la definizione normalizzata e la restituisce. */
export async function saveCharacter(def) {
  const d = normalizeCharacter(def);
  const s = store();
  if (s) await s.set({ [AVATAR_KEY]: d }); else localStorage.setItem(AVATAR_KEY, JSON.stringify(d));
  return d;
}
