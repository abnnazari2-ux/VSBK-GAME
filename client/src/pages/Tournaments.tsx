import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, Clock, ChevronRight, Star, Lock } from 'lucide-react';
import TopNav from '../components/layout/TopNav';
import GoldButton from '../components/ui/GoldButton';
import GreenButton from '../components/ui/GreenButton';

const TOURNAMENTS = [
  {
    id: 1, name: 'Grand Masters Cup', type: 'Ranked', status: 'registering',
    prize: '10,000', entryFee: 500, players: 48, maxPlayers: 64,
    startTime: 'Starts in 2h', format: 'Single Elimination', minRank: 'Grand Master',
    icon: '🏆', color: '#d4af37', featured: true,
  },
  {
    id: 2, name: 'Weekend Classic', type: 'Open', status: 'registering',
    prize: '2,500', entryFee: 100, players: 112, maxPlayers: 128,
    startTime: 'Starts in 6h', format: 'Round Robin', minRank: 'Amateur',
    icon: '🎱', color: '#22c55e', featured: false,
  },
  {
    id: 3, name: 'Pro Circuit Season 3', type: 'Ranked', status: 'live',
    prize: '5,000', entryFee: 250, players: 64, maxPlayers: 64,
    startTime: 'LIVE NOW', format: 'Double Elimination', minRank: 'Pro',
    icon: '⚡', color: '#ef4444', featured: false,
  },
  {
    id: 4, name: 'Legends Invitational', type: 'Invite Only', status: 'upcoming',
    prize: '25,000', entryFee: 0, players: 8, maxPlayers: 8,
    startTime: 'Starts in 3 days', format: 'Round Robin + Finals', minRank: 'Legend',
    icon: '👑', color: '#7c3aed', featured: false,
  },
];

const MY_TOURNAMENTS = [
  { name: 'Weekend Classic', placement: 'Round of 32', status: 'Eliminated', date: '2 days ago' },
  { name: 'Spring Open', placement: 'Runner-up', status: 'Completed', date: '1 week ago' },
];

export default function Tournaments() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'browse' | 'my'>('browse');
  const [registering, setRegistering] = useState<number | null>(null);

  const handleRegister = (id: number) => {
    setRegistering(id);
    setTimeout(() => setRegistering(null), 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani', color: 'var(--gold-primary)' }}>Tournaments</h1>
              <p className="text-gray-400">Compete for glory and massive prize pools</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTab('browse')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === 'browse' ? 'text-black' : 'text-gray-400 bg-white/5 hover:bg-white/10'
                }`}
                style={tab === 'browse' ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)' } : {}}>
                Browse
              </button>
              <button onClick={() => setTab('my')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === 'my' ? 'text-black' : 'text-gray-400 bg-white/5 hover:bg-white/10'
                }`}
                style={tab === 'my' ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)' } : {}}>
                My Tournaments
              </button>
            </div>
          </div>

          {tab === 'browse' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {TOURNAMENTS.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-panel rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${t.color}40` }}>
                  {t.featured && (
                    <div className="px-5 py-2 flex items-center gap-2"
                      style={{ background: `linear-gradient(90deg, ${t.color}20, transparent)` }}>
                      <Star size={12} style={{ color: t.color }} />
                      <span className="text-xs font-bold tracking-widest" style={{ color: t.color }}>FEATURED TOURNAMENT</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ background: t.color + '15', border: `1px solid ${t.color}30` }}>
                        {t.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h2 className="font-bold text-white text-xl" style={{ fontFamily: 'Rajdhani' }}>{t.name}</h2>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: t.color + '20', color: t.color }}>{t.type}</span>
                          {t.status === 'live' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-5 text-sm text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1.5"><Users size={13} />{t.players}/{t.maxPlayers} players</span>
                          <span className="flex items-center gap-1.5"><Calendar size={13} />{t.format}</span>
                          <span className="flex items-center gap-1.5"><Clock size={13} />{t.startTime}</span>
                          <span className="flex items-center gap-1.5"><Lock size={13} />Min: {t.minRank}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-1">Prize Pool</p>
                        <p className="font-black text-2xl" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>
                          🪙 {t.prize}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t.entryFee > 0 ? `Entry: 🪙 ${t.entryFee}` : 'Free Entry'}
                        </p>
                      </div>
                    </div>

                    {/* Player progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Registration</span>
                        <span>{t.players}/{t.maxPlayers}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${(t.players / t.maxPlayers) * 100}%`, background: t.color }} />
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      {t.status === 'live' ? (
                        <GreenButton onClick={() => navigate('/live-hub')} size="md">
                          Watch Live <ChevronRight size={16} />
                        </GreenButton>
                      ) : t.status === 'registering' ? (
                        <GoldButton
                          onClick={() => handleRegister(t.id)}
                          loading={registering === t.id}
                          size="md">
                          Register Now <ChevronRight size={16} />
                        </GoldButton>
                      ) : (
                        <button disabled className="px-5 py-2.5 rounded-lg bg-white/5 text-gray-500 text-sm font-medium cursor-not-allowed">
                          Invite Only
                        </button>
                      )}
                      <button className="px-4 py-2.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 text-sm transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'my' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {MY_TOURNAMENTS.length === 0 ? (
                <div className="text-center py-24 text-gray-500">
                  <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No tournaments yet</p>
                  <p className="text-sm mt-1">Register for a tournament to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {MY_TOURNAMENTS.map((t, i) => (
                    <div key={i} className="glass-panel gold-border rounded-xl p-5 flex items-center gap-5">
                      <Trophy size={28} style={{ color: 'var(--gold-primary)' }} />
                      <div className="flex-1">
                        <p className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{t.name}</p>
                        <p className="text-gray-400 text-sm">{t.placement} · {t.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
