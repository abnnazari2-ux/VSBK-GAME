export type BallType = 'cue' | 'red' | 'yellow' | 'green' | 'brown' | 'blue' | 'pink' | 'black';
export type GamePhase = 'red' | 'color' | 'free_ball' | 'ended';
export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type GameMode = 'ranked' | 'casual' | 'practice' | 'custom';
export type TableTheme = 'classic' | 'blue' | 'red';
export type PlayerRank = 'Amateur' | 'Pro' | 'Expert' | 'Master' | 'Grand Master' | 'Legend';

export interface Ball {
  id: string;
  type: BallType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  potted: boolean;
  value: number;
  color: string;
  radius: number;
}

export interface Pocket {
  x: number;
  y: number;
  id: string;
  radius: number;
}

export interface Player {
  id: string;
  name: string;
  rank: PlayerRank;
  level: number;
  isHost: boolean;
  isReady: boolean;
  score: number;
  currentBreak: number;
  avatar?: string;
}

export interface RoomSettings {
  frames: number;
  shotTimer: number;
  tableTheme: TableTheme;
  stake: number;
  cueRestrictions: 'none' | 'one' | 'house';
  mode: GameMode;
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
  players: Player[];
  spectators: string[];
  settings: RoomSettings;
  gameState: GameState | null;
  chat: ChatMessage[];
  status: RoomStatus;
  createdAt: number;
}

export interface GameState {
  roomCode: string;
  players: string[];
  currentPlayer: string;
  scores: Record<string, number>;
  breaks: Record<string, number>;
  balls: Ball[];
  frame: number;
  totalFrames: number;
  frameScores: Record<string, number[]>;
  phase: GamePhase;
  lastPottedRed: boolean;
  fouls: Record<string, number>;
  status: 'active' | 'ended';
  winner?: string;
  timestamp: number;
}

export interface ShotParams {
  power: number;
  angle: number;
  spin: { x: number; y: number };
}

export interface MatchStats {
  potSuccess: number;
  safetySuccess: number;
  longestBreak: number;
  avgShotTime: number;
  fouls: number;
  accuracy: number;
  totalPoints: number;
}
