import axios from 'axios';
import { executeLlm, executeLlmStream } from '@src/llm/openai';
import { OpenAiChatCompletionRequest, OpenAiChatCompletionResponse } from '@src/types/llm';
import { Readable } from 'stream';
import { Response } from 'express';

jest.mock('axios');

describe('executeLlm', () => {
  it('should call the OpenAI-compatible endpoint and return the response', async () => {
    const request: OpenAiChatCompletionRequest = {
      model: 'test-model',
      messages: [
        {
          role: 'user',
          content: 'Hello, world!',
        },
      ],
    };
    const apiKey = 'test-api-key';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const expectedResponse: OpenAiChatCompletionResponse = {
      id: 'cmpl-xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      object: 'chat.completion',
      created: Date.now(),
      model: request.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello, there!',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: expectedResponse });

    const response = await executeLlm(request, apiKey, endpoint);

    expect(axios.post).toHaveBeenCalledWith(endpoint, request, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    expect(response).toEqual(expectedResponse);
  });
});

describe('executeLlmStream', () => {
  it('should call the OpenAI-compatible endpoint and stream the response', async () => {
    const request: OpenAiChatCompletionRequest = {
      model: 'test-model',
      messages: [
        {
          role: 'user',
          content: 'Hello, world!',
        },
      ],
      stream: true,
    };
    const apiKey = 'test-api-key';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const stream = new Readable();
    const expectedChunk = 'data: {"id":"cmpl-xxxxxxxxxxxxxxxxxxxxxxxxxxxx","object":"chat.completion.chunk","created":1677652288,"model":"test-model","choices":[{"delta":{"role":"assistant"},"index":0,"finish_reason":null}]}\n\n';
    stream.push(expectedChunk);
    stream.push(null);

    (axios.post as jest.Mock).mockResolvedValue({ data: stream });

    const chunks: string[] = [];
    let resolveEnd!: () => void;
    const ended = new Promise<void>((r) => { resolveEnd = r; });

    const res = {
      setHeader: jest.fn(),
      write: jest.fn((chunk: any) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk.toString() : String(chunk));
      }),
      end: jest.fn(() => {
        resolveEnd();
      }),
    } as unknown as Response;

    await executeLlmStream(request, apiKey, endpoint, res);
    await ended;

    expect(axios.post).toHaveBeenCalledWith(endpoint, request, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      responseType: 'stream',
    });

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
    expect(res.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');

    expect(chunks.join('')).toEqual(expectedChunk);
  });
});