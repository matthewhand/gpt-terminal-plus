export type LlmProvider = 'ollama' | 'open-interpreter';

export const llmConfig = {
  provider: (process.env.LLM_PROVIDER as LlmProvider) || 'ollama',
  model: process.env.LLM_MODEL || 'gpt-oss:20b',

  // Ollama: single var handles protocol+host:port
  ollamaHost: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',

  // Open Interpreter server host/port (http://host:port)
  interpHost: process.env.INTERPRETER_SERVER_HOST || '127.0.0.1',
  interpPort: Number(process.env.INTERPRETER_SERVER_PORT || 8000),

  // In CI/tests we keep the simple shim behavior so tests remain deterministic
  useShim: process.env.NODE_ENV === 'test' && !process.env.LLM_PROVIDER,
};
