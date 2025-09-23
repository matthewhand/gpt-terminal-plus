import { convictConfig } from '../config/convictConfig';
import { ChatRequest, ChatResponse } from './types';
import { chatWithOpenAI, chatWithOpenAIStream } from './providers/openai';
import { chatWithOllama, chatWithOllamaStream, OllamaConfig } from './providers/ollama';
import { chatWithLmStudio, chatWithLmStudioStream, LmStudioConfig } from './providers/lmstudio';

export interface LlmClient {
  provider: string;
  baseUrl?: string;
  apiKey?: string;
  chat(options: ChatRequest): Promise<ChatResponse>;
  chatStream?: (options: ChatRequest) => AsyncGenerator<string>;
}

/**
 * Central LLM client selector that maps provider to client instance
 */
export function getLlmClient(): LlmClient | null {
  const cfg = convictConfig();
  
  // Check if LLM is enabled
  if (!cfg.get('llm.enabled') && !cfg.get('execution.llm.enabled')) {
    return null;
  }

  const provider = cfg.get('llm.provider') || cfg.get('llm.compat.llmProvider');
  
  switch (provider) {
    case 'openai': {
      const baseUrl = cfg.get('llm.openai.baseUrl');
      const apiKey = cfg.get('llm.openai.apiKey');
      if (!apiKey) return null;
      
      return {
        provider: 'openai',
        baseUrl: baseUrl || 'https://api.openai.com/v1',
        apiKey,
        async chat(options: ChatRequest): Promise<ChatResponse> {
          return chatWithOpenAI(options);
        },
        chatStream(options: ChatRequest) {
          return chatWithOpenAIStream(options);
        }
      };
    }
    
    case 'ollama': {
      const baseUrl = cfg.get('llm.ollama.baseUrl') || cfg.get('llm.compat.ollamaHost');
      if (!baseUrl) return null;
      
      const ollamaConfig: OllamaConfig = { baseUrl };
      return {
        provider: 'ollama',
        baseUrl,
        async chat(options: ChatRequest): Promise<ChatResponse> {
          return chatWithOllama(ollamaConfig, options);
        },
        chatStream(options: ChatRequest) {
          return chatWithOllamaStream(ollamaConfig, options);
        }
      };
    }
    
    case 'lmstudio': {
      const baseUrl = cfg.get('llm.lmstudio.baseUrl');
      if (!baseUrl) return null;
      
      const lmStudioConfig: LmStudioConfig = { baseUrl };
      return {
        provider: 'lmstudio',
        baseUrl,
        async chat(options: ChatRequest): Promise<ChatResponse> {
          return chatWithLmStudio(lmStudioConfig, options);
        },
        chatStream(options: ChatRequest) {
          return chatWithLmStudioStream(lmStudioConfig, options);
        }
      };
    }
    
    default:
      return null;
  }
}

/**
 * Get the default model for the current provider
 */
export function getDefaultModel(): string {
  const cfg = convictConfig();
  const provider = cfg.get('llm.provider') || cfg.get('llm.compat.llmProvider');
  const defaultModel = cfg.get('llm.defaultModel');
  const compatModel = cfg.get('llm.compat.llmModel');
  
  if (defaultModel) return defaultModel;
  if (compatModel) return compatModel;
  
  switch (provider) {
    case 'openai':
      return 'gpt-4o';
    case 'ollama':
      return 'llama2';
    case 'lmstudio':
      return 'local-model';
    default:
      return 'gpt-4o';
  }
}

/**
 * Check if LLM is enabled and configured
 */
export function isLlmEnabled(): boolean {
  const cfg = convictConfig();
  if (!(cfg.get('llm.enabled') || cfg.get('execution.llm.enabled'))) {
    return false;
  }

  return getLlmClient() !== null;
}
