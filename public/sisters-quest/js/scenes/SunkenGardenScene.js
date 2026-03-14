// ============================================================
// scenes/SunkenGardenScene.js — Sisters' Quest: The Moonveil Crown
// The Sunken Garden — ancient walled garden half-swallowed by the
// sea, with a stone fountain and Prince Dorian's statue.
// ============================================================

class SunkenGardenScene extends BaseScene {
  constructor() { super({ key: 'SunkenGardenScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('SunkenGardenScene');

    // ── World ─────────────────────────────────────────────────
    this._drawBackground(W, H, WH);
    this._drawWalls(W, H, WH);
    this._drawFloor(W, H, WH);
    this._drawFountain(W, H, WH);
    this._drawMoonveilPlants(W, H, WH);
    this._drawTidalPools(W, H, WH);
    this._dorianAwake = GameState.getFlag('dorian_awake');
    this._drawDorian(W, H, WH);

    this.add.text(W / 2, 18, 'The Sunken Garden', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#8ab0b8', fontStyle: 'italic',
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

    // ── Hotspots ──────────────────────────────────────────────
    this._hotspots = [];
    this._locked   = false;
    this._buildHotspots(W, H, WH);

    // ── UI (always last) ──────────────────────────────────────
    this._initUI();

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Entrance narration
    this.time.delayedCall(600, () => {
      if (!GameState.getFlag('garden_entered')) {
        GameState.setFlag('garden_entered');
        this.dialogue.play(DIALOGUE_GARDEN_ENTER);
      }
    });
  }

  // ── Drawing ──────────────────────────────────────────────────

  _drawBackground(W, H, WH) {
    const g = this.add.graphics();

    // Gray-blue late-afternoon sky
    g.fillGradientStyle(0x7a9aaa, 0x7a9aaa, 0x4a6a7a, 0x4a6a7a, 1);
    g.fillRect(0, 0, W, WH * 0.55);

    // Sea glimpses through gaps — blue-green ocean below sky
    g.fillGradientStyle(0x2a6a70, 0x2a6a70, 0x1a4a50, 0x1a4a50, 1);
    g.fillRect(0, WH * 0.55, W, WH * 0.15);

    // Soft cloud wisps
    g.fillStyle(0x9ab8c8, 0.3);
    g.fillEllipse(W * 0.15, WH * 0.12, 180, 40);
    g.fillEllipse(W * 0.55, WH * 0.08, 240, 35);
    g.fillEllipse(W * 0.82, WH * 0.15, 150, 30);
  }

  _drawWalls(W, H, WH) {
    const g = this.add.graphics();

    // Left stone wall
    g.fillStyle(0x6a6858, 1);
    g.fillRect(0, WH * 0.18, 82, WH * 0.52);
    g.lineStyle(1, 0x4a4840, 1);
    g.strokeRect(0, WH * 0.18, 82, WH * 0.52);

    // Stone brick pattern left
    g.lineStyle(1, 0x3a3828, 0.6);
    for (let y = WH * 0.18; y < WH * 0.70; y += 22) {
      g.lineBetween(0, y, 82, y);
    }
    for (let y = WH * 0.18; y < WH * 0.70; y += 44) {
      g.lineBetween(18, y + 11, 18, y + 33);
      g.lineBetween(54, y, 54, y + 22);
    }

    // Right stone wall
    g.fillStyle(0x6a6858, 1);
    g.fillRect(W - 82, WH * 0.18, 82, WH * 0.52);
    g.lineStyle(1, 0x4a4840, 1);
    g.strokeRect(W - 82, WH * 0.18, 82, WH * 0.52);

    // Stone brick pattern right
    g.lineStyle(1, 0x3a3828, 0.6);
    for (let y = WH * 0.18; y < WH * 0.70; y += 22) {
      g.lineBetween(W - 82, y, W, y);
    }
    for (let y = WH * 0.18; y < WH * 0.70; y += 44) {
      g.lineBetween(W - 54, y + 11, W - 54, y + 33);
      g.lineBetween(W - 18, y, W - 18, y + 22);
    }

    // Back wall (top)
    g.fillStyle(0x5a5848, 1);
    g.fillRect(0, WH * 0.18, W, 46);
    g.lineStyle(1, 0x3a3828, 0.5);
    for (let x = 0; x < W; x += 55) g.lineBetween(x, WH * 0.18, x, WH * 0.18 + 46);
    g.lineBetween(0, WH * 0.18 + 23, W, WH * 0.18 + 23);

    // Crumbled wall sections — gaps showing sea
    g.fillStyle(0x2a6a70, 0.7);
    // Left gap
    g.fillRect(10, WH * 0.35, 38, 60);
    // Right gap
    g.fillRect(W - 58, WH * 0.40, 42, 55);

    // Crumble rubble at gaps
    g.fillStyle(0x8a8068, 1);
    g.fillTriangle(10, WH * 0.35 + 60, 48, WH * 0.35 + 60, 10, WH * 0.35 + 80);
    g.fillTriangle(W - 58, WH * 0.40 + 55, W - 16, WH * 0.40 + 55, W - 16, WH * 0.40 + 75);

    // Sea-plant seaweed draped on walls — silver-green
    const sg = this.add.graphics().setDepth(2);
    sg.lineStyle(2, 0x7a9a78, 0.7);
    // Left wall seaweed
    for (let i = 0; i < 6; i++) {
      const sx = 10 + i * 12;
      const sy = WH * 0.18 + 46;
      const ey = sy + 50 + i * 8;
      sg.lineBetween(sx, sy, sx + Phaser.Math.Between(-6, 6), ey);
    }
    sg.lineStyle(2, 0x8aaa88, 0.5);
    for (let i = 0; i < 5; i++) {
      const sx = W - 78 + i * 14;
      const sy = WH * 0.18 + 46;
      const ey = sy + 45 + i * 10;
      sg.lineBetween(sx, sy, sx + Phaser.Math.Between(-5, 5), ey);
    }
    // Back wall seaweed clusters
    sg.lineStyle(1.5, 0x6a8a68, 0.55);
    for (let i = 0; i < 12; i++) {
      const sx = 90 + i * 60;
      sg.lineBetween(sx, WH * 0.18 + 46, sx + Phaser.Math.Between(-4, 4), WH * 0.18 + 90);
    }
  }

  _drawFloor(W, H, WH) {
    const g = this.add.graphics();

    // Mossy stone floor
    g.fillGradientStyle(0x484838, 0x484838, 0x383828, 0x383828, 1);
    g.fillRect(82, WH * 0.65, W - 164, WH * 0.35);
    g.fillGradientStyle(0x484838, 0x484838, 0x383828, 0x383828, 1);
    g.fillRect(0, WH * 0.70, 82, WH * 0.30);
    g.fillRect(W - 82, WH * 0.70, 82, WH * 0.30);

    // Floor stone grid
    g.lineStyle(1, 0x2a2818, 0.4);
    for (let x = 0; x < W; x += 48) g.lineBetween(x, WH * 0.65, x, WH);
    for (let y = WH * 0.65; y < WH; y += 32) g.lineBetween(0, y, W, y);

    // Moss patches (green smudges)
    g.fillStyle(0x405030, 0.4);
    g.fillEllipse(120, WH * 0.80, 60, 18);
    g.fillEllipse(W * 0.4, WH * 0.88, 80, 20);
    g.fillEllipse(W * 0.7, WH * 0.75, 50, 14);
    g.fillEllipse(W - 120, WH * 0.82, 70, 18);
  }

  _drawFountain(W, H, WH) {
    const g  = this.add.graphics().setDepth(5);
    const cx = W * 0.38;
    const cy = WH * 0.58;

    // Outer basin base
    g.fillStyle(0x7a7060, 1);
    g.fillEllipse(cx, cy + 18, 130, 38);
    g.lineStyle(2, 0x5a5048, 1);
    g.strokeEllipse(cx, cy + 18, 130, 38);

    // Basin walls
    g.fillStyle(0x848270, 1);
    g.fillEllipse(cx, cy, 110, 32);
    g.lineStyle(1.5, 0x6a6858, 1);
    g.strokeEllipse(cx, cy, 110, 32);

    // Basin inner (dry, dark)
    g.fillStyle(0x2a2820, 1);
    g.fillEllipse(cx, cy - 4, 88, 24);

    // Carved relief panels on basin side (abstract underwater shapes)
    g.lineStyle(1, 0x9a9080, 0.5);
    // Wave arcs
    g.beginPath();
    g.moveTo(cx - 50, cy + 2); g.lineTo(cx - 30, cy - 4); g.lineTo(cx - 10, cy + 2);
    g.strokePath();
    g.beginPath();
    g.moveTo(cx + 10, cy + 2); g.lineTo(cx + 30, cy - 4); g.lineTo(cx + 50, cy + 2);
    g.strokePath();

    // Central column
    g.fillStyle(0x706858, 1);
    g.fillRect(cx - 8, cy - 60, 16, 60);
    g.lineStyle(1, 0x5a5240, 1);
    g.strokeRect(cx - 8, cy - 60, 16, 60);

    // Top bowl (upper basin)
    g.fillStyle(0x7a7060, 1);
    g.fillEllipse(cx, cy - 60, 72, 22);
    g.fillStyle(0x2a2820, 1);
    g.fillEllipse(cx, cy - 64, 55, 16);
    g.lineStyle(1.5, 0x5a5248, 1);
    g.strokeEllipse(cx, cy - 60, 72, 22);

    // Crack lines
    g.lineStyle(1, 0x3a3828, 0.8);
    g.lineBetween(cx - 48, cy + 10, cx - 30, cy - 2);
    g.lineBetween(cx + 22, cy + 8, cx + 38, cy - 6);

    // Label
    this.add.text(cx, cy - 90, 'The Dry Fountain', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#7a7060',
      fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(6).setAlpha(0.6);
  }

  _drawMoonveilPlants(W, H, WH) {
    const g  = this.add.graphics().setDepth(6);
    const px = W * 0.55;
    const py = WH * 0.65;

    // Crack in stone floor from which plants grow
    g.lineStyle(1.5, 0x2a2818, 1);
    g.lineBetween(px - 18, py + 10, px + 22, py - 8);
    g.lineBetween(px - 8, py + 10, px, py - 15);

    // Stems in silver-green
    g.lineStyle(2, 0xaabab8, 0.85);
    const stems = [
      { ox: px - 10, oy: py + 8, tx: px - 22, ty: py - 28 },
      { ox: px,      oy: py + 5, tx: px + 5,  ty: py - 40 },
      { ox: px + 12, oy: py + 6, tx: px + 28, ty: py - 24 },
      { ox: px - 4,  oy: py + 8, tx: px - 16, ty: py - 18 },
      { ox: px + 6,  oy: py + 6, tx: px + 18, ty: py - 35 },
    ];
    stems.forEach(s => g.lineBetween(s.ox, s.oy, s.tx, s.ty));

    // Silver leaf tendrils branching off stems
    g.lineStyle(1, 0xc8d8d0, 0.7);
    stems.forEach(s => {
      const mx = (s.ox + s.tx) / 2;
      const my = (s.oy + s.ty) / 2;
      g.lineBetween(mx, my, mx - 10, my - 8);
      g.lineBetween(mx, my, mx + 10, my - 6);
    });

    // Faint glow dots at tips (bright silver-white)
    g.fillStyle(0xe8f0ec, 0.55);
    stems.forEach(s => g.fillCircle(s.tx, s.ty, 3));
    g.fillStyle(0xffffff, 0.25);
    stems.forEach(s => g.fillCircle(s.tx, s.ty, 5));

    // Animate a subtle pulse
    this.tweens.add({
      targets: g, alpha: { from: 0.85, to: 0.55 },
      duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Label
    this.add.text(px + 10, py - 55, 'Moonveil plants', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#9ab0aa',
      fontStyle: 'italic',
    }).setOrigin(0).setDepth(7).setAlpha(0.6);
  }

  _drawTidalPools(W, H, WH) {
    const g = this.add.graphics().setDepth(3);

    // Bottom-left pool
    g.fillStyle(0x2a5a68, 0.55);
    g.fillEllipse(64, WH * 0.84, 80, 26);
    g.lineStyle(1, 0x3a7080, 0.6);
    g.strokeEllipse(64, WH * 0.84, 80, 26);
    // Sea-glass dots
    const glassColors = [0x6ad0a0, 0x5aa8c8, 0x88d8b0, 0xe8c860];
    glassColors.forEach((c, i) => {
      g.fillStyle(c, 0.8);
      g.fillCircle(40 + i * 14, WH * 0.84 + Phaser.Math.Between(-5, 5), 4);
    });

    // Bottom-right pool
    g.fillStyle(0x2a5a68, 0.55);
    g.fillEllipse(W - 64, WH * 0.80, 90, 28);
    g.lineStyle(1, 0x3a7080, 0.6);
    g.strokeEllipse(W - 64, WH * 0.80, 90, 28);
    glassColors.forEach((c, i) => {
      g.fillStyle(c, 0.8);
      g.fillCircle(W - 92 + i * 14, WH * 0.80 + Phaser.Math.Between(-5, 5), 4);
    });
  }

  _drawDorian(W, H, WH) {
    // Store reference graphics for potential redraw
    if (this._dorianGraphics) {
      this._dorianGraphics.destroy();
    }
    const g  = this.add.graphics().setDepth(8);
    this._dorianGraphics = g;

    const dx = W * 0.78;
    const dy = WH * 0.40;

    const awake  = GameState.getFlag('dorian_awake');
    const skin   = awake ? 0xc89070 : 0x8a8878;
    const hair   = awake ? 0x3a2010 : 0x5a5a50;
    const cloak  = awake ? 0x2a3a60 : 0x505050;
    const cloak2 = awake ? 0x1a2a50 : 0x404040;

    // Base/plinth
    g.fillStyle(0x7a7060, 1);
    g.fillRect(dx - 22, dy + 96, 44, 18);
    g.fillRect(dx - 16, dy + 114, 32, 8);
    g.lineStyle(1, 0x5a5048, 1);
    g.strokeRect(dx - 22, dy + 96, 44, 18);

    // Cloak / body
    g.fillStyle(cloak, 1);
    g.fillTriangle(dx - 22, dy + 96, dx + 22, dy + 96, dx, dy + 30);
    // Inner cloak detail
    g.fillStyle(cloak2, 0.5);
    g.fillTriangle(dx - 8, dy + 96, dx + 8, dy + 96, dx, dy + 50);

    // Left arm reaching slightly outward
    g.fillStyle(cloak, 1);
    g.fillTriangle(dx - 22, dy + 50, dx - 10, dy + 90, dx - 40, dy + 80);

    // Neck
    g.fillStyle(skin, 1);
    g.fillRect(dx - 5, dy + 22, 10, 14);

    // Head
    g.fillStyle(skin, 1);
    g.fillEllipse(dx, dy + 12, 28, 32);

    // Hair
    g.fillStyle(hair, 1);
    g.fillEllipse(dx, dy - 4, 30, 16);
    // Small strands
    g.fillRect(dx - 8, dy - 2, 4, 18);
    g.fillRect(dx + 4, dy - 2, 4, 14);

    // Eyes — sorrowful expression
    g.fillStyle(awake ? 0x3a2810 : 0x6a6858, 1);
    g.fillEllipse(dx - 6, dy + 10, 5, 4);
    g.fillEllipse(dx + 6, dy + 10, 5, 4);

    // Furrowed brow lines (slight)
    g.lineStyle(1, awake ? 0xa07050 : 0x7a7868, 0.6);
    g.lineBetween(dx - 9, dy + 5, dx - 4, dy + 7);
    g.lineBetween(dx + 4, dy + 7, dx + 9, dy + 5);

    // Mouth — slightly downturned
    g.lineStyle(1, awake ? 0x9a6040 : 0x6a6858, 0.8);
    g.beginPath();
    g.moveTo(dx - 5, dy + 18);
    g.lineTo(dx,     dy + 20);
    g.lineTo(dx + 5, dy + 18);
    g.strokePath();

    // Stone texture details (only when not awake)
    if (!awake) {
      g.lineStyle(1, 0x707060, 0.3);
      g.lineBetween(dx - 4, dy + 40, dx - 8, dy + 70);
      g.lineBetween(dx + 6, dy + 35, dx + 10, dy + 65);
    } else {
      // If awake: slight warm glow around him
      g.fillStyle(0xffc870, 0.08);
      g.fillCircle(dx, dy + 50, 55);
    }

    // Label
    const label = awake ? 'Prince Dorian' : 'Stone Statue';
    this.add.text(dx, dy + 136, label, {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: awake ? '#c89070' : '#8a8878',
      fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(9).setAlpha(0.7);
  }

  _redrawDorianAwake(W, H, WH) {
    // Called after waking Dorian — redraw with warm colors
    this._drawDorian(W, H, WH);
    // Small flash effect
    const flash = this.add.graphics().setDepth(50);
    flash.fillStyle(0xfff0d0, 0.6);
    flash.fillRect(0, 0, W, WH);
    this.tweens.add({
      targets: flash, alpha: { from: 0.6, to: 0 },
      duration: 800, onComplete: () => flash.destroy(),
    });
  }

  // ── Hotspots ──────────────────────────────────────────────────

  _buildHotspots(W, H, WH) {
    const defs = [
      // 1. Prince Dorian statue
      {
        id: 'dorian', name: 'Prince Dorian',
        x: W * 0.78, y: WH * 0.62, w: 80, h: 130,
        look: () => this._dorianLook(),
        talk: () => this._dorianTalk(),
        take: () => this._narrate("He is either a statue or a prince. Either way, not something you can take."),
        use:  () => this._dorianUse(W, H, WH),
      },
      // 2. Fountain
      {
        id: 'fountain', name: 'The Dry Fountain',
        x: W * 0.38, y: WH * 0.52, w: 140, h: 80,
        look: () => this._narrate("The fountain basin is carved with scenes of an underwater palace. It stopped flowing centuries ago."),
        talk: () => this._narrate("The fountain has nothing to say. Fountains rarely do."),
        take: () => this._narrate("You cannot take the fountain. Mackenzie already considered it."),
        use:  () => this._narrate("Nothing happens. The water source dried up when the garden flooded."),
      },
      // 3. Moonveil plants
      {
        id: 'moonveil', name: 'Moonveil Plants',
        x: W * 0.58, y: WH * 0.60, w: 90, h: 80,
        look: () => this._moonveilLook(),
        talk: () => this._narrate("The plants don't talk. But they do glow faintly, which is more than most plants manage."),
        take: () => this._moonveilTake(W, H, WH),
        use:  () => this._moonveilTake(W, H, WH),
      },
      // 4. Garden walls / sea view
      {
        id: 'seaview', name: 'Sea View (through the wall)',
        x: W * 0.12, y: WH * 0.50, w: 70, h: 80,
        look: () => this._narrate("Through the crumbled wall, the sea. Somewhere out there: the Isle of Tides."),
        talk: () => this._narrate("The sea does not acknowledge you specifically."),
        take: () => this._narrate("You cannot take the sea."),
        use:  () => this._narrate("The wall is crumbled but the gap is too narrow to pass through."),
      },
      // 5. Exit to Isle of Tides (bottom center, after moonveil collected)
      {
        id: 'exit_isle', name: 'Path to the Isle of Tides',
        x: W * 0.50, y: WH - 18, w: 160, h: 36,
        look: () => this._narrate(GameState.getFlag('moonveil_collected')
          ? "The path down to the shore. The Isle of Tides awaits."
          : "We're not done here yet."),
        talk: () => this._narrate("The path is patient."),
        take: () => this._narrate("You cannot take the path."),
        use:  () => this._exitToIsle(),
      },
      // 6. Exit back to Whispering Caves
      {
        id: 'exit_back', name: '← Back (Whispering Caves)',
        x: W * 0.06, y: WH - 18, w: 110, h: 36,
        look: () => this._narrate("The way back through the caves."),
        talk: () => this._narrate("The path waits."),
        take: () => this._narrate("You cannot take the path."),
        use:  () => {
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.time.delayedCall(500, () => this.scene.start('WhisperingCavesScene'));
        },
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

  // ── Hotspot logic ─────────────────────────────────────────────

  _dorianLook() {
    if (!GameState.getFlag('dorian_seen')) {
      GameState.setFlag('dorian_seen');
      this.dialogue.play(DIALOGUE_DORIAN_LOOK);
    } else if (GameState.getFlag('dorian_awake')) {
      this._narrate("He stands in the garden, blinking at sunlight he hasn't seen in forty years. 'Still here,' he says. 'Still trying to understand it.'");
    } else {
      this._narrate("He stands in stone patience, forty years of thinking carved into his face.");
    }
  }

  _dorianTalk() {
    if (!GameState.getFlag('dorian_awake')) {
      this._narrate("He is stone. Stone is not known for its conversational range.");
    } else {
      this._narrate("He stands in the garden, blinking at sunlight he hasn't seen in forty years. 'Still here,' he says. 'Still trying to understand it.'");
    }
  }

  _dorianUse(W, H, WH) {
    if (GameState.getFlag('dorian_awake')) {
      this._narrate("He is already awake. He seems to appreciate not being bothered with further magic.");
      return;
    }
    if (VerbSystem.activeItem === 'starlight_shard' || GameState.hasItem('starlight_shard')) {
      // Use starlight shard on statue
      this.dialogue.play(DIALOGUE_DORIAN_WAKES, () => {
        GameState.setFlag('dorian_awake');
        GameState.addItem('dorian_flower');
        this._redrawDorianAwake(W, H, WH);
      });
    } else {
      this._narrate("Nothing happens. The statue remains stone. Perhaps there is something that could break the enchantment.");
    }
  }

  _moonveilLook() {
    if (!GameState.getFlag('moonveil_seen')) {
      GameState.setFlag('moonveil_seen');
      this.dialogue.play(DIALOGUE_MOONVEIL_FOUND);
    } else {
      this._narrate("Silver-threaded moonveil. Page forty-seven of the Fibers guide described them exactly.");
    }
  }

  _moonveilTake(W, H, WH) {
    if (GameState.getFlag('moonveil_collected')) {
      this._narrate("You already have the moonveil thread.");
      return;
    }
    if (!GameState.getFlag('dorian_awake')) {
      this._narrate("Cambrie pauses. 'I should look around more before we leave.' Something about this garden still needs attention.");
      return;
    }
    // Collect moonveil
    GameState.addItem('moonveil_thread');
    GameState.setFlag('moonveil_collected');
    this.dialogue.play([
      { speaker: 'cambrie',   text: "Moonveil thread. Real moonveil thread. Page forty-seven was right." },
      { speaker: 'mackenzie', text: "Can we go now?" },
    ]);
  }

  _exitToIsle() {
    if (!GameState.getFlag('moonveil_collected')) {
      this._narrate("We're not done here yet.");
      return;
    }
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start('IsleOfTidesScene'));
  }

  // ── Helpers ───────────────────────────────────────────────────

  _narrate(text) {
    this.dialogue.play([{ speaker: 'narrator', text }]);
  }

  update() { if (this.dialogue) this.dialogue.update(); }
}
