import type { Application, Request, Response } from 'express';
import express from 'express';
import { SettingsSchema } from '../settings/schema';
import { SettingsStore } from '../settings/store';

export function registerSettingsRoutes(app: Application) {
  const router = express.Router();

  router.get('/settings', (_req: Request, res: Response) => {
    return res.status(200).json(SettingsStore.get());
  });

  router.post('/settings/llm/test', async (req: Request, res: Response) => {
    const cfg: any = req.body || {};
    try {
      let models: string[] = [];
      const g: any = globalThis as any;
      const baseFetch: any = g.fetch;
      if (!baseFetch) throw new Error('fetch_not_available');

      if (cfg.provider === 'ollama') {
        const base = String(cfg.ollamaURL || '').replace(/\/+$/, '');
        const resp = await baseFetch(base + '/api/tags');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        models = (json.models || json.data || [])
          .map((m: any) => m.name || m.id)
          .filter(Boolean);
      } else if (cfg.provider === 'lmstudio') {
        const base = String(cfg.lmstudioURL || cfg.baseURL || '').replace(/\/+$/, '');
        const headers: any = { 'Content-Type': 'application/json' };
        if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;
        const resp = await baseFetch(base + '/v1/models', { headers });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        models = (json.data || []).map((m: any) => m.id).filter(Boolean);
      } else if (cfg.provider === 'openai' || cfg.provider === 'litellm') {
        const base = String(cfg.baseURL || 'https://api.openai.com').replace(/\/+$/, '');
        const headers: any = { 'Content-Type': 'application/json' };
        if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;
        const resp = await baseFetch(base + '/v1/models', { headers });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        models = (json.data || []).map((m: any) => m.id).filter(Boolean);
      } else {
        return res.status(200).json({ ok: false, details: 'unknown provider' });
      }
      return res.status(200).json({ ok: true, models });
    } catch (err: any) {
      let details = String(err?.message || err);
      const apiKey = (req.body || {}).apiKey;
      if (apiKey) {
        details = details.replace(apiKey, '[redacted]');
      }
      return res.status(200).json({ ok: false, details });
    }
  });

  router.put('/settings', (req: Request, res: Response) => {
    try {
      // Partial update first
      const updated = SettingsStore.set(req.body ?? {});
      return res.status(200).json(updated);
    } catch {
      // Fallback to full replace if they sent the whole object
      try {
        const full = SettingsSchema.parse(req.body ?? {});
        const replaced = SettingsStore.replace(full);
        return res.status(200).json(replaced);
      } catch (err: any) {
        return res.status(400).json({
          error: 'Invalid settings payload',
          detail: String(err?.message ?? err),
        });
      }
    }
  });

  app.use(router);
}

export default function attach(app: Application) {
  registerSettingsRoutes(app);
  return app;
}
