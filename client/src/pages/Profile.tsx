import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Calendar, Edit3, Award, Star, Zap } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import TopNav from '../components/layout/TopNav';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import RankBadge from '../components/ui/RankBadge';
import StatTile from '../components/ui/StatTile';
import ProgressBar from '../components/ui/ProgressBar';

const TABS = ['Overview', 'Statistics', 'Achievements', 'Match History'];

const ACHIEVEMENTS = [
  { icon: '🎱', name: 'Century Break', desc: 'Score 100+ in a single break', earned: true },
  { icon: '⚡', name: 'Lightning Potter', desc: 'Pot 5 balls in under 60 seconds', earned: true },
  { icon: '🏆', name: 'Grand Master', desc: 'Reach Grand Master rank', earned: true },
  { icon: '🎯', name: 'Perfect Aim', desc: 'Complete a frame without fouls', earned: true },
  { icon: '🔥', name: 'Hot Streak', desc: 'Win 10 matches in a row', earned: false },
  { icon: '💎', name: 'Diamond Break', desc: 'Score 147 maximum break', earned: false },
];

const HISTORY = [
  { opponent: 'BreakBuilder', result: 'W', score: '3-1', date: 'Today', points: '+18' },
  { opponent: 'CueKing99', result: 'W', score: '3-0', date: 'Yesterday', points: '+21' },
  { opponent: 'PinkPotter', result: 'L', score: '1-3', date: '2 days ago', points: '-12' },
  { opponent: 'SilkShot', result: 'W', score: '3-2', date: '3 days ago', points: '+15' },
  { opponent: 'BlackBall', result: 'W', score: '3-1', date: '4 days ago', points: '+17' },
];

export default function Profile() {
  const { localPlayer } = useGameStore();
  const [tab, setTab] = useState('Overview');

  const xpPercent = 68;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel gold-border rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <PlayerAvatar name={localPlayer.name} rank={localPlayer.rank} size="lg" status="online" />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gray-800 border border-gold flex items-center justify-center hover:bg-gray-700 transition-colors"
                style={{ borderColor: 'var(--gold-primary)' }}>
                <Edit3 size={12} style={{ color: 'var(--gold-primary)' }} />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{localPlayer.name}</h1>
                <RankBadge rank={localPlayer.rank} size="md" />
              </div>
              <p className="text-gray-400 mb-4">Level {localPlayer.level} · Joined March 2023 · UK</p>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">Level Progress</span>
                <span className="text-sm" style={{ color: 'var(--gold-primary)' }}>6,800 / 10,000 XP</span>
              </div>
              <ProgressBar value={xpPercent} color="gold" height="md" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                ['2,847', 'Rank Points'],
                ['342', 'Matches'],
                ['247', 'Wins'],
                ['72%', 'Win Rate'],
              ].map(([val, lbl]) => (
                <div key={lbl} className="bg-white/5 rounded-lg p-3">
                  <p className="font-black text-xl" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{val}</p>
                  <p className="text-gray-400 text-xs">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? 'text-black' : 'text-gray-400 hover:text-white'
              }`}
              style={tab === t ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)' } : {}}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'Overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatTile label="Highest Break" value="134" icon={Trophy} color="gold" trend="up" />
            <StatTile label="Total Points" value="48,293" icon={Target} color="green" trend="up" />
            <StatTile label="Avg Break" value="47.2" icon={TrendingUp} color="green" trend="up" />
            <StatTile label="Frames Won" value="68%" icon={Star} color="gold" trend="neutral" />
          </motion.div>
        )}

        {tab === 'Statistics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Shot Accuracy', value: 72, unit: '%' },
              { label: 'Safety Success', value: 65, unit: '%' },
              { label: 'Long Pot Rate', value: 48, unit: '%' },
              { label: 'Free Ball Conversion', value: 89, unit: '%' },
            ].map(s => (
              <div key={s.label} className="glass-panel p-5 gold-border rounded-xl">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-300">{s.label}</span>
                  <span className="font-bold" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{s.value}{s.unit}</span>
                </div>
                <ProgressBar value={s.value} color="green" height="sm" />
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'Achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map(a => (
              <div key={a.name} className={`glass-panel p-5 rounded-xl flex items-center gap-4 ${
                a.earned ? 'gold-border' : 'opacity-50'
              }`}>
                <span className="text-3xl">{a.icon}</span>
                <div className="flex-1">
                  <p className={`font-bold ${ a.earned ? 'text-white' : 'text-gray-500' }`} style={{ fontFamily: 'Rajdhani' }}>{a.name}</p>
                  <p className="text-gray-400 text-sm">{a.desc}</p>
                </div>
                {a.earned && <Award size={20} style={{ color: 'var(--gold-primary)' }} />}
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'Match History' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel gold-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Opponent', 'Result', 'Score', 'Date', 'Points'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-gray-400 text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((m, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{m.opponent}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        m.result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>{m.result}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{m.score}</td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{m.date}</td>
                    <td className={`px-5 py-4 font-bold ${ m.points.startsWith('+') ? 'text-green-400' : 'text-red-400' }`}
                      style={{ fontFamily: 'Rajdhani' }}>{m.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
