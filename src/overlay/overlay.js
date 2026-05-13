let currentConfig = {};

// Initialize overlay
async function initOverlay() {
  currentConfig = await window.electronAPI.getConfig();
  applyConfig(currentConfig);
  loadPlayerData(currentConfig.player);
  setupListeners();
}

function applyConfig(config) {
  const { overlay } = config;
  const container = document.querySelector('.hud-container');

  container.style.backgroundColor = convertToRgba(overlay.backgroundColor, overlay.opacity);
  container.style.color = overlay.textColor;
  container.style.borderColor = overlay.accentColor;
  container.style.fontSize = overlay.fontSize + 'px';
  container.style.fontFamily = overlay.fontFamily;

  // Update accent colors
  document.querySelectorAll('.player-name, .weapon-name, .section-title').forEach(el => {
    el.style.color = overlay.accentColor;
  });

  // Update bar colors
  document.querySelectorAll('.health-fill, .armor-fill').forEach(el => {
    el.style.borderColor = overlay.accentColor;
  });
}

function convertToRgba(color, opacity) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function loadPlayerData(playerData) {
  document.getElementById('playerName').textContent = playerData.nickname;
  document.getElementById('hpValue').textContent = playerData.hp;
  document.getElementById('healthFill').style.width = playerData.hp + '%';
  
  document.getElementById('armorValue').textContent = playerData.armor;
  document.getElementById('armorFill').style.width = playerData.armor + '%';
  
  document.getElementById('weaponName').textContent = playerData.weapon;
  document.getElementById('ammoCount').textContent = playerData.ammo;
  document.getElementById('damageValue').textContent = playerData.damage;
}

function setupListeners() {
  window.electronAPI.onConfigUpdated((config) => {
    currentConfig = config;
    applyConfig(config);
  });

  window.electronAPI.onPlayerDataUpdated((playerData) => {
    loadPlayerData(playerData);
  });

  // Simulate live data updates (for testing)
  setInterval(() => {
    // This can be replaced with actual game data
    const hp = Math.max(0, parseInt(document.getElementById('hpValue').textContent) - Math.random() * 5);
    document.getElementById('hpValue').textContent = Math.floor(hp);
    document.getElementById('healthFill').style.width = hp + '%';
  }, 1000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initOverlay);
