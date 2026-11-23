// Photo Head: la testa FOTOGRAFICA nel renderer 3D.
// La foto originale (assets/heads/*.png o una testa caricata dall'utente) viene usata come texture così com'è:
// nessun pixel viene ridisegnato, filtrato o sostituito (l'identità resta quella della foto). La geometria è un
// guscio a forma di testa (ellissoide con rilievo di naso e zigomi) su cui la foto è proiettata frontalmente; il
// retro è lo stesso contorno con la foto scurita, così di lato e di spalle la testa ha volume e non sparisce.
// Il guscio è figlio dell'osso testa: segue animazioni, sguardo e respirazione.
//
// Descrittore di testa (lo stesso dei dati v0.2, DC.HEADS / dc_customHeads):
//   { id, url, w, h, anchorX, anchorY, faceW }   anchor = punto mento/collo in frazioni dell'immagine,
//                                                faceW = larghezza del viso in frazione della larghezza immagine.
import { THREE } from '../lib.js';
import { Emitter } from '../core/events.js';

/** Larghezza reale del viso di un adulto (metri): fissa la scala della foto e quindi le proporzioni del corpo. */
export const FACE_WIDTH = 0.148;
const GRID = 72;          // risoluzione del guscio (vertici per lato)
const BACK_TINT = 0.32;   // luminosità del retro (foto scurita: nuca, cappello, capelli)

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Profilo di profondità del guscio in coordinate del viso (metri, origine al mento, Y in alto). Funzione pura. */
export function headDepth(x, y, fw = FACE_WIDTH) {
  const rx = fw * 0.56, ry = fw * 0.78, cy = fw * 0.72, rz = fw * 0.62;
  const nx = x / rx, ny = (y - cy) / ry, r2 = nx * nx + ny * ny;
  // dentro l'ellisse: volume del cranio; fuori (tese del cappello, ciocche): lamina sottile che si raccorda al bordo
  const inside = r2 < 1 ? Math.sqrt(1 - r2) : 0;
  const rim = r2 < 1 ? 0 : Math.exp(-(Math.sqrt(r2) - 1) * 6) * 0.06;
  // rilievo frontale: naso e arcate, per un minimo di parallasse quando la testa ruota
  const nose = Math.exp(-((x / (fw * 0.09)) ** 2) - (((y - fw * 0.52) / (fw * 0.2)) ** 2)) * 0.13;
  const brow = Math.exp(-(((y - fw * 0.86) / (fw * 0.12)) ** 2)) * Math.max(0, 1 - (x / (fw * 0.5)) ** 2) * 0.05;
  const front = rz * (0.72 * inside + rim + (nose + brow) * inside);
  const back = -rz * (1.05 * inside + rim * 0.5);
  return { front, back, inside: r2 < 1 };
}

function buildGeometry(desc, side) {
  const { w, h, anchorX, anchorY, faceW } = desc;
  const s = FACE_WIDTH / (faceW * w); // metri per pixel
  const n = GRID, pos = new Float32Array((n + 1) * (n + 1) * 3), uv = new Float32Array((n + 1) * (n + 1) * 2);
  let k = 0;
  for (let j = 0; j <= n; j++) {
    for (let i = 0; i <= n; i++) {
      const u = i / n, v = j / n;
      const x = (u - anchorX) * w * s, y = (anchorY - v) * h * s;
      const d = headDepth(x, y);
      pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = side === 'front' ? d.front : d.back;
      uv[k * 2] = u; uv[k * 2 + 1] = 1 - v;
      k++;
    }
  }
  const idx = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const a = j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1;
    if (side === 'front') idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return { geometry: g, scale: s };
}

export class PhotoHead extends Emitter {
  /** @param {{avatar: import('../avatar/avatar-loader.js').Avatar, assets: import('../assets/asset-manager.js').AssetManager}} o */
  constructor({ avatar, assets }) {
    super();
    this.avatar = avatar;
    this.assets = assets;
    this.current = null; // {id, url, group, texture, materials}
    this._token = 0;
    this.tint = new THREE.Color(1, 1, 1);
  }

  get id() { return this.current ? this.current.id : null; }
  get active() { return !!this.current; }

  /** Monta una testa fotografica (null = torna al viso 3D). */
  async set(desc) {
    const token = ++this._token;
    if (!desc) { this._unmount(); this._showAnimeHead(true); this.emit('change', { id: null }); return null; }
    if (this.current && this.current.url === desc.url) return this.current.id;
    const texture = await this.assets.texture(desc.url);
    if (token !== this._token) { this.assets.releaseTexture(texture); return this.id; }
    // nessun filtro, nessun mipmap "sporcato" ai bordi trasparenti: la foto si vede com'è
    texture.generateMipmaps = true; texture.minFilter = THREE.LinearMipmapLinearFilter; texture.anisotropy = 8;
    const img = texture.image;
    const d = { ...desc, w: desc.w || img.naturalWidth || img.width, h: desc.h || img.naturalHeight || img.height };
    this._unmount();
    this._mount(d, texture);
    this._showAnimeHead(false);
    this.emit('change', { id: d.id });
    return d.id;
  }

  _mount(d, texture) {
    const group = new THREE.Group();
    group.name = 'PhotoHead:' + (d.id || 'custom');
    const front = buildGeometry(d, 'front'), back = buildGeometry(d, 'back');
    const common = { map: texture, alphaTest: 0.5, transparent: false, toneMapped: false };
    const mFront = new THREE.MeshBasicMaterial({ ...common, side: THREE.FrontSide });
    const mBack = new THREE.MeshBasicMaterial({ ...common, side: THREE.FrontSide, color: new THREE.Color(BACK_TINT, BACK_TINT * 0.96, BACK_TINT * 1.02) });
    // retro: stessa sagoma della foto ma desaturata e scura (nuca in ombra), senza la pelle rossastra del ritaglio
    mBack.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n  diffuseColor.rgb = vec3(dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)));');
    };
    mFront.color.copy(this.tint);
    const a = new THREE.Mesh(front.geometry, mFront), b = new THREE.Mesh(back.geometry, mBack);
    a.name = 'PhotoHeadFront'; b.name = 'PhotoHeadBack';
    for (const m of [a, b]) { m.castShadow = true; m.receiveShadow = false; m.frustumCulled = false; m.renderOrder = 1; }
    group.add(a, b);
    // spazio locale dell'osso testa = spazio del modello VRM 0.x (fronte −Z): il guscio (fronte +Z) va girato di 180°
    const head = this.avatar.bones.head;
    group.rotation.y = this.avatar.isVRM0 ? Math.PI : 0;
    const m = this.avatar.headMetrics();
    group.position.set(0, m.chinY, (this.avatar.isVRM0 ? -1 : 1) * m.centerZ);
    head.add(group);
    this.current = { id: d.id, url: d.url, group, texture, materials: [mFront, mBack], scale: front.scale, desc: d };
  }

  _unmount() {
    const c = this.current;
    if (!c) return;
    this.current = null;
    c.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    for (const m of c.materials) m.dispose();
    if (c.group.parent) c.group.parent.remove(c.group);
    this.assets.releaseTexture(c.texture);
  }

  _showAnimeHead(on) { for (const m of this.avatar.faceMeshes) m.visible = on && m !== this.avatar.face.extra; }

  /** Dove tagliare i capelli 3D perché non coprano la foto (spazio dell'osso testa, canonico). */
  hairCut() { const m = this.avatar.headMetrics(); return { chinY: m.chinY + 0.012, cutZ: m.centerZ - 0.005 }; }

  /** Tinta della luce ambiente sulla foto (preset di illuminazione): 1 = colori originali. */
  setTint(color) { this.tint.set(color); if (this.current) this.current.materials[0].color.copy(this.tint); }

  /** Dati per i test di identità: la texture mostrata è esattamente il file della testa scelta. */
  identity() { const c = this.current; return c ? { id: c.id, url: c.url, textureSrc: c.texture.image && c.texture.image.src, w: c.desc.w, h: c.desc.h } : null; }

  dispose() { this._token++; this._unmount(); this._showAnimeHead(true); }
}
