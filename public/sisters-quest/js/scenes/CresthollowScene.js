// ============================================================
// scenes/CresthollowScene.js — Sisters' Quest: The Moonveil Crown
// Act 2 Hub: Cresthollow Village Square
// A market town at the edge of the Thornwood. Dawn, overcast.
// ============================================================

class CresthollowScene extends BaseScene {
  constructor() { super({ key: 'CresthollowScene' }); }

  preload() {
    this.load.image('bg_cresthollow', 'assets/backgrounds/cresthollow.jpg');
  }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('CresthollowScene');

    // ── Camera ────────────────────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_cresthollow').setDisplaySize(W, WH).setDepth(0);

    // ── Scene label ───────────────────────────────────────────
    this.add.text(W / 2, 18, 'Cresthollow  ·  The Village Square', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#3a3028', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Thornwood gate, notice board, Bram, path arrows ───────
    this._drawThornwoodGate(W, WH);
    this._drawNoticeBoard(W, WH);
    this._drawBram(W, WH);
    this._drawPathArrows(W, WH);

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
      this._checkThornwoodState();
    });

    // ── Hotspots ──────────────────────────────────────────────
    this._buildHotspots(W, WH);

    // ── Check for Thornwood unlock on entry ───────────────────
    this._checkThornwoodState();

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // ── Entry dialogue (first visit only) ────────────────────
    if (!GameState.getFlag('cresthollow_entered')) {
      GameState.setFlag('cresthollow_entered');
      this.time.delayedCall(600, () => {
        this._play(DIALOGUE_CRESTHOLLOW_ENTER);
      });
    }
  }

  // ── Thornwood Gate ────────────────────────────────────────

  _drawThornwoodGate(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const gX = W * 0.80, gY = WH * 0.22, gW = W * 0.18, gH = WH * 0.58;

    // Ominous dark trees behind gate
    g.fillStyle(0x080a0e, 1);
    for (let tx = gX - 14; tx < W + 20; tx += 18) {
      const th = Phaser.Math.Between(70, 150);
      const tw = Phaser.Math.Between(14, 24);
      g.fillTriangle(tx, gY - th + 30, tx - tw / 2, gY + gH * 0.7, tx + tw / 2, gY + gH * 0.7);
    }
    // Misty dark overlay behind gate
    g.fillStyle(0x0a0c12, 0.6);
    g.fillRect(gX - 10, gY, gW + 10, gH);

    // Gate pillars
    const pillarW = 20;
    g.fillStyle(0x2a2820, 1);
    g.fillRect(gX - pillarW / 2, gY, pillarW, gH);
    g.fillRect(gX + gW - pillarW / 2, gY, pillarW, gH);
    g.lineStyle(2, 0x4a4838, 1);
    g.strokeRect(gX - pillarW / 2, gY, pillarW, gH);
    g.strokeRect(gX + gW - pillarW / 2, gY, pillarW, gH);
    // Pillar caps
    g.fillStyle(0x3a3830, 1);
    g.fillRect(gX - pillarW / 2 - 4, gY - 14, pillarW + 8, 14);
    g.fillRect(gX + gW - pillarW / 2 - 4, gY - 14, pillarW + 8, 14);

    // Gate doors (wooden planks, dark)
    const gateL = gX + pillarW / 2, gateR = gX + gW - pillarW / 2;
    const gMid  = (gateL + gateR) / 2;
    // Left door
    g.fillStyle(0x1e1c14, 1);
    g.fillRect(gateL, gY + 4, gMid - gateL, gH - 8);
    // Right door
    g.fillRect(gMid, gY + 4, gateR - gMid, gH - 8);
    // Plank lines on doors
    g.lineStyle(1, 0x2e2c22, 0.8);
    for (let gy = gY + 24; gy < gY + gH - 8; gy += 22) {
      g.lineBetween(gateL, gy, gMid - 2, gy);
      g.lineBetween(gMid + 2, gy, gateR, gy);
    }
    // Iron banding
    g.fillStyle(0x1a1c1a, 1);
    [gY + gH * 0.2, gY + gH * 0.5, gY + gH * 0.78].forEach(by => {
      g.fillRect(gateL, by, gMid - gateL, 6);
      g.fillRect(gMid, by, gateR - gMid, 6);
      g.lineStyle(1, 0x2e3230, 1);
      g.strokeRect(gateL, by, gMid - gateL, 6);
      g.strokeRect(gMid, by, gateR - gMid, 6);
    });

    // Iron chains (dramatic X across the gate)
    g.lineStyle(5, 0x242624, 1);
    g.lineBetween(gateL, gY + gH * 0.1, gateR, gY + gH * 0.85);
    g.lineBetween(gateR, gY + gH * 0.1, gateL, gY + gH * 0.85);
    // Chain link highlights
    g.lineStyle(2, 0x3a3e38, 0.7);
    g.lineBetween(gateL + 2, gY + gH * 0.1 + 2, gateR - 2, gY + gH * 0.85 - 2);
    g.lineBetween(gateR - 2, gY + gH * 0.1 + 2, gateL + 2, gY + gH * 0.85 - 2);
    // Chain padlock
    g.fillStyle(0x2a2e28, 1);
    g.fillRect(gMid - 14, gY + gH * 0.46, 28, 20);
    g.lineStyle(2, 0x4a5048, 1);
    g.strokeRect(gMid - 14, gY + gH * 0.46, 28, 20);
    g.lineStyle(3, 0x3a3e38, 1);
    g.strokeCircle(gMid, gY + gH * 0.46 - 4, 10);

    // Sign on gate
    const signX = gMid - 68, signY = gY + gH * 0.15;
    g.fillStyle(0x1c1a12, 1);
    g.fillRect(signX, signY, 136, 44);
    g.lineStyle(1.5, 0xc8956c, 0.5);
    g.strokeRect(signX, signY, 136, 44);
    // Sign nails
    g.fillStyle(0x4a4838, 1);
    g.fillCircle(signX + 6, signY + 6, 3);
    g.fillCircle(signX + 130, signY + 6, 3);
    g.fillCircle(signX + 6, signY + 38, 3);
    g.fillCircle(signX + 130, signY + 38, 3);
    this.add.text(gMid, signY + 12, 'THORNWOOD CLOSED', {
      fontFamily: 'Georgia, serif', fontSize: '9px', color: '#c85050', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(7);
    this.add.text(gMid, signY + 30, 'Witch business. Do not inquire.', {
      fontFamily: 'Georgia, serif', fontSize: '8px', color: '#7a6040', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(7);

    // ── "Thornwood Unlocked" visual overlay (drawn but hidden) ──
    // Will be shown by _checkThornwoodState
    this._thornwoodGateOpen = this.add.graphics().setDepth(6).setVisible(false);
    const tg = this._thornwoodGateOpen;
    tg.lineStyle(2, 0x40c060, 0.6);
    tg.strokeRect(gX - pillarW, gY - 16, gW + pillarW * 2, gH + 20);
    tg.fillStyle(0x204030, 0.12);
    tg.fillRect(gX - pillarW, gY - 16, gW + pillarW * 2, gH + 20);

    // Store gate bounds for hotspot
    this._gateX  = gX;
    this._gateY  = gY;
    this._gateW  = gW;
    this._gateH  = gH;
  }

  // ── Notice Board ─────────────────────────────────────────

  _drawNoticeBoard(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const bX = W * 0.73, bY = WH * 0.52, bW = 88, bH = 68;
    // Post
    g.fillStyle(0x2a2018, 1);
    g.fillRect(bX + bW / 2 - 5, bY, 10, WH * 0.35 + 10);
    // Board
    g.fillStyle(0x2e2418, 1);
    g.fillRect(bX, bY, bW, bH);
    g.lineStyle(2, 0x5a4428, 1);
    g.strokeRect(bX, bY, bW, bH);
    // Tacked paper
    g.fillStyle(0xe8dcc0, 0.88);
    g.fillRect(bX + 6, bY + 6, bW - 12, bH - 12);
    // Text lines on notice (suggestion)
    g.lineStyle(1, 0x7a6840, 0.5);
    for (let nl = 0; nl < 5; nl++) {
      g.lineBetween(bX + 10, bY + 16 + nl * 10, bX + bW - 10, bY + 16 + nl * 10);
    }
    // Tack pins
    g.fillStyle(0xc85050, 0.9);
    g.fillCircle(bX + 12, bY + 10, 3);
    g.fillCircle(bX + bW - 12, bY + 10, 3);
    // Label
    this.add.text(bX + bW / 2, bY - 10, 'Notice Board', {
      fontFamily: 'Georgia, serif', fontSize: '8px', color: '#5a4828', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(7);

    this._noticeBoardX = bX;
    this._noticeBoardY = bY;
    this._noticeBoardW = bW;
    this._noticeBoardH = bH;
  }

  // ── Bram the Innkeeper ────────────────────────────────────

  _drawBram(W, WH) {
    const g  = this.add.graphics().setDepth(8);
    const bx = W * 0.16, by = WH * 0.58;

    // Apron/body (stocky, innkeeper build)
    g.fillStyle(0x3a3020, 1);
    g.fillTriangle(bx, by, bx - 22, by + 82, bx + 22, by + 82);
    // Apron front
    g.fillStyle(0xc8a870, 0.55);
    g.fillTriangle(bx, by + 18, bx - 12, by + 82, bx + 12, by + 82);
    // Legs
    g.fillStyle(0x2a2218, 1);
    g.fillRect(bx - 14, by + 82, 12, 22);
    g.fillRect(bx + 2, by + 82, 12, 22);
    // Boots
    g.fillStyle(0x1a1208, 1);
    g.fillRect(bx - 16, by + 100, 14, 8);
    g.fillRect(bx + 0, by + 100, 14, 8);
    // Head
    g.fillStyle(0xc89070, 1);
    g.fillCircle(bx, by - 16, 18);
    // Grey hair
    g.fillStyle(0x8a8880, 1);
    g.fillEllipse(bx, by - 28, 36, 18);
    g.fillRect(bx - 18, by - 28, 4, 16);
    g.fillRect(bx + 14, by - 28, 4, 16);
    // Mustache
    g.fillStyle(0x7a7068, 1);
    g.fillEllipse(bx - 6, by - 6, 12, 5);
    g.fillEllipse(bx + 6, by - 6, 12, 5);
    // Arms (watching the gate with arms crossed)
    g.fillStyle(0x3a3020, 1);
    g.fillRect(bx - 22, by + 22, 18, 8);
    g.fillRect(bx + 4, by + 22, 18, 8);
    // Hand gestures over crossed arms
    g.fillStyle(0xc89070, 1);
    g.fillCircle(bx - 18, by + 26, 5);
    g.fillCircle(bx + 22, by + 26, 5);

    // Subtle idle sway
    this.tweens.add({
      targets: g, y: { from: 0, to: -3 },
      duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this._bramX = bx;
    this._bramY = by;
  }

  // ── Path arrows (exit indicators) ─────────────────────────

  _drawPathArrows(W, WH) {
    const g = this.add.graphics().setDepth(6);

    // South Shore path (bottom-right) → WayneShackScene
    const sX = W - 60, sY = WH - 38;
    g.fillStyle(0x3a3028, 0.85);
    g.fillRoundedRect(sX - 48, sY - 16, 100, 32, 4);
    g.lineStyle(1, 0xc8956c, 0.5);
    g.strokeRoundedRect(sX - 48, sY - 16, 100, 32, 4);
    this.add.text(sX - 10, sY, '▶ South Shore', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#c8a870', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);

    // Harbor path (bottom-left) → EdwardFarrisScene
    const hX = 16, hY = WH - 38;
    g.fillStyle(0x3a3028, 0.85);
    g.fillRoundedRect(hX - 4, hY - 16, 104, 32, 4);
    g.lineStyle(1, 0xc8956c, 0.5);
    g.strokeRoundedRect(hX - 4, hY - 16, 104, 32, 4);
    this.add.text(hX + 8, hY, '◀ Harbor', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#c8a870', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);

    this._southArrowBounds = { x: sX - 48, y: sY - 16, w: 100, h: 32 };
    this._harborArrowBounds = { x: hX - 4, y: hY - 16, w: 104, h: 32 };
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Bram ─────────────────────────────────────────────────
    this._addHotspot({
      id: 'bram', name: 'Bram (Innkeeper)',
      x: this._bramX, y: this._bramY + 40, w: 60, h: 100,
      look: () => this._narrate("The innkeeper watches the gate with the expression of a man who has given up being surprised."),
      talk: () => this._talkToBram(),
      take: () => this._narrate("You cannot take the innkeeper. He would resist."),
      use:  () => this._narrate("Bram is not a tool. He is a man. A tired man."),
    });

    // ── Thornwood Gate ────────────────────────────────────────
    this._addHotspot({
      id: 'thornwood_gate', name: 'Thornwood Gate',
      x: this._gateX + this._gateW / 2, y: this._gateY + this._gateH / 2,
      w: this._gateW + 20, h: this._gateH + 20,
      look: () => {
        if (GameState.getFlag('thornwood_unlocked')) {
          this._narrate("The gate stands open. The dark trees beyond are still ominous, but passable.");
        } else {
          this._narrate("The gate is sealed with iron chains. A sign reads: 'THORNWOOD CLOSED. Witch business. Do not inquire.'");
        }
      },
      talk: () => this._narrate("The gate says nothing. The sign says enough."),
      take: () => this._narrate("The chains are iron and thick and entirely unmoving."),
      use:  () => {
        if (GameState.getFlag('thornwood_unlocked')) {
          this._transitionToThornwood();
        } else {
          this._narrate("The chains are iron and thick and entirely unmoving.");
        }
      },
    });

    // ── Notice Board ──────────────────────────────────────────
    this._addHotspot({
      id: 'notice_board', name: 'Notice Board',
      x: this._noticeBoardX + this._noticeBoardW / 2,
      y: this._noticeBoardY + this._noticeBoardH / 2,
      w: this._noticeBoardW, h: this._noticeBoardH + 60,
      look: () => this._play([
        { speaker: 'cambrie', text: "The notice reads: 'By order of Harbor Master Farris, the harbor remains closed pending inspection of the wreck of the Sable Dawn.'" },
        { speaker: 'cambrie', text: "'Those seeking passage to the Isle of Tides must obtain a Harbor Pass from the Harbor Master's office.'" },
        { speaker: 'cambrie', text: "And at the bottom, in different handwriting: 'The Tide King accepts petitioners at the shrine on the third pool. Bring something worth his time.'" },
        { speaker: 'mackenzie', text: "The Tide King. I've heard of that name. Old. Powerful. What does a sea god want with us?" },
      ]),
      talk: () => this._narrate("Notice boards are designed to be read, not conversed with."),
      take: () => this._narrate("Removing the notice would make Harbor Master Farris very displeased."),
      use:  () => this._narrate("The board has already communicated everything it has to communicate."),
    });

    // ── South Shore path ──────────────────────────────────────
    const sb = this._southArrowBounds;
    this._addHotspot({
      id: 'south_shore', name: 'South Shore Path',
      x: sb.x + sb.w / 2, y: sb.y + sb.h / 2, w: sb.w, h: sb.h,
      look: () => this._narrate("A sandy path leads south toward the shore. You can smell the ocean from here."),
      talk: () => this._narrate("The path doesn't talk. It leads."),
      take: () => this._narrate("You cannot take a path."),
      use:  () => this._goTo('WayneShackScene'),
    });

    // ── Harbor path ───────────────────────────────────────────
    const hb = this._harborArrowBounds;
    this._addHotspot({
      id: 'harbor_path', name: 'Harbor Path',
      x: hb.x + hb.w / 2, y: hb.y + hb.h / 2, w: hb.w, h: hb.h,
      look: () => this._narrate("The harbor road leads west. You can hear the water, but not see it yet."),
      talk: () => this._narrate("The road says nothing useful."),
      take: () => this._narrate("No."),
      use:  () => this._goTo('EdwardFarrisScene'),
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

  // ── Bram dialogue logic ───────────────────────────────────

  _talkToBram() {
    if (!GameState.getFlag('bram_first_done')) {
      GameState.setFlag('bram_first_done');
      this._play(DIALOGUE_BRAM_FIRST, () => {
        if (!GameState.getFlag('bram_harbor_talked')) {
          GameState.setFlag('bram_harbor_talked');
          this.time.delayedCall(200, () => this._play(DIALOGUE_BRAM_HARBOR));
        }
      });
    } else if (!GameState.getFlag('bram_harbor_talked')) {
      GameState.setFlag('bram_harbor_talked');
      this._play(DIALOGUE_BRAM_HARBOR);
    } else {
      this._play(DIALOGUE_BRAM_REPEAT);
    }
  }

  // ── State checks ─────────────────────────────────────────

  _checkThornwoodState() {
    // Thornwood unlocks if player has the witch's token OR the flag is explicitly set
    const unlocked = GameState.getFlag('thornwood_unlocked') ||
                     GameState.hasItem('witch_riddle_answer');
    if (unlocked) {
      GameState.setFlag('thornwood_unlocked');
      if (this._thornwoodGateOpen) this._thornwoodGateOpen.setVisible(true);
      this.setStatus("The Thornwood gate stands open.");
    }

    // Ready-for-thornwood flag
    if (GameState.hasItem('harbor_pass') &&
        GameState.hasItem('ships_manifest') &&
        GameState.hasItem('wayne_coins')) {
      GameState.setFlag('ready_for_thornwood');
    }
  }

  // ── Transitions ───────────────────────────────────────────

  _transitionToThornwood() {
    this._play([
      { speaker: 'mackenzie', text: "The chains are loose. Someone — or something — unlocked this gate." },
      { speaker: 'cambrie', text: "Then we go in. Ready?" },
      { speaker: 'mackenzie', text: "No. Let's go anyway." },
    ], () => {
      this._goTo('ThornwoodScene');
    });
  }

  _goTo(scene) {
    this._locked = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start(scene));
  }

  // ── Helpers ──────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }
  _narrate(text)          { this._play([{ speaker: 'narrator', text }]); }

  update() { if (this.dialogue) this.dialogue.update(); }
}
