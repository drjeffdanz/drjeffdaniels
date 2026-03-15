// ============================================================
// scenes/WayneShackScene.js — Sisters' Quest: The Moonveil Crown
// South Shore Beach — Wayne Havasu's Shack
// Late afternoon, warm orange light, ocean horizon.
// ============================================================

class WayneShackScene extends BaseScene {
  constructor() { super({ key: 'WayneShackScene' }); }

  preload() { this.load.image('bg_wayne', 'assets/backgrounds/wayne-shack.jpg'); }

  create() {
    MusicManager.play(this, 'music_town');
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('WayneShackScene');

    // ── Camera ────────────────────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Scene label ───────────────────────────────────────────
    this.add.text(W / 2, 18, 'South Shore  ·  Wayne\'s Beach Shack', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#4a3820', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_wayne').setDisplaySize(W, WH).setDepth(0);

    // ── World ─────────────────────────────────────────────────
    this._initChairCoords(W, WH);
    this._drawFirePit(W, WH);

    // Wayne portrait — shifted right of surfboards
    this.add.image(this._chairX + 80, WH * 0.72, 'portrait_wayne')
      .setDisplaySize(160, 160).setOrigin(0.5, 1).setDepth(1);
    // Store coords used by hotspot (mirrors former _drawWayne assignments)
    this._wayneX = this._chairX + 80 + 21;
    this._wayneY = this._chairY - 10;

    // Jennibelle portrait (hidden until flag set)
    this._jennibelleImg = this.add.image(W * 0.52, WH * 0.72, 'portrait_jennibelle')
      .setDisplaySize(155, 155).setOrigin(0.5, 1).setDepth(1)
      .setVisible(false);

    this._drawReturnArrow(W, WH);

    // ── Ocean wave animation ───────────────────────────────────
    this._waveOffset = 0;
    this._waveGraphics = this.add.graphics().setDepth(3);
    this._drawWaveLayer(W, WH);

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
      this._refreshJennibelle();
    });

    // ── Hotspots ──────────────────────────────────────────────
    this._buildHotspots(W, WH);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // ── Show Jennibelle if already appeared ───────────────────
    this._refreshJennibelle();
  }

  // ── Coordinate initialiser (replaces static background draws) ──

  _initChairCoords(W, WH) {
    // Chair position (matches where Wayne sits, referenced by _drawWayne and hotspots)
    const sX = W * 0.04, sW = W * 0.30;
    this._chairX = sX + sW + 22;
    this._chairY = WH * 0.65;

    // Surfboard hotspot bounds
    this._surfboardsBounds = { x: sX, y: WH * 0.37, w: sX + sW * 0.14 + 30, h: WH * 0.30 };

    // Boat / dock coords (used by hotspots)
    const dX = W * 0.72, dY = WH * 0.62, dW = W * 0.24, dH = WH * 0.10;
    const bX = dX + 14;
    this._boatX = bX + (dW - 28) / 2;
    this._boatY = dY + dH - 6 + 20;   // approximate mid-hull
    this._dockX = dX;
    this._dockY = WH * 0.62;
    this._dockW = dW;
    this._dockH = dH + 40;

    // Jennibelle coords
    this._jennibelleX = W * 0.52;
    this._jennibelleY = WH * 0.60;
  }

  // ── Wave animation layer ──────────────────────────────────

  _drawWaveLayer(W, WH) {
    const g = this._waveGraphics;
    g.clear();
    const waveY = WH * 0.69;
    g.lineStyle(1.5, 0x80b8c8, 0.35);
    for (let i = 0; i < 3; i++) {
      const y = waveY + i * 8;
      g.beginPath();
      for (let x = 0; x <= W; x += 18) {
        const wy = y + Math.sin((x + this._waveOffset + i * 40) * 0.04) * 4;
        if (x === 0) g.moveTo(x, wy); else g.lineTo(x, wy);
      }
      g.strokePath();
    }
    // White foam fringe
    g.lineStyle(1, 0xd8e8ec, 0.25);
    g.beginPath();
    for (let x = 0; x <= W; x += 12) {
      const wy = waveY + Math.sin((x + this._waveOffset) * 0.05) * 3;
      if (x === 0) g.moveTo(x, wy); else g.lineTo(x, wy);
    }
    g.strokePath();
  }

  // ── Fire Pit ──────────────────────────────────────────────

  _drawFirePit(W, WH) {
    const g  = this.add.graphics().setDepth(5);
    const fX = W * 0.38, fY = WH * 0.72;

    // Stone ring
    g.fillStyle(0x484038, 1);
    g.fillCircle(fX, fY, 28);
    g.lineStyle(2, 0x3a3028, 1);
    g.strokeCircle(fX, fY, 28);
    // Stones on ring
    for (let si = 0; si < 8; si++) {
      const sa = (si / 8) * Math.PI * 2;
      const sx = fX + Math.cos(sa) * 22, sy = fY + Math.sin(sa) * 22;
      g.fillStyle(0x5a5048 + (si * 0x010100), 1);
      g.fillEllipse(sx, sy, 12, 8);
    }
    // Embers
    g.fillStyle(0x381008, 1);
    g.fillCircle(fX, fY, 18);
    // Flames
    g.fillStyle(0xd04010, 0.8);
    g.fillTriangle(fX - 14, fY, fX - 2, fY - 28, fX + 8, fY);
    g.fillStyle(0xe06018, 0.75);
    g.fillTriangle(fX - 6, fY, fX + 4, fY - 36, fX + 16, fY);
    g.fillStyle(0xf09030, 0.65);
    g.fillTriangle(fX - 4, fY, fX + 6, fY - 22, fX + 14, fY);
    g.fillStyle(0xffe060, 0.45);
    g.fillTriangle(fX - 2, fY, fX + 4, fY - 14, fX + 10, fY);

    // Grill/spit over fire
    g.lineStyle(2, 0x4a4038, 1);
    g.lineBetween(fX - 30, fY - 8, fX + 30, fY - 8);
    // Fish on grill (simplified)
    g.fillStyle(0xc08040, 1);
    g.fillEllipse(fX - 8, fY - 12, 30, 9);
    g.fillStyle(0xe0a060, 0.7);
    g.fillEllipse(fX - 8, fY - 12, 22, 5);
    // Tail
    g.fillStyle(0xc08040, 1);
    g.fillTriangle(fX + 10, fY - 16, fX + 22, fY - 12, fX + 10, fY - 8);

    // Warm glow on ground — fire cast light
    g.fillStyle(0xe06020, 0.28);
    g.fillEllipse(fX, fY + 8, 80, 28);
    g.fillStyle(0xd04810, 0.15);
    g.fillEllipse(fX, fY + 10, 130, 40);
    g.fillStyle(0xc03808, 0.07);
    g.fillCircle(fX, fY, 90);  // wide ambient fire glow

    this._firePitX = fX;
    this._firePitY = fY;

    // Flame flicker tween
    const flameTween = this.add.graphics().setDepth(6);
    this.tweens.add({
      targets: { t: 0 },
      t: 1,
      duration: 180,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: (tw, tgt) => {
        flameTween.clear();
        const flicker = tgt.t;
        flameTween.fillStyle(0xffe060, 0.3 + flicker * 0.15);
        flameTween.fillCircle(fX + Math.sin(Date.now() * 0.01) * 3, fY - 12 - flicker * 6, 6 + flicker * 3);
      },
    });
  }

  // ── Jennibelle (hidden until flag set) ───────────────────

  _refreshJennibelle() {
    const appeared = GameState.getFlag('jennibelle_appeared');
    if (this._jennibelleImg) {
      this._jennibelleImg.setVisible(appeared);
    }
    // Update hotspot interactivity
    const jHotspot = this._hotspots.find(h => h.def.id === 'jennibelle');
    if (jHotspot) {
      if (appeared) {
        jHotspot.zone.setInteractive({ useHandCursor: true });
      } else {
        jHotspot.zone.disableInteractive();
      }
    }
  }

  // ── Return arrow ─────────────────────────────────────────

  _drawReturnArrow(W, WH) {
    const g = this.add.graphics().setDepth(6);
    const aX = 14, aY = 32;
    g.fillStyle(0x3a3028, 0.85);
    g.fillRoundedRect(aX - 4, aY - 14, 128, 28, 4);
    g.lineStyle(1, 0xc8956c, 0.45);
    g.strokeRoundedRect(aX - 4, aY - 14, 128, 28, 4);
    this.add.text(aX + 8, aY, '◀ Back to Cresthollow', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#c8a870', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setDepth(7);
    this._returnArrow = { x: aX - 4, y: aY - 14, w: 128, h: 28 };
  }

  // ── Hotspots ──────────────────────────────────────────────

  _buildHotspots(W, WH) {
    // ── Wayne ─────────────────────────────────────────────────
    this._addHotspot({
      id: 'wayne', name: 'Wayne Havasu',
      x: this._wayneX, y: this._wayneY + 30, w: 64, h: 100,
      look: () => this._narrate("Wayne Havasu watches the ocean with the patience of someone who has made peace with the sea."),
      talk: () => this._talkToWayne(),
      take: () => this._narrate("Wayne Havasu is not available for taking."),
      use:  () => this._narrate("Wayne looks at you sidelong. 'I'm not a door,' he says."),
    });

    // ── Guitar ────────────────────────────────────────────────
    // Guitar leans against the cooler; position relative to chair
    const gX = this._chairX + 94, gY = this._chairY - 18;
    this._addHotspot({
      id: 'guitar', name: 'Wayne\'s Guitar',
      x: gX, y: gY + 24, w: 30, h: 64,
      look: () => {
        if (!GameState.getFlag('flag_wayne_guitar_talked')) {
          GameState.setFlag('flag_wayne_guitar_talked');
          this._play(DIALOGUE_WAYNE_GUITAR);
        } else {
          this._narrate("A salt-worn acoustic guitar, leaning against the cooler. Whoever plays it, plays it often.");
        }
      },
      talk: () => this._narrate("You could sing to the guitar, but it would mostly just sit there."),
      take: () => this._narrate("The guitar belongs to Wayne. It would be rude to take it."),
      use:  () => this._narrate("You pluck one string. It rings out, clear and full. Wayne doesn't look up, but something in his posture softens."),
    });

    // Draw guitar graphic (simple procedural)
    const gg = this.add.graphics().setDepth(7);
    gg.fillStyle(0x8a5c28, 1);
    gg.fillEllipse(gX + 2, gY + 42, 22, 26);
    gg.fillEllipse(gX + 2, gY + 22, 18, 20);
    gg.fillRect(gX - 3, gY + 8, 10, 36);
    gg.fillStyle(0x3a1e08, 1);
    gg.fillRect(gX - 1, gY - 22, 6, 32);
    gg.lineStyle(1, 0x5a3c18, 1);
    gg.strokeEllipse(gX + 2, gY + 42, 22, 26);
    gg.strokeEllipse(gX + 2, gY + 22, 18, 20);
    // Strings
    gg.lineStyle(0.5, 0xc0c0b0, 0.6);
    for (let s = -2; s <= 2; s++) {
      gg.lineBetween(gX + 2 + s * 1.2, gY - 10, gX + 2 + s * 1.2, gY + 56);
    }
    // Sound hole
    gg.fillStyle(0x1a0c04, 1);
    gg.fillCircle(gX + 2, gY + 42, 5);

    // ── Surfboards ────────────────────────────────────────────
    this._addHotspot({
      id: 'surfboards', name: 'Surfboards',
      x: W * 0.04 + 20, y: WH * 0.55, w: 60, h: 90,
      look: () => this._narrate("Two surfboards, salt-worn and well-loved. One has a crack repaired with — yes, that's duct tape."),
      talk: () => this._narrate("The boards lean in contemplative silence."),
      take: () => this._narrate("You can't take Wayne's surfboards. They belong to him and the ocean."),
      use:  () => this._narrate("You don't have time to surf right now. Probably."),
    });

    // ── Fish on fire ──────────────────────────────────────────
    this._addHotspot({
      id: 'fire_pit', name: 'Fish on the Fire',
      x: this._firePitX, y: this._firePitY, w: 62, h: 62,
      look: () => this._narrate("Fish, rice, and beans, if the pot nearby is any indication. It smells genuinely good."),
      talk: () => this._narrate("The fish are unavailable for comment."),
      take: () => this._narrate("You are not going to steal fish off Wayne's fire."),
      use:  () => this._narrate("Wayne waves you away from the fire. 'Sit. I'll bring it to you when it's done.'"),
    });

    // ── Boat at dock ──────────────────────────────────────────
    this._addHotspot({
      id: 'boat', name: 'Boat at the Dock',
      x: this._boatX, y: this._boatY, w: 90, h: 52,
      look: () => this._narrate("A solid, well-maintained boat. Wide enough to be stable in a crossing. It could make the Isle of Tides."),
      talk: () => this._talkAboutBoat(),
      take: () => this._narrate("You can't exactly carry a boat."),
      use:  () => this._talkAboutBoat(),
    });

    // ── Jennibelle ────────────────────────────────────────────
    this._addHotspot({
      id: 'jennibelle', name: 'Jennibelle',
      x: this._jennibelleX + 4, y: this._jennibelleY + 38, w: 50, h: 88,
      look: () => this._narrate("Jennibelle has the energy of someone who learned to surf before she learned to worry. She carries the board with the ease of long practice."),
      talk: () => {
        if (!GameState.getFlag('jennibelle_talked')) {
          GameState.setFlag('jennibelle_talked');
          this._play(DIALOGUE_JENNIBELLE_INTRO);
        } else {
          this._play([
            { speaker: 'jennibelle', text: "That fin still rattles when you hit chop. Wayne keeps saying he'll fix it." },
            { speaker: 'cambrie', text: "Does he fix it?" },
            { speaker: 'jennibelle', text: "No. But he says he will. With great confidence every single time." },
          ]);
        }
      },
      take: () => this._narrate("You cannot take Jennibelle. She would have opinions."),
      use:  () => this._narrate("Jennibelle looks at you with polite bemusement."),
    });

    // ── Return to Cresthollow ─────────────────────────────────
    const ra = this._returnArrow;
    this._addHotspot({
      id: 'return', name: 'Back to Cresthollow',
      x: ra.x + ra.w / 2, y: ra.y + ra.h / 2, w: ra.w, h: ra.h,
      look: () => this._narrate("The path back to Cresthollow village."),
      talk: () => this._narrate(""),
      take: () => this._narrate(""),
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
    this._refreshJennibelle();
  }

  // ── Wayne dialogue logic ──────────────────────────────────

  _talkToWayne() {
    const firstDone    = GameState.getFlag('wayne_first_done');
    const boatDone     = GameState.getFlag('wayne_boat_done');
    const farewellDone = GameState.getFlag('wayne_farewell_done');

    if (farewellDone) {
      this._play([
        { speaker: 'wayne', text: "Safe crossing. Come back with good news." },
      ]);
    } else if (firstDone && boatDone) {
      // Both dialogues done → farewell
      GameState.setFlag('wayne_farewell_done');
      this._play(DIALOGUE_WAYNE_FAREWELL, () => {
        GameState.addItem('wayne_coins');
        this._goTo('CresthollowScene');
      });
    } else if (!firstDone) {
      GameState.setFlag('wayne_first_done');
      GameState.setFlag('jennibelle_appeared');
      this._play(DIALOGUE_WAYNE_FIRST, () => {
        this._refreshJennibelle();
      });
    } else if (!boatDone) {
      GameState.setFlag('wayne_boat_done');
      this._play(DIALOGUE_WAYNE_BOAT);
    } else {
      this._play(DIALOGUE_WAYNE_TALK_AGAIN);
    }
  }

  _talkAboutBoat() {
    if (GameState.getFlag('wayne_boat_done')) {
      this._narrate("Wayne has already promised you the boat. He keeps his promises.");
    } else if (GameState.getFlag('wayne_first_done')) {
      GameState.setFlag('wayne_boat_done');
      this._play(DIALOGUE_WAYNE_BOAT);
    } else {
      this._narrate("You should talk to Wayne first. He's the one who knows this boat.");
    }
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

  update() {
    if (this.dialogue) this.dialogue.update();

    // Wave animation
    this._waveOffset += 0.8;
    const W  = this.scale.width;
    const WH = this.scale.height - 156;
    this._drawWaveLayer(W, WH);
  }
}
