import { Client } from 'ssh2';
import { getSystemInfo } from '../../../../src/handlers/ssh/functions/getSystemInfo';
import { executeCommand } from '../../../../src/handlers/ssh/functions/executeCommand';

// Mock the executeCommand function
jest.mock('../../../../src/handlers/ssh/functions/executeCommand');

describe('getSystemInfo', () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  it('should return system information', async () => {
    const mockStdout = 'Linux 5.4.0-42-generic x86_64\nFilesystem Size Used Avail Use% Mounted on\nMem: 8000 2000 6000';
    (executeCommand as jest.Mock).mockResolvedValue({ stdout: mockStdout, stderr: '' });

    const result = await getSystemInfo(client);

    expect(result).toEqual({
      homeFolder: '/home/chatgpt',
      type: 'Linux 5.4.0-42-generic x86_64',
      release: 'N/A',
      platform: 'Linux',
      architecture: process.arch,
      totalMemory: 8000,
      freeMemory: 6000,
      uptime: expect.any(Number),
      currentFolder: expect.any(String),
    });
  });
});
