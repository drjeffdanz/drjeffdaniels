// ============================================================
// scenes/PalaceLibraryScene.js — Sisters' Quest
// Act 1, Room 2: The Palace Library
// Puzzle: find three books (Magical Fibers, Curses, Weaver's Atlas)
// ============================================================

class PalaceLibraryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PalaceLibraryScene' });
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.WORLD_H = this.H - 156;
    this._dialogueLock = false;

    GameState.setCurrentScene('PalaceLibraryScene');

    this._drawBackground();
    this._drawShelves();
    this._drawFurniture();
    this._drawMackenzie();

    this._sceneLabel = this.add.text(this.W / 2, 18, "The Palace Library  ·  Palace of Elderwyn", {
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      color: '#555555',
      fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    this.dialogue = new DialogueSystem(this);

    this.events.on('sq_dialogue_start', () => {
      this._dialogueLock = true;
      this._disableHotspots();
      this.game.events.emit('sq_dialogue_start_global');
    });

    this.events.on('sq_dialogue_end', () => {
      this._dialogueLock = false;
      this._enableHotspots();
      this.game.events.emit('sq_dialogue_end_global');
      this._checkAllBooksFound();
    });

    this._hotspots = [];
    this._buildHotspots();

    // Entrance narration
    this.time.delayedCall(300, () => {
      this.dialogue.play(DIALOGUE_LIBRARY_ENTER);
      const ui = this.scene.get('UIScene');
      if (ui) ui.setStatus('Find three books to understand what you\'re facing.');
    });

    // Book-found status
    this._updateBookStatus();
  }

  // ── Background ──────────────────────────────────────────────

  _drawBackground() {
    const g = this.add.graphics();
    const W = this.W;
    const H = this.WORLD_H;

    // Warm dark wood atmosphere
    g.fillGradientStyle(0x100a04, 0x100a04, 0x160e06, 0x160e06, 1);
    g.fillRect(0, 0, W, H);

    // Ceiling
    g.fillStyle(0x0c0804, 1);
    g.fillRect(0, 0, W, 24);

    // Floor — dark parquet
    g.fillStyle(0x0e0804, 1);
    g.fillRect(0, H - 55, W, 55);
    g.lineStyle(1, 0x1e1208, 1);
    g.lineBetween(0, H - 55, W, H - 55);

    // Parquet planks
    g.lineStyle(1, 0x1c1008, 0.8);
    for (let x = 0; x < W; x += 40) {
      g.lineBetween(x, H - 55, x, H);
    }

    // Fireplace (right side)
    this._drawFireplace(g, W - 90, H - 200);

    // Fireplace glow
    g.fillStyle(0xc85010, 0.06);
    g.fillRect(W - 260, H - 200, 260, 200);
  }

  _drawFireplace(g, x, y) {
    const W = 100;
    const H = 140;

    // Stone surround
    g.fillStyle(0x2a2018, 1);
    g.fillRect(x, y, W, H);
    g.lineStyle(2, 0x4a3828, 1);
    g.strokeRect(x, y, W, H);

    // Inner firebox
    g.fillStyle(0x0e0806, 1);
    g.fillRect(x + 12, y + 14, W - 24, H - 30);

    // Fire glow (gradient suggestion)
    g.fillStyle(0xc05010, 0.7);
    g.fillTriangle(x + 30, y + H - 30, x + 50, y + 40, x + 70, y + H - 30);
    g.fillStyle(0xe07020, 0.6);
    g.fillTriangle(x + 36, y + H - 30, x + 50, y + 55, x + 64, y + H - 30);
    g.fillStyle(0xf0b030, 0.5);
    g.fillTriangle(x + 42, y + H - 30, x + 50, y + 68, x + 58, y + H - 30);
    g.fillStyle(0xffd860, 0.4);
    g.fillTriangle(x + 46, y + H - 30, x + 50, y + 76, x + 54, y + H - 30);

    // Mantle
    g.fillStyle(0x3a2a18, 1);
    g.fillRect(x - 8, y - 12, W + 16, 14);
    g.lineStyle(1, 0x5a4228, 1);
    g.strokeRect(x - 8, y - 12, W + 16, 14);

    // Subtle fire flicker — animated in create() via tween
    this._fireX = x + 12;
    this._fireY = y + 14;
    this._fireW = W - 24;
    this._fireH = H - 30;
  }

  _drawShelves() {
    const g = this.add.graphics();
    const W = this.W;
    const H = this.WORLD_H;

    // Left bookshelf wall
    this._drawShelfSection(g, 0, 30, 160, H - 90);

    // Back wall shelves (center-left)
    this._drawShelfSection(g, 170, 30, W / 2 - 30, H - 90);

    // Right shelf (smaller, to left of fireplace)
    this._drawShelfSection(g, W / 2 + 20, 30, W - 220, H - 90);
  }

  _drawShelfSection(g, x1, y1, x2, y2) {
    const W = x2 - x1;
    const H = y2 - y1;
    const SHELF_H = 70;
    const NUM_SHELVES = Math.floor(H / SHELF_H);

    // Shelf backing
    g.fillStyle(0x1a0e06, 1);
    g.fillRect(x1, y1, W, H);
    g.lineStyle(1, 0x2a1a0a, 1);
    g.strokeRect(x1, y1, W, H);

    // Individual shelves
    for (let s = 0; s < NUM_SHELVES; s++) {
      const shelfY = y1 + s * SHELF_H;

      // Shelf plank
      g.fillStyle(0x3a2010, 1);
      g.fillRect(x1, shelfY + SHELF_H - 6, W, 6);
      g.lineStyle(1, 0x5a3818, 1);
      g.lineBetween(x1, shelfY + SHELF_H - 6, x1 + W, shelfY + SHELF_H - 6);

      // Books on shelf
      let bookX = x1 + 4;
      while (bookX < x1 + W - 10) {
        const bookW = Phaser.Math.Between(10, 20);
        const bookH = Phaser.Math.Between(36, SHELF_H - 12);
        const bookColors = [
          0x4a1a08, 0x1a3a0e, 0x08183a, 0x3a2a08,
          0x2a0a2a, 0x0a2a2a, 0x3a1a1a, 0x1a1a3a,
          0x4a3808, 0x2a3a18,
        ];
        const color = Phaser.Math.RND.pick(bookColors);
        g.fillStyle(color, 1);
        g.fillRect(bookX, shelfY + SHELF_H - 6 - bookH, bookW, bookH);

        // Spine highlight
        g.fillStyle(0xffffff, 0.04);
        g.fillRect(bookX, shelfY + SHELF_H - 6 - bookH, 2, bookH);

        // Occasional title line on spine
        if (Math.random() > 0.5) {
          g.lineStyle(1, 0xffffff, 0.08);
          g.lineBetween(bookX + 2, shelfY + SHELF_H - 14, bookX + bookW - 2, shelfY + SHELF_H - 14);
        }
        bookX += bookW + 1;
      }
    }
  }

  _drawFurniture() {
    const g = this.add.graphics();
    const W = this.W;
    const H = this.WORLD_H;

    // Large reading desk (center-right area)
    const deskX = W / 2 - 10;
    const deskY = H - 140;
    const deskW = 220;
    const deskH = 80;

    g.fillStyle(0x2e1a08, 1);
    g.fillRect(deskX, deskY, deskW, deskH);
    g.lineStyle(2, 0x5a3a14, 1);
    g.strokeRect(deskX, deskY, deskW, deskH);

    // Desk top highlight
    g.fillStyle(0xffffff, 0.03);
    g.fillRect(deskX + 2, deskY + 2, deskW - 4, 4);

    // Desk legs
    g.fillStyle(0x231506, 1);
    g.fillRect(deskX + 10, deskY + deskH, 16, 20);
    g.fillRect(deskX + deskW - 26, deskY + deskH, 16, 20);

    // Open book on desk
    g.fillStyle(0xf0e8d0, 1);
    g.fillRoundedRect(deskX + 30, deskY + 14, 80, 52, 2);
    g.lineStyle(1, 0xc8a870, 1);
    g.strokeRoundedRect(deskX + 30, deskY + 14, 80, 52, 2);
    // Book spine
    g.lineStyle(2, 0xaa8840, 1);
    g.lineBetween(deskX + 70, deskY + 14, deskX + 70, deskY + 66);
    // Text lines
    g.lineStyle(1, 0xb8a888, 0.5);
    for (let l = 0; l < 5; l++) {
      g.lineBetween(deskX + 34, deskY + 22 + l * 8, deskX + 68, deskY + 22 + l * 8);
      g.lineBetween(deskX + 74, deskY + 22 + l * 8, deskX + 108, deskY + 22 + l * 8);
    }

    // Quill and inkpot
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(deskX + 130, deskY + 36, 8);
    g.lineStyle(1, 0x3a3a3a, 1);
    g.strokeCircle(deskX + 130, deskY + 36, 8);
    g.lineStyle(1, 0xf5e8c0, 0.8);
    g.lineBetween(deskX + 140, deskY + 20, deskX + 126, deskY + 40);

    // Candle lamp on desk
    g.fillStyle(0x888830, 1);
    g.fillRect(deskX + 170, deskY + 16, 6, 30);
    g.fillStyle(0xffdd40, 0.9);
    g.fillEllipse(deskX + 173, deskY + 12, 8, 14);
    g.fillStyle(0xffee80, 0.3);
    g.fillCircle(deskX + 173, deskY + 14, 14);

    // ── Highlight: three special books on the desk surface as markers
    // (These are drawn faintly — the actual hotspots point to the shelves
    //  but we draw visible cues here too)
    this._drawSpecialBook(g, deskX + deskW + 20, deskY - 30, 0x2d5016, '📗', 'Fibers',
      !GameState.hasItem('magical_fibers'));
    this._drawSpecialBook(g, deskX + deskW + 20, deskY + 14, 0x5c0a0a, '📕', 'Curses',
      !GameState.hasItem('curses_seventh_kind'));
    this._drawSpecialBook(g, deskX + deskW + 20, deskY + 58, 0x0a2040, '🗺', 'Atlas',
      !GameState.hasItem('weavers_atlas'));

    this._deskRef = { deskX, deskY, deskW, deskH };
  }

  _drawSpecialBook(g, x, y, color, symbol, label, visible) {
    if (!visible) return;
    g.fillStyle(color, 0.8);
    g.fillRoundedRect(x, y, 34, 34, 3);
    g.lineStyle(1.5, 0xc8956c, 0.6);
    g.strokeRoundedRect(x, y, 34, 34, 3);

    this.add.text(x + 17, y + 13, symbol, {
      fontFamily: 'Arial', fontSize: '16px',
    }).setOrigin(0.5).setDepth(5);

    this.add.text(x + 17, y + 27, label, {
      fontFamily: 'Georgia, serif', fontSize: '8px', color: '#c8956c',
    }).setOrigin(0.5).setDepth(5);
  }

  _drawMackenzie() {
    const g = this.add.graphics().setDepth(8);
    const W = this.W;
    const H = this.WORLD_H;

    // Mackenzie pacing on the left side
    const mx = W * 0.22;
    const my = H - 170;

    // Green cloak figure
    g.fillStyle(0x2d5016, 1);
    g.fillTriangle(mx, my, mx - 24, my + 80, mx + 24, my + 80);

    // Head
    g.fillStyle(0xc8906a, 1);
    g.fillCircle(mx, my - 14, 15);

    // Dark braid
    g.fillStyle(0x1a0e08, 1);
    g.fillEllipse(mx, my - 22, 30, 16);
    g.fillRect(mx + 10, my - 18, 4, 30);

    // Scar on chin (tiny detail)
    g.lineStyle(1, 0xa06050, 1);
    g.lineBetween(mx + 2, my - 4, mx + 5, my - 1);

    // Arms folded / impatient stance
    g.fillStyle(0x3a6a20, 1);
    g.fillRect(mx - 20, my + 20, 16, 8);
    g.fillRect(mx + 4, my + 20, 16, 8);

    this._mackenzieGraphics = g;

    // Pacing tween (subtle left-right)
    this.tweens.add({
      targets: g,
      x: { from: 0, to: 12 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // ── Book found indicators ───────────────────────────────────

  _updateBookStatus() {
    const found = [
      GameState.hasItem('magical_fibers'),
      GameState.hasItem('curses_seventh_kind'),
      GameState.hasItem('weavers_atlas'),
    ].filter(Boolean).length;

    const ui = this.scene.get('UIScene');
    if (ui) {
      if (found === 3) {
        ui.setStatus('All three books found. Use the door to leave the palace.');
      } else {
        ui.setStatus(`Books found: ${found} of 3. Search the shelves.`);
      }
    }
  }

  _checkAllBooksFound() {
    this._updateBookStatus();
    if (GameState.hasItem('magical_fibers') &&
        GameState.hasItem('curses_seventh_kind') &&
        GameState.hasItem('weavers_atlas') &&
        !GameState.getFlag('atlas_dialogue_done')) {

      GameState.setFlag('atlas_dialogue_done', true);
      this.time.delayedCall(500, () => {
        this.dialogue.play(DIALOGUE_ATLAS_FOUND, () => {
          const ui = this.scene.get('UIScene');
          if (ui) ui.setStatus('Use the door — leave the palace now!');
        });
      });
    }
  }

  // ── Hotspots ────────────────────────────────────────────────

  _buildHotspots() {
    const W = this.W;
    const H = this.WORLD_H;

    const hotspotDefs = [
      // ── Special books ─────────────────────────────────────
      {
        id: 'book_fibers',
        name: '"Magical Fibers of the Known World"',
        x: W * 0.2, y: H * 0.35,
        w: 120, h: 100,
        look: () => this._lookBook('fibers'),
        talk: () => this._narratorSay("Books don't talk. Though in this palace, you've stopped assuming things."),
        take: () => this._takeBook('fibers'),
        use:  () => this._useBook('fibers'),
      },
      {
        id: 'book_curses',
        name: '"Curses of the Seventh Kind"',
        x: W * 0.46, y: H * 0.28,
        w: 120, h: 100,
        look: () => this._lookBook('curses'),
        talk: () => this._narratorSay("The book on curses looks as grim as you'd expect."),
        take: () => this._takeBook('curses'),
        use:  () => this._useBook('curses'),
      },
      {
        id: 'book_atlas',
        name: "The Weaver's Atlas",
        x: W * 0.66, y: H * 0.35,
        w: 120, h: 100,
        look: () => this._lookBook('atlas'),
        talk: () => this._narratorSay("An atlas. It maps things that were woven, once."),
        take: () => this._takeBook('atlas'),
        use:  () => this._useBook('atlas'),
      },
      // ── Mackenzie ─────────────────────────────────────────
      {
        id: 'mackenzie',
        name: 'Mackenzie',
        x: W * 0.22, y: H - 130,
        w: 60, h: 90,
        look: () => this._narratorSay("Your sister paces with the focused energy of someone who has decided that action is about to happen whether or not she knows what action to take."),
        talk: () => this._onTalkMackenzie(),
        take: () => this._narratorSay("You can't take Mackenzie. She'd have opinions about that."),
        use:  () => this._narratorSay("Your sister is not a tool. She would like you to know that."),
      },
      // ── Door ──────────────────────────────────────────────
      {
        id: 'door',
        name: 'Palace Gates',
        x: W - 30, y: H / 2,
        w: 50, h: H * 0.5,
        look: () => this._onDoorLook(),
        talk: () => this._narratorSay("Doors don't talk. This one especially."),
        take: () => this._cantTake('the door'),
        use:  () => this._onDoorUse(),
      },
      // ── Fireplace ─────────────────────────────────────────
      {
        id: 'fireplace',
        name: 'Fireplace',
        x: W - 40, y: H - 140,
        w: 110, h: 160,
        look: () => this._narratorSay("The fire crackles warmly. In other circumstances this would be a pleasant room to spend an evening."),
        talk: () => this._narratorSay("The fire has nothing useful to say."),
        take: () => this._narratorSay("You are not going to take the fireplace."),
        use:  () => {
          if (VerbSystem.activeItem === 'sealed_letter') {
            this.dialogue.play([
              { speaker: 'cambrie', text: "I'm not burning Mother's letter." },
              { speaker: 'mackenzie', text: "Good. Don't." },
            ]);
          } else {
            this._narratorSay("Nothing here needs to go into the fire.");
          }
        },
      },
      // ── Desk ──────────────────────────────────────────────
      {
        id: 'desk',
        name: 'Reading Desk',
        x: W / 2 + 100, y: H - 90,
        w: 230, h: 80,
        look: () => this._narratorSay("A large reading desk covered in open texts and research notes left by scholars long since gone to bed. Someone was very interested in the properties of enchanted thread."),
        talk: () => this._narratorSay("The desk keeps its own counsel."),
        take: () => this._cantTake('the desk'),
        use:  () => this._narratorSay("Cambrie resists the urge to rearrange all of this into a proper filing system. Barely."),
      },
    ];

    hotspotDefs.forEach(def => this._createHotspot(def));
  }

  _createHotspot(def) {
    const zone = this.add.zone(def.x, def.y, def.w, def.h)
      .setInteractive({ useHandCursor: true })
      .setDepth(50);

    const outline = this.add.graphics().setDepth(49);

    zone.on('pointerover', () => {
      if (this._dialogueLock) return;
      outline.clear();
      outline.lineStyle(1.5, 0xc8956c, 0.45);
      outline.strokeRect(def.x - def.w / 2, def.y - def.h / 2, def.w, def.h);
      const ui = this.scene.get('UIScene');
      if (ui) ui.setStatus(VerbSystem.getActionLabel() + ' · ' + def.name);
    });

    zone.on('pointerout', () => {
      outline.clear();
      const ui = this.scene.get('UIScene');
      if (ui) ui.setStatus('');
    });

    zone.on('pointerdown', () => {
      if (this._dialogueLock) return;
      const verb = VerbSystem.activeVerb;
      if (def[verb]) def[verb]();
    });

    this._hotspots.push({ zone, outline, def });
    return { zone, outline };
  }

  _disableHotspots() {
    this._hotspots.forEach(h => h.zone.disableInteractive());
  }

  _enableHotspots() {
    this._hotspots.forEach(h => {
      h.zone.setInteractive({ useHandCursor: true });
    });
  }

  // ── Book interaction handlers ───────────────────────────────

  _lookBook(which) {
    const map = {
      fibers:  [{ speaker: 'cambrie', text: "'Magical Fibers of the Known World.' This could tell us about moonveil thread — the component Vessa used in the Crown. Let me take it." }],
      curses:  [{ speaker: 'cambrie', text: "'Curses of the Seventh Kind.' Grim. But useful. This should explain what kind of magic we're dealing with." }],
      atlas:   [{ speaker: 'cambrie', text: "The Weaver's Atlas. A record of magical craftwork and the locations of their making. If Vessa has a tower, this would know where." }],
    };
    this.dialogue.play(map[which]);
  }

  _takeBook(which) {
    const itemMap = {
      fibers: 'magical_fibers',
      curses: 'curses_seventh_kind',
      atlas:  'weavers_atlas',
    };
    const dialogueMap = {
      fibers: DIALOGUE_FIBERS_FOUND,
      curses: DIALOGUE_CURSES_FOUND,
      atlas:  GameState.hasItem('magical_fibers') && GameState.hasItem('curses_seventh_kind')
                ? DIALOGUE_ATLAS_FOUND
                : [{ speaker: 'cambrie', text: "The Weaver's Atlas — Vessa's tower is marked inside. This is exactly what we needed." }],
    };

    const key = itemMap[which];
    if (GameState.hasItem(key)) {
      this._narratorSay("You've already taken that book. It's in Cambrie's bag.");
      return;
    }

    const lines = dialogueMap[which];
    this.dialogue.play(lines, () => {
      GameState.addItem(key);
      // Dim the hotspot outline after taking
      const h = this._hotspots.find(hs => hs.def.id === 'book_' + which);
      if (h) {
        h.zone.disableInteractive();
        h.outline.clear();
        h.outline.lineStyle(1, 0x333333, 0.2);
        h.outline.strokeRect(
          h.def.x - h.def.w / 2, h.def.y - h.def.h / 2,
          h.def.w, h.def.h
        );
        // Re-enable (greyed out) for look/talk only
        setTimeout(() => {
          h.zone.setInteractive({ useHandCursor: true });
        }, 50);
      }
      this._checkAllBooksFound();
    });
  }

  _useBook(which) {
    if (VerbSystem.activeItem) {
      this._narratorSay("That doesn't seem useful here. Try just taking the book.");
    } else {
      this._takeBook(which);
    }
  }

  // ── Other handlers ──────────────────────────────────────────

  _onTalkMackenzie() {
    if (GameState.getFlag('atlas_dialogue_done')) {
      this.dialogue.play([
        { speaker: 'mackenzie', text: "We have everything we need. The door. Now." },
      ]);
    } else {
      this.dialogue.play(DIALOGUE_MACKENZIE_PACE);
    }
  }

  _onDoorLook() {
    if (!GameState.hasItem('weavers_atlas')) {
      this._narratorSay("The way out. But you're not ready — you still need the Atlas to know where you're going.");
    } else {
      this._narratorSay("The palace gates. Everything else you need is already in Cambrie's bag.");
    }
  }

  _onDoorUse() {
    const hasAll = GameState.hasItem('magical_fibers') &&
                   GameState.hasItem('curses_seventh_kind') &&
                   GameState.hasItem('weavers_atlas');

    if (!hasAll) {
      this.dialogue.play(DIALOGUE_EXIT_BLOCKED);
    } else {
      this._leaveThePalace();
    }
  }

  _leaveThePalace() {
    this.dialogue.play(DIALOGUE_ACT1_COMPLETE, () => {
      GameState.save('Act1EndScene');
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.time.delayedCall(600, () => {
        this.scene.stop('UIScene');
        this.scene.start('Act1EndScene');
      });
    });
  }

  // ── Helpers ─────────────────────────────────────────────────

  _cantTake(name) {
    const phrases = [
      `Taking ${name} won't help.`,
      `${name.charAt(0).toUpperCase() + name.slice(1)} is not going anywhere.`,
      `Mackenzie has already considered this. The answer is no.`,
    ];
    this._narratorSay(Phaser.Math.RND.pick(phrases));
  }

  _narratorSay(text) {
    this.dialogue.play([{ speaker: 'narrator', text }]);
  }

  update() {
    if (this.dialogue) this.dialogue.update();
  }
}
