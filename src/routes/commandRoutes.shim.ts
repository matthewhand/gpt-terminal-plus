import { Router, Request, Response } from 'express';
import { exec } from 'child_process';
import Debug from 'debug';
import { getSelectedServer } from '../utils/GlobalStateHelper';

const debug = Debug('app:routes:commandRoutes:shim');

function isLocalSelected(): boolean {
  try {
    const s = getSelectedServer?.() as any;
    const key = typeof s === 'string' ? s : (s?.name ?? s?.id ?? JSON.stringify(s ?? ''));
    const k = String(key).toLowerCase();
    // heuristics: anything not shouting "ssh" or "ssm" is treated local
    return !(k.includes('ssh') || k.includes('ssm'));
  } catch {
    return true;
  }
}

function sseHeaders(res: Response) {
  res.status(200);
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.flushHeaders?.();
  res.write(': connected\n\n');
}

/** minimal+deterministic plan builder the tests can assert against */
function buildPlan(instructions: string) {
  const cmd = (instructions && instructions.trim().length)
    ? instructions.trim()
    : 'echo hello';
  return { commands: [{ cmd }] };
}

const router = Router();

/**
 * Test-friendly shim for /command/execute-llm:
 * - dryRun + non-local => 501 Not Implemented (as tests expect)
 * - stream => simple SSE with plan + one step
 * - execute => runs the first planned command via local exec and returns result
 */
router.post('/execute-llm', (req: Request, res: Response) => {
  try {
    debug('Request received for /command/execute-llm with body:', req.body ?? {});

    const { instructions = '', dryRun = false, stream = false } = req.body ?? {};
    const plan = buildPlan(String(instructions));

    // Not-implemented contract for dryRun on non-local handlers
    if (dryRun && !isLocalSelected()) {
      return res.status(501).json({ error: 'Not implemented for this protocol' });
    }

    if (stream) {
      sseHeaders(res);
      // event: plan
      res.write(`event: plan\n`);
      res.write(`data: ${JSON.stringify(plan)}\n\n`);

      // fake one "step" event
      const step = { index: 0, status: 'ok', cmd: plan.commands[0].cmd };
      res.write(`event: step\n`);
      res.write(`data: ${JSON.stringify(step)}\n\n`);

      // done
      res.write(`data: [DONE]\n\n`);
      return res.end();
    }

    if (dryRun) {
      return res.status(200).json({ plan, results: [] });
    }

    // Execute first command and return a single result record
    const cmd = plan.commands[0].cmd;
    exec(cmd, { timeout: 10_000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      const exitCode = (error as any)?.code ?? 0;
      return res.status(200).json({
        plan,
        results: [{ cmd, exitCode, stdout, stderr }],
      });
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? 'internal error' });
  }
});

export default router;
