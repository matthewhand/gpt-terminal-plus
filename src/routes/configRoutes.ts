import express, { Request, Response } from 'express';
import { stringify as yamlStringify } from 'yaml';
import { convictConfig } from '../config/convictConfig';
import { buildSpec } from '../openapi';
import { checkAuthToken } from '../middlewares/checkAuthToken';

const router = express.Router();

function toBool(val: any, fallback: boolean): boolean {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

// Build and filter OpenAPI spec based on config and optional override query params
router.get('/openapi', (req: Request, res: Response) => {
  const cfg = convictConfig();
  const spec = buildSpec(req) as any;

  // Defaults from runtime config
  let shellEnabled = true;
  let filesEnabled = true;
  try { shellEnabled = cfg.get('execution.shell.enabled'); } catch {}
  try { filesEnabled = cfg.get('files.enabled'); } catch {}

  // Apply transient overrides from query (used by WebUI preview)
  const q = req.query || {};
  if ('withOverrides' in q) {
    if ('LOCALHOST_ENABLED' in q) shellEnabled = toBool(q.LOCALHOST_ENABLED, shellEnabled);
    if ('FILE_OPS_ENABLED' in q) filesEnabled = toBool(q.FILE_OPS_ENABLED, filesEnabled);
  }

  const filtered: any = { ...spec, paths: {} };
  const paths = spec?.paths || {};
  for (const [p, v] of Object.entries<any>(paths)) {
    if (p.startsWith('/file/')) {
      if (filesEnabled) filtered.paths[p] = v;
      continue;
    }
    if (p === '/command/execute-shell') {
      if (shellEnabled) filtered.paths[p] = v;
      continue;
    }
    // Always include others
    filtered.paths[p] = v;
  }

  const yaml = yamlStringify(filtered);
  res.type('application/yaml').send(yaml);
});

export default router;

// Secure overrides and settings endpoints
router.post('/override', checkAuthToken as any, (req: Request, res: Response) => {
  const body = (req.body || {}) as any;
  const updates: Record<string, any> = {};
  if (typeof body.API_TOKEN === 'string' && body.API_TOKEN.trim().length > 0) {
    try { process.env.API_TOKEN = String(body.API_TOKEN).trim(); } catch {}
    updates.API_TOKEN = '[UPDATED]';
  }
  // Extendable: handle additional keys as needed in the future
  return res.status(200).json({ ok: true, updates });
});

router.get('/settings', checkAuthToken as any, (_req: Request, res: Response) => {
  let hasToken = false;
  try { hasToken = !!(process.env.API_TOKEN || convictConfig().get('security.apiToken')); } catch {}
  return res.status(200).json({ API_TOKEN: hasToken ? '[REDACTED]' : '' });
});
