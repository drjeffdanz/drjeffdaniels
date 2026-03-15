// ============================================================
// scenes/ThornwoodScene.js — Sisters' Quest: The Moonveil Crown
// Act 2: The edge of the Thornwood forest, Witch's Hollow, Thorn.
// Extends BaseScene — verb bar and inventory built in.
// ============================================================

class ThornwoodScene extends BaseScene {
  constructor() { super({ key: 'ThornwoodScene' }); }

  preload() { this.load.image('bg_thornwood', 'assets/backgrounds/thornwood.jpg'); }

  create() {
    MusicManager.play(this, 'music_mystic');
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('ThornwoodScene');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_thornwood').setDisplaySize(W, WH).setDepth(0);

    // ── Draw world ────────────────────────────────────────────
    this._drawHollow(W, WH);

    // Portrait: Thorn the Goat
    this.add.image(W * 0.44, WH * 0.80, 'sprite_thorn')
      .setDisplaySize(96, 240).setOrigin(0.5, 1).setDepth(1);

    // Scene label
    this.add.text(W / 2, 18, 'Edge of the Thornwood', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#2a3830', fontStyle: 'italic',
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
    this._riddleButtons = [];
    this._buildHotspots(W, H);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // Entrance narration
    this.time.delayedCall(400, () => {
      this._play(DIALOGUE_THORNWOOD_ENTER);
    });

    this.setStatus('The Thornwood. Mind the goat.');
  }

  // ── Witch's Hollow ───────────────────────────────────────────

  _drawHollow(W, WH) {
    const g  = this.add.graphics().setDepth(4);
    const hx = 140;  // center x of hollow
    const hy = WH * 0.55;

    // Rock face / hillside
    g.fillStyle(0x181614, 1);
    g.fillTriangle(0, WH * 0.72, 0, WH * 0.28, 310, WH * 0.72);
    g.fillStyle(0x1a1816, 1);
    g.fillTriangle(0, WH * 0.72, 80, WH * 0.45, 260, WH * 0.72);

    // Rock texture lines
    g.lineStyle(1, 0x0c0a08, 0.8);
    g.lineBetween(0, WH * 0.55, 200, WH * 0.65);
    g.lineBetween(30, WH * 0.42, 180, WH * 0.52);
    g.lineStyle(1, 0x222018, 0.5);
    g.lineBetween(10, WH * 0.60, 140, WH * 0.68);

    // Cave mouth — arched opening
    g.fillStyle(0x04030a, 1);
    g.fillEllipse(hx, hy + 20, 100, 90);
    g.fillRect(hx - 50, hy + 20, 100, 50);

    // Warm amber glow from inside — Witch's fire
    const glowG = this.add.graphics().setDepth(5);
    const _drawHollowGlow = (alpha) => {
      glowG.clear();
      glowG.fillStyle(0xff9030, 0.60 * alpha);
      glowG.fillEllipse(hx, hy + 20, 90, 80);    // hot bright inner
      glowG.fillStyle(0xe06c18, 0.42 * alpha);
      glowG.fillEllipse(hx, hy + 30, 140, 115);   // mid glow
      glowG.fillStyle(0xc05010, 0.22 * alpha);
      glowG.fillEllipse(hx, hy + 40, 200, 150);   // wide outer bloom
      glowG.fillStyle(0x903808, 0.10 * alpha);
      glowG.fillEllipse(hx, hy + 48, 270, 180);   // far ambient
    };
    _drawHollowGlow(1.0);

    // Pulsing fire glow tween — redraws each frame
    this.tweens.add({
      targets: glowG,
      alpha: { from: 0.75, to: 1.0 },
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => _drawHollowGlow(glowG.alpha),
    });

    // Old wooden door — slightly ajar
    g.fillStyle(0x3a2010, 1);
    g.fillRect(hx - 36, hy - 16, 36, 66);
    g.lineStyle(1.5, 0x5a3018, 1);
    g.strokeRect(hx - 36, hy - 16, 36, 66);
    // Door planks
    g.lineStyle(1, 0x2a1808, 0.8);
    g.lineBetween(hx - 24, hy - 16, hx - 24, hy + 50);
    g.lineBetween(hx - 12, hy - 14, hx - 12, hy + 50);
    // Door hinge
    g.fillStyle(0x808070, 1);
    g.fillRect(hx - 37, hy - 10, 5, 8);
    g.fillRect(hx - 37, hy + 25, 5, 8);
    // Warm light sliver through open door gap
    g.fillStyle(0xe08020, 0.45);
    g.fillRect(hx - 4, hy - 16, 6, 66);

    // Woven cloth / ribbon hangings above door
    const ribbonColors = [0x8a3030, 0x305080, 0x408030, 0x805030, 0x604080];
    ribbonColors.forEach((col, i) => {
      g.fillStyle(col, 0.8);
      const rx = hx - 60 + i * 28;
      const ry = hy - 28;
      g.fillRect(rx, ry, 6, 28 + (i % 2) * 14);
      // Fringe at bottom
      g.fillStyle(col, 0.5);
      for (let f = 0; f < 3; f++) {
        g.fillRect(rx + f * 2, ry + 28 + (i % 2) * 14, 2, 8);
      }
    });

    // Torches either side of entrance
    this._drawTorch(g, hx - 68, hy - 10);
    this._drawTorch(g, hx + 22, hy - 10);

    // "WITCH'S HOLLOW" carved text above entrance
    this.add.text(hx, hy - 45, "Witch's Hollow", {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: '#5a4020', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(8);
  }

  _drawTorch(g, x, y) {
    // Torch glow halos on rock face behind — layered warm light
    g.fillStyle(0xd06010, 0.22);
    g.fillCircle(x, y - 4, 42);
    g.fillStyle(0xe07820, 0.14);
    g.fillCircle(x, y - 4, 62);
    g.fillStyle(0xf09030, 0.06);
    g.fillCircle(x, y - 4, 88);
    // Bracket
    g.fillStyle(0x505040, 1);
    g.fillRect(x - 2, y, 4, 22);
    g.fillRect(x - 6, y + 16, 12, 4);
    // Cup
    g.fillStyle(0x706050, 1);
    g.fillRect(x - 4, y + 8, 8, 12);
    // Flames — outer red-orange
    g.fillStyle(0xd05810, 0.88);
    g.fillTriangle(x - 5, y + 8, x, y - 14, x + 5, y + 8);
    // Mid flame
    g.fillStyle(0xf08428, 0.72);
    g.fillTriangle(x - 3, y + 8, x, y - 6, x + 3, y + 8);
    // Hot yellow-white core
    g.fillStyle(0xffe060, 0.65);
    g.fillTriangle(x - 2, y + 8, x, y - 1, x + 2, y + 8);
    // Bright tip
    g.fillStyle(0xffffff, 0.30);
    g.fillCircle(x, y - 2, 2);
  }

  // ── Hotspots ─────────────────────────────────────────────────

  _buildHotspots(W, H) {
    const WH = H - 156;

    const defs = [
      {
        id: 'thorn', name: 'Thorn the Goat',
        x: W * 0.47, y: WH * 0.80, w: 90, h: 100,
        look: () => this._narrate("A small black goat with amber eyes and the composure of a minor bureaucrat. He regards you with the patience of someone who has declined many meetings."),
        talk: () => this._thornTalk(),
        take: () => this._narrate("You are not going to take the goat. The goat would not allow it."),
        use:  () => this._narrate("Thorn looks at you with a kind of dignified contempt."),
      },
      {
        id: 'hollow', name: "Witch's Hollow",
        x: 130, y: WH * 0.70, w: 180, h: WH * 0.40,
        look: () => this._narrate("The Hollow glows warmly. Something moves behind the woven hangings. The ribbons sway although there is no wind."),
        talk: () => this._hollowInteract(),
        use:  () => this._hollowInteract(),
        take: () => this._narrate("You can't take a cave. You've considered worse ideas today."),
      },
      {
        id: 'gate', name: 'The Thornwood Gate',
        x: W * 0.78, y: WH * 0.58, w: 220, h: WH * 0.55,
        look: () => this._narrate("The Thornwood gate. Iron chains, serious business. Beyond it, the forest is black in a way that suggests the black is on purpose."),
        talk: () => this._narrate("The gate does not respond. The chains clink once, as if settling an argument."),
        take: () => this._narrate("The chains are immovable. You have already learned this through attitude alone."),
        use:  () => this._gateUse(),
      },
      {
        id: 'forest_path', name: 'Path into the Thornwood',
        x: W * 0.78, y: WH * 0.88, w: 180, h: 50,
        look: () => this._forestPathLook(),
        talk: () => this._narrate("The path doesn't answer. It just sits there, being a path."),
        take: () => this._narrate("That's not how paths work."),
        use:  () => this._forestPathUse(),
      },
      {
        id: 'back_path', name: 'Back to Cresthollow',
        x: W * 0.06, y: WH * 0.88, w: 100, h: 50,
        look: () => this._narrate("The road back to Cresthollow. You came a long way to be here."),
        talk: () => this._narrate("The road back doesn't offer conversation."),
        take: () => this._narrate("You can't carry a road."),
        use:  () => this._goBack(),
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
        outline.lineStyle(1.5, 0xc8956c, 0.38);
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

  // ── Hotspot logic ────────────────────────────────────────────

  _thornTalk() {
    if (!GameState.getFlag('thorn_met')) {
      this._play(DIALOGUE_THORN_FIRST, () => {
        GameState.setFlag('thorn_met');
        this._play(DIALOGUE_THORN_SONNET, () => {
          GameState.addItem('thorn_sonnet');
          GameState.setFlag('thorn_sonnet_given');
        });
      });
    } else {
      this._play(DIALOGUE_THORN_REPEAT);
    }
  }

  _hollowInteract() {
    if (!GameState.getFlag('thorn_met')) {
      this._narrate("The goat steps smoothly in front of the door. 'State your name and purpose first.' He does not move. He is a bureaucrat made of goat.");
      return;
    }
    if (!GameState.getFlag('witch_first_done')) {
      this._play(DIALOGUE_WITCH_FIRST, () => {
        GameState.setFlag('witch_first_done');
        this._showRiddleChoice();
      });
    } else if (GameState.getFlag('witch_done')) {
      this._play(DIALOGUE_WITCH_REPEAT);
    } else {
      // Riddle not yet solved — show choices again
      this._showRiddleChoice();
    }
  }

  _gateUse() {
    if (GameState.getFlag('thornwood_unlocked')) {
      this._narrate("The gate swings open. The Loom Witch's token worked.");
      this._forestPathUse();
    } else {
      this._narrate("The chains are immovable. Whatever locks them is stronger than a good yank.");
    }
  }

  _forestPathLook() {
    if (GameState.getFlag('thornwood_unlocked')) {
      this._narrate("The gate is open. The path into the Thornwood is clear — and dark, and probably worth the discomfort.");
    } else {
      this._narrate("The gate is still locked. The Thornwood beyond it can wait a little longer for your company.");
    }
  }

  _forestPathUse() {
    if (!GameState.hasItem('witch_riddle_answer')) {
      this._play([
        { speaker: 'cambrie', text: "The gate is still locked. We need the Witch's token first." },
        { speaker: 'mackenzie', text: "The goat first, then the witch, then the gate. In order." },
      ]);
    } else {
      this._play([
        { speaker: 'cambrie', text: "The Loom Witch's token. That should do it." },
        { speaker: 'mackenzie', text: "Into the Thornwood, then. Finally." },
      ], () => {
        GameState.setFlag('thornwood_unlocked');
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => this.scene.start('MirroredMereScene'));
      });
    }
  }

  _goBack() {
    this._play([
      { speaker: 'cambrie', text: "Back to Cresthollow." },
    ], () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('CresthollowScene'));
    });
  }

  // ── Riddle choice UI ─────────────────────────────────────────

  _showRiddleChoice() {
    // Prevent double-creation
    this._clearRiddleButtons();

    const W   = this.scale.width;
    const H   = this.scale.height;
    const WH  = H - 156;
    const cy  = WH * 0.48;

    // Prompt label
    const prompt = this.add.text(W / 2, cy - 36, "The Witch's Riddle: 'What is the name of the thing that names itself?'", {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#d4c0e8',
      fontStyle: 'italic',
      wordWrap: { width: W - 120 },
      align: 'center',
    }).setOrigin(0.5).setDepth(292);

    const choices = [
      { text: '"The act of making itself."', correct: true  },
      { text: '"Her name on the work."',     correct: false },
    ];

    const buttons = [prompt];

    choices.forEach((choice, i) => {
      const bx = W / 2;
      const by = cy + 14 + i * 52;

      const bg = this.add.graphics().setDepth(290);
      bg.fillStyle(0x1a0828, 0.95);
      bg.fillRoundedRect(bx - 220, by - 18, 440, 38, 5);
      bg.lineStyle(1.5, 0xc8956c, 0.8);
      bg.strokeRoundedRect(bx - 220, by - 18, 440, 38, 5);

      const lbl = this.add.text(bx, by, choice.text, {
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        color: '#e8e0d0',
      }).setOrigin(0.5).setDepth(292);

      const zone = this.add.zone(bx, by, 440, 38)
        .setInteractive({ useHandCursor: true })
        .setDepth(295);

      zone.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(0x2a1040, 0.98);
        bg.fillRoundedRect(bx - 220, by - 18, 440, 38, 5);
        bg.lineStyle(2, 0xd4a0ff, 1);
        bg.strokeRoundedRect(bx - 220, by - 18, 440, 38, 5);
      });
      zone.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(0x1a0828, 0.95);
        bg.fillRoundedRect(bx - 220, by - 18, 440, 38, 5);
        bg.lineStyle(1.5, 0xc8956c, 0.8);
        bg.strokeRoundedRect(bx - 220, by - 18, 440, 38, 5);
      });
      zone.on('pointerdown', () => {
        this._clearRiddleButtons();
        this._locked = true;
        this._setHotspotsEnabled(false);
        this.disableUI();

        if (choice.correct) {
          this._play(DIALOGUE_WITCH_RIDDLE_RIGHT, () => {
            GameState.addItem('witch_riddle_answer');
            GameState.setFlag('witch_done');
            GameState.setFlag('thornwood_unlocked');
          });
        } else {
          this._play(DIALOGUE_WITCH_RIDDLE_WRONG, () => {
            // Show choices again after wrong answer
            this._showRiddleChoice();
          });
        }
      });

      buttons.push(bg, lbl, zone);
    });

    this._riddleButtons = buttons;
    this._locked = true;
    this._setHotspotsEnabled(false);
    this.disableUI();
  }

  _clearRiddleButtons() {
    this._riddleButtons.forEach(b => { if (b && b.destroy) b.destroy(); });
    this._riddleButtons = [];
  }

  // ── Helpers ──────────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }

  _narrate(text) { this._play([{ speaker: 'narrator', text }]); }

  update() { if (this.dialogue) this.dialogue.update(); }
}
