import express, { Request, Response } from 'express';
import Debug from 'debug';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { listRegisteredServers } from '../managers/serverRegistry';
import { registerServer, removeServer } from './server';

const debug = Debug('app:serverRoutes');
const router = express.Router();

debug('initializing server routes');

// Secure all server endpoints with bearer token auth
router.use(checkAuthToken as any);

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

// New routes from feat/circuit-breakers
router.post('/register', registerServer);
router.post('/remove', removeServer);

export default router;