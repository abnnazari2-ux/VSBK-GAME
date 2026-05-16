# 🎱 Snooker Legends

A full-stack real-time multiplayer snooker game built with React, TypeScript, Node.js, and Socket.io.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Zustand** for state management
- **Socket.io Client** for real-time multiplayer
- **HTML5 Canvas** for game rendering

### Backend
- **Node.js** with TypeScript
- **Express** HTTP server
- **Socket.io** for real-time bidirectional communication
- **In-memory storage** (PostgreSQL-ready structure)

## Getting Started

### Installation

```bash
npm install
```

This installs dependencies for root, client, and server automatically via the `postinstall` script.

### Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health check: http://localhost:3001/health

### Build for Production

```bash
npm run build
```

## Project Structure

```
snooker-legends/
├── package.json          # Monorepo root
├── .replit               # Replit config
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # All screen pages
│   │   ├── game-engine/  # Snooker physics engine
│   │   ├── stores/       # Zustand state
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript types
└── server/               # Node.js + Express + Socket.io
    └── src/
        ├── index.ts      # Entry point
        ├── rooms.ts      # Room management
        ├── gameState.ts  # Game state
        └── socket.ts     # Socket.io handlers
```

## Features

- Real-time multiplayer via Socket.io
- Private/public room creation with room codes
- Match setup (Ranked, Casual, Practice, Custom)
- Playable snooker with physics-based ball movement
- Proper snooker rules (reds, colors, breaks, fouls)
- 13 screens: Dashboard, Match Setup, Create Room, Lobby, Game, Results, Profile, Store, Training, Friends, Tournaments, Live Hub, Settings

## Ball Values

| Ball | Points |
|------|--------|
| Red | 1 |
| Yellow | 2 |
| Green | 3 |
| Brown | 4 |
| Blue | 5 |
| Pink | 6 |
| Black | 7 |

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `create_room` | C→S | Create a new room |
| `join_room` | C→S | Join existing room |
| `player_ready` | C→S | Toggle ready status |
| `start_match` | C→S | Host starts match |
| `shot_taken` | C→S | Player takes a shot |
| `sync_game_state` | C→S | Host syncs state |
| `end_turn` | C→S | End current turn |
| `end_match` | C→S | End the match |
| `send_chat_message` | C→S | Send chat message |
| `leave_room` | C→S | Leave the room |
