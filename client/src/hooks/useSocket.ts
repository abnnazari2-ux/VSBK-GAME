import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../stores/gameStore';
import { Room, ChatMessage } from '../types';

const SOCKET_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:3001`
  : 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { setSocketId, setCurrentRoom, setGameState, setMatchResult } = useGameStore();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (socket.id) {
        setSocketId(socket.id);
        useGameStore.getState().setLocalPlayer({ id: socket.id });
      }
    });

    socket.on('room_created', (payload: { room: Room }) => {
      setCurrentRoom(payload.room);
      useGameStore.getState().setLocalPlayer({ isHost: true });
    });

    socket.on('room_joined', (payload: { room: Room }) => setCurrentRoom(payload.room));
    socket.on('player_joined', (payload: { room: Room }) => setCurrentRoom(payload.room));
    socket.on('player_ready_changed', (payload: { room: Room }) => setCurrentRoom(payload.room));

    socket.on('match_started', (payload: { room: Room; gameState: any }) => {
      setCurrentRoom(payload.room);
      setGameState(payload.gameState);
    });

    socket.on('shot_broadcast', (payload: any) => {
      window.dispatchEvent(new CustomEvent('snooker:shot_broadcast', { detail: payload }));
    });

    socket.on('game_state_synced', (payload: { gameState: any }) => setGameState(payload.gameState));
    socket.on('turn_ended', (payload: { gameState: any }) => setGameState(payload.gameState));

    socket.on('match_ended', (payload: { winner: string; finalState: any }) => {
      setGameState(payload.finalState);
      setMatchResult({
        winner: payload.winner,
        stats: {
          potSuccess: 73, safetySuccess: 85, longestBreak: 67,
          avgShotTime: 24, fouls: 2, accuracy: 78, totalPoints: 120,
        },
      });
    });

    socket.on('chat_message', (payload: { message: ChatMessage }) => {
      const room = useGameStore.getState().currentRoom;
      if (room) setCurrentRoom({ ...room, chat: [...room.chat, payload.message] });
    });

    socket.on('player_left', (payload: { room: Room }) => setCurrentRoom(payload.room));
    socket.on('error', (payload: { message: string }) => {
      window.dispatchEvent(new CustomEvent('snooker:error', { detail: payload }));
    });

    return () => { socket.removeAllListeners(); socket.disconnect(); socketRef.current = null; };
  }, []);

  const emit = useCallback(<T>(event: string, payload: T) => {
    if (socketRef.current?.connected) socketRef.current.emit(event, payload);
    else console.warn(`[Socket] Cannot emit '${event}': not connected`);
  }, []);

  return {
    socket: socketRef.current,
    createRoom: useCallback((d: any) => emit('create_room', d), [emit]),
    joinRoom: useCallback((d: any) => emit('join_room', d), [emit]),
    setReady: useCallback((d: any) => emit('player_ready', d), [emit]),
    startMatch: useCallback((d: any) => emit('start_match', d), [emit]),
    takeShot: useCallback((d: any) => emit('shot_taken', d), [emit]),
    syncGameState: useCallback((d: any) => emit('sync_game_state', d), [emit]),
    endTurn: useCallback((d: any) => emit('end_turn', d), [emit]),
    endMatch: useCallback((d: any) => emit('end_match', d), [emit]),
    sendChatMessage: useCallback((d: any) => emit('send_chat_message', d), [emit]),
    leaveRoom: useCallback((d: any) => emit('leave_room', d), [emit]),
  };
}
