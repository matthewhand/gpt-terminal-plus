export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
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
  model?: string;
  choices: ChatChoice[];
  provider?: string;
}

