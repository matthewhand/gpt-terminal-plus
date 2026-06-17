import express from 'express';
import Debug from 'debug';
import path from 'path';

const debug = Debug('app:routes:publicRouter');
const publicRouter = express.Router();

/**
 * Serve static login page
 */
publicRouter.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
});

/**
 * Handle login form submission
 */
publicRouter.post('/login', (req, res) => {
  const { token } = req.body;
  const authHeader = req.headers['authorization'];
  const providedToken = authHeader && authHeader.split(' ')[1];

  // Validate token
  if (!providedToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Get the expected token
  const expectedToken = process.env.API_TOKEN || require('../common/apiToken').getOrGenerateApiToken();

  if (providedToken !== expectedToken) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Token is valid
  res.json({ 
    success: true, 
    message: 'Token validated successfully',
    token: providedToken
  });
});

/**
 * Health check endpoint to verify server status.
 */
publicRouter.get('/health', (_req, res) => {
  debug('Health check endpoint called');
  res.status(200).json({ status: 'ok' });
});

debug('Public router initialized with routes');
export default publicRouter;
