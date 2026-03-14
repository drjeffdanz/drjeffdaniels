// ============================================================
// scenes/UIScene.js — Sisters' Quest
// Persistent overlay: verb bar, inventory, status text
// Runs in parallel with game scenes
// ============================================================

class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;

    // UI bar occupies the bottom 120px
    this.BAR_Y = this.H - 120;
    this.BAR_H = 120;

    this._dialogueActive = false;
    this._hoveredItem = null;

    this._buildBackground();
    this._buildVerbButtons();
    this._buildInventorySlots();
    this._buildStatusBar();
    this._buildActionLabel();

    // Listen for inventory changes
    window.addEventListener('sq_inventory_changed', (e) => {
      this._refreshInventory(e.detail.inventory);
    });

    // Listen for verb changes
    window.addEventListener('sq_verb_changed', () => {
      this._refreshVerbButtons();
      this._updateActionLabel();
    });

    // Listen for dialogue start/end (disable UI during dialogue)
    const activeScene = () => {
      const scenes = this.scene.manager.getScenes(true);
      return scenes.find(s => s !== this);
    };

    this.game.events.on('sq_dialogue_start_global', () => {
      this._dialogueActive = true;
      this._setUIEnabled(false);
    });
    this.game.events.on('sq_dialogue_end_global', () => {
      this._dialogueActive = false;
      this._setUIEnabled(true);
    });

    // Initial inventory render
    this._refreshInventory(GameState.getInventory());
    this._refreshVerbButtons();
  }

  _buildBackground() {
    const g = this.add.graphics();

    // Main bar
    g.fillStyle(0x0c0a08, 1);
    g.fillRect(0, this.BAR_Y, this.W, this.BAR_H);

    // Top border line (gold)
    g.lineStyle(1.5, 0xc8956c, 0.8);
    g.lineBetween(0, this.BAR_Y, this.W, this.BAR_Y);

    // Divider between verbs and inventory
    g.lineStyle(1, 0x333333, 1);
    g.lineBetween(250, this.BAR_Y + 10, 250, this.H - 10);
  }

  _buildVerbButtons() {
    const verbs = ['look', 'talk', 'take', 'use'];
    const labels = {
      look: ['👁', 'Look'],
      talk: ['💬', 'Talk'],
      take: ['✋', 'Take'],
      use:  ['⚙', 'Use'],
    };

    this._verbButtons = {};

    // 2×2 grid, left side of bar
    const startX = 20;
    const startY = this.BAR_Y + 12;
    const btnW = 108;
    const btnH = 42;
    const gapX = 6;
    const gapY = 6;

    verbs.forEach((verb, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (btnW + gapX);
      const y = startY + row * (btnH + gapY);

      const bg = this.add.graphics();
      this._drawVerbBg(bg, x, y, btnW, btnH, verb === VerbSystem.activeVerb);

      const icon = this.add.text(x + 14, y + btnH / 2, labels[verb][0], {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#c8956c',
      }).setOrigin(0, 0.5);

      const txt = this.add.text(x + 36, y + btnH / 2, labels[verb][1], {
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        color: '#e8d5b0',
      }).setOrigin(0, 0.5);

      const zone = this.add.zone(x + btnW / 2, y + btnH / 2, btnW, btnH)
        .setInteractive({ useHandCursor: true });

      zone.on('pointerdown', () => {
        VerbSystem.setVerb(verb);
        this._refreshVerbButtons();
        this._updateActionLabel();
      });

      zone.on('pointerover', () => {
        if (verb !== VerbSystem.activeVerb) {
          this._drawVerbBg(bg, x, y, btnW, btnH, false, true);
        }
      });

      zone.on('pointerout', () => {
        this._drawVerbBg(bg, x, y, btnW, btnH, verb === VerbSystem.activeVerb);
      });

      this._verbButtons[verb] = { bg, txt, icon, zone, x, y, btnW, btnH };
    });
  }

  _drawVerbBg(g, x, y, w, h, active, hover = false) {
    g.clear();
    if (active) {
      g.fillStyle(0x2a1a08, 1);
      g.fillRoundedRect(x, y, w, h, 4);
      g.lineStyle(1.5, 0xc8956c, 1);
      g.strokeRoundedRect(x, y, w, h, 4);
    } else if (hover) {
      g.fillStyle(0x1a1208, 1);
      g.fillRoundedRect(x, y, w, h, 4);
      g.lineStyle(1, 0x6b4a1a, 1);
      g.strokeRoundedRect(x, y, w, h, 4);
    } else {
      g.fillStyle(0x111008, 1);
      g.fillRoundedRect(x, y, w, h, 4);
      g.lineStyle(1, 0x2a2010, 1);
      g.strokeRoundedRect(x, y, w, h, 4);
    }
  }

  _refreshVerbButtons() {
    const active = VerbSystem.activeVerb;
    Object.entries(this._verbButtons).forEach(([verb, btn]) => {
      this._drawVerbBg(btn.bg, btn.x, btn.y, btn.btnW, btn.btnH, verb === active);
      btn.txt.setColor(verb === active ? '#ffffff' : '#e8d5b0');
    });
  }

  _buildInventorySlots() {
    this._inventorySlots = [];
    const SLOT_SIZE = 52;
    const SLOT_GAP = 6;
    const NUM_SLOTS = 8;
    const startX = 266;
    const slotY = this.BAR_Y + (this.BAR_H - SLOT_SIZE) / 2;

    this._slotData = { startX, slotY, SLOT_SIZE, SLOT_GAP, NUM_SLOTS };

    for (let i = 0; i < NUM_SLOTS; i++) {
      const x = startX + i * (SLOT_SIZE + SLOT_GAP);
      const slotBg = this.add.graphics();
      this._drawSlot(slotBg, x, slotY, SLOT_SIZE, false, false);

      this._inventorySlots.push({
        bg: slotBg,
        icon: null,
        label: null,
        x,
        y: slotY,
        size: SLOT_SIZE,
        itemKey: null,
        zone: null,
      });
    }
  }

  _drawSlot(g, x, y, size, filled, active) {
    g.clear();
    if (active) {
      g.fillStyle(0x2a1a08, 1);
      g.fillRoundedRect(x, y, size, size, 4);
      g.lineStyle(2, 0xc8956c, 1);
      g.strokeRoundedRect(x, y, size, size, 4);
    } else if (filled) {
      g.fillStyle(0x181208, 1);
      g.fillRoundedRect(x, y, size, size, 4);
      g.lineStyle(1, 0x5a3a10, 1);
      g.strokeRoundedRect(x, y, size, size, 4);
    } else {
      g.fillStyle(0x0c0a06, 1);
      g.fillRoundedRect(x, y, size, size, 4);
      g.lineStyle(1, 0x1e1a10, 1);
      g.strokeRoundedRect(x, y, size, size, 4);
    }
  }

  _refreshInventory(keys) {
    const { startX, slotY, SLOT_SIZE, SLOT_GAP } = this._slotData;

    this._inventorySlots.forEach((slot, i) => {
      // Clear old content
      if (slot.icon) { slot.icon.destroy(); slot.icon = null; }
      if (slot.label) { slot.label.destroy(); slot.label = null; }
      if (slot.zone) { slot.zone.destroy(); slot.zone = null; }

      slot.itemKey = keys[i] || null;
      const x = startX + i * (SLOT_SIZE + SLOT_GAP);
      const isActive = slot.itemKey === VerbSystem.activeItem;

      this._drawSlot(slot.bg, x, slotY, SLOT_SIZE, !!slot.itemKey, isActive);

      if (slot.itemKey) {
        const item = ITEMS[slot.itemKey];
        if (item) {
          // Color swatch
          const swatch = this.add.graphics();
          swatch.fillStyle(item.color, 1);
          swatch.fillRoundedRect(x + 6, slotY + 6, SLOT_SIZE - 12, SLOT_SIZE - 26, 3);

          // Symbol/icon text
          const sym = this.add.text(x + SLOT_SIZE / 2, slotY + SLOT_SIZE / 2 - 6, item.symbol, {
            fontFamily: 'Arial',
            fontSize: '22px',
          }).setOrigin(0.5);

          slot.icon = swatch;
          slot.label = sym;

          // Interactive zone
          const zone = this.add.zone(x + SLOT_SIZE / 2, slotY + SLOT_SIZE / 2, SLOT_SIZE, SLOT_SIZE)
            .setInteractive({ useHandCursor: true });

          zone.on('pointerover', () => {
            this._showStatusText(item.name + ' — ' + item.description);
          });

          zone.on('pointerout', () => {
            this._clearStatusText();
          });

          zone.on('pointerdown', () => {
            VerbSystem.setActiveItem(slot.itemKey);
            this._refreshInventory(GameState.getInventory());
            this._updateActionLabel();
          });

          slot.zone = zone;
        }
      }
    });
  }

  _buildStatusBar() {
    // Status bar sits just above the verb/inventory panel
    this._statusBg = this.add.graphics();
    this._statusBg.fillStyle(0x080608, 1);
    this._statusBg.fillRect(0, this.BAR_Y - 36, this.W, 36);
    this._statusBg.lineStyle(1, 0x252525, 1);
    this._statusBg.lineBetween(0, this.BAR_Y - 36, this.W, this.BAR_Y - 36);

    this._statusText = this.add.text(this.W / 2, this.BAR_Y - 18, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#a3a3a3',
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  _buildActionLabel() {
    this._actionLabel = this.add.text(this.W - 16, this.BAR_Y + 8, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      color: '#c8956c',
    }).setOrigin(1, 0);
  }

  _updateActionLabel() {
    this._actionLabel.setText(VerbSystem.getActionLabel());
  }

  _showStatusText(text) {
    this._statusText.setText(text);
  }

  _clearStatusText() {
    this._statusText.setText('');
  }

  // Called by game scenes to update the status/description text
  setStatus(text) {
    this._statusText.setText(text);
  }

  _setUIEnabled(enabled) {
    Object.values(this._verbButtons).forEach(btn => {
      if (enabled) btn.zone.setInteractive();
      else btn.zone.disableInteractive();
    });
    this._inventorySlots.forEach(slot => {
      if (slot.zone) {
        if (enabled) slot.zone.setInteractive();
        else slot.zone.disableInteractive();
      }
    });
  }
}
