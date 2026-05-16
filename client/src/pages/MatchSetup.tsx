import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Trophy, Shield, Target, Pen } from 'lucide-react';
import TopNav from '../components/layout/TopNav';

type Mode = 'ranked' | 'casual' | 'practice' | 'custom';
type Frames = 3 | 5 | 7;
type Timer = 0 | 20 | 30 | 45;
type Theme = 'classic' | 'blue' | 'red';
type Stake = 0 | 100 | 500 | 1000;

export default function MatchSetup() {
  const navigate = useNavigate();
  const S: React.CSSProperties = { fontFamily: 'Rajdhani,sans-serif' };
  const [mode, setMode] = useState<Mode>('ranked');
  const [frames, setFrames] = useState<Frames>(5);
  const [timer, setTimer] = useState<Timer>(20);
  const [theme, setTheme] = useState<Theme>('classic');
  const [stake, setStake] = useState<Stake>(0);
  const [cue, setCue] = useState<'none'|'one'|'house'>('none');

  const themeColors: Record<Theme, string> = { classic: '#1a472a', blue: '#1a2e47', red: '#471a1a' };

  const pill = (active: boolean, label: string, onClick: () => void) => (
    <button onClick={onClick} style={{ ...S, fontWeight: 700, fontSize: 12, padding: '7px 14px', borderRadius: 6, background: active ? 'linear-gradient(135deg,#1a5c32,#22c55e)' : 'rgba(255,255,255,0.05)', color: active ? '#fff' : '#9ca3af', border: active ? 'none' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.2s' }}>{label}</button>
  );

  const panel: React.CSSProperties = { background: 'rgba(17,17,24,0.9)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 12, padding: '16px 20px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: 60 }}>
      <TopNav />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={16} /></button>
            <div>
              <p style={{ ...S, fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>PLAY ONLINE</p>
              <h1 style={{ ...S, fontWeight: 900, fontSize: 36, color: '#d4af37', lineHeight: 1 }}>MATCH SETUP</h1>
            </div>
          </div>

          {/* Game mode cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { key: 'ranked', icon: '🛡️', title: 'RANKED MATCH', sub: 'Compete for rank and climb the ladder' },
              { key: 'casual', icon: '🏆', title: 'CASUAL MATCH', sub: 'Play for fun with no rank changes' },
              { key: 'practice', icon: '🎱', title: 'PRACTICE', sub: 'Hone your skills offline or vs AI' },
              { key: 'custom', icon: '✂️', title: 'CUSTOM RULES', sub: 'Create your own match with custom settings' },
            ].map(m => (
              <motion.div key={m.key} whileHover={{ scale: 1.02 }} onClick={() => setMode(m.key as Mode)}
                style={{ background: mode === m.key ? 'rgba(26,122,60,0.15)' : 'rgba(17,17,24,0.9)', border: mode === m.key ? '2px solid #22c55e' : '1px solid rgba(212,175,55,0.18)', borderRadius: 12, padding: '20px 16px', cursor: 'pointer', textAlign: 'center', position: 'relative' }}>
                {mode === m.key && <span style={{ position: 'absolute', top: 8, right: 10, color: '#22c55e', fontSize: 14 }}>✓</span>}
                <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
                <div style={{ ...S, fontWeight: 800, fontSize: 12, color: mode === m.key ? '#22c55e' : '#f0f0f0', letterSpacing: '0.06em', marginBottom: 4 }}>{m.title}</div>
                <div style={{ ...S, fontSize: 11, color: '#6b7280', lineHeight: 1.4 }}>{m.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Players section */}
          <div style={{ ...panel }}>
            <p style={{ ...S, fontWeight: 800, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>PLAYERS</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#d4af37,#9a7d2b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(212,175,55,0.5)', flexShrink: 0 }}>
                  <span style={{ ...S, fontWeight: 900, fontSize: 20, color: '#0a0a0f' }}>C</span>
                </div>
                <div>
                  <div style={{ ...S, fontWeight: 800, fontSize: 16, color: '#d4af37' }}>CHALKMASTER</div>
                  <div style={{ ...S, fontSize: 12, color: '#22c55e' }}>GRAND MASTER</div>
                </div>
              </div>
              <div style={{ ...S, fontWeight: 900, fontSize: 22, color: '#d4af37' }}>VS</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)', flexShrink: 0 }}>
                  <span style={{ color: '#4b5563', fontSize: 20 }}>?</span>
                </div>
                <div>
                  <div style={{ ...S, fontWeight: 700, fontSize: 14, color: '#6b7280' }}>OPPONENT</div>
                  <div style={{ ...S, fontSize: 11, color: '#4b5563' }}>Finding opponent...</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div style={{ flex: 1, background: 'rgba(26,122,60,0.12)', border: '2px solid #22c55e', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>👥</span>
                <div><div style={{ ...S, fontWeight: 700, fontSize: 13, color: '#22c55e' }}>MATCHMAKING</div><div style={{ ...S, fontSize: 11, color: '#6b7280' }}>Find a suitable opponent</div></div>
              </div>
              <div style={{ ...S, fontWeight: 600, fontSize: 13, color: '#6b7280', alignSelf: 'center', padding: '0 8px' }}>OR</div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>➕</span>
                <div><div style={{ ...S, fontWeight: 700, fontSize: 13, color: '#f0f0f0' }}>INVITE A FRIEND</div><div style={{ ...S, fontSize: 11, color: '#6b7280' }}>Invite online friend to play</div></div>
              </div>
            </div>
          </div>

          {/* Match rules */}
          <div style={{ ...panel }}>
            <p style={{ ...S, fontWeight: 800, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em', marginBottom: 14, textTransform: 'uppercase' }}>MATCH RULES</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Frames */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...S, fontWeight: 600, fontSize: 12, color: '#9ca3af', width: 120, textTransform: 'uppercase' }}>Frames</span>
                <div style={{ display: 'flex', gap: 6 }}>{([3, 5, 7] as Frames[]).map(f => pill(frames === f, `Best of ${f}`, () => setFrames(f)))}</div>
              </div>
              {/* Shot timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...S, fontWeight: 600, fontSize: 12, color: '#9ca3af', width: 120, textTransform: 'uppercase' }}>Shot Timer</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {([0, 20, 30, 45] as Timer[]).map(t => pill(timer === t, t === 0 ? 'OFF' : `${t} Sec`, () => setTimer(t)))}
                </div>
              </div>
              {/* Table theme */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...S, fontWeight: 600, fontSize: 12, color: '#9ca3af', width: 120, textTransform: 'uppercase' }}>Table Theme</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['classic', 'blue', 'red'] as Theme[]).map(t => (
                    <button key={t} onClick={() => setTheme(t)} style={{ width: 48, height: 30, borderRadius: 6, background: themeColors[t], border: theme === t ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
              {/* Cue restrictions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...S, fontWeight: 600, fontSize: 12, color: '#9ca3af', width: 120, textTransform: 'uppercase' }}>Cue Rules</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['none', 'one', 'house'] as const).map(c => pill(cue === c, c === 'none' ? 'No Restrictions' : c === 'one' ? 'One Cue' : 'House Cues', () => setCue(c)))}
                </div>
              </div>
              {/* Stake */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...S, fontWeight: 600, fontSize: 12, color: '#9ca3af', width: 120, textTransform: 'uppercase' }}>Stake</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {([0, 100, 500, 1000] as Stake[]).map(s => pill(stake === s, s === 0 ? 'FREE' : `🪙 ${s}`, () => setStake(s)))}
                </div>
              </div>
            </div>
            <p style={{ ...S, fontSize: 11, color: '#4b5563', marginTop: 12 }}>ⓘ Custom rules and higher stakes may take longer to find a match.</p>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...panel }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1a5c32,#22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={20} color="#fff" /></div>
              <div><div style={{ ...S, fontWeight: 800, fontSize: 14, color: '#22c55e' }}>RANKED MATCH</div><div style={{ ...S, fontSize: 12, color: '#6b7280' }}>Compete for rank</div></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ ...S, fontSize: 11, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ESTIMATED REWARDS</p>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🪙</span><span style={{ ...S, fontWeight: 800, fontSize: 20, color: '#d4af37' }}>250</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>💎</span><span style={{ ...S, fontWeight: 800, fontSize: 20, color: '#60a5fa' }}>10</span></div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ ...S, fontSize: 11, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>RULES OVERVIEW</p>
              {[
                [`Best of ${frames} Frames`], [`Shot Timer: ${timer === 0 ? 'Off' : timer + 's'}`], ['No Restrictions'], ['Table: Classic Green']
              ].map(([r]) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ color: '#22c55e', fontSize: 12 }}>✓</span>
                  <span style={{ ...S, fontSize: 12, color: '#9ca3af' }}>{r}</span>
                </div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(212,175,55,0.4)' }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/game')}
              style={{ width: '100%', background: 'linear-gradient(135deg,#c9a227,#f5c842)', border: 'none', borderRadius: 10, padding: '16px', ...S, fontWeight: 900, fontSize: 18, color: '#0a0a0f', cursor: 'pointer', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              START MATCH <ChevronRight size={20} />
            </motion.button>
            <p style={{ ...S, fontSize: 10, color: '#4b5563', textAlign: 'center', marginTop: 8 }}>By starting, you agree to the Game Rules</p>
          </div>
        </div>
      </div>
    </div>
  );
}
