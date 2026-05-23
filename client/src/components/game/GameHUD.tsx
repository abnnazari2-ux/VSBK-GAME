import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Flag, Eye, EyeOff, Clock } from 'lucide-react';
import { Ball } from '../../types';

interface Props {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  player1Break: number;
  player2Break: number;
  currentPlayer: 0 | 1;
  localPlayerIdx: 0 | 1;
  frame: number;
  objective: string;
  shotPower: number;
  spinX: number;
  spinY: number;
  remainingBalls: Ball[];
  onPause: () => void;
  onForfeit: () => void;
  onToggleAimLine?: () => void;
  showAimLine?: boolean;
  timerSeconds?: number;
  frameScores?: [number, number];
}

function getPowerColor(p: number) {
  if (p < 35) return '#22c55e';
  if (p < 65) return '#eab308';
  if (p < 85) return '#f97316';
  return '#ef4444';
}

export default function GameHUD({
  player1Name, player2Name,
  player1Score, player2Score,
  player1Break, player2Break,
  currentPlayer, localPlayerIdx,
  frame, objective,
  shotPower, spinX, spinY,
  remainingBalls,
  onPause, onForfeit, onToggleAimLine, showAimLine,
  timerSeconds = 30,
  frameScores,
}: Props) {
  const [forfeitOpen, setForfeitOpen] = useState(false);
  const pct = Math.min(100, Math.max(0, shotPower));
  const powerColor = getPowerColor(pct);
  const spinCx = 50 + spinX * 38;
  const spinCy = 50 - spinY * 38;
  const isUrgent = timerSeconds <= 10;

  const panel: React.CSSProperties = {
    background: 'rgba(10,10,15,0.92)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(212,175,55,0.18)',
  };
  const btnBase: React.CSSProperties = {
    fontFamily: 'Rajdhani,sans-serif', fontWeight: 700,
    fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px',
  };

  // Turn label from this client's perspective
  const turnLabelFor = (playerIdx: 0 | 1): string | null => {
    if (currentPlayer !== playerIdx) return null;
    return playerIdx === localPlayerIdx ? '● YOUR TURN' : '● THEIR TURN';
  };

  return (
    <>
      {/* TOP BAR */}
      <div style={{ ...panel, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 12px 12px' }}>
        <motion.div
          animate={currentPlayer === 0 ? { boxShadow: ['0 0 8px rgba(34,197,94,0.3)', '0 0 20px rgba(34,197,94,0.6)', '0 0 8px rgba(34,197,94,0.3)'] } : { boxShadow: 'none' }}
          transition={currentPlayer === 0 ? { duration: 2, repeat: Infinity } : undefined}
          style={{ ...panel, padding: '8px 16px', borderRadius: '10px', minWidth: '160px', border: currentPlayer === 0 ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(212,175,55,0.18)' }}
        >
          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: '13px', color: currentPlayer === 0 ? '#f0f0f0' : '#6b7280' }}>{player1Name}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: '28px', color: currentPlayer === 0 ? '#22c55e' : '#f0f0f0', lineHeight: 1 }}>{player1Score}</span>
            {player1Break > 0 && <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '11px', color: '#d4af37' }}>Break: {player1Break}</span>}
          </div>
          {turnLabelFor(0) && <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '10px', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>{turnLabelFor(0)}</div>}
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, fontSize: '11px', color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Frame {frame}</span>
          {frameScores && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: '13px', color: '#d4af37' }}>{frameScores[0]}</span>
              <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '10px', color: '#4b5563' }}>FRAMES</span>
              <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: '13px', color: '#f0f0f0' }}>{frameScores[1]}</span>
            </div>
          )}
          <motion.div
            animate={isUrgent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={isUrgent ? { duration: 0.65, repeat: Infinity } : undefined}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Clock size={12} color={isUrgent ? '#ef4444' : '#6b7280'} />
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '18px', color: isUrgent ? '#ef4444' : '#d4af37' }}>
              {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
            </span>
          </motion.div>
          <div style={{ padding: '3px 12px', borderRadius: '999px', background: 'rgba(26,122,60,0.2)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: '11px', color: '#22c55e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{objective}</span>
          </div>
        </div>

        <motion.div
          animate={currentPlayer === 1 ? { boxShadow: ['0 0 8px rgba(34,197,94,0.3)', '0 0 20px rgba(34,197,94,0.6)', '0 0 8px rgba(34,197,94,0.3)'] } : { boxShadow: 'none' }}
          transition={currentPlayer === 1 ? { duration: 2, repeat: Infinity } : undefined}
          style={{ ...panel, padding: '8px 16px', borderRadius: '10px', minWidth: '160px', textAlign: 'right', border: currentPlayer === 1 ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(212,175,55,0.18)' }}
        >
          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: '13px', color: currentPlayer === 1 ? '#f0f0f0' : '#6b7280' }}>{player2Name}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px', justifyContent: 'flex-end' }}>
            {player2Break > 0 && <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '11px', color: '#d4af37' }}>Break: {player2Break}</span>}
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: '28px', color: currentPlayer === 1 ? '#22c55e' : '#f0f0f0', lineHeight: 1 }}>{player2Score}</span>
          </div>
          {turnLabelFor(1) && <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '10px', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px', textAlign: 'right' }}>{turnLabelFor(1)}</div>}
        </motion.div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{ ...panel, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '12px 20px', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '12px 12px 0 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '10px', color: '#6b7280' }}>POWER</span>
          <div style={{ width: '14px', height: '80px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
            <motion.div animate={{ height: `${pct}%` }} transition={{ duration: 0.06 }} style={{ width: '100%', background: `linear-gradient(0deg, ${powerColor}99, ${powerColor})`, borderRadius: '6px', boxShadow: `0 0 8px ${powerColor}88` }} />
          </div>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '10px', color: powerColor }}>{pct}%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '10px', color: '#6b7280' }}>SPIN</span>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.25)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.08)', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.08)', transform: 'translateX(-50%)' }} />
            <motion.div animate={{ left: `${spinCx}%`, top: `${spinCy}%` }} transition={{ duration: 0.08 }} style={{ position: 'absolute', width: '10px', height: '10px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #f5c842, #d4af37)', transform: 'translate(-50%,-50%)', boxShadow: '0 0 8px rgba(212,175,55,0.6)' }} />
          </div>
        </div>

        <div style={{ width: '1px', height: '60px', background: 'rgba(212,175,55,0.15)' }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {remainingBalls.filter(b => b.type !== 'cue').map((ball) => (
              <div key={ball.id} title={`${ball.type} (${ball.value}pt)`} style={{ width: '14px', height: '14px', borderRadius: '50%', background: ball.potted ? '#222' : ball.color, opacity: ball.potted ? 0.3 : 1, border: `1px solid ${ball.potted ? '#333' : 'rgba(255,255,255,0.2)'}`, boxShadow: ball.potted ? 'none' : `0 0 5px ${ball.color}66` }} />
            ))}
          </div>
          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '11px', color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {remainingBalls.filter(b => b.type === 'red' && !b.potted).length} reds remaining
          </div>
        </div>

        <div style={{ width: '1px', height: '60px', background: 'rgba(212,175,55,0.15)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {onToggleAimLine && (
            <button onClick={onToggleAimLine} style={{ ...btnBase, background: showAimLine ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)', color: showAimLine ? '#d4af37' : '#6b7280', border: `1px solid ${showAimLine ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
              {showAimLine ? <Eye size={13} /> : <EyeOff size={13} />} AIM LINE
            </button>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onPause} style={{ ...btnBase, background: 'rgba(17,17,24,0.9)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}><Pause size={13} />PAUSE</button>
            <button onClick={() => setForfeitOpen(true)} style={{ ...btnBase, background: 'rgba(127,29,29,0.7)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' }}><Flag size={13} />FORFEIT</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {forfeitOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setForfeitOpen(false)}>
            <motion.div initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }} onClick={e => e.stopPropagation()} style={{ background: 'rgba(15,15,22,0.98)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '14px', padding: '32px', maxWidth: '320px', width: '90%', textAlign: 'center' }}>
              <Flag size={32} style={{ color: '#ef4444', margin: '0 auto 16px', display: 'block' }} />
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, fontSize: '1.2rem', color: '#f0f0f0', marginBottom: '8px' }}>Forfeit Match?</h2>
              <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>You will concede this frame. This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setForfeitOpen(false)} style={{ flex: 1, ...btnBase, background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', justifyContent: 'center' }}>Cancel</button>
                <button onClick={() => { setForfeitOpen(false); onForfeit(); }} style={{ flex: 1, ...btnBase, background: 'linear-gradient(135deg,#7f1d1d,#dc2626)', color: '#fff', border: '1px solid rgba(239,68,68,0.5)', justifyContent: 'center' }}>Forfeit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
