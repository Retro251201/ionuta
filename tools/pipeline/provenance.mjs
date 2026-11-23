// Provenienza degli asset distribuiti che NON sono CC0 ma hanno una concessione d'uso libera, documentata e
// verificata (modifica, redistribuzione e uso commerciale consentiti, senza attribuzione). Fonte unica di verità
// per l'audit delle licenze e per i test. Ogni voce cita l'autore, l'URL dei termini e il testo della concessione.
export const FREE_USE = {
  // Corpo base adulto: modello di esempio VRoid Studio 1.x ripubblicato da hinzka con 52 blendshape "Perfect Sync".
  // Il README concede esplicitamente uso personale e commerciale, modifica, redistribuzione e vendita, senza credito.
  // (I metadati VRM ereditano l'impostazione predefinita di VRoid Studio; la concessione reale è quella del README.)
  'VRoid_V110_Female_v1.1.3': {
    author: 'hinzka',
    url: 'https://github.com/hinzka/52blendshapes-for-VRoid-face',
    license: 'free-use',
    terms: 'uso personale e commerciale, modifica, redistribuzione e vendita consentiti senza attribuzione (README del repository)'
  }
};

/** File distribuiti (relativi a extension/assets) coperti da una concessione d'uso libera documentata. */
export const FREE_USE_FILES = {
  'avatar/female.vrm': 'VRoid_V110_Female_v1.1.3',
  'hair/vroid_long.vrm': 'VRoid_V110_Female_v1.1.3'
};

export const FREE_USE_SOURCES = new Set(Object.keys(FREE_USE));
