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
