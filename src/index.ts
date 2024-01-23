import dotenv from 'dotenv';
dotenv.config();

import http from 'http'; // Import http module
import https from 'https'; // Import https module
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import bodyParser from 'body-parser'; // Updated import

// Import your custom modules and types
import { ServerHandler } from './handlers/ServerHandler';
import { ServerConfig } from './types';
import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import serverRoutes from './routes/serverRoutes';
import staticFilesRouter from './routes/staticFilesRouter';
import { checkAuthToken, ensureServerIsSet } from './middlewares';
import { getPaginatedResponse } from './handlers/PaginationHandler';

const app = express();

app.use(morgan('combined'));
app.use(cors({
  origin: ['https://chat.openai.com', '*']
}));
app.use(bodyParser.json()); // Use bodyParser.json() instead of json()

// API Router
const apiRouter = express.Router();
apiRouter.use(checkAuthToken); 
apiRouter.use(ensureServerIsSet);
apiRouter.use(fileRoutes);
apiRouter.use(commandRoutes);
apiRouter.use(serverRoutes);

apiRouter.get('/response/:id/:page', (req: Request, res: Response) => {
  const responseId = req.params.id;
  const page = parseInt(req.params.page, 10);

  if (isNaN(page)) {
    res.status(400).send('Invalid page number');
    return;
  }

  try {
    const { stdout, stderr, totalPages } = getPaginatedResponse(responseId, page);
    res.status(200).json({ responseId, page, stdout, stderr, totalPages });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.use('/public/', staticFilesRouter); // Serve static files
app.use('/api', apiRouter); // Mount the API router

// Server initialization
const startServer = () => {
  const port = config.get<number>('port') || 5004;

  let server: http.Server | https.Server;

  if (process.env.HTTPS_ENABLED === 'true') {
    const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH!, 'utf8');
    const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH!, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(port, () => {
    console.log(`Server running on ${process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http'}://${port}`);
  });

  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
};

// Shutdown function
const shutdown = (server: http.Server | https.Server) => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Force shutdown after a timeout
  setTimeout(() => {
    console.error('Forcing server shutdown...');
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

startServer();
