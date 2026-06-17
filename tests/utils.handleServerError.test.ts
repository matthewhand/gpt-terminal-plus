import { handleServerError } from '../src/utils/handleServerError';

describe('utils/handleServerError', () => {
  it('responds with 500 and Error message', () => {
    const res: any = {
      statusCode: 0,
      body: undefined as any,
      status(code: number) { this.statusCode = code; return this; },
      json(obj: any) { this.body = obj; return this; }
    };
    handleServerError(new Error('boom'), res as any, 'ctx');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('boom');
  });

  it('handles string error input', () => {
    const res: any = {
      statusCode: 0,
      body: undefined as any,
      status(code: number) { this.statusCode = code; return this; },
      json(obj: any) { this.body = obj; return this; }
    };
    handleServerError('fail-fast', res as any, 'ctx');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ status: 'error', error: 'fail-fast' });
  });

  it('handles null/undefined error gracefully', () => {
    const mkRes = () => ({
      statusCode: 0,
      body: undefined as any,
      status(code: number) { this.statusCode = code; return this; },
      json(obj: any) { this.body = obj; return this; }
    });

    const res1: any = mkRes();
    handleServerError(null as any, res1 as any, 'ctx');
    expect(res1.statusCode).toBe(500);
    expect(res1.body).toEqual({ status: 'error', error: 'Unknown error' });

    const res2: any = mkRes();
    handleServerError(undefined as any, res2 as any, 'ctx');
    expect(res2.statusCode).toBe(500);
    expect(res2.body).toEqual({ status: 'error', error: 'Unknown error' });
  });
});
