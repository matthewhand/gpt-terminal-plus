import { handleServerError } from '../src/utils/handleServerError';

describe('utils/handleServerError', () => {
  it('responds with 500 and error message', () => {
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
});

