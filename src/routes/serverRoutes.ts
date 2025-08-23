import express, { Request, Response } from 'express';
import Debug from 'debug';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { registerServer } from './server/registerServer';
import { removeServer } from './server/removeServer';

const debug = Debug('app:serverRoutes');
const router = express.Router();

debug('initializing server routes');

// Secure all server endpoints with bearer token auth
router.use(checkAuthToken as any);

import { listRegisteredServers } from '../managers/serverRegistry';

/**
 * GET /server/list (also /list)
 * Returns servers from in-memory registry (loaded from config at boot)
 */
const handleServerList = (req: Request, res: Response) => {
  try {
    const servers = listRegisteredServers().map(s => ({
      hostname: s.hostname,
      protocol: s.protocol,
      modes: s.modes || [],
      registeredAt: s.registeredAt
    }));

    res.status(200).json({ servers });
  } catch (err: any) {
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
};

/* '/server/list' inside router is redundant when mounted at '/server' (would become '/server/server/list'). */
router.get('/list', handleServerList);
router.post('/register', registerServer);
router.delete('/:hostname', removeServer);

export default router;
