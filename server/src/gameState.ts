export interface BallState {
  id: number;
  type: 'cue' | 'red' | 'yellow' | 'green' | 'brown' | 'blue' | 'pink' | 'black';
  x: number;
  y: number;
  vx: number;
  vy: number;
  potted: boolean;
  value: number;
}

export interface GameState {
  roomCode: string;
  players: string[];
  currentPlayer: string;
  scores: Record<string, number>;
  breaks: Record<string, number>;
  balls: BallState[];
  frame: number;
  totalFrames: number;
  frameScores: Record<string, number[]>;
  phase: 'red' | 'color' | 'free_ball';
  lastPottedRed: boolean;
  fouls: Record<string, number>;
  status: 'active' | 'ended';
  winner?: string;
  timestamp: number;
}

const TABLE_WIDTH = 1200;
const TABLE_HEIGHT = 600;
const BALL_RADIUS = 13;

export function createInitialBalls(): BallState[] {
  const balls: BallState[] = [];
  let id = 0;

  // Cue ball
  balls.push({ id: id++, type: 'cue', x: 300, y: TABLE_HEIGHT / 2, vx: 0, vy: 0, potted: false, value: 0 });

  // 15 reds in triangle
  const spacing = BALL_RADIUS * 2 + 2.5;
  const apexX = 792;
  const apexY = TABLE_HEIGHT / 2;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const x = apexX + row * spacing;
      const y = apexY - row * spacing / 2 + col * spacing;
      balls.push({ id: id++, type: 'red', x, y, vx: 0, vy: 0, potted: false, value: 1 });
    }
  }

  // Colors on their spots
  balls.push({ id: id++, type: 'yellow', x: TABLE_WIDTH * 0.25, y: TABLE_HEIGHT / 2 + 73, vx: 0, vy: 0, potted: false, value: 2 });
  balls.push({ id: id++, type: 'green',  x: TABLE_WIDTH * 0.25, y: TABLE_HEIGHT / 2 - 73, vx: 0, vy: 0, potted: false, value: 3 });
  balls.push({ id: id++, type: 'brown',  x: TABLE_WIDTH * 0.25, y: TABLE_HEIGHT / 2,      vx: 0, vy: 0, potted: false, value: 4 });
  balls.push({ id: id++, type: 'blue',   x: TABLE_WIDTH / 2,    y: TABLE_HEIGHT / 2,      vx: 0, vy: 0, potted: false, value: 5 });
  balls.push({ id: id++, type: 'pink',   x: 740,                y: TABLE_HEIGHT / 2,      vx: 0, vy: 0, potted: false, value: 6 });
  balls.push({ id: id++, type: 'black',  x: TABLE_WIDTH - 180,  y: TABLE_HEIGHT / 2,      vx: 0, vy: 0, potted: false, value: 7 });

  return balls;
}

export function createInitialGameState(
  roomCode: string,
  playerIds: string[],
  totalFrames: number
): GameState {
  const scores: Record<string, number> = {};
  const breaks: Record<string, number> = {};
  const frameScores: Record<string, number[]> = {};
  const fouls: Record<string, number> = {};

  for (const id of playerIds) {
    scores[id] = 0;
    breaks[id] = 0;
    frameScores[id] = [];
    fouls[id] = 0;
  }

  return {
    roomCode,
    players: [...playerIds],
    currentPlayer: playerIds[0],
    scores,
    breaks,
    balls: createInitialBalls(),
    frame: 1,
    totalFrames,
    frameScores,
    phase: 'red',
    lastPottedRed: false,
    fouls,
    status: 'active',
    winner: undefined,
    timestamp: Date.now(),
  };
}
