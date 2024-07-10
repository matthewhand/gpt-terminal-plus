import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (_, res) => {
  res.status(200).send('OK');
});

export default router;
