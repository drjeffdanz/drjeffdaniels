// ============================================================
// scenes/WhisperingCavesScene.js — Sisters' Quest: The Moonveil Crown
// Act 2: The Whispering Caves — sea cave passage to the coast.
// Extends BaseScene — verb bar and inventory built in.
// ============================================================

// Scene-specific dialogue (not in dialogues-acts2to8.js)
const DIALOGUE_CAVES_ENTER = [
  {
    speaker: 'narrator',
    text: "The Whispering Caves live up to their name. The sound of the sea filters through the rock — always present, never quite loud enough to make out. The sisters move through carefully.",
  },
  {
    speaker: 'mackenzie',
    text: "How far through?",
  },
  {
    speaker: 'cambrie',
    text: "The atlas says half a mile. It also says 'mind the tide.' Which is vague and I resent it.",
  },
];

class WhisperingCavesScene extends BaseScene {
  constructor() { super({ key: 'WhisperingCavesScene' }); }

  preload() { this.load.image('bg_caves', 'assets/backgrounds/whispering-caves.jpg'); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('WhisperingCavesScene');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_caves').setDisplaySize(W, WH).setDepth(0);

    // ── Draw world ────────────────────────────────────────────
    this._drawBioluminescence(W, WH);
    this._drawDripAnimation(W, WH);

    // Scene label
    this.add.text(W / 2, 18, 'The Whispering Caves', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#1a2a28', fontStyle: 'italic',
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
    this._buildHotspots(W, H);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // Entrance narration if first visit
    if (!GameState.getFlag('caves_entered')) {
      this.time.delayedCall(400, () => {
        this._play(DIALOGUE_CAVES_ENTER, () => {
          GameState.setFlag('caves_entered');
        });
      });
    } else {
      this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    this.setStatus("Mind the tide. Cambrie resents this advice but follows it.");
  }

  // ── Bioluminescent glow ──────────────────────────────────────

  _drawBioluminescence(W, WH) {
    const g = this.add.graphics().setDepth(3);

    // Blue-green algae patches on walls and ceiling
    const glowPatches = [
      { x: 115, y: WH * 0.55, r: 18, color: 0x0a4038 },
      { x: 175, y: WH * 0.45, r: 12, color: 0x0c4840 },
      { x: W*0.3, y: WH * 0.22, r: 22, color: 0x083830 },
      { x: W*0.42, y: WH * 0.18, r: 16, color: 0x0a4438 },
      { x: W*0.58, y: WH * 0.20, r: 20, color: 0x083832 },
      { x: W*0.70, y: WH * 0.25, r: 14, color: 0x0c4840 },
      { x: W - 175, y: WH * 0.48, r: 16, color: 0x083830 },
      { x: W - 115, y: WH * 0.58, r: 20, color: 0x0a4038 },
      { x: W*0.35, y: WH * 0.65, r: 12, color: 0x083028 },
      { x: W*0.65, y: WH * 0.62, r: 14, color: 0x0a3832 },
    ];

    glowPatches.forEach(p => {
      // Outer glow halo
      g.fillStyle(p.color, 0.22);
      g.fillCircle(p.x, p.y, p.r * 2.4);
      // Main glow
      g.fillStyle(p.color, 0.50);
      g.fillCircle(p.x, p.y, p.r * 1.5);
      // Core algae — brighter
      g.fillStyle(0x14706058, 0.80);
      g.fillCircle(p.x, p.y, p.r * 0.75);
      // Bright nucleus
      g.fillStyle(0x20a890, 0.55);
      g.fillCircle(p.x, p.y, p.r * 0.35);
    });

    // Algae tendrils along ceiling cracks
    g.lineStyle(2, 0x0a6848, 0.65);
    g.lineBetween(W * 0.3, WH * 0.22, W * 0.38, WH * 0.28);
    g.lineBetween(W * 0.42, WH * 0.18, W * 0.45, WH * 0.30);
    g.lineStyle(1.5, 0x0a5840, 0.55);
    g.lineBetween(W * 0.5, WH * 0.16, W * 0.54, WH * 0.26);

    // General blue-green ambient fill — subtle cave glow
    g.fillStyle(0x062820, 0.15);
    g.fillRect(140, 0, W - 280, WH * 0.72);

    // Animated pulse — breathing bioluminescence
    const pulseG = this.add.graphics().setDepth(3);
    this.tweens.add({
      targets: pulseG,
      alpha: { from: 0.6, to: 1.0 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        pulseG.clear();
        glowPatches.forEach(p => {
          pulseG.fillStyle(p.color, 0.14 * pulseG.alpha);
          pulseG.fillCircle(p.x, p.y, p.r * 2.8);
          pulseG.fillStyle(0x20a890, 0.18 * pulseG.alpha);
          pulseG.fillCircle(p.x, p.y, p.r * 1.1);
        });
      },
    });
  }

  // ── Drip animation ───────────────────────────────────────────

  _drawDripAnimation(W, WH) {
    // Create a few drip dots that repeat via tween
    const dripPoints = [
      { x: W * 0.28, stalY: 80,  poolY: WH * 0.84 },
      { x: W * 0.48, stalY: 95,  poolY: WH * 0.85 },
      { x: W * 0.68, stalY: 75,  poolY: WH * 0.79 },
    ];

    dripPoints.forEach((d, i) => {
      const drip = this.add.circle(d.x, d.stalY, 2.5, 0x1a4848, 1)
        .setDepth(9)
        .setAlpha(0);

      // Stagger each drip's timing
      this.time.delayedCall(i * 900 + 600, () => {
        this._animateDrip(drip, d.stalY, d.poolY);
      });
    });
  }

  _animateDrip(circle, startY, endY) {
    circle.setY(startY).setAlpha(0.8);

    this.tweens.add({
      targets: circle,
      y: endY,
      alpha: { from: 0.8, to: 0.3 },
      duration: 1400,
      ease: 'Quad.easeIn',
      onComplete: () => {
        circle.setY(startY).setAlpha(0);
        // Repeat after a pause
        this.time.delayedCall(Phaser.Math.Between(2000, 5000), () => {
          this._animateDrip(circle, startY, endY);
        });
      },
    });
  }

  // ── Hotspots ─────────────────────────────────────────────────

  _buildHotspots(W, H) {
    const WH = H - 156;

    const defs = [
      {
        id: 'entrance', name: 'Cave Entrance (Thornwood)',
        x: 70, y: WH * 0.55, w: 140, h: WH * 0.45,
        look: () => this._narrate("The way back into the Thornwood. The forest is dark and the goat may still be there. You have come a long way."),
        talk: () => this._narrate("The cave entrance opens onto the Thornwood. It says nothing, but the wind through it sounds almost like a suggestion."),
        take: () => this._narrate("You can't take the cave mouth. It is part of the mountain's opinion of itself."),
        use:  () => this._goBack(),
      },
      {
        id: 'carvings', name: 'Ancient Wall Carvings',
        x: W * 0.12, y: WH * 0.52, w: 90, h: WH * 0.35,
        look: () => this._play([
          { speaker: 'cambrie', text: "Ancient symbols carved into the cave wall — tide marks, wave counts, the kind of calendar that only makes sense if you live by the sea." },
          { speaker: 'cambrie', text: "Whoever made these tracked the tides for generations. A record of patience." },
          { speaker: 'mackenzie', text: "Or a record of people who didn't want to get caught." },
        ]),
        talk: () => this._narrate("The carvings predate anyone who might answer."),
        take: () => this._narrate("You can't take carvings out of rock. Cambrie has considered and rejected making a rubbing — no paper."),
        use:  () => this._play([
          { speaker: 'cambrie', text: "The tide markings here match the Weaver's Atlas notation. These are the old measurements — the kind people used before they had better instruments." },
          { speaker: 'cambrie', text: "Someone knew this cave very well." },
        ]),
      },
      {
        id: 'tidal_pool_left', name: 'Tidal Pool',
        x: W * 0.20, y: WH * 0.82, w: 110, h: 44,
        look: () => this._play([
          { speaker: 'narrator', text: "The pool is perfectly still. In its reflection you can see the cave ceiling — stalactites pointing upward into false sky. Small crabs pick their way along the edges, unbothered." },
        ]),
        talk: () => this._narrate("The crabs do not negotiate."),
        take: () => this._narrate("You're not taking the pool. Or the crabs. Mackenzie makes her opinion on crab-taking known."),
        use:  () => this._play([
          { speaker: 'cambrie', text: "The water is cold. Very cold. Salt and something mineral — limestone, maybe deeper iron." },
          { speaker: 'mackenzie', text: "Please don't taste the cave water." },
          { speaker: 'cambrie', text: "I used my fingers." },
        ]),
      },
      {
        id: 'tidal_pool_center', name: 'Tidal Pool',
        x: W * 0.50, y: WH * 0.86, w: 140, h: 44,
        look: () => this._narrate("The center pool is the deepest. You can't see the bottom. The blue-green light from the algae on the cave walls ripples across its surface."),
        talk: () => this._narrate("The pool offers a faint echo of your voice. That's the closest it comes to conversation."),
        take: () => this._narrate("You leave the pool where it is."),
        use:  () => this._play([
          { speaker: 'cambrie', text: "Cold. Deep. And the bioluminescent algae in the water — the light it makes is the same as what's on the walls. This whole cave is one ecosystem." },
          { speaker: 'mackenzie', text: "Pretty. Also mind the tide." },
        ]),
      },
      {
        id: 'stalactites', name: 'Stalactites',
        x: W / 2, y: WH * 0.10, w: W * 0.65, h: WH * 0.22,
        look: () => this._play([
          { speaker: 'narrator', text: "Mineral deposits over ten thousand years. A reminder that some things outlast kingdoms. Each stalactite a slow accumulation — one layer at a time, one century at a time." },
          { speaker: 'cambrie', text: "There's something reassuring about that." },
        ]),
        talk: () => this._narrate("The stalactites drip. That is their contribution to the conversation."),
        take: () => this._narrate("You'd need a chisel and considerably more time. Mackenzie is already walking."),
        use:  () => this._narrate("The stalactites don't want anything from you. They are simply waiting, the way rock does."),
      },
      {
        id: 'cave_whispers', name: 'The Whispering Caves',
        x: W / 2, y: WH * 0.42, w: W * 0.45, h: WH * 0.35,
        look: () => this._play([
          { speaker: 'narrator', text: "The cave whispers. Not words exactly — just the sound of water moving through rock, finding the path of least resistance. The sea makes its way here in ways you can hear but never see." },
          { speaker: 'mackenzie', text: "I thought it would be scarier." },
          { speaker: 'cambrie', text: "Give it time." },
        ]),
        talk: () => this._play([
          { speaker: 'cambrie', text: "You listen. The cave breathes in and out with the tide. A long, slow rhythm — older than language." },
          { speaker: 'mackenzie', text: "It's kind of peaceful." },
          { speaker: 'cambrie', text: "Don't get comfortable. The atlas said 'mind the tide.'" },
        ]),
        take: () => this._narrate("The whispers aren't physical. Mackenzie looks at you anyway."),
        use:  () => this._narrate("You hold still. The cave whispers. You whisper back. Nothing happens, but it felt right."),
      },
      {
        id: 'right_wall_carvings', name: 'Sea Carvings',
        x: W * 0.88, y: WH * 0.52, w: 90, h: WH * 0.35,
        look: () => this._play([
          { speaker: 'cambrie', text: "The right-wall carvings show wave patterns, concentric arcs — and a fish. A very deliberate fish. Someone wanted future visitors to know about the fish." },
          { speaker: 'mackenzie', text: "It's a good fish." },
        ]),
        talk: () => this._narrate("Ancient art doesn't answer to questions. This is both a relief and a disappointment."),
        take: () => this._narrate("You leave the fish carving where it was placed, ten thousand years ago, for no particular reason anyone living knows."),
        use:  () => this._narrate("The carved fish watches you with the serenity of something that has been a fish for a very long time."),
      },
      {
        id: 'exit', name: 'Passage to the Sunken Garden',
        x: W - 70, y: WH * 0.56, w: 140, h: WH * 0.45,
        look: () => this._exitLook(),
        talk: () => this._narrate("The way forward. Light from the sea filters through. It smells like salt and something floral — the Garden, ahead."),
        take: () => this._narrate("It's a cave exit, not an object."),
        use:  () => this._exitUse(),
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
        outline.lineStyle(1.5, 0xc8956c, 0.36);
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

  _exitLook() {
    const ready = GameState.hasItem('witch_riddle_answer') &&
                  GameState.hasItem('starlight_shard');
    if (ready) {
      this._narrate("The passage opens onto the coast. Daylight and salt-wind. The Sunken Garden is beyond. You have what the Thornwood and the Mere gave you — now for what lies ahead.");
    } else {
      this._narrate("The passage leads out to the sea-coast. You're not ready yet — there are still things to gather.");
    }
  }

  _exitUse() {
    const hasToken = GameState.hasItem('witch_riddle_answer');
    const hasShard = GameState.hasItem('starlight_shard');

    if (!hasToken || !hasShard) {
      this._play([
        { speaker: 'cambrie', text: "The passage is passable but we should get what we came for first." },
        { speaker: 'mackenzie', text: hasToken ? "We still need the starlight shard from the Mere." : "We need the Witch's token first. Back to the Hollow." },
      ]);
    } else {
      this._play([
        { speaker: 'mackenzie', text: "Ready?" },
        { speaker: 'cambrie', text: "We have the token and the shard. As ready as we're going to be." },
        { speaker: 'mackenzie', text: "Into the Garden, then." },
      ], () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => this.scene.start('SunkenGardenScene'));
      });
    }
  }

  _goBack() {
    this._play([
      { speaker: 'cambrie', text: "Back through the Thornwood the way we came." },
    ], () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('MirroredMereScene'));
    });
  }

  // ── Helpers ──────────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }

  _narrate(text) { this._play([{ speaker: 'narrator', text }]); }

  update() { if (this.dialogue) this.dialogue.update(); }
}
