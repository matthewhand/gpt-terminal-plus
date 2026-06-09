import { Request, Response } from "express";
import Debug from "debug";
import shellEscape from "shell-escape";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { analyzeError } from "../../llm/errorAdvisor";
import { getPresentWorkingDirectory } from "../../utils/GlobalStateHelper";

const debug = Debug("app:command:execute-shell");

/** Default shells permitted when SHELL_ALLOWED is not configured. */
const DEFAULT_ALLOWED_SHELLS = ["bash", "sh", "powershell"];

/**
 * Resolves the shell allowlist from the environment.
 * - Unset: fall back to the defaults (bash, sh, powershell).
 * - Explicitly empty string: no shells are allowed.
 * - Otherwise: comma-separated list, trimmed.
 */
function getAllowedShells(): string[] {
  const raw = process.env.SHELL_ALLOWED;
  if (raw === undefined) return DEFAULT_ALLOWED_SHELLS;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Function to execute a shell command on the server.
 *
 * Supported request bodies:
 * - { command }                  → run the raw command string.
 * - { command, args: [...] }     → literal mode: run the binary with the given
 *                                  arguments, without shell interpretation.
 * - { shell, command }           → run the command via the named shell
 *                                  (`<shell> -c <command>`), subject to the
 *                                  SHELL_ALLOWED allowlist.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeShell = async (req: Request, res: Response) => {
  const { command, shell, args } = req.body || {};

  if (!command) {
    debug("Command is required but not provided.");
    return res.status(400).json({ error: "Command is required" });
  }

  // Enforce the shell allowlist when a shell is explicitly requested.
  if (shell) {
    const allowedShells = getAllowedShells();
    if (!allowedShells.includes(shell)) {
      debug(`Shell '${shell}' rejected; allowed: ${allowedShells.join(", ")}`);
      return res.status(403).json({
        error: `Shell '${shell}' is not allowed. Allowed shells: ${allowedShells.join(", ")}`,
      });
    }
  }

  // Build the command to execute.
  let execCmd: string;
  if (shell) {
    // Run via the requested shell; the command string is passed as a single
    // argument so multi-line scripts and quoting survive intact.
    execCmd = `${shell} -c ${shellEscape([String(command)])}`;
  } else if (Array.isArray(args) && args.length > 0) {
    // Literal mode: execute the binary with the provided arguments, escaping
    // each one so no shell interpretation of the arguments occurs.
    execCmd = shellEscape([String(command), ...args.map(String)]);
  } else {
    execCmd = String(command);
  }

  try {
    const server = getServerHandler(req);
    const rawResult = await server.executeCommand(execCmd);
    const result = {
      stdout: rawResult?.stdout ?? "",
      stderr: rawResult?.stderr ?? "",
      error: rawResult?.error ?? ((rawResult?.exitCode ?? 0) !== 0),
      exitCode: rawResult?.exitCode ?? 0,
    };
    debug(`Command executed: ${execCmd}, result: ${JSON.stringify(result)}`);
    let aiAnalysis;
    if (result.exitCode !== 0 || result.error) {
      aiAnalysis = await analyzeError({
        kind: 'command',
        input: execCmd,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        cwd: await getPresentWorkingDirectory(),
      });
    }
    res.status(200).json({ result, aiAnalysis });
  } catch (err) {
    debug(`Error executing command: ${err instanceof Error ? err.message : String(err)}`);
    try {
      const msg = err instanceof Error ? err.message : String(err);
      const aiAnalysis = await analyzeError({ kind: 'command', input: execCmd, stderr: msg, cwd: await getPresentWorkingDirectory() });
      res.status(200).json({
        result: { stdout: '', stderr: msg, error: true, exitCode: 1 },
        aiAnalysis,
      });
    } catch {
      handleServerError(err, res, "Error executing command");
    }
  }
};
