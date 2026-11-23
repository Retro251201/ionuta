// Preset di illuminazione (dati puri): luci della scena, tinta della foto del volto (la foto non è illuminata dal
// motore, quindi riceve la luce come moltiplicatore di colore; il file originale non cambia) e sfondo della pagina.
export const LIGHTING_PRESETS = [
  { id: 'studio', name: 'Soft Studio',
    light: { ambient: 0.95, ambientColor: '#ffffff', groundColor: '#b9a9c9', key: 1.9, keyColor: '#fff4ea', keyAzimuth: 30, keyElevation: 48, fill: 0.45, fillColor: '#cfe0ff', rim: 0.55, rimColor: '#ffe6f6', shadow: 0.28 },
    tint: '#ffffff', backdrop: 'radial-gradient(120% 80% at 50% 30%, #3a3550 0%, #1b1a2b 60%, #0f0f1a 100%)' },
  { id: 'golden', name: 'Golden Hour',
    light: { ambient: 0.7, ambientColor: '#ffd9b0', groundColor: '#7a4a3a', key: 2.3, keyColor: '#ffb469', keyAzimuth: 62, keyElevation: 18, fill: 0.35, fillColor: '#8fa8ff', rim: 1.1, rimColor: '#ffcf8a', shadow: 0.34 },
    tint: '#ffe2c2', backdrop: 'linear-gradient(180deg, #2c1f3f 0%, #9b4d5a 45%, #f2a65a 78%, #ffd59a 100%)' },
  { id: 'neon', name: 'Neon Night',
    light: { ambient: 0.45, ambientColor: '#6b5cff', groundColor: '#1a0f2e', key: 1.5, keyColor: '#ff4fd8', keyAzimuth: -48, keyElevation: 28, fill: 0.9, fillColor: '#29e0ff', rim: 1.6, rimColor: '#7af7ff', shadow: 0.2 },
    tint: '#f2d6ff', backdrop: 'radial-gradient(90% 60% at 30% 20%, #ff2fb4 0%, transparent 55%), radial-gradient(90% 60% at 80% 35%, #1fd6ff 0%, transparent 50%), linear-gradient(180deg, #120a24 0%, #05030c 100%)' },
  { id: 'moon', name: 'Moonlight',
    light: { ambient: 0.5, ambientColor: '#8fa3d9', groundColor: '#141a2e', key: 1.2, keyColor: '#c7d8ff', keyAzimuth: -30, keyElevation: 55, fill: 0.2, fillColor: '#4c5a8a', rim: 1.0, rimColor: '#dfe8ff', shadow: 0.3 },
    tint: '#c9d3ee', backdrop: 'radial-gradient(40% 30% at 75% 15%, #e8eeff 0%, #6a7bb0 18%, transparent 40%), linear-gradient(180deg, #0d1430 0%, #070a18 100%)' }
];
export const LIGHTING_BY_ID = Object.fromEntries(LIGHTING_PRESETS.map((p) => [p.id, p]));
