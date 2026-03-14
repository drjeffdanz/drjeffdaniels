// ============================================================
// scenes/TrueEndingScene.js — Sisters' Quest: The Moonveil Crown
// The True Ending — Vessa completes the Crown at dawn, the queen
// wakes, epilogue. Cutscene — extends Phaser.Scene directly.
// ============================================================

class TrueEndingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TrueEndingScene' });
  }

  create() {
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
    const g = this.add.graphics();

    // Dawn sky — dark purple top fading to orange-pink at horizon
    g.fillGradientStyle(0x0e0818, 0x0e0818, 0x1a0c20, 0x1a0c20, 1);
    g.fillRect(0, 0, W, H * 0.30);

    g.fillGradientStyle(0x1a0c20, 0x1a0c20, 0x5a1830, 0x5a1830, 1);
    g.fillRect(0, H * 0.30, W, H * 0.20);

    // Orange-pink horizon band
    g.fillGradientStyle(0x5a1830, 0x5a1830, 0xe84820, 0xe84820, 1);
    g.fillRect(0, H * 0.50, W, H * 0.10);

    // Warm orange horizon glow
    g.fillGradientStyle(0xe84820, 0xe84820, 0xf07030, 0xf07030, 1);
    g.fillRect(0, H * 0.60, W, H * 0.06);

    // Dark sea at base
    g.fillGradientStyle(0x0a1820, 0x0a1820, 0x060c10, 0x060c10, 1);
    g.fillRect(0, H * 0.66, W, H * 0.34);

    // Stars (fading at dawn)
    for (let i = 0; i < 40; i++) {
      const sx = Phaser.Math.Between(0, W);
      const sy = Phaser.Math.Between(0, H * 0.35);
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.05, 0.35));
      g.fillCircle(sx, sy, 1);
    }

    // Obsidian isle silhouette (right)
    g.fillStyle(0x060408, 1);
    g.fillRect(W * 0.65, H * 0.50, W * 0.35, H * 0.50);
    g.fillTriangle(W * 0.65, H * 0.50, W * 0.80, H * 0.36, W, H * 0.46);
    g.fillTriangle(W * 0.80, H * 0.44, W, H * 0.38, W, H * 0.50);

    // Tower on cliff (small, right side)
    g.fillStyle(0x080610, 1);
    g.fillRect(W * 0.88, H * 0.28, 12, H * 0.22);
    // Glowing window
    g.fillStyle(0xd08020, 0.7);
    g.fillRect(W * 0.89, H * 0.34, 5, 8);

    // Rocky shoreline (dark)
    g.fillStyle(0x0e0c0a, 1);
    g.fillRect(0, H * 0.72, W, H * 0.28);
    g.fillTriangle(0, H * 0.72, W * 0.20, H * 0.66, W * 0.35, H * 0.72);
    g.fillTriangle(W * 0.28, H * 0.72, W * 0.50, H * 0.68, W * 0.60, H * 0.72);

    // Sea reflection of dawn on water
    g.fillStyle(0xe84820, 0.10);
    g.fillRect(W * 0.30, H * 0.66, W * 0.40, H * 0.06);

    // Sisters waiting on shore (two small silhouettes, center-left)
    this._drawSisterSilhouettes(g, W * 0.28, H * 0.80);

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
      alpha: { from: 0.4, to: 1.0 },
      duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        crownPulse.clear();
        crownPulse.fillStyle(0xffd860, 0.15 * crownPulse.alpha);
        crownPulse.fillCircle(crownX, crownY, 28);
        crownPulse.fillStyle(0xfff0a0, 0.08 * crownPulse.alpha);
        crownPulse.fillCircle(crownX, crownY, 44);
      },
    });

    // Shore label
    this.add.text(W / 2, 22, 'Dawn  ·  The Obsidian Shore', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#d09070', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10).setAlpha(0.7);
  }

  _drawSisterSilhouettes(g, x, y) {
    // Cambrie (smaller)
    g.fillStyle(0x0a0808, 1);
    g.fillTriangle(x - 18, y, x - 28, y + 38, x - 8, y + 38);
    g.fillCircle(x - 18, y - 8, 7);
    g.fillEllipse(x - 18, y - 14, 16, 8);

    // Mackenzie (taller)
    g.fillStyle(0x0c0a08, 1);
    g.fillTriangle(x, y - 8, x - 12, y + 38, x + 12, y + 38);
    g.fillCircle(x, y - 20, 9);
    g.fillEllipse(x, y - 28, 20, 10);
    // Braid
    g.fillRect(x + 7, y - 20, 3, 18);
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

    // Luminous glow around her
    g.fillStyle(0xffd860, 0.12);
    g.fillCircle(x, y + 28, 40);
    g.fillStyle(0xfff0a0, 0.06);
    g.fillCircle(x, y + 28, 60);
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
    const g = this.add.graphics();

    // High stone hall — warm dawn light
    // Background wall
    g.fillGradientStyle(0x1a1208, 0x1a1208, 0x221810, 0x221810, 1);
    g.fillRect(0, 0, W, H);

    // Ceiling
    g.fillStyle(0x100e0a, 1);
    g.fillRect(0, 0, W, 30);

    // Floor — lighter stone
    g.fillStyle(0x1e1810, 1);
    g.fillRect(0, H * 0.75, W, H * 0.25);
    g.lineStyle(1, 0x2a2014, 0.3);
    for (let x = 0; x < W; x += 60) g.lineBetween(x, H * 0.75, x, H);
    for (let y = H * 0.75; y < H; y += 40) g.lineBetween(0, y, W, y);
    g.lineBetween(0, H * 0.75, W, H * 0.75);

    // Tall columns — left and right
    const columns = [W * 0.12, W * 0.26, W * 0.74, W * 0.88];
    columns.forEach(cx => {
      g.fillStyle(0x2a2018, 1);
      g.fillRect(cx - 14, 28, 28, H * 0.75);
      g.lineStyle(1, 0x3a3020, 0.7);
      g.strokeRect(cx - 14, 28, 28, H * 0.75);
      // Capital
      g.fillStyle(0x3a3020, 1);
      g.fillRect(cx - 20, 28, 40, 14);
    });

    // Tall windows — morning light streams through
    const windows = [W * 0.19, W * 0.50, W * 0.81];
    windows.forEach(wx => {
      // Window embrasure
      g.fillStyle(0x282018, 1);
      g.fillRect(wx - 22, 28, 44, H * 0.55);
      g.fillEllipse(wx, 28, 44, 22);

      // Glass — dawn gold-white
      g.fillStyle(0xf0d080, 0.4);
      g.fillRect(wx - 18, 30, 36, H * 0.54);
      g.fillEllipse(wx, 30, 36, 18);

      // Light shaft
      g.fillStyle(0xffe090, 0.06);
      g.fillTriangle(
        wx - 18, 30,
        wx + 18, 30,
        wx + 80, H * 0.80
      );
      g.fillStyle(0xffe090, 0.04);
      g.fillTriangle(
        wx - 18, 30,
        wx + 18, 30,
        wx - 60, H * 0.80
      );
    });

    // Warm morning ambient glow
    g.fillStyle(0xd09020, 0.05);
    g.fillRect(0, 0, W, H);

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

    // Crown glow
    const crownGlow = this.add.graphics().setDepth(6);
    this.tweens.add({
      targets: crownGlow,
      alpha: { from: 0.5, to: 1.0 },
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        crownGlow.clear();
        crownGlow.fillStyle(0xffd860, 0.14 * crownGlow.alpha);
        crownGlow.fillCircle(pilX, pilY - 10, 30);
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

    // Subtle golden radiance behind crown
    g.fillStyle(0xc89030, 0.04);
    g.fillCircle(W / 2, H * 0.26, 60);

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
