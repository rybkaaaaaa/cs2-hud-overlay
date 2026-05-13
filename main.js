const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');

let overlayWindow, editorWindow;
const configPath = path.join(app.getPath('userData'), 'config.json');
let gsiServer;
let currentGameState = {
  players: Array(10).fill(null).map((_, i) => ({
    slot: i,
    name: `Player${i + 1}`,
    hp: 100,
    armor: 100,
    weapon: 'AK-47',
    ammo: 30,
    kills: 0,
    deaths: 0,
    assists: 0,
    team: i < 5 ? 'CT' : 'T'
  }))
};

const defaultConfig = {
  overlay: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#00ff00',
    opacity: 0.95,
    fontSize: 12,
    fontFamily: 'Arial'
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

function startGSIServer() {
  const app = express();
  app.use(express.json());

  app.post('/', (req, res) => {
    const gameState = req.body;
    
    // Parse CS2 GSI data and update players
    if (gameState.player) {
      currentGameState.players = currentGameState.players.map((player, idx) => {
        // Simulate real player data (in production, parse from gameState)
        return {
          ...player,
          hp: Math.max(0, player.hp + (Math.random() * 10 - 5)),
          armor: Math.max(0, player.armor + (Math.random() * 5 - 2.5))
        };
      });

      // Send update to overlay
      if (overlayWindow) {
        overlayWindow.webContents.send('game-state-updated', currentGameState);
      }
    }

    res.json({ success: true });
  });

  gsiServer = http.createServer(app);
  gsiServer.listen(3000, 'localhost', () => {
    console.log('GSI Server listening on http://localhost:3000');
  });
}

function createOverlayWindow(config) {
  overlayWindow = new BrowserWindow({
    width: 1200,
    height: 700,
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
  startGSIServer();
  createOverlayWindow(config);
  createEditorWindow(config);
});

app.on('window-all-closed', () => {
  if (gsiServer) gsiServer.close();
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

ipcMain.handle('get-game-state', () => currentGameState);
