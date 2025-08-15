import config from 'config';
import Debug from 'debug';
import { ChatRequest, ChatResponse } from './types';
import { chatWithOllama, OllamaConfig } from './providers/ollama';

const debug = Debug('app:llm:index');

export type ProviderName = 'ollama';

interface AIConfig {
  provider: ProviderName;
  providers: {
    ollama?: OllamaConfig;
  };
}

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const aiCfg = getAIConfig();
  const provider = aiCfg.provider || 'ollama';
  debug('Dispatching chat to provider: ' + provider);

  switch (provider) {
    case 'ollama':
    default: {
      const cfg: OllamaConfig = aiCfg.providers?.ollama || { baseUrl: 'http://localhost:11434' };
      return chatWithOllama(cfg, req);
    }
  }
}

export function getAIConfig(): AIConfig {
  try {
    // Expecting config under key 'ai'
    const ai = config.has('ai') ? config.get<AIConfig>('ai') : {
      provider: 'ollama',
      providers: { ollama: { baseUrl: 'http://localhost:11434' } }
    } as AIConfig;
    return ai;
  } catch (e) {
    debug('AI config not found, using defaults');
    return {
      provider: 'ollama',
      providers: { ollama: { baseUrl: 'http://localhost:11434' } }
    };
  }
}

