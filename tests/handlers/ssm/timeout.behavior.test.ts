import { SsmServerHandler } from '../../../src/handlers/ssm/SsmServerHandler';

// Mock AWS SSM client module
jest.mock('@aws-sdk/client-ssm', () => {
  class SendCommandCommand { constructor(public readonly input: any) {} }
  class GetCommandInvocationCommand { constructor(public readonly input: any) {} }
  class SSMClient {
    public send = jest.fn();
    constructor(_opts: any) {}
  }
  return { SSMClient, SendCommandCommand, GetCommandInvocationCommand };
});

describe('SsmServerHandler timeouts', () => {
  const { SSMClient, GetCommandInvocationCommand } = require('@aws-sdk/client-ssm');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 0, 1));
    (SSMClient as any).mockClear?.();
    delete process.env.SSM_TIMEOUT;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function buildHandlerAndMock() {
    const client = new SSMClient({ region: 'us-east-1' });
    client.send
      .mockResolvedValueOnce({ Command: { CommandId: 'abc' } })
      .mockImplementation((cmd: any) => {
        if (cmd instanceof GetCommandInvocationCommand) {
          return Promise.resolve({ Status: 'InProgress' });
        }
        return Promise.resolve({});
      });

    const handler = new SsmServerHandler({
      protocol: 'ssm',
      hostname: 'host',
      instanceId: 'i-123',
      region: 'us-east-1'
    } as any);
    return { handler };
  }

  it('applies env SSM_TIMEOUT when no param provided', async () => {
    process.env.SSM_TIMEOUT = '1000';
    const { handler } = buildHandlerAndMock();
    const p = handler.executeCommand('sleep 10');
    jest.advanceTimersByTime(2000);
    const result = await p;
    expect(result.exitCode).toBe(124);
    expect(result.error).toBe(true);
    expect(String(result.stderr)).toMatch(/timeout/i);
  });

  it('explicit timeout param overrides env default', async () => {
    process.env.SSM_TIMEOUT = '999999';
    const { handler } = buildHandlerAndMock();
    const p = handler.executeCommand('sleep 10', 1000);
    jest.advanceTimersByTime(2000);
    const result = await p;
    expect(result.exitCode).toBe(124);
    expect(String(result.stderr)).toMatch(/timeout/i);
  });
});

