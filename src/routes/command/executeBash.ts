import { Request, Response } from 'express';
import { executeShell } from './executeShell';
import { convictConfig } from '../../config/convictConfig';

// Thin wrapper to force bash executor
export async function executeBash(req: Request, res: Response) {
  const cfg = convictConfig();
  if (!(cfg as any).get('executors.bash.enabled')) {
    return res.status(409).json({ error: 'bash executor disabled' });
  }
  req.body = { ...(req.body || {}), shell: 'bash' };
  return executeShell(req, res);
}
