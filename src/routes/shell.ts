// Re-export from shell/index.ts for backwards compatibility
import router from './shell/index.js';
export default router;
export { handleShellWebSocket, sessionRouter } from './shell/index.js';
