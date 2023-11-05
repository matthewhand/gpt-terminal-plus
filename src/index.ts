import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import { json } from 'body-parser';

import ServerHandlerSingleton from './services/serverHandlerInstance';
import { ServerConfig } from './types';

import serverRoutes from './routes/serverRoutes';
import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import staticFilesRouter from './routes/staticFilesRouter';

// Import the PaginationHandler
import { getPaginatedResponse } from './handlers/PaginationHandler';

const app = express();

// Conditionally use morgan logger if DEBUG is set to 'true'
if (process.env.DEBUG === 'true') {
  app.use(morgan('combined'));
}

console.log(`Debug mode is ${process.env.DEBUG === 'true' ? 'ON' : 'OFF'}.`);

app.use(cors({
  origin: ['https://chat.openai.com']
}));
app.use(json());

// Middleware to ensure server is set
function ensureServerIsSet(req: Request, res: Response, next: NextFunction) {
  if (!req.serverHandler) {
    const serverConfigs: ServerConfig[] = config.get('serverConfig');
    const serverConfig = serverConfigs[0]; // Default to the first configured
    req.serverHandler = ServerHandlerSingleton.getInstance(serverConfig);
  }
  next();
}

app.use(ensureServerIsSet, fileRoutes);
app.use(ensureServerIsSet, commandRoutes);

// Endpoint to retrieve paginated response
app.get('/response/:id/:page', (req: Request, res: Response) => {
  const responseId = req.params.id;
  const page = parseInt(req.params.page, 10);

  try {
    const { stdout, stderr, totalPages } = getPaginatedResponse(responseId, page);
    res.status(200).json({ responseId, page, stdout, stderr, totalPages });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

const main = () => {
  const port: number = config.get('port') || 3000;

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });

  const shutdown = (signal: 'SIGINT' | 'SIGTERM') => {
    console.log(`Received ${signal}. Shutting down gracefully.`);
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000); // 10 seconds timeout
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

main();
