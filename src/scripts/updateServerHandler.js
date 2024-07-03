const fs = require('fs');
const path = require('path');

const filePath = '/home/chatgpt/gpt-terminal-plus/src/handlers/ServerHandler.ts';
const oldContent = "const commands: CommandConfig[] = config.get('commands');";
const newContent = `const commands: CommandConfig[] = config.get('commands');
if (!Array.isArray(commands) || commands.length === 0) {
  throw new Error('No command configurations available.');
}`;

try {
  const fileData = fs.readFileSync(filePath, 'utf8');
  const updatedData = fileData.replace(oldContent, newContent);
  fs.writeFileSync(filePath, updatedData, 'utf8');
  console.log('File updated successfully');
} catch (error) {
  console.error('Error updating file:', error);
}
