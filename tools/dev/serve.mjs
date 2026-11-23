// Mini server statico (sviluppo/QA) con radice = repository. Nessuna dipendenza.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary', '.vrm': 'model/gltf-binary', '.bin': 'application/octet-stream', '.wasm': 'application/wasm' };

export function serve(port = 0, root = ROOT) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const f = path.join(root, p);
      if (!f.startsWith(root)) { res.writeHead(403).end(); return; }
      fs.stat(f, (e, st) => {
        if (e || !st.isFile()) { res.writeHead(404).end('not found'); return; }
        res.writeHead(200, { 'content-type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store', 'access-control-allow-origin': '*' });
        fs.createReadStream(f).pipe(res);
      });
    });
    srv.listen(port, '127.0.0.1', () => resolve({ srv, port: srv.address().port, url: `http://127.0.0.1:${srv.address().port}` }));
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) serve(Number(process.argv[2] || 8765)).then((s) => console.log('serving', ROOT, 'on', s.url));
