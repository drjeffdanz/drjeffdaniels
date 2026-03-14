// ============================================================
// scenes/IsleOfTidesScene.js — Sisters' Quest: The Moonveil Crown
// The Isle of Tides — rocky island shore with tide pools and
// Selkie Mira.
// ============================================================

class IsleOfTidesScene extends BaseScene {
  constructor() { super({ key: 'IsleOfTidesScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('IsleOfTidesScene');

    // ── World ─────────────────────────────────────────────────
    this._drawBackground(W, H, WH);
    this._drawRockyShore(W, H, WH);
    this._drawTidePools(W, H, WH);
    this._drawWreckHorizon(W, H, WH);
    this._drawTideKingShrine(W, H, WH);
    this._drawMira(W, H, WH);

    this.add.text(W / 2, 18, 'The Isle of Tides', {
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

    // ── Hotspots ──────────────────────────────────────────────
    this._hotspots = [];
    this._locked   = false;
    this._buildHotspots(W, H, WH);

    // ── UI (always last) ──────────────────────────────────────
    this._initUI();

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Arrival narration
    this.time.delayedCall(600, () => {
      if (!GameState.getFlag('isle_arrived')) {
        GameState.setFlag('isle_arrived');
        this.dialogue.play(DIALOGUE_ISLE_ARRIVE);
      }
    });
  }

  // ── Drawing ──────────────────────────────────────────────────

  _drawBackground(W, H, WH) {
    const g = this.add.graphics();

    // Golden evening sky — gradient top to warm horizon
    g.fillGradientStyle(0x7a6030, 0x7a6030, 0xe89040, 0xe89040, 1);
    g.fillRect(0, 0, W, WH * 0.50);

    // Warm horizon band
    g.fillGradientStyle(0xe89040, 0xe89040, 0xd07830, 0xd07830, 1);
    g.fillRect(0, WH * 0.50, W, WH * 0.12);

    // Deep sea blue-green below horizon
    g.fillGradientStyle(0x1a5058, 0x1a5058, 0x0e3840, 0x0e3840, 1);
    g.fillRect(0, WH * 0.62, W, WH * 0.38);

    // Sun near horizon (partially set)
    g.fillStyle(0xffe090, 0.9);
    g.fillCircle(W * 0.72, WH * 0.54, 24);
    g.fillStyle(0xffa030, 0.3);
    g.fillCircle(W * 0.72, WH * 0.54, 36);
    g.fillStyle(0xff8020, 0.15);
    g.fillCircle(W * 0.72, WH * 0.54, 52);

    // Sun reflection on water
    g.fillStyle(0xe09030, 0.25);
    g.fillRect(W * 0.66, WH * 0.62, 80, WH * 0.38);

    // Distant rocky outcrop on horizon
    g.fillStyle(0x1a1810, 1);
    g.fillEllipse(W * 0.28, WH * 0.60, 120, 22);
    g.fillEllipse(W * 0.35, WH * 0.59, 80, 16);
  }

  _drawRockyShore(W, H, WH) {
    const g = this.add.graphics();

    // Main dark volcanic rock — lower half of scene
    g.fillStyle(0x252018, 1);
    g.fillRect(0, WH * 0.62, W, WH * 0.38);

    // Large rock formations — angular volcanic shapes
    // Left cluster
    g.fillStyle(0x201c14, 1);
    g.fillTriangle(0, WH * 0.72, 60, WH * 0.62, 120, WH * 0.78);
    g.fillTriangle(30, WH * 0.68, 90, WH * 0.62, 90, WH * 0.78);
    g.fillStyle(0x1a1810, 1);
    g.fillTriangle(0, WH * 0.68, 40, WH * 0.62, 70, WH * 0.75);

    // Center rocks
    g.fillStyle(0x282218, 1);
    g.fillTriangle(W * 0.3, WH * 0.64, W * 0.42, WH * 0.56, W * 0.50, WH * 0.68);
    g.fillTriangle(W * 0.40, WH * 0.66, W * 0.52, WH * 0.60, W * 0.58, WH * 0.70);

    // Right cliff face (where Mira sits)
    g.fillStyle(0x1e1a12, 1);
    g.fillRect(W * 0.68, WH * 0.40, W * 0.32, WH * 0.60);
    g.fillTriangle(W * 0.68, WH * 0.40, W * 0.78, WH * 0.35, W * 0.90, WH * 0.44);

    // Cliff edge detail — angular facets
    g.fillStyle(0x282216, 1);
    g.fillTriangle(W * 0.68, WH * 0.48, W * 0.74, WH * 0.42, W * 0.74, WH * 0.58);
    g.fillStyle(0x1a1610, 1);
    g.fillTriangle(W * 0.74, WH * 0.42, W * 0.82, WH * 0.38, W * 0.82, WH * 0.52);

    // Rock surface lines
    g.lineStyle(1, 0x3a3020, 0.5);
    g.lineBetween(W * 0.68, WH * 0.50, W * 0.78, WH * 0.48);
    g.lineBetween(W * 0.72, WH * 0.58, W * 0.84, WH * 0.54);
    g.lineBetween(W * 0.76, WH * 0.66, W * 0.90, WH * 0.62);

    // Path along cliff (winding line)
    g.lineStyle(2, 0x3a3020, 0.7);
    g.beginPath();
    g.moveTo(W * 0.42, WH - 10);
    g.lineTo(W * 0.52, WH * 0.82);
    g.lineTo(W * 0.60, WH * 0.72);
    g.lineTo(W * 0.65, WH * 0.62);
    g.lineTo(W * 0.70, WH * 0.55);
    g.strokePath();
  }

  _drawTidePools(W, H, WH) {
    const g = this.add.graphics().setDepth(4);

    // Left foreground tide pool
    g.fillStyle(0x1a4858, 0.7);
    g.fillEllipse(W * 0.18, WH * 0.84, 130, 36);
    g.lineStyle(1, 0x2a6878, 0.6);
    g.strokeEllipse(W * 0.18, WH * 0.84, 130, 36);

    // Sea glass in left pool
    const glass1 = [
      { c: 0x5ab890, x: W * 0.10, y: WH * 0.83 },
      { c: 0x3a90c0, x: W * 0.14, y: WH * 0.85 },
      { c: 0x70c8b0, x: W * 0.18, y: WH * 0.82 },
      { c: 0xe8c060, x: W * 0.22, y: WH * 0.84 },
      { c: 0x60b0d0, x: W * 0.26, y: WH * 0.83 },
      { c: 0x7ad0b8, x: W * 0.16, y: WH * 0.86 },
    ];
    glass1.forEach(d => {
      g.fillStyle(d.c, 0.85);
      g.fillCircle(d.x, d.y, 5);
    });

    // Center pool
    g.fillStyle(0x1a4858, 0.65);
    g.fillEllipse(W * 0.48, WH * 0.88, 100, 28);
    g.lineStyle(1, 0x2a6878, 0.5);
    g.strokeEllipse(W * 0.48, WH * 0.88, 100, 28);

    const glass2 = [
      { c: 0x5ab890, x: W * 0.43, y: WH * 0.88 },
      { c: 0xe8a040, x: W * 0.47, y: WH * 0.87 },
      { c: 0x4090c0, x: W * 0.52, y: WH * 0.88 },
    ];
    glass2.forEach(d => {
      g.fillStyle(d.c, 0.85);
      g.fillCircle(d.x, d.y, 4);
    });
  }

  _drawWreckHorizon(W, H, WH) {
    const g = this.add.graphics().setDepth(3);

    // Ship's mast tip above water at horizon
    const mx = W * 0.42;
    const my = WH * 0.56;

    // Mast
    g.lineStyle(2, 0x3a2a18, 0.85);
    g.lineBetween(mx, my, mx, my + 30);

    // Crow's nest suggestion
    g.fillStyle(0x3a2a18, 0.85);
    g.fillRect(mx - 5, my - 2, 10, 6);

    // Rigging lines
    g.lineStyle(1, 0x3a2a18, 0.5);
    g.lineBetween(mx, my, mx - 14, my + 20);
    g.lineBetween(mx, my, mx + 14, my + 20);

    // Label
    this.add.text(mx + 18, my + 10, 'The Sable Dawn', {
      fontFamily: 'Georgia, serif', fontSize: '8px',
      color: '#8a7060', fontStyle: 'italic',
    }).setDepth(4).setAlpha(0.6);
  }

  _drawTideKingShrine(W, H, WH) {
    const g  = this.add.graphics().setDepth(5);
    const sx = W * 0.09;
    const sy = WH * 0.52;

    // Cliff-carved niche
    g.fillStyle(0x1a1610, 1);
    g.fillRect(sx - 22, sy, 44, 60);
    g.lineStyle(2, 0x3a3020, 1);
    g.strokeRect(sx - 22, sy, 44, 60);

    // Arch at top
    g.fillStyle(0x282018, 1);
    g.fillEllipse(sx, sy, 44, 24);

    // Tide King symbol (wave-and-crown)
    g.lineStyle(1.5, 0x5a90a0, 0.8);
    // Wave
    g.beginPath();
    g.moveTo(sx - 12, sy + 26);
    g.lineTo(sx - 6,  sy + 20);
    g.lineTo(sx,      sy + 26);
    g.lineTo(sx + 6,  sy + 20);
    g.lineTo(sx + 12, sy + 26);
    g.strokePath();
    // Crown
    g.fillStyle(0x5a90a0, 0.7);
    g.fillTriangle(sx - 10, sy + 38, sx - 14, sy + 50, sx - 6, sy + 50);
    g.fillTriangle(sx,      sy + 34, sx - 4,  sy + 50, sx + 4, sy + 50);
    g.fillTriangle(sx + 10, sy + 38, sx + 6,  sy + 50, sx + 14, sy + 50);
    g.fillRect(sx - 14, sy + 48, 28, 4);

    // Candle offering
    g.fillStyle(0xf0e8d0, 1);
    g.fillRect(sx - 3, sy + 54, 6, 14);
    g.fillStyle(0xffcc40, 0.8);
    g.fillCircle(sx, sy + 52, 3);

    this.add.text(sx, sy + 72, "Tide King\nShrine", {
      fontFamily: 'Georgia, serif', fontSize: '8px',
      color: '#5a90a0', fontStyle: 'italic', align: 'center',
    }).setOrigin(0.5, 0).setDepth(6).setAlpha(0.7);
  }

  _drawMira(W, H, WH) {
    const g  = this.add.graphics().setDepth(8);
    const mx = W * 0.82;
    const my = WH * 0.48;

    // Sitting figure at cliff edge, facing the sea
    // Lower body / sitting position
    g.fillStyle(0x2a3848, 1);
    g.fillEllipse(mx, my + 30, 50, 20);  // lap/skirt

    // Legs dangling over edge
    g.fillStyle(0x2a3848, 1);
    g.fillRect(mx - 14, my + 30, 10, 24);
    g.fillRect(mx + 4,  my + 30, 10, 24);

    // Torso
    g.fillStyle(0x384858, 1);
    g.fillTriangle(mx - 16, my + 30, mx + 16, my + 30, mx, my);

    // Left arm resting on rock
    g.fillStyle(0x384858, 1);
    g.fillRect(mx - 28, my + 14, 16, 8);

    // Right arm slightly raised, watching
    g.fillStyle(0x384858, 1);
    g.fillRect(mx + 12, my + 8, 14, 8);

    // Neck
    g.fillStyle(0xb08060, 1);
    g.fillRect(mx - 4, my - 10, 8, 12);

    // Head
    g.fillStyle(0xb08060, 1);
    g.fillEllipse(mx, my - 18, 24, 28);

    // Dark hair — long, wind-moved
    g.fillStyle(0x1a1410, 1);
    g.fillEllipse(mx, my - 26, 28, 14);
    // Hair flowing behind (wind)
    g.fillStyle(0x1a1410, 0.85);
    g.fillTriangle(mx - 8, my - 28, mx - 30, my - 10, mx - 12, my);
    g.fillTriangle(mx - 6, my - 26, mx - 22, my, mx - 4, my + 4);

    // Salt-worn clothing texture lines
    g.lineStyle(1, 0x4a5868, 0.4);
    g.lineBetween(mx - 14, my + 10, mx - 8, my + 26);
    g.lineBetween(mx + 4,  my + 10, mx + 10, my + 26);

    // Expression: sad, watching sea — small dots for eyes (in profile/3/4 view)
    g.fillStyle(0x2a1a10, 1);
    g.fillCircle(mx + 4, my - 20, 2);

    // Animate: slight sway (watching the waves)
    this.tweens.add({
      targets: g,
      angle: { from: -1.5, to: 1.5 },
      duration: 3800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this.add.text(mx, my + 60, 'Selkie Mira', {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: '#5a8090', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(9).setAlpha(0.7);
  }

  // ── Hotspots ──────────────────────────────────────────────────

  _buildHotspots(W, H, WH) {
    const defs = [
      // 1. Selkie Mira
      {
        id: 'mira', name: 'Selkie Mira',
        x: W * 0.82, y: WH * 0.60, w: 80, h: 110,
        look: () => this._miraLook(),
        talk: () => this._miraTalk(),
        take: () => this._narrate("Mira is not something you take. She is a person who has been waiting here long enough."),
        use:  () => this._miraTalk(),
      },
      // 2. Tide pools / sea glass
      {
        id: 'tidepools', name: 'Tide Pools',
        x: W * 0.18, y: WH * 0.84, w: 140, h: 44,
        look: () => this._narrate("The pools are filled with sea glass — every color. It catches the light beautifully."),
        talk: () => this._narrate("The tide pools don't talk. They just collect beautiful things."),
        take: () => this._narrate("There's sea glass everywhere, but something specific needs to come from the wreck."),
        use:  () => this._narrate("The tide pools offer only their beauty right now."),
      },
      // 3. Distant wreck
      {
        id: 'wreck', name: 'The Sable Dawn (wreck)',
        x: W * 0.42, y: WH * 0.56, w: 60, h: 50,
        look: () => this._narrate("The mast of the Sable Dawn. Still standing after eleven years, which is more than most things manage."),
        talk: () => this._narrate("The wreck is silent, as wrecks tend to be."),
        take: () => this._narrate("The wreck is somewhat large to take with you."),
        use:  () => this._narrate("You cannot reach it from here. The water is deep."),
      },
      // 4. Tide King Shrine
      {
        id: 'shrine', name: 'Tide King Shrine',
        x: W * 0.09, y: WH * 0.65, w: 55, h: 90,
        look: () => this._narrate("The cliff-carved shrine of the Tide King of Poolville. Ancient. Someone has left a fresh candle."),
        talk: () => this._shrineEnter(),
        take: () => this._narrate("The shrine belongs to the cliff."),
        use:  () => this._shrineEnter(),
      },
      // 5. Path to Obsidian Isle
      {
        id: 'exit_obsidian', name: 'Path to Obsidian Isle',
        x: W * 0.50, y: WH - 18, w: 160, h: 36,
        look: () => this._narrate(GameState.getFlag('mira_done')
          ? "The way forward, toward the Obsidian Isle."
          : "We need to find Mira and the Sea-Glass Heart first."),
        talk: () => this._narrate("The path waits."),
        take: () => this._narrate("You cannot take the path."),
        use:  () => this._exitToObsidian(),
      },
      // 6. Exit back to Sunken Garden
      {
        id: 'exit_back', name: '← Back (Sunken Garden)',
        x: W * 0.06, y: WH - 18, w: 120, h: 36,
        look: () => this._narrate("The way back to the Sunken Garden."),
        talk: () => this._narrate("The path waits."),
        take: () => this._narrate("You cannot take the path."),
        use:  () => {
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.time.delayedCall(500, () => this.scene.start('SunkenGardenScene'));
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

  _miraLook() {
    if (!GameState.getFlag('mira_met')) {
      this._narrate("A woman sits at the cliff edge, watching the sea. She has been there long enough that the wind has memorized her.");
    } else if (GameState.getFlag('mira_done')) {
      this._narrate("Mira watches the sea. She seems lighter now, as if something long-held has been set down.");
    } else {
      this._narrate("She watches the water. Waiting. Eleven years of practice at waiting.");
    }
  }

  _miraTalk() {
    if (GameState.getFlag('mira_done')) {
      // Repeat dialogue
      this.dialogue.play(DIALOGUE_MIRA_REPEAT);
      return;
    }

    if (!GameState.getFlag('mira_met')) {
      GameState.setFlag('mira_met');
      // First meeting
      this.dialogue.play(DIALOGUE_MIRA_FIRST, () => {
        // After first dialogue: check for manifest
        this._checkMiraManifest();
      });
    } else {
      // Already met, check manifest again
      this._checkMiraManifest();
    }
  }

  _checkMiraManifest() {
    if (GameState.hasItem('ships_manifest')) {
      // Show manifest, Mira dives
      this.dialogue.play(DIALOGUE_MIRA_RECEIVES_SKIN, () => {
        // Mira dives and finds the heart + sealskin
        this.dialogue.play(DIALOGUE_MIRA_WRECK, () => {
          GameState.addItem('seaglass_heart');
          GameState.addItem('mira_sealskin');
          GameState.setFlag('mira_done');
          this.setStatus("You received the Sea-Glass Heart and Mira's sealskin.");
        });
      });
    } else {
      this._narrate("Mira listens, but something is still missing. The manifest from the Sable Dawn — that would tell her what she needs to know.");
    }
  }

  _shrineEnter() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start('TideKingScene'));
  }

  _exitToObsidian() {
    if (!GameState.getFlag('mira_done')) {
      this._narrate("We need to find Mira and the Sea-Glass Heart first.");
      return;
    }
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start('ObsidianIsleScene'));
  }

  // ── Helpers ───────────────────────────────────────────────────

  _narrate(text) {
    this.dialogue.play([{ speaker: 'narrator', text }]);
  }

  update() { if (this.dialogue) this.dialogue.update(); }
}
