import express, { Request, Response } from 'express';
import Debug from 'debug';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { getRedactedSettings } from '../config/convictConfig';

const debug = Debug('app:settingsRoutes');
const router = express.Router();

// Secure settings endpoints with bearer token auth
router.use(checkAuthToken as any);

/**
 * GET /settings
 * @swagger
 * /settings:
 *   get:
 *     operationId: getSettings
 *     summary: Get redacted configuration settings
 *     description: Returns grouped configuration values with secrets redacted. Values overridden by environment variables are marked as readOnly.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redacted settings grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 server:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 security:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 llm:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 compat:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *               required: [server, security, llm, compat]
 *             examples:
 *               sample:
 *                 summary: Example response
 *                 value:
 *                   server:
 *                     port:
 *                       value: 5005
 *                       readOnly: false
 *                     httpsEnabled:
 *                       value: false
 *                       readOnly: false
 *                   security:
 *                     apiToken:
 *                       value: "*****"
 *                       readOnly: true
 *                   llm:
 *                     provider:
 *                       value: "openai"
 *                       readOnly: false
 *                     "openai.baseUrl":
 *                       value: ""
 *                       readOnly: false
 *                     "openai.apiKey":
 *                       value: "*****"
 *                       readOnly: true
 *                   compat:
 *                     llmProvider:
 *                       value: ""
 *                       readOnly: false
 */
/**
 * GET /settings
 * @swagger
 * /settings:
 *   get:
 *     operationId: getSettings
 *     summary: Get redacted configuration settings
 *     description: Returns grouped configuration values with secrets redacted. Values overridden by environment variables are marked as readOnly.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redacted settings grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 server:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 security:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 llm:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 compat:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *               required: [server, security, llm, compat]
 *             examples:
 *               sample:
 *                 summary: Example response
 *                 value:
 *                   server:
 *                     port:
 *                       value: 5005
 *                       readOnly: false
 *                     httpsEnabled:
 *                       value: false
 *                       readOnly: false
 *                   security:
 *                     apiToken:
 *                       value: "*****"
 *                       readOnly: true
 *                   llm:
 *                     provider:
 *                       value: "openai"
 *                       readOnly: false
 *                     "openai.baseUrl":
 *                       value: ""
 *                       readOnly: false
 *                     "openai.apiKey":
 *                       value: "*****"
 *                       readOnly: true
 *                   compat:
 *                     llmProvider:
 *                       value: ""
 *                       readOnly: false
 */
router.get('/settings', (_req: Request, res: Response) => {
  try {
    const payload = getRedactedSettings();
    res.status(200).json(payload);
  } catch (err: any) {
    debug('Error generating redacted settings: %s', err?.message ?? err);
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
});

/**
 * POST /settings
 * Update configuration settings (runtime only, not persisted)
 */
router.post('/settings', (req: Request, res: Response) => {
  try {
    const { convictConfig } = require('../config/convictConfig');
    const cfg = convictConfig();
    const updates = req.body || {};
    
    // Apply updates to runtime config
    for (const [key, value] of Object.entries(updates)) {
      try {
        cfg.set(key, value);
      } catch (err: any) {
        debug(`Failed to set ${key}: ${err.message}`);
        return res.status(400).json({ error: 'invalid_setting', key, message: err.message });
      }
    }
    
    // Validate the updated config
    cfg.validate({ allowed: 'warn' });
    
    res.status(200).json({ message: 'Settings updated successfully', updated: Object.keys(updates) });
  } catch (err: any) {
    debug('Error updating settings: %s', err?.message ?? err);
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
});

export default router;
