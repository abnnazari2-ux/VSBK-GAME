import { create } from 'zustand';
import { Room, Player, GameState, MatchStats } from '../types';

interface AppState {
  localPlayer: Player;
  setLocalPlayer: (player: Partial<Player>) => void;
  socketId: string | null;
  setSocketId: (id: string) => void;
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  gameState: GameState | null;
  setGameState: (state: GameState | null) => void;
  matchResult: { winner: string; stats: MatchStats } | null;
  setMatchResult: (result: { winner: string; stats: MatchStats } | null) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const useGameStore = create<AppState>((set) => ({
  localPlayer: {
    id: '',
    name: 'ChalkMaster',
    rank: 'Grand Master',
    level: 45,
    isHost: false,
    isReady: false,
    score: 0,
    currentBreak: 0,
  },
  setLocalPlayer: (player) => set((state) => ({ localPlayer: { ...state.localPlayer, ...player } })),
  socketId: null,
  setSocketId: (id) => set({ socketId: id }),
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  gameState: null,
  setGameState: (s) => set({ gameState: s }),
  matchResult: null,
  setMatchResult: (result) => set({ matchResult: result }),
  activeNav: 'home',
  setActiveNav: (nav) => set({ activeNav: nav }),
}));
