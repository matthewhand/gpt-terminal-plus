import { chat, chatStream } from './index';
import { getSupportedModels } from '../common/models';

export interface LlmClient {
  chat: typeof chat;
  chatStream: typeof chatStream;
  listModels?: () => Promise<string[]>;
}

/**
 * Returns an LLM client based on current configuration. For now this simply
 * wraps the generic chat helpers but provides a consistent interface for
 * routing layers.
 */
export const getLlmClient = (): LlmClient | null => {
  try {
    return {
      chat,
      chatStream,
      listModels: async () => getSupportedModels(),
    };
  } catch {
    return null;
  }
};

