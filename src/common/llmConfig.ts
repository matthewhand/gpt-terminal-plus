import { getSettings } from '../settings/store';

export type LlmConfig = ReturnType<typeof getSettings>['llm'];

export function getLlmConfig(): LlmConfig {
  const s = getSettings().llm;
  return {
    ...s,
    enabled: process.env.LLM_ENABLED
      ? process.env.LLM_ENABLED === 'true'
      : s.enabled,
    provider:
      (process.env.LLM_PROVIDER as LlmConfig['provider'] | undefined) ??
      s.provider,
    defaultModel: process.env.LLM_DEFAULT_MODEL ?? s.defaultModel,
    baseURL: process.env.OPENAI_BASE_URL ?? s.baseURL,
    apiKey: process.env.OPENAI_API_KEY ?? s.apiKey,
    ollamaURL: process.env.OLLAMA_URL ?? s.ollamaURL,
    lmstudioURL: process.env.LM_STUDIO_URL ?? s.lmstudioURL,
  };
}

export const llmConfig = (() => {
  const cfg = getLlmConfig();
  return {
    ...cfg,
    model: cfg.defaultModel,
    ollamaHost: cfg.ollamaURL,
  } as any;
})();
