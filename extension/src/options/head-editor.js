/* Editor "Le tue teste": SOLO ritaglio, scontorno (canale alpha) e ancoraggio.
 * I pixel colore della foto non vengono mai modificati (niente filtri, niente stile cartoon).
 * Uscita: PNG/WebP con trasparenza, lato max 512 px, + ancoraggio collo, larghezza viso, colore pelle.
 * Espone DC.HeadEditor.mount(opts) — usato da options.js. */
(function () {
  const DC = (window.DC = window.DC || {});
  const OUT = 512, VIEW = 360, KV = OUT / VIEW;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function mount(o) {
    const $ = o.$;
    const cv = $('#heCv'), ctx = cv.getContext('2d');
    const work = document.createElement('canvas'); work.width = work.height = OUT;
    const wctx = work.getContext('2d', { willReadFrequently: true });
    const comp = document.createElement('canvas'); comp.width = comp.height = OUT;
    const cctx = comp.getContext('2d');
    const HINT = {
      frame: 'Trascina per spostare · rotellina o cursore per lo zoom.',
      magic: 'Clic sullo sfondo: cancella le zone di colore simile collegate.',
      erase: 'Trascina per cancellare a mano.',
      restore: 'Trascina per ripristinare parti cancellate.',
      anchor: 'Clic alla base del collo (punto rosa): lì la testa si aggancia al corpo.',
      skin: 'Clic sulla pelle del collo per prendere il colore.'
    };
    let img = null, stage = 0; // 0 = nessuna foto, 1 = inquadratura, 2 = scontorno
    let fr = { x: 0, y: 0, z: 1, r: 0 };
    let base = null, alpha = null, undo = [], tool = 'magic';
    let anchor = { x: 0.5, y: 0.92 }, cursor = null, dirty = true, prevDirty = true, lastPrev = 0;
    let pv = null;

    const val = (id) => Number($(id).value);
    function setHint() { $('#heHint').textContent = HINT[stage === 1 ? 'frame' : tool] || ''; }
    function outputs() {
      $('#oTol').textContent = $('#heTol').value; $('#oBrush').textContent = $('#heBrush').value;
      $('#oFeather').textContent = $('#heFeather').value; $('#oFaceW').textContent = Math.round(val('#heFaceW') * 100) + '%';
    }

    // ---------- fase 1: inquadratura ----------
    function drawFrame() {
      wctx.setTransform(1, 0, 0, 1, 0, 0); wctx.clearRect(0, 0, OUT, OUT);
      if (!img) return;
      const fit = OUT / Math.max(img.naturalWidth, img.naturalHeight);
      wctx.translate(OUT / 2 + fr.x, OUT / 2 + fr.y); wctx.rotate((fr.r * Math.PI) / 180);
      const s = fit * fr.z; wctx.scale(s, s);
      wctx.imageSmoothingQuality = 'high';
      wctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      wctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    function loadFile(f) {
      if (!f || !/^image\/(png|jpeg|webp)$/.test(f.type)) { alert('Scegli un\'immagine PNG, JPEG o WebP'); return; }
      if (f.size > 25 * 1024 * 1024) { alert('Immagine troppo grande (max 25 MB)'); return; }
      const url = URL.createObjectURL(f), im = new Image();
      im.onload = () => {
        img = im; fr = { x: 0, y: 0, z: 1, r: 0 }; $('#heZoom').value = 1; $('#heRot').value = 0;
        const nm = f.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 40); if (nm) $('#heName').value = nm;
        setStage(1);
      };
      im.onerror = () => { URL.revokeObjectURL(url); alert('Impossibile leggere l\'immagine'); };
      im.src = url;
    }

    // ---------- fase 2: scontorno ----------
    function bake() {
      drawFrame();
      base = wctx.getImageData(0, 0, OUT, OUT);
      alpha = new Uint8ClampedArray(OUT * OUT).fill(255);
      undo = []; anchor = { x: 0.5, y: 0.92 };
    }
    function pushUndo() { undo.push(alpha.slice()); if (undo.length > 15) undo.shift(); }
    function blurAlpha(a) { // box 3x3: bordi morbidi dopo gomma magica
      const out = new Uint8ClampedArray(a.length);
      for (let y = 0; y < OUT; y++) for (let x = 0; x < OUT; x++) {
        let s = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) { const yy = y + dy; if (yy < 0 || yy >= OUT) continue; for (let dx = -1; dx <= 1; dx++) { const xx = x + dx; if (xx < 0 || xx >= OUT) continue; s += a[yy * OUT + xx]; n++; } }
        out[y * OUT + x] = s / n;
      }
      return out;
    }
    function compose() {
      const id = cctx.createImageData(OUT, OUT), d = id.data, b = base.data;
      const a = blurAlpha(alpha);
      const oval = $('#heOval').checked, f = val('#heFeather') * KV;
      const rx = (val('#heOvW') * OUT) / 2, ry = (val('#heOvH') * OUT) / 2;
      const cx = anchor.x * OUT, cy = anchor.y * OUT - ry * 0.98, mr = Math.min(rx, ry);
      for (let y = 0; y < OUT; y++) for (let x = 0; x < OUT; x++) {
        const i = y * OUT + x, j = i * 4;
        let m = a[i] / 255;
        if (oval) {
          const dx = (x - cx) / rx, dy = (y - cy) / ry, t = (1 - Math.sqrt(dx * dx + dy * dy)) * mr;
          m *= f > 0 ? clamp(t / f, 0, 1) : t >= 0 ? 1 : 0;
        }
        d[j] = b[j]; d[j + 1] = b[j + 1]; d[j + 2] = b[j + 2]; d[j + 3] = b[j + 3] * m;
      }
      cctx.putImageData(id, 0, 0);
    }
    function magicErase(px, py) {
      const b = base.data, s = (py * OUT + px) * 4;
      const r0 = b[s], g0 = b[s + 1], b0 = b[s + 2], tol = val('#heTol') * 1.7, tol2 = tol * tol;
      const seen = new Uint8Array(OUT * OUT), stack = new Int32Array(OUT * OUT); let sp = 0;
      stack[sp++] = py * OUT + px; seen[py * OUT + px] = 1;
      while (sp) {
        const i = stack[--sp], j = i * 4;
        const dr = b[j] - r0, dg = b[j + 1] - g0, db = b[j + 2] - b0;
        if (dr * dr + dg * dg + db * db > tol2 && b[j + 3] > 8) continue;
        alpha[i] = 0;
        const x = i % OUT, y = (i / OUT) | 0;
        if (x > 0 && !seen[i - 1]) { seen[i - 1] = 1; stack[sp++] = i - 1; }
        if (x < OUT - 1 && !seen[i + 1]) { seen[i + 1] = 1; stack[sp++] = i + 1; }
        if (y > 0 && !seen[i - OUT]) { seen[i - OUT] = 1; stack[sp++] = i - OUT; }
        if (y < OUT - 1 && !seen[i + OUT]) { seen[i + OUT] = 1; stack[sp++] = i + OUT; }
      }
    }
    function brush(px, py, restore) {
      const r = val('#heBrush') * KV, r2 = r * r, inner = r * 0.55;
      for (let y = Math.max(0, Math.floor(py - r)); y <= Math.min(OUT - 1, Math.ceil(py + r)); y++)
        for (let x = Math.max(0, Math.floor(px - r)); x <= Math.min(OUT - 1, Math.ceil(px + r)); x++) {
          const dd = (x - px) * (x - px) + (y - py) * (y - py); if (dd > r2) continue;
          const k = clamp((r - Math.sqrt(dd)) / (r - inner), 0, 1) * 255, i = y * OUT + x;
          alpha[i] = restore ? Math.max(alpha[i], k) : Math.min(alpha[i], 255 - k);
        }
    }
    function sampleSkin(px, py) {
      const b = base.data; let r = 0, g = 0, bl = 0, n = 0;
      for (let y = py - 3; y <= py + 3; y++) for (let x = px - 3; x <= px + 3; x++) {
        if (x < 0 || y < 0 || x >= OUT || y >= OUT) continue; const j = (y * OUT + x) * 4; if (b[j + 3] < 128) continue;
        r += b[j]; g += b[j + 1]; bl += b[j + 2]; n++;
      }
      if (!n) return;
      const hx = (v) => Math.round(v / n).toString(16).padStart(2, '0');
      $('#heSkin').value = '#' + hx(r) + hx(g) + hx(bl);
    }

    // ---------- disegno ----------
    function render() {
      ctx.clearRect(0, 0, VIEW, VIEW);
      if (stage === 1) {
        drawFrame(); ctx.drawImage(work, 0, 0, VIEW, VIEW);
        ctx.save(); ctx.strokeStyle = '#ff5d8f'; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(VIEW / 2, VIEW * 0.47, VIEW * 0.27, VIEW * 0.36, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ff5d8f'; ctx.font = '11px system-ui'; ctx.fillText('viso qui · collo in basso', 8, VIEW - 8); ctx.restore();
        return;
      }
      if (stage !== 2) return;
      if (dirty) { compose(); dirty = false; prevDirty = true; }
      ctx.globalAlpha = 0.14; ctx.drawImage(work, 0, 0, VIEW, VIEW); ctx.globalAlpha = 1;
      ctx.drawImage(comp, 0, 0, VIEW, VIEW);
      const ax = anchor.x * VIEW, ay = anchor.y * VIEW, fw = val('#heFaceW') * VIEW;
      ctx.save(); ctx.strokeStyle = '#ff5d8f'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(ax - fw / 2, 4); ctx.lineTo(ax - fw / 2, ay); ctx.moveTo(ax + fw / 2, 4); ctx.lineTo(ax + fw / 2, ay); ctx.stroke();
      if ($('#heOval').checked) {
        const rx = (val('#heOvW') * VIEW) / 2, ry = (val('#heOvH') * VIEW) / 2;
        ctx.strokeStyle = '#845ef7'; ctx.beginPath(); ctx.ellipse(ax, ay - ry * 0.98, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.setLineDash([]); ctx.fillStyle = '#ff5d8f'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (cursor && (tool === 'erase' || tool === 'restore')) {
        ctx.strokeStyle = tool === 'erase' ? '#fa5252' : '#20c997'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cursor.x, cursor.y, val('#heBrush'), 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
    function previewHead(dataUrl, w, h) {
      return { id: 'preview', name: 'Anteprima', dataUrl, w, h, anchorX: anchor.x, anchorY: anchor.y, faceW: val('#heFaceW'), skin: $('#heSkin').value };
    }
    function updatePreview(now) {
      if (!pv || stage !== 2 || !prevDirty || now - lastPrev < 350) return;
      prevDirty = false; lastPrev = now;
      const sm = document.createElement('canvas'); sm.width = sm.height = 256;
      sm.getContext('2d').drawImage(comp, 0, 0, 256, 256);
      const L = o.getLook ? o.getLook() : {};
      if (L.look) pv.look = Object.assign({}, pv.look, L.look);
      if (L.outfit) pv.outfit = L.outfit;
      pv.setHead(previewHead(sm.toDataURL('image/png'), OUT, OUT), sm.toDataURL('image/png'));
    }
    (function loop(t) {
      if (stage) render();
      if (pv && stage === 2) {
        updatePreview(t);
        const p = DC.Body.restPose(), s = t / 1000; p.headTilt = 3 * Math.sin(s * 1.4); p.sqy = 1 + 0.012 * Math.sin(s * 2.2);
        pv.setPose(p);
      }
      requestAnimationFrame(loop);
    })(0);

    // ---------- interazione ----------
    function pt(e) { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * VIEW, y: ((e.clientY - r.top) / r.height) * VIEW }; }
    let drag = null;
    cv.addEventListener('pointerdown', (e) => {
      if (!stage) return; cv.setPointerCapture(e.pointerId);
      const p = pt(e), px = clamp(Math.round(p.x * KV), 0, OUT - 1), py = clamp(Math.round(p.y * KV), 0, OUT - 1);
      if (stage === 1) { drag = { p, fx: fr.x, fy: fr.y }; return; }
      if (tool === 'magic') { pushUndo(); magicErase(px, py); dirty = true; }
      else if (tool === 'erase' || tool === 'restore') { pushUndo(); brush(px, py, tool === 'restore'); dirty = true; drag = { p }; }
      else if (tool === 'anchor') { anchor = { x: px / OUT, y: py / OUT }; dirty = true; }
      else if (tool === 'skin') { sampleSkin(px, py); prevDirty = true; }
    });
    cv.addEventListener('pointermove', (e) => {
      const p = pt(e); cursor = p;
      if (!drag) return;
      if (stage === 1) { fr.x = drag.fx + (p.x - drag.p.x) * KV; fr.y = drag.fy + (p.y - drag.p.y) * KV; }
      else if (tool === 'erase' || tool === 'restore') {
        const steps = Math.max(1, Math.ceil(Math.hypot(p.x - drag.p.x, p.y - drag.p.y) / 3));
        for (let k = 1; k <= steps; k++) brush(((drag.p.x + ((p.x - drag.p.x) * k) / steps) * KV), ((drag.p.y + ((p.y - drag.p.y) * k) / steps) * KV), tool === 'restore');
        drag.p = p; dirty = true;
      }
    });
    const endDrag = () => { drag = null; };
    cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
    cv.addEventListener('pointerleave', () => { cursor = null; });
    cv.addEventListener('wheel', (e) => {
      if (stage !== 1) return; e.preventDefault();
      fr.z = clamp(fr.z * (e.deltaY < 0 ? 1.06 : 1 / 1.06), 0.2, 4); $('#heZoom').value = fr.z;
    }, { passive: false });
    $('#heZoom').addEventListener('input', () => { fr.z = val('#heZoom'); });
    $('#heRot').addEventListener('input', () => { fr.r = val('#heRot'); });
    for (const id of ['#heTol', '#heBrush', '#heFeather', '#heFaceW']) $(id).addEventListener('input', () => { outputs(); dirty = true; });
    for (const id of ['#heOval', '#heOvW', '#heOvH']) $(id).addEventListener('input', () => { dirty = true; });
    $('#heSkin').addEventListener('input', () => { prevDirty = true; });
    $('#heTools').addEventListener('click', (e) => { const b = e.target.closest('[data-tool]'); if (b) setTool(b.dataset.tool); });
    $('#heFile').addEventListener('change', (e) => { loadFile(e.target.files[0]); e.target.value = ''; });
    $('#heNext').onclick = () => { bake(); setStage(2); };
    $('#heBack').onclick = () => { if (!undo.length || confirm('Tornando all\'inquadratura perdi lo scontorno. Continuare?')) setStage(1); };
    $('#heUndo').onclick = () => { if (undo.length) { alpha = undo.pop(); dirty = true; } };
    $('#heCancel').onclick = () => { if (confirm('Annullare la foto in modifica?')) reset(); };
    $('#heSave').onclick = async () => {
      const head = exportHead(); if (!head) return;
      $('#heSave').disabled = true;
      try { if (await o.onSave(head)) reset(); } finally { $('#heSave').disabled = false; }
    };

    function setTool(t) { tool = t; for (const b of document.querySelectorAll('#heTools [data-tool]')) b.classList.toggle('on', b.dataset.tool === t); setHint(); }
    function setStage(s) {
      stage = s;
      $('#heBody').classList.toggle('hidden', !s);
      $('#heFrame').classList.toggle('hidden', s !== 1);
      $('#heCut').classList.toggle('hidden', s !== 2);
      $('#heStep').textContent = s === 1 ? '2 · Inquadra testa e collo' : s === 2 ? '3 · Scontorna e ancora' : '1 · Scegli una foto';
      if (s === 2) {
        dirty = true;
        if (!pv && o.previewBox) { pv = new DC.Body(); o.previewBox.innerHTML = ''; o.previewBox.appendChild(pv.svg); }
      }
      setHint();
    }
    function reset() { img = null; base = null; alpha = null; undo = []; setStage(0); if (o.previewBox) o.previewBox.innerHTML = ''; pv = null; }

    // ---------- esportazione ----------
    function exportHead() {
      compose();
      const d = cctx.getImageData(0, 0, OUT, OUT).data;
      let x0 = OUT, y0 = OUT, x1 = -1, y1 = -1;
      for (let y = 0; y < OUT; y++) for (let x = 0; x < OUT; x++) if (d[(y * OUT + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 < 0) { alert('L\'immagine è completamente trasparente'); return null; }
      const ax = anchor.x * OUT, ay = anchor.y * OUT, pad = 6;
      x0 = Math.max(0, Math.min(x0, ax) - pad); y0 = Math.max(0, Math.min(y0, ay) - pad);
      x1 = Math.min(OUT - 1, Math.max(x1, ax) + pad); y1 = Math.min(OUT - 1, Math.max(y1, ay) + pad);
      const bw = Math.round(x1 - x0 + 1), bh = Math.round(y1 - y0 + 1);
      let scale = 1, dataUrl = '', w = bw, h = bh;
      for (let tries = 0; tries < 4; tries++) {
        w = Math.max(16, Math.round(bw * scale)); h = Math.max(16, Math.round(bh * scale));
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(comp, x0, y0, bw, bh, 0, 0, w, h);
        dataUrl = c.toDataURL('image/webp', 0.92);
        if (!dataUrl.startsWith('data:image/webp')) dataUrl = c.toDataURL('image/png');
        if (dataUrl.length < 1.4 * 1024 * 1024) break;
        scale *= 0.75;
      }
      return {
        name: ($('#heName').value || 'La mia foto').trim().slice(0, 40),
        dataUrl, w, h,
        anchorX: clamp((ax - x0) / bw, 0, 1), anchorY: clamp((ay - y0) / bh, 0, 1),
        faceW: clamp((val('#heFaceW') * OUT) / bw, 0.15, 1.2),
        skin: $('#heSkin').value
      };
    }

    outputs(); setTool('magic'); setStage(0);
    return { reset };
  }

  DC.HeadEditor = { mount };
})();
