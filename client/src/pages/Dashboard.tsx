import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Shield, Target, Trophy, CheckCircle, Gift } from 'lucide-react';
import TopNav from '../components/layout/TopNav';
import ProgressBar from '../components/ui/ProgressBar';

export default function Dashboard() {
  const navigate = useNavigate();
  const S: React.CSSProperties = { fontFamily: 'Rajdhani,sans-serif' };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', paddingTop: '60px' }}>
      <TopNav />
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 60px - 220px)', minHeight: 480 }}>

        {/* LEFT PANEL */}
        <div style={{ width: 300, flexShrink: 0, background: 'rgba(8,8,14,0.98)', borderRight: '1px solid rgba(212,175,55,0.15)', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ ...S, fontWeight: 600, fontSize: 11, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>WELCOME BACK,</p>
            <h1 style={{ ...S, fontWeight: 900, fontSize: 44, color: '#d4af37', lineHeight: 1, letterSpacing: '0.02em', textShadow: '0 0 30px rgba(212,175,55,0.3)' }}>NAZARI</h1>
            <div style={{ height: 2, background: 'linear-gradient(90deg, #d4af37 60%, transparent)', margin: '10px 0' }} />
            <p style={{ ...S, fontSize: 13, color: '#6b7280', fontStyle: 'italic', lineHeight: 1.6 }}>EVERY SHOT. EVERY VICTORY.<br />BECOME A LEGEND.</p>
          </div>

          <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34,197,94,0.4)' }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/play')}
            style={{ background: 'linear-gradient(135deg,#1a5c32,#22c55e)', border: 'none', borderRadius: 10, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#fff' }}>
            <span style={{ ...S, fontWeight: 900, fontSize: 24, letterSpacing: '0.08em' }}>PLAY NOW</span>
            <ChevronRight size={26} />
          </motion.button>

          {[
            { icon: <Zap size={18} />, title: 'QUICK MATCH', sub: 'Jump into a match', path: '/play' },
            { icon: <Shield size={18} />, title: 'CREATE ROOM', sub: 'Create your own room', path: '/room' },
            { icon: <Target size={18} />, title: 'PRACTICE', sub: 'Hone your skills', path: '/game' },
          ].map(item => (
            <motion.button key={item.title} whileHover={{ x: 4, background: 'rgba(212,175,55,0.07)' }}
              onClick={() => navigate(item.path)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
              <span style={{ color: '#d4af37' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ ...S, fontWeight: 700, fontSize: 13, color: '#f0f0f0', letterSpacing: '0.05em' }}>{item.title}</div>
                <div style={{ ...S, fontSize: 11, color: '#6b7280' }}>{item.sub}</div>
              </div>
              <ChevronRight size={16} color="#6b7280" />
            </motion.button>
          ))}
        </div>

        {/* CENTER HERO */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1a12' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(26,122,60,0.12) 0%, transparent 60%)' }} />
          {/* Table */}
          <div style={{ position: 'relative', width: '75%', maxWidth: 700 }}>
            <div style={{ background: '#3d2b1f', borderRadius: 14, padding: 14, boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.05)' }}>
              <div style={{ background: '#1a5c32', borderRadius: 8, padding: '12px', boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.3)' }}>
                <div style={{ background: '#1a472a', borderRadius: 6, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '18%', width: '1px', height: '80%', background: 'rgba(255,255,255,0.1)', transform: 'translateY(-50%)' }} />
                  {[0,1,2,3,4].map(r => [0,1,2,3,4].slice(0, r+1).map(c => (
                    <div key={`${r}-${c}`} style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#cc2222', left: `${62 + r*2.2}%`, top: `${50 - r*5 + c*10}%`, boxShadow: '0 0 4px rgba(204,34,34,0.6)' }} />
                  )))
                  }
                  {[{c:'#f0d000',l:'38%',t:'56%'},{c:'#22aa44',l:'38%',t:'44%'},{c:'#8b5a2b',l:'38%',t:'50%'},{c:'#1144cc',l:'50%',t:'50%'},{c:'#f5f5f0',l:'25%',t:'50%'}].map((b,i) => (
                    <div key={i} style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: b.c, left: b.l, top: b.t, boxShadow: `0 0 6px ${b.c}88` }} />
                  ))}
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div style={{ ...S, fontWeight: 900, fontSize: 28, color: 'rgba(212,175,55,0.25)', letterSpacing: '0.3em' }}>SNOOKER LEGENDS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Ambient lamp light */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50%', height: 160, background: 'radial-gradient(ellipse, rgba(255,220,120,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 320, flexShrink: 0, background: 'rgba(8,8,14,0.98)', borderLeft: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

          {/* Daily Missions */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ ...S, fontWeight: 800, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>DAILY MISSIONS</span>
              <span style={{ ...S, fontSize: 11, color: '#22c55e' }}>10h 42m</span>
            </div>
            {[
              { label: 'Play 3 Matches', prog: 2, total: 3, reward: '200', gem: false },
              { label: 'Pot 10 Reds', prog: 6, total: 10, reward: '150', gem: false },
              { label: 'Win 1 Match', prog: 0, total: 1, reward: '20', gem: true },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ ...S, fontSize: 12, color: '#f0f0f0' }}>{m.label}</span>
                  <span style={{ ...S, fontWeight: 700, fontSize: 12, color: m.gem ? '#60a5fa' : '#d4af37' }}>{m.reward} {m.gem ? '💎' : '🪙'}</span>
                </div>
                <ProgressBar value={m.prog} max={m.total} color="green" height="sm" />
                <span style={{ ...S, fontSize: 10, color: '#6b7280' }}>{m.prog}/{m.total}</span>
              </div>
            ))}
            <button style={{ ...S, fontWeight: 600, fontSize: 11, color: '#d4af37', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}>VIEW ALL MISSIONS →</button>
          </div>

          {/* Season */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ ...S, fontWeight: 800, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em' }}>CURRENT SEASON</span>
              <span style={{ ...S, fontSize: 11, color: '#6b7280' }}>32d 10h</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#d4af37,#9a7d2b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(212,175,55,0.5)', flexShrink: 0 }}>
                <Trophy size={22} color="#0a0a0f" />
              </div>
              <div>
                <div style={{ ...S, fontWeight: 800, fontSize: 16, color: '#d4af37' }}>GRAND MASTER</div>
                <div style={{ ...S, fontWeight: 600, fontSize: 12, color: '#d4af37' }}>Season 12</div>
              </div>
            </div>
            <ProgressBar value={3450} max={4000} color="gold" height="md" label="3,450 / 4,000 XP" showPercent />
          </div>

          {/* Online Friends */}
          <div style={{ padding: '20px 20px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ ...S, fontWeight: 800, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em' }}>ONLINE FRIENDS</span>
              <span style={{ ...S, fontSize: 11, color: '#22c55e' }}>8 ONLINE</span>
            </div>
            {[
              { name: 'CueWizard', status: 'IN MATCH', color: '#f59e0b', join: true },
              { name: 'BreakBuilder', status: 'ONLINE', color: '#22c55e', join: false },
              { name: 'SnookerNova', status: 'IN LOBBY', color: '#3b82f6', join: false },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#374151,#6b7280)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ ...S, fontWeight: 800, fontSize: 14, color: '#f0f0f0' }}>{f.name[0]}</span>
                  </div>
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: f.color, border: '2px solid #0a0a0f' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...S, fontWeight: 700, fontSize: 13, color: '#f0f0f0' }}>{f.name}</div>
                  <div style={{ ...S, fontSize: 10, color: f.color }}>{f.status}</div>
                </div>
                {f.join
                  ? <button onClick={() => navigate('/lobby')} style={{ ...S, fontWeight: 700, fontSize: 11, color: '#0a0a0f', background: '#22c55e', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>JOIN</button>
                  : <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', color: '#6b7280', fontSize: 14 }}>💬</button>
                }
              </div>
            ))}
            <button onClick={() => navigate('/friends')} style={{ ...S, fontWeight: 600, fontSize: 11, color: '#d4af37', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>VIEW ALL FRIENDS →</button>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(212,175,55,0.15)', minHeight: 220 }}>
        <div style={{ flex: 1, padding: '20px 24px', borderRight: '1px solid rgba(212,175,55,0.12)' }}>
          <span style={{ ...S, fontWeight: 800, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em', display: 'block', marginBottom: 12, textTransform: 'uppercase' }}>FEATURED EVENTS</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { title: 'MASTERS CUP', label: 'Snooker Legends', time: '3d 10h', prize: '250,000 🪙', bg: '#d4af37' },
              { title: 'WEEKLY CHALLENGE', label: 'Weekly', time: '10h 42m', prize: '5,000 💎', bg: '#22c55e' },
              { title: 'GOLDEN CUE SHOWDOWN', label: 'Special', time: '17d 10h', prize: '100,000 🪙', bg: '#f59e0b' },
            ].map(ev => (
              <motion.div key={ev.title} whileHover={{ scale: 1.03 }} style={{ flex: 1, background: 'rgba(17,17,24,0.9)', border: `1px solid ${ev.bg}33`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer' }}>
                <div style={{ ...S, fontWeight: 700, fontSize: 9, color: ev.bg, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{ev.label}</div>
                <div style={{ ...S, fontWeight: 800, fontSize: 13, color: '#f0f0f0', marginBottom: 6 }}>{ev.title}</div>
                <div style={{ ...S, fontSize: 10, color: '#6b7280', marginBottom: 10 }}>Ends: {ev.time}</div>
                <div style={{ ...S, fontWeight: 700, fontSize: 14, color: '#d4af37' }}>{ev.prize}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ width: 380, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ ...S, fontWeight: 800, fontSize: 13, color: '#d4af37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>RECENT ACHIEVEMENTS</span>
            <button style={{ ...S, fontSize: 11, color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer' }}>VIEW ALL</button>
          </div>
          {[
            { title: 'Maximum Break', sub: 'Score a break of 147', reward: '50 💎', time: '2h ago' },
            { title: 'Potter', sub: 'Pot 100 balls', reward: '100 🪙', time: '5h ago' },
            { title: 'Rising Star', sub: 'Reach Level 45', reward: '100 🪙', time: '1d ago' },
          ].map(a => (
            <div key={a.title} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
              <CheckCircle size={16} color="#22c55e" />
              <div style={{ flex: 1 }}>
                <div style={{ ...S, fontWeight: 700, fontSize: 13, color: '#f0f0f0' }}>{a.title}</div>
                <div style={{ ...S, fontSize: 11, color: '#6b7280' }}>{a.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...S, fontWeight: 700, fontSize: 12, color: '#d4af37' }}>{a.reward}</div>
                <div style={{ ...S, fontSize: 10, color: '#6b7280' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
