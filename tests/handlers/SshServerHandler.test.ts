import { SshServerHandler } from '../../src/handlers/SshServerHandler';
import { Client } from 'ssh2';

jest.mock('ssh2', () => ({
    Client: jest.fn().mockImplementation(() => {
        const client = {
            connect: jest.fn(),
            exec: jest.fn(),
            on: jest.fn().mockImplementation(function (this: any, event: string, handler: Function) {
                if (event === 'ready') {
                    setImmediate(handler);
                }
                return this;
            }),
        };
        return client;
    }),
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
        const sshHandler = new SshServerHandler({ host: 'localhost', username: 'test' });
        await sshHandler.connect();
        expect(mockConnect).toHaveBeenCalled();
    });

    it('should get the client', () => {
        const sshHandler = new SshServerHandler({ host: 'localhost', username: 'test' });
        sshHandler.setClient(client);
        expect(sshHandler.getClient()).toBe(client);
    });
});
