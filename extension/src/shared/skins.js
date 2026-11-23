/* Outfit (corpi anime), capelli, accessori e helper teste.
 * Le teste sono FOTO reali: heads.generated.js (incluse) + DC.CUSTOM_HEADS (caricate dall'utente,
 * salvate dal service worker in dc_customHeads). Le foto non vengono MAI ridisegnate/stilizzate.
 * Ogni outfit = palette + "style" base + "parts" opzionali (vedi body.js -> specOf/STYLE).
 * Per aggiungere un outfit: aggiungi un oggetto qui combinando le parti gia' supportate. */
(function () {
  const DC = (globalThis.DC = globalThis.DC || {});
  DC.OUTFITS = [
    { id: 'uniform', name: 'Divisa alla marinara', icon: '🎀', price: 0, style: 'sailor',
      top: '#f8f9fb', top2: '#22325e', accent: '#e03a5f', skirt: '#22325e', socks: '#1d1d26', shoes: '#4a3022', sleeve: 'short' },
    { id: 'hoodie', name: 'Felpa oversize', icon: '🧥', price: 60, style: 'hoodie',
      top: '#8b93a7', top2: '#6f778b', accent: '#ffffff', skirt: '#24242c', socks: '#f1f1f1', shoes: '#f5f5f5', sleeve: 'long' },
    { id: 'gamer', name: 'Gamer neon', icon: '🎮', price: 90, style: 'casual',
      top: '#1f2a37', top2: '#20c997', accent: '#20c997', skirt: '#3b4a6b', socks: '#20c997', shoes: '#111111', sleeve: 'short' },
    { id: 'maid', name: 'Maid café', icon: '☕', price: 120, style: 'maid',
      top: '#1c1c24', top2: '#ffffff', accent: '#ff7ab6', skirt: '#1c1c24', socks: '#ffffff', shoes: '#151515', sleeve: 'short' },
    { id: 'yukata', name: 'Yukata estivo', icon: '🏮', price: 150, style: 'yukata',
      top: '#5b3fc4', top2: '#f3c4dd', accent: '#ffcc4d', skirt: '#5b3fc4', socks: '#ffffff', shoes: '#9c6b3f', sleeve: 'wide' },
    { id: 'idol', name: 'Idol sul palco', icon: '🎤', price: 200, style: 'idol',
      top: '#ff6fae', top2: '#ffffff', accent: '#ffd43b', skirt: '#ff8cc0', socks: '#ffffff', shoes: '#ffffff', sleeve: 'short' },
    // ---- nuovi in v0.2.0 ----
    { id: 'pajama', name: 'Pigiama stellato', icon: '🌙', price: 70, style: 'casual',
      top: '#bcd7ff', top2: '#ffffff', accent: '#ff9fc6', skirt: '#bcd7ff', socks: '#bcd7ff', shoes: '#ffd6e8',
      parts: { top: 'pajama', topLen: 100, neck: 'round', collar: 'peter', skirt: 'none', legs: 'pants', pants: '#bcd7ff', shoes: 'slipper', sleeve: 'long', pattern: 'stars', patternColor: '#ffffff', extras: [] } },
    { id: 'tennis', name: 'Tennis club', icon: '🎾', price: 80, style: 'casual',
      top: '#ffffff', top2: '#2bb673', accent: '#2bb673', skirt: '#f4f6f8', socks: '#ffffff', shoes: '#ffffff',
      parts: { top: 'tee', neck: 'v', collar: 'polo', skirt: 'pleated', len: 140, legs: 'ankle', shoes: 'sneaker', sleeve: 'cap', extras: ['wristband', 'sportStripe', 'hemline'], hemColor: '#2bb673' } },
    { id: 'summer', name: 'Abito estivo', icon: '🌻', price: 100, style: 'idol',
      top: '#fff4e0', top2: '#ff8fa3', accent: '#ff6f61', skirt: '#fff4e0', socks: '#ffffff', shoes: '#c98a52',
      parts: { top: 'bodice', neck: 'square', straps: true, collar: 'necklace', skirt: 'flare', len: 176, legs: 'bare', shoes: 'sandal', sleeve: 'none', pattern: 'flowers', patternColor: '#ffb347', extras: ['ribbonWaist'] } },
    { id: 'winter', name: 'Maglione invernale', icon: '❄️', price: 120, style: 'hoodie',
      top: '#efe3cf', top2: '#c0392b', accent: '#c0392b', skirt: '#efe3cf', socks: '#4a3428', shoes: '#6b4a33',
      parts: { top: 'sweater', topLen: 132, collar: 'turtle', skirt: 'none', legs: 'tights', tightsOp: 0.95, shoes: 'boot', bootH: 34, bootFur: true, sleeve: 'long', pattern: 'knit', patternColor: '#9c8463', patternOn: 'top', extras: ['scarf'], scarf: '#c0392b' } },
    { id: 'office', name: 'Office lady', icon: '💼', price: 140, style: 'sailor',
      top: '#2b3445', top2: '#f6f4f1', accent: '#d4af37', skirt: '#2b3445', socks: '#2a2420', shoes: '#1b1b1f',
      parts: { top: 'jacket', neck: 'deepv', collar: 'shirt', collarColor: '#f6f4f1', skirt: 'pencil', len: 168, legs: 'tights', tightsOp: 0.4, shoes: 'heel', sleeve: 'long', cuff: '#f6f4f1', extras: ['brooch'] } },
    { id: 'miko', name: 'Miko del santuario', icon: '⛩️', price: 160, style: 'yukata',
      top: '#fbfbfb', top2: '#ffffff', accent: '#c8323c', skirt: '#c8323c', socks: '#ffffff', shoes: '#8a5a36',
      parts: { top: 'kimono', collar: 'kimono', collarColor: '#ffffff', underCollar: '#c8323c', skirt: 'hakama', legs: 'bare', shoes: 'geta', sleeve: 'wide', lining: '#c8323c', pattern: null, extras: ['hakamaTie'] } },
    { id: 'witch', name: 'Streghetta', icon: '🎃', price: 170, style: 'idol',
      top: '#2a1d3d', top2: '#6a3d9a', accent: '#ffd166', skirt: '#2a1d3d', socks: '#ff8a3d', shoes: '#1b1424',
      parts: { top: 'bodice', neck: 'round', collar: 'shirt', collarColor: '#f3eee8', bow: '#ff8a3d', skirt: 'flare', len: 150, legs: 'striped', stripe2: '#1b1424', shoes: 'boot', bootH: 34, sleeve: 'flare', lining: '#6a3d9a', cape: '#1f1530', extras: ['jagged', 'cape', 'belt'], buckle: '#ffd166' } },
    { id: 'santa', name: 'Babbo Natale', icon: '🎅', price: 170, style: 'idol',
      top: '#c8202f', top2: '#ffffff', accent: '#f1c84b', skirt: '#c8202f', socks: '#2a2a2e', shoes: '#1d1d22',
      parts: { top: 'bodice', neck: 'round', collar: 'fur', skirt: 'flare', len: 146, legs: 'tights', tightsOp: 0.3, shoes: 'boot', bootH: 40, bootFur: true, sleeve: 'long', fur: true, extras: ['belt'] } },
    { id: 'gothic', name: 'Gothic lolita', icon: '🖤', price: 180, style: 'maid',
      top: '#1a1420', top2: '#f4f0f2', accent: '#9b1b30', skirt: '#1a1420', socks: '#1a1420', shoes: '#120e14',
      parts: { top: 'bodice', neck: 'round', collar: 'frill', lace: '#f4f0f2', skirt: 'puffy', len: 148, legs: 'thigh', shoes: 'mary', platform: true, sleeve: 'puffLong', extras: ['corset', 'petticoat', 'backbow'] } },
    { id: 'cyber', name: 'Cyberpunk', icon: '🌆', price: 220, style: 'casual',
      top: '#141821', top2: '#00e5ff', accent: '#ff2bd6', skirt: '#1b2130', socks: '#141821', shoes: '#141821',
      parts: { top: 'bodice', neck: 'high', collar: 'high', skirt: 'pleated', len: 140, legs: 'thigh', band: '#00e5ff', shoes: 'boot', bootH: 44, bootTrim: '#00e5ff', sleeve: 'long', cuff: '#00e5ff', extras: ['neon', 'belt'], buckle: '#00e5ff' } },
    { id: 'magical', name: 'Ragazza magica', icon: '🪄', price: 260, style: 'idol',
      top: '#ffffff', top2: '#ffd6ec', accent: '#ff4fa3', skirt: '#ff9fd0', socks: '#ffffff', shoes: '#ff9fd0',
      parts: { top: 'bodice', collar: 'idol', skirt: 'tiered', len: 140, legs: 'thigh', shoes: 'boot', bootH: 30, sleeve: 'puff', extras: ['bigbow', 'star', 'petticoat', 'backbow'] } }
  ];
  DC.outfitById = (id) => DC.OUTFITS.find((o) => o.id === id) || DC.OUTFITS[0];

  // ---- capelli (dietro la foto: incorniciano senza coprire il viso) ----
  DC.HAIR_STYLES = [
    { id: 'none', name: 'Nessuno (solo foto)' },
    { id: 'long', name: 'Lunghi lisci' },
    { id: 'wavy', name: 'Lunghi mossi' },
    { id: 'bob', name: 'Caschetto' },
    { id: 'twin', name: 'Codini' },
    { id: 'pony', name: 'Coda alta' }
  ];
  DC.HAIR_COLORS = [
    { id: '#3a2a33', name: 'Castano scuro' }, { id: '#1f1a24', name: 'Nero' }, { id: '#5b3a29', name: 'Castano' },
    { id: '#e8c47a', name: 'Biondo' }, { id: '#f4a6c8', name: 'Rosa' }, { id: '#b79cff', name: 'Lilla' },
    { id: '#7cc6ff', name: 'Azzurro' }, { id: '#c8323c', name: 'Rosso' }, { id: '#d9dde6', name: 'Argento' }
  ];
  DC.ACCESSORIES = [
    { id: 'none', name: 'Nessuno', icon: '—' },
    { id: 'wings', name: 'Ali d\'angelo', icon: '🪽' },
    { id: 'devil', name: 'Ali da diavoletta', icon: '😈' },
    { id: 'fairy', name: 'Ali di fata', icon: '🧚' },
    { id: 'cat', name: 'Coda di gatto', icon: '🐱' },
    { id: 'bow', name: 'Fiocco gigante', icon: '🎀' }
  ];

  // ---- teste: incluse + caricate dall'utente ----
  DC.CUSTOM_HEADS = DC.CUSTOM_HEADS || [];
  DC.MAX_CUSTOM_HEADS = 12;
  DC.allHeads = () => (DC.HEADS || []).concat(DC.CUSTOM_HEADS || []);
  DC.headById = (id) => DC.allHeads().find((h) => h.id === id) || (DC.HEADS || []).find((h) => h.id === 'head_04') || (DC.HEADS || [])[0];
  DC.headUrl = (h) => {
    if (!h) return '';
    if (h.dataUrl) return h.dataUrl;
    try { if (globalThis.chrome && chrome.runtime && chrome.runtime.getURL) return chrome.runtime.getURL(h.file); } catch (e) { /* contesto invalidato */ }
    return h.file;
  };
})();
