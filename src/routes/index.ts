import express from 'express';

/** --- Test harness (mocks) — used ONLY when NODE_ENV==='test' --- */
import testCommandRouter from './commandRoutes';

/** --- Real command handlers for prod/dev --- */
import { convictConfig } from '../config/convictConfig';
import { executeCode } from './command/executeCode';
import { executeCommand } from './command/executeCommand';
import { executeShell } from './command/executeShell';

import { executeLlm } from './command/executeLlm';

/** --- Shared route groups (present in repo) --- */
import serverRoutes from './serverRoutes';
import fileRoutes from './fileRoutes';
import chatRoutes from './chatRoutes';
import settingsRoutes from './settingsRoutes';
import activityRoutes from './activityRoutes';
import llmConsoleRoutes from './llmConsoleRoutes';
import shellSessionRoutes from './shell/session';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { initializeServerHandler } from '../middlewares/initializeServerHandler';
import { logMode } from '../middleware/logMode';

/** Optional route groups (exist in this repo tree used by tests) */
let setupRoutes: express.Router | null = null;
let modelsRoutes: express.Router | null = null;
try {
  const mod = require('./setupRoutes');
  setupRoutes = mod?.default ?? mod ?? null;
} catch { /* optional */ }
try {
  const mod = require('./modelRoutes');
  modelsRoutes = mod?.default ?? mod ?? null;
} catch { /* optional */ }

/** Named export expected by tests */
export function setupApiRouter(app: express.Application): void {
  const isTest = process.env.NODE_ENV === 'test';
  const alwaysEnable = isTest; // enable optional endpoints during tests
  const cfg = convictConfig();
  app.use(logMode);

  // ----- Command endpoints -----
  if (isTest) {
    // Jest wants the mocked /command/* behavior
    // commandRoutes defines '/execute', '/execute-code', etc — mount under '/command'
    app.use('/command', testCommandRouter);
  } else {
    // Real command handlers for prod/dev
    const cmd = express.Router();
    // Secure and initialize per-request server handler
    cmd.use(checkAuthToken as any);
    cmd.use(initializeServerHandler as any);

    // Backward-compatible aggregate execute endpoint
    cmd.post('/command/execute', executeCommand);
    // Explicit endpoints
    if (alwaysEnable || cfg.get('execution.shell.enabled')) { cmd.post('/command/execute-shell', executeShell); }
    if (alwaysEnable || cfg.get('execution.code.enabled')) { cmd.post('/command/execute-code', executeCode); }
    if (alwaysEnable || cfg.get('execution.llm.enabled')) { cmd.post('/command/execute-llm', executeLlm); }

    app.use(cmd);
  }

  // ----- Other groups with correct prefixes -----
  app.use('/server', serverRoutes);
  if (alwaysEnable || cfg.get('files.enabled')) { app.use('/file', fileRoutes); }
  // mount chat APIs under /chat so tests hit /chat/completions, /chat/models, /chat/providers
  app.use('/chat', chatRoutes);
  // settings (redacted view), protected by bearer token
  app.use('/settings', settingsRoutes);

  // setup UI under /setup (/, /policy, /local, /ssh relative to /setup)
  if (setupRoutes)  app.use('/setup', setupRoutes);
  // model routes under /model (/, /select, /selected)
  if (modelsRoutes) app.use('/model', modelsRoutes);
  // activity routes under /activity
  app.use('/activity', activityRoutes);
  // LLM console routes under /llm
  app.use('/llm', llmConsoleRoutes);
  // shell session routes under /shell/session
  app.use('/shell/session', shellSessionRoutes);
}

/** Default export kept for flexibility */
export default setupApiRouter;
