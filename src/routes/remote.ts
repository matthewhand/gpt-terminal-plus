import express, { Request, Response } from 'express';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { createSSHSession, createSSMSession, getRemoteSession, listRemoteSessions } from '../engines/remoteEngine';

const router = express.Router();
router.use(checkAuthToken as any);

/**
 * @swagger
 * /remote/ssh:
 *   post:
 *     operationId: createSSH
 *     summary: Create SSH session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               host:
 *                 type: string
 *               user:
 *                 type: string
 *             required:
 *               - host
 *     responses:
 *       200:
 *         description: SSH session created
 */
router.post('/ssh', async (req: Request, res: Response) => {
  const { host, user } = req.body;
  if (!host) {
    return res.status(400).json({ message: 'host required' });
  }
  
  try {
    const session = await createSSHSession(host, user);
    res.json(session);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /remote/ssm:
 *   post:
 *     operationId: createSSM
 *     summary: Create SSM session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instanceId:
 *                 type: string
 *             required:
 *               - instanceId
 *     responses:
 *       200:
 *         description: SSM session created
 */
router.post('/ssm', async (req: Request, res: Response) => {
  const { instanceId } = req.body;
  if (!instanceId) {
    return res.status(400).json({ message: 'instanceId required' });
  }
  
  try {
    const session = await createSSMSession(instanceId);
    res.json(session);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /remote/list:
 *   get:
 *     operationId: listRemote
 *     summary: List remote sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Remote sessions
 */
router.get('/list', (_: Request, res: Response) => {
  res.json({ sessions: listRemoteSessions() });
});

export default router;