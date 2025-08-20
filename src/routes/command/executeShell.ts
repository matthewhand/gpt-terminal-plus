import { Request, Response } from 'express';
import Debug from 'debug';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';
import { analyzeError } from '../../llm/errorAdvisor';
import { getExecuteTimeout } from '../../utils/timeout';

const debug = Debug('app:command:execute-shell');

function getDefaultShell(): string {
  return process.platform === 'win32' ? 'powershell' : 'bash';
}

export const executeShell = async (req: Request, res: Response) => {
  const { command, shell, args } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  const selectedShell = shell || getDefaultShell();
  
  // Shell validation when shell is explicitly specified
  if (shell) {
    const shellAllowed = process.env.SHELL_ALLOWED || 'bash,sh,powershell';
    const allowedShells = shellAllowed.split(',').map(s => s.trim()).filter(Boolean);
    // If shell not in allowed list, reject
    if (!allowedShells.includes(shell)) {
      return res.status(403).json({ error: `Shell '${shell}' is not allowed. Allowed shells: ${allowedShells.join(', ')}` });
    }
  }
  
  // Direct execution without double shell wrapping
  let finalCommand: string;
  if (args && Array.isArray(args)) {
    // Literal mode: command + args array (no shell expansion)
    finalCommand = [command, ...args].join(' ');
  } else {
    // Raw command mode: pass through as-is
    finalCommand = command;
  }

  try {
    const server = getServerHandler(req);
    const timeout = getExecuteTimeout('shell');
    const result = await Promise.race([
      server.executeCommand(finalCommand),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Command timed out after ${timeout}ms`)), timeout)
      )
    ]) as any;
    
    let aiAnalysis;
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      aiAnalysis = await analyzeError({
        kind: 'command',
        input: command,
        shell: selectedShell,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode
      });
    }
    
    res.status(200).json({ result, aiAnalysis, shell: selectedShell });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    try {
      const aiAnalysis = await analyzeError({ 
        kind: 'command', 
        input: command, 
        shell: selectedShell, 
        stderr: msg 
      });
      res.status(200).json({
        result: { stdout: '', stderr: msg, error: true, exitCode: 1 },
        aiAnalysis,
        shell: selectedShell
      });
    } catch {
      handleServerError(err, res, 'Error executing shell command');
    }
  }
};