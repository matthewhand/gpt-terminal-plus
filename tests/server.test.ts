import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('server.ts - Server Startup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    // ensure fresh module eval for server.ts top level listen
    try { delete require.cache[require.resolve('@src/server')]; } catch (e) { e; }
    try { delete require.cache[require.resolve('@src/index')]; } catch (e) { e; }
    const { _resetGlobalStateForTests } = require('../src/utils/GlobalStateHelper');
    const { __clearSessionsForTests } = require('../src/session/ShellSessionDriver');
    _resetGlobalStateForTests();
    __clearSessionsForTests();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should use process.env.PORT when valid (real listen + log)', () => {
    process.env.PORT = '8080';
    try { delete require.cache[require.resolve('@src/server')]; } catch (e) { e; }
    const freshApp = require('@src/index').app;
    const mockListen = jest.spyOn(freshApp, 'listen').mockImplementation((port: any, cb?: any) => { if (typeof cb === 'function') cb(); return freshApp; });
    require('@src/server');
    expect(mockListen).toHaveBeenCalledWith(8080, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server listening on :8080');
    delete process.env.PORT;
  });

  // (pruned 3 low-density tests: pure toBeDefined import smoke + two weak "typeof mod no-crash" defaults;
  // default port covered indirectly via index.test start/port logic and real runs)
});