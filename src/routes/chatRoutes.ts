import express, { Request, Response } from 'express';
import Debug from 'debug';
import { getSelectedModel } from '../utils/GlobalStateHelper';
import { chat } from '../llm';
import { ChatMessage } from '../llm/types';

const debug = Debug('app:chatRoutes');
const router = express.Router();

/**
 * POST /chat/completions
 * Body: { messages: {role, content}[], model?: string, stream?: boolean }
 */
router.post('/completions', async (req: Request, res: Response) => {
  try {
    const { messages, model, stream = false } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Invalid request. "messages" array is required.' });
    }

    const safeMessages: ChatMessage[] = messages.map((m: any) => ({
      role: m.role || 'user',
      content: String(m.content ?? '')
    }));

    const selectedModel = model || getSelectedModel();
    debug('Generating chat completion with model: ' + selectedModel);

    const response = await chat({ model: selectedModel, messages: safeMessages, stream });
    res.status(200).json(response);
  } catch (error) {
    debug('Chat completion error: ' + String(error));
    res.status(500).json({ message: 'Chat error', error: (error as Error).message });
  }
});

export default router;

