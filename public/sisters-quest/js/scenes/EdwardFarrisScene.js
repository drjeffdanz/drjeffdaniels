// ============================================================
// scenes/EdwardFarrisScene.js — Sisters' Quest: The Moonveil Crown
// Harbor Master's Office — Edward Farris
// Indoor, stone walls, harbor view through window.
// ============================================================

class EdwardFarrisScene extends BaseScene {
  constructor() { super({ key: 'EdwardFarrisScene' }); }

  preload() { this.load.image('bg_harbor', 'assets/backgrounds/harbor-office.jpg'); }

  create() {
    MusicManager.play(this, 'music_harbor');
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('EdwardFarrisScene');

    // ── Camera ─────────────────────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Scene label ────────────────────────────────────────────
    this.add.text(W / 2, 18, "Harbor Master's Office  ·  Good Ship Peabody  ·  Cresthollow", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#2a2e38', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Background image ───────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_harbor').setDisplaySize(W, WH).setDepth(0);

    // ── World ──────────────────────────────────────────────────
    this._initSceneCoords(W, WH);
    this._farrisX = W * 0.40;
    this._farrisY = this._deskY - 68;
    // Warm glow backlight (draws the eye)
    this.add.graphics().setDepth(0).fillStyle(0xc8956c, 0.18).fillEllipse(W * 0.40, WH * 0.80 - 130, 110, 260);
    // Ground shadow
    this.add.graphics().setDepth(0).fillStyle(0x000000, 0.30).fillEllipse(W * 0.40, WH * 0.80, 80, 20);
    this.add.image(W * 0.40, WH * 0.80, 'sprite_farris')
      .setDisplaySize(140, 260).setOrigin(0.5, 1).setDepth(1);

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

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Farris at desk ────────────────────────────────────────
    this._addHotspot({
      id: 'farris', name: 'Capt. Edward Farris',
      x: this._farrisX, y: this._farrisY + 20, w: 72, h: 88,
      look: () => this._narrate("Capt. Edward Farris is a man who has found meaning in filing systems. Every paper on that desk is exactly where it should be. Probably in triplicate. The Good Ship Peabody is lucky to have him — when he's not here stamping forms."),
      talk: () => this._talkToFarris(),
      take: () => this._narrate("Capt. Farris would not appreciate that."),
      use:  () => this._narrate("Capt. Farris is a person, not a mechanism. Though he does operate with remarkable precision."),
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
          this._narrate("Capt. Farris is the one who can pull the right documents. The desk is just where they live.");
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
    GameState.save(scene);
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(scene);
    });
  }

  // ── Helpers ───────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }
  _narrate(text)          { this._play([{ speaker: 'narrator', text }]); }

  update() { if (this.dialogue) this.dialogue.update(); }
}
