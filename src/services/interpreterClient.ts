import { llmConfig } from '../common/llmConfig';

function normalizeBase(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

export async function streamChatWithInterpreter(
  baseUrl: string,
  messages: Array<{ role: string; content: unknown }>,
  onChunk: (data: any) => void,
  onError?: (error: string) => void,
  onComplete?: () => void
): Promise<void> {
  try {
    const url = `${normalizeBase(baseUrl)}/chat/stream`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok || !res.body) {
      const msg = `HTTP error! status: ${res.status}`;
      onError?.(msg);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let errored = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          onChunk(JSON.parse(payload));
        } catch (err: any) {
          errored = true;
          onError?.(`Failed to parse JSON: ${err?.message ?? 'Invalid JSON'}`);
        }
      }
    }
    if (!errored) onComplete?.();
  } catch (err: any) {
    // Network/stream error
    onError?.(err?.message ?? 'Unknown error');
  }
}

export async function chatWithInterpreter(
  baseUrl: string,
  messages: Array<{ role: string; content: unknown }>
): Promise<any> {
  const url = `${normalizeBase(baseUrl)}/chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

// --- Compat exports for interpreterClient tests (simple message-based SSE /chat) ---
export async function interpreterChatStream(message: string): Promise<any> {
  const host = (llmConfig as any).interpHost || 'localhost';
  const port = (llmConfig as any).interpPort || 8000;
  const offline = (llmConfig as any).interpOffline !== false;
  const verbose = !!(llmConfig as any).interpVerbose;
  const qs = `message=${encodeURIComponent(message).replace(/%20/g, '+')}&offline=${offline}&verbose=${verbose}`;
  const url = `http://${host}:${port}/chat?${qs}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'text/event-stream' }
  });
  return res;
}

export async function interpreterChatOnce(message: string): Promise<string> {
  const res = await interpreterChatStream(message);
  if (!res || !res.ok || !res.body) {
    const status = res && res.status ? res.status : 0;
    throw new Error(`Interpreter error ${status}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (data && data !== '[DONE]') {
          out += data;
        }
      }
    }
  }
  return out;
}
