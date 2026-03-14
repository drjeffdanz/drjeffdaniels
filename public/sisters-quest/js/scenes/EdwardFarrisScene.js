// ============================================================
// scenes/EdwardFarrisScene.js — Sisters' Quest: The Moonveil Crown
// Harbor Master's Office — Edward Farris
// Indoor, stone walls, harbor view through window.
// ============================================================

class EdwardFarrisScene extends BaseScene {
  constructor() { super({ key: 'EdwardFarrisScene' }); }

  preload() { this.load.image('bg_harbor', 'assets/backgrounds/harbor-office.jpg'); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('EdwardFarrisScene');

    // ── Camera ─────────────────────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Scene label ────────────────────────────────────────────
    this.add.text(W / 2, 18, "Harbor Master's Office  ·  Cresthollow Harbor", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#2a2e38', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Background image ───────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_harbor').setDisplaySize(W, WH).setDepth(0);

    // ── World ──────────────────────────────────────────────────
    this._initSceneCoords(W, WH);
    this._drawFarris(W, WH);

    // ── Stamp animation ────────────────────────────────────────
    this._stampY = 0;
    this._stampDir = 1;
    this._stampGraphics = this.add.graphics().setDepth(11);
    this._lastStampTime = 0;

    // ── Dialogue ───────────────────────────────────────────────
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

    // ── Hotspots ───────────────────────────────────────────────
    this._buildHotspots(W, WH);

    // ── Shared UI — always last ────────────────────────────────
    this._initUI();
  }

  // ── Scene coordinate initialiser ──────────────────────────

  _initSceneCoords(W, WH) {
    // Filing cabinet bounds (used by hotspots)
    this._leftCabX  = 0;
    this._leftCabW  = W * 0.22;
    this._rightCabX = W * 0.84;
    this._rightCabW = W * 0.16;

    // Harbor window bounds
    this._windowX = W * 0.56;
    this._windowY = WH * 0.08;
    this._windowW = W * 0.24;
    this._windowH = WH * 0.34;

    // Desk bounds (also used by _drawFarris)
    this._deskX = W * 0.22;
    this._deskY = WH * 0.48;
    this._deskW = W * 0.58;
    this._deskH = WH * 0.26;

    // Stamp position (used by animated arm in _drawFarris)
    this._stampBaseX = this._deskX + this._deskW * 0.60 + 11;
    this._stampBaseY = this._deskY - 18;

    // Door bounds
    const dX = W - 68, dW = 54, dH = WH * 0.40;
    this._doorX = dX;
    this._doorY = WH * 0.42;
    this._doorW = dW + 12;
    this._doorH = dH + 6;
  }

  // ── Edward Farris ─────────────────────────────────────────

  _drawFarris(W, WH) {
    const g  = this.add.graphics().setDepth(9);
    // Farris sits behind the desk
    const fX = W * 0.50, fY = this._deskY - 68;

    // Chair back (visible above desk edge)
    g.fillStyle(0x1e1c18, 1);
    g.fillRect(fX - 22, fY + 52, 44, 14);
    g.lineStyle(1, 0x3a3028, 1);
    g.strokeRect(fX - 22, fY + 52, 44, 14);

    // Torso (dark uniform — naval/bureaucratic)
    g.fillStyle(0x1e2228, 1);
    g.fillRect(fX - 18, fY + 12, 36, 44);
    // Uniform details
    g.fillStyle(0x2a2e38, 1);
    g.fillRect(fX - 8, fY + 12, 6, 44);  // lapel
    g.fillRect(fX + 2, fY + 12, 6, 44);  // lapel
    // Buttons
    g.fillStyle(0xc8956c, 0.8);
    [fY + 18, fY + 28, fY + 38].forEach(by => g.fillCircle(fX, by, 2));
    // Epaulettes
    g.fillStyle(0x3a3e48, 1);
    g.fillRect(fX - 22, fY + 14, 8, 6);
    g.fillRect(fX + 14, fY + 14, 8, 6);
    g.fillStyle(0xc8956c, 0.5);
    g.fillRect(fX - 20, fY + 15, 4, 4);
    g.fillRect(fX + 16, fY + 15, 4, 4);

    // Arms (bent over desk, perpetually stamping)
    g.fillStyle(0x1e2228, 1);
    g.fillRect(fX - 22, fY + 30, 8, 26);  // left arm
    g.fillRect(fX + 14, fY + 30, 8, 26);  // right arm (stamp hand)
    // Hands
    g.fillStyle(0xc09070, 1);
    g.fillEllipse(fX - 18, fY + 56, 12, 8);
    g.fillEllipse(fX + 18, fY + 56, 12, 8);

    // Head
    g.fillStyle(0xc09070, 1);
    g.fillCircle(fX, fY - 2, 17);
    // Hair (neatly combed, dark with silver temples)
    g.fillStyle(0x1e1a14, 1);
    g.fillEllipse(fX, fY - 14, 34, 16);
    g.fillStyle(0x9090a0, 0.6);
    // Silver temples
    g.fillRect(fX - 17, fY - 10, 5, 10);
    g.fillRect(fX + 12, fY - 10, 5, 10);
    // Precise side part
    g.lineStyle(1, 0x2a2418, 1);
    g.lineBetween(fX - 4, fY - 18, fX - 4, fY - 8);
    // Eyes (sharp, focused on work)
    g.fillStyle(0x201c18, 1);
    g.fillEllipse(fX - 6, fY - 2, 6, 4);
    g.fillEllipse(fX + 6, fY - 2, 6, 4);
    // Small gleam in eye
    g.fillStyle(0xc8c0b8, 0.7);
    g.fillCircle(fX - 5, fY - 3, 1);
    g.fillCircle(fX + 7, fY - 3, 1);
    // Thin set mouth (concentration)
    g.lineStyle(1, 0x9a7050, 0.8);
    g.lineBetween(fX - 6, fY + 7, fX + 6, fY + 7);
    // Thin mustache (neat)
    g.lineStyle(1.5, 0x3a3028, 0.9);
    g.lineBetween(fX - 7, fY + 3, fX - 2, fY + 4);
    g.lineBetween(fX + 2, fY + 4, fX + 7, fY + 3);

    // Subtle stamp-motion tween (right arm)
    const armGraphic = this.add.graphics().setDepth(10);
    this.tweens.add({
      targets: { arm: 0 },
      arm: 1,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut',
      onUpdate: (tw, tgt) => {
        const a = tgt.arm;
        armGraphic.clear();
        // Right arm stamps down
        armGraphic.fillStyle(0x1e2228, 1);
        armGraphic.fillRect(fX + 14, fY + 30, 8, 26 + a * 8);
        armGraphic.fillStyle(0xc09070, 1);
        armGraphic.fillEllipse(fX + 18, fY + 56 + a * 8, 12, 8);
        // Stamp mark flash at peak
        if (a > 0.85) {
          armGraphic.fillStyle(0xc8956c, 0.25);
          armGraphic.fillRect(this._stampBaseX - 10, this._deskY + 8, 20, 8);
        }
      },
    });

    this._farrisX = fX;
    this._farrisY = fY;
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Farris at desk ────────────────────────────────────────
    this._addHotspot({
      id: 'farris', name: 'Edward Farris',
      x: this._farrisX, y: this._farrisY + 20, w: 72, h: 88,
      look: () => this._narrate("Edward Farris is a man who has found meaning in filing systems. Every paper on that desk is exactly where it should be. Probably in triplicate."),
      talk: () => this._talkToFarris(),
      take: () => this._narrate("Harbor Master Farris would not appreciate that."),
      use:  () => this._narrate("Farris is a person, not a mechanism. Though he does operate with remarkable precision."),
    });

    // ── Filing cabinets ───────────────────────────────────────
    this._addHotspot({
      id: 'cabinets_left', name: 'Filing Cabinets',
      x: this._leftCabX + this._leftCabW / 2, y: WH * 0.36,
      w: this._leftCabW, h: WH * 0.72,
      look: () => this._narrate("Forty years of harbor records. Every ship. Every cargo. Every piece of 'salvage.' Farris knows where every single form lives. This is both impressive and deeply concerning."),
      talk: () => this._narrate("The cabinets don't answer. Filing cabinets rarely do."),
      take: () => this._narrate("You can't take the filing cabinets."),
      use:  () => this._narrate("You need Farris to find the right file — he knows this system. Any other approach would take weeks."),
    });

    this._addHotspot({
      id: 'cabinets_right', name: 'Filing Cabinets',
      x: this._rightCabX + this._rightCabW / 2, y: WH * 0.36,
      w: this._rightCabW, h: WH * 0.72,
      look: () => this._narrate("The right-side cabinets appear to be organized by year, decade, and 'miscellaneous incidents.' The miscellaneous section is suspiciously thick."),
      talk: () => this._narrate("The filing system continues to not respond."),
      take: () => this._narrate("These cabinets are the property of the Harbor Authority."),
      use:  () => this._narrate("You need Farris to navigate this. He built it. He is probably the only one who can."),
    });

    // ── Harbor window ─────────────────────────────────────────
    this._addHotspot({
      id: 'harbor_window', name: 'Harbor Window',
      x: this._windowX + this._windowW / 2, y: this._windowY + this._windowH / 2,
      w: this._windowW, h: this._windowH,
      look: () => this._narrate("Through the cloudy glass, the harbor is quiet. A few boats are moored. No movement. The water is the gray-green of November and keeps no appointments."),
      talk: () => this._narrate("The harbor is indifferent to being spoken to."),
      take: () => this._narrate("You are not going to take the window."),
      use:  () => this._play([
        { speaker: 'cambrie', text: "The Isle of Tides is out there, somewhere past the breakwater. If the harbor were open, we'd already be on a boat." },
        { speaker: 'mackenzie', text: "Then let's get it open." },
      ]),
    });

    // ── Desk with papers ──────────────────────────────────────
    this._addHotspot({
      id: 'desk', name: 'Harbor Master\'s Desk',
      x: this._deskX + this._deskW / 2, y: this._deskY + this._deskH / 2,
      w: this._deskW, h: this._deskH,
      look: () => this._play([
        { speaker: 'cambrie', text: "Forms in triplicate. Forms in quadruplicate. At least one form that appears to be a form about forms." },
        { speaker: 'mackenzie', text: "Is that the Sable Dawn ledger?" },
        { speaker: 'cambrie', text: "Yes. And the entry for the seal-skin cloak is listed as 'salvage.' Someone logged it as cargo." },
        { speaker: 'mackenzie', text: "That's not salvage. That's a selkie's life. We need that manifest." },
      ]),
      talk: () => this._narrate("The desk is not the kind of object that listens."),
      take: () => this._narrate("You cannot take the desk. Several laws would be broken and Farris would be very cross."),
      use:  () => {
        if (VerbSystem.activeItem === 'ships_manifest') {
          this._narrate("You already have the manifest. It's right there in your bag.");
        } else {
          this._narrate("Farris is the one who can pull the right documents. The desk is just where they live.");
        }
      },
    });

    // ── Door / exit ───────────────────────────────────────────
    this._addHotspot({
      id: 'door', name: 'Door — Exit to Harbor',
      x: this._doorX + this._doorW / 2, y: this._doorY + this._doorH / 2,
      w: this._doorW, h: this._doorH,
      look: () => this._narrate("The door to the harbor road. Cresthollow is a short walk north."),
      talk: () => this._narrate("The door says nothing. It just opens and closes."),
      take: () => this._narrate("You are not going to take the door."),
      use:  () => this._goTo('CresthollowScene'),
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
      outline.lineStyle(1.5, 0xc8956c, 0.35);
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

  // ── Farris dialogue logic ─────────────────────────────────

  _talkToFarris() {
    if (GameState.getFlag('farris_done')) {
      this._play(DIALOGUE_FARRIS_REPEAT);
    } else if (!GameState.getFlag('farris_first_done')) {
      GameState.setFlag('farris_first_done');
      this._play(DIALOGUE_FARRIS_FIRST, () => {
        // After first conversation, immediately give manifest sequence
        this.time.delayedCall(200, () => this._farrisGivesManifest());
      });
    } else {
      this._farrisGivesManifest();
    }
  }

  _farrisGivesManifest() {
    if (GameState.getFlag('farris_done')) return;
    this._play(DIALOGUE_FARRIS_GIVES_MANIFEST, () => {
      GameState.setFlag('farris_done');
      GameState.addItem('ships_manifest');
      GameState.addItem('harbor_pass');
      this.setStatus("Received: Ship's Manifest and Harbor Pass.");
    });
  }

  // ── Transitions ───────────────────────────────────────────

  _goTo(scene) {
    this._locked = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start(scene));
  }

  // ── Helpers ───────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }
  _narrate(text)          { this._play([{ speaker: 'narrator', text }]); }

  update() { if (this.dialogue) this.dialogue.update(); }
}
