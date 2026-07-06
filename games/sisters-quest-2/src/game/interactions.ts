import { HOTSPOT_MAP } from './data/hotspots'
import { useGame } from './store'
import type { DialogueLine, SisterId, Verb } from './types'

// Per-sister fallback lines for verb/hotspot combos with no authored response.
// Even the fallbacks carry the sisters' voices.
const FALLBACKS: Record<Verb, Record<SisterId, string[]>> = {
  look: {
    mackenzie: [
      'Noted. Not relevant. Moving on.',
      'Nothing there helps us tonight.',
    ],
    cambrie: [
      "It's doing a wonderful job of being furniture.",
      'Riveting. Truly. A collector would weep.',
    ],
  },
  talk: {
    mackenzie: ['I only interrogate things that can answer.'],
    cambrie: ['We chatted earlier. It was a one-sided conversation, but a polite one.'],
  },
  take: {
    mackenzie: ['No. We are guests in this room. Sort of.'],
    cambrie: ['I have standards. Low ones, but standards.'],
  },
  use: {
    mackenzie: ['That does nothing useful. I checked before you asked.'],
    cambrie: ['I tried using it. It declined. Strong personality.'],
  },
  insight: {
    mackenzie: [
      'I see it clearly: it is exactly what it looks like. Disappointing, honestly.',
    ],
    cambrie: [], // Insight is Mackenzie-only; the UI never offers it to Cambrie
  },
}

let fallbackCounter = 0

function fallbackLines(verb: Verb, sister: SisterId): DialogueLine[] {
  const pool = FALLBACKS[verb][sister]
  const text = pool[fallbackCounter++ % pool.length] ?? '...'
  return [{ id: `fallback.${verb}.${sister}`, speaker: sister, text }]
}

// The demo's tiny bit of progression: once Mackenzie has used Insight on both
// the beam and the tapestry, the sisters put it together and the demo bows out.
const M0_FINALE: DialogueLine[] = [
  {
    id: 'p.finale.1',
    speaker: 'mackenzie',
    text: 'An invisible something bending the moonlight, and a thread pointing at the Mirrored Mere. Those two facts belong to the same sentence.',
  },
  {
    id: 'p.finale.2',
    speaker: 'cambrie',
    text: 'Then the sentence ends with us walking to a haunted lake in the middle of the night. I already hate how excited you look.',
  },
  {
    id: 'p.finale.3',
    speaker: 'mackenzie',
    text: 'Pack light. We leave before Mother wakes.',
  },
  {
    id: 'p.finale.4',
    speaker: 'narrator',
    text: '— End of the M0 tech demo. The investigation continues in Milestone 1. —',
  },
]

export function runInteraction(hotspotId: string, verb: Verb) {
  const hotspot = HOTSPOT_MAP[hotspotId]
  if (!hotspot) return
  const state = useGame.getState()
  const sister = state.activeSister

  const byVerb = hotspot.responses[verb]
  const response = byVerb?.[sister] ?? byVerb?.any

  if (!response) {
    state.showDialogue(fallbackLines(verb, sister))
    return
  }

  if (response.casebook) state.addCasebook(response.casebook)
  if (response.flag) state.setFlag(response.flag)

  const after = useGame.getState()
  const bothInsights =
    after.flags['insight_beam'] &&
    after.flags['insight_tapestry'] &&
    !after.flags['m0_complete']

  if (bothInsights) {
    after.setFlag('m0_complete')
    state.showDialogue([...response.lines, ...M0_FINALE])
  } else {
    state.showDialogue(response.lines)
  }
}
