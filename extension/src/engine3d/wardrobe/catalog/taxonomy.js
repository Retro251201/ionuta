// Tassonomia del guardaroba: slot (dove si indossa), categorie (cosa è) e famiglie di stile (estetica).
// Dati puri, usati da catalogo, regole di compatibilità e interfaccia.

/** Slot indipendenti: ogni slot ospita al più un capo. `layer` ordina la sovrapposizione (più alto = più esterno). */
export const SLOTS = [
  { id: 'underTop', name: 'Intimo sopra', icon: '🩱', layer: 1, group: 'intimo' },
  { id: 'underBottom', name: 'Intimo sotto', icon: '🩲', layer: 1, group: 'intimo' },
  { id: 'legwear', name: 'Calze e collant', icon: '🧦', layer: 2, group: 'gambe' },
  { id: 'top', name: 'Sopra', icon: '👚', layer: 4, group: 'vestiti' },
  { id: 'bottom', name: 'Sotto', icon: '👖', layer: 5, group: 'vestiti' },
  { id: 'dress', name: 'Vestito intero', icon: '👗', layer: 5, group: 'vestiti' },
  { id: 'outer', name: 'Giacche e cappotti', icon: '🧥', layer: 7, group: 'vestiti' },
  { id: 'shoes', name: 'Calzature', icon: '👟', layer: 3, group: 'gambe' },
  { id: 'gloves', name: 'Guanti', icon: '🧤', layer: 3, group: 'accessori' },
  { id: 'hat', name: 'Cappelli', icon: '🎩', layer: 9, group: 'testa' },
  { id: 'hairAcc', name: 'Accessori capelli', icon: '🎀', layer: 9, group: 'testa' },
  { id: 'glasses', name: 'Occhiali', icon: '👓', layer: 9, group: 'testa' },
  { id: 'earrings', name: 'Orecchini', icon: '💎', layer: 9, group: 'gioielli' },
  { id: 'neck', name: 'Collo', icon: '📿', layer: 8, group: 'gioielli' },
  { id: 'wrist', name: 'Polsi', icon: '⌚', layer: 8, group: 'gioielli' },
  { id: 'waist', name: 'Vita', icon: '🎗️', layer: 8, group: 'accessori' },
  { id: 'back', name: 'Schiena e ali', icon: '🪽', layer: 9, group: 'fantasy' },
  { id: 'tail', name: 'Code', icon: '🐱', layer: 9, group: 'fantasy' },
  { id: 'headFx', name: 'Accessori fantasy', icon: '✨', layer: 9, group: 'fantasy' }
];

/** Categorie mostrate nell'armadio (filtri). Ogni capo ne dichiara una. */
export const CATEGORIES = [
  { id: 'tops', name: 'Tops', slot: 'top' }, { id: 'tshirt', name: 'T-shirt', slot: 'top' }, { id: 'shirt', name: 'Camicie', slot: 'top' },
  { id: 'blouse', name: 'Bluse', slot: 'top' }, { id: 'knit', name: 'Maglie', slot: 'top' }, { id: 'hoodie', name: 'Felpe', slot: 'top' },
  { id: 'jacket', name: 'Giacche', slot: 'outer' }, { id: 'coat', name: 'Cappotti', slot: 'outer' },
  { id: 'dress', name: 'Vestiti', slot: 'dress' }, { id: 'skirt', name: 'Gonne', slot: 'bottom' }, { id: 'shorts', name: 'Shorts', slot: 'bottom' },
  { id: 'pants', name: 'Pantaloni', slot: 'bottom' }, { id: 'socks', name: 'Calze', slot: 'legwear' }, { id: 'tights', name: 'Collant', slot: 'legwear' },
  { id: 'shoes', name: 'Scarpe', slot: 'shoes' }, { id: 'boots', name: 'Stivali', slot: 'shoes' }, { id: 'footwear', name: 'Calzature', slot: 'shoes' },
  { id: 'underwear', name: 'Intimo', slot: 'underTop' }, { id: 'swimwear', name: 'Costumi', slot: 'underTop' },
  { id: 'accessory', name: 'Accessori', slot: 'waist' }, { id: 'jewelry', name: 'Gioielli', slot: 'neck' }, { id: 'gloves', name: 'Guanti', slot: 'gloves' },
  { id: 'hat', name: 'Cappelli', slot: 'hat' }, { id: 'glasses', name: 'Occhiali', slot: 'glasses' }, { id: 'hairacc', name: 'Accessori capelli', slot: 'hairAcc' },
  { id: 'wings', name: 'Ali', slot: 'back' }, { id: 'tail', name: 'Code', slot: 'tail' }, { id: 'fantasy', name: 'Accessori fantasy', slot: 'headFx' }
];

/** Le 30 famiglie estetiche. */
export const STYLES = [
  { id: 'japanese', name: 'Japanese fashion', icon: '🗾' }, { id: 'kawaii', name: 'Kawaii', icon: '🍓' }, { id: 'elegant', name: 'Elegant', icon: '🥂' },
  { id: 'gothic_lolita', name: 'Gothic Lolita', icon: '🖤' }, { id: 'gothic', name: 'Gothic', icon: '🦇' }, { id: 'dark_fantasy', name: 'Dark fantasy', icon: '🗡️' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆' }, { id: 'futuristic', name: 'Futuristic', icon: '🚀' }, { id: 'school', name: 'School-inspired', icon: '🎒' },
  { id: 'office', name: 'Office', icon: '💼' }, { id: 'business', name: 'Business', icon: '👔' }, { id: 'casual', name: 'Casual', icon: '👕' },
  { id: 'streetwear', name: 'Streetwear', icon: '🧢' }, { id: 'sportswear', name: 'Sportswear', icon: '🎾' }, { id: 'idol', name: 'Idol', icon: '🎤' },
  { id: 'maid', name: 'Maid', icon: '☕' }, { id: 'miko', name: 'Miko', icon: '⛩️' }, { id: 'fantasy', name: 'Fantasy', icon: '🧝' },
  { id: 'magical', name: 'Magical', icon: '🪄' }, { id: 'princess', name: 'Princess', icon: '👑' }, { id: 'royal', name: 'Royal', icon: '🏰' },
  { id: 'summer', name: 'Summer', icon: '🌻' }, { id: 'beachwear', name: 'Beachwear', icon: '🏖️' }, { id: 'winter', name: 'Winter', icon: '❄️' },
  { id: 'pajamas', name: 'Pajamas', icon: '🌙' }, { id: 'party', name: 'Party', icon: '🎉' }, { id: 'evening', name: 'Evening dresses', icon: '🌃' },
  { id: 'luxury', name: 'Luxury fashion', icon: '💎' }, { id: 'alternative', name: 'Alternative fashion', icon: '🎸' }, { id: 'sexy', name: 'Sexy fashion', icon: '💋' }
];

export const RARITIES = [
  { id: 'common', name: 'Comune', color: '#9aa4b8' }, { id: 'rare', name: 'Raro', color: '#5aa9ff' },
  { id: 'epic', name: 'Epico', color: '#b57bff' }, { id: 'legendary', name: 'Leggendario', color: '#ffb84a' }
];
