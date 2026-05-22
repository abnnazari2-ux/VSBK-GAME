import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, Users, Clock, Target, Layers, ChevronRight, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../hooks/useSocket';
import TopNav from '../components/layout/TopNav';
import GoldButton from '../components/ui/GoldButton';
import GreenButton from '../components/ui/GreenButton';

const THEMES = ['Classic Green', 'Midnight Blue', 'Royal Purple', 'Desert Sand'];
const FRAME_OPTIONS = [1, 3, 5, 7, 9];
const TIMER_OPTIONS = ['No Limit', '30s', '45s', '60s'];

export default function CreateRoom() {
  const navigate = useNavigate();
  const { localPlayer, currentRoom } = useGameStore();
  const { createRoom } = useSocket();
  const [frames, setFrames] = useState(3);
  const [timer, setTimer] = useState('45s');
  const [theme, setTheme] = useState('Classic Green');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('private');
  const [allowSpectators, setAllowSpectators] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const roomCode = currentRoom?.code;

  const handleCreate = () => {
    setCreating(true);
    createRoom({
      name: `${localPlayer.name}'s Room`,
      playerName: localPlayer.name,
      isPrivate: privacy === 'private',
      region: 'EU',
      settings: {
        maxFrames: frames,
        turnTimer: timer === 'No Limit' ? 0 : parseInt(timer),
        theme: theme as any,
        frames,
        allowSpectators,
      },
    });
    setTimeout(() => navigate('/lobby'), 800);
  };

  const copyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button onClick={() => navigate('/match-setup')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Match Setup
          </button>

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Rajdhani', color: 'var(--gold-primary)' }}>Create Private Room</h1>
          <p className="text-gray-400 mb-8">Configure your match settings and invite a friend</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings */}
            <div className="lg:col-span-2 space-y-5">
              {/* Frames */}
              <div className="glass-panel p-5 gold-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} style={{ color: 'var(--gold-primary)' }} />
                  <span className="font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Best of Frames</span>
                </div>
                <div className="flex gap-3">
                  {FRAME_OPTIONS.map(f => (
                    <button key={f} onClick={() => setFrames(f)}
                      className="flex-1 py-2.5 rounded-lg font-bold transition-all text-sm"
                      style={frames === f ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)', color: '#000' } : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="glass-panel p-5 gold-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} style={{ color: 'var(--gold-primary)' }} />
                  <span className="font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Turn Timer</span>
                </div>
                <div className="flex gap-3">
                  {TIMER_OPTIONS.map(t => (
                    <button key={t} onClick={() => setTimer(t)}
                      className="flex-1 py-2.5 rounded-lg font-bold transition-all text-sm"
                      style={timer === t ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)', color: '#000' } : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="glass-panel p-5 gold-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={18} style={{ color: 'var(--gold-primary)' }} />
                  <span className="font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Table Theme</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      className="py-2.5 rounded-lg font-medium transition-all text-sm"
                      style={theme === t ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)', color: '#000' } : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="glass-panel p-5 gold-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} style={{ color: 'var(--gold-primary)' }} />
                  <span className="font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Room Options</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Room Privacy</span>
                    <div className="flex gap-2">
                      {(['public', 'private'] as const).map(p => (
                        <button key={p} onClick={() => setPrivacy(p)}
                          className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                          style={privacy === p ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)', color: '#000' } : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Allow Spectators</span>
                    <button onClick={() => setAllowSpectators(v => !v)}
                      className="w-12 h-6 rounded-full transition-all relative"
                      style={{ background: allowSpectators ? 'var(--green-primary)' : '#374151' }}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${ allowSpectators ? 'left-6' : 'left-0.5' }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-5">
              <div className="glass-panel p-5 gold-border rounded-xl">
                <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem' }}>Match Summary</h3>
                {[
                  ['Mode', 'Best of ' + frames],
                  ['Timer', timer],
                  ['Theme', theme],
                  ['Privacy', privacy],
                  ['Spectators', allowSpectators ? 'Allowed' : 'Disabled'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-sm">{k}</span>
                    <span className="text-white text-sm font-medium capitalize">{v}</span>
                  </div>
                ))}
              </div>

              {roomCode && (
                <div className="glass-panel p-5 rounded-xl" style={{ border: '1px solid var(--green-primary)' }}>
                  <p className="text-gray-400 text-sm mb-2">Room Code</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-widest" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{roomCode}</span>
                    <button onClick={copyCode} className="ml-auto p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">Share this code with your opponent</p>
                </div>
              )}

              <GoldButton onClick={handleCreate} loading={creating} className="w-full" size="lg">
                <ChevronRight size={18} /> Create Room
              </GoldButton>
              <GreenButton onClick={() => navigate('/match-setup')} outlined className="w-full" size="md">
                Cancel
              </GreenButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
