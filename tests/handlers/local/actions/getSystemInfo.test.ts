import { getSystemInfo } from '../../../../src/handlers/local/actions/getSystemInfo';

// Mock reading the script content to avoid filesystem dependencies
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => 'echo mock'),
}));

// Mock child_process.exec so the util.promisified exec in the module returns our controlled stdout
jest.mock('child_process', () => {
  const stdout = [
    'type: linux',
    'platform: linux',
    'architecture: x64',
    'totalMemory: 8192',
    'freeMemory: 4096',
    'uptime: 12345',
    'currentFolder: /home/user',
  ].join('\n');

  return {
    exec: (command: string, callback: (error: any, result: { stdout: string; stderr: string }) => void) => {
      callback(null, { stdout, stderr: '' });
    },
  };
});

describe('getSystemInfo (local)', () => {
  it('should parse and return system information', async () => {
    const info = await getSystemInfo('bash');

    expect(info).toEqual({
      type: 'linux',
      platform: 'linux',
      architecture: 'x64',
      totalMemory: 8192,
      freeMemory: 4096,
      uptime: 12345,
      currentFolder: '/home/user',
    });
  });

  it('should work with other shells and return required fields', async () => {
    const info = await getSystemInfo('zsh');

    expect(typeof info.type).toBe('string');
    expect(typeof info.platform).toBe('string');
    expect(typeof info.architecture).toBe('string');
    expect(typeof info.totalMemory).toBe('number');
    expect(typeof info.freeMemory).toBe('number');
    expect(typeof info.uptime).toBe('number');
    expect(typeof info.currentFolder).toBe('string');
  });
});
