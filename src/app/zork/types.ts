export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

export type RoomId =
  | 'antechamber'
  | 'cloud_ops'
  | 'quantum_lab'
  | 'blockchain_vault'
  | 'bunker'
  | 'hangar'
  | 'faculty'
  | 'archive'
  | 'council'
  | 'server_vault';

export type ItemId =
  | 'ai_paper'
  | 'circuit_board'
  | 'blockchain_key'
  | 'lecture_notes'
  | 'cloud_cert'
  | 'keycard';

export interface Exit {
  roomId: RoomId;
  requiresItem?: ItemId;
  lockedMessage?: string;
}

export interface Item {
  id: ItemId;
  name: string;
  shortName: string;
  description: string;
  isBriefingDoc: boolean;
  takeable: boolean;
}

export interface Room {
  id: RoomId;
  name: string;
  description: string;
  revisitDescription: string;
  exits: Partial<Record<Direction, Exit>>;
  initialItems: ItemId[];
  fixtures?: Record<string, string>;
}

export type OutputLineType =
  | 'title'
  | 'command'
  | 'narrative'
  | 'system'
  | 'error'
  | 'success';

export interface OutputLine {
  id: string;
  type: OutputLineType;
  text: string;
}

export interface GameState {
  currentRoom: RoomId;
  inventory: ItemId[];
  roomItems: Record<RoomId, ItemId[]>;
  visitedRooms: Set<RoomId>;
  output: OutputLine[];
  isWon: boolean;
  turns: number;
}

export interface ParseResult {
  lines: OutputLine[];
  move?: RoomId;
  addToInventory?: ItemId;
  removeFromInventory?: ItemId;
  addToRoom?: { room: RoomId; item: ItemId };
  removeFromRoom?: { room: RoomId; item: ItemId };
  win?: boolean;
}

export type GameAction =
  | { type: 'PROCESS_COMMAND'; payload: string }
  | { type: 'RESTART' };
