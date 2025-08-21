import { executeCommand } from '../../../../src/handlers/local/actions/executeCommand';

jest.mock('child_process', () => ({
  exec: jest.fn(),
  execFile: jest.fn(),
}));

import { exec, execFile } from 'child_process';

const mockExec = exec as unknown as jest.Mock;
const mockExecFile = execFile as unknown as jest.Mock;

describe('executeCommand()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.USE_EXECFILE = 'false'; // drive exec path by default
  });

  it('is defined', () => {
    expect(executeCommand).toBeDefined();
  });

  it('exec path: resolves with stdout/stderr and presentWorkingDirectory', async () => {
    mockExec.mockImplementation((command: string, options: any, callback: any) => {
      if (typeof options === 'function') {
        callback = options;
      }
      callback(null, 'Command output', '');
      return {} as any;
    });

    const result = await executeCommand('echo "Hello, World!"', 0, '/tmp', '/bin/bash');

    expect(result).toEqual({
      stdout: 'Command output',
      stderr: '',
      presentWorkingDirectory: '/tmp',
    });
    expect(mockExec).toHaveBeenCalled();
  });

  it('exec path: rejects with stdout/stderr object on error', async () => {
    mockExec.mockImplementation((command: string, options: any, callback: any) => {
      if (typeof options === 'function') {
        callback = options;
      }
      const err = new Error('Command failed');
      (err as any).code = 1;
      callback(err, 'Error stdout', 'Error stderr');
      return {} as any;
    });

    await expect(executeCommand('bad-cmd', 0, '/tmp', '/bin/bash')).rejects.toEqual({
      stdout: 'Error stdout',
      stderr: 'Error stderr',
      presentWorkingDirectory: '/tmp',
    });
  });

  it('validates command input', async () => {
    await expect(executeCommand('' as any)).rejects.toThrow('A valid command string must be provided.');
  });

  it('execFile path: respects USE_EXECFILE=true', async () => {
    jest.resetModules();
    process.env.USE_EXECFILE = 'true';

    const execFileMock = jest.fn((file: string, args: string[], options: any, callback: any) => {
      if (typeof options === 'function') {
        callback = options;
      }
      callback(null, 'OK', '');
      return {} as any;
    });
    const execMock = jest.fn();

    // Dynamically mock child_process for this isolated import
    jest.doMock('child_process', () => ({
      exec: execMock,
      execFile: execFileMock,
    }));

    // Import after doMock so the implementation sees the mocked module
    const { executeCommand: executeCommandExecFile } = await import('../../../../src/handlers/local/actions/executeCommand');

    const res = await executeCommandExecFile('echo OK', 0, '/work', '/bin/bash');
    expect(res).toEqual({
      stdout: 'OK',
      stderr: '',
      presentWorkingDirectory: '/work',
    });
    expect(execFileMock).toHaveBeenCalled();
  });
});
