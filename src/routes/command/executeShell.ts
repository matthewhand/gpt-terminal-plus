import { Request, Response } from 'express';
import Debug from 'debug';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';
import { analyzeError } from '../../llm/errorAdvisor';
import { getExecuteTimeout } from '../../utils/timeout';
import { validateFileOperations } from '../../utils/fileOperations';
import { logSessionStep } from '../../utils/activityLogger';
import { convictConfig } from '../../config/convictConfig';
import { enforceInputLimit, clipOutput } from '../../utils/limits';

const debug = Debug('app:command:execute-shell');

function getDefaultShell(): string {
  return process.platform === 'win32' ? 'powershell' : 'bash';
}

export const executeShell = async (req: Request, res: Response) => {
  const sessionId = `session_${Date.now()}`;
  const { command, shell, args, cwd } = req.body || {};

  await logSessionStep('executeShell-input', { command, shell, args }, sessionId);

  if (!command) {
    debug("Command is required but not provided.");
    return res.status(400).json({ error: "Command is required" });
  }

  // Resolve requested shell and allowed list from config
  const requestedShell = shell || getDefaultShell();
  const cfg = convictConfig();
  let allowedShells: string[] = [];
  try {
    const raw = cfg.get('execution.shell.allowed') as unknown;
    if (Array.isArray(raw)) {
      allowedShells = (raw as any[]).filter(Boolean).map(String);
    }
  } catch {}
  if (!allowedShells || allowedShells.length === 0) {
    allowedShells = ['bash', 'sh', 'powershell'];
  }
  if (shell && !allowedShells.includes(shell)) {
    return res.status(403).json({ error: `Shell '${shell}' is not allowed. Allowed shells: ${allowedShells.join(', ')}` });
  }

  // Build preview string for logging and AI analysis
  const previewCommand: string = Array.isArray(args) && args.length > 0
    ? [command, ...args].join(' ')
    : String(command);

  // Circuit breaker: input size
  const inputCheck = enforceInputLimit('executeShell', previewCommand);
  if (!('ok' in inputCheck) || inputCheck.ok === false) {
    await logSessionStep('termination', { reason: 'inputLimitExceeded', chars: previewCommand?.length || 0 }, sessionId);
    return res.status(413).json({ ...inputCheck.payload });
  }
  const effectiveCommand = (inputCheck as any).truncated ? (inputCheck as any).value : previewCommand;

  try {
    // Validate file operations, if any, against policy
    const hasFileOps = /\b(echo|cat|touch|mkdir|rm|cp|mv|>|>>|<<)\b/.test(String(command));
    if (hasFileOps) {
      const fileCheck = validateFileOperations();
      if (!fileCheck.allowed) {
        return res.status(403).json({ error: fileCheck.error });
      }
    }

    const server = getServerHandler(req);

    // Smart shell availability check using backend execution
    const checkShell = async (candidate: string): Promise<boolean> => {
      const cmd = `which ${candidate} || command -v ${candidate}`;
      const checkRes: any = await (server as any).executeCommand(cmd);
      if (typeof checkRes?.exitCode === 'number') {
        return checkRes.exitCode === 0;
      }
      const out = String(checkRes?.stdout || '').trim();
      const err = String(checkRes?.stderr || '');
      return out.length > 0 && !/not found|no such file/i.test(err);
    };

    let selectedShell = requestedShell;
    if (!(await checkShell(selectedShell))) {
      debug(`Requested shell '${selectedShell}' not available; attempting fallback to 'sh'`);
      await logSessionStep('shell-fallback', { from: selectedShell, to: 'sh' }, sessionId);
      if (await checkShell('sh')) {
        selectedShell = 'sh';
      } else {
        const msg = `No available shell found (attempted '${requestedShell}', fallback 'sh' unavailable)`;
        const aiAnalysis = await analyzeError({ kind: 'command', input: previewCommand, shell: requestedShell, stderr: msg });
        return res.status(400).json({ error: msg, attemptedShell: requestedShell, commandPreview: previewCommand, aiAnalysis });
      }
    }

    // Log chosen shell + preview
    await logSessionStep('executeShell-input', { resolvedShell: selectedShell, commandPreview: previewCommand }, sessionId);

    // Direct execution; handler applies backend-specific timeouts and shell
    const execCmd = effectiveCommand;
    const timeout = getExecuteTimeout('shell');
    const result: any = await (server as any).executeCommand(execCmd, timeout, cwd, selectedShell);

    let aiAnalysis;
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      aiAnalysis = await analyzeError({
        kind: 'command',
        input: effectiveCommand,
        shell: selectedShell,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        cwd: await getServerHandler(req).presentWorkingDirectory?.(),
      });
    }

    // Output circuit breaker (post-clip if needed)
    const clipped = clipOutput(String(result.stdout || ''), String(result.stderr || ''));
    const final = { ...result, stdout: clipped.stdout, stderr: clipped.stderr, truncated: !!(result as any).truncated || clipped.truncated, terminated: (result as any).terminated || false };

    await logSessionStep('executeShell-output', { result: final, aiAnalysis, shell: selectedShell }, sessionId);
    return res.status(200).json({ result: final, aiAnalysis, shell: selectedShell });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await logSessionStep('executeShell-error', { error: msg }, sessionId);
    try {
      const aiAnalysis = await analyzeError({ kind: 'command', input: String(command), shell: String(shell || getDefaultShell()), stderr: msg });
      const attemptedShell = String(shell || getDefaultShell());
      return res.status(400).json({ error: msg, attemptedShell, commandPreview: previewCommand, aiAnalysis });
    } catch {
      return handleServerError(err, res, 'Error executing shell command');
    }
  }
};