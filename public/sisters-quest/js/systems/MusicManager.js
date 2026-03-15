// ============================================================
// systems/MusicManager.js — Sisters' Quest: The Moonveil Crown
// Global music manager — crossfade between ambient tracks
// Usage: MusicManager.play(this, 'music_palace')
// ============================================================

const MusicManager = (() => {
  let _sound      = null;
  let _currentKey = null;
  let _volume     = 0.35;

  const FADE_OUT_MS = 800;
  const FADE_IN_MS  = 1600;

  // Never use a sound object as a Phaser tween target directly.
  // Phaser 3.60 registers 'destroy' listeners on tween targets; when a sound
  // is destroyed it nulls the reference inside every live tween that holds it,
  // causing "Cannot set properties of null (setting 'volume')" on the next
  // tween update — which kills the game loop and leaves a black screen.
  //
  // Fix: tween a plain wrapper object { vol } instead, and copy vol → sound
  // inside onUpdate with a try/catch.  The sound is never a tween target so
  // Phaser's destroy-listener path is never triggered.
  function _tweenVolume(scene, sound, from, to, duration, onDone) {
    const w = { vol: from };
    scene.tweens.add({
      targets:    w,
      vol:        to,
      duration:   duration,
      onUpdate:   () => { try { if (sound) sound.volume = w.vol; } catch (_) {} },
      onComplete: () => { if (onDone) onDone(); },
    });
  }

  // Safe volume read — returns _volume fallback if the sound is in a bad state.
  function _readVol(sound) {
    try { return (typeof sound.volume === 'number' && sound.volume > 0) ? sound.volume : _volume; } catch (_) { return _volume; }
  }

  return {

    // ── Play a track (no-op if already playing) ───────────────
    play(scene, key) {
      if (_currentKey === key) return;

      const prev  = _sound;
      _currentKey = key;
      _sound      = null; // clear immediately so a crash in the fade-out block never leaves a stale ref

      // Fade out old track
      if (prev) {
        try {
          const startVol = _readVol(prev);
          _tweenVolume(scene, prev, startVol, 0, FADE_OUT_MS, () => {
            try { prev.stop(); } catch (_) {}
            try { prev.destroy(); } catch (_) {}
          });
        } catch (_) {
          // Sound in unexpected state — attempt cleanup and continue
          try { prev.stop(); } catch (_) {}
          try { prev.destroy(); } catch (_) {}
        }
      }

      // Fade in new track
      _sound = scene.sound.add(key, { loop: true, volume: 0 });
      _sound.play();
      const ref = _sound; // stable closure reference
      _tweenVolume(scene, ref, 0, _volume, FADE_IN_MS, null);
    },

    // ── Gracefully stop all music ─────────────────────────────
    stop(scene) {
      if (!_sound) return;
      const s = _sound;
      _sound      = null;
      _currentKey = null;
      try {
        const startVol = _readVol(s);
        _tweenVolume(scene, s, startVol, 0, FADE_OUT_MS, () => {
          try { s.stop(); } catch (_) {}
          try { s.destroy(); } catch (_) {}
        });
      } catch (_) {
        try { s.stop(); } catch (_) {}
        try { s.destroy(); } catch (_) {}
      }
    },

    // ── Adjust master volume (0–1) ────────────────────────────
    setVolume(scene, v) {
      _volume = v;
      if (_sound) {
        const s = _sound;
        try {
          _tweenVolume(scene, s, _readVol(s), v, 300, null);
        } catch (_) {}
      }
    },

    currentKey() { return _currentKey; },
  };
})();
