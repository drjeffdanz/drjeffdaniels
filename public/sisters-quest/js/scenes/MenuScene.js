// ============================================================
// scenes/MenuScene.js — Sisters' Quest
// Title screen with New Game / Continue
// ============================================================

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // ── Background ────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x050510, 0x050510, 0x0d0820, 0x0d0820, 1);
    bg.fillRect(0, 0, W, H);

    // Stars
    for (let i = 0; i < 120; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H * 0.75);
      const r = Math.random() < 0.15 ? 2 : 1;
      const alpha = Phaser.Math.FloatBetween(0.3, 1.0);
      this.add.circle(x, y, r, 0xffffff, alpha);
    }

    // Moon — large, soft
    const moon = this.add.graphics();
    moon.fillStyle(0xdde8f5, 0.15);
    moon.fillCircle(W * 0.78, H * 0.22, 90);
    moon.fillStyle(0xdde8f5, 0.10);
    moon.fillCircle(W * 0.78, H * 0.22, 110);

    // Tower silhouette on the right
    this._drawTower(W * 0.78, H, 60, H * 0.55);

    // Ground/hill silhouette
    const hill = this.add.graphics();
    hill.fillStyle(0x08050f, 1);
    hill.fillEllipse(W * 0.5, H + 60, W * 1.6, 200);

    // ── Mist particles ────────────────────────────────────────
    this.add.particles(0, 0, 'mist_particle', {
      x: { min: 0, max: W },
      y: { min: H * 0.55, max: H },
      alpha: { start: 0.06, end: 0 },
      scale: { start: 0.5, end: 2 },
      speed: { min: 8, max: 20 },
      angle: { min: -10, max: 10 },
      lifespan: 6000,
      frequency: 180,
      quantity: 1,
      blendMode: 'ADD',
    });

    // ── Title ─────────────────────────────────────────────────
    this.add.text(W / 2, H * 0.30, "Sisters' Quest", {
      fontFamily: 'Georgia, serif',
      fontSize: '52px',
      color: '#c8956c',
      fontStyle: 'bold',
      stroke: '#3a1a00',
      strokeThickness: 4,
      shadow: { x: 0, y: 3, color: '#000', blur: 12, fill: true },
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.30 + 62, 'The Moonveil Crown', {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: '#d4a97e',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Decorative rule
    const rule = this.add.graphics();
    rule.lineStyle(1, 0xc8956c, 0.5);
    rule.lineBetween(W / 2 - 160, H * 0.30 + 94, W / 2 + 160, H * 0.30 + 94);

    this.add.text(W / 2, H * 0.30 + 108, 'An adventure in the Kingdom of Elderwyn', {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#a3a3a3',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // ── Buttons ───────────────────────────────────────────────
    const btnY = H * 0.62;
    this._makeButton(W / 2, btnY, 'New Game', () => this._startNewGame());

    const hasSave = GameState.hasSave();
    this._makeButton(W / 2, btnY + 60, 'Continue', () => this._continueGame(), !hasSave);

    // Credits line
    this.add.text(W / 2, H - 28, 'Sisters\' Quest  ·  Act One: The Palace of Elderwyn', {
      fontFamily: 'Georgia, serif',
      fontSize: '11px',
      color: '#555555',
    }).setOrigin(0.5);

    // Subtle shimmer on title
    this.tweens.add({
      targets: this.add.text(W / 2, H * 0.30, "Sisters' Quest", {
        fontFamily: 'Georgia, serif',
        fontSize: '52px',
        color: '#ffffff',
        fontStyle: 'bold',
        alpha: 0,
      }).setOrigin(0.5),
      alpha: { from: 0, to: 0.06 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  _drawTower(cx, groundY, width, height) {
    const g = this.add.graphics();
    g.fillStyle(0x06040e, 1);

    // Main tower body
    g.fillRect(cx - width / 2, groundY - height, width, height);

    // Battlements
    const merlonW = width / 5;
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0) {
        g.fillRect(cx - width / 2 + i * merlonW, groundY - height - 22, merlonW, 22);
      }
    }

    // Windows (lit faintly)
    const winColor = 0x1a0a30;
    g.fillStyle(winColor, 1);
    g.fillRect(cx - 10, groundY - height + 30, 20, 28);
    g.fillRect(cx - 10, groundY - height + 80, 20, 28);
    g.fillRect(cx - 10, groundY - height + 130, 20, 28);

    // Faint glow behind windows
    const glow = this.add.graphics();
    glow.fillStyle(0x8040c0, 0.08);
    glow.fillRect(cx - 18, groundY - height + 22, 36, 44);
    glow.fillRect(cx - 18, groundY - height + 72, 36, 44);
  }

  _makeButton(x, y, label, callback, disabled = false) {
    const W = 220;
    const H = 44;

    const bg = this.add.graphics();
    const borderColor = disabled ? 0x333333 : 0xc8956c;
    const textColor = disabled ? '#555555' : '#e8d5b0';
    const fillColor = disabled ? 0x111111 : 0x1a1008;

    bg.fillStyle(fillColor, 1);
    bg.fillRoundedRect(x - W / 2, y - H / 2, W, H, 6);
    bg.lineStyle(1.5, borderColor, 1);
    bg.strokeRoundedRect(x - W / 2, y - H / 2, W, H, 6);

    const text = this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      color: textColor,
    }).setOrigin(0.5);

    if (!disabled) {
      const zone = this.add.zone(x, y, W, H).setInteractive({ useHandCursor: true });

      zone.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(0x2a1a10, 1);
        bg.fillRoundedRect(x - W / 2, y - H / 2, W, H, 6);
        bg.lineStyle(1.5, 0xd4a97e, 1);
        bg.strokeRoundedRect(x - W / 2, y - H / 2, W, H, 6);
        text.setColor('#fff5e0');
      });

      zone.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(fillColor, 1);
        bg.fillRoundedRect(x - W / 2, y - H / 2, W, H, 6);
        bg.lineStyle(1.5, borderColor, 1);
        bg.strokeRoundedRect(x - W / 2, y - H / 2, W, H, 6);
        text.setColor(textColor);
      });

      zone.on('pointerdown', () => {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, callback, [], this);
      });
    }
  }

  _startNewGame() {
    GameState.reset();
    this.scene.start('QueensChamberScene');
  }

  _continueGame() {
    const save = GameState.load();
    if (save) {
      const sceneName = save.scene || 'QueensChamberScene';
      this.scene.start(sceneName);
    } else {
      this._startNewGame();
    }
  }
}
