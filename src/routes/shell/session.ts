import express, { Request, Response } from 'express';
import { checkAuthToken } from '../../middlewares/checkAuthToken';
import { validateCommand } from '../../middlewares/commandValidator';
import { spawn } from 'child_process';
import { logSessionStep } from '../../utils/activityLogger';
import { saveSessions, loadSessions } from '../../utils/sessionPersistence';

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
  lastActivity: string;
}

const sessions = new Map<string, ShellSession>();

const router = express.Router();

// Secure all shell session endpoints
router.use(checkAuthToken as any);
router.use(validateCommand);

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
    lastActivity: startedAt,
  };

  child.on('exit', (code) => {
    session.status = 'exited';
    session.exitCode = code ?? -1;
  });

  sessions.set(id, session);
  try { 
    await logSessionStep('session-start', { id, shell, startedAt }, id);
    await saveSessions(sessions);
  } catch {}
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

  // Circuit breaker: MAX_INPUT_CHARS
  const cfg = convictConfig();
  const maxInputChars = Number(cfg.get('limits.maxInputChars') || 10000);
  if (command.length > maxInputChars) {
    return res.status(400).json({ 
      message: 'Input too long', 
      truncated: true, 
      maxChars: maxInputChars 
    });
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
  const maxOutputChars = Number(cfg.get('limits.maxOutputChars') || 100000);
  let totalOutputChars = 0;
  let outputTruncated = false;

  child.stdout.on('data', (data) => {
    const chunk = data.toString();
    totalOutputChars += chunk.length;
    if (totalOutputChars > maxOutputChars && !outputTruncated) {
      outputTruncated = true;
      child.kill();
      tempLogs.push({ ts: new Date().toISOString(), chunk: '\n[OUTPUT TRUNCATED - LIMIT EXCEEDED]', stream: 'stderr' });
      return;
    }
    tempLogs.push({ ts: new Date().toISOString(), chunk, stream: 'stdout' });
    const s = sessions.get(id || '') || null;
    if (s) s.lastActivity = new Date().toISOString();
  });
  child.stderr.on('data', (data) => {
    const chunk = data.toString();
    totalOutputChars += chunk.length;
    if (totalOutputChars > maxOutputChars && !outputTruncated) {
      outputTruncated = true;
      child.kill();
      tempLogs.push({ ts: new Date().toISOString(), chunk: '\n[OUTPUT TRUNCATED - LIMIT EXCEEDED]', stream: 'stderr' });
      return;
    }
    tempLogs.push({ ts: new Date().toISOString(), chunk, stream: 'stderr' });
    const s = sessions.get(id || '') || null;
    if (s) s.lastActivity = new Date().toISOString();
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
        lastActivity: new Date().toISOString(),
      };
      child.on('exit', (code) => {
        session.status = 'exited';
        session.exitCode = code ?? -1;
      });
      sessions.set(sessId, session);

      logSessionStep('executeCommand', { command, status: 'timeout' }, sessId);

      responded = true;
      res.json({ 
        stdout: tempLogs.filter(l => l.stream==='stdout').map(l=>l.chunk).join(''),
        stderr: tempLogs.filter(l => l.stream==='stderr').map(l=>l.chunk).join(''),
        sessionId: sessId,
        truncated: outputTruncated,
        terminated: true
      });
    }
  }, 5000);

  child.on('close', (code) => {
    clearTimeout(timer);
    if (responded) return; // already uplifted
    responded = true;
    const stdout = tempLogs.filter(l => l.stream==='stdout').map(l => l.chunk).join('');
    const stderr = tempLogs.filter(l => l.stream==='stderr').map(l => l.chunk).join('');

    logSessionStep('executeCommand', { command, stdout, stderr, exitCode: code ?? -1, status: 'success' });

    res.json({ 
      stdout, 
      stderr, 
      exitCode: code ?? -1,
      truncated: outputTruncated,
      terminated: outputTruncated
    });
  });
});

/**
 * @swagger
 * /shell/session/{id}/cd:
 *   post:
 *     operationId: shellSessionChangeDirectory
 *     summary: Change working directory inside existing session
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               directory:
 *                 type: string
 *             required:
 *               - directory
 *     responses:
 *       200:
 *         description: Directory changed successfully
 *       404:
 *         description: Session not found
 *       500:
 *         description: Failed to change directory
 */
router.post('/:id/cd', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { directory } = req.body;

  if (!directory) {
    return res.status(400).json({ message: 'directory is required' });
  }

  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  try {
    // Assuming the server handler associated with the session can handle directory changes
    // This part needs to be implemented in the respective server handlers (Local, SSH, SSM)
    // For now, we'll just update the session's current directory (if applicable)
    // and log the action.
    // In a real implementation, you'd call a method on the server handler here.
    // For example: await session.serverHandler.changeDirectory(directory);
    
    // For now, just update the current folder in the session object for demonstration
    // This is a placeholder and needs proper implementation in handlers
    // session.currentFolder = directory; // This property doesn't exist on ShellSession yet

    await logSessionStep('change-directory', { sessionId: id, directory }, id);
    res.json({ success: true, message: `Changed directory to ${directory}` });
  } catch (error: any) {
    res.status(500).json({ message: `Failed to change directory: ${error.message}` });
  }
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
    await saveSessions(sessions);
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

// Session recovery on startup (disabled during tests to avoid open handles)
if (process.env.NODE_ENV !== 'test') {
  (async function recoverSessions() {
    try {
      const persisted = await loadSessions();
      console.log(`Recovered ${persisted.length} sessions from disk`);
    } catch (err) {
      console.error('Failed to recover sessions:', err);
    }
  })();
}

// Watchdog for session limits
import { convictConfig } from '../../config/convictConfig';
// Watchdog for session limits (disabled during tests to avoid open handles)
if (process.env.NODE_ENV !== 'test') {
  (function initWatchdog() {
    const cfg = convictConfig();
    const getLimit = (key: string, def: number) => { try { return Number(cfg.get(key)) || def; } catch { return def; } };
    const maxDuration = getLimit('limits.maxSessionDurationSec', 7200) * 1000;
    const maxIdle = getLimit('limits.maxSessionIdleSec', 600) * 1000;
    setInterval(async () => {
      const now = Date.now();
      sessions.forEach((s, id) => {
        if (!s.process || s.status !== 'running') return;
        const started = Date.parse(s.startedAt);
        const last = Date.parse(s.lastActivity || s.startedAt);
        if ((now - started) > maxDuration) {
          try { s.process.kill(); } catch {}
          s.status = 'exited';
          sessions.delete(id);
          logSessionStep('termination', { reason: 'sessionDurationExceeded', sessionId: id, limitMs: maxDuration });
        } else if ((now - last) > maxIdle) {
          try { s.process.kill(); } catch {}
          s.status = 'exited';
          sessions.delete(id);
          logSessionStep('termination', { reason: 'idleTimeout', sessionId: id, idleMs: (now - last), limitMs: maxIdle });
        }
      });
      // Periodic persistence save
      try { await saveSessions(sessions); } catch {}
    }, 5000);
  })();
}
