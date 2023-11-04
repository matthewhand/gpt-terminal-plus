// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from 'config';
import ServerHandler from './services/serverHandlerInstance';
import { json } from 'body-parser';

const app = express();

app.use(morgan('combined'));
app.use(cors({
  origin: ['https://chat.openai.com']
}));
app.use(json());

// Define an interface for the server configuration
interface ServerConfig {
  connectionString: string;
  code: boolean;
  posix: boolean;
}

let serverHandler: ServerHandler | null = null;

// Middleware to ensure server is set
function ensureServerIsSet(req: Request, res: Response, next: NextFunction) {
  if (!serverHandler) {
    console.log('Server is not set, setting to localhost by default.');
    const serverConfigs: ServerConfig[] = config.get('ServerConfig');
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
  // Use the port from the configuration if it's defined, otherwise default to 5004
  const port = Number(process.env.PORT) || 3000; // Replace 3000 with your default port
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};

main();
