const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  updatePlayerData: (playerData) => ipcRenderer.invoke('update-player-data', playerData),
  onConfigUpdated: (callback) => ipcRenderer.on('config-updated', (event, config) => callback(config)),
  onPlayerDataUpdated: (callback) => ipcRenderer.on('player-data-updated', (event, playerData) => callback(playerData))
});
