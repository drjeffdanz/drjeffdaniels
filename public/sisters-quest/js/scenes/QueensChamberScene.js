// ============================================================
// scenes/QueensChamberScene.js — Sisters' Quest
// Act 1, Room 1: The Queen's Chamber
// Extends BaseScene — verb bar and inventory built in.
// ============================================================

class QueensChamberScene extends BaseScene {
  constructor() { super({ key: 'QueensChamberScene' }); }

  preload() {
    this.load.image('bg_queens', 'assets/backgrounds/queens-chamber.jpg');
  }

  create() {
    MusicManager.play(this, 'music_palace');
    const W = this.scale.width;
    const H = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('QueensChamberScene');

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_queens').setDisplaySize(W, WH).setDepth(0);

    // ── Animated queen mist pulse ─────────────────────────────
    const hX = W/2 + 28, hY = WH - 175;
    const mistG = this.add.graphics().setDepth(6);
    this.tweens.add({
      targets: mistG, alpha: { from: 0.4, to: 1.0 },
      duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        mistG.clear();
        mistG.fillStyle(0xe0ecff, 0.10 * mistG.alpha);
        mistG.fillCircle(hX, hY, 70);
        mistG.fillStyle(0xc8d8f4, 0.12 * mistG.alpha);
        mistG.fillEllipse(hX, hY+32, 120, 40);
      },
    });

    // ── Mist particles ────────────────────────────────────────
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
        x: W/2+138, y: WH-142, w: 50, h: 36,
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
        x: W/2+151, y: WH-102, w: 54, h: 40,
        look: () => this._play(DIALOGUE_LETTER_LOOK),
        talk: () => this._narrate("The sealed letter waits in silence."),
        take: () => this._letterTake(),
        use:  () => this._letterTake(),
      },
      {
        id: 'book', name: 'Book of Ballads',
        x: W/2+138, y: WH-76, w: 44, h: 20,
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

    const targetX = W * 0.14; // where she ends up (left area)
    const birdieImg = this.add.image(W + 80, WH * 0.88, 'sprite_birdie')
      .setDisplaySize(96, 240).setOrigin(0.5, 1).setDepth(2);

    this.tweens.add({
      targets: birdieImg,
      x: targetX,
      duration: 650,
      ease: 'Power2.easeOut',
      onComplete: () => {
        this._play(DIALOGUE_BIRDIE_ENTRANCE, () => {
          GameState.setFlag('birdie_done', true);
          this.tweens.add({
            targets: birdieImg,
            x: W + 80,
            duration: 500,
            ease: 'Power2.easeIn',
            onComplete: () => birdieImg.destroy(),
          });
          this.setStatus('Use the door on the right to go to the Library.');
        });
      },
    });
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
