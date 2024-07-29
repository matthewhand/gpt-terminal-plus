import { Client } from 'ssh2';
import { getSystemInfo } from '../../../../src/handlers/ssh/functions/getSystemInfo';

// Mock the Client class from ssh2
jest.mock('ssh2');

describe('getSystemInfo', () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  it('should return system information', async () => {
    const mockStdout = JSON.stringify({
      homeFolder: '/home/chatgpt',
      type: 'Linux',
      release: '5.4.0-42-generic',
      platform: 'Linux',
      architecture: 'x86_64',
      totalMemory: 8000,
      freeMemory: 6000,
      uptime: 3600,
      currentFolder: '/home/chatgpt/project',
    });

    (client.exec as jest.Mock).mockImplementation((command, callback) => {
      const stream: any = {
        on: jest.fn((event, handler) => {
          if (event === 'close') {
            handler(0, '');
          } else if (event === 'data') {
            handler(Buffer.from(mockStdout));
          }
          return stream;
        }),
        stderr: {
          on: jest.fn(),
        },
      };
      callback(null, stream);
    });

    const result = await getSystemInfo(client, 'bash', '/path/to/script');

    expect(result).toEqual({
      homeFolder: '/home/chatgpt',
      type: 'Linux',
      release: '5.4.0-42-generic',
      platform: 'Linux',
      architecture: 'x86_64',
      totalMemory: 8000,
      freeMemory: 6000,
      uptime: 3600,
      currentFolder: '/home/chatgpt/project',
    });
  });
});
