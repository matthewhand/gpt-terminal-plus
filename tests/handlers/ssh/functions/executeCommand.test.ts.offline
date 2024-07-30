import { Client } from 'ssh2';
import { executeCommand } from '../../../../src/handlers/ssh/functions/executeCommand';

describe('executeCommand', () => {
  let client: Client;
  let mockExec: jest.Mock;

  beforeEach(() => {
    client = new Client();
    mockExec = jest.fn();
    client.exec = mockExec;
  });

  it('should execute a command and return stdout and stderr', async () => {
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
          },
        },
      };
      callback(null, stream);
    });

    const result = await executeCommand(client, { host: 'localhost', username: 'test' }, 'ls -la');

    expect(result).toEqual({ stdout: mockStdout, stderr: mockStderr, timeout: false });
  });

  it('should reject if command execution fails', async () => {
    mockExec.mockImplementation((command: string, callback: (err: Error | null, stream: any) => void) => {
      callback(new Error('Execution error'), null);
    });

    await expect(executeCommand(client, { host: 'localhost', username: 'test' }, 'ls -la')).rejects.toThrow('Execution error');
  });
});
