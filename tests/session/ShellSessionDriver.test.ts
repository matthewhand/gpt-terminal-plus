import { ShellSessionDriver } from '../../src/session/ShellSessionDriver';
import { spawn } from 'child_process';

// Mock child_process
jest.mock('child_process');
const mockedSpawn = spawn as jest.MockedFunction<typeof spawn>;

describe('ShellSessionDriver', () => {
  let driver: ShellSessionDriver;
  let mockChild: any;

  beforeEach(() => {
    jest.clearAllMocks();
    driver = new ShellSessionDriver();

    mockChild = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn()
    };
    mockedSpawn.mockReturnValue(mockChild as any);
  });

  describe('start', () => {
    it('should start a session with default shell', async () => {
      const result = await driver.start();
      expect(result.status).toBe('running');
      expect(result.shell).toBe('bash');
      expect(result.id).toMatch(/^sess-\d+-[a-z0-9]{4}$/);
      expect(typeof result.createdAt).toBe('number');
    });

    it('should start a session with custom shell', async () => {
      const result = await driver.start({ shell: 'zsh' });
      expect(result.shell).toBe('zsh');
    });
  });

  describe('exec', () => {
    let sessionId: string;

    beforeEach(async () => {
      const session = await driver.start();
      sessionId = session.id;
    });

    it('should execute command successfully', async () => {
      mockChild.stdout.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from('output'));
      });
      mockChild.stderr.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from(''));
      });
      mockChild.on.mockImplementation((event, cb) => {
        if (event === 'close') cb(0);
      });

      const result = await driver.exec(sessionId, 'echo test');
      expect(result.stdout).toBe('output');
      expect(result.stderr).toBe('');
      expect(result.exitCode).toBe(0);
      expect(result.success).toBe(true);
      expect(mockedSpawn).toHaveBeenCalledWith('bash', ['-lc', 'echo test'], expect.any(Object));
    });

    it('should handle command failure', async () => {
      mockChild.stdout.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from(''));
      });
      mockChild.stderr.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from('error'));
      });
      mockChild.on.mockImplementation((event, cb) => {
        if (event === 'close') cb(1);
      });

      const result = await driver.exec(sessionId, 'bad command');
      expect(result.exitCode).toBe(1);
      expect(result.success).toBe(false);
      expect(result.stderr).toBe('error');
    });

    it('should handle non-bash shell', async () => {
      const session = await driver.start({ shell: 'sh' });
      mockChild.stdout.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from('sh output'));
      });
      mockChild.stderr.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from(''));
      });
      mockChild.on.mockImplementation((event, cb) => {
        if (event === 'close') cb(0);
      });

      const result = await driver.exec(session.id, 'echo sh');
      expect(result.stdout).toBe('sh output');
      expect(mockedSpawn).toHaveBeenCalledWith('sh', ['-lc', 'echo sh'], expect.any(Object));
    });

    it('should throw for non-existent session', async () => {
      await expect(driver.exec('nonexistent', 'command')).rejects.toThrow('Session not found: nonexistent');
    });

    it('should throw for empty command', async () => {
      await expect(driver.exec(sessionId, '')).rejects.toThrow('Command cannot be empty');
      await expect(driver.exec(sessionId, '   ')).rejects.toThrow('Command cannot be empty');
    });

    it('should handle spawn error', async () => {
      mockChild.on.mockImplementation((event, cb) => {
        if (event === 'error') cb(new Error('spawn failed'));
      });

      await expect(driver.exec(sessionId, 'command')).rejects.toThrow('spawn failed');
    });

    it('should accumulate logs', async () => {
      // First command
      mockChild.stdout.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from('first'));
      });
      mockChild.stderr.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from(''));
      });
      mockChild.on.mockImplementation((event, cb) => {
        if (event === 'close') cb(0);
      });

      await driver.exec(sessionId, 'first');
      let logs = await driver.logs(sessionId);
      expect(logs).toHaveLength(1);
      expect(logs[0].command).toBe('first');

      // Second command
      await driver.exec(sessionId, 'second');
      logs = await driver.logs(sessionId);
      expect(logs).toHaveLength(2);
    });
  });

  describe('logs', () => {
    it('should return logs with timestamps', async () => {
      const session = await driver.start();
      mockChild.stdout.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from('log output'));
      });
      mockChild.stderr.on.mockImplementation((event, cb) => {
        if (event === 'data') cb(Buffer.from(''));
      });
      mockChild.on.mockImplementation((event, cb) => {
        if (event === 'close') cb(0);
      });

      await driver.exec(session.id, 'test command');
      const logs = await driver.logs(session.id);
      expect(logs).toHaveLength(1);
      expect(logs[0].command).toBe('test command');
      expect(logs[0].stdout).toBe('log output');
      expect(logs[0].timestamp).toBeInstanceOf(Date);
    });

    it('should throw for non-existent session', async () => {
      await expect(driver.logs('nonexistent')).rejects.toThrow('Session not found: nonexistent');
    });
  });

  describe('list', () => {
    it('should list all sessions', async () => {
      const session1 = await driver.start({ shell: 'bash' });
      const session2 = await driver.start({ shell: 'zsh' });

      const list = await driver.list();
      expect(list).toHaveLength(2);
      const ids = list.map(s => s.id);
      expect(ids).toContain(session1.id);
      expect(ids).toContain(session2.id);
      expect(list.find(s => s.id === session1.id)?.shell).toBe('bash');
      expect(list.find(s => s.id === session2.id)?.shell).toBe('zsh');
      expect(list[0].status).toBe('running');
      expect(list[0].createdAt).toBeInstanceOf(Date);
    });

    it('should return empty list when no sessions', async () => {
      const list = await driver.list();
      expect(list).toEqual([]);
    });
  });

  describe('stop', () => {
    it('should stop existing session', async () => {
      const session = await driver.start();
      await expect(driver.stop(session.id)).resolves.toBeUndefined();
      // Session should still exist for logs
      const logs = await driver.logs(session.id);
      expect(logs).toEqual([]);
    });

    it('should throw for non-existent session', async () => {
      await expect(driver.stop('nonexistent')).rejects.toThrow('Session not found: nonexistent');
    });
  });
});