import * as fs from 'fs';
import * as path from 'path';

export function loadActions(dir: string) {
  const actions: { [key: string]: Function } = {};
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (file.endsWith('.ts')) {
      const actionName = path.basename(file, '.ts');
      const actionPath = path.join(dir, file);
      actions[actionName] = require(actionPath);
    }
  });

  return actions;
}
