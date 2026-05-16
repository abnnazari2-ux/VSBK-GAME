import { Ball, Pocket } from '../types';

export const TABLE = {
  width: 1200,
  height: 600,
  cushion: 38,
  pocketRadius: 26,
  ballRadius: 13,
  friction: 0.987,
  cushionRestitution: 0.72,
};

export const POCKETS: Pocket[] = [
  { x: TABLE.cushion - 4,                      y: TABLE.cushion - 4,                       id: 'tl', radius: TABLE.pocketRadius },
  { x: TABLE.width / 2,                         y: TABLE.cushion / 2 - 4,                   id: 'tm', radius: TABLE.pocketRadius - 4 },
  { x: TABLE.width - TABLE.cushion + 4,         y: TABLE.cushion - 4,                       id: 'tr', radius: TABLE.pocketRadius },
  { x: TABLE.cushion - 4,                      y: TABLE.height - TABLE.cushion + 4,         id: 'bl', radius: TABLE.pocketRadius },
  { x: TABLE.width / 2,                         y: TABLE.height - TABLE.cushion / 2 + 4,    id: 'bm', radius: TABLE.pocketRadius - 4 },
  { x: TABLE.width - TABLE.cushion + 4,         y: TABLE.height - TABLE.cushion + 4,        id: 'br', radius: TABLE.pocketRadius },
];

const BALL_COLORS: Record<string, string> = {
  cue:    '#f5f5f0',
  red:    '#cc2222',
  yellow: '#f0d000',
  green:  '#22aa44',
  brown:  '#8b5a2b',
  blue:   '#1144cc',
  pink:   '#dd77aa',
  black:  '#111111',
};

const BALL_VALUES: Record<string, number> = {
  cue: 0, red: 1, yellow: 2, green: 3, brown: 4, blue: 5, pink: 6, black: 7,
};

const COLOR_SPOTS: Record<string, { x: number; y: number }> = {
  yellow: { x: TABLE.width * 0.25, y: TABLE.height / 2 + 73 },
  green:  { x: TABLE.width * 0.25, y: TABLE.height / 2 - 73 },
  brown:  { x: TABLE.width * 0.25, y: TABLE.height / 2 },
  blue:   { x: TABLE.width / 2,    y: TABLE.height / 2 },
  pink:   { x: 740,                 y: TABLE.height / 2 },
  black:  { x: TABLE.width - 180,  y: TABLE.height / 2 },
};

function makeBall(id: string, type: string, x: number, y: number): Ball {
  return {
    id, type: type as Ball['type'], x, y, vx: 0, vy: 0, potted: false,
    value: BALL_VALUES[type] ?? 0,
    color: BALL_COLORS[type] ?? '#ffffff',
    radius: TABLE.ballRadius,
  };
}

export function createBalls(): Ball[] {
  const balls: Ball[] = [];

  balls.push(makeBall('cue', 'cue', 300, TABLE.height / 2));

  const spacing = TABLE.ballRadius * 2 + 2.5;
  const apexX = 792;
  const apexY = TABLE.height / 2;
  let redIndex = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const x = apexX + row * spacing;
      const y = apexY - row * spacing / 2 + col * spacing;
      balls.push(makeBall(`red_${redIndex}`, 'red', x, y));
      redIndex++;
    }
  }

  const colorTypes = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];
  for (const type of colorTypes) {
    const spot = COLOR_SPOTS[type];
    balls.push(makeBall(type, type, spot.x, spot.y));
  }

  return balls;
}

function resolveCollision(a: Ball, b: Ball): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = a.radius + b.radius;

  if (dist < minDist && dist > 0) {
    const overlap = (minDist - dist) / 2;
    const nx = dx / dist;
    const ny = dy / dist;
    a.x -= nx * overlap;
    a.y -= ny * overlap;
    b.x += nx * overlap;
    b.y += ny * overlap;
    const dvx = b.vx - a.vx;
    const dvy = b.vy - a.vy;
    const dot = dvx * nx + dvy * ny;
    if (dot < 0) {
      a.vx += dot * nx;
      a.vy += dot * ny;
      b.vx -= dot * nx;
      b.vy -= dot * ny;
    }
  }
}

function checkPocket(ball: Ball): boolean {
  for (const pocket of POCKETS) {
    const dx = ball.x - pocket.x;
    const dy = ball.y - pocket.y;
    if (Math.sqrt(dx * dx + dy * dy) < pocket.radius) return true;
  }
  return false;
}

const LEFT_WALL   = TABLE.cushion;
const RIGHT_WALL  = TABLE.width - TABLE.cushion;
const TOP_WALL    = TABLE.cushion;
const BOTTOM_WALL = TABLE.height - TABLE.cushion;
const MIN_VEL     = 0.05;

export function updatePhysics(balls: Ball[]): Ball[] {
  const active = balls.filter(b => !b.potted);

  for (const ball of active) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= TABLE.friction;
    ball.vy *= TABLE.friction;
    if (Math.abs(ball.vx) < MIN_VEL) ball.vx = 0;
    if (Math.abs(ball.vy) < MIN_VEL) ball.vy = 0;

    if (ball.x - ball.radius < LEFT_WALL) {
      ball.x = LEFT_WALL + ball.radius;
      ball.vx = Math.abs(ball.vx) * TABLE.cushionRestitution;
    }
    if (ball.x + ball.radius > RIGHT_WALL) {
      ball.x = RIGHT_WALL - ball.radius;
      ball.vx = -Math.abs(ball.vx) * TABLE.cushionRestitution;
    }
    if (ball.y - ball.radius < TOP_WALL) {
      ball.y = TOP_WALL + ball.radius;
      ball.vy = Math.abs(ball.vy) * TABLE.cushionRestitution;
    }
    if (ball.y + ball.radius > BOTTOM_WALL) {
      ball.y = BOTTOM_WALL - ball.radius;
      ball.vy = -Math.abs(ball.vy) * TABLE.cushionRestitution;
    }
  }

  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      resolveCollision(active[i], active[j]);
    }
  }

  for (const ball of active) {
    if (checkPocket(ball)) {
      ball.potted = true;
      ball.vx = 0;
      ball.vy = 0;
    }
  }

  return balls;
}

export function allBallsStopped(balls: Ball[]): boolean {
  return balls.filter(b => !b.potted).every(b => Math.abs(b.vx) < MIN_VEL && Math.abs(b.vy) < MIN_VEL);
}

export function shootCueBall(cueBall: Ball, angle: number, power: number): void {
  const speed = (power / 100) * 22;
  cueBall.vx = Math.cos(angle) * speed;
  cueBall.vy = Math.sin(angle) * speed;
}

export function calculateAimLine(
  cueBall: Ball,
  angle: number,
  balls: Ball[],
): { x1: number; y1: number; x2: number; y2: number; hitBall?: Ball } {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const maxDist = 1500;
  let closestT = maxDist;
  let hitBall: Ball | undefined;

  for (const ball of balls) {
    if (ball.potted || ball.id === cueBall.id) continue;
    const fx = cueBall.x - ball.x;
    const fy = cueBall.y - ball.y;
    const r = cueBall.radius + ball.radius;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - r * r;
    const disc = b * b - 4 * c;
    if (disc < 0) continue;
    const t = (-b - Math.sqrt(disc)) / 2;
    if (t > 0.5 && t < closestT) { closestT = t; hitBall = ball; }
  }

  const endT = Math.min(closestT, maxDist);
  return { x1: cueBall.x, y1: cueBall.y, x2: cueBall.x + dx * endT, y2: cueBall.y + dy * endT, hitBall };
}
