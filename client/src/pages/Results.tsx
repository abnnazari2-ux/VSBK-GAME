import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Star, RotateCcw, Home, ChevronRight } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import TopNav from '../components/layout/TopNav';
import GoldButton from '../components/ui/GoldButton';
import GreenButton from '../components/ui/GreenButton';
import PlayerAvatar from '../components/ui/PlayerAvatar';

export default function Results() {
  const navigate = useNavigate();
  const { matchResult, localPlayer } = useGameStore();

  const result = matchResult ?? {
    winner: localPlayer.name,
    loser: 'BreakBuilder',
    winnerScore: 3,
    loserScore: 1,
    frames: [
      { winner: localPlayer.name, scores: [87, 34] },
      { winner: 'BreakBuilder', scores: [45, 112] },
      { winner: localPlayer.name, scores: [78, 21] },
      { winner: localPlayer.name, scores: [66, 43] },
    ],
    stats: {
      highestBreak: 87,
      totalPoints: 276,
      accuracy: 72,
      fouls: 2,
      longestStreak: 5,
    },
    rankChange: +18,
    xpGained: 450,
    coinsEarned: 120,
  };

  const isWinner = result.winner === localPlayer.name;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-4xl mx-auto">
        {/* Victory Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="text-center mb-8">
          <motion.div animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1, delay: 0.3 }}
            className="text-8xl mb-4">
            {isWinner ? '🏆' : '🎱'}
          </motion.div>
          <h1 className="text-5xl font-bold mb-2" style={{
            fontFamily: 'Playfair Display',
            color: isWinner ? 'var(--gold-primary)' : '#94a3b8',
          }}>
            {isWinner ? 'Victory!' : 'Well Played'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isWinner ? 'Outstanding performance on the table!' : 'A hard-fought match — better luck next time!'}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel gold-border rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <PlayerAvatar name={result.winner} rank="Grand Master" size="lg" status="online" />
              <p className="font-bold text-white mt-3" style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem' }}>{result.winner}</p>
              <p className="text-gray-400 text-sm">Winner</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-6xl font-black" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>
                  {result.winnerScore}
                </span>
                <span className="text-3xl text-gray-600 font-bold">:</span>
                <span className="text-6xl font-black text-gray-400" style={{ fontFamily: 'Rajdhani' }}>
                  {result.loserScore}
                </span>
              </div>
              <p className="text-gray-500 text-sm">Frames</p>
            </div>
            <div className="text-center">
              <PlayerAvatar name={result.loser} rank="Master" size="lg" status="online" />
              <p className="font-bold text-white mt-3" style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem' }}>{result.loser}</p>
              <p className="text-gray-400 text-sm">Runner-up</p>
            </div>
          </div>

          {/* Frame breakdown */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-3">Frame Breakdown</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {result.frames.map((f: any, i: number) => (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold ${
                    f.winner === result.winner ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-white/5 text-gray-400'
                  }`}>
                    <span>F{i + 1}</span>
                    <span>{f.scores.join('-')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats + Rewards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Match Stats */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="glass-panel gold-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} style={{ color: 'var(--gold-primary)' }} />
              <h3 className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Your Stats</h3>
            </div>
            <div className="space-y-3">
              {[
                ['Highest Break', result.stats.highestBreak, 'pts'],
                ['Total Points', result.stats.totalPoints, 'pts'],
                ['Shot Accuracy', result.stats.accuracy, '%'],
                ['Fouls', result.stats.fouls, ''],
                ['Longest Streak', result.stats.longestStreak, ' pots'],
              ].map(([label, val, unit]) => (
                <div key={label as string} className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>
                    {val}{unit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rewards */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="glass-panel gold-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} style={{ color: 'var(--gold-primary)' }} />
              <h3 className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Rewards Earned</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Experience Points</p>
                    <p className="text-gray-400 text-xs">Progress towards Level {localPlayer.level + 1}</p>
                  </div>
                </div>
                <span className="font-black" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani', fontSize: '1.3rem' }}>+{result.xpGained}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Coins</p>
                    <p className="text-gray-400 text-xs">Spend in the Store</p>
                  </div>
                </div>
                <span className="font-black" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani', fontSize: '1.3rem' }}>+{result.coinsEarned}</span>
              </div>
              {isWinner && (
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={22} style={{ color: 'var(--green-primary)' }} />
                    <div>
                      <p className="text-white font-semibold text-sm">Rank Points</p>
                      <p className="text-gray-400 text-xs">Grand Master Division</p>
                    </div>
                  </div>
                  <span className="font-black text-green-400" style={{ fontFamily: 'Rajdhani', fontSize: '1.3rem' }}>+{result.rankChange}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center">
          <GreenButton onClick={() => navigate('/match-setup')} size="lg">
            <RotateCcw size={18} /> Play Again
          </GreenButton>
          <GoldButton onClick={() => navigate('/')} size="lg">
            <Home size={18} /> Dashboard <ChevronRight size={16} />
          </GoldButton>
        </motion.div>
      </div>
    </div>
  );
}
