import config from 'config';
import Debug from 'debug';
import { ChatRequest, ChatResponse } from './types';
import { ServerConfig } from '../types/ServerConfig';
import { chatWithOllama, chatWithOllamaStream, OllamaConfig } from './providers/ollama';
import { chatWithLmStudio, chatWithLmStudioStream, LmStudioConfig } from './providers/lmstudio';
import { chatWithOpenAI, chatWithOpenAIStream, OpenAIConfig } from './providers/openai';

const debug = Debug('app:llm:index');

export type ProviderName = 'ollama' | 'lmstudio' | 'openai';

interface AIConfig {
  provider: ProviderName;
  providers: {
    ollama?: OllamaConfig;
    lmstudio?: LmStudioConfig;
    openai?: OpenAIConfig;
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
    case 'openai': {
      const cfg: OpenAIConfig = aiCfg.providers?.openai || { baseUrl: 'https://api.openai.com' };
      return chatWithOpenAI(cfg, req);
    }
  }
}

export function getAIConfig(): AIConfig {
  try {
    // Expecting config under key 'ai'
    const ai = config.has('ai') ? config.get<AIConfig>('ai') : {
      provider: 'ollama',
      providers: { ollama: { baseUrl: 'http://localhost:11434' }, lmstudio: { baseUrl: 'http://localhost:1234' }, openai: { baseUrl: 'https://api.openai.com' } }
    } as AIConfig;
    // Environment overrides
    const envProvider = process.env.AI_PROVIDER as ProviderName | undefined;
    if (envProvider) ai.provider = envProvider;
    if (process.env.OLLAMA_BASE_URL) {
      ai.providers.ollama = { ...(ai.providers.ollama || {} as any), baseUrl: process.env.OLLAMA_BASE_URL };
    }
    if (process.env.LMSTUDIO_BASE_URL) {
      ai.providers.lmstudio = { ...(ai.providers.lmstudio || {} as any), baseUrl: process.env.LMSTUDIO_BASE_URL };
    }
    if (process.env.OPENAI_BASE_URL) {
      ai.providers.openai = { ...(ai.providers.openai || {} as any), baseUrl: process.env.OPENAI_BASE_URL };
    }
    if (process.env.OPENAI_API_KEY) {
      ai.providers.openai = { ...(ai.providers.openai || {} as any), apiKey: process.env.OPENAI_API_KEY };
    }
    return ai;
  } catch (e) {
    debug('AI config not found, using defaults');
    return {
      provider: 'ollama',
      providers: { ollama: { baseUrl: 'http://localhost:11434' }, lmstudio: { baseUrl: 'http://localhost:1234' }, openai: { baseUrl: 'https://api.openai.com' } }
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
    case 'openai': {
      const cfg: OpenAIConfig = aiCfg.providers?.openai || { baseUrl: 'https://api.openai.com' };
      for await (const chunk of chatWithOpenAIStream(cfg, req)) {
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

// Per-server overrides: use llm provider settings from server config if present
export async function chatForServer(server: ServerConfig, req: ChatRequest): Promise<ChatResponse> {
  const llm = server.llm;
  if (llm?.provider === 'ollama') {
    const cfg: OllamaConfig = { baseUrl: llm.baseUrl || 'http://localhost:11434', modelMap: llm.modelMap };
    return chatWithOllama(cfg, req);
  }
  if (llm?.provider === 'lmstudio') {
    const cfg: LmStudioConfig = { baseUrl: llm.baseUrl || 'http://localhost:1234', modelMap: llm.modelMap } as any;
    return chatWithLmStudio(cfg, req);
  }
  if (llm?.provider === 'openai') {
    const cfg: OpenAIConfig = { baseUrl: llm.baseUrl || 'https://api.openai.com', apiKey: llm.apiKey, modelMap: llm.modelMap };
    return chatWithOpenAI(cfg, req);
  }
  // Fallback to global config
  return chat(req);
}
