import type { GameState, ItemId, OutputLine, RoomId } from './types';
import { ROOMS } from './world';

let lineCounter = 0;
function uid(): string {
  return `line-${++lineCounter}`;
}

function line(type: OutputLine['type'], text: string): OutputLine {
  return { id: uid(), type, text };
}

const OPENING_LINES: OutputLine[] = [
  line('title', 'EXECUTIVE LABYRINTH'),
  line('title', 'An Interactive Career Adventure'),
  line('system', 'Copyright 2024 Dr. Jeff Daniels — All Rights Reserved'),
  line('system', ''),
  line('system', 'Type HELP for a list of commands.'),
  line('system', 'Type LOOK to examine your surroundings.'),
  line('system', ''),
  line('system', '─'.repeat(50)),
  line('system', ''),
  line('title', 'Digital Antechamber'),
  line('narrative', ROOMS['antechamber'].description),
];

export function buildInitialState(): GameState {
  const roomItems = {} as Record<RoomId, ItemId[]>;
  for (const room of Object.values(ROOMS)) {
    roomItems[room.id] = [...room.initialItems];
  }

  return {
    currentRoom: 'antechamber',
    inventory: [],
    roomItems,
    visitedRooms: new Set<RoomId>(['antechamber']),
    output: OPENING_LINES,
    isWon: false,
    turns: 0,
  };
}
