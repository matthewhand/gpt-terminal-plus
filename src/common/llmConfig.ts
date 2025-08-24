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
  };
}

export const llmConfig = (() => {
  const cfg = getLlmConfig();
  return {
    ...cfg,
  } as any;
})();
