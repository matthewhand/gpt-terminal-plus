import { getSystemInfo } from '../../../../src/handlers/ssh/functions/getSystemInfo';
import { Client } from 'ssh2';

jest.mock('ssh2', () => ({
    Client: jest.fn().mockImplementation(() => ({
        exec: jest.fn()
    }))
}));

describe('getSystemInfo', () => {
    let client: Client;
    let mockExec: jest.Mock;

    beforeEach(() => {
        client = new Client();
        mockExec = client.exec as jest.Mock;
    });

    it('should return system information', async () => {
        const mockStdout = '{"systemInfo": {"cpu": "Intel"}}';
        mockExec.mockImplementation((command: string, callback: (err: Error | null, stream: any) => void) => {
            const stream = {
                on: (event: string, handler: (data: Buffer) => void) => {
                    if (event === 'data') handler(Buffer.from(mockStdout));
                    if (event === 'close') handler(Buffer.alloc(0));
                }
            };
            callback(null, stream);
        });

        const result = await getSystemInfo(client, 'bash', '/path/to/script.sh');
        expect(result).toEqual({ systemInfo: { cpu: 'Intel' } });
    });
});
