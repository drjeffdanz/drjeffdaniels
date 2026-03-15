// ============================================================
// scenes/TrueEndingScene.js — Sisters' Quest: The Moonveil Crown
// The True Ending — Vessa completes the Crown at dawn, the queen
// wakes, epilogue. Cutscene — extends Phaser.Scene directly.
// ============================================================

class TrueEndingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TrueEndingScene' });
  }

  preload() {
    this.load.image('bg_shore', 'assets/backgrounds/shore-dawn.jpg');
    this.load.image('bg_greathall', 'assets/backgrounds/great-hall.jpg');
  }

  create() {
    MusicManager.play(this, 'music_ending');
    const W = this.scale.width;
    const H = this.scale.height;

    GameState.setCurrentScene('TrueEndingScene');

    // Phase 1: Shore dawn scene
    this._drawShoreDawn(W, H);
    this.dialogue = new DialogueSystem(this);

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.time.delayedCall(800, () => {
      this.dialogue.play(DIALOGUE_TRUE_ENDING, () => {
        this._transitionToHall(W, H);
      });
    });
  }

  // ── Phase transitions ─────────────────────────────────────────

  _transitionToHall(W, H) {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.time.delayedCall(800, () => {
      // Clear and redraw
      this.children.removeAll(true);
      this.dialogue = new DialogueSystem(this);
      this._drawGreatHall(W, H);
      this.cameras.main.fadeIn(800, 0, 0, 0);
      this.time.delayedCall(600, () => {
        this.dialogue.play(DIALOGUE_PALACE_RETURN, () => {
          this._showEpilogue(W, H);
        });
      });
    });
  }

  _showEpilogue(W, H) {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.time.delayedCall(800, () => {
      this.children.removeAll(true);
      this._drawEpilogueScreen(W, H);
      this.cameras.main.fadeIn(800, 0, 0, 0);
      this.dialogue = new DialogueSystem(this);
      this.time.delayedCall(400, () => {
        this.dialogue.play(DIALOGUE_EPILOGUE, () => {
          this._showEndButtons(W, H);
        });
      });
    });
  }

  // ── Act A: Shore Dawn ─────────────────────────────────────────

  _drawShoreDawn(W, H) {
    const WH = H;
    this.add.image(W / 2, WH / 2, 'bg_shore').setDisplaySize(W, WH).setDepth(0);

    const g = this.add.graphics().setDepth(2);

    // Sisters waiting on shore (center-left, silhouetted against the light)
    const silFeetY = H * 0.88;
    this.add.image(W * 0.28 - 30, silFeetY, 'sprite_cambrie')
      .setDisplaySize(70, 124).setOrigin(0.5, 1).setDepth(3).setTint(0x0d0b09);
    this.add.image(W * 0.28 + 10, silFeetY, 'sprite_mackenzie')
      .setDisplaySize(78, 139).setOrigin(0.5, 1).setDepth(3).setTint(0x0d0b09);

    // Vessa descending the cliff — glowing white-gold silhouette
    this._drawVessaDescent(g, W * 0.75, H * 0.60);

    // The Crown — glowing circle she carries
    const crownX = W * 0.75;
    const crownY = H * 0.58;
    this._drawCrown(g, crownX, crownY, 12);

    // Animate the Crown pulse
    const crownPulse = this.add.graphics().setDepth(8);
    this.tweens.add({
      targets: crownPulse,
      alpha: { from: 0.5, to: 1.0 },
      duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        crownPulse.clear();
        crownPulse.fillStyle(0xffd860, 0.55 * crownPulse.alpha);
        crownPulse.fillCircle(crownX, crownY, 22);
        crownPulse.fillStyle(0xffe090, 0.32 * crownPulse.alpha);
        crownPulse.fillCircle(crownX, crownY, 36);
        crownPulse.fillStyle(0xfff0a0, 0.16 * crownPulse.alpha);
        crownPulse.fillCircle(crownX, crownY, 56);
        crownPulse.fillStyle(0xffe8a0, 0.07 * crownPulse.alpha);
        crownPulse.fillCircle(crownX, crownY, 80);
      },
    });

    // Shore label
    this.add.text(W / 2, 22, 'Dawn  ·  The Obsidian Shore', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#d09070', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10).setAlpha(0.7);
  }


  _drawVessaDescent(g, x, y) {
    // Vessa — white-gold glowing silhouette descending from cliff
    g.fillStyle(0xe8e0d0, 0.85);
    // Robe
    g.fillTriangle(x - 14, y + 60, x + 14, y + 60, x, y + 6);
    // Arms (one slightly raised with crown)
    g.fillRect(x + 10, y + 18, 22, 6);
    // Head
    g.fillCircle(x, y - 4, 10);
    // Hair
    g.fillStyle(0xf0f0ec, 0.8);
    g.fillEllipse(x, y - 12, 22, 10);

    // Luminous glow around her — she carries the completed Crown
    g.fillStyle(0xfff8c0, 0.55);
    g.fillCircle(x, y + 28, 20);
    g.fillStyle(0xffd860, 0.38);
    g.fillCircle(x, y + 28, 36);
    g.fillStyle(0xffc840, 0.22);
    g.fillCircle(x, y + 28, 56);
    g.fillStyle(0xffb030, 0.10);
    g.fillCircle(x, y + 28, 80);
    // Side halo ellipses for wide aura
    g.fillStyle(0xffd060, 0.08);
    g.fillEllipse(x, y + 20, 120, 90);
  }

  _drawCrown(g, x, y, r) {
    // Crown: a circle of light with small points
    g.fillStyle(0xffd860, 0.9);
    g.fillCircle(x, y, r);

    // Crown points (small triangles around the top)
    g.fillStyle(0xffe090, 0.8);
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + (i / 5) * Math.PI * 2;
      const px = x + Math.cos(angle) * (r + 5);
      const py = y + Math.sin(angle) * (r + 5);
      g.fillCircle(px, py, 2.5);
    }

    // Inner glow
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(x, y, r * 0.5);
  }

  // ── Act B: The Great Hall ─────────────────────────────────────

  _drawGreatHall(W, H) {
    const WH = H;
    this.add.image(W / 2, WH / 2, 'bg_greathall').setDisplaySize(W, WH).setDepth(0);

    const g = this.add.graphics().setDepth(2);

    // ── Queen's bed/throne — center ──────────────────────────
    const bedX = W * 0.50;
    const bedY = H * 0.52;

    // Bed frame
    g.fillStyle(0x4a3018, 1);
    g.fillRect(bedX - 70, bedY, 140, 60);
    g.fillRect(bedX - 74, bedY - 6, 148, 70);
    g.lineStyle(2, 0x8a6030, 0.8);
    g.strokeRect(bedX - 74, bedY - 6, 148, 70);

    // Headboard
    g.fillStyle(0x5a3c20, 1);
    g.fillRect(bedX - 70, bedY - 44, 140, 48);
    g.lineStyle(1.5, 0x8a6030, 0.7);
    g.strokeRect(bedX - 70, bedY - 44, 140, 48);
    // Carved detail on headboard
    g.fillStyle(0xc8956c, 0.3);
    g.fillTriangle(bedX - 20, bedY - 40, bedX + 20, bedY - 40, bedX, bedY - 22);
    g.fillCircle(bedX, bedY - 36, 6);

    // Bedding — white/cream
    g.fillStyle(0xe8e0d0, 1);
    g.fillRect(bedX - 66, bedY + 4, 132, 48);

    // Queen Elara — sitting up, whole (no silver mist)
    this._drawQueenElara(g, bedX, bedY + 10);

    // ── Crown on a pillow beside the bed ──────────────────────
    const pilX = bedX + 52;
    const pilY = bedY + 36;
    g.fillStyle(0xe8e0d0, 1);
    g.fillEllipse(pilX, pilY, 40, 20);
    this._drawCrownDetailed(g, pilX, pilY - 10);

    // Crown glow — the completed Moonveil Crown radiating power
    const crownGlow = this.add.graphics().setDepth(6);
    this.tweens.add({
      targets: crownGlow,
      alpha: { from: 0.5, to: 1.0 },
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        crownGlow.clear();
        crownGlow.fillStyle(0xfff8c0, 0.50 * crownGlow.alpha);
        crownGlow.fillCircle(pilX, pilY - 10, 14);
        crownGlow.fillStyle(0xffd860, 0.35 * crownGlow.alpha);
        crownGlow.fillCircle(pilX, pilY - 10, 26);
        crownGlow.fillStyle(0xffb830, 0.18 * crownGlow.alpha);
        crownGlow.fillCircle(pilX, pilY - 10, 44);
        crownGlow.fillStyle(0xffa020, 0.08 * crownGlow.alpha);
        crownGlow.fillCircle(pilX, pilY - 10, 65);
      },
    });

    // ── Birdie — small figure to the side with candelabra ─────
    const birX = W * 0.32;
    const birY = H * 0.54;
    g.fillStyle(0x2a1a08, 1);
    g.fillTriangle(birX - 10, birY, birX + 10, birY, birX, birY - 32);
    g.fillCircle(birX, birY - 40, 9);
    g.fillStyle(0x4a3820, 1);
    g.fillEllipse(birX, birY - 46, 20, 10);
    // Candelabra
    g.fillStyle(0xa08030, 1);
    g.fillRect(birX + 14, birY - 14, 4, 28);
    g.fillRect(birX + 8, birY - 14, 16, 4);
    // Candle flames (three)
    const cflames = [birX + 8, birX + 16, birX + 24];
    cflames.forEach(fx => {
      g.fillStyle(0xffd040, 0.9);
      g.fillTriangle(fx - 3, birY - 14, fx + 3, birY - 14, fx, birY - 22);
    });

    // Hall label
    this.add.text(W / 2, 22, 'The Palace of Elderwyn  ·  Dawn', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#c8a050', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10).setAlpha(0.8);
  }

  _drawQueenElara(g, x, y) {
    // Queen Elara sitting up — no silver mist, full color, awake and whole

    // Nightgown / robes (white-cream)
    g.fillStyle(0xe8e0d0, 1);
    g.fillTriangle(x - 20, y + 48, x + 20, y + 48, x, y + 2);

    // Left arm resting
    g.fillRect(x - 28, y + 14, 12, 8);

    // Neck
    g.fillStyle(0xd0a880, 1);
    g.fillRect(x - 4, y - 6, 8, 10);

    // Head
    g.fillStyle(0xd0a880, 1);
    g.fillEllipse(x, y - 16, 26, 30);

    // Hair — dark brown, loosened from crown (she was ill, hair undone)
    g.fillStyle(0x2a1a10, 1);
    g.fillEllipse(x, y - 28, 30, 14);
    g.fillTriangle(x - 10, y - 28, x - 22, y - 8, x - 4, y - 8);
    g.fillTriangle(x + 10, y - 28, x + 22, y - 8, x + 4, y - 8);

    // Eyes OPEN — bright, awake (contrast: previously closed/dull)
    g.fillStyle(0x3a2818, 1);
    g.fillEllipse(x - 6, y - 18, 7, 5);
    g.fillEllipse(x + 6, y - 18, 7, 5);
    // Eye light glint
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(x - 5, y - 19, 1.5);
    g.fillCircle(x + 7, y - 19, 1.5);

    // Subtle smile (she is waking)
    g.lineStyle(1.5, 0xa07050, 0.8);
    g.beginPath();
    g.moveTo(x - 5, y - 8);
    g.lineTo(x,     y - 6);
    g.lineTo(x + 5, y - 8);
    g.strokePath();

    // NO silver mist — just warm skin color. This is what healed looks like.
  }

  _drawCrownDetailed(g, x, y) {
    // Detailed Moonveil Crown — gold band with three gem points and moon silver threads

    // Main band
    g.fillStyle(0xc8a030, 1);
    g.fillRect(x - 14, y + 4, 28, 8);
    g.lineStyle(1, 0xd4b040, 0.9);
    g.strokeRect(x - 14, y + 4, 28, 8);

    // Three crown points
    const points = [x - 10, x, x + 10];
    points.forEach((px, i) => {
      g.fillStyle(i === 1 ? 0xd4b040 : 0xc8a030, 1);
      g.fillTriangle(px - 4, y + 4, px + 4, y + 4, px, y - 10 - (i === 1 ? 4 : 0));
    });

    // Gem settings at top of each point
    const gemColors = [0x88c0d0, 0xd0d8a0, 0xa080c0];
    points.forEach((px, i) => {
      const gy = y - 10 - (i === 1 ? 4 : 0);
      g.fillStyle(gemColors[i], 0.9);
      g.fillCircle(px, gy, 3);
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(px - 1, gy - 1, 1);
    });

    // Moonveil thread inlay — silver lines across the band
    g.lineStyle(1, 0xd0d8d0, 0.7);
    g.lineBetween(x - 12, y + 8, x - 4, y + 8);
    g.lineBetween(x + 4,  y + 8, x + 12, y + 8);
    g.lineBetween(x - 6,  y + 6, x + 6,  y + 6);

    // Glow
    g.fillStyle(0xffd860, 0.2);
    g.fillCircle(x, y - 2, 18);
  }

  // ── Act C: Epilogue Screen ────────────────────────────────────

  _drawEpilogueScreen(W, H) {
    const g = this.add.graphics();

    // Deep black background
    g.fillStyle(0x020202, 1);
    g.fillRect(0, 0, W, H);

    // Subtle gold border
    g.lineStyle(1.5, 0xc8956c, 0.35);
    g.strokeRect(18, 18, W - 36, H - 36);
    g.lineStyle(1, 0xc8956c, 0.15);
    g.strokeRect(24, 24, W - 48, H - 48);

    // Corner ornaments
    const corners = [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]];
    corners.forEach(([cx, cy]) => {
      g.fillStyle(0xc8956c, 0.4);
      g.fillCircle(cx, cy, 3);
    });

    // Crown symbol at center (decorative, subtle)
    this._drawCrownDetailed(g, W / 2, H * 0.25);

    // Crown radiance on epilogue screen
    g.fillStyle(0xfff0a0, 0.28);
    g.fillCircle(W / 2, H * 0.24, 28);
    g.fillStyle(0xffd860, 0.18);
    g.fillCircle(W / 2, H * 0.24, 48);
    g.fillStyle(0xc89030, 0.10);
    g.fillCircle(W / 2, H * 0.24, 75);

    // Divider line below crown
    g.lineStyle(1, 0xc8956c, 0.3);
    g.lineBetween(W / 2 - 100, H * 0.38, W / 2 + 100, H * 0.38);

    // "Epilogue" label
    this.add.text(W / 2, H * 0.42, 'Epilogue', {
      fontFamily: 'Georgia, serif', fontSize: '14px',
      color: '#c8956c', fontStyle: 'italic',
      letterSpacing: 4,
    }).setOrigin(0.5).setDepth(5).setAlpha(0.8);
  }

  // ── End buttons ───────────────────────────────────────────────

  _showEndButtons(W, H) {
    this._makeButton(W / 2 - 100, H - 44, 'Main Menu', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('MenuScene'));
    });

    this._makeButton(W / 2 + 100, H - 44, 'Play Again', () => {
      GameState.reset();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('QueensChamberScene'));
    });

    // Fade buttons in
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  _makeButton(x, y, label, callback) {
    const BW = 160;
    const BH = 36;

    const bg = this.add.graphics().setDepth(10);
    bg.fillStyle(0x1a1008, 1);
    bg.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
    bg.lineStyle(1, 0xc8956c, 0.7);
    bg.strokeRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);

    const text = this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#e8d5b0',
    }).setOrigin(0.5).setDepth(11);

    const zone = this.add.zone(x, y, BW, BH)
      .setInteractive({ useHandCursor: true })
      .setDepth(15);

    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x2a1a10, 1);
      bg.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      bg.lineStyle(1.5, 0xd4a97e, 1);
      bg.strokeRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      text.setColor('#ffffff');
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x1a1008, 1);
      bg.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      bg.lineStyle(1, 0xc8956c, 0.7);
      bg.strokeRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 5);
      text.setColor('#e8d5b0');
    });
    zone.on('pointerdown', callback);
  }

  update() {
    if (this.dialogue) this.dialogue.update();
  }
}
