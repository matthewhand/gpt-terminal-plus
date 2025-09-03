import { jest } from '@jest/globals';

describe('advancedRateLimit middleware', () => {
  const fixedNow = new Date('2025-01-01T00:00:00Z');

  const mkRes = () => {
    const headers: Record<string, string> = {};
    return {
      headers,
      statusCode: 200,
      body: undefined as any,
      set: jest.fn((h: Record<string, string>) => {
        Object.assign(headers, h);
      }),
      status: jest.fn(function (this: any, code: number) {
        this.statusCode = code;
        return this;
      }),
      json: jest.fn(function (this: any, obj: any) {
        this.body = obj;
        return this;
      }),
    } as any;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('sets rate limit headers and allows requests within limit', async () => {
    await jest.isolateModulesAsync(async () => {
      const { advancedRateLimit } = await import('@src/middlewares/advancedRateLimit');
      const mw = advancedRateLimit({ windowMs: 1000, maxRequests: 2 });

      const req: any = { ip: '1.2.3.4', get: () => undefined };
      const res: any = mkRes();
      const next = jest.fn();

      mw(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.headers['X-RateLimit-Limit']).toBe('2');
      expect(res.headers['X-RateLimit-Remaining']).toBe('1');
      expect(new Date(res.headers['X-RateLimit-Reset']).toISOString()).toBe(
        new Date(fixedNow.getTime() + 1000).toISOString()
      );

      // second allowed request
      const res2: any = mkRes();
      const next2 = jest.fn();
      mw(req, res2, next2);
      expect(next2).toHaveBeenCalledTimes(1);
      expect(res2.headers['X-RateLimit-Remaining']).toBe('0');
    });
  });

  test('blocks after exceeding max and returns retryAfter', async () => {
    await jest.isolateModulesAsync(async () => {
      const { advancedRateLimit } = await import('@src/middlewares/advancedRateLimit');
      const mw = advancedRateLimit({ windowMs: 2000, maxRequests: 2 });

      const req: any = { ip: '5.6.7.8', get: () => undefined };
      const res1: any = mkRes();
      const res2: any = mkRes();
      const res3: any = mkRes();

      const next = jest.fn();

      mw(req, res1, next);
      mw(req, res2, next);

      // third should be blocked
      mw(req, res3, next);
      expect(res3.status).toHaveBeenCalledWith(429);
      expect(res3.body).toMatchObject({ error: 'Too Many Requests' });
      expect(typeof res3.body.retryAfter).toBe('number');
      expect(res3.body.retryAfter).toBeGreaterThan(0);
    });
  });

  test('resets counts after window passes', async () => {
    await jest.isolateModulesAsync(async () => {
      const windowMs = 1500;
      const { advancedRateLimit } = await import('@src/middlewares/advancedRateLimit');
      const mw = advancedRateLimit({ windowMs, maxRequests: 1 });

      const req: any = { ip: '9.9.9.9', get: () => undefined };
      const res1: any = mkRes();
      const next = jest.fn();

      // consume limit
      mw(req, res1, next);

      // advance beyond window
      jest.setSystemTime(new Date(fixedNow.getTime() + windowMs + 1));

      const res2: any = mkRes();
      const next2 = jest.fn();
      mw(req, res2, next2);
      expect(next2).toHaveBeenCalledTimes(1);
      expect(res2.status).not.toHaveBeenCalled();
      expect(res2.headers['X-RateLimit-Remaining']).toBe('0');
    });
  });

  test('perUser limiter keys by bearer token', async () => {
    await jest.isolateModulesAsync(async () => {
      const { rateLimiters } = await import('@src/middlewares/advancedRateLimit');
      const mw = rateLimiters.perUser(1); // only one request per unique key

      const mkReq = (auth: string | undefined, ip = '10.0.0.1') => ({
        ip,
        get: (h: string) => (h.toLowerCase() === 'authorization' ? auth : undefined),
      }) as any;

      const nextA = jest.fn();
      const resA1: any = mkRes();
      mw(mkReq('Bearer token-AAA'), resA1, nextA);
      expect(nextA).toHaveBeenCalledTimes(1);

      const nextB = jest.fn();
      const resB1: any = mkRes();
      mw(mkReq('Bearer token-BBB'), resB1, nextB);
      expect(nextB).toHaveBeenCalledTimes(1);

      // second request with same token should be blocked
      const resA2: any = mkRes();
      const nextA2 = jest.fn();
      mw(mkReq('Bearer token-AAA'), resA2, nextA2);
      expect(resA2.status).toHaveBeenCalledWith(429);
    });
  });
});

