import { Router } from 'express';
import llmIntegrationRoutes from './llmIntegration';

const router = Router();

router.use('/llm', llmIntegrationRoutes);

export default router;
