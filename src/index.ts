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

import { checkAuthToken, ensureServerIsSet } from './middlewares';

// Import the PaginationHandler
import { getPaginatedResponse } from './handlers/PaginationHandler';

const app = express();

app.use(morgan('combined'));

console.log(`Debug mode is "${process.env.DEBUG}".`);

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
let server: Server; // Explicitly declare server as type Server

const main = () => {

  // Check if API_TOKEN is set
  if (!process.env.API_TOKEN) {
    console.error('ERROR: API_TOKEN is not set. Please set the API_TOKEN environment variable.');
    process.exit(1); // Exit the process with an error code
  }
    
  const port: number = config.get('port') || 5004;

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
