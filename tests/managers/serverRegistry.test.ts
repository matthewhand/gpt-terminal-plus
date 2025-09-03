import {
  registerServerInMemory,
  listRegisteredServers,
  getRegisteredServer,
  unregisterServer,
} from '../../src/managers/serverRegistry';

import type { ServerInfo } from '../../src/managers/serverRegistry';

describe('serverRegistry', () => {
  const base: ServerInfo = {
    hostname: 'local',
    protocol: 'local',
    registeredAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Ensure a clean module state between tests by reloading the module
    // and resetting functions to operate on a fresh registry map.
    jest.resetModules();
  });

  it('registers and retrieves servers by hostname', () => {
    const { registerServerInMemory, getRegisteredServer } = require('../../src/managers/serverRegistry');
    registerServerInMemory(base);
    const found = getRegisteredServer('local');
    expect(found?.protocol).toBe('local');
    expect(typeof found?.registeredAt).toBe('string');
  });

  it('overwrites existing hostname on re-register', () => {
    const { registerServerInMemory, getRegisteredServer } = require('../../src/managers/serverRegistry');
    registerServerInMemory({ ...base, modes: ['shell'] });
    registerServerInMemory({ ...base, modes: ['shell', 'llm'] });
    const found = getRegisteredServer('local');
    expect(found?.modes).toEqual(['shell', 'llm']);
  });

  it('lists all registered servers', () => {
    const { registerServerInMemory, listRegisteredServers } = require('../../src/managers/serverRegistry');
    registerServerInMemory(base);
    registerServerInMemory({ ...base, hostname: 'worker1', protocol: 'ssh' });
    const all = listRegisteredServers();
    const hostnames = all.map(s => s.hostname);
    expect(hostnames).toEqual(expect.arrayContaining(['local', 'worker1']));
  });

  it('unregisters servers and returns boolean status', () => {
    const { registerServerInMemory, unregisterServer, getRegisteredServer } = require('../../src/managers/serverRegistry');
    registerServerInMemory(base);
    expect(getRegisteredServer('local')).toBeTruthy();
    expect(unregisterServer('local')).toBe(true);
    expect(getRegisteredServer('local')).toBeUndefined();
    expect(unregisterServer('local')).toBe(false);
  });

  it('throws on invalid server input (missing hostname/protocol)', () => {
    const { registerServerInMemory } = require('../../src/managers/serverRegistry');
    expect(() => registerServerInMemory({
      // @ts-expect-error
      hostname: '',
      protocol: 'local',
      registeredAt: new Date().toISOString(),
    })).toThrow('Server must have hostname and protocol');

    expect(() => registerServerInMemory({
      // @ts-expect-error
      hostname: 'no-protocol',
      protocol: '',
      registeredAt: new Date().toISOString(),
    })).toThrow('Server must have hostname and protocol');
  });
});

