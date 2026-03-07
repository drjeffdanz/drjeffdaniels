import type { GameAction, GameState, ItemId, OutputLine, RoomId } from './types';
import { buildInitialState } from './initialState';
import { parseCommand } from './parser';

let counter = 0;
function uid(): string {
  return `r-${++counter}`;
}

function echoLine(text: string): OutputLine {
  return { id: uid(), type: 'command', text: `> ${text}` };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESTART':
      return buildInitialState();

    case 'PROCESS_COMMAND': {
      const raw = action.payload;
      const echo = echoLine(raw);

      if (raw.trim().toLowerCase() === 'restart') {
        return buildInitialState();
      }

      const result = parseCommand(raw, state);
      const newOutput: OutputLine[] = [...state.output, echo, ...result.lines];

      let next: GameState = {
        ...state,
        output: newOutput,
        turns: state.turns + 1,
        isWon: result.win ? true : state.isWon,
      };

      if (result.move) {
        const newRoom: RoomId = result.move;
        next = {
          ...next,
          currentRoom: newRoom,
          visitedRooms: new Set([...state.visitedRooms, newRoom]),
        };
      }

      if (result.addToInventory) {
        const id: ItemId = result.addToInventory;
        next = {
          ...next,
          inventory: [...next.inventory, id],
        };
      }

      if (result.removeFromInventory) {
        const id: ItemId = result.removeFromInventory;
        next = {
          ...next,
          inventory: next.inventory.filter((i) => i !== id),
        };
      }

      if (result.removeFromRoom) {
        const { room, item } = result.removeFromRoom;
        next = {
          ...next,
          roomItems: {
            ...next.roomItems,
            [room]: next.roomItems[room].filter((i) => i !== item),
          },
        };
      }

      if (result.addToRoom) {
        const { room, item } = result.addToRoom;
        next = {
          ...next,
          roomItems: {
            ...next.roomItems,
            [room]: [...next.roomItems[room], item],
          },
        };
      }

      return next;
    }

    default:
      return state;
  }
}
