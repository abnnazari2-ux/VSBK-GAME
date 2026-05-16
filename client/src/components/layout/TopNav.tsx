import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Mail, Bell, Trophy, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'HOME',         path: '/' },
  { label: 'PLAY ONLINE',  path: '/play' },
  { label: 'TOURNAMENTS',  path: '/tournaments' },
  { label: 'FRIENDS',      path: '/friends' },
  { label: 'INVENTORY',    path: '/profile' },
  { label: 'LEADERBOARDS', path: '/' },
  { label: 'STORE',        path: '/store' },
  { label: 'SETTINGS',     path: '/profile' },
];

export default function TopNav() {
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);

  function isActive(path: string) {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(10,10,15,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212,175,55,0.18)',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
        <div
          style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a7a3c, #0a0a0f)',
            border: '2px solid rgba(212,175,55,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(212,175,55,0.3)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: '16px', color: '#d4af37' }}>8</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: '14px', color: '#f0f0f0', letterSpacing: '0.1em' }}>SNOOKER</span>
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: '14px', color: '#d4af37', letterSpacing: '0.1em' }}>LEGENDS</span>
          </div>
          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: '9px', color: '#22c55e', letterSpacing: '0.18em' }}>ONLINE</div>
        </div>
      </Link>

      {/* Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path) && (item.path !== '/' || pathname === '/');
          const isHovered = hovered === item.label;
          return (
            <Link
              key={item.label}
              to={item.path}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                fontFamily: 'Rajdhani,sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: active ? '#d4af37' : isHovered ? '#f0f0f0' : '#6b7280',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                borderBottom: active ? '2px solid #22c55e' : '2px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Gift */}
        <button style={buttonStyle}><Gift size={16} color="#6b7280" /></button>

        {/* Mail with badge */}
        <div style={{ position: 'relative' }}>
          <button style={buttonStyle}><Mail size={16} color="#6b7280" /></button>
          <span style={badgeStyle}>3</span>
        </div>

        {/* Bell with green dot */}
        <div style={{ position: 'relative' }}>
          <button style={buttonStyle}><Bell size={16} color="#6b7280" /></button>
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', border: '1px solid #0a0a0f' }} />
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(212,175,55,0.2)', margin: '0 4px' }} />

        {/* Coins */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Trophy size={13} color="#d4af37" />
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '13px', color: '#d4af37' }}>125,630</span>
        </div>

        {/* Avatar */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37, #9a7d2b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(212,175,55,0.4)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: '14px', color: '#0a0a0f' }}>C</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

const buttonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  width: '34px', height: '34px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const badgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '4px', right: '4px',
  width: '14px', height: '14px',
  borderRadius: '50%',
  background: '#ef4444',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'Rajdhani,sans-serif',
  fontWeight: 700,
  fontSize: '8px',
  color: '#fff',
  border: '1px solid #0a0a0f',
};
