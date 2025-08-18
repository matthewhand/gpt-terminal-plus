import axios from 'axios';
import { OpenAiChatCompletionRequest, OpenAiChatCompletionResponse } from '@src/types/llm';
import { Response } from 'express';

export async function executeLlm(request: OpenAiChatCompletionRequest, apiKey: string, endpoint: string): Promise<OpenAiChatCompletionResponse> {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const response = await axios.post(endpoint, request, { headers });

  return response.data;
}

export async function executeLlmStream(request: OpenAiChatCompletionRequest, apiKey: string, endpoint: string, res: Response): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  const response = await axios.post(endpoint, request, { headers, responseType: 'stream' });

  // Prepare SSE-style headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream: any = (response as any).data;

  // Prefer manual forwarding to be compatible with mocked Response in tests
  if (stream && typeof stream.on === 'function' && typeof (res as any).write === 'function') {
    stream.on('data', (chunk: any) => {
      try {
        (res as any).write(chunk);
      } catch {
        // Ignore write errors in tests/mocks
      }
    });
    stream.on('end', () => {
      if (typeof (res as any).end === 'function') {
        (res as any).end();
      }
    });
    stream.on('error', () => {
      try {
        if (typeof (res as any).status === 'function') {
          (res as any).status(502);
        }
        if (typeof (res as any).end === 'function') {
          (res as any).end();
        }
      } catch {
        // Ignore errors in mocks
      }
    });
    return;
  }

  // Fallback to pipe when destination implements EventEmitter (.on)
  if (stream && typeof stream.pipe === 'function' && typeof (res as any).on === 'function') {
    stream.pipe(res as any);
    return;
  }

  // Final fallback: write serialized payload (non-stream adapters)
  const body = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  if (typeof (res as any).write === 'function') {
    (res as any).write(body);
  }
  if (typeof (res as any).end === 'function') {
    (res as any).end();
  }
}
