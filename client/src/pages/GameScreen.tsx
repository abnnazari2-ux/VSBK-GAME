import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ball } from '../types';
import { TABLE, POCKETS, updatePhysics, allBallsStopped, shootCueBall } from '../game-engine/physics';
import { createEngineState, processShotResult, EngineState } from '../game-engine/gameEngine';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../hooks/useSocket';
import GameHUD from '../components/game/GameHUD';

export default function GameScreen() {
  const navigate = useNavigate();
  const { currentRoom, socketId, localPlayer } = useGameStore();
  const { takeShot, syncGameState, endMatch } = useSocket();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const ballsRef = useRef<Ball[]>([]);
  const engineRef = useRef<EngineState | null>(null);

  // Which slot are we? 0 = host, 1 = guest
  const localPlayerIdx = useMemo<0 | 1>(() => {
    if (!currentRoom?.players || !socketId) return 0;
    const idx = currentRoom.players.findIndex(p => p.id === socketId);
    return idx === 1 ? 1 : 0;
  }, [currentRoom, socketId]);

  const isMultiplayer = !!(currentRoom?.players && currentRoom.players.length >= 2);
  const p1Name = currentRoom?.players?.[0]?.name ?? localPlayer.name;
  const p2Name = currentRoom?.players?.[1]?.name ?? 'BreakBuilder';

  const [engineState, setEngineState] = useState<EngineState>(() => {
    const s = createEngineState(p1Name, p2Name);
    ballsRef.current = s.balls.map(b => ({ ...b }));
    engineRef.current = s;
    return s;
  });

  const [aimAngle, setAimAngle] = useState(Math.PI);
  const [shotPower, setShotPower] = useState(50);
  const [showAimLine, setShowAimLine] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [flashMsg, setFlashMsg] = useState('');
  const [timer, setTimer] = useState(30);
  const [frame] = useState(1);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const isAnimating = engineState.isAnimating;
  const isMyTurn = engineState.currentPlayer === localPlayerIdx;

  const getCueBall = () => ballsRef.current.find(b => b.type === 'cue' && !b.potted);

  // ── DRAW ───────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = TABLE.width, H = TABLE.height, C = TABLE.cushion;
    const eng = engineRef.current;
    const animating = eng?.isAnimating ?? false;
    const myTurn = eng ? eng.currentPlayer === localPlayerIdx : true;

    ctx.clearRect(0, 0, W, H);

    const wg = ctx.createLinearGradient(0, 0, 0, H);
    wg.addColorStop(0, '#5c3a1e'); wg.addColorStop(1, '#2d1a0e');
    ctx.fillStyle = wg;
    ctx.beginPath();
    if ((ctx as any).roundRect) (ctx as any).roundRect(0, 0, W, H, 10);
    else ctx.rect(0, 0, W, H);
    ctx.fill();

    ctx.fillStyle = '#1a5c32';
    ctx.fillRect(C - 4, C - 4, W - 2 * (C - 4), H - 2 * (C - 4));
    ctx.fillStyle = '#1a472a';
    ctx.fillRect(C, C, W - 2 * C, H - 2 * C);
    const fg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    fg.addColorStop(0, 'rgba(30,100,55,0.2)'); fg.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = fg; ctx.fillRect(C, C, W - 2 * C, H - 2 * C);

    for (const p of POCKETS) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = '#020202'; ctx.fill();
      ctx.strokeStyle = '#2a1810'; ctx.lineWidth = 2; ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    const bX = W * 0.2;
    ctx.beginPath(); ctx.moveTo(bX, C); ctx.lineTo(bX, H - C); ctx.stroke();
    ctx.beginPath(); ctx.arc(bX, H / 2, H * 0.125, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    [{ x: W / 2, y: H / 2 }, { x: 740, y: H / 2 }, { x: W - 180, y: H / 2 }].forEach(s => {
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill();
    });

    const cb = getCueBall();
    if (cb && showAimLine && !animating && myTurn) {
      const dx = Math.cos(aimAngle), dy = Math.sin(aimAngle);
      ctx.save(); ctx.setLineDash([8, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cb.x, cb.y); ctx.lineTo(cb.x + dx * 210, cb.y + dy * 210); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
      ctx.beginPath(); ctx.arc(cb.x + dx * 180, cb.y + dy * 180, TABLE.ballRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();
      const off = 18 + shotPower * 0.3, cueLen = 130;
      const cg = ctx.createLinearGradient(cb.x - dx * off, cb.y - dy * off, cb.x - dx * (off + cueLen), cb.y - dy * (off + cueLen));
      cg.addColorStop(0, '#c8a46e'); cg.addColorStop(0.4, '#e8c88e'); cg.addColorStop(1, '#5c3a1e');
      ctx.beginPath(); ctx.moveTo(cb.x - dx * off, cb.y - dy * off); ctx.lineTo(cb.x - dx * (off + cueLen), cb.y - dy * (off + cueLen));
      ctx.strokeStyle = cg; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
    }

    for (const ball of ballsRef.current) {
      if (ball.potted) continue;
      ctx.beginPath(); ctx.arc(ball.x + 2, ball.y + 3, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.fill();
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color; ctx.fill();
      const sg = ctx.createRadialGradient(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.35, ball.radius * 0.08, ball.x, ball.y, ball.radius);
      sg.addColorStop(0, 'rgba(255,255,255,0.55)'); sg.addColorStop(0.45, 'rgba(255,255,255,0.1)'); sg.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = sg; ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 0.8; ctx.stroke();
      if (ball.type !== 'cue' && ball.type !== 'red') {
        ctx.fillStyle = ['yellow', 'pink'].includes(ball.type) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(String(ball.value), ball.x, ball.y);
      }
    }
  }, [aimAngle, shotPower, showAimLine, localPlayerIdx]);

  // ── POST-SHOT LOGIC via ref — avoids stale closures in rAF ────────────────
  const onShotEndRef = useRef<(potted: Ball[]) => void>(() => {});
  onShotEndRef.current = (pottedBalls: Ball[]) => {
    const result = processShotResult(
      { ...engineRef.current!, balls: ballsRef.current.map(b => ({ ...b })) },
      pottedBalls
    );
    ballsRef.current = result.balls.map(b => ({ ...b }));
    engineRef.current = { ...result, isAnimating: false };
    setEngineState({ ...result, isAnimating: false });

    if (result.foul && result.foulMessage) {
      setFlashMsg(result.foulMessage);
      setTimeout(() => setFlashMsg(''), 3000);
    } else {
      const scored = pottedBalls.filter(b => b.type !== 'cue').reduce((s, b) => s + b.value, 0);
      if (scored > 0) { setFlashMsg(`+${scored} PTS!`); setTimeout(() => setFlashMsg(''), 1800); }
    }

    if (isMultiplayer && currentRoom?.code) {
      syncGameState({ roomCode: currentRoom.code, gameState: result });
    }

    if (result.gameOver) {
      if (isMultiplayer && currentRoom?.code) {
        const winnerName = result.winner !== undefined ? result.playerNames[result.winner] : '';
        endMatch({ roomCode: currentRoom.code, winner: winnerName, finalState: result });
      }
      setTimeout(() => navigate('/results'), 2200);
    } else if (isMultiplayer && result.currentPlayer !== localPlayerIdx) {
      setWaitingForOpponent(true);
    }
  };

  // ── ANIMATION LOOP ─────────────────────────────────────────────────────────
  const animate = useCallback(() => {
    updatePhysics(ballsRef.current);
    draw();
    if (!allBallsStopped(ballsRef.current)) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      onShotEndRef.current(ballsRef.current.filter(b => b.potted));
    }
  }, [draw]);

  // ── MOUSE EVENTS ───────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (engineRef.current?.isAnimating) return;
    if (isMultiplayer && engineRef.current && engineRef.current.currentPlayer !== localPlayerIdx) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (TABLE.width / rect.width);
    const my = (e.clientY - rect.top) * (TABLE.height / rect.height);
    const cb = getCueBall();
    if (cb) setAimAngle(Math.atan2(my - cb.y, mx - cb.x));
  }, [localPlayerIdx, isMultiplayer]);

  const handleMouseUp = useCallback(() => {
    if (engineRef.current?.isAnimating) return;
    if (isMultiplayer && engineRef.current && engineRef.current.currentPlayer !== localPlayerIdx) return;
    const cb = ballsRef.current.find(b => b.type === 'cue');
    if (!cb || cb.potted) return;
    if (isMultiplayer && currentRoom?.code) {
      takeShot({ roomCode: currentRoom.code, angle: aimAngle, power: shotPower, spin: { x: 0, y: 0 } });
    }
    shootCueBall(cb, aimAngle, shotPower);
    setWaitingForOpponent(false);
    setEngineState(prev => { const n = { ...prev, isAnimating: true }; engineRef.current = n; return n; });
    animRef.current = requestAnimationFrame(animate);
  }, [aimAngle, shotPower, animate, currentRoom, isMultiplayer, localPlayerIdx, takeShot]);

  // ── OPPONENT SHOT LISTENER ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      if (!isMultiplayer) return;
      const { angle, power } = (e as CustomEvent).detail as { angle: number; power: number };
      const cb = ballsRef.current.find(b => b.type === 'cue' && !b.potted);
      if (!cb) return;
      cancelAnimationFrame(animRef.current);
      shootCueBall(cb, angle, power);
      setWaitingForOpponent(false);
      setEngineState(prev => { const n = { ...prev, isAnimating: true }; engineRef.current = n; return n; });
      animRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('snooker:shot_broadcast', handler);
    return () => window.removeEventListener('snooker:shot_broadcast', handler);
  }, [animate, isMultiplayer]);

  // ── SIDE EFFECTS ───────────────────────────────────────────────────────────
  useEffect(() => { draw(); }, [draw]);
  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  useEffect(() => {
    if (isAnimating || isPaused) return;
    setTimer(30);
    const id = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [isAnimating, isPaused, engineState.currentPlayer]);

  useEffect(() => {
    if (isMultiplayer && !isAnimating && !isMyTurn) setWaitingForOpponent(true);
    else setWaitingForOpponent(false);
  }, [isMultiplayer, isAnimating, isMyTurn]);

  const vw = window.innerWidth, vh = window.innerHeight;
  const scale = Math.min((vw - 32) / TABLE.width, (vh - 200) / TABLE.height, 1);
  const objective = engineState.phase === 'red' ? 'POT A RED'
    : engineState.phase === 'color' ? 'POT A COLOR'
    : engineState.phase === 'ended' ? 'FRAME OVER' : 'IN PROGRESS';

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050508', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <GameHUD
        player1Name={engineState.playerNames[0]}
        player2Name={engineState.playerNames[1]}
        player1Score={engineState.scores[0]}
        player2Score={engineState.scores[1]}
        player1Break={engineState.currentBreaks[0]}
        player2Break={engineState.currentBreaks[1]}
        currentPlayer={engineState.currentPlayer}
        frame={frame}
        objective={objective}
        shotPower={shotPower}
        spinX={0}
        spinY={0}
        remainingBalls={ballsRef.current}
        onPause={() => setIsPaused(p => !p)}
        onForfeit={() => navigate('/results')}
        onToggleAimLine={() => setShowAimLine(a => !a)}
        showAimLine={showAimLine}
        timerSeconds={timer}
        frameScores={[engineState.frameScores[0].length, engineState.frameScores[1].length]}
      />

      <div style={{ marginTop: 80, marginBottom: 90 }}>
        <canvas
          ref={canvasRef}
          width={TABLE.width}
          height={TABLE.height}
          onMouseMove={handleMouseMove}
          onMouseDown={e => e.preventDefault()}
          onMouseUp={handleMouseUp}
          style={{
            cursor: isAnimating ? 'wait' : isMyTurn ? 'crosshair' : 'default',
            display: 'block', borderRadius: 8,
            boxShadow: '0 0 60px rgba(0,0,0,0.9), 0 0 20px rgba(26,122,60,0.15)',
            width: TABLE.width * scale, height: TABLE.height * scale,
          }}
        />
      </div>

      {!isAnimating && isMyTurn && (
        <div style={{ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 50 }}>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 10, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>POWER</span>
          <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input type="range" min={10} max={100} value={shotPower} onChange={e => setShotPower(Number(e.target.value))}
              style={{ writingMode: 'vertical-lr' as React.CSSProperties['writingMode'], direction: 'rtl', width: 4, height: 100, cursor: 'pointer', appearance: 'slider-vertical' as any }} />
          </div>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 12, color: '#d4af37' }}>{shotPower}%</span>
        </div>
      )}

      <AnimatePresence>
        {waitingForOpponent && !isAnimating && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, padding: '12px 24px', zIndex: 150, display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#d4af37' }} />
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em' }}>
              WAITING FOR {(engineState.playerNames[engineState.currentPlayer] ?? 'OPPONENT').toUpperCase()}...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flashMsg && (
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -20 }}
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(10,10,15,0.97)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: 12, padding: '16px 28px', zIndex: 200, fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 22, color: '#d4af37', letterSpacing: '0.1em', boxShadow: '0 0 40px rgba(212,175,55,0.3)', textAlign: 'center' }}>
            {flashMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              style={{ background: 'rgba(17,17,24,0.98)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 16, padding: 40, minWidth: 280, textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, fontSize: 24, color: '#d4af37', marginBottom: 24 }}>GAME PAUSED</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'RESUME', bg: 'linear-gradient(135deg,#1a5c32,#22c55e)', color: '#fff', onClick: () => setIsPaused(false) },
                  { label: 'RESTART', bg: 'rgba(255,255,255,0.05)', color: '#f0f0f0', onClick: () => { const s = createEngineState(p1Name, p2Name); ballsRef.current = s.balls.map(b => ({ ...b })); engineRef.current = s; setEngineState(s); setIsPaused(false); setTimer(30); setWaitingForOpponent(false); } },
                  { label: 'FORFEIT', bg: 'rgba(127,29,29,0.7)', color: '#fca5a5', onClick: () => navigate('/results') },
                ].map(b => (
                  <button key={b.label} onClick={b.onClick} style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 14, padding: '12px', background: b.bg, color: b.color, border: 'none', borderRadius: 8, cursor: 'pointer', letterSpacing: '0.08em' }}>{b.label}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
