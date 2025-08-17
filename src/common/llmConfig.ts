export type LlmProvider = 'ollama' | 'open-interpreter' | 'none';

export const llmConfig = {
  provider: (process.env.LLM_PROVIDER as LlmProvider) || 'ollama',
  model: process.env.LLM_MODEL || 'gpt-oss:20b',

  // Ollama: single var handles protocol+host:port
  ollamaHost: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',

  // Open Interpreter server host/port (http://host:port)
  interpHost: process.env.INTERPRETER_SERVER_HOST || '127.0.0.1',
  interpPort: Number(process.env.INTERPRETER_SERVER_PORT || 8000),
  interpOffline: process.env.INTERPRETER_OFFLINE
    ? process.env.INTERPRETER_OFFLINE === 'true'
    : false,
  interpVerbose: process.env.INTERPRETER_VERBOSE
    ? process.env.INTERPRETER_VERBOSE === 'true'
    : true,

  // In CI/tests we keep the simple shim behavior so tests remain deterministic
  useShim: process.env.NODE_ENV === 'test' && !process.env.LLM_PROVIDER,
};

export interface ResolvedLlmConfig {
  enabled: boolean;
  provider: LlmProvider | 'none';
}

/**
 * Resolves the effective LLM configuration taking environment overrides into account.
 * Defaults to enabled unless explicitly disabled via `LLM_ENABLED=false`.
 */
export const getResolvedLlmConfig = (): ResolvedLlmConfig => {
  const enabledEnv = process.env.LLM_ENABLED;
  const enabled = enabledEnv !== undefined ? enabledEnv === 'true' || enabledEnv === '1' : true;
  const provider = (process.env.LLM_PROVIDER as LlmProvider) || llmConfig.provider || 'none';
  return { enabled, provider };
};
