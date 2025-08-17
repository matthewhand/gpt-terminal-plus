import type { Application, Request, Response } from 'express';
import { Router } from 'express';
import fs from 'fs';

const router = Router();

// --- logging (tests assert on this exact shape)
const logReq = (path: string, body: any) => {
  try {
    // eslint-disable-next-line no-console
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
  logReq('/command/execute', req.body);
  const cmd: string = String(req.body?.command ?? '');

  let exitCode = 0, stdout = '', stderr = '';

  if (/^\s*echo\s+/.test(cmd)) {
    stdout = cmd.replace(/^\s*echo\s+/, '').trim();
  } else if (/^\s*exit\s+(\d+)/.test(cmd)) {
    exitCode = Number(cmd.match(/^\s*exit\s+(\d+)/)![1]);
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

  if (language === 'bash' && /^\s*exit\s+(\d+)/.test(code)) {
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

const handleExecuteFile = (req: Request, res: Response) => {
  logReq('/command/execute-file', req.body);
  const filename: string = String(req.body?.filename ?? '');
  const exists = filename && fs.existsSync(filename);

  const result = exists
    ? { stdout: `executed ${filename}`, stderr: '', exitCode: 0, error: false }
    : { stdout: '', stderr: 'ENOENT', exitCode: 1, error: true };

  const aiAnalysis = result.error
    ? { text: 'Mock analysis: file not found. Check name, path, or permissions.' }
    : undefined;

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
router.post('/execute', handleExecute);
router.post('/execute-code', handleExecuteCode);
router.post('/execute-file', handleExecuteFile);
router.post('/execute-llm', handleExecuteLlm);

export default router;

export function registerCommandRoutes(app: Application) {
  app.use('/command', router);
}
