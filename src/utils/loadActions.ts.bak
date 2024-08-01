import * as fs from 'fs';
import * as path from 'path';
import debug from 'debug';

const loadActionsDebug = debug('app:loadActions');

/**
 * Loads action modules from the specified directory.
 * @param dir - The directory containing action modules.
 * @returns An object containing the loaded actions.
 */
export function loadActions(dir: string): { [key: string]: Function } {
  const actions: { [key: string]: Function } = {};

  // Input validation
  if (!dir || typeof dir !== 'string') {
    const errorMessage = 'Directory path must be provided and must be a string.';
    loadActionsDebug(errorMessage);
    throw new Error(errorMessage);
  }

  loadActionsDebug(`Loading actions from directory: ${dir}`);

  // Read directory contents
  const files = fs.readdirSync(dir);

  // Load action modules from TypeScript files
  files.forEach((file) => {
    if (file.endsWith('.ts')) {
      const actionName = path.basename(file, '.ts');
      const actionPath = path.join(dir, file);
      const actionModule = require(actionPath);

      // Assign each exported function to the actions object
      Object.keys(actionModule).forEach((key) => {
        actions[key] = actionModule[key];
        loadActionsDebug(`Loaded action: ${key} from file: ${file}`);
      });
    }
  });

  loadActionsDebug(`Total actions loaded: ${Object.keys(actions).length}`);
  return actions;
}
