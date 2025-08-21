import { getSettings } from '../settings/store';

export type LlmConfig = ReturnType<typeof getSettings>['llm'];

export function getLlmConfig(): LlmConfig {
  const settings = getSettings();
  const s = settings.llm;
  return {
    ...s,
    provider:
      (process.env.LLM_PROVIDER as LlmConfig['provider'] | undefined) ??
      s.provider,
    openai: {
      ...s.openai,
      model: process.env.LLM_DEFAULT_MODEL ?? s.openai.model,
      apiKey: process.env.OPENAI_API_KEY ?? s.openai.apiKey,
    },
  };
}

export const llmConfig = (() => {
  const cfg = getLlmConfig();
  return {
    ...cfg,
  } as any;
})();
