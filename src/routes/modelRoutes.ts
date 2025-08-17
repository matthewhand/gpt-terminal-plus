import express, { Request, Response } from 'express';
import Debug from 'debug';
import { getDefaultModel } from '../common/models';
import { getResolvedLlmConfig } from '../common/llmConfig';
import { getLlmClient } from '../llm/client';
import { setSelectedModel } from '../utils/GlobalStateHelper';

const debug = Debug('app:modelRoutes');
const router = express.Router();

/**
 * GET /model
 * Returns supported models and the currently selected model.
 */
router.get('/', async (_req: Request, res: Response) => {
  const cfg = getResolvedLlmConfig();
  if (!cfg.enabled || cfg.provider === 'none') {
    return res.status(409).json({ error: { code: 'LLM_DISABLED', message: 'This instance isn\u2019t configured for LLM. Enable it in Setup \u2192 LLM.' } });
  }
  const client = getLlmClient();
  if (!client) {
    return res.status(503).json({ error: 'No LLM client available' });
  }
  let supported: string[] = [];
  let warning: string | undefined;
  if (client.listModels) {
    try { supported = await client.listModels(); } catch { supported = []; }
  } else {
    warning = 'Model listing not supported for provider';
  }
  const selected = getDefaultModel();
  const payload: any = { supported, selected };
  if (warning) payload.warning = warning;
  debug('Returning supported and selected models');
  res.status(200).json(payload);
});

/**
 * GET /model/selected
 * Returns the currently selected model only.
 */
router.get('/selected', (_req: Request, res: Response) => {
  const cfg = getResolvedLlmConfig();
  if (!cfg.enabled || cfg.provider === 'none') {
    return res.status(409).json({ error: { code: 'LLM_DISABLED', message: 'This instance isn\u2019t configured for LLM. Enable it in Setup \u2192 LLM.' } });
  }
  const client = getLlmClient();
  if (!client) {
    return res.status(503).json({ error: 'No LLM client available' });
  }
  const selected = getDefaultModel();
  debug('Returning selected model: ' + selected);
  res.status(200).json({ selected });
});

/**
 * POST /model/select
 * Body: { model: string }
 * Sets the selected model if supported.
 */
router.post('/select', async (req: Request, res: Response) => {
  const cfg = getResolvedLlmConfig();
  if (!cfg.enabled || cfg.provider === 'none') {
    return res.status(409).json({ error: { code: 'LLM_DISABLED', message: 'This instance isn\u2019t configured for LLM. Enable it in Setup \u2192 LLM.' } });
  }
  const client = getLlmClient();
  if (!client) {
    return res.status(503).json({ error: 'No LLM client available' });
  }
  const { model } = req.body || {};
  debug('Request to select model: ' + model);

  if (!model || typeof model !== 'string') {
    return res.status(400).json({ message: 'Invalid request. Missing "model" field.' });
  }

  if (client.listModels) {
    try {
      const available = await client.listModels();
      if (!available.includes(model)) {
        debug('Attempt to select unsupported model: ' + model);
        return res.status(400).json({ message: 'Unsupported model', model });
      }
    } catch {
      /* ignore */
    }
  }

  try {
    setSelectedModel(model);
    res.status(200).json({ message: 'Model selected', selected: model });
  } catch (error) {
    debug('Error selecting model: ' + String(error));
    res.status(500).json({ message: 'Error selecting model', error: (error as Error).message });
  }
});

export default router;

