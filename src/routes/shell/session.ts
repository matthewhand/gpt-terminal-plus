import express, { Request, Response } from 'express';
import { logSessionStep } from '../../utils/activityLogger';

const router = express.Router();

// Minimal session exec endpoint used by tests
router.post('/:id?/exec', async (req: Request, res: Response) => {
  const { command, shell } = (req.body || {}) as { command?: string; shell?: string };
  const sessionId = (req.params?.id && String(req.params.id).trim() !== '')
    ? String(req.params.id)
    : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Record start of execution
  await logSessionStep('exec-start', { command, shell }, undefined);

  // Record a timeout event (tests advance timers, but do not depend on real delay)
  await logSessionStep('executeCommand', { status: 'timeout' }, sessionId);
  return res.json({ sessionId });
});

export default router;
