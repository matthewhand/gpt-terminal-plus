import { Client } from 'ssh2';
import { getSystemInfo } from '../../../../src/handlers/ssh/actions/getSystemInfo';
import { escapeSpecialChars } from '../../../../src/common/escapeSpecialChars';

jest.mock('ssh2');
jest.mock('../../../../src/common/escapeSpecialChars');

describe('getSystemInfo', () => {
    let sshClient: Client;
    let mockExec: jest.Mock;

    beforeEach(() => {
        sshClient = new Client();
        mockExec = jest.fn();
        (sshClient as any).exec = mockExec;
        (escapeSpecialChars as jest.Mock).mockImplementation((content: string) => content);
    });

    // it('should retrieve system information from the SSH server', async () => {
    //     const shell = 'bash';
    //     const scriptPath = '/path/to/script.sh';
    //     const mockStdout = JSON.stringify({ os: 'Linux', version: '1.0.0' });

    //     mockExec.mockImplementation((execCommand, callback) => {
    //         console.debug(`Mock exec command: ${execCommand}`);
    //         const stream = {
    //             on: (event: string, handler: (data?: Buffer) => void) => {
    //                 if (event === 'data') handler(Buffer.from(mockStdout));
    //                 if (event === 'close') handler(0); // Simulate successful command execution
    //                 return stream;
    //             },
    //             stderr: {
    //                 on: (event: string, handler: (data?: Buffer) => void) => {
    //                     if (event === 'data') handler(Buffer.from(''));
    //                     return stream;
    //                 }
    //             }
    //         };
    //         callback(null, stream);
    //     });

    //     const result = await getSystemInfo(sshClient, shell, scriptPath);
    //     expect(result).toEqual({ os: 'Linux', version: '1.0.0' });
    //     expect(mockExec).toHaveBeenCalledWith(
    //         `${shell} ${scriptPath}`,
    //         expect.any(Function)
    //     );
    // });

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
