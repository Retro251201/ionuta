// Ponte minimo e sicuro tra le pagine del motore 3D e il processo principale (solo i messaggi necessari).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dcDesktop', {
  isDesktop: true,
  setInteractive: (on) => ipcRenderer.send('dc:interactive', !!on),
  moveBy: (dx, dy) => ipcRenderer.send('dc:moveBy', Number(dx) || 0, Number(dy) || 0),
  dragEnd: () => ipcRenderer.send('dc:dragEnd'),
  openStudio: () => ipcRenderer.send('dc:openStudio'),
  changed: () => ipcRenderer.send('dc:changed'),
  on: (fn) => ipcRenderer.on('dc', (_e, msg) => fn(msg))
});
