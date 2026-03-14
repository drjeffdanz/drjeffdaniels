// ============================================================
// GameState.js — Sisters' Quest: The Moonveil Crown
// Global singleton for inventory, flags, and save/load
// ============================================================

const GameState = (function () {
  const SAVE_KEY = 'sistersquest_v1_save';

  let _inventory = [];   // array of item keys
  let _flags = {};       // boolean/value puzzle flags
  let _currentScene = null;

  function _dispatch(event, detail = {}) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  }

  return {
    // ── Inventory ──────────────────────────────────────────
    addItem(key) {
      if (!_inventory.includes(key)) {
        _inventory.push(key);
        _dispatch('sq_inventory_changed', { inventory: [..._inventory] });
      }
    },
    removeItem(key) {
      _inventory = _inventory.filter(k => k !== key);
      _dispatch('sq_inventory_changed', { inventory: [..._inventory] });
    },
    hasItem(key) {
      return _inventory.includes(key);
    },
    getInventory() {
      return [..._inventory];
    },

    // ── Flags ──────────────────────────────────────────────
    setFlag(key, value = true) {
      _flags[key] = value;
    },
    getFlag(key) {
      return _flags[key] !== undefined ? _flags[key] : false;
    },

    // ── Scene tracking ─────────────────────────────────────
    setCurrentScene(name) {
      _currentScene = name;
    },
    getCurrentScene() {
      return _currentScene;
    },

    // ── Save / Load ────────────────────────────────────────
    save(sceneName) {
      const data = {
        inventory: [..._inventory],
        flags: { ..._flags },
        scene: sceneName || _currentScene,
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        return true;
      } catch (e) {
        console.warn('Save failed:', e);
        return false;
      }
    },
    load() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        _inventory = data.inventory || [];
        _flags = data.flags || {};
        _currentScene = data.scene || null;
        _dispatch('sq_inventory_changed', { inventory: [..._inventory] });
        return data;
      } catch (e) {
        console.warn('Load failed:', e);
        return null;
      }
    },
    hasSave() {
      return !!localStorage.getItem(SAVE_KEY);
    },
    deleteSave() {
      localStorage.removeItem(SAVE_KEY);
    },

    // ── New Game ───────────────────────────────────────────
    reset() {
      _inventory = [];
      _flags = {};
      _currentScene = null;
      // Cambrie always starts with her journal
      this.addItem('cambries_journal');
    },
  };
})();
