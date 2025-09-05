import { spawn } from 'child_process';

type SessionLog = {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  at: number;
  timestamp?: Date;
};

type SessionMeta = {
  id: string;
  shell: string;
  createdAt: number;
};

const sessions = new Map<string, { meta: SessionMeta; logs: SessionLog[] }>();

export class ShellSessionDriver {
  async start(params?: { shell?: string }): Promise<SessionMeta & { status: string; createdAt: Date }> {
    const shell = params?.shell || 'bash';
    const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const meta: SessionMeta = { id, shell, createdAt: Date.now() };
    sessions.set(id, { meta, logs: [] });
    return { ...meta, status: 'running', createdAt: new Date(meta.createdAt) };
  }

  async exec(id: string, command: string): Promise<{ stdout: string; stderr: string; exitCode: number; success: boolean }> {
    const s = sessions.get(id);
    if (!s) throw new Error(`Session not found: ${id}`);

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
        const log: SessionLog = { command, stdout, stderr, exitCode, at: Date.now() };
        s.logs.push(log);
        resolve({ stdout, stderr, exitCode, success: exitCode === 0 });
      });
    });
  }

  async logs(id: string): Promise<SessionLog[]> {
    const s = sessions.get(id);
    if (!s) throw new Error(`Session not found: ${id}`);
    return s.logs.map(log => ({ ...log, timestamp: new Date(log.at) }));
  }

  async list(): Promise<Array<{ id: string; shell: string; status: string; createdAt: Date }>> {
    const result = [];
    for (const [id, session] of sessions.entries()) {
      result.push({
        id,
        shell: session.meta.shell,
        status: 'running',
        createdAt: new Date(session.meta.createdAt)
      });
    }
    return result;
  }

  async stop(id: string): Promise<void> {
    // No persistent process is maintained in this minimal driver.
    // Retain logs for post-stop inspection.
    if (!sessions.has(id)) return;
    // Keep meta/logs for tests; no-op
  }
}

