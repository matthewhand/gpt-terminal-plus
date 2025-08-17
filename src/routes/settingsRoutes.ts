import type { Application, Request, Response } from 'express';
import express from 'express';
import { SettingsSchema } from '../settings/schema';
import { SettingsStore } from '../settings/store';

export function registerSettingsRoutes(app: Application) {
  const router = express.Router();

  router.get('/settings', (_req: Request, res: Response) => {
    return res.status(200).json(SettingsStore.get());
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
