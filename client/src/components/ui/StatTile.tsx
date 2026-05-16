import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'gold' | 'green' | 'white';
}

const colorMap = { gold: '#d4af37', green: '#22c55e', white: '#f0f0f0' };
const trendIcon = { up: TrendingUp, down: TrendingDown, neutral: Minus };

export default function StatTile({ label, value, icon, trend, color = 'white' }: Props) {
  const TrendIcon = trend ? trendIcon[trend] : null;
  const trendColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#6b7280';

  return (
    <div
      style={{
        background: 'rgba(17,17,24,0.8)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: '11px', color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
        {icon && <span style={{ color: '#6b7280' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: '22px', color: colorMap[color], letterSpacing: '-0.01em' }}>{value}</span>
        {TrendIcon && <TrendIcon size={14} color={trendColor} />}
      </div>
    </div>
  );
}
