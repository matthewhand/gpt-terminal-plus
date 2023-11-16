import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import { json } from 'body-parser';
import fs from 'fs';
import https from 'https';

import { checkAuthToken, ensureServerIsSet } from './middlewares';
import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import serverRoutes from './routes/serverRoutes';

const app = express();

// Enable logging using morgan
app.use(morgan('combined'));

console.log(`Debug mode is "${process.env.DEBUG}".`);

app.use(cors({
  origin: ['https://chat.openai.com', '*']
}));

app.use(json());

// Apply middlewares
app.use(checkAuthToken);
app.use(ensureServerIsSet);

// API routes at the root
app.use('/set-server', serverRoutes); // Example for set-server route
app.use(fileRoutes);
app.use(commandRoutes);

// Serve static files under /public
app.use('/public', express.static('public'));

let server: Server | https.Server;

const main = () => {
  // Check if API_TOKEN is set
  if (!process.env.API_TOKEN) {
    console.error('ERROR: API_TOKEN is not set. Please set the API_TOKEN environment variable.');
    process.exit(1);
  }

  const port: number = config.get('port') || 5004;

  // Check for SSL configuration
  if (process.env.SSL_KEY && process.env.SSL_CERT) {
    const privateKey = fs.readFileSync(process.env.SSL_KEY, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
  } else {
    server = app.listen(port, '0.0.0.0');
  }

  console.log(`Server running on port ${port}${server instanceof https.Server ? ' (HTTPS)' : ''}`);

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
