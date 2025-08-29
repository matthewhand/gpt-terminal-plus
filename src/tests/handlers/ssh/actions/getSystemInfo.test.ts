import { Client } from 'ssh2';
import { getSystemInfo } from '@src/handlers/ssh/actions/getSystemInfo';
import { escapeSpecialChars } from '@src/common/escapeSpecialChars';

jest.mock('ssh2');
jest.mock('@src/common/escapeSpecialChars');

describe('getSystemInfo', () => {
    let sshClient: Client;
    let mockExec: jest.Mock;

    beforeEach(() => {
        sshClient = new Client();
        mockExec = jest.fn();
        (sshClient as any).exec = mockExec;
        (escapeSpecialChars as jest.Mock).mockImplementation((content: string) => content);
    });

    describe('parameter validation', () => {
        it('should throw an error if SSH client is not provided', async () => {
            await expect(getSystemInfo(null as unknown as Client, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow('SSH client must be provided and must be an instance of Client.');
        });

        it('should throw an error if shell is not provided', async () => {
            await expect(getSystemInfo(sshClient, '', '/path/to/script.sh'))
                .rejects
                .toThrow('Shell must be provided and must be a string.');
        });

        it('should throw an error if script path is not provided', async () => {
            await expect(getSystemInfo(sshClient, 'bash', ''))
                .rejects
                .toThrow('Script path must be provided and must be a string.');
        });
    });

    describe('SSH execution', () => {
        it('should handle SSH execution errors', async () => {
            mockExec.mockImplementation((cmd, callback) => {
                callback(new Error('SSH connection failed'), null);
            });

            await expect(getSystemInfo(sshClient, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow('SSH connection failed');
        });

        it('should escape special characters in parameters', async () => {
            const scriptPath = '/path with spaces/script.sh';
            (escapeSpecialChars as jest.Mock).mockReturnValue('/path\\ with\\ spaces/script.sh');
            
            mockExec.mockImplementation((cmd, callback) => {
                callback(new Error('Test error'), null); // Fail fast for testing
            });

            try {
                await getSystemInfo(sshClient, 'bash', scriptPath);
            } catch {
                // Expected to fail, we just want to verify escaping was called
            }
            
            expect(escapeSpecialChars).toHaveBeenCalledWith('bash');
            expect(escapeSpecialChars).toHaveBeenCalledWith(scriptPath);
        });

        it('should construct proper command', async () => {
            (escapeSpecialChars as jest.Mock).mockImplementation(str => str);
            
            mockExec.mockImplementation((cmd, callback) => {
                expect(cmd).toBe('bash /path/to/script.sh');
                callback(new Error('Test complete'), null);
            });

            try {
                await getSystemInfo(sshClient, 'bash', '/path/to/script.sh');
            } catch {
                // Expected to fail
            }
            
            expect(mockExec).toHaveBeenCalled();
        });
    });
});