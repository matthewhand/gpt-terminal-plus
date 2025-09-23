import express, { Request, Response } from 'express';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { executeFileOperation } from '../engines/fileEngine';

const router = express.Router();
router.use(checkAuthToken as any);

/**
 * @swagger
 * /files/op:
 *   post:
 *     operationId: fileOperation
 *     summary: Execute file operation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [read, write, delete, list, mkdir]
 *               path:
 *                 type: string
 *               content:
 *                 type: string
 *               recursive:
 *                 type: boolean
 *             required:
 *               - type
 *               - path
 *     responses:
 *       200:
 *         description: Operation completed
 *       400:
 *         description: Invalid operation
 *       403:
 *         description: Path not allowed
 */
router.post('/op', async (req: Request, res: Response) => {
  try {
    const result = await executeFileOperation(req.body);

    if (!result?.success) {
      const message = result?.error || 'Unknown file operation error';
      if (/not allowed/i.test(message)) {
        return res.status(403).json({ message });
      }
      return res.status(400).json({ message });
    }

    res.json(result);
  } catch (err: any) {
    const message = err?.message || String(err);
    if (/not allowed/i.test(message)) {
      return res.status(403).json({ message });
    }
    res.status(400).json({ message });
  }
});

export default router;
