import SshServerImplementation from '../../src/handlers/ssh/SshServerImplementation';
import { Client } from 'ssh2';
import { SshHostConfig } from '../../src/types/ServerConfig';

jest.mock('ssh2', () => ({
    Client: jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        exec: jest.fn(),
        on: jest.fn().mockImplementation(function (this: any, event: string, handler: () => void) {
            if (event === 'ready') {
                setImmediate(() => handler());
            }
            return this;
        }),
    })),
}));

describe('SshServerImplementation', () => {
    let client: Client;
    let mockConnect: jest.Mock;
    let sshHostConfig: SshHostConfig;

    beforeEach(() => {
        client = new Client();
        mockConnect = client.connect as jest.Mock;

        sshHostConfig = {
            protocol: 'ssh',
            host: 'localhost',
            port: 22,
            username: 'testuser',
            privateKeyPath: '/root/.ssh/id_rsa',
            shell: 'bash',
        };
    });

    it('should create an instance with the provided config', () => {
        const handler = new SshServerImplementation(sshHostConfig);
        expect(handler).toBeDefined();
        expect(handler['host']).toBe(sshHostConfig.host);
        expect(handler['port']).toBe(sshHostConfig.port);
        expect(handler['username']).toBe(sshHostConfig.username);
        expect(handler['privateKeyPath']).toBe(sshHostConfig.privateKeyPath);
    });

    it('should connect to the server', async () => {
        const handler = new SshServerImplementation(sshHostConfig);
        handler['sshClient'] = client;  // Set the client directly
        await handler.connect();
        expect(mockConnect).toHaveBeenCalled();
    });
});
