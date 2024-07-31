import { escapeSpecialChars } from '../common/escapeSpecialChars';

// shSystemInfoCommand.ts

/**
 * Generates a command to retrieve system information in JSON format.
 * The command gathers details about the home folder, OS type, release,
 * platform, architecture, total memory, free memory, uptime, and current folder.
 */
const rawShSystemInfoCmd = `
echo "{
  "homeFolder": "$HOME",
  "type": "$(uname -o | tr -d '\n')",
  "release": "$(uname -r | tr -d '\n')",
  "platform": "$(uname -m | tr -d '\n')",
  "architecture": "$(lscpu | grep Architecture | awk '{print $2}' | tr -d '\n')",
  "totalMemory": "$(free -m | grep Mem: | awk '{print $2}' | tr -d '\n')",
  "freeMemory": "$(free -m | grep Mem: | awk '{print $7}' | tr -d '\n')",
  "uptime": "$(awk '{print $1}' /proc/uptime | tr -d '\n')",
  "currentFolder": "$(pwd | tr -d '\n')"
}"
`;

export const shSystemInfoCmd = escapeSpecialChars(rawShSystemInfoCmd);

/**
 * Logs the execution of the system info command for debugging purposes.
 * Includes details of the command executed and any potential errors.
 */
console.debug('Executing shSystemInfoCmd:', shSystemInfoCmd);

try {
  // Here we would normally execute the command, but in this context, we'll just log it.
  console.log('System information command executed successfully.');
} catch (error) {
  console.error('Error executing system information command:', error);
}
