// ============================================================
// scenes/VessaTowerScene.js — Sisters' Quest: The Moonveil Crown
// Vessa's Tower interior — the final confrontation and choice.
// ============================================================

class VessaTowerScene extends BaseScene {
  constructor() { super({ key: 'VessaTowerScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('VessaTowerScene');

    // ── World ─────────────────────────────────────────────────
    this._drawBackground(W, H, WH);
    this._drawLooms(W, H, WH);
    this._drawMasterLoom(W, H, WH);
    this._drawWindows(W, H, WH);
    this._drawCandles(W, H, WH);
    this._drawVessa(W, H, WH);

    this.add.text(W / 2, 18, "Vessa's Tower", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#c8a050', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Dialogue ──────────────────────────────────────────────
    this.dialogue = new DialogueSystem(this);

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

    // ── State ─────────────────────────────────────────────────
    this._hotspots    = [];
    this._locked      = false;
    this._choiceButtons = [];

    this._buildHotspots(W, H, WH);

    // ── UI (always last) ──────────────────────────────────────
    this._initUI();

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Animate loom threads
    this._animateLooms();
  }

  // ── Drawing ──────────────────────────────────────────────────

  _drawBackground(W, H, WH) {
    const g = this.add.graphics();

    // Dark stone interior walls
    g.fillGradientStyle(0x0e0a08, 0x0e0a08, 0x1a1410, 0x1a1410, 1);
    g.fillRect(0, 0, W, WH);

    // Stone floor
    g.fillStyle(0x181410, 1);
    g.fillRect(0, WH * 0.78, W, WH * 0.22);
    g.lineStyle(1, 0x2a2018, 0.4);
    g.lineBetween(0, WH * 0.78, W, WH * 0.78);

    // Floor stone tiles
    g.lineStyle(1, 0x201a14, 0.3);
    for (let x = 0; x < W; x += 56) g.lineBetween(x, WH * 0.78, x, WH);
    for (let y = WH * 0.78; y < WH; y += 30) g.lineBetween(0, y, W, y);

    // Ceiling — high and dark
    g.fillStyle(0x080608, 1);
    g.fillRect(0, 0, W, 28);

    // Warm amber ambient light (from candles)
    g.fillStyle(0xd08020, 0.04);
    g.fillRect(0, 0, W, WH);
    g.fillStyle(0xd08020, 0.03);
    g.fillRect(W * 0.25, WH * 0.20, W * 0.50, WH * 0.60);
  }

  _drawLooms(W, H, WH) {
    const g = this.add.graphics().setDepth(4);

    // Left side looms — tall, against the wall
    this._drawLoom(g, 18, WH * 0.05, 88, WH * 0.70);
    this._drawLoom(g, 116, WH * 0.05, 88, WH * 0.70);

    // Right side looms
    this._drawLoom(g, W - 106, WH * 0.05, 88, WH * 0.70);
    this._drawLoom(g, W - 196, WH * 0.05, 78, WH * 0.65);

    // Store reference for animation
    this._loomGraphics = g;
  }

  _drawLoom(g, x, y, w, h) {
    // Frame
    g.fillStyle(0x2a1c10, 1);
    g.fillRect(x, y, w, h);
    g.lineStyle(1.5, 0x4a3020, 1);
    g.strokeRect(x, y, w, h);

    // Top beam
    g.fillStyle(0x3a2a18, 1);
    g.fillRect(x - 4, y, w + 8, 10);

    // Bottom beam
    g.fillRect(x - 4, y + h - 10, w + 8, 10);

    // Vertical side posts
    g.fillRect(x, y, 8, h);
    g.fillRect(x + w - 8, y, 8, h);

    // Warp threads (vertical, silver-gray)
    const numThreads = Math.floor(w / 6);
    for (let i = 1; i < numThreads; i++) {
      const tx = x + i * 6;
      // Vary thread color slightly
      const shade = 0x888070 + (i % 3) * 0x080808;
      g.lineStyle(1, shade, 0.6);
      g.lineBetween(tx, y + 10, tx, y + h - 10);
    }

    // Weft threads (horizontal, colored — the weaving)
    const weftColors = [0x8a3010, 0x3a5a8a, 0x6a8a30, 0x8a6a10, 0x5a2a6a];
    const numWeft = Math.floor(h / 14);
    for (let j = 1; j < numWeft - 1; j++) {
      const wy = y + 10 + j * 14;
      g.lineStyle(1.5, weftColors[j % weftColors.length], 0.5);
      // Interlace: alternating segments
      for (let k = 0; k < numThreads; k += 2) {
        if ((j + k) % 2 === 0) {
          g.lineBetween(x + k * 6, wy, x + (k + 1) * 6, wy);
        }
      }
    }
  }

  _drawMasterLoom(W, H, WH) {
    const g  = this.add.graphics().setDepth(6);
    const lx = W * 0.35;
    const ly = WH * 0.04;
    const lw = W * 0.30;
    const lh = WH * 0.72;

    // Frame — imposing, ornate
    g.fillStyle(0x3a2810, 1);
    g.fillRect(lx, ly, lw, lh);
    g.lineStyle(2.5, 0xc8956c, 0.8);
    g.strokeRect(lx, ly, lw, lh);

    // Top cross-beam with carved detail
    g.fillStyle(0x4a3818, 1);
    g.fillRect(lx - 10, ly, lw + 20, 16);
    g.lineStyle(1.5, 0xc8956c, 0.7);
    g.strokeRect(lx - 10, ly, lw + 20, 16);
    // Carved triangles on beam
    g.fillStyle(0xc8956c, 0.3);
    g.fillTriangle(lx + 10, ly + 4, lx + 20, ly + 4, lx + 15, ly + 12);
    g.fillTriangle(lx + lw - 20, ly + 4, lx + lw - 10, ly + 4, lx + lw - 15, ly + 12);
    g.fillTriangle(lx + lw / 2 - 6, ly + 2, lx + lw / 2 + 6, ly + 2, lx + lw / 2, ly + 12);

    // Side posts (thick)
    g.fillStyle(0x3a2810, 1);
    g.fillRect(lx, ly, 12, lh);
    g.fillRect(lx + lw - 12, ly, 12, lh);

    // Bottom beam
    g.fillStyle(0x4a3818, 1);
    g.fillRect(lx - 10, ly + lh - 16, lw + 20, 16);
    g.lineStyle(1, 0xc8956c, 0.5);
    g.strokeRect(lx - 10, ly + lh - 16, lw + 20, 16);

    // Warp threads — silver and gold, more elaborate
    const numW = Math.floor(lw / 7);
    for (let i = 1; i < numW; i++) {
      const tx  = lx + 12 + i * 7;
      const col = i % 3 === 0 ? 0xd4a030 : 0xa0a890;
      g.lineStyle(1, col, 0.65);
      g.lineBetween(tx, ly + 16, tx, ly + lh - 16);
    }

    // Weft threads — silver and gold interlaced
    const weftCols = [0xc8a830, 0x9098a0, 0xe0c060, 0xb0b8a8];
    const numWf = Math.floor(lh / 10);
    for (let j = 2; j < numWf - 2; j++) {
      const wy = ly + 16 + j * 10;
      g.lineStyle(1.5, weftCols[j % weftCols.length], 0.55);
      for (let k = 0; k < numW; k += 2) {
        if ((j + k) % 2 === 0) {
          const kx = lx + 12 + k * 7;
          g.lineBetween(kx, wy, kx + 7, wy);
        }
      }
    }

    // Glow effect on master loom threads
    g.fillStyle(0xd0a030, 0.06);
    g.fillRect(lx + 12, ly + 16, lw - 24, lh - 32);

    // Label
    this.add.text(lx + lw / 2, ly + lh + 10, 'The Master Loom', {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: '#c8956c', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(7).setAlpha(0.8);

    // Animated thread glow — store for animation
    this._masterLoomGlow = this.add.graphics().setDepth(7);
    this.tweens.add({
      targets: this._masterLoomGlow,
      alpha: { from: 0.6, to: 1.0 },
      duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        this._masterLoomGlow.clear();
        this._masterLoomGlow.fillStyle(0xd0a030, 0.04 * this._masterLoomGlow.alpha);
        this._masterLoomGlow.fillRect(lx + 12, ly + 16, lw - 24, lh - 32);
        this._masterLoomGlow.lineStyle(1, 0xd4b050, 0.15 * this._masterLoomGlow.alpha);
        this._masterLoomGlow.strokeRect(lx, ly, lw, lh);
      },
    });
  }

  _drawWindows(W, H, WH) {
    const g = this.add.graphics().setDepth(3);

    // Narrow high windows on back wall
    const windows = [
      { x: W * 0.20, y: WH * 0.06 },
      { x: W * 0.80, y: WH * 0.06 },
    ];

    windows.forEach(win => {
      const wx = win.x;
      const wy = win.y;

      // Window embrasure (stone surround)
      g.fillStyle(0x1a1410, 1);
      g.fillRect(wx - 14, wy, 28, 70);
      g.lineStyle(1.5, 0x2a2018, 1);
      g.strokeRect(wx - 14, wy, 28, 70);

      // Arch top
      g.fillStyle(0x1a1410, 1);
      g.fillEllipse(wx, wy, 28, 14);

      // Window glass — sea visible outside (dawn blue)
      g.fillStyle(0x304860, 0.7);
      g.fillRect(wx - 11, wy + 4, 22, 60);
      g.fillEllipse(wx, wy + 4, 22, 11);

      // Morning light shaft
      g.fillStyle(0x80a0c0, 0.06);
      g.fillTriangle(
        wx - 11, wy + 4,
        wx + 11, wy + 4,
        wx + 50, WH * 0.70
      );

      // Window cross bars
      g.lineStyle(1, 0x201810, 0.8);
      g.lineBetween(wx - 11, wy + 34, wx + 11, wy + 34);
      g.lineBetween(wx, wy + 4, wx, wy + 64);
    });
  }

  _drawCandles(W, H, WH) {
    const g = this.add.graphics().setDepth(5);

    // Wall sconces with candles — left and right sides
    const sconces = [
      { x: 105,     y: WH * 0.32 },
      { x: 105,     y: WH * 0.54 },
      { x: W - 105, y: WH * 0.32 },
      { x: W - 105, y: WH * 0.54 },
    ];

    sconces.forEach(sc => {
      const sx = sc.x;
      const sy = sc.y;

      // Sconce bracket
      g.fillStyle(0x5a4020, 1);
      g.fillRect(sx - 12, sy, 24, 8);
      g.fillRect(sx - 4, sy + 8, 8, 16);
      g.lineStyle(1, 0x7a5828, 0.7);
      g.strokeRect(sx - 12, sy, 24, 8);

      // Candle
      g.fillStyle(0xf0e8d0, 1);
      g.fillRect(sx - 3, sy - 18, 6, 18);
      g.lineStyle(1, 0xd0c0a0, 0.5);
      g.strokeRect(sx - 3, sy - 18, 6, 18);

      // Flame
      g.fillStyle(0xffd040, 0.9);
      g.fillTriangle(sx - 3, sy - 18, sx + 3, sy - 18, sx, sy - 28);
      g.fillStyle(0xff8020, 0.6);
      g.fillTriangle(sx - 2, sy - 18, sx + 2, sy - 18, sx, sy - 24);
      g.fillStyle(0xffffff, 0.3);
      g.fillCircle(sx, sy - 26, 2);

      // Glow halo
      g.fillStyle(0xd08020, 0.08);
      g.fillCircle(sx, sy - 22, 20);
    });

    // Candle wax drips
    g.fillStyle(0xe8dfc0, 0.7);
    sconces.forEach(sc => {
      g.fillRect(sc.x - 1, sc.y - 2, 2, 8);
      g.fillRect(sc.x + 2, sc.y - 1, 1, 5);
    });
  }

  _drawVessa(W, H, WH) {
    const g  = this.add.graphics().setDepth(9);
    const vx = W * 0.22;
    const vy = WH * 0.36;

    // Vessa stands/sits slightly left, at the Master Loom's side

    // Robe — long, flowing, dark indigo-gray
    g.fillStyle(0x1e1a2a, 1);
    g.fillTriangle(vx - 24, vy + 100, vx + 24, vy + 100, vx, vy + 18);

    // Robe details — subtle fold lines
    g.lineStyle(1, 0x2e2a3a, 0.5);
    g.lineBetween(vx - 10, vy + 30, vx - 16, vy + 96);
    g.lineBetween(vx + 8,  vy + 30, vx + 14, vy + 96);

    // Arms — one at side, one slightly raised (working at loom)
    g.fillStyle(0x1e1a2a, 1);
    // Left arm at side (still, dignified)
    g.fillRect(vx - 30, vy + 22, 10, 34);
    // Right arm reaching slightly toward loom
    g.fillRect(vx + 16, vy + 18, 28, 10);

    // Hands — slightly lighter (skin showing)
    g.fillStyle(0xb09090, 0.8);
    g.fillEllipse(vx - 26, vy + 56, 10, 8);  // left hand
    g.fillEllipse(vx + 46, vy + 22, 8, 8);   // right hand

    // Neck
    g.fillStyle(0xb09090, 1);
    g.fillRect(vx - 4, vy + 6, 8, 14);

    // Head
    g.fillStyle(0xb09090, 1);
    g.fillEllipse(vx, vy - 4, 26, 30);

    // White-silver hair — swept back, dignified
    g.fillStyle(0xd0d0cc, 1);
    g.fillEllipse(vx, vy - 14, 30, 16);
    // Hair pulled back
    g.fillStyle(0xc8c8c4, 0.9);
    g.fillTriangle(vx - 12, vy - 14, vx - 4, vy - 2, vx - 22, vy + 8);
    g.fillTriangle(vx + 12, vy - 14, vx + 4, vy - 2, vx + 22, vy + 8);
    // Silver bun at back
    g.fillStyle(0xc8c8c4, 0.8);
    g.fillCircle(vx, vy - 18, 8);
    g.lineStyle(1, 0xa8a8a4, 0.6);
    g.strokeCircle(vx, vy - 18, 8);

    // Face — deeply lined, beautiful
    // Eyes (slightly downcast, thoughtful)
    g.fillStyle(0x2a2028, 1);
    g.fillEllipse(vx - 6, vy - 6, 6, 4);
    g.fillEllipse(vx + 6, vy - 6, 6, 4);
    // Brow lines
    g.lineStyle(1, 0x807878, 0.5);
    g.lineBetween(vx - 9, vy - 11, vx - 4, vy - 9);
    g.lineBetween(vx + 4,  vy - 9, vx + 9,  vy - 11);
    // Laugh lines / life lines
    g.lineStyle(1, 0x987080, 0.3);
    g.lineBetween(vx - 12, vy - 6, vx - 10, vy + 2);
    g.lineBetween(vx + 10, vy - 6, vx + 12, vy + 2);
    // Mouth — composed, a small closed smile
    g.lineStyle(1.5, 0x907878, 0.7);
    g.beginPath();
    g.moveTo(vx - 5, vy + 4);
    g.lineTo(vx,     vy + 6);
    g.lineTo(vx + 5, vy + 4);
    g.strokePath();

    // Dignity: upright posture line suggestion
    g.lineStyle(1, 0x3a3048, 0.2);
    g.lineBetween(vx, vy - 20, vx, vy + 100);

    // Subtle ambient glow around Vessa (she is the center of this story)
    g.fillStyle(0xd0a030, 0.04);
    g.fillCircle(vx, vy + 40, 60);

    this.add.text(vx, vy + 116, 'Vessa of Elderwyn', {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: '#c8a0a0', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10).setAlpha(0.8);

    // Subtle breathing animation
    this.tweens.add({
      targets: g,
      scaleY: { from: 1.0, to: 1.005 },
      duration: 4000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
  }

  _animateLooms() {
    // Animate a few loom thread shimmer effects with tweens
    const shimmer = this.add.graphics().setDepth(5);
    this.tweens.add({
      targets: shimmer,
      alpha: { from: 0.3, to: 0.8 },
      duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        shimmer.clear();
        // Subtle horizontal shimmer lines on the side looms (threads moving)
        shimmer.lineStyle(1, 0xc0b880, 0.08 * shimmer.alpha);
        const loomYPositions = [0.20, 0.30, 0.40, 0.50, 0.60];
        loomYPositions.forEach(yFrac => {
          const WH = this.scale.height - 156;
          const y  = WH * yFrac;
          shimmer.lineBetween(18, y, 104, y);
          shimmer.lineBetween(116, y, 202, y);
          shimmer.lineBetween(this.scale.width - 106, y, this.scale.width - 18, y);
        });
      },
    });
  }

  // ── Hotspots ──────────────────────────────────────────────────

  _buildHotspots(W, H, WH) {
    const defs = [
      // 1. Vessa
      {
        id: 'vessa', name: 'Vessa of Elderwyn',
        x: W * 0.22, y: WH * 0.58, w: 80, h: 130,
        look: () => this._vessaLook(),
        talk: () => this._vessaTalk(W, H, WH),
        take: () => this._narrate("Vessa is not something you take."),
        use:  () => this._vessaTalk(W, H, WH),
      },
      // 2. Master Loom
      {
        id: 'master_loom', name: 'The Master Loom',
        x: W * 0.50, y: WH * 0.40, w: W * 0.30, h: WH * 0.72,
        look: () => this._narrate("The largest loom in the tower. Every thread is a different color. You cannot see the pattern yet."),
        talk: () => this._narrate("The loom does not talk. It only weaves."),
        take: () => this._narrate("The Master Loom is not something you can take."),
        use:  () => {
          if (GameState.getFlag('vessa_met')) {
            this._narrate("Vessa's voice, quiet: 'Do not touch the loom.'");
          } else {
            this._narrate("Something about this loom makes you hesitate. Better to speak with Vessa first.");
          }
        },
      },
      // 3. Tower windows
      {
        id: 'windows', name: 'Tower Windows',
        x: W * 0.20, y: WH * 0.12, w: 36, h: 80,
        look: () => this._narrate("Through the narrow windows — the sea, the Isle of Tides, the distant mainland. The whole journey visible from here."),
        talk: () => this._narrate("The view does not respond."),
        take: () => this._narrate("You cannot take the view."),
        use:  () => this._narrate("You press close to the glass. Everything you've traveled through is out there, small in the distance."),
      },
      {
        id: 'windows2', name: 'Tower Windows',
        x: W * 0.80, y: WH * 0.12, w: 36, h: 80,
        look: () => this._narrate("Through the narrow windows — the sea, the Isle of Tides, the distant mainland. The whole journey visible from here."),
        talk: () => this._narrate("The view does not respond."),
        take: () => this._narrate("You cannot take the view."),
        use:  () => this._narrate("You press close to the glass. Everything you've traveled through is out there, small in the distance."),
      },
      // 4. Weavings on walls
      {
        id: 'weavings_left', name: 'Weavings (left looms)',
        x: W * 0.12, y: WH * 0.40, w: 95, h: WH * 0.60,
        look: () => this._narrate("The walls are covered in finished works. Tapestries, banners, smaller things. Some of them show places you recognize: Cresthollow, the Thornwood, the Mere."),
        talk: () => this._narrate("The tapestries hang in silence."),
        take: () => this._narrate("These belong to forty years of Vessa's work."),
        use:  () => this._narrate("You look more closely. One of them shows the Palace of Elderwyn. Queen Elara's face, young, before the curse, is threaded in silver."),
      },
      {
        id: 'weavings_right', name: 'Weavings (right looms)',
        x: W * 0.88, y: WH * 0.40, w: 95, h: WH * 0.60,
        look: () => this._narrate("The walls are covered in finished works. Tapestries, banners, smaller things. Some of them show places you recognize: Cresthollow, the Thornwood, the Mere."),
        talk: () => this._narrate("The tapestries hang in silence."),
        take: () => this._narrate("These belong to forty years of Vessa's work."),
        use:  () => this._narrate("Another weaving shows two small figures on a dark road under stars. You recognize the cloaks."),
      },
    ];

    defs.forEach(def => {
      const outline = this.add.graphics().setDepth(49);
      const zone    = this.add.zone(def.x, def.y, def.w, def.h)
        .setInteractive({ useHandCursor: true })
        .setDepth(205);

      zone.on('pointerover', () => {
        if (this._locked) return;
        outline.clear();
        outline.lineStyle(1.5, 0xc8956c, 0.4);
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
    });
  }

  _setHotspotsEnabled(on) {
    this._hotspots.forEach(h => {
      on ? h.zone.setInteractive({ useHandCursor: true })
         : h.zone.disableInteractive();
    });
  }

  // ── Vessa interaction logic ───────────────────────────────────

  _vessaLook() {
    if (!GameState.getFlag('vessa_met')) {
      this._narrate("Vessa of Elderwyn. She has been here forty years, waiting, working. The tower smells of thread and patience.");
    } else if (GameState.getFlag('vessa_trusted')) {
      this._narrate("Vessa works at the loom with calm certainty. Her hands know what to do.");
    } else {
      this._narrate("Vessa waits. She has been waiting for a long time. A little longer does not concern her.");
    }
  }

  _vessaTalk(W, H, WH) {
    if (GameState.getFlag('vessa_trusted')) {
      this._narrate("'We are nearly there,' Vessa says, without looking up from the loom.");
      return;
    }

    if (!GameState.getFlag('vessa_met')) {
      GameState.setFlag('vessa_met');
      this.dialogue.play(DIALOGUE_VESSA_FIRST, () => {
        this._checkPiecesForVessa(W, H, WH);
      });
    } else {
      this._checkPiecesForVessa(W, H, WH);
    }
  }

  _checkPiecesForVessa(W, H, WH) {
    const hasShard  = GameState.hasItem('starlight_shard');
    const hasThread = GameState.hasItem('moonveil_thread');
    const hasHeart  = GameState.hasItem('seaglass_heart');

    if (hasShard && hasThread && hasHeart) {
      this.dialogue.play(DIALOGUE_VESSA_PIECES, () => {
        this.dialogue.play(DIALOGUE_VESSA_CHOICE, () => {
          this._showFinalChoice(W, H, WH);
        });
      });
    } else {
      // Tell player what is missing
      const missing = [];
      if (!hasShard)  missing.push('the Starlight Shard');
      if (!hasThread) missing.push('the Moonveil Thread');
      if (!hasHeart)  missing.push('the Sea-Glass Heart');
      const missingStr = missing.join(', ');
      this.setStatus('Still missing: ' + missingStr);
      this._narrate(`Vessa looks at what you carry. 'Not yet. You are still missing ${missingStr}. Bring all three and we can complete this.'`);
    }
  }

  // ── Choice system ─────────────────────────────────────────────

  _showFinalChoice(W, H, WH) {
    this._hideChoiceButtons();

    const choices = [
      { label: 'Trust Vessa — leave the pieces with her.', action: 'trust' },
      { label: 'Press her — demand the crown now.',        action: 'demand' },
    ];

    choices.forEach((choice, i) => {
      const cy = WH * 0.60 + i * 60;

      const bg = this.add.graphics().setDepth(290);
      bg.fillStyle(0x1a0a2a, 0.95);
      bg.fillRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);
      bg.lineStyle(1.5, 0xc8956c, 0.8);
      bg.strokeRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);

      const txt = this.add.text(W / 2, cy, choice.label, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#e8d5b0',
        align: 'center', wordWrap: { width: 380 },
      }).setOrigin(0.5).setDepth(291);

      const zone = this.add.zone(W / 2, cy, 400, 40)
        .setInteractive({ useHandCursor: true })
        .setDepth(295);
      zone.on('pointerdown', () => this._handleChoice(choice.action, W, H, WH));
      zone.on('pointerover', () => { txt.setColor('#ffffff'); });
      zone.on('pointerout',  () => { txt.setColor('#e8d5b0'); });

      this._choiceButtons.push({ bg, txt, zone });
    });
  }

  _showTrustOnly(W, H, WH) {
    this._hideChoiceButtons();

    const cy = WH * 0.60;

    const bg = this.add.graphics().setDepth(290);
    bg.fillStyle(0x1a0a2a, 0.95);
    bg.fillRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);
    bg.lineStyle(1.5, 0xc8956c, 0.8);
    bg.strokeRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);

    const txt = this.add.text(W / 2, cy, 'Trust Vessa — leave the pieces with her.', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#e8d5b0',
      align: 'center', wordWrap: { width: 380 },
    }).setOrigin(0.5).setDepth(291);

    const zone = this.add.zone(W / 2, cy, 400, 40)
      .setInteractive({ useHandCursor: true })
      .setDepth(295);
    zone.on('pointerdown', () => this._handleChoice('trust', W, H, WH));
    zone.on('pointerover', () => { txt.setColor('#ffffff'); });
    zone.on('pointerout',  () => { txt.setColor('#e8d5b0'); });

    this._choiceButtons.push({ bg, txt, zone });
  }

  _hideChoiceButtons() {
    if (this._choiceButtons && this._choiceButtons.length > 0) {
      this._choiceButtons.forEach(b => {
        b.bg.destroy();
        b.txt.destroy();
        b.zone.destroy();
      });
      this._choiceButtons = [];
    }
  }

  _handleChoice(action, W, H, WH) {
    this._hideChoiceButtons();

    if (action === 'trust') {
      this.dialogue.play(DIALOGUE_VESSA_TRUST, () => {
        GameState.setFlag('vessa_trusted');
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => this.scene.start('TrueEndingScene'));
      });
    } else {
      // Demand — Vessa refuses, then offer trust only
      this.dialogue.play(DIALOGUE_VESSA_REFUSES, () => {
        this.time.delayedCall(200, () => {
          this.dialogue.play([
            { speaker: 'cambrie',   text: "Mac. We have to trust her. We've trusted everyone else who helped us. This is no different." },
            { speaker: 'mackenzie', text: "...Fine. But if this goes wrong—" },
            { speaker: 'cambrie',   text: "It won't." },
          ], () => {
            this._showTrustOnly(W, H, WH);
          });
        });
      });
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

  _narrate(text) {
    this.dialogue.play([{ speaker: 'narrator', text }]);
  }

  update() { if (this.dialogue) this.dialogue.update(); }
}
