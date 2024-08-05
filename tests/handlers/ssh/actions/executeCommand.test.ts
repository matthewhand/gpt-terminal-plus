import { Client } from 'ssh2';
import { executeCommand } from '../../../../src/handlers/ssh/actions/executeCommand';
import { SshHostConfig } from '../../../../src/types/ServerConfig';
import { escapeSpecialChars } from '../../../../src/common/escapeSpecialChars';

jest.mock('ssh2');
jest.mock('../../../../src/common/escapeSpecialChars');

describe('executeCommand', () => {
    let sshClient: Client;
    let mockExec: jest.Mock;
    let sshConfig: SshHostConfig;

    beforeEach(() => {
        sshClient = new Client();
        mockExec = jest.fn();
        (sshClient as any).exec = mockExec;
        sshConfig = {
            protocol: 'ssh',
            host: 'localhost',
            port: 22,
            username: 'testuser',
            privateKeyPath: '/root/.ssh/id_rsa',
            shell: 'bash',
        };
        (escapeSpecialChars as jest.Mock).mockImplementation((content: string) => content);
    });

    it('should execute a command on an SSH server', async () => {
        const command = 'ls -la';
        const mockStdout = 'file1\nfile2\n';
        const mockStderr = '';

        mockExec.mockImplementation((execCommand, callback) => {
            console.debug(`Mock exec command: ${execCommand}`);
            const stream = {
                on: (event: string, handler: (data?: Buffer) => void) => {
                    if (event === 'data') handler(Buffer.from(mockStdout));
                    if (event === 'close') handler();
                    return stream;
                },
                stderr: {
                    on: (event: string, handler: (data?: Buffer) => void) => {
                        if (event === 'data') handler(Buffer.from(mockStderr));
                        return stream;
                    }
                }
            };
            callback(null, stream);
        });

        const result = await executeCommand(sshClient, sshConfig, command);
        expect(result).toEqual({ stdout: mockStdout, stderr: mockStderr, timeout: false });
        expect(mockExec).toHaveBeenCalledWith(
            command,
            expect.any(Function)
        );
    });

    it('should throw an error if SSH client is not provided', async () => {
        await expect(executeCommand(null as unknown as Client, sshConfig, 'ls -la'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    });

    it('should throw an error if SSH server configuration is not provided', async () => {
        await expect(executeCommand(sshClient, null as unknown as SshHostConfig, 'ls -la'))
            .rejects
            .toThrow('SSH server configuration must be provided and must be an object.');
    });

    it('should throw an error if command is not provided', async () => {
        await expect(executeCommand(sshClient, sshConfig, ''))
            .rejects
            .toThrow('Command must be provided and must be a string.');
    });
});
