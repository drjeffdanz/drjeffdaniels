// ============================================================
// scenes/CresthollowScene.js — Sisters' Quest: The Moonveil Crown
// Act 2 Hub: Cresthollow Village Square
// A market town at the edge of the Thornwood. Dawn, overcast.
// ============================================================

class CresthollowScene extends BaseScene {
  constructor() { super({ key: 'CresthollowScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('CresthollowScene');

    // ── Camera ────────────────────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Scene label ───────────────────────────────────────────
    this.add.text(W / 2, 18, 'Cresthollow  ·  The Village Square', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#3a3028', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── World graphics ────────────────────────────────────────
    this._drawSky(W, WH);
    this._drawBuildings(W, WH);
    this._drawGround(W, WH);
    this._drawMarketStalls(W, WH);
    this._drawThornwoodGate(W, WH);
    this._drawNoticeBoard(W, WH);
    this._drawBram(W, WH);
    this._drawPathArrows(W, WH);

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
      this._checkThornwoodState();
    });

    // ── Hotspots ──────────────────────────────────────────────
    this._buildHotspots(W, WH);

    // ── Check for Thornwood unlock on entry ───────────────────
    this._checkThornwoodState();

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // ── Entry dialogue (first visit only) ────────────────────
    if (!GameState.getFlag('cresthollow_entered')) {
      GameState.setFlag('cresthollow_entered');
      this.time.delayedCall(600, () => {
        this._play(DIALOGUE_CRESTHOLLOW_ENTER);
      });
    }
  }

  // ── Sky ───────────────────────────────────────────────────

  _drawSky(W, WH) {
    const g = this.add.graphics();
    // Dark blue-gray overcast dawn gradient
    g.fillGradientStyle(0x1a1e2e, 0x1a1e2e, 0x2e2e3a, 0x2e2e3a, 1);
    g.fillRect(0, 0, W, WH * 0.55);

    // Cloud layer — heavy overcast bands
    g.fillStyle(0x252530, 0.7);
    const clouds = [
      { x: 0, y: 28, w: 240, h: 38 },
      { x: 180, y: 18, w: 310, h: 44 },
      { x: 460, y: 30, w: 280, h: 36 },
      { x: W - 260, y: 20, w: 270, h: 42 },
    ];
    clouds.forEach(c => {
      g.fillEllipse(c.x + c.w / 2, c.y + c.h / 2, c.w, c.h);
    });

    // Pale dawn glow at horizon
    g.fillStyle(0x4a3a28, 0.18);
    g.fillRect(0, WH * 0.38, W, WH * 0.17);

    // Far tree silhouettes in the distance (Thornwood visible)
    g.fillStyle(0x0c0e14, 1);
    for (let tx = W * 0.58; tx < W; tx += 22) {
      const th = Phaser.Math.Between(48, 88);
      const tw = Phaser.Math.Between(12, 20);
      g.fillTriangle(tx, WH * 0.55 - th, tx - tw / 2, WH * 0.55, tx + tw / 2, WH * 0.55);
    }
  }

  // ── Buildings ─────────────────────────────────────────────

  _drawBuildings(W, WH) {
    const g = this.add.graphics();

    // ─ The Rusty Plow (inn, left) ─
    const innX = 18, innY = WH * 0.18, innW = W * 0.27, innH = WH * 0.52;
    // Main facade
    g.fillStyle(0x2a2218, 1);
    g.fillRect(innX, innY, innW, innH);
    g.lineStyle(2, 0x4a3c28, 1);
    g.strokeRect(innX, innY, innW, innH);
    // Roof
    g.fillStyle(0x1e1610, 1);
    g.fillTriangle(innX - 14, innY, innX + innW / 2, innY - 52, innX + innW + 14, innY);
    g.lineStyle(2, 0x3a2e1e, 1);
    g.strokeTriangle(innX - 14, innY, innX + innW / 2, innY - 52, innX + innW + 14, innY);
    // Chimney
    g.fillStyle(0x1a1410, 1);
    g.fillRect(innX + innW * 0.68, innY - 76, 18, 46);
    g.lineStyle(1, 0x2e2418, 1);
    g.strokeRect(innX + innW * 0.68, innY - 76, 18, 46);
    // Chimney smoke
    g.fillStyle(0x3a3430, 0.35);
    g.fillEllipse(innX + innW * 0.68 + 9, innY - 88, 14, 12);
    g.fillEllipse(innX + innW * 0.68 + 14, innY - 104, 18, 14);
    // Doorway (arched)
    g.fillStyle(0x100c08, 1);
    g.fillRect(innX + innW * 0.35, innY + innH - 86, 48, 86);
    g.fillEllipse(innX + innW * 0.35 + 24, innY + innH - 86, 48, 36);
    g.lineStyle(2, 0x3a2c1c, 1);
    g.strokeRect(innX + innW * 0.35, innY + innH - 86, 48, 86);
    // Door frame detail
    g.lineStyle(1, 0x4a3c28, 0.7);
    g.strokeEllipse(innX + innW * 0.35 + 24, innY + innH - 86, 48, 36);
    // Windows
    this._drawWindow(g, innX + 18, innY + 28, 44, 54);
    this._drawWindow(g, innX + innW - 62, innY + 28, 44, 54);
    this._drawWindow(g, innX + 18, innY + innH * 0.45, 38, 46);
    this._drawWindow(g, innX + innW - 56, innY + innH * 0.45, 38, 46);
    // Warm light from windows
    g.fillStyle(0xd08020, 0.12);
    g.fillRect(innX + 18, innY + 28, 44, 54);
    g.fillRect(innX + innW - 62, innY + 28, 44, 54);

    // Inn sign — "The Rusty Plow"
    const sx = innX + innW * 0.5 - 58, sy = innY + innH * 0.12;
    g.fillStyle(0x3a2a14, 1);
    g.fillRect(sx, sy, 116, 34);
    g.lineStyle(1.5, 0xc8956c, 0.85);
    g.strokeRect(sx, sy, 116, 34);
    // Hanging chains
    g.lineStyle(1, 0x6a5a38, 1);
    g.lineBetween(sx + 20, sy, sx + 20, sy - 14);
    g.lineBetween(sx + 96, sy, sx + 96, sy - 14);
    // Mug icon (simple drawn)
    g.fillStyle(0xc8956c, 0.8);
    g.fillRect(sx + 6, sy + 8, 16, 18);
    g.fillRect(sx + 22, sy + 11, 5, 10);  // handle
    g.lineStyle(1, 0x8a6030, 1);
    g.strokeRect(sx + 6, sy + 8, 16, 18);
    this.add.text(sx + 34, sy + 17, 'The Rusty Plow', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#e8c87a', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(6);

    // ─ General Store (right side) ─
    const stX = W * 0.64, stY = WH * 0.22, stW = W * 0.22, stH = WH * 0.48;
    g.fillStyle(0x24201a, 1);
    g.fillRect(stX, stY, stW, stH);
    g.lineStyle(2, 0x3e3428, 1);
    g.strokeRect(stX, stY, stW, stH);
    // Roof (flat with parapet)
    g.fillStyle(0x1c1810, 1);
    g.fillRect(stX - 8, stY - 14, stW + 16, 18);
    g.lineStyle(2, 0x3a3020, 1);
    g.strokeRect(stX - 8, stY - 14, stW + 16, 18);
    // Awning
    g.fillStyle(0x4a2a0e, 1);
    g.fillRect(stX - 4, stY + stH - 65, stW + 8, 18);
    g.lineStyle(1, 0x8a5a28, 1);
    g.strokeRect(stX - 4, stY + stH - 65, stW + 8, 18);
    // Awning fringe
    for (let fx = stX; fx < stX + stW; fx += 12) {
      g.fillStyle(0x7a4a1e, 1);
      g.fillTriangle(fx, stY + stH - 47, fx + 6, stY + stH - 38, fx + 12, stY + stH - 47);
    }
    // Store windows
    this._drawWindow(g, stX + 12, stY + 22, 52, 62);
    this._drawWindow(g, stX + stW - 64, stY + 22, 52, 62);
    // Store door
    g.fillStyle(0x160e08, 1);
    g.fillRect(stX + stW / 2 - 18, stY + stH - 64, 36, 64);
    g.lineStyle(1.5, 0x4a3828, 1);
    g.strokeRect(stX + stW / 2 - 18, stY + stH - 64, 36, 64);
    // Store sign
    const ssx = stX + 14, ssy = stY + 4;
    g.fillStyle(0x2a1e10, 1);
    g.fillRect(ssx, ssy, stW - 28, 24);
    g.lineStyle(1, 0x8a6030, 0.7);
    g.strokeRect(ssx, ssy, stW - 28, 24);
    this.add.text(stX + stW / 2, ssy + 12, 'General Store', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#b89860',
    }).setOrigin(0.5).setDepth(6);

    // ─ Blacksmith (center-back, smaller, recessed) ─
    const bsX = W * 0.38, bsY = WH * 0.14, bsW = W * 0.17, bsH = WH * 0.38;
    g.fillStyle(0x1e1a14, 1);
    g.fillRect(bsX, bsY, bsW, bsH);
    g.lineStyle(2, 0x382e20, 1);
    g.strokeRect(bsX, bsY, bsW, bsH);
    // Forge glow through opening
    g.fillStyle(0xe04010, 0.15);
    g.fillRect(bsX + bsW * 0.2, bsY + bsH * 0.4, bsW * 0.6, bsH * 0.5);
    // Wide open forge entry
    g.fillStyle(0x0e0a06, 1);
    g.fillRect(bsX + bsW * 0.2, bsY + bsH * 0.3, bsW * 0.6, bsH * 0.7);
    // Hammer on wall silhouette
    g.fillStyle(0x4a3820, 0.5);
    g.fillRect(bsX + 8, bsY + 24, 6, 28);
    g.fillRect(bsX + 4, bsY + 20, 14, 10);
    // Anvil silhouette in forge opening
    g.fillStyle(0x2a2010, 0.7);
    g.fillRect(bsX + bsW * 0.34, bsY + bsH * 0.68, bsW * 0.3, 12);
    g.fillRect(bsX + bsW * 0.38, bsY + bsH * 0.7, bsW * 0.22, 18);
    // Blacksmith label
    this.add.text(bsX + bsW / 2, bsY + 10, 'Smithy', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#6a5030', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(6);
  }

  _drawWindow(g, x, y, w, h) {
    // Frame
    g.fillStyle(0x1a1410, 1);
    g.fillRect(x, y, w, h);
    g.lineStyle(1.5, 0x4a3c28, 1);
    g.strokeRect(x, y, w, h);
    // Cross-pane
    g.lineStyle(1, 0x3a2e1e, 1);
    g.lineBetween(x + w / 2, y, x + w / 2, y + h);
    g.lineBetween(x, y + h / 2, x + w, y + h / 2);
  }

  // ── Ground / cobblestones ─────────────────────────────────

  _drawGround(W, WH) {
    const g = this.add.graphics();
    // Base ground
    g.fillStyle(0x1e1c18, 1);
    g.fillRect(0, WH * 0.65, W, WH * 0.35);
    g.lineStyle(1, 0x2a2820, 1);
    g.lineBetween(0, WH * 0.65, W, WH * 0.65);

    // Cobblestone pattern
    g.lineStyle(0.5, 0x28261e, 0.55);
    const rows = 7;
    const rowH = (WH * 0.35) / rows;
    for (let r = 0; r < rows; r++) {
      const y    = WH * 0.65 + r * rowH;
      const cols = Math.round(W / (40 + r * 4));
      const colW = W / cols;
      const offset = (r % 2 === 0) ? 0 : colW / 2;
      for (let c = 0; c < cols + 1; c++) {
        const cx = c * colW - offset;
        g.fillStyle(0x1e1c18 + (((r + c) % 3) * 0x020200), 1);
        g.fillRoundedRect(cx + 1, y + 1, colW - 2, rowH - 2, 1);
        g.strokeRoundedRect(cx + 1, y + 1, colW - 2, rowH - 2, 1);
      }
    }
  }

  // ── Market Stalls (sparse/closed) ────────────────────────

  _drawMarketStalls(W, WH) {
    const g = this.add.graphics().setDepth(4);
    // A couple of closed/empty stalls in the middle of the square
    const stalls = [
      { x: W * 0.26, y: WH * 0.62, w: 88, h: 52 },
      { x: W * 0.42, y: WH * 0.60, w: 104, h: 52 },
    ];
    stalls.forEach(s => {
      // Frame posts
      g.fillStyle(0x2a2018, 1);
      g.fillRect(s.x, s.y - 24, 6, 76);
      g.fillRect(s.x + s.w - 6, s.y - 24, 6, 76);
      // Faded awning
      g.fillStyle(0x382a1a, 0.85);
      g.fillRect(s.x - 4, s.y - 24, s.w + 8, 16);
      g.lineStyle(1, 0x5a4228, 0.6);
      g.strokeRect(s.x - 4, s.y - 24, s.w + 8, 16);
      // Counter
      g.fillStyle(0x241c14, 1);
      g.fillRect(s.x, s.y - 2, s.w, 8);
      // Empty surface
      g.fillStyle(0x1c1610, 0.9);
      g.fillRect(s.x, s.y + 6, s.w, s.h - 8);
      g.lineStyle(1, 0x3a2c1c, 0.5);
      g.strokeRect(s.x, s.y + 6, s.w, s.h - 8);
      // "Closed" cloth draped
      g.fillStyle(0x2e2218, 0.6);
      g.fillTriangle(s.x + s.w * 0.2, s.y + 6, s.x + s.w * 0.5, s.y + 26, s.x + s.w * 0.8, s.y + 6);
    });
  }

  // ── Thornwood Gate ────────────────────────────────────────

  _drawThornwoodGate(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const gX = W * 0.80, gY = WH * 0.22, gW = W * 0.18, gH = WH * 0.58;

    // Ominous dark trees behind gate
    g.fillStyle(0x080a0e, 1);
    for (let tx = gX - 14; tx < W + 20; tx += 18) {
      const th = Phaser.Math.Between(70, 150);
      const tw = Phaser.Math.Between(14, 24);
      g.fillTriangle(tx, gY - th + 30, tx - tw / 2, gY + gH * 0.7, tx + tw / 2, gY + gH * 0.7);
    }
    // Misty dark overlay behind gate
    g.fillStyle(0x0a0c12, 0.6);
    g.fillRect(gX - 10, gY, gW + 10, gH);

    // Gate pillars
    const pillarW = 20;
    g.fillStyle(0x2a2820, 1);
    g.fillRect(gX - pillarW / 2, gY, pillarW, gH);
    g.fillRect(gX + gW - pillarW / 2, gY, pillarW, gH);
    g.lineStyle(2, 0x4a4838, 1);
    g.strokeRect(gX - pillarW / 2, gY, pillarW, gH);
    g.strokeRect(gX + gW - pillarW / 2, gY, pillarW, gH);
    // Pillar caps
    g.fillStyle(0x3a3830, 1);
    g.fillRect(gX - pillarW / 2 - 4, gY - 14, pillarW + 8, 14);
    g.fillRect(gX + gW - pillarW / 2 - 4, gY - 14, pillarW + 8, 14);

    // Gate doors (wooden planks, dark)
    const gateL = gX + pillarW / 2, gateR = gX + gW - pillarW / 2;
    const gMid  = (gateL + gateR) / 2;
    // Left door
    g.fillStyle(0x1e1c14, 1);
    g.fillRect(gateL, gY + 4, gMid - gateL, gH - 8);
    // Right door
    g.fillRect(gMid, gY + 4, gateR - gMid, gH - 8);
    // Plank lines on doors
    g.lineStyle(1, 0x2e2c22, 0.8);
    for (let gy = gY + 24; gy < gY + gH - 8; gy += 22) {
      g.lineBetween(gateL, gy, gMid - 2, gy);
      g.lineBetween(gMid + 2, gy, gateR, gy);
    }
    // Iron banding
    g.fillStyle(0x1a1c1a, 1);
    [gY + gH * 0.2, gY + gH * 0.5, gY + gH * 0.78].forEach(by => {
      g.fillRect(gateL, by, gMid - gateL, 6);
      g.fillRect(gMid, by, gateR - gMid, 6);
      g.lineStyle(1, 0x2e3230, 1);
      g.strokeRect(gateL, by, gMid - gateL, 6);
      g.strokeRect(gMid, by, gateR - gMid, 6);
    });

    // Iron chains (dramatic X across the gate)
    g.lineStyle(5, 0x242624, 1);
    g.lineBetween(gateL, gY + gH * 0.1, gateR, gY + gH * 0.85);
    g.lineBetween(gateR, gY + gH * 0.1, gateL, gY + gH * 0.85);
    // Chain link highlights
    g.lineStyle(2, 0x3a3e38, 0.7);
    g.lineBetween(gateL + 2, gY + gH * 0.1 + 2, gateR - 2, gY + gH * 0.85 - 2);
    g.lineBetween(gateR - 2, gY + gH * 0.1 + 2, gateL + 2, gY + gH * 0.85 - 2);
    // Chain padlock
    g.fillStyle(0x2a2e28, 1);
    g.fillRect(gMid - 14, gY + gH * 0.46, 28, 20);
    g.lineStyle(2, 0x4a5048, 1);
    g.strokeRect(gMid - 14, gY + gH * 0.46, 28, 20);
    g.lineStyle(3, 0x3a3e38, 1);
    g.strokeCircle(gMid, gY + gH * 0.46 - 4, 10);

    // Sign on gate
    const signX = gMid - 68, signY = gY + gH * 0.15;
    g.fillStyle(0x1c1a12, 1);
    g.fillRect(signX, signY, 136, 44);
    g.lineStyle(1.5, 0xc8956c, 0.5);
    g.strokeRect(signX, signY, 136, 44);
    // Sign nails
    g.fillStyle(0x4a4838, 1);
    g.fillCircle(signX + 6, signY + 6, 3);
    g.fillCircle(signX + 130, signY + 6, 3);
    g.fillCircle(signX + 6, signY + 38, 3);
    g.fillCircle(signX + 130, signY + 38, 3);
    this.add.text(gMid, signY + 12, 'THORNWOOD CLOSED', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#c85050', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(7);
    this.add.text(gMid, signY + 30, 'Witch business. Do not inquire.', {
      fontFamily: 'Georgia, serif', fontSize: '8px', color: '#7a6040', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(7);

    // ── "Thornwood Unlocked" visual overlay (drawn but hidden) ──
    // Will be shown by _checkThornwoodState
    this._thornwoodGateOpen = this.add.graphics().setDepth(6).setVisible(false);
    const tg = this._thornwoodGateOpen;
    tg.lineStyle(2, 0x40c060, 0.6);
    tg.strokeRect(gX - pillarW, gY - 16, gW + pillarW * 2, gH + 20);
    tg.fillStyle(0x204030, 0.12);
    tg.fillRect(gX - pillarW, gY - 16, gW + pillarW * 2, gH + 20);

    // Store gate bounds for hotspot
    this._gateX  = gX;
    this._gateY  = gY;
    this._gateW  = gW;
    this._gateH  = gH;
  }

  // ── Notice Board ─────────────────────────────────────────

  _drawNoticeBoard(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const bX = W * 0.73, bY = WH * 0.52, bW = 88, bH = 68;
    // Post
    g.fillStyle(0x2a2018, 1);
    g.fillRect(bX + bW / 2 - 5, bY, 10, WH * 0.35 + 10);
    // Board
    g.fillStyle(0x2e2418, 1);
    g.fillRect(bX, bY, bW, bH);
    g.lineStyle(2, 0x5a4428, 1);
    g.strokeRect(bX, bY, bW, bH);
    // Tacked paper
    g.fillStyle(0xe8dcc0, 0.88);
    g.fillRect(bX + 6, bY + 6, bW - 12, bH - 12);
    // Text lines on notice (suggestion)
    g.lineStyle(1, 0x7a6840, 0.5);
    for (let nl = 0; nl < 5; nl++) {
      g.lineBetween(bX + 10, bY + 16 + nl * 10, bX + bW - 10, bY + 16 + nl * 10);
    }
    // Tack pins
    g.fillStyle(0xc85050, 0.9);
    g.fillCircle(bX + 12, bY + 10, 3);
    g.fillCircle(bX + bW - 12, bY + 10, 3);
    // Label
    this.add.text(bX + bW / 2, bY - 10, 'Notice Board', {
      fontFamily: 'Georgia, serif', fontSize: '8px', color: '#5a4828', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(7);

    this._noticeBoardX = bX;
    this._noticeBoardY = bY;
    this._noticeBoardW = bW;
    this._noticeBoardH = bH;
  }

  // ── Bram the Innkeeper ────────────────────────────────────

  _drawBram(W, WH) {
    const g  = this.add.graphics().setDepth(8);
    const bx = W * 0.16, by = WH * 0.58;

    // Apron/body (stocky, innkeeper build)
    g.fillStyle(0x3a3020, 1);
    g.fillTriangle(bx, by, bx - 22, by + 82, bx + 22, by + 82);
    // Apron front
    g.fillStyle(0xc8a870, 0.55);
    g.fillTriangle(bx, by + 18, bx - 12, by + 82, bx + 12, by + 82);
    // Legs
    g.fillStyle(0x2a2218, 1);
    g.fillRect(bx - 14, by + 82, 12, 22);
    g.fillRect(bx + 2, by + 82, 12, 22);
    // Boots
    g.fillStyle(0x1a1208, 1);
    g.fillRect(bx - 16, by + 100, 14, 8);
    g.fillRect(bx + 0, by + 100, 14, 8);
    // Head
    g.fillStyle(0xc89070, 1);
    g.fillCircle(bx, by - 16, 18);
    // Grey hair
    g.fillStyle(0x8a8880, 1);
    g.fillEllipse(bx, by - 28, 36, 18);
    g.fillRect(bx - 18, by - 28, 4, 16);
    g.fillRect(bx + 14, by - 28, 4, 16);
    // Mustache
    g.fillStyle(0x7a7068, 1);
    g.fillEllipse(bx - 6, by - 6, 12, 5);
    g.fillEllipse(bx + 6, by - 6, 12, 5);
    // Arms (watching the gate with arms crossed)
    g.fillStyle(0x3a3020, 1);
    g.fillRect(bx - 22, by + 22, 18, 8);
    g.fillRect(bx + 4, by + 22, 18, 8);
    // Hand gestures over crossed arms
    g.fillStyle(0xc89070, 1);
    g.fillCircle(bx - 18, by + 26, 5);
    g.fillCircle(bx + 22, by + 26, 5);

    // Subtle idle sway
    this.tweens.add({
      targets: g, y: { from: 0, to: -3 },
      duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this._bramX = bx;
    this._bramY = by;
  }

  // ── Path arrows (exit indicators) ─────────────────────────

  _drawPathArrows(W, WH) {
    const g = this.add.graphics().setDepth(6);

    // South Shore path (bottom-right) → WayneShackScene
    const sX = W - 60, sY = WH - 38;
    g.fillStyle(0x3a3028, 0.85);
    g.fillRoundedRect(sX - 48, sY - 16, 100, 32, 4);
    g.lineStyle(1, 0xc8956c, 0.5);
    g.strokeRoundedRect(sX - 48, sY - 16, 100, 32, 4);
    this.add.text(sX - 10, sY, '▶ South Shore', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#c8a870', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);

    // Harbor path (bottom-left) → EdwardFarrisScene
    const hX = 16, hY = WH - 38;
    g.fillStyle(0x3a3028, 0.85);
    g.fillRoundedRect(hX - 4, hY - 16, 104, 32, 4);
    g.lineStyle(1, 0xc8956c, 0.5);
    g.strokeRoundedRect(hX - 4, hY - 16, 104, 32, 4);
    this.add.text(hX + 8, hY, '◀ Harbor', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#c8a870', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);

    this._southArrowBounds = { x: sX - 48, y: sY - 16, w: 100, h: 32 };
    this._harborArrowBounds = { x: hX - 4, y: hY - 16, w: 104, h: 32 };
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Bram ─────────────────────────────────────────────────
    this._addHotspot({
      id: 'bram', name: 'Bram (Innkeeper)',
      x: this._bramX, y: this._bramY + 40, w: 60, h: 100,
      look: () => this._narrate("The innkeeper watches the gate with the expression of a man who has given up being surprised."),
      talk: () => this._talkToBram(),
      take: () => this._narrate("You cannot take the innkeeper. He would resist."),
      use:  () => this._narrate("Bram is not a tool. He is a man. A tired man."),
    });

    // ── Thornwood Gate ────────────────────────────────────────
    this._addHotspot({
      id: 'thornwood_gate', name: 'Thornwood Gate',
      x: this._gateX + this._gateW / 2, y: this._gateY + this._gateH / 2,
      w: this._gateW + 20, h: this._gateH + 20,
      look: () => {
        if (GameState.getFlag('thornwood_unlocked')) {
          this._narrate("The gate stands open. The dark trees beyond are still ominous, but passable.");
        } else {
          this._narrate("The gate is sealed with iron chains. A sign reads: 'THORNWOOD CLOSED. Witch business. Do not inquire.'");
        }
      },
      talk: () => this._narrate("The gate says nothing. The sign says enough."),
      take: () => this._narrate("The chains are iron and thick and entirely unmoving."),
      use:  () => {
        if (GameState.getFlag('thornwood_unlocked')) {
          this._transitionToThornwood();
        } else {
          this._narrate("The chains are iron and thick and entirely unmoving.");
        }
      },
    });

    // ── Notice Board ──────────────────────────────────────────
    this._addHotspot({
      id: 'notice_board', name: 'Notice Board',
      x: this._noticeBoardX + this._noticeBoardW / 2,
      y: this._noticeBoardY + this._noticeBoardH / 2,
      w: this._noticeBoardW, h: this._noticeBoardH + 60,
      look: () => this._play([
        { speaker: 'cambrie', text: "The notice reads: 'By order of Harbor Master Farris, the harbor remains closed pending inspection of the wreck of the Sable Dawn.'" },
        { speaker: 'cambrie', text: "'Those seeking passage to the Isle of Tides must obtain a Harbor Pass from the Harbor Master's office.'" },
        { speaker: 'cambrie', text: "And at the bottom, in different handwriting: 'The Tide King accepts petitioners at the shrine on the third pool. Bring something worth his time.'" },
        { speaker: 'mackenzie', text: "The Tide King. I've heard of that name. Old. Powerful. What does a sea god want with us?" },
      ]),
      talk: () => this._narrate("Notice boards are designed to be read, not conversed with."),
      take: () => this._narrate("Removing the notice would make Harbor Master Farris very displeased."),
      use:  () => this._narrate("The board has already communicated everything it has to communicate."),
    });

    // ── South Shore path ──────────────────────────────────────
    const sb = this._southArrowBounds;
    this._addHotspot({
      id: 'south_shore', name: 'South Shore Path',
      x: sb.x + sb.w / 2, y: sb.y + sb.h / 2, w: sb.w, h: sb.h,
      look: () => this._narrate("A sandy path leads south toward the shore. You can smell the ocean from here."),
      talk: () => this._narrate("The path doesn't talk. It leads."),
      take: () => this._narrate("You cannot take a path."),
      use:  () => this._goTo('WayneShackScene'),
    });

    // ── Harbor path ───────────────────────────────────────────
    const hb = this._harborArrowBounds;
    this._addHotspot({
      id: 'harbor_path', name: 'Harbor Path',
      x: hb.x + hb.w / 2, y: hb.y + hb.h / 2, w: hb.w, h: hb.h,
      look: () => this._narrate("The harbor road leads west. You can hear the water, but not see it yet."),
      talk: () => this._narrate("The road says nothing useful."),
      take: () => this._narrate("No."),
      use:  () => this._goTo('EdwardFarrisScene'),
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
      outline.lineStyle(1.5, 0xc8956c, 0.35);
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

  // ── Bram dialogue logic ───────────────────────────────────

  _talkToBram() {
    if (!GameState.getFlag('bram_first_done')) {
      GameState.setFlag('bram_first_done');
      this._play(DIALOGUE_BRAM_FIRST, () => {
        if (!GameState.getFlag('bram_harbor_talked')) {
          GameState.setFlag('bram_harbor_talked');
          this.time.delayedCall(200, () => this._play(DIALOGUE_BRAM_HARBOR));
        }
      });
    } else if (!GameState.getFlag('bram_harbor_talked')) {
      GameState.setFlag('bram_harbor_talked');
      this._play(DIALOGUE_BRAM_HARBOR);
    } else {
      this._play(DIALOGUE_BRAM_REPEAT);
    }
  }

  // ── State checks ─────────────────────────────────────────

  _checkThornwoodState() {
    // Thornwood unlocks if player has the witch's token OR the flag is explicitly set
    const unlocked = GameState.getFlag('thornwood_unlocked') ||
                     GameState.hasItem('witch_riddle_answer');
    if (unlocked) {
      GameState.setFlag('thornwood_unlocked');
      if (this._thornwoodGateOpen) this._thornwoodGateOpen.setVisible(true);
      this.setStatus("The Thornwood gate stands open.");
    }

    // Ready-for-thornwood flag
    if (GameState.hasItem('harbor_pass') &&
        GameState.hasItem('ships_manifest') &&
        GameState.hasItem('wayne_coins')) {
      GameState.setFlag('ready_for_thornwood');
    }
  }

  // ── Transitions ───────────────────────────────────────────

  _transitionToThornwood() {
    this._play([
      { speaker: 'mackenzie', text: "The chains are loose. Someone — or something — unlocked this gate." },
      { speaker: 'cambrie', text: "Then we go in. Ready?" },
      { speaker: 'mackenzie', text: "No. Let's go anyway." },
    ], () => {
      this._goTo('ThornwoodScene');
    });
  }

  _goTo(scene) {
    this._locked = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start(scene));
  }

  // ── Helpers ──────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }
  _narrate(text)          { this._play([{ speaker: 'narrator', text }]); }

  update() { if (this.dialogue) this.dialogue.update(); }
}
