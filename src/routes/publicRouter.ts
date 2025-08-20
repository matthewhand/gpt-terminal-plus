import express from 'express';
import Debug from 'debug';

const debug = Debug('app:routes:publicRouter');
const publicRouter = express.Router();

/**
 * Health check endpoint to verify server status.
 */
publicRouter.get('/health', (_req, res) => {
  debug('Health check endpoint called');
  res.status(200).json({ status: 'ok' });
});

export default publicRouter;
