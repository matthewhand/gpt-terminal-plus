import { Request, Response } from "express";
import { executeShell } from "./executeShell";
import { executeCode } from "./executeCode";
import { executeLlm } from "./executeLlm";

/**
 * Generic execute endpoint that delegates to the first enabled mode.
 * Prefers shell > code > llm. Returns 409 if none are enabled.
 */
export const executeCommand = async (req: Request, res: Response) => {
  const shellEnabled = process.env.ENABLE_COMMAND_MANAGEMENT !== 'false';
  const codeEnabled = process.env.ENABLE_CODE_EXECUTION !== 'false';
  const llmEnabled = process.env.LLM_ENABLED === 'true';

  if (shellEnabled) {
    return executeShell(req, res);
  }
  if (codeEnabled) {
    return executeCode(req, res);
  }
  if (llmEnabled) {
    return executeLlm(req, res);
  }

  return res.status(409).json({
    error: {
      code: 'EXECUTION_DISABLED',
      message: 'No execution modes are enabled. Configure Shell/Code/LLM in Setup.',
    },
  });
};
