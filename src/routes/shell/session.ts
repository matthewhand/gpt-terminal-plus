import { Request, Response } from 'express';
import { SessionManager } from '../../managers/SessionManager';

// POST /shell/session/start
export const startSession = async (req: Request, res: Response) => {
  const { shell = 'bash' } = req.body;
  
  try {
    const sessionId = SessionManager.createSession(shell);
    res.json({
      success: true,
      sessionId,
      shell,
      status: 'created',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// POST /shell/session/:id/exec
export const executeInSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({
      success: false,
      error: 'Command is required'
    });
  }

  try {
    const result = SessionManager.executeCommand(id, command);
    res.json({
      success: result.success,
      sessionId: id,
      command,
      output: result.output,
      error: result.error,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to execute command',
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// POST /shell/session/:id/stop
export const stopSession = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const terminated = SessionManager.terminateSession(id);
    if (terminated) {
      res.json({
        success: true,
        sessionId: id,
        status: 'terminated',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to terminate session',
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// GET /shell/session/list
export const listSessions = async (req: Request, res: Response) => {
  try {
    const sessions = SessionManager.listSessions();
    res.json({
      success: true,
      sessions,
      count: sessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list sessions',
      message: error instanceof Error ? error.message : String(error)
    });
  }
};