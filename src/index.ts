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

import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import serverRoutes from './routes/serverRoutes';
import staticFilesRouter from './routes/staticFilesRouter';

import { checkAuthToken, ensureServerIsSet } from './middlewares';
import { getPaginatedResponse } from './handlers/PaginationHandler';

const app = express();

app.use(morgan('combined'));
app.use(cors({ origin: ['https://chat.openai.com', '*'] }));
app.use(json());

const apiRouter = express.Router();
apiRouter.use(checkAuthToken); // Apply checkAuthToken to all routes under apiRouter

// Apply ensureServerIsSet middleware to specific routes that need server setting
apiRouter.use('/files', ensureServerIsSet, fileRoutes);
apiRouter.use('/commands', ensureServerIsSet, commandRoutes);

apiRouter.get('/response/:id/:page', (req, res) => {
  const responseId = req.params.id;
  const page = parseInt(req.params.page, 10);

  try {
    const { stdout, stderr, totalPages } = getPaginatedResponse(responseId, page);
    res.status(200).json({ responseId, page, stdout, stderr, totalPages });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.use('/public/', staticFilesRouter); 
app.use('/api', apiRouter); // Mount the API router on '/api'
app.use('/server', checkAuthToken, serverRoutes); // Apply checkAuthToken to serverRoutes

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
