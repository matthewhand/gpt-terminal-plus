import express from 'express';

const publicRouter = express.Router();

/**
 * Health check endpoint to verify server status.
 */
publicRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default publicRouter;
