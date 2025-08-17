import http from 'http';
import https from 'https';
import { llmConfig } from '../common/llmConfig';

function doFetch(url: string, opts: any) {
  const agent = url.startsWith('https')
    ? new https.Agent({ keepAlive: true })
    : new http.Agent({ keepAlive: true });
  return fetch(url, { ...opts, agent: agent as any });
}

export async function ollamaGenerate(opts: { prompt: string; stream?: boolean }) {
  const base = llmConfig.ollamaHost.replace(/\/+$/, '');
  const url = `${base}/api/generate`;
  const body = {
    model: llmConfig.model,
    prompt: opts.prompt,
    stream: opts.stream ?? false,
  };

  const res = await doFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  }

  if (opts.stream) {
    return res.body; // ReadableStream
  } else {
    const json = (await res.json()) as { response?: string };
    return json.response || '';
  }
}
