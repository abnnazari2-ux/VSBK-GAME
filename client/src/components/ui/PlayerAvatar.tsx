import React from 'react';

type Rank = 'Amateur' | 'Pro' | 'Expert' | 'Master' | 'Grand Master' | 'Legend';

interface Props {
  name: string;
  rank?: Rank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRank?: boolean;
  online?: boolean;
  inMatch?: boolean;
  inLobby?: boolean;
}

const gradients: Record<Rank, string> = {
  'Amateur':     'linear-gradient(135deg, #374151, #6b7280)',
  'Pro':         'linear-gradient(135deg, #1d4ed8, #3b82f6)',
  'Expert':      'linear-gradient(135deg, #1a5c32, #22c55e)',
  'Master':      'linear-gradient(135deg, #6d28d9, #a78bfa)',
  'Grand Master':'linear-gradient(135deg, #c9a227, #f5c842)',
  'Legend':      'linear-gradient(135deg, #c2410c, #f97316)',
};

const sizePx = { sm: 28, md: 40, lg: 56, xl: 80 };
const fontSz = { sm: 12, md: 16, lg: 22, xl: 32 };

export default function PlayerAvatar({ name, rank = 'Amateur', size = 'md', showRank, online, inMatch, inLobby }: Props) {
  const px = sizePx[size];
  const dotColor = inMatch ? '#f59e0b' : inLobby ? '#3b82f6' : online ? '#22c55e' : '#6b7280';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div
          style={{
            width: px, height: px,
            borderRadius: '50%',
            background: gradients[rank],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${rank === 'Grand Master' || rank === 'Legend' ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: rank === 'Grand Master' ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
          }}
        >
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: fontSz[size], color: rank === 'Grand Master' ? '#0a0a0f' : '#fff' }}>
            {(name ?? '?').charAt(0).toUpperCase()}
          </span>
        </div>
        {(online || inMatch || inLobby) && (
          <span
            style={{
              position: 'absolute', bottom: 1, right: 1,
              width: Math.max(8, px * 0.22), height: Math.max(8, px * 0.22),
              borderRadius: '50%',
              background: dotColor,
              border: '2px solid #0a0a0f',
              boxShadow: `0 0 6px ${dotColor}`,
            }}
          />
        )}
      </div>
      {showRank && rank && (
        <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '10px', color: '#d4af37', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{rank}</span>
      )}
    </div>
  );
}
