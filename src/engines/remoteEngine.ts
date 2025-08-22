import { spawn } from 'child_process';
import { convictConfig } from '../config/convictConfig';

export interface RemoteSession {
  id: string;
  type: 'ssh' | 'ssm';
  target: string;
  process: ReturnType<typeof spawn> | null;
  status: 'connecting' | 'connected' | 'disconnected';
}

const remoteSessions = new Map<string, RemoteSession>();

export async function createSSHSession(host: string, user?: string): Promise<RemoteSession> {
  const id = `ssh-${Date.now()}`;
  const sshCmd = user ? `${user}@${host}` : host;
  
  const session: RemoteSession = {
    id,
    type: 'ssh',
    target: sshCmd,
    process: null,
    status: 'connecting',
  };
  
  try {
    const child = spawn('ssh', [sshCmd], { stdio: 'pipe' });
    session.process = child;
    session.status = 'connected';
    
    child.on('exit', () => {
      session.status = 'disconnected';
      remoteSessions.delete(id);
    });
    
    remoteSessions.set(id, session);
    return session;
  } catch (err) {
    session.status = 'disconnected';
    throw err;
  }
}

export async function createSSMSession(instanceId: string): Promise<RemoteSession> {
  const id = `ssm-${Date.now()}`;
  
  const session: RemoteSession = {
    id,
    type: 'ssm',
    target: instanceId,
    process: null,
    status: 'connecting',
  };
  
  try {
    const child = spawn('aws', ['ssm', 'start-session', '--target', instanceId], { stdio: 'pipe' });
    session.process = child;
    session.status = 'connected';
    
    child.on('exit', () => {
      session.status = 'disconnected';
      remoteSessions.delete(id);
    });
    
    remoteSessions.set(id, session);
    return session;
  } catch (err) {
    session.status = 'disconnected';
    throw err;
  }
}

export function getRemoteSession(id: string): RemoteSession | undefined {
  return remoteSessions.get(id);
}

export function listRemoteSessions(): RemoteSession[] {
  return Array.from(remoteSessions.values());
}