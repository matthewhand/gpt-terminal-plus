import express, { Request, Response } from 'express';
import Debug from 'debug';
import { getSupportedModels, isSupportedModel } from '../common/models';
import { getSelectedModel, setSelectedModel } from '../utils/GlobalStateHelper';

const debug = Debug('app:modelRoutes');
const router = express.Router();

/**
 * GET /model
 * Returns supported models and the currently selected model.
 */
router.get('/', (_req: Request, res: Response) => {
  const supported = getSupportedModels();
  const selected = getSelectedModel();
  debug('Returning supported and selected models');
  res.status(200).json({ supported, selected });
});

/**
 * GET /model/selected
 * Returns the currently selected model only.
 */
router.get('/selected', (_req: Request, res: Response) => {
  const selected = getSelectedModel();
  debug('Returning selected model: ' + selected);
  res.status(200).json({ selected });
});

/**
 * POST /model/select
 * Body: { model: string }
 * Sets the selected model if supported.
 */
router.post('/select', (req: Request, res: Response) => {
  const { model } = req.body || {};
  debug('Request to select model: ' + model);

  if (!model || typeof model !== 'string') {
    return res.status(400).json({ message: 'Invalid request. Missing "model" field.' });
  }

  if (!isSupportedModel(model)) {
    debug('Attempt to select unsupported model: ' + model);
    return res.status(400).json({ message: 'Unsupported model', model });
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

