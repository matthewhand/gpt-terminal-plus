import Debug from 'debug';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { ChatMessage, ChatRequest, ChatResponse } from '../types';

const debug = Debug('app:llm:openai');

export interface OpenAIConfig {
  baseUrl?: string; // default https://api.openai.com
  apiKey?: string;
  modelMap?: Record<string, string>;
}

const DEFAULT_BASE = 'https://api.openai.com';

export const toOpenAIChatMessages = (messages: ChatMessage[]) => {
  return messages.map(m => ({ role: m.role, content: m.content }));
};

export async function chatWithOpenAI(cfg: OpenAIConfig, req: ChatRequest): Promise<ChatResponse> {
  const providerModel = cfg.modelMap?.[req.model] || req.model;
  const base = cfg.baseUrl || DEFAULT_BASE;
  const url = new URL('/v1/chat/completions', base).toString();
  const body = {
    model: providerModel,
    messages: toOpenAIChatMessages(req.messages),
    stream: false
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cfg.apiKey || process.env.OPENAI_API_KEY) headers['Authorization'] = `Bearer ${cfg.apiKey || process.env.OPENAI_API_KEY}`;

  debug('POST ' + url + ' model=' + providerModel);
  const res = await fetchCompat(url, { method: 'POST', headers, body: JSON.stringify(body) } as any);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  const data: any = await res.json();
  const choice = data?.choices?.[0] || { message: { role: 'assistant', content: '' } };
  return {
    model: req.model,
    provider: 'openai',
    choices: [ { index: 0, message: { role: choice.message.role || 'assistant', content: choice.message.content || '' } } ]
  };
}

export async function* chatWithOpenAIStream(cfg: OpenAIConfig, req: ChatRequest): AsyncGenerator<string> {
  const providerModel = cfg.modelMap?.[req.model] || req.model;
  const base = cfg.baseUrl || DEFAULT_BASE;
  const url = new URL('/v1/chat/completions', base).toString();
  const body = {
    model: providerModel,
    messages: toOpenAIChatMessages(req.messages),
    stream: true
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cfg.apiKey || process.env.OPENAI_API_KEY) headers['Authorization'] = `Bearer ${cfg.apiKey || process.env.OPENAI_API_KEY}`;

  debug('STREAM POST ' + url + ' model=' + providerModel);
  const res = await streamCompat(url, { method: 'POST', headers, body: JSON.stringify(body) });
  let buffer = '';
  for await (const chunk of res) {
    buffer += chunk.toString('utf8');
    let idx: number;
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('data:')) {
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') return;
        try {
          const evt = JSON.parse(payload);
          const delta = evt?.choices?.[0]?.delta?.content || '';
          if (delta) yield delta;
        } catch {
          // ignore
        }
      }
    }
  }
}

// Fetch compatibility shim
async function fetchCompat(url: string, options: any): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string>; }> {
  const g: any = (globalThis as any);
  if (typeof g.fetch === 'function') {
    return g.fetch(url, options);
  }
  return new Promise((resolve, reject) => {
    try {
      const lib = new URL(url).protocol === 'https:' ? https : http;
      const req = lib.request(url, { method: options?.method || 'GET', headers: options?.headers || {} }, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const text = buf.toString('utf8');
          resolve({
            ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
            status: res.statusCode || 0,
            json: async () => { try { return JSON.parse(text || '{}'); } catch { return {}; } },
            text: async () => text
          } as any);
        });
      });
      req.on('error', reject);
      if (options?.body) req.write(options.body);
      req.end();
    } catch (err) { reject(err); }
  });
}

// Streaming compatibility shim - returns an async iterable of Buffer
async function streamCompat(urlStr: string, options: any): Promise<AsyncIterable<Buffer>> {
  const g: any = (globalThis as any);
  if (typeof g.fetch === 'function') {
    const res = await g.fetch(urlStr, options);
    const anyRes: any = res;
    if (anyRes?.body && typeof anyRes.body.getReader === 'function') {
      const reader = anyRes.body.getReader();
      return {
        async *[Symbol.asyncIterator]() {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            yield Buffer.from(value);
          }
        }
      } as AsyncIterable<Buffer>;
    }
    const text = await res.text();
    return {
      async *[Symbol.asyncIterator]() {
        yield Buffer.from(text);
      }
    } as AsyncIterable<Buffer>;
  }

  return new Promise((resolve, reject) => {
    try {
      const u = new URL(urlStr);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.request(urlStr, { method: options?.method || 'GET', headers: options?.headers || {} }, (res) => {
        resolve(res as any);
      });
      req.on('error', reject);
      if (options?.body) req.write(options.body);
      req.end();
    } catch (err) { reject(err); }
  });
}

