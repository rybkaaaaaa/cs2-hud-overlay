let currentConfig = {};
let presets = JSON.parse(localStorage.getItem('hud-presets')) || {};

// Initialize editor
async function initEditor() {
  currentConfig = await window.electronAPI.getConfig();
  loadConfigToUI(currentConfig);
  setupEventListeners();
  updatePresetList();
}

function loadConfigToUI(config) {
  const { overlay, player } = config;

  // Color inputs
  document.getElementById('bgColor').value = overlay.backgroundColor;
  document.getElementById('bgColorText').value = overlay.backgroundColor;
  document.getElementById('textColor').value = overlay.textColor;
  document.getElementById('textColorText').value = overlay.textColor;
  document.getElementById('accentColor').value = overlay.accentColor;
  document.getElementById('accentColorText').value = overlay.accentColor;

  // Appearance
  document.getElementById('opacity').value = overlay.opacity;
  document.getElementById('opacityValue').textContent = overlay.opacity;
  document.getElementById('fontSize').value = overlay.fontSize;
  document.getElementById('fontSizeValue').textContent = overlay.fontSize + 'px';

  // Font
  document.getElementById('fontFamily').value = overlay.fontFamily;

  // Player data
  document.getElementById('playerName').value = player.nickname;
  document.getElementById('playerHP').value = player.hp;
  document.getElementById('playerArmor').value = player.armor;
  document.getElementById('weapon').value = player.weapon;
  document.getElementById('ammo').value = player.ammo;
  document.getElementById('damage').value = player.damage;
}

function setupEventListeners() {
  // Color pickers
  ['bgColor', 'textColor', 'accentColor'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      const textId = id + 'Text';
      document.getElementById(textId).value = e.target.value;
    });
  });

  // Sliders
  document.getElementById('opacity').addEventListener('input', (e) => {
    document.getElementById('opacityValue').textContent = e.target.value;
  });

  document.getElementById('fontSize').addEventListener('input', (e) => {
    document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
  });

  // Apply button
  document.getElementById('applyBtn').addEventListener('click', applyChanges);

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetToDefault);

  // Preset buttons
  document.getElementById('savePresetBtn').addEventListener('click', savePreset);
  document.getElementById('loadPresetBtn').addEventListener('click', loadPreset);
  document.getElementById('deletePresetBtn').addEventListener('click', deletePreset);
}

function getCurrentConfigFromUI() {
  return {
    overlay: {
      backgroundColor: document.getElementById('bgColor').value,
      textColor: document.getElementById('textColor').value,
      accentColor: document.getElementById('accentColor').value,
      opacity: parseFloat(document.getElementById('opacity').value),
      fontSize: parseInt(document.getElementById('fontSize').value),
      fontFamily: document.getElementById('fontFamily').value,
      posX: currentConfig.overlay.posX,
      posY: currentConfig.overlay.posY,
      width: currentConfig.overlay.width,
      height: currentConfig.overlay.height
    },
    player: {
      nickname: document.getElementById('playerName').value,
      hp: parseInt(document.getElementById('playerHP').value),
      armor: parseInt(document.getElementById('playerArmor').value),
      weapon: document.getElementById('weapon').value,
      ammo: parseInt(document.getElementById('ammo').value),
      damage: parseInt(document.getElementById('damage').value)
    }
  };
}

async function applyChanges() {
  const newConfig = getCurrentConfigFromUI();
  currentConfig = newConfig;
  await window.electronAPI.saveConfig(newConfig);
  showNotification('Settings applied!');
}

async function resetToDefault() {
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
  
  currentConfig = defaultConfig;
  loadConfigToUI(defaultConfig);
  await window.electronAPI.saveConfig(defaultConfig);
  showNotification('Reset to default!');
}

function savePreset() {
  const presetName = document.getElementById('presetName').value.trim();
  if (!presetName) {
    showNotification('Enter preset name!', 'error');
    return;
  }

  const config = getCurrentConfigFromUI();
  presets[presetName] = config;
  localStorage.setItem('hud-presets', JSON.stringify(presets));
  document.getElementById('presetName').value = '';
  updatePresetList();
  showNotification(`Preset "${presetName}" saved!`);
}

function loadPreset() {
  const presetName = document.getElementById('presetList').value;
  if (!presetName || !presets[presetName]) {
    showNotification('Select a preset!', 'error');
    return;
  }

  currentConfig = presets[presetName];
  loadConfigToUI(currentConfig);
  showNotification(`Preset "${presetName}" loaded!`);
}

function deletePreset() {
  const presetName = document.getElementById('presetList').value;
  if (!presetName || !presets[presetName]) {
    showNotification('Select a preset!', 'error');
    return;
  }

  delete presets[presetName];
  localStorage.setItem('hud-presets', JSON.stringify(presets));
  updatePresetList();
  showNotification(`Preset "${presetName}" deleted!`);
}

function updatePresetList() {
  const select = document.getElementById('presetList');
  select.innerHTML = '<option value="">-- Select a preset --</option>';
  
  Object.keys(presets).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function showNotification(message, type = 'success') {
  // Simple notification (can be enhanced with a toast library)
  alert(message);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initEditor);
