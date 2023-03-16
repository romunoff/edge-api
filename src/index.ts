import express from 'express';
import { createServer } from 'http';

const PORT = process.env.PORT || 8080;
const HOST = 'localhost';

const app = express();
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port: http://${HOST}:${PORT}`);
});
