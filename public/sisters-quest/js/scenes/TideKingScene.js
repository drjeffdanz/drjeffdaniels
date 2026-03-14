// ============================================================
// scenes/TideKingScene.js — Sisters' Quest: The Moonveil Crown
// The Tide King's Shrine — cliff-face tide pools, Isle of Tides
// Late afternoon, golden-blue light.
// ============================================================

class TideKingScene extends BaseScene {
  constructor() { super({ key: 'TideKingScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('TideKingScene');

    // ── Camera ────────────────────────────────────────────────
    this.cameras.main.fadeIn(600, 0, 0, 0);

    // ── Scene label ───────────────────────────────────────────
    this.add.text(W / 2, 18, "The Tide King's Shrine  ·  Isle of Tides", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#2a3840', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── World (drawn back to front) ───────────────────────────
    this._drawSky(W, WH);
    this._drawSea(W, WH);
    this._drawCliffFace(W, WH);
    this._drawShrineLedge(W, WH);
    this._drawTidePools(W, WH);
    this._drawShrineDecoration(W, WH);
    this._drawKelpGarlands(W, WH);
    this._drawTideKing(W, WH);
    this._drawReturnArrow(W, WH);

    // ── Ripple animation on pools ─────────────────────────────
    this._poolGraphics = this.add.graphics().setDepth(14);
    this._rippleTime   = 0;

    // ── Dialogue ──────────────────────────────────────────────
    this.dialogue = new DialogueSystem(this);
    this._locked   = false;
    this._hotspots = [];

    this.events.on('sq_dialogue_start', () => {
      this._locked = true;
      this._setHotspotsEnabled(false);
      this.disableUI();
    });
    this.events.on('sq_dialogue_end', () => {
      this._locked = false;
      this._setHotspotsEnabled(true);
      this.enableUI();
    });

    // ── Hotspots ──────────────────────────────────────────────
    this._buildHotspots(W, WH);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // ── Entry atmosphere ──────────────────────────────────────
    if (!GameState.getFlag('tideking_scene_entered')) {
      GameState.setFlag('tideking_scene_entered');
      this.time.delayedCall(700, () => {
        this._play([
          { speaker: 'narrator', text: "The tide pool shrine is older than the charts. Carved into the cliff face when the Isle of Tides was still known by another name — one no longer safe to say aloud." },
          { speaker: 'cambrie', text: "He's here. I can feel it. The water is warmer than it should be." },
          { speaker: 'mackenzie', text: "I've never spoken to a sea god before." },
          { speaker: 'cambrie', text: "You have. You just didn't know it was him. You were six. You fell into the harbor. Something put you back on the dock." },
          { speaker: 'mackenzie', text: "...that was him?" },
          { speaker: 'cambrie', text: "He has opinions about children and drowning. Apparently." },
        ]);
      });
    }
  }

  // ── Sky (golden-blue, late afternoon) ────────────────────

  _drawSky(W, WH) {
    const g = this.add.graphics();

    // Deep blue-gold late afternoon
    g.fillGradientStyle(0x0e1828, 0x0e1828, 0x3a5870, 0x3a5870, 1);
    g.fillRect(0, 0, W, WH * 0.36);

    // Warm band near horizon
    g.fillGradientStyle(0x3a5870, 0x3a5870, 0x8a7040, 0x8a7040, 1);
    g.fillRect(0, WH * 0.26, W, WH * 0.12);

    // High cirrus clouds catching gold light
    g.fillStyle(0x8a9aaa, 0.25);
    g.fillEllipse(W * 0.12, WH * 0.06, 240, 22);
    g.fillEllipse(W * 0.45, WH * 0.04, 180, 18);
    g.fillStyle(0xc8a060, 0.18);
    g.fillEllipse(W * 0.72, WH * 0.08, 200, 24);
    g.fillEllipse(W * 0.88, WH * 0.05, 140, 16);

    // Gold light source (sun, low, out of frame but casting)
    g.fillStyle(0xd0a040, 0.12);
    g.fillRect(0, WH * 0.24, W, WH * 0.14);
  }

  // ── Sea (visible at edges and horizon) ────────────────────

  _drawSea(W, WH) {
    const g = this.add.graphics().setDepth(1);

    // Horizon sea band
    g.fillGradientStyle(0x1c3850, 0x1c3850, 0x2a4e68, 0x2a4e68, 1);
    g.fillRect(0, WH * 0.35, W, WH * 0.06);

    // Left-side sea visible past cliff edge
    g.fillStyle(0x1e3a50, 1);
    g.fillRect(0, WH * 0.35, W * 0.08, WH * 0.50);
    // Right-side sea
    g.fillStyle(0x1e3a50, 1);
    g.fillRect(W * 0.92, WH * 0.35, W * 0.08, WH * 0.50);

    // Wave suggestions on visible sea
    g.lineStyle(1, 0x4888a0, 0.35);
    [WH * 0.37, WH * 0.40, WH * 0.43].forEach(wy => {
      g.lineBetween(0, wy, W * 0.07, wy + 2);
      g.lineBetween(W * 0.93, wy, W, wy + 2);
    });
  }

  // ── Cliff Face ────────────────────────────────────────────

  _drawCliffFace(W, WH) {
    const g = this.add.graphics().setDepth(2);

    // Main cliff mass (dark volcanic rock)
    g.fillGradientStyle(0x181c20, 0x181c20, 0x222830, 0x222830, 1);
    g.fillRect(0, WH * 0.28, W, WH * 0.55);

    // Rock texture: irregular facets
    g.fillStyle(0x1c2028, 1);
    const rockFacets = [
      { x: W * 0.05, y: WH * 0.30, w: W * 0.18, h: WH * 0.12 },
      { x: W * 0.28, y: WH * 0.28, w: W * 0.22, h: WH * 0.10 },
      { x: W * 0.56, y: WH * 0.31, w: W * 0.20, h: WH * 0.09 },
      { x: W * 0.78, y: WH * 0.30, w: W * 0.20, h: WH * 0.14 },
      { x: W * 0.12, y: WH * 0.42, w: W * 0.16, h: WH * 0.18 },
      { x: W * 0.62, y: WH * 0.44, w: W * 0.22, h: WH * 0.15 },
    ];
    rockFacets.forEach(f => {
      g.fillRect(f.x, f.y, f.w, f.h);
      g.lineStyle(0.5, 0x141820, 0.7);
      g.strokeRect(f.x, f.y, f.w, f.h);
    });

    // Rock highlight (catching the low sun from one side)
    g.fillStyle(0x8a7040, 0.06);
    g.fillRect(W * 0.55, WH * 0.28, W * 0.45, WH * 0.55);

    // Crack lines in rock face
    g.lineStyle(1, 0x10141a, 0.8);
    const cracks = [
      [[W * 0.12, WH * 0.30], [W * 0.08, WH * 0.48]],
      [[W * 0.35, WH * 0.29], [W * 0.30, WH * 0.55], [W * 0.33, WH * 0.65]],
      [[W * 0.66, WH * 0.31], [W * 0.70, WH * 0.52]],
      [[W * 0.84, WH * 0.33], [W * 0.86, WH * 0.50], [W * 0.82, WH * 0.62]],
    ];
    cracks.forEach(pts => {
      for (let i = 0; i < pts.length - 1; i++) {
        g.lineBetween(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      }
    });

    // Shrine carved alcove (center of cliff face — large)
    const alcX = W * 0.30, alcY = WH * 0.30, alcW = W * 0.40, alcH = WH * 0.38;
    // Alcove shadow
    g.fillStyle(0x0c1014, 0.8);
    g.fillRect(alcX, alcY, alcW, alcH);
    // Alcove arch
    g.fillStyle(0x0e1216, 0.95);
    g.fillEllipse(alcX + alcW / 2, alcY, alcW, alcH * 0.4);
    // Carved wave patterns around alcove frame
    g.lineStyle(1.5, 0x3a5060, 0.55);
    for (let wi = 0; wi < 4; wi++) {
      const wy = alcY + 8 + wi * 10;
      for (let wx = alcX + 6; wx < alcX + alcW - 6; wx += 20) {
        g.arc(wx + 10, wy, 10, Math.PI, 0, false);
        g.strokePath();
      }
    }
    // Carved frame border
    g.lineStyle(2, 0x3a5060, 0.5);
    g.strokeRect(alcX, alcY, alcW, alcH);
    g.strokeEllipse(alcX + alcW / 2, alcY, alcW, alcH * 0.4);

    this._alcoveX = alcX;
    this._alcoveY = alcY;
    this._alcoveW = alcW;
    this._alcoveH = alcH;
  }

  // ── Shrine Ledge / Platform ───────────────────────────────

  _drawShrineLedge(W, WH) {
    const g = this.add.graphics().setDepth(3);

    // Carved stone ledge at the base of the cliff
    const ledgeY = WH * 0.65;
    g.fillStyle(0x20242c, 1);
    g.fillRect(0, ledgeY, W, WH - ledgeY);
    g.lineStyle(2, 0x2e3440, 1);
    g.lineBetween(0, ledgeY, W, ledgeY);

    // Ledge texture
    g.lineStyle(0.5, 0x191d24, 0.6);
    for (let lx = 0; lx < W; lx += 44) {
      g.lineBetween(lx, ledgeY, lx, WH);
    }
    for (let ly = ledgeY + 16; ly < WH; ly += 22) {
      g.lineBetween(0, ly, W, ly);
    }

    // Stone step up to shrine (center)
    g.fillStyle(0x282c34, 1);
    g.fillRect(W * 0.35, ledgeY - 14, W * 0.30, 14);
    g.lineStyle(1, 0x383e48, 1);
    g.strokeRect(W * 0.35, ledgeY - 14, W * 0.30, 14);

    // Gold-tinged water seep from cliff (luminous crack)
    g.lineStyle(2, 0x4888a8, 0.35);
    g.lineBetween(W * 0.48, WH * 0.52, W * 0.50, ledgeY);
    g.lineStyle(1, 0x6aaac8, 0.2);
    g.lineBetween(W * 0.46, WH * 0.54, W * 0.49, ledgeY);
  }

  // ── Star-polygon helper (Phaser has no fillStar) ──────────

  _starPoints(cx, cy, n, innerR, outerR, rot) {
    const pts = [], step = Math.PI / n;
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = i * step + rot - Math.PI / 2;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    return pts;
  }

  // ── Tide Pools ────────────────────────────────────────────

  _drawTidePools(W, WH) {
    const g = this.add.graphics().setDepth(4);

    // The main large pool (where the Tide King sits)
    const mainX = W * 0.28, mainY = WH * 0.62, mainW = W * 0.44, mainH = WH * 0.16;
    g.fillStyle(0x0e2030, 1);
    g.fillEllipse(mainX + mainW / 2, mainY + mainH / 2, mainW, mainH);
    // Pool depth gradient
    g.fillStyle(0x0a1828, 0.7);
    g.fillEllipse(mainX + mainW / 2, mainY + mainH / 2, mainW * 0.7, mainH * 0.65);
    // Pool shimmer
    g.lineStyle(1, 0x4080a0, 0.35);
    g.strokeEllipse(mainX + mainW / 2, mainY + mainH / 2, mainW, mainH);
    // Reflected sky glint on pool
    g.fillStyle(0x6090b0, 0.12);
    g.fillEllipse(mainX + mainW * 0.35, mainY + mainH * 0.35, mainW * 0.30, mainH * 0.3);

    // Small pools (left and right)
    const smallPools = [
      { x: W * 0.08, y: WH * 0.67, w: W * 0.12, h: WH * 0.08 },
      { x: W * 0.80, y: WH * 0.68, w: W * 0.11, h: WH * 0.07 },
      { x: W * 0.16, y: WH * 0.72, w: W * 0.09, h: WH * 0.06 },
      { x: W * 0.76, y: WH * 0.74, w: W * 0.08, h: WH * 0.05 },
    ];
    smallPools.forEach(p => {
      g.fillStyle(0x122030, 1);
      g.fillEllipse(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
      // Tiny crabs / sea stars (simplified shapes)
      g.fillStyle(0xe08040, 0.7);
      g.fillPoints(this._starPoints(p.x + p.w * 0.4, p.y + p.h * 0.55, 5, 3, 6, 0), true);
      g.fillStyle(0x4888a0, 0.5);
      g.lineStyle(1, 0x3a7090, 0.4);
      g.strokeEllipse(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
    });

    this._mainPoolX = mainX;
    this._mainPoolY = mainY;
    this._mainPoolW = mainW;
    this._mainPoolH = mainH;
  }

  // ── Shrine Decoration (sea glass, offerings) ──────────────

  _drawShrineDecoration(W, WH) {
    const g = this.add.graphics().setDepth(6);

    // Sea glass scattered on ledge
    const seaGlassColors = [0x4ab8c0, 0x68c880, 0xa8d8b0, 0x80b8e0, 0xd8e8a0, 0x60a8d0];
    const glassPositions = [
      [W * 0.10, WH * 0.67], [W * 0.18, WH * 0.68], [W * 0.22, WH * 0.66],
      [W * 0.76, WH * 0.67], [W * 0.82, WH * 0.69], [W * 0.86, WH * 0.66],
      [W * 0.06, WH * 0.72], [W * 0.91, WH * 0.73], [W * 0.14, WH * 0.75],
      [W * 0.88, WH * 0.75], [W * 0.03, WH * 0.66], [W * 0.96, WH * 0.68],
    ];
    glassPositions.forEach((pos, i) => {
      const col  = seaGlassColors[i % seaGlassColors.length];
      const size = Phaser.Math.Between(4, 9);
      g.fillStyle(col, 0.75);
      g.fillEllipse(pos[0], pos[1], size, size * 0.7);
      g.lineStyle(0.5, col, 0.4);
      g.strokeEllipse(pos[0], pos[1], size, size * 0.7);
      // Glint
      g.fillStyle(0xffffff, 0.4);
      g.fillCircle(pos[0] - size * 0.15, pos[1] - size * 0.15, size * 0.18);
    });

    // Smooth stone offerings on ledge flanking pool
    g.fillStyle(0x484c58, 1);
    [[W * 0.26, WH * 0.64], [W * 0.73, WH * 0.64], [W * 0.24, WH * 0.67], [W * 0.75, WH * 0.67]].forEach(p => {
      g.fillEllipse(p[0], p[1], Phaser.Math.Between(10, 16), Phaser.Math.Between(6, 10));
    });

    // Alcove shrine offerings (inside the carved shrine)
    const alcCX = this._alcoveX + this._alcoveW / 2;
    const alcBY = this._alcoveY + this._alcoveH - 16;
    // Central carved wave design (large, dominant)
    g.lineStyle(2, 0x4888a8, 0.55);
    for (let wl = 0; wl < 5; wl++) {
      const wy = alcBY - 12 - wl * 14;
      for (let wx = this._alcoveX + 12; wx < this._alcoveX + this._alcoveW - 12; wx += 28) {
        g.arc(wx + 14, wy, 14, Math.PI, 0, false);
        g.strokePath();
      }
    }
    // Glowing center rune (carved star)
    g.fillStyle(0x4888a8, 0.3);
    g.fillPoints(this._starPoints(alcCX, this._alcoveY + this._alcoveH * 0.6, 6, 12, 22, 0), true);
    g.lineStyle(1.5, 0x6aa8c8, 0.6);
    g.strokePoints(this._starPoints(alcCX, this._alcoveY + this._alcoveH * 0.6, 6, 12, 22, 0), true);

    // Small candle-like sea glass lights on the shrine ledge
    const candleX = [alcCX - 48, alcCX - 24, alcCX + 24, alcCX + 48];
    candleX.forEach(cx => {
      g.fillStyle(0x80d0e0, 0.55);
      g.fillCircle(cx, alcBY - 5, 5);
      g.fillStyle(0xd0f0ff, 0.35);
      g.fillCircle(cx, alcBY - 8, 6);
    });
  }

  // ── Kelp Garlands ─────────────────────────────────────────

  _drawKelpGarlands(W, WH) {
    const g = this.add.graphics().setDepth(7);

    // Hanging kelp strands from cliff face
    const kelpAnchors = [
      W * 0.10, W * 0.22, W * 0.32,
      W * 0.68, W * 0.78, W * 0.90,
    ];
    kelpAnchors.forEach(kX => {
      const kLen = Phaser.Math.Between(58, 108);
      const kStartY = WH * 0.30 + Phaser.Math.Between(-10, 10);
      // Strand body (wavy line approximation)
      g.lineStyle(3, 0x1a4018, 0.7);
      g.beginPath();
      g.moveTo(kX, kStartY);
      for (let ky = 0; ky < kLen; ky += 10) {
        const kWave = Math.sin(ky * 0.3) * 5;
        g.lineTo(kX + kWave, kStartY + ky);
      }
      g.strokePath();
      // Blade highlights (lighter green)
      g.lineStyle(1, 0x2a6028, 0.5);
      for (let bl = 0; bl < kLen; bl += 18) {
        const bx  = kX + Math.sin(bl * 0.3) * 5;
        const by  = kStartY + bl;
        const bw  = Phaser.Math.Between(8, 16);
        g.lineBetween(bx, by, bx + bw, by - 5);
        g.lineBetween(bx, by, bx - bw, by - 3);
      }
    });

    // Draping kelp swag across the top of the alcove
    g.lineStyle(2, 0x1a4018, 0.6);
    const swagAnchorL = this._alcoveX, swagAnchorR = this._alcoveX + this._alcoveW;
    const swagY = this._alcoveY;
    g.beginPath();
    g.moveTo(swagAnchorL, swagY);
    for (let t = 0; t <= 1; t += 0.08) {
      const sx = swagAnchorL + (swagAnchorR - swagAnchorL) * t;
      const sy = swagY + Math.sin(t * Math.PI) * 28;
      g.lineTo(sx, sy);
    }
    g.strokePath();
    // Kelp beads on swag
    g.fillStyle(0x2a6028, 0.7);
    for (let t = 0.1; t < 1; t += 0.15) {
      const sx = swagAnchorL + (swagAnchorR - swagAnchorL) * t;
      const sy = swagY + Math.sin(t * Math.PI) * 28;
      g.fillCircle(sx, sy, 4);
    }
  }

  // ── The Tide King ─────────────────────────────────────────

  _drawTideKing(W, WH) {
    const g  = this.add.graphics().setDepth(12);
    // LARGE — fills most of the main pool area, half-submerged
    const tkX = W * 0.50, tkY = WH * 0.68;

    // Submerged body (lower half in pool — large blue-green mass)
    g.fillStyle(0x1a4858, 0.85);
    g.fillEllipse(tkX, tkY + 12, 130, 50);  // submerged mass

    // Torso (huge, ancient, half-risen from water)
    // Pattern on skin like rippling water (layered curves)
    g.fillStyle(0x2a6878, 1);
    g.fillEllipse(tkX, tkY - 30, 110, 100);  // main torso mass
    // Water pattern layers on skin
    g.lineStyle(1.5, 0x3a8090, 0.45);
    for (let ri = 0; ri < 5; ri++) {
      const ry = tkY - 70 + ri * 14;
      g.arc(tkX, ry, 35 + ri * 6, -Math.PI * 0.7, Math.PI * 0.7, false);
      g.strokePath();
    }

    // Arms (massive, extending out from torso)
    // Left arm
    g.fillStyle(0x287080, 1);
    g.fillEllipse(tkX - 72, tkY - 10, 60, 28);
    g.fillEllipse(tkX - 96, tkY - 6, 32, 22);
    // Right arm (partially raised — a gesture of ancient reception)
    g.fillEllipse(tkX + 70, tkY - 18, 60, 26);
    g.fillEllipse(tkX + 92, tkY - 30, 32, 22);
    // Water-pattern on arms
    g.lineStyle(1, 0x3a8090, 0.35);
    g.lineBetween(tkX - 80, tkY - 10, tkX - 55, tkY - 6);
    g.lineBetween(tkX + 54, tkY - 16, tkX + 80, tkY - 20);

    // Hands / fingers (large, sea-creature textured)
    g.fillStyle(0x206070, 1);
    // Left hand (resting on pool edge)
    g.fillEllipse(tkX - 112, tkY, 30, 18);
    g.fillStyle(0x206070, 0.8);
    for (let fi = -2; fi <= 2; fi++) {
      g.fillEllipse(tkX - 112 + fi * 5, tkY - 9, 8, 16);
    }
    // Right hand (slightly raised)
    g.fillStyle(0x206070, 1);
    g.fillEllipse(tkX + 110, tkY - 28, 28, 18);
    for (let fi = -2; fi <= 2; fi++) {
      g.fillEllipse(tkX + 110 + fi * 5, tkY - 38, 7, 14);
    }

    // Neck / shoulders
    g.fillStyle(0x2a6878, 1);
    g.fillRect(tkX - 18, tkY - 80, 36, 22);

    // Head (large, ancient, dignified — oceanic)
    g.fillStyle(0x347888, 1);
    g.fillCircle(tkX, tkY - 100, 46);
    // Brow ridge (ancient, heavy)
    g.fillStyle(0x2a6070, 1);
    g.fillRect(tkX - 40, tkY - 120, 80, 14);
    g.fillEllipse(tkX, tkY - 122, 88, 18);
    // Water crown / crest (risen from head)
    g.fillStyle(0x3090b0, 0.6);
    g.fillTriangle(tkX - 28, tkY - 140, tkX - 18, tkY - 172, tkX - 8, tkY - 140);
    g.fillTriangle(tkX - 6, tkY - 140, tkX, tkY - 188, tkX + 6, tkY - 140);
    g.fillTriangle(tkX + 8, tkY - 140, tkX + 18, tkY - 168, tkX + 28, tkY - 140);
    g.lineStyle(1, 0x50b8d8, 0.6);
    g.strokeTriangle(tkX - 28, tkY - 140, tkX - 18, tkY - 172, tkX - 8, tkY - 140);
    g.strokeTriangle(tkX - 6, tkY - 140, tkX, tkY - 188, tkX + 6, tkY - 140);
    g.strokeTriangle(tkX + 8, tkY - 140, tkX + 18, tkY - 168, tkX + 28, tkY - 140);

    // Face features
    // Eyes (ancient, observant, luminous)
    g.fillStyle(0x80d8e8, 0.9);
    g.fillEllipse(tkX - 18, tkY - 104, 22, 14);
    g.fillEllipse(tkX + 18, tkY - 104, 22, 14);
    g.fillStyle(0x204858, 1);
    g.fillCircle(tkX - 18, tkY - 104, 6);
    g.fillCircle(tkX + 18, tkY - 104, 6);
    // Eye glow
    g.fillStyle(0x90e8f8, 0.5);
    g.fillCircle(tkX - 20, tkY - 106, 2);
    g.fillCircle(tkX + 16, tkY - 106, 2);

    // Nose ridge (subtle)
    g.lineStyle(1, 0x287080, 0.6);
    g.lineBetween(tkX - 4, tkY - 98, tkX - 4, tkY - 86);
    g.lineBetween(tkX + 4, tkY - 98, tkX + 4, tkY - 86);

    // Mouth (set, dignified — not smiling, not frowning. Patient.)
    g.lineStyle(2, 0x246070, 0.8);
    g.lineBetween(tkX - 24, tkY - 82, tkX + 24, tkY - 82);
    // Subtle chin markings (water glyphs)
    g.lineStyle(1, 0x3a8898, 0.4);
    g.arc(tkX - 8, tkY - 72, 8, -Math.PI * 0.5, Math.PI * 0.5, false);
    g.strokePath();
    g.arc(tkX + 8, tkY - 72, 8, Math.PI * 0.5, -Math.PI * 0.5, false);
    g.strokePath();

    // Ambient water light glow around the King (his presence illuminates the pool)
    const glowG = this.add.graphics().setDepth(11);
    glowG.fillStyle(0x3090b0, 0.07);
    glowG.fillEllipse(tkX, tkY - 20, 220, 160);
    glowG.fillStyle(0x50b0c8, 0.04);
    glowG.fillEllipse(tkX, tkY - 40, 300, 240);

    // Breathing tween
    this.tweens.add({
      targets: g, y: { from: 0, to: -6 },
      duration: 5000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    // Glow pulse
    this.tweens.add({
      targets: glowG, alpha: { from: 0.7, to: 1.0 },
      duration: 3000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this._tideKingX = tkX;
    this._tideKingY = tkY;
  }

  // ── Return arrow ─────────────────────────────────────────

  _drawReturnArrow(W, WH) {
    const g = this.add.graphics().setDepth(6);
    const aX = 14, aY = 32;
    g.fillStyle(0x1a2030, 0.85);
    g.fillRoundedRect(aX - 4, aY - 14, 148, 28, 4);
    g.lineStyle(1, 0x4888a8, 0.5);
    g.strokeRoundedRect(aX - 4, aY - 14, 148, 28, 4);
    this.add.text(aX + 8, aY, '◀ Back to Isle of Tides', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#78a8c8', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);
    this._returnArrow = { x: aX - 4, y: aY - 14, w: 148, h: 28 };
  }

  // ── Pool ripple animation ────────────────────────────────

  _drawPoolRipples(W, WH) {
    const g = this._poolGraphics;
    g.clear();
    const t  = this._rippleTime;
    const cx = this._mainPoolX + this._mainPoolW / 2;
    const cy = this._mainPoolY + this._mainPoolH / 2;

    // Concentric ripple rings emanating from center
    for (let r = 0; r < 4; r++) {
      const phase = (t * 0.4 + r * 0.7) % 1;
      const rx    = this._mainPoolW * 0.5 * phase;
      const ry    = this._mainPoolH * 0.5 * phase;
      const alpha = (1 - phase) * 0.3;
      g.lineStyle(1.5, 0x60a8c8, alpha);
      g.strokeEllipse(cx, cy, rx * 2, ry * 2);
    }

    // Bioluminescent sparkle dots in pool (random-ish)
    g.fillStyle(0x80d8e8, 0.3);
    const sparkCount = 6;
    for (let s = 0; s < sparkCount; s++) {
      const sx = cx + Math.cos(t * 0.8 + s * 1.3) * (this._mainPoolW * 0.28);
      const sy = cy + Math.sin(t * 1.1 + s * 0.9) * (this._mainPoolH * 0.28);
      const sr = 1.5 + Math.sin(t * 2 + s) * 0.8;
      g.fillCircle(sx, sy, sr);
    }
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Tide King ─────────────────────────────────────────────
    this._addHotspot({
      id: 'tide_king', name: 'The Tide King',
      x: this._tideKingX, y: this._tideKingY - 60, w: 160, h: 200,
      look: () => this._narrate("The Tide King of Poolville is patient in the way that only very old and very large things can be. The pool around him is still, but it shouldn't be."),
      talk: () => this._talkToTideKing(),
      take: () => this._narrate("The Tide King is not available for taking. This is not a situation you should need explained."),
      use:  () => {
        if (VerbSystem.activeItem === 'thorn_sonnet') {
          this._play([
            { speaker: 'narrator', text: "You offer the goat's sonnet. The Tide King looks at it for a long moment." },
            { speaker: 'tideking', text: "...this is a poem about a fence post." },
            { speaker: 'cambrie', text: "Yes. Written by a goat. He was very sincere about it." },
            { speaker: 'tideking', text: "I respect sincerity. This is not what I asked for. But I respect it." },
          ]);
        } else {
          this._narrate("The Tide King watches you with great patience. He has time. He is not sure you do.");
        }
      },
    });

    // ── Tide Pools ────────────────────────────────────────────
    this._addHotspot({
      id: 'tide_pools', name: 'Tide Pools',
      x: this._mainPoolX + this._mainPoolW / 2,
      y: this._mainPoolY + this._mainPoolH / 2,
      w: this._mainPoolW, h: this._mainPoolH + 20,
      look: () => this._play([
        { speaker: 'cambrie', text: "The pools are impossibly clear. Small crabs and sea stars move along the bottom. Sea glass glitters everywhere." },
        { speaker: 'cambrie', text: "The largest pool is... warm. And the light inside it doesn't match the light above. Something is down there that generates its own glow." },
      ]),
      talk: () => this._narrate("The pools do not speak. The Tide King speaks for them when he feels it's warranted."),
      take: () => this._narrate("You cannot take a tide pool. You can, however, look at it for quite a long time."),
      use:  () => this._narrate("You trail your fingers in the water. It is warm. A small sea star moves toward your hand and then, thinking better of it, moves away."),
    });

    // ── Shrine Offerings ──────────────────────────────────────
    this._addHotspot({
      id: 'shrine_offerings', name: 'Shrine Offerings',
      x: this._alcoveX + this._alcoveW / 2, y: this._alcoveY + this._alcoveH * 0.75,
      w: this._alcoveW, h: this._alcoveH * 0.5,
      look: () => this._play([
        { speaker: 'cambrie', text: "Sea glass, smooth stones, bits of kelp. The offerings of people who needed something from the sea." },
        { speaker: 'cambrie', text: "And here — a scrap of paper with a child's handwriting. 'Please give my dad back.' Whoever left this didn't get what they asked for." },
        { speaker: 'mackenzie', text: "...I hate this." },
        { speaker: 'cambrie', text: "Me too." },
      ]),
      talk: () => this._narrate("You speak quietly to the offerings. To whoever left them. That seems right."),
      take: () => this._narrate("You don't take what someone else left as a prayer."),
      use:  () => {
        if (GameState.hasItem('seaglass_heart')) {
          this._play([
            { speaker: 'cambrie', text: "The sea-glass heart. It should be here. With the others." },
            { speaker: 'narrator', text: "But you can't leave it. Not yet. You still need it." },
          ]);
        } else {
          this._narrate("You have nothing to add to the shrine. Not yet.");
        }
      },
    });

    // ── The Sea ───────────────────────────────────────────────
    this._addHotspot({
      id: 'the_sea', name: 'The Open Sea',
      x: W * 0.04, y: WH * 0.45, w: W * 0.08, h: WH * 0.18,
      look: () => this._play([
        { speaker: 'cambrie', text: "The ocean stretches to the horizon. Somewhere out there: the Isle of Tides, and deeper still, the wreck of the Sable Dawn." },
        { speaker: 'mackenzie', text: "Mira is still down there. Waiting." },
        { speaker: 'cambrie', text: "Not waiting. She doesn't know we're coming. She just — persists. As selkies do, when they can't go home." },
      ]),
      talk: () => this._narrate("You say something to the sea. The sea, as usual, says everything back at once and means all of it."),
      take: () => this._narrate("You cannot take the sea. The sea takes things from you, not the other way around."),
      use:  () => this._narrate("The sea doesn't accept items. It accepts respect, patience, and occasionally a well-timed apology."),
    });

    // ── Return ────────────────────────────────────────────────
    const ra = this._returnArrow;
    this._addHotspot({
      id: 'return', name: 'Return to the Isle',
      x: ra.x + ra.w / 2, y: ra.y + ra.h / 2, w: ra.w, h: ra.h,
      look: () => this._narrate("The path back along the cliff. The Isle of Tides stretches inland."),
      talk: () => this._narrate(""),
      take: () => this._narrate(""),
      use:  () => this._goTo('IsleOfTidesScene'),
    });
  }

  _addHotspot(def) {
    const outline = this.add.graphics().setDepth(49);
    const zone    = this.add.zone(def.x, def.y, def.w, def.h)
      .setInteractive({ useHandCursor: true })
      .setDepth(205);

    zone.on('pointerover', () => {
      if (this._locked) return;
      outline.clear();
      outline.lineStyle(1.5, 0x4888a8, 0.4);
      outline.strokeRect(def.x - def.w / 2, def.y - def.h / 2, def.w, def.h);
      this.setStatus(VerbSystem.getActionLabel() + '  ·  ' + def.name);
    });
    zone.on('pointerout', () => { outline.clear(); this.setStatus(''); });
    zone.on('pointerdown', () => {
      if (this._locked) return;
      const v = VerbSystem.activeVerb;
      if (def[v]) def[v]();
    });

    this._hotspots.push({ zone, outline, def });
    return { zone, outline };
  }

  _setHotspotsEnabled(on) {
    this._hotspots.forEach(h => {
      on ? h.zone.setInteractive({ useHandCursor: true })
         : h.zone.disableInteractive();
    });
  }

  // ── Tide King dialogue logic ──────────────────────────────

  _talkToTideKing() {
    if (GameState.getFlag('tideking_done')) {
      this._play(DIALOGUE_TIDEKING_REPEAT);
    } else if (!GameState.getFlag('tideking_shrine_done')) {
      GameState.setFlag('tideking_shrine_done');
      this._play(DIALOGUE_TIDEKING_SHRINE, () => {
        // After shrine intro, move directly to the sonnet/answer sequence
        this.time.delayedCall(300, () => {
          this._play(DIALOGUE_TIDEKING_SONNET, () => {
            GameState.setFlag('tideking_done');
            this.setStatus("The Tide King is satisfied. Find Mira.");
            this.time.delayedCall(600, () => {
              this._play([
                { speaker: 'tideking', text: "Go. The selkie is in the wreck. She has been there since the night the ship went down. She is not dead — selkies are difficult to kill — but she is not free." },
                { speaker: 'tideking', text: "The manifest was the first step. The second step is returning what was taken. Not trading. Returning. She does not owe you anything for this." },
                { speaker: 'cambrie', text: "We know." },
                { speaker: 'tideking', text: "Good. Most people who come to me don't." },
              ]);
            });
          });
        });
      });
    } else {
      this._play(DIALOGUE_TIDEKING_REPEAT);
    }
  }

  // ── Transitions ───────────────────────────────────────────

  _goTo(scene) {
    this._locked = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(600, () => this.scene.start(scene));
  }

  // ── Helpers ───────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }
  _narrate(text)          { this._play([{ speaker: 'narrator', text }]); }

  update() {
    if (this.dialogue) this.dialogue.update();

    this._rippleTime += 0.016;
    const W  = this.scale.width;
    const WH = this.scale.height - 156;
    this._drawPoolRipples(W, WH);
  }
}
