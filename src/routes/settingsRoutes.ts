import express, { Request, Response } from 'express';
import Debug from 'debug';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { getRedactedSettings } from '../config/convictConfig';

const debug = Debug('app:settingsRoutes');
const router = express.Router();

// Secure settings endpoints with bearer token auth
router.use(checkAuthToken as any);

/**
 * GET /settings
 * Returns a redacted snapshot of configuration settings.
 * Values overridden by environment variables are marked readOnly: true.
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const payload = getRedactedSettings();
    res.status(200).json(payload);
  } catch (err: any) {
    debug('Error generating redacted settings: %s', err?.message ?? err);
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
});

export default router;
