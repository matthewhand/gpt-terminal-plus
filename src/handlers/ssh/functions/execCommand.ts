import { Client } from 'ssh2';

/**
 * Executes a command on the remote server using the provided SSH client.
 * @param client - The SSH client instance.
 * @param command - The command to execute.
 * @returns A promise that resolves to the command's stdout and stderr output.
 */
export function execCommand(client: Client, command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    client.exec(command, (err, stream) => {
      if (err) return reject(err);

      stream.on('data', (data: Buffer) => { stdout += data.toString(); });
      stream.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

      stream.on('close', (code: number) => {
        if (code === 0) resolve({ stdout, stderr });
        else reject(new Error(`Command exited with code ${code}`));
      });
    });
  });
}
