import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import https from 'https';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import { json } from 'body-parser';
import fs from 'fs';

// Import routes
import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import serverRoutes from './routes/serverRoutes';
import staticFilesRouter from './routes/staticFilesRouter';

// Import middlewares
import { checkAuthToken, ensureServerIsSet } from './middlewares';

// Import handlers
import { getPaginatedResponse } from './handlers/PaginationHandler';

const app = express();

app.use(cors({
  origin: ['https://chat.openai.com', '*']
}));

app.use(json());

// Define all API-related routes under '/'
const apiRouter = express.Router();
apiRouter.use(checkAuthToken); 
apiRouter.use(ensureServerIsSet);
apiRouter.use(fileRoutes);
apiRouter.use(commandRoutes);
apiRouter.use(serverRoutes);

// Endpoint to retrieve paginated response, now under '/response'
apiRouter.get('/response/:id/:page', (req: Request, res: Response) => {
  const responseId = req.params.id;
  const page = parseInt(req.params.page, 10);

  try {
    const { stdout, stderr, totalPages } = getPaginatedResponse(responseId, page);
    res.status(200).json({ responseId, page, stdout, stderr, totalPages });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.use('/public/', staticFilesRouter); // Serve static files without token check
app.use(apiRouter); // Mount the API router on '/api'

global.selectedServer = 'localhost'; // Defaults to localhost
// let server: http.Server | https.Server;

// Start server function
const startServer = () => {
  const port = config.get<number>('port') || 5004;
  const bindAddress = config.get<string>('bindAddress') || '0.0.0.0';
  const httpsEnabled = config.get<boolean>('httpsEnabled');
  const keyPath = config.get<string>('httpsKeyPath');
  const certPath = config.get<string>('httpsCertPath');

  let server: http.Server | https.Server;

  if (httpsEnabled && keyPath && certPath) {
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(port, bindAddress, () => {
    console.log(`Server running on ${httpsEnabled ? 'https' : 'http'}://${bindAddress}:${port}`);
  });

  process.on('SIGINT', () => shutdown(server, 'SIGINT'));
  process.on('SIGTERM', () => shutdown(server, 'SIGTERM'));
};

// Shutdown function
const shutdown = (server: http.Server | https.Server, signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully.`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

startServer();
