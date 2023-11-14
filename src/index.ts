import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http'; // Import Server type for TypeScript
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import { json } from 'body-parser';
import { ServerHandler } from './handlers/ServerHandler';

import { ServerConfig } from './types';

import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import serverRoutes from './routes/serverRoutes';
import staticFilesRouter from './routes/staticFilesRouter';

// Import the PaginationHandler
import { getPaginatedResponse } from './handlers/PaginationHandler';

const app = express();

// Middleware to check for API token
function checkAuthToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // if there's no token

    if (token !== process.env.API_TOKEN) {
        return res.sendStatus(403); // if the token is wrong
    }

    next(); // if the token is correct
}

// Apply the middleware to all routes
app.use(checkAuthToken);

// Conditionally use morgan logger if DEBUG is set to 'true'
if (process.env.DEBUG === 'true') {
  app.use(morgan('combined'));
}

console.log(`Debug mode is ${process.env.DEBUG === 'true' ? 'ON' : 'OFF'}.`);

app.use(cors({
  origin: ['https://chat.openai.com', '*']
}));

app.use(json());

async function ensureServerIsSet(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.serverHandler) {
      const serverConfigs: ServerConfig[] = config.get('serverConfig');
      const serverConfig = serverConfigs[0]; // Default to the first configured server
      const host = serverConfig.host;
      req.serverHandler = await ServerHandler.getInstance(host);
    }
    next();
  } catch (error) {
    next(error); // Pass the error to the next error handling middleware
  }
}

app.use(ensureServerIsSet, fileRoutes);
app.use(ensureServerIsSet, commandRoutes);
app.use(staticFilesRouter);
app.use(serverRoutes);

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

let server: Server; // Explicitly declare server as type Server

const main = () => {

  // Check if API_TOKEN is set
  if (!process.env.API_TOKEN) {
    console.error('ERROR: API_TOKEN is not set. Please set the API_TOKEN environment variable.');
    process.exit(1); // Exit the process with an error code
  }
    
  const port: number = config.get('port') || 3000;

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });

    // TODO option to use https
    // const https = require('https');
    // const selfSigned = require('openssl-self-signed-certificate');

    // const options = {
    //     key: selfSigned.key,
    //     cert: selfSigned.cert
    // };

    // server = https.createServer(options, app).listen(port);
    // console.log(`HTTPS started on port ${port} (dev only).`);

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
