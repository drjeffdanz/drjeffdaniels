// ============================================================
// systems/VerbSystem.js — Sisters' Quest: The Moonveil Crown
// Tracks active verb and selected inventory item
// ============================================================

const VerbSystem = (function () {
  const VERBS = ['look', 'talk', 'take', 'use'];

  let _activeVerb = 'look';
  let _activeItem = null; // inventory key of selected item (for USE)

  return {
    VERBS,

    VERB_LABELS: {
      look: '👁  Look',
      talk: '💬 Talk',
      take: '✋ Take',
      use:  '⚙  Use',
    },

    get activeVerb() { return _activeVerb; },
    get activeItem() { return _activeItem; },

    setVerb(verb) {
      if (VERBS.includes(verb)) {
        _activeVerb = verb;
        _activeItem = null; // clear selected item when verb changes
        window.dispatchEvent(new CustomEvent('sq_verb_changed', { detail: { verb: _activeVerb } }));
      }
    },

    setActiveItem(key) {
      _activeItem = key;
      _activeVerb = 'use';
      window.dispatchEvent(new CustomEvent('sq_verb_changed', { detail: { verb: 'use', item: key } }));
    },

    clearActiveItem() {
      _activeItem = null;
    },

    // Returns display label for current action
    getActionLabel() {
      if (_activeVerb === 'use' && _activeItem && ITEMS[_activeItem]) {
        return `Use ${ITEMS[_activeItem].name}`;
      }
      return this.VERB_LABELS[_activeVerb] || _activeVerb;
    },
  };
})();
