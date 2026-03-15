// ============================================================
// scenes/BootScene.js — Sisters' Quest
// Initialises state and transitions to the title screen
// ============================================================

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // No external assets — all graphics are procedural
    // Generate the silver mist particle texture programmatically
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xd0d8e8, 1);
    g.fillCircle(8, 8, 8);
    g.generateTexture('mist_particle', 16, 16);
    g.destroy();

    // Soft glow texture for hotspots
    const glow = this.make.graphics({ x: 0, y: 0, add: false });
    glow.fillStyle(0xc8956c, 1);
    glow.fillCircle(12, 12, 12);
    glow.generateTexture('glow_particle', 24, 24);
    glow.destroy();

    // Small star texture for menu
    const star = this.make.graphics({ x: 0, y: 0, add: false });
    star.fillStyle(0xffffff, 1);
    star.fillCircle(3, 3, 3);
    star.generateTexture('star_particle', 6, 6);
    star.destroy();

    // ── Background images ────────────────────────────────────────
    this.load.image('bg_menu',        'assets/backgrounds/menu.jpg');
    this.load.image('bg_queens',      'assets/backgrounds/queens-chamber.jpg');
    this.load.image('bg_library',     'assets/backgrounds/palace-library.jpg');
    this.load.image('bg_cresthollow', 'assets/backgrounds/cresthollow.jpg');
    this.load.image('bg_wayne',       'assets/backgrounds/wayne-shack.jpg');
    this.load.image('bg_harbor',      'assets/backgrounds/harbor-office.jpg');
    this.load.image('bg_tides',       'assets/backgrounds/isle-of-tides.jpg');
    this.load.image('bg_tideshrine',  'assets/backgrounds/tide-king-shrine.jpg');
    this.load.image('bg_thornwood',   'assets/backgrounds/thornwood.jpg');
    this.load.image('bg_mere',        'assets/backgrounds/mirrored-mere.jpg');
    this.load.image('bg_caves',       'assets/backgrounds/whispering-caves.jpg');
    this.load.image('bg_vessa',       'assets/backgrounds/vesa-tower.jpg');
    this.load.image('bg_garden',      'assets/backgrounds/sunken-garden.jpg');
    this.load.image('bg_obsidian',    'assets/backgrounds/obsidian-isle.jpg');
    this.load.image('bg_shore',       'assets/backgrounds/shore-dawn.jpg');
    this.load.image('bg_greathall',   'assets/backgrounds/great-hall.jpg');

    // ── Portrait images ──────────────────────────────────────────
    this.load.image('portrait_mackenzie',  'assets/portraits/mackenzie.jpg');
    this.load.image('portrait_cambrie',    'assets/portraits/cambrie.jpg');
    this.load.image('portrait_birdie',     'assets/portraits/birdie.jpg');
    this.load.image('portrait_queen',      'assets/portraits/queen.jpg');
    this.load.image('portrait_bram',       'assets/portraits/bram.jpg');
    this.load.image('portrait_dorian',     'assets/portraits/dorian.jpg');
    this.load.image('portrait_farris',     'assets/portraits/farris.jpg');
    this.load.image('portrait_jennibelle', 'assets/portraits/jennibelle.jpg');
    this.load.image('portrait_mira',       'assets/portraits/mira.jpg');
    this.load.image('portrait_thorn',      'assets/portraits/thorn.jpg');
    this.load.image('portrait_tideking',   'assets/portraits/tideking.jpg');
    this.load.image('portrait_vessa',      'assets/portraits/vessa.jpg');
    this.load.image('portrait_wayne',      'assets/portraits/wayne.jpg');
    this.load.image('portrait_witch',      'assets/portraits/witch.jpg');

    // ── Music tracks ──────────────────────────────────────────
    this.load.audio('music_palace', 'assets/music/palace.mp3');
    this.load.audio('music_town',   'assets/music/town.mp3');
    this.load.audio('music_mystic', 'assets/music/mystic.mp3');
    this.load.audio('music_ending', 'assets/music/ending.mp3');
    this.load.audio('music_beach',  'assets/music/beach.mp3');
  }

  create() {
    this.scene.start('MenuScene');
  }
}
