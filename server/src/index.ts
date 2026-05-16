import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socket';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://0.0.0.0:5173', '*'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://0.0.0.0:5173', '*'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🎱 Snooker Legends Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
