import express, { Request, Response } from 'express';
import { checkAuthToken } from '../../middlewares/checkAuthToken';
import { spawn } from 'child_process';
import { logSessionStep } from '../../utils/activityLogger';

interface ShellLogEntry {
  ts: string;
  chunk: string;
  stream: 'stdout' | 'stderr';
}

interface ShellSession {
  id: string;
  shell: string;
  process: ReturnType<typeof spawn> | null;
  logs: ShellLogEntry[];
  startedAt: string;
  status: 'running' | 'exited';
  exitCode?: number;
}

const sessions = new Map<string, ShellSession>();

const router = express.Router();

// Secure all shell session endpoints
router.use(checkAuthToken as any);

/**
 * @swagger
 * /shell/session/start:
 *   post:
 *     operationId: shellSessionStart
 *     summary: Start a new persistent shell session
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shell:
 *                 type: string
 *                 default: bash
 *     responses:
 *       200:
 *         description: Session started
 *       500:
 *         description: Failed to start session
 */
router.post('/start', async (req: Request, res: Response) => {
  const { shell = 'bash' } = req.body || {};
  const id = `sess-${Date.now()}`;
  const startedAt = new Date().toISOString();

  let child: ReturnType<typeof spawn> | null = null;
  try {
    child = spawn(shell, [], { stdio: 'pipe' });
  } catch (err: any) {
    return res.status(500).json({ message: `Failed to start shell: ${err.message}` });
  }

  const session: ShellSession = {
    id,
    shell,
    process: child,
    logs: [],
    startedAt,
    status: 'running',
  };

  child.on('exit', (code) => {
    session.status = 'exited';
    session.exitCode = code ?? -1;
  });

  sessions.set(id, session);
  try { await logSessionStep('session-start', { id, shell, startedAt }, id); } catch {}
  res.json({ id, shell, startedAt });
});

/**
 * @swagger
 * /shell/session/{id}/exec:
 *   post:
 *     operationId: shellSessionExec
 *     summary: Execute command inside existing session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               command:
 *                 type: string
 *               shell:
 *                 type: string
 *             required:
 *               - command
 *     responses:
 *       200:
 *         description: Command executed
 *       400:
 *         description: Command required
 *       404:
 *         description: Session not found
 */
router.post('/:id?/exec', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { command, shell: reqShell } = req.body;

  if (!command) {
    return res.status(400).json({ message: 'command required' });
  }

  let shell = reqShell || 'bash';

  if (id) {
    // Exec inside existing session
    const session = sessions.get(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    shell = session.shell;
  }

  try { await logSessionStep('exec-start', { id: id || 'adhoc', shell, command }, id || undefined); } catch {}
  const child = spawn(shell, ['-c', command]);

  const startedAt = new Date().toISOString();
  const tempLogs: ShellLogEntry[] = [];

  child.stdout.on('data', (data) => {
    const chunk = data.toString();
    tempLogs.push({ ts: new Date().toISOString(), chunk, stream: 'stdout' });
  });
  child.stderr.on('data', (data) => {
    const chunk = data.toString();
    tempLogs.push({ ts: new Date().toISOString(), chunk, stream: 'stderr' });
  });

  let responded = false;

  // Watchdog: after 5s, if still running, uplift to session
  const timer = setTimeout(() => {
    if (!responded && child.exitCode === null) {
      const sessId = `sess-${Date.now()}`;
      const session: ShellSession = {
        id: sessId,
        shell,
        process: child,
        logs: tempLogs,
        startedAt,
        status: 'running',
      };
      child.on('exit', (code) => {
        session.status = 'exited';
        session.exitCode = code ?? -1;
      });
      sessions.set(sessId, session);

      logSessionStep('executeCommand', { command, status: 'timeout' }, sessId);

      responded = true;
      res.json({ stdout: tempLogs.filter(l => l.stream==='stdout').map(l=>l.chunk).join(''),
                 stderr: tempLogs.filter(l => l.stream==='stderr').map(l=>l.chunk).join(''),
                 sessionId: sessId });
    }
  }, 5000);

  child.on('close', (code) => {
    clearTimeout(timer);
    if (responded) return; // already uplifted
    responded = true;
    const stdout = tempLogs.filter(l => l.stream==='stdout').map(l => l.chunk).join('');
    const stderr = tempLogs.filter(l => l.stream==='stderr').map(l => l.chunk).join('');

    logSessionStep('executeCommand', { command, stdout, stderr, exitCode: code ?? -1, status: 'success' });

    res.json({ stdout, stderr, exitCode: code ?? -1 });
  });
});

/**
 * @swagger
 * /shell/session/{id}/stop:
 *   post:
 *     operationId: shellSessionStop
 *     summary: Stop a persistent shell session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session stopped
 *       404:
 *         description: Session not found
 *       500:
 *         description: Failed to stop session
 */
router.post('/:id/stop', async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  try {
    session.process?.kill();
    session.status = 'exited';
    sessions.delete(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: `Failed to stop session: ${err.message}` });
  }
});

/**
 * @swagger
 * /shell/session/list:
 *   get:
 *     operationId: shellSessionList
 *     summary: List active shell sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions
 */
router.get('/list', async (_: Request, res: Response) => {
  const list = Array.from(sessions.values()).map((s) => ({
    id: s.id,
    shell: s.shell,
    startedAt: s.startedAt,
    status: s.status,
  }));
  res.json({ sessions: list });
});

/**
 * @swagger
 * /shell/session/{id}/logs:
 *   get:
 *     operationId: shellSessionLogs
 *     summary: Fetch logs from a shell session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session logs
 *       404:
 *         description: Session not found
 */
router.get('/:id/logs', async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json({ logs: session.logs, status: session.status, exitCode: session.exitCode });
});

export default router;
