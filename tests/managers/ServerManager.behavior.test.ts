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
});

