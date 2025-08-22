import { Router } from 'express';
import sessionRoutes from './session';
import llmIntegrationRoutes from './llmIntegration';

const router = Router();

router.use('/session', sessionRoutes);
router.use('/llm', llmIntegrationRoutes);

export default router;