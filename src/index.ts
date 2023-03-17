import express from 'express';
import cors from 'cors';
import router from './router';
import { socketListeners } from './utils/listeners/socketListeners';
import { Server } from 'socket.io';
import * as http from 'http';

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

new Server(
  http.createServer(express().use(cors()).use(router)).listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port: http://${HOST}:${PORT}`);
  }),
  { cors: { origin: 'http://localhost:3000' } },
).on('connection', socketListeners);
