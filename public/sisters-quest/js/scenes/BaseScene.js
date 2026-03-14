// ============================================================
// scenes/BaseScene.js — Sisters' Quest
// Base class for all game scenes.
// Builds the verb bar, inventory, and status strip directly
// inside the scene — no parallel UIScene needed.
// ============================================================

class BaseScene extends Phaser.Scene {

  // Call this at the END of each subclass create() once the
  // game world is drawn. It always renders on top (depth 200+).
  _initUI() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.WORLD_H  = H - 156;   // usable game world height
    this.STATUS_Y = H - 156;   // top of status strip
    this.BAR_Y    = H - 120;   // top of verb/inventory bar
    this._uiEnabled = true;
    this._verbButtons = {};
    this._invSlots    = [];

    this._buildUIBackground(W, H);
    this._buildVerbButtons(W, H);
    this._buildInventory(W, H);
    this._buildStatusText(W, H);

    // React to state changes dispatched via window events
    this._onInvChange  = (e) => this._refreshInventory(e.detail.inventory);
    this._onVerbChange = ()  => this._refreshVerbs();
    window.addEventListener('sq_inventory_changed', this._onInvChange);
    window.addEventListener('sq_verb_changed',      this._onVerbChange);

    // Clean up listeners when scene shuts down
    this.events.once('shutdown', () => {
      window.removeEventListener('sq_inventory_changed', this._onInvChange);
      window.removeEventListener('sq_verb_changed',      this._onVerbChange);
    });

    // Populate initial state
    this._refreshInventory(GameState.getInventory());
    this._refreshVerbs();
  }

  // ── Background strips ───────────────────────────────────────

  _buildUIBackground(W, H) {
    const g = this.add.graphics().setDepth(200);

    // Status strip (above verb bar)
    g.fillStyle(0x07060a, 1);
    g.fillRect(0, this.STATUS_Y, W, 36);
    g.lineStyle(1, 0x1e1a14, 0.8);
    g.lineBetween(0, this.STATUS_Y, W, this.STATUS_Y);

    // Verb / inventory bar
    g.fillStyle(0x0c0a08, 1);
    g.fillRect(0, this.BAR_Y, W, H - this.BAR_Y);
    g.lineStyle(1.5, 0xc8956c, 0.7);
    g.lineBetween(0, this.BAR_Y, W, this.BAR_Y);

    // Divider between verbs and inventory
    g.lineStyle(1, 0x2a2418, 0.9);
    g.lineBetween(248, this.BAR_Y + 8, 248, H - 8);
  }

  // ── Verb buttons ────────────────────────────────────────────

  _buildVerbButtons(W, H) {
    const VERBS  = ['look', 'talk', 'take', 'use'];
    const ICONS  = { look: '👁', talk: '💬', take: '✋', use: '⚙' };
    const LABELS = { look: 'Look', talk: 'Talk', take: 'Take', use: 'Use' };
    const BW = 108, BH = 42, GX = 6, GY = 6;
    const SX = 20, SY = this.BAR_Y + 10;

    VERBS.forEach((verb, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const bx = SX + col * (BW + GX);
      const by = SY + row * (BH + GY);

      const bg = this.add.graphics().setDepth(201);
      this._drawVerbBg(bg, bx, by, BW, BH, false, false);

      this.add.text(bx + 12, by + BH / 2, ICONS[verb], {
        fontFamily: 'Arial', fontSize: '15px',
      }).setOrigin(0, 0.5).setDepth(202);

      const lbl = this.add.text(bx + 33, by + BH / 2, LABELS[verb], {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#e8d5b0',
      }).setOrigin(0, 0.5).setDepth(202);

      const zone = this.add.zone(bx + BW / 2, by + BH / 2, BW, BH)
        .setInteractive({ useHandCursor: true })
        .setDepth(205);

      zone.on('pointerdown', () => {
        if (!this._uiEnabled) return;
        VerbSystem.setVerb(verb);
      });
      zone.on('pointerover', () => {
        if (verb !== VerbSystem.activeVerb) {
          this._drawVerbBg(bg, bx, by, BW, BH, false, true);
        }
      });
      zone.on('pointerout', () => {
        this._drawVerbBg(bg, bx, by, BW, BH, verb === VerbSystem.activeVerb, false);
      });

      this._verbButtons[verb] = { bg, lbl, zone, bx, by, BW, BH };
    });
  }

  _drawVerbBg(g, x, y, w, h, active, hover) {
    g.clear();
    const fill   = active ? 0x2a1a08 : hover ? 0x1a1208 : 0x111008;
    const border = active ? 0xc8956c : hover ? 0x6b4a1a : 0x252015;
    const thick  = active ? 1.5 : 1;
    g.fillStyle(fill, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.lineStyle(thick, border, 1);
    g.strokeRoundedRect(x, y, w, h, 4);
  }

  _refreshVerbs() {
    if (!this._verbButtons) return;
    const active = VerbSystem.activeVerb;
    Object.entries(this._verbButtons).forEach(([verb, btn]) => {
      this._drawVerbBg(btn.bg, btn.bx, btn.by, btn.BW, btn.BH, verb === active, false);
      btn.lbl.setColor(verb === active ? '#ffffff' : '#e8d5b0');
    });
  }

  // ── Inventory ───────────────────────────────────────────────

  _buildInventory(W, H) {
    const SLOT = 52, GAP = 6, COUNT = 8;
    const SX   = 264;
    const SY   = this.BAR_Y + (120 - SLOT) / 2;

    this._invCfg = { SLOT, GAP, COUNT, SX, SY };

    for (let i = 0; i < COUNT; i++) {
      const ix = SX + i * (SLOT + GAP);
      const bg = this.add.graphics().setDepth(201);
      this._drawSlot(bg, ix, SY, SLOT, false, false);
      this._invSlots.push({ bg, ix, SY, SLOT, key: null, children: [], zone: null });
    }
  }

  _drawSlot(g, x, y, size, filled, active) {
    g.clear();
    const fill   = active ? 0x2a1a08 : filled ? 0x181208 : 0x0c0a06;
    const border = active ? 0xc8956c : filled ? 0x5a3a10 : 0x1e1a10;
    const thick  = active ? 2 : 1;
    g.fillStyle(fill, 1);
    g.fillRoundedRect(x, y, size, size, 4);
    g.lineStyle(thick, border, 1);
    g.strokeRoundedRect(x, y, size, size, 4);
  }

  _refreshInventory(keys) {
    const { SLOT, GAP, SX, SY } = this._invCfg;

    this._invSlots.forEach((slot, i) => {
      // Destroy previous slot content
      slot.children.forEach(c => c.destroy());
      slot.children = [];
      if (slot.zone) { slot.zone.destroy(); slot.zone = null; }

      const key = keys[i] || null;
      slot.key  = key;
      const ix  = SX + i * (SLOT + GAP);
      const active = key !== null && key === VerbSystem.activeItem;

      this._drawSlot(slot.bg, ix, SY, SLOT, !!key, active);

      if (key && ITEMS[key]) {
        const item = ITEMS[key];

        const swatch = this.add.graphics().setDepth(202);
        swatch.fillStyle(item.color, 1);
        swatch.fillRoundedRect(ix + 5, SY + 5, SLOT - 10, SLOT - 22, 3);
        slot.children.push(swatch);

        const sym = this.add.text(ix + SLOT / 2, SY + SLOT / 2 - 4, item.symbol, {
          fontFamily: 'Arial', fontSize: '20px',
        }).setOrigin(0.5).setDepth(203);
        slot.children.push(sym);

        const zone = this.add.zone(ix + SLOT / 2, SY + SLOT / 2, SLOT, SLOT)
          .setInteractive({ useHandCursor: true })
          .setDepth(205);

        zone.on('pointerover', () => {
          this.setStatus(item.name + ': ' + item.description);
        });
        zone.on('pointerout', () => {
          this.setStatus('');
        });
        zone.on('pointerdown', () => {
          if (!this._uiEnabled) return;
          VerbSystem.setActiveItem(key);
          this._refreshInventory(GameState.getInventory());
        });

        slot.zone = zone;
      }
    });
  }

  // ── Status text ─────────────────────────────────────────────

  _buildStatusText(W, H) {
    this._statusTxt = this.add.text(W / 2, this.STATUS_Y + 18, '', {
      fontFamily: 'Georgia, serif',
      fontSize:   '13px',
      color:      '#a3a3a3',
      fontStyle:  'italic',
      wordWrap:   { width: W - 40 },
    }).setOrigin(0.5).setDepth(202);
  }

  setStatus(text) {
    if (this._statusTxt) this._statusTxt.setText(text);
  }

  // ── UI enable / disable (called by DialogueSystem) ──────────

  disableUI() {
    this._uiEnabled = false;
    Object.values(this._verbButtons).forEach(b => b.zone.disableInteractive());
    this._invSlots.forEach(s => s.zone && s.zone.disableInteractive());
  }

  enableUI() {
    this._uiEnabled = true;
    Object.values(this._verbButtons).forEach(b =>
      b.zone.setInteractive({ useHandCursor: true })
    );
    // Recreate inventory zones (they may have been destroyed)
    this._refreshInventory(GameState.getInventory());
  }
}
