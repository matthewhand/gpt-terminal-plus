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



import { convictConfig } from '../config/convictConfig';

export function getResolvedLlmConfig(): ResolvedLlmConfig {
  const config = convictConfig();
  return {
    enabled: config.get('llm.enabled'),
    provider: config.get('llm.provider'),
    defaultModel: config.get('llm.defaultModel'),
    apiKey: config.get('llm.openai.apiKey'),
    baseURL: config.get('llm.openai.baseUrl'),
    ollamaURL: config.get('llm.ollama.baseUrl'),
    lmstudioURL: config.get('llm.lmstudio.baseUrl'),
  };
}
