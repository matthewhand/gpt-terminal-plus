describe('llmClient.isLlmEnabled', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV, NODE_ENV: 'test' };
    delete process.env.LLM_ENABLED;
    delete process.env.LLM_PROVIDER;
    delete process.env.OLLAMA_URL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_BASE_URL;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns false when LLM features are disabled', () => {
    const { isLlmEnabled } = require('../../src/llm/llmClient');
    expect(isLlmEnabled()).toBe(false);
  });

  it('returns false when provider lacks required configuration', () => {
    process.env.LLM_ENABLED = 'true';
    process.env.LLM_PROVIDER = 'openai';

    jest.resetModules();
    const { isLlmEnabled } = require('../../src/llm/llmClient');
    expect(isLlmEnabled()).toBe(false);
  });

  it('returns true when Ollama provider is fully configured', () => {
    process.env.LLM_ENABLED = 'true';
    process.env.LLM_PROVIDER = 'ollama';
    process.env.OLLAMA_URL = 'http://localhost:11434';

    jest.resetModules();
    const { isLlmEnabled } = require('../../src/llm/llmClient');
    expect(isLlmEnabled()).toBe(true);
  });
});
