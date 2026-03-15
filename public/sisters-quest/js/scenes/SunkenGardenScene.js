// ============================================================
// scenes/SunkenGardenScene.js — Sisters' Quest: The Moonveil Crown
// The Sunken Garden — ancient walled garden half-swallowed by the
// sea, with a stone fountain and Prince Dorian's statue.
// ============================================================

class SunkenGardenScene extends BaseScene {
  constructor() { super({ key: 'SunkenGardenScene' }); }

  preload() { this.load.image('bg_garden', 'assets/backgrounds/sunken-garden.jpg'); }

  create() {
    MusicManager.play(this, 'music_mystic');
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('SunkenGardenScene');

    // ── World ─────────────────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_garden').setDisplaySize(W, WH).setDepth(0);
    this._drawMoonveilPlants(W, H, WH);
    this._drawTidalPools(W, H, WH);
    this._dorianAwake = GameState.getFlag('dorian_awake');
    this.add.image(W * 0.78, WH * 0.65, 'portrait_dorian')
      .setDisplaySize(180, 180).setOrigin(0.5, 1).setDepth(1);

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

    // Glow dots at tips — bright silver-white
    g.fillStyle(0xe8f0ec, 0.80);
    stems.forEach(s => g.fillCircle(s.tx, s.ty, 4));
    g.fillStyle(0xffffff, 0.55);
    stems.forEach(s => g.fillCircle(s.tx, s.ty, 2.5));

    // Ambient cluster glow — silver light pooling at base
    const glowG = this.add.graphics().setDepth(5);
    const _drawMoonveilGlow = (alpha) => {
      glowG.clear();
      // Wide ambient bloom
      glowG.fillStyle(0xb8d8d0, 0.14 * alpha);
      glowG.fillEllipse(px, py - 10, 140, 90);
      // Mid glow
      glowG.fillStyle(0xcce8e0, 0.24 * alpha);
      glowG.fillEllipse(px, py - 15, 90, 60);
      // Bright core around plant tips
      glowG.fillStyle(0xe8f8f4, 0.38 * alpha);
      glowG.fillEllipse(px, py - 20, 55, 40);
      // Individual tip blooms
      stems.forEach(s => {
        glowG.fillStyle(0xffffff, 0.30 * alpha);
        glowG.fillCircle(s.tx, s.ty, 7);
      });
    };
    _drawMoonveilGlow(1.0);

    // Pulsing tween with redraw
    this.tweens.add({
      targets: glowG, alpha: { from: 0.65, to: 1.0 },
      duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => _drawMoonveilGlow(glowG.alpha),
    });

    // Also gently pulse the stem graphics
    this.tweens.add({
      targets: g, alpha: { from: 0.80, to: 1.0 },
      duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Label
    this.add.text(px + 10, py - 55, 'Moonveil plants', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#9ab0aa',
      fontStyle: 'italic',
    }).setOrigin(0).setDepth(7).setAlpha(0.6);
  }

  _drawTidalPools(W, H, WH) {
    // Animated pool shimmer — sunlight on water surface
    const shimmerG = this.add.graphics().setDepth(4);
    this.tweens.add({
      targets: shimmerG, alpha: { from: 0.4, to: 1.0 },
      duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        shimmerG.clear();
        const t = Date.now() / 2200;
        // Left pool shimmer streak
        shimmerG.fillStyle(0x90d8e8, 0.35);
        shimmerG.fillEllipse(64 + Math.sin(t) * 8, WH * 0.84, 28, 5);
        shimmerG.fillStyle(0xb0f0f8, 0.22);
        shimmerG.fillEllipse(50 + Math.cos(t * 1.3) * 6, WH * 0.835, 14, 3);
        // Right pool shimmer streak
        shimmerG.fillStyle(0x90d8e8, 0.35);
        shimmerG.fillEllipse(W - 64 + Math.sin(t + 1) * 10, WH * 0.80, 32, 5);
        shimmerG.fillStyle(0xb0f0f8, 0.22);
        shimmerG.fillEllipse(W - 78 + Math.cos(t * 0.9) * 7, WH * 0.795, 16, 3);
      },
    });
  }

  _redrawDorianAwake(W, H, WH) {
    // Called after waking Dorian — flash effect
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
