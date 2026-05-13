# 📽️ CS2 HUD Demo Mode - Commentator Guide

> **For Streamers & Commentators:** This guide explains how to use the **Demo Parser** feature to display live player stats while spectating CS2 demos.

---

## 🎯 What is Demo Mode?

Demo Mode allows you to:
- ✅ **Load CS2 demo files** (`.dem` files)
- ✅ **Parse player data** in real-time from recordings
- ✅ **Display 10 player stats** on your HUD overlay
- ✅ **Stream commentary** with live data

**Perfect for:** Professional casters, tournament analysts, and content creators!

---

## 🚀 Quick Start

### 1. **Start the Application**

```bash
npm install
npm start
```

Two windows will open:
- 🎨 **Overlay Window** (transparent, always on top)
- ⚙️ **Editor Window** (controls & settings)

---

### 2. **Load a Demo File**

In the **Editor Window**:

1. Click **"Select .DEM File"** button
2. Navigate to your CS2 demo location:
   ```
   C:\Users\[YourUsername]\AppData\Local\CSGOMaps\replays\
   ```
3. Select a `.dem` file
4. You'll see: ✅ `filename.dem` (green text)

---

### 3. **Parse the Demo**

1. Click **"Parse Demo"** button
2. Wait for parsing to complete (status shows "⏳ Parsing demo...")
3. When done: **✅ Demo loaded! 10 players detected**
4. Overlay will update with real player data!

---

### 4. **View Your Stream**

The **Overlay Window** now shows:
- All 10 player names
- HP / Armor status
- Current weapons
- Kill/Death/Assist counts
- Team colors (CT vs T)

---

## 🎮 Where to Find Demo Files

### On Your PC:
```
C:\Users\[YourUsername]\AppData\Local\CSGOMaps\replays\
```

### From FACEIT:
1. Go to your FACEIT match history
2. Download the `.dem` file
3. Place in any folder
4. Load via "Select .DEM File"

### From Community Servers:
- Download `.dem` files from server providers
- Same loading process applies

---

## 🛠️ Editor Controls

### **Demo Mode Section**

| Button | Function |
|--------|----------|
| 📁 Select .DEM File | Browse & choose demo |
| ▶️ Parse Demo | Start parsing (disabled until file selected) |
| ⏹️ Stop Demo | Stop current demo & reset |

### **Status Indicator**

Shows current state:
- ❌ `No demo loaded` (red)
- ℹ️ `Demo selected: filename.dem` (blue)
- ⏳ `Parsing demo...` (yellow)
- ✅ `Demo loaded! 10 players detected` (green)

---

## ⚙️ Customization

### Change HUD Colors:
1. Scroll down in Editor
2. Adjust **Colors** section:
   - Background Color
   - Text Color
   - Accent Color
3. Click **"Apply Changes"**

### Adjust Appearance:
- **Opacity**: 0 (transparent) - 1 (opaque)
- **Font Size**: 8px - 24px
- **Font Family**: Arial, Verdana, etc.

### Save Your Setup:
1. Configure everything
2. Enter **Preset Name** (e.g., "Stream Setup")
3. Click **"Save Preset"**
4. Next time, just load it!

---

## 📊 Data Displayed on HUD

For each of 10 players:

```
[Player Name]
HP: 100 | Armor: 100
Weapon: AK-47 (30 ammo)
Kills: 5 | Deaths: 2 | Assists: 1
Team: CT
```

---

## 🐛 Troubleshooting

### Problem: "Demo file not found"
- ✅ Check file path is correct
- ✅ File must be `.dem` format
- ✅ File must not be corrupted

### Problem: "No players detected"
- ✅ Demo file might be incomplete
- ✅ Try a different demo
- ✅ Check demo has match data

### Problem: HUD not updating
- ✅ Check Overlay Window is visible
- ✅ Try stopping & reloading demo
- ✅ Restart app: **Ctrl + C** then `npm start`

### Problem: Buttons are disabled/greyed out
- ✅ This is normal! Buttons enable when needed
- ✅ Select a file first to enable Parse button
- ✅ Parse demo first to enable Stop button

---

## 🎬 Streaming Tips

### OBS Setup:
1. Add **Overlay Window** as source
2. Set as **Window Capture** (not Game Capture)
3. Position overlay on your screen
4. Demo parsing updates in real-time!

### Best Practices:
- ✅ Load demo **before** starting stream
- ✅ Test with small demo first
- ✅ Use a saved preset for consistency
- ✅ Keep overlay visible & unobstructed
- ✅ Stop demo when match commentary ends

### For Tournaments:
- Pre-load demos for each match
- Save presets per event/team
- Reset between matches with "Stop Demo"

---

## 🔧 Advanced: Manual Demo Location

If demos aren't in default location:

1. **Open File Manager**
2. Search for recent `.dem` files
3. Check these common paths:
   - `%APPDATA%\Local\CSGOMaps\replays\`
   - `C:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive\replays\`
   - Community server provided paths

---

## 📝 File Structure

```
cs2-hud-overlay/
├── main.js (Demo parser integration)
├── demo-parser.js (Parser logic)
├── preload.js (IPC handlers)
├── src/
│   ├── editor/
│   │   ├── editor.html (Demo controls UI)
│   │   ├── editor.js (Control handlers)
│   │   └── editor.css (Styling)
│   └── overlay/
│       └── overlay.html (Display window)
└── package.json
```

---

## ✨ Next Steps

- 🎨 Customize colors for your brand
- 📾 Save presets for different events
- 🔄 Test with multiple demos
- 🎙️ Go live and comment!

---

## 💡 Got Questions?

- Check console (F12 in Editor)
- Look for error messages in status bar
- Try restarting app
- Verify demo file is valid

---

**Happy Casting!** 🎙️🎮

*Made for competitive CS2 commentary & streaming*
