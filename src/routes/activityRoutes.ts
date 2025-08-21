import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { checkAuthToken } from '../middlewares/checkAuthToken';

const router = express.Router();

// Secure all activity endpoints
router.use(checkAuthToken as any);

/**
 * GET /activity/list
 * @summary List recent activity sessions
 * @param {string} [date] - Date in YYYY-MM-DD format (optional, defaults to today)
 * @param {number} [limit=50] - Limit number of sessions (optional, default: 50)
 * @param {string} [type] - Filter by execution type (optional)
 * @return {object} 200 - Success response
 * @example response - 200 - Example success response
 * {
 *   "sessions": [
 *     { "date": "2025-08-21", "id": "session_001", "steps": 5, "startedAt": "..." }
 *   ]
 * }
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { date, limit = '50', type } = req.query as { date?: string; limit?: string; type?: string; };
    const activityDir = path.join('data', 'activity');
    
    let sessions: any[] = [];
    
    if (date) {
      // Get sessions for specific date
      const dateDir = path.join(activityDir, date);
      try {
        const sessionDirs = await fs.readdir(dateDir);
        for (const sessionDir of sessionDirs) {
          if (sessionDir.startsWith('session_')) {
            const sessionPath = path.join(dateDir, sessionDir);
            const session = await getSessionSummary(sessionPath, date, sessionDir);
            if (!type || session.types.includes(type)) {
              sessions.push(session);
            }
          }
        }
      } catch (err) {
        // Date directory doesn't exist
      }
    } else {
      // Get recent sessions from all dates
      try {
        const dateDirs = await fs.readdir(activityDir);
        const sortedDates = dateDirs.sort().reverse(); // Most recent first
        
        for (const dateDir of sortedDates.slice(0, 7)) { // Last 7 days
          const datePath = path.join(activityDir, dateDir);
          try {
            const sessionDirs = await fs.readdir(datePath);
            for (const sessionDir of sessionDirs) {
              if (sessionDir.startsWith('session_')) {
                const sessionPath = path.join(datePath, sessionDir);
                const session = await getSessionSummary(sessionPath, dateDir, sessionDir);
                if (!type || session.types.includes(type)) {
                  sessions.push(session);
                }
              }
            }
          } catch (err) {
            // Skip invalid directories
          }
        }
      } catch (err) {
        // Activity directory doesn't exist
      }
    }
    
    // Sort by timestamp and limit
    sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    sessions = sessions.slice(0, parseInt(limit as string));
    
    res.json({
      status: 'success',
      message: 'Sessions retrieved successfully',
      data: { sessions }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to list sessions: ' + (error instanceof Error ? error.message : 'Unknown error'),
      data: null
    });
  }
});

/**
 * GET /activity/session/{date}/{id}
 * @summary Fetch a full activity session
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} id - Session ID
 * @return {object} 200 - Success response
 * @example response - 200 - Example success response
 * {
 *   "meta": { "sessionId": "session_001", "startedAt": "..." },
 *   "steps": [
 *     { "type": "executeShell", "command": "ls", "stdout": "...", "stderr": "" }
 *   ]
 * }
 */
router.get('/session/:date/:id', async (req: Request, res: Response) => {
  try {
    const { date, id } = req.params;
    const sessionPath = path.join('data', 'activity', date, id);
    
    try {
      await fs.access(sessionPath);
    } catch {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found',
        data: null
      });
    }
    
    const files = await fs.readdir(sessionPath);
    const session: any = { steps: [], meta: null };
    
    for (const file of files) {
      const filePath = path.join(sessionPath, file);
      const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
      
      if (file === 'meta.json') {
        session.meta = content;
      } else if (file.match(/^\d+-/)) {
        session.steps.push({
          filename: file,
          ...content
        });
      }
    }
    
    // Sort steps by filename
    session.steps.sort((a: any, b: any) => a.filename.localeCompare(b.filename));
    
    res.json({
      status: 'success',
      message: 'Session retrieved successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get session: ' + (error instanceof Error ? error.message : 'Unknown error'),
      data: null
    });
  }
});

async function getSessionSummary(sessionPath: string, date: string, sessionId: string) {
  try {
    const files = await fs.readdir(sessionPath);
    const metaPath = path.join(sessionPath, 'meta.json');
    
    let meta = {
      sessionId,
      startedAt: new Date().toISOString(),
      user: 'unknown',
      label: 'Session'
    };
    
    try {
      const metaContent = await fs.readFile(metaPath, 'utf8');
      meta = JSON.parse(metaContent);
    } catch {
      // No meta file
    }
    
    const stepFiles = files.filter(f => f.match(/^\d+-/));
    const types = [...new Set(stepFiles.map(f => f.split('-')[1]))];
    
    return {
      sessionId,
      date,
      timestamp: meta.startedAt,
      user: meta.user,
      label: meta.label,
      stepCount: stepFiles.length,
      types
    };
  } catch (error) {
    return {
      sessionId,
      date,
      timestamp: new Date().toISOString(),
      user: 'unknown',
      label: 'Session',
      stepCount: 0,
      types: []
    };
  }
}

export default router;