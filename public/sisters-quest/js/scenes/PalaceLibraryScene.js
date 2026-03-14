// ============================================================
// scenes/PalaceLibraryScene.js — Sisters' Quest
// Act 1, Room 2: The Palace Library
// Extends BaseScene — verb bar and inventory built in.
// Puzzle: collect three books, then leave the palace.
// ============================================================

class PalaceLibraryScene extends BaseScene {
  constructor() { super({ key: 'PalaceLibraryScene' }); }

  preload() {
    this.load.image('bg_library', 'assets/backgrounds/palace-library.jpg');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('PalaceLibraryScene');

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_library').setDisplaySize(W, WH).setDepth(0);

    // ── Animated fire flicker ─────────────────────────────────
    const fireG = this.add.graphics().setDepth(1);
    this.tweens.add({
      targets: fireG, alpha: { from: 0.65, to: 1.0 },
      duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        fireG.clear();
        const a = fireG.alpha;
        fireG.fillStyle(0xd04808, 0.20 * a);
        fireG.fillCircle(W - 50, WH - 105, 155);
        fireG.fillStyle(0xe06820, 0.12 * a);
        fireG.fillCircle(W - 50, WH - 105, 220);
      },
    });

    // ── Book markers (gameplay indicators for shelf books) ────
    const dX = W/2 - 10, dY = WH - 138;
    const books = [
      { key: 'magical_fibers',       color: 0x2d5016, sym: '📗', label: 'Fibers',  dy: -34 },
      { key: 'curses_seventh_kind',  color: 0x5c0a0a, sym: '📕', label: 'Curses',  dy: 12  },
      { key: 'weavers_atlas',        color: 0x0a2040, sym: '🗺',  label: 'Atlas',   dy: 58  },
    ];
    books.forEach(b => {
      if (GameState.hasItem(b.key)) return;
      const bx = dX + 218 + 12, by = dY + b.dy;
      const bg2 = this.add.graphics().setDepth(4);
      bg2.fillStyle(b.color, 0.75);
      bg2.fillRoundedRect(bx, by, 34, 34, 3);
      bg2.lineStyle(1.5, 0xc8956c, 0.55);
      bg2.strokeRoundedRect(bx, by, 34, 34, 3);
      this.add.text(bx+17, by+12, b.sym,   { fontFamily:'Arial',         fontSize:'16px' }).setOrigin(0.5).setDepth(5);
      this.add.text(bx+17, by+26, b.label, { fontFamily:'Georgia, serif', fontSize:'8px',  color:'#c8956c' }).setOrigin(0.5).setDepth(5);
    });

    // ── Exit door label ───────────────────────────────────────
    this.add.text(W-30, 68, 'Exit →', {
      fontFamily:'Georgia, serif', fontSize:'10px', color:'#4a3010', fontStyle:'italic'
    }).setOrigin(0.5).setDepth(4);

    // ── Mackenzie character ───────────────────────────────────
    this._drawMackenzie(W, H);

    this.add.text(W / 2, 18, "The Palace Library  ·  Palace of Elderwyn", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#3a3020', fontStyle: 'italic',
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
      this._checkAllBooks();
    });

    // ── Hotspots ──────────────────────────────────────────────
    this._hotspots = [];
    this._locked   = false;
    this._buildHotspots(W, H);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // Entrance narration (slight delay so scene is fully ready)
    this.cameras.main.fadeIn(400, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this._play(DIALOGUE_LIBRARY_ENTER);
    });

    this._updateStatus();
  }

  _drawMackenzie(W, H) {
    const WH = H - 156;
    const g  = this.add.graphics().setDepth(8);
    const mx = W * 0.20, my = WH - 168;

    // Green cloak
    g.fillStyle(0x2d5016, 1);
    g.fillTriangle(mx, my, mx-24, my+80, mx+24, my+80);
    // Head
    g.fillStyle(0xc8906a, 1); g.fillCircle(mx, my-14, 15);
    // Dark braid
    g.fillStyle(0x1a0e08, 1);
    g.fillEllipse(mx, my-22, 30, 16);
    g.fillRect(mx+10, my-18, 4, 26);
    // Scar
    g.lineStyle(1, 0xa06050, 1); g.lineBetween(mx+2, my-4, mx+5, my-1);
    // Arms
    g.fillStyle(0x3a6a20, 1);
    g.fillRect(mx-20, my+18, 16, 8);
    g.fillRect(mx+4,  my+18, 16, 8);

    // Subtle pacing animation
    this.tweens.add({
      targets: g, x: { from: 0, to: 14 },
      duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
  }

  // ── Hotspots ────────────────────────────────────────────────

  _buildHotspots(W, H) {
    const WH = H - 156;
    const defs = [
      {
        id: 'book_fibers', name: '"Magical Fibers of the Known World"',
        x: W*0.20, y: WH*0.35, w: 118, h: 95,
        look: () => this._play([{ speaker:'cambrie', text:"'Magical Fibers of the Known World.' This has everything on moonveil thread. Let me take it." }]),
        talk: () => this._narrate("Books don't talk. In this palace you've stopped assuming."),
        take: () => this._takeBook('magical_fibers', DIALOGUE_FIBERS_FOUND),
        use:  () => this._takeBook('magical_fibers', DIALOGUE_FIBERS_FOUND),
      },
      {
        id: 'book_curses', name: '"Curses of the Seventh Kind"',
        x: W*0.47, y: WH*0.28, w: 118, h: 95,
        look: () => this._play([{ speaker:'cambrie', text:"'Curses of the Seventh Kind.' Grim but necessary reading." }]),
        talk: () => this._narrate("The book on curses looks as grim as expected."),
        take: () => this._takeBook('curses_seventh_kind', DIALOGUE_CURSES_FOUND),
        use:  () => this._takeBook('curses_seventh_kind', DIALOGUE_CURSES_FOUND),
      },
      {
        id: 'book_atlas', name: "The Weaver's Atlas",
        x: W*0.66, y: WH*0.35, w: 118, h: 95,
        look: () => this._play([{ speaker:'cambrie', text:"The Weaver's Atlas. Maps of magical craftwork. If Vessa has a tower, this will know where." }]),
        talk: () => this._narrate("An atlas. It maps things that were woven, once."),
        take: () => this._takeBook('weavers_atlas', DIALOGUE_ATLAS_FOUND),
        use:  () => this._takeBook('weavers_atlas', DIALOGUE_ATLAS_FOUND),
      },
      {
        id: 'mackenzie', name: 'Mackenzie',
        x: W*0.20, y: WH-125, w: 60, h: 85,
        look: () => this._narrate("Your sister paces with the focused energy of someone who has decided action is imminent, plans or not."),
        talk: () => this._play(
          GameState.getFlag('atlas_done') ? [{ speaker:'mackenzie', text:"We have what we need. The door. Now." }]
                                          : DIALOGUE_MACKENZIE_PACE
        ),
        take: () => this._narrate("You can't take Mackenzie. She would have opinions."),
        use:  () => this._narrate("Your sister is not a tool."),
      },
      {
        id: 'desk', name: 'Reading Desk',
        x: W/2+100, y: WH-88, w: 230, h: 78,
        look: () => this._narrate("A large desk covered in research notes left by scholars who had the luxury of time. Someone was very interested in enchanted thread."),
        talk: () => this._narrate("The desk keeps its own counsel."),
        take: () => this._cantTake('the desk'),
        use:  () => {
          if (VerbSystem.activeItem === 'sealed_letter') {
            this._play([
              { speaker:'cambrie', text:"I'm not burning Mother's letter." },
              { speaker:'mackenzie', text:"Good. Don't." },
            ]);
          } else {
            this._narrate("Cambrie resists the urge to reorganize everything. Barely.");
          }
        },
      },
      {
        id: 'fireplace', name: 'Fireplace',
        x: W-48, y: WH-130, w: 108, h: 158,
        look: () => this._narrate("The fire crackles warmly. In other circumstances this would be a pleasant room to spend an evening."),
        talk: () => this._narrate("The fire has nothing to add."),
        take: () => this._narrate("You are not going to take the fireplace."),
        use:  () => this._narrate("Nothing needs to go into the fire."),
      },
      {
        id: 'door', name: 'Palace Gates',
        x: W-28, y: WH/2+20, w: 54, h: WH*0.5,
        look: () => this._doorLook(),
        talk: () => this._narrate("Doors don't talk. This one especially."),
        take: () => this._cantTake('the door'),
        use:  () => this._doorUse(),
      },
    ];

    defs.forEach(def => {
      const outline = this.add.graphics().setDepth(49);
      const zone    = this.add.zone(def.x, def.y, def.w, def.h)
        .setInteractive({ useHandCursor: true })
        .setDepth(50);

      zone.on('pointerover', () => {
        if (this._locked) return;
        outline.clear();
        outline.lineStyle(1.5, 0xc8956c, 0.4);
        outline.strokeRect(def.x - def.w/2, def.y - def.h/2, def.w, def.h);
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

  // ── Book taking ──────────────────────────────────────────────

  _takeBook(key, lines) {
    if (GameState.hasItem(key)) {
      this._narrate("You've already taken that book.");
      return;
    }
    this._play(lines, () => {
      GameState.addItem(key);
      // Grey out the hotspot after taking
      const h = this._hotspots.find(hs => hs.def.id === 'book_' + key.split('_')[0]);
      if (h) {
        h.outline.clear();
        h.outline.lineStyle(1, 0x333333, 0.2);
        h.outline.strokeRect(
          h.def.x - h.def.w/2, h.def.y - h.def.h/2, h.def.w, h.def.h
        );
      }
      this._checkAllBooks();
    });
  }

  _checkAllBooks() {
    const hasF = GameState.hasItem('magical_fibers');
    const hasC = GameState.hasItem('curses_seventh_kind');
    const hasA = GameState.hasItem('weavers_atlas');

    this._updateStatus();

    if (hasF && hasC && hasA && !GameState.getFlag('atlas_done')) {
      GameState.setFlag('atlas_done', true);
      // Atlas dialogue already played via _takeBook; just refresh status
      this.setStatus('All three books found. Use the door to leave the palace.');
    }
  }

  _updateStatus() {
    const found = [
      GameState.hasItem('magical_fibers'),
      GameState.hasItem('curses_seventh_kind'),
      GameState.hasItem('weavers_atlas'),
    ].filter(Boolean).length;

    if (found < 3) {
      this.setStatus(`Books found: ${found} of 3  ·  Search the shelves.`);
    } else {
      this.setStatus('All three books found.  ·  Use the door to leave.');
    }
  }

  // ── Door ─────────────────────────────────────────────────────

  _doorLook() {
    const hasAll = GameState.hasItem('magical_fibers') &&
                   GameState.hasItem('curses_seventh_kind') &&
                   GameState.hasItem('weavers_atlas');
    this._narrate(hasAll
      ? "The palace gates. Everything you need is already in Cambrie's bag."
      : "The way out — but not yet. You still need to find the books."
    );
  }

  _doorUse() {
    const hasAll = GameState.hasItem('magical_fibers') &&
                   GameState.hasItem('curses_seventh_kind') &&
                   GameState.hasItem('weavers_atlas');
    if (!hasAll) {
      this._play(DIALOGUE_EXIT_BLOCKED);
    } else {
      this._play(DIALOGUE_ACT1_COMPLETE, () => {
        GameState.save('Act1EndScene');
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.time.delayedCall(600, () => this.scene.start('Act1EndScene'));
      });
    }
  }

  // ── Helpers ──────────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }

  _narrate(text) { this._play([{ speaker: 'narrator', text }]); }

  _cantTake(name) {
    this._narrate(Phaser.Math.RND.pick([
      `Taking ${name} won't help.`,
      `${name.charAt(0).toUpperCase() + name.slice(1)} is staying where it is.`,
      `Mackenzie has already ruled this out.`,
    ]));
  }

  update() { if (this.dialogue) this.dialogue.update(); }
}
