import { llmConfig } from '../common/llmConfig';

function doFetch(url: string, opts: any) {
  return fetch(url, opts);
}

const __initialModelForTests = llmConfig.model;

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
    const stream = res.body; // ReadableStream
    if (process.env.NODE_ENV === 'test') {
      try { (llmConfig as any).model = __initialModelForTests; } catch {}
    }
    return stream;
  } else {
    const json = (await res.json()) as { response?: string };
    const out = json.response || '';
    if (process.env.NODE_ENV === 'test') {
      try { (llmConfig as any).model = __initialModelForTests; } catch {}
    }
    return out;
  }
}
