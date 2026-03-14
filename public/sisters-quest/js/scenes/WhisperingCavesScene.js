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

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('WhisperingCavesScene');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Draw world ────────────────────────────────────────────
    this._drawCaveBackground(W, WH);
    this._drawCeilingStalactites(W, WH);
    this._drawTidalPools(W, WH);
    this._drawWallCarvings(W, WH);
    this._drawCaveEntrance(W, WH);
    this._drawCaveExit(W, WH);
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

  // ── Cave Background ──────────────────────────────────────────

  _drawCaveBackground(W, WH) {
    const g = this.add.graphics();

    // Base cave interior — deep stone grey-black
    g.fillStyle(0x06090c, 1);
    g.fillRect(0, 0, W, WH);

    // Cave ceiling — arched rock shape
    g.fillStyle(0x080b10, 1);
    g.fillRect(0, 0, W, WH * 0.28);

    // Cave arch — the passage is roughly tunnel-shaped
    // Left wall
    g.fillStyle(0x0a0e14, 1);
    g.fillTriangle(0, 0, 0, WH, 140, WH * 0.70);
    g.fillTriangle(0, 0, 140, WH * 0.70, 180, 0);

    // Right wall
    g.fillStyle(0x0a0e14, 1);
    g.fillTriangle(W, 0, W, WH, W - 140, WH * 0.70);
    g.fillTriangle(W, 0, W - 140, WH * 0.70, W - 180, 0);

    // Stone texture — irregular rock layers on walls
    g.lineStyle(1, 0x0c1018, 0.8);
    // Left wall strata
    g.lineBetween(0, WH * 0.30, 120, WH * 0.42);
    g.lineBetween(0, WH * 0.44, 110, WH * 0.54);
    g.lineBetween(0, WH * 0.58, 100, WH * 0.64);
    // Right wall strata
    g.lineBetween(W, WH * 0.30, W - 120, WH * 0.42);
    g.lineBetween(W, WH * 0.44, W - 110, WH * 0.54);
    g.lineBetween(W, WH * 0.58, W - 100, WH * 0.64);

    // Ceiling crack lines
    g.lineStyle(1, 0x141820, 0.6);
    g.lineBetween(W * 0.3, 0, W * 0.35, WH * 0.20);
    g.lineBetween(W * 0.55, 0, W * 0.52, WH * 0.15);
    g.lineBetween(W * 0.7, 0, W * 0.68, WH * 0.18);

    // Rock floor — slightly lighter than walls
    g.fillGradientStyle(0x0b0f14, 0x0b0f14, 0x0e1418, 0x0e1418, 1);
    g.fillRect(0, WH * 0.72, W, WH * 0.28);

    // Rock floor texture — wet stone sheen
    g.lineStyle(1, 0x0d1318, 0.9);
    for (let fx = 0; fx < W; fx += 60) {
      g.lineBetween(fx, WH * 0.72, fx + 30, WH * 0.75);
    }
    g.fillStyle(0x101820, 0.4);
    g.fillRect(W * 0.2, WH * 0.72, W * 0.6, 4);

    // Passage opening center — slightly lighter cave air
    g.fillStyle(0x0a1620, 0.3);
    g.fillEllipse(W / 2, WH * 0.50, W * 0.55, WH * 0.70);
  }

  // ── Ceiling Stalactites ───────────────────────────────────────

  _drawCeilingStalactites(W, WH) {
    const g = this.add.graphics().setDepth(4);

    const stalactites = [
      { x: W*0.12, h: 55, w: 12 },
      { x: W*0.22, h: 80, w: 16 },
      { x: W*0.31, h: 45, w: 10 },
      { x: W*0.40, h: 95, w: 18 },
      { x: W*0.48, h: 60, w: 13 },
      { x: W*0.56, h: 88, w: 15 },
      { x: W*0.64, h: 50, w: 11 },
      { x: W*0.73, h: 75, w: 17 },
      { x: W*0.82, h: 42, w: 10 },
      { x: W*0.90, h: 68, w: 14 },
      // Smaller secondary stalactites
      { x: W*0.17, h: 30, w: 7 },
      { x: W*0.27, h: 38, w: 8 },
      { x: W*0.44, h: 28, w: 6 },
      { x: W*0.61, h: 35, w: 7 },
      { x: W*0.77, h: 32, w: 8 },
      { x: W*0.86, h: 24, w: 6 },
    ];

    stalactites.forEach(s => {
      // Stalactite body — dark wet limestone
      g.fillStyle(0x0c1018, 1);
      g.fillTriangle(
        s.x - s.w / 2, 0,
        s.x + s.w / 2, 0,
        s.x,           s.h
      );
      // Wet sheen — thin highlight on one side
      g.fillStyle(0x1a2a3a, 0.4);
      g.fillTriangle(
        s.x - s.w * 0.15, 0,
        s.x - s.w * 0.05, 0,
        s.x,               s.h * 0.7
      );
      // Mineral band — calcium deposit ring
      g.fillStyle(0x181e28, 0.6);
      g.fillRect(s.x - s.w * 0.5 + 1, s.h * 0.3, s.w - 2, 2);
    });

    // Mineral formations on ceiling between stalactites
    g.fillStyle(0x0e1420, 0.7);
    g.fillEllipse(W * 0.35, 8, 80, 18);
    g.fillEllipse(W * 0.60, 6, 60, 14);
    g.fillEllipse(W * 0.78, 10, 70, 16);
  }

  // ── Tidal Pools ───────────────────────────────────────────────

  _drawTidalPools(W, WH) {
    const g = this.add.graphics().setDepth(5);

    const pools = [
      { x: W * 0.20, y: WH * 0.80, rx: 55, ry: 20 },
      { x: W * 0.50, y: WH * 0.85, rx: 70, ry: 22 },
      { x: W * 0.78, y: WH * 0.79, rx: 48, ry: 18 },
    ];

    pools.forEach(p => {
      // Pool edge — dark wet rock rim
      g.fillStyle(0x0c1218, 1);
      g.fillEllipse(p.x, p.y, p.rx * 2 + 8, p.ry * 2 + 6);

      // Water surface — still, reflects bioluminescent blue-green
      g.fillStyle(0x0c2830, 1);
      g.fillEllipse(p.x, p.y, p.rx * 2, p.ry * 2);

      // Inner lighter center — depth suggestion
      g.fillStyle(0x103040, 0.8);
      g.fillEllipse(p.x, p.y, p.rx * 1.3, p.ry * 1.3);

      // Bioluminescent tinge in water
      g.fillStyle(0x10504a, 0.4);
      g.fillEllipse(p.x, p.y, p.rx, p.ry * 0.9);

      // Ceiling reflection in pool — shimmer
      g.fillStyle(0x1a6860, 0.25);
      g.fillEllipse(p.x - p.rx * 0.2, p.y - p.ry * 0.1, p.rx * 0.4, p.ry * 0.5);

      // Small crabs along pool edge (suggestion)
      g.fillStyle(0x1a1610, 1);
      const crabPositions = [
        [p.x - p.rx * 0.8, p.y + p.ry * 0.6],
        [p.x + p.rx * 0.6, p.y + p.ry * 0.7],
        [p.x - p.rx * 0.3, p.y - p.ry * 0.8],
      ];
      crabPositions.forEach(([cx, cy]) => {
        g.fillEllipse(cx, cy, 7, 5);
        // Crab legs
        g.lineStyle(1, 0x201c14, 1);
        g.lineBetween(cx - 4, cy, cx - 8, cy - 4);
        g.lineBetween(cx - 3, cy + 1, cx - 7, cy + 3);
        g.lineBetween(cx + 4, cy, cx + 8, cy - 4);
        g.lineBetween(cx + 3, cy + 1, cx + 7, cy + 3);
      });
    });
  }

  // ── Wall Carvings ────────────────────────────────────────────

  _drawWallCarvings(W, WH) {
    const g = this.add.graphics().setDepth(6);

    // Left wall carvings — tide symbols
    const lx = 85;
    const ly = WH * 0.40;

    // Tide mark symbol: series of horizontal waves
    g.lineStyle(1.5, 0x1e2e3a, 0.9);
    for (let i = 0; i < 5; i++) {
      const wy = ly + i * 14;
      g.beginPath();
      g.moveTo(lx - 22, wy);
      g.lineTo(lx - 8, wy - 6);
      g.lineTo(lx + 8, wy + 6);
      g.lineTo(lx + 22, wy);
      g.strokePath();
    }

    // Circle — moon cycle symbol
    g.lineStyle(1.5, 0x1e2e3a, 0.8);
    g.strokeCircle(lx, ly + 88, 14);
    // Moon phases inside
    g.lineStyle(1, 0x1e2e3a, 0.6);
    g.lineBetween(lx, ly + 74, lx, ly + 102);

    // Vertical count marks — tide calendar
    g.lineStyle(1, 0x1a2830, 0.8);
    for (let i = 0; i < 7; i++) {
      g.lineBetween(lx - 18 + i * 6, ly + 115, lx - 18 + i * 6, ly + 128);
    }
    // Every fifth mark — diagonal cross
    g.lineBetween(lx - 18 + 4 * 6, ly + 113, lx - 18 + 4 * 6 + 12, ly + 130);

    // Right wall — wave count carving
    const rx = W - 85;
    const ry = WH * 0.38;

    // Concentric arcs — wave pattern
    g.lineStyle(1.5, 0x1e2e3a, 0.85);
    for (let i = 0; i < 4; i++) {
      g.strokeCircle(rx, ry + 50, 12 + i * 10);
    }

    // Fish silhouette — crude but intentional
    g.fillStyle(0x182030, 0.7);
    g.fillEllipse(rx, ry + 120, 26, 12);
    g.fillTriangle(rx + 13, ry + 120, rx + 22, ry + 114, rx + 22, ry + 126);

    // Bioluminescent algae growing in carved grooves — blue-green trace
    g.lineStyle(1, 0x1a5a50, 0.55);
    g.lineBetween(lx - 22, ly, lx + 22, ly);
    g.lineBetween(lx - 22, ly + 14, lx + 22, ly + 14);

    // Carving label panel suggestion — worn rectangle
    g.lineStyle(1, 0x161e28, 0.5);
    g.strokeRect(lx - 28, ly - 8, 56, 145);
    g.strokeRect(rx - 28, ry - 8, 56, 145);
  }

  // ── Cave Entrance (left) ──────────────────────────────────────

  _drawCaveEntrance(W, WH) {
    const g  = this.add.graphics().setDepth(7);
    const ex = 0;
    const ey = WH * 0.25;
    const ew = 140;
    const eh = WH * 0.50;

    // Entrance arch shape
    g.fillStyle(0x010305, 1);
    g.fillEllipse(ex + ew * 0.5, ey, ew, ew * 0.7);
    g.fillRect(ex, ey, ew, eh);

    // Forest darkness beyond — very faint blue tint from sky
    g.fillStyle(0x01030e, 0.95);
    g.fillRect(ex, ey - ew * 0.35, ew, ew * 0.35 + eh);

    // Entrance edge highlight — where cave meets outside air
    g.lineStyle(2, 0x0e1820, 1);
    g.beginPath();
    g.arc(ex + ew * 0.5, ey, ew * 0.5, Math.PI, 2 * Math.PI, false);
    g.strokePath();

    // "← Exit" arrow suggestion
    this.add.text(62, ey + eh * 0.5, '← Thornwood', {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: '#1a2a30', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(8);
  }

  // ── Cave Exit (right, toward sea) ────────────────────────────

  _drawCaveExit(W, WH) {
    const g  = this.add.graphics().setDepth(7);
    const ex = W - 140;
    const ey = WH * 0.22;
    const ew = 140;
    const eh = WH * 0.52;

    // Exit arch — daylight visible beyond
    // Outer glow of daylight
    g.fillStyle(0x304858, 0.25);
    g.fillEllipse(W - ew * 0.5, ey, ew * 1.3, ew * 0.9);
    g.fillStyle(0x405870, 0.15);
    g.fillRect(ex - 20, ey, ew + 20, eh);

    // Bright sea-light beyond exit
    g.fillStyle(0x1a3040, 0.45);
    g.fillEllipse(W - ew * 0.5, ey, ew * 0.9, ew * 0.6);
    g.fillRect(ex + 10, ey, ew - 10, eh);

    // Exit arch outline
    g.lineStyle(2, 0x1a2e3c, 1);
    g.beginPath();
    g.arc(W - ew * 0.5, ey, ew * 0.5, Math.PI, 2 * Math.PI, false);
    g.strokePath();

    // Sea light shafts — pale rays entering
    g.fillStyle(0x243850, 0.12);
    g.fillTriangle(W - 30, ey - 10, W - 60, ey + 60, W, ey + 60);
    g.fillTriangle(W - 50, ey - 10, W - 90, ey + 80, W - 20, ey + 80);

    // "Exit →" label
    this.add.text(W - 68, ey + eh * 0.5, 'Sunken Garden →', {
      fontFamily: 'Georgia, serif', fontSize: '9px',
      color: '#2a4050', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(8);
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
      g.fillStyle(p.color, 0.18);
      g.fillCircle(p.x, p.y, p.r * 2.2);
      // Main glow
      g.fillStyle(p.color, 0.40);
      g.fillCircle(p.x, p.y, p.r * 1.4);
      // Core algae
      g.fillStyle(0x0e5848, 0.65);
      g.fillCircle(p.x, p.y, p.r * 0.7);
    });

    // Algae tendrils along ceiling cracks
    g.lineStyle(2, 0x0a4838, 0.5);
    g.lineBetween(W * 0.3, WH * 0.22, W * 0.38, WH * 0.28);
    g.lineBetween(W * 0.42, WH * 0.18, W * 0.45, WH * 0.30);
    g.lineStyle(1, 0x083830, 0.4);
    g.lineBetween(W * 0.5, WH * 0.16, W * 0.54, WH * 0.26);

    // General blue-green ambient fill — very subtle
    g.fillStyle(0x062820, 0.12);
    g.fillRect(140, 0, W - 280, WH * 0.72);
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
