import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

jest.mock('../../src/llm', () => ({
  chat: jest.fn(),
  chatStream: jest.fn()
}));

jest.mock('../../src/llm/llmClient', () => ({
  isLlmEnabled: jest.fn(),
  getLlmClient: jest.fn()
}));

jest.mock('../../src/common/models', () => ({
  getSupportedModels: jest.fn()
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

describe('Chat Routes', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /chat/completions', () => {
    const { chat, chatStream } = require('../../src/llm');
    const { isLlmEnabled } = require('../../src/llm/llmClient');

    it('should return 409 when LLM is disabled', async () => {
      isLlmEnabled.mockReturnValue(false);
      process.env.NODE_ENV = 'development';

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('LLM_DISABLED');
    });

    it('should return 400 for missing messages', async () => {
      isLlmEnabled.mockReturnValue(true);

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('messages');
    });

    it('should return 400 for invalid messages array', async () => {
      isLlmEnabled.mockReturnValue(true);

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: 'not an array' });

      expect(response.status).toBe(400);
    });

    it('should return 422 for invalid message content', async () => {
      isLlmEnabled.mockReturnValue(true);

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: '' }] });

      expect(response.status).toBe(422);
      expect(response.body.message).toContain('content');
    });

    it('should return 422 for invalid message role', async () => {
      isLlmEnabled.mockReturnValue(true);

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'invalid', content: 'test' }] });

      expect(response.status).toBe(422);
      expect(response.body.message).toContain('role');
    });

    it('should return 400 for invalid stream parameter', async () => {
      isLlmEnabled.mockReturnValue(true);

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'test' }], stream: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('stream parameter');
    });

    it('should handle non-streaming chat successfully', async () => {
      isLlmEnabled.mockReturnValue(true);
      chat.mockResolvedValue({ choices: [{ message: { content: 'Response' } }] });

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(response.status).toBe(200);
      expect(chat).toHaveBeenCalledWith({
        model: expect.any(String),
        messages: [{ role: 'user', content: 'Hello' }],
        stream: false
      });
    });

    it('should handle streaming chat with Accept header', async () => {
      isLlmEnabled.mockReturnValue(true);
      const mockStream = {
        async *[Symbol.asyncIterator]() {
          yield 'chunk1';
          yield 'chunk2';
        }
      };
      chatStream.mockReturnValue(mockStream);

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/event-stream');
    });

    it('should handle streaming chat with stream=true', async () => {
      isLlmEnabled.mockReturnValue(true);
      const mockStream = {
        async *[Symbol.asyncIterator]() {
          yield 'chunk1';
        }
      };
      chatStream.mockReturnValue(mockStream);

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'Hello' }], stream: true });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/event-stream');
    });

    it('should handle chat errors', async () => {
      isLlmEnabled.mockReturnValue(true);
      chat.mockRejectedValue(new Error('LLM Error'));

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(response.status).toBe(500);
      expect(response.body.message).toContain('Chat error');
    });

    it('should handle timeout in test mode', async () => {
      isLlmEnabled.mockReturnValue(true);
      process.env.NODE_ENV = 'test';
      process.env.LLM_CHAT_TIMEOUT_MS = '1';
      chat.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10)));

      const response = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(response.status).toBe(503);
      expect(response.body.message).toBe('LLM provider timeout');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/chat/completions')
        .send({ messages: [{ role: 'user', content: 'Hello' }] });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /chat/models', () => {
    const { getSupportedModels } = require('../../src/common/models');
    const { getLlmClient } = require('../../src/llm/llmClient');

    it('should return models and mappings', async () => {
      getSupportedModels.mockReturnValue(['gpt-4', 'claude-3']);
      getLlmClient.mockReturnValue({ provider: 'openai', baseUrl: 'https://api.openai.com' });

      const response = await request(app)
        .get('/chat/models')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.supported).toEqual(['gpt-4', 'claude-3']);
      expect(response.body.provider).toBe('openai');
    });

    it('should handle errors', async () => {
      getSupportedModels.mockImplementation(() => { throw new Error('Models error'); });

      const response = await request(app)
        .get('/chat/models')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toContain('Failed to load model maps');
    });
  });

  describe('GET /chat/providers', () => {
    const { getLlmClient } = require('../../src/llm/llmClient');

    it('should return provider information', async () => {
      getLlmClient.mockReturnValue({
        provider: 'ollama',
        baseUrl: 'http://localhost:11434'
      });

      const response = await request(app)
        .get('/chat/providers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.provider.provider).toBe('ollama');
      expect(response.body.endpoints.ollama).toBe('http://localhost:11434');
    });

    it('should handle null client', async () => {
      getLlmClient.mockReturnValue(null);

      const response = await request(app)
        .get('/chat/providers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.provider.provider).toBe('openai');
    });
  });
});