// ============================================================
// scenes/EdwardFarrisScene.js — Sisters' Quest: The Moonveil Crown
// Harbor Master's Office — Edward Farris
// Indoor, stone walls, harbor view through window.
// ============================================================

class EdwardFarrisScene extends BaseScene {
  constructor() { super({ key: 'EdwardFarrisScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('EdwardFarrisScene');

    // ── Camera ─────────────────────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Scene label ────────────────────────────────────────────
    this.add.text(W / 2, 18, "Harbor Master's Office  ·  Cresthollow Harbor", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#2a2e38', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── World ──────────────────────────────────────────────────
    this._drawWalls(W, WH);
    this._drawFloor(W, WH);
    this._drawFilingCabinets(W, WH);
    this._drawHarborWindow(W, WH);
    this._drawDesk(W, WH);
    this._drawFarris(W, WH);
    this._drawDoor(W, WH);

    // ── Stamp animation ────────────────────────────────────────
    this._stampY = 0;
    this._stampDir = 1;
    this._stampGraphics = this.add.graphics().setDepth(11);
    this._lastStampTime = 0;

    // ── Dialogue ───────────────────────────────────────────────
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

    // ── Hotspots ───────────────────────────────────────────────
    this._buildHotspots(W, WH);

    // ── Shared UI — always last ────────────────────────────────
    this._initUI();
  }

  // ── Stone walls ────────────────────────────────────────────

  _drawWalls(W, WH) {
    const g = this.add.graphics();

    // Back wall — cool gray stone
    g.fillGradientStyle(0x1e2024, 0x1e2024, 0x28292e, 0x28292e, 1);
    g.fillRect(0, 0, W, WH);

    // Stone block pattern (back wall)
    g.lineStyle(1, 0x161820, 0.55);
    const blockH = 38, blockW = 80;
    for (let row = 0; row * blockH < WH * 0.72; row++) {
      const y      = row * blockH;
      const offset = (row % 2 === 0) ? 0 : blockW / 2;
      for (let col = -1; col * blockW < W + blockW; col++) {
        const x = col * blockW - offset;
        g.strokeRect(x, y, blockW, blockH);
        // Subtle depth variation
        if ((row + col) % 3 === 0) {
          g.fillStyle(0x202226, 0.4);
          g.fillRect(x + 1, y + 1, blockW - 2, blockH - 2);
        }
      }
    }

    // Molding at top
    g.fillStyle(0x2a2c32, 1);
    g.fillRect(0, 0, W, 22);
    g.lineStyle(1, 0x3a3c42, 1);
    g.lineBetween(0, 22, W, 22);

    // Baseboard
    g.fillStyle(0x222428, 1);
    g.fillRect(0, WH * 0.72, W, 14);
    g.lineStyle(1, 0x3a3c42, 0.7);
    g.lineBetween(0, WH * 0.72, W, WH * 0.72);
  }

  // ── Floor ─────────────────────────────────────────────────

  _drawFloor(W, WH) {
    const g   = this.add.graphics();
    const flY = WH * 0.72;

    // Wood floor — dark
    g.fillStyle(0x1c1410, 1);
    g.fillRect(0, flY + 14, W, WH - flY - 14);

    // Floor planks (perspective)
    g.lineStyle(1, 0x141008, 0.8);
    const plankW = 48;
    for (let fx = 0; fx < W; fx += plankW) {
      g.lineBetween(fx, flY + 14, fx, WH);
    }
    for (let fy = flY + 30; fy < WH; fy += 22) {
      g.lineBetween(0, fy, W, fy);
    }

    // Floor highlight (ambient light from window)
    g.fillStyle(0x4060a0, 0.06);
    g.fillRect(W * 0.52, flY + 14, W * 0.28, WH - flY - 14);
  }

  // ── Filing Cabinets (both sides, floor to ceiling) ─────────

  _drawFilingCabinets(W, WH) {
    const g = this.add.graphics().setDepth(3);

    // Left bank of cabinets
    this._drawCabinetBank(g, 0, 0, W * 0.22, WH * 0.72);
    // Right bank of cabinets
    this._drawCabinetBank(g, W * 0.84, 0, W * 0.16, WH * 0.72);

    // Overhead shelf (center top, with binders)
    this._drawOverheadShelf(g, W * 0.22, 22, W * 0.62, 60);

    this._leftCabX = 0;
    this._leftCabW = W * 0.22;
    this._rightCabX = W * 0.84;
    this._rightCabW = W * 0.16;
  }

  _drawCabinetBank(g, x, y, w, h) {
    // Base color
    g.fillStyle(0x2a2c30, 1);
    g.fillRect(x, y, w, h);
    g.lineStyle(1.5, 0x1e2024, 1);
    g.strokeRect(x, y, w, h);

    // Individual drawer rows
    const drawerH = 28;
    const rows = Math.floor(h / drawerH);
    for (let r = 0; r < rows; r++) {
      const dy = y + r * drawerH;
      // Drawer face
      g.fillStyle(0x303438 + ((r % 3) * 0x010000), 1);
      g.fillRect(x + 4, dy + 3, w - 8, drawerH - 6);
      g.lineStyle(1, 0x1e2024, 0.8);
      g.strokeRect(x + 4, dy + 3, w - 8, drawerH - 6);
      // Drawer pull handle
      g.fillStyle(0xc8956c, 0.55);
      g.fillRect(x + w / 2 - 10, dy + 12, 20, 5);
      g.lineStyle(1, 0xb87840, 0.8);
      g.strokeRect(x + w / 2 - 10, dy + 12, 20, 5);
      // Label slot
      g.fillStyle(0xe0dcc8, 0.25);
      g.fillRect(x + w / 2 - 16, dy + 5, 32, 7);
    }
  }

  _drawOverheadShelf(g, x, y, w, h) {
    // Shelf board
    g.fillStyle(0x2a2418, 1);
    g.fillRect(x, y + h - 8, w, 8);
    g.lineStyle(1, 0x3a3020, 1);
    g.strokeRect(x, y + h - 8, w, 8);
    // Binders (alternating colors)
    const BINDER_COLORS = [0x3a1a08, 0x0a1e3a, 0x1a3a12, 0x3a2a08, 0x2a0a30, 0x1a2a3a];
    let bx = x + 6;
    while (bx < x + w - 20) {
      const bw = Phaser.Math.Between(16, 26);
      const bh = Phaser.Math.Between(38, h - 10);
      const bc = BINDER_COLORS[(Math.floor(bx / 20)) % BINDER_COLORS.length];
      g.fillStyle(bc, 1);
      g.fillRect(bx, y + h - 8 - bh, bw, bh);
      g.lineStyle(1, 0x1a1814, 0.6);
      g.strokeRect(bx, y + h - 8 - bh, bw, bh);
      // Spine label
      g.fillStyle(0xe0d8c0, 0.2);
      g.fillRect(bx + 2, y + h - 8 - bh + 6, bw - 4, 10);
      bx += bw + 2;
    }
  }

  // ── Harbor Window ──────────────────────────────────────────

  _drawHarborWindow(W, WH) {
    const g  = this.add.graphics().setDepth(4);
    const wX = W * 0.56, wY = WH * 0.08, wW = W * 0.24, wH = WH * 0.34;

    // Window frame (stone reveal)
    g.fillStyle(0x222428, 1);
    g.fillRect(wX - 8, wY - 8, wW + 16, wH + 16);

    // Harbor view through window (painted with depth)
    // Sky outside
    g.fillGradientStyle(0x404858, 0x404858, 0x606878, 0x606878, 1);
    g.fillRect(wX, wY, wW, wH * 0.42);
    // Gray choppy water
    g.fillStyle(0x2a3848, 1);
    g.fillRect(wX, wY + wH * 0.42, wW, wH * 0.58);
    // Water chop lines
    g.lineStyle(1, 0x3a5060, 0.6);
    for (let wl = 0; wl < 8; wl++) {
      const wy = wY + wH * 0.45 + wl * (wH * 0.55 / 9);
      g.lineBetween(wX + 4, wy, wX + wW - 4, wy + 2);
    }
    // Moored boat mast
    g.lineStyle(2, 0x4a4038, 0.9);
    g.lineBetween(wX + wW * 0.28, wY + wH * 0.10, wX + wW * 0.28, wY + wH * 0.60);
    g.lineStyle(1, 0x4a4038, 0.7);
    g.lineBetween(wX + wW * 0.28 - 14, wY + wH * 0.24, wX + wW * 0.28 + 14, wY + wH * 0.24);
    // Second mast
    g.lineStyle(1.5, 0x3a3028, 0.8);
    g.lineBetween(wX + wW * 0.64, wY + wH * 0.08, wX + wW * 0.64, wY + wH * 0.55);

    // Window panes (glass glint)
    g.lineStyle(1.5, 0x3a4050, 0.6);
    g.lineBetween(wX + wW / 2, wY, wX + wW / 2, wY + wH);  // vertical
    g.lineBetween(wX, wY + wH * 0.4, wX + wW, wY + wH * 0.4);  // horizontal
    // Pane glass glint
    g.lineStyle(1, 0x90a8c0, 0.15);
    g.lineBetween(wX + 4, wY + 4, wX + wW * 0.4, wY + wH * 0.3);

    // Window frame molding
    g.lineStyle(3, 0x2e3038, 1);
    g.strokeRect(wX, wY, wW, wH);
    g.lineStyle(1, 0x484c58, 0.7);
    g.strokeRect(wX + 3, wY + 3, wW - 6, wH - 6);

    // Sill
    g.fillStyle(0x2a2c32, 1);
    g.fillRect(wX - 6, wY + wH, wW + 12, 8);

    this._windowX = wX;
    this._windowY = wY;
    this._windowW = wW;
    this._windowH = wH;
  }

  // ── Desk ──────────────────────────────────────────────────

  _drawDesk(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const dX = W * 0.22, dY = WH * 0.48, dW = W * 0.58, dH = WH * 0.26;

    // Desk body (solid, imposing)
    g.fillStyle(0x2a2018, 1);
    g.fillRect(dX, dY, dW, dH);
    g.lineStyle(2, 0x4a3820, 1);
    g.strokeRect(dX, dY, dW, dH);

    // Desk top surface (slightly lighter)
    g.fillStyle(0x342818, 1);
    g.fillRect(dX, dY, dW, 12);
    g.lineStyle(1, 0x5a4228, 0.8);
    g.lineBetween(dX, dY + 12, dX + dW, dY + 12);

    // Desk drawers (front face)
    g.fillStyle(0x2e2416, 1);
    g.fillRect(dX + dW * 0.5, dY + 18, dW * 0.22, dH - 24);
    g.lineStyle(1, 0x4a3820, 1);
    g.strokeRect(dX + dW * 0.5, dY + 18, dW * 0.22, dH - 24);
    // Drawer pulls
    g.fillStyle(0xc8956c, 0.6);
    g.fillRect(dX + dW * 0.5 + 8, dY + 26, 20, 4);
    g.fillRect(dX + dW * 0.5 + 8, dY + 44, 20, 4);

    // Desk legs (visible beneath)
    g.fillStyle(0x221810, 1);
    g.fillRect(dX + 10, dY + dH, 18, 28);
    g.fillRect(dX + dW - 28, dY + dH, 18, 28);

    // ── Desk surface items ─────────────────────────────────────

    // Stack of forms (left side of desk)
    const fX = dX + 16, fY = dY - 2;
    g.fillStyle(0xf0e8d0, 0.95);
    g.fillRect(fX, fY, 88, 6);
    g.fillStyle(0xe8dcc0, 0.9);
    g.fillRect(fX + 2, fY - 4, 86, 6);
    g.fillStyle(0xdcd0b8, 0.85);
    g.fillRect(fX + 4, fY - 8, 84, 6);
    g.lineStyle(0.5, 0xb0a080, 0.5);
    g.strokeRect(fX, fY, 88, 6);
    // Lines on top paper
    g.lineStyle(0.5, 0x9a8860, 0.4);
    for (let fl = 0; fl < 4; fl++) g.lineBetween(fX + 8, fY + 1 + fl * 1.2, fX + 80, fY + 1 + fl * 1.2);

    // Open ledger (center of desk)
    const lX = dX + dW * 0.30, lY = dY - 18;
    g.fillStyle(0xf4ecd8, 1);
    g.fillRect(lX, lY, 130, 80);
    g.lineStyle(1.5, 0xc8a870, 1);
    g.strokeRect(lX, lY, 130, 80);
    g.lineStyle(2, 0xaa8840, 1);
    g.lineBetween(lX + 65, lY, lX + 65, lY + 80);  // spine
    // Ledger columns
    g.lineStyle(0.5, 0xb0985a, 0.5);
    g.lineBetween(lX + 28, lY + 4, lX + 28, lY + 76);
    g.lineBetween(lX + 92, lY + 4, lX + 92, lY + 76);
    g.lineBetween(lX + 110, lY + 4, lX + 110, lY + 76);
    // Rows
    for (let lr = 1; lr < 10; lr++) {
      g.lineBetween(lX + 2, lY + lr * 8, lX + 128, lY + lr * 8);
    }
    // "SABLE DAWN" entry visible on ledger
    this.add.text(lX + 3, lY + 30, 'SABLE DAWN...', {
      fontFamily: 'Georgia, serif', fontSize: '7px', color: '#5a4020',
    }).setDepth(7);
    this.add.text(lX + 68, lY + 30, 'SALVAGE...', {
      fontFamily: 'Georgia, serif', fontSize: '7px', color: '#8a5030',
    }).setDepth(7);

    // Ink pots (two of them)
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(dX + dW * 0.72, dY - 10, 9);
    g.fillCircle(dX + dW * 0.77, dY - 10, 9);
    g.lineStyle(1, 0x3a3a3a, 1);
    g.strokeCircle(dX + dW * 0.72, dY - 10, 9);
    g.strokeCircle(dX + dW * 0.77, dY - 10, 9);
    // Ink color glimpse inside pots
    g.fillStyle(0x000050, 0.7);
    g.fillCircle(dX + dW * 0.72, dY - 11, 6);
    g.fillStyle(0x500000, 0.7);
    g.fillCircle(dX + dW * 0.77, dY - 11, 6);

    // Quill pen
    g.lineStyle(1, 0xe0d8a0, 0.85);
    g.lineBetween(dX + dW * 0.78, dY - 22, dX + dW * 0.72 + 2, dY - 4);
    g.fillStyle(0xf0edd8, 0.8);
    g.fillTriangle(dX + dW * 0.78, dY - 22, dX + dW * 0.78 + 10, dY - 16, dX + dW * 0.78 + 4, dY - 10);

    // Stamp (the perpetual stamp)
    g.fillStyle(0x3a2418, 1);
    g.fillRect(dX + dW * 0.60, dY - 18, 22, 32);
    g.fillStyle(0xc8956c, 0.7);
    g.fillRect(dX + dW * 0.60, dY + 8, 22, 8);
    g.lineStyle(1, 0x5a3c20, 1);
    g.strokeRect(dX + dW * 0.60, dY - 18, 22, 40);
    // Stamp pad
    g.fillStyle(0x1a1a30, 1);
    g.fillRect(dX + dW * 0.60 - 4, dY + 16, 30, 8);

    // Outbox tray (right side)
    g.fillStyle(0x3a3028, 1);
    g.fillRect(dX + dW - 90, dY - 4, 76, 4);
    g.fillRect(dX + dW - 90, dY - 4, 4, 20);
    g.fillRect(dX + dW - 18, dY - 4, 4, 20);
    // Paper in outbox
    g.fillStyle(0xf0e8d0, 0.8);
    g.fillRect(dX + dW - 86, dY - 2, 68, 4);

    // "OUTBOX" label
    this.add.text(dX + dW - 52, dY + 14, 'OUTBOX', {
      fontFamily: 'Georgia, serif', fontSize: '7px', color: '#6a5030',
    }).setOrigin(0.5).setDepth(7);

    this._deskX = dX;
    this._deskY = dY;
    this._deskW = dW;
    this._deskH = dH;

    // Animated stamp effect (overlay layer)
    this._stampBaseX = dX + dW * 0.60 + 11;
    this._stampBaseY = dY - 18;
  }

  // ── Edward Farris ─────────────────────────────────────────

  _drawFarris(W, WH) {
    const g  = this.add.graphics().setDepth(9);
    // Farris sits behind the desk
    const fX = W * 0.50, fY = this._deskY - 68;

    // Chair back (visible above desk edge)
    g.fillStyle(0x1e1c18, 1);
    g.fillRect(fX - 22, fY + 52, 44, 14);
    g.lineStyle(1, 0x3a3028, 1);
    g.strokeRect(fX - 22, fY + 52, 44, 14);

    // Torso (dark uniform — naval/bureaucratic)
    g.fillStyle(0x1e2228, 1);
    g.fillRect(fX - 18, fY + 12, 36, 44);
    // Uniform details
    g.fillStyle(0x2a2e38, 1);
    g.fillRect(fX - 8, fY + 12, 6, 44);  // lapel
    g.fillRect(fX + 2, fY + 12, 6, 44);  // lapel
    // Buttons
    g.fillStyle(0xc8956c, 0.8);
    [fY + 18, fY + 28, fY + 38].forEach(by => g.fillCircle(fX, by, 2));
    // Epaulettes
    g.fillStyle(0x3a3e48, 1);
    g.fillRect(fX - 22, fY + 14, 8, 6);
    g.fillRect(fX + 14, fY + 14, 8, 6);
    g.fillStyle(0xc8956c, 0.5);
    g.fillRect(fX - 20, fY + 15, 4, 4);
    g.fillRect(fX + 16, fY + 15, 4, 4);

    // Arms (bent over desk, perpetually stamping)
    g.fillStyle(0x1e2228, 1);
    g.fillRect(fX - 22, fY + 30, 8, 26);  // left arm
    g.fillRect(fX + 14, fY + 30, 8, 26);  // right arm (stamp hand)
    // Hands
    g.fillStyle(0xc09070, 1);
    g.fillEllipse(fX - 18, fY + 56, 12, 8);
    g.fillEllipse(fX + 18, fY + 56, 12, 8);

    // Head
    g.fillStyle(0xc09070, 1);
    g.fillCircle(fX, fY - 2, 17);
    // Hair (neatly combed, dark with silver temples)
    g.fillStyle(0x1e1a14, 1);
    g.fillEllipse(fX, fY - 14, 34, 16);
    g.fillStyle(0x9090a0, 0.6);
    // Silver temples
    g.fillRect(fX - 17, fY - 10, 5, 10);
    g.fillRect(fX + 12, fY - 10, 5, 10);
    // Precise side part
    g.lineStyle(1, 0x2a2418, 1);
    g.lineBetween(fX - 4, fY - 18, fX - 4, fY - 8);
    // Eyes (sharp, focused on work)
    g.fillStyle(0x201c18, 1);
    g.fillEllipse(fX - 6, fY - 2, 6, 4);
    g.fillEllipse(fX + 6, fY - 2, 6, 4);
    // Small gleam in eye
    g.fillStyle(0xc8c0b8, 0.7);
    g.fillCircle(fX - 5, fY - 3, 1);
    g.fillCircle(fX + 7, fY - 3, 1);
    // Thin set mouth (concentration)
    g.lineStyle(1, 0x9a7050, 0.8);
    g.lineBetween(fX - 6, fY + 7, fX + 6, fY + 7);
    // Thin mustache (neat)
    g.lineStyle(1.5, 0x3a3028, 0.9);
    g.lineBetween(fX - 7, fY + 3, fX - 2, fY + 4);
    g.lineBetween(fX + 2, fY + 4, fX + 7, fY + 3);

    // Subtle stamp-motion tween (right arm)
    const armGraphic = this.add.graphics().setDepth(10);
    this.tweens.add({
      targets: { arm: 0 },
      arm: 1,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut',
      onUpdate: (tw, tgt) => {
        const a = tgt.arm;
        armGraphic.clear();
        // Right arm stamps down
        armGraphic.fillStyle(0x1e2228, 1);
        armGraphic.fillRect(fX + 14, fY + 30, 8, 26 + a * 8);
        armGraphic.fillStyle(0xc09070, 1);
        armGraphic.fillEllipse(fX + 18, fY + 56 + a * 8, 12, 8);
        // Stamp mark flash at peak
        if (a > 0.85) {
          armGraphic.fillStyle(0xc8956c, 0.25);
          armGraphic.fillRect(this._stampBaseX - 10, this._deskY + 8, 20, 8);
        }
      },
    });

    this._farrisX = fX;
    this._farrisY = fY;
  }

  // ── Door (exit) ───────────────────────────────────────────

  _drawDoor(W, WH) {
    const g  = this.add.graphics().setDepth(4);
    const dX = W - 68, dY = WH * 0.42, dW = 54, dH = WH * 0.40;

    // Door frame
    g.fillStyle(0x1e1c18, 1);
    g.fillRect(dX - 6, dY - 6, dW + 12, dH + 6);
    g.lineStyle(2, 0x3a3028, 1);
    g.strokeRect(dX - 6, dY - 6, dW + 12, dH + 6);
    // Door
    g.fillStyle(0x2e2418, 1);
    g.fillRect(dX, dY, dW, dH);
    g.lineStyle(1.5, 0x4a3820, 1);
    g.strokeRect(dX, dY, dW, dH);
    // Door panels
    g.fillStyle(0x261e14, 1);
    g.fillRect(dX + 4, dY + 6, dW - 8, dH / 2 - 10);
    g.fillRect(dX + 4, dY + dH / 2 + 4, dW - 8, dH / 2 - 10);
    g.lineStyle(1, 0x3a2e1c, 0.8);
    g.strokeRect(dX + 4, dY + 6, dW - 8, dH / 2 - 10);
    g.strokeRect(dX + 4, dY + dH / 2 + 4, dW - 8, dH / 2 - 10);
    // Knob
    g.fillStyle(0xc8956c, 0.9);
    g.fillCircle(dX + 10, dY + dH / 2, 5);
    g.lineStyle(1, 0x9a6a3c, 1);
    g.strokeCircle(dX + 10, dY + dH / 2, 5);
    // "Exit" label
    this.add.text(dX + dW / 2, dY - 14, '← Exit', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4a4038', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(6);

    // Nameplate on door
    g.fillStyle(0x3a3028, 1);
    g.fillRect(dX + 8, dY + 8, dW - 16, 22);
    g.lineStyle(1, 0xc8956c, 0.5);
    g.strokeRect(dX + 8, dY + 8, dW - 16, 22);
    this.add.text(dX + dW / 2, dY + 19, 'FARRIS', {
      fontFamily: 'Georgia, serif', fontSize: '7px', color: '#c8956c',
    }).setOrigin(0.5).setDepth(6);

    this._doorX = dX;
    this._doorY = dY;
    this._doorW = dW + 12;
    this._doorH = dH + 6;
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Farris at desk ────────────────────────────────────────
    this._addHotspot({
      id: 'farris', name: 'Edward Farris',
      x: this._farrisX, y: this._farrisY + 20, w: 72, h: 88,
      look: () => this._narrate("Edward Farris is a man who has found meaning in filing systems. Every paper on that desk is exactly where it should be. Probably in triplicate."),
      talk: () => this._talkToFarris(),
      take: () => this._narrate("Harbor Master Farris would not appreciate that."),
      use:  () => this._narrate("Farris is a person, not a mechanism. Though he does operate with remarkable precision."),
    });

    // ── Filing cabinets ───────────────────────────────────────
    this._addHotspot({
      id: 'cabinets_left', name: 'Filing Cabinets',
      x: this._leftCabX + this._leftCabW / 2, y: WH * 0.36,
      w: this._leftCabW, h: WH * 0.72,
      look: () => this._narrate("Forty years of harbor records. Every ship. Every cargo. Every piece of 'salvage.' Farris knows where every single form lives. This is both impressive and deeply concerning."),
      talk: () => this._narrate("The cabinets don't answer. Filing cabinets rarely do."),
      take: () => this._narrate("You can't take the filing cabinets."),
      use:  () => this._narrate("You need Farris to find the right file — he knows this system. Any other approach would take weeks."),
    });

    this._addHotspot({
      id: 'cabinets_right', name: 'Filing Cabinets',
      x: this._rightCabX + this._rightCabW / 2, y: WH * 0.36,
      w: this._rightCabW, h: WH * 0.72,
      look: () => this._narrate("The right-side cabinets appear to be organized by year, decade, and 'miscellaneous incidents.' The miscellaneous section is suspiciously thick."),
      talk: () => this._narrate("The filing system continues to not respond."),
      take: () => this._narrate("These cabinets are the property of the Harbor Authority."),
      use:  () => this._narrate("You need Farris to navigate this. He built it. He is probably the only one who can."),
    });

    // ── Harbor window ─────────────────────────────────────────
    this._addHotspot({
      id: 'harbor_window', name: 'Harbor Window',
      x: this._windowX + this._windowW / 2, y: this._windowY + this._windowH / 2,
      w: this._windowW, h: this._windowH,
      look: () => this._narrate("Through the cloudy glass, the harbor is quiet. A few boats are moored. No movement. The water is the gray-green of November and keeps no appointments."),
      talk: () => this._narrate("The harbor is indifferent to being spoken to."),
      take: () => this._narrate("You are not going to take the window."),
      use:  () => this._play([
        { speaker: 'cambrie', text: "The Isle of Tides is out there, somewhere past the breakwater. If the harbor were open, we'd already be on a boat." },
        { speaker: 'mackenzie', text: "Then let's get it open." },
      ]),
    });

    // ── Desk with papers ──────────────────────────────────────
    this._addHotspot({
      id: 'desk', name: 'Harbor Master\'s Desk',
      x: this._deskX + this._deskW / 2, y: this._deskY + this._deskH / 2,
      w: this._deskW, h: this._deskH,
      look: () => this._play([
        { speaker: 'cambrie', text: "Forms in triplicate. Forms in quadruplicate. At least one form that appears to be a form about forms." },
        { speaker: 'mackenzie', text: "Is that the Sable Dawn ledger?" },
        { speaker: 'cambrie', text: "Yes. And the entry for the seal-skin cloak is listed as 'salvage.' Someone logged it as cargo." },
        { speaker: 'mackenzie', text: "That's not salvage. That's a selkie's life. We need that manifest." },
      ]),
      talk: () => this._narrate("The desk is not the kind of object that listens."),
      take: () => this._narrate("You cannot take the desk. Several laws would be broken and Farris would be very cross."),
      use:  () => {
        if (VerbSystem.activeItem === 'ships_manifest') {
          this._narrate("You already have the manifest. It's right there in your bag.");
        } else {
          this._narrate("Farris is the one who can pull the right documents. The desk is just where they live.");
        }
      },
    });

    // ── Door / exit ───────────────────────────────────────────
    this._addHotspot({
      id: 'door', name: 'Door — Exit to Harbor',
      x: this._doorX + this._doorW / 2, y: this._doorY + this._doorH / 2,
      w: this._doorW, h: this._doorH,
      look: () => this._narrate("The door to the harbor road. Cresthollow is a short walk north."),
      talk: () => this._narrate("The door says nothing. It just opens and closes."),
      take: () => this._narrate("You are not going to take the door."),
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
  }

  // ── Farris dialogue logic ─────────────────────────────────

  _talkToFarris() {
    if (GameState.getFlag('farris_done')) {
      this._play(DIALOGUE_FARRIS_REPEAT);
    } else if (!GameState.getFlag('farris_first_done')) {
      GameState.setFlag('farris_first_done');
      this._play(DIALOGUE_FARRIS_FIRST, () => {
        // After first conversation, immediately give manifest sequence
        this.time.delayedCall(200, () => this._farrisGivesManifest());
      });
    } else {
      this._farrisGivesManifest();
    }
  }

  _farrisGivesManifest() {
    if (GameState.getFlag('farris_done')) return;
    this._play(DIALOGUE_FARRIS_GIVES_MANIFEST, () => {
      GameState.setFlag('farris_done');
      GameState.addItem('ships_manifest');
      GameState.addItem('harbor_pass');
      this.setStatus("Received: Ship's Manifest and Harbor Pass.");
    });
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

  update() { if (this.dialogue) this.dialogue.update(); }
}
