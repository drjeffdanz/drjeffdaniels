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

    // Moon — bright, layered glow
    const moonX = W * 0.78, moonY = H * 0.22;
    const moon = this.add.graphics();
    // Outer corona
    moon.fillStyle(0xc8d8ff, 0.04);
    moon.fillCircle(moonX, moonY, 160);
    moon.fillStyle(0xc8d8ff, 0.07);
    moon.fillCircle(moonX, moonY, 130);
    // Mid glow ring
    moon.fillStyle(0xdde8ff, 0.18);
    moon.fillCircle(moonX, moonY, 108);
    moon.fillStyle(0xe8f0ff, 0.35);
    moon.fillCircle(moonX, moonY, 94);
    // Moon face — bright cool white
    moon.fillStyle(0xf0f4ff, 0.88);
    moon.fillCircle(moonX, moonY, 82);
    // Subtle surface shading (darker patch lower-right)
    moon.fillStyle(0xd8e4f8, 0.18);
    moon.fillCircle(moonX + 22, moonY + 18, 38);
    moon.fillStyle(0xd0ddf5, 0.12);
    moon.fillCircle(moonX + 30, moonY + 28, 22);
    // Bright highlight upper-left
    moon.fillStyle(0xffffff, 0.55);
    moon.fillCircle(moonX - 24, moonY - 20, 28);
    moon.fillStyle(0xffffff, 0.25);
    moon.fillCircle(moonX - 16, moonY - 12, 44);

    // Animated moonveil shimmer ring
    const shimmer = this.add.graphics();
    this.tweens.add({
      targets: shimmer,
      alpha: { from: 0.6, to: 1.0 },
      duration: 2800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        shimmer.clear();
        shimmer.lineStyle(1.5, 0xc8d8ff, 0.18 * shimmer.alpha);
        shimmer.strokeCircle(moonX, moonY, 96 + shimmer.alpha * 6);
        shimmer.lineStyle(1, 0xffffff, 0.08 * shimmer.alpha);
        shimmer.strokeCircle(moonX, moonY, 112 + shimmer.alpha * 8);
      },
    });

    // Tower silhouette on the right
    this._drawTower(W * 0.78, H, 60, H * 0.55);

    // Ground/hill silhouette
    const hill = this.add.graphics();
    hill.fillStyle(0x08050f, 1);
    hill.fillEllipse(W * 0.5, H + 60, W * 1.6, 200);

    // ── Ground mist (graphics-based, no texture needed) ───────
    const mistG = this.add.graphics();
    this.tweens.add({
      targets: mistG,
      alpha: { from: 0.5, to: 1.0 },
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        mistG.clear();
        for (let i = 0; i < 6; i++) {
          const mx = W * (0.05 + i * 0.18);
          const my = H * 0.78 + Math.sin(Date.now() / 4000 + i) * 8;
          mistG.fillStyle(0x8090c0, 0.025 * mistG.alpha);
          mistG.fillEllipse(mx, my, 280 + i * 30, 60);
        }
      },
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

    // Windows — warm amber glow (lit from within)
    const glow = this.add.graphics();
    const wins = [
      groundY - height + 30,
      groundY - height + 80,
      groundY - height + 130,
    ];
    wins.forEach(wy => {
      // Glow halo
      glow.fillStyle(0xd08020, 0.12);
      glow.fillRect(cx - 22, wy - 8, 44, 44);
      glow.fillStyle(0xffa030, 0.07);
      glow.fillRect(cx - 30, wy - 14, 60, 56);
      // Window pane
      g.fillStyle(0xd08828, 0.9);
      g.fillRect(cx - 9, wy, 18, 26);
      // Cross bar
      g.fillStyle(0x06040e, 1);
      g.fillRect(cx - 9, wy + 12, 18, 2);
      g.fillRect(cx, wy, 2, 26);
    });
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
