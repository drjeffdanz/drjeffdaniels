// ============================================================
// scenes/QueensChamberScene.js — Sisters' Quest
// Act 1, Room 1: The Queen's Chamber
// Hotspots: Queen, Tapestry, Tea Cup, Sealed Letter, Poetry Book, Door
// Cutscene: Crafty Birdie enters after examining the Queen
// ============================================================

class QueensChamberScene extends Phaser.Scene {
  constructor() {
    super({ key: 'QueensChamberScene' });
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.WORLD_H = this.H - 156; // game world above the UI bar + status bar
    this._dialogueLock = false;

    GameState.setCurrentScene('QueensChamberScene');

    // ── Draw the room ─────────────────────────────────────────
    this._drawBackground();
    this._drawFurniture();
    this._drawQueenSleeping();
    this._addMistParticles();

    // ── Scene label ───────────────────────────────────────────
    this._sceneLabel = this.add.text(this.W / 2, 18, "The Queen's Chamber  ·  Palace of Elderwyn", {
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      color: '#555555',
      fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Dialogue system ───────────────────────────────────────
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
      // Re-evaluate which hotspots should now be active
      this._syncHotspotState();
    });

    // ── Hotspots ──────────────────────────────────────────────
    this._hotspots = [];
    this._buildHotspots();

    // ── Entrance narration ────────────────────────────────────
    this.time.delayedCall(300, () => {
      const ui = this.scene.get('UIScene');
      if (ui) ui.setStatus('The Queen\'s Chamber  ·  Seven days remain.');
    });
  }

  // ── Background drawing ──────────────────────────────────────

  _drawBackground() {
    const g = this.add.graphics();
    const W = this.W;
    const H = this.WORLD_H;

    // Stone wall — deep blue-grey
    g.fillGradientStyle(0x0c0e18, 0x0c0e18, 0x10121e, 0x10121e, 1);
    g.fillRect(0, 0, W, H);

    // Stone block texture
    g.lineStyle(1, 0x191c2a, 1);
    const blockH = 40;
    const blockW = 80;
    for (let row = 0; row * blockH < H; row++) {
      const offset = (row % 2 === 0) ? 0 : blockW / 2;
      for (let col = -1; col * blockW < W + blockW; col++) {
        const bx = col * blockW + offset;
        const by = row * blockH;
        g.strokeRect(bx, by, blockW, blockH);
      }
    }

    // Ceiling arch suggestion
    g.fillStyle(0x080a14, 1);
    g.fillRect(0, 0, W, 18);

    // Floor — darker, warmer
    g.fillStyle(0x0f0b08, 1);
    g.fillRect(0, H - 60, W, 60);
    g.lineStyle(1, 0x2a1e0e, 1);
    g.lineBetween(0, H - 60, W, H - 60);

    // Rug on floor
    g.fillStyle(0x3a1a08, 0.6);
    g.fillRoundedRect(W * 0.2, H - 58, W * 0.6, 46, 4);
    g.lineStyle(1, 0x5a2a10, 0.5);
    g.strokeRoundedRect(W * 0.2, H - 58, W * 0.6, 46, 4);

    // Windows (left and right)
    this._drawWindow(g, W * 0.08, 60, 70, 160);
    this._drawWindow(g, W * 0.82, 60, 70, 160);

    // Candle light pools on walls
    g.fillStyle(0xc87820, 0.05);
    g.fillCircle(W * 0.08 + 35, 140, 80);
    g.fillCircle(W * 0.82 + 35, 140, 80);
  }

  _drawWindow(g, x, y, w, h) {
    // Window frame (dark stone)
    g.fillStyle(0x06080f, 1);
    g.fillRect(x - 6, y - 6, w + 12, h + 12);

    // Night sky
    g.fillStyle(0x0a0c18, 1);
    g.fillRect(x, y, w, h);

    // Moonlight glow
    g.fillStyle(0xc0d0e8, 0.12);
    g.fillRect(x, y, w, h / 2);

    // Stars in window
    g.fillStyle(0xffffff, 0.7);
    [[x + 15, y + 20], [x + 40, y + 35], [x + 55, y + 15], [x + 25, y + 55]].forEach(([sx, sy]) => {
      g.fillCircle(sx, sy, 1);
    });

    // Window cross-bar
    g.lineStyle(2, 0x06080f, 1);
    g.lineBetween(x, y + h / 2, x + w, y + h / 2);
    g.lineBetween(x + w / 2, y, x + w / 2, y + h);
  }

  _drawFurniture() {
    const g = this.add.graphics();
    const W = this.W;
    const H = this.WORLD_H;

    // ── Tapestry on back wall ──────────────────────
    const tapX = W / 2 - 80;
    const tapY = 50;
    const tapW = 160;
    const tapH = 120;

    g.fillStyle(0x2a1a3a, 1);
    g.fillRect(tapX, tapY, tapW, tapH);
    g.lineStyle(2, 0xc8956c, 0.7);
    g.strokeRect(tapX, tapY, tapW, tapH);

    // Tapestry pattern — map-like lines
    g.lineStyle(1, 0x5a3a6a, 0.6);
    // Roads
    g.lineBetween(tapX + 20, tapY + 60, tapX + tapW - 20, tapY + 60);
    g.lineBetween(tapX + 80, tapY + 20, tapX + 80, tapY + tapH - 20);
    g.lineBetween(tapX + 20, tapY + 30, tapX + 60, tapY + 60);
    g.lineBetween(tapX + 100, tapY + 60, tapX + tapW - 20, tapY + 90);
    // Settlement dots
    g.fillStyle(0x8a6090, 0.8);
    [[30, 60], [80, 40], [80, 60], [80, 85], [120, 60], [140, 35]].forEach(([dx, dy]) => {
      g.fillCircle(tapX + dx, tapY + dy, 3);
    });

    // Scratched-out name (bottom corner)
    g.lineStyle(1, 0x3a2a4a, 1);
    g.fillStyle(0x1e102e, 0.9);
    g.fillRect(tapX + tapW - 50, tapY + tapH - 18, 44, 12);
    g.lineStyle(1, 0x6a4a4a, 1);
    g.lineBetween(tapX + tapW - 48, tapY + tapH - 12, tapX + tapW - 8, tapY + tapH - 12);
    g.lineBetween(tapX + tapW - 48, tapY + tapH - 10, tapX + tapW - 8, tapY + tapH - 10);
    g.lineBetween(tapX + tapW - 48, tapY + tapH - 14, tapX + tapW - 8, tapY + tapH - 14);

    // Tapestry label
    this.add.text(W / 2, tapY + tapH + 8, "Tapestry of Elderwyn", {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#4a3a5a', fontStyle: 'italic'
    }).setOrigin(0.5);

    // ── Bed ─────────────────────────────────────────
    const bedX = W / 2 - 110;
    const bedY = H - 200;
    const bedW = 220;
    const bedH = 140;

    // Headboard
    g.fillStyle(0x3a1e08, 1);
    g.fillRect(bedX, bedY, bedW, 30);
    g.lineStyle(2, 0x6a3a10, 1);
    g.strokeRect(bedX, bedY, bedW, 30);
    // Headboard detail
    g.lineStyle(1, 0x8a5a20, 0.5);
    g.lineBetween(bedX + 20, bedY + 6, bedX + 20, bedY + 24);
    g.lineBetween(bedX + bedW - 20, bedY + 6, bedX + bedW - 20, bedY + 24);

    // Bed frame
    g.fillStyle(0x2e1606, 1);
    g.fillRect(bedX, bedY + 30, bedW, bedH - 10);
    g.lineStyle(1, 0x4a2a0a, 1);
    g.strokeRect(bedX, bedY + 30, bedW, bedH - 10);

    // Coverlet — white/silver with unraveling effect
    g.fillStyle(0xe8eaf0, 0.92);
    g.fillRoundedRect(bedX + 6, bedY + 34, bedW - 12, bedH - 20, 4);
    g.lineStyle(1, 0xc0c8d8, 0.5);
    g.strokeRoundedRect(bedX + 6, bedY + 34, bedW - 12, bedH - 20, 4);

    // Thread pattern on coverlet
    g.lineStyle(1, 0xb0b8c8, 0.3);
    for (let y = bedY + 44; y < bedY + bedH - 10; y += 12) {
      g.lineBetween(bedX + 10, y, bedX + bedW - 10, y);
    }

    // Fraying hem (bottom of coverlet — threads unweaving)
    g.lineStyle(1, 0xd0d8e8, 0.4);
    for (let i = 0; i < 8; i++) {
      const tx = bedX + 20 + i * 26;
      const ty = bedY + bedH - 24;
      g.lineBetween(tx, ty, tx + Phaser.Math.Between(-4, 4), ty + Phaser.Math.Between(10, 22));
    }

    // ── Bedside table ────────────────────────────────
    const tableX = bedX + bedW + 12;
    const tableY = bedY + 40;
    g.fillStyle(0x2e1a08, 1);
    g.fillRect(tableX, tableY, 68, 90);
    g.lineStyle(1, 0x4a2a0a, 1);
    g.strokeRect(tableX, tableY, 68, 90);

    // Tea cup
    g.fillStyle(0xf5f0e8, 1);
    g.fillEllipse(tableX + 20, tableY + 16, 28, 14);
    g.fillStyle(0xc8a87a, 1);
    g.fillEllipse(tableX + 20, tableY + 13, 24, 10);
    g.lineStyle(1, 0x8a6a3a, 1);
    g.strokeEllipse(tableX + 20, tableY + 16, 28, 14);

    // Silver sediment hint in cup
    g.fillStyle(0xd0d8e8, 0.6);
    g.fillEllipse(tableX + 20, tableY + 13, 14, 5);

    this.add.text(tableX + 20, tableY + 26, 'Tea', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#5a4a2a'
    }).setOrigin(0.5);

    // Letter
    g.fillStyle(0xf5e8b0, 1);
    g.fillRect(tableX + 8, tableY + 38, 50, 34);
    g.lineStyle(1, 0xc8a050, 1);
    g.strokeRect(tableX + 8, tableY + 38, 50, 34);
    // Wax seal
    g.fillStyle(0xaa2010, 1);
    g.fillCircle(tableX + 33, tableY + 60, 7);
    this.add.text(tableX + 33, tableY + 79, 'Letter', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#a08030'
    }).setOrigin(0.5);

    // Poetry book
    g.fillStyle(0x4a2810, 1);
    g.fillRect(tableX + 2, tableY + 76, 36, 10);
    g.lineStyle(1, 0x7a4820, 1);
    g.strokeRect(tableX + 2, tableY + 76, 36, 10);
    this.add.text(tableX + 20, tableY + 90, 'Book', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#6a3810'
    }).setOrigin(0.5);

    // ── Candelabra (left side) ───────────────────────
    const candleX = W * 0.18;
    const candleY = H - 210;
    g.fillStyle(0x7a6020, 1);
    g.fillRect(candleX - 2, candleY, 4, 50);
    g.fillRect(candleX - 10, candleY + 48, 20, 6);
    // Candle flame
    g.fillStyle(0xf0c020, 0.9);
    g.fillEllipse(candleX, candleY - 6, 6, 12);
    g.fillStyle(0xffe860, 0.4);
    g.fillCircle(candleX, candleY - 4, 10);
  }

  _drawQueenSleeping() {
    const g = this.add.graphics().setDepth(5);
    const W = this.W;
    const H = this.WORLD_H;

    // Queen's face / head on pillow
    const headX = W / 2 + 30;
    const headY = H - 175;

    // Pillow
    g.fillStyle(0xdde0ea, 1);
    g.fillEllipse(headX - 10, headY + 10, 70, 32);

    // Head
    g.fillStyle(0xf0d8c0, 1);
    g.fillCircle(headX, headY, 18);

    // Hair (dark, spread on pillow)
    g.fillStyle(0x2a1a10, 1);
    g.fillEllipse(headX, headY + 2, 42, 24);
    g.fillCircle(headX, headY - 8, 18);

    // Closed eyes
    g.lineStyle(1, 0x6a4030, 1);
    g.lineBetween(headX - 8, headY + 2, headX - 2, headY + 2);
    g.lineBetween(headX + 2, headY + 2, headX + 8, headY + 2);

    // Silver mist hint around her (drawn as faint circles)
    g.fillStyle(0xc8d4e8, 0.06);
    g.fillCircle(headX, headY, 40);
    g.fillCircle(headX - 20, headY + 30, 30);
    g.fillCircle(headX + 20, headY + 30, 30);

    this._queenGraphics = g;
  }

  _addMistParticles() {
    const W = this.W;
    const H = this.WORLD_H;
    const bedCenterX = W / 2 + 20;
    const bedCenterY = H - 120;

    // Silver mist rising from the Queen
    this._mistEmitter = this.add.particles(bedCenterX, bedCenterY, 'mist_particle', {
      x: { min: -80, max: 80 },
      y: { min: -20, max: 20 },
      alpha: { start: 0.18, end: 0 },
      scale: { start: 0.15, end: 0.7 },
      speed: { min: 6, max: 18 },
      angle: { min: 240, max: 300 },
      lifespan: 3500,
      frequency: 120,
      quantity: 1,
      tint: [0xc8d8f0, 0xd0dced, 0xe0e8f8],
    }).setDepth(6);
  }

  // ── Hotspots ───────────────────────────────────────────────

  _buildHotspots() {
    const W = this.W;
    const H = this.WORLD_H;

    const hotspotDefs = [
      {
        id: 'queen',
        name: 'Queen Elara',
        x: W / 2 + 20, y: H - 160,
        w: 140, h: 80,
        look: () => this._onQueenLook(),
        talk: () => this._onQueenTalk(),
        take: () => this._cantTake('Her Majesty'),
        use:  () => this._onQueenUse(),
      },
      {
        id: 'tapestry',
        name: 'Tapestry of Elderwyn',
        x: W / 2, y: 110,
        w: 170, h: 130,
        look: () => this._onTapestryLook(),
        talk: () => this._narratorSay("The tapestry doesn't respond. Tapestries rarely do."),
        take: () => this._cantTake('the tapestry'),
        use:  () => this._narratorSay("You examine the stitching closely but find no hidden mechanism."),
      },
      {
        id: 'tea',
        name: 'Teacup',
        x: W / 2 + 148, y: H - 240,
        w: 50, h: 36,
        look: () => this._onTeaLook(),
        talk: () => this._narratorSay("The teacup does not have much to say."),
        take: () => this._cantTake('the teacup'),
        use:  () => this._onTeaUse(),
      },
      {
        id: 'letter',
        name: "The Queen's Letter",
        x: W / 2 + 152, y: H - 208,
        w: 54, h: 40,
        look: () => this._onLetterLook(),
        talk: () => this._narratorSay("The sealed letter awaits in silence."),
        take: () => this._onLetterTake(),
        use:  () => this._onLetterUse(),
      },
      {
        id: 'book',
        name: 'Book of Ballads',
        x: W / 2 + 144, y: H - 175,
        w: 44, h: 22,
        look: () => this._onBookLook(),
        talk: () => this._narratorSay("It's a book. It does not talk back, unlike some other things in this palace."),
        take: () => this._onBookTake(),
        use:  () => this._narratorSay("You flip through the ballads again. The dog-eared page is still there."),
      },
      {
        id: 'door',
        name: 'Door to Library',
        x: W - 40, y: H / 2,
        w: 60, h: H * 0.4,
        look: () => this._onDoorLook(),
        talk: () => this._narratorSay("The door is sturdy and reliable and does not answer back."),
        take: () => this._cantTake('the door'),
        use:  () => this._onDoorUse(),
      },
    ];

    hotspotDefs.forEach(def => this._createHotspot(def));
  }

  _createHotspot(def) {
    const zone = this.add.zone(def.x, def.y, def.w, def.h)
      .setInteractive({ useHandCursor: true })
      .setDepth(50);

    // Hover outline
    const outline = this.add.graphics().setDepth(49);

    zone.on('pointerover', () => {
      if (this._dialogueLock) return;
      outline.clear();
      outline.lineStyle(1.5, 0xc8956c, 0.5);
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
    this._hotspots.forEach(h => h.zone.setInteractive({ useHandCursor: true }));
  }

  _syncHotspotState() {
    // Hide door hotspot until Birdie scene is done
    const doorHotspot = this._hotspots.find(h => h.def.id === 'door');
    // Door is always visible but only navigable after Birdie scene
  }

  // ── Hotspot handlers ────────────────────────────────────────

  _onQueenLook() {
    const lines = GameState.getFlag('queen_examined')
      ? [{ speaker: 'narrator', text: "Your mother lies still. The silver mist continues to rise from the coverlet, thread by thread." }]
      : DIALOGUE_QUEEN_EXAMINE;

    this.dialogue.play(lines, () => {
      if (!GameState.getFlag('queen_examined')) {
        GameState.setFlag('queen_examined', true);
        if (!GameState.getFlag('birdie_done')) {
          this.time.delayedCall(400, () => this._playBirdieCutscene());
        }
      }
    });
  }

  _onQueenTalk() {
    this.dialogue.play(DIALOGUE_QUEEN_TALK);
  }

  _onQueenUse() {
    if (VerbSystem.activeItem === 'sealed_letter') {
      this.dialogue.play([{
        speaker: 'cambrie',
        text: "Not yet. We shouldn't open it while she might still wake and speak for herself.",
      }]);
    } else {
      this.dialogue.play([{
        speaker: 'mackenzie',
        text: "There's nothing to do for her here. We need to find Vessa.",
      }]);
    }
  }

  _onTapestryLook() {
    const lines = GameState.getFlag('tapestry_examined')
      ? DIALOGUE_TAPESTRY_REPEAT
      : DIALOGUE_TAPESTRY_FIRST;

    this.dialogue.play(lines, () => {
      GameState.setFlag('tapestry_examined', true);
    });
  }

  _onTeaLook() {
    this.dialogue.play(DIALOGUE_TEA, () => {
      GameState.setFlag('tea_examined', true);
    });
  }

  _onTeaUse() {
    if (VerbSystem.activeItem) {
      this._narratorSay("Using items on cold cursed tea is not the solution here.");
    } else {
      this.dialogue.play([{
        speaker: 'mackenzie',
        text: "Don't drink that.",
      }, {
        speaker: 'cambrie',
        text: "I wasn't going to.",
      }, {
        speaker: 'mackenzie',
        text: "I know your face. You were thinking about it.",
      }]);
    }
  }

  _onLetterLook() {
    this.dialogue.play(DIALOGUE_LETTER_LOOK);
  }

  _onLetterTake() {
    if (GameState.hasItem('sealed_letter')) {
      this._narratorSay("You've already taken the letter. It's safe in Cambrie's journal.");
      return;
    }
    this.dialogue.play(DIALOGUE_LETTER_TAKE, () => {
      GameState.addItem('sealed_letter');
    });
  }

  _onLetterUse() {
    if (GameState.hasItem('sealed_letter')) {
      this.dialogue.play([{
        speaker: 'cambrie',
        text: "We shouldn't open it yet. Not until we have no other choice.",
      }]);
    } else {
      this._onLetterTake();
    }
  }

  _onBookLook() {
    this.dialogue.play(DIALOGUE_BOOK_LOOK);
  }

  _onBookTake() {
    if (GameState.hasItem('ballad_book')) {
      this._narratorSay("The ballad book is already in Cambrie's bag.");
      return;
    }
    this.dialogue.play(DIALOGUE_BOOK_TAKE, () => {
      GameState.addItem('ballad_book');
    });
  }

  _onDoorLook() {
    if (!GameState.getFlag('birdie_done')) {
      this._narratorSay("A door leading to the palace corridor. You're not ready to leave yet — you need to understand what you're facing.");
    } else {
      this._narratorSay("The door to the palace corridor. Beyond it, the library and answers.");
    }
  }

  _onDoorUse() {
    if (!GameState.getFlag('birdie_done')) {
      this.dialogue.play([{
        speaker: 'mackenzie',
        text: "We can't just leave without knowing what we're up against.",
      }, {
        speaker: 'cambrie',
        text: "The library. We need the library first.",
      }]);
    } else {
      // Transition to library
      this._goToLibrary();
    }
  }

  // ── Birdie cutscene ─────────────────────────────────────────

  _playBirdieCutscene() {
    // Animate Birdie entering from the door
    const W = this.W;
    const H = this.WORLD_H;

    const birdieG = this.add.graphics().setDepth(20);
    // Birdie sprite (placeholder: layered robe figure)
    this._drawBirdieFigure(birdieG, W + 30, H - 220);

    // Slide Birdie in
    this.tweens.add({
      targets: birdieG,
      x: -180,
      duration: 600,
      ease: 'Power2.easeOut',
      onComplete: () => {
        this.dialogue.play(DIALOGUE_BIRDIE_ENTRANCE, () => {
          GameState.setFlag('birdie_done', true);
          // Birdie shuffles out
          this.tweens.add({
            targets: birdieG,
            x: 200,
            duration: 500,
            ease: 'Power2.easeIn',
            onComplete: () => birdieG.destroy(),
          });
          // Now the door is available
          const ui = this.scene.get('UIScene');
          if (ui) ui.setStatus('Use the door to head to the Palace Library.');
        });
      },
    });
  }

  _drawBirdieFigure(g, offsetX = 0, y = 0) {
    // Robes (layered, brown/gold)
    g.fillStyle(0x8b6914, 1);
    g.fillTriangle(
      offsetX,     y,
      offsetX - 28, y + 90,
      offsetX + 28, y + 90
    );
    g.fillStyle(0x6a4a0a, 1);
    g.fillTriangle(
      offsetX,     y + 10,
      offsetX - 22, y + 90,
      offsetX + 22, y + 90
    );
    // Head
    g.fillStyle(0xf0c090, 1);
    g.fillCircle(offsetX, y - 12, 14);
    // Hair — feathery wisps
    g.fillStyle(0x5a3a10, 1);
    g.fillEllipse(offsetX, y - 22, 32, 18);
    // "Feather" wisps sticking out
    g.lineStyle(1, 0x8a6020, 1);
    g.lineBetween(offsetX - 14, y - 22, offsetX - 22, y - 36);
    g.lineBetween(offsetX, y - 26, offsetX - 4, y - 40);
    g.lineBetween(offsetX + 14, y - 22, offsetX + 18, y - 36);
    // Candelabra
    g.fillStyle(0xaa8830, 1);
    g.fillRect(offsetX + 22, y + 10, 4, 40);
    g.fillStyle(0xffdd40, 0.9);
    g.fillEllipse(offsetX + 24, y + 6, 6, 12);
  }

  _goToLibrary() {
    GameState.save('PalaceLibraryScene');
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.stop('UIScene');
      this.scene.start('PalaceLibraryScene');
      this.scene.launch('UIScene');
    });
  }

  // ── Helpers ────────────────────────────────────────────────

  _cantTake(name) {
    const phrases = [
      `Taking ${name} would not help the situation.`,
      `${name.charAt(0).toUpperCase() + name.slice(1)} is not something you can carry.`,
      `Mackenzie considers taking ${name}, but even she admits this isn't the moment.`,
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
