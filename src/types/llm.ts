export interface OpenAiChatCompletionRequest {
  model: string;
  messages: {
    role: 'user' | 'system' | 'assistant';
    content: string;
  }[];
  stream?: boolean;
}

export interface OpenAiChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
