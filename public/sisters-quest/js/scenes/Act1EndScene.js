// ============================================================
// scenes/Act1EndScene.js — Sisters' Quest
// Act 1 completion — inventory summary + "To be continued"
// ============================================================

class Act1EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Act1EndScene' });
  }

  create() {
    MusicManager.play(this, 'music_palace');
    const W = this.scale.width;
    const H = this.scale.height;

    // ── Background — dawn road out of the palace ──────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0810, 0x0a0810, 0x1a1420, 0x1a1420, 1);
    bg.fillRect(0, 0, W, H);

    // Dawn horizon — warm pre-dawn glow building
    bg.fillGradientStyle(0x3a1428, 0x3a1428, 0x6a2830, 0x6a2830, 1);
    bg.fillRect(0, H * 0.5, W, H * 0.22);
    bg.fillGradientStyle(0x6a2830, 0x6a2830, 0x9a3820, 0x9a3820, 1);
    bg.fillRect(0, H * 0.72, W, H * 0.28);

    // Horizon light band — the actual first light
    bg.fillStyle(0xd05828, 0.35);
    bg.fillRect(0, H * 0.56, W, H * 0.06);
    bg.fillStyle(0xe87030, 0.20);
    bg.fillRect(0, H * 0.52, W, H * 0.08);

    // Distant hills silhouette
    bg.fillStyle(0x0c0808, 1);
    bg.fillEllipse(W * 0.2, H * 0.66, 400, 120);
    bg.fillEllipse(W * 0.7, H * 0.70, 500, 100);
    // Hill rim light from dawn
    bg.fillStyle(0xb03820, 0.18);
    bg.fillEllipse(W * 0.2, H * 0.62, 380, 40);
    bg.fillEllipse(W * 0.7, H * 0.64, 460, 30);

    // Road stretching away — slightly brighter, catches first light
    bg.fillStyle(0x2a1a0c, 1);
    bg.fillTriangle(W / 2 - 20, H, W / 2 + 20, H, W / 2 + 5, H * 0.58);
    bg.fillTriangle(W / 2 - 20, H, W / 2 + 20, H, W / 2 - 5, H * 0.58);
    // Road highlight — dawn light on road surface
    bg.fillStyle(0xb84020, 0.12);
    bg.fillTriangle(W / 2 - 12, H, W / 2 + 12, H, W / 2 + 2, H * 0.62);

    // Stars
    for (let i = 0; i < 80; i++) {
      const sx = Phaser.Math.Between(0, W);
      const sy = Phaser.Math.Between(0, H * 0.52);
      this.add.circle(sx, sy, Math.random() > 0.8 ? 2 : 1, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.9));
    }

    // Figures (sisters walking away into dawn)
    this._drawSisters(W / 2 - 14, H * 0.68);

    // ── Decorative border ────────────────────────────────────
    const border = this.add.graphics();
    border.lineStyle(1, 0xc8956c, 0.3);
    border.strokeRect(20, 20, W - 40, H - 40);

    // ── "Act One Complete" header ─────────────────────────────
    this.add.text(W / 2, 60, 'Act One Complete', {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#c8956c',
      fontStyle: 'italic',
      letterSpacing: 3,
    }).setOrigin(0.5).setAlpha(0.9);

    // ── Title card ────────────────────────────────────────────
    this.add.text(W / 2, H * 0.16, "The Palace of Elderwyn", {
      fontFamily: 'Georgia, serif',
      fontSize: '30px',
      color: '#e8d5b0',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.16 + 40, '"They left before the sun rose.\nThey took what they knew and went to find what they didn\'t."', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#a3a3a3',
      fontStyle: 'italic',
      align: 'center',
    }).setOrigin(0.5);

    // ── Inventory carried ─────────────────────────────────────
    const carried = GameState.getInventory();
    this.add.text(W / 2, H * 0.39, 'Carried into the journey:', {
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      color: '#c8956c',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    carried.forEach((key, i) => {
      const item = ITEMS[key];
      if (!item) return;
      const itemText = this.add.text(W / 2, H * 0.39 + 24 + i * 22, `${item.symbol}  ${item.name}`, {
        fontFamily: 'Georgia, serif',
        fontSize: '13px',
        color: '#d4c090',
      }).setOrigin(0.5);

      this.tweens.add({
        targets: itemText,
        alpha: { from: 0, to: 1 },
        duration: 400,
        delay: i * 200,
      });
    });

    // ── "Coming Next" teaser ──────────────────────────────────
    const teaserY = H * 0.39 + 24 + carried.length * 22 + 40;

    const divider = this.add.graphics();
    divider.lineStyle(1, 0xc8956c, 0.3);
    divider.lineBetween(W / 2 - 140, teaserY, W / 2 + 140, teaserY);

    this.add.text(W / 2, teaserY + 18, 'Next: Act Two — The Village of Cresthollow', {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#c8956c',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    this.add.text(W / 2, teaserY + 40, [
      'The Thornwood is sealed.',
      'The harbor is closed.',
      'A talking goat has opinions.',
      'Six days remain.',
    ].join('  ·  '), {
      fontFamily: 'Georgia, serif',
      fontSize: '11px',
      color: '#666666',
      fontStyle: 'italic',
      wordWrap: { width: W - 160 },
      align: 'center',
    }).setOrigin(0.5);

    // ── "Continue" prompt ─────────────────────────────────────
    const tbcText = this.add.text(W / 2, H - 96, '— Continue to Act Two? —', {
      fontFamily: 'Georgia, serif',
      fontSize: '15px',
      color: '#c8956c',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: tbcText,
      alpha: 1,
      duration: 1200,
      delay: 800,
      ease: 'Sine.easeIn',
    });

    // ── Buttons ───────────────────────────────────────────────
    // Primary: Continue into Act 2
    this._makeButton(W / 2, H - 60, '▶  Continue the Journey', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('CresthollowScene'));
    }, true);

    // Secondary: Main Menu / Play Again
    this._makeButton(W / 2 - 110, H - 22, 'Main Menu', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('MenuScene'));
    });

    this._makeButton(W / 2 + 110, H - 22, 'Play Again', () => {
      GameState.reset();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('QueensChamberScene'));
    });

    // Fade in
    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  _drawSisters(x, y) {
    const g = this.add.graphics().setDepth(5);

    // Cambrie (smaller, copper hair)
    g.fillStyle(0x7a3a0a, 1);
    g.fillTriangle(x - 18, y, x - 28, y + 44, x - 8, y + 44);
    g.fillStyle(0xd09060, 1);
    g.fillCircle(x - 18, y - 10, 8);
    g.fillStyle(0x8a4510, 1);
    g.fillEllipse(x - 18, y - 16, 18, 10);

    // Mackenzie (taller, green cloak)
    g.fillStyle(0x2d5016, 1);
    g.fillTriangle(x + 2, y - 10, x - 10, y + 44, x + 14, y + 44);
    g.fillStyle(0xc8906a, 1);
    g.fillCircle(x + 2, y - 22, 10);
    g.fillStyle(0x1a0e08, 1);
    g.fillEllipse(x + 2, y - 30, 22, 12);
    // Small braid
    g.fillRect(x + 8, y - 22, 3, 20);

    // Dawn rim light on both sisters (warm left edge from horizon)
    g.fillStyle(0xd04820, 0.18);
    g.fillCircle(x - 18, y - 10, 12);  // Cambrie rim
    g.fillCircle(x + 2, y - 22, 14);   // Mackenzie rim

    // Walking away — slight lean
    g.setAngle(-3);
  }

  _makeButton(x, y, label, callback, primary = false) {
    const BW = primary ? 240 : 160;
    const BH = primary ? 42 : 34;

    const fillNorm   = primary ? 0x2a1408 : 0x1a1008;
    const fillHover  = primary ? 0x3a2010 : 0x2a1a10;
    const borderNorm = primary ? 0xc8956c : 0xc8956c;
    const borderHov  = primary ? 0xf0b870 : 0xd4a97e;
    const fontSize   = primary ? '15px' : '13px';

    const bg = this.add.graphics();
    bg.fillStyle(fillNorm, 1);
    bg.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
    bg.lineStyle(primary ? 1.5 : 1, borderNorm, primary ? 1 : 0.7);
    bg.strokeRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);

    const text = this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif',
      fontSize,
      color: primary ? '#f5e8c8' : '#e8d5b0',
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, BW, BH).setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(fillHover, 1);
      bg.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      bg.lineStyle(1.5, borderHov, 1);
      bg.strokeRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      text.setColor('#ffffff');
    });

    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(fillNorm, 1);
      bg.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      bg.lineStyle(primary ? 1.5 : 1, borderNorm, primary ? 1 : 0.7);
      bg.strokeRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      text.setColor(primary ? '#f5e8c8' : '#e8d5b0');
    });

    zone.on('pointerdown', callback);
  }
}
