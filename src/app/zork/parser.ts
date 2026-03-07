import type { Direction, GameState, ItemId, OutputLine, ParseResult, RoomId } from './types';
import { BRIEFING_DOCS, ITEMS, ROOMS } from './world';

let counter = 0;
function uid(): string {
  return `p-${++counter}`;
}

function line(type: OutputLine['type'], text: string): OutputLine {
  return { id: uid(), type, text };
}

function narrative(text: string): OutputLine {
  return line('narrative', text);
}

function sys(text: string): OutputLine {
  return line('system', text);
}

function err(text: string): OutputLine {
  return line('error', text);
}

function ok(text: string): OutputLine {
  return line('success', text);
}

const DIRECTION_MAP: Record<string, Direction> = {
  n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down',
  north: 'north', south: 'south', east: 'east', west: 'west', up: 'up', down: 'down',
};

const UNKNOWN_RESPONSES = [
  "I don't understand the word \"%s.\" Perhaps try something simpler.",
  "The word \"%s\" is not in my vocabulary. This is not a reflection on either of us.",
  "\"%s\" is not a recognized command. Type HELP for a list of things that are.",
  "You attempt to \"%s.\" Nothing happens. The universe declines to engage.",
  "I know many words. \"%s\" is not among them.",
];

function unknownResponse(verb: string): string {
  const template = UNKNOWN_RESPONSES[Math.floor(Math.random() * UNKNOWN_RESPONSES.length)];
  return template.replace('%s', verb);
}

function describeRoom(roomId: RoomId, state: GameState): OutputLine[] {
  const room = ROOMS[roomId];
  const isVisited = state.visitedRooms.has(roomId);
  const desc = isVisited ? room.revisitDescription : room.description;
  const lines: OutputLine[] = [
    line('title', room.name),
    narrative(desc),
  ];

  const items = state.roomItems[roomId];
  if (items.length > 0) {
    const names = items.map((id) => ITEMS[id].shortName);
    if (names.length === 1) {
      lines.push(narrative(`There is ${names[0]} here.`));
    } else {
      const last = names.pop();
      lines.push(narrative(`There are ${names.join(', ')} and ${last} here.`));
    }
  }

  const exits = Object.keys(room.exits);
  if (exits.length > 0) {
    lines.push(sys(`Obvious exits: ${exits.join(', ')}.`));
  }

  return lines;
}

function handleMove(directionRaw: string, state: GameState): ParseResult {
  const direction = DIRECTION_MAP[directionRaw.toLowerCase()];
  if (!direction) {
    return { lines: [err(`"${directionRaw}" is not a direction I recognize.`)] };
  }

  const room = ROOMS[state.currentRoom];
  const exit = room.exits[direction];

  if (!exit) {
    const quips = [
      'You cannot go that way.',
      'A wall stands there, immovable and opinionated.',
      'There is no exit in that direction.',
      'That direction leads only to disappointment.',
    ];
    return { lines: [narrative(quips[Math.floor(Math.random() * quips.length)])] };
  }

  if (exit.requiresItem && !state.inventory.includes(exit.requiresItem)) {
    return { lines: [narrative(exit.lockedMessage ?? 'The way is blocked.')] };
  }

  if (exit.roomId === 'council') {
    const hasAll = BRIEFING_DOCS.every((doc) => state.inventory.includes(doc));
    if (!hasAll) {
      const missing = BRIEFING_DOCS.filter((doc) => !state.inventory.includes(doc));
      const missingNames = missing.map((id) => ITEMS[id].name).join(', ');
      return {
        lines: [
          narrative('The council chamber door is sealed with an authority that brooks no argument.'),
          sys(`Your briefing dossier is incomplete. You are still missing: ${missingNames}.`),
        ],
      };
    }
  }

  const newRoom = exit.roomId;
  const roomLines = describeRoom(newRoom, state);

  return {
    lines: [line('system', ''), ...roomLines],
    move: newRoom,
  };
}

function handleLook(state: GameState): ParseResult {
  return {
    lines: [line('system', ''), ...describeRoom(state.currentRoom, state)],
  };
}

function handleExamine(target: string, state: GameState): ParseResult {
  if (!target.trim()) {
    return { lines: [err('Examine what, exactly?')] };
  }

  const t = target.toLowerCase().trim();

  // Check inventory
  for (const id of state.inventory) {
    const item = ITEMS[id];
    if (item.name.toLowerCase().includes(t) || item.shortName.toLowerCase().includes(t) || id.includes(t)) {
      return { lines: [narrative(item.description)] };
    }
  }

  // Check room items
  const roomItems = state.roomItems[state.currentRoom];
  for (const id of roomItems) {
    const item = ITEMS[id];
    if (item.name.toLowerCase().includes(t) || item.shortName.toLowerCase().includes(t) || id.includes(t)) {
      return { lines: [narrative(item.description)] };
    }
  }

  // Check room fixtures
  const room = ROOMS[state.currentRoom];
  if (room.fixtures) {
    for (const [key, desc] of Object.entries(room.fixtures)) {
      if (key.includes(t) || t.includes(key)) {
        return { lines: [narrative(desc)] };
      }
    }
  }

  return {
    lines: [
      narrative(`You examine the ${t} carefully. It is the kind of thing that defies easy description. Or perhaps it simply isn't here.`),
    ],
  };
}

function handleTake(target: string, state: GameState): ParseResult {
  if (!target.trim()) {
    return { lines: [err('Take what?')] };
  }

  const t = target.toLowerCase().trim();
  const roomItems = state.roomItems[state.currentRoom];

  for (const id of roomItems) {
    const item = ITEMS[id];
    if (item.name.toLowerCase().includes(t) || item.shortName.toLowerCase().includes(t) || id.includes(t)) {
      if (!item.takeable) {
        return { lines: [narrative(`The ${item.name} is not something you can carry.`)] };
      }
      return {
        lines: [narrative(`Taken. The ${item.name} is now in your possession.`)],
        addToInventory: id,
        removeFromRoom: { room: state.currentRoom, item: id },
      };
    }
  }

  // Already in inventory?
  for (const id of state.inventory) {
    const item = ITEMS[id];
    if (item.name.toLowerCase().includes(t) || id.includes(t)) {
      return { lines: [narrative(`You are already carrying the ${item.name}.`)] };
    }
  }

  return { lines: [narrative(`There is no "${t}" here to take.`)] };
}

function handleDrop(target: string, state: GameState): ParseResult {
  if (!target.trim()) {
    return { lines: [err('Drop what?')] };
  }

  const t = target.toLowerCase().trim();

  for (const id of state.inventory) {
    const item = ITEMS[id];
    if (item.name.toLowerCase().includes(t) || id.includes(t)) {
      return {
        lines: [narrative(`You set down the ${item.name}.`)],
        removeFromInventory: id,
        addToRoom: { room: state.currentRoom, item: id },
      };
    }
  }

  return { lines: [narrative(`You are not carrying anything called "${t}".`)] };
}

function handleInventory(state: GameState): ParseResult {
  if (state.inventory.length === 0) {
    return { lines: [narrative('You are carrying nothing. This is either very zen or very bad.')] };
  }

  const itemLines = state.inventory.map((id) => sys(`  - ${ITEMS[id].name}`));
  return {
    lines: [
      narrative('You are carrying:'),
      ...itemLines,
    ],
  };
}

function handlePresent(target: string, state: GameState): ParseResult {
  if (state.currentRoom !== 'council') {
    return {
      lines: [narrative('There is no one here to present anything to. The council chamber awaits to the south — assuming you are ready.')],
    };
  }

  const hasAll = BRIEFING_DOCS.every((doc) => state.inventory.includes(doc));
  if (!hasAll) {
    const missing = BRIEFING_DOCS.filter((doc) => !state.inventory.includes(doc));
    const missingNames = missing.map((id) => ITEMS[id].name).join(', ');
    return {
      lines: [
        narrative('You step toward the podium. Something stops you.'),
        sys(`Your briefing dossier is incomplete. Still needed: ${missingNames}.`),
      ],
    };
  }

  // WIN
  return {
    lines: [
      line('system', ''),
      line('success', '*** YOU HAVE WON ***'),
      line('system', ''),
      narrative(
        'You approach the podium. The spotlight intensifies. You place your documents before the assembled council — the AI research paper, the prototype circuit board, the blockchain ledger key, the cybersecurity lecture notes, the AWS GovCloud certification.\n\nThe holographic dossier materializes above the chamber table, its pages cycling through fifteen years of innovation: the Intelligent Factory, the first enterprise blockchain, the GovCloud deployment, the UMGC lecture halls, the academic papers with their gold-ink margins.\n\nA voice — calm, authoritative, familiar — speaks from every corner of the room:\n\n"The briefing is complete."'
      ),
      line('system', ''),
      narrative('Somewhere in the distance, a Forbes Technology Council notification pings.'),
      line('system', ''),
      ok(`You have completed THE EXECUTIVE LABYRINTH.`),
      line('system', ''),
      sys('Type RESTART to play again.'),
    ],
    win: true,
  };
}

function handleScore(state: GameState): ParseResult {
  const collected = BRIEFING_DOCS.filter((d) => state.inventory.includes(d)).length;
  return {
    lines: [
      sys(`Turns taken: ${state.turns}`),
      sys(`Briefing documents collected: ${collected} of ${BRIEFING_DOCS.length}`),
    ],
  };
}

function handleHelp(): ParseResult {
  return {
    lines: [
      line('title', 'Available Commands'),
      sys('  LOOK / L               — Describe your surroundings'),
      sys('  GO [direction]         — Move (also: N, S, E, W, U, D)'),
      sys('  EXAMINE / X [thing]    — Examine an item or fixture'),
      sys('  TAKE / GET [item]      — Pick up an item'),
      sys('  DROP [item]            — Put down an item'),
      sys('  INVENTORY / I          — List carried items'),
      sys('  PRESENT [thing]        — Present something (useful at a podium)'),
      sys('  SCORE                  — Show your current progress'),
      sys('  RESTART                — Start over from the beginning'),
      sys('  QUIT / Q               — Exit the game'),
      sys(''),
      sys('  Directions: NORTH, SOUTH, EAST, WEST, UP, DOWN (or N,S,E,W,U,D)'),
    ],
  };
}

export function parseCommand(raw: string, state: GameState): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { lines: [narrative('I beg your pardon?')] };
  }

  if (state.isWon && trimmed.toLowerCase() !== 'restart') {
    return { lines: [sys('The game is over. Type RESTART to play again.')] };
  }

  const tokens = trimmed.toLowerCase().split(/\s+/);
  const verb = tokens[0];
  const rest = tokens.slice(1).join(' ');

  // Bare direction shortcuts
  if (DIRECTION_MAP[verb] && tokens.length === 1) {
    return handleMove(verb, state);
  }

  switch (verb) {
    case 'go':
    case 'move':
    case 'walk':
    case 'run':
      return handleMove(rest || '', state);

    case 'north': case 'south': case 'east': case 'west': case 'up': case 'down':
    case 'n': case 's': case 'e': case 'w': case 'u': case 'd':
      return handleMove(verb, state);

    case 'look':
    case 'l':
      return handleLook(state);

    case 'examine':
    case 'x':
    case 'inspect':
    case 'read':
    case 'describe':
      return handleExamine(rest, state);

    case 'take':
    case 'get':
    case 'grab':
    case 'pick':
      return handleTake(rest.replace(/^up\s*/, ''), state);

    case 'drop':
    case 'put':
    case 'leave':
      return handleDrop(rest.replace(/^down\s*/, ''), state);

    case 'inventory':
    case 'inv':
    case 'i':
      return handleInventory(state);

    case 'present':
    case 'submit':
    case 'use':
    case 'give':
    case 'show':
      return handlePresent(rest, state);

    case 'score':
    case 'status':
      return handleScore(state);

    case 'help':
    case '?':
      return handleHelp();

    case 'quit':
    case 'q':
    case 'exit':
      return {
        lines: [
          narrative('You step out of the labyrinth. The holographic displays flicker off one by one.'),
          sys('Type RESTART to begin again.'),
        ],
      };

    case 'restart':
      return { lines: [sys('Restarting...')] };

    case 'kill':
    case 'attack':
    case 'fight':
      return { lines: [narrative('You swing at the ambient uncertainty. It declines to engage. Violence is rarely the answer in enterprise architecture.')] };

    case 'say':
    case 'yell':
    case 'scream':
    case 'shout':
      return { lines: [narrative(`You ${verb}: "${rest || 'something'}" The words echo through the complex and return no wiser.`)] };

    case 'sit':
    case 'sleep':
    case 'rest':
      return { lines: [narrative('There is no time for that. The council chamber awaits.')] };

    case 'open':
    case 'unlock':
      return { lines: [narrative('You try to open it. It has opinions about this, and those opinions are negative.')] };

    case 'climb':
    case 'ascend':
    case 'descend':
      if (rest.includes('ladder') || rest.includes('up') || rest === '') {
        const dir = verb === 'descend' ? 'down' : 'up';
        return handleMove(dir, state);
      }
      return { lines: [narrative('You would need something to climb.')] };

    case 'wait':
    case 'z':
      return { lines: [narrative('Time passes. The server racks continue to blink. Nothing changes except your turn count.')] };

    default:
      return { lines: [narrative(unknownResponse(verb))] };
  }
}

export { describeRoom };
