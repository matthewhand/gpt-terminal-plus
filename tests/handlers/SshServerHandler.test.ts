import { SshServerHandler } from '../../src/handlers/SshServerHandler';
import { Client } from 'ssh2';
import * as jest from 'jest-mock';

jest.mock('ssh2', () => ({
    Client: jest.fn(() => ({
        connect: jest.fn(),
        exec: jest.fn()
    }))
}));

describe('SshServerHandler', () => {
    let client: Client;
    let mockConnect: jest.Mock;
    let mockExec: jest.Mock;

    beforeEach(() => {
        client = new Client();
        mockConnect = client.connect as jest.Mock;
        mockExec = client.exec as jest.Mock;
    });

    it('should connect to the server', async () => {
        mockConnect.mockResolvedValue(true);
        const sshHandler = new SshServerHandler(client);
        await sshHandler.connect();
        expect(mockConnect).toHaveBeenCalled();
    });

    it('should execute a simple command and return global state', async () => {
        const mockStdout = 'Command output';
        const mockStderr = '';
        mockExec.mockImplementation((command: string, callback: (err: Error | null, stream: any) => void) => {
            const stream = {
                on: (event: string, handler: (data: Buffer) => void) => {
                    if (event === 'data') handler(Buffer.from(mockStdout));
                    if (event === 'close') handler(Buffer.from(''));
                },
                stderr: {
                    on: (event: string, handler: (data: Buffer) => void) => {
                        if (event === 'data') handler(Buffer.from(mockStderr));
                    }
                }
            };
            callback(null, stream);
        });

        const result = await sshHandler.executeCommand('ls -la');
        expect(result).toEqual({ stdout: mockStdout, stderr: mockStderr, timeout: false });
    });
});
