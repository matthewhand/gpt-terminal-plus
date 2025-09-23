import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

jest.mock('../../src/engines/llmEngine', () => ({
  planCommand: jest.fn()
}));

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('LLM Routes', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /llm/plan', () => {
    const { planCommand } = require('../../src/engines/llmEngine');

    it('should plan command successfully', async () => {
      const mockResult = { plan: 'test plan', steps: [] };
      planCommand.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/llm/plan')
        .set('Authorization', `Bearer ${token}`)
        .send({ input: 'test command' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(planCommand).toHaveBeenCalledWith('test command');
    });

    it('should return 400 for missing input', async () => {
      const response = await request(app)
        .post('/llm/plan')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('input required');
    });

    it('should handle budget exceeded error', async () => {
      const error = new Error('budget exceeded for this month');
      planCommand.mockRejectedValue(error);

      const response = await request(app)
        .post('/llm/plan')
        .set('Authorization', `Bearer ${token}`)
        .send({ input: 'test command' });

      expect(response.status).toBe(429);
      expect(response.body.message).toBe('budget exceeded for this month');
    });

    it('should handle general errors', async () => {
      const error = new Error('LLM service unavailable');
      planCommand.mockRejectedValue(error);

      const response = await request(app)
        .post('/llm/plan')
        .set('Authorization', `Bearer ${token}`)
        .send({ input: 'test command' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('LLM service unavailable');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/llm/plan')
        .send({ input: 'test command' });

      expect(response.status).toBe(401);
    });
  });
});