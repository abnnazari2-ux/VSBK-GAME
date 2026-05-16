import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Eye, Trophy, Users, TrendingUp, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import TopNav from '../components/layout/TopNav';
import PlayerAvatar from '../components/ui/PlayerAvatar';

const LIVE_MATCHES = [
  {
    id: 1, p1: { name: 'SilkShot', rank: 'Grand Master', score: 2 },
    p2: { name: 'CueKing99', rank: 'Expert', score: 1 },
    frame: 4, viewers: 1243, tournament: 'Pro Circuit S3', featured: true,
    breakInfo: '87 break in progress',
  },
  {
    id: 2, p1: { name: 'BlackBall', rank: 'Master', score: 1 },
    p2: { name: 'PinkPotter', rank: 'Pro', score: 0 },
    frame: 2, viewers: 421, tournament: null, featured: false,
    breakInfo: null,
  },
  {
    id: 3, p1: { name: 'FrameMaster', rank: 'Expert', score: 3 },
    p2: { name: 'NoviceNick', rank: 'Amateur', score: 0 },
    frame: 4, viewers: 87, tournament: 'Weekend Classic', featured: false,
    breakInfo: null,
  },
];

const CHAT_MSGS = [
  { name: 'CueFan23', msg: 'What a shot!! 🔥' },
  { name: 'SnookerPro', msg: 'Century break incoming?' },
  { name: 'TableWatcher', msg: 'SilkShot is on fire today' },
  { name: 'GreenFelt', msg: 'Best match of the season' },
  { name: 'CueFan23', msg: 'Go SilkShot!!!' },
];

export default function LiveHub() {
  const [selected, setSelected] = useState(LIVE_MATCHES[0]);
  const [muted, setMuted] = useState(false);
  const [chatInput, setChatInput] = useState('');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-4 pb-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 rounded-full bg-red-500" />
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani', color: 'var(--gold-primary)' }}>Live Hub</h1>
            <span className="text-gray-400 text-sm">· {LIVE_MATCHES.length} matches live</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            {/* Main Viewer */}
            <div className="xl:col-span-3 space-y-4">
              {/* Featured Match Viewer */}
              <div className="glass-panel gold-border rounded-2xl overflow-hidden">
                {/* Scoreboard */}
                <div className="px-6 py-4 flex items-center justify-between"
                  style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.08) 0%, transparent 100%)' }}>
                  <div className="flex items-center gap-4">
                    <PlayerAvatar name={selected.p1.name} rank={selected.p1.rank as any} size="sm" status="inMatch" />
                    <div>
                      <p className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{selected.p1.name}</p>
                      <p className="text-xs text-gray-400">{selected.p1.rank}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl font-black" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>
                        {selected.p1.score}
                      </span>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Frame {selected.frame}</p>
                        {selected.tournament && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--gold-primary)' }}>{selected.tournament}</p>
                        )}
                        {selected.breakInfo && (
                          <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
                            className="text-xs text-green-400 mt-0.5">{selected.breakInfo}</motion.p>
                        )}
                      </div>
                      <span className="text-5xl font-black text-gray-400" style={{ fontFamily: 'Rajdhani' }}>
                        {selected.p2.score}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{selected.p2.name}</p>
                      <p className="text-xs text-gray-400">{selected.p2.rank}</p>
                    </div>
                    <PlayerAvatar name={selected.p2.name} rank={selected.p2.rank as any} size="sm" status="inMatch" />
                  </div>
                </div>

                {/* Table Preview */}
                <div className="relative mx-6 mb-6 rounded-xl overflow-hidden" style={{ height: 320 }}>
                  <div className="absolute inset-0 snooker-felt rounded-xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-6xl mb-3">
                        🎱
                      </motion.div>
                      <p className="text-white/60 text-sm">Live match in progress</p>
                      <p className="text-white/30 text-xs mt-1">Real-time board visualization</p>
                    </div>
                  </div>
                  {/* Viewer count overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
                    <Eye size={14} className="text-red-400" />
                    <span className="text-white text-sm font-bold">{selected.viewers.toLocaleString()}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => setMuted(m => !m)}
                      className="p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors">
                      {muted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
                    </button>
                    <button className="p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors">
                      <Maximize2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Live Matches */}
              <h3 className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Other Live Matches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LIVE_MATCHES.filter(m => m.id !== selected.id).map(m => (
                  <motion.div key={m.id}
                    onClick={() => setSelected(m)}
                    className="glass-panel rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    whileHover={{ y: -2 }}>
                    <div className="flex items-center justify-between mb-3">
                      {m.tournament && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--gold-primary)20', color: 'var(--gold-primary)' }}>
                          {m.tournament}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                        <Eye size={11} /> {m.viewers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlayerAvatar name={m.p1.name} rank={m.p1.rank as any} size="sm" status="inMatch" />
                        <span className="text-white text-sm font-medium">{m.p1.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-black" style={{ fontFamily: 'Rajdhani' }}>
                        <span style={{ color: 'var(--gold-primary)' }}>{m.p1.score}</span>
                        <span className="text-gray-600">-</span>
                        <span className="text-gray-400">{m.p2.score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{m.p2.name}</span>
                        <PlayerAvatar name={m.p2.name} rank={m.p2.rank as any} size="sm" status="inMatch" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chat + Stats Sidebar */}
            <div className="space-y-4">
              {/* Live Chat */}
              <div className="glass-panel gold-border rounded-xl flex flex-col" style={{ height: 380 }}>
                <div className="p-3 border-b border-white/10 flex items-center gap-2">
                  <Wifi size={14} style={{ color: 'var(--green-primary)' }} />
                  <span className="text-sm font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Live Chat</span>
                  <span className="ml-auto text-xs text-gray-500">{selected.viewers} watching</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {CHAT_MSGS.map((c, i) => (
                    <div key={i}>
                      <span className="text-xs font-bold" style={{ color: 'var(--gold-primary)' }}>{c.name}: </span>
                      <span className="text-xs text-gray-300">{c.msg}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-white/10 flex gap-2">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    placeholder="Send a message..."
                    className="flex-1 bg-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-green-500/50" />
                  <button onClick={() => setChatInput('')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white"
                    style={{ background: 'var(--green-primary)' }}>Send</button>
                </div>
              </div>

              {/* Match Stats */}
              <div className="glass-panel rounded-xl p-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="text-sm font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Match Stats</span>
                </div>
                {[
                  ['Current Break', '87'],
                  ['Highest Break', '112'],
                  ['Total Pots', '43'],
                  ['Fouls', '3'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-xs">{k}</span>
                    <span className="text-white text-xs font-bold" style={{ fontFamily: 'Rajdhani' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
