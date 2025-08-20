import { llmConfig } from '../common/llmConfig';

export function interpreterChatStream(message: string) {
  const base = `http://${llmConfig.interpHost}:${llmConfig.interpPort}`;
  const url = new URL(`${base}/chat`);
  url.searchParams.set('message', message);
  url.searchParams.set('offline', llmConfig.interpOffline.toString());
  url.searchParams.set('verbose', llmConfig.interpVerbose.toString());
  return fetch(url, {
    method: 'GET',
    headers: { Accept: 'text/event-stream' },
  });
}

export async function interpreterChatOnce(message: string) {
  const res = await interpreterChatStream(message);
  if (!res.ok || !res.body) throw new Error(`Interpreter error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let acc = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      const m = line.match(/^data:\s*(.*)$/);
      if (m) {
        const payload = m[1].trim();
        if (payload === '[DONE]') continue;
        acc += payload;
      }
    }
  }
  return acc;
}
