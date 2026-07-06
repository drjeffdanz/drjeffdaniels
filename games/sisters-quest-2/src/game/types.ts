export type SisterId = 'mackenzie' | 'cambrie'

// 'insight' is Mackenzie's signature verb (examine-deeper); Cambrie's kit lives
// inside talk (Disarm) and use (Improvise) — see docs/sisters-quest-2-plan.md §4.1
export type Verb = 'look' | 'talk' | 'take' | 'use' | 'insight'

// VO-ready from day one: every line has a stable id; `audio` is filled in at M4.
export interface DialogueLine {
  id: string
  speaker: string
  text: string
  audio?: string
}

export interface CasebookEntry {
  id: string
  title: string
  text: string
}

export interface Response {
  lines: DialogueLine[]
  casebook?: CasebookEntry
  flag?: string
}

export type VerbResponses = Partial<
  Record<Verb, Partial<Record<SisterId | 'any', Response>>>
>

export interface HotspotDef {
  id: string
  name: string
  // Where the active sister walks to before interacting [x, z]
  interactPoint: [number, number]
  responses: VerbResponses
}

export interface Speaker {
  name: string
  portrait: string | null
  color: string
}

// Portraits are shared with the original 2D game on the same origin.
const P = '/sisters-quest/assets/portraits'

export const SPEAKERS: Record<string, Speaker> = {
  narrator: { name: '', portrait: null, color: '#9aa3b5' },
  mackenzie: { name: 'MACKENZIE', portrait: `${P}/mackenzie.jpg`, color: '#5a8f3a' },
  cambrie: { name: 'CAMBRIE', portrait: `${P}/cambrie.jpg`, color: '#c06a22' },
  queen: { name: 'QUEEN ELARA', portrait: `${P}/queen.jpg`, color: '#8a7ab8' },
}
