import { promisify } from "util";
import { exec } from "child_process";
import { getCurrentFolder } from "../../../utils/GlobalStateHelper";

const execAsync = promisify(exec);

/**
 * Executes a command in the specified directory or the current folder if none is specified.
 * @param {string} command - The command to execute.
 * @param {number} [timeout=5000] - The timeout for the command execution.
 * @param {string} [directory] - The directory to execute the command in.
 * @returns {Promise<{ stdout: string; stderr: string }>} - The standard output and error output.
 */
export async function executeCommand(command: string, timeout: number = 5000, directory?: string): Promise<{ stdout: string; stderr: string }> {
  const execOptions = {
    timeout,
    cwd: directory || getCurrentFolder(),
    shell: this.ServerConfig.shell || undefined
  };

  try {
    const { stdout, stderr } = await execAsync(command, execOptions);
    return { stdout, stderr };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error executing command: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while executing the command.");
    }
  }
}
