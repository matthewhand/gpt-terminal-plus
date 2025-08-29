import request from 'supertest';
import express from 'express';
import commandExecutors from '../src/routes/command/executors';

jest.mock('../src/middlewares/checkAuthToken', () => ({
  checkAuthToken: (_req: any, _res: any, next: any) => next(),
}));

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/command', commandExecutors);
  return app;
}

describe('Executor Capabilities Management', () => {
  let app: express.Application;

  beforeEach(() => {
    app = makeApp();
  });

  describe('Executor Listing', () => {
    it('lists default executors with enabled flags', async () => {
      const res = await request(app).get('/command/executors').expect(200);
      const names = res.body.executors.map((e: any) => e.name);
      const byName: any = Object.fromEntries(res.body.executors.map((e: any) => [e.name, e]));
      
      expect(names).toEqual(expect.arrayContaining(['bash','python','zsh','typescript']));
      expect(byName['bash'].enabled).toBe(true);
      expect(byName['python'].enabled).toBe(true);
      expect(byName['zsh'].enabled).toBe(false);
      expect(byName['typescript'].enabled).toBe(false);
    });

    it('includes executor metadata', async () => {
      const res = await request(app).get('/command/executors').expect(200);
      const executor = res.body.executors[0];
      
      expect(executor).toHaveProperty('name');
      expect(executor).toHaveProperty('enabled');
      expect(executor).toHaveProperty('command');
      expect(typeof executor.name).toBe('string');
      expect(typeof executor.enabled).toBe('boolean');
    });

    it('validates executor structure', async () => {
      const res = await request(app).get('/command/executors').expect(200);
      
      expect(res.body).toHaveProperty('executors');
      expect(Array.isArray(res.body.executors)).toBe(true);
      expect(res.body.executors.length).toBeGreaterThan(0);
    });
  });

  describe('Executor Toggle Operations', () => {
    it('enables disabled executor', async () => {
      await request(app)
        .post('/command/executors/zsh/toggle')
        .send({ enabled: true })
        .expect(200);
      
      const res = await request(app).get('/command/executors').expect(200);
      const zsh = res.body.executors.find((e: any) => e.name === 'zsh');
      expect(zsh.enabled).toBe(true);
    });

    it('disables enabled executor', async () => {
      await request(app)
        .post('/command/executors/python/toggle')
        .send({ enabled: false })
        .expect(200);
      
      const res = await request(app).get('/command/executors').expect(200);
      const python = res.body.executors.find((e: any) => e.name === 'python');
      expect(python.enabled).toBe(false);
    });

    it('toggles executor state multiple times', async () => {
      // Enable zsh
      await request(app)
        .post('/command/executors/zsh/toggle')
        .send({ enabled: true })
        .expect(200);
      
      let res = await request(app).get('/command/executors').expect(200);
      let zsh = res.body.executors.find((e: any) => e.name === 'zsh');
      expect(zsh.enabled).toBe(true);

      // Disable zsh
      await request(app)
        .post('/command/executors/zsh/toggle')
        .send({ enabled: false })
        .expect(200);
      
      res = await request(app).get('/command/executors').expect(200);
      zsh = res.body.executors.find((e: any) => e.name === 'zsh');
      expect(zsh.enabled).toBe(false);
    });

    it('maintains state consistency', async () => {
      // Enable typescript
      await request(app)
        .post('/command/executors/typescript/toggle')
        .send({ enabled: true })
        .expect(200);
      
      // Verify other executors unchanged
      const res = await request(app).get('/command/executors').expect(200);
      const bash = res.body.executors.find((e: any) => e.name === 'bash');
      const python = res.body.executors.find((e: any) => e.name === 'python');
      
      expect(bash.enabled).toBe(true); // Should remain enabled
      expect(python.enabled).toBe(true); // Should remain enabled
    });
  });

  describe('Error Handling', () => {
    it('handles non-existent executor toggle', async () => {
      const res = await request(app)
        .post('/command/executors/nonexistent/toggle')
        .send({ enabled: true });
      
      expect([400, 404]).toContain(res.status);
    });

    it('validates toggle request payload', async () => {
      const res = await request(app)
        .post('/command/executors/bash/toggle')
        .send({});
      
      expect([400, 422]).toContain(res.status);
    });

    it('handles malformed JSON in toggle request', async () => {
      const res = await request(app)
        .post('/command/executors/bash/toggle')
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(res.status).toBe(400);
    });

    it('validates boolean enabled field', async () => {
      const res = await request(app)
        .post('/command/executors/bash/toggle')
        .send({ enabled: 'not-a-boolean' });
      
      expect([400, 422]).toContain(res.status);
    });
  });

  describe('Executor Configuration', () => {
    it('preserves executor command paths', async () => {
      const res = await request(app).get('/command/executors').expect(200);
      const bash = res.body.executors.find((e: any) => e.name === 'bash');
      
      expect(bash.command).toBeTruthy();
      expect(typeof bash.command).toBe('string');
    });

    it('includes executor availability status', async () => {
      const res = await request(app).get('/command/executors').expect(200);
      
      res.body.executors.forEach((executor: any) => {
        expect(executor).toHaveProperty('name');
        expect(executor).toHaveProperty('enabled');
        // May have additional fields like 'available', 'version', etc.
      });
    });
  });

  describe('Executor State Persistence', () => {
    it('maintains executor state across requests', async () => {
      // Enable zsh
      await request(app)
        .post('/command/executors/zsh/toggle')
        .send({ enabled: true })
        .expect(200);
      
      // Check state persists
      const res1 = await request(app).get('/command/executors').expect(200);
      const zsh1 = res1.body.executors.find((e: any) => e.name === 'zsh');
      expect(zsh1.enabled).toBe(true);
      
      // Check again
      const res2 = await request(app).get('/command/executors').expect(200);
      const zsh2 = res2.body.executors.find((e: any) => e.name === 'zsh');
      expect(zsh2.enabled).toBe(true);
    });
  });

  describe('API Response Format', () => {
    it('returns consistent response structure', async () => {
      const res = await request(app).get('/command/executors').expect(200);
      
      expect(res.body).toHaveProperty('executors');
      expect(Array.isArray(res.body.executors)).toBe(true);
      
      if (res.body.executors.length > 0) {
        const executor = res.body.executors[0];
        expect(executor).toHaveProperty('name');
        expect(executor).toHaveProperty('enabled');
      }
    });

    it('returns proper HTTP status codes', async () => {
      // Successful operations
      await request(app).get('/command/executors').expect(200);
      
      await request(app)
        .post('/command/executors/bash/toggle')
        .send({ enabled: true })
        .expect(200);
    });
  });

  describe('Concurrent Operations', () => {
    it('handles concurrent toggle requests', async () => {
      const requests = [
        request(app).post('/command/executors/zsh/toggle').send({ enabled: true }),
        request(app).post('/command/executors/typescript/toggle').send({ enabled: true }),
        request(app).get('/command/executors')
      ];
      
      const responses = await Promise.all(requests);
      responses.forEach(res => {
        expect(res.status).toBe(200);
      });
    });
  });
});

