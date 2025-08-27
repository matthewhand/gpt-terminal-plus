import Debug from 'debug';
import OpenAI from 'openai';
import { getResolvedLlmConfig } from '../config';
import { ChatMessage, ChatRequest, ChatResponse } from '../types';

const debug = Debug('app:llm:openai');

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const cfg = getResolvedLlmConfig();
    client = new OpenAI({
      apiKey: cfg.apiKey || process.env.OPENAI_API_KEY,
      baseURL: cfg.baseURL || undefined,
    });
  }
  return client;
}

export const toOpenAIChatMessages = (messages: ChatMessage[]) =>
  messages.map((m) => ({
    role: (m.role ?? 'user'),
    content: m.content,
  }));

export async function chatWithOpenAI(req: ChatRequest): Promise<ChatResponse> {
  const providerModel = req.model;
  debug('POST model=' + providerModel);
  const res = await getClient().chat.completions.create({
    model: providerModel,
    messages: toOpenAIChatMessages(req.messages) as any,
    stream: false,
  });
  const choice = res.choices[0]?.message;
  return {
    model: req.model,
    provider: 'openai',
    choices: [
      { index: 0, message: { role: choice?.role || 'assistant', content: choice?.content || '' } },
    ],
  };
}

export async function* chatWithOpenAIStream(req: ChatRequest): AsyncGenerator<string> {
  const providerModel = req.model;
  debug('STREAM POST model=' + providerModel);
  const stream = await getClient().chat.completions.create({
    model: providerModel,
    messages: toOpenAIChatMessages(req.messages) as any,
    stream: true,
  });
  for await (const chunk of stream as any) {
    const delta = chunk?.choices?.[0]?.delta?.content;
    if (delta) yield delta;
  }
}

export function getOpenAIClient(): OpenAI {
  return getClient();
}
