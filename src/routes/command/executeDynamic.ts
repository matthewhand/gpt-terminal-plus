import { Router, Request, Response } from 'express';
import { listExecutors } from '../../utils/executors';
import { executeShell } from './executeShell';
import { executeCode } from './executeCode';

const router = Router();

// POST /command/execute-:name
router.post('/execute-:name', async (req: Request, res: Response) => {
  const name = String(req.params.name || '').toLowerCase();
  const execs = listExecutors();
  const ex = execs.find(e => e.name.toLowerCase() === name);
  if (!ex) return res.status(404).json({ message: 'executor not found' });
  if (!ex.enabled) return res.status(409).json({ message: `${ex.name} executor disabled` });

  if (ex.kind === 'shell') {
    req.body = { ...(req.body || {}), shell: ex.cmd || ex.name };
    return executeShell(req, res);
  }

  if (ex.kind === 'code') {
    const body = req.body || {};
    req.body = { ...body, language: body.language || ex.name };
    return executeCode(req, res);
  }

  return res.status(400).json({ message: 'unknown executor kind' });
});

export default router;

