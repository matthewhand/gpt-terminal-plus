import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';
import { spawn } from 'child_process';

interface SessionData {
  process: any;
  output: string;
  startTime: number;
  completed: boolean;
}

const sessions = new Map<string, SessionData>();

/**
 * Execute command with session support for long-running processes
 * @route POST /command/execute-session
 */
export const executeSession = async (req: Request, res: Response) => {
  const { command, timeout = 5000, sessionId } = req.body;

  // If sessionId provided, return incremental output
  if (sessionId) {
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { offset = 0, size = 1000 } = req.body;
    const output = session.output.slice(offset, offset + size);
    
    return res.json({
      sessionId,
      output,
      completed: session.completed,
      totalLength: session.output.length,
      hasMore: offset + size < session.output.length
    });
  }

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const server = getServerHandler(req);
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Start process
    const proc = spawn('bash', ['-c', command], { 
      stdio: ['pipe', 'pipe', 'pipe'] 
    });

    const session: SessionData = {
      process: proc,
      output: '',
      startTime: Date.now(),
      completed: false
    };

    sessions.set(newSessionId, session);

    // Collect output
    proc.stdout?.on('data', (data) => {
      session.output += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      session.output += data.toString();
    });

    proc.on('close', (code) => {
      session.completed = true;
      session.output += `\n[Process exited with code ${code}]`;
      
      // Clean up after 5 minutes
      setTimeout(() => {
        sessions.delete(newSessionId);
      }, 300000);
    });

    // Check if process completes within timeout
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve('timeout'), timeout);
    });

    const completionPromise = new Promise((resolve) => {
      proc.on('close', () => resolve('completed'));
    });

    const result = await Promise.race([timeoutPromise, completionPromise]);

    if (result === 'completed') {
      // Process completed within timeout
      const finalOutput = session.output;
      sessions.delete(newSessionId);
      
      return res.json({
        completed: true,
        output: finalOutput,
        executionTime: Date.now() - session.startTime
      });
    } else {
      // Process still running, return session ID
      return res.json({
        sessionId: newSessionId,
        message: 'Process is still running. Use sessionId to retrieve output.',
        partialOutput: session.output.slice(0, 500) + '...',
        timeout: timeout
      });
    }

  } catch (error) {
    handleServerError(error, res, 'Error executing session command');
  }
};