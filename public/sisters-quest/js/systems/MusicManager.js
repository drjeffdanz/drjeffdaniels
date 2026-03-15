// ============================================================
// systems/MusicManager.js — Sisters' Quest: The Moonveil Crown
// Global music manager — crossfade between 4 ambient tracks
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
      onUpdate:   () => { try { sound.volume = w.vol; } catch (_) {} },
      onComplete: () => { if (onDone) onDone(); },
    });
  }

  return {

    // ── Play a track (no-op if already playing) ───────────────
    play(scene, key) {
      if (_currentKey === key) return;

      const prev  = _sound;
      _currentKey = key;

      // Fade out old track
      if (prev) {
        const startVol = (prev.volume > 0) ? prev.volume : _volume;
        _tweenVolume(scene, prev, startVol, 0, FADE_OUT_MS, () => {
          try { prev.stop(); prev.destroy(); } catch (_) {}
        });
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
      const startVol = (s.volume > 0) ? s.volume : _volume;
      _tweenVolume(scene, s, startVol, 0, FADE_OUT_MS, () => {
        try { s.stop(); s.destroy(); } catch (_) {}
      });
    },

    // ── Adjust master volume (0–1) ────────────────────────────
    setVolume(scene, v) {
      _volume = v;
      if (_sound) {
        const s = _sound;
        _tweenVolume(scene, s, s.volume, v, 300, null);
      }
    },

    currentKey() { return _currentKey; },
  };
})();
