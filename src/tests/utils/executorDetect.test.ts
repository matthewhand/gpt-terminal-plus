import os from 'os';
import { spawnSync as realSpawnSync, SpawnSyncReturns } from 'child_process';
import { detectSystemExecutors } from '@src/utils/executorDetect';

// Helper to build a fake SpawnSyncReturns
function ok(stdout: string): SpawnSyncReturns<string> {
  return {
    pid: 1,
    output: [stdout, stdout, ''],
    stdout,
    stderr: '',
    status: 0,
    signal: null,
  } as any;
}

function fail(): SpawnSyncReturns<string> {
  return {
    pid: 1,
    output: ['', '', ''],
    stdout: '',
    stderr: '',
    status: 1,
    signal: null,
  } as any;
}

describe('detectSystemExecutors', () => {
  const platformSpy = jest.spyOn(os, 'platform');

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('detects executors on POSIX using `sh -lc command -v`', () => {
    platformSpy.mockReturnValue('linux' as any);

    jest.doMock('child_process', () => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      spawnSync: (cmd: string, args: string[], opts: any) => {
        const joined = [cmd, ...args].join(' ');
        if (joined.includes('command -v bash')) return ok('/usr/bin/bash\n');
        if (joined.includes('command -v python3')) return ok('/usr/bin/python3\n');
        if (joined.includes('command -v node')) return ok('/usr/bin/node\n');
        // everything else not found
        return fail();
      },
    }));

    // Re-require after mocking
    const { detectSystemExecutors: detect } = require('@src/utils/executorDetect');
    const res = detect();

    expect(res.bash.available).toBe(true);
    expect(res.bash.cmd).toContain('bash');
    expect(res.python3.available).toBe(true);
    expect(res.node.available).toBe(true);

    // Not found candidates
    expect(res.zsh.available).toBe(false);
    expect(res.pwsh.available).toBe(false);
    expect(res.powershell.available).toBe(false);
    expect(res.deno.available).toBe(false);
  });

  it('detects executors on Windows using `where`', () => {
    platformSpy.mockReturnValue('win32' as any);

    jest.doMock('child_process', () => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      spawnSync: (cmd: string, args: string[], opts: any) => {
        const target = args[0];
        if (cmd === 'where' && target === 'powershell') return ok('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe\r\n');
        if (cmd === 'where' && target === 'python') return ok('C:\\Python\\python.exe\r\n');
        return fail();
      },
    }));

    const { detectSystemExecutors: detect } = require('@src/utils/executorDetect');
    const res = detect();

    expect(res.powershell.available).toBe(true);
    expect(res.powershell.cmd).toMatch(/powershell/i);
    expect(res.python.available).toBe(true);

    // Ensure others not found
    expect(res.bash.available).toBe(false);
    expect(res.zsh.available).toBe(false);
  });

  it('handles spawn failures gracefully without throwing', () => {
    platformSpy.mockReturnValue('linux' as any);

    // Proxy to real spawn but force throwing to exercise try/catch
    jest.doMock('child_process', () => ({
      spawnSync: () => { throw new Error('spawn failed'); },
    }));

    const { detectSystemExecutors: detect } = require('@src/utils/executorDetect');
    const res = detect();
    // All should be unavailable if detection throws
    Object.values(res).forEach(v => {
      expect(v.available).toBe(false);
      expect(v.cmd).toBeUndefined();
    });
  });
});

