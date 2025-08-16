// Unit-level tests for provider routing
import { chatForServer } from '../src/llm';

jest.mock('../src/llm/providers/ollama', () => ({ chatWithOllama: jest.fn(async () => ({ provider: 'ollama', model: 'x', choices: [ { index: 0, message: { role: 'assistant', content: 'ok' } } ] })), chatWithOllamaStream: jest.fn() }));
jest.mock('../src/llm/providers/lmstudio', () => ({ chatWithLmStudio: jest.fn(async () => ({ provider: 'lmstudio', model: 'x', choices: [ { index: 0, message: { role: 'assistant', content: 'ok' } } ] })), chatWithLmStudioStream: jest.fn() }));
jest.mock('../src/llm/providers/openai', () => ({ chatWithOpenAI: jest.fn(async () => ({ provider: 'openai', model: 'x', choices: [ { index: 0, message: { role: 'assistant', content: 'ok' } } ] })), chatWithOpenAIStream: jest.fn() }));

describe('chatForServer routing', () => {
  it('uses ollama when server.llm.provider=ollama', async () => {
    const res = await chatForServer({ hostname:'h', protocol:'local', llm: { provider: 'ollama', baseUrl: 'http://h:11434' } } as any, { model: 'm', messages: [] } as any);
    expect(res.provider).toBe('ollama');
  });
  it('uses lmstudio when server.llm.provider=lmstudio', async () => {
    const res = await chatForServer({ hostname:'h', protocol:'local', llm: { provider: 'lmstudio', baseUrl: 'http://h:1234' } } as any, { model: 'm', messages: [] } as any);
    expect(res.provider).toBe('lmstudio');
  });
  it('uses openai when server.llm.provider=openai', async () => {
    const res = await chatForServer({ hostname:'h', protocol:'local', llm: { provider: 'openai', baseUrl: 'https://api.openai.com' } } as any, { model: 'm', messages: [] } as any);
    expect(res.provider).toBe('openai');
  });
});

