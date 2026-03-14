// ============================================================
// scenes/MirroredMereScene.js — Sisters' Quest: The Moonveil Crown
// Act 2: The Mirrored Mere — a perfect still pool in the Thornwood.
// Extends BaseScene — verb bar and inventory built in.
// ============================================================

class MirroredMereScene extends BaseScene {
  constructor() { super({ key: 'MirroredMereScene' }); }

  preload() { this.load.image('bg_mere', 'assets/backgrounds/mirrored-mere.jpg'); }

  create() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;

    GameState.setCurrentScene('MirroredMereScene');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // ── Background image ──────────────────────────────────────
    this.add.image(W / 2, WH / 2, 'bg_mere').setDisplaySize(W, WH).setDepth(0);

    // ── Draw world ────────────────────────────────────────────
    this._drawMere(W, WH);
    this._drawMoon(W, WH);
    this._createShardObject(W, WH);

    // Scene label
    this.add.text(W / 2, 18, 'The Mirrored Mere  ·  The Thornwood', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#202a3a', fontStyle: 'italic',
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
    this._shardVisible = false;
    this._buildHotspots(W, H);

    // ── Shared UI — always last ───────────────────────────────
    this._initUI();

    // Entrance sequence
    this.time.delayedCall(400, () => {
      this._play(DIALOGUE_MERE_ENTER, () => {
        this._triggerMoonRises();
      });
    });

    this.setStatus('The Mere. Still as a held breath.');
  }

  // ── The Mere ─────────────────────────────────────────────────

  _drawMere(W, WH) {
    const g  = this.add.graphics().setDepth(3);
    const cx = W / 2;
    const cy = WH * 0.65;
    const rx = W * 0.30;
    const ry = WH * 0.20;

    // Deep outer ring — almost black-blue at edges
    g.fillStyle(0x020818, 1);
    g.fillEllipse(cx, cy, rx * 2 + 16, ry * 2 + 10);

    // Water surface — layered gradient effect via concentric ellipses
    const layers = [
      { scale: 1.00, color: 0x030c22, alpha: 1   },
      { scale: 0.85, color: 0x05122e, alpha: 1   },
      { scale: 0.70, color: 0x071838, alpha: 1   },
      { scale: 0.55, color: 0x0a2048, alpha: 1   },
      { scale: 0.40, color: 0x0e2858, alpha: 1   },
      { scale: 0.25, color: 0x142e6a, alpha: 1   },
      { scale: 0.12, color: 0x1c3878, alpha: 0.9 },
      { scale: 0.05, color: 0x8090c0, alpha: 0.5 }, // silver center glint
    ];

    layers.forEach(l => {
      g.fillStyle(l.color, l.alpha);
      g.fillEllipse(cx, cy, rx * 2 * l.scale, ry * 2 * l.scale);
    });

    // Reflected stars in the water
    const reflStars = [
      [cx - 80, cy - 30], [cx + 60, cy - 50], [cx - 30, cy + 20],
      [cx + 100, cy + 10], [cx - 110, cy + 40], [cx + 20, cy - 60],
      [cx + 130, cy - 20], [cx - 50, cy + 50], [cx + 70, cy + 40],
      [cx - 140, cy - 10], [cx + 50, cy + 60], [cx - 90, cy - 55],
    ];
    reflStars.forEach(([sx, sy]) => {
      g.fillStyle(0xb8c8e8, 0.55);
      g.fillCircle(sx, sy, 1.2);
    });

    // Reflected moon shimmer — elongated highlight on water (brightened)
    g.fillStyle(0xd0daf8, 0.55);
    g.fillEllipse(cx, cy - WH * 0.08, 30, 72);
    g.fillStyle(0xe0e8ff, 0.30);
    g.fillEllipse(cx, cy - WH * 0.06, 18, 50);
    g.fillStyle(0xffffff, 0.14);
    g.fillEllipse(cx, cy - WH * 0.075, 10, 28);

    // Very subtle ripple rings — static suggestion of stillness
    g.lineStyle(1, 0x1a3060, 0.3);
    g.strokeEllipse(cx, cy, rx * 1.6, ry * 1.6);
    g.lineStyle(1, 0x1a3060, 0.18);
    g.strokeEllipse(cx, cy, rx * 1.2, ry * 1.2);

    // Shore edge — slightly lighter rock/mud line
    g.lineStyle(2, 0x0a1828, 0.9);
    g.strokeEllipse(cx, cy, rx * 2 + 16, ry * 2 + 10);

    // Animated water caustic shimmer
    const shimmerG = this.add.graphics().setDepth(4);
    this.tweens.add({
      targets: shimmerG,
      alpha: { from: 0.5, to: 1.0 },
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        shimmerG.clear();
        const t = Date.now() / 3000;
        // Drifting caustic glints across the Mere surface
        for (let i = 0; i < 5; i++) {
          const lx = cx + Math.sin(t + i * 1.3) * rx * 0.42;
          const ly = cy + Math.cos(t * 0.7 + i * 0.9) * ry * 0.28;
          const lw = 20 + Math.sin(t * 1.4 + i) * 7;
          shimmerG.fillStyle(0xc8d8f8, 0.045 * shimmerG.alpha);
          shimmerG.fillEllipse(lx, ly, lw, lw * 0.22);
        }
        // Pulsing moon reflection
        const rAlpha = (0.45 + Math.sin(t * 2.1) * 0.10) * shimmerG.alpha;
        shimmerG.fillStyle(0xd8e8ff, rAlpha);
        shimmerG.fillEllipse(cx, cy - ry * 0.42, 28 + Math.sin(t * 1.5) * 3, 66 + Math.sin(t) * 5);
        shimmerG.fillStyle(0xffffff, 0.10 * shimmerG.alpha);
        shimmerG.fillEllipse(cx, cy - ry * 0.36, 10, 24);
      },
    });
  }

  // ── Moon ─────────────────────────────────────────────────────

  _drawMoon(W, WH) {
    const g  = this.add.graphics().setDepth(2);
    const mx = W * 0.72;
    const my = WH * 0.16;
    const mr = 26;

    // Outer corona
    g.fillStyle(0xc8d8ff, 0.04);
    g.fillCircle(mx, my, mr + 56);
    g.fillStyle(0xc8d8ff, 0.07);
    g.fillCircle(mx, my, mr + 44);
    // Mid glow rings
    g.fillStyle(0xdde8ff, 0.18);
    g.fillCircle(mx, my, mr + 30);
    g.fillStyle(0xe8f0ff, 0.35);
    g.fillCircle(mx, my, mr + 18);
    // Moon face — bright cool white
    g.fillStyle(0xf0f4ff, 0.88);
    g.fillCircle(mx, my, mr);
    // Subtle surface shading (lower-right)
    g.fillStyle(0xd8e4f8, 0.18);
    g.fillCircle(mx + 8, my + 6, 10);
    // Bright highlight (upper-left)
    g.fillStyle(0xffffff, 0.55);
    g.fillCircle(mx - 8, my - 7, 9);
    g.fillStyle(0xffffff, 0.25);
    g.fillCircle(mx - 5, my - 4, 14);
    // Atmosphere rim
    g.lineStyle(1, 0xd0dcf8, 0.5);
    g.strokeCircle(mx, my, mr);

    // Animated shimmer ring
    const shimmer = this.add.graphics().setDepth(2);
    this.tweens.add({
      targets: shimmer,
      alpha: { from: 0.6, to: 1.0 },
      duration: 2800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        shimmer.clear();
        shimmer.lineStyle(1.5, 0xc8d8ff, 0.18 * shimmer.alpha);
        shimmer.strokeCircle(mx, my, mr + 4 + shimmer.alpha * 6);
        shimmer.lineStyle(1, 0xffffff, 0.08 * shimmer.alpha);
        shimmer.strokeCircle(mx, my, mr + 14 + shimmer.alpha * 8);
      },
    });
  }

  // ── Shard object (hidden until triggered) ────────────────────

  _createShardObject(W, WH) {
    const cx = W / 2;

    // Shard glow circle — starts hidden at Mere center
    this._shardGlow = this.add.circle(cx, WH * 0.65, 14, 0xd8e8ff, 1)
      .setDepth(50)
      .setAlpha(0);

    // Inner brighter core
    this._shardCore = this.add.circle(cx, WH * 0.65, 6, 0xffffff, 0.9)
      .setDepth(51)
      .setAlpha(0);

    // Shard spikes — drawn as graphics
    this._shardSpikes = this.add.graphics().setDepth(52).setAlpha(0);
    this._drawShardSpikes(cx, WH * 0.65);
  }

  _drawShardSpikes(cx, cy) {
    const g = this._shardSpikes;
    g.clear();
    g.fillStyle(0xe8f4ff, 0.9);
    // Four elongated spike tips
    g.fillTriangle(cx, cy - 22, cx - 5, cy, cx + 5, cy);
    g.fillTriangle(cx, cy + 22, cx - 5, cy, cx + 5, cy);
    g.fillTriangle(cx - 22, cy, cx, cy - 5, cx, cy + 5);
    g.fillTriangle(cx + 22, cy, cx, cy - 5, cx, cy + 5);
    // Diagonal spikes
    g.fillStyle(0xd0e8ff, 0.5);
    g.fillTriangle(cx - 14, cy - 14, cx - 4, cy, cx, cy - 4);
    g.fillTriangle(cx + 14, cy - 14, cx + 4, cy, cx, cy - 4);
    g.fillTriangle(cx - 14, cy + 14, cx - 4, cy, cx, cy + 4);
    g.fillTriangle(cx + 14, cy + 14, cx + 4, cy, cx, cy + 4);
  }

  // ── Shard rise animation ──────────────────────────────────────

  _triggerMoonRises() {
    if (GameState.getFlag('mere_moon_triggered')) {
      // Already triggered — if shard not yet collected, show it in place
      if (!GameState.hasItem('starlight_shard')) {
        this._showShardInPlace();
        this._addShardHotspot();
      }
      return;
    }

    GameState.setFlag('mere_moon_triggered');

    this._play(DIALOGUE_MERE_MOON_RISES, () => {
      // Nothing here — shard hotspot added via onShow callback below
    });

    // Schedule the rise animation to start partway through the dialogue
    this.time.delayedCall(1200, () => {
      this._animateShardRising();
    });
  }

  _animateShardRising() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;
    const cx = W / 2;
    const targetY = WH * 0.40;

    // Make shard visible
    this._shardGlow.setAlpha(0).setY(WH * 0.65);
    this._shardCore.setAlpha(0).setY(WH * 0.65);
    this._shardSpikes.setAlpha(0).setY(WH * 0.65);

    // Rise tween
    this.tweens.add({
      targets: [this._shardGlow, this._shardCore, this._shardSpikes],
      y: targetY,
      alpha: 1,
      duration: 2200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this._shardVisible = true;
        // Redraw spikes at final position
        this._drawShardSpikes(cx, targetY);

        // Pulsing glow
        this.tweens.add({
          targets: this._shardGlow,
          scaleX: 1.35, scaleY: 1.35,
          alpha: 0.65,
          duration: 850,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: this._shardCore,
          scaleX: 1.2, scaleY: 1.2,
          alpha: 0.7,
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        // Add shard as hotspot only after it has risen
        if (!GameState.hasItem('starlight_shard')) {
          this._addShardHotspot();
        }
      },
    });
  }

  _showShardInPlace() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;
    const cx = W / 2;
    const targetY = WH * 0.40;

    this._shardGlow.setAlpha(1).setY(targetY);
    this._shardCore.setAlpha(1).setY(targetY);
    this._shardSpikes.setAlpha(1).setY(targetY);
    this._drawShardSpikes(cx, targetY);
    this._shardVisible = true;

    this.tweens.add({
      targets: this._shardGlow,
      scaleX: 1.35, scaleY: 1.35, alpha: 0.65,
      duration: 850, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this._shardCore,
      scaleX: 1.2, scaleY: 1.2, alpha: 0.7,
      duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
  }

  _addShardHotspot() {
    const W  = this.scale.width;
    const H  = this.scale.height;
    const WH = H - 156;
    const cx = W / 2;
    const sy = WH * 0.40;

    const def = {
      id: 'shard', name: 'Starlight Shard',
      x: cx, y: sy, w: 70, h: 70,
      look: () => this._narrate("It hums. It's beautiful. It came from starlight and remembers what that was like. The Mere gave it up willingly — or as willingly as starlight does anything."),
      talk: () => this._narrate("The shard doesn't speak in words. It speaks in light. You take that as encouragement."),
      take: () => this._collectShard(),
      use:  () => this._collectShard(),
    };

    const outline = this.add.graphics().setDepth(60);
    const zone    = this.add.zone(def.x, def.y, def.w, def.h)
      .setInteractive({ useHandCursor: true })
      .setDepth(205);

    zone.on('pointerover', () => {
      if (this._locked) return;
      outline.clear();
      outline.lineStyle(1.5, 0xd0e8ff, 0.5);
      outline.strokeCircle(def.x, def.y, 32);
      this.setStatus(VerbSystem.getActionLabel() + '  ·  ' + def.name);
    });
    zone.on('pointerout', () => { outline.clear(); this.setStatus(''); });
    zone.on('pointerdown', () => {
      if (this._locked) return;
      const v = VerbSystem.activeVerb;
      if (def[v]) def[v]();
    });

    this._hotspots.push({ zone, outline, def });
  }

  _collectShard() {
    this._play([
      { speaker: 'cambrie', text: "It's warm. Star-warm, not fire-warm. Something that was light for a long time and learned to hold that." },
      { speaker: 'mackenzie', text: "One of three. The atlas was right about the Mere." },
      { speaker: 'cambrie', text: "The atlas is right about most things. I just don't like admitting it." },
    ], () => {
      GameState.addItem('starlight_shard');
      GameState.setFlag('shard_collected');
      // Hide the shard visual
      this._shardGlow.setAlpha(0);
      this._shardCore.setAlpha(0);
      this._shardSpikes.setAlpha(0);
      // Remove shard hotspot
      const idx = this._hotspots.findIndex(h => h.def.id === 'shard');
      if (idx >= 0) {
        this._hotspots[idx].zone.destroy();
        this._hotspots[idx].outline.destroy();
        this._hotspots.splice(idx, 1);
      }
      this.setStatus('Starlight Shard collected.  ·  Onward.');
    });
  }

  // ── Hotspots ─────────────────────────────────────────────────

  _buildHotspots(W, H) {
    const WH = H - 156;
    const cx = W / 2;
    const cy = WH * 0.65;

    const defs = [
      {
        id: 'mere', name: 'The Mirrored Mere',
        x: cx, y: cy, w: W * 0.60, h: WH * 0.40,
        look: () => this._mereLook(),
        talk: () => this._narrate("Cambrie considers speaking to the Mere. The Mere continues to be a pool of water. The moment passes."),
        take: () => this._narrate("You can't take the Mere. Mackenzie suggests you stop trying."),
        use:  () => this._narrate("The Mere accepts nothing. It only reflects."),
      },
      {
        id: 'moon', name: 'The Moon',
        x: W * 0.72, y: WH * 0.16, w: 80, h: 70,
        look: () => this._narrate("The moon is perfectly reflected in the Mere below. Two moons, one above and one below. The one above moves imperceptibly. The one below is still."),
        talk: () => this._narrate("Mackenzie looks at you. 'You're talking to the moon.' 'I'm considering it,' Cambrie says."),
        take: () => this._narrate("Even Mackenzie doesn't comment on this one."),
        use:  () => this._narrate("The moon doesn't take things personally."),
      },
      {
        id: 'path_back', name: 'Path back to Thornwood',
        x: W * 0.10, y: WH * 0.88, w: 130, h: 50,
        look: () => this._narrate("The path back through the Thornwood. The goat is probably still there."),
        talk: () => this._narrate("The path offers nothing conversationally."),
        take: () => this._narrate("Still not how paths work."),
        use:  () => this._goBack(),
      },
      {
        id: 'path_forward', name: 'Path to the Sunken Garden',
        x: W * 0.90, y: WH * 0.88, w: 130, h: 50,
        look: () => this._forwardPathLook(),
        talk: () => this._narrate("The path ahead. It says nothing useful."),
        take: () => this._narrate("Not applicable."),
        use:  () => this._forwardPathUse(),
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
    });
  }

  _setHotspotsEnabled(on) {
    this._hotspots.forEach(h => {
      on ? h.zone.setInteractive({ useHandCursor: true })
         : h.zone.disableInteractive();
    });
  }

  // ── Hotspot logic ────────────────────────────────────────────

  _mereLook() {
    if (!GameState.getFlag('mere_looked_once')) {
      GameState.setFlag('mere_looked_once');
      this._play(DIALOGUE_MERE_SHARD_LOOK, () => {
        if (!GameState.getFlag('mere_moon_triggered')) {
          this._triggerMoonRises();
        }
      });
    } else {
      this._play(DIALOGUE_MERE_SHARD_LOOK);
    }
  }

  _forwardPathLook() {
    if (GameState.hasItem('starlight_shard')) {
      this._narrate("The path leads toward the coast — the Sunken Garden is that way, beyond the Whispering Caves. You have what you came for.");
    } else {
      this._narrate("The path leads deeper. There's nothing that way until you've found what the Mere has to give.");
    }
  }

  _forwardPathUse() {
    if (GameState.hasItem('starlight_shard')) {
      this._play([
        { speaker: 'mackenzie', text: "The shard. The Caves next, then the Garden." },
        { speaker: 'cambrie', text: "Still two more components to find. We're making progress." },
      ], () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => this.scene.start('WhisperingCavesScene'));
      });
    } else {
      this._play([
        { speaker: 'cambrie', text: "We're not done here yet. The Mere still has something to give us." },
        { speaker: 'mackenzie', text: "Look at the water. Something's there." },
      ]);
    }
  }

  _goBack() {
    this._play([
      { speaker: 'cambrie', text: "Back through the Thornwood." },
    ], () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('ThornwoodScene'));
    });
  }

  // ── Helpers ──────────────────────────────────────────────────

  _play(lines, cb = null) { this.dialogue.play(lines, cb); }

  _narrate(text) { this._play([{ speaker: 'narrator', text }]); }

  update() { if (this.dialogue) this.dialogue.update(); }
}
