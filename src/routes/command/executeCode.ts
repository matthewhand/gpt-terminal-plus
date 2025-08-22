import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';
import { getExecuteTimeout } from '../../utils/timeout';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { promises as fsp } from 'fs';
import shellEscape from 'shell-escape';
import { analyzeError } from '../../llm/errorAdvisor';
import { logSessionStep } from '../../utils/activityLogger';
import { enforceInputLimit, clipOutput } from '../../utils/limits';

/**
 * Execute code using interpreters
 * @route POST /command/execute-code
 */
export const executeCode = async (req: Request, res: Response) => {
  const sessionId = `session_${Date.now()}`;
  const { code, language = 'python' } = req.body;

  await logSessionStep('executeCode-input', { code, language }, sessionId);

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // Circuit breaker: input length
  const inputCheck = enforceInputLimit('executeCode', String(code));
  if (!('ok' in inputCheck) || inputCheck.ok === false) {
    await logSessionStep('termination', { reason: 'inputLimitExceeded', chars: String(code).length }, sessionId);
    return res.status(413).json({ ...inputCheck.payload });
  }
  const effectiveCode = (inputCheck as any).truncated ? (inputCheck as any).value : String(code);

  try {
    const server = getServerHandler(req);

    // Map language to interpreter and extension
    const map: Record<string, { cmd: string; ext: string }> = {
      python: { cmd: 'python3', ext: '.py' },
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
    const checkResult = interpreterCmd === 'npx'
      ? { exitCode: 0 }
      : await server.executeCommand(`which ${interpreter} || command -v ${interpreter}`);
    if (checkResult.exitCode !== 0) {
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
      ? `npx -y ts-node -T ${escapedPath}`
      : `${shellEscape([interpreterCmd])} ${escapedPath}`;

    const timeout = getExecuteTimeout('code');
    let result: any;
    try {
      result = await Promise.race([
        server.executeCommand(runCmd),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Code execution timed out after ${timeout}ms`)), timeout)
        )
      ]) as any;
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
    const final = { ...result, stdout: clipped.stdout, stderr: clipped.stderr, truncated: !!(result as any).truncated || clipped.truncated, terminated: (result as any).terminated || false };

    await logSessionStep('executeCode-output', { result: final, aiAnalysis, language, interpreter }, sessionId);
    res.json({ result: final, aiAnalysis, language, interpreter });

  } catch (error) {
    await logSessionStep('executeCode-error', { error: error instanceof Error ? error.message : String(error) }, sessionId);
    handleServerError(error, res, 'Error executing code');
  }
};
