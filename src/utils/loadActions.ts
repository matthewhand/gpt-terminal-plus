import * as fs from 'fs';
import * as path from 'path';
import debug from 'debug';

const loadActionsDebug = debug('app:loadActions');

export function loadActions(dir: string) {
  const actions: { [key: string]: Function } = {};
  const files = fs.readdirSync(dir);

  loadActionsDebug(`Loading actions from directory: ${dir}`);

  files.forEach((file) => {
    if (file.endsWith('.ts')) {
      const actionName = path.basename(file, '.ts');
      const actionPath = path.join(dir, file);
      const actionModule = require(actionPath);
      
      Object.keys(actionModule).forEach((key) => {
        actions[key] = actionModule[key];
        loadActionsDebug(`Loaded action: ${key} from file: ${file}`);
      });
    }
  });

  loadActionsDebug(`Total actions loaded: ${Object.keys(actions).length}`);
  return actions;
}
