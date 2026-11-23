// Elenco UNICO delle fonti esterne usate dalla pipeline (scaricate solo in fase di sviluppo, mai a runtime).
// Ogni voce è verificata: licenza letta dai metadati del file o dal repository di origine. Vedi ASSET_CREDITS.md.
const MADJIN = 'https://raw.githubusercontent.com/madjin/vrm-samples/master';
const M2M = 'https://raw.githubusercontent.com/scottpetrovic/mesh2motion-app/main/static/assets/human/animations';

export const MODELS = {
  // Corpo e viso base: modello di esempio CC0 di VRoid Studio (beta). Corpo completo sotto i vestiti.
  HairSample_Female: { url: `${MADJIN}/vroid/beta/HairSample_Female.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  // Donatori di acconciature (tutti CC0 nei metadati VRM: licenseName "CC0").
  Vita: { url: `${MADJIN}/vroid/beta/Vita.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  Vivi: { url: `${MADJIN}/vroid/beta/Vivi.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  Victoria_Rubin: { url: `${MADJIN}/vroid/beta/Victoria_Rubin.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  Sendagaya_Shino: { url: `${MADJIN}/vroid/beta/Sendagaya_Shino.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  Darkness_Shibu: { url: `${MADJIN}/vroid/beta/Darkness_Shibu.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  Sendagaya_Shibu: { url: `${MADJIN}/vroid/beta/Sendagaya_Shibu.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  Sakurada_Fumiriya: { url: `${MADJIN}/vroid/beta/Sakurada_Fumiriya.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' },
  HairSample_Male: { url: `${MADJIN}/vroid/beta/HairSample_Male.vrm`, license: 'CC0-1.0', author: 'pixiv Inc. (VRoid Project)' }
};

export const M2M_BASE = M2M;
export const CACHE_DIR = '.cache';
