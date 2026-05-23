import { Ball, GamePhase } from '../types';
import { createBalls, TABLE } from './physics';

export interface EngineState {
  balls: Ball[];
  currentPlayer: 0 | 1;
  playerNames: [string, string];
  scores: [number, number];
  currentBreaks: [number, number];
  frameScores: [number[], number[]];
  phase: GamePhase;
  lastPottedRed: boolean;
  isAnimating: boolean;
  turnMessage: string;
  gameOver: boolean;
  winner?: 0 | 1;
  pottedThisTurn: Ball[];
  foul: boolean;
  foulMessage: string;
}

const COLOR_ORDER: Ball['type'][] = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];

const COLOR_SPOTS: Record<string, { x: number; y: number }> = {
  yellow: { x: TABLE.width * 0.25, y: TABLE.height / 2 + 73 },
  green:  { x: TABLE.width * 0.25, y: TABLE.height / 2 - 73 },
  brown:  { x: TABLE.width * 0.25, y: TABLE.height / 2 },
  blue:   { x: TABLE.width / 2,    y: TABLE.height / 2 },
  pink:   { x: 740,                 y: TABLE.height / 2 },
  black:  { x: TABLE.width - 180,  y: TABLE.height / 2 },
};

export function createEngineState(player1: string, player2: string): EngineState {
  return {
    balls: createBalls(),
    currentPlayer: 0,
    playerNames: [player1, player2],
    scores: [0, 0],
    currentBreaks: [0, 0],
    frameScores: [[], []],
    phase: 'red',
    lastPottedRed: false,
    isAnimating: false,
    turnMessage: `${player1}'s turn — pot a red`,
    gameOver: false,
    winner: undefined,
    pottedThisTurn: [],
    foul: false,
    foulMessage: '',
  };
}

function countReds(balls: Ball[]): number {
  return balls.filter(b => b.type === 'red' && !b.potted).length;
}

function highestPottedValue(pottedBalls: Ball[]): number {
  if (pottedBalls.length === 0) return 4;
  return Math.max(4, ...pottedBalls.map(b => b.value));
}

function respawnColor(balls: Ball[], colorType: string): void {
  const ball = balls.find(b => b.type === colorType);
  if (!ball) return;
  const spot = COLOR_SPOTS[colorType];
  if (!spot) return;
  const blocked = balls.some(b => !b.potted && b.id !== ball.id &&
    Math.sqrt((b.x - spot.x) ** 2 + (b.y - spot.y) ** 2) < b.radius + ball.radius + 1);
  if (!blocked) {
    ball.x = spot.x; ball.y = spot.y; ball.vx = 0; ball.vy = 0; ball.potted = false;
  } else {
    const offsets = [{ x: 0, y: -30 }, { x: 0, y: 30 }, { x: 30, y: 0 }, { x: -30, y: 0 }];
    for (const off of offsets) {
      const nx = spot.x + off.x, ny = spot.y + off.y;
      const still = balls.some(b => !b.potted && b.id !== ball.id &&
        Math.sqrt((b.x - nx) ** 2 + (b.y - ny) ** 2) < b.radius + ball.radius + 1);
      if (!still) { ball.x = nx; ball.y = ny; ball.vx = 0; ball.vy = 0; ball.potted = false; break; }
    }
  }
}

export function processShotResult(state: EngineState, pottedBalls: Ball[]): EngineState {
  const next: EngineState = {
    ...state,
    balls: state.balls.map(b => ({ ...b })),
    scores: [...state.scores] as [number, number],
    currentBreaks: [...state.currentBreaks] as [number, number],
    frameScores: [[...state.frameScores[0]], [...state.frameScores[1]]],
    pottedThisTurn: pottedBalls,
    foul: false,
    foulMessage: '',
  };

  const cp = next.currentPlayer;
  const op: 0 | 1 = cp === 0 ? 1 : 0;
  const isCuePotted = next.balls.find(b => b.type === 'cue')?.potted ?? false;

  if (isCuePotted) {
    const penalty = highestPottedValue(pottedBalls);
    next.foul = true;
    next.foulMessage = `Foul! In-off. +${penalty} to ${next.playerNames[op]}`;
    next.scores[op] += penalty;
    next.currentBreaks[cp] = 0;
    next.currentPlayer = op;
    next.phase = 'red';
    const cue = next.balls.find(b => b.type === 'cue');
    if (cue) { cue.potted = false; cue.x = TABLE.width * 0.25; cue.y = TABLE.height / 2; cue.vx = 0; cue.vy = 0; }
    next.turnMessage = `${next.playerNames[op]}'s turn — pot a red`;
    return checkGameOver(next);
  }

  if (next.phase === 'red') {
    const pottedReds = pottedBalls.filter(b => b.type === 'red');
    const pottedColors = pottedBalls.filter(b => COLOR_ORDER.includes(b.type));
    if (pottedReds.length > 0) {
      next.scores[cp] += pottedReds.reduce((s, b) => s + b.value, 0);
      next.currentBreaks[cp] += pottedReds.reduce((s, b) => s + b.value, 0);
      for (const b of pottedColors) respawnColor(next.balls, b.type);
      next.lastPottedRed = true;
      next.phase = 'color';
      next.turnMessage = `${next.playerNames[cp]}'s turn — pot a color`;
    } else if (pottedColors.length > 0) {
      const penalty = highestPottedValue(pottedColors);
      next.foul = true;
      next.foulMessage = `Foul! Wrong ball. +${penalty} to ${next.playerNames[op]}`;
      next.scores[op] += penalty;
      next.currentBreaks[cp] = 0;
      next.currentPlayer = op;
      for (const b of pottedColors) respawnColor(next.balls, b.type);
      next.turnMessage = `${next.playerNames[op]}'s turn — pot a red`;
    } else {
      next.currentBreaks[cp] = 0;
      next.currentPlayer = op;
      next.turnMessage = `${next.playerNames[op]}'s turn — pot a red`;
    }
    return checkGameOver(next);
  }

  if (next.phase === 'color') {
    const pottedColors = pottedBalls.filter(b => COLOR_ORDER.includes(b.type));
    const redsLeft = countReds(next.balls);

    if (pottedColors.length === 0) {
      // Missed — switch player; keep 'color' phase when no reds remain
      next.currentBreaks[cp] = 0;
      next.currentPlayer = op;
      if (redsLeft > 0) {
        next.phase = 'red';
        next.turnMessage = `${next.playerNames[op]}'s turn — pot a red`;
      } else {
        const remaining = COLOR_ORDER.filter(ct => { const b = next.balls.find(bl => bl.type === ct); return b && !b.potted; });
        next.phase = 'color';
        next.turnMessage = remaining.length > 0
          ? `${next.playerNames[op]}'s turn — pot the ${remaining[0]}`
          : `${next.playerNames[op]}'s turn`;
      }
    } else {
      const colorBall = pottedColors[0];
      if (redsLeft > 0) {
        next.scores[cp] += colorBall.value;
        next.currentBreaks[cp] += colorBall.value;
        respawnColor(next.balls, colorBall.type);
        next.lastPottedRed = false;
        next.phase = 'red';
        next.turnMessage = `${next.playerNames[cp]}'s turn — pot a red`;
      } else {
        next.scores[cp] += colorBall.value;
        next.currentBreaks[cp] += colorBall.value;
        const remaining = COLOR_ORDER.filter(ct => { const b = next.balls.find(bl => bl.type === ct); return b && !b.potted; });
        if (remaining.length > 0) {
          next.turnMessage = `${next.playerNames[cp]}'s turn — pot the ${remaining[0]}`;
        }
      }
    }
    return checkGameOver(next);
  }

  return checkGameOver(next);
}

export function checkGameOver(state: EngineState): EngineState {
  const next = { ...state };
  const redsLeft = next.balls.filter(b => b.type === 'red' && !b.potted).length;
  const colorsLeft = next.balls.filter(b => COLOR_ORDER.includes(b.type) && !b.potted).length;
  if (redsLeft === 0 && colorsLeft === 0) {
    next.gameOver = true;
    next.phase = 'ended';
    const [s0, s1] = next.scores;
    if (s0 > s1) { next.winner = 0; next.turnMessage = `${next.playerNames[0]} wins the frame!`; }
    else if (s1 > s0) { next.winner = 1; next.turnMessage = `${next.playerNames[1]} wins the frame!`; }
    else { next.turnMessage = 'Frame tied!'; }
    next.frameScores[0].push(next.scores[0]);
    next.frameScores[1].push(next.scores[1]);
  }
  return next;
}

export function resetCueBall(state: EngineState): EngineState {
  const next = { ...state, balls: state.balls.map(b => ({ ...b })) };
  const cue = next.balls.find(b => b.type === 'cue');
  if (cue && cue.potted) {
    cue.potted = false; cue.vx = 0; cue.vy = 0;
    cue.x = TABLE.width * 0.25; cue.y = TABLE.height / 2;
  }
  return next;
}
