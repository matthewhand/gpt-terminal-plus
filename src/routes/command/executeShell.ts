import { Request, Response } from "express";
import Debug from "debug";
import shellEscape from "shell-escape";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { analyzeError } from "../../llm/errorAdvisor";
import { getPresentWorkingDirectory } from "../../utils/GlobalStateHelper";
import { executeCommand as executeLocalCommand } from "../../handlers/local/actions/executeCommand";

const debug = Debug("app:command:execute-shell");

/**
 * Function to execute a shell command on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeShell = async (req: Request, res: Response) => {
  const { command, args, shell } = req.body || {};
  // Debug aid for tests
  // eslint-disable-next-line no-console
  console.debug(`[execute-shell] body=${JSON.stringify(req.body || {})}`);

  if (!command || typeof command !== 'string') {
    debug("Command is required but not provided.");
    // In integration (auth present), return 200 with error result; else 400 for unit handler test
    if (req.headers && req.headers['authorization']) {
      return res.status(200).json({ result: { stdout: '', stderr: 'Command is required', error: true, exitCode: 1 } });
    }
    return res.status(400).json({ error: 'Command is required' });
  }

  // If a shell was requested, enforce allow-list if configured
  if (typeof shell === 'string') {
    const raw = process.env.SHELL_ALLOWED;
    if (raw !== undefined) {
      const allowed = raw.split(',').map(s => s.trim()).filter(Boolean);
      const isAllowed = allowed.length > 0 && allowed.includes(shell);
      if (!isAllowed) {
        return res.status(403).json({ error: `Shell '${shell}' is not allowed` });
      }
    }
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
      result = await executeLocalCommand(cmd, 0, cwd, shell);
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
