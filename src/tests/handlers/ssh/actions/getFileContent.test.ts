import { Client } from 'ssh2';
import { getFileContent } from '@src/handlers/ssh/actions/getFileContent';
import { ServerConfig } from '@types/ServerConfig';

jest.mock('ssh2');

describe('getFileContent', () => {
    let sshClient: Client;
    let mockSftp: jest.Mock;
    let mockReadFile: jest.Mock;
    let sshConfig: ServerConfig;

    beforeEach(() => {
        sshClient = new Client();
        mockSftp = jest.fn();
        mockReadFile = jest.fn();
        (sshClient as any).sftp = mockSftp;
        sshConfig = {
            protocol: 'ssh',
            hostname: 'localhost',
            port: 22,
            username: 'testuser',
            privateKeyPath: '/root/.ssh/id_rsa',
            shell: 'bash',
        };
    });

    it('should retrieve the content of a file from the SSH server', async () => {
        const filePath = '/path/to/file.txt';
        const mockContent = 'Hello, world!';

        mockSftp.mockImplementation((callback) => {
            callback(null, {
                readFile: mockReadFile.mockImplementation((path, cb) => {
                    cb(null, Buffer.from(mockContent, 'utf8'));
                }),
            });
        });

        const result = await getFileContent(sshClient, sshConfig, filePath);
        expect(result).toBe(mockContent);
        expect(mockSftp).toHaveBeenCalledWith(expect.any(Function));
        expect(mockReadFile).toHaveBeenCalledWith(filePath, expect.any(Function));
    });

    it('should throw an error if SSH client is not provided', async () => {
        await expect(getFileContent(null as unknown as Client, sshConfig, '/path/to/file.txt'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    });

    it('should throw an error if SSH server configuration is not provided', async () => {
        await expect(getFileContent(sshClient, null as unknown as ServerConfig, '/path/to/file.txt'))
            .rejects
            .toThrow('Server configuration must be provided and must be an object.');
    });

    it('should throw an error if file path is not provided', async () => {
        await expect(getFileContent(sshClient, sshConfig, ''))
            .rejects
            .toThrow('File path must be provided and must be a string.');
    });
});
