export interface Player {
  id: string;
  name: string;
  rank: string;
  level: number;
  isHost: boolean;
  isReady: boolean;
  score: number;
  currentBreak: number;
  avatar?: string;
}

export interface RoomSettings {
  frames: 3 | 5 | 7;
  shotTimer: 0 | 20 | 30 | 45;
  tableTheme: 'classic' | 'blue' | 'red';
  stake: 0 | 100 | 500 | 1000;
  cueRestrictions: 'none' | 'one' | 'house';
  mode: 'ranked' | 'casual' | 'practice' | 'custom';
}

export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

export interface Room {
  code: string;
  name: string;
  isPrivate: boolean;
  password?: string;
  region: string;
  host: string;
  players: Map<string, Player>;
  spectators: Set<string>;
  settings: RoomSettings;
  gameState: any;
  chat: ChatMessage[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
}

export interface SerializedRoom {
  code: string;
  name: string;
  isPrivate: boolean;
  region: string;
  host: string;
  players: Player[];
  spectators: string[];
  settings: RoomSettings;
  gameState: any;
  chat: ChatMessage[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
}

export const rooms = new Map<string, Room>();

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(): string {
  const randomSegment = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
  };

  let code: string;
  let attempts = 0;
  do {
    const part1 = randomSegment(4);
    const part2 = Math.floor(1000 + Math.random() * 9000).toString();
    code = `${part1}-${part2}`;
    attempts++;
    if (attempts > 100) throw new Error('Could not generate unique room code');
  } while (rooms.has(code));

  return code;
}

export function createRoom(partial: {
  name: string;
  isPrivate: boolean;
  password?: string;
  region: string;
  hostId: string;
  settings?: Partial<RoomSettings>;
}): Room {
  const code = generateRoomCode();

  const defaultSettings: RoomSettings = {
    frames: 3,
    shotTimer: 30,
    tableTheme: 'classic',
    stake: 0,
    cueRestrictions: 'none',
    mode: 'casual',
  };

  const room: Room = {
    code,
    name: partial.name,
    isPrivate: partial.isPrivate,
    password: partial.password,
    region: partial.region,
    host: partial.hostId,
    players: new Map<string, Player>(),
    spectators: new Set<string>(),
    settings: { ...defaultSettings, ...(partial.settings || {}) },
    gameState: null,
    chat: [],
    status: 'waiting',
    createdAt: Date.now(),
  };

  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function getAllPublicRooms(): Room[] {
  const publicRooms: Room[] = [];
  for (const room of rooms.values()) {
    if (!room.isPrivate) publicRooms.push(room);
  }
  return publicRooms;
}

export function deleteRoom(code: string): void {
  rooms.delete(code);
}

export function getRoomSerialized(room: Room): SerializedRoom {
  const players: Player[] = [];
  for (const player of room.players.values()) {
    players.push({ ...player });
  }
  return {
    code: room.code,
    name: room.name,
    isPrivate: room.isPrivate,
    region: room.region,
    host: room.host,
    players,
    spectators: Array.from(room.spectators),
    settings: { ...room.settings },
    gameState: room.gameState,
    chat: [...room.chat],
    status: room.status,
    createdAt: room.createdAt,
  };
}
