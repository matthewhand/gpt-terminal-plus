import { Client } from 'ssh2';
import { getSystemInfo } from '../../../../src/handlers/ssh/functions/getSystemInfo';

// Mock the Client class and its methods
jest.mock('ssh2', () => ({
    Client: jest.fn().mockImplementation(() => ({
        exec: jest.fn()
    }))
}));

describe('getSystemInfo', () => {
    let client: Client;
    let mockExec: jest.Mock;

    const shell = '/bin/sh';
    const scriptPath = '/tmp/systeminfo.sh';

    beforeEach(() => {
        client = new Client();
        mockExec = client.exec as jest.Mock;
    });

    it('should parse valid JSON output', async () => {
        const mockStdout = '{"hostname":"test-host","uptime":12345}';
        mockExec.mockImplementation((command, callback) => {
            const stream = {
                on: (event: string, handler: (data: Buffer) => void) => {
                    if (event === 'data') handler(Buffer.from(mockStdout));
                    if (event === 'close') handler(Buffer.alloc(0));
                    return stream;
                },
                stderr: {
                    on: (event: string, handler: (data: Buffer) => void) => {
                        if (event === 'data') handler(Buffer.from(''));
                        return stream;
                    }
                }
            };
            callback(null, stream);
        });

        const result = await getSystemInfo(client, shell, scriptPath);
        expect(result).toEqual(JSON.parse(mockStdout));
    });

    it('should handle command execution errors', async () => {
        const errorMessage = 'Execution error';
        mockExec.mockImplementation((command, callback) => {
            callback(new Error(errorMessage), null);
        });

        await expect(getSystemInfo(client, shell, scriptPath)).rejects.toThrow(errorMessage);
    });

    it('should handle invalid JSON output', async () => {
        const invalidJson = 'invalid json';
        mockExec.mockImplementation((command, callback) => {
            const stream = {
                on: (event: string, handler: (data: Buffer) => void) => {
                    if (event === 'data') handler(Buffer.from(invalidJson));
                    if (event === 'close') handler(Buffer.alloc(0));
                    return stream;
                },
                stderr: {
                    on: (event: string, handler: (data: Buffer) => void) => {
                        if (event === 'data') handler(Buffer.from(''));
                        return stream;
                    }
                }
            };
            callback(null, stream);
        });

        await expect(getSystemInfo(client, shell, scriptPath)).rejects.toThrow('Invalid JSON output');
    });
});
