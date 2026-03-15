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

  // Safe wrapper-based fadeout — avoids the Phaser tween bug where tweening a
  // sound object directly causes "Cannot set properties of null (setting 'volume')"
  // when the sound is destroyed and any sibling tween still holds a reference.
  function _fadeOutAndDestroy(scene, sound) {
    const wrapper = { vol: sound.volume > 0 ? sound.volume : _volume };
    scene.tweens.add({
      targets:    wrapper,
      vol:        0,
      duration:   FADE_OUT_MS,
      onUpdate:   () => { try { sound.volume = wrapper.vol; } catch (_) {} },
      onComplete: () => { try { sound.stop(); sound.destroy(); } catch (_) {} },
    });
  }

  return {

    // ── Play a track (no-op if already playing) ───────────────
    play(scene, key) {
      if (_currentKey === key) return;

      const prev    = _sound;
      _currentKey   = key;

      // Fade out old track via wrapper (never tween the sound directly)
      if (prev) {
        _fadeOutAndDestroy(scene, prev);
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
      _fadeOutAndDestroy(scene, s);
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
