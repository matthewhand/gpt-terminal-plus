import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chatStream with various error scenarios
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatStream: jest.fn().mockImplementation(async function* (messages) {
      const content = messages[messages.length - 1]?.content || '';
      
      if (content.includes('immediate error')) {
        throw new Error('Immediate stream failure');
      } else if (content.includes('partial error')) {
        yield 'Partial';
        yield ' response';
        throw new Error('Mid-stream failure');
      } else if (content.includes('timeout error')) {
        yield 'Starting...';
        await new Promise(resolve => setTimeout(resolve, 100));
        throw new Error('Stream timeout');
      } else if (content.includes('network error')) {
        throw new Error('Network connection failed');
      } else {
        throw new Error('Generic stream failure');
      }
    })
  };
});

describe('Chat Streaming Error Handling', () => {
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

  describe('Stream Error Events', () => {
    it('sends error event for immediate failures', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'immediate error' }]
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/event-stream/);
      expect(res.text).toContain('event: error');
      expect(res.text).toContain('[DONE]');
    });

    it('handles mid-stream failures gracefully', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'partial error' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('Partial');
      expect(res.text).toContain('response');
      expect(res.text).toContain('event: error');
      expect(res.text).toContain('[DONE]');
    });

    it('handles timeout errors', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'timeout error' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('Starting...');
      expect(res.text).toContain('event: error');
      expect(res.text).toContain('timeout');
    });

    it('handles network connection errors', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'network error' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('event: error');
      expect(res.text).toContain('Network connection failed');
    });
  });

  describe('Error Message Format', () => {
    it('formats error messages properly in SSE', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Trigger error' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toMatch(/event: error\ndata: .*\n\n/g);
      expect(res.text).toContain('Generic stream failure');
    });

    it('includes error details in structured format', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'detailed error' }]
        });

      expect(res.status).toBe(200);
      // Error should be in JSON format within the SSE data
      expect(res.text).toMatch(/data: \{.*"error".*\}/g);
    });
  });

  describe('Connection Cleanup', () => {
    it('properly closes connection after error', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'cleanup test' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('[DONE]');
      // Connection should be properly terminated
    });

    it('maintains proper SSE headers during errors', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'header test' }]
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/event-stream/);
      expect(res.headers['cache-control']).toBe('no-cache');
      expect(res.headers['connection']).toBe('keep-alive');
    });
  });

  describe('Error Recovery', () => {
    it('allows new requests after stream errors', async () => {
      // First request that fails
      const errorRes = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'first error' }]
        });

      expect(errorRes.status).toBe(200);
      expect(errorRes.text).toContain('event: error');

      // Second request should still work
      const { chatStream } = require('../src/llm');
      chatStream.mockImplementationOnce(async function* () {
        yield 'Recovery';
        yield ' successful';
      });

      const recoveryRes = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'recovery test' }]
        });

      expect(recoveryRes.status).toBe(200);
      expect(recoveryRes.text).toContain('Recovery');
      expect(recoveryRes.text).toContain('successful');
    });
  });

  describe('Error Types and Codes', () => {
    it('handles different error types appropriately', async () => {
      const errorTypes = [
        { content: 'auth error', expectedError: 'Authentication' },
        { content: 'rate limit error', expectedError: 'Rate limit' },
        { content: 'quota error', expectedError: 'Quota' },
        { content: 'model error', expectedError: 'Model' }
      ];

      for (const { content, expectedError } of errorTypes.slice(0, 2)) { // Test first two
        const { chatStream } = require('../src/llm');
        chatStream.mockImplementationOnce(async function* () {
          throw new Error(`${expectedError} failed`);
        });

        const res = await request(app)
          .post('/chat/completions')
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'text/event-stream')
          .send({
            stream: true,
            messages: [{ role: 'user', content }]
          });

        expect(res.status).toBe(200);
        expect(res.text).toContain('event: error');
        expect(res.text).toContain(expectedError);
      }
    });
  });

  describe('Concurrent Error Handling', () => {
    it('handles multiple concurrent failing streams', async () => {
      const requests = Array(3).fill(null).map((_, i) =>
        request(app)
          .post('/chat/completions')
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'text/event-stream')
          .send({
            stream: true,
            messages: [{ role: 'user', content: `concurrent error ${i}` }]
          })
      );

      const responses = await Promise.all(requests);
      responses.forEach(res => {
        expect(res.status).toBe(200);
        expect(res.text).toContain('event: error');
        expect(res.text).toContain('[DONE]');
      });
    });
  });

  describe('Error Logging and Monitoring', () => {
    it('provides sufficient error information for debugging', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'debug error' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('event: error');
      // Error should contain enough information for debugging
      expect(res.text.length).toBeGreaterThan(50);
    });
  });
});

