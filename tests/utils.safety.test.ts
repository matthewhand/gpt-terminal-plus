import { evaluateCommandSafety } from '../src/utils/safety';

describe('utils/safety', () => {
  const oldEnv = { DENY_COMMAND_REGEX: process.env.DENY_COMMAND_REGEX, CONFIRM_COMMAND_REGEX: process.env.CONFIRM_COMMAND_REGEX };
  afterEach(() => {
    process.env.DENY_COMMAND_REGEX = oldEnv.DENY_COMMAND_REGEX;
    process.env.CONFIRM_COMMAND_REGEX = oldEnv.CONFIRM_COMMAND_REGEX;
  });

  it('uses env patterns for confirm and deny', () => {
    process.env.DENY_COMMAND_REGEX = 'danger';
    process.env.CONFIRM_COMMAND_REGEX = 'rm\\s+-rf';
    const a = evaluateCommandSafety('echo ok');
    expect(a.hardDeny).toBe(false);
    expect(a.needsConfirm).toBe(false);
    const b = evaluateCommandSafety('rm -rf /tmp/demo');
    expect(b.needsConfirm).toBe(true);
    const c = evaluateCommandSafety('do danger things');
    expect(c.hardDeny).toBe(true);
  });
});

