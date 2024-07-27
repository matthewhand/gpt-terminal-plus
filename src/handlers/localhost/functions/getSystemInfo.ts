import { executeLocalSystemInfoScript } from "../../../common/executeSystemInfoScript";

/**
 * Retrieves system information from the localhost using the specified shell and script.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<string>} - The system information.
 */
export async function getSystemInfo(shell: string, scriptPath: string): Promise<string> {
  return executeLocalSystemInfoScript(shell, scriptPath);
}

