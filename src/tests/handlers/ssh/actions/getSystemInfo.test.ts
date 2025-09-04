import { Client } from 'ssh2';
import { getSystemInfo } from '@src/handlers/ssh/actions/getSystemInfo';
import { escapeSpecialChars } from '@src/common/escapeSpecialChars';

jest.mock('ssh2');
jest.mock('@src/common/escapeSpecialChars');

describe('SSH getSystemInfo', () => {
    let sshClient: Client;
    let mockExec: jest.Mock;
    let mockStream: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Create mock stream
        mockStream = {
            on: jest.fn(),
            end: jest.fn(),
            write: jest.fn(),
            stderr: {
                on: jest.fn()
            }
        };
        
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

        it('should throw an error if SSH client is undefined', async () => {
            await expect(getSystemInfo(undefined as unknown as Client, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow('SSH client must be provided and must be an instance of Client.');
        });

        it('should throw an error if shell is not provided', async () => {
            await expect(getSystemInfo(sshClient, '', '/path/to/script.sh'))
                .rejects
                .toThrow('Shell must be provided and must be a string.');
        });

        it('should throw an error if shell is null', async () => {
            await expect(getSystemInfo(sshClient, null as any, '/path/to/script.sh'))
                .rejects
                .toThrow('Shell must be provided and must be a string.');
        });

        it('should throw an error if script path is not provided', async () => {
            await expect(getSystemInfo(sshClient, 'bash', ''))
                .rejects
                .toThrow('Script path must be provided and must be a string.');
        });

        it('should throw an error if script path is null', async () => {
            await expect(getSystemInfo(sshClient, 'bash', null as any))
                .rejects
                .toThrow('Script path must be provided and must be a string.');
        });

        it('should validate shell parameter type', async () => {
            await expect(getSystemInfo(sshClient, 123 as any, '/path/to/script.sh'))
                .rejects
                .toThrow('Shell must be provided and must be a string.');
        });

        it('should validate script path parameter type', async () => {
            await expect(getSystemInfo(sshClient, 'bash', 123 as any))
                .rejects
                .toThrow('Script path must be provided and must be a string.');
        });
    });

    describe('SSH execution', () => {
        it('should handle SSH execution errors', async () => {
            const testError = new Error('SSH connection failed');
            mockExec.mockImplementation((cmd, callback) => {
                callback(testError, null);
            });

            await expect(getSystemInfo(sshClient, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow('SSH connection failed');
            
            expect(mockExec).toHaveBeenCalledTimes(1);
        });

        it('should handle network timeout errors', async () => {
            const timeoutError = new Error('Connection timeout');
            (timeoutError as any).code = 'ETIMEDOUT';
            
            mockExec.mockImplementation((cmd, callback) => {
                callback(timeoutError, null);
            });

            await expect(getSystemInfo(sshClient, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow('Connection timeout');
        });

        it('should escape special characters in parameters', async () => {
            const scriptPath = '/path with spaces/script.sh';
            const shell = 'bash';
            (escapeSpecialChars as jest.Mock)
                .mockReturnValueOnce('bash')
                .mockReturnValueOnce('/path\\ with\\ spaces/script.sh');
            
            mockExec.mockImplementation((cmd, callback) => {
                callback(new Error('Test error'), null);
            });

            try {
                await getSystemInfo(sshClient, shell, scriptPath);
            } catch {
                // Expected to fail, we just want to verify escaping was called
            }
            
            expect(escapeSpecialChars).toHaveBeenCalledWith(shell);
            expect(escapeSpecialChars).toHaveBeenCalledWith(scriptPath);
            expect(escapeSpecialChars).toHaveBeenCalledTimes(2);
        });

        it('should construct proper command with escaped parameters', async () => {
            const shell = 'bash';
            const scriptPath = '/path/to/script.sh';
            (escapeSpecialChars as jest.Mock).mockImplementation(str => str);
            
            mockExec.mockImplementation((cmd, callback) => {
                expect(cmd).toBe('bash /path/to/script.sh');
                callback(new Error('Test complete'), null);
            });

            try {
                await getSystemInfo(sshClient, shell, scriptPath);
            } catch {
                // Expected to fail
            }
            
            expect(mockExec).toHaveBeenCalledWith('bash /path/to/script.sh', expect.any(Function));
        });

        it('should handle successful execution with system info output', async () => {
            const mockSystemInfo = {
                platform: 'linux',
                architecture: 'x64',
                totalMemory: 8589934592,
                freeMemory: 4294967296,
                uptime: 86400
            };
            
            mockExec.mockImplementation((cmd, callback) => {
                callback(null, mockStream);
            });

            // Mock stream events for successful execution
            mockStream.on.mockImplementation((event: string, handler: Function) => {
                if (event === 'close') {
                    setTimeout(() => handler(0), 10);
                } else if (event === 'data') {
                    setTimeout(() => handler(JSON.stringify(mockSystemInfo)), 5);
                }
                return mockStream;
            });

            mockStream.stderr.on.mockImplementation((event: string, handler: Function) => {
                if (event === 'data') {
                    // No stderr data for successful execution
                }
                return mockStream.stderr;
            });

            const result = await getSystemInfo(sshClient, 'bash', '/path/to/script.sh');
            
            expect(result).toEqual(mockSystemInfo);
            expect(mockExec).toHaveBeenCalledTimes(1);
        });

        it('should handle execution with stderr output', async () => {
            mockExec.mockImplementation((cmd, callback) => {
                callback(null, mockStream);
            });

            const stderrData = 'Warning: deprecated API usage';
            
            mockStream.on.mockImplementation((event: string, handler: Function) => {
                if (event === 'close') {
                    setTimeout(() => handler(1), 10); // Non-zero exit code
                } else if (event === 'data') {
                    setTimeout(() => handler('{}'), 5);
                }
                return mockStream;
            });

            mockStream.stderr.on.mockImplementation((event: string, handler: Function) => {
                if (event === 'data') {
                    setTimeout(() => handler(stderrData), 5);
                }
                return mockStream.stderr;
            });

            await expect(getSystemInfo(sshClient, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow();
        });

        it('should handle malformed JSON output', async () => {
            mockExec.mockImplementation((cmd, callback) => {
                callback(null, mockStream);
            });

            mockStream.on.mockImplementation((event: string, handler: Function) => {
                if (event === 'close') {
                    setTimeout(() => handler(0), 10);
                } else if (event === 'data') {
                    setTimeout(() => handler('invalid json'), 5);
                }
                return mockStream;
            });

            mockStream.stderr.on.mockImplementation((event: string, handler: Function) => {
                return mockStream.stderr;
            });

            await expect(getSystemInfo(sshClient, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow();
        });
    });

    describe('edge cases', () => {
        it('should handle empty stdout', async () => {
            mockExec.mockImplementation((cmd, callback) => {
                callback(null, mockStream);
            });

            mockStream.on.mockImplementation((event: string, handler: Function) => {
                if (event === 'close') {
                    setTimeout(() => handler(0), 10);
                } else if (event === 'data') {
                    // No data emitted
                }
                return mockStream;
            });

            mockStream.stderr.on.mockImplementation((event: string, handler: Function) => {
                return mockStream.stderr;
            });

            await expect(getSystemInfo(sshClient, 'bash', '/path/to/script.sh'))
                .rejects
                .toThrow();
        });

        it('should handle special characters in shell and script path', async () => {
            const shell = 'bash';
            const scriptPath = '/path/with/special$chars&symbols.sh';
            
            (escapeSpecialChars as jest.Mock)
                .mockReturnValueOnce('bash')
                .mockReturnValueOnce('/path/with/special\\$chars\\&symbols.sh');
            
            mockExec.mockImplementation((cmd, callback) => {
                expect(cmd).toBe('bash /path/with/special\\$chars\\&symbols.sh');
                callback(new Error('Test complete'), null);
            });

            try {
                await getSystemInfo(sshClient, shell, scriptPath);
            } catch {
                // Expected to fail
            }
            
            expect(escapeSpecialChars).toHaveBeenCalledWith(shell);
            expect(escapeSpecialChars).toHaveBeenCalledWith(scriptPath);
        });

        it('should handle different shell types', async () => {
            const testCases = [
                { shell: 'bash', scriptPath: '/script.sh' },
                { shell: 'sh', scriptPath: '/script.sh' },
                { shell: 'zsh', scriptPath: '/script.sh' },
                { shell: 'fish', scriptPath: '/script.sh' }
            ];

            for (const { shell, scriptPath } of testCases) {
                (escapeSpecialChars as jest.Mock).mockImplementation(str => str);
                
                mockExec.mockImplementation((cmd, callback) => {
                    expect(cmd).toBe(`${shell} ${scriptPath}`);
                    callback(new Error('Test complete'), null);
                });

                try {
                    await getSystemInfo(sshClient, shell, scriptPath);
                } catch {
                    // Expected to fail
                }
            }
        });
    });
});