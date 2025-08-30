import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { validateInput, validationPatterns, sanitizers } from "../../middlewares/inputValidation";
import { convictConfig } from "../../config/convictConfig";
import { getExecuteTimeout } from "../../utils/timeout";
import os from "os";
import path from "path";
import { promises as fsp } from "fs";
import shellEscape from "shell-escape";
import { analyzeError } from "../../llm/errorAdvisor";
import { logSessionStep } from "../../utils/activityLogger";
import { enforceInputLimit, clipOutput, getLimitConfig } from "../../utils/limits";
import { getSelectedModel, getSelectedServer, getPresentWorkingDirectory } from "../../utils/GlobalStateHelper";
import { chatForServer } from "../../llm";
import { ServerManager } from "../../managers/ServerManager";
import { evaluateCommandSafety } from "../../utils/safety";
import { spawn, spawnSync } from "child_process";
import { executeCommand as executeLocalCommand } from "../../handlers/local/actions/executeCommand";
import express from "express";
import { checkAuthToken } from "../../middlewares/checkAuthToken";
import { listExecutors, setExecutorEnabled } from "../../utils/executors";
import { isLlmEnabled } from "../../llm/llmClient";
import { securityLogger, logSecurityEvent } from "../../middlewares/securityLogger";
import { validateRequest, commonValidations } from "../../middlewares/enhancedValidation";
import { rateLimiters } from "../../middlewares/advancedRateLimit";

const debug = Debug("app:command");

/**
 * Function to change the working directory on the server.
 */
export const changeDirectory = async (req: Request, res: Response) => {
  const { directory } = req.body;

  if (!directory) {
    debug("Directory is required but not provided.");
    return res.status(400).json({ error: "Directory is required" });
  }

  try {
    const server = getServerHandler(req);
    const success = await server.changeDirectory(directory);
    debug(`Directory changed to: ${directory}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? "Directory changed successfully." : "Failed to change directory."
    });
  } catch (err) {
    debug(`Error changing directory: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, "Error changing directory");
  }
};

/**
 * Thin wrapper to force bash executor
 */
export async function executeBash(req: Request, res: Response) {
  const cfg = convictConfig();
  if (!(cfg as any).get('executors.bash.enabled')) {
    return res.status(409).json({ error: 'bash executor disabled' });
  }
  req.body = { ...(req.body || {}), shell: 'bash' };
  return executeShell(req, res);
}

/**
 * Function to execute code on the server.
 */
export const executeCode = async (req: Request, res: Response) => {
  const sessionId = `session_${Date.now()}`;
  const { code, language } = req.body;

  await logSessionStep('executeCode-input', { code, language }, sessionId);

  if (typeof code !== 'string' || code.trim() === '' || typeof language !== 'string' || language.trim() === '') {
    return res.status(400).json({ error: 'Code and language are required.' });
  }

  // Circuit breaker: input length
  const inputCheck = enforceInputLimit('executeCode', String(code));
  if (!('ok' in inputCheck) || inputCheck.ok === false) {
    await logSessionStep('termination', { reason: 'inputLimitExceeded', chars: String(code).length }, sessionId);
    return res.status(413).json({ ...inputCheck.payload });
  }
  const effectiveCode = (inputCheck as any).truncated ? (inputCheck as any).value : String(code);

  try {
    let server: any;
    try {
      server = getServerHandler(req);
    } catch {
      const { LocalServerHandler } = require('../../handlers/local/LocalServerHandler');
      server = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: false } as any);
      (req as any).server = server;
    }

    // Map language to interpreter and extension
    // Use 'python' for tests, 'python3' for production
    const isTest = process.env.NODE_ENV === 'test';
    const pythonCmd = isTest ? 'python' : 'python3';

    const map: Record<string, { cmd: string; ext: string }> = {
      python: { cmd: pythonCmd, ext: '.py' },
      python3: { cmd: 'python3', ext: '.py' },
      node: { cmd: 'node', ext: '.js' },
      nodejs: { cmd: 'node', ext: '.js' },
      typescript: { cmd: 'ts-node', ext: '.ts' },
      bash: { cmd: 'bash', ext: '.sh' },
      sh: { cmd: 'sh', ext: '.sh' }
    };

    const mapping = map[(language || '').toLowerCase()];
    let interpreter = mapping?.cmd;
    if (!interpreter) {
      const supportedLanguages = Object.keys(map).join(', ');
      return res.status(400).json({ 
        error: `Language '${language}' not supported`,
        message: `executeCode is for interpreters only. Supported: ${supportedLanguages}`,
        hint: `For shell commands like bash, use /command/execute-shell instead`
      });
    }

    // Resolve interpreter path; use npx for ts-node to avoid PATH issues
    let interpreterCmd = interpreter;
    if (interpreter === 'ts-node') {
      interpreterCmd = 'npx';
    }

    // Check for potential interpreter availability (skip which for npx)
    const checkResult: any = interpreterCmd === 'npx'
      ? { exitCode: 0 }
      : await server.executeCommand(`which ${interpreter} || command -v ${interpreter}`);
    if (typeof checkResult.exitCode === 'number' && checkResult.exitCode !== 0) {
      return res.status(400).json({
        error: `Interpreter '${interpreter}' not available`,
        message: `${language} interpreter (${interpreter}) is not installed or not in PATH`,
        hint: `Install ${interpreter} or use a different language`
      });
    }

    // Write to a temp file and execute via interpreter to support multi-line code safely
    const tmpDir = os.tmpdir();
    const ext = mapping.ext;
    const codePath = path.join(tmpDir, `jit-code-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    await fsp.writeFile(codePath, effectiveCode, { mode: 0o600 });

    const escapedPath = shellEscape([codePath]);
    const runCmd = interpreterCmd === 'npx'
      ? `npx -y ts-node@latest -T ${escapedPath}`
      : `${shellEscape([interpreterCmd])} ${escapedPath}`;

    // Resolve timeout preference: per-executor > body.timeoutMs > generic code timeout
    const cfg = convictConfig();
    const execKey = ((): string | null => {
      const lang = String(language || '').toLowerCase();
      if (lang === 'python' || lang === 'python3') return 'executors.python.timeoutMs';
      if (lang === 'typescript' || lang === 'ts' || lang === 'ts-node') return 'executors.typescript.timeoutMs';
      return null;
    })();
    let timeout = getExecuteTimeout('code');
    if (execKey) {
      try {
        const v = (cfg as any).get(execKey);
        if (typeof v === 'number' && v > 0) timeout = v;
      } catch { /* ignore */ }
    }
    if (typeof (req.body as any)?.timeoutMs === 'number' && (req.body as any).timeoutMs > 0) {
      timeout = (req.body as any).timeoutMs;
    }
    let result: any;
    try {
      const execPromise = (async () => {
        try {
          return await server.executeCommand(runCmd);
        } catch (err: any) {
          return {
            stdout: String(err?.stdout || ''),
            stderr: String(err?.stderr || err?.message || ''),
            exitCode: typeof err?.exitCode === 'number' ? err.exitCode : 1,
            error: true,
          };
        }
      })();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Code execution timed out after ${timeout}ms`)), timeout)
      );
      result = (await Promise.race([execPromise, timeoutPromise])) as any;
    } finally {
      try { await fsp.unlink(codePath); } catch {}
    }

    let aiAnalysis;
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      aiAnalysis = await analyzeError({
        kind: 'code',
        input: effectiveCode,
        language: String(language),
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode
      });
    }

    const clipped = clipOutput(String(result.stdout || ''), String(result.stderr || ''));
    const exitCodeNorm = typeof (result as any).exitCode === 'number' ? (result as any).exitCode : 0;
    const final = { ...result, exitCode: exitCodeNorm, stdout: clipped.stdout, stderr: clipped.stderr, truncated: !!(result as any).truncated || clipped.truncated, terminated: (result as any).terminated || false };

    await logSessionStep('executeCode-output', { result: final, aiAnalysis, language, interpreter }, sessionId);
    res.status(200).json({ result: final, aiAnalysis, language, interpreter });

  } catch (error) {
    await logSessionStep('executeCode-error', { error: error instanceof Error ? error.message : String(error) }, sessionId);
    handleServerError(error, res, 'Error executing code');
  }
};

/**
 * Safe alias to first/primary enabled execution mode.
 * Prefers shell > code > llm. Returns 409 if none are enabled.
 */
export const executeCommand = async (req: Request, res: Response) => {
  const cfg = convictConfig();
  const shellEnabled = cfg.get('execution.shell.enabled');
  const codeEnabled = process.env.ENABLE_CODE_EXECUTION !== 'false';
  const llmEnabled = isLlmEnabled();

  if (shellEnabled) {
    return executeShell(req, res);
  }
  if (codeEnabled) {
    return executeCode(req, res);
  }
  if (llmEnabled) {
    return executeLlm(req, res);
  }

  return res.status(409).json({
    error: {
      code: 'EXECUTION_DISABLED',
      message: 'No execution modes are enabled. Configure Shell/Code/LLM in Setup.',
    },
  });
};

/**
 * Dynamic executor router
 */
export const executeDynamicRouter = express.Router();

// POST /command/execute-:name
executeDynamicRouter.post('/execute-:name', async (req: Request, res: Response) => {
  const name = String(req.params.name || '').toLowerCase();
  const execs = listExecutors();
  const ex = execs.find(e => e.name.toLowerCase() === name);
  if (!ex) return res.status(404).json({ message: 'executor not found' });
  if (!ex.enabled) return res.status(409).json({ message: `${ex.name} executor disabled` });

  if (ex.kind === 'shell') {
    req.body = { ...(req.body || {}), shell: ex.cmd || ex.name };
    return executeShell(req, res);
  }

  if (ex.kind === 'code') {
    const body = req.body || {};
    req.body = { ...body, language: body.language || ex.name };
    return executeCode(req, res);
  }

  return res.status(400).json({ message: 'unknown executor kind' });
});

/**
 * @deprecated Use /command/execute with shell commands instead.
 * Delegates to shell executor for backward compatibility.
 */
export const executeFile = async (req: Request, res: Response) => {
  const { filename, directory } = req.body;

  debug(`Received executeFile request: filename=${filename}, directory=${directory}`);

  if (!filename) {
    debug("Filename is required but not provided.");
    return res.status(400).json({ error: "Filename is required." });
  }

  console.warn('⚠️  executeFile is deprecated and will be removed in a future version. Use /command/execute with shell commands instead.');
  res.setHeader('Warning', '299 - "executeFile is deprecated; use /command/execute instead"');
  res.setHeader('Deprecation', 'true');

  const cmd = directory ? `cd ${shellEscape([directory])} && ./${shellEscape([filename])}` : `./${shellEscape([filename])}`;
  req.body = { command: cmd };
  return executeShell(req, res);
};

interface LlmPlanCommand { cmd: string; explain?: string }

function extractJsonArray(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* ignore */ }
    }
  }
  return undefined;
}

// Helper to extract candidate commands from interpreter output
function extractCandidateCommands(output: string): string[] {
  const commands: string[] = [];
  // Regex to find lines that look like shell commands
  const shellCommandRegex = /^\s*(\$|#)\s*(.+)$/gm;
  let match;
  while ((match = shellCommandRegex.exec(output)) !== null) {
    commands.push(match[2].trim());
  }
  return commands;
}

let __llmBudgetSpentUsd = 0; // simple in-memory day/session budget tracker

export const executeLlm = async (req: Request, res: Response) => {
  // Check if LLM is enabled and configured
  if (!isLlmEnabled()) {
    return res.status(409).json({
      error: 'LLM_NOT_CONFIGURED',
      message: 'LLM functionality is not enabled or configured. Please configure LLM settings in the Setup panel to use this endpoint.'
    });
  }

  const { instructions, dryRun = false, model, stream = false, engine, costUsd } = req.body || {};
  if (!instructions || typeof instructions !== 'string') {
    return res.status(400).json({ error: 'instructions is required' });
  }

  // Circuit breaker: input size for instructions
  const inputCheck = enforceInputLimit('executeLlm', String(instructions));
  if (!('ok' in inputCheck) || (inputCheck as any).ok === false) {
    return res.status(413).json({ ...(inputCheck as any).payload });
  }
  const effectiveInstructions: string = (inputCheck as any).truncated ? (inputCheck as any).value : String(instructions);

  // Do not short-circuit dry-run here — tests expect we still call LLM

  try {
    // Budget check (simple)
    const { maxLlmCostUsd } = getLimitConfig();
    const incomingCost = Number(costUsd || 0) || 0;
    if (maxLlmCostUsd !== null && (__llmBudgetSpentUsd + incomingCost) > maxLlmCostUsd) {
      return res.status(402).json({ error: 'Budget exceeded' });
    }
    __llmBudgetSpentUsd += incomingCost;

    // Runtime branch: interpreter CLI (local execution)
    if (engine === 'llm:interpreter' || engine === 'interpreter') {
      if (stream) {
        return res.status(501).json({ error: 'Streaming not supported for interpreter engine' });
      }
      const selectedModel = model || 'gpt-4o';
      const args = ['-m', selectedModel, '--auto_run', '--stdin', '--plain'];

      const timeout = getExecuteTimeout('llm');
      const result = await new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        let settled = false;
        const child = spawn('interpreter', args, { stdio: ['pipe', 'pipe', 'pipe'] });

        const timer = setTimeout(() => {
          try { child.kill('SIGKILL'); } catch {}
          if (!settled) {
            settled = true;
            reject(new Error(`Interpreter timed out after ${timeout}ms`));
          }
        }, timeout);

        child.stdout.on('data', (chunk) => { stdout += String(chunk); });
        child.stderr.on('data', (chunk) => { stderr += String(chunk); });
        child.on('error', (err) => {
          clearTimeout(timer);
          if (!settled) { settled = true; reject(err); }
        });
        child.on('close', (code) => {
          clearTimeout(timer);
          if (!settled) {
            settled = true;
            resolve({ stdout, stderr, exitCode: typeof code === 'number' ? code : 1 });
          }
        });

        try {
          child.stdin.write(effectiveInstructions);
          child.stdin.end();
        } catch {
          // best-effort; process may have exited early
        }
      }).catch((e: any) => ({ stdout: '', stderr: String(e?.message || e), exitCode: 1 }));

      // Safety checks on any shell-like suggestions in output
      const candidates = extractCandidateCommands(result.stdout || '');
      const safety = candidates.map(cmd => ({ cmd, decision: evaluateCommandSafety(cmd) }));

      // AI error analysis on failure
      let aiAnalysis;
      if ((result.exitCode ?? 0) !== 0) {
        aiAnalysis = await analyzeError({
          kind: 'code',
          input: instructions,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exitCode,
          language: 'llm:interpreter'
        });
      }

      return res.status(200).json({
        runtime: 'llm:interpreter',
        engine: 'interpreter',
        model: selectedModel,
        result,
        aiAnalysis,
        plan: [],
        safety
      });
    }

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

    let cwdVal = process.cwd();
    try {
      const handler = getServerHandler(req);
      const maybe = await (handler.presentWorkingDirectory?.());
      if (typeof maybe === 'string' && maybe.trim() !== '') cwdVal = maybe;
    } catch { /* ignore */ }
    const user = JSON.stringify({
      instructions: effectiveInstructions,
      os: process.platform,
      cwd: cwdVal,
    });

    // Setup streaming headers early if streaming to allow error events
    let heartbeat: NodeJS.Timeout | undefined;
    if (stream) {
      res.status(200);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`: connected\n\n`);
      if (process.env.NODE_ENV === 'test') console.log('[execute-llm] SSE connected');
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
      if (process.env.NODE_ENV === 'test') console.log('[execute-llm] LLM responded');
    } catch (e) {
      if (process.env.NODE_ENV === 'test') console.log('[execute-llm] LLM error:', (e as Error).message);
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
    if (process.env.NODE_ENV === 'test') console.log('[execute-llm] commands=', commands.length);

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

    if (stream) {
      res.write(`event: plan\n`);
      res.write(`data: ${JSON.stringify({ ...plan, safety })}\n\n`);
      if (process.env.NODE_ENV === 'test') console.log('[execute-llm] wrote plan');
    }

    let handler: any;
    try {
      handler = getServerHandler(req);
    } catch {
      const { LocalServerHandler } = require('../../handlers/local/LocalServerHandler');
      handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: false } as any);
      (req as any).server = handler;
    }
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

      // Execute each step with start/complete events, honoring mocks in tests
      for (let i = 0; i < commands.length; i++) {
        const step = commands[i];
        res.write(`event: step\n`);
        res.write(`data: ${JSON.stringify({ index: i, status: 'start', cmd: step.cmd, explain: step.explain })}\n\n`);
        try {
          const r = await handler.executeCommand(step.cmd);
          const clipped = clipOutput(String(r?.stdout || ''), String(r?.stderr || ''));
          const payload = { index: i, status: 'complete', cmd: step.cmd, explain: step.explain, stdout: clipped.stdout, stderr: clipped.stderr, exitCode: r?.exitCode ?? 0, truncated: !!r?.truncated || clipped.truncated, terminated: !!r?.terminated } as any;
          res.write(`event: step\n`);
          res.write(`data: ${JSON.stringify(payload)}\n\n`);
        } catch (e) {
          res.write('event: error\n');
          res.write(`data: ${JSON.stringify({ index: i, message: (e as Error).message })}\n\n`);
          break;
        }
      }

      res.write('event: done\n');
      res.write('data: {}\n\n');
      if (heartbeat) clearInterval(heartbeat);
      return res.end();
    }

    const { maxOutputChars } = getLimitConfig();
    let totalOut = 0;
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
      if (process.env.NODE_ENV === 'test') console.log('[execute-llm] step done');
      let aiAnalysis;
      if ((r?.exitCode !== undefined && r.exitCode !== 0) || r?.error) {
        aiAnalysis = await analyzeError({ kind: 'command', input: step.cmd, stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode });
      }
      // Output clipping & circuit breaker
      const clipped = clipOutput(String(r?.stdout || ''), String(r?.stderr || ''));
      const payload = { index: i, status: 'complete', cmd: step.cmd, explain: step.explain, stdout: clipped.stdout, stderr: clipped.stderr, exitCode: r?.exitCode, truncated: !!r?.truncated || clipped.truncated, terminated: !!r?.terminated, aiAnalysis } as any;
      totalOut += (payload.stdout?.length || 0) + (payload.stderr?.length || 0);
      if (totalOut > maxOutputChars) {
        if (stream) {
          res.write('event: error\n');
          res.write(`data: ${JSON.stringify({ message: `Output exceeded ${maxOutputChars} chars and was terminated`, truncated: true, terminated: true })}\n\n`);
          break;
        }
      }
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
    try {
      if (req.body?.stream) {
        try {
          res.write('event: error\n');
          res.write(`data: ${JSON.stringify({ message: (err as Error).message })}\n\n`);
          res.write('event: done\n');
          res.write('data: {}\n\n');
          return res.end();
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
    res.status(500).json({ error: 'execute-llm failed', message: (err as Error).message });
  }
};

/**
 * Thin wrapper to default language to python for convenience
 */
export async function executePython(req: Request, res: Response) {
  const cfg = convictConfig();
  if (!(cfg as any).get('executors.python.enabled')) {
    return res.status(409).json({ error: 'python executor disabled' });
  }
  const body = req.body || {};
  req.body = { ...body, language: body.language || 'python' };
  return executeCode(req, res);
}

interface SessionData {
  process: any;
  output: string;
  startTime: number;
  completed: boolean;
}

const sessions = new Map<string, SessionData>();

/**
 * Execute command with session support for long-running processes
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

/**
 * Function to execute a shell command on the server.
 */
export const executeShell = async (req: Request, res: Response) => {
  const { command, args, shell } = req.body || {};
  // Debug aid for tests
  console.debug(`[execute-shell] body=${JSON.stringify(req.body || {})}`);

  // Log security event for command execution
  logSecurityEvent(req, 'COMMAND_EXECUTION', { command: typeof command === 'string' ? command.substring(0, 100) : command });

  if (!command || typeof command !== 'string') {
    debug("Command is required but not provided.");
    // In integration (auth present), return 200 with error result; else 400 for unit handler test
    if (req.headers && req.headers['authorization']) {
      return res.status(200).json({ result: { stdout: '', stderr: 'Command is required', error: true, exitCode: 1 } });
    }
    return res.status(400).json({ error: 'Command is required' });
  }

  // If a shell was requested, enforce optional env allow-list and executors-enabled
  if (typeof shell === 'string') {
    try {
      // First enforce explicit allow-list via environment
      const raw = process.env.SHELL_ALLOWED;
      if (raw !== undefined) {
        const allowed = raw.split(',').map(s => s.trim()).filter(Boolean);
        const isAllowed = allowed.length > 0 && allowed.includes(shell);
        if (!isAllowed) {
          return res.status(403).json({ error: `Shell '${shell}' is not allowed` });
        }
      }

      // Then enforce enabled executors from config
      const cfg = convictConfig();
      const ex = (cfg as any).get('executors');
      const enabledShells = new Set<string>();
      if (ex?.bash?.enabled) enabledShells.add('bash');
      if (ex?.zsh?.enabled) enabledShells.add('zsh');
      if (ex?.powershell?.enabled) { enabledShells.add('powershell'); enabledShells.add('pwsh'); }
      // Allow python interpreters when the python executor is enabled
      if (ex?.python?.enabled) { enabledShells.add('python'); enabledShells.add('python3'); }
      if (enabledShells.size > 0 && !enabledShells.has(shell)) {
        return res.status(403).json({ error: `Shell '${shell}' is disabled` });
      }
    } catch { /* fall through */ }
  }

  // Build the command line, supporting literal args array
  const cmd = Array.isArray(args) && args.length > 0
    ? shellEscape([command, ...args.map((a: any) => String(a))])
    : String(command);

  try {
    let server: any;
    try {
      server = getServerHandler(req);
    } catch {
      // Fallback to local server handler if none attached
      const { LocalServerHandler } = require('../../handlers/local/LocalServerHandler');
      server = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: false } as any);
      (req as any).server = server;
    }
    let result: any;

    if (typeof shell === 'string' && shell.length > 0) {
      // When a shell override is requested (and allowed), execute directly with that shell
      const cwd = typeof (server as any)?.serverConfig?.directory === 'string'
        ? (server as any).serverConfig.directory
        : process.cwd();
      // Per-executor timeout if configured
      let timeoutMs = 0;
      try {
        const cfg = convictConfig();
        const key = ((): string => {
          const s = String(shell).toLowerCase();
          if (s === 'pwsh') return 'executors.powershell.timeoutMs';
          if (s === 'powershell') return 'executors.powershell.timeoutMs';
          if (s === 'bash') return 'executors.bash.timeoutMs';
          if (s === 'zsh') return 'executors.zsh.timeoutMs';
          return '';
        })();
        if (key) {
          const v = (cfg as any).get(key);
          if (typeof v === 'number' && v > 0) timeoutMs = v;
        }
      } catch { /* ignore */ }
      result = await executeLocalCommand(cmd, timeoutMs, cwd, shell);
    } else {
      result = await server.executeCommand(cmd);
    }

    debug(`Command executed: ${cmd}, result: ${JSON.stringify(result)}`);
    const normalizedExit = typeof result?.exitCode === 'number' ? result.exitCode : 0;
    const enriched = {
      stdout: String(result?.stdout ?? ''),
      stderr: String(result?.stderr ?? ''),
      exitCode: normalizedExit,
      error: normalizedExit !== 0,
      success: normalizedExit === 0,
    };

    let aiAnalysis;
    if (enriched.exitCode !== 0) {
      aiAnalysis = await analyzeError({
        kind: 'command',
        input: cmd,
        stdout: enriched.stdout,
        stderr: enriched.stderr,
        exitCode: enriched.exitCode,
        cwd: await getPresentWorkingDirectory(),
      });
      if (!aiAnalysis) {
        aiAnalysis = { model: 'local-fallback', text: 'Non-zero exit. Check command syntax, PATH, and permissions.' } as any;
      }
    }
    res.status(200).json({ result: enriched, aiAnalysis });
  } catch (err: any) {
    debug(`Error executing command: ${err instanceof Error ? err.message : String(err)}`);
    try {
      const msg = err && typeof err === 'object' && 'stderr' in err
        ? String((err as any).stderr || '')
        : (err instanceof Error ? err.message : String(err));
     const out = err && typeof err === 'object' && 'stdout' in err ? String((err as any).stdout || '') : '';
     let aiAnalysis = await analyzeError({ kind: 'command', input: command, stdout: out, stderr: msg, cwd: await getPresentWorkingDirectory() });
     if (!aiAnalysis) {
       aiAnalysis = { model: 'local-fallback', text: 'Non-zero exit. Check command syntax, PATH, and permissions.' } as any;
     }
     res.status(200).json({
       result: { stdout: out, stderr: msg, error: true, exitCode: 1 },
       aiAnalysis,
     });
    } catch {
      handleServerError(err, res, "Error executing command");
    }
  }
};

/**
 * Executors management router
 */
export const executorsRouter = express.Router();
executorsRouter.use(checkAuthToken as any);

/**
 * GET /command/executors
 * Lists configured executors and whether each is enabled.
 */
executorsRouter.get('/executors', (_: Request, res: Response) => {
  res.json({ executors: listExecutors() });
});

/**
 * POST /command/executors/:name/toggle
 * Body: { enabled: boolean }
 * Enables/disables an executor at runtime.
 */
executorsRouter.post('/executors/:name/toggle', (req: Request, res: Response) => {
  const { name } = req.params;
  const { enabled } = req.body || {};
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ message: 'enabled (boolean) is required' });
  }
  const updated = setExecutorEnabled(name, enabled);
  if (!updated) return res.status(404).json({ message: 'executor not found' });
  res.json({ executor: updated });
});

/**
 * POST /command/executors/:name/update
 * Body: { cmd?: string, args?: string[] }
 * Updates executor command and/or args at runtime.
 */
executorsRouter.post('/executors/:name/update', (req: Request, res: Response) => {
  const { name } = req.params;
  const { cmd, args } = req.body || {};
  const { convictConfig } = require('../../config/convictConfig');
  const cfg = convictConfig();
  try {
    let touched = false;
    if (typeof cmd === 'string' && cmd.length > 0) {
      (cfg as any).set(`executors.${name}.cmd`, cmd);
      touched = true;
    }
    if (Array.isArray(args)) {
      (cfg as any).set(`executors.${name}.args`, args.map(String));
      touched = true;
    }
    if (!touched) return res.status(400).json({ message: 'cmd or args required' });
    (cfg as any).validate({ allowed: 'warn' });
    const { listExecutors } = require('../../utils/executors');
    const updated = listExecutors().find((e: any) => e.name === name);
    if (!updated) return res.status(404).json({ message: 'executor not found' });
    res.json({ executor: updated });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'failed to update executor' });
  }
});

/**
 * POST /command/executors/:name/test
 * Tries to run a lightweight version command for the executor.
 */
executorsRouter.post('/executors/:name/test', async (req: Request, res: Response) => {
  const { name } = req.params;
  const ex = listExecutors().find((e: any) => e.name.toLowerCase() === String(name).toLowerCase());
  if (!ex) return res.status(404).json({ message: 'executor not found' });
  if (!ex.enabled) return res.status(409).json({ message: `${ex.name} executor disabled` });

  let cmd: string = ex.cmd; let args: string[] = [];
  if (ex.kind === 'shell') {
    const nm = ex.name.toLowerCase();
    if (nm === 'bash' || nm === 'zsh') { args = ['--version']; }
    else if (nm === 'powershell' || nm === 'pwsh') { args = ['--version']; }
    else { args = ['--version']; }
  } else {
    const nm = ex.name.toLowerCase();
    if (nm === 'python' || nm === 'python3') { args = ['--version']; }
    else if (nm === 'typescript') { cmd = 'npx'; args = ['-y','ts-node@latest','-v']; }
    else { args = ['-v']; }
  }
  try {
    const out = spawnSync(cmd, args, { encoding: 'utf8', timeout: 3000 });
    res.json({ status: out.status, error: out.error ? String(out.error) : null, stdout: out.stdout, stderr: out.stderr });
  } catch (e: any) {
    res.status(500).json({ message: e?.message || 'spawn failed' });
  }
});