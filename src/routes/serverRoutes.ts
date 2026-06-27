import express, { Request, Response } from 'express';
import Debug from 'debug';
import { checkAuthToken } from '../middlewares/checkAuthToken.js';
import { listRegisteredServers } from '../managers/serverRegistry.js';
import { registerServer, removeServer } from './server.js';
import { setSelectedServer } from '../utils/GlobalStateHelper.js';

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
router.delete('/remove/:hostname', removeServer);

// Minimal server selection endpoint for tests
router.post('/set', (req: Request, res: Response) => {
  const { hostname } = req.body || {};
  if (!hostname || typeof hostname !== 'string' || hostname.trim() === '') {
    return res.status(400).json({ error: 'hostname is required' });
  }
  const name = hostname.trim();
  // Only allow selecting a server that is actually registered.
  const known = listRegisteredServers().some((s: any) => s.hostname === name);
  if (!known) {
    return res.status(404).json({ error: `Server not found: ${name}` });
  }
  setSelectedServer(name);
  debug(`selected server set to ${name}`);
  return res.status(200).json({ selected: name });
});

export default router;
