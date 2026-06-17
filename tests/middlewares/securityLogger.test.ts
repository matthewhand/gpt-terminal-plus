import express from 'express';
import request from 'supertest';
import { securityLogger, getSecurityEvents, logSecurityEvent } from '../../src/middlewares/securityLogger';

describe('securityLogger middleware', () => {
  function makeApp() {
    const app = express();
    app.use(express.json());
    app.use(securityLogger);

    app.get('/ok', (_req, res) => res.status(200).send('ok'));
    app.get('/bad', (_req, res) => res.status(400).send('bad'));
    app.get('/suspicious', (_req, res) => res.status(200).send('sus'));
    app.post('/body-check', (_req, res) => res.status(200).send('body-ok'));
    return app;
  }

  const baseline = () => getSecurityEvents().length;

  test('logs INVALID_AUTH_FORMAT when Authorization header is not Bearer', async () => {
    const app = makeApp();
    const before = baseline();
    await request(app).get('/ok').set('Authorization', 'Basic xyz').expect(200);
    const events = getSecurityEvents().slice(before);
    expect(events.some(e => e.event === 'INVALID_AUTH_FORMAT')).toBe(true);
  });

  test('logs SUSPICIOUS_PATTERN for suspicious URL or body content', async () => {
    const app = makeApp();
    const before = baseline();
    // URL-based suspicious pattern (.. path traversal, <script> XSS)
    await request(app).get('/suspicious?file=../etc/passwd').expect(200);
    await request(app).get('/suspicious?q=%3Cscript%3Ealert(1)%3C/script%3E').expect(200);
    // Body-based suspicious pattern
    await request(app)
      .post('/body-check')
      .send({ payload: '<script>alert(1)</script>' })
      .expect(200);

    const events = getSecurityEvents().slice(before);
    const suspicious = events.filter(e => e.event === 'SUSPICIOUS_PATTERN');
    expect(suspicious.length).toBeGreaterThanOrEqual(2);
    expect(suspicious.some(e => (e.details?.pattern || '').length > 0)).toBe(true);
  });

  test('logs ERROR_RESPONSE for responses with status >= 400', async () => {
    const app = makeApp();
    const before = baseline();
    await request(app).get('/bad').expect(400);
    const events = getSecurityEvents().slice(before);
    expect(events.some(e => e.event === 'ERROR_RESPONSE' && e.details?.statusCode === 400)).toBe(true);
  });

  test('caps internal ring buffer to latest 1000 events', () => {
    const start = baseline();
    // Push more than 1000 events with unique details to verify oldest drop
    const fakeReq: any = {
      ip: '127.0.0.1',
      method: 'GET',
      path: '/spam',
      headers: {},
      get: () => undefined,
    };

    const count = 1200;
    for (let i = 0; i < count; i++) {
      logSecurityEvent(fakeReq, 'SPAM', { i });
    }

    const events = getSecurityEvents().slice(start).filter(e => e.event === 'SPAM');
    // Should retain at most the latest 1000 SPAM events
    expect(events.length).toBeLessThanOrEqual(1000);
    if (events.length > 0) {
      const indices = events.map(e => e.details?.i).filter((n: any) => typeof n === 'number') as number[];
      expect(Math.min(...indices)).toBeGreaterThanOrEqual(count - 1000);
      expect(Math.max(...indices)).toBe(count - 1);
    }
  });
});

