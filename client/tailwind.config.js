/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0a0f',
        'panel-dark': '#111118',
        'panel-darker': '#0d0d13',
        'green-primary': '#1a7a3c',
        'green-bright': '#22c55e',
        'green-glow': '#16a34a',
        'gold-primary': '#d4af37',
        'gold-bright': '#f5c842',
        'gold-muted': '#9a7d2b',
        'border-gold': '#d4af3760',
        'text-primary': '#f0f0f0',
        'text-muted': '#6b7280',
        danger: '#ef4444',
      },
      fontFamily: {
        game: ['Rajdhani', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(212,175,55,0.4)', opacity: '1' },
          '50%': { boxShadow: '0 0 24px 8px rgba(212,175,55,0.8)', opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'power-fill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'ball-potted': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.6' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        'matchmaking-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.7' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'power-fill': 'power-fill 0.3s ease-out forwards',
        'ball-potted': 'ball-potted 0.4s ease-in forwards',
        'matchmaking-pulse': 'matchmaking-pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
