import { Request, Response } from 'express';
import { executeCode } from './executeCode';
import { convictConfig } from '../../config/convictConfig';

// Thin wrapper to default language to python for convenience
export async function executePython(req: Request, res: Response) {
  const cfg = convictConfig();
  if (!(cfg as any).get('executors.python.enabled')) {
    return res.status(409).json({ error: 'python executor disabled' });
  }
  const body = req.body || {};
  req.body = { ...body, language: body.language || 'python' };
  return executeCode(req, res);
}
