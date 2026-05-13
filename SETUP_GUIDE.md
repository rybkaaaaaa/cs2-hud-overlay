# CS2 HUD Overlay - 10 Player Real-Time Integration Guide

## ✅ What's New

Your app now supports **10 players with real-time updates** from CS2!

### Features:
- ✅ **10-Player Display** - All players shown in 2 teams (CT vs T)
- ✅ **Real-Time Stats** - HP, Armor, Weapons, Ammo, K/D/A
- ✅ **GSI Integration** - Reads live data from CS2
- ✅ **Team Colors** - Blue for CT, Orange for T
- ✅ **Always-On-Top** - Overlay stays visible while playing

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure CS2 GSI

Create this file:
```
C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\gamestate_integration_hud.cfg
```

**Content:**
```
"CS:GO GSI Config"
{
  "uri" "http://localhost:3000"
  "timeout" "5.0"
  "buffer" "0.1"
  "throttle" "0.5"
  "heartbeat" "2.0"

  "data"
  {
    "map" "1"
    "round" "1"
    "player_id" "1"
    "player_state" "1"
    "player_weapons" "1"
    "player_match_stats" "1"
  }

  "auth"
  {
    "token" "hud_overlay_token"
  }
}
```

### Step 3: Allow Firewall Access
**Run as Administrator:**
```bash
netsh advfirewall firewall add rule name="CS2 HUD Overlay" dir=in action=allow protocol=tcp localport=3000
```

### Step 4: Start App
```bash
npm start
```

---

## 📋 What You'll See

Two windows open:

1. **Overlay** (Always-on-top, transparent)
   - Displays all 10 players
   - Left: CT Team
   - Right: T Team
   - Updates every 500ms

2. **Editor** (Control panel)
   - Customize colors, fonts, opacity
   - Save presets

---

## 🎮 In-Game

1. **Start CS2**
2. **Play a match** - GSI server will receive data
3. **Overlay updates live** - See all player stats in real-time

---

## 🔧 Troubleshooting

### Overlay not updating?
- ✅ Check if `gamestate_integration_hud.cfg` exists
- ✅ Verify firewall rule is added
- ✅ Restart CS2
- ✅ Check console for errors (F12 in editor)

### Port 3000 already in use?
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Missing express module?
```bash
npm install express
```

---

## 📁 File Structure
```
cs2-hud-overlay/
├── main.js                    # Electron main + GSI server
├── preload.js                 # IPC bridge
├── package.json               # Express dependency
├── src/
│   ├── overlay/
│   │   ├── overlay.html       # 10-player layout
│   │   ├── overlay.js         # Render logic
│   │   └── overlay.css        # Styling (team colors)
│   └── editor/
│       ├── editor.html
│       ├── editor.js
│       └── editor.css
```

---

## 🎯 Next Steps

- Customize colors in editor
- Test with real CS2 match
- Adjust opacity/font size
- Report any issues

**Enjoy your HUD!** 🎮🔥
