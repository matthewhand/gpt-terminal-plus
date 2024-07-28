import { exec } from 'child_process';
import { promisify } from 'util';
import Debug from 'debug';
import { getCurrentFolder } from '../../../utils/GlobalStateHelper';

const execAsync = promisify(exec);
const debug = Debug('app:executeCommand');

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
        cwd: directory || getCurrentFolder(), // Use GlobalStateHelper for current directory
        shell: shell || undefined
    };

    debug('Executing command: ' + command + ' with options: ' + JSON.stringify(execOptions));
    try {
        const { stdout, stderr } = await execAsync(command, execOptions);
        debug('Command stdout: ' + stdout);
        debug('Command stderr: ' + stderr);
        return { stdout, stderr };
    } catch (error) {
        debug('Error executing command: ' + (error instanceof Error ? error.message : String(error)));
        throw new Error('Error executing command: ' + (error instanceof Error ? error.message : String(error)));
    }
}
