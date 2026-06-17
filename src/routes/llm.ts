import express, { Request, Response } from 'express';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { planCommand } from '../engines/llmEngine';

const router = express.Router();
router.use(checkAuthToken as any);

/**
 * @swagger
 * /llm/plan:
 *   post:
 *     operationId: llmPlan
 *     summary: Plan command using LLM
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *             required:
 *               - input
 *     responses:
 *       200:
 *         description: Command planned
 *       400:
 *         description: Input required
 *       429:
 *         description: Budget exceeded
 */
router.post('/plan', async (req: Request, res: Response) => {
  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ message: 'input required' });
  }
  
  try {
    const result = await planCommand(input);
    res.json(result);
  } catch (err: any) {
    if (err.message.includes('budget exceeded')) {
      return res.status(429).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

export default router;