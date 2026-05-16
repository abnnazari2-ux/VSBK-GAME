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
  outlined?: boolean;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}

const sizes = {
  sm: { padding: '7px 16px', fontSize: '11px' },
  md: { padding: '10px 24px', fontSize: '13px' },
  lg: { padding: '14px 32px', fontSize: '15px' },
};

export default function GreenButton({ children, onClick, disabled, className = '', size = 'md', loading, icon, outlined, type = 'button', style }: Props) {
  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      whileHover={!disabled && !loading ? { scale: 1.03, boxShadow: '0 0 24px rgba(34,197,94,0.4)' } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      className={className}
      style={{
        background: outlined
          ? 'transparent'
          : disabled ? 'rgba(26,122,60,0.3)' : 'linear-gradient(135deg, #1a5c32, #22c55e)',
        color: outlined ? '#22c55e' : '#ffffff',
        border: outlined ? '1px solid rgba(34,197,94,0.5)' : 'none',
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
        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
      ) : icon ? (
        <>{icon}{children}</>
      ) : children}
    </motion.button>
  );
}
