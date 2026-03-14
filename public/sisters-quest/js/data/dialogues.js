// ============================================================
// data/dialogues.js — Sisters' Quest: The Moonveil Crown
// All Act 1 dialogue sequences
// ============================================================

// Speaker portrait colors (placeholder art)
const PORTRAITS = {
  narrator:   { color: 0x1a1a1a, label: '—',  name: '' },
  mackenzie:  { color: 0x2d5016, label: 'M',  name: 'MACKENZIE' },
  cambrie:    { color: 0x7a3a0a, label: 'C',  name: 'CAMBRIE' },
  birdie:     { color: 0x8b6914, label: 'B',  name: 'CRAFTY BIRDIE' },
};

// ── Queen's Chamber ───────────────────────────────────────────

const DIALOGUE_QUEEN_EXAMINE = [
  {
    speaker: 'narrator',
    text: "Queen Elara lies impossibly still. The coverlet around her is unraveling — threads pulling free and dissolving into silver mist. Her breathing is shallow, almost imperceptible.",
  },
  {
    speaker: 'mackenzie',
    text: "She was fine yesterday. She was fine yesterday.",
  },
  {
    speaker: 'cambrie',
    text: "Look at the hem, Mac. The threads aren't breaking — they're unweaving. This is deliberate enchantment. Someone is unmaking her.",
  },
  {
    speaker: 'mackenzie',
    text: "Who would — ... Vessa.",
  },
  {
    speaker: 'cambrie',
    text: "You know this name?",
  },
  {
    speaker: 'mackenzie',
    text: "Mother mentioned her once. A weaver she'd wronged. Said it was her greatest regret.",
  },
];

const DIALOGUE_QUEEN_TALK = [
  {
    speaker: 'mackenzie',
    text: "Mother. We're going to fix this.",
  },
  {
    speaker: 'cambrie',
    text: "She doesn't answer. The silver mist curls around her like something living.",
  },
];

const DIALOGUE_TAPESTRY_FIRST = [
  {
    speaker: 'cambrie',
    text: "This tapestry is extraordinary — every village, road, and landmark embroidered with perfect precision.",
  },
  {
    speaker: 'cambrie',
    text: "In the lower corner, almost too small to read: 'Woven by Vessa, Year of the Silver Moon.'",
  },
  {
    speaker: 'cambrie',
    text: "Below that, someone has scratched through the name in ink. Not the weaver. Someone else. Someone wanted her name gone.",
  },
];

const DIALOGUE_TAPESTRY_REPEAT = [
  {
    speaker: 'narrator',
    text: "The tapestry of Elderwyn, woven by Vessa. Her name scratched out by someone else's hand.",
  },
];

const DIALOGUE_TEA = [
  {
    speaker: 'cambrie',
    text: "The tea is cold. At the bottom of the cup, silver sediment has settled — not tea leaves.",
  },
  {
    speaker: 'cambrie',
    text: "Thread. The curse was delivered in her tea. Someone was here, close enough to sit with her.",
  },
  {
    speaker: 'mackenzie',
    text: "That's not unsettling at all.",
  },
];

const DIALOGUE_LETTER_LOOK = [
  {
    speaker: 'cambrie',
    text: "A letter sealed with red wax, addressed in Mother's handwriting: 'To be opened if I cannot speak for myself.'",
  },
  {
    speaker: 'mackenzie',
    text: "Take it.",
  },
];

const DIALOGUE_LETTER_TAKE = [
  {
    speaker: 'narrator',
    text: "Cambrie tucks the letter carefully into her journal. They will not open it yet. Somehow, opening it would make all of this too real.",
  },
];

const DIALOGUE_BOOK_LOOK = [
  {
    speaker: 'cambrie',
    text: "A collection of old ballads. One page is dog-eared.",
  },
  {
    speaker: 'cambrie',
    text: "'The Ballad of the Forgotten Maker.' She reads the first verse quietly: 'She wove the world its finest thing / And gave it freely to the king / The king gave thanks and locked it tight / And never spoke her name that night...'",
  },
  {
    speaker: 'cambrie',
    text: "Mother knew. She always knew she'd wronged her.",
  },
];

const DIALOGUE_BOOK_TAKE = [
  {
    speaker: 'narrator',
    text: "Cambrie takes the book. She will read all of it before this is over.",
  },
];

// ── Crafty Birdie Cutscene ────────────────────────────────────

const DIALOGUE_BIRDIE_ENTRANCE = [
  {
    speaker: 'narrator',
    text: "Crafty Birdie bursts through the door in a flurry of layered robes, nearly dropping her candelabra.",
  },
  {
    speaker: 'birdie',
    text: "Your Highnesses! The royal physician says — well, he says a great many things, most of them quite alarming — the summary, the summary is —",
  },
  {
    speaker: 'birdie',
    text: "Seven days. Possibly six. He's not certain about Thursdays. He never is, frankly, it's a Thursday problem —",
  },
  {
    speaker: 'cambrie',
    text: "Gone? You mean —",
  },
  {
    speaker: 'birdie',
    text: "Unraveled. Completely. Like a poorly-made sock, he said. I told him that was a terrible thing to say about a queen but he is a physician and not a diplomat so —",
  },
  {
    speaker: 'birdie',
    text: "Seven days, Your Highnesses. Seven.",
  },
  {
    speaker: 'mackenzie',
    text: "We find Vessa. We fix this.",
  },
  {
    speaker: 'cambrie',
    text: "We don't even know where she is.",
  },
  {
    speaker: 'mackenzie',
    text: "Then we start with what we know. The library.",
  },
  {
    speaker: 'birdie',
    text: "Oh, the library! Yes, yes — though I should mention the west wing has had a moth situation since — actually now is not the time for moths. Go. Go quickly!",
  },
];

const DIALOGUE_BIRDIE_REPEAT = [
  {
    speaker: 'birdie',
    text: "Seven days, Your Highnesses! The moth situation in the west wing is also worth mentioning, but — priorities! Go!",
  },
];

// ── Palace Library ─────────────────────────────────────────────

const DIALOGUE_LIBRARY_ENTER = [
  {
    speaker: 'narrator',
    text: "The palace library smells of dust and old decisions. Mackenzie paces. Cambrie pulls out every book on weavers, curses, and moonveil thread she can find.",
  },
  {
    speaker: 'mackenzie',
    text: "How many books do you need?",
  },
  {
    speaker: 'cambrie',
    text: "All of them, ideally. But three will do. Look for anything on magical fibers, curse-breaking, and — weaver records. There should be an atlas.",
  },
];

const DIALOGUE_FIBERS_FOUND = [
  {
    speaker: 'cambrie',
    text: "'Magical Fibers of the Known World.' This is exactly what I needed.",
  },
  {
    speaker: 'cambrie',
    text: "Moonveil thread. Found only in the Sunken Garden — a place that's been underwater for three hundred years. Perfect.",
  },
  {
    speaker: 'mackenzie',
    text: "Underwater.",
  },
  {
    speaker: 'cambrie',
    text: "Partially underwater. The garden itself is above the tide line. Mostly.",
  },
];

const DIALOGUE_CURSES_FOUND = [
  {
    speaker: 'cambrie',
    text: "'Curses of the Seventh Kind.' This is grim reading.",
  },
  {
    speaker: 'cambrie',
    text: "Here. 'An Unraveling curse can only be undone by restoring what was taken — not destroyed, but returned to its maker.'",
  },
  {
    speaker: 'mackenzie',
    text: "We have to give back the Crown.",
  },
  {
    speaker: 'cambrie',
    text: "We have to find it first. It was split into three components and scattered.",
  },
  {
    speaker: 'mackenzie',
    text: "Of course it was.",
  },
];

const DIALOGUE_ATLAS_FOUND = [
  {
    speaker: 'cambrie',
    text: "The Weaver's Atlas. Someone has written in the margin — 'Vessa's Tower — Obsidian Isle.' And there's a route sketched in faded ink.",
  },
  {
    speaker: 'cambrie',
    text: "The route goes through the Thornwood, the Caves, the Sunken Garden, and across two sea passages. Mac... this will take all seven days.",
  },
  {
    speaker: 'mackenzie',
    text: "Then we leave now.",
  },
  {
    speaker: 'cambrie',
    text: "We should make a list —",
  },
  {
    speaker: 'mackenzie',
    text: "We should leave now.",
  },
  {
    speaker: 'cambrie',
    text: "I'm making a list while walking! That's a thing I can do!",
  },
];

const DIALOGUE_MACKENZIE_PACE = [
  {
    speaker: 'mackenzie',
    text: "How many books can one person need to read before they know enough to actually do something.",
  },
  {
    speaker: 'cambrie',
    text: "That's not a question, that's a complaint.",
  },
  {
    speaker: 'mackenzie',
    text: "I'm multitasking.",
  },
];

const DIALOGUE_EXIT_BLOCKED = [
  {
    speaker: 'cambrie',
    text: "Not yet. There are three books we need from this library. If we leave without them we'll be walking into this blind.",
  },
  {
    speaker: 'mackenzie',
    text: "Fine. But quickly.",
  },
];

const DIALOGUE_ACT1_COMPLETE = [
  {
    speaker: 'narrator',
    text: "The sisters leave the palace at dawn, packs over their shoulders and Cambrie's journal already open.",
  },
  {
    speaker: 'mackenzie',
    text: "Thornwood first. Then the coast. Six days left.",
  },
  {
    speaker: 'cambrie',
    text: "Five and a half. I'm rounding.",
  },
  {
    speaker: 'mackenzie',
    text: "That's somehow worse.",
  },
];
