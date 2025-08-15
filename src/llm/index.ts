import config from 'config';
import Debug from 'debug';
import { ChatRequest, ChatResponse } from './types';
import { chatWithOllama, chatWithOllamaStream, OllamaConfig } from './providers/ollama';
import { chatWithLmStudio, chatWithLmStudioStream, LmStudioConfig } from './providers/lmstudio';

const debug = Debug('app:llm:index');

export type ProviderName = 'ollama' | 'lmstudio';

interface AIConfig {
  provider: ProviderName;
  providers: {
    ollama?: OllamaConfig;
    lmstudio?: LmStudioConfig;
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
    case 'lmstudio': {
      const cfg: LmStudioConfig = aiCfg.providers?.lmstudio || { baseUrl: 'http://localhost:1234' };
      return chatWithLmStudio(cfg, req);
    }
  }
}

export function getAIConfig(): AIConfig {
  try {
    // Expecting config under key 'ai'
    const ai = config.has('ai') ? config.get<AIConfig>('ai') : {
      provider: 'ollama',
      providers: { ollama: { baseUrl: 'http://localhost:11434' }, lmstudio: { baseUrl: 'http://localhost:1234' } }
    } as AIConfig;
    return ai;
  } catch (e) {
    debug('AI config not found, using defaults');
    return {
      provider: 'ollama',
      providers: { ollama: { baseUrl: 'http://localhost:11434' }, lmstudio: { baseUrl: 'http://localhost:1234' } }
    };
  }
}

export async function* chatStream(req: ChatRequest): AsyncGenerator<string> {
  const aiCfg = getAIConfig();
  const provider = aiCfg.provider || 'ollama';
  debug('Streaming chat via provider: ' + provider);

  switch (provider) {
    case 'lmstudio': {
      const cfg: LmStudioConfig = aiCfg.providers?.lmstudio || { baseUrl: 'http://localhost:1234' };
      for await (const chunk of chatWithLmStudioStream(cfg, req)) {
        yield chunk;
      }
      break;
    }
    case 'ollama':
    default: {
      const cfg: OllamaConfig = aiCfg.providers?.ollama || { baseUrl: 'http://localhost:11434' };
      for await (const chunk of chatWithOllamaStream(cfg, req)) {
        yield chunk;
      }
      break;
    }
  }
}
