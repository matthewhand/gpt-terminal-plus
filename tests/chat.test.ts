import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock LLM providers for consistent testing
jest.mock('../src/llm', () => {
  return {
    chat: jest.fn().mockResolvedValue({
      model: 'llama3.1',
      provider: 'ollama',
      choices: [{ index: 0, message: { role: 'assistant', content: 'Hello from mock LLM' } }]
    }),
    chatStream: jest.fn().mockImplementation(async function* () {
      yield 'Hello';
      yield ' from';
      yield ' mock';
      yield ' stream';
    })
  };
});

describe('Chat Completions API', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  describe('Chat Completions', () => {
    it('returns valid chat completion response', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [
            { role: 'user', content: 'Say hello' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('choices');
      expect(Array.isArray(res.body.choices)).toBe(true);
      expect(res.body.choices[0].message.content).toContain('Hello');
      expect(res.body).toHaveProperty('provider');
      expect(res.body).toHaveProperty('model');
    });

    it('validates message structure', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [
            { role: 'user', content: 'Test message' },
            { role: 'assistant', content: 'Test response' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.choices[0].message).toHaveProperty('role');
      expect(res.body.choices[0].message).toHaveProperty('content');
    });

    it('handles system messages', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.choices[0].message.content).toBeTruthy();
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .send({
          messages: [{ role: 'user', content: 'Test' }]
        });
      expect(res.status).toBe(401);
    });
  });

  describe('Input Validation', () => {
    it('rejects missing messages', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('rejects empty messages array', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [] });

      expect(res.status).toBe(400);
    });

    it('validates message roles', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [{ role: 'invalid', content: 'Test' }]
        });

      expect([400, 422]).toContain(res.status);
    });

    it('validates message content', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [{ role: 'user', content: '' }]
        });

      expect([400, 422]).toContain(res.status);
    });

    it('handles malformed JSON', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(res.status).toBe(400);
    });
  });

  describe('Streaming Support', () => {
    it('handles streaming requests', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Stream test' }]
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/event-stream/);
    });

    it('validates streaming parameters', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          stream: 'invalid',
          messages: [{ role: 'user', content: 'Test' }]
        });

      expect([400, 422]).toContain(res.status);
    });
  });

  describe('Model Selection', () => {
    it('accepts model parameter', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          model: 'gpt-oss:20b',
          messages: [{ role: 'user', content: 'Test' }]
        });

      expect(res.status).toBe(200);
    });

    it('handles unsupported model gracefully', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          model: 'nonexistent-model',
          messages: [{ role: 'user', content: 'Test' }]
        });

      expect([200, 400]).toContain(res.status);
    });
  });

  describe('Response Format', () => {
    it('returns OpenAI-compatible response structure', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [{ role: 'user', content: 'Test' }]
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('choices');
      expect(res.body).toHaveProperty('model');
      expect(res.body).toHaveProperty('provider');
      expect(res.body.choices[0]).toHaveProperty('index');
      expect(res.body.choices[0]).toHaveProperty('message');
    });

    it('includes usage information when available', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [{ role: 'user', content: 'Test' }]
        });

      expect(res.status).toBe(200);
      // Usage may or may not be present depending on provider
      if (res.body.usage) {
        expect(res.body.usage).toHaveProperty('prompt_tokens');
        expect(res.body.usage).toHaveProperty('completion_tokens');
      }
    });
  });

  describe('Error Handling', () => {
    it('handles LLM provider errors', async () => {
      const { chat } = require('../src/llm');
      chat.mockRejectedValueOnce(new Error('Provider unavailable'));

      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          messages: [{ role: 'user', content: 'Test' }]
        });

      expect([500, 503]).toContain(res.status);
    });

    it('handles timeout scenarios', async () => {
      const { chat } = require('../src/llm');
      chat.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 30000)));

      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .timeout(1000)
        .send({
          messages: [{ role: 'user', content: 'Test' }]
        });

      // Request should timeout or be handled gracefully
      expect([200, 408, 500, 503]).toContain(res.status);
    }, 5000);
  });

  describe('Rate Limiting', () => {
    it('handles multiple concurrent requests', async () => {
      const requests = Array(5).fill(null).map(() =>
        request(app)
          .post('/chat/completions')
          .set('Authorization', `Bearer ${token}`)
          .send({
            messages: [{ role: 'user', content: 'Concurrent test' }]
          })
      );

      const responses = await Promise.all(requests);
      responses.forEach(res => {
        expect([200, 429]).toContain(res.status);
      });
    });
  });
});

