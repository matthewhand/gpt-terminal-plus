import { Router } from 'express';
import { startSession, executeInSession, stopSession, listSessions } from './session';
// import { authenticateToken } from '../../middlewares/authenticateToken';

const router = Router();

// Apply authentication to all shell session routes
// router.use(authenticateToken); // TODO: Add auth middleware

// Session lifecycle routes
router.post('/session/start', startSession);
router.post('/session/:id/exec', executeInSession);
router.post('/session/:id/stop', stopSession);
router.get('/session/list', listSessions);

export default router;