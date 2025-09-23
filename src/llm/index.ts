import Debug from 'debug';
import { ChatRequest, ChatResponse } from './types';
import { getLlmClient, getDefaultModel } from './llmClient';
import { chatWithOllama, OllamaConfig } from './providers/ollama';
import { chatWithLmStudio, LmStudioConfig } from './providers/lmstudio';
import { chatWithOpenAI } from './providers/openai';
import { ServerConfig } from '../types/ServerConfig';

const debug = Debug('app:llm:index');

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const client = getLlmClient();
  if (!client) {
    throw new Error('LLM client not configured');
  }
  debug('Dispatching chat to provider: %s', client.provider);
  return client.chat(req);
}

export async function chatForServer(serverConfig: ServerConfig, req: ChatRequest): Promise<ChatResponse> {
  const serverLlm = serverConfig?.llm;

  if (serverLlm) {
    const { provider, baseUrl, apiKey, modelMap } = serverLlm;
    if (!provider) {
      throw new Error('LLM provider not specified in server configuration');
    }

    const supportedProviders = new Set(['ollama', 'lmstudio', 'openai']);
    if (!supportedProviders.has(provider)) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    if ((provider === 'ollama' || provider === 'lmstudio') && !baseUrl) {
      throw new Error(`baseUrl is required for ${provider} provider`);
    }

    // Use server-specific LLM configuration
    if (provider === 'ollama') {
      const cfg: OllamaConfig = { baseUrl: baseUrl!, modelMap };
      return chatWithOllama(cfg, req);
    }
    if (provider === 'lmstudio') {
      const cfg: LmStudioConfig = { baseUrl: baseUrl!, apiKey, modelMap };
      return chatWithLmStudio(cfg, req);
    }
    if (provider === 'openai') {
      // Server-specific OpenAI configuration with per-server API keys
      return chatWithOpenAI(req, apiKey);
    }
  }
  
  // Fall back to global LLM client
  const client = getLlmClient();
  if (!client) {
    throw new Error('LLM client not configured');
  }
  return client.chat(req);
}

export async function* chatStream(req: ChatRequest): AsyncGenerator<string, void, unknown> {
  const client = getLlmClient();
  if (!client) {
    throw new Error('LLM client not configured');
  }

  debug('Streaming chat via provider: %s', client.provider);

  if (client.chatStream) {
    for await (const chunk of client.chatStream(req)) {
      yield chunk;
    }
    return;
  }

  // Fallback: derive stream from non-streaming response
  const response = await client.chat(req);
  const content = response.choices?.[0]?.message?.content || '';
  const chunkSize = 64;
  for (let i = 0; i < content.length; i += chunkSize) {
    yield content.slice(i, i + chunkSize);
  }
}

export function getProvider() {
  const client = getLlmClient();
  return client?.provider;
}

export { getDefaultModel };
