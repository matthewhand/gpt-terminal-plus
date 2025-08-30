import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';
import { getExecuteTimeout } from '../../utils/timeout';
import os from 'os';
import path from 'path';
import { promises as fsp } from 'fs';
import shellEscape from 'shell-escape';
import { analyzeError } from '../../llm/errorAdvisor';
import { logSessionStep } from '../../utils/activityLogger';
import { convictConfig } from '../../config/convictConfig';
import { enforceInputLimit, clipOutput } from '../../utils/limits';
// debug logger removed (unused)

/**
 * Function to execute code on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
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
