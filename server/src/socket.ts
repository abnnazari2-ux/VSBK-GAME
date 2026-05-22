import { Server, Socket } from 'socket.io';
import {
  rooms,
  createRoom,
  getRoom,
  deleteRoom,
  getRoomSerialized,
  Player,
  RoomSettings,
} from './rooms';
import { createInitialGameState } from './gameState';

export function setupSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.on('create_room', (data: {
      name: string;
      playerName: string;
      isPrivate: boolean;
      password?: string;
      region: string;
      settings?: Partial<RoomSettings>;
    }) => {
      try {
        const room = createRoom({
          name: data.name || 'My Room',
          isPrivate: data.isPrivate ?? true,
          password: data.password,
          region: data.region || 'EU',
          hostId: socket.id,
          settings: data.settings,
        });
        const hostPlayer: Player = {
          id: socket.id,
          name: data.playerName || 'Player 1',
          rank: 'Grand Master',
          level: 45,
          isHost: true,
          isReady: true,
          score: 0,
          currentBreak: 0,
        };
        room.players.set(socket.id, hostPlayer);
        socket.join(room.code);
        socket.emit('room_created', { room: getRoomSerialized(room) });
        console.log(`[Room] Created: ${room.code} by ${data.playerName}`);
      } catch (err: any) {
        socket.emit('error', { message: err.message || 'Failed to create room' });
      }
    });

    socket.on('join_room', (data: { code: string; playerName: string; password?: string }) => {
      try {
        const room = getRoom(data.code);
        if (!room) { socket.emit('error', { message: 'Room not found' }); return; }
        if (room.status === 'playing') { socket.emit('error', { message: 'Match in progress' }); return; }
        if (room.status === 'finished') { socket.emit('error', { message: 'Match finished' }); return; }
        if (room.players.size >= 2) { socket.emit('error', { message: 'Room is full' }); return; }
        if (room.isPrivate && room.password && room.password !== data.password) {
          socket.emit('error', { message: 'Incorrect password' }); return;
        }
        const newPlayer: Player = {
          id: socket.id,
          name: data.playerName || 'Player 2',
          rank: 'Master',
          level: 38,
          isHost: false,
          isReady: false,
          score: 0,
          currentBreak: 0,
        };
        room.players.set(socket.id, newPlayer);
        socket.join(room.code);
        const serialized = getRoomSerialized(room);
        socket.emit('room_joined', { room: serialized });
        io.to(room.code).emit('player_joined', { room: serialized, player: newPlayer });
        console.log(`[Room] ${data.playerName} joined ${room.code}`);
      } catch (err: any) {
        socket.emit('error', { message: err.message || 'Failed to join room' });
      }
    });

    socket.on('player_ready', (data: { roomCode: string }) => {
      try {
        const room = getRoom(data.roomCode);
        if (!room) return;
        const player = room.players.get(socket.id);
        if (!player || player.isHost) return;
        player.isReady = !player.isReady;
        io.to(room.code).emit('player_ready_changed', {
          room: getRoomSerialized(room),
          playerId: socket.id,
          isReady: player.isReady,
        });
      } catch (err: any) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('start_match', (data: { roomCode: string }) => {
      try {
        const room = getRoom(data.roomCode);
        if (!room) { socket.emit('error', { message: 'Room not found' }); return; }
        if (room.host !== socket.id) { socket.emit('error', { message: 'Only host can start' }); return; }
        if (room.players.size < 2) { socket.emit('error', { message: 'Need 2 players' }); return; }
        for (const [, p] of room.players) {
          if (!p.isHost && !p.isReady) {
            socket.emit('error', { message: `${p.name} is not ready` }); return;
          }
        }
        const playerIds = Array.from(room.players.keys());
        const gameState = createInitialGameState(room.code, playerIds, room.settings.frames);
        room.gameState = gameState;
        room.status = 'playing';
        io.to(room.code).emit('match_started', { gameState, room: getRoomSerialized(room) });
        console.log(`[Match] Started in ${room.code}`);
      } catch (err: any) {
        socket.emit('error', { message: err.message });
      }
    });

    // Relay shot to opponent — client enforces whose turn it is
    socket.on('shot_taken', (data: { roomCode: string; power: number; angle: number; spin: { x: number; y: number } }) => {
      try {
        const room = getRoom(data.roomCode);
        if (!room) return;
        socket.to(room.code).emit('shot_broadcast', {
          playerId: socket.id,
          power: data.power,
          angle: data.angle,
          spin: data.spin ?? { x: 0, y: 0 },
          timestamp: Date.now(),
        });
      } catch (err: any) {
        socket.emit('error', { message: err.message });
      }
    });

    // Any player in the room can sync state (not just the host)
    socket.on('sync_game_state', (data: { roomCode: string; gameState: any }) => {
      try {
        const room = getRoom(data.roomCode);
        if (!room || !room.players.has(socket.id)) return;
        room.gameState = { ...data.gameState, timestamp: Date.now() };
        socket.to(room.code).emit('game_state_synced', { gameState: room.gameState });
      } catch (err: any) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('end_turn', (data: { roomCode: string; gameState: any }) => {
      try {
        const room = getRoom(data.roomCode);
        if (!room || !room.gameState) return;
        if (data.gameState) room.gameState = { ...room.gameState, ...data.gameState, timestamp: Date.now() };
        io.to(room.code).emit('turn_ended', { gameState: room.gameState, previousPlayer: socket.id });
      } catch (err: any) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('end_match', (data: { roomCode: string; winner: string; finalState: any }) => {
      try {
        const room = getRoom(data.roomCode);
        if (!room) return;
        room.status = 'finished';
        if (data.finalState) {
          room.gameState = { ...data.finalState, status: 'ended', winner: data.winner, timestamp: Date.now() };
        }
        io.to(room.code).emit('match_ended', { winner: data.winner, finalState: room.gameState, room: getRoomSerialized(room) });
        console.log(`[Match] Ended in ${data.roomCode}. Winner: ${data.winner}`);
      } catch (err: any) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('send_chat_message', (data: { roomCode: string; message: string }) => {
      try {
        const room = getRoom(data.roomCode);
        if (!room) return;
        const player = room.players.get(socket.id);
        if (!player || !data.message?.trim()) return;
        const msg = { playerId: socket.id, playerName: player.name, message: data.message.trim().slice(0, 300), timestamp: Date.now() };
        room.chat.push(msg);
        if (room.chat.length > 200) room.chat = room.chat.slice(-200);
        io.to(room.code).emit('chat_message', { message: msg });
      } catch (err: any) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('leave_room', (data: { roomCode: string }) => {
      handleLeaveRoom(socket, io, data.roomCode);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${socket.id} (${reason})`);
      for (const [code, room] of rooms) {
        if (room.players.has(socket.id) || room.spectators.has(socket.id)) {
          handleLeaveRoom(socket, io, code);
        }
      }
    });
  });
}

function handleLeaveRoom(socket: Socket, io: Server, roomCode: string): void {
  const room = getRoom(roomCode);
  if (!room) return;
  const leavingPlayer = room.players.get(socket.id);
  const wasHost = leavingPlayer?.isHost ?? false;
  room.players.delete(socket.id);
  room.spectators.delete(socket.id);
  socket.leave(roomCode);
  if (room.players.size === 0 && room.spectators.size === 0) {
    deleteRoom(roomCode);
    return;
  }
  if (wasHost && room.players.size > 0) {
    const [newHostId, newHostPlayer] = room.players.entries().next().value;
    newHostPlayer.isHost = true;
    newHostPlayer.isReady = true;
    room.host = newHostId;
  }
  io.to(roomCode).emit('player_left', {
    room: getRoomSerialized(room),
    playerId: socket.id,
    playerName: leavingPlayer?.name ?? 'Unknown',
  });
}
