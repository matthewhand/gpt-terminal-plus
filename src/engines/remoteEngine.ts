import { spawn } from 'child_process';

export interface RemoteSession {
  id: string;
  type: 'ssh' | 'ssm';
  target: string;
  process: ReturnType<typeof spawn> | null;
  status: 'connecting' | 'connected' | 'disconnected';
}

const remoteSessions = new Map<string, RemoteSession>();

export async function createSSHSession(host: string, user?: string): Promise<RemoteSession> {
  if (!host || host.trim() === '') {
    throw new Error('Invalid hostname');
  }
  if (user !== undefined && user.trim() === '') {
    throw new Error('Invalid username');
  }
  
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
  if (!instanceId || instanceId.trim() === '') {
    throw new Error('Instance ID required');
  }
  if (!instanceId.match(/^i-[0-9a-f]{8,17}$/)) {
    throw new Error('Invalid instance ID');
  }
  
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