// Banco di prova della Garment Forge: ?modules=/tools/dev/forge-dev.js&items=<json base64 opzionale>
// Espone dev.forge = {model, materials, wear(item, config), clear(), hideBody()}.
import { BodyModel } from '/extension/src/engine3d/wardrobe/forge/body-model.js';
import { buildGarment } from '/extension/src/engine3d/wardrobe/forge/garment-builder.js';
import { MaterialSystem } from '/extension/src/engine3d/material/material-system.js';

export const TEST_ITEMS = {
  bra: { id: 'bra', colors: [{ key: 'main', default: '#f4f0f5' }, { key: 'accent', default: '#e9a9c0' }], recipe: { parts: [{ type: 'shell', offset: 0.0025, region: { strapless: 'bust+0.035', sweetheart: 0.02, straps: { x: 0.062, w: 0.014 }, bottom: 'underbust-0.005', sleeve: 'none', armhole: 0.02 }, trims: [{ at: 'hem', type: 'band', width: 0.008, thick: 0.0012 }] }] } },
  brief: { id: 'brief', colors: [{ key: 'main', default: '#f4f0f5' }, { key: 'accent', default: '#e9a9c0' }], recipe: { parts: [{ type: 'shell', offset: 0.0025, region: { top: 'hip+0.06', bottom: 'crotch-0.012', hemCurve: 1.05 }, trims: [{ at: 'top', type: 'band', width: 0.008, thick: 0.0012 }] }] } },
  tshirt: { id: 'tshirt', colors: [{ key: 'main', default: '#ffffff' }, { key: 'accent', default: '#22325e' }], recipe: { parts: [{ type: 'shell', offset: 0.006, fit: 0.85, ease: 0.006, region: { neck: { shape: 'crew', depth: 0.05, width: 0.15, back: 0.02 }, sleeve: 0.3, bottom: 'hip+0.02' }, sleeveFit: { r1: 0.062, sag: 0.3 }, trims: [{ at: 'neck', type: 'band', width: 0.012, thick: 0.002 }] }] } },
  skirt: { id: 'skirt', colors: [{ key: 'main', default: '#22325e' }, { key: 'accent', default: '#22325e' }], recipe: { parts: [{ type: 'skirt', top: 'waist-0.005', length: 0.36, gap: 0.01, flare: 0.1, pleats: { count: 28, depth: 0.009 }, trims: [{ at: 'waist', type: 'band', width: 0.03, thick: 0.003, inset: 0.004 }] }] } },
  socks: { id: 'socks', colors: [{ key: 'main', default: '#1d1d26' }], recipe: { parts: [{ type: 'shell', offset: 0.002, region: { top: 'knee+0.14', legsOnly: true } }] } },
  loafers: { id: 'loafers', colors: [{ key: 'main', default: '#4a3022' }, { key: 'sole', default: '#1c120c' }], finish: 'leather', recipe: { parts: [{ type: 'shoe', sole: 0.014, topProfile: [[0, 0.078], [0.22, 0.056], [0.5, 0.056], [0.63, 0.2], [1, 0.2]] }] } },
  pumps: { id: 'pumps', colors: [{ key: 'main', default: '#b01030' }, { key: 'sole', default: '#1c120c' }], finish: 'latex', recipe: { parts: [{ type: 'shoe', sole: 0.006, pitch: 26, heelWidth: 0.012, toe: 'point', toeLen: 0.012, offset: 0.004, topProfile: [[0, 0.07], [0.2, 0.04], [0.66, 0.04], [0.78, 0.2], [1, 0.2]] }] } },
  boots: { id: 'boots', colors: [{ key: 'main', default: '#20222a' }, { key: 'sole', default: '#101014' }], finish: 'leather', recipe: { parts: [{ type: 'shell', offset: 0.007, region: { top: 'knee-0.06', legsOnly: true, noFeet: 'ankle-0.03' }, legFit: { profile: [['knee-0.05', 0.062], ['ankle+0.02', 0.05]] } }, { type: 'shoe', top: 'ankle+0.0', sole: 0.02, platform: 0.012, toeBulk: 0.004 }] } }
};

export async function devSetup(dev, q) {
  const model = new BodyModel(dev.avatar), materials = new MaterialSystem();
  const worn = [];
  const body = dev.avatar.bodyMesh, fullIndex = body.geometry.index.array.slice();
  const forge = (dev.forge = {
    model, materials, worn,
    wear(item, config = {}, opts) {
      const t0 = performance.now();
      const g = buildGarment(model, item, config, materials, opts);
      g.ms = performance.now() - t0;
      if (g.mesh) { body.parent.add(g.mesh); worn.push(g); }
      return g;
    },
    clear() { for (const g of worn) { g.mesh.parent.remove(g.mesh); g.mesh.geometry.dispose(); materials.release(g.materials); } worn.length = 0; body.geometry.setIndex(Array.from(fullIndex)); },
    hideBody(margin = 0.012) {
      const idx = [];
      for (let t = 0; t < fullIndex.length; t += 3) {
        let covered = false;
        for (const g of worn) if (g.hide && g.hide[fullIndex[t]] > margin && g.hide[fullIndex[t + 1]] > margin && g.hide[fullIndex[t + 2]] > margin) { covered = true; break; }
        if (!covered) idx.push(fullIndex[t], fullIndex[t + 1], fullIndex[t + 2]);
      }
      body.geometry.setIndex(idx);
      body.geometry.clearGroups();
      const mats = Array.isArray(body.material) ? body.material : [body.material];
      mats.forEach((_, k) => body.geometry.addGroup(0, idx.length, k));
      return idx.length / 3;
    }
  });
  const want = (q.get('wear') || '').split(',').filter(Boolean);
  dev.avatar.root.position.y = -model.M.soleY;
  for (const id of want) if (TEST_ITEMS[id]) { const it = JSON.parse(JSON.stringify(TEST_ITEMS[id])); if (id === 'tshirt' && q.get('tuck')) it.recipe.parts[0].tuckAt = 'waist-0.005'; const g = forge.wear(it); if (g.foot) { dev.avatar.root.position.y = g.foot.lift - model.M.soleY; forge.pitch = g.foot.pitch; } }
  if (want.length) forge.hideBody();
}
