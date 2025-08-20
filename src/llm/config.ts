export type LlmProvider = 'openai' | 'litellm' | 'ollama' | 'lmstudio' | 'none';

export interface ResolvedLlmConfig {
  enabled: boolean;
  provider: LlmProvider;
  defaultModel: string;
  apiKey?: string;
  baseURL?: string;
  ollamaURL?: string;
  lmstudioURL?: string;
}

const DEFAULT_PROVIDER: ResolvedLlmConfig['provider'] = 'ollama';
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_OLLAMA_URL = 'http://127.0.0.1:11434';
const DEFAULT_LMSTUDIO_URL = 'http://127.0.0.1:1234';

export function getResolvedLlmConfig(): ResolvedLlmConfig {
  const provider = (process.env.LLM_PROVIDER as any) || DEFAULT_PROVIDER;
  const enabled = process.env.LLM_ENABLED ? process.env.LLM_ENABLED !== 'false' : true;
  const defaultModel = process.env.LLM_DEFAULT_MODEL || DEFAULT_MODEL;
  return {
    enabled,
    provider,
    defaultModel,
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    ollamaURL: process.env.OLLAMA_URL || DEFAULT_OLLAMA_URL,
    lmstudioURL: process.env.LM_STUDIO_URL || DEFAULT_LMSTUDIO_URL,
  };
}
