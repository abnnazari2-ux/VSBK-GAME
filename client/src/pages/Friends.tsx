import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, MessageCircle, Gamepad2, Trophy, Users } from 'lucide-react';
import TopNav from '../components/layout/TopNav';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import GreenButton from '../components/ui/GreenButton';

const FRIENDS = [
  { name: 'BreakBuilder', rank: 'Master', level: 38, status: 'online', wins: 210, playing: false },
  { name: 'CueKing99', rank: 'Expert', level: 29, status: 'inMatch', wins: 145, playing: true },
  { name: 'PinkPotter', rank: 'Pro', level: 17, status: 'online', wins: 82, playing: false },
  { name: 'SilkShot', rank: 'Grand Master', level: 52, status: 'offline', wins: 389, playing: false },
  { name: 'BlackBall', rank: 'Master', level: 41, status: 'online', wins: 278, playing: false },
  { name: 'FrameMaster', rank: 'Expert', level: 33, status: 'offline', wins: 163, playing: false },
];

const REQUESTS = [
  { name: 'NoviceNick', rank: 'Amateur', level: 5, status: 'online' as const },
  { name: 'TableTom', rank: 'Pro', level: 22, status: 'online' as const },
];

const TABS = ['All Friends', 'Online', 'Requests'];

export default function Friends() {
  const [tab, setTab] = useState('All Friends');
  const [search, setSearch] = useState('');
  const [addInput, setAddInput] = useState('');

  const online = FRIENDS.filter(f => f.status !== 'offline');
  const displayed = (tab === 'Online' ? online : FRIENDS).filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani', color: 'var(--gold-primary)' }}>Friends</h1>
              <p className="text-gray-400">{online.length} online · {FRIENDS.length} total</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <input value={addInput} onChange={e => setAddInput(e.target.value)}
                  placeholder="Add by username..."
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 pr-24" />
                <button className="absolute right-1 top-1 px-3 py-1.5 rounded-md text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #c9a227, #f5c842)' }}>
                  <UserPlus size={12} className="inline mr-1" />Add
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Friends List */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-5">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      tab === t ? 'text-black' : 'text-gray-400 hover:text-white'
                    }`}
                    style={tab === t ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)' } : {}}>
                    {t}{t === 'Requests' && REQUESTS.length > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{REQUESTS.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search friends..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50" />
              </div>

              <AnimatePresence mode="popLayout">
                {tab !== 'Requests' ? displayed.map((f, i) => (
                  <motion.div key={f.name} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-panel rounded-xl p-4 mb-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <PlayerAvatar name={f.name} rank={f.rank as any} size="md" status={f.status as any} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{f.name}</p>
                      <p className="text-gray-400 text-sm">{f.rank} · Lv {f.level} · {f.wins} wins</p>
                    </div>
                    {f.status === 'inMatch' && (
                      <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">In Match</span>
                    )}
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <MessageCircle size={16} className="text-gray-400" />
                      </button>
                      {f.status !== 'offline' && (
                        <button className="p-2 rounded-lg bg-green-600/10 hover:bg-green-600/20 transition-colors">
                          <Gamepad2 size={16} style={{ color: 'var(--green-primary)' }} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )) : REQUESTS.map((r, i) => (
                  <motion.div key={r.name} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel gold-border rounded-xl p-4 mb-3 flex items-center gap-4">
                    <PlayerAvatar name={r.name} rank={r.rank as any} size="md" status={r.status} />
                    <div className="flex-1">
                      <p className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{r.name}</p>
                      <p className="text-gray-400 text-sm">{r.rank} · Lv {r.level}</p>
                    </div>
                    <div className="flex gap-2">
                      <GreenButton size="sm">Accept</GreenButton>
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 text-sm transition-colors">Decline</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {tab !== 'Requests' && displayed.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No friends found</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="glass-panel gold-border rounded-xl p-5">
                <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Leaderboard</h3>
                {FRIENDS.sort((a, b) => b.wins - a.wins).slice(0, 5).map((f, i) => (
                  <div key={f.name} className="flex items-center gap-3 mb-3 last:mb-0">
                    <span className="w-5 text-sm font-bold" style={{ color: i === 0 ? 'var(--gold-primary)' : 'var(--text-muted)' }}>#{i + 1}</span>
                    <PlayerAvatar name={f.name} rank={f.rank as any} size="sm" status={f.status as any} />
                    <span className="flex-1 text-sm text-white">{f.name}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{f.wins}W</span>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-xl p-5" style={{ border: '1px solid var(--green-primary)30' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={16} style={{ color: 'var(--gold-primary)' }} />
                  <h3 className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Recent Activity</h3>
                </div>
                {[
                  { msg: 'BreakBuilder won a match', time: '2m ago' },
                  { msg: 'CueKing99 reached Expert rank', time: '1h ago' },
                  { msg: 'BlackBall scored a 134 break', time: '3h ago' },
                ].map((a, i) => (
                  <p key={i} className="text-xs text-gray-400 mb-2">
                    <span className="text-gray-200">{a.msg}</span> · {a.time}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
