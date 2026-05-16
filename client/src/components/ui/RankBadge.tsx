import React from 'react';
import { Crown, Shield, Star, Zap, Target, Award } from 'lucide-react';

type Rank = 'Amateur' | 'Pro' | 'Expert' | 'Master' | 'Grand Master' | 'Legend';

interface Props {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const rankConfig: Record<Rank, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  'Amateur':     { color: '#9ca3af', bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.3)', Icon: Target },
  'Pro':         { color: '#60a5fa', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',  Icon: Shield },
  'Expert':      { color: '#4ade80', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)',   Icon: Zap },
  'Master':      { color: '#c084fc', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', Icon: Star },
  'Grand Master':{ color: '#d4af37', bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.35)', Icon: Crown },
  'Legend':      { color: '#fb923c', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', Icon: Award },
};

const sizeCfg = {
  sm: { padding: '2px 7px', fontSize: '9px', iconSize: 9, gap: '3px' },
  md: { padding: '4px 10px', fontSize: '11px', iconSize: 11, gap: '5px' },
  lg: { padding: '6px 14px', fontSize: '13px', iconSize: 13, gap: '6px' },
};

export default function RankBadge({ rank, size = 'md', showIcon = true }: Props) {
  const cfg = rankConfig[rank];
  const sc = sizeCfg[size];
  const { Icon } = cfg;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sc.gap,
        padding: sc.padding,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '999px',
        color: cfg.color,
        fontFamily: 'Rajdhani,sans-serif',
        fontWeight: 700,
        fontSize: sc.fontSize,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && <Icon size={sc.iconSize} />}
      {rank}
    </span>
  );
}
