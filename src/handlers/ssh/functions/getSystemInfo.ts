import { Client } from 'ssh2';
import { SystemInfo } from '../../../types/SystemInfo';

export async function getSystemInfo(client: Client, shell: string, scriptPath: string): Promise<SystemInfo> {
    return new Promise((resolve, reject) => {
        client.exec(`${shell} ${scriptPath}`, (err, stream) => {
            if (err) reject(err);

            let stdout = '';
            let stderr = '';

            stream.on('close', (code: number, signal: string) => {
                if (code !== 0) {
                    reject(new Error(`Command failed with code ${code}, signal ${signal}, stderr: ${stderr}`));
                } else {
                    try {
                        if (stdout.trim() === '') {
                            throw new Error('Empty stdout');
                        }
                        const systemInfo = JSON.parse(stdout) as SystemInfo;
                        resolve(systemInfo);
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON: ${(error as Error).message}`));
                    }
                }
            }).on('data', (data: Buffer) => {
                stdout += data.toString();
            }).stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });
        });
    });
}
