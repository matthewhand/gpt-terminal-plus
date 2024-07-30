import 'module-alias/register';
import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import http from 'http';
import https from 'https';
import express, { Request, Response, Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import bodyParser from 'body-parser';

// Importing the adjusted file and command routes
import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import serverRoutes from './routes/serverRoutes';
// import staticFilesRouter from './routes/staticFilesRouter';
import { checkAuthToken } from './middlewares'; 

const app = express();

app.use(morgan('combined'));

// Health check endpoint - no auth required
app.get('/health', (req: Request, res: Response) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.status(200).send('OK');
});

// Use CORS to limit to ChatGPT referred clients
app.use(cors({ origin: ['https://chat.openai.com', 'https://chatgpt.com'] }));
app.use(bodyParser.json());

// API Router setup
const apiRouter = express.Router();
apiRouter.use(checkAuthToken); // Only applying the checkAuthToken middleware globally
apiRouter.use(fileRoutes);
apiRouter.use(commandRoutes);
apiRouter.use(serverRoutes);

// app.use('/public/', staticFilesRouter); // Serve static files using staticFilesRouter
app.use(apiRouter); // Mounting the API router to the app

// Server initialization logic
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

  // Graceful shutdown handling
  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
};

const shutdown = (server: http.Server | https.Server) => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Force server shutdown after a timeout
  setTimeout(() => {
    console.error('Forcing server shutdown...');
    process.exit(1);
  }, 10000); // 10-second timeout
};

startServer();
