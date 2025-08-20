import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';
import { getExecuteTimeout } from '../../utils/timeout';

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
    
    // Map language to command (interpreters only, not shells)
    const interpreters: Record<string, string> = {
      python: 'python3',
      python3: 'python3',
      node: 'node',
      nodejs: 'node'
    };

    const interpreter = interpreters[language.toLowerCase()];
    if (!interpreter) {
      const supportedLanguages = Object.keys(interpreters).join(', ');
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

    // Execute code via interpreter with timeout
    const timeout = getExecuteTimeout('code');
    const result = await Promise.race([
      server.executeCommand(`${interpreter} -c "${code.replace(/"/g, '\\"')}"`),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Code execution timed out after ${timeout}ms`)), timeout)
      )
    ]) as any;

    res.json({
      result,
      language,
      interpreter
    });

  } catch (error) {
    handleServerError(error, res, 'Error executing code');
  }
};