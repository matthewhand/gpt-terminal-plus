import { Request, Response } from 'express';
import Debug from 'debug';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';
import { analyzeError } from '../../llm/errorAdvisor';
import { getExecuteTimeout } from '../../utils/timeout';
import { validateFileOperations } from '../../utils/fileOperations';
import os from 'os';
import path from 'path';
import { promises as fsp } from 'fs';
import shellEscape from 'shell-escape';

const debug = Debug('app:command:execute-shell');

function getDefaultShell(): string {
  return process.platform === 'win32' ? 'powershell' : 'bash';
}

// Escape for double-quoted shell strings; keep single quotes intact.
function dq(s: string): string {
  return s.replace(/(["\\$`])/g, '\\$1').replace(/\n/g, '\\n');
}

function wrapWithShell(shellName: string, rawCommand: string): string {
  const cmd = dq(rawCommand);
  switch ((shellName || '').toLowerCase()) {
    case 'bash':
      return `bash -lc "${cmd}"`;
    case 'sh':
      return `sh -lc "${cmd}"`;
    case 'powershell':
      // Keep simple; caller can pass full PS if needed
      return `powershell -NoProfile -Command "${cmd}"`;
    default:
      return rawCommand;
  }
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
  
  // Build a human-readable preview of what will execute (used for validation and AI analysis)
  const previewCommand: string = (args && Array.isArray(args))
    ? [command, ...args].join(' ')
    : command;

  try {
    // Check for file operations in the ACTUAL script content, not the wrapper
    const hasFileOps = /\b(echo|cat|touch|mkdir|rm|cp|mv|>|>>|<<)\b/.test(command);
    if (hasFileOps) {
      const fileCheck = validateFileOperations();
      if (!fileCheck.allowed) {
        return res.status(403).json({ error: fileCheck.error });
      }
    }

    const server = getServerHandler(req);

    // Ensure requested shell is available (mirrors executeCode interpreter check)
    const check = await server.executeCommand(`which ${selectedShell} || command -v ${selectedShell}`);
    if (check.exitCode !== 0) {
      return res.status(400).json({
        error: `Shell '${selectedShell}' not available`,
        message: `${selectedShell} is not installed or not in PATH`,
      });
    }
    
    // Write the provided command/script to a temp file and execute it via the selected shell.
    // This avoids quoting/heredoc issues and supports multi-line scripts safely.
    const tmpDir = os.tmpdir();
    const ext = selectedShell.toLowerCase() === 'powershell' ? '.ps1' : '.sh';
    const scriptPath = path.join(tmpDir, `jit-shell-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    await fsp.writeFile(scriptPath, String(command), { mode: 0o600 });
    
    // Build execution command; no need to chmod +x when invoking via the interpreter
    const escapedPath = shellEscape([scriptPath]);
    const escapedArgs = Array.isArray(args) && args.length > 0 ? ' ' + shellEscape(args.map(String)) : '';
    let execCmd: string;
    switch (selectedShell.toLowerCase()) {
      case 'bash':
        execCmd = `bash ${escapedPath}${escapedArgs}`;
        break;
      case 'sh':
        execCmd = `sh ${escapedPath}${escapedArgs}`;
        break;
      case 'powershell':
        execCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File ${escapedPath}${escapedArgs}`;
        break;
      default:
        execCmd = `${selectedShell} ${escapedPath}${escapedArgs}`;
        break;
    }

    const timeout = getExecuteTimeout('shell');
    let result: any;
    try {
      result = await Promise.race([
        server.executeCommand(execCmd),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Command timed out after ${timeout}ms`)), timeout)
        )
      ]) as any;
    } finally {
      // Best-effort cleanup
      try { await fsp.unlink(scriptPath); } catch {}
    }
    
    let aiAnalysis;
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      aiAnalysis = await analyzeError({
        kind: 'command',
        input: previewCommand,
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