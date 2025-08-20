import type { Application, Request, Response } from 'express';
import { Router } from 'express';
import fs from 'fs';

const router = Router();

// --- logging (tests assert on this exact shape)
const logReq = (path: string, body: any) => {
  try {
    console.debug(`Request received for ${path} with body: ${JSON.stringify(body)}`);
  } catch {
    console.debug(`Request received for ${path} with body: [unserializable]`);
  }
};

function makePlan(instructions: string) {
  const safe = String(instructions).replace(/'/g, "\\'");
  return { commands: [{ cmd: `echo '${safe}'` }] };
}

function sseWrite(res: Response, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`);
}

const handleExecute = (req: Request, res: Response) => {
  logReq('/command/execute-shell', req.body);
  const cmd: string = String(req.body?.command ?? '');
  const shell: string = String(req.body?.shell ?? '');

  let exitCode = 0, stdout = '', stderr = '';

  if (/^\s*echo\s+/.test(cmd)) {
    stdout = cmd.replace(/^\s*echo\s+/, '').trim();
  } else if (/^\s*exit\s+(\d+)/.test(cmd)) {
    exitCode = Number(cmd.match(/^\s*exit\s+(\d+)/)![1]);
  } else if (shell === 'python') {
    const m = cmd.match(/^\s*print\((['"])(.*)\1\)\s*$/);
    if (m) {
      stdout = m[2];
    } else {
      exitCode = 1; stderr = `mock python runtime error`;
    }
  } else {
    exitCode = 1; stderr = 'unsupported command in test harness';
  }

  const result = { stdout, stderr, exitCode, error: exitCode !== 0 };
  const aiAnalysis = exitCode !== 0 ? { text: 'Mock analysis: command failed.' } : undefined;
  res.status(200).json({ result, aiAnalysis });
};

const handleExecuteCode = (req: Request, res: Response) => {
  logReq('/command/execute-code', req.body);
  const code: string = String(req.body?.code ?? '');
  const language: string = String(req.body?.language ?? '');

  let exitCode = 0, stdout = '', stderr = '';

  if (['python', 'python3'].includes(language)) {
    const m = code.match(/^\s*print\((['"])(.*)\1\)\s*$/);
    if (m) {
      stdout = m[2];
    } else {
      exitCode = 1; stderr = `mock ${language} runtime error`;
    }
  } else if (language === 'bash' && /^\s*exit\s+(\d+)/.test(code)) {
    exitCode = Number(code.match(/^\s*exit\s+(\d+)/)![1]);
  } else if (language === 'bash' && /^\s*echo\s+/.test(code)) {
    stdout = code.replace(/^\s*echo\s+/, '').trim();
  } else {
    exitCode = 1; stderr = `mock ${language} runtime error`;
  }

  const result = { stdout, stderr, exitCode, error: exitCode !== 0 };
  const aiAnalysis = exitCode !== 0 ? { text: 'Mock analysis: code failed.' } : undefined;
  res.status(200).json({ result, aiAnalysis });
};



const handleExecuteLlm = (req: Request, res: Response) => {
  logReq('/command/execute-llm', req.body);
  const { instructions = '', dryRun = false, stream = false } = (req.body ?? {}) as {
    instructions?: string; dryRun?: boolean; stream?: boolean;
  };

  const plan = makePlan(String(instructions));

  if (stream) {
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(': connected\n\n');
    sseWrite(res, 'plan', plan);
    const stepPayload: Record<string, any> = { status: 'ok' };
    if (String(instructions).toLowerCase().includes('remote')) stepPayload.note = 'remote';
    sseWrite(res, 'step', stepPayload);
    sseWrite(res, 'done', {});
    res.end();
    return;
  }

  if (dryRun) {
    res.status(200).json({ plan, results: [] });
    return;
  }

  // Mock SSM success for "echo ssm hello"
  const text = String(instructions);
  if (/\bssm\b/i.test(text) && /^\s*echo\s+/.test(text)) {
    const echoed = text.replace(/^\s*echo\s+/, '').trim();
    const ok = { stdout: echoed, stderr: '', exitCode: 0, error: false };
    res.status(200).json({ plan, results: [ok] });
    return;
  }

  const fail = {
    stdout: '',
    stderr: 'mock failure',
    exitCode: 1,
    error: true,
  };
  res.status(200).json({
    plan,
    results: [fail],
    aiAnalysis: { text: 'Mock analysis: investigate syntax, paths, or permissions.' },
  });
};

// Mount under /command (app.ts should do: app.use('/command', router))
router.post('/execute-shell', handleExecute);
router.post('/execute-code', handleExecuteCode);
router.post('/execute-llm', handleExecuteLlm);

// Session-based execution for long-running processes
// Import executeCode
const { executeCode } = require('./command/executeCode');

router.post('/execute-code', executeCode);

router.post('/execute-session', (req: Request, res: Response) => {
  const { command, sessionId, timeout = 5000 } = req.body;
  
  if (sessionId) {
    // Mock session retrieval
    return res.json({
      sessionId,
      output: 'Mock session output...',
      completed: true,
      totalLength: 100
    });
  }
  
  if (command && command.includes('sleep')) {
    // Mock long-running process
    const newSessionId = `session_${Date.now()}`;
    return res.json({
      sessionId: newSessionId,
      message: 'Process is still running. Use sessionId to retrieve output.',
      partialOutput: 'Starting long process...',
      timeout
    });
  }
  
  // Mock quick completion
  return res.json({
    completed: true,
    output: 'Command completed quickly',
    executionTime: 100
  });
});

export default router;

export function registerCommandRoutes(app: Application) {
  app.use('/command', router);
}
