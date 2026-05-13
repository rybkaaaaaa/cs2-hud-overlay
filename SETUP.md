# 🎬 Setup & Installation Guide

## ✅ Prerequisites

- **Node.js** v14+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **CS2** installed (for demo files)
- **Windows** OS (primary development platform)

---

## 📦 Installation

### 1. Clone or Download the Repository

```bash
git clone https://github.com/rybkaaaaaa/cs2-hud-overlay.git
cd cs2-hud-overlay
```

---

### 2. Install Dependencies

```bash
npm install
```

This will install:
- **Electron** - Desktop app framework
- **Express** - Web server for GSI
- **demofile** - CS2 demo parser

---

### 3. Run the Application

```bash
npm start
```

**Two windows will open:**
1. 🎨 **Overlay Window** - Your HUD (transparent, on top)
2. ⚙️ **Editor Window** - Settings & demo controls

---

## 🎮 Two Operating Modes

### **Mode 1: GSI (Live Matches)**

For when **you're playing** in a match:

1. GSI server runs on `http://localhost:3000`
2. CS2 sends live player data automatically
3. HUD updates in real-time
4. Requirements: Must be actively playing

**Setup GSI Config:**
```
C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\gamestate_integration_hud.cfg
```

---

### **Mode 2: Demo Parser (Commentator)**

For when **you're watching/commenting** a demo:

1. Click **"Select .DEM File"** in Editor
2. Choose a CS2 demo file (`.dem`)
3. Click **"Parse Demo"**
4. HUD displays all 10 player stats
5. Perfect for spectating & streaming!

**Demo File Locations:**
- `%APPDATA%\Local\CSGOMaps\replays\` (Local replays)
- FACEIT downloads
- Community server demos

---

## 🎨 Customization

### Colors & Appearance

In **Editor Window**:

**Colors Section:**
- 🎨 Background Color - Overlay background
- 📝 Text Color - Player info text
- ✨ Accent Color - Highlights & borders

**Appearance Section:**
- 📊 Opacity - 0 (transparent) to 1 (solid)
- 🔤 Font Size - 8px to 24px
- 🔡 Font Family - Arial, Verdana, Georgia, etc.

### Save Your Settings

1. Configure everything
2. Scroll to **Presets** section
3. Enter name (e.g., "My Stream Setup")
4. Click **"Save Preset"**
5. Next time, just load it!

---

## 🚀 Development

### Project Structure

```
cs2-hud-overlay/
├── main.js                 # Electron main process + GSI/Demo server
├── preload.js              # IPC bridge (safe electron communication)
├── demo-parser.js          # Demo file parser logic ⭐ NEW
│
├── src/
│   ├── overlay/
│   │   ├── overlay.html    # HUD display
│   │   ├── overlay.js      # Update handlers
│   │   └── overlay.css     # HUD styling
│   │
│   └── editor/
│       ├── editor.html     # Settings UI + Demo controls ⭐ NEW
│       ├── editor.js       # Settings handlers + Demo controls ⭐ NEW
│       └── editor.css      # Styling ⭐ UPDATED
│
├── package.json
├── DEMO_MODE.md            # ⭐ NEW - Commentator guide
└── SETUP.md                # This file ⭐ NEW
```

### Key Files Modified for Demo Support:

- ✨ **demo-parser.js** - Parses `.dem` files
- ✨ **main.js** - Added demo IPC handlers
- ✨ **preload.js** - Added demo APIs
- ✨ **editor.html** - Added demo UI controls
- ✨ **editor.js** - Added demo event handlers
- ✨ **editor.css** - Added demo styling

---

## 🔌 API Integration

### GSI Server (Live Matches)

```javascript
// Automatic - runs on startup
// Listen on http://localhost:3000
// CS2 sends POST requests with player data
```

### Demo Parser API

```javascript
// In editor.js or overlay.js:
const result = await window.electronAPI.parseDemo('/path/to/demo.dem');
// Returns: { success: true, players: [...] }
```

---

## ⚙️ IPC Handlers (Electron Communication)

### Main Process → Renderer Communication:

```javascript
// Get current game state
const state = await window.electronAPI.getGameState();

// Listen for state updates
window.electronAPI.onGameStateUpdated((gameState) => {
  console.log('New player data:', gameState.players);
});
```

### Demo-Specific Handlers:

```javascript
// Select a demo file
const filePath = await window.electronAPI.selectDemoFile();

// Parse the demo
const result = await window.electronAPI.parseDemo(filePath);

// Stop parsing
await window.electronAPI.stopDemo();
```

---

## 🎬 Recording & Streaming

### OBS Setup

1. **Add Source → Window Capture**
2. Select "Overlay Window (electron.exe)" 
3. Position on your screen
4. Position game window under overlay
5. Record/Stream as normal!

### Alternative: Game Capture

1. Set game to **Borderless** mode
2. Use Game Capture in OBS
3. Overlay stays on top automatically

---

## 🐛 Debugging

### Enable DevTools

Already enabled! Press **F12** in Editor window:
- Console logs
- Network requests
- Error messages

### Check GSI Server

Open browser: `http://localhost:3000`
- Should show nothing (waiting for posts)
- If error, GSI config may be wrong

### Demo Parser Logs

Look in console (F12):
```
📂 Loading demo: C:\path\to\demo.dem
🎬 Demo started parsing
✅ Demo finished
```

---

## 🔄 Updating

```bash
# Pull latest changes
git pull

# Reinstall dependencies
npm install

# Start app
npm start
```

---

## ❓ Common Issues

### "Cannot find electron module"
```bash
npm install
```

### "GSI server not responding"
- Check GSI config exists
- Run in CS2 local server or MM match
- Port 3000 not blocked

### "Demo file not detected"
- Ensure `.dem` file exists
- Check file path is correct
- Demo must have valid match data

### "HUD window blank"
- Restart app
- Check DevTools (F12) for errors
- Verify overlay.html exists

---

## 📚 Further Reading

- **[Demo Mode Guide](./DEMO_MODE.md)** - Full commentator guide
- **[Electron Docs](https://www.electronjs.org/docs)**
- **[Express.js Guide](https://expressjs.com/)**
- **[CS2 GSI](https://developer.valvesoftware.com/wiki/CS:GO_Game_State_Integration)**

---

## 💬 Support

For issues:
1. Check console (F12)
2. Read error messages
3. Verify file paths
4. Try restarting app
5. Check GitHub issues

---

**Ready to start?** 

```bash
npm install
npm start
```

**Want to comment demos?** 

👉 See [DEMO_MODE.md](./DEMO_MODE.md)

---

*Created for CS2 streamers, commentators, and competitive players*
