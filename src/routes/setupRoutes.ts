import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const CONFIG_DIR = process.env.NODE_CONFIG_DIR || 'config';
const ENV = process.env.NODE_ENV || 'development';
const TARGET = path.join(CONFIG_DIR, `${ENV}.json`);

function loadConfig(): any {
  try { return JSON.parse(fs.readFileSync(TARGET, 'utf8')); } catch { return {}; }
}
function saveConfig(obj: any) {
  fs.mkdirSync(path.dirname(TARGET), { recursive: true });
  fs.writeFileSync(TARGET, JSON.stringify(obj, null, 2));
}

/** UI pages expected by tests */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).send('<!doctype html><html><body><h1>Setup UI</h1></body></html>');
});
router.get('/policy', (_req: Request, res: Response) => {
  res.status(200).send('<!doctype html><html><body><h2>Safety Policy</h2></body></html>');
});

/** POST /setup/local — writes local & llm config */
router.post('/local', (req: Request, res: Response) => {
  try {
    const cfg = loadConfig();
    cfg.local = cfg.local || {};
    if ((req.body as any)['llm.provider']) {
      cfg.llm = cfg.llm || {};
      cfg.llm.provider = (req.body as any)['llm.provider'];
    }
    if ((req.body as any)['llm.baseUrl']) {
      cfg.providers = cfg.providers || {};
      cfg.providers.ollama = cfg.providers.ollama || {};
      cfg.providers.ollama.baseUrl = (req.body as any)['llm.baseUrl'];
    }
    if ((req.body as any).hostname) {
      cfg.hostname = (req.body as any).hostname;
    }
    saveConfig(cfg);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

/** POST /setup/policy — writes confirm/deny regex */
router.post('/policy', (req: Request, res: Response) => {
  try {
    const cfg = loadConfig();
    cfg.policy = cfg.policy || {};
    if ((req.body as any).confirmRegex) cfg.policy.confirmRegex = (req.body as any).confirmRegex;
    if ((req.body as any).denyRegex) cfg.policy.denyRegex = (req.body as any).denyRegex;
    saveConfig(cfg);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

/** POST /setup/ssh — writes/edits SSH host with llm overrides */
router.post('/ssh', (req: Request, res: Response) => {
  try {
    const body: any = req.body || {};
    const host = body.hostname || body.edit;
    if (!host) return res.status(400).json({ error: 'hostname required' });

    const cfg = loadConfig();
    cfg.servers = cfg.servers || {};
    cfg.servers[host] = {
      type: 'ssh',
      hostname: host,
      port: Number(body.port || 22),
      username: body.username || 'chatgpt',
      privateKeyPath: body.privateKeyPath || '',
      llm: {
        provider: body['llm.provider'],
        baseUrl: body['llm.baseUrl'],
      },
    };
    saveConfig(cfg);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

export default router;
