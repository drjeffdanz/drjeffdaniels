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

  return {

    // ── Play a track (no-op if already playing) ───────────────
    play(scene, key) {
      if (_currentKey === key) return;

      const prev    = _sound;
      _currentKey   = key;

      // Fade out old track using the incoming scene's tween manager
      if (prev) {
        scene.tweens.add({
          targets:    prev,
          volume:     0,
          duration:   FADE_OUT_MS,
          onComplete: () => { try { prev.stop(); prev.destroy(); } catch (_) {} },
        });
      }

      // Fade in new track
      _sound = scene.sound.add(key, { loop: true, volume: 0 });
      _sound.play();
      scene.tweens.add({
        targets:  _sound,
        volume:   _volume,
        duration: FADE_IN_MS,
      });
    },

    // ── Gracefully stop all music ─────────────────────────────
    stop(scene) {
      if (!_sound) return;
      const s   = _sound;
      _sound      = null;
      _currentKey = null;
      scene.tweens.add({
        targets:    s,
        volume:     0,
        duration:   FADE_OUT_MS,
        onComplete: () => { try { s.stop(); s.destroy(); } catch (_) {} },
      });
    },

    // ── Adjust master volume (0–1) ────────────────────────────
    setVolume(scene, v) {
      _volume = v;
      if (_sound) {
        scene.tweens.add({ targets: _sound, volume: v, duration: 300 });
      }
    },

    currentKey() { return _currentKey; },
  };
})();
