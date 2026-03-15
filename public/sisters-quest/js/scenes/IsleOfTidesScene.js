// ============================================================
// scenes/IsleOfTidesScene.js — Sisters' Quest: The Moonveil Crown
// The Isle of Tides — rocky island shore with tide pools and
// Selkie Mira.
// ============================================================

class IsleOfTidesScene extends BaseScene {
  constructor() { super({ key: 'IsleOfTidesScene' }); }

  preload() { this.load.image('bg_tides', 'assets/backgrounds/isle-of-tides.jpg'); }

  create() {
    MusicManager.play(this, 'music_mystic');
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('IsleOfTidesScene');

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_tides').setDisplaySize(W, WH).setDepth(0);

    // ── World ─────────────────────────────────────────────────
    this._drawTidePools(W, H, WH);

    // Portrait: Selkie Mira
    this.add.image(W * 0.82, WH * 0.88, 'sprite_mira')
      .setDisplaySize(96, 240).setOrigin(0.5, 1).setDepth(1);

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

    // Animated sunset shimmer on tide pools
    const shimmerG = this.add.graphics().setDepth(5);
    this.tweens.add({
      targets: shimmerG, alpha: { from: 0.3, to: 1.0 },
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        shimmerG.clear();
        const t = Date.now() / 2000;
        // Left pool — warm golden shimmer
        shimmerG.fillStyle(0xf0c060, 0.40);
        shimmerG.fillEllipse(W * 0.18 + Math.sin(t) * 10, WH * 0.84, 30, 5);
        shimmerG.fillStyle(0xffd880, 0.25);
        shimmerG.fillEllipse(W * 0.14 + Math.cos(t * 1.2) * 8, WH * 0.835, 15, 3);
        // Center pool shimmer
        shimmerG.fillStyle(0xe8b050, 0.35);
        shimmerG.fillEllipse(W * 0.48 + Math.sin(t + 1.5) * 8, WH * 0.88, 22, 4);
      },
    });
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
