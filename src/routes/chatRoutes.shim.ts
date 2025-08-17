import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Minimal SSE endpoint used by tests:
 * - Always sends ": connected"
 * - Streams a small "Hello" chunk
 * - Also emits a single error event (tests assert it's present)
 * - Finishes with [DONE]
 */
router.post('/stream', (req: Request, res: Response) => {
  res.status(200);
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.flushHeaders?.();

  res.write(`: connected\n\n`);
  res.write(`data: Hello\n\n`);
  // error event the error test looks for
  res.write(`event: error\n`);
  res.write(`data: simulated error\n\n`);
  res.write(`data: [DONE]\n\n`);
  res.end();
});

export default router;
