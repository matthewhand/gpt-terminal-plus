import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import bodyParser from 'body-parser';

import fileRoutes from './routes/fileRoutes';
import commandRoutes from './routes/commandRoutes';
import serverRoutes from './routes/serverRoutes';
import publicRouter from './routes/publicRouter';
import { checkAuthToken } from './middlewares/checkAuthToken';

const app = express();

// Use morgan for logging HTTP requests
app.use(morgan('combined'));

// Determine CORS origin based on environment variable or use defaults
const corsOrigin = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['https://chat.openai.com', 'https://chatgpt.com'];

console.log('CORS configuration set to: ' + corsOrigin.join(', '));

app.use(cors({ origin: corsOrigin })); // Use CORS with the determined origin

app.use(bodyParser.json());

const apiRouter = express.Router();

// Check if API_TOKEN is configured
if (!process.env.API_TOKEN) {
  console.warn('Warning: No API_TOKEN configured. Using staticRouter.');
  
  // Use staticRouter to respond with a message indicating no API_TOKEN
  const staticRouter = express.Router();
  staticRouter.use((req: Request, res: Response) => {
    res.status(503).json({
      error: 'Service unavailable: No API_TOKEN configured. Access is restricted.',
    });
  });

  app.use(staticRouter);
} else {
  // API Router setup with authentication
  apiRouter.use(checkAuthToken);
  apiRouter.use(fileRoutes);
  apiRouter.use(commandRoutes);
  apiRouter.use(serverRoutes);
  app.use(apiRouter);
}

// Use the public router for endpoints that don't require authentication
app.use(publicRouter);

// Configuration directory and file path
const configDir = process.env.NODE_CONFIG_DIR || path.resolve(__dirname, '..', 'config');
const configFilePath = path.join(configDir, 'production.json');

// Check if configuration file exists
const isConfigLoaded = () => {
  return fs.existsSync(configFilePath);
};

// Generate default configuration
const generateDefaultConfig = () => ({
  port: 5004,
  local: {
    code: true,
  },
  ssh: {
    hosts: [
      {
        name: 'example-ssh-server',
        host: 'ssh.example.com',
        port: 22,
        username: 'user',
        privateKey: '/path/to/private/key',
      },
    ],
  },
  ssm: {
    region: 'us-east-1',
    targets: [
      {
        name: 'example-ssm-instance',
        instanceId: 'i-0123456789abcdef0',
      },
    ],
  },
});

// Persist configuration to disk
const persistConfig = (configData: object) => {
  fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
};

// Main function
const main = () => {
  if (!isConfigLoaded()) {
    const defaultConfig = generateDefaultConfig();
    persistConfig(defaultConfig);
    console.log('Default configuration generated and persisted to disk.');
  }

  // Load the configuration and start the application
  const port = config.has('port') ? config.get<number>('port') : 5004;

  const startServer = () => {
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
      console.log('Server running on ' + (process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http') + '://localhost:' + port);
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
};

main();
