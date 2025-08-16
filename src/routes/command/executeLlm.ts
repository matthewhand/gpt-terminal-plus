import { Request, Response } from 'express';
import Debug from 'debug';
import { getSelectedModel, getSelectedServer } from '../../utils/GlobalStateHelper';
import { chatForServer } from '../../llm';
import { ServerManager } from '../../managers/ServerManager';
import { getServerHandler } from '../../utils/getServerHandler';
import { analyzeError } from '../../llm/errorAdvisor';

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
  const { instructions, dryRun = false, model } = req.body || {};
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

    const selectedModel = model || getSelectedModel();
    const system = 'You translate natural language instructions into safe, reproducible shell commands.' +
      ' Output strictly JSON with shape: {"commands":[{"cmd":"...","explain":"..."}]}.' +
      ' Prefer POSIX sh/bash. Avoid destructive commands unless explicitly requested. No commentary outside JSON.';

    const user = JSON.stringify({
      instructions,
      os: process.platform,
      cwd: (await getServerHandler(req).presentWorkingDirectory?.()) || process.cwd(),
    });

    const resp = await chatForServer(serverConfig, {
      model: selectedModel,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    } as any);

    const content = resp?.choices?.[0]?.message?.content || '';
    const parsed = extractJsonArray(content);
    const commands: LlmPlanCommand[] = Array.isArray(parsed?.commands) ? parsed.commands : [];

    const plan = { model: selectedModel, provider: resp.provider, commands };

    if (dryRun || commands.length === 0) {
      return res.status(200).json({ plan, results: [] });
    }

    const handler = getServerHandler(req);
    const results = [] as any[];
    for (const step of commands) {
      const r = await handler.executeCommand(step.cmd);
      let aiAnalysis;
      if ((r?.exitCode !== undefined && r.exitCode !== 0) || r?.error) {
        aiAnalysis = await analyzeError({ kind: 'command', input: step.cmd, stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode });
      }
      results.push({ cmd: step.cmd, explain: step.explain, ...r, aiAnalysis });
      if (r?.exitCode && r.exitCode !== 0) break; // stop on first failure
    }

    res.status(200).json({ plan, results });
  } catch (err) {
    debug('execute-llm failed: ' + String(err));
    res.status(500).json({ error: 'execute-llm failed', message: (err as Error).message });
  }
};
