// Minimal WS typing to avoid dependency on @types/ws
// and keep build portable in environments without DOM lib
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WS: any = require('ws');
import { spawn } from 'child_process';
import { convictConfig } from '../../config/convictConfig';

type WSLike = {
  readyState: number;
  send: (data: any) => any;
  close: () => any;
  on: (event: string, cb: (...args: any[]) => void) => any;
};

interface WSSession {
  id: string;
  ws: WSLike;
  process: ReturnType<typeof spawn>;
  startedAt: string;
}

const wsSessions = new Map<string, WSSession>();

export function handleShellWebSocket(ws: WSLike, sessionId?: string): void {
  const id = sessionId || `ws-${Date.now()}`;
  const cfg = convictConfig();
  const shell = cfg.get('shell.defaultShell') || 'bash';
  const OPEN: number = typeof WS?.OPEN === 'number' ? WS.OPEN : 1;
  
  try {
    const child = spawn(shell, [], { stdio: 'pipe' });
    
    const session: WSSession = {
      id,
      ws,
      process: child,
      startedAt: new Date().toISOString(),
    };
    
    wsSessions.set(id, session);
    
    child.stdout.on('data', (data) => {
      if (ws.readyState === OPEN) {
        ws.send(JSON.stringify({ type: 'stdout', data: data.toString() }));
      }
    });
    
    child.stderr.on('data', (data) => {
      if (ws.readyState === OPEN) {
        ws.send(JSON.stringify({ type: 'stderr', data: data.toString() }));
      }
    });
    
    child.on('exit', (code) => {
      if (ws.readyState === OPEN) {
        ws.send(JSON.stringify({ type: 'exit', code }));
        ws.close();
      }
      wsSessions.delete(id);
    });
    
    ws.on('message', (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'input' && child.stdin) {
          child.stdin.write(data.data);
        }
      } catch {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      child.kill();
      wsSessions.delete(id);
    });
    
    ws.send(JSON.stringify({ type: 'ready', sessionId: id }));
    
  } catch (err: any) {
    ws.send(JSON.stringify({ type: 'error', message: err.message }));
    ws.close();
  }
}
