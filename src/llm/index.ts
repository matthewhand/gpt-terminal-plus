import { ChatRequest, ChatResponse } from './types';
import { getLlmClient, getDefaultModel } from './llmClient';

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const client = getLlmClient();
  if (!client) {
    throw new Error('LLM client not configured');
  }
  return client.chat(req);
}

export async function chatForServer(serverConfig: any, req: ChatRequest): Promise<ChatResponse> {
  // For SSH servers with LLM config, use the server-specific LLM settings
  if (serverConfig?.llm) {
    const { provider, baseUrl } = serverConfig.llm;
    if (!provider) {
      throw new Error('LLM provider not specified in server configuration');
    }

    const supportedProviders = ['ollama', 'lmstudio', 'openai'];
    if (!supportedProviders.includes(provider)) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    if ((provider === 'ollama' || provider === 'lmstudio') && !baseUrl) {
      throw new Error(`baseUrl is required for ${provider} provider`);
    }

    // Use server-specific LLM configuration
    if (provider === 'ollama') {
      const { chatWithOllama } = require('./providers/ollama');
      return chatWithOllama(serverConfig.llm, req);
    }
    if (provider === 'lmstudio') {
      const { chatWithLmStudio } = require('./providers/lmstudio');
      return chatWithLmStudio(serverConfig.llm, req);
    }
    if (provider === 'openai') {
      const { chatWithOpenAI } = require('./providers/openai');
      return chatWithOpenAI(req);
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
  // Simple streaming implementation for tests - just yield the response in chunks
  const response = await chat(req);
  const content = response.choices?.[0]?.message?.content || '';
  
  // Yield content in small chunks for streaming effect
  const chunkSize = 10;
  for (let i = 0; i < content.length; i += chunkSize) {
    yield content.slice(i, i + chunkSize);
  }
}

export function getProvider() {
  const client = getLlmClient();
  return client?.provider;
}

export { getDefaultModel };