const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const DemoParser = require('./demo-parser');

let overlayWindow, editorWindow;
const configPath = path.join(app.getPath('userData'), 'config.json');
let gsiServer;
let demoParser = new DemoParser();

// Auto-detection variables
let gsiActive = false;
let lastGSIUpdate = 0;
const GSI_TIMEOUT = 5000; // 5 seconds timeout
let gsiCheckInterval;

// Inventory mapping for weapon names
const weaponNames = {
  'weapon_ak47': 'AK-47',
  'weapon_m4a1': 'M4A1',
  'weapon_awp': 'AWP',
  'weapon_deagle': 'Desert Eagle',
  'weapon_glock': 'Glock-18',
  'weapon_knife': 'Knife',
  'weapon_m4a1_silencer': 'M4A1-S',
  'weapon_aug': 'AUG',
  'weapon_sg553': 'SG 553',
  'weapon_famas': 'FAMAS',
  'weapon_galil': 'Galil AR',
  'weapon_usp': 'USP-S',
  'weapon_p250': 'P250',
  'weapon_tec9': 'Tec-9',
  'weapon_five_seven': 'Five-SeveN',
  'weapon_cz75auto': 'CZ75-Auto',
  'weapon_dual_berettas': 'Dual Berettas',
  'weapon_mp9': 'MP9',
  'weapon_mac10': 'MAC-10',
  'weapon_ump45': 'UMP-45',
  'weapon_p90': 'P90',
  'weapon_bizon': 'PP-Bizon',
  'weapon_mp7': 'MP7',
  'weapon_nova': 'Nova',
  'weapon_xm1014': 'XM1014',
  'weapon_sawedoff': 'Sawed-Off',
  'weapon_mag7': 'MAG-7',
  'weapon_m249': 'M249',
  'weapon_negev': 'Negev',
  'weapon_ssg08': 'SSG 08',
  'weapon_scout': 'SSG 08'
};

let currentGameState = {
  players: Array(10).fill(null).map((_, i) => ({
    slot: i,
    name: `Player${i + 1}`,
    hp: 100,
    armor: 0,
    weapon: 'Unknown',
    ammo: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    team: i < 5 ? 'CT' : 'T'
  })),
  demoMode: false,
  demoPath: null,
  gsiMode: false,
  mode: 'idle' // 'idle', 'live', 'demo'
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

function parseWeaponName(weaponData) {
  if (!weaponData) return 'Unknown';
  
  if (weaponData.name) {
    return weaponNames[weaponData.name] || weaponData.name;
  }
  
  return 'Unknown';
}

function parsePlayersFromGSI(gameState) {
  const updatedPlayers = [...currentGameState.players];
  
  if (!gameState.players) {
    return updatedPlayers;
  }

  Object.keys(gameState.players).forEach((steamId) => {
    const playerData = gameState.players[steamId];
    
    if (!playerData) return;

    const slot = playerData.observer_slot || 0;
    if (slot < 0 || slot >= 10) return;

    const team = playerData.team === 'CT' ? 'CT' : playerData.team === 'T' ? 'T' : 'Unassigned';

    let currentWeapon = 'Unknown';
    let ammo = 0;

    if (playerData.weapons) {
      Object.keys(playerData.weapons).forEach(weaponSlot => {
        const weapon = playerData.weapons[weaponSlot];
        if (weapon && weapon.state === 'active') {
          currentWeapon = parseWeaponName(weapon);
          ammo = weapon.ammo_clip || 0;
        }
      });
    }

    const stats = playerData.match_stats || {};
    const state = playerData.state || {};

    updatedPlayers[slot] = {
      slot: slot,
      name: playerData.name || `Player${slot + 1}`,
      hp: state.health || 0,
      armor: state.armor || 0,
      weapon: currentWeapon,
      ammo: ammo,
      kills: stats.kills || 0,
      deaths: stats.deaths || 0,
      assists: stats.assists || 0,
      team: team,
      steamId: steamId
    };
  });

  return updatedPlayers;
}

function startGSIServer() {
  const expressApp = express();
  expressApp.use(express.json());

  expressApp.post('/', (req, res) => {
    const gameState = req.body;
    
    if (gameState && gameState.players) {
      lastGSIUpdate = Date.now();
      
      // Mark as LIVE mode
      if (!gsiActive) {
        gsiActive = true;
        currentGameState.mode = 'live';
        currentGameState.gsiMode = true;
        console.log('🎮 LIVE MODE ACTIVATED - GSI Data Received!');
        
        if (editorWindow && !editorWindow.isDestroyed()) {
          editorWindow.webContents.send('mode-changed', { mode: 'live', message: '🎮 LIVE MODE' });
        }
      }
      
      currentGameState.players = parsePlayersFromGSI(gameState);
      currentGameState.demoMode = false;
      
      console.log(`[GSI] Update received - ${currentGameState.players.filter(p => p.hp > 0).length} players`);

      if (overlayWindow && !overlayWindow.isDestroyed()) {
        overlayWindow.webContents.send('game-state-updated', currentGameState);
      }
    }

    res.json({ success: true });
  });

  gsiServer = http.createServer(expressApp);
  gsiServer.listen(3000, 'localhost', () => {
    console.log('✅ GSI Server listening on http://localhost:3000');
  });

  // Check if GSI is still active
  gsiCheckInterval = setInterval(() => {
    const timeSinceLastUpdate = Date.now() - lastGSIUpdate;
    
    if (timeSinceLastUpdate > GSI_TIMEOUT && gsiActive) {
      gsiActive = false;
      currentGameState.mode = 'idle';
      currentGameState.gsiMode = false;
      console.log('❌ LIVE MODE TIMEOUT - No GSI data received');
      
      if (editorWindow && !editorWindow.isDestroyed()) {
        editorWindow.webContents.send('mode-changed', { 
          mode: 'idle', 
          message: '⏳ Waiting for LIVE data or load a DEMO...' 
        });
      }
    }
  }, 1000);
}

function createOverlayWindow(config) {
  overlayWindow = new BrowserWindow({
    width: 1400,
    height: 800,
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
  overlayWindow.webContents.openDevTools();
  overlayWindow.on('closed', () => { overlayWindow = null; });
}

function createEditorWindow(config) {
  editorWindow = new BrowserWindow({
    width: 600,
    height: 900,
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
  
  // Send initial state to editor
  setTimeout(() => {
    if (editorWindow && !editorWindow.isDestroyed()) {
      editorWindow.webContents.send('mode-changed', { 
        mode: 'idle', 
        message: '⏳ Waiting for LIVE data or load a DEMO...' 
      });
    }
  }, 1000);
});

app.on('window-all-closed', () => {
  if (gsiCheckInterval) clearInterval(gsiCheckInterval);
  if (gsiServer) gsiServer.close();
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-config', () => loadConfig());

ipcMain.handle('save-config', (event, config) => {
  saveConfig(config);
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('config-updated', config);
  }
  return true;
});

ipcMain.handle('get-game-state', () => currentGameState);

ipcMain.handle('get-mode', () => currentGameState.mode);

// Demo parsing handlers
ipcMain.handle('select-demo-file', async (event) => {
  const result = await dialog.showOpenDialog(editorWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'CS2 Demo Files', extensions: ['dem'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('parse-demo', async (event, demoPath) => {
  try {
    console.log(`📂 Starting demo parse: ${demoPath}`);
    demoParser.resetPlayers();
    
    await demoParser.parseDemo(demoPath);
    
    const players = demoParser.getPlayers();
    currentGameState.players = players;
    currentGameState.demoMode = true;
    currentGameState.demoPath = demoPath;
    currentGameState.mode = 'demo';
    currentGameState.gsiMode = false;

    console.log('✅ Demo parsed successfully');
    
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.webContents.send('game-state-updated', currentGameState);
    }

    if (editorWindow && !editorWindow.isDestroyed()) {
      editorWindow.webContents.send('mode-changed', { 
        mode: 'demo', 
        message: `📽️ DEMO MODE - ${path.basename(demoPath)}` 
      });
    }

    return { success: true, players };
  } catch (error) {
    console.error('❌ Demo parse error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-demo', (event) => {
  demoParser.resetPlayers();
  currentGameState.demoMode = false;
  currentGameState.demoPath = null;
  currentGameState.mode = 'idle';
  
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('game-state-updated', currentGameState);
  }

  if (editorWindow && !editorWindow.isDestroyed()) {
    editorWindow.webContents.send('mode-changed', { 
      mode: 'idle', 
      message: '⏳ Waiting for LIVE data or load a DEMO...' 
    });
  }

  return true;
});
