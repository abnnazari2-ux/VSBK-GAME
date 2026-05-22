import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Check, Send, Crown, Shield, Play, LogOut, Wifi } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../hooks/useSocket';
import TopNav from '../components/layout/TopNav';
import GoldButton from '../components/ui/GoldButton';
import GreenButton from '../components/ui/GreenButton';
import PlayerAvatar from '../components/ui/PlayerAvatar';

export default function Lobby() {
  const navigate = useNavigate();
  const { localPlayer, currentRoom } = useGameStore();
  const { setReady, startMatch, sendChatMessage, leaveRoom } = useSocket();
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const players = currentRoom?.players ?? [];
  const isHost = players[0]?.id === localPlayer.id;
  const allReady = players.length === 2 && players.every(p => p.isReady);

  useEffect(() => {
    if (!currentRoom) navigate('/');
  }, [currentRoom, navigate]);

  const handleReady = () => {
    setIsReady(v => !v);
    setReady({ roomCode: currentRoom?.code });
  };

  const handleStart = () => {
    startMatch({ roomCode: currentRoom?.code });
    navigate('/game');
  };

  const handleLeave = () => {
    leaveRoom({ roomCode: currentRoom?.code });
    navigate('/');
  };

  const copyCode = () => {
    if (currentRoom?.code) {
      navigator.clipboard.writeText(currentRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendChat = () => {
    if (!chatInput.trim() || !currentRoom?.code) return;
    sendChatMessage({ roomCode: currentRoom.code, message: chatInput.trim() });
    setChatInput('');
  };

  const messages = currentRoom?.chat ?? [];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani', color: 'var(--gold-primary)' }}>Match Lobby</h1>
              <p className="text-gray-400">{currentRoom?.name ?? 'Loading...'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-panel px-4 py-2 rounded-lg gold-border flex items-center gap-2">
                <span className="text-gray-400 text-sm">Room:</span>
                <span className="font-bold tracking-widest" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{currentRoom?.code ?? '----'}</span>
                <button onClick={copyCode} className="p-1 rounded hover:bg-white/10 transition-colors">
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
                </button>
              </div>
              <button onClick={handleLeave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm">
                <LogOut size={16} /> Leave
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel p-6 gold-border rounded-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Users size={18} style={{ color: 'var(--gold-primary)' }} />
                  <span className="font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Players ({players.length}/2)</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[0, 1].map(idx => {
                    const p = players[idx];
                    return (
                      <motion.div key={idx}
                        className={`rounded-xl p-5 text-center transition-all ${p ? 'bg-white/5' : 'border-2 border-dashed border-white/10'}`}
                        animate={p?.isReady ? { boxShadow: '0 0 20px rgba(34,197,94,0.3)' } : {}}>
                        {p ? (
                          <>
                            <div className="flex justify-center mb-3"><PlayerAvatar name={p.name} rank={p.rank as any} size="lg" status="online" /></div>
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {idx === 0 && <Crown size={14} style={{ color: 'var(--gold-primary)' }} />}
                              <span className="font-bold text-white" style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem' }}>{p.name}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{p.rank} · Lv {p.level}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.isReady ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                              {p.isReady ? 'READY' : 'NOT READY'}
                            </span>
                          </>
                        ) : (
                          <div className="py-8">
                            <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-3">
                              <Users size={24} className="text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm">Waiting for opponent...</p>
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-yellow-400 mx-auto mt-3" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10 flex gap-3">
                  <GreenButton onClick={handleReady} className="flex-1" outlined={isReady}>
                    <Shield size={16} /> {isReady ? 'Cancel Ready' : 'Ready Up'}
                  </GreenButton>
                  {isHost && (
                    <GoldButton onClick={handleStart} disabled={!allReady} className="flex-1">
                      <Play size={16} /> Start Match
                    </GoldButton>
                  )}
                </div>
              </div>

              <div className="glass-panel p-5 gold-border rounded-xl">
                <h3 className="font-semibold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>Match Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['Format', `Best of ${currentRoom?.settings?.maxFrames ?? 3}`],
                    ['Timer', currentRoom?.settings?.turnTimer ? `${currentRoom.settings.turnTimer}s` : 'No Limit'],
                    ['Theme', currentRoom?.settings?.theme ?? 'Classic'],
                  ].map(([k, v]) => (
                    <div key={k} className="text-center bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">{k}</p>
                      <p className="text-white font-semibold text-sm">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel gold-border rounded-xl flex flex-col" style={{ height: '420px' }}>
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <Wifi size={16} style={{ color: 'var(--green-primary)' }} />
                <span className="font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Live Chat</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {messages.map((m: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${m.playerId === localPlayer.id ? 'items-end' : 'items-start'}`}>
                      <span className="text-xs text-gray-500 mb-1">{m.playerName}</span>
                      <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${m.playerId === localPlayer.id ? 'bg-green-600/20 text-green-100' : 'bg-white/10 text-gray-200'}`}>
                        {m.message}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {messages.length === 0 && <p className="text-center text-gray-600 text-sm mt-8">Say hello to your opponent!</p>}
              </div>
              <div className="p-3 border-t border-white/10 flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-green-500/50" />
                <button onClick={sendChat} className="p-2 rounded-lg" style={{ background: 'var(--green-primary)' }}>
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
