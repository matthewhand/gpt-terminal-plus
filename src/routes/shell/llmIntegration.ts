import express, { Request, Response } from 'express';
import { checkAuthToken } from '../../middlewares/checkAuthToken';
import { planCommand } from '../../engines/llmEngine';
import { spawn } from 'child_process';

const router = express.Router();
router.use(checkAuthToken as any);

/**
 * @swagger
 * /shell/llm/plan-exec:
 *   post:
 *     operationId: shellLlmPlanExec
 *     summary: Plan and optionally execute command via LLM
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
 *               autoExecute:
 *                 type: boolean
 *             required:
 *               - input
 *     responses:
 *       200:
 *         description: Command planned/executed
 *       400:
 *         description: Input required
 *       429:
 *         description: Budget exceeded
 */
router.post('/plan-exec', async (req: Request, res: Response) => {
  const { input, autoExecute = false } = req.body;
  
  if (!input) {
    return res.status(400).json({ message: 'input required' });
  }
  
  try {
    const plan = await planCommand(input);
    
    if (!plan.command) {
      return res.json({ plan, executed: false });
    }
    
    // Check if auto-execution is allowed
    const shouldExecute = autoExecute && !plan.needsApproval;
    
    if (!shouldExecute) {
      return res.json({ plan, executed: false, needsApproval: plan.needsApproval });
    }
    
    // Execute the planned command
    const child = spawn('bash', ['-c', plan.command]);
    const logs: any[] = [];
    
    child.stdout.on('data', (data) => {
      logs.push({ stream: 'stdout', data: data.toString() });
    });
    
    child.stderr.on('data', (data) => {
      logs.push({ stream: 'stderr', data: data.toString() });
    });
    
    child.on('close', (code) => {
      const stdout = logs.filter(l => l.stream === 'stdout').map(l => l.data).join('');
      const stderr = logs.filter(l => l.stream === 'stderr').map(l => l.data).join('');
      
      res.json({
        plan,
        executed: true,
        result: { stdout, stderr, exitCode: code ?? -1 }
      });
    });
    
  } catch (err: any) {
    if (err.message.includes('budget exceeded')) {
      return res.status(429).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

export default router;