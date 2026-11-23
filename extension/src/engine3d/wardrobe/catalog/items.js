// Elenco dei capi (dati puri). Ogni voce ha una RICETTA costruibile dalla Garment Forge: nel catalogo non entrano
// capi che non si possono indossare davvero. Il catalogo completo viene costruito nella milestone Guardaroba (M4);
// gli id qui sotto restano validi anche nel catalogo definitivo.
//
// Campi: id, name, slot, category, styles, price, level, rarity,
//        colors [{key, name, default}]  colori regolabili (chiavi usate dai materiali: main, accent, sole…)
//        finish  finitura predefinita del tessuto (vedi material-system.js)
//        waist   quota a cui il capo cinge la vita: i capi "sopra" rimboccabili vi si infilano dentro
//        recipe  { parts: [...] }  vedi wardrobe/forge (le parti `shell` con `tuckable` vengono rimboccate)
export const ALL_ITEMS = [
  { id: 'under_bra_basic', name: 'Reggiseno basic', slot: 'underTop', category: 'underwear', styles: ['casual'], price: 0, level: 1, rarity: 'common',
    colors: [{ key: 'main', name: 'Tessuto', default: '#f4f0f5' }, { key: 'accent', name: 'Bordi', default: '#e9a9c0' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0025, region: { strapless: 'bust+0.035', sweetheart: 0.02, straps: { x: 0.062, w: 0.014 }, bottom: 'underbust-0.005', sleeve: 'none', armhole: 0.02 }, trims: [{ at: 'hem', type: 'band', width: 0.008, thick: 0.0012 }] }] } },
  { id: 'under_brief_basic', name: 'Slip basic', slot: 'underBottom', category: 'underwear', styles: ['casual'], price: 0, level: 1, rarity: 'common',
    colors: [{ key: 'main', name: 'Tessuto', default: '#f4f0f5' }, { key: 'accent', name: 'Bordi', default: '#e9a9c0' }],
    recipe: { parts: [{ type: 'shell', offset: 0.0025, region: { top: 'hip+0.06', bottom: 'crotch-0.012', hemCurve: 1.05 }, trims: [{ at: 'top', type: 'band', width: 0.008, thick: 0.0012 }] }] } },
  { id: 'top_tshirt_basic', name: 'T-shirt basic', slot: 'top', category: 'tshirt', styles: ['casual', 'streetwear'], price: 0, level: 1, rarity: 'common',
    colors: [{ key: 'main', name: 'Tessuto', default: '#ffffff' }, { key: 'accent', name: 'Collo', default: '#22325e' }],
    recipe: { parts: [{ type: 'shell', tuckable: true, offset: 0.006, fit: 0.85, ease: 0.006, region: { neck: { shape: 'crew', depth: 0.05, width: 0.15, back: 0.02 }, sleeve: 0.3, bottom: 'hip+0.02' }, sleeveFit: { r1: 0.062, sag: 0.3 }, trims: [{ at: 'neck', type: 'band', width: 0.012, thick: 0.002 }] }] } },
  { id: 'bottom_skirt_pleated', name: 'Gonna a pieghe', slot: 'bottom', category: 'skirt', styles: ['school', 'japanese'], price: 0, level: 1, rarity: 'common',
    waist: 'waist-0.005',
    colors: [{ key: 'main', name: 'Tessuto', default: '#22325e' }, { key: 'accent', name: 'Cintura', default: '#22325e' }],
    recipe: { parts: [{ type: 'skirt', top: 'waist-0.005', length: 0.36, gap: 0.01, flare: 0.1, pleats: { count: 28, depth: 0.009 }, trims: [{ at: 'waist', type: 'band', width: 0.03, thick: 0.003, inset: 0.004 }] }] } },
  { id: 'legwear_socks_knee', name: 'Calze sopra il ginocchio', slot: 'legwear', category: 'socks', styles: ['school', 'japanese'], price: 0, level: 1, rarity: 'common',
    colors: [{ key: 'main', name: 'Tessuto', default: '#1d1d26' }],
    recipe: { parts: [{ type: 'shell', offset: 0.002, region: { top: 'knee+0.14', legsOnly: true } }] } },
  { id: 'shoes_loafers', name: 'Mocassini', slot: 'shoes', category: 'shoes', styles: ['school', 'office'], price: 0, level: 1, rarity: 'common',
    finish: 'leather',
    colors: [{ key: 'main', name: 'Pelle', default: '#4a3022' }, { key: 'sole', name: 'Suola', default: '#1c120c' }],
    recipe: { parts: [{ type: 'shoe', sole: 0.014, topProfile: [[0, 0.078], [0.22, 0.056], [0.5, 0.056], [0.63, 0.2], [1, 0.2]] }] } }
];

/** outfit v0.2 → capi 1.0 equivalenti. Gli id non ancora presenti nel catalogo (felpa, abito da maid) vengono
 *  ignorati da legacyOutfitItems finché il capo non esiste davvero. */
export const LEGACY_OUTFITS = {
  uniform: ['top_tshirt_basic', 'bottom_skirt_pleated', 'legwear_socks_knee', 'shoes_loafers'],
  hoodie: ['top_hoodie_oversize'],
  maid: ['dress_maid']
};

export const PRESET_LOOKS = [];
