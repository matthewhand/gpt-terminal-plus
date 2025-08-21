import express, { Request, Response } from 'express';
import Debug from 'debug';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { listServersForToken, type ServerDescriptor } from '../managers/serverList';

const debug = Debug('app:serverRoutes');
const router = express.Router();

debug('initializing server routes');

// Secure all server endpoints with bearer token auth
router.use(checkAuthToken as any);

/**
 * GET /server/list (also /list)
 * Returns servers visible to the caller's token (see config/servers.json allowedTokens)
 */
const handleServerList = (req: Request, res: Response) => {
  try {
    const h = String(req.headers?.authorization ?? '');
    const m = h.match(/^Bearer\s+(.+)$/i);
    const token = m ? m[1] : '';

    const servers = listServersForToken(String(token)).map((s: ServerDescriptor) => ({
      key: s.key,
      label: s.label,
      protocol: s.protocol,
      hostname: s.hostname ?? null,
    }));

    res.status(200).json({ servers });
  } catch (err: any) {
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
};

/* '/server/list' inside router is redundant when mounted at '/server' (would become '/server/server/list'). */
router.get('/list', handleServerList);

export default router;
