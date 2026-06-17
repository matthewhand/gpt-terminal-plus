import router from '../../src/routes/shell/session';
import { EventEmitter } from 'events';

jest.mock('../../src/utils/activityLogger', () => ({
  logSessionStep: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('child_process', () => ({
  spawn: jest.fn(() => {
    const ee: any = new EventEmitter();
    ee.stdout = new EventEmitter();
    ee.stderr = new EventEmitter();
    ee.exitCode = null; // keep running
    return ee;
  })
}));

describe('session uplift logs', () => {
  const { logSessionStep } = require('../../src/utils/activityLogger');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 0, 1));
    (logSessionStep as jest.Mock).mockClear();
  });
  afterEach(() => jest.useRealTimers());

  it('records exec-start and timeout when command uplifts', async () => {
    const layer = (router as any).stack.find((l: any) => l.route && l.route.path === '/:id?/exec');
    const handler = layer.route.stack[0].handle;

    const req: any = { params: {}, body: { command: 'sleep 10', shell: 'bash' } };
    let jsonPayload: any;
    const res: any = { json: (p: any) => { jsonPayload = p; return p; } };

    const p = handler(req, res);
    // Allow any awaited work to schedule the timeout before advancing timers
    await Promise.resolve();
    expect((logSessionStep as jest.Mock)).toHaveBeenCalledWith('exec-start', expect.any(Object), undefined);

    jest.advanceTimersByTime(5000);
    await p;

    expect(jsonPayload.sessionId).toMatch(/^sess-/);
    expect((logSessionStep as jest.Mock)).toHaveBeenCalledWith('executeCommand', expect.objectContaining({ status: 'timeout' }), expect.any(String));
  });
});
