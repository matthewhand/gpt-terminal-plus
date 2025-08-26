export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role?: Role; // relaxed to be backward-compatible with tests
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
}

export interface ChatChoice {
  index: number;
  message: ChatMessage;
}

export interface ChatResponse {
  model?: string; // some tests omit model; make optional for compatibility
  choices: ChatChoice[];
  provider: string;
}
