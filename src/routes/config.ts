import express, { Request, Response } from 'express';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { convictConfig } from '../config/convictConfig';

const router = express.Router();
router.use(checkAuthToken as any);

/**
 * @swagger
 * /config/schema:
 *   get:
 *     operationId: getConfigSchema
 *     summary: Get configuration schema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuration schema
 */
router.get('/schema', (_: Request, res: Response) => {
  const cfg = convictConfig();
  res.json(cfg.getSchema());
});

/**
 * @swagger
 * /config/override:
 *   get:
 *     operationId: getConfigOverride
 *     summary: Get current configuration
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current configuration
 */
router.get('/override', (_: Request, res: Response) => {
  const cfg = convictConfig();
  res.json(cfg.getProperties());
});

/**
 * @swagger
 * /config/override:
 *   post:
 *     operationId: setConfigOverride
 *     summary: Update configuration
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Arbitrary configuration overrides
 *             properties:
 *               API_TOKEN:
 *                 type: string
 *                 description: Override API token (will be redacted in responses)
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Configuration updated
 *       400:
 *         description: Invalid configuration
 */
router.post('/override', (req: Request, res: Response) => {
  try {
    const cfg = convictConfig();
    
    // Handle API_TOKEN override
    if (req.body.API_TOKEN) {
      cfg.set('security.apiToken', req.body.API_TOKEN);
    }
    
    // Load provided overrides (may include unknown keys from Advanced Overrides)
    cfg.load(req.body);
    // Be permissive: warn on unknown keys instead of failing
    cfg.validate({ allowed: 'warn' });
    
    // Return redacted config
    const props = cfg.getProperties();
    if (props.security?.apiToken) { props.security.apiToken = '[REDACTED]'; }
    
    res.json({ success: true, config: props });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /config/settings:
 *   get:
 *     operationId: getConfigSettings
 *     summary: Get redacted configuration settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redacted configuration settings
 */
router.get('/settings', (_: Request, res: Response) => {
  const { getRedactedSettings } = require('../config/convictConfig');
  res.json(getRedactedSettings());
});

export default router;
