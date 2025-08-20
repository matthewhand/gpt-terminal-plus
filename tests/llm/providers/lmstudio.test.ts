import { 
  chatWithLmStudio, 
  chatWithLmStudioStream, 
  createLmStudioClient, 
  toOpenAIChatMessages,
  LmStudioConfig 
} from '../../../src/llm/providers/lmstudio';
import { ChatRequest, ChatMessage } from '../../../src/llm/types';

// Mock the global fetch if it exists
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

// Mock http and https modules
jest.mock('http');
jest.mock('https');
import http from 'http';
import https from 'https';

const mockHttp = http as jest.Mocked<typeof http>;
const mockHttps = https as jest.Mocked<typeof https>;

describe('LM Studio Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('toOpenAIChatMessages', () => {
    it('should convert chat messages to OpenAI format', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' }
      ];

      const result = toOpenAIChatMessages(messages);

      expect(result).toEqual([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' }
      ]);
    });

    it('should handle empty messages array', () => {
      const messages: ChatMessage[] = [];
      const result = toOpenAIChatMessages(messages);
      expect(result).toEqual([]);
    });

    it('should preserve message structure', () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' }
      ];

      const result = toOpenAIChatMessages(messages);

      expect(result).toEqual([
        { role: 'system', content: 'You are a helpful assistant.' }
      ]);
    });
  });

  describe('chatWithLmStudio', () => {
    const mockConfig: LmStudioConfig = {
      baseUrl: 'http://localhost:1234',
      apiKey: 'test-key'
    };

    const mockRequest: ChatRequest = {
      model: 'test-model',
      messages: [
        { role: 'user', content: 'Hello' }
      ]
    };

    it('should make successful chat request with fetch', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              role: 'assistant',
              content: 'Hello! How can I help you?'
            }
          }]
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await chatWithLmStudio(mockConfig, mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:1234/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-key'
          },
          body: JSON.stringify({
            model: 'test-model',
            messages: [{ role: 'user', content: 'Hello' }],
            stream: false
          })
        }
      );

      expect(result).toEqual({
        model: 'test-model',
        provider: 'lmstudio',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you?'
          }
        }]
      });
    });

    it('should handle model mapping', async () => {
      const configWithMapping: LmStudioConfig = {
        baseUrl: 'http://localhost:1234',
        modelMap: {
          'gpt-4': 'local-model-v1'
        }
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: { role: 'assistant', content: 'Response' }
          }]
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      await chatWithLmStudio(configWithMapping, {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Test' }]
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"model":"local-model-v1"')
        })
      );
    });

    it('should handle request without API key', async () => {
      const configNoKey: LmStudioConfig = {
        baseUrl: 'http://localhost:1234'
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: { role: 'assistant', content: 'Response' }
          }]
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      await chatWithLmStudio(configNoKey, mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
            // No Authorization header
          }
        })
      );
    });

    it('should handle API error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue('Internal Server Error'),
        json: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(chatWithLmStudio(mockConfig, mockRequest))
        .rejects.toThrow('LM Studio error 500: Internal Server Error');
    });

    it('should handle malformed response data', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          // Missing choices array
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await chatWithLmStudio(mockConfig, mockRequest);

      expect(result).toEqual({
        model: 'test-model',
        provider: 'lmstudio',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: ''
          }
        }]
      });
    });

    it('should handle response with missing message content', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              role: 'assistant'
              // Missing content
            }
          }]
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await chatWithLmStudio(mockConfig, mockRequest);

      expect(result.choices[0].message.content).toBe('');
    });
  });

  describe('chatWithLmStudioStream', () => {
    const mockConfig: LmStudioConfig = {
      baseUrl: 'http://localhost:1234',
      apiKey: 'test-key'
    };

    const mockRequest: ChatRequest = {
      model: 'test-model',
      messages: [{ role: 'user', content: 'Hello' }]
    };

    it('should handle streaming response with fetch', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('data: {"choices":[{"delta":{"content":" there!"}}]}\n\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('data: [DONE]\n\n'))
          })
          .mockResolvedValueOnce({ done: true })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithLmStudioStream(mockConfig, mockRequest);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['Hello', ' there!']);
    });

    it('should handle streaming with model mapping', async () => {
      const configWithMapping: LmStudioConfig = {
        baseUrl: 'http://localhost:1234',
        modelMap: {
          'gpt-4': 'local-streaming-model'
        }
      };

      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ done: true })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithLmStudioStream(configWithMapping, {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Test' }]
      });

      // Consume generator
      const chunks: string[] = [];
      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"model":"local-streaming-model"')
        })
      );
    });

    it('should handle malformed JSON in stream', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('data: {invalid json}\n\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('data: {"choices":[{"delta":{"content":"valid"}}]}\n\n'))
          })
          .mockResolvedValueOnce({ done: true })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithLmStudioStream(mockConfig, mockRequest);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      // Should only get the valid chunk, invalid JSON is ignored
      expect(chunks).toEqual(['valid']);
    });

    it('should handle empty delta content', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('data: {"choices":[{"delta":{}}]}\n\n'))
          })
          .mockResolvedValueOnce({ done: true })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithLmStudioStream(mockConfig, mockRequest);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([]);
    });
  });

  describe('createLmStudioClient', () => {
    it('should create client with chat and chatStream methods', () => {
      const client = createLmStudioClient('http://localhost:1234');

      expect(client).toHaveProperty('chat');
      expect(client).toHaveProperty('chatStream');
      expect(typeof client.chat).toBe('function');
      expect(typeof client.chatStream).toBe('function');
    });

    it('should create client that calls underlying functions', async () => {
      // Mock fetch for this test
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          choices: [{
            message: { role: 'assistant', content: 'Response' }
          }]
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = createLmStudioClient('http://localhost:1234');
      const result = await client.chat({
        model: 'test',
        messages: [{ role: 'user', content: 'Hello' }]
      });

      expect(result.provider).toBe('lmstudio');
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('fetchCompat fallback', () => {
    beforeEach(() => {
      // Remove global fetch to test fallback
      delete (global as any).fetch;
    });

    afterEach(() => {
      // Restore fetch
      (global as any).fetch = mockFetch;
    });

    it('should use http module for http URLs', async () => {
      const mockRequest = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };

      const mockResponse = {
        statusCode: 200,
        on: jest.fn()
      };

      // Mock the request callback to be called immediately
      mockHttp.request.mockImplementation((url, options, callback) => {
        if (callback) {
          setTimeout(() => {
            callback(mockResponse as any);
            // Simulate data and end events
            const dataHandler = mockResponse.on.mock.calls.find(call => call[0] === 'data')?.[1];
            const endHandler = mockResponse.on.mock.calls.find(call => call[0] === 'end')?.[1];
            
            if (dataHandler) dataHandler(Buffer.from('{"test": "response"}'));
            if (endHandler) endHandler();
          }, 0);
        }
        return mockRequest as any;
      });

      const config: LmStudioConfig = { baseUrl: 'http://localhost:1234' };
      const request: ChatRequest = {
        model: 'test',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      // This should use the http fallback
      const result = await chatWithLmStudio(config, request);

      expect(mockHttp.request).toHaveBeenCalled();
      expect(result.provider).toBe('lmstudio');
    });

    it('should use https module for https URLs', async () => {
      const mockRequest = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };

      const mockResponse = {
        statusCode: 200,
        on: jest.fn()
      };

      mockHttps.request.mockImplementation((url, options, callback) => {
        if (callback) {
          setTimeout(() => {
            callback(mockResponse as any);
            const dataHandler = mockResponse.on.mock.calls.find(call => call[0] === 'data')?.[1];
            const endHandler = mockResponse.on.mock.calls.find(call => call[0] === 'end')?.[1];
            
            if (dataHandler) dataHandler(Buffer.from('{"test": "response"}'));
            if (endHandler) endHandler();
          }, 0);
        }
        return mockRequest as any;
      });

      const config: LmStudioConfig = { baseUrl: 'https://localhost:1234' };
      const request: ChatRequest = {
        model: 'test',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const result = await chatWithLmStudio(config, request);

      expect(mockHttps.request).toHaveBeenCalled();
      expect(result.provider).toBe('lmstudio');
    });

    it('should handle request errors in fallback', async () => {
      const mockRequest = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };

      mockHttp.request.mockImplementation(() => {
        setTimeout(() => {
          const errorHandler = mockRequest.on.mock.calls.find(call => call[0] === 'error')?.[1];
          if (errorHandler) errorHandler(new Error('Network error'));
        }, 0);
        return mockRequest as any;
      });

      const config: LmStudioConfig = { baseUrl: 'http://localhost:1234' };
      const request: ChatRequest = {
        model: 'test',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      await expect(chatWithLmStudio(config, request))
        .rejects.toThrow('Network error');
    });
  });

  describe('streamCompat fallback', () => {
    beforeEach(() => {
      delete (global as any).fetch;
    });

    afterEach(() => {
      (global as any).fetch = mockFetch;
    });

    it('should handle streaming with http fallback', async () => {
      const mockRequest = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };

      const mockResponse = {
        statusCode: 200,
        on: jest.fn(),
        [Symbol.asyncIterator]: async function* () {
          yield Buffer.from('data: {"choices":[{"delta":{"content":"test"}}]}\n\n');
        }
      };

      mockHttp.request.mockImplementation((url, options, callback) => {
        if (callback) {
          setTimeout(() => callback(mockResponse as any), 0);
        }
        return mockRequest as any;
      });

      const config: LmStudioConfig = { baseUrl: 'http://localhost:1234' };
      const request: ChatRequest = {
        model: 'test',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const generator = chatWithLmStudioStream(config, request);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['test']);
    });
  });
});
