import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';
import { getExecuteTimeout } from '../../utils/timeout';
import os from 'os';
import path from 'path';
import { promises as fsp } from 'fs';
import shellEscape from 'shell-escape';
import { analyzeError } from '../../llm/errorAdvisor';

/**
 * Execute code using interpreters
 * @route POST /command/execute-code
 */
export const executeCode = async (req: Request, res: Response) => {
  const { code, language = 'python' } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

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
    const interpreter = mapping?.cmd;
    if (!interpreter) {
      const supportedLanguages = Object.keys(map).join(', ');
      return res.status(400).json({ 
        error: `Language '${language}' not supported`,
        message: `executeCode is for interpreters only. Supported: ${supportedLanguages}`,
        hint: `For shell commands like bash, use /command/execute-shell instead`
      });
    }

    // Check for potential interpreter availability
    const checkResult = await server.executeCommand(`which ${interpreter} || command -v ${interpreter}`);
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
    await fsp.writeFile(codePath, String(code), { mode: 0o600 });

    const escapedPath = shellEscape([codePath]);
    const runCmd = interpreter === 'ts-node'
      ? `${interpreter} -T ${escapedPath}`
      : `${interpreter} ${escapedPath}`;

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
        input: String(code),
        language: String(language),
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode
      });
    }

    res.json({ result, aiAnalysis, language, interpreter });

  } catch (error) {
    handleServerError(error, res, 'Error executing code');
  }
};