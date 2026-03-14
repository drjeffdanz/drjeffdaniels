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
  }

  create() {
    this.scene.start('MenuScene');
  }
}
