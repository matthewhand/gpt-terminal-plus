import type { Application, Request, Response } from 'express';
import { Router } from 'express';
import fs from 'fs';

/** Real handler used for engine-specific execute-llm requests (e.g. interpreter CLI) */
import { executeLlm as realExecuteLlm } from './command/executeLlm';

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
  } else if (['python', 'python3'].includes(shell)) {
    const m = cmd.match(/^\s*print\((['"])(.*)\1\)\s*$/);
    if (m) {
      stdout = m[2];
    } else {
      exitCode = 1; stderr = 'mock python runtime error';
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
  } else if (['node', 'nodejs'].includes(language) && /console\.log\(/.test(code)) {
    stdout = 'node-ok';
  } else if (language === 'typescript' && /console\.log\(/.test(code)) {
    stdout = 'tsnode-ok';
  } else {
    exitCode = 1; stderr = `mock ${language} runtime error`;
  }

  const result = { stdout, stderr, exitCode, error: exitCode !== 0 };
  const aiAnalysis = exitCode !== 0 ? { text: 'Mock analysis: code failed.' } : undefined;
  const interpreter = language === 'typescript' ? 'ts-node' : (language === 'nodejs' ? 'node' : language);
  res.status(200).json({ result, aiAnalysis, language, interpreter });
};



const handleExecuteLlm = (req: Request, res: Response) => {
  logReq('/command/execute-llm', req.body);
  const { instructions = '', dryRun = false, stream = false, engine = '' } = (req.body ?? {}) as {
    instructions?: string; dryRun?: boolean; stream?: boolean; engine?: string;
  };

  // Engine-specific requests (interpreter CLI) run through the real handler so
  // tests can mock child_process.spawn and exercise the actual branch.
  if (engine === 'llm:interpreter' || engine === 'interpreter') {
    return realExecuteLlm(req, res);
  }

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

// Diff and patch endpoints
router.post('/diff', (req: Request, res: Response) => {
  logReq('/command/diff', req.body);
  const { filePath } = req.body ?? {};

  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Mock unified diff output
  const diff = `--- a/${filePath}\n+++ b/${filePath}\n@@ -1,3 +1,3 @@\n line1\n-old content\n+new content\n line3`;
  res.json({ diff });
});

router.post('/patch', (req: Request, res: Response) => {
  logReq('/command/patch', req.body);
  const { filePath, patch } = req.body ?? {};

  if (!filePath || !patch) {
    return res.status(400).json({ error: 'filePath and patch are required' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Mock patch application - check for invalid patch format
  if (String(patch).includes('invalid')) {
    return res.json({ ok: false, error: 'Invalid patch format' });
  }

  // Mock successful patch application
  res.json({ ok: true });
});

export default router;

export function registerCommandRoutes(app: Application) {
  app.use('/command', router);
}
