import config from 'config';
import Debug from 'debug';
import { ChatRequest, ChatResponse } from './types';
import { ServerConfig } from '../types/ServerConfig';
import {
  chatWithOllama,
  chatWithOllamaStream,
  OllamaConfig,
  createOllamaClient,
} from './providers/ollama';
import {
  chatWithLmStudio,
  chatWithLmStudioStream,
  LmStudioConfig,
  createLmStudioClient,
} from './providers/lmstudio';
import {
  chatWithOpenAI,
  chatWithOpenAIStream,
  getOpenAIClient,
} from './providers/openai';
import { getResolvedLlmConfig } from './config';

const debug = Debug('app:llm:index');

export type ProviderName = 'ollama' | 'lmstudio' | 'openai';

interface AIConfig {
  provider: ProviderName;
  providers: {
    ollama?: OllamaConfig;
    lmstudio?: LmStudioConfig;
    openai?: any;
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
      return chatWithOpenAI(req);
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
  } catch {
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
      for await (const chunk of chatWithOpenAIStream(req)) {
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

export function getLlmClient() {
  const cfg = getResolvedLlmConfig();
  if (!cfg.enabled || cfg.provider === 'none') return null;
  switch (cfg.provider) {
    case 'openai':
    case 'litellm':
      return getOpenAIClient();
    case 'ollama':
      return createOllamaClient(cfg.ollamaURL || '');
    case 'lmstudio':
      return createLmStudioClient(cfg.lmstudioURL || '');
    default:
      return null;
  }
}

export function getDefaultModel() {
  const cfg = getResolvedLlmConfig();
  return cfg.defaultModel || 'gpt-4o-mini';
}

// Per-server overrides: use llm provider settings from server config if present
export async function chatForServer(server: ServerConfig, req: ChatRequest): Promise<ChatResponse> {
  const llm = server.llm;

  // Validate presence of llm config
  if (!llm || Object.keys(llm).length === 0) {
    throw new Error('LLM provider not configured');
  }

  // Validate provider
  const provider = (llm as any).provider;
  const validProviders = new Set(['ollama', 'lmstudio', 'openai']);
  if (!provider || !validProviders.has(provider)) {
    throw new Error(`Invalid LLM provider: ${provider || 'undefined'}`);
  }

  if (llm?.provider === 'ollama') {
    const cfg: OllamaConfig = { baseUrl: llm.baseUrl || 'http://localhost:11434', modelMap: llm.modelMap };
    if (!llm.baseUrl) {
      throw new Error('Missing baseUrl for ollama provider');
    }
    return chatWithOllama(cfg, req);
  }
  if (llm?.provider === 'lmstudio') {
    const cfg: LmStudioConfig = { baseUrl: llm.baseUrl || 'http://localhost:1234', modelMap: llm.modelMap } as any;
    if (!llm.baseUrl) {
      throw new Error('Missing baseUrl for lmstudio provider');
    }
    return chatWithLmStudio(cfg, req);
  }
  if (llm?.provider === 'openai') {
    return chatWithOpenAI(req);
  }
  // Should not reach here due to validation
  throw new Error('Unsupported LLM provider configuration');
}
