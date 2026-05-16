import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Sparkles, Package, Tag } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import TopNav from '../components/layout/TopNav';
import GoldButton from '../components/ui/GoldButton';

const CATEGORIES = ['All', 'Cue Tips', 'Table Themes', 'Avatars', 'Effects', 'Bundles'];

const ITEMS = [
  { id: 1, name: 'Diamond Cue Tip', category: 'Cue Tips', price: 800, rarity: 'Legendary', icon: '💎', owned: false, desc: 'Precision-cut diamond tip for maximum accuracy' },
  { id: 2, name: 'Royal Blue Table', category: 'Table Themes', price: 500, rarity: 'Epic', icon: '🎱', owned: true, desc: 'Stunning royal blue baize for a premium feel' },
  { id: 3, name: 'Crimson Master', category: 'Avatars', price: 300, rarity: 'Rare', icon: '👤', owned: false, desc: 'Exclusive avatar for elite players' },
  { id: 4, name: 'Golden Trail Effect', category: 'Effects', price: 650, rarity: 'Epic', icon: '✨', owned: false, desc: 'Leave a golden trail with every shot' },
  { id: 5, name: 'Midnight Bundle', category: 'Bundles', price: 1200, rarity: 'Legendary', icon: '🌙', owned: false, desc: 'Midnight table + matching cue + dark avatar' },
  { id: 6, name: 'Classic Oak Cue', category: 'Cue Tips', price: 200, rarity: 'Common', icon: '🎯', owned: true, desc: 'A timeless classic for the purists' },
  { id: 7, name: 'Emerald Isle Table', category: 'Table Themes', price: 450, rarity: 'Rare', icon: '💚', owned: false, desc: 'Deep emerald baize inspired by tournament greens' },
  { id: 8, name: 'Fire Shot Effect', category: 'Effects', price: 750, rarity: 'Epic', icon: '🔥', owned: false, desc: 'Engulf every potted ball in flames' },
];

const RARITY_COLORS: Record<string, string> = {
  Common: '#9ca3af',
  Rare: '#60a5fa',
  Epic: '#a78bfa',
  Legendary: '#d4af37',
};

export default function Store() {
  const { localPlayer } = useGameStore();
  const [category, setCategory] = useState('All');
  const [purchasing, setPurchasing] = useState<number | null>(null);

  const coins = 2480;
  const filtered = category === 'All' ? ITEMS : ITEMS.filter(i => i.category === category);

  const handleBuy = (id: number, price: number) => {
    if (coins < price) return;
    setPurchasing(id);
    setTimeout(() => setPurchasing(null), 1200);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TopNav />
      <div className="pt-20 px-6 pb-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Rajdhani', color: 'var(--gold-primary)' }}>Item Store</h1>
              <p className="text-gray-400">Customize your game with exclusive items</p>
            </div>
            <div className="glass-panel gold-border px-5 py-3 rounded-xl flex items-center gap-3">
              <span className="text-xl">🪙</span>
              <div>
                <p className="text-xs text-gray-400">Your Balance</p>
                <p className="font-black text-xl" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{coins.toLocaleString()}</p>
              </div>
              <button className="ml-4 px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                style={{ background: 'linear-gradient(135deg, #c9a227, #f5c842)' }}>
                + Add Coins
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d2000 50%, #1a0a00 100%)', border: '1px solid var(--gold-primary)' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 70% 50%, var(--gold-primary) 0%, transparent 60%)'
          }} />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
                <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--gold-primary)' }}>LIMITED TIME OFFER</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display' }}>The Championship Pack</h2>
              <p className="text-gray-400 mb-4">3 legendary cues + Golden Table Theme + Champion Avatar</p>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 line-through text-sm">🪙 3,500</span>
                <span className="text-2xl font-black" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>🪙 2,100</span>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-bold">40% OFF</span>
              </div>
            </div>
            <div className="text-7xl">🏆</div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                category === c ? 'text-black' : 'text-gray-400 bg-white/5 hover:bg-white/10'
              }`}
              style={category === c ? { background: 'linear-gradient(135deg, #c9a227, #f5c842)' } : {}}>
              {c}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl overflow-hidden flex flex-col"
              style={{ border: `1px solid ${RARITY_COLORS[item.rarity]}30` }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              {/* Item Image */}
              <div className="h-40 flex items-center justify-center text-6xl relative"
                style={{ background: `linear-gradient(135deg, ${RARITY_COLORS[item.rarity]}10, transparent)` }}>
                {item.icon}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: RARITY_COLORS[item.rarity] + '25', color: RARITY_COLORS[item.rarity] }}>
                    {item.rarity}
                  </span>
                </div>
                {item.owned && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                    Owned
                  </div>
                )}
              </div>
              {/* Item Info */}
              <div className="p-4 flex-1 flex flex-col">
                <p className="font-bold text-white mb-1" style={{ fontFamily: 'Rajdhani' }}>{item.name}</p>
                <p className="text-gray-400 text-xs flex-1 mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🪙</span>
                    <span className="font-black" style={{ color: 'var(--gold-primary)', fontFamily: 'Rajdhani' }}>{item.price.toLocaleString()}</span>
                  </div>
                  {item.owned ? (
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-600/10 text-green-500">Equipped</span>
                  ) : (
                    <button onClick={() => handleBuy(item.id, item.price)}
                      disabled={coins < item.price || purchasing === item.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-black transition-all disabled:opacity-40"
                      style={{ background: purchasing === item.id ? '#22c55e' : 'linear-gradient(135deg, #c9a227, #f5c842)' }}>
                      {purchasing === item.id ? '✓ Bought!' : 'Buy'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
