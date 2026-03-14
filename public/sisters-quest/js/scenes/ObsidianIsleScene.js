// ============================================================
// scenes/ObsidianIsleScene.js — Sisters' Quest: The Moonveil Crown
// The Obsidian Isle — volcanic glass cliffs and the tower at the
// summit. Transitional scene before Vessa's Tower.
// ============================================================

class ObsidianIsleScene extends BaseScene {
  constructor() { super({ key: 'ObsidianIsleScene' }); }

  preload() { this.load.image('bg_obsidian', 'assets/backgrounds/obsidian-isle.jpg'); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('ObsidianIsleScene');

    // ── World ─────────────────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_obsidian').setDisplaySize(W, WH).setDepth(0);
    this._drawTower(W, H, WH);

    this.add.text(W / 2, 18, 'The Obsidian Isle', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#a090c0', fontStyle: 'italic',
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

    // Arrival narration — auto-trigger OBSIDIAN_ARRIVE on first visit
    this.time.delayedCall(600, () => {
      if (!GameState.getFlag('obsidian_arrived')) {
        GameState.setFlag('obsidian_arrived');
        this.dialogue.play(DIALOGUE_OBSIDIAN_ARRIVE);
      }
    });
  }

  // ── Drawing ──────────────────────────────────────────────────

  _drawTower(W, H, WH) {
    const g  = this.add.graphics().setDepth(6);
    const tx = W / 2;
    const ty = WH * 0.08;

    // Tower base (bottom)
    g.fillStyle(0x0c0a10, 1);
    g.fillRect(tx - 28, WH * 0.42, 56, WH * 0.16);

    // Tower shaft (narrower above)
    g.fillStyle(0x100e14, 1);
    g.fillRect(tx - 22, ty + 30, 44, WH * 0.42 - ty - 30);

    // Slight texture — vertical seam lines
    g.lineStyle(1, 0x1e1c24, 0.6);
    g.lineBetween(tx - 12, ty + 30, tx - 12, WH * 0.42);
    g.lineBetween(tx,      ty + 30, tx,      WH * 0.42);
    g.lineBetween(tx + 12, ty + 30, tx + 12, WH * 0.42);

    // Crenellations at top
    g.fillStyle(0x0c0a10, 1);
    const crenX = [tx - 22, tx - 11, tx, tx + 11];
    crenX.forEach(cx => g.fillRect(cx, ty + 14, 9, 16));
    // Fills between (lower)
    g.fillRect(tx - 22, ty + 26, 44, 6);

    // Tower top / roof
    g.fillStyle(0x180c1c, 1);
    g.fillTriangle(tx - 24, ty + 14, tx + 24, ty + 14, tx, ty - 8);
    g.lineStyle(1.5, 0x3a2848, 0.8);
    g.strokeTriangle(tx - 24, ty + 14, tx + 24, ty + 14, tx, ty - 8);

    // The single glowing amber window
    g.fillStyle(0xd08020, 0.9);
    g.fillRect(tx - 7, WH * 0.22, 14, 20);
    g.lineStyle(1, 0xf0c050, 0.9);
    g.strokeRect(tx - 7, WH * 0.22, 14, 20);
    // Cross divider in window
    g.lineStyle(1, 0x604010, 0.8);
    g.lineBetween(tx - 7, WH * 0.22 + 10, tx + 7, WH * 0.22 + 10);
    g.lineBetween(tx, WH * 0.22, tx, WH * 0.22 + 20);

    // Window glow halo — beacon in the dark
    g.fillStyle(0xffe080, 0.55);
    g.fillCircle(tx, WH * 0.22 + 10, 14);  // bright inner bloom
    g.fillStyle(0xd08020, 0.35);
    g.fillCircle(tx, WH * 0.22 + 10, 28);
    g.fillStyle(0xb06010, 0.18);
    g.fillCircle(tx, WH * 0.22 + 10, 50);
    g.fillStyle(0x904808, 0.08);
    g.fillCircle(tx, WH * 0.22 + 10, 80);
    // Light spill down tower face below window
    g.fillStyle(0xc07018, 0.12);
    g.fillRect(tx - 10, WH * 0.22 + 20, 20, WH * 0.20);

    // Tower door (bottom, visible at path end)
    g.fillStyle(0x0a0810, 1);
    g.fillRect(tx - 10, WH * 0.54, 20, 30);
    g.fillStyle(0x2a1a34, 0.5);
    g.fillEllipse(tx, WH * 0.54, 20, 10);
    g.lineStyle(1.5, 0x3a2848, 0.8);
    g.strokeRect(tx - 10, WH * 0.54, 20, 30);

    // Animate window flicker — warm beacon pulse
    const windowGlow = this.add.graphics().setDepth(7);
    this.tweens.add({
      targets: windowGlow,
      alpha: { from: 0.65, to: 1.0 },
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        windowGlow.clear();
        const a = windowGlow.alpha;
        // Animated bloom layers
        windowGlow.fillStyle(0xffe070, 0.50 * a);
        windowGlow.fillCircle(tx, WH * 0.22 + 10, 18);
        windowGlow.fillStyle(0xd08020, 0.28 * a);
        windowGlow.fillCircle(tx, WH * 0.22 + 10, 45);
        windowGlow.fillStyle(0xa06010, 0.12 * a);
        windowGlow.fillCircle(tx, WH * 0.22 + 10, 80);
        // Faint light cast on adjacent tower stone
        windowGlow.fillStyle(0xc07818, 0.10 * a);
        windowGlow.fillRect(tx - 22, WH * 0.22, 44, WH * 0.22);
      },
    });

    // Label
    this.add.text(tx, ty - 18, "Vessa's Tower", {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: '#a090c0', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(8).setAlpha(0.7);
  }

  // ── Hotspots ──────────────────────────────────────────────────

  _buildHotspots(W, H, WH) {
    const defs = [
      // 1. Tower (look/initial)
      {
        id: 'tower', name: "Vessa's Tower",
        x: W / 2, y: WH * 0.30, w: 80, h: WH * 0.28,
        look: () => {
          if (!GameState.getFlag('obsidian_arrived_look')) {
            GameState.setFlag('obsidian_arrived_look');
            this.dialogue.play(DIALOGUE_OBSIDIAN_ARRIVE, () => {
              GameState.setFlag('obsidian_arrived');
            });
          } else {
            this._narrate("The tower. At the end of all of this — the tower.");
          }
        },
        talk: () => this._narrate("We need to go up."),
        take: () => this._narrate("You cannot take the tower."),
        use:  () => this._approachTower(),
      },
      // 2. Cliff face / glass
      {
        id: 'cliffs', name: 'Obsidian Cliff Face',
        x: W * 0.12, y: WH * 0.50, w: 100, h: WH * 0.30,
        look: () => this._narrate("Black volcanic glass, fractured into a thousand angles. Each one reflects something slightly different."),
        talk: () => this._narrate("The glass is beautiful and cold and has nothing to say."),
        take: () => this._narrate("The obsidian is part of the cliff. It would take considerably more than your hands to break any off."),
        use:  () => this._narrate("You run a hand along the surface. It is smooth and cold and cuts the light into pieces."),
      },
      // 3. The sea below
      {
        id: 'sea', name: 'The Black Sea',
        x: W / 2, y: WH * 0.80, w: W - 240, h: WH * 0.16,
        look: () => this._narrate("The sea is black at this hour. The sound of it on the rocks is constant and complete."),
        talk: () => this._narrate("The sea does not listen to you specifically. It listens to everything at once."),
        take: () => this._narrate("You cannot take the sea."),
        use:  () => this._narrate("The sea is too far below to reach. And cold. Very cold."),
      },
      // 4. Tower door (after OBSIDIAN_ARRIVE)
      {
        id: 'door', name: 'Tower Door',
        x: W / 2, y: WH * 0.56, w: 40, h: 40,
        look: () => this._doorLook(),
        talk: () => this._approachTower(),
        take: () => this._narrate("The door is part of the tower."),
        use:  () => this._approachTower(),
      },
      // 5. Path up
      {
        id: 'path', name: 'Path to the Tower',
        x: W / 2, y: WH * 0.78, w: 70, h: WH * 0.20,
        look: () => this._narrate("The winding path leads up to Vessa's tower. It is steeper than it looks."),
        talk: () => this._approachTower(),
        take: () => this._narrate("You cannot take the path."),
        use:  () => this._approachTower(),
      },
      // 6. Exit back to Isle of Tides
      {
        id: 'exit_back', name: '← Back (Isle of Tides)',
        x: W * 0.06, y: WH - 18, w: 120, h: 36,
        look: () => this._narrate("The way back to the Isle of Tides."),
        talk: () => this._narrate("The path waits."),
        take: () => this._narrate("You cannot take the path."),
        use:  () => {
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.time.delayedCall(500, () => this.scene.start('IsleOfTidesScene'));
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

  _doorLook() {
    if (GameState.getFlag('obsidian_arrived')) {
      this._narrate("The tower door. Iron-banded oak, old as the isle itself.");
    } else {
      this._narrate("A heavy door at the tower base. It will not open itself.");
    }
  }

  _approachTower() {
    if (!GameState.getFlag('obsidian_door_played')) {
      GameState.setFlag('obsidian_door_played');
      this.dialogue.play(DIALOGUE_OBSIDIAN_DOOR, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => this.scene.start('VessaTowerScene'));
      });
    } else {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('VessaTowerScene'));
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

  _narrate(text) {
    this.dialogue.play([{ speaker: 'narrator', text }]);
  }

  update() { if (this.dialogue) this.dialogue.update(); }
}
