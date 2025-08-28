import express, { Request, Response } from 'express';
import { checkAuthToken } from '../../middlewares/checkAuthToken';
import { listExecutors, setExecutorEnabled } from '../../utils/executors';

const router = express.Router();
router.use(checkAuthToken as any);

/**
 * GET /command/executors
 * Lists configured executors and whether each is enabled.
 */
router.get('/executors', (_: Request, res: Response) => {
  res.json({ executors: listExecutors() });
});

/**
 * POST /command/executors/:name/toggle
 * Body: { enabled: boolean }
 * Enables/disables an executor at runtime.
 */
router.post('/executors/:name/toggle', (req: Request, res: Response) => {
  const { name } = req.params;
  const { enabled } = req.body || {};
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ message: 'enabled (boolean) is required' });
  }
  const updated = setExecutorEnabled(name, enabled);
  if (!updated) return res.status(404).json({ message: 'executor not found' });
  res.json({ executor: updated });
});

/**
 * POST /command/executors/:name/update
 * Body: { cmd?: string, args?: string[] }
 * Updates executor command and/or args at runtime.
 */
router.post('/executors/:name/update', (req: Request, res: Response) => {
  const { name } = req.params;
  const { cmd, args } = req.body || {};
  const { convictConfig } = require('../../config/convictConfig');
  const cfg = convictConfig();
  try {
    let touched = false;
    if (typeof cmd === 'string' && cmd.length > 0) {
      (cfg as any).set(`executors.${name}.cmd`, cmd);
      touched = true;
    }
    if (Array.isArray(args)) {
      (cfg as any).set(`executors.${name}.args`, args.map(String));
      touched = true;
    }
    if (!touched) return res.status(400).json({ message: 'cmd or args required' });
    (cfg as any).validate({ allowed: 'warn' });
    const { listExecutors } = require('../../utils/executors');
    const updated = listExecutors().find((e: any) => e.name === name);
    if (!updated) return res.status(404).json({ message: 'executor not found' });
    res.json({ executor: updated });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'failed to update executor' });
  }
});

/**
 * POST /command/executors/:name/test
 * Tries to run a lightweight version command for the executor.
 */
router.post('/executors/:name/test', async (req: Request, res: Response) => {
  const { name } = req.params;
  const ex = listExecutors().find((e: any) => e.name.toLowerCase() === String(name).toLowerCase());
  if (!ex) return res.status(404).json({ message: 'executor not found' });
  if (!ex.enabled) return res.status(409).json({ message: `${ex.name} executor disabled` });

  const { spawnSync } = require('child_process');
  let cmd: string = ex.cmd; let args: string[] = [];
  if (ex.kind === 'shell') {
    const nm = ex.name.toLowerCase();
    if (nm === 'bash' || nm === 'zsh') { args = ['--version']; }
    else if (nm === 'powershell' || nm === 'pwsh') { args = ['--version']; }
    else { args = ['--version']; }
  } else {
    const nm = ex.name.toLowerCase();
    if (nm === 'python' || nm === 'python3') { args = ['--version']; }
    else if (nm === 'typescript') { cmd = 'npx'; args = ['-y','ts-node@latest','-v']; }
    else { args = ['-v']; }
  }
  try {
    const out = spawnSync(cmd, args, { encoding: 'utf8', timeout: 3000 });
    res.json({ status: out.status, error: out.error ? String(out.error) : null, stdout: out.stdout, stderr: out.stderr });
  } catch (e: any) {
    res.status(500).json({ message: e?.message || 'spawn failed' });
  }
});

export default router;
