const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getGameState: () => ipcRenderer.invoke('get-game-state'),
  onConfigUpdated: (callback) => ipcRenderer.on('config-updated', (event, config) => callback(config)),
  onGameStateUpdated: (callback) => ipcRenderer.on('game-state-updated', (event, gameState) => callback(gameState))
});
