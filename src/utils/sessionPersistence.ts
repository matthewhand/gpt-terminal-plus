import fs from 'fs/promises';
import path from 'path';

interface PersistedSession {
  id: string;
  shell: string;
  startedAt: string;
  lastActivity: string;
  status: 'running' | 'exited';
  exitCode?: number;
}

const SESSION_FILE = path.join(process.cwd(), '.sessions.json');

export async function saveSessions(sessions: Map<string, any>): Promise<void> {
  try {
    const data = Array.from(sessions.entries()).map(([, session]) => ({
      id: session.id,
      shell: session.shell,
      startedAt: session.startedAt,
      lastActivity: session.lastActivity,
      status: session.status,
      exitCode: session.exitCode,
    }));
    await fs.writeFile(SESSION_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save sessions:', err);
  }
}

export async function loadSessions(): Promise<PersistedSession[]> {
  try {
    const data = await fs.readFile(SESSION_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
