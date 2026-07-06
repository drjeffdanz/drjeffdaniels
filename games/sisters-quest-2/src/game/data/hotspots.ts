import type { DialogueLine, HotspotDef } from '../types'

// Shorthand for authoring lines. Ids are stable and never renumbered —
// they become the keys of the VO manifest at M4.
const L = (id: string, speaker: string, text: string): DialogueLine => ({
  id,
  speaker,
  text,
})

// ────────────────────────────────────────────────────────────────────
// M0 tech-demo content: the Queen's Chamber on the night the first
// moonbeam goes crooked. One Mackenzie Insight chain, plenty of
// Cambrie dry wit, two casebook entries.
// ────────────────────────────────────────────────────────────────────

export const HOTSPOTS: HotspotDef[] = [
  {
    id: 'queen',
    name: 'Queen Elara',
    interactPoint: [-2.2, -0.9],
    responses: {
      look: {
        mackenzie: {
          lines: [
            L(
              'p.queen.look.mac.1',
              'mackenzie',
              'Mother sleeps soundly. After everything with the Crown, she has earned a few quiet years of it.',
            ),
            L(
              'p.queen.look.mac.2',
              'mackenzie',
              'The moonlight used to fall across her pillow. Tonight it falls three feet to the left. That is not nothing.',
            ),
          ],
        },
        cambrie: {
          lines: [
            L(
              'p.queen.look.cam.1',
              'cambrie',
              'Asleep. The most powerful woman in Elderwyn, defeated nightly by a warm blanket.',
            ),
          ],
        },
      },
      talk: {
        mackenzie: {
          lines: [
            L(
              'p.queen.talk.mac.1',
              'mackenzie',
              "Not yet. We wake her when we have answers, not questions.",
            ),
          ],
        },
        cambrie: {
          lines: [
            L(
              'p.queen.talk.cam.1',
              'cambrie',
              'Tempting. But waking a queen to report faulty moonlight feels like a job for two sisters. ...Oh. Right.',
            ),
            L(
              'p.queen.talk.cam.2',
              'cambrie',
              "Still no. If she wakes up, this becomes a royal inquiry. If she doesn't, it stays our adventure.",
            ),
          ],
        },
      },
      take: {
        any: {
          lines: [
            L(
              'p.queen.take.any.1',
              'narrator',
              'She is your mother and a reigning monarch. No.',
            ),
          ],
        },
      },
    },
  },

  {
    id: 'moonbeam',
    name: 'Crooked Moonbeam',
    interactPoint: [0.6, 0.2],
    responses: {
      look: {
        mackenzie: {
          lines: [
            L(
              'p.beam.look.mac.1',
              'mackenzie',
              'Moonlight comes through the window... and bends. Light does not bend.',
            ),
            L(
              'p.beam.look.mac.2',
              'mackenzie',
              'Light is not *permitted* to bend. I intend to find out who gave it permission.',
            ),
          ],
        },
        cambrie: {
          lines: [
            L(
              'p.beam.look.cam.1',
              'cambrie',
              'The beam lands three feet left of where the moon actually is. So either the moon is wrong or the floor moved.',
            ),
            L(
              'p.beam.look.cam.2',
              'cambrie',
              'I trust the floor. The floor has never lied to me.',
            ),
          ],
        },
      },
      insight: {
        mackenzie: {
          lines: [
            L(
              'p.beam.insight.mac.1',
              'mackenzie',
              'Trace it back. The beam enters the window true — angle matches the moon exactly.',
            ),
            L(
              'p.beam.insight.mac.2',
              'mackenzie',
              'Then, an arm-span inside the room, it kinks. One clean bend, sharp as a folded letter. Mid-air.',
            ),
            L(
              'p.beam.insight.mac.3',
              'mackenzie',
              'Something is standing in that spot. Something none of us can see.',
            ),
            L(
              'p.beam.insight.note',
              'narrator',
              '— New casebook entry: The Bend —',
            ),
          ],
          casebook: {
            id: 'cb.bend',
            title: 'The Bend',
            text: 'The moonbeam enters the window true, then kinks sharply mid-air, an arm-span into the room. Light bends around *something* — something invisible, standing exactly there.',
          },
          flag: 'insight_beam',
        },
      },
      take: {
        mackenzie: {
          lines: [
            L('p.beam.take.mac.1', 'mackenzie', 'You cannot take light.'),
            L('p.beam.take.mac.2', 'mackenzie', '...I checked. Twice.'),
          ],
        },
        cambrie: {
          lines: [
            L(
              'p.beam.take.cam.1',
              'cambrie',
              'I tried to pocket a moonbeam when I was six. Results were inconclusive.',
            ),
          ],
        },
      },
      talk: {
        cambrie: {
          lines: [
            L('p.beam.talk.cam.1', 'cambrie', "Hello, beam. You're drunk. Go home."),
            L(
              'p.beam.talk.cam.2',
              'narrator',
              'The moonbeam does not respond. It does, however, seem faintly embarrassed.',
            ),
          ],
          flag: 'quip_beam',
        },
        mackenzie: {
          lines: [
            L(
              'p.beam.talk.mac.1',
              'mackenzie',
              'It is a beam of light, Cambrie. ...Why am I explaining this to myself.',
            ),
          ],
        },
      },
    },
  },

  {
    id: 'tapestry',
    name: 'Tapestry of Elderwyn',
    interactPoint: [-0.6, -0.9],
    responses: {
      look: {
        mackenzie: {
          lines: [
            L(
              'p.tap.look.mac.1',
              'mackenzie',
              "Mother's tapestry — every village and road in Elderwyn, in thread. It survived the Unweaving. Barely.",
            ),
            L(
              'p.tap.look.mac.2',
              'mackenzie',
              'Wait. The embroidered moon over Cresthollow — a thread has pulled loose. That was not loose yesterday.',
            ),
          ],
        },
        cambrie: {
          lines: [
            L(
              'p.tap.look.cam.1',
              'cambrie',
              'Every village in Elderwyn, in thread. Someone had either a lot of patience or a very boring winter.',
            ),
          ],
        },
      },
      insight: {
        mackenzie: {
          lines: [
            L(
              'p.tap.insight.mac.1',
              'mackenzie',
              'The loose thread hangs from the embroidered moon — and it points. Down and left.',
            ),
            L(
              'p.tap.insight.mac.2',
              'mackenzie',
              'Down and left of the moon over Cresthollow is the Mirrored Mere. The thread points at the water.',
            ),
            L(
              'p.tap.insight.note',
              'narrator',
              '— New casebook entry: The Loose Thread —',
            ),
          ],
          casebook: {
            id: 'cb.thread',
            title: 'The Loose Thread',
            text: "A thread has pulled loose from the tapestry's embroidered moon — on the same night the real moonlight bent. It hangs pointing toward the Mirrored Mere.",
          },
          flag: 'insight_tapestry',
        },
      },
      take: {
        cambrie: {
          lines: [
            L(
              'p.tap.take.cam.1',
              'cambrie',
              "Steal Mother's tapestry. Off the wall. Of her bedroom. While she sleeps under it. Bold plan, no notes.",
            ),
          ],
        },
        mackenzie: {
          lines: [
            L('p.tap.take.mac.1', 'mackenzie', 'It stays. It has been through enough.'),
          ],
        },
      },
    },
  },

  {
    id: 'window',
    name: 'Tall Window',
    interactPoint: [2.2, -0.7],
    responses: {
      look: {
        mackenzie: {
          lines: [
            L(
              'p.win.look.mac.1',
              'mackenzie',
              'The moon is full, high, and exactly where the almanac says it should be. The moon is not the problem.',
            ),
          ],
        },
        cambrie: {
          lines: [
            L(
              'p.win.look.cam.1',
              'cambrie',
              'Full moon, clear sky, and a beam of light behaving like it owes someone money. Lovely night.',
            ),
          ],
        },
      },
    },
  },

  {
    id: 'door',
    name: 'Chamber Door',
    interactPoint: [4.0, 2.0],
    responses: {
      use: {
        any: {
          lines: [
            L(
              'p.door.use.any.1',
              'narrator',
              'The courtyard beyond is being built. The door will open in the next milestone.',
            ),
          ],
        },
      },
      look: {
        mackenzie: {
          lines: [
            L(
              'p.door.look.mac.1',
              'mackenzie',
              'The corridor to the moonlit courtyard. If the beam bends in here, I want to see what it does out there.',
            ),
          ],
        },
        cambrie: {
          lines: [
            L(
              'p.door.look.cam.1',
              'cambrie',
              "A door. Sturdy oak, iron hinges, moderate ambition. It dreams of one day being a drawbridge.",
            ),
          ],
        },
      },
    },
  },
]

export const HOTSPOT_MAP: Record<string, HotspotDef> = Object.fromEntries(
  HOTSPOTS.map((h) => [h.id, h]),
)
