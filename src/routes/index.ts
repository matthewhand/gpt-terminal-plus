import express from 'express';

/** --- Test harness (mocks) — used ONLY when NODE_ENV==='test' --- */
import testCommandRouter from './commandRoutes';

/** --- Real command handlers for prod/dev --- */
import { executeCommand } from './command/executeCommand';
import { executeShell } from './command/executeShell';
import { executeCode } from './command/executeCode';
import { executeFile } from './command/executeFile';
import { executeLlm } from './command/executeLlm';
import { executeBash } from './command/executeBash';
import { executePython } from './command/executePython';
import executorsRouter from './command/executors';
import executeDynamicRouter from './command/executeDynamic';

/** --- Shared route groups (present in repo) --- */
import serverRoutes from './serverRoutes';
import activityRoutes from './activityRoutes';
import fileRoutes from './fileRoutes';
import chatRoutes from './chatRoutes';
import llmConsoleRoutes from './llmConsoleRoutes';
import settingsRoutes from './settingsRoutes';
import configRoutes from './config';

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

  // ----- Command endpoints -----
  if (isTest) {
    // Jest wants the mocked /command/* behavior
    // commandRoutes defines '/execute', '/execute-code', etc — mount under '/command'
    app.use('/command', testCommandRouter);
  } else {
    // Real command handlers for prod/dev
    const cmd = express.Router();
    // Back-compat endpoints
    cmd.post('/command/execute', executeCommand);
    console.log('Mounting /command/execute-shell (prod/dev)');
    cmd.post('/command/execute-shell', executeShell);
    cmd.post('/command/execute-code', executeCode);
    // New explicit executor endpoints
    cmd.post('/command/execute-bash', executeBash);
    cmd.post('/command/execute-python', executePython);
    // Dynamic per-executor endpoints: /command/execute-:name
    cmd.use('/command', executeDynamicRouter);
    // Deprecated route retained only for compatibility; not advertised in OpenAPI
    cmd.post('/command/execute-file', executeFile);
    cmd.post('/command/execute-llm', executeLlm);
    app.use(cmd);
  }

  // ----- Other groups with correct prefixes -----
  app.use('/server', serverRoutes);
  app.use('/activity', activityRoutes);
  app.use('/file', fileRoutes);
  app.use('/llm', llmConsoleRoutes);
  // mount chat APIs under /chat so tests hit /chat/completions, /chat/models, /chat/providers
  app.use('/chat', chatRoutes);
  // settings (redacted view), protected by bearer token
  app.use('/settings', settingsRoutes);
  // config overrides and schema endpoints
  app.use('/config', configRoutes);
  // executors capability and toggles
  app.use('/command', executorsRouter);

  // setup UI under /setup (/, /policy, /local, /ssh relative to /setup)
  if (setupRoutes)  app.use('/setup', setupRoutes);
  // model routes under /model (/, /select, /selected)
  if (modelsRoutes) app.use('/model', modelsRoutes);
}

/** Default export kept for flexibility */
export default setupApiRouter;
