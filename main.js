const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let overlayWindow, editorWindow;
const configPath = path.join(app.getPath('userData'), 'config.json');

// Default config
const defaultConfig = {
  overlay: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#00ff00',
    opacity: 0.9,
    fontSize: 14,
    fontFamily: 'Arial',
    posX: 50,
    posY: 50,
    width: 400,
    height: 300
  },
  player: {
    nickname: 'Player123',
    hp: 85,
    armor: 100,
    weapon: 'AK-47',
    ammo: 30,
    damage: 31
  }
};

function loadConfig() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  saveConfig(defaultConfig);
  return defaultConfig;
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function createOverlayWindow(config) {
  overlayWindow = new BrowserWindow({
    width: 400,
    height: 300,
    x: 50,
    y: 50,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    hasShadow: false
  });

  overlayWindow.loadFile('src/overlay/overlay.html');
  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.on('closed', () => { overlayWindow = null; });
}

function createEditorWindow(config) {
  editorWindow = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  editorWindow.loadFile('src/editor/editor.html');
  editorWindow.on('closed', () => { editorWindow = null; });
}

app.on('ready', () => {
  const config = loadConfig();
  createOverlayWindow(config);
  createEditorWindow(config);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-config', () => loadConfig());

ipcMain.handle('save-config', (event, config) => {
  saveConfig(config);
  if (overlayWindow) {
    overlayWindow.webContents.send('config-updated', config);
  }
  return true;
});

ipcMain.handle('update-player-data', (event, playerData) => {
  const config = loadConfig();
  config.player = { ...config.player, ...playerData };
  saveConfig(config);
  if (overlayWindow) {
    overlayWindow.webContents.send('player-data-updated', playerData);
  }
  return true;
});
