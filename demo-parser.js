const fs = require('fs');
const path = require('path');
const { DemoFile } = require('demofile');

class DemoParser {
  constructor() {
    this.currentDemo = null;
    this.players = Array(10).fill(null).map((_, i) => ({
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
    }));
    this.isPlaying = false;
    this.tickRate = 64;
    this.currentTick = 0;
    this.totalTicks = 0;
  }

  async parseDemo(demoPath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(demoPath)) {
        reject(`Demo file not found: ${demoPath}`);
        return;
      }

      console.log(`📂 Loading demo: ${demoPath}`);

      const buffer = fs.readFileSync(demoPath);
      const demo = new DemoFile();

      demo.on('start', () => {
        console.log('🎬 Demo started parsing');
        this.isPlaying = true;
      });

      demo.on('tickstart', (tick) => {
        this.currentTick = tick;
      });

      demo.on('player_info', (msg) => {
        if (msg.player_slot < 10 && msg.name) {
          this.players[msg.player_slot].name = msg.name;
          this.players[msg.player_slot].steamId = msg.xuid;
        }
      });

      demo.on('player_death', (msg) => {
        if (msg.player.playerSlot < 10) {
          this.players[msg.player.playerSlot].deaths++;
        }
        if (msg.assister && msg.assister.playerSlot < 10) {
          this.players[msg.assister.playerSlot].assists++;
        }
      });

      demo.on('player_hurt', (msg) => {
        if (msg.player && msg.player.playerSlot < 10) {
          const player = this.players[msg.player.playerSlot];
          player.hp = Math.max(0, msg.health);
          player.armor = msg.armor;
        }
      });

      demo.on('weapon_fire', (msg) => {
        if (msg.player && msg.player.playerSlot < 10) {
          const player = this.players[msg.player.playerSlot];
          player.weapon = this.getWeaponName(msg.weapon);
        }
      });

      demo.on('player_team', (msg) => {
        if (msg.player && msg.player.playerSlot < 10) {
          const team = msg.team === 2 ? 'T' : msg.team === 3 ? 'CT' : 'Unassigned';
          this.players[msg.player.playerSlot].team = team;
        }
      });

      demo.on('match_end_conditions', (msg) => {
        console.log('✅ Demo finished');
        this.isPlaying = false;
        resolve(this.players);
      });

      demo.on('error', (err) => {
        console.error('❌ Demo parsing error:', err);
        reject(err);
      });

      try {
        demo.parse(buffer);
      } catch (err) {
        console.error('❌ Error parsing demo:', err);
        reject(err);
      }
    });
  }

  getWeaponName(weaponStr) {
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

    return weaponNames[weaponStr] || weaponStr || 'Unknown';
  }

  getPlayers() {
    return this.players;
  }

  resetPlayers() {
    this.players = Array(10).fill(null).map((_, i) => ({
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
    }));
  }
}

module.exports = DemoParser;
