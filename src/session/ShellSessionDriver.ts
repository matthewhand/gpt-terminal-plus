import { spawn } from 'child_process';

type SessionLog = {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  at: number;
  timestamp?: Date;
};

type SessionStatus = 'running' | 'stopped';

type SessionMeta = {
  id: string;
  shell: string;
  createdAt: number;
  lastActivity: number;
  status: SessionStatus;
};

const sessions = new Map<string, { meta: SessionMeta; logs: SessionLog[] }>();

export class ShellSessionDriver {
  async start(params?: { shell?: string }): Promise<SessionMeta> {
    const shell = params?.shell || 'bash';
    const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const createdAt = Date.now();
    const meta: SessionMeta = { id, shell, createdAt, lastActivity: createdAt, status: 'running' };
    sessions.set(id, { meta, logs: [] });
    return { ...meta };
  }

  async exec(id: string, command: string): Promise<{ stdout: string; stderr: string; exitCode: number; success: boolean }> {
    const s = sessions.get(id);
    if (!s) throw new Error(`Session not found: ${id}`);
    if (s.meta.status === 'stopped') throw new Error(`Session is stopped: ${id}`);

    if (!command || command.trim() === '') {
      throw new Error('Command cannot be empty');
    }

    // Run a single command using the configured shell
    const shell = s.meta.shell || 'bash';
    const isBashLike = /bash|zsh|sh/i.test(shell);
    const args = isBashLike ? ['-lc', command] : ['-c', command];

    return await new Promise((resolve, reject) => {
      const child = spawn(shell, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      child.stdout?.on('data', (d) => { stdout += d.toString(); });
      child.stderr?.on('data', (d) => { stderr += d.toString(); });
      child.on('error', reject);
      child.on('close', (code) => {
        const exitCode = typeof code === 'number' ? code : 1;
        const at = Date.now();
        const log: SessionLog = { command, stdout, stderr, exitCode, at };
        s.logs.push(log);
        s.meta.lastActivity = at;
        resolve({ stdout, stderr, exitCode, success: exitCode === 0 });
      });
    });
  }

  async logs(id: string): Promise<SessionLog[]> {
    const s = sessions.get(id);
    if (!s) throw new Error(`Session not found: ${id}`);
    return s.logs.map(log => ({ ...log, timestamp: new Date(log.at) }));
  }

  async list(): Promise<Array<{ id: string; shell: string; status: SessionStatus; createdAt: Date; lastActivity: Date }>> {
    const result = [];
    for (const [id, session] of sessions.entries()) {
      result.push({
        id,
        shell: session.meta.shell,
        status: session.meta.status,
        createdAt: new Date(session.meta.createdAt),
        lastActivity: new Date(session.meta.lastActivity)
      });
    }
    return result;
  }

  async stop(id: string): Promise<void> {
    // This driver runs each exec as a one-shot child, so there is no long-lived
    // process to kill. Mark the session stopped (so list() reports it and exec()
    // refuses further commands) but retain meta/logs for post-stop inspection.
    const s = sessions.get(id);
    if (!s) {
      throw new Error(`Session not found: ${id}`);
    }
    s.meta.status = 'stopped';
  }
}

/** Test helper to reset shared session state between tests (not for prod use) */
export function __clearSessionsForTests() {
  sessions.clear();
}

