import { Client } from 'ssh2';
import { fileExists } from '../../../../src/handlers/ssh/actions/fileExists';
import { ServerConfig } from '../../../../src/types/ServerConfig';

jest.mock('ssh2');

describe('fileExists', () => {
    let sshClient: Client;
    let mockExec: jest.Mock;
    let sshConfig: ServerConfig;

    beforeEach(() => {
        sshClient = new Client();
        mockExec = jest.fn();
        (sshClient as any).exec = mockExec;
        sshConfig = {
            protocol: 'ssh',
            hostname: 'localhost',
            port: 22,
            username: 'testuser',
            privateKeyPath: '/root/.ssh/id_rsa',
            shell: 'bash',
        };
    });

    it('should return true if the file exists on the SSH server', async () => {
        const filePath = '/path/to/file.txt';
        const mockStdout = 'exists\n';

        mockExec.mockImplementation((execCommand, callback) => {
            console.debug(`Mock exec command: ${execCommand}`);
            const stream = {
                on: (event: string, handler: (data?: Buffer) => void) => {
                    if (event === 'data') handler(Buffer.from(mockStdout));
                    if (event === 'end') handler();
                    return stream;
                }
            };
            callback(null, stream);
        });

        const result = await fileExists(sshClient, sshConfig, filePath);
        expect(result).toBe(true);
        expect(mockExec).toHaveBeenCalledWith(
            `test -f ${filePath} && echo "exists"`,
            expect.any(Function)
        );
    });

    it('should return false if the file does not exist on the SSH server', async () => {
        const filePath = '/path/to/file.txt';
        const mockStdout = '';

        mockExec.mockImplementation((execCommand, callback) => {
            console.debug(`Mock exec command: ${execCommand}`);
            const stream = {
                on: (event: string, handler: (data?: Buffer) => void) => {
                    if (event === 'data') handler(Buffer.from(mockStdout));
                    if (event === 'end') handler();
                    return stream;
                }
            };
            callback(null, stream);
        });

        const result = await fileExists(sshClient, sshConfig, filePath);
        expect(result).toBe(false);
        expect(mockExec).toHaveBeenCalledWith(
            `test -f ${filePath} && echo "exists"`,
            expect.any(Function)
        );
    });

    it('should throw an error if SSH client is not provided', async () => {
        await expect(fileExists(null as unknown as Client, sshConfig, '/path/to/file.txt'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    });

    it('should throw an error if SSH server configuration is not provided', async () => {
        await expect(fileExists(sshClient, null as unknown as ServerConfig, '/path/to/file.txt'))
            .rejects
            .toThrow('Server configuration must be provided and must be an object.');
    });

    it('should throw an error if file path is not provided', async () => {
        await expect(fileExists(sshClient, sshConfig, ''))
            .rejects
            .toThrow('File path must be provided and must be a string.');
    });
});
