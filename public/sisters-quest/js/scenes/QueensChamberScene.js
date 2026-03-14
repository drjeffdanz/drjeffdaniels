// ============================================================
// scenes/QueensChamberScene.js — Sisters' Quest
// Act 1, Room 1: The Queen's Chamber
// Extends BaseScene — verb bar and inventory built in.
// ============================================================

class QueensChamberScene extends BaseScene {
  constructor() { super({ key: 'QueensChamberScene' }); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    GameState.setCurrentScene('QueensChamberScene');

    // ── Room ──────────────────────────────────────────────────
    this._drawBackground(W, H);
    this._drawFurniture(W, H);
    this._drawQueenFigure(W, H);
    this._addMistParticles(W, H);

    // Scene label
    this.add.text(W / 2, 18, "The Queen's Chamber  ·  Palace of Elderwyn", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#3a3540', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Dialogue system ───────────────────────────────────────
    this.dialogue = new DialogueSystem(this);

    // Dialogue event handlers — lock / unlock hotspots and UI
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
    this._buildHotspots(W, H);

    // ── Build shared UI (verb bar + inventory) — ALWAYS LAST ─
    this._initUI();

    // Initial status
    this.setStatus('Seven days remain.  ·  Examine the room.');
  }

  // ── Background ──────────────────────────────────────────────

  _drawBackground(W, H) {
    const WH = H - 156; // game world height
    const g  = this.add.graphics();

    // Stone walls — deep midnight blue
    g.fillGradientStyle(0x0c0e1a, 0x0c0e1a, 0x10121e, 0x10121e, 1);
    g.fillRect(0, 0, W, WH);

    // Stone block grid
    g.lineStyle(1, 0x181a28, 1);
    for (let row = 0; row * 40 < WH; row++) {
      const off = (row % 2 === 0) ? 0 : 40;
      for (let col = -1; col * 80 < W + 80; col++) {
        g.strokeRect(col * 80 + off, row * 40, 80, 40);
      }
    }

    // Ceiling
    g.fillStyle(0x070910, 1);
    g.fillRect(0, 0, W, 20);

    // Floor
    g.fillStyle(0x0f0c08, 1);
    g.fillRect(0, WH - 55, W, 55);
    g.lineStyle(1, 0x251a0c, 1);
    g.lineBetween(0, WH - 55, W, WH - 55);

    // Rug
    g.fillStyle(0x3a1a0a, 0.55);
    g.fillRoundedRect(W * 0.2, WH - 53, W * 0.6, 44, 4);

    // Windows
    this._drawWindow(g, W * 0.07, 55, 68, 155);
    this._drawWindow(g, W * 0.82, 55, 68, 155);

    // Candle glow on walls
    g.fillStyle(0xd08020, 0.04);
    g.fillCircle(W * 0.07 + 34, 132, 85);
    g.fillCircle(W * 0.82 + 34, 132, 85);
  }

  _drawWindow(g, x, y, w, h) {
    g.fillStyle(0x050710, 1);
    g.fillRect(x - 6, y - 6, w + 12, h + 12);
    g.fillStyle(0x09090f, 1);
    g.fillRect(x, y, w, h);
    g.fillStyle(0xb8c8e0, 0.09);
    g.fillRect(x, y, w, h / 2);
    g.fillStyle(0xffffff, 0.6);
    [[x+14,y+18],[x+38,y+32],[x+52,y+14],[x+24,y+50]].forEach(([sx,sy]) => g.fillCircle(sx,sy,1));
    g.lineStyle(2, 0x05070e, 1);
    g.lineBetween(x, y + h/2, x + w, y + h/2);
    g.lineBetween(x + w/2, y, x + w/2, y + h);
  }

  _drawFurniture(W, H) {
    const WH = H - 156;
    const g  = this.add.graphics();

    // ── Tapestry ───────────────────────────────────────────
    const tX = W/2 - 78, tY = 50, tW = 156, tH = 118;
    g.fillStyle(0x271630, 1);
    g.fillRect(tX, tY, tW, tH);
    g.lineStyle(1.5, 0xc8956c, 0.6);
    g.strokeRect(tX, tY, tW, tH);

    // Map lines on tapestry
    g.lineStyle(1, 0x5a3a6a, 0.5);
    g.lineBetween(tX+18, tY+58, tX+tW-18, tY+58);
    g.lineBetween(tX+78, tY+18, tX+78, tY+tH-18);
    g.lineBetween(tX+18, tY+28, tX+58, tY+58);
    g.lineBetween(tX+98, tY+58, tX+tW-18, tY+88);
    g.fillStyle(0x8a6090, 0.7);
    [[28,58],[78,38],[78,58],[78,83],[118,58],[138,33]].forEach(([dx,dy]) =>
      g.fillCircle(tX+dx, tY+dy, 3)
    );

    // Scratched-out name
    g.fillStyle(0x1a0e26, 0.9);
    g.fillRect(tX+tW-48, tY+tH-17, 42, 11);
    g.lineStyle(1, 0x7a4a4a, 0.8);
    for (let ln = 0; ln < 3; ln++) {
      g.lineBetween(tX+tW-46, tY+tH-14+ln*3, tX+tW-8, tY+tH-14+ln*3);
    }

    this.add.text(W/2, tY+tH+8, 'Tapestry of Elderwyn', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4a3a58', fontStyle: 'italic'
    }).setOrigin(0.5);

    // ── Bed ────────────────────────────────────────────────
    const bX = W/2 - 108, bY = WH - 195, bW = 216, bH = 138;

    // Headboard
    g.fillStyle(0x3c1f08, 1);
    g.fillRect(bX, bY, bW, 28);
    g.lineStyle(2, 0x6a3a10, 1);
    g.strokeRect(bX, bY, bW, 28);
    g.lineStyle(1, 0x8a5a20, 0.4);
    g.lineBetween(bX+18, bY+5, bX+18, bY+23);
    g.lineBetween(bX+bW-18, bY+5, bX+bW-18, bY+23);

    // Frame
    g.fillStyle(0x2e1606, 1);
    g.fillRect(bX, bY+28, bW, bH-8);
    g.lineStyle(1, 0x4a2a0a, 1);
    g.strokeRect(bX, bY+28, bW, bH-8);

    // Coverlet
    g.fillStyle(0xe8eaf2, 0.93);
    g.fillRoundedRect(bX+5, bY+32, bW-10, bH-18, 4);
    g.lineStyle(1, 0xc0c8da, 0.5);
    g.strokeRoundedRect(bX+5, bY+32, bW-10, bH-18, 4);
    g.lineStyle(1, 0xb0b8ca, 0.25);
    for (let y = bY+42; y < bY+bH-8; y += 11) {
      g.lineBetween(bX+9, y, bX+bW-9, y);
    }

    // Unraveling hem (fraying threads at bottom)
    g.lineStyle(1, 0xd0d8ea, 0.35);
    for (let i = 0; i < 9; i++) {
      const tx = bX + 20 + i * 23;
      g.lineBetween(tx, bY+bH-22, tx + Phaser.Math.Between(-3,3), bY+bH-6);
    }

    // ── Bedside table ──────────────────────────────────────
    const tblX = bX + bW + 10, tblY = bY + 38;
    g.fillStyle(0x2e1a08, 1);
    g.fillRect(tblX, tblY, 70, 92);
    g.lineStyle(1, 0x4a2a0a, 1);
    g.strokeRect(tblX, tblY, 70, 92);

    // Tea cup
    g.fillStyle(0xf5f0e8, 1); g.fillEllipse(tblX+20, tblY+15, 28, 13);
    g.fillStyle(0xc8a87a, 1); g.fillEllipse(tblX+20, tblY+12, 24, 9);
    g.lineStyle(1, 0x8a6a3a, 1); g.strokeEllipse(tblX+20, tblY+15, 28, 13);
    // Silver sediment
    g.fillStyle(0xd0d8ea, 0.5); g.fillEllipse(tblX+20, tblY+12, 12, 4);
    this.add.text(tblX+20, tblY+25, 'Tea', { fontFamily: 'Georgia, serif', fontSize: '9px', color: '#5a4a2a' }).setOrigin(0.5);

    // Letter
    g.fillStyle(0xf5e8b0, 1); g.fillRect(tblX+8, tblY+38, 50, 34);
    g.lineStyle(1, 0xc8a050, 1); g.strokeRect(tblX+8, tblY+38, 50, 34);
    g.fillStyle(0xaa2010, 1); g.fillCircle(tblX+33, tblY+60, 7);
    this.add.text(tblX+33, tblY+79, 'Letter', { fontFamily: 'Georgia, serif', fontSize: '9px', color: '#a08030' }).setOrigin(0.5);

    // Book
    g.fillStyle(0x4a2810, 1); g.fillRect(tblX+2, tblY+76, 36, 10);
    g.lineStyle(1, 0x7a4820, 1); g.strokeRect(tblX+2, tblY+76, 36, 10);
    this.add.text(tblX+20, tblY+92, 'Book', { fontFamily: 'Georgia, serif', fontSize: '9px', color: '#6a3810' }).setOrigin(0.5);

    // Candelabra (left side)
    g.fillStyle(0x7a6020, 1);
    g.fillRect(W*0.17-2, WH-210, 4, 50);
    g.fillRect(W*0.17-10, WH-162, 20, 5);
    g.fillStyle(0xf0c020, 0.9); g.fillEllipse(W*0.17, WH-216, 6, 12);
    g.fillStyle(0xffe860, 0.3); g.fillCircle(W*0.17, WH-212, 10);

    // Library door (right wall)
    g.fillStyle(0x2e1c08, 1);
    g.fillRect(W-52, 80, 44, WH-140);
    g.lineStyle(2, 0x5a3a14, 1);
    g.strokeRect(W-52, 80, 44, WH-140);
    g.fillStyle(0xc8a050, 1); g.fillCircle(W-16, WH/2, 5);
    this.add.text(W-30, 70, 'Library →', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4a3010', fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  _drawQueenFigure(W, H) {
    const WH = H - 156;
    const g  = this.add.graphics().setDepth(5);
    const hX = W/2 + 28, hY = WH - 175;

    // Pillow
    g.fillStyle(0xdde0ec, 1); g.fillEllipse(hX-8, hY+10, 68, 30);
    // Head
    g.fillStyle(0xf0d8c0, 1); g.fillCircle(hX, hY, 17);
    // Hair
    g.fillStyle(0x2a1a10, 1); g.fillEllipse(hX, hY+2, 40, 24); g.fillCircle(hX, hY-8, 17);
    // Closed eyes
    g.lineStyle(1, 0x6a4030, 1);
    g.lineBetween(hX-8, hY+2, hX-2, hY+2);
    g.lineBetween(hX+2, hY+2, hX+8, hY+2);
    // Silver mist halo
    g.fillStyle(0xc8d4ea, 0.05);
    g.fillCircle(hX, hY, 42); g.fillCircle(hX-18, hY+32, 28); g.fillCircle(hX+18, hY+32, 28);
  }

  _addMistParticles(W, H) {
    const WH = H - 156;
    this.add.particles(W/2+20, WH-115, 'mist_particle', {
      x: { min: -78, max: 78 },
      y: { min: -18, max: 18 },
      alpha: { start: 0.16, end: 0 },
      scale: { start: 0.12, end: 0.65 },
      speed: { min: 5, max: 16 },
      angle: { min: 240, max: 300 },
      lifespan: 3800,
      frequency: 130,
      quantity: 1,
      tint: [0xc8d8f2, 0xd4e0f0, 0xe0e8fa],
    }).setDepth(6);
  }

  // ── Hotspots ────────────────────────────────────────────────

  _buildHotspots(W, H) {
    const WH = H - 156;
    const defs = [
      {
        id: 'queen', name: 'Queen Elara',
        x: W/2+20, y: WH-158, w: 145, h: 82,
        look: () => this._queenLook(),
        talk: () => this._play(DIALOGUE_QUEEN_TALK),
        take: () => this._cantTake('Her Majesty'),
        use:  () => this._queenUse(),
      },
      {
        id: 'tapestry', name: 'Tapestry of Elderwyn',
        x: W/2, y: 108, w: 168, h: 128,
        look: () => this._tapestryLook(),
        talk: () => this._narrate("The tapestry doesn't respond. Tapestries rarely do."),
        take: () => this._cantTake('the tapestry'),
        use:  () => this._narrate("You examine the stitching closely but find no hidden mechanism."),
      },
      {
        id: 'tea', name: 'Teacup',
        x: W/2+148, y: WH-242, w: 50, h: 36,
        look: () => this._play(DIALOGUE_TEA),
        talk: () => this._narrate("The teacup has nothing useful to say."),
        take: () => this._cantTake('the teacup'),
        use:  () => this._play([
          { speaker:'mackenzie', text:"Don't drink that." },
          { speaker:'cambrie',   text:"I wasn't going to." },
          { speaker:'mackenzie', text:"I know your face. You were thinking about it." },
        ]),
      },
      {
        id: 'letter', name: "The Queen's Letter",
        x: W/2+152, y: WH-208, w: 54, h: 40,
        look: () => this._play(DIALOGUE_LETTER_LOOK),
        talk: () => this._narrate("The sealed letter waits in silence."),
        take: () => this._letterTake(),
        use:  () => this._letterTake(),
      },
      {
        id: 'book', name: 'Book of Ballads',
        x: W/2+140, y: WH-172, w: 44, h: 20,
        look: () => this._play(DIALOGUE_BOOK_LOOK),
        talk: () => this._narrate("It's a book. It does not answer."),
        take: () => this._bookTake(),
        use:  () => this._bookTake(),
      },
      {
        id: 'door', name: 'Door to Library',
        x: W-28, y: WH/2 + 30, w: 54, h: WH*0.5,
        look: () => this._doorLook(),
        talk: () => this._narrate("The door is solid and reliable and says nothing."),
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
        outline.lineStyle(1.5, 0xc8956c, 0.45);
        outline.strokeRect(def.x - def.w/2, def.y - def.h/2, def.w, def.h);
        this.setStatus(VerbSystem.getActionLabel() + '  ·  ' + def.name);
      });
      zone.on('pointerout', () => {
        outline.clear();
        this.setStatus('');
      });
      zone.on('pointerdown', () => {
        if (this._locked) return;
        const verb = VerbSystem.activeVerb;
        if (def[verb]) def[verb]();
      });

      this._hotspots.push({ zone, outline });
    });
  }

  _setHotspotsEnabled(on) {
    this._hotspots.forEach(h => {
      on ? h.zone.setInteractive({ useHandCursor: true })
         : h.zone.disableInteractive();
    });
  }

  // ── Hotspot handlers ────────────────────────────────────────

  _queenLook() {
    const lines = GameState.getFlag('queen_examined')
      ? [{ speaker:'narrator', text:"The silver mist still rises from the coverlet, thread by thread." }]
      : DIALOGUE_QUEEN_EXAMINE;

    this._play(lines, () => {
      if (!GameState.getFlag('queen_examined')) {
        GameState.setFlag('queen_examined', true);
        if (!GameState.getFlag('birdie_done')) {
          this.time.delayedCall(500, () => this._birdieCutscene());
        }
      }
    });
  }

  _queenUse() {
    if (VerbSystem.activeItem === 'sealed_letter') {
      this._play([{ speaker:'cambrie', text:"Not yet. Not while she might still wake." }]);
    } else {
      this._play([{ speaker:'mackenzie', text:"We need to find Vessa." }]);
    }
  }

  _tapestryLook() {
    const lines = GameState.getFlag('tapestry_examined')
      ? DIALOGUE_TAPESTRY_REPEAT
      : DIALOGUE_TAPESTRY_FIRST;
    this._play(lines, () => GameState.setFlag('tapestry_examined', true));
  }

  _letterTake() {
    if (GameState.hasItem('sealed_letter')) {
      this._narrate("The letter is safe in Cambrie's journal.");
      return;
    }
    this._play(DIALOGUE_LETTER_LOOK, () => {
      this._play(DIALOGUE_LETTER_TAKE, () => GameState.addItem('sealed_letter'));
    });
  }

  _bookTake() {
    if (GameState.hasItem('ballad_book')) {
      this._narrate("The ballad book is already in Cambrie's bag.");
      return;
    }
    this._play(DIALOGUE_BOOK_LOOK, () => {
      this._play(DIALOGUE_BOOK_TAKE, () => GameState.addItem('ballad_book'));
    });
  }

  _doorLook() {
    if (!GameState.getFlag('birdie_done')) {
      this._narrate("A door to the palace corridor. You're not ready to leave yet.");
    } else {
      this._narrate("The way to the library — and answers.");
    }
  }

  _doorUse() {
    if (!GameState.getFlag('birdie_done')) {
      this._play([
        { speaker:'mackenzie', text:"We can't leave without knowing what we're up against." },
        { speaker:'cambrie',   text:"The library. We need the library first." },
      ]);
    } else {
      this._goToLibrary();
    }
  }

  // ── Birdie cutscene ─────────────────────────────────────────

  _birdieCutscene() {
    const W = this.scale.width;
    const H = this.scale.height;
    const WH = H - 156;

    // Draw Birdie at her own local origin, placed off-screen right
    const g = this.add.graphics().setDepth(20);
    const targetX = W * 0.14; // where she ends up (left area)
    g.setPosition(W + 60, WH - 225);  // start off-screen right
    this._drawBirdie(g);               // draw at local (0,0)

    this.tweens.add({
      targets: g,
      x: targetX,
      duration: 650,
      ease: 'Power2.easeOut',
      onComplete: () => {
        this._play(DIALOGUE_BIRDIE_ENTRANCE, () => {
          GameState.setFlag('birdie_done', true);
          this.tweens.add({
            targets: g,
            x: W + 80,
            duration: 500,
            ease: 'Power2.easeIn',
            onComplete: () => g.destroy(),
          });
          this.setStatus('Use the door on the right to go to the Library.');
        });
      },
    });
  }

  _drawBirdie(g) {
    // Robes (layered)
    g.fillStyle(0x8b6914, 1);
    g.fillTriangle(0, 0, -28, 88, 28, 88);
    g.fillStyle(0x6a4a0a, 1);
    g.fillTriangle(0, 10, -22, 88, 22, 88);
    // Head
    g.fillStyle(0xf0c090, 1); g.fillCircle(0, -14, 14);
    // Hair
    g.fillStyle(0x5a3a10, 1); g.fillEllipse(0, -22, 32, 18);
    // Feather wisps
    g.lineStyle(1, 0x8a6020, 1);
    g.lineBetween(-14, -22, -22, -36);
    g.lineBetween(0, -26, -4, -40);
    g.lineBetween(14, -22, 18, -36);
    // Candelabra
    g.fillStyle(0xaa8830, 1); g.fillRect(22, 8, 4, 40);
    g.fillStyle(0xffdd40, 0.9); g.fillEllipse(24, 4, 6, 12);
  }

  _goToLibrary() {
    GameState.save('PalaceLibraryScene');
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start('PalaceLibraryScene'));
  }

  // ── Helpers ─────────────────────────────────────────────────

  _play(lines, cb = null) {
    this.dialogue.play(lines, cb);
  }

  _narrate(text) {
    this._play([{ speaker: 'narrator', text }]);
  }

  _cantTake(name) {
    const msgs = [
      `Taking ${name} would not help here.`,
      `${name.charAt(0).toUpperCase() + name.slice(1)} is not something to carry.`,
      `Mackenzie considers it, then decides against it.`,
    ];
    this._narrate(Phaser.Math.RND.pick(msgs));
  }

  update() {
    if (this.dialogue) this.dialogue.update();
  }
}
