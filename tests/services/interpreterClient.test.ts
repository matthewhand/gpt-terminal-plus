import { interpreterChatStream, interpreterChatOnce } from '../../src/services/interpreterClient';
import { llmConfig } from '../../src/common/llmConfig';

// Mock llmConfig with interpreter settings
jest.mock('../../src/common/llmConfig', () => ({
  llmConfig: {
    interpHost: 'localhost',
    interpPort: 8000,
    interpOffline: true,
    interpVerbose: false
  }
}));

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock console.error to avoid noise in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

function sseResponse(chunks: string[], ok = true, status = 200) {
  return {
    ok,
    status,
    body: new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      }
    })
  } as any;
}

describe('interpreterClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset config to defaults so per-test mutations do not leak
    (llmConfig as any).interpHost = 'localhost';
    (llmConfig as any).interpPort = 8000;
    (llmConfig as any).interpOffline = true;
    (llmConfig as any).interpVerbose = false;
  });

  describe('interpreterChatStream', () => {
    it('should issue a GET SSE request to the interpreter /chat endpoint', async () => {
      mockFetch.mockResolvedValue(sseResponse([]));

      await interpreterChatStream('hello world');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, opts] = mockFetch.mock.calls[0];
      expect(String(url)).toBe(
        'http://localhost:8000/chat?message=hello+world&offline=true&verbose=false'
      );
      expect(opts).toEqual({
        method: 'GET',
        headers: { Accept: 'text/event-stream' }
      });
    });

    it('should reflect llmConfig host, port and flags in the request URL', async () => {
      (llmConfig as any).interpHost = '10.0.0.5';
      (llmConfig as any).interpPort = 9001;
      (llmConfig as any).interpOffline = false;
      (llmConfig as any).interpVerbose = true;
      mockFetch.mockResolvedValue(sseResponse([]));

      await interpreterChatStream('hi');

      expect(String(mockFetch.mock.calls[0][0])).toBe(
        'http://10.0.0.5:9001/chat?message=hi&offline=false&verbose=true'
      );
    });

    it('should URL-encode special characters in the message', async () => {
      mockFetch.mockResolvedValue(sseResponse([]));

      await interpreterChatStream('a&b=c?');

      const url = new URL(String(mockFetch.mock.calls[0][0]));
      expect(url.searchParams.get('message')).toBe('a&b=c?');
    });

    it('should return the raw fetch response', async () => {
      const res = sseResponse([]);
      mockFetch.mockResolvedValue(res);

      await expect(interpreterChatStream('x')).resolves.toBe(res);
    });

    it('should propagate network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(interpreterChatStream('x')).rejects.toThrow('Network error');
    });
  });

  describe('interpreterChatOnce', () => {
    it('should accumulate data: lines and skip the [DONE] sentinel', async () => {
      mockFetch.mockResolvedValue(sseResponse([
        'data: Hello\n',
        'data: World\n',
        'data: [DONE]\n'
      ]));

      const result = await interpreterChatOnce('greet me');

      expect(result).toBe('HelloWorld');
    });

    it('should handle multiple data lines within a single chunk', async () => {
      mockFetch.mockResolvedValue(sseResponse([
        'data: First\ndata: Second\n\ndata: [DONE]\n'
      ]));

      const result = await interpreterChatOnce('hello');

      expect(result).toBe('FirstSecond');
    });

    it('should ignore non-data SSE lines', async () => {
      mockFetch.mockResolvedValue(sseResponse([
        ': heartbeat comment\n',
        'event: message\n',
        'data: Payload\n'
      ]));

      const result = await interpreterChatOnce('hello');

      expect(result).toBe('Payload');
    });

    it('should return an empty string for an empty stream', async () => {
      mockFetch.mockResolvedValue(sseResponse([]));

      const result = await interpreterChatOnce('hello');

      expect(result).toBe('');
    });

    it('should throw on HTTP error responses', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500, body: null } as any);

      await expect(interpreterChatOnce('hello')).rejects.toThrow('Interpreter error 500');
    });

    it('should throw when the response has no body', async () => {
      mockFetch.mockResolvedValue({ ok: true, status: 200, body: null } as any);

      await expect(interpreterChatOnce('hello')).rejects.toThrow('Interpreter error 200');
    });

    it('should propagate network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(interpreterChatOnce('hello')).rejects.toThrow('Network error');
    });
  });
});
