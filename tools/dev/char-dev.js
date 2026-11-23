// Banco di prova di animazioni e capelli: ?modules=/tools/dev/forge-dev.js,/tools/dev/char-dev.js
// Espone dev.char = {anim, hair, adv(n, dt)} e due fogli di controllo visivo:
//   dev.char.hairSheet(cam)            una cella per ogni acconciatura
//   dev.char.clipSheet(id, tempi, cam) una cella per ogni istante della clip
import { AnimationController } from '/extension/src/engine3d/anim/animation-controller.js';
import { HairSystem } from '/extension/src/engine3d/custom/hair-system.js';

export async function devSetup(dev, q) {
  const anim = new AnimationController({ avatar: dev.avatar });
  const hair = new HairSystem({ avatar: dev.avatar, assets: dev.assets });
  await hair.init();
  anim.setBase('idle', { fade: 0 });
  const adv = (n = 1, dt = 1 / 30) => { for (let i = 0; i < n; i++) { anim.update(dt); dev.avatar.update(dt); hair.update(dt); dev.re.step(dt); } };
  if (q.get('hair')) await hair.setStyle(q.get('hair'));
  adv(30);

  // Foglio su canvas 2D sovrapposto: ogni cella è una copia del canvas WebGL subito dopo il disegno.
  function sheet(cols, rows) {
    let cv = document.getElementById('sheet');
    if (!cv) { cv = document.createElement('canvas'); cv.id = 'sheet'; cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9'; document.body.appendChild(cv); }
    cv.width = innerWidth; cv.height = innerHeight;
    const g = cv.getContext('2d'), cw = cv.width / cols, ch = cv.height / rows;
    g.fillStyle = '#2b2e40'; g.fillRect(0, 0, cv.width, cv.height);
    let k = 0;
    return (label) => {
      const src = dev.re.canvas, x = (k % cols) * cw, y = Math.floor(k / cols) * ch;
      // ritaglio centrale del canvas con le proporzioni della cella
      const sw = Math.min(src.width, src.height * (cw / ch)), sh = sw / (cw / ch);
      g.drawImage(src, (src.width - sw) / 2, (src.height - sh) / 2, sw, sh, x, y, cw, ch);
      g.fillStyle = '#fff'; g.font = '15px sans-serif'; g.fillText(label, x + 8, y + 20);
      k++;
    };
  }

  dev.char = {
    anim, hair, adv,
    async hairSheet(cam = 'upper') {
      const put = sheet(5, 2);
      dev.setCam(cam);
      for (const h of hair.list()) { await hair.setStyle(h.id); adv(45); put(h.id + ' · ' + h.name); }
      return hair.list().length;
    },
    async clipSheet(id, times, cam = 'full') {
      const put = sheet(times.length, 1);
      dev.setCam(cam);
      anim.play(id, { fade: 0 });
      let t = 0;
      for (const at of times) { const n = Math.round((at - t) * 30); adv(n); t += n / 30; put(id + ' @ ' + at.toFixed(2) + 's'); }
      return anim.current;
    }
  };
}
