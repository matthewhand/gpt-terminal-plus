import { ServerManager } from '../../src/managers/ServerManager';
import { LocalServerHandler } from '../../src/handlers/local/LocalServerHandler';
import { SshServerHandler } from '../../src/handlers/ssh/SshServerHandler';
import { SsmServerHandler } from '../../src/handlers/ssm/SsmServerHandler';

// Mock the 'config' module to control available servers
jest.mock('config', () => ({
  get: (key: string) => {
    const map: Record<string, any> = {
      'local': { protocol: 'local', hostname: 'mylocal', code: true },
      'ssh.hosts': [
        { protocol: 'ssh', hostname: 'host1', username: 'user', privateKeyPath: '/tmp/key1' }
      ],
      'ssm.targets': [
        { protocol: 'ssm', hostname: 'tgt1', instanceId: 'i-1234567890' }
      ]
    };
    if (!(key in map)) throw new Error('missing config: ' + key);
    return map[key];
  }
}));

describe('ServerManager behavior', () => {
  beforeEach(() => {
    // Reset the singleton to ensure clean state per test
    (ServerManager as any).instance = undefined;
  });

  test('loads servers from mocked config', () => {
    const mgr = ServerManager.getInstance();
    const servers = mgr.listServers();
    const hosts = servers.map(s => s.hostname).sort();
    expect(hosts).toEqual(['host1', 'mylocal', 'tgt1']);
  });

  test('add and remove servers, with validation', () => {
    const mgr = ServerManager.getInstance();
    expect(() => mgr.addServer({} as any)).toThrow('Invalid server configuration');

    mgr.addServer({ protocol: 'local', hostname: 'extra', code: false } as any);
    expect(mgr.getServerConfig('extra')?.hostname).toBe('extra');

    expect(mgr.removeServer('extra')).toBe(true);
    expect(mgr.getServerConfig('extra')).toBeUndefined();
  });

  test('createHandler returns protocol-specific handlers', () => {
    const mgr = ServerManager.getInstance();

    // Ensure entries exist (already via config) and validate handler types
    const hLocal = mgr.createHandler('mylocal');
    const hSsh = mgr.createHandler('host1');
    const hSsm = mgr.createHandler('tgt1');

    expect(hLocal).toBeInstanceOf(LocalServerHandler);
    expect(hSsh).toBeInstanceOf(SshServerHandler);
    expect(hSsm).toBeInstanceOf(SsmServerHandler);
  });

  test('static helpers: listAvailableServers and getServerConfig', () => {
    const list = ServerManager.listAvailableServers();
    const names = list.map(s => s.hostname).sort();
    expect(names).toEqual(['host1', 'mylocal', 'tgt1']);

    // Known
    expect(ServerManager.getServerConfig('host1')?.hostname).toBe('host1');
    // Unknown -> falls back to default local
    const unknown = ServerManager.getServerConfig('nope');
    expect(unknown?.protocol).toBe('local');
    expect(unknown?.hostname).toBe('localhost');
  });

  test('createHandler throws for unknown hostname', () => {
    const mgr = ServerManager.getInstance();
    expect(() => mgr.createHandler('nonexistent')).toThrow('Server not found: nonexistent');
  });

  test('createHandler throws for unsupported protocol', () => {
    const mgr = ServerManager.getInstance();
    mgr.addServer({ protocol: 'unknown' as any, hostname: 'badproto' });
    expect(() => mgr.createHandler('badproto')).toThrow('Unsupported server protocol: unknown');
  });

  test('addServer throws for invalid config', () => {
    const mgr = ServerManager.getInstance();
    expect(() => mgr.addServer({ protocol: 'local' } as any)).toThrow('Invalid server configuration');
    expect(() => mgr.addServer(null as any)).toThrow('Invalid server configuration');
  });

  test('removeServer returns false for non-existent', () => {
    const mgr = ServerManager.getInstance();
    expect(mgr.removeServer('nonexistent')).toBe(false);
  });

  test('getServerConfig returns undefined for non-existent', () => {
    const mgr = ServerManager.getInstance();
    expect(mgr.getServerConfig('nonexistent')).toBeUndefined();
  });

  test('getDefaultLocalServerConfig returns correct defaults', () => {
    const defaultConfig = ServerManager.getDefaultLocalServerConfig();
    expect(defaultConfig).toEqual({
      protocol: 'local',
      hostname: 'localhost',
      code: false,
      directory: '.'
    });
  });

  test('listAvailableServers handles missing configs gracefully', () => {
    // Temporarily mock config to throw for all
    const originalGet = require('config').get;
    require('config').get = jest.fn(() => { throw new Error('config missing'); });

    const list = ServerManager.listAvailableServers();
    // Should include default local
    expect(list).toHaveLength(1);
    expect(list[0].hostname).toBe('localhost');

    // Restore
    require('config').get = originalGet;
  });

  test('singleton instance is reused', () => {
    const mgr1 = ServerManager.getInstance();
    const mgr2 = ServerManager.getInstance();
    expect(mgr1).toBe(mgr2);
  });
});

