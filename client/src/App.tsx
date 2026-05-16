import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import MatchSetup from './pages/MatchSetup';
import CreateRoom from './pages/CreateRoom';
import Lobby from './pages/Lobby';
import GameScreen from './pages/GameScreen';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Training from './pages/Training';
import Friends from './pages/Friends';
import Tournaments from './pages/Tournaments';
import LiveHub from './pages/LiveHub';

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><Dashboard /></PageWrap>} />
          <Route path="/play" element={<PageWrap><MatchSetup /></PageWrap>} />
          <Route path="/room" element={<PageWrap><CreateRoom /></PageWrap>} />
          <Route path="/lobby" element={<PageWrap><Lobby /></PageWrap>} />
          <Route path="/game" element={<PageWrap><GameScreen /></PageWrap>} />
          <Route path="/results" element={<PageWrap><Results /></PageWrap>} />
          <Route path="/profile" element={<PageWrap><Profile /></PageWrap>} />
          <Route path="/store" element={<PageWrap><Store /></PageWrap>} />
          <Route path="/training" element={<PageWrap><Training /></PageWrap>} />
          <Route path="/friends" element={<PageWrap><Friends /></PageWrap>} />
          <Route path="/tournaments" element={<PageWrap><Tournaments /></PageWrap>} />
          <Route path="/live" element={<PageWrap><LiveHub /></PageWrap>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
