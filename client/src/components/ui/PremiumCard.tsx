import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  goldBorder?: boolean;
  hover?: boolean;
  onClick?: () => void;
  glowColor?: 'gold' | 'green' | 'none';
  style?: React.CSSProperties;
}

export default function PremiumCard({
  children, className = '', title, subtitle,
  goldBorder = true, hover = true, onClick,
  glowColor = 'gold', style,
}: Props) {
  const glowMap = {
    gold:  '0 0 20px rgba(212,175,55,0.25)',
    green: '0 0 20px rgba(34,197,94,0.25)',
    none:  'none',
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -3, scale: 1.01, boxShadow: glowMap[glowColor] } : undefined}
      transition={{ duration: 0.2 }}
      style={{
        background: 'rgba(17,17,24,0.85)',
        backdropFilter: 'blur(12px)',
        border: goldBorder ? '1px solid rgba(212,175,55,0.22)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      className={className}
    >
      {(title || subtitle) && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
          {title && <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '13px', color: '#d4af37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</h3>}
          {subtitle && <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
