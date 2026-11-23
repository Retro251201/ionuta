// Elenco dei capi (dati puri). Ogni voce ha una RICETTA costruibile dalla Garment Forge: nel catalogo non entrano
// capi che non si possono indossare davvero. Direzione adulta/glamour (aderente, scollato, lingerie-inspired
// coprente, satin/latex/pizzo/rete), senza nudità. I 6 capi "basic" restano per la migrazione dalla v0.2.
//
// Campi: id, name, slot, category, styles, price, level, rarity,
//        colors [{key, name, default}]  colori regolabili (chiavi usate dai materiali: main, accent, trim, sole…)
//        finish  finitura del materiale principale (vedi material-system.js)
//        pattern pattern del materiale principale (solid se assente)
//        mats    { nomeMateriale: { c, c2, c3, finish, pattern, opacity, doubleSide } } per i capi multi-materiale
//        waist   quota a cui il capo cinge la vita (solo slot bottom)
//        recipe  { parts: [...] }  vedi wardrobe/forge
const under = { price: 0, level: 1, rarity: 'common' };

export const ALL_ITEMS = [
  // ---------------- intimo / base (restano per la v0.2) ----------------
  { id: 'under_bra_basic', name: 'Reggiseno basic', slot: 'underTop', category: 'underwear', styles: ['casual'], ...under,
    colors: [{ key: 'main', name: 'Tessuto', default: '#f4f0f5' }, { key: 'accent', name: 'Bordi', default: '#e9a9c0' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0025, region: { strapless: 'bust+0.035', sweetheart: 0.02, straps: { x: 0.062, w: 0.014 }, bottom: 'underbust-0.005', sleeve: 'none', armhole: 0.02 }, trims: [{ at: 'hem', type: 'band', width: 0.008, thick: 0.0012 }] }] } },
  { id: 'under_brief_basic', name: 'Slip basic', slot: 'underBottom', category: 'underwear', styles: ['casual'], ...under,
    colors: [{ key: 'main', name: 'Tessuto', default: '#f4f0f5' }, { key: 'accent', name: 'Bordi', default: '#e9a9c0' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0025, region: { top: 'hip+0.06', bottom: 'crotch-0.012', hemCurve: 1.05 }, trims: [{ at: 'top', type: 'band', width: 0.008, thick: 0.0012 }] }] } },
  { id: 'top_tshirt_basic', name: 'T-shirt basic', slot: 'top', category: 'tshirt', styles: ['casual', 'streetwear'], ...under,
    colors: [{ key: 'main', name: 'Tessuto', default: '#ffffff' }, { key: 'accent', name: 'Collo', default: '#22325e' }],
    recipe: { parts: [{ type: 'shell', tuckable: true, offset: 0.006, fit: 0.85, ease: 0.006, region: { neck: { shape: 'crew', depth: 0.05, width: 0.15, back: 0.02 }, sleeve: 0.3, bottom: 'hip+0.02' }, sleeveFit: { r1: 0.062, sag: 0.3 }, trims: [{ at: 'neck', type: 'band', width: 0.012, thick: 0.002 }] }] } },
  { id: 'bottom_skirt_pleated', name: 'Gonna a pieghe', slot: 'bottom', category: 'skirt', styles: ['school', 'japanese'], ...under, waist: 'waist-0.005',
    colors: [{ key: 'main', name: 'Tessuto', default: '#22325e' }, { key: 'accent', name: 'Cintura', default: '#22325e' }],
    recipe: { parts: [{ type: 'skirt', top: 'waist-0.005', length: 0.36, gap: 0.01, flare: 0.1, pleats: { count: 28, depth: 0.009 }, trims: [{ at: 'waist', type: 'band', width: 0.03, thick: 0.003, inset: 0.004 }] }] } },
  { id: 'legwear_socks_knee', name: 'Calze sopra il ginocchio', slot: 'legwear', category: 'socks', styles: ['school', 'japanese'], ...under,
    colors: [{ key: 'main', name: 'Tessuto', default: '#1d1d26' }],
    recipe: { parts: [{ type: 'shell', offset: 0.002, region: { top: 'knee+0.14', legsOnly: true } }] } },
  { id: 'shoes_loafers', name: 'Mocassini', slot: 'shoes', category: 'shoes', styles: ['school', 'office'], ...under, finish: 'leather',
    colors: [{ key: 'main', name: 'Pelle', default: '#4a3022' }, { key: 'sole', name: 'Suola', default: '#1c120c' }],
    recipe: { parts: [{ type: 'shoe', sole: 0.014, topProfile: [[0, 0.078], [0.22, 0.056], [0.5, 0.056], [0.63, 0.2], [1, 0.2]] }] } },

  // ---------------- intimo / lingerie-inspired ----------------
  { id: 'bra_lace', name: 'Reggiseno in pizzo', slot: 'underTop', category: 'underwear', styles: ['sexy', 'elegant'], price: 0, level: 1, rarity: 'rare', finish: 'satin',
    colors: [{ key: 'main', name: 'Tessuto', default: '#1b1020' }, { key: 'trim', name: 'Pizzo', default: '#e8c7d8' }],
    mats: { trim: { c: 'trim', finish: 'sheer', pattern: 'lace' } },
    recipe: { parts: [{ type: 'shell', offset: 0.003, region: { strapless: 'bust+0.045', sweetheart: 0.03, straps: { x: 0.058, w: 0.01 }, bottom: 'underbust-0.01', sleeve: 'none', armhole: 0.02 },
      trims: [{ at: 'hem', type: 'lace', mat: 'trim', width: 0.03, thick: 0.001, step: 0.006 }, { at: 'neck', type: 'lace', mat: 'trim', width: 0.022, thick: 0.001, step: 0.006 }] }] } },
  { id: 'panties_lace', name: 'Slip in pizzo', slot: 'underBottom', category: 'underwear', styles: ['sexy', 'elegant'], price: 0, level: 1, rarity: 'rare', finish: 'satin',
    colors: [{ key: 'main', name: 'Tessuto', default: '#1b1020' }, { key: 'trim', name: 'Pizzo', default: '#e8c7d8' }],
    mats: { trim: { c: 'trim', finish: 'sheer', pattern: 'lace' } },
    recipe: { parts: [{ type: 'shell', offset: 0.003, region: { top: 'hip+0.05', bottom: 'crotch-0.02', hemCurve: 1.25 }, trims: [{ at: 'top', type: 'lace', mat: 'trim', width: 0.02, thick: 0.001, step: 0.006 }] }] } },

  // ---------------- top ----------------
  { id: 'top_crop', name: 'Crop top', slot: 'top', category: 'tops', styles: ['streetwear', 'casual', 'sexy'], price: 60, level: 2, rarity: 'common', finish: 'knit',
    colors: [{ key: 'main', name: 'Tessuto', default: '#e7e2ea' }],
    recipe: { parts: [{ type: 'shell', offset: 0.005, fit: 0.9, ease: 0.004, region: { neck: { shape: 'scoop', depth: 0.07, width: 0.17, back: 0.03 }, sleeve: 0.22, bottom: 'underbust-0.02' }, sleeveFit: { r1: 0.05, sag: 0.2 }, trims: [{ at: 'hem', type: 'rib', width: 0.016, thick: 0.002 }, { at: 'neck', type: 'rib', width: 0.01, thick: 0.0015 }] }] } },
  { id: 'top_bandeau', name: 'Top a fascia', slot: 'top', category: 'tops', styles: ['sexy', 'summer', 'party'], price: 90, level: 2, rarity: 'rare', finish: 'satin',
    colors: [{ key: 'main', name: 'Tessuto', default: '#c8324b' }],
    recipe: { parts: [{ type: 'shell', offset: 0.004, fit: 0.95, region: { strapless: 'bust+0.05', sweetheart: 0.028, bottom: 'underbust-0.03', sleeve: 'none', armhole: 0.016 }, trims: [{ at: 'hem', type: 'band', width: 0.012, thick: 0.0018 }, { at: 'neck', type: 'band', width: 0.012, thick: 0.0018 }] }] } },
  { id: 'top_halter', name: 'Top halter schiena nuda', slot: 'top', category: 'tops', styles: ['sexy', 'party', 'evening'], price: 140, level: 3, rarity: 'rare', finish: 'satin',
    colors: [{ key: 'main', name: 'Tessuto', default: '#101016' }],
    recipe: { parts: [{ type: 'shell', offset: 0.004, fit: 0.95, region: { strapless: 'bust+0.02', sweetheart: 0.05, halter: true, straps: { x: 0.05, w: 0.03 }, backless: 'waist+0.02', backWidth: 0.12, bottom: 'waist-0.01', sleeve: 'none', armhole: 0.012 }, trims: [{ at: 'hem', type: 'band', width: 0.01, thick: 0.0015 }] }] } },
  { id: 'top_corset', name: 'Corsetto', slot: 'top', category: 'tops', styles: ['gothic', 'sexy', 'elegant'], price: 220, level: 4, rarity: 'epic', finish: 'satin',
    colors: [{ key: 'main', name: 'Corsetto', default: '#15121c' }, { key: 'trim', name: 'Stringhe', default: '#d8c38a' }],
    mats: { trim: { c: 'trim', finish: 'silk' } },
    recipe: { parts: [{ type: 'shell', offset: 0.004, fit: 1.0, region: { strapless: 'bust+0.03', sweetheart: 0.035, straps: { x: 0.06, w: 0.012 }, bottom: 'waist-0.03', sleeve: 'none', armhole: 0.016 },
      trims: [{ at: 'hem', type: 'band', mat: 'trim', width: 0.016, thick: 0.002 }, { at: 'neck', type: 'band', mat: 'trim', width: 0.012, thick: 0.002 }] }] } },
  { id: 'top_offshoulder', name: 'Maglia a spalle scoperte', slot: 'top', category: 'knit', styles: ['elegant', 'casual', 'winter'], price: 110, level: 2, rarity: 'rare', finish: 'knit', pattern: 'knit',
    colors: [{ key: 'main', name: 'Maglia', default: '#d8b9c6' }],
    recipe: { parts: [{ type: 'shell', tuckable: true, offset: 0.008, fit: 0.78, ease: 0.016, region: { offShoulder: 'shoulder-0.03', neck: { shape: 'boat', depth: 0.02, width: 0.3, back: 0.04 }, sleeve: 0.95, bottom: 'hip+0.04' }, sleeveFit: { r0: 0.07, r1: 0.055, sag: 0.4, blend: 0.3 }, trims: [{ at: 'hem', type: 'rib', width: 0.02, thick: 0.0022 }] }] } },

  // ---------------- vestiti ----------------
  { id: 'dress_bodycon', name: 'Abito aderente', slot: 'dress', category: 'dress', styles: ['sexy', 'evening', 'party'], price: 260, level: 4, rarity: 'epic', finish: 'satin',
    colors: [{ key: 'main', name: 'Tessuto', default: '#b01030' }],
    recipe: { parts: [{ type: 'shell', offset: 0.004, fit: 1.0, ease: 0.002, region: { neck: { shape: 'scoop', depth: 0.06, width: 0.16, back: 0.02 }, backless: 'waist+0.05', backWidth: 0.1, sleeve: 0.25, armhole: 0.012, bottom: 'hip+0.02' }, sleeveFit: { r1: 0.052, sag: 0.1 }, trims: [{ at: 'neck', type: 'band', width: 0.01, thick: 0.0014 }] },
      { type: 'skirt', top: 'hip+0.02', length: 0.3, gap: 0.005, flare: 0.0, holdUntil: 'knee', slit: { angle: 3.14, width: 0.4, from: 0.5 } }] } },
  { id: 'dress_slip_satin', name: 'Sottoveste in satin', slot: 'dress', category: 'dress', styles: ['elegant', 'sexy', 'evening'], price: 240, level: 4, rarity: 'epic', finish: 'satin',
    colors: [{ key: 'main', name: 'Satin', default: '#1d2742' }, { key: 'trim', name: 'Pizzo', default: '#20304f' }],
    mats: { trim: { c: 'trim', finish: 'sheer', pattern: 'lace' } },
    recipe: { parts: [{ type: 'shell', offset: 0.005, fit: 0.9, region: { strapless: 'bust+0.02', sweetheart: 0.05, straps: { x: 0.052, w: 0.008 }, backless: 'waist', backWidth: 0.12, bottom: 'crotch+0.02', sleeve: 'none', armhole: 0.01 }, trims: [{ at: 'neck', type: 'lace', mat: 'trim', width: 0.016, thick: 0.001, step: 0.006 }] },
      { type: 'skirt', top: 'crotch+0.02', length: 0.34, gap: 0.006, flare: 0.08, from: 0.2, slit: { angle: 0.6, width: 0.5, from: 0.25 }, trims: [{ at: 'hem', type: 'lace', mat: 'trim', width: 0.02, thick: 0.001, step: 0.007 }] }] } },
  { id: 'dress_gown_slit', name: 'Abito lungo con spacco', slot: 'dress', category: 'dress', styles: ['elegant', 'evening', 'luxury'], price: 340, level: 5, rarity: 'epic', finish: 'silk',
    colors: [{ key: 'main', name: 'Tessuto', default: '#2a0e1c' }],
    recipe: { parts: [{ type: 'shell', offset: 0.004, fit: 0.98, region: { halter: true, strapless: 'bust+0.02', sweetheart: 0.05, straps: { x: 0.05, w: 0.026 }, backless: 'waist+0.04', backWidth: 0.12, bottom: 'hip+0.02', sleeve: 'none', armhole: 0.012 } },
      { type: 'skirt', top: 'hip+0.02', length: 0.72, gap: 0.006, flare: 0.22, from: 0.35, curve: 1.6, hemDrop: 0.08, slit: { angle: 0.3, width: 0.5, from: 0.2 } }] } },
  { id: 'dress_latex_mini', name: 'Mini dress latex', slot: 'dress', category: 'dress', styles: ['sexy', 'alternative', 'cyberpunk'], price: 300, level: 5, rarity: 'legendary', finish: 'latex',
    colors: [{ key: 'main', name: 'Latex', default: '#0b0b10' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0035, fit: 1.0, region: { neck: { shape: 'scoop', depth: 0.08, width: 0.18, back: 0.03 }, backless: 'waist+0.06', backWidth: 0.1, sleeve: 0.95, armhole: 0.012, bottom: 'hip+0.02' }, sleeveFit: { r0: 0.062, r1: 0.044, sag: 0, blend: 0.25 }, trims: [{ at: 'neck', type: 'band', width: 0.008, thick: 0.0014 }] },
      { type: 'skirt', top: 'hip+0.02', length: 0.2, gap: 0.004, flare: 0.02, holdUntil: 'knee' }] } },

  // ---------------- gonne / shorts ----------------
  { id: 'bottom_mini', name: 'Minigonna aderente', slot: 'bottom', category: 'skirt', styles: ['sexy', 'streetwear', 'party'], price: 80, level: 2, rarity: 'common', finish: 'denim', waist: 'waist',
    colors: [{ key: 'main', name: 'Tessuto', default: '#2b4a74' }],
    recipe: { parts: [{ type: 'skirt', top: 'waist', length: 0.22, gap: 0.006, flare: 0.03, holdUntil: 'hip', trims: [{ at: 'waist', type: 'band', width: 0.026, thick: 0.003, inset: 0.004 }] }] } },
  { id: 'bottom_pencil', name: 'Gonna a tubino con spacco', slot: 'bottom', category: 'skirt', styles: ['office', 'elegant', 'business'], price: 130, level: 3, rarity: 'rare', finish: 'satin', waist: 'waist',
    colors: [{ key: 'main', name: 'Tessuto', default: '#201a22' }],
    recipe: { parts: [{ type: 'skirt', top: 'waist', length: 0.5, gap: 0.006, flare: 0.0, holdUntil: 'knee', slit: { angle: 3.14, width: 0.5, from: 0.45 }, trims: [{ at: 'waist', type: 'band', width: 0.03, thick: 0.003, inset: 0.004 }] }] } },
  { id: 'bottom_shorts', name: 'Shorts', slot: 'bottom', category: 'shorts', styles: ['casual', 'streetwear', 'summer'], price: 70, level: 2, rarity: 'common', finish: 'denim', waist: 'waist-0.01',
    colors: [{ key: 'main', name: 'Tessuto', default: '#3a5a86' }],
    recipe: { parts: [{ type: 'shell', offset: 0.006, region: { top: 'waist-0.01', bottom: 'crotch-0.05', legFit: true }, legFit: { profile: [['hip', 0.185], ['crotch-0.04', 0.16]] }, trims: [{ at: 'top', type: 'band', width: 0.022, thick: 0.003 }] }] } },

  // ---------------- calze / collant ----------------
  { id: 'legwear_thigh_highs', name: 'Autoreggenti con pizzo', slot: 'legwear', category: 'tights', styles: ['sexy', 'elegant', 'gothic'], price: 90, level: 2, rarity: 'rare', finish: 'sheer',
    colors: [{ key: 'main', name: 'Tessuto', default: '#15121a' }, { key: 'trim', name: 'Balza', default: '#1a1420' }],
    mats: { trim: { c: 'trim', finish: 'sheer', pattern: 'lace' } },
    recipe: { parts: [{ type: 'shell', offset: 0.0016, region: { top: 'crotch-0.02', legsOnly: true }, trims: [{ at: 'top', type: 'lace', mat: 'trim', width: 0.03, thick: 0.001, step: 0.006 }] }] } },
  { id: 'legwear_fishnet', name: 'Calze a rete', slot: 'legwear', category: 'tights', styles: ['sexy', 'alternative', 'gothic'], price: 100, level: 3, rarity: 'rare', finish: 'sheer', pattern: 'fishnet',
    colors: [{ key: 'main', name: 'Rete', default: '#0a0a0e' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0014, region: { top: 'crotch-0.01', legsOnly: true } }] } },
  { id: 'legwear_sheer_tights', name: 'Collant velati', slot: 'legwear', category: 'tights', styles: ['office', 'elegant', 'evening'], price: 60, level: 2, rarity: 'common', finish: 'sheer',
    colors: [{ key: 'main', name: 'Tessuto', default: '#2a2026' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0012, region: { top: 'waist', legsOnly: true } }] } },

  // ---------------- scarpe ----------------
  { id: 'shoes_pumps', name: 'Décolleté a spillo', slot: 'shoes', category: 'shoes', styles: ['elegant', 'sexy', 'office'], price: 150, level: 3, rarity: 'rare', finish: 'latex',
    colors: [{ key: 'main', name: 'Tomaia', default: '#101016' }, { key: 'sole', name: 'Suola', default: '#8a1030' }],
    recipe: { parts: [{ type: 'shoe', sole: 0.006, pitch: 28, heelWidth: 0.011, toe: 'point', toeLen: 0.014, offset: 0.004, topProfile: [[0, 0.07], [0.2, 0.038], [0.66, 0.038], [0.78, 0.2], [1, 0.2]] }] } },
  { id: 'shoes_heels_strappy', name: 'Sandali col tacco', slot: 'shoes', category: 'shoes', styles: ['party', 'summer', 'sexy'], price: 160, level: 3, rarity: 'rare', finish: 'satin',
    colors: [{ key: 'main', name: 'Fascette', default: '#d8bf8a' }, { key: 'sole', name: 'Suola', default: '#2a211a' }],
    recipe: { parts: [{ type: 'shoe', sole: 0.006, pitch: 26, heelWidth: 0.012, toe: 'round', offset: 0.004, plateOnly: true, topProfile: [[0, 0.03], [0.25, 0.02], [0.7, 0.02], [0.82, 0.05], [1, 0.05]] }] } },
  { id: 'shoes_boots_tall', name: 'Stivali alti', slot: 'shoes', category: 'boots', styles: ['gothic', 'sexy', 'alternative'], price: 240, level: 4, rarity: 'epic', finish: 'latex',
    colors: [{ key: 'main', name: 'Pelle', default: '#0b0b10' }, { key: 'sole', name: 'Suola', default: '#101014' }],
    recipe: { parts: [{ type: 'shell', offset: 0.006, region: { top: 'knee+0.05', legsOnly: true, noFeet: 'ankle-0.03' }, legFit: { profile: [['knee+0.04', 0.06], ['ankle+0.02', 0.052]] } },
      { type: 'shoe', top: 'ankle+0.0', sole: 0.012, pitch: 22, heelWidth: 0.014, platform: 0.006, toe: 'round', toeBulk: 0.003 }] } },
  { id: 'shoes_ankle_boots', name: 'Tronchetti', slot: 'shoes', category: 'boots', styles: ['streetwear', 'casual', 'gothic'], price: 130, level: 3, rarity: 'common', finish: 'leather',
    colors: [{ key: 'main', name: 'Pelle', default: '#1a1a20' }, { key: 'sole', name: 'Suola', default: '#0e0e12' }],
    recipe: { parts: [{ type: 'shell', offset: 0.007, region: { top: 'ankle+0.07', legsOnly: true, noFeet: 'ankle-0.03' }, legFit: { profile: [['ankle+0.06', 0.055], ['ankle', 0.052]] } },
      { type: 'shoe', top: 'ankle+0.0', sole: 0.01, pitch: 16, heelWidth: 0.02, platform: 0.006, toe: 'round', toeBulk: 0.003 }] } },

  // ---------------- costumi da bagno ----------------
  { id: 'swim_bikini_top', name: 'Bikini (sopra)', slot: 'underTop', category: 'swimwear', styles: ['beachwear', 'summer', 'sexy'], price: 90, level: 2, rarity: 'rare', finish: 'latex',
    colors: [{ key: 'main', name: 'Tessuto', default: '#e23a6d' }, { key: 'trim', name: 'Bordi', default: '#ffd34d' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0035, region: { strapless: 'bust+0.04', sweetheart: 0.04, straps: { x: 0.055, w: 0.01 }, bottom: 'underbust-0.005', sleeve: 'none', armhole: 0.02 }, trims: [{ at: 'hem', type: 'band', mat: 'trim', width: 0.006, thick: 0.001 }] }] } },
  { id: 'swim_bikini_bottom', name: 'Bikini (sotto)', slot: 'underBottom', category: 'swimwear', styles: ['beachwear', 'summer', 'sexy'], price: 90, level: 2, rarity: 'rare', finish: 'latex',
    colors: [{ key: 'main', name: 'Tessuto', default: '#e23a6d' }, { key: 'trim', name: 'Bordi', default: '#ffd34d' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0035, region: { top: 'hip+0.03', bottom: 'crotch-0.02', hemCurve: 1.3 }, trims: [{ at: 'top', type: 'band', mat: 'trim', width: 0.006, thick: 0.001 }] }] } },
  { id: 'swim_onepiece', name: 'Costume intero sgambato', slot: 'dress', category: 'swimwear', styles: ['beachwear', 'summer', 'sexy'], price: 150, level: 3, rarity: 'epic', finish: 'latex',
    colors: [{ key: 'main', name: 'Tessuto', default: '#101016' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0035, fit: 1.0, region: { halter: true, strapless: 'bust+0.02', sweetheart: 0.05, straps: { x: 0.05, w: 0.022 }, backless: 'waist+0.06', backWidth: 0.1, bottom: 'crotch-0.01', sleeve: 'none', armhole: 0.012, cutouts: [{ y: 'waist', x: 0, rx: 0.05, ry: 0.07, face: 'front' }] } }] } },

  // ---------------- accessori ----------------
  { id: 'gloves_opera', name: 'Guanti lunghi in satin', slot: 'gloves', category: 'gloves', styles: ['elegant', 'evening', 'luxury'], price: 120, level: 3, rarity: 'rare', finish: 'satin',
    colors: [{ key: 'main', name: 'Satin', default: '#15121c' }],
    recipe: { parts: [{ type: 'shell', offset: 0.004, region: { armFrom: 0.42, armTo: 1.0 }, trims: [{ at: 'cuff', type: 'band', width: 0.012, thick: 0.0016 }] }] } },
  { id: 'neck_choker', name: 'Choker', slot: 'neck', category: 'jewelry', styles: ['gothic', 'sexy', 'alternative'], price: 50, level: 1, rarity: 'common', finish: 'velvet',
    colors: [{ key: 'main', name: 'Fascia', default: '#0a0a0e' }],
    recipe: { parts: [{ type: 'shell', offset: 0.005, region: { top: 'neck+0.03', bottom: 'neck-0.01' }, trims: [{ at: 'hem', type: 'band', width: 0.006, thick: 0.001 }] }] } }
];

/** outfit v0.2 → capi 1.0 equivalenti. Gli id non ancora presenti nel catalogo vengono ignorati da legacyOutfitItems. */
export const LEGACY_OUTFITS = {
  uniform: ['top_tshirt_basic', 'bottom_skirt_pleated', 'legwear_socks_knee', 'shoes_loafers'],
  hoodie: ['top_crop', 'bottom_shorts'],
  maid: ['dress_slip_satin']
};

const L = (id, name, styles, outfit) => ({ id, name, styles, outfit });

/** Look completi: 12 stili, almeno 3 look. Alimentano preset, randomizer, sfide e lookbook. */
export const PRESET_LOOKS = [
  L('date_night', 'Date Night', 'evening', { underTop: { item: 'bra_lace' }, underBottom: { item: 'panties_lace' }, dress: { item: 'dress_bodycon', colors: { main: '#8d1030' } }, legwear: { item: 'legwear_sheer_tights' }, shoes: { item: 'shoes_pumps' }, neck: { item: 'neck_choker' } }),
  L('glamour', 'Glamour', 'luxury', { dress: { item: 'dress_gown_slit', colors: { main: '#20121f' } }, gloves: { item: 'gloves_opera' }, shoes: { item: 'shoes_heels_strappy' } }),
  L('pinup', 'Pin-up', 'sexy', { underTop: { item: 'swim_bikini_top', colors: { main: '#c8123a' } }, bottom: { item: 'bottom_pencil', colors: { main: '#15121a' } }, legwear: { item: 'legwear_thigh_highs' }, shoes: { item: 'shoes_pumps' } }),
  L('gothic', 'Gothic', 'gothic', { top: { item: 'top_corset', colors: { main: '#0c0b12' } }, bottom: { item: 'bottom_mini', colors: { main: '#141019' }, material: 'latex' }, legwear: { item: 'legwear_fishnet' }, shoes: { item: 'shoes_boots_tall' }, neck: { item: 'neck_choker' } }),
  L('beach', 'Beach', 'beachwear', { underTop: { item: 'swim_bikini_top' }, underBottom: { item: 'swim_bikini_bottom' }, shoes: { item: 'shoes_heels_strappy', colors: { main: '#ffffff' } } }),
  L('boudoir', 'Boudoir', 'sexy', { underTop: { item: 'bra_lace' }, underBottom: { item: 'panties_lace' }, legwear: { item: 'legwear_thigh_highs' }, gloves: { item: 'gloves_opera', colors: { main: '#1b1020' } } }),
  L('satin_night', 'Satin', 'elegant', { dress: { item: 'dress_slip_satin' }, shoes: { item: 'shoes_heels_strappy', colors: { main: '#1d2742' } }, neck: { item: 'neck_choker', colors: { main: '#20304f' } } }),
  L('latex', 'Latex', 'alternative', { dress: { item: 'dress_latex_mini' }, legwear: { item: 'legwear_fishnet' }, shoes: { item: 'shoes_boots_tall' } }),
  L('idol', 'Idol', 'idol', { top: { item: 'top_bandeau', colors: { main: '#ff8fb8' } }, bottom: { item: 'bottom_mini', colors: { main: '#ffffff' } }, legwear: { item: 'legwear_thigh_highs', colors: { main: '#ffd7e6' } }, shoes: { item: 'shoes_pumps', colors: { main: '#ff9ec4' } }, gloves: { item: 'gloves_opera', colors: { main: '#ffffff' } } }),
  L('street', 'Street', 'streetwear', { top: { item: 'top_crop' }, bottom: { item: 'bottom_shorts' }, shoes: { item: 'shoes_ankle_boots' } }),
  L('cozy', 'Cozy', 'cozy', { top: { item: 'top_offshoulder' }, legwear: { item: 'legwear_thigh_highs', colors: { main: '#c9b3c2' } }, shoes: { item: 'shoes_ankle_boots', colors: { main: '#b59a86' } } }),
  L('office', 'Office', 'office', { top: { item: 'top_halter', colors: { main: '#efe9ee' } }, bottom: { item: 'bottom_pencil' }, legwear: { item: 'legwear_sheer_tights' }, shoes: { item: 'shoes_pumps' } })
];
