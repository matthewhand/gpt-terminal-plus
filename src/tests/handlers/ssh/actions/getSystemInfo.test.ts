/**
 * Tests for the 'getSystemInfo' function to ensure it retrieves system information from a remote SSH server.
 * Includes validations for successful retrieval and error handling for invalid inputs.
 */

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