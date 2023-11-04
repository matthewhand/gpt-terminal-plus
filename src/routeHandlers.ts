import { app, commandTimeout, maxResponse, currentDirectory } from './serverConfig';
import { generateResponseId, setCurrentFolder, getAdvice, handleLocalCommand, checkServer } from './utilityFunctions';
import servers from './servers';

// ... (All the app.get, app.post, etc. route handlers)

export default app;
