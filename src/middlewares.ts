import { Request, Response, NextFunction } from 'express';
import { ServerConfigUtils } from './utils/ServerConfigUtils';
import fs from 'fs';
import path from 'path';
import Debug from 'debug';

// Initialize debug logging for middleware
const debugMiddleware = Debug('app:middleware');

// Helper functions to handle the selected server persistence
const selectedServerFilePath = path.join(__dirname, 'selectedServer.txt');

// Ensures the directory and file for the selected server exist and writes 'localhost' as default if the file is newly created
export const ensureDirAndFileExist = () => {
  const dir = path.dirname(selectedServerFilePath);
  let fileCreated = false; // Flag to check if file is being created

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    debugMiddleware(`Created directory for selected server file: ${dir}`);
  }

  if (!fs.existsSync(selectedServerFilePath)) {
    fs.writeFileSync(selectedServerFilePath, 'localhost', 'utf8'); // Write 'localhost' as the default content
    fileCreated = true;
    debugMiddleware(`Created selected server file with default server: 'localhost'`);
  }

  // Optionally, you can add a logic here to only log if the file wasn't just created
  // This avoids redundancy in logging when file creation and content writing is done simultaneously
  if (!fileCreated) {
    debugMiddleware(`Selected server file already exists. No default content written.`);
  }
};

export const getSelectedServer = (): string | null => {
  try {
    ensureDirAndFileExist(); // Ensure infrastructure is ready
    return fs.readFileSync(selectedServerFilePath, 'utf8');
  } catch (error) {
    if (error instanceof Error) {
      debugMiddleware(`Error reading selected server from disk: ${error.message}`);
    } else {
      debugMiddleware('An unexpected error occurred while reading the selected server from disk.');
    }
    return null;
  }
};

export const setSelectedServer = (serverName: string): void => {
  try {
    ensureDirAndFileExist(); // Ensure infrastructure is ready
    fs.writeFileSync(selectedServerFilePath, serverName, 'utf8');
    debugMiddleware(`Persisted selected server: ${serverName}`);
  } catch (error) {
    if (error instanceof Error) {
      debugMiddleware(`Error persisting selected server to disk: ${error.message}`);
    } else {
      debugMiddleware('An unexpected error occurred while persisting the selected server to disk.');
    }
  }
};

// Middleware to ensure a server handler is set
export async function ensureServerIsSet(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    debugMiddleware('Checking if server handler is set');
    if (!req.serverHandler) {
      const selectedServer = getSelectedServer();
      if (!selectedServer) {
        const errorMessage = 'No server selected and no default server is available. Ensure the selectedServer.txt file exists and is accessible.';
        debugMiddleware(errorMessage);
        res.status(500).json({ error: errorMessage });
        return;
      }
      req.serverHandler = await ServerConfigUtils.getInstance(selectedServer);
      debugMiddleware(`Server handler set successfully for persisted server: ${selectedServer}`);
    }
    next();
  } catch (error) {
    const detailedError = error instanceof Error ? `Error in ensureServerIsSet middleware: ${error.message}` : 'An unexpected error occurred in ensureServerIsSet middleware.';
    debugMiddleware(detailedError);
    res.status(500).json({ error: detailedError });
  }
};

// Middleware to check for API token
export function checkAuthToken(req: Request, res: Response, next: NextFunction): void {
    debugMiddleware('Checking authorization token');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        debugMiddleware('No authorization token provided');
        res.sendStatus(401); // if there's no token
        return;
    }

    if (token !== process.env.API_TOKEN) {
        debugMiddleware('Authorization token mismatch');
        res.sendStatus(403); // if the token is wrong
        return;
    }

    debugMiddleware('Authorization token validated successfully');
    next(); // if the token is correct
}
