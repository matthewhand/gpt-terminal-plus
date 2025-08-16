import express, { Request, Response } from 'express';
import Debug from 'debug';
import { getSelectedModel } from '../utils/GlobalStateHelper';
import { chat, chatStream } from '../llm';
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

    if (stream) {
      // SSE streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      // Initial connected comment for clients
      res.write(`: connected\n\n`);

      // Heartbeat keep-alive
      const heartbeatMs = Number(process.env.SSE_HEARTBEAT_MS || (process.env.NODE_ENV === 'test' ? 50 : 15000));
      const heartbeat = setInterval(() => {
        try { res.write(`: keep-alive\n\n`); } catch { /* ignore */ }
      }, isNaN(heartbeatMs) ? 15000 : heartbeatMs);

      // Cleanup on client disconnect
      const onClose = () => {
        clearInterval(heartbeat);
        try { res.end(); } catch { /* ignore */ }
      };
      // @ts-ignore
      (req as any).on?.('close', onClose);

      let sentAny = false;
      try {
        for await (const delta of chatStream({ model: selectedModel, messages: safeMessages, stream: true })) {
          sentAny = true;
          res.write(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: delta } }] })}\n\n`);
        }
      } catch (err) {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ message: (err as Error).message })}\n\n`);
      } finally {
        if (!sentAny) {
          res.write(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { content: '' } }] })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        clearInterval(heartbeat);
        res.end();
      }
    } else {
      const response = await chat({ model: selectedModel, messages: safeMessages, stream: false });
      res.status(200).json(response);
    }
  } catch (error) {
    debug('Chat completion error: ' + String(error));
    res.status(500).json({ message: 'Chat error', error: (error as Error).message });
  }
});

export default router;
