import type { IConfig } from 'config';
import { evaluateCommandSafety } from '@src/utils/safety';

jest.mock('config');

describe('evaluateCommandSafety - config integration', () => {
  const mockedConfig = require('config') as jest.Mocked<IConfig> & {
    has: jest.Mock;
    get: jest.Mock;
  };

  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.DENY_COMMAND_REGEX;
    delete process.env.CONFIRM_COMMAND_REGEX;
    mockedConfig.has = jest.fn();
    mockedConfig.get = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('uses config deny/confirm regex when env vars are not set', () => {
    mockedConfig.has.mockImplementation((key: string) =>
      key === 'safety.denyRegex' || key === 'safety.confirmRegex'
    );
    mockedConfig.get.mockImplementation((key: string) => {
      if (key === 'safety.denyRegex') return ['nope_command'];
      if (key === 'safety.confirmRegex') return ['warn_command'];
      return '';
    });

    const denyRes = evaluateCommandSafety('run nope_command now');
    expect(denyRes.hardDeny).toBe(true);
    expect(denyRes.needsConfirm).toBe(false);

    const confirmRes = evaluateCommandSafety('warn_command please');
    expect(confirmRes.hardDeny).toBe(false);
    expect(confirmRes.needsConfirm).toBe(true);
  });

  it('falls back to defaults if config throws', () => {
    mockedConfig.has.mockImplementation(() => { throw new Error('boom'); });
    mockedConfig.get.mockImplementation(() => { throw new Error('boom'); });

    const res = evaluateCommandSafety('rm -rf /var/tmp');
    // Should still require confirmation due to default patterns
    expect(res.needsConfirm || res.hardDeny).toBe(true);
  });
});

