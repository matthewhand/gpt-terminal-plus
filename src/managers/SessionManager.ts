import { spawn, ChildProcess } from 'child_process';
import { randomBytes } from 'crypto';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

interface ShellSession {
  id: string;
  shell: string;
  process: ChildProcess;
  createdAt: Date;
  lastActivity: Date;
  buffer: string;
  isActive: boolean;
}

export class SessionManager {
  private static sessions = new Map<string, ShellSession>();
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  static createSession(shell: string = 'bash'): string {
    const id = randomBytes(8).toString('hex');
    
    // Spawn shell process
    const childProcess = spawn(shell, ['-i'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PS1: '$ ' }
    });

    const session: ShellSession = {
      id,
      shell,
      process: childProcess,
      createdAt: new Date(),
      lastActivity: new Date(),
      buffer: '',
      isActive: true
    };

    // Handle process output
    childProcess.stdout?.on('data', (data: any) => {
      session.buffer += data.toString();
      session.lastActivity = new Date();
    });

    childProcess.stderr?.on('data', (data: any) => {
      session.buffer += data.toString();
      session.lastActivity = new Date();
    });

    childProcess.on('exit', () => {
      session.isActive = false;
    });

    this.sessions.set(id, session);
    this.logSessionEvent(id, 'SESSION_CREATED', { shell });
    
    return id;
  }

  static executeCommand(sessionId: string, command: string): { success: boolean; output?: string; error?: string } {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return { success: false, error: 'Session not found or inactive' };
    }

    // Clear buffer and send command
    session.buffer = '';
    session.process.stdin?.write(command + '\n');
    session.lastActivity = new Date();

    this.logSessionEvent(sessionId, 'COMMAND_EXECUTED', { command });

    // Wait briefly for output (simple implementation)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, output: session.buffer });
      }, 1000);
    }) as any;
  }

  static getSession(sessionId: string): ShellSession | undefined {
    return this.sessions.get(sessionId);
  }

  static listSessions(): Array<{ id: string; shell: string; createdAt: Date; isActive: boolean }> {
    return Array.from(this.sessions.values()).map(s => ({
      id: s.id,
      shell: s.shell,
      createdAt: s.createdAt,
      isActive: s.isActive
    }));
  }

  static terminateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.process.kill();
    session.isActive = false;
    this.sessions.delete(sessionId);
    
    this.logSessionEvent(sessionId, 'SESSION_TERMINATED', {});
    return true;
  }

  static cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [id, session] of this.sessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
        this.terminateSession(id);
      }
    }
  }

  private static logSessionEvent(sessionId: string, event: string, data: any): void {
    const logDir = path.join(process.cwd(), 'data', 'activity', new Date().toISOString().split('T')[0]);
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId,
      event,
      data
    };

    const logFile = path.join(logDir, `session_${sessionId}.jsonl`);
    writeFileSync(logFile, JSON.stringify(logEntry) + '\n', { flag: 'a' });
  }
}