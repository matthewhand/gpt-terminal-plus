import { WebSocket, RawData } from 'ws';
import { spawn } from 'child_process';
import { convictConfig } from '../../config/convictConfig';

interface WSSession {
  id: string;
  ws: WebSocket;
  process: ReturnType<typeof spawn>;
  startedAt: string;
}

const wsSessions = new Map<string, WSSession>();

export function handleShellWebSocket(ws: WebSocket, sessionId?: string): void {
  const id = sessionId || `ws-${Date.now()}`;
  const cfg = convictConfig();
  const shell = cfg.get('shell.defaultShell') || 'bash';
  
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
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'stdout', data: data.toString() }));
      }
    });
    
    child.stderr.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'stderr', data: data.toString() }));
      }
    });
    
    child.on('exit', (code) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'exit', code }));
        ws.close();
      }
      wsSessions.delete(id);
    });
    
    ws.on('message', (message: RawData) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'input' && child.stdin) {
          child.stdin.write(data.data);
        }
      } catch (err) {
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