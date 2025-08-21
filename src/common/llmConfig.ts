import { getSettings } from '../settings/store';

export type LlmConfig = ReturnType<typeof getSettings>['execution']['llm'];

export function getLlmConfig(): LlmConfig {
  const settings = getSettings();
  const s = settings.execution.llm;
  return {
    ...s,
    enabled: process.env.LLM_ENABLED
      ? process.env.LLM_ENABLED === 'true'
      : s.enabled,
    provider:
      (process.env.LLM_PROVIDER as LlmConfig['provider'] | undefined) ??
      s.provider,
    model: process.env.LLM_DEFAULT_MODEL ?? s.model,
    apiKey: process.env.OPENAI_API_KEY ?? s.apiKey,
  };
}

export const llmConfig = (() => {
  const cfg = getLlmConfig();
  return {
    ...cfg,
  } as any;
})();
