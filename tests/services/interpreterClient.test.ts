import { streamChatWithInterpreter, chatWithInterpreter } from '../../src/services/interpreterClient';
import { Readable } from 'stream';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock console.error to avoid noise in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('interpreterClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('streamChatWithInterpreter', () => {
    it('should stream chat responses successfully', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"content": "Hello"}\n\n'));
            controller.enqueue(new TextEncoder().encode('data: {"content": " World"}\n\n'));
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      });

      expect(onChunk).toHaveBeenCalledWith({ content: 'Hello' });
      expect(onChunk).toHaveBeenCalledWith({ content: ' World' });
      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(onError).toHaveBeenCalledWith('Network error');
      expect(onChunk).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(onError).toHaveBeenCalledWith('HTTP error! status: 500');
      expect(onChunk).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should handle malformed JSON in stream', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {invalid json}\n\n'));
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(onError).toHaveBeenCalledWith(expect.stringContaining('Failed to parse JSON'));
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should handle empty stream', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.close();
          }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(onComplete).toHaveBeenCalled();
      expect(onChunk).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it('should handle stream reading errors', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.error(new Error('Stream read error'));
          }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(onError).toHaveBeenCalledWith('Stream read error');
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should handle multiple data chunks in single read', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(
              'data: {"content": "First"}\n\ndata: {"content": "Second"}\n\ndata: [DONE]\n\n'
            ));
            controller.close();
          }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(onChunk).toHaveBeenCalledWith({ content: 'First' });
      expect(onChunk).toHaveBeenCalledWith({ content: 'Second' });
      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it('should handle custom base URL with trailing slash', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000/',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/chat/stream', expect.any(Object));
    });
  });

  describe('chatWithInterpreter', () => {
    it('should return chat response successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: { content: 'Hello from interpreter' },
          usage: { tokens: 10 }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const result = await chatWithInterpreter('http://localhost:8000', messages);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      });

      expect(result).toEqual({
        message: { content: 'Hello from interpreter' },
        usage: { tokens: 10 }
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const messages = [{ role: 'user', content: 'Hello' }];
      
      await expect(chatWithInterpreter('http://localhost:8000', messages))
        .rejects.toThrow('Network error');
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      
      await expect(chatWithInterpreter('http://localhost:8000', messages))
        .rejects.toThrow('HTTP error! status: 404');
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      
      await expect(chatWithInterpreter('http://localhost:8000', messages))
        .rejects.toThrow('Invalid JSON');
    });

    it('should handle empty messages array', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ message: { content: 'Empty response' } })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await chatWithInterpreter('http://localhost:8000', []);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [] })
      });

      expect(result).toEqual({ message: { content: 'Empty response' } });
    });

    it('should handle custom base URL with trailing slash', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ message: { content: 'Response' } })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      await chatWithInterpreter('http://localhost:8000/', messages);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/chat', expect.any(Object));
    });

    it('should handle complex message structures', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ message: { content: 'Complex response' } })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const complexMessages = [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' }
      ];

      const result = await chatWithInterpreter('http://localhost:8000', complexMessages);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: complexMessages })
      });

      expect(result).toEqual({ message: { content: 'Complex response' } });
    });
  });

  describe('integration scenarios', () => {
    it('should handle timeout scenarios', async () => {
      // Simulate a timeout by never resolving the fetch promise
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      // Set a short timeout for testing
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 100);
      });

      await expect(Promise.race([
        streamChatWithInterpreter('http://localhost:8000', messages, onChunk, onError, onComplete),
        timeoutPromise
      ])).rejects.toThrow('Timeout');
    });

    it('should handle different content types in responses', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"type": "text", "content": "Hello"}\n\n'));
            controller.enqueue(new TextEncoder().encode('data: {"type": "code", "content": "console.log()"}\n\n'));
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          }
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const messages = [{ role: 'user', content: 'Hello' }];
      const onChunk = jest.fn();
      const onError = jest.fn();
      const onComplete = jest.fn();

      await streamChatWithInterpreter(
        'http://localhost:8000',
        messages,
        onChunk,
        onError,
        onComplete
      );

      expect(onChunk).toHaveBeenCalledWith({ type: 'text', content: 'Hello' });
      expect(onChunk).toHaveBeenCalledWith({ type: 'code', content: 'console.log()' });
      expect(onComplete).toHaveBeenCalled();
    });
  });
});