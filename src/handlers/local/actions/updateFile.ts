import fs from 'fs';

export function updateFile(
  filePath: string,
  pattern: string,
  replacement: string,
  multiline: boolean
): boolean {
  if (!filePath || typeof filePath !== 'string') throw new Error('Invalid file path');
  if (!pattern || typeof pattern !== 'string') throw new Error('Invalid pattern');
  if (!replacement || typeof replacement !== 'string') throw new Error('Invalid replacement');
  if (!fs.existsSync(filePath)) throw new Error('File not found');

  const content = fs.readFileSync(filePath, 'utf8');
  const regex = multiline ? new RegExp(pattern, 'gm') : new RegExp(pattern, 'g');
  const updated = content.replace(regex, replacement);
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

export default { updateFile };
