# CS2 HUD Overlay

A modern desktop application for CS2 (Counter-Strike 2) that displays a customizable HUD overlay with player stats, weapon info, and teammate status. Includes a built-in style editor to customize colors, fonts, and appearance.

## Features

- 🎮 **Real-time HUD Display** - Shows player HP, armor, weapon info, and teammates
- 🎨 **Style Editor** - Fully customizable colors, fonts, and appearance
- 💾 **Preset Management** - Save and load custom style presets
- 🖼️ **Modern UI** - Dark theme with neon accents
- ⚡ **Live Updates** - Changes apply instantly to the overlay

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rybkaaaaaa/cs2-hud-overlay.git
cd cs2-hud-overlay
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Usage

### Overlay Window
The overlay automatically displays on startup with:
- **Player Info**: Nickname, HP, and Armor bars
- **Weapon Info**: Current weapon, ammo count, and damage
- **Teammates**: Status of your team members

### Editor Window
Open the editor to customize:
- **Colors**: Background, text, and accent colors
- **Appearance**: Opacity and font size
- **Font**: Choose from multiple font families
- **Player Data**: Manually update player stats (for testing)
- **Presets**: Save/load style configurations

### Keyboard Shortcuts
- Apply changes in the editor window and they'll sync to the overlay
- Use presets to quickly switch between different HUD styles

## Configuration

Settings are automatically saved to:
- Windows: `%APPDATA%\cs2-hud-overlay`
- macOS: `~/Library/Application Support/cs2-hud-overlay`
- Linux: `~/.config/cs2-hud-overlay`

### config.json Structure
```json
{
  "overlay": {
    "backgroundColor": "#1a1a1a",
    "textColor": "#ffffff",
    "accentColor": "#00ff00",
    "opacity": 0.9,
    "fontSize": 14,
    "fontFamily": "Arial",
    "posX": 50,
    "posY": 50,
    "width": 400,
    "height": 300
  },
  "player": {
    "nickname": "Player123",
    "hp": 85,
    "armor": 100,
    "weapon": "AK-47",
    "ammo": 30,
    "damage": 31
  }
}
```

## Project Structure

```
cs2-hud-overlay/
├── main.js              # Electron main process
├── preload.js           # IPC bridge
├── package.json         # Dependencies
├── src/
│   ├── overlay/
│   │   ├── overlay.html # HUD UI
│   │   ├── overlay.js   # HUD logic
│   │   └── overlay.css  # HUD styles
│   └── editor/
│       ├── editor.html  # Editor UI
│       ├── editor.js    # Editor logic
│       └── editor.css   # Editor styles
└── README.md            # This file
```

## Future Enhancements

- [ ] Game data integration (read CS2 game data directly)
- [ ] Custom widgets and layout options
- [ ] Advanced animation settings
- [ ] Multi-monitor support
- [ ] Drag-and-drop element positioning
- [ ] Import/export preset files
- [ ] Sound effects customization

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License - feel free to use this for personal or commercial purposes.

## Support

For issues or suggestions, please create an issue on GitHub.

---

Made with ❤️ for CS2 players
