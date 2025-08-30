import { convictConfig } from '../config/convictConfig';

export interface LlmClient {
  provider: string;
  baseUrl?: string;
  apiKey?: string;
  chat(options: any): Promise<any>;
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
        async chat(options: any) {
          // Implementation would use OpenAI client
          throw new Error('OpenAI client not implemented');
        }
      };
    }
    
    case 'ollama': {
      const baseUrl = cfg.get('llm.ollama.baseUrl') || cfg.get('llm.compat.ollamaHost');
      if (!baseUrl) return null;
      
      return {
        provider: 'ollama',
        baseUrl,
        async chat(options: any) {
          // Implementation would use Ollama client
          throw new Error('Ollama client not implemented');
        }
      };
    }
    
    case 'lmstudio': {
      const baseUrl = cfg.get('llm.lmstudio.baseUrl');
      if (!baseUrl) return null;
      
      return {
        provider: 'lmstudio',
        baseUrl,
        async chat(options: any) {
          // Implementation would use LM Studio client
          throw new Error('LM Studio client not implemented');
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
  return (cfg.get('llm.enabled') || cfg.get('execution.llm.enabled')) && getLlmClient() !== null;
}