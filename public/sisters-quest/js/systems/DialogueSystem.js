// ============================================================
// systems/DialogueSystem.js — Sisters' Quest: The Moonveil Crown
// Dialogue box, typewriter effect, portrait, reliable click-to-advance
// ============================================================

class DialogueSystem {
  constructor(scene) {
    this.scene      = scene;
    this.isActive   = false;
    this.lines      = [];
    this.lineIndex  = 0;
    this.onComplete = null;
    this.isTyping   = false;
    this.typeTimer  = null;
    this.charIndex  = 0;
    this.targetText = '';

    const W = scene.scale.width;
    const H = scene.scale.height;
    this.W = W;
    this.H = H;

    // Dialogue box sits above the verb bar (bottom 120 + status 36 = 156px)
    // so the box occupies the bottom of the game world area.
    this.BOX_H = 158;
    this.BOX_Y = H - 156 - this.BOX_H - 6; // snug above UI strips
    // For H=600: BOX_Y = 600 - 156 - 158 - 6 = 280

    this._buildUI();
    this._setVisible(false);
  }

  // ── Build ────────────────────────────────────────────────────

  _buildUI() {
    const { W, H, BOX_Y, BOX_H } = this;
    const D = 300; // base depth — above all game world objects, below nothing

    // Subtle dimmer over the game world above the box
    this.dimmer = this.scene.add.graphics().setDepth(D);
    this.dimmer.fillStyle(0x000000, 0.35);
    this.dimmer.fillRect(0, 0, W, BOX_Y);

    // Box background
    this.boxBg = this.scene.add.graphics().setDepth(D + 1);
    this.boxBg.fillStyle(0x08060e, 0.96);
    this.boxBg.fillRoundedRect(16, BOX_Y, W - 32, BOX_H, 6);
    this.boxBg.lineStyle(1.5, 0xc8956c, 1);
    this.boxBg.strokeRoundedRect(16, BOX_Y, W - 32, BOX_H, 6);

    // Portrait box (left of text)
    this.portraitBg = this.scene.add.graphics().setDepth(D + 2);

    // Portrait initial letter
    this.portraitLetter = this.scene.add.text(80, BOX_Y + BOX_H / 2, '', {
      fontFamily: 'Georgia, serif', fontSize: '40px', color: '#ffffff',
      fontStyle: 'bold', alpha: 0.85,
    }).setOrigin(0.5).setDepth(D + 3);

    // Speaker name
    this.speakerTxt = this.scene.add.text(132, BOX_Y + 12, '', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#c8956c', fontStyle: 'bold',
    }).setDepth(D + 3);

    // Dialogue body text
    this.bodyTxt = this.scene.add.text(132, BOX_Y + 32, '', {
      fontFamily: 'Georgia, serif', fontSize: '15px',
      color: '#e8e0d0', wordWrap: { width: W - 180 }, lineSpacing: 5,
    }).setDepth(D + 3);

    // "▶ click" hint
    this.hintTxt = this.scene.add.text(W - 36, BOX_Y + BOX_H - 18, '▶ click', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#c8956c',
    }).setOrigin(1, 0).setDepth(D + 3);

    this.scene.tweens.add({
      targets: this.hintTxt, alpha: { from: 0.8, to: 0.15 },
      duration: 700, yoyo: true, repeat: -1,
    });

    // ── Full-screen click zone ───────────────────────────────
    // Covers the entire canvas so ANY click advances when dialogue is active.
    // Depth above everything so it always wins pointer events.
    this.clickZone = this.scene.add.zone(W / 2, H / 2, W, H)
      .setDepth(D + 20)
      .setInteractive();

    this.clickZone.on('pointerdown', () => this._advance());

    // Keyboard fallback
    this._spaceKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this._enterKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  // ── Visibility ───────────────────────────────────────────────

  _setVisible(v) {
    this.dimmer.setVisible(v);
    this.boxBg.setVisible(v);
    this.portraitBg.setVisible(v);
    this.portraitLetter.setVisible(v);
    this.speakerTxt.setVisible(v);
    this.bodyTxt.setVisible(v);
    this.hintTxt.setVisible(v);

    if (v) {
      this.clickZone.setInteractive();
    } else {
      this.clickZone.disableInteractive();
    }
  }

  // ── Portrait ─────────────────────────────────────────────────

  _drawPortrait(speakerKey) {
    const p = PORTRAITS[speakerKey] || PORTRAITS.narrator;
    this.portraitBg.clear();
    this.portraitBg.fillStyle(p.color, 1);
    this.portraitBg.fillRoundedRect(24, this.BOX_Y + 10, 96, 96, 6);
    this.portraitBg.lineStyle(1.5, 0xc8956c, 0.7);
    this.portraitBg.strokeRoundedRect(24, this.BOX_Y + 10, 96, 96, 6);
    this.portraitLetter.setText(p.label);
    this.speakerTxt.setText(p.name);
  }

  // ── Typewriter ───────────────────────────────────────────────

  _startTypewriter(text) {
    this.targetText = text;
    this.charIndex  = 0;
    this.isTyping   = true;
    this.bodyTxt.setText('');
    this.hintTxt.setVisible(false);

    if (this.typeTimer) { this.typeTimer.remove(false); this.typeTimer = null; }

    this.typeTimer = this.scene.time.addEvent({
      delay: 20,
      callback: this._tick,
      callbackScope: this,
      loop: true,
    });
  }

  _tick() {
    if (this.charIndex < this.targetText.length) {
      this.charIndex++;
      this.bodyTxt.setText(this.targetText.slice(0, this.charIndex));
    } else {
      this._finishTyping();
    }
  }

  _finishTyping() {
    this.isTyping = false;
    if (this.typeTimer) { this.typeTimer.remove(false); this.typeTimer = null; }
    this.bodyTxt.setText(this.targetText);
    this.hintTxt.setVisible(true);
  }

  // ── Show a single line ───────────────────────────────────────

  _showLine(line) {
    if (line.onShow) line.onShow();
    this._drawPortrait(line.speaker || 'narrator');
    this._startTypewriter(line.text || '');
  }

  // ── Advance ──────────────────────────────────────────────────

  _advance() {
    if (!this.isActive) return;

    if (this.isTyping) {
      // Skip typewriter — show full line immediately
      this._finishTyping();
      return;
    }

    this.lineIndex++;
    if (this.lineIndex < this.lines.length) {
      this._showLine(this.lines[this.lineIndex]);
    } else {
      this._close();
    }
  }

  // ── Close ────────────────────────────────────────────────────

  _close() {
    this.isActive = false;
    this._setVisible(false);

    if (this.typeTimer) { this.typeTimer.remove(false); this.typeTimer = null; }

    // Notify scene — scene re-enables hotspots and UI
    this.scene.events.emit('sq_dialogue_end');

    // Fire completion callback AFTER scene has processed sq_dialogue_end
    if (this.onComplete) {
      const cb = this.onComplete;
      this.onComplete = null;
      // Small delay to let sq_dialogue_end handlers run first
      this.scene.time.delayedCall(50, cb);
    }
  }

  // ── Public API ───────────────────────────────────────────────

  /**
   * Play a sequence of dialogue lines.
   * @param {Array}    lines       Array of { speaker, text, onShow? }
   * @param {Function} onComplete  Called after the last line is dismissed
   */
  play(lines, onComplete = null) {
    // Guard: never start if already playing
    if (this.isActive) return;

    if (!lines || lines.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    this.lines      = lines;
    this.lineIndex  = 0;
    this.onComplete = onComplete;
    this.isActive   = true;

    this._setVisible(true);
    this._showLine(this.lines[0]);

    // Tell scene to disable hotspots and verb bar
    this.scene.events.emit('sq_dialogue_start');
  }

  // ── update() — call from scene's update() ───────────────────

  update() {
    if (!this.isActive) return;
    if (Phaser.Input.Keyboard.JustDown(this._spaceKey) ||
        Phaser.Input.Keyboard.JustDown(this._enterKey)) {
      this._advance();
    }
  }

  destroy() {
    this._setVisible(false);
    this.dimmer.destroy();
    this.boxBg.destroy();
    this.portraitBg.destroy();
    this.portraitLetter.destroy();
    this.speakerTxt.destroy();
    this.bodyTxt.destroy();
    this.hintTxt.destroy();
    this.clickZone.destroy();
    if (this.typeTimer) this.typeTimer.remove(false);
    if (this._spaceKey) this._spaceKey.destroy();
    if (this._enterKey) this._enterKey.destroy();
  }
}
