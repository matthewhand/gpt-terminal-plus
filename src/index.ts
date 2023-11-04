// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import ServerHandler from './services/serverHandlerInstance';
import { json } from 'body-parser';
import { ServerConfig } from './types'; // Import the type definitions

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

let serverHandler: ServerHandler | null = null;

// Middleware to ensure server is set
function ensureServerIsSet(req: Request, res: Response, next: NextFunction) {
  if (!serverHandler) {
    if (process.env.DEBUG === 'true') {
      console.log('Server is not set, setting to localhost by default.');
    }
    const serverConfigs: ServerConfig[] = config.get('serverConfig');
    const serverConfig = serverConfigs[0]; // Select the first server configuration
    serverHandler = ServerHandler.getInstance(serverConfig);
  }
  (req as any).serverHandler = serverHandler;
  next();
}

// Use the routes from the routes directory
import serverRoutes from './routes/serverRoutes';
import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import staticFilesRouter from './routes/staticFilesRouter';

app.use(ensureServerIsSet, serverRoutes);
app.use(ensureServerIsSet, fileRoutes);
app.use(ensureServerIsSet, commandRoutes);
app.use(ensureServerIsSet, staticFilesRouter);

const main = () => {
  // Use the port if it's defined in the configuration, otherwise default to 3000
  const port: number = config.get('port') || 3000;

  const server = app.listen(port, '0.0.0.0', () => {
    if (process.env.DEBUG === 'true') {
      console.log(`Server running on port ${port}`);
    }
  });

  const shutdown = (signal: 'SIGINT' | 'SIGTERM') => {
    if (process.env.DEBUG === 'true') {
      console.log(`Received ${signal}. Shutting down gracefully.`);
    }
    server.close(() => {
      if (process.env.DEBUG === 'true') {
        console.log('Server closed.');
      }
      process.exit(0);
    });

    // If the server hasn't finished closing within a reasonable time, force close
    setTimeout(() => {
      if (process.env.DEBUG === 'true') {
        console.error('Could not close connections in time, forcefully shutting down');
      }
      process.exit(1);
    }, 10000); // 10 seconds timeout
  };

  // Handle SIGINT and SIGTERM signals for graceful shutdown
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

main();
