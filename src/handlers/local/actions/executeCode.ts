import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ExecutionResult } from '../../../types/ExecutionResult';
import debug from 'debug';

const executeCodeDebug = debug('app:executeCode');

export async function executeCode(
    code: string,
    language: string,
    timeout: number = 5000,
    directory: string = os.tmpdir()
): Promise<ExecutionResult> {
    // Determine the file extension based on the language
    const fileExtension = language === 'python' ? 'py' : 'ts';
    const tempFilePath = path.join(directory, `code-${Date.now()}.${fileExtension}`);
    executeCodeDebug(`Generated temp file path: ${tempFilePath}`);

    try {
        // Write the code to the temporary file
        await fs.writeFile(tempFilePath, code, { mode: 0o755 });
        executeCodeDebug(`Code written to temp file: ${tempFilePath}`);

        // Generate the command to execute based on the language
        const command = language === 'python'
            ? `python3 ${tempFilePath}`
            : `tsc ${tempFilePath} && node ${tempFilePath.replace('.ts', '.js')}`;
        executeCodeDebug(`Generated command: ${command}`);

        // Execute the command and capture the output
        const result = await new Promise<ExecutionResult>((resolve) => {
            execFile(command, [], { cwd: directory, timeout }, (error, stdout, stderr) => {
                if (error) {
                    executeCodeDebug(`Execution error: ${stderr}`);
                    resolve({ stdout, stderr, error: true });
                } else {
                    executeCodeDebug(`Execution success: ${stdout}`);
                    resolve({ stdout, stderr, error: false });
                }
            });
        });

        return result;
    } catch (error) {
        executeCodeDebug(`Caught error: ${(error as Error).message}`);
        return { stdout: '', stderr: `Execution failed: ${(error as Error).message}`, error: true };
    } finally {
        // Handle cleanup of the temporary code file
        const enableCleanup = process.env.ENABLE_CLEANUP === 'true';
        if (enableCleanup) {
            executeCodeDebug(`Cleanup is enabled. Deleting temp file: ${tempFilePath}`);
            setTimeout(async () => {
                try {
                    await fs.unlink(tempFilePath);
                    executeCodeDebug(`Temp file deleted: ${tempFilePath}`);
                } catch (cleanupError) {
                    executeCodeDebug(`Failed to delete temp file: ${tempFilePath}. Error: ${(cleanupError as Error).message}`);
                }
            }, 1000);
        } else {
            executeCodeDebug('Cleanup is disabled. Temp file will not be deleted.');
        }
    }
}
