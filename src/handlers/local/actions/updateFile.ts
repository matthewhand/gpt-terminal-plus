import fs from 'fs';
import { escapeRegExp } from '../../../utils/escapeRegExp';

export function updateFile(filePath: string, pattern: string, replacement: string, multiline: boolean): boolean {
  // Validate inputs
  if (!filePath?.trim()) {
    throw new Error('Invalid file path');
  }

  if (!pattern?.trim()) {
    throw new Error('Invalid pattern');
  }

  if (replacement === undefined || replacement === null || replacement === '') {
    throw new Error('Invalid replacement');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }

  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf-8');

    // Create regex pattern
    const flags = multiline ? 'gm' : 'g';
    const regex = new RegExp(escapeRegExp(pattern), flags);

    // Perform replacement
    const newContent = content.replace(regex, replacement);

    // Write updated content
    fs.writeFileSync(filePath, newContent);
    return true;
  } catch (error) {
    throw new Error(`File update failed: ${(error as Error).message}`);
  }
}
