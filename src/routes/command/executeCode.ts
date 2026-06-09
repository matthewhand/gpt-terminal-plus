import { Request, Response } from "express";
import Debug from "debug";
import os from "os";
import path from "path";
import { promises as fsp } from "fs";
import shellEscape from "shell-escape";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { getExecuteTimeout } from "../../utils/timeout";
import { analyzeError } from "../../llm/errorAdvisor";

const debug = Debug("app:command:execute-code");

/** Map language to interpreter command, runner prefix and file extension. */
const interpreterMap: Record<string, { cmd: string; run?: string; ext: string }> = {
  python: { cmd: "python3", ext: ".py" },
  python3: { cmd: "python3", ext: ".py" },
  node: { cmd: "node", ext: ".js" },
  nodejs: { cmd: "node", ext: ".js" },
  typescript: { cmd: "ts-node", run: "npx ts-node -T", ext: ".ts" },
  bash: { cmd: "bash", ext: ".sh" },
  sh: { cmd: "sh", ext: ".sh" }
};

/**
 * Function to execute code on the server via a language interpreter.
 * Writes the code to a temp file and runs it through the mapped interpreter.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeCode = async (req: Request, res: Response) => {
  if (process.env.ENABLE_CODE_EXECUTION === 'false') {
    return res.status(403).json({ error: "Code execution is disabled." });
  }

  const { code, language } = req.body;

  if (!code || !language) {
    debug("Code and language are required but not provided.");
    return res.status(400).json({ error: "Code and language are required." });
  }

  try {
    const server = getServerHandler(req);

    const mapping = interpreterMap[String(language).toLowerCase()];
    if (!mapping) {
      const supportedLanguages = Object.keys(interpreterMap).join(', ');
      return res.status(400).json({
        error: `Language '${language}' not supported`,
        message: `executeCode is for interpreters only. Supported: ${supportedLanguages}`,
        hint: `For shell commands like bash, use /command/execute-shell instead`
      });
    }
    const interpreter = mapping.cmd;

    // Check interpreter availability on the target server
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
    const codePath = path.join(tmpDir, `jit-code-${Date.now()}-${Math.random().toString(36).slice(2)}${mapping.ext}`);
    await fsp.writeFile(codePath, String(code), { mode: 0o600 });

    const escapedPath = shellEscape([codePath]);
    const runCmd = `${mapping.run || interpreter} ${escapedPath}`;

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

    debug(`Code executed: ${code}, result: ${JSON.stringify(result)}`);
    let aiAnalysis;
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      aiAnalysis = await analyzeError({ kind: 'code', input: String(code), language: String(language), stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode });
    }
    res.status(200).json({ result, aiAnalysis, language, interpreter });
  } catch (err) {
    debug(`Error executing code: ${err instanceof Error ? err.message : String(err)}`);
    try {
      const msg = err instanceof Error ? err.message : String(err);
      const aiAnalysis = await analyzeError({ kind: 'code', input: code, language, stderr: msg });
      res.status(200).json({ result: { stdout: '', stderr: msg, error: true, exitCode: 1 }, aiAnalysis });
    } catch {
      handleServerError(err, res, "Error executing code");
    }
  }
};
