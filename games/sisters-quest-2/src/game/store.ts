import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CasebookEntry, DialogueLine, SisterId, Verb } from './types'

interface GameStore {
  // Transient (not persisted)
  started: boolean
  verb: Verb
  dialogue: DialogueLine[] | null
  dialogueIndex: number
  hoverHotspot: string | null
  casebookOpen: boolean

  // Persisted
  activeSister: SisterId
  inventory: string[]
  flags: Record<string, boolean>
  casebook: CasebookEntry[]

  start: () => void
  swapSister: () => void
  setVerb: (verb: Verb) => void
  setHover: (name: string | null) => void
  showDialogue: (lines: DialogueLine[]) => void
  advanceDialogue: () => void
  addCasebook: (entry: CasebookEntry) => void
  toggleCasebook: () => void
  setFlag: (key: string, value?: boolean) => void
  hasFlag: (key: string) => boolean
  addItem: (key: string) => void
  hasItem: (key: string) => boolean
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      started: false,
      verb: 'look',
      dialogue: null,
      dialogueIndex: 0,
      hoverHotspot: null,
      casebookOpen: false,

      activeSister: 'mackenzie',
      inventory: [],
      flags: {},
      casebook: [],

      start: () => set({ started: true }),

      swapSister: () =>
        set((s) => ({
          activeSister: s.activeSister === 'mackenzie' ? 'cambrie' : 'mackenzie',
          // Insight is Mackenzie-only; drop back to look when she walks away from it
          verb: s.verb === 'insight' ? 'look' : s.verb,
        })),

      setVerb: (verb) => set({ verb }),
      setHover: (hoverHotspot) => set({ hoverHotspot }),

      showDialogue: (lines) =>
        set({ dialogue: lines, dialogueIndex: 0, casebookOpen: false }),

      advanceDialogue: () => {
        const { dialogue, dialogueIndex } = get()
        if (!dialogue) return
        if (dialogueIndex + 1 < dialogue.length) {
          set({ dialogueIndex: dialogueIndex + 1 })
        } else {
          set({ dialogue: null, dialogueIndex: 0 })
        }
      },

      addCasebook: (entry) =>
        set((s) =>
          s.casebook.some((e) => e.id === entry.id)
            ? s
            : { casebook: [...s.casebook, entry] },
        ),

      toggleCasebook: () => set((s) => ({ casebookOpen: !s.casebookOpen })),

      setFlag: (key, value = true) =>
        set((s) => ({ flags: { ...s.flags, [key]: value } })),
      hasFlag: (key) => !!get().flags[key],

      addItem: (key) =>
        set((s) =>
          s.inventory.includes(key) ? s : { inventory: [...s.inventory, key] },
        ),
      hasItem: (key) => get().inventory.includes(key),
    }),
    {
      name: 'sq2_v1_save',
      partialize: (s) => ({
        activeSister: s.activeSister,
        inventory: s.inventory,
        flags: s.flags,
        casebook: s.casebook,
      }),
    },
  ),
)
