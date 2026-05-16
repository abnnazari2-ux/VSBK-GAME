import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}

const sizes = {
  sm: { padding: '7px 16px', fontSize: '11px' },
  md: { padding: '10px 24px', fontSize: '13px' },
  lg: { padding: '14px 32px', fontSize: '15px' },
};

export default function GoldButton({ children, onClick, disabled, className = '', size = 'md', loading, icon, type = 'button', style }: Props) {
  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      whileHover={!disabled && !loading ? { scale: 1.03, boxShadow: '0 0 24px rgba(212,175,55,0.5)' } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      className={className}
      style={{
        background: disabled ? 'rgba(155,125,43,0.3)' : 'linear-gradient(135deg, #c9a227, #f5c842, #d4af37)',
        color: disabled ? 'rgba(0,0,0,0.4)' : '#0a0a0f',
        border: 'none',
        borderRadius: '8px',
        fontFamily: 'Rajdhani,sans-serif',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
        ...sizes[size],
        ...style,
      }}
    >
      {loading ? (
        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0a0a0f', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
      ) : icon ? (
        <>{icon}{children}</>
      ) : children}
    </motion.button>
  );
}
