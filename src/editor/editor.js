let currentConfig = {};
let presets = JSON.parse(localStorage.getItem('hud-presets')) || {};
let selectedDemoPath = null;
let isDemoRunning = false;

// Initialize editor
async function initEditor() {
  currentConfig = await window.electronAPI.getConfig();
  loadConfigToUI(currentConfig);
  setupEventListeners();
  updatePresetList();
  setupDemoControls();
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
  if (player) {
    document.getElementById('playerName').value = player.nickname || '';
    document.getElementById('playerHP').value = player.hp || 85;
    document.getElementById('playerArmor').value = player.armor || 100;
    document.getElementById('weapon').value = player.weapon || 'AK-47';
    document.getElementById('ammo').value = player.ammo || 30;
    document.getElementById('damage').value = player.damage || 31;
  }
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

function setupDemoControls() {
  document.getElementById('selectDemoBtn').addEventListener('click', selectDemoFile);
  document.getElementById('parseDemoBtn').addEventListener('click', parseDemoFile);
  document.getElementById('stopDemoBtn').addEventListener('click', stopDemo);
}

async function selectDemoFile() {
  try {
    const demoPath = await window.electronAPI.selectDemoFile();
    if (demoPath) {
      selectedDemoPath = demoPath;
      const fileName = demoPath.split('\\').pop();
      document.getElementById('demoFileName').textContent = `✅ ${fileName}`;
      document.getElementById('demoFileName').style.color = '#00ff00';
      document.getElementById('parseDemoBtn').disabled = false;
      updateDemoStatus('Demo selected: ' + fileName, 'info');
    }
  } catch (error) {
    console.error('Error selecting demo:', error);
    updateDemoStatus('Error selecting file', 'error');
  }
}

async function parseDemoFile() {
  if (!selectedDemoPath) {
    updateDemoStatus('No demo file selected', 'error');
    return;
  }

  try {
    document.getElementById('parseDemoBtn').disabled = true;
    updateDemoStatus('Parsing demo... Please wait...', 'loading');

    const result = await window.electronAPI.parseDemo(selectedDemoPath);
    
    if (result.success) {
      isDemoRunning = true;
      document.getElementById('selectDemoBtn').disabled = true;
      document.getElementById('stopDemoBtn').disabled = false;
      document.getElementById('parseDemoBtn').disabled = true;
      updateDemoStatus(`✅ Demo loaded! ${result.players.length} players detected`, 'success');
    } else {
      updateDemoStatus(`❌ Error: ${result.error}`, 'error');
      document.getElementById('parseDemoBtn').disabled = false;
    }
  } catch (error) {
    console.error('Error parsing demo:', error);
    updateDemoStatus(`Error: ${error.message}`, 'error');
    document.getElementById('parseDemoBtn').disabled = false;
  }
}

async function stopDemo() {
  try {
    await window.electronAPI.stopDemo();
    isDemoRunning = false;
    selectedDemoPath = null;
    
    document.getElementById('selectDemoBtn').disabled = false;
    document.getElementById('parseDemoBtn').disabled = true;
    document.getElementById('stopDemoBtn').disabled = true;
    document.getElementById('demoFileName').textContent = 'No file selected';
    document.getElementById('demoFileName').style.color = '#999';
    
    updateDemoStatus('❌ Demo stopped', 'info');
  } catch (error) {
    console.error('Error stopping demo:', error);
    updateDemoStatus(`Error: ${error.message}`, 'error');
  }
}

function updateDemoStatus(message, type = 'info') {
  const statusEl = document.getElementById('demoStatus');
  let emoji = '❌';
  let color = '#ff6b6b';
  
  if (type === 'success') {
    emoji = '✅';
    color = '#00ff00';
  } else if (type === 'loading') {
    emoji = '⏳';
    color = '#ffff00';
  } else if (type === 'info') {
    emoji = 'ℹ️';
    color = '#00aaff';
  }
  
  statusEl.textContent = emoji + ' ' + message;
  statusEl.style.color = color;
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
      posX: currentConfig.overlay?.posX || 50,
      posY: currentConfig.overlay?.posY || 50,
      width: currentConfig.overlay?.width || 400,
      height: currentConfig.overlay?.height || 300
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
