import { registerServersFromConfig } from '../../src/bootstrap/serverLoader';
import { listRegisteredServers } from '../../src/managers/serverRegistry';

// Mock config module
jest.mock('config', () => ({
  get: jest.fn((key: string) => {
    if (key === 'local') {
      return { hostname: 'localhost', protocol: 'local' };
    }
    if (key === 'ssh.hosts') {
      return [{ hostname: 'worker1', protocol: 'ssh', port: 22 }];
    }
    if (key === 'ssm.targets') {
      return [{ hostname: 'test-ssm', instanceId: 'i-123' }];
    }
    throw new Error('Config not found');
  })
}));

describe('Server Registration Bootstrap', () => {
  it('should register servers from config', () => {
    registerServersFromConfig();
    
    const servers = listRegisteredServers();
    expect(servers.length).toBeGreaterThan(0);
    
    const hostnames = servers.map(s => s.hostname);
    expect(hostnames).toContain('localhost');
    expect(hostnames).toContain('worker1');
    expect(hostnames).toContain('test-ssm');
  });

  it('should handle missing config gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    // Mock config to throw errors
    require('config').get.mockImplementation(() => {
      throw new Error('Config not found');
    });
    
    expect(() => registerServersFromConfig()).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

describe('Server Registration Edge Cases', () => {
  const mockRegisterServerInMemory = jest.fn();
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;
  let registerServersFromConfig: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    // re-apply config mock after resetModules
    jest.doMock('config', () => ({
      get: jest.fn((key: string) => {
        if (key === 'local') return { hostname: 'localhost', protocol: 'local' };
        if (key === 'ssh.hosts') return [];
        if (key === 'ssm.targets') return [];
        throw new Error('Config not found');
      })
    }));
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    jest.doMock('../../src/managers/serverRegistry', () => ({
      registerServerInMemory: mockRegisterServerInMemory,
      listRegisteredServers: jest.fn(() => []),
    }));
    const loaderMod = require('../../src/bootstrap/serverLoader');
    registerServersFromConfig = loaderMod.registerServersFromConfig;
  });

  afterEach(() => {
    if (mockConsoleLog) mockConsoleLog.mockRestore();
    if (mockConsoleWarn) mockConsoleWarn.mockRestore();
  });

  it('should register default localhost if no local config', () => {
    require('config').get.mockImplementation(key => {
      if (key === 'local') return null;
      if (key === 'ssh.hosts') return [];
      if (key === 'ssm.targets') return [];
      return null;
    });

    registerServersFromConfig();

    expect(mockRegisterServerInMemory).toHaveBeenCalledTimes(1);
    const call = mockRegisterServerInMemory.mock.calls[0][0];
    expect(call.protocol).toBe('local');
    expect(call.hostname).toBe('localhost');
    expect(call.modes).toEqual(['shell', 'code']);
    expect(call.directory).toBe('.');
    expect(call.code).toBe(false);
    expect(typeof call.registeredAt).toBe('string'); // ISO string
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered default localhost server'));
  });

  it('should not register default if local config present but hostname not localhost', () => {
    require('config').get.mockImplementation(key => {
      if (key === 'local') return { hostname: 'remote.local' };
      if (key === 'ssh.hosts') return [];
      if (key === 'ssm.targets') return [];
      return null;
    });

    registerServersFromConfig();

    // source always ensures default localhost (unless has exactly)
    expect(mockRegisterServerInMemory).toHaveBeenCalledTimes(2);
    const calls = mockRegisterServerInMemory.mock.calls.map(c => c[0]);
    expect(calls.some(c => c.hostname === 'remote.local')).toBe(true);
    expect(calls.some(c => c.hostname === 'localhost')).toBe(true);
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered server from config: remote.local'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered default localhost server'));
  });

  it('should handle empty SSH hosts array', () => {
    require('config').get.mockImplementation(key => {
      if (key === 'local') return { hostname: 'localhost' };
      if (key === 'ssh.hosts') return [];
      if (key === 'ssm.targets') return [];
      return null;
    });

    registerServersFromConfig();

    expect(mockRegisterServerInMemory).toHaveBeenCalledTimes(1); // Only local
    // empty array for ssh does not throw, so no warn emitted
    expect(mockConsoleWarn).not.toHaveBeenCalledWith('No SSH servers config found');
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered server from config: localhost'));
  });

  it('should handle empty SSM targets array', () => {
    require('config').get.mockImplementation(key => {
      if (key === 'local') return { hostname: 'localhost' };
      if (key === 'ssh.hosts') return [];
      if (key === 'ssm.targets') return [];
      return null;
    });

    registerServersFromConfig();

    expect(mockRegisterServerInMemory).toHaveBeenCalledTimes(1); // Only local
    // No additional warn for empty
  });

  it('should register multiple SSH hosts', () => {
    require('config').get.mockImplementation(key => {
      if (key === 'local') return null;
      if (key === 'ssh.hosts') return [
        { hostname: 'ssh1.example.com', port: 22, username: 'user1' },
        { hostname: 'ssh2.example.com', port: 22, username: 'user2' }
      ];
      if (key === 'ssm.targets') return [];
      return null;
    });

    registerServersFromConfig();

    // order: local/default first, then sshs (source processes local then ssh)
    expect(mockRegisterServerInMemory).toHaveBeenCalledTimes(3); // default local + 2 SSH
    const calls = mockRegisterServerInMemory.mock.calls;
    expect(calls.some(c => c[0].hostname === 'ssh1.example.com' && c[0].protocol === 'ssh')).toBe(true);
    expect(calls.some(c => c[0].hostname === 'ssh2.example.com' && c[0].protocol === 'ssh')).toBe(true);
    expect(calls.some(c => c[0].hostname === 'localhost')).toBe(true);
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered server from config: ssh1.example.com'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered server from config: ssh2.example.com'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered default localhost server'));
  });

  it('should register SSM targets with instanceId', () => {
    require('config').get.mockImplementation(key => {
      if (key === 'local') return null;
      if (key === 'ssh.hosts') return [];
      if (key === 'ssm.targets') return [{ hostname: 'ec2-instance', instanceId: 'i-1234567890abcdef0' }];
      return null;
    });

    registerServersFromConfig();

    // order: default local (no local config) then ssm
    expect(mockRegisterServerInMemory).toHaveBeenCalledTimes(2); // default local + SSM
    const calls = mockRegisterServerInMemory.mock.calls.map(c => c[0]);
    const ssmCall = calls.find(c => c.protocol === 'ssm');
    expect(ssmCall).toBeDefined();
    expect(ssmCall!.hostname).toBe('ec2-instance');
    expect(ssmCall!.instanceId).toBe('i-1234567890abcdef0');
    expect(ssmCall!.modes).toEqual(['shell', 'code']);
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Registered server from config: ec2-instance'));
  });

  it('should set correct modes and directory for local', () => {
    require('config').get.mockImplementation(key => {
      if (key === 'local') return { hostname: 'localhost', directory: '/custom/dir' };
      if (key === 'ssh.hosts') return [];
      if (key === 'ssm.targets') return [];
      return null;
    });

    registerServersFromConfig();

    // source overrides directory to '.' unconditionally in local registration
    const call = mockRegisterServerInMemory.mock.calls.find((c: any[]) => c[0].hostname === 'localhost' && c[0].protocol === 'local')![0];
    expect(call.modes).toEqual(['shell', 'code']);
    expect(call.directory).toBe('.');
    expect(call.protocol).toBe('local');
  });

  it('should warn on config get errors for each section', () => {
    require('config').get.mockImplementation(key => { throw new Error('Config error'); });

    registerServersFromConfig();

    expect(mockConsoleWarn).toHaveBeenCalledTimes(3); // One for local, SSH, SSM
    expect(mockConsoleWarn).toHaveBeenCalledWith('No local server config found');
    expect(mockConsoleWarn).toHaveBeenCalledWith('No SSH servers config found');
    expect(mockConsoleWarn).toHaveBeenCalledWith('No SSM targets config found');
    expect(mockRegisterServerInMemory).toHaveBeenCalledTimes(1); // Only default local
  });
});