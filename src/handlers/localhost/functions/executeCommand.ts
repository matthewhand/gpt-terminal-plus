import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Executes a command on the local server.
 * @param command - The command to execute.
 * @param timeout - Optional timeout for the command execution.
 * @param directory - Optional directory to execute the command in.
 * @param shell - Optional shell to use for command execution.
 * @returns The command's stdout and stderr output.
 */
export async function executeCommand(command: string, timeout: number = 5000, directory?: string, shell?: string): Promise<{ stdout: string; stderr: string }> {
    const execOptions = {
        timeout,
        cwd: directory || process.cwd(),
        shell: shell || undefined
    };

    try {
        const { stdout, stderr } = await execAsync(command, execOptions);
        return { stdout, stderr };
    } catch (error) {
        console.error(`Error executing command: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}