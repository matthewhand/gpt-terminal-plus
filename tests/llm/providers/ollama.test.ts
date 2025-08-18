import { 
  chatWithOllama, 
  chatWithOllamaStream, 
  createOllamaClient, 
  toOllamaMessages,
  OllamaConfig 
} from '../../../src/llm/providers/ollama';
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

describe('Ollama Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('toOllamaMessages', () => {
    it('should convert chat messages to Ollama format', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' }
      ];

      const result = toOllamaMessages(messages);

      expect(result).toEqual([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' }
      ]);
    });

    it('should handle empty messages array', () => {
      const messages: ChatMessage[] = [];
      const result = toOllamaMessages(messages);
      expect(result).toEqual([]);
    });

    it('should preserve system messages', () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' }
      ];

      const result = toOllamaMessages(messages);

      expect(result).toEqual([
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' }
      ]);
    });
  });

  describe('chatWithOllama', () => {
    const mockConfig: OllamaConfig = {
      baseUrl: 'http://localhost:11434'
    };

    const mockRequest: ChatRequest = {
      model: 'llama2',
      messages: [
        { role: 'user', content: 'Hello' }
      ]
    };

    it('should make successful chat request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          model: 'llama2',
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you today?'
          },
          done: true
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await chatWithOllama(mockConfig, mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama2',
            messages: [{ role: 'user', content: 'Hello' }],
            stream: false
          })
        }
      );

      expect(result).toEqual({
        model: 'llama2',
        provider: 'ollama',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you today?'
          }
        }]
      });
    });

    it('should handle model mapping', async () => {
      const configWithMapping: OllamaConfig = {
        baseUrl: 'http://localhost:11434',
        modelMap: {
          'gpt-4': 'llama2:13b'
        }
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          message: { role: 'assistant', content: 'Response' }
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      await chatWithOllama(configWithMapping, {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Test' }]
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"model":"llama2:13b"')
        })
      );
    });

    it('should handle API error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Model not found'),
        json: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(chatWithOllama(mockConfig, mockRequest))
        .rejects.toThrow('Ollama error 404: Model not found');
    });

    it('should handle malformed response data', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          // Missing message field
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await chatWithOllama(mockConfig, mockRequest);

      expect(result).toEqual({
        model: 'llama2',
        provider: 'ollama',
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
          message: {
            role: 'assistant'
            // Missing content
          }
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await chatWithOllama(mockConfig, mockRequest);

      expect(result.choices[0].message.content).toBe('');
    });

    it('should handle different base URLs', async () => {
      const customConfig: OllamaConfig = {
        baseUrl: 'https://custom-ollama.example.com:8080'
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          message: { role: 'assistant', content: 'Response' }
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      await chatWithOllama(customConfig, mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom-ollama.example.com:8080/api/chat',
        expect.any(Object)
      );
    });
  });

  describe('chatWithOllamaStream', () => {
    const mockConfig: OllamaConfig = {
      baseUrl: 'http://localhost:11434'
    };

    const mockRequest: ChatRequest = {
      model: 'llama2',
      messages: [{ role: 'user', content: 'Hello' }]
    };

    it('should handle streaming response with fetch', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{"content":"Hello"},"done":false}\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{"content":" there!"},"done":false}\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{"content":""},"done":true}\n'))
          })
          .mockResolvedValueOnce({ done: true })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithOllamaStream(mockConfig, mockRequest);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['Hello', ' there!']);
    });

    it('should handle streaming with model mapping', async () => {
      const configWithMapping: OllamaConfig = {
        baseUrl: 'http://localhost:11434',
        modelMap: {
          'gpt-4': 'llama2:streaming'
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

      const generator = chatWithOllamaStream(configWithMapping, {
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
          body: expect.stringContaining('"model":"llama2:streaming"')
        })
      );
    });

    it('should handle malformed JSON in stream', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{invalid json}\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{"content":"valid"},"done":false}\n'))
          })
          .mockResolvedValueOnce({ done: true })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithOllamaStream(mockConfig, mockRequest);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      // Should only get the valid chunk, invalid JSON is ignored
      expect(chunks).toEqual(['valid']);
    });

    it('should handle empty message content in stream', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{},"done":false}\n'))
          })
          .mockResolvedValueOnce({ done: true })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithOllamaStream(mockConfig, mockRequest);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([]);
    });

    it('should handle done flag in stream', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{"content":"first"},"done":false}\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{"content":""},"done":true}\n'))
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new Uint8Array(Buffer.from('{"message":{"content":"should not appear"},"done":false}\n'))
          })
      };

      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      };

      mockFetch.mockResolvedValue(mockResponse);

      const generator = chatWithOllamaStream(mockConfig, mockRequest);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      // Should stop at done:true
      expect(chunks).toEqual(['first']);
    });
  });

  describe('createOllamaClient', () => {
    it('should create client with chat and chatStream methods', () => {
      const client = createOllamaClient('http://localhost:11434');

      expect(client).toHaveProperty('chat');
      expect(client).toHaveProperty('chatStream');
      expect(typeof client.chat).toBe('function');
      expect(typeof client.chatStream).toBe('function');
    });

    it('should create client that calls underlying functions', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          message: { role: 'assistant', content: 'Response' }
        }),
        text: jest.fn()
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = createOllamaClient('http://localhost:11434');
      const result = await client.chat({
        model: 'llama2',
        messages: [{ role: 'user', content: 'Hello' }]
      });

      expect(result.provider).toBe('ollama');
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

      mockHttp.request.mockImplementation((url, options, callback) => {
        if (callback) {
          setTimeout(() => {
            callback(mockResponse as any);
            const dataHandler = mockResponse.on.mock.calls.find(call => call[0] === 'data')?.[1];
            const endHandler = mockResponse.on.mock.calls.find(call => call[0] === 'end')?.[1];
            
            if (dataHandler) dataHandler(Buffer.from('{"message":{"role":"assistant","content":"test"}}'));
            if (endHandler) endHandler();
          }, 0);
        }
        return mockRequest as any;
      });

      const config: OllamaConfig = { baseUrl: 'http://localhost:11434' };
      const request: ChatRequest = {
        model: 'llama2',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const result = await chatWithOllama(config, request);

      expect(mockHttp.request).toHaveBeenCalled();
      expect(result.provider).toBe('ollama');
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
            
            if (dataHandler) dataHandler(Buffer.from('{"message":{"role":"assistant","content":"test"}}'));
            if (endHandler) endHandler();
          }, 0);
        }
        return mockRequest as any;
      });

      const config: OllamaConfig = { baseUrl: 'https://localhost:11434' };
      const request: ChatRequest = {
        model: 'llama2',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const result = await chatWithOllama(config, request);

      expect(mockHttps.request).toHaveBeenCalled();
      expect(result.provider).toBe('ollama');
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

      const config: OllamaConfig = { baseUrl: 'http://localhost:11434' };
      const request: ChatRequest = {
        model: 'llama2',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      await expect(chatWithOllama(config, request))
        .rejects.toThrow('Network error');
    });

    it('should handle non-200 status codes in fallback', async () => {
      const mockRequest = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };

      const mockResponse = {
        statusCode: 404,
        on: jest.fn()
      };

      mockHttp.request.mockImplementation((url, options, callback) => {
        if (callback) {
          setTimeout(() => {
            callback(mockResponse as any);
            const dataHandler = mockResponse.on.mock.calls.find(call => call[0] === 'data')?.[1];
            const endHandler = mockResponse.on.mock.calls.find(call => call[0] === 'end')?.[1];
            
            if (dataHandler) dataHandler(Buffer.from('Model not found'));
            if (endHandler) endHandler();
          }, 0);
        }
        return mockRequest as any;
      });

      const config: OllamaConfig = { baseUrl: 'http://localhost:11434' };
      const request: ChatRequest = {
        model: 'nonexistent',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      await expect(chatWithOllama(config, request))
        .rejects.toThrow('Ollama error 404: Model not found');
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
          yield Buffer.from('{"message":{"content":"test"},"done":false}\n');
          yield Buffer.from('{"message":{"content":""},"done":true}\n');
        }
      };

      mockHttp.request.mockImplementation((url, options, callback) => {
        if (callback) {
          setTimeout(() => callback(mockResponse as any), 0);
        }
        return mockRequest as any;
      });

      const config: OllamaConfig = { baseUrl: 'http://localhost:11434' };
      const request: ChatRequest = {
        model: 'llama2',
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const generator = chatWithOllamaStream(config, request);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['test']);
    });
  });
});
