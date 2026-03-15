// ============================================================
// scenes/MenuScene.js — Sisters' Quest
// Title screen with New Game / Continue
// ============================================================

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('bg_menu', 'assets/backgrounds/menu.jpg');
  }

  create() {
    MusicManager.play(this, 'music_palace');
    const W = this.scale.width;
    const H = this.scale.height;

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, H / 2, 'bg_menu').setDisplaySize(W, H).setDepth(0);

    // Animated moonveil shimmer ring
    const moonX = W * 0.78, moonY = H * 0.22;
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

    // ── Ground mist ───────────────────────────────────────────
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
