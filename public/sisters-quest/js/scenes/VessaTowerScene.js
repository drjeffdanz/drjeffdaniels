// ============================================================
// scenes/VessaTowerScene.js — Sisters' Quest: The Moonveil Crown
// Vessa's Tower interior — the final confrontation and choice.
// ============================================================

class VessaTowerScene extends BaseScene {
  constructor() { super({ key: 'VessaTowerScene' }); }

  preload() { this.load.image('bg_vessa', 'assets/backgrounds/vesa-tower.jpg'); }

  create() {
    MusicManager.play(this, 'music_mystic');
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('VessaTowerScene');

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_vessa').setDisplaySize(W, WH).setDepth(0);

    // ── World ─────────────────────────────────────────────────
    this._drawMasterLoom(W, H, WH);

    // Portrait: Vessa of Elderwyn
    // Warm glow backlight (draws the eye)
    this.add.graphics().setDepth(0).fillStyle(0xc8956c, 0.18).fillEllipse(W * 0.22, WH * 0.85 - 130, 110, 260);
    // Ground shadow
    this.add.graphics().setDepth(0).fillStyle(0x000000, 0.30).fillEllipse(W * 0.22, WH * 0.85, 80, 20);
    this.add.image(W * 0.22, WH * 0.85, 'sprite_vessa')
      .setDisplaySize(140, 260).setOrigin(0.5, 1).setDepth(1);

    this.add.text(W / 2, 18, "Vessa's Tower", {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#c8a050', fontStyle: 'italic',
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

    // ── State ─────────────────────────────────────────────────
    this._hotspots    = [];
    this._locked      = false;
    this._choiceButtons = [];

    this._buildHotspots(W, H, WH);

    // ── UI (always last) ──────────────────────────────────────
    this._initUI();

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Animate loom threads
    this._animateLooms();
  }

  // ── Drawing ──────────────────────────────────────────────────

  _drawMasterLoom(W, H, WH) {
    const lx = W * 0.35;
    const ly = WH * 0.04;
    const lw = W * 0.30;
    const lh = WH * 0.72;

    // Animated thread glow — store for animation
    this._masterLoomGlow = this.add.graphics().setDepth(7);
    this.tweens.add({
      targets: this._masterLoomGlow,
      alpha: { from: 0.6, to: 1.0 },
      duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        this._masterLoomGlow.clear();
        this._masterLoomGlow.fillStyle(0xd0a030, 0.04 * this._masterLoomGlow.alpha);
        this._masterLoomGlow.fillRect(lx + 12, ly + 16, lw - 24, lh - 32);
        this._masterLoomGlow.lineStyle(1, 0xd4b050, 0.15 * this._masterLoomGlow.alpha);
        this._masterLoomGlow.strokeRect(lx, ly, lw, lh);
      },
    });
  }

  _animateLooms() {
    // Animate a few loom thread shimmer effects with tweens
    const shimmer = this.add.graphics().setDepth(5);
    this.tweens.add({
      targets: shimmer,
      alpha: { from: 0.3, to: 0.8 },
      duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: () => {
        shimmer.clear();
        // Subtle horizontal shimmer lines on the side looms (threads moving)
        shimmer.lineStyle(1, 0xc0b880, 0.08 * shimmer.alpha);
        const loomYPositions = [0.20, 0.30, 0.40, 0.50, 0.60];
        loomYPositions.forEach(yFrac => {
          const WH = this.scale.height - 156;
          const y  = WH * yFrac;
          shimmer.lineBetween(18, y, 104, y);
          shimmer.lineBetween(116, y, 202, y);
          shimmer.lineBetween(this.scale.width - 106, y, this.scale.width - 18, y);
        });
      },
    });
  }

  // ── Hotspots ──────────────────────────────────────────────────

  _buildHotspots(W, H, WH) {
    const defs = [
      // 1. Vessa
      {
        id: 'vessa', name: 'Vessa of Elderwyn',
        x: W * 0.22, y: WH * 0.58, w: 80, h: 130,
        look: () => this._vessaLook(),
        talk: () => this._vessaTalk(W, H, WH),
        take: () => this._narrate("Vessa is not something you take."),
        use:  () => this._vessaTalk(W, H, WH),
      },
      // 2. Master Loom
      {
        id: 'master_loom', name: 'The Master Loom',
        x: W * 0.50, y: WH * 0.40, w: W * 0.30, h: WH * 0.72,
        look: () => this._narrate("The largest loom in the tower. Every thread is a different color. You cannot see the pattern yet."),
        talk: () => this._narrate("The loom does not talk. It only weaves."),
        take: () => this._narrate("The Master Loom is not something you can take."),
        use:  () => {
          if (GameState.getFlag('vessa_met')) {
            this._narrate("Vessa's voice, quiet: 'Do not touch the loom.'");
          } else {
            this._narrate("Something about this loom makes you hesitate. Better to speak with Vessa first.");
          }
        },
      },
      // 3. Tower windows
      {
        id: 'windows', name: 'Tower Windows',
        x: W * 0.20, y: WH * 0.12, w: 36, h: 80,
        look: () => this._narrate("Through the narrow windows — the sea, the Isle of Tides, the distant mainland. The whole journey visible from here."),
        talk: () => this._narrate("The view does not respond."),
        take: () => this._narrate("You cannot take the view."),
        use:  () => this._narrate("You press close to the glass. Everything you've traveled through is out there, small in the distance."),
      },
      {
        id: 'windows2', name: 'Tower Windows',
        x: W * 0.80, y: WH * 0.12, w: 36, h: 80,
        look: () => this._narrate("Through the narrow windows — the sea, the Isle of Tides, the distant mainland. The whole journey visible from here."),
        talk: () => this._narrate("The view does not respond."),
        take: () => this._narrate("You cannot take the view."),
        use:  () => this._narrate("You press close to the glass. Everything you've traveled through is out there, small in the distance."),
      },
      // 4. Weavings on walls
      {
        id: 'weavings_left', name: 'Weavings (left looms)',
        x: W * 0.12, y: WH * 0.40, w: 95, h: WH * 0.60,
        look: () => this._narrate("The walls are covered in finished works. Tapestries, banners, smaller things. Some of them show places you recognize: Cresthollow, the Thornwood, the Mere."),
        talk: () => this._narrate("The tapestries hang in silence."),
        take: () => this._narrate("These belong to forty years of Vessa's work."),
        use:  () => this._narrate("You look more closely. One of them shows the Palace of Elderwyn. Queen Elara's face, young, before the curse, is threaded in silver."),
      },
      {
        id: 'weavings_right', name: 'Weavings (right looms)',
        x: W * 0.88, y: WH * 0.40, w: 95, h: WH * 0.60,
        look: () => this._narrate("The walls are covered in finished works. Tapestries, banners, smaller things. Some of them show places you recognize: Cresthollow, the Thornwood, the Mere."),
        talk: () => this._narrate("The tapestries hang in silence."),
        take: () => this._narrate("These belong to forty years of Vessa's work."),
        use:  () => this._narrate("Another weaving shows two small figures on a dark road under stars. You recognize the cloaks."),
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

  // ── Vessa interaction logic ───────────────────────────────────

  _vessaLook() {
    if (!GameState.getFlag('vessa_met')) {
      this._narrate("Vessa of Elderwyn. She has been here forty years, waiting, working. The tower smells of thread and patience.");
    } else if (GameState.getFlag('vessa_trusted')) {
      this._narrate("Vessa works at the loom with calm certainty. Her hands know what to do.");
    } else {
      this._narrate("Vessa waits. She has been waiting for a long time. A little longer does not concern her.");
    }
  }

  _vessaTalk(W, H, WH) {
    if (GameState.getFlag('vessa_trusted')) {
      this._narrate("'We are nearly there,' Vessa says, without looking up from the loom.");
      return;
    }

    if (!GameState.getFlag('vessa_met')) {
      GameState.setFlag('vessa_met');
      this.dialogue.play(DIALOGUE_VESSA_FIRST, () => {
        this._checkPiecesForVessa(W, H, WH);
      });
    } else {
      this._checkPiecesForVessa(W, H, WH);
    }
  }

  _checkPiecesForVessa(W, H, WH) {
    const hasShard  = GameState.hasItem('starlight_shard');
    const hasThread = GameState.hasItem('moonveil_thread');
    const hasHeart  = GameState.hasItem('seaglass_heart');

    if (hasShard && hasThread && hasHeart) {
      this.dialogue.play(DIALOGUE_VESSA_PIECES, () => {
        this.dialogue.play(DIALOGUE_VESSA_CHOICE, () => {
          this._showFinalChoice(W, H, WH);
        });
      });
    } else {
      // Tell player what is missing
      const missing = [];
      if (!hasShard)  missing.push('the Starlight Shard');
      if (!hasThread) missing.push('the Moonveil Thread');
      if (!hasHeart)  missing.push('the Sea-Glass Heart');
      const missingStr = missing.join(', ');
      this.setStatus('Still missing: ' + missingStr);
      this._narrate(`Vessa looks at what you carry. 'Not yet. You are still missing ${missingStr}. Bring all three and we can complete this.'`);
    }
  }

  // ── Choice system ─────────────────────────────────────────────

  _showFinalChoice(W, H, WH) {
    this._hideChoiceButtons();

    const choices = [
      { label: 'Trust Vessa — leave the pieces with her.', action: 'trust' },
      { label: 'Press her — demand the crown now.',        action: 'demand' },
    ];

    choices.forEach((choice, i) => {
      const cy = WH * 0.60 + i * 60;

      const bg = this.add.graphics().setDepth(290);
      bg.fillStyle(0x1a0a2a, 0.95);
      bg.fillRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);
      bg.lineStyle(1.5, 0xc8956c, 0.8);
      bg.strokeRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);

      const txt = this.add.text(W / 2, cy, choice.label, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#e8d5b0',
        align: 'center', wordWrap: { width: 380 },
      }).setOrigin(0.5).setDepth(291);

      const zone = this.add.zone(W / 2, cy, 400, 40)
        .setInteractive({ useHandCursor: true })
        .setDepth(295);
      zone.on('pointerdown', () => this._handleChoice(choice.action, W, H, WH));
      zone.on('pointerover', () => { txt.setColor('#ffffff'); });
      zone.on('pointerout',  () => { txt.setColor('#e8d5b0'); });

      this._choiceButtons.push({ bg, txt, zone });
    });
  }

  _showTrustOnly(W, H, WH) {
    this._hideChoiceButtons();

    const cy = WH * 0.60;

    const bg = this.add.graphics().setDepth(290);
    bg.fillStyle(0x1a0a2a, 0.95);
    bg.fillRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);
    bg.lineStyle(1.5, 0xc8956c, 0.8);
    bg.strokeRoundedRect(W / 2 - 200, cy - 20, 400, 40, 6);

    const txt = this.add.text(W / 2, cy, 'Trust Vessa — leave the pieces with her.', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#e8d5b0',
      align: 'center', wordWrap: { width: 380 },
    }).setOrigin(0.5).setDepth(291);

    const zone = this.add.zone(W / 2, cy, 400, 40)
      .setInteractive({ useHandCursor: true })
      .setDepth(295);
    zone.on('pointerdown', () => this._handleChoice('trust', W, H, WH));
    zone.on('pointerover', () => { txt.setColor('#ffffff'); });
    zone.on('pointerout',  () => { txt.setColor('#e8d5b0'); });

    this._choiceButtons.push({ bg, txt, zone });
  }

  _hideChoiceButtons() {
    if (this._choiceButtons && this._choiceButtons.length > 0) {
      this._choiceButtons.forEach(b => {
        b.bg.destroy();
        b.txt.destroy();
        b.zone.destroy();
      });
      this._choiceButtons = [];
    }
  }

  _handleChoice(action, W, H, WH) {
    this._hideChoiceButtons();

    if (action === 'trust') {
      this.dialogue.play(DIALOGUE_VESSA_TRUST, () => {
        GameState.setFlag('vessa_trusted');
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => this.scene.start('TrueEndingScene'));
      });
    } else {
      // Demand — Vessa refuses, then offer trust only
      this.dialogue.play(DIALOGUE_VESSA_REFUSES, () => {
        this.time.delayedCall(200, () => {
          this.dialogue.play([
            { speaker: 'cambrie',   text: "Mac. We have to trust her. We've trusted everyone else who helped us. This is no different." },
            { speaker: 'mackenzie', text: "...Fine. But if this goes wrong—" },
            { speaker: 'cambrie',   text: "It won't." },
          ], () => {
            this._showTrustOnly(W, H, WH);
          });
        });
      });
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

  _narrate(text) {
    this.dialogue.play([{ speaker: 'narrator', text }]);
  }

  update() { if (this.dialogue) this.dialogue.update(); }
}
