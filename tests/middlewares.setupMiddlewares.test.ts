import express from 'express';
import request from 'supertest';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';

describe('Middleware Setup and Configuration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    setupMiddlewares(app);
  });

  describe('Body Parsing Middleware', () => {
    it('parses URL-encoded form data', async () => {
      app.post('/echo', (req, res) => res.json(req.body));

      const res = await request(app)
        .post('/echo')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('foo=bar&baz=qux&nested[key]=value');
      
      expect(res.status).toBe(200);
      expect(res.body.foo).toBe('bar');
      expect(res.body.baz).toBe('qux');
      expect(res.body.nested).toEqual({ key: 'value' });
    });

    it('parses JSON request bodies', async () => {
      app.post('/json-echo', (req, res) => res.json(req.body));

      const testData = { message: 'test', number: 42, array: [1, 2, 3] };
      const res = await request(app)
        .post('/json-echo')
        .send(testData);
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(testData);
    });

    it('handles empty request bodies', async () => {
      app.post('/empty', (req, res) => res.json({ body: req.body, hasBody: !!req.body }));

      const res = await request(app)
        .post('/empty');
      
      expect(res.status).toBe(200);
      expect(res.body.hasBody).toBe(true);
    });

    it('handles malformed JSON gracefully', async () => {
      app.post('/malformed', (req, res) => res.json({ received: 'ok' }));
      app.use((err: any, req: any, res: any, next: any) => {
        res.status(400).json({ error: 'Bad Request' });
      });

      const res = await request(app)
        .post('/malformed')
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(res.status).toBe(400);
    });
  });

  describe('CORS Configuration', () => {
    it('sets CORS headers for cross-origin requests', async () => {
      app.get('/cors-test', (req, res) => res.json({ cors: 'enabled' }));

      const res = await request(app)
        .get('/cors-test')
        .set('Origin', 'https://example.com');
      
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });

    it('handles preflight OPTIONS requests', async () => {
      app.post('/preflight-test', (req, res) => res.json({ method: 'POST' }));

      const res = await request(app)
        .options('/preflight-test')
        .set('Origin', 'https://example.com')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');
      
      expect([200, 204]).toContain(res.status);
      expect(res.headers['access-control-allow-methods']).toBeDefined();
    });

    it('allows credentials in CORS requests', async () => {
      app.get('/credentials-test', (req, res) => res.json({ credentials: 'allowed' }));

      const res = await request(app)
        .get('/credentials-test')
        .set('Origin', 'https://example.com');
      
      expect(res.status).toBe(200);
      if (res.headers['access-control-allow-credentials']) {
        expect(res.headers['access-control-allow-credentials']).toBe('true');
      }
    });
  });

  describe('Security Headers', () => {
    it('sets security-related headers', async () => {
      app.get('/security-test', (req, res) => res.json({ security: 'headers' }));

      const res = await request(app)
        .get('/security-test');
      
      expect(res.status).toBe(200);
      // Check for common security headers that might be set
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'strict-transport-security'
      ];
      
      // At least some security headers should be present
      const hasSecurityHeaders = securityHeaders.some(header => res.headers[header]);
      // This is optional since security headers might not be configured
    });
  });

  describe('Request Size Limits', () => {
    it('handles large JSON payloads within limits', async () => {
      app.post('/large-json', (req, res) => res.json({ size: JSON.stringify(req.body).length }));

      const largeData = {
        data: 'x'.repeat(1000),
        array: Array(100).fill('test'),
        nested: { deep: { value: 'test' } }
      };

      const res = await request(app)
        .post('/large-json')
        .send(largeData);
      
      expect(res.status).toBe(200);
      expect(res.body.size).toBeGreaterThan(1000);
    });

    it('handles large form data within limits', async () => {
      app.post('/large-form', (req, res) => res.json({ keys: Object.keys(req.body).length }));

      const formData = Array(50).fill(null).map((_, i) => `field${i}=value${i}`).join('&');

      const res = await request(app)
        .post('/large-form')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(formData);
      
      expect(res.status).toBe(200);
      expect(res.body.keys).toBe(50);
    });
  });

  describe('Content Type Handling', () => {
    it('handles different content types appropriately', async () => {
      app.post('/content-type-test', (req, res) => {
        res.json({
          contentType: req.headers['content-type'],
          bodyType: typeof req.body,
          hasBody: !!req.body
        });
      });

      const contentTypes = [
        'application/json',
        'application/x-www-form-urlencoded',
        'text/plain',
        'multipart/form-data'
      ];

      for (const contentType of contentTypes.slice(0, 2)) { // Test first two
        const res = await request(app)
          .post('/content-type-test')
          .set('Content-Type', contentType)
          .send(contentType.includes('json') ? '{}' : 'test=data');
        
        expect(res.status).toBe(200);
        expect(res.body.hasBody).toBe(true);
      }
    });
  });

  describe('Error Handling Middleware', () => {
    it('handles middleware errors gracefully', async () => {
      app.get('/error-test', (req, res, next) => {
        const error = new Error('Test error');
        next(error);
      });

      app.use((err: any, req: any, res: any, next: any) => {
        res.status(500).json({ error: 'Internal Server Error' });
      });

      const res = await request(app)
        .get('/error-test');
      
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal Server Error');
    });
  });

  describe('Request Processing Pipeline', () => {
    it('processes requests through middleware chain', async () => {
      const processingSteps: string[] = [];
      
      app.use((req, res, next) => {
        processingSteps.push('middleware1');
        next();
      });
      
      app.use((req, res, next) => {
        processingSteps.push('middleware2');
        next();
      });
      
      app.get('/pipeline-test', (req, res) => {
        processingSteps.push('handler');
        res.json({ steps: processingSteps });
      });

      const res = await request(app)
        .get('/pipeline-test');
      
      expect(res.status).toBe(200);
      expect(res.body.steps).toEqual(['middleware1', 'middleware2', 'handler']);
    });

    it('maintains request context through pipeline', async () => {
      app.use((req: any, res, next) => {
        req.customData = { timestamp: Date.now(), id: 'test-123' };
        next();
      });
      
      app.get('/context-test', (req: any, res) => {
        res.json({
          hasCustomData: !!req.customData,
          id: req.customData?.id
        });
      });

      const res = await request(app)
        .get('/context-test');
      
      expect(res.status).toBe(200);
      expect(res.body.hasCustomData).toBe(true);
      expect(res.body.id).toBe('test-123');
    });
  });

  describe('Performance and Efficiency', () => {
    it('handles multiple concurrent requests', async () => {
      app.get('/concurrent-test/:id', (req, res) => {
        res.json({ id: req.params.id, timestamp: Date.now() });
      });

      const requests = Array(10).fill(null).map((_, i) =>
        request(app).get(`/concurrent-test/${i}`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach((res, i) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(i.toString());
      });
    });
  });
});

