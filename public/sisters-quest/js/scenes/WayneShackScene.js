// ============================================================
// scenes/WayneShackScene.js — Sisters' Quest: The Moonveil Crown
// South Shore Beach — Wayne Havasu's Shack
// Late afternoon, warm orange light, ocean horizon.
// ============================================================

class WayneShackScene extends BaseScene {
  constructor() { super({ key: 'WayneShackScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('WayneShackScene');

    // ── Camera ────────────────────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Scene label ───────────────────────────────────────────
    this.add.text(W / 2, 18, 'South Shore  ·  Wayne\'s Beach Shack', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#4a3820', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── World ─────────────────────────────────────────────────
    this._drawSky(W, WH);
    this._drawOcean(W, WH);
    this._drawBeach(W, WH);
    this._drawShack(W, WH);
    this._drawSurfboards(W, WH);
    this._drawFirePit(W, WH);
    this._drawDockAndBoat(W, WH);
    this._drawWayne(W, WH);
    this._drawJennibelle(W, WH);
    this._drawReturnArrow(W, WH);

    // ── Ocean wave animation ───────────────────────────────────
    this._waveOffset = 0;
    this._waveGraphics = this.add.graphics().setDepth(3);
    this._drawWaveLayer(W, WH);

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
      this._refreshJennibelle();
    });

    // ── Hotspots ──────────────────────────────────────────────
    this._buildHotspots(W, WH);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // ── Show Jennibelle if already appeared ───────────────────
    this._refreshJennibelle();
  }

  // ── Sky (sunset / late afternoon) ────────────────────────

  _drawSky(W, WH) {
    const g = this.add.graphics();
    // Orange-pink-purple sunset gradient
    g.fillGradientStyle(0x1a1028, 0x1a1028, 0xe07a30, 0xe07a30, 1);
    g.fillRect(0, 0, W, WH * 0.48);
    // Lighter band at horizon
    g.fillGradientStyle(0xe07a30, 0xe07a30, 0xf0a060, 0xf0a060, 1);
    g.fillRect(0, WH * 0.28, W, WH * 0.20);

    // Silhouetted birds
    g.lineStyle(1.5, 0x1a1028, 0.55);
    const birds = [
      { x: W * 0.15, y: WH * 0.08 },
      { x: W * 0.22, y: WH * 0.06 },
      { x: W * 0.55, y: WH * 0.11 },
      { x: W * 0.62, y: WH * 0.09 },
      { x: W * 0.80, y: WH * 0.13 },
    ];
    birds.forEach(b => {
      g.lineBetween(b.x - 8, b.y, b.x, b.y - 5);
      g.lineBetween(b.x, b.y - 5, b.x + 8, b.y);
    });

    // Sun disk low on horizon
    g.fillStyle(0xffe870, 0.85);
    g.fillCircle(W * 0.68, WH * 0.38, 34);
    g.fillStyle(0xffcc40, 0.4);
    g.fillCircle(W * 0.68, WH * 0.38, 44);
    g.fillStyle(0xff9020, 0.18);
    g.fillCircle(W * 0.68, WH * 0.38, 62);
    // Sun reflection on water (painted later over ocean)

    // Clouds catching the light
    g.fillStyle(0xe06030, 0.45);
    g.fillEllipse(W * 0.12, WH * 0.10, 180, 38);
    g.fillEllipse(W * 0.38, WH * 0.06, 220, 32);
    g.fillStyle(0xf08050, 0.35);
    g.fillEllipse(W * 0.70, WH * 0.04, 160, 28);
    g.fillStyle(0x8040a0, 0.3);
    g.fillEllipse(W * 0.86, WH * 0.12, 200, 40);
  }

  // ── Ocean ─────────────────────────────────────────────────

  _drawOcean(W, WH) {
    const g = this.add.graphics().setDepth(1);
    // Horizon to mid-scene: dark blue-green banded water
    const horizonY = WH * 0.48;
    const waterH   = WH * 0.22;

    // Base water bands
    const bands = [
      { y: 0,             h: waterH * 0.25, c: 0x1a3040 },
      { y: waterH * 0.25, h: waterH * 0.20, c: 0x1e3848 },
      { y: waterH * 0.45, h: waterH * 0.20, c: 0x224050 },
      { y: waterH * 0.65, h: waterH * 0.20, c: 0x254858 },
      { y: waterH * 0.85, h: waterH * 0.15, c: 0x285060 },
    ];
    bands.forEach(b => {
      g.fillStyle(b.c, 1);
      g.fillRect(0, horizonY + b.y, W, b.h);
    });

    // Sun reflection on water
    g.fillStyle(0xf0a030, 0.22);
    g.fillRect(W * 0.5, horizonY, W * 0.38, waterH * 0.6);

    // Horizon line shimmer
    g.lineStyle(1, 0x6090a0, 0.4);
    g.lineBetween(0, horizonY, W, horizonY);
  }

  // ── Beach (sandy shore) ───────────────────────────────────

  _drawBeach(W, WH) {
    const g = this.add.graphics().setDepth(2);
    const beachY = WH * 0.62;

    // Main sand area
    g.fillGradientStyle(0xc8a868, 0xc8a868, 0xe8c888, 0xe8c888, 1);
    g.fillRect(0, beachY, W, WH - beachY);

    // Wet sand near water line (darker, reflective)
    g.fillStyle(0x9a7a48, 0.7);
    g.fillRect(0, WH * 0.70, W, WH * 0.03);

    // Sand texture: fine grain dots/lines
    g.lineStyle(0.5, 0xb89858, 0.3);
    for (let sy = beachY + 8; sy < WH; sy += 14) {
      for (let sx = 0; sx < W; sx += 36) {
        const wx = sx + Phaser.Math.Between(-8, 8);
        g.lineBetween(wx, sy, wx + Phaser.Math.Between(10, 28), sy);
      }
    }

    // Scattered shells / pebbles
    g.fillStyle(0xf0e8d0, 0.65);
    const shells = [
      [W * 0.31, beachY + 18, 4, 2], [W * 0.48, beachY + 32, 3, 2],
      [W * 0.52, beachY + 14, 4, 3], [W * 0.65, beachY + 28, 5, 2],
      [W * 0.70, beachY + 8, 3, 3],  [W * 0.44, beachY + 50, 4, 2],
    ];
    shells.forEach(s => g.fillEllipse(s[0], s[1], s[2], s[3]));

    // Tide-line seaweed (dark green wisps)
    g.lineStyle(1, 0x2a5030, 0.5);
    const seaweed = [[W * 0.35, WH * 0.68], [W * 0.55, WH * 0.69], [W * 0.72, WH * 0.70]];
    seaweed.forEach(s => {
      g.lineBetween(s[0] - 14, s[1], s[0] + 14, s[1] + 2);
      g.lineBetween(s[0] - 8, s[1] - 2, s[0] + 8, s[1]);
    });
  }

  // ── Wave animation layer ──────────────────────────────────

  _drawWaveLayer(W, WH) {
    const g = this._waveGraphics;
    g.clear();
    const waveY = WH * 0.69;
    g.lineStyle(1.5, 0x80b8c8, 0.35);
    for (let i = 0; i < 3; i++) {
      const y = waveY + i * 8;
      g.beginPath();
      for (let x = 0; x <= W; x += 18) {
        const wy = y + Math.sin((x + this._waveOffset + i * 40) * 0.04) * 4;
        if (x === 0) g.moveTo(x, wy); else g.lineTo(x, wy);
      }
      g.strokePath();
    }
    // White foam fringe
    g.lineStyle(1, 0xd8e8ec, 0.25);
    g.beginPath();
    for (let x = 0; x <= W; x += 12) {
      const wy = waveY + Math.sin((x + this._waveOffset) * 0.05) * 3;
      if (x === 0) g.moveTo(x, wy); else g.lineTo(x, wy);
    }
    g.strokePath();
  }

  // ── Shack ─────────────────────────────────────────────────

  _drawShack(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const sX = W * 0.04, sY = WH * 0.40, sW = W * 0.30, sH = WH * 0.32;

    // Porch shadow
    g.fillStyle(0x0c0a06, 0.4);
    g.fillRect(sX - 8, sY + sH - 2, sW + 16, 12);

    // Shack walls (weathered boards — staggered plank effect)
    g.fillStyle(0x5a4228, 1);
    g.fillRect(sX, sY, sW, sH);
    // Board lines
    g.lineStyle(1, 0x3e2e18, 0.8);
    for (let py = sY + 14; py < sY + sH; py += 18) {
      g.lineBetween(sX, py, sX + sW, py);
    }
    // Board vertical seams (staggered — two offset rows)
    g.lineStyle(0.5, 0x2e2010, 0.5);
    for (let r = 0; r < 2; r++) {
      const startSeam = sX + 11 + r * 11;
      const startY    = sY + (r === 0 ? 0 : 9);
      for (let s = startSeam; s < sX + sW; s += 22) {
        g.lineBetween(s, startY, s, sY + sH);
      }
    }

    // Wall outline
    g.lineStyle(2, 0x2e2010, 1);
    g.strokeRect(sX, sY, sW, sH);

    // Roof (overhanging, angled)
    g.fillStyle(0x3a2410, 1);
    g.fillTriangle(sX - 18, sY, sX + sW / 2, sY - 58, sX + sW + 18, sY);
    g.lineStyle(2, 0x2a1a08, 1);
    g.strokeTriangle(sX - 18, sY, sX + sW / 2, sY - 58, sX + sW + 18, sY);
    // Shingles on roof (lines)
    g.lineStyle(1, 0x2a1a08, 0.6);
    for (let rl = 1; rl <= 6; rl++) {
      const t  = rl / 7;
      const ry = sY - 58 + 58 * t;
      const rw = (sW + 36) * t;
      g.lineBetween(sX + sW / 2 - rw / 2, ry, sX + sW / 2 + rw / 2, ry);
    }

    // Porch posts
    g.fillStyle(0x4a3220, 1);
    g.fillRect(sX + 8, sY + sH - 48, 10, 48);
    g.fillRect(sX + sW - 18, sY + sH - 48, 10, 48);
    g.fillRect(sX, sY + sH, sW, 6); // porch floor edge

    // Front door (left of center)
    g.fillStyle(0x2a1a0c, 1);
    g.fillRect(sX + sW * 0.52, sY + sH - 72, 38, 72);
    g.lineStyle(1.5, 0x5a4228, 1);
    g.strokeRect(sX + sW * 0.52, sY + sH - 72, 38, 72);
    g.fillStyle(0xc8956c, 0.9);
    g.fillCircle(sX + sW * 0.52 + 32, sY + sH - 34, 3);

    // Shack window (left)
    g.fillStyle(0x1a2830, 1);
    g.fillRect(sX + sW * 0.10, sY + sH * 0.14, 54, 44);
    g.lineStyle(1.5, 0x5a4228, 1);
    g.strokeRect(sX + sW * 0.10, sY + sH * 0.14, 54, 44);
    g.lineStyle(1, 0x3a3010, 1);
    g.lineBetween(sX + sW * 0.10 + 27, sY + sH * 0.14, sX + sW * 0.10 + 27, sY + sH * 0.14 + 44);
    g.lineBetween(sX + sW * 0.10, sY + sH * 0.14 + 22, sX + sW * 0.10 + 54, sY + sH * 0.14 + 22);
    // Warm light in window
    g.fillStyle(0xe07820, 0.18);
    g.fillRect(sX + sW * 0.10, sY + sH * 0.14, 54, 44);

    // Fishing nets hanging off porch rail / wall
    const netX = sX + sW * 0.04, netY = sY + 22;
    g.lineStyle(1, 0x8a6840, 0.55);
    for (let nw = 0; nw < 3; nw++) {
      const nx = netX + nw * 24;
      for (let nh = 0; nh < 5; nh++) {
        g.lineBetween(nx, netY + nh * 12, nx + 18, netY + (nh + 1) * 12);
        g.lineBetween(nx + 18, netY + nh * 12, nx, netY + (nh + 1) * 12);
      }
      for (let nn = 0; nn <= 4; nn++) {
        g.lineBetween(nx, netY + nn * 12, nx + 18, netY + nn * 12);
      }
    }

    // Chair on porch (where Wayne sits)
    this._chairX = sX + sW + 22;
    this._chairY = WH * 0.65;
    const cX = this._chairX, cY = this._chairY;
    g.fillStyle(0x3a2a18, 1);
    // Seat
    g.fillRect(cX, cY, 42, 8);
    // Back
    g.fillRect(cX, cY - 38, 6, 38);
    g.fillRect(cX + 36, cY - 38, 6, 38);
    g.fillRect(cX, cY - 38, 42, 6);
    // Legs
    g.fillRect(cX + 2, cY + 8, 6, 22);
    g.fillRect(cX + 34, cY + 8, 6, 22);
    g.lineStyle(1, 0x5a4228, 0.8);
    g.strokeRect(cX, cY, 42, 8);

    // Cooler (beside chair)
    const coX = cX + 52;
    g.fillStyle(0x3c6080, 1);
    g.fillRect(coX, cY + 4, 36, 26);
    g.fillStyle(0x4a78a0, 1);
    g.fillRect(coX, cY + 4, 36, 6);
    g.lineStyle(1.5, 0x5090b8, 1);
    g.strokeRect(coX, cY + 4, 36, 26);
    this.add.text(coX + 18, cY + 20, 'ICE', {
      fontFamily: 'Georgia, serif', fontSize: '7px', color: '#a8c8e8',
    }).setOrigin(0.5).setDepth(7);
  }

  // ── Surfboards ────────────────────────────────────────────

  _drawSurfboards(W, WH) {
    const g = this.add.graphics().setDepth(6);
    const sX = W * 0.04;
    const sW = W * 0.30;

    // Board 1 (teal, leaning left against shack wall)
    const b1X = sX + sW * 0.02, b1Y = WH * 0.38;
    g.fillStyle(0x208080, 1);
    g.fillEllipse(b1X + 10, b1Y + 6, 20, 12);  // nose
    g.fillRect(b1X, b1Y + 6, 20, WH * 0.26);
    g.fillEllipse(b1X + 10, b1Y + WH * 0.26, 20, 10); // tail
    g.lineStyle(1.5, 0x106060, 1);
    g.strokeEllipse(b1X + 10, b1Y + 6, 20, 12);
    g.strokeRect(b1X, b1Y + 6, 20, WH * 0.26);
    // Fin
    g.fillStyle(0x106060, 1);
    g.fillTriangle(b1X + 18, b1Y + WH * 0.22, b1X + 28, b1Y + WH * 0.30, b1X + 18, b1Y + WH * 0.30);
    // Stripe
    g.lineStyle(2, 0x60d0c0, 0.6);
    g.lineBetween(b1X + 10, b1Y + 18, b1X + 10, b1Y + WH * 0.24);
    // Duct tape repair (crack detail)
    g.fillStyle(0x888888, 0.8);
    g.fillRect(b1X + 2, b1Y + WH * 0.14, 16, 5);

    // Board 2 (coral/orange, leaning slightly offset)
    const b2X = sX + sW * 0.06, b2Y = WH * 0.37;
    g.fillStyle(0xd05838, 1);
    g.fillEllipse(b2X + 10, b2Y + 6, 20, 12);
    g.fillRect(b2X, b2Y + 6, 20, WH * 0.28);
    g.fillEllipse(b2X + 10, b2Y + WH * 0.28, 20, 10);
    g.lineStyle(1.5, 0xa04028, 1);
    g.strokeEllipse(b2X + 10, b2Y + 6, 20, 12);
    g.strokeRect(b2X, b2Y + 6, 20, WH * 0.28);
    // Fin
    g.fillStyle(0xa04028, 1);
    g.fillTriangle(b2X + 18, b2Y + WH * 0.24, b2X + 28, b2Y + WH * 0.32, b2X + 18, b2Y + WH * 0.32);
    // Design stripe
    g.lineStyle(2, 0xf0a070, 0.7);
    g.lineBetween(b2X + 6, b2Y + 22, b2X + 14, b2Y + WH * 0.25);
    g.lineBetween(b2X + 14, b2Y + 22, b2X + 6, b2Y + WH * 0.25);

    this._surfboardsBounds = { x: sX, y: WH * 0.37, w: sX + sW * 0.14 + 30, h: WH * 0.30 };
  }

  // ── Fire Pit ──────────────────────────────────────────────

  _drawFirePit(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const fX = W * 0.38, fY = WH * 0.72;

    // Stone ring
    g.fillStyle(0x484038, 1);
    g.fillCircle(fX, fY, 28);
    g.lineStyle(2, 0x3a3028, 1);
    g.strokeCircle(fX, fY, 28);
    // Stones on ring
    for (let si = 0; si < 8; si++) {
      const sa = (si / 8) * Math.PI * 2;
      const sx = fX + Math.cos(sa) * 22, sy = fY + Math.sin(sa) * 22;
      g.fillStyle(0x5a5048 + (si * 0x010100), 1);
      g.fillEllipse(sx, sy, 12, 8);
    }
    // Embers
    g.fillStyle(0x381008, 1);
    g.fillCircle(fX, fY, 18);
    // Flames
    g.fillStyle(0xd04010, 0.8);
    g.fillTriangle(fX - 14, fY, fX - 2, fY - 28, fX + 8, fY);
    g.fillStyle(0xe06018, 0.75);
    g.fillTriangle(fX - 6, fY, fX + 4, fY - 36, fX + 16, fY);
    g.fillStyle(0xf09030, 0.65);
    g.fillTriangle(fX - 4, fY, fX + 6, fY - 22, fX + 14, fY);
    g.fillStyle(0xffe060, 0.45);
    g.fillTriangle(fX - 2, fY, fX + 4, fY - 14, fX + 10, fY);

    // Grill/spit over fire
    g.lineStyle(2, 0x4a4038, 1);
    g.lineBetween(fX - 30, fY - 8, fX + 30, fY - 8);
    // Fish on grill (simplified)
    g.fillStyle(0xc08040, 1);
    g.fillEllipse(fX - 8, fY - 12, 30, 9);
    g.fillStyle(0xe0a060, 0.7);
    g.fillEllipse(fX - 8, fY - 12, 22, 5);
    // Tail
    g.fillStyle(0xc08040, 1);
    g.fillTriangle(fX + 10, fY - 16, fX + 22, fY - 12, fX + 10, fY - 8);

    // Warm glow on ground
    g.fillStyle(0xe06020, 0.12);
    g.fillEllipse(fX, fY + 6, 72, 24);

    this._firePitX = fX;
    this._firePitY = fY;

    // Flame flicker tween
    const flameTween = this.add.graphics().setDepth(6);
    this.tweens.add({
      targets: { t: 0 },
      t: 1,
      duration: 180,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: (tw, tgt) => {
        flameTween.clear();
        const flicker = tgt.t;
        flameTween.fillStyle(0xffe060, 0.3 + flicker * 0.15);
        flameTween.fillCircle(fX + Math.sin(Date.now() * 0.01) * 3, fY - 12 - flicker * 6, 6 + flicker * 3);
      },
    });
  }

  // ── Dock and Boat ─────────────────────────────────────────

  _drawDockAndBoat(W, WH) {
    const g  = this.add.graphics().setDepth(4);
    const dX = W * 0.72, dY = WH * 0.62, dW = W * 0.24, dH = WH * 0.10;

    // Dock planks
    g.fillStyle(0x5a4428, 1);
    g.fillRect(dX, dY, dW, dH);
    g.lineStyle(1, 0x3a2c18, 0.8);
    for (let dp = dX + 18; dp < dX + dW; dp += 18) {
      g.lineBetween(dp, dY, dp, dY + dH);
    }
    g.lineBetween(dX, dY, dX + dW, dY);
    g.lineStyle(2, 0x3a2810, 1);
    g.strokeRect(dX, dY, dW, dH);

    // Dock posts
    g.fillStyle(0x3a2810, 1);
    [dX + 4, dX + dW * 0.5, dX + dW - 4].forEach(px => {
      g.fillRect(px - 5, dY - 12, 10, dH + 28);
      g.lineStyle(1, 0x2a1e08, 1);
      g.strokeRect(px - 5, dY - 12, 10, dH + 28);
    });

    // Boat hull
    const bX = dX + 14, bY = dY + dH - 6;
    g.fillStyle(0x3a5068, 1);
    // Hull shape (flat-bottomed)
    g.fillRect(bX, bY, dW - 28, 38);
    g.fillTriangle(bX, bY, bX - 18, bY + 38, bX, bY + 38);         // bow
    g.fillTriangle(bX + dW - 28, bY, bX + dW - 28 + 12, bY + 38, bX + dW - 28, bY + 38); // stern
    g.lineStyle(2, 0x2a3e50, 1);
    g.strokeRect(bX, bY, dW - 28, 38);
    // Boat interior
    g.fillStyle(0x2e4058, 1);
    g.fillRect(bX + 4, bY + 8, dW - 36, 22);
    // Gunwale stripe
    g.lineStyle(2, 0x6888a0, 0.7);
    g.lineBetween(bX, bY, bX + dW - 28, bY);
    // Rope tying boat to dock post
    g.lineStyle(1.5, 0x9a8060, 0.8);
    g.lineBetween(bX + 10, bY + 4, dX + 4, dY + 4);
    // Mast suggestion (small, not a sailing boat)
    g.fillStyle(0x4a3828, 1);
    g.fillRect(bX + dW * 0.3, bY - 42, 5, 50);

    this._boatX = bX + (dW - 28) / 2;
    this._boatY = bY + 20;
    this._dockX = dX;
    this._dockY = dY;
    this._dockW = dW;
    this._dockH = dH + 40;
  }

  // ── Wayne Havasu ──────────────────────────────────────────

  _drawWayne(W, WH) {
    const g  = this.add.graphics().setDepth(9);
    const cX = this._chairX + 21;  // centered in chair
    const cY = this._chairY - 10;

    // Body — sitting, relaxed posture, slight forward lean
    // Legs (resting, outstretched)
    g.fillStyle(0x3a4858, 1);
    g.fillRect(cX - 16, cY + 44, 14, 26);
    g.fillRect(cX + 2, cY + 44, 14, 26);
    // Shorts (casual)
    g.fillStyle(0x4a5a70, 1);
    g.fillRect(cX - 18, cY + 36, 36, 14);
    // Shoes/feet
    g.fillStyle(0x2a2018, 1);
    g.fillEllipse(cX - 12, cY + 72, 18, 8);
    g.fillEllipse(cX + 12, cY + 72, 18, 8);
    // Torso (aloha-style shirt, unbuttoned, relaxed)
    g.fillStyle(0x285070, 1);
    g.fillRect(cX - 16, cY + 8, 32, 32);
    // Shirt open collar / pattern suggestion
    g.fillStyle(0x4880a0, 0.55);
    g.fillRect(cX - 6, cY + 8, 12, 32);
    // Shirt details (flower pattern — minimal)
    g.fillStyle(0xe07840, 0.4);
    g.fillCircle(cX - 10, cY + 18, 4);
    g.fillCircle(cX + 10, cY + 28, 4);
    // Arms (relaxed on armrests)
    g.fillStyle(0xb88050, 1);   // weathered tan skin
    g.fillRect(cX - 24, cY + 20, 8, 22);
    g.fillRect(cX + 16, cY + 20, 8, 22);
    g.fillEllipse(cX - 20, cY + 42, 10, 6);  // hands
    g.fillEllipse(cX + 20, cY + 42, 10, 6);
    // Head
    g.fillStyle(0xb88050, 1);
    g.fillCircle(cX, cY - 8, 17);
    // Silver-streaked hair (laid back)
    g.fillStyle(0x3a3028, 1);
    g.fillEllipse(cX, cY - 22, 34, 18);
    g.fillStyle(0x909088, 0.8);
    // Silver streaks
    g.lineStyle(1.5, 0xc0c0b8, 0.65);
    g.lineBetween(cX - 8, cY - 24, cX - 6, cY - 16);
    g.lineBetween(cX - 2, cY - 26, cX, cY - 18);
    g.lineBetween(cX + 6, cY - 24, cX + 4, cY - 16);
    // Beard stubble (dark gray)
    g.fillStyle(0x5a5050, 0.45);
    g.fillEllipse(cX, cY + 2, 24, 10);
    // Eyes (half-closed, watching ocean)
    g.fillStyle(0x101820, 1);
    g.fillEllipse(cX - 6, cY - 8, 6, 3);
    g.fillEllipse(cX + 6, cY - 8, 6, 3);
    // Relaxed smile
    g.lineStyle(1, 0x8a6040, 0.7);
    g.arc(cX, cY + 1, 6, 0, Math.PI, false);
    g.strokePath();

    // Idle sway (ocean breathing)
    this.tweens.add({
      targets: g, y: { from: 0, to: -2 },
      duration: 4000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this._wayneX = cX;
    this._wayneY = cY;
  }

  // ── Jennibelle (hidden until flag set) ───────────────────

  _drawJennibelle(W, WH) {
    this._jennibelleGraphic = this.add.graphics().setDepth(9).setVisible(false);
    const g  = this._jennibelleGraphic;
    const jX = W * 0.52, jY = WH * 0.60;

    // Carrying surfboard (teal one, under arm)
    // Surfboard under arm
    g.fillStyle(0x208080, 1);
    g.fillEllipse(jX + 44, jY + 12, 14, 8);
    g.fillRect(jX + 10, jY + 8, 34, 14);
    g.fillEllipse(jX + 8, jY + 15, 14, 10);
    g.lineStyle(1, 0x106060, 1);
    g.strokeRect(jX + 10, jY + 8, 34, 14);

    // Legs
    g.fillStyle(0x2a3040, 1);
    g.fillRect(jX - 6, jY + 50, 10, 30);
    g.fillRect(jX + 6, jY + 50, 10, 30);
    // Shorts
    g.fillStyle(0x3848a0, 1);
    g.fillRect(jX - 8, jY + 42, 22, 12);
    // Feet
    g.fillStyle(0xd0a070, 1);
    g.fillEllipse(jX - 4, jY + 80, 14, 7);
    g.fillEllipse(jX + 12, jY + 80, 14, 7);
    // Torso
    g.fillStyle(0xc83040, 1);  // red rash guard
    g.fillRect(jX - 10, jY + 10, 26, 36);
    // Arms
    g.fillStyle(0xd0a070, 1);
    g.fillRect(jX + 16, jY + 14, 8, 20);  // arm holding board
    g.fillRect(jX - 18, jY + 14, 8, 18);  // other arm
    // Head
    g.fillStyle(0xd0a070, 1);
    g.fillCircle(jX + 4, jY - 6, 14);
    // Hair (dark, short)
    g.fillStyle(0x1a0e08, 1);
    g.fillEllipse(jX + 4, jY - 16, 28, 14);
    g.fillRect(jX - 10, jY - 16, 6, 12);
    g.fillRect(jX + 14, jY - 16, 6, 12);
    // Eyes
    g.fillStyle(0x101010, 1);
    g.fillCircle(jX + 0, jY - 6, 2);
    g.fillCircle(jX + 8, jY - 6, 2);
    // Smile
    g.lineStyle(1, 0xa06040, 1);
    g.arc(jX + 4, jY + 0, 4, 0, Math.PI, false);
    g.strokePath();

    this._jennibelleX = jX;
    this._jennibelleY = jY;
  }

  _refreshJennibelle() {
    const appeared = GameState.getFlag('jennibelle_appeared');
    if (this._jennibelleGraphic) {
      this._jennibelleGraphic.setVisible(appeared);
    }
    // Update hotspot interactivity
    const jHotspot = this._hotspots.find(h => h.def.id === 'jennibelle');
    if (jHotspot) {
      if (appeared) {
        jHotspot.zone.setInteractive({ useHandCursor: true });
      } else {
        jHotspot.zone.disableInteractive();
      }
    }
  }

  // ── Return arrow ─────────────────────────────────────────

  _drawReturnArrow(W, WH) {
    const g = this.add.graphics().setDepth(6);
    const aX = 14, aY = 32;
    g.fillStyle(0x3a3028, 0.85);
    g.fillRoundedRect(aX - 4, aY - 14, 128, 28, 4);
    g.lineStyle(1, 0xc8956c, 0.45);
    g.strokeRoundedRect(aX - 4, aY - 14, 128, 28, 4);
    this.add.text(aX + 8, aY, '◀ Back to Cresthollow', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#c8a870', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);
    this._returnArrow = { x: aX - 4, y: aY - 14, w: 128, h: 28 };
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Wayne ─────────────────────────────────────────────────
    this._addHotspot({
      id: 'wayne', name: 'Wayne Havasu',
      x: this._wayneX, y: this._wayneY + 30, w: 64, h: 100,
      look: () => this._narrate("Wayne Havasu watches the ocean with the patience of someone who has made peace with the sea."),
      talk: () => this._talkToWayne(),
      take: () => this._narrate("Wayne Havasu is not available for taking."),
      use:  () => this._narrate("Wayne looks at you sidelong. 'I'm not a door,' he says."),
    });

    // ── Guitar ────────────────────────────────────────────────
    // Guitar leans against the cooler; position relative to chair
    const gX = this._chairX + 94, gY = this._chairY - 18;
    this._addHotspot({
      id: 'guitar', name: 'Wayne\'s Guitar',
      x: gX, y: gY + 24, w: 30, h: 64,
      look: () => {
        if (!GameState.getFlag('flag_wayne_guitar_talked')) {
          GameState.setFlag('flag_wayne_guitar_talked');
          this._play(DIALOGUE_WAYNE_GUITAR);
        } else {
          this._narrate("A salt-worn acoustic guitar, leaning against the cooler. Whoever plays it, plays it often.");
        }
      },
      talk: () => this._narrate("You could sing to the guitar, but it would mostly just sit there."),
      take: () => this._narrate("The guitar belongs to Wayne. It would be rude to take it."),
      use:  () => this._narrate("You pluck one string. It rings out, clear and full. Wayne doesn't look up, but something in his posture softens."),
    });

    // Draw guitar graphic (simple procedural)
    const gg = this.add.graphics().setDepth(7);
    gg.fillStyle(0x8a5c28, 1);
    gg.fillEllipse(gX + 2, gY + 42, 22, 26);
    gg.fillEllipse(gX + 2, gY + 22, 18, 20);
    gg.fillRect(gX - 3, gY + 8, 10, 36);
    gg.fillStyle(0x3a1e08, 1);
    gg.fillRect(gX - 1, gY - 22, 6, 32);
    gg.lineStyle(1, 0x5a3c18, 1);
    gg.strokeEllipse(gX + 2, gY + 42, 22, 26);
    gg.strokeEllipse(gX + 2, gY + 22, 18, 20);
    // Strings
    gg.lineStyle(0.5, 0xc0c0b0, 0.6);
    for (let s = -2; s <= 2; s++) {
      gg.lineBetween(gX + 2 + s * 1.2, gY - 10, gX + 2 + s * 1.2, gY + 56);
    }
    // Sound hole
    gg.fillStyle(0x1a0c04, 1);
    gg.fillCircle(gX + 2, gY + 42, 5);

    // ── Surfboards ────────────────────────────────────────────
    this._addHotspot({
      id: 'surfboards', name: 'Surfboards',
      x: W * 0.04 + 20, y: WH * 0.55, w: 60, h: 90,
      look: () => this._narrate("Two surfboards, salt-worn and well-loved. One has a crack repaired with — yes, that's duct tape."),
      talk: () => this._narrate("The boards lean in contemplative silence."),
      take: () => this._narrate("You can't take Wayne's surfboards. They belong to him and the ocean."),
      use:  () => this._narrate("You don't have time to surf right now. Probably."),
    });

    // ── Fish on fire ──────────────────────────────────────────
    this._addHotspot({
      id: 'fire_pit', name: 'Fish on the Fire',
      x: this._firePitX, y: this._firePitY, w: 62, h: 62,
      look: () => this._narrate("Fish, rice, and beans, if the pot nearby is any indication. It smells genuinely good."),
      talk: () => this._narrate("The fish are unavailable for comment."),
      take: () => this._narrate("You are not going to steal fish off Wayne's fire."),
      use:  () => this._narrate("Wayne waves you away from the fire. 'Sit. I'll bring it to you when it's done.'"),
    });

    // ── Boat at dock ──────────────────────────────────────────
    this._addHotspot({
      id: 'boat', name: 'Boat at the Dock',
      x: this._boatX, y: this._boatY, w: 90, h: 52,
      look: () => this._narrate("A solid, well-maintained boat. Wide enough to be stable in a crossing. It could make the Isle of Tides."),
      talk: () => this._talkAboutBoat(),
      take: () => this._narrate("You can't exactly carry a boat."),
      use:  () => this._talkAboutBoat(),
    });

    // ── Jennibelle ────────────────────────────────────────────
    this._addHotspot({
      id: 'jennibelle', name: 'Jennibelle',
      x: this._jennibelleX + 4, y: this._jennibelleY + 38, w: 50, h: 88,
      look: () => this._narrate("Jennibelle has the energy of someone who learned to surf before she learned to worry. She carries the board with the ease of long practice."),
      talk: () => {
        if (!GameState.getFlag('jennibelle_talked')) {
          GameState.setFlag('jennibelle_talked');
          this._play(DIALOGUE_JENNIBELLE_INTRO);
        } else {
          this._play([
            { speaker: 'jennibelle', text: "That fin still rattles when you hit chop. Uncle Wayne keeps saying he'll fix it." },
            { speaker: 'cambrie', text: "Does he fix it?" },
            { speaker: 'jennibelle', text: "No. But he says he will. With great confidence every single time." },
          ]);
        }
      },
      take: () => this._narrate("You cannot take Jennibelle. She would have opinions."),
      use:  () => this._narrate("Jennibelle looks at you with polite bemusement."),
    });

    // ── Return to Cresthollow ─────────────────────────────────
    const ra = this._returnArrow;
    this._addHotspot({
      id: 'return', name: 'Back to Cresthollow',
      x: ra.x + ra.w / 2, y: ra.y + ra.h / 2, w: ra.w, h: ra.h,
      look: () => this._narrate("The path back to Cresthollow village."),
      talk: () => this._narrate(""),
      take: () => this._narrate(""),
      use:  () => this._goTo('CresthollowScene'),
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
    this._refreshJennibelle();
  }

  // ── Wayne dialogue logic ──────────────────────────────────

  _talkToWayne() {
    const firstDone    = GameState.getFlag('wayne_first_done');
    const boatDone     = GameState.getFlag('wayne_boat_done');
    const farewellDone = GameState.getFlag('wayne_farewell_done');

    if (farewellDone) {
      this._play([
        { speaker: 'wayne', text: "Safe crossing. Come back with good news." },
      ]);
    } else if (firstDone && boatDone) {
      // Both dialogues done → farewell
      GameState.setFlag('wayne_farewell_done');
      this._play(DIALOGUE_WAYNE_FAREWELL, () => {
        GameState.addItem('wayne_coins');
        this._goTo('CresthollowScene');
      });
    } else if (!firstDone) {
      GameState.setFlag('wayne_first_done');
      GameState.setFlag('jennibelle_appeared');
      this._play(DIALOGUE_WAYNE_FIRST, () => {
        this._refreshJennibelle();
      });
    } else if (!boatDone) {
      GameState.setFlag('wayne_boat_done');
      this._play(DIALOGUE_WAYNE_BOAT);
    } else {
      this._play(DIALOGUE_WAYNE_TALK_AGAIN);
    }
  }

  _talkAboutBoat() {
    if (GameState.getFlag('wayne_boat_done')) {
      this._narrate("Wayne has already promised you the boat. He keeps his promises.");
    } else if (GameState.getFlag('wayne_first_done')) {
      GameState.setFlag('wayne_boat_done');
      this._play(DIALOGUE_WAYNE_BOAT);
    } else {
      this._narrate("You should talk to Wayne first. He's the one who knows this boat.");
    }
  }

  // ── Transitions ───────────────────────────────────────────

  _goTo(scene) {
    this._locked = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start(scene));
  }

  // ── Helpers ───────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }
  _narrate(text)          { this._play([{ speaker: 'narrator', text }]); }

  update() {
    if (this.dialogue) this.dialogue.update();

    // Wave animation
    this._waveOffset += 0.8;
    const W  = this.scale.width;
    const WH = this.scale.height - 156;
    this._drawWaveLayer(W, WH);
  }
}
