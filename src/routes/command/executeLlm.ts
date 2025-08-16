import { Request, Response } from 'express';
import Debug from 'debug';
import { getSelectedModel, getSelectedServer } from '../../utils/GlobalStateHelper';
import { chatForServer } from '../../llm';
import { ServerManager } from '../../managers/ServerManager';
import { getServerHandler } from '../../utils/getServerHandler';
import { analyzeError } from '../../llm/errorAdvisor';
import { evaluateCommandSafety } from '../../utils/safety';

const debug = Debug('app:command:execute-llm');

interface LlmPlanCommand { cmd: string; explain?: string }

function extractJsonArray(text: string): any {
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* ignore */ }
    }
  }
  return undefined;
}

export const executeLlm = async (req: Request, res: Response) => {
  const { instructions, dryRun = false, model, stream = false } = req.body || {};
  if (!instructions || typeof instructions !== 'string') {
    return res.status(400).json({ error: 'instructions is required' });
  }

  try {
    // Resolve server and per-server LLM provider if present
    const hostname = getSelectedServer();
    const serverConfig = ServerManager.getServerConfig(hostname);
    if (!serverConfig) {
      return res.status(500).json({ error: 'Selected server not found in config' });
    }

    // Gate: allow local by default; for ssh require per-server llm with provider 'ollama'; ssm not implemented
    if (serverConfig.protocol === 'ssm' && stream) {
      return res.status(501).json({ error: 'execute-llm streaming is not supported for SSM protocol' });
    }
    if (serverConfig.protocol === 'ssh') {
      const ok = !!(serverConfig as any).llm && (serverConfig as any).llm.provider === 'ollama' && (serverConfig as any).llm.baseUrl;
      if (!ok) {
        return res.status(501).json({ error: 'execute-llm requires per-server LLM config (ollama) for SSH hosts' });
      }
    }

    const selectedModel = model || getSelectedModel();
    const system = 'You translate natural language instructions into safe, reproducible shell commands.' +
      ' Output strictly JSON with shape: {"commands":[{"cmd":"...","explain":"..."}]}.' +
      ' Prefer POSIX sh/bash. Avoid destructive commands unless explicitly requested. No commentary outside JSON.';

    const user = JSON.stringify({
      instructions,
      os: process.platform,
      cwd: (await getServerHandler(req).presentWorkingDirectory?.()) || process.cwd(),
    });

    // Setup streaming headers early if streaming to allow error events
    let heartbeat: NodeJS.Timeout | undefined;
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`: connected\n\n`);
      const hbMs = Number(process.env.SSE_HEARTBEAT_MS || (process.env.NODE_ENV === 'test' ? 50 : 15000));
      heartbeat = setInterval(() => { try { res.write(`: keep-alive\n\n`); } catch {} }, isNaN(hbMs)?15000:hbMs);
      // Cleanup
      // @ts-ignore
      (req as any).on?.('close', () => { if (heartbeat) clearInterval(heartbeat); try { res.end(); } catch {} });
    }

    let resp;
    try {
      resp = await chatForServer(serverConfig, {
        model: selectedModel,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      } as any);
    } catch (e) {
      if (stream) {
        res.write('event: error\n');
        res.write(`data: ${JSON.stringify({ message: (e as Error).message })}\n\n`);
        if (heartbeat) clearInterval(heartbeat);
        return res.end();
      }
      throw e;
    }

    const content = resp?.choices?.[0]?.message?.content || '';
    const parsed = extractJsonArray(content);
    const commands: LlmPlanCommand[] = Array.isArray(parsed?.commands) ? parsed.commands : [];

    const plan = { model: selectedModel, provider: resp.provider, commands };

    // Safety evaluation for plan
    const safety = commands.map(c => ({ cmd: c.cmd, decision: evaluateCommandSafety(c.cmd) }));
    const hasDeny = safety.some(s => s.decision.hardDeny);
    const needsConfirm = safety.some(s => s.decision.needsConfirm);

    if (dryRun || commands.length === 0) {
      if (stream) {
        res.write(`event: plan\n`);
        res.write(`data: ${JSON.stringify({ ...plan, safety })}\n\n`);
        res.write('event: done\n');
        res.write('data: {}\n\n');
        if (heartbeat) clearInterval(heartbeat);
        return res.end();
      }
      return res.status(200).json({ plan, safety, results: [] });
    }

    const handler = getServerHandler(req);
    const results = [] as any[];
    // Enforce safety
    const confirmFlag = !!req.body?.confirm;
    if (hasDeny) {
      if (stream) {
        res.write('event: policy\n');
        res.write(`data: ${JSON.stringify({ blocked: true, reason: 'hard-deny', safety })}\n\n`);
        res.write('event: done\n');
        res.write('data: {}\n\n');
        if (heartbeat) clearInterval(heartbeat);
        return res.end();
      }
      return res.status(403).json({ error: 'Plan blocked by policy (deny)', safety, plan });
    }
    if (needsConfirm && !confirmFlag) {
      if (stream) {
        res.write('event: policy\n');
        res.write(`data: ${JSON.stringify({ blocked: true, reason: 'needs-confirmation', safety })}\n\n`);
        res.write('event: done\n');
        res.write('data: {}\n\n');
        if (heartbeat) clearInterval(heartbeat);
        return res.end();
      }
      return res.status(409).json({ error: 'Confirmation required to proceed', safety, plan });
    }

    if (stream) {
      if (serverConfig.protocol === 'ssm') {
        return res.status(501).json({ error: 'execute-llm streaming is not supported for SSM protocol' });
      }
      res.write(`event: plan\n`);
      res.write(`data: ${JSON.stringify({ ...plan, safety })}\n\n`);
    }

    for (let i = 0; i < commands.length; i++) {
      const step = commands[i];
      if (stream) {
        res.write(`event: step\n`);
        res.write(`data: ${JSON.stringify({ index: i, status: 'start', cmd: step.cmd, explain: step.explain })}\n\n`);
      }
      let r;
      try {
        r = await handler.executeCommand(step.cmd);
      } catch (e) {
        if (stream) {
          res.write('event: error\n');
          res.write(`data: ${JSON.stringify({ index: i, message: (e as Error).message })}\n\n`);
          break;
        }
        throw e;
      }
      let aiAnalysis;
      if ((r?.exitCode !== undefined && r.exitCode !== 0) || r?.error) {
        aiAnalysis = await analyzeError({ kind: 'command', input: step.cmd, stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode });
      }
      const payload = { index: i, status: 'complete', cmd: step.cmd, explain: step.explain, ...r, aiAnalysis };
      results.push(payload);
      if (stream) {
        res.write(`event: step\n`);
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }
      if (r?.exitCode && r.exitCode !== 0) break; // stop on first failure
    }

    if (stream) {
      res.write('event: done\n');
      res.write('data: {}\n\n');
      if (heartbeat) clearInterval(heartbeat);
      return res.end();
    }

    res.status(200).json({ plan, results });
  } catch (err) {
    debug('execute-llm failed: ' + String(err));
    res.status(500).json({ error: 'execute-llm failed', message: (err as Error).message });
  }
};
