import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ExecutionResult } from '../../../types/ExecutionResult';

export async function executeCode(
    code: string,
    language: string,
    timeout: number = 5000,
    directory: string = os.tmpdir()
): Promise<ExecutionResult> {
    const fileExtension = language === 'python' ? 'py' : 'ts';
    const tempFilePath = path.join(directory, `code-${Date.now()}.${fileExtension}`);

    try {
        await fs.writeFile(tempFilePath, code, { mode: 0o755 });

        const command = language === 'python'
            ? `python3 ${tempFilePath}`
            : `tsc ${tempFilePath} && node ${tempFilePath.replace('.ts', '.js')}`;

        const result = await new Promise<ExecutionResult>((resolve) => {
            execFile(command, [], { cwd: directory, timeout }, (error, stdout, stderr) => {
                if (error) {
                    resolve({ stdout, stderr, error: true });
                } else {
                    resolve({ stdout, stderr, error: false });
                }
            });
        });

        return result;
    } catch (error) {
        return { stdout: '', stderr: `Execution failed: ${(error as Error).message}`, error: true };
    } finally {
        const enableCleanup = process.env.ENABLE_CLEANUP === 'true';
        if (enableCleanup) {
            setTimeout(async () => {
                try {
                    await fs.unlink(tempFilePath);
                } catch (cleanupError) {
                    console.warn(`Failed to delete temporary code file: ${tempFilePath}`, cleanupError);
                }
            }, 1000);
        }
    }

    // Ensure a final return statement as a fallback
    return { stdout: '', stderr: '', error: true };
}
