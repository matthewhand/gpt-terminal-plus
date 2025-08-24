import { ollamaGenerate } from '../../src/services/ollamaClient';
import { llmConfig } from '../../src/common/llmConfig';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock llmConfig
jest.mock('../../src/common/llmConfig', () => ({
  llmConfig: {
    ollamaHost: 'http://localhost:11434',
    model: 'llama2'
  }
}));

// Mock console.error to avoid noise in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ollamaClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ollamaGenerate', () => {
    it('should generate text successfully without streaming', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          response: 'Hello, how are you doing today?'
        })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await ollamaGenerate({
        prompt: 'Hello, how are you?'
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'Hello, how are you?',
          stream: false
        })
      });

      expect(result).toBe('Hello, how are you doing today?');
    });

    it('should generate text successfully with streaming', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"response": "Hello"}\n'));
          controller.enqueue(new TextEncoder().encode('{"response": " World"}\n'));
          controller.enqueue(new TextEncoder().encode('{"done": true}\n'));
          controller.close();
        }
      });

      const mockResponse = {
        ok: true,
        body: mockStream
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await ollamaGenerate({
        prompt: 'Hello, how are you?',
        stream: true
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'Hello, how are you?',
          stream: true
        })
      });

      expect(result).toBe(mockStream);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(ollamaGenerate({
        prompt: 'Hello'
      })).rejects.toThrow('Network error');
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Model not found')
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(ollamaGenerate({
        prompt: 'Hello'
      })).rejects.toThrow('Ollama error 404: Model not found');
    });

    it('should handle JSON parsing errors in non-streaming response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(ollamaGenerate({
        prompt: 'Hello'
      })).rejects.toThrow('Invalid JSON');
    });

    it('should return empty string when response field is missing', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await ollamaGenerate({
        prompt: 'Hello'
      });

      expect(result).toBe('');
    });

    it('should handle empty response field', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: '' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await ollamaGenerate({
        prompt: 'Hello'
      });

      expect(result).toBe('');
    });

    it('should handle null response field', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: null })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await ollamaGenerate({
        prompt: 'Hello'
      });

      expect(result).toBe('');
    });

    it('should handle undefined response field', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: undefined })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await ollamaGenerate({
        prompt: 'Hello'
      });

      expect(result).toBe('');
    });

    it('should handle empty prompt', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'Empty prompt response' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await ollamaGenerate({
        prompt: ''
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: '',
          stream: false
        })
      });

      expect(result).toBe('Empty prompt response');
    });

    it('should handle very long prompts', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'Long prompt response' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const longPrompt = 'A'.repeat(10000);
      const result = await ollamaGenerate({
        prompt: longPrompt
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: longPrompt,
          stream: false
        })
      });

      expect(result).toBe('Long prompt response');
    });

    it('should handle special characters in prompt', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'Special chars response' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const specialPrompt = 'Hello! 🚀 How are you? \n\t"Special\" chars';
      const result = await ollamaGenerate({
        prompt: specialPrompt
      });

      expect(result).toBe('Special chars response');
    });

    it('should remove trailing slashes from ollamaHost', async () => {
      // Mock llmConfig with trailing slash
      (llmConfig as any).ollamaHost = 'http://localhost:11434/';
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'Response' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await ollamaGenerate({
        prompt: 'Hello'
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', expect.any(Object));
    });

    it('should use correct model from config', async () => {
      // Mock different model
      (llmConfig as any).model = 'codellama';
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'Response' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await ollamaGenerate({
        prompt: 'Hello'
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'codellama',
          prompt: 'Hello',
          stream: false
        })
      });
    });

    it('should default stream to false when not specified', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'Response' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await ollamaGenerate({
        prompt: 'Hello'
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'Hello',
          stream: false
        })
      });
    });
  });
});