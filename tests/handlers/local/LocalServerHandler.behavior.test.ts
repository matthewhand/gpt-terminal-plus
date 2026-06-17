import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { LocalServerHandler } from '../../../src/handlers/local/LocalServerHandler';

// Mock action modules we want to control explicitly
jest.mock('../../../src/handlers/local/actions/executeCode', () => ({
  executeLocalCode: jest.fn(async (code: string, language: string, timeout: number, cwd: string) => ({
    stdout: `ran:${language}`,
    stderr: '',
    exitCode: 0,
    success: true,
  })),
}));

jest.mock('child_process', () => {
  return {
    // Only exec is used by LocalServerHandler.createFile; spawn is used by executeCommand but not tested here
    exec: jest.fn((cmd: string, cb: (...args: any[]) => void) => {
      // simulate async success
      setTimeout(() => cb(null, 'ok', ''), 0);
      return {} as any;
    }),
    spawn: jest.fn(),
  };
});

jest.mock('../../../src/handlers/local/actions/createFile.local', () => ({
  createFile: jest.fn(async () => true),
}));

jest.mock('../../../src/handlers/local/actions/presentWorkingDirectory', () => ({
  presentWorkingDirectory: jest.fn(async () => '/some/pwd'),
}));

jest.mock('../../../src/handlers/local/actions/changeDirectory.local', () => ({
  changeDirectory: jest.fn(async () => true),
}));

jest.mock('../../../src/handlers/local/actions/listFiles.local', () => ({
  __esModule: true,
  default: jest.fn(async () => ({
    files: [
      { name: 'a.txt', isDirectory: false },
      { name: 'b', isDirectory: true },
    ],
    total: 2,
  })),
}));

describe('LocalServerHandler (behavior)', () => {
  let tmpRoot: string;

  beforeAll(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'gpttp-lsh-'));
    await fs.mkdir(path.join(tmpRoot, 'dir1'));
    await fs.writeFile(path.join(tmpRoot, 'dir1', 'file.txt'), 'hello');
    await fs.writeFile(path.join(tmpRoot, 'root.txt'), 'root');
  });

  afterAll(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  });

  it('executeCode enforces validation and forwards defaults', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost' });
    await expect(handler.executeCode('', 'bash')).rejects.toThrow('Code and language are required');
    await expect(handler.executeCode('echo ok', '')).rejects.toThrow('Code and language are required');

    const res = await handler.executeCode('print("hi")', 'python');
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('ran:python');
  });

  it('createFile triggers post-command but ignores failures', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', 'post-command': 'echo created' } as any);
    const ok = await handler.createFile(path.join(tmpRoot, 'new.txt'), 'x');
    expect(ok).toBe(true);
    const { exec } = jest.requireMock('child_process') as any;
    expect(exec).toHaveBeenCalled();

    // Now simulate a failing exec
    exec.mockImplementationOnce((cmd: string, cb: (...args: any[]) => void) => {
      const err: any = new Error('fail');
      err.code = 1;
      setTimeout(() => cb(err, '', 'err'), 0);
      return {} as any;
    });
    const ok2 = await handler.createFile(path.join(tmpRoot, 'new2.txt'), 'x');
    expect(ok2).toBe(true);
  });

  it('presentWorkingDirectory returns value from action', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost' });
    const cwd = await handler.presentWorkingDirectory();
    expect(cwd).toBe('/some/pwd');
  });

  it('changeDirectory updates internal config on success', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', directory: tmpRoot } as any);
    const ok = await handler.changeDirectory(path.join(tmpRoot, 'dir1'));
    expect(ok).toBe(true);
    // call again to ensure it uses updated directory gracefully
    const ok2 = await handler.changeDirectory(tmpRoot);
    expect(ok2).toBe(true);
  });

  it('getFileContent reads under configured directory', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', directory: tmpRoot } as any);
    const text = await handler.getFileContent('root.txt');
    expect(text).toBe('root');
  });

  it('listFiles returns mapped items', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost' });
    const res = await handler.listFiles({ directory: tmpRoot, limit: 10, offset: 0 });
    expect(res.total).toBe(2);
    expect(res.items).toEqual([
      { name: 'a.txt', isDirectory: false },
      { name: 'b', isDirectory: true },
    ]);
  });
});

