// ============================================================
// scenes/ThornwoodScene.js — Sisters' Quest: The Moonveil Crown
// Act 2: The edge of the Thornwood forest, Witch's Hollow, Thorn.
// Extends BaseScene — verb bar and inventory built in.
// ============================================================

class ThornwoodScene extends BaseScene {
  constructor() { super({ key: 'ThornwoodScene' }); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('ThornwoodScene');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Draw world ────────────────────────────────────────────
    this._drawSky(W, WH);
    this._drawForestBack(W, WH);
    this._drawIronGate(W, WH);
    this._drawGround(W, WH);
    this._drawHollow(W, WH);
    this._drawThorn(W, WH);

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

  // ── Sky ──────────────────────────────────────────────────────

  _drawSky(W, WH) {
    const g = this.add.graphics();
    // Deep blue-black gradient sky
    g.fillGradientStyle(0x02030a, 0x02030a, 0x04081a, 0x04081a, 1);
    g.fillRect(0, 0, W, WH * 0.55);

    // Pale stars
    g.fillStyle(0xd0d8f0, 1);
    const stars = [
      [42, 18], [120, 9], [198, 25], [280, 12], [350, 30], [430, 8],
      [510, 22], [580, 14], [640, 35], [700, 10], [760, 28], [820, 16],
      [870, 40], [55, 45], [310, 50], [660, 42], [780, 55], [900, 30],
    ];
    stars.forEach(([sx, sy]) => {
      g.fillCircle(sx, sy, Math.random() > 0.6 ? 1.5 : 1);
    });
    // A couple brighter stars
    g.fillStyle(0xeef4ff, 0.9);
    g.fillCircle(195, 20, 2);
    g.fillCircle(640, 30, 2);
  }

  // ── Background forest ────────────────────────────────────────

  _drawForestBack(W, WH) {
    const g = this.add.graphics();

    // Far treeline silhouette (dark blue-black)
    g.fillStyle(0x030610, 1);
    const horizon = WH * 0.55;

    // Draw gnarled tree silhouettes as irregular shapes
    const trees = [
      { x: 0,    w: 90,  h: 220, lean: -8  },
      { x: 70,   w: 70,  h: 260, lean: 5   },
      { x: 130,  w: 80,  h: 190, lean: -4  },
      { x: 200,  w: 100, h: 240, lean: 10  },
      { x: 290,  w: 60,  h: 210, lean: -6  },
      { x: 480,  w: 75,  h: 230, lean: 8   },
      { x: 540,  w: 90,  h: 200, lean: -10 },
      { x: 610,  w: 65,  h: 250, lean: 5   },
      { x: 660,  w: 85,  h: 215, lean: -5  },
      { x: 730,  w: 95,  h: 235, lean: 12  },
      { x: 810,  w: 70,  h: 200, lean: -8  },
      { x: 870,  w: 100, h: 245, lean: 6   },
      { x: 950,  w: 80,  h: 220, lean: -3  },
    ];

    trees.forEach(t => {
      // Trunk
      g.fillStyle(0x030610, 1);
      g.fillRect(t.x + t.w * 0.4, horizon - t.h * 0.4, t.w * 0.12, t.h * 0.4);

      // Canopy — gnarled blob using overlapping triangles/rects
      const tx = t.x + t.w / 2 + t.lean;
      const ty = horizon - t.h * 0.6;
      g.fillTriangle(
        tx - t.w * 0.5, horizon - t.h * 0.4,
        tx + t.lean,    ty,
        tx + t.w * 0.5, horizon - t.h * 0.3
      );
      g.fillTriangle(
        tx - t.w * 0.4, horizon - t.h * 0.52,
        tx + t.lean * 0.5, ty - t.h * 0.12,
        tx + t.w * 0.4, horizon - t.h * 0.48
      );
      // Gnarled branches
      g.lineStyle(2, 0x04080f, 1);
      g.lineBetween(tx, horizon - t.h * 0.5, tx - t.w * 0.4, horizon - t.h * 0.62);
      g.lineBetween(tx, horizon - t.h * 0.5, tx + t.w * 0.35, horizon - t.h * 0.58);
    });

    // Fill the ground under treeline
    g.fillStyle(0x02040a, 1);
    g.fillRect(0, horizon, W, WH - horizon);

    // Midground tree trunks with visible roots
    g.fillStyle(0x060a12, 1);
    const midTrunks = [
      { x: 40,  y: WH * 0.72, w: 18, h: WH * 0.28 },
      { x: 160, y: WH * 0.68, w: 22, h: WH * 0.32 },
      { x: 820, y: WH * 0.70, w: 16, h: WH * 0.30 },
      { x: 940, y: WH * 0.65, w: 24, h: WH * 0.35 },
    ];
    midTrunks.forEach(t => {
      g.fillRect(t.x, t.y, t.w, t.h);
      // Root spread
      g.fillTriangle(t.x - 14, WH, t.x, t.y + t.h * 0.6, t.x + t.w, t.y + t.h * 0.6);
      g.fillTriangle(t.x + t.w, t.y + t.h * 0.6, t.x + t.w + 14, WH, t.x, t.y + t.h * 0.6);
    });

    // Cold blue ambient — subtle fog layer at horizon
    g.fillStyle(0x0a1828, 0.18);
    g.fillRect(0, horizon - 20, W, 60);
  }

  // ── Iron Gate ────────────────────────────────────────────────

  _drawIronGate(W, WH) {
    const g  = this.add.graphics().setDepth(6);
    const gx = W * 0.68;
    const gy = WH * 0.3;
    const gw = 200;
    const gh = WH * 0.55;

    // Stone pillars either side
    g.fillStyle(0x181a20, 1);
    g.fillRect(gx - 14, gy, 18, gh);
    g.fillRect(gx + gw - 4, gy, 18, gh);
    g.lineStyle(1, 0x282a34, 1);
    g.strokeRect(gx - 14, gy, 18, gh);
    g.strokeRect(gx + gw - 4, gy, 18, gh);

    // Pillar capstones
    g.fillStyle(0x22242e, 1);
    g.fillRect(gx - 18, gy - 12, 26, 14);
    g.fillRect(gx + gw - 8, gy - 12, 26, 14);

    // Left door panel
    g.fillStyle(0x1a1008, 1);
    g.fillRect(gx, gy, gw / 2 - 4, gh);
    g.lineStyle(1.5, 0x3a2808, 1);
    g.strokeRect(gx, gy, gw / 2 - 4, gh);
    // Wood grain lines
    g.lineStyle(1, 0x221408, 0.6);
    for (let ly = gy + 18; ly < gy + gh - 10; ly += 22) {
      g.lineBetween(gx + 4, ly, gx + gw / 2 - 8, ly);
    }

    // Right door panel
    g.fillStyle(0x1a1008, 1);
    g.fillRect(gx + gw / 2 + 4, gy, gw / 2 - 4, gh);
    g.lineStyle(1.5, 0x3a2808, 1);
    g.strokeRect(gx + gw / 2 + 4, gy, gw / 2 - 4, gh);
    g.lineStyle(1, 0x221408, 0.6);
    for (let ly = gy + 18; ly < gy + gh - 10; ly += 22) {
      g.lineBetween(gx + gw / 2 + 8, ly, gx + gw - 8, ly);
    }

    // Iron chains draped across
    g.lineStyle(3, 0x404040, 1);
    // Chain 1 — diagonal drape
    g.lineBetween(gx - 10, gy + 40, gx + gw / 2, gy + 90);
    g.lineBetween(gx + gw / 2, gy + 90, gx + gw + 10, gy + 50);
    // Chain 2 — lower drape
    g.lineBetween(gx - 10, gy + 80, gx + gw * 0.45, gy + 130);
    g.lineBetween(gx + gw * 0.45, gy + 130, gx + gw + 10, gy + 100);
    // Chain link detail
    g.lineStyle(2, 0x505050, 0.7);
    g.lineBetween(gx + gw * 0.3, gy + 65, gx + gw * 0.7, gy + 75);

    // Chain padlock
    g.fillStyle(0x5a5020, 1);
    g.fillRoundedRect(gx + gw / 2 - 10, gy + 86, 20, 16, 3);
    g.lineStyle(2, 0x8a7830, 1);
    g.strokeRoundedRect(gx + gw / 2 - 10, gy + 86, 20, 16, 3);

    // Beyond gate: pitch black interior
    g.fillStyle(0x000000, 0.88);
    g.fillRect(gx + 2, gy + 2, gw - 8, gh - 2);

    // Very faint cold light beyond the gate
    g.fillStyle(0x0a1428, 0.15);
    g.fillRect(gx + 2, gy + 2, gw - 8, gh / 2);
  }

  // ── Ground / clearing ────────────────────────────────────────

  _drawGround(W, WH) {
    const g = this.add.graphics().setDepth(2);

    // Main ground — dark earth
    g.fillGradientStyle(0x0a0c08, 0x0a0c08, 0x0e1008, 0x0e1008, 1);
    g.fillRect(0, WH * 0.72, W, WH * 0.28);

    // Moss patches
    const mosses = [
      { x: 60,  y: WH * 0.80, r: 28 },
      { x: 240, y: WH * 0.84, r: 20 },
      { x: 420, y: WH * 0.76, r: 34 },
      { x: 580, y: WH * 0.82, r: 18 },
      { x: 720, y: WH * 0.78, r: 24 },
    ];
    mosses.forEach(m => {
      g.fillStyle(0x0e1a0a, 1);
      g.fillEllipse(m.x, m.y, m.r * 2, m.r * 0.7);
    });

    // Root tangles on ground
    g.lineStyle(2, 0x141208, 1);
    g.lineBetween(50, WH * 0.83, 130, WH * 0.88);
    g.lineBetween(80, WH * 0.88, 160, WH * 0.83);
    g.lineBetween(800, WH * 0.80, 880, WH * 0.87);
    g.lineBetween(840, WH * 0.87, 910, WH * 0.82);

    // Small mushrooms
    const shrooms = [
      { x: 200, y: WH * 0.84, r: 6, cap: 0x4a1a1a },
      { x: 215, y: WH * 0.85, r: 4, cap: 0x3a1212 },
      { x: 600, y: WH * 0.80, r: 5, cap: 0x4a1a08 },
      { x: 610, y: WH * 0.81, r: 3, cap: 0x5a2008 },
    ];
    shrooms.forEach(s => {
      g.fillStyle(0xe0d8c0, 1);
      g.fillRect(s.x - 1, s.y - s.r * 0.8, 2, s.r * 0.8);
      g.fillStyle(s.cap, 1);
      g.fillEllipse(s.x, s.y - s.r * 0.8, s.r * 2.2, s.r * 1.2);
    });

    // Path toward gate (worn dirt track)
    g.fillStyle(0x0c0d08, 0.6);
    g.fillEllipse(W * 0.62, WH * 0.9, 200, 40);
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

    // Warm amber glow from inside
    const glowG = this.add.graphics().setDepth(5);
    glowG.fillStyle(0xd46a10, 0.22);
    glowG.fillEllipse(hx, hy + 30, 130, 110);
    glowG.fillStyle(0xe07818, 0.12);
    glowG.fillEllipse(hx, hy + 40, 180, 130);

    // Pulsing glow tween
    this.tweens.add({
      targets: glowG,
      alpha: { from: 0.8, to: 0.5 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
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
    // Bracket
    g.fillStyle(0x505040, 1);
    g.fillRect(x - 2, y, 4, 22);
    g.fillRect(x - 6, y + 16, 12, 4);
    // Cup
    g.fillStyle(0x706050, 1);
    g.fillRect(x - 4, y + 8, 8, 12);
    // Flames
    g.fillStyle(0xd05810, 0.8);
    g.fillTriangle(x - 5, y + 8, x, y - 12, x + 5, y + 8);
    g.fillStyle(0xe08828, 0.65);
    g.fillTriangle(x - 3, y + 8, x, y - 4, x + 3, y + 8);
    g.fillStyle(0xf8d060, 0.5);
    g.fillTriangle(x - 2, y + 8, x, y, x + 2, y + 8);
  }

  // ── Thorn the Goat ───────────────────────────────────────────

  _drawThorn(W, WH) {
    const g  = this.add.graphics().setDepth(12);
    const tx = W * 0.44;
    const ty = WH * 0.72;

    // Body — small, black, dignified
    g.fillStyle(0x0c0c0e, 1);
    g.fillEllipse(tx, ty - 20, 58, 34);

    // Legs — four neat, upright legs
    g.fillStyle(0x0e0e10, 1);
    g.fillRect(tx - 18, ty - 6, 7, 30);
    g.fillRect(tx - 6,  ty - 6, 7, 30);
    g.fillRect(tx + 6,  ty - 6, 7, 30);
    g.fillRect(tx + 18, ty - 6, 7, 30);
    // Hooves
    g.fillStyle(0x1a1a1c, 1);
    g.fillEllipse(tx - 14, ty + 24, 9, 5);
    g.fillEllipse(tx - 2,  ty + 24, 9, 5);
    g.fillEllipse(tx + 10, ty + 24, 9, 5);
    g.fillEllipse(tx + 22, ty + 24, 9, 5);

    // Neck
    g.fillStyle(0x0c0c0e, 1);
    g.fillEllipse(tx + 22, ty - 32, 18, 26);

    // Head — slightly raised, haughty tilt
    g.fillStyle(0x0e0e10, 1);
    g.fillEllipse(tx + 30, ty - 46, 24, 20);

    // Amber eyes — the soul of the operation
    g.fillStyle(0xd4840a, 1);
    g.fillCircle(tx + 36, ty - 48, 3.5);
    g.fillStyle(0x080808, 1);
    g.fillCircle(tx + 36, ty - 48, 1.5);
    // Gleam
    g.fillStyle(0xfff0c0, 0.9);
    g.fillCircle(tx + 37.5, ty - 49.5, 0.8);

    // Ear
    g.fillStyle(0x141414, 1);
    g.fillTriangle(tx + 26, ty - 54, tx + 22, ty - 62, tx + 30, ty - 58);

    // Beard — a small distinguished one
    g.fillStyle(0x181818, 1);
    g.fillEllipse(tx + 28, ty - 36, 7, 12);

    // Horns — small, curved
    g.lineStyle(2.5, 0x5a4820, 1);
    g.beginPath();
    g.moveTo(tx + 24, ty - 54);
    g.lineTo(tx + 18, ty - 64);
    g.lineTo(tx + 20, ty - 68);
    g.strokePath();
    g.beginPath();
    g.moveTo(tx + 30, ty - 54);
    g.lineTo(tx + 36, ty - 63);
    g.lineTo(tx + 38, ty - 67);
    g.strokePath();

    // Tail flick — small upright curl
    g.lineStyle(2, 0x0e0e10, 1);
    g.beginPath();
    g.moveTo(tx - 26, ty - 24);
    g.lineTo(tx - 34, ty - 34);
    g.lineTo(tx - 30, ty - 42);
    g.strokePath();

    // Thorn's name tag aesthetic — a small bell on a ribbon
    g.fillStyle(0x906820, 1);
    g.fillCircle(tx + 22, ty - 26, 4);
    g.lineStyle(1, 0xc8a030, 1);
    g.strokeCircle(tx + 22, ty - 26, 4);

    // Subtle idle sway tween
    this._thornGraphic = g;
    this.tweens.add({
      targets: g,
      x: { from: 0, to: 5 },
      duration: 2800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
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
