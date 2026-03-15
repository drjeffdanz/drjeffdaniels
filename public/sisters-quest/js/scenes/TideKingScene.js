// ============================================================
// scenes/TideKingScene.js — Sisters' Quest: The Moonveil Crown
// The Tide King's Shrine — cliff-face tide pools, Isle of Tides
// Late afternoon, golden-blue light.
// ============================================================

class TideKingScene extends BaseScene {
  constructor() { super({ key: 'TideKingScene' }); }

  preload() { this.load.image('bg_tideshrine', 'assets/backgrounds/tide-king-shrine.jpg'); }

  create() {
    MusicManager.play(this, 'music_mystic');
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('TideKingScene');

    // ── Camera ────────────────────────────────────────────────
    this.cameras.main.fadeIn(600, 0, 0, 0);

    // ── Scene label ───────────────────────────────────────────
    this.add.text(W / 2, 18, "The Tide King's Shrine  ·  Isle of Tides", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#2a3840', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_tideshrine').setDisplaySize(W, WH).setDepth(0);

    // ── Alcove coords (used by shrine_offerings hotspot) ──────
    this._alcoveX = W * 0.30;
    this._alcoveY = WH * 0.30;
    this._alcoveW = W * 0.40;
    this._alcoveH = WH * 0.38;

    // ── World (drawn back to front) ───────────────────────────
    this._drawTidePools(W, WH);
    this.add.image(W * 0.50, WH * 0.88, 'sprite_tideking')
      .setDisplaySize(120, 300).setOrigin(0.5, 1).setDepth(15);
    this._tideKingX = W * 0.50;
    this._tideKingY = WH * 0.68;
    this._drawReturnArrow(W, WH);

    // ── Ripple animation on pools ─────────────────────────────
    this._poolGraphics = this.add.graphics().setDepth(14);
    this._rippleTime   = 0;

    // ── Dialogue ──────────────────────────────────────────────
    this.dialogue = new DialogueSystem(this);
    this._locked   = false;
    this._hotspots = [];

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
    this._buildHotspots(W, WH);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // ── Entry atmosphere ──────────────────────────────────────
    if (!GameState.getFlag('tideking_scene_entered')) {
      GameState.setFlag('tideking_scene_entered');
      this.time.delayedCall(700, () => {
        this._play([
          { speaker: 'narrator', text: "The tide pool shrine is older than the charts. Carved into the cliff face when the Isle of Tides was still known by another name — one no longer safe to say aloud." },
          { speaker: 'cambrie', text: "He's here. I can feel it. The water is warmer than it should be." },
          { speaker: 'mackenzie', text: "I've never spoken to a sea god before." },
          { speaker: 'cambrie', text: "You have. You just didn't know it was him. You were six. You fell into the harbor. Something put you back on the dock." },
          { speaker: 'mackenzie', text: "...that was him?" },
          { speaker: 'cambrie', text: "He has opinions about children and drowning. Apparently." },
        ]);
      });
    }
  }

  // ── Star-polygon helper (Phaser has no fillStar) ──────────

  _starPoints(cx, cy, n, innerR, outerR, rot) {
    const pts = [], step = Math.PI / n;
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = i * step + rot - Math.PI / 2;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    return pts;
  }

  // ── Tide Pools ────────────────────────────────────────────

  _drawTidePools(W, WH) {
    const g = this.add.graphics().setDepth(4);

    // The main large pool (where the Tide King sits)
    const mainX = W * 0.28, mainY = WH * 0.62, mainW = W * 0.44, mainH = WH * 0.16;
    g.fillStyle(0x0e2030, 1);
    g.fillEllipse(mainX + mainW / 2, mainY + mainH / 2, mainW, mainH);
    // Pool depth gradient
    g.fillStyle(0x0a1828, 0.7);
    g.fillEllipse(mainX + mainW / 2, mainY + mainH / 2, mainW * 0.7, mainH * 0.65);
    // Pool shimmer
    g.lineStyle(1, 0x4080a0, 0.35);
    g.strokeEllipse(mainX + mainW / 2, mainY + mainH / 2, mainW, mainH);
    // Reflected sky glint on pool
    g.fillStyle(0x6090b0, 0.12);
    g.fillEllipse(mainX + mainW * 0.35, mainY + mainH * 0.35, mainW * 0.30, mainH * 0.3);

    // Small pools (left and right)
    const smallPools = [
      { x: W * 0.08, y: WH * 0.67, w: W * 0.12, h: WH * 0.08 },
      { x: W * 0.80, y: WH * 0.68, w: W * 0.11, h: WH * 0.07 },
      { x: W * 0.16, y: WH * 0.72, w: W * 0.09, h: WH * 0.06 },
      { x: W * 0.76, y: WH * 0.74, w: W * 0.08, h: WH * 0.05 },
    ];
    smallPools.forEach(p => {
      g.fillStyle(0x122030, 1);
      g.fillEllipse(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
      // Tiny crabs / sea stars (simplified shapes)
      g.fillStyle(0xe08040, 0.7);
      g.fillPoints(this._starPoints(p.x + p.w * 0.4, p.y + p.h * 0.55, 5, 3, 6, 0), true);
      g.fillStyle(0x4888a0, 0.5);
      g.lineStyle(1, 0x3a7090, 0.4);
      g.strokeEllipse(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
    });

    this._mainPoolX = mainX;
    this._mainPoolY = mainY;
    this._mainPoolW = mainW;
    this._mainPoolH = mainH;
  }

  // ── Return arrow ─────────────────────────────────────────

  _drawReturnArrow(W, WH) {
    const g = this.add.graphics().setDepth(6);
    const aX = 14, aY = 32;
    g.fillStyle(0x1a2030, 0.85);
    g.fillRoundedRect(aX - 4, aY - 14, 148, 28, 4);
    g.lineStyle(1, 0x4888a8, 0.5);
    g.strokeRoundedRect(aX - 4, aY - 14, 148, 28, 4);
    this.add.text(aX + 8, aY, '◀ Back to Isle of Tides', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#78a8c8', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);
    this._returnArrow = { x: aX - 4, y: aY - 14, w: 148, h: 28 };
  }

  // ── Pool ripple animation ────────────────────────────────

  _drawPoolRipples(W, WH) {
    const g = this._poolGraphics;
    g.clear();
    const t  = this._rippleTime;
    const cx = this._mainPoolX + this._mainPoolW / 2;
    const cy = this._mainPoolY + this._mainPoolH / 2;

    // Concentric ripple rings emanating from center
    for (let r = 0; r < 4; r++) {
      const phase = (t * 0.4 + r * 0.7) % 1;
      const rx    = this._mainPoolW * 0.5 * phase;
      const ry    = this._mainPoolH * 0.5 * phase;
      const alpha = (1 - phase) * 0.3;
      g.lineStyle(1.5, 0x60a8c8, alpha);
      g.strokeEllipse(cx, cy, rx * 2, ry * 2);
    }

    // Bioluminescent sparkle dots in pool (random-ish)
    g.fillStyle(0x80d8e8, 0.3);
    const sparkCount = 6;
    for (let s = 0; s < sparkCount; s++) {
      const sx = cx + Math.cos(t * 0.8 + s * 1.3) * (this._mainPoolW * 0.28);
      const sy = cy + Math.sin(t * 1.1 + s * 0.9) * (this._mainPoolH * 0.28);
      const sr = 1.5 + Math.sin(t * 2 + s) * 0.8;
      g.fillCircle(sx, sy, sr);
    }
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Tide King ─────────────────────────────────────────────
    this._addHotspot({
      id: 'tide_king', name: 'The Tide King',
      x: this._tideKingX, y: this._tideKingY - 60, w: 160, h: 200,
      look: () => this._narrate("The Tide King of Poolville is patient in the way that only very old and very large things can be. The pool around him is still, but it shouldn't be."),
      talk: () => this._talkToTideKing(),
      take: () => this._narrate("The Tide King is not available for taking. This is not a situation you should need explained."),
      use:  () => {
        if (VerbSystem.activeItem === 'thorn_sonnet') {
          this._play([
            { speaker: 'narrator', text: "You offer the goat's sonnet. The Tide King looks at it for a long moment." },
            { speaker: 'tideking', text: "...this is a poem about a fence post." },
            { speaker: 'cambrie', text: "Yes. Written by a goat. He was very sincere about it." },
            { speaker: 'tideking', text: "I respect sincerity. This is not what I asked for. But I respect it." },
          ]);
        } else {
          this._narrate("The Tide King watches you with great patience. He has time. He is not sure you do.");
        }
      },
    });

    // ── Tide Pools ────────────────────────────────────────────
    this._addHotspot({
      id: 'tide_pools', name: 'Tide Pools',
      x: this._mainPoolX + this._mainPoolW / 2,
      y: this._mainPoolY + this._mainPoolH / 2,
      w: this._mainPoolW, h: this._mainPoolH + 20,
      look: () => this._play([
        { speaker: 'cambrie', text: "The pools are impossibly clear. Small crabs and sea stars move along the bottom. Sea glass glitters everywhere." },
        { speaker: 'cambrie', text: "The largest pool is... warm. And the light inside it doesn't match the light above. Something is down there that generates its own glow." },
      ]),
      talk: () => this._narrate("The pools do not speak. The Tide King speaks for them when he feels it's warranted."),
      take: () => this._narrate("You cannot take a tide pool. You can, however, look at it for quite a long time."),
      use:  () => this._narrate("You trail your fingers in the water. It is warm. A small sea star moves toward your hand and then, thinking better of it, moves away."),
    });

    // ── Shrine Offerings ──────────────────────────────────────
    this._addHotspot({
      id: 'shrine_offerings', name: 'Shrine Offerings',
      x: this._alcoveX + this._alcoveW / 2, y: this._alcoveY + this._alcoveH * 0.75,
      w: this._alcoveW, h: this._alcoveH * 0.5,
      look: () => this._play([
        { speaker: 'cambrie', text: "Sea glass, smooth stones, bits of kelp. The offerings of people who needed something from the sea." },
        { speaker: 'cambrie', text: "And here — a scrap of paper with a child's handwriting. 'Please give my dad back.' Whoever left this didn't get what they asked for." },
        { speaker: 'mackenzie', text: "...I hate this." },
        { speaker: 'cambrie', text: "Me too." },
      ]),
      talk: () => this._narrate("You speak quietly to the offerings. To whoever left them. That seems right."),
      take: () => this._narrate("You don't take what someone else left as a prayer."),
      use:  () => {
        if (GameState.hasItem('seaglass_heart')) {
          this._play([
            { speaker: 'cambrie', text: "The sea-glass heart. It should be here. With the others." },
            { speaker: 'narrator', text: "But you can't leave it. Not yet. You still need it." },
          ]);
        } else {
          this._narrate("You have nothing to add to the shrine. Not yet.");
        }
      },
    });

    // ── The Sea ───────────────────────────────────────────────
    this._addHotspot({
      id: 'the_sea', name: 'The Open Sea',
      x: W * 0.04, y: WH * 0.45, w: W * 0.08, h: WH * 0.18,
      look: () => this._play([
        { speaker: 'cambrie', text: "The ocean stretches to the horizon. Somewhere out there: the Isle of Tides, and deeper still, the wreck of the Sable Dawn." },
        { speaker: 'mackenzie', text: "Mira is still down there. Waiting." },
        { speaker: 'cambrie', text: "Not waiting. She doesn't know we're coming. She just — persists. As selkies do, when they can't go home." },
      ]),
      talk: () => this._narrate("You say something to the sea. The sea, as usual, says everything back at once and means all of it."),
      take: () => this._narrate("You cannot take the sea. The sea takes things from you, not the other way around."),
      use:  () => this._narrate("The sea doesn't accept items. It accepts respect, patience, and occasionally a well-timed apology."),
    });

    // ── Return ────────────────────────────────────────────────
    const ra = this._returnArrow;
    this._addHotspot({
      id: 'return', name: 'Return to the Isle',
      x: ra.x + ra.w / 2, y: ra.y + ra.h / 2, w: ra.w, h: ra.h,
      look: () => this._narrate("The path back along the cliff. The Isle of Tides stretches inland."),
      talk: () => this._narrate(""),
      take: () => this._narrate(""),
      use:  () => this._goTo('IsleOfTidesScene'),
    });
  }

  _addHotspot(def) {
    const outline = this.add.graphics().setDepth(49);
    const zone    = this.add.zone(def.x, def.y, def.w, def.h)
      .setInteractive({ useHandCursor: true })
      .setDepth(205);

    zone.on('pointerover', () => {
      if (this._locked) return;
      outline.clear();
      outline.lineStyle(1.5, 0x4888a8, 0.4);
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
    return { zone, outline };
  }

  _setHotspotsEnabled(on) {
    this._hotspots.forEach(h => {
      on ? h.zone.setInteractive({ useHandCursor: true })
         : h.zone.disableInteractive();
    });
  }

  // ── Tide King dialogue logic ──────────────────────────────

  _talkToTideKing() {
    if (GameState.getFlag('tideking_done')) {
      this._play(DIALOGUE_TIDEKING_REPEAT);
    } else if (!GameState.getFlag('tideking_shrine_done')) {
      GameState.setFlag('tideking_shrine_done');
      this._play(DIALOGUE_TIDEKING_SHRINE, () => {
        // After shrine intro, move directly to the sonnet/answer sequence
        this.time.delayedCall(300, () => {
          this._play(DIALOGUE_TIDEKING_SONNET, () => {
            GameState.setFlag('tideking_done');
            this.setStatus("The Tide King is satisfied. Find Mira.");
            this.time.delayedCall(600, () => {
              this._play([
                { speaker: 'tideking', text: "Go. The selkie is in the wreck. She has been there since the night the ship went down. She is not dead — selkies are difficult to kill — but she is not free." },
                { speaker: 'tideking', text: "The manifest was the first step. The second step is returning what was taken. Not trading. Returning. She does not owe you anything for this." },
                { speaker: 'cambrie', text: "We know." },
                { speaker: 'tideking', text: "Good. Most people who come to me don't." },
              ]);
            });
          });
        });
      });
    } else {
      this._play(DIALOGUE_TIDEKING_REPEAT);
    }
  }

  // ── Transitions ───────────────────────────────────────────

  _goTo(scene) {
    this._locked = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(600, () => this.scene.start(scene));
  }

  // ── Helpers ───────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }
  _narrate(text)          { this._play([{ speaker: 'narrator', text }]); }

  update() {
    if (this.dialogue) this.dialogue.update();

    this._rippleTime += 0.016;
    const W  = this.scale.width;
    const WH = this.scale.height - 156;
    this._drawPoolRipples(W, WH);
  }
}
