// Minimal port of the 2D game's MusicManager. Reuses the original soundtrack,
// served from the same origin at /sisters-quest/assets/music/.
const TRACK = '/sisters-quest/assets/music/mystic.mp3'

let el: HTMLAudioElement | null = null
let enabled = true

export const music = {
  get enabled() {
    return enabled
  },
  start() {
    if (!el) {
      el = new Audio(TRACK)
      el.loop = true
      el.volume = 0.3
    }
    if (enabled) el.play().catch(() => {})
  },
  toggle(): boolean {
    enabled = !enabled
    if (!el) return enabled
    if (enabled) el.play().catch(() => {})
    else el.pause()
    return enabled
  },
}
