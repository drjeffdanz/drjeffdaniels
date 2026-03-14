// ============================================================
// systems/DialogueSystem.js — Sisters' Quest: The Moonveil Crown
// Handles dialogue box, portrait, typewriter effect, sequencing
// ============================================================

class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.isActive = false;
    this.lines = [];
    this.currentIndex = 0;
    this.onComplete = null;
    this.typewriterTimer = null;
    this.currentText = '';
    this.targetText = '';
    this.charIndex = 0;
    this.isTyping = false;

    // UI dimensions
    this.W = scene.scale.width;
    this.H = scene.scale.height;
    this.BOX_HEIGHT = 160;
    this.BOX_Y = this.H - this.BOX_HEIGHT - 120; // sits above the verb/inventory bar

    this._buildUI();
    this._setVisible(false);
  }

  _buildUI() {
    const scene = this.scene;
    const W = this.W;
    const BOX_Y = this.BOX_Y;
    const BOX_H = this.BOX_HEIGHT;

    // Background panel
    this.bg = scene.add.graphics();
    this.bg.fillStyle(0x0a0a0a, 0.92);
    this.bg.fillRoundedRect(20, BOX_Y, W - 40, BOX_H, 8);
    this.bg.lineStyle(2, 0xc8956c, 1);
    this.bg.strokeRoundedRect(20, BOX_Y, W - 40, BOX_H, 8);
    this.bg.setDepth(100);

    // Portrait box
    this.portraitBg = scene.add.graphics();
    this.portraitBg.setDepth(101);

    // Speaker name
    this.speakerText = scene.add.text(130, BOX_Y + 14, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#c8956c',
      fontStyle: 'bold',
    }).setDepth(101);

    // Dialogue text
    this.dialogueText = scene.add.text(130, BOX_Y + 34, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '15px',
      color: '#e8e0d0',
      wordWrap: { width: W - 180 },
      lineSpacing: 4,
    }).setDepth(101);

    // "Click to continue" hint
    this.continueHint = scene.add.text(W - 40, BOX_Y + BOX_H - 18, '▶ click', {
      fontFamily: 'Georgia, serif',
      fontSize: '11px',
      color: '#c8956c',
      alpha: 0.7,
    }).setOrigin(1, 0).setDepth(101);

    // Flashing animation on continue hint
    scene.tweens.add({
      targets: this.continueHint,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Click anywhere to advance (on the dialogue box area)
    this.clickZone = scene.add.zone(W / 2, BOX_Y + BOX_H / 2, W - 40, BOX_H)
      .setInteractive()
      .setDepth(102);

    this.clickZone.on('pointerdown', () => this._advance());

    // Also listen for spacebar
    this._spaceKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  _setVisible(visible) {
    this.bg.setVisible(visible);
    this.portraitBg.setVisible(visible);
    this.speakerText.setVisible(visible);
    this.dialogueText.setVisible(visible);
    this.continueHint.setVisible(visible);
    this.clickZone.setVisible(visible);
    if (visible) {
      this.clickZone.setInteractive();
    } else {
      this.clickZone.disableInteractive();
    }
  }

  _drawPortrait(speaker) {
    this.portraitBg.clear();
    const BOX_Y = this.BOX_Y;
    const portrait = PORTRAITS[speaker] || PORTRAITS.narrator;

    // Portrait background square
    this.portraitBg.fillStyle(portrait.color, 1);
    this.portraitBg.fillRoundedRect(30, BOX_Y + 10, 90, 90, 6);
    this.portraitBg.lineStyle(2, 0xc8956c, 0.8);
    this.portraitBg.strokeRoundedRect(30, BOX_Y + 10, 90, 90, 6);

    // Initial letter
    if (this.portraitLabel) this.portraitLabel.destroy();
    this.portraitLabel = this.scene.add.text(75, BOX_Y + 55, portrait.label, {
      fontFamily: 'Georgia, serif',
      fontSize: '38px',
      color: '#ffffff',
      fontStyle: 'bold',
      alpha: 0.9,
    }).setOrigin(0.5).setDepth(102);
  }

  _showLine(line) {
    const portrait = PORTRAITS[line.speaker] || PORTRAITS.narrator;

    this._drawPortrait(line.speaker);
    this.speakerText.setText(portrait.name);
    this.dialogueText.setText('');
    this.continueHint.setVisible(false);

    // Start typewriter
    this.targetText = line.text;
    this.charIndex = 0;
    this.isTyping = true;

    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
    }

    this.typewriterTimer = this.scene.time.addEvent({
      delay: 22,
      callback: this._typeNextChar,
      callbackScope: this,
      loop: true,
    });

    // Run onShow callback if present (e.g. for giving items)
    if (line.onShow) {
      line.onShow();
    }
  }

  _typeNextChar() {
    if (this.charIndex < this.targetText.length) {
      this.charIndex++;
      this.dialogueText.setText(this.targetText.slice(0, this.charIndex));
    } else {
      this.isTyping = false;
      this.typewriterTimer.remove();
      this.typewriterTimer = null;
      this.continueHint.setVisible(true);
    }
  }

  _advance() {
    if (!this.isActive) return;

    // If still typing, skip to end of current line
    if (this.isTyping) {
      if (this.typewriterTimer) {
        this.typewriterTimer.remove();
        this.typewriterTimer = null;
      }
      this.isTyping = false;
      this.dialogueText.setText(this.targetText);
      this.continueHint.setVisible(true);
      return;
    }

    // Advance to next line
    this.currentIndex++;
    if (this.currentIndex < this.lines.length) {
      this._showLine(this.lines[this.currentIndex]);
    } else {
      this._close();
    }
  }

  _close() {
    this.isActive = false;
    this._setVisible(false);
    if (this.portraitLabel) {
      this.portraitLabel.destroy();
      this.portraitLabel = null;
    }
    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
      this.typewriterTimer = null;
    }

    // Re-enable scene interaction
    this.scene.events.emit('sq_dialogue_end');

    if (this.onComplete) {
      const cb = this.onComplete;
      this.onComplete = null;
      cb();
    }
  }

  // ── Public API ─────────────────────────────────────────────

  play(lines, onComplete = null) {
    if (!lines || lines.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    this.lines = lines;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.isActive = true;

    this._setVisible(true);
    this._showLine(this.lines[0]);

    // Notify scene that dialogue is running (disable hotspot clicks)
    this.scene.events.emit('sq_dialogue_start');
  }

  update() {
    if (!this.isActive) return;
    if (Phaser.Input.Keyboard.JustDown(this._spaceKey)) {
      this._advance();
    }
  }

  destroy() {
    this._setVisible(false);
    this.bg.destroy();
    this.portraitBg.destroy();
    this.speakerText.destroy();
    this.dialogueText.destroy();
    this.continueHint.destroy();
    this.clickZone.destroy();
    if (this.portraitLabel) this.portraitLabel.destroy();
    if (this.typewriterTimer) this.typewriterTimer.remove();
    if (this._spaceKey) this._spaceKey.destroy();
  }
}
