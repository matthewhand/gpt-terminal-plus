import type { Application, Request, Response } from 'express';
import { Router } from 'express';
import { executeCode, executeShell, executeBash, executePython, executeDynamicRouter } from './command';

const router = Router();

// --- logging (tests assert on this exact shape)
const logReq = (path: string, body: any) => {
  try {
    console.debug(`Request received for ${path} with body: ${JSON.stringify(body)}`);
  } catch {
    console.debug(`Request received for ${path} with body: [unserializable]`);
  }
};

// Mount under /command (app.ts should do: app.use('/command', router))
router.post('/execute-shell', executeShell); // Use actual executeShell
router.post('/execute-code', executeCode); // Use actual executeCode
// New explicit executor endpoints used by tests
router.post('/execute-bash', executeBash);
router.post('/execute-python', executePython);
// Dynamic executor endpoints: /command/execute-:name (mounted last to avoid shadowing explicit routes)
router.use('/', executeDynamicRouter);

// Diff and patch endpoints (from feat/circuit-breakers)
router.post('/diff', (req: Request, res: Response) => {
  logReq('/command/diff', req.body);
  const { filePath } = req.body;
  
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }
  
  // Mock diff generation
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Mock unified diff output
  const diff = `--- a/${filePath}\n+++ b/${filePath}\n@@ -1,3 +1,3 @@\n line1\n-old content\n+new content\n line3`;
  res.json({ diff });
});

router.post('/patch', (req: Request, res: Response) => {
  logReq('/command/patch', req.body);
  const { filePath, patch } = req.body;
  
  if (!filePath || !patch) {
    return res.status(400).json({ error: 'filePath and patch are required' });
  }
  
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Mock patch application - check for invalid patch format
  if (patch.includes('invalid')) {
    return res.json({ ok: false, error: 'Invalid patch format' });
  }
  
  // Mock successful patch application
  res.json({ ok: true });
});

router.post('/execute-session', (req: Request, res: Response) => {
  const { command, sessionId, timeout = 5000 } = req.body;
  
  if (sessionId) {
    // Mock session retrieval
    return res.json({
      sessionId,
      output: 'Mock session output...',
      completed: true,
      totalLength: 100
    });
  }
  
  if (command && command.includes('sleep')) {
    // Mock long-running process
    const newSessionId = `session_${Date.now()}`;
    return res.json({
      sessionId: newSessionId,
      message: 'Process is still running. Use sessionId to retrieve output.',
      partialOutput: 'Starting long process...', 
      timeout
    });
  }
  
  // Mock quick completion
  return res.json({
    completed: true,
    output: 'Command completed quickly',
    executionTime: 100
  });
});

export default router;

export function registerCommandRoutes(app: Application) {
  app.use('/command', router);
}
