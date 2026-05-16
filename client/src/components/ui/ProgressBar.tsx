import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  value: number;
  max?: number;
  color?: 'green' | 'gold' | 'blue';
  label?: string;
  showPercent?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorMap = {
  green: { track: 'rgba(34,197,94,0.12)', fill: 'linear-gradient(90deg, #1a5c32, #22c55e)', glow: 'rgba(34,197,94,0.3)' },
  gold:  { track: 'rgba(212,175,55,0.12)', fill: 'linear-gradient(90deg, #9a7d2b, #d4af37)', glow: 'rgba(212,175,55,0.3)' },
  blue:  { track: 'rgba(59,130,246,0.12)', fill: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', glow: 'rgba(59,130,246,0.3)' },
};

const heights = { sm: '4px', md: '6px', lg: '10px' };

export default function ProgressBar({ value, max = 100, color = 'green', label, showPercent, height = 'md', animated = true }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const c = colorMap[color];

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          {label && <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '11px', color: '#6b7280', letterSpacing: '0.06em' }}>{label}</span>}
          {showPercent && <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '11px', fontWeight: 700, color: '#d4af37' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ width: '100%', height: heights[height], background: c.track, borderRadius: '999px', overflow: 'hidden' }}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: c.fill,
            borderRadius: '999px',
            boxShadow: `0 0 8px ${c.glow}`,
          }}
        />
      </div>
    </div>
  );
}
