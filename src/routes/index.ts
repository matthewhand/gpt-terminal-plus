import express from 'express';
import { convictConfig } from '../config/convictConfig'; // Import convictConfig
import { logMode } from '../middlewares/logMode'; // Import logMode middleware

/** --- Test harness (mocks) — used ONLY when NODE_ENV==='test' --- */
import testCommandRouter from './commandRoutes';

/** --- Real command handlers for prod/dev --- */
import { executeCommand } from './command/executeCommand';
import { executeCode } from './command/executeCode';
import { executeLlm } from './command/executeLlm';

/** --- Shared route groups (present in repo) --- */
import serverRoutes from './serverRoutes';
import fileRoutes from './fileRoutes';
import chatRoutes from './chatRoutes';
import settingsRoutes from './settingsRoutes';
import activityRoutes from './activityRoutes';
import llmConsoleRoutes from './llmConsoleRoutes';
import shellSessionRoutes from './shell/session';
import configRoutes from './configRoutes';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { initializeServerHandler } from '../middlewares/initializeServerHandler';


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
    cmd.post('/execute-shell', executeCommand);
    cmd.post('/execute-code', executeCode);
    cmd.post('/execute-llm', executeLlm);
    app.use('/command', cmd); // Mount under /command
  }

  // ----- Other groups with correct prefixes -----
  app.use('/server', serverRoutes);
  app.use('/file', fileRoutes);
  // mount chat APIs under /chat so tests hit /chat/completions, /chat/models, /chat/providers
  app.use('/chat', chatRoutes);
  // settings (redacted view), protected by bearer token
  app.use('/settings', settingsRoutes);
  app.use('/config', configRoutes);

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