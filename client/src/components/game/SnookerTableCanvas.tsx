import React, { useRef, useEffect, useCallback } from 'react';
import { Ball } from '../../types';
import { TABLE, POCKETS } from '../../game-engine/physics';

interface Props {
  balls: Ball[];
  aimAngle: number;
  shotPower: number;
  isAnimating: boolean;
  showAimLine: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  width?: number;
  height?: number;
}

export default function SnookerTableCanvas({
  balls, aimAngle, shotPower, isAnimating, showAimLine,
  onMouseMove, onMouseDown, onMouseUp,
  width = TABLE.width, height = TABLE.height,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const W = TABLE.width, H = TABLE.height, C = TABLE.cushion;

    // 1. Outer wooden frame
    const woodGrad = ctx.createLinearGradient(0, 0, 0, H);
    woodGrad.addColorStop(0, '#5c3a1e');
    woodGrad.addColorStop(1, '#2d1a0e');
    ctx.fillStyle = woodGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 10);
    ctx.fill();

    // 2. Cushion rails
    ctx.fillStyle = '#1a5c32';
    ctx.fillRect(C - 4, C - 4, W - 2*(C-4), H - 2*(C-4));

    // 3. Playing surface (felt)
    ctx.fillStyle = '#1a472a';
    ctx.fillRect(C, C, W - 2*C, H - 2*C);

    // 4. Felt texture (subtle radial gradient)
    const feltGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.7);
    feltGrad.addColorStop(0, 'rgba(40,120,70,0.15)');
    feltGrad.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = feltGrad;
    ctx.fillRect(C, C, W - 2*C, H - 2*C);

    // 5. Pockets
    for (const pocket of POCKETS) {
      const gr = ctx.createRadialGradient(pocket.x, pocket.y, 0, pocket.x, pocket.y, pocket.radius + 4);
      gr.addColorStop(0, '#000000');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(pocket.x, pocket.y, pocket.radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pocket.x, pocket.y, pocket.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#030303';
      ctx.fill();
      ctx.strokeStyle = '#2a1810';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 6. Table markings
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    // Baulk line
    const baulkX = W * 0.2;
    ctx.beginPath(); ctx.moveTo(baulkX, C); ctx.lineTo(baulkX, H - C); ctx.stroke();
    // D semicircle
    const dR = H * 0.125;
    ctx.beginPath(); ctx.arc(baulkX, H/2, dR, -Math.PI/2, Math.PI/2); ctx.stroke();
    // Center spot
    ctx.beginPath(); ctx.arc(W/2, H/2, 2.5, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
    // Pink spot
    ctx.beginPath(); ctx.arc(740, H/2, 2.5, 0, Math.PI*2); ctx.fill();
    // Black spot
    ctx.beginPath(); ctx.arc(W - 180, H/2, 2.5, 0, Math.PI*2); ctx.fill();

    // 7. Aim line and cue stick
    const cueBall = balls.find(b => b.type === 'cue' && !b.potted);
    if (cueBall && showAimLine && !isAnimating) {
      const dx = Math.cos(aimAngle), dy = Math.sin(aimAngle);
      // Aim line
      ctx.save();
      ctx.setLineDash([8, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cueBall.x, cueBall.y);
      ctx.lineTo(cueBall.x + dx * 220, cueBall.y + dy * 220);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Ghost ball at aim point
      const ghostDist = 180;
      ctx.beginPath();
      ctx.arc(cueBall.x + dx * ghostDist, cueBall.y + dy * ghostDist, TABLE.ballRadius, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cue stick
      const offset = 18 + shotPower * 0.3;
      const cueLen = 130;
      const cueGrad = ctx.createLinearGradient(
        cueBall.x - dx * offset, cueBall.y - dy * offset,
        cueBall.x - dx * (offset + cueLen), cueBall.y - dy * (offset + cueLen),
      );
      cueGrad.addColorStop(0, '#c8a46e');
      cueGrad.addColorStop(0.4, '#e8c88e');
      cueGrad.addColorStop(1, '#5c3a1e');
      ctx.beginPath();
      ctx.moveTo(cueBall.x - dx * offset, cueBall.y - dy * offset);
      ctx.lineTo(cueBall.x - dx * (offset + cueLen), cueBall.y - dy * (offset + cueLen));
      ctx.strokeStyle = cueGrad;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.lineCap = 'butt';
    }

    // 8. Draw balls
    for (const ball of balls) {
      if (ball.potted) continue;
      // Shadow
      ctx.beginPath(); ctx.arc(ball.x + 2, ball.y + 3, ball.radius, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
      // Body
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
      ctx.fillStyle = ball.color; ctx.fill();
      // Specular
      const spec = ctx.createRadialGradient(
        ball.x - ball.radius*0.3, ball.y - ball.radius*0.35, ball.radius*0.08,
        ball.x, ball.y, ball.radius,
      );
      spec.addColorStop(0, 'rgba(255,255,255,0.55)');
      spec.addColorStop(0.45, 'rgba(255,255,255,0.1)');
      spec.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = spec; ctx.fill();
      // Outline
      ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 0.8; ctx.stroke();

      // Ball label for colors
      if (ball.type !== 'cue' && ball.type !== 'red') {
        ctx.fillStyle = ball.type === 'yellow' || ball.type === 'pink' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
        ctx.font = `bold 7px Rajdhani,sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(ball.value), ball.x, ball.y);
      }
    }
  }, [balls, aimAngle, shotPower, isAnimating, showAimLine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    draw(ctx);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        cursor: 'crosshair',
        display: 'block',
        borderRadius: '8px',
        boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(26,122,60,0.2)',
      }}
    />
  );
}
