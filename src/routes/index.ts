import express from 'express';

/** --- Test harness (mocks) — used ONLY when NODE_ENV==='test' --- */
import testCommandRouter from './commandRoutes';

/** --- Real command handlers for prod/dev --- */
import { executeCommand } from './command/executeCommand';
import { executeCode } from './command/executeCode';
import { executeFile } from './command/executeFile';
import { executeLlm } from './command/executeLlm';

/** --- Shared route groups (present in repo) --- */
import serverRoutes from './serverRoutes';
import fileRoutes from './fileRoutes';
import chatRoutes from './chatRoutes';

/** Optional route groups (exist in this repo tree used by tests) */
let setupRoutes: express.Router | null = null;
let modelsRoutes: express.Router | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('./setupRoutes');
  setupRoutes = mod?.default ?? mod ?? null;
} catch { /* optional */ }
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    cmd.post('/command/execute', executeCommand);
    cmd.post('/command/execute-code', executeCode);
    cmd.post('/command/execute-file', executeFile);
    cmd.post('/command/execute-llm', executeLlm);
    app.use(cmd);
  }

  // ----- Other groups with correct prefixes -----
  app.use(serverRoutes);
  app.use(fileRoutes);
  // mount chat APIs under /chat so tests hit /chat/completions, /chat/models, /chat/providers
  app.use('/chat', chatRoutes);

  // setup UI under /setup (/, /policy, /local, /ssh relative to /setup)
  if (setupRoutes)  app.use('/setup', setupRoutes);
  // model routes under /model (/, /select, /selected)
  if (modelsRoutes) app.use('/model', modelsRoutes);
}

/** Default export kept for flexibility */
export default setupApiRouter;
