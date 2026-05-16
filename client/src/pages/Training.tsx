import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, Star, Play, Lock, ChevronRight } from 'lucide-react';
import TopNav from '../components/layout/TopNav';
import GoldButton from '../components/ui/GoldButton';
import ProgressBar from '../components/ui/ProgressBar';

const DRILLS = [
  {
    id: 1, title: 'Long Pot Mastery', category: 'Potting',
    desc: 'Master long-distance shots across the full table length',
    icon: Target, difficulty: 'Beginner', xp: 50, progress: 80, locked: false,
  },
  {
    id: 2, title: 'Power Break Shots', category: 'Break Building',
    desc: 'Learn to control power for consistent break building',
    icon: Zap, difficulty: 'Intermediate', xp: 100, progress: 45, locked: false,
  },
  {
    id: 3, title: 'Safety Play Tactics', category: 'Safety',
    desc: 'Strategic safety shots to control the game tempo',
    icon: Shield, difficulty: 'Advanced', xp: 150, progress: 20, locked: false,
  },
  {
    id: 4, title: 'Century Break Challenge', category: 'Advanced',
    desc: 'Build up to the coveted 100-point break',
    icon: Star, difficulty: 'Expert', xp: 300, progress: 0, locked: true,
  },
  {
    id: 5, title: 'Cushion Cannon Shots', category: 'Technique',
    desc: 'Use the cushion to reach otherwise impossible positions',
    icon: Target, difficulty: 'Intermediate', xp: 120, progress: 60, locked: false,
  },
  {
    id: 6, title: 'Maximum Break: 147', category: 'Advanced',
    desc: 'The ultimate challenge — pot every ball in sequence',
    icon: Star, difficulty: 'Legend', xp: 1000, progress: 0, locked: true,
  },
];

const DIFF_COLORS: Record<string, string> = {
  Beginner: '#22c55e',
  Intermediate: '#3b82f6',
  Advanced: '#f59e0b',
  Expert: '#ef4444',
  Legend: '#d4af37',
};

export default function Training() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Rajdhani', color: 'var(--gold-primary)' }}>Training Academy</h1>
          <p className="text-gray-400 mb-8">Sharpen your skills with focused practice drills</p>

          {/* Progress Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Drills Completed', value: '12/24' },
              { label: 'XP from Training', value: '2,450' },
              { label: 'Current Streak', value: '7 days' },
            ].map(s => (
              <div key={s.label} className="glass-panel gold-border rounded-xl p-5 text-center">
                <p className="text-2xl font-black" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{s.value}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Drills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DRILLS.map((drill, i) => (
              <motion.div key={drill.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => !drill.locked && setSelected(selected === drill.id ? null : drill.id)}
                className={`glass-panel rounded-xl p-5 transition-all ${
                  drill.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'
                } ${ selected === drill.id ? 'gold-border' : 'border border-white/10' }`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: drill.locked ? '#374151' : DIFF_COLORS[drill.difficulty] + '20' }}>
                    {drill.locked
                      ? <Lock size={20} className="text-gray-500" />
                      : <drill.icon size={20} style={{ color: DIFF_COLORS[drill.difficulty] }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{drill.title}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: DIFF_COLORS[drill.difficulty] + '20', color: DIFF_COLORS[drill.difficulty] }}>
                        {drill.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{drill.desc}</p>
                    {!drill.locked && (
                      <>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span style={{ color: 'var(--gold-primary)' }}>{drill.progress}%</span>
                        </div>
                        <ProgressBar value={drill.progress} color={drill.progress > 60 ? 'green' : 'gold'} height="sm" />
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>+{drill.xp} XP</p>
                  </div>
                </div>

                {selected === drill.id && !drill.locked && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10">
                    <GoldButton onClick={() => navigate('/game')} className="w-full" size="md">
                      <Play size={16} /> Start Drill <ChevronRight size={16} />
                    </GoldButton>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
