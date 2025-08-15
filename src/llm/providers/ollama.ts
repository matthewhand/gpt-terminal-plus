import Debug from 'debug';
import { ChatMessage, ChatRequest, ChatResponse } from '../types';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const debug = Debug('app:llm:ollama');

export interface OllamaConfig {
  baseUrl: string; // e.g., http://localhost:11434
  modelMap?: Record<string, string>; // logical -> provider model name
}

export const toOllamaMessages = (messages: ChatMessage[]) => {
  // Ollama accepts the same shape: { role, content }
  return messages.map(m => ({ role: m.role, content: m.content }));
};

export async function chatWithOllama(cfg: OllamaConfig, req: ChatRequest): Promise<ChatResponse> {
  const providerModel = cfg.modelMap?.[req.model] || req.model;
  const url = new URL('/api/chat', cfg.baseUrl).toString();

  const body = {
    model: providerModel,
    messages: toOllamaMessages(req.messages),
    stream: false
  };

  debug('POST ' + url + ' model=' + providerModel);

  const res = await fetchCompat(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  } as any);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  const data: any = await res.json();
  // Ollama returns { model, message: { role, content }, done, ... }
  const message = data?.message || { role: 'assistant', content: '' };

  const response: ChatResponse = {
    model: req.model,
    provider: 'ollama',
    choices: [
      {
        index: 0,
        message: {
          role: message.role || 'assistant',
          content: message.content || ''
        }
      }
    ]
  };

  return response;
}

// Minimal fetch polyfill using http/https if global fetch is unavailable.
async function fetchCompat(url: string, options: any): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string>; }> {
  const g: any = (globalThis as any);
  if (typeof g.fetch === 'function') {
    return g.fetch(url, options);
  }

  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const isHttps = u.protocol === 'https:';
      const lib = isHttps ? https : http;

      const req = lib.request(
        url,
        {
          method: options?.method || 'GET',
          headers: options?.headers || { 'Content-Type': 'application/json' }
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
          res.on('end', () => {
            const buf = Buffer.concat(chunks);
            const text = buf.toString('utf8');
            resolve({
              ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
              status: res.statusCode || 0,
              json: async () => {
                try { return JSON.parse(text || '{}'); } catch { return {}; }
              },
              text: async () => text
            } as any);
          });
        }
      );

      req.on('error', reject);
      if (options?.body) {
        req.write(options.body);
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}
