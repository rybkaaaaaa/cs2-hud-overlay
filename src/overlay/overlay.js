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

let currentConfig = {};

async function initOverlay() {
  currentConfig = await window.electronAPI.getConfig();
  applyConfig(currentConfig);
  
  // Get initial game state
  currentGameState = await window.electronAPI.getGameState();
  renderPlayers(currentGameState.players);
  
  setupListeners();
}

function applyConfig(config) {
  const { overlay } = config;
  document.documentElement.style.setProperty('--bg-color', overlay.backgroundColor);
  document.documentElement.style.setProperty('--text-color', overlay.textColor);
  document.documentElement.style.setProperty('--accent-color', overlay.accentColor);
  document.documentElement.style.setProperty('--opacity', overlay.opacity);
  document.documentElement.style.setProperty('--font-size', overlay.fontSize + 'px');
  document.documentElement.style.setProperty('--font-family', overlay.fontFamily);
}

function renderPlayers(players) {
  const container = document.querySelector('.players-container');
  container.innerHTML = '';

  // Split into teams
  const ctPlayers = players.filter(p => p.team === 'CT');
  const tPlayers = players.filter(p => p.team === 'T');

  // Render CT team
  const ctSection = document.createElement('div');
  ctSection.className = 'team-section ct-team';
  ctSection.innerHTML = `<h2>CT Team</h2>`;
  ctPlayers.forEach(player => {
    ctSection.appendChild(createPlayerCard(player));
  });
  container.appendChild(ctSection);

  // Render T team
  const tSection = document.createElement('div');
  tSection.className = 'team-section t-team';
  tSection.innerHTML = `<h2>T Team</h2>`;
  tPlayers.forEach(player => {
    tSection.appendChild(createPlayerCard(player));
  });
  container.appendChild(tSection);
}

function createPlayerCard(player) {
  const card = document.createElement('div');
  card.className = 'player-card';
  card.innerHTML = `
    <div class="player-header">
      <span class="player-name">${player.name}</span>
      <span class="player-slot">Slot ${player.slot + 1}</span>
    </div>
    <div class="player-stats">
      <div class="stat-row">
        <span class="stat-label">HP:</span>
        <div class="hp-bar">
          <div class="hp-fill" style="width: ${player.hp}%"></div>
        </div>
        <span class="stat-value">${Math.round(player.hp)}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">ARMOR:</span>
        <div class="armor-bar">
          <div class="armor-fill" style="width: ${player.armor}%"></div>
        </div>
        <span class="stat-value">${Math.round(player.armor)}</span>
      </div>
      <div class="stat-row">
        <span class="weapon">${player.weapon}</span>
        <span class="ammo">${player.ammo}</span>
      </div>
      <div class="stat-row score-row">
        <span class="score">K: ${player.kills}</span>
        <span class="score">D: ${player.deaths}</span>
        <span class="score">A: ${player.assists}</span>
      </div>
    </div>
  `;
  return card;
}

function setupListeners() {
  window.electronAPI.onGameStateUpdated((gameState) => {
    currentGameState = gameState;
    renderPlayers(gameState.players);
  });

  window.electronAPI.onConfigUpdated((config) => {
    currentConfig = config;
    applyConfig(config);
  });

  // Simulate live updates for testing
  setInterval(async () => {
    currentGameState = await window.electronAPI.getGameState();
    renderPlayers(currentGameState.players);
  }, 500);
}

document.addEventListener('DOMContentLoaded', initOverlay);
