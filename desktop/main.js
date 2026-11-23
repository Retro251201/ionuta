// Desktop Companion – app desktop (Electron). La ragazza 3D vive direttamente sul desktop: finestra trasparente,
// senza bordi, sempre in primo piano, fuori dalla barra delle applicazioni. I clic passano attraverso tutto tranne
// la sua sagoma (hit-test nel renderer → setIgnoreMouseEvents). Lo Studio (Character Maker) è una finestra normale.
// Il motore 3D è lo stesso dell'estensione: le pagine sono servite dal protocollo app:// dalla cartella extension/.
const { app, BrowserWindow, protocol, net, ipcMain, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');

// in sviluppo: ../extension; nell'app pacchettizzata: ./extension (copiata dallo script di build)
const ROOT = fs.existsSync(path.join(__dirname, 'extension')) ? path.join(__dirname, 'extension') : path.join(__dirname, '..', 'extension');
const W = 340, H = 600;

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);

let mate = null, studio = null, tray = null;
const stateFile = () => path.join(app.getPath('userData'), 'window-state.json');
const loadPos = () => { try { return JSON.parse(fs.readFileSync(stateFile(), 'utf8')); } catch (e) { return null; } };
const savePos = () => { if (!mate) return; try { const [x, y] = mate.getPosition(); fs.writeFileSync(stateFile(), JSON.stringify({ x, y })); } catch (e) {} };

function createMate() {
  const area = screen.getPrimaryDisplay().workArea, saved = loadPos();
  mate = new BrowserWindow({
    width: W, height: H,
    x: saved ? saved.x : area.x + area.width - W - 24, y: saved ? saved.y : area.y + area.height - H,
    transparent: true, frame: false, resizable: false, hasShadow: false, skipTaskbar: true, alwaysOnTop: true,
    backgroundColor: '#00000000', focusable: true, show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: false, backgroundThrottling: false }
  });
  mate.setAlwaysOnTop(true, 'screen-saver');
  mate.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mate.setIgnoreMouseEvents(true, { forward: true }); // clic al desktop; i movimenti arrivano comunque al renderer
  mate.loadURL('app://dc/src/companion/companion.html?desktop=1&embed=1&q=ultra');
  mate.once('ready-to-show', () => mate.showInactive());
  let lastScale = screen.getDisplayMatching(mate.getBounds()).scaleFactor;
  mate.on('move', () => { try { const sf = screen.getDisplayMatching(mate.getBounds()).scaleFactor; if (sf !== lastScale) { lastScale = sf; mate.setContentSize(W, H); } } catch (e) {} });
  mate.on('moved', savePos);
  mate.on('closed', () => { mate = null; });
}

function openStudio() {
  if (studio) { studio.show(); studio.focus(); return; }
  studio = new BrowserWindow({ width: 1280, height: 860, minWidth: 900, minHeight: 640, title: 'Desktop Companion – Studio', backgroundColor: '#14121f', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: false } });
  studio.loadURL('app://dc/src/stage/stage.html?q=high');
  studio.on('closed', () => { studio = null; if (mate) mate.webContents.send('dc', { type: 'reload' }); });
}

function buildTray() {
  const icon = nativeImage.createFromPath(path.join(ROOT, 'assets/icons/icon32.png'));
  tray = new Tray(icon);
  tray.setToolTip('Desktop Companion');
  const menu = () => Menu.buildFromTemplate([
    { label: 'Studio (personaggio, vestiti, pose)…', click: openStudio },
    { label: mate && mate.isVisible() ? 'Nascondi' : 'Mostra', click: () => { if (!mate) createMate(); else if (mate.isVisible()) mate.hide(); else mate.showInactive(); tray.setContextMenu(menu()); } },
    { label: 'Riporta in basso a destra', click: () => { const a = screen.getPrimaryDisplay().workArea; mate && mate.setPosition(a.x + a.width - W - 24, a.y + a.height - H); savePos(); } },
    { type: 'separator' },
    { label: 'Avvia con il computer', type: 'checkbox', checked: app.getLoginItemSettings().openAtLogin, click: (i) => app.setLoginItemSettings({ openAtLogin: i.checked }) },
    { type: 'separator' },
    { label: 'Esci', click: () => app.quit() }
  ]);
  tray.setContextMenu(menu());
  tray.on('click', openStudio);
}

// ---- IPC dal renderer del personaggio ----
ipcMain.on('dc:interactive', (e, on) => { const w = BrowserWindow.fromWebContents(e.sender); if (w === mate) mate.setIgnoreMouseEvents(!on, { forward: true }); });
ipcMain.on('dc:moveBy', (e, dx, dy) => {
  if (!mate) return;
  const [x, y] = mate.getPosition();
  mate.setPosition(Math.round(x + dx), Math.round(y + dy));
});
ipcMain.on('dc:dragEnd', savePos);
ipcMain.on('dc:openStudio', openStudio);
ipcMain.on('dc:changed', () => { if (mate) mate.webContents.send('dc', { type: 'reload' }); });

const single = app.requestSingleInstanceLock();
if (!single) app.quit();
else {
  app.on('second-instance', openStudio);
  app.whenReady().then(() => {
    protocol.handle('app', (req) => {
      const u = new URL(req.url);
      const p = path.normalize(path.join(ROOT, decodeURIComponent(u.pathname)));
      if (!p.startsWith(ROOT)) return new Response('forbidden', { status: 403 });
      return net.fetch(pathToFileURL(p).toString());
    });
    createMate();
    if (!process.env.DC_NO_TRAY) buildTray(); // DC_NO_TRAY: prove automatiche senza area di notifica
    // alla prima apertura lo Studio, per scegliere personaggio e volto
    if (!loadPos()) openStudio();
  });
  app.on('window-all-closed', (e) => { /* resta nella tray */ });
}
