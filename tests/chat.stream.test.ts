import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chatStream with various streaming scenarios
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatStream: jest.fn().mockImplementation(async function* (request) {
      const messages = Array.isArray(request)
        ? request
        : Array.isArray(request?.messages)
          ? request.messages
          : [];
      const content = messages[messages.length - 1]?.content || '';
      
      if (content.includes('long response')) {
        for (let i = 0; i < 10; i++) {
          yield `Chunk ${i + 1} `;
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      } else if (content.includes('json response')) {
        yield '{"type": "response", ';
        yield '"content": "structured data", ';
        yield '"complete": true}';
      } else {
        yield 'Hello';
        yield ' streaming';
        yield ' world!';
      }
    })
  };
});

describe('Chat Streaming API', () => {
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

  describe('SSE Stream Functionality', () => {
    it('streams chat completion chunks', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Say hello' }]
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/event-stream/);
      expect(res.headers['cache-control']).toBe('no-cache');
      expect(res.headers['connection']).toBe('keep-alive');
      expect(res.text).toContain('data:');
      expect(res.text).toContain('Hello');
      expect(res.text).toContain('[DONE]');
    });

    it('handles long streaming responses', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Give me a long response' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('Chunk 1');
      expect(res.text).toContain('Chunk 10');
      expect(res.text).toContain('[DONE]');
    });

    it('streams structured JSON responses', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Give me a json response' }]
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('"type": "response"');
      expect(res.text).toContain('"complete": true');
    });

    it('includes proper SSE event formatting', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Test formatting' }]
        });

      expect(res.status).toBe(200);
      // Check for proper SSE format: data: followed by content
      expect(res.text).toMatch(/data: .+\n\n/g);
      expect(res.text).toContain('event: ');
    });
  });

  describe('Stream Authentication', () => {
    it('requires authentication for streaming', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Test' }]
        });
      expect(res.status).toBe(401);
    });

    it('validates auth token for streaming', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', 'Bearer invalid-token')
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Test' }]
        });
      expect(res.status).toBe(401);
    });
  });

  describe('Stream Parameters', () => {
    it('validates stream parameter', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: 'invalid',
          messages: [{ role: 'user', content: 'Test' }]
        });
      expect([400, 422]).toContain(res.status);
    });

    it('handles missing stream parameter with SSE accept header', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          messages: [{ role: 'user', content: 'Test' }]
        });
      // Should either auto-enable streaming or return normal response
      expect([200, 400, 500]).toContain(res.status);
    });
  });

  describe('Stream Content Validation', () => {
    it('validates messages for streaming', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: []
        });
      expect(res.status).toBe(400);
    });

    it('handles malformed messages in streaming', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'invalid', content: 'Test' }]
        });
      expect([400, 422]).toContain(res.status);
    });
  });

  describe('Connection Management', () => {
    it('handles client disconnection gracefully', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .timeout(100) // Short timeout to simulate disconnect
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Give me a long response' }]
        });
      
      // Should handle timeout gracefully
      expect([200, 408]).toContain(res.status);
    }, 5000);

    it('sets appropriate connection headers', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Test headers' }]
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/event-stream/);
      expect(res.headers['cache-control']).toBe('no-cache');
      expect(res.headers['connection']).toBe('keep-alive');
    });
  });

  describe('Stream Performance', () => {
    it('handles multiple concurrent streams', async () => {
      const requests = Array(3).fill(null).map(() =>
        request(app)
          .post('/chat/completions')
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'text/event-stream')
          .send({
            stream: true,
            messages: [{ role: 'user', content: 'Concurrent test' }]
          })
      );

      const responses = await Promise.all(requests);
      responses.forEach(res => {
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/event-stream/);
      });
    });

    it('completes streaming within reasonable time', async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Quick response' }]
        });

      const duration = Date.now() - startTime;
      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Stream Format Compliance', () => {
    it('follows OpenAI streaming format', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/event-stream')
        .send({
          stream: true,
          messages: [{ role: 'user', content: 'Format test' }]
        });

      expect(res.status).toBe(200);
      // Should contain proper SSE format and OpenAI-compatible structure
      expect(res.text).toMatch(/data: .*\n\n/g);
      expect(res.text).toContain('[DONE]');
    });
  });
});
