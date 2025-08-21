import { Router } from 'express';
// Temporarily disable shell routes to fix build
const router = Router();

// TODO: Re-enable shell session routes after fixing imports
// router.post('/session/start', startSession);
// router.post('/session/:id/exec', executeInSession);
// router.post('/session/:id/stop', stopSession);
// router.get('/session/list', listSessions);

export default router;