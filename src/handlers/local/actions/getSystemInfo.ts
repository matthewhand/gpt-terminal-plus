import { getScriptPath } from '../../../utils/remoteSystemInfo';
import { exec } from 'child_process';
import { SystemInfo } from '../../../types/SystemInfo';
import Debug from 'debug';
import util from 'util';
import path from 'path';
import fs from 'fs';

const debug = Debug('app:getSystemInfo');
const execPromise = util.promisify(exec);

/**
 * Retrieves system information from the localhost using the specified shell and script.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @returns {Promise<SystemInfo>} - The system information.
 */
export async function getSystemInfo(shell: string): Promise<SystemInfo> {
  // Validate inputs
  if (!shell || typeof shell !== 'string') {
    const errorMessage = 'Shell must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  debug('Retrieving system information with shell: ' + shell);

  const scriptContent = getScriptContent(shell);
  debug('Script content: ' + scriptContent);

  let command: string;
  switch (shell) {
    case 'powershell':
      command = `powershell -Command "${scriptContent.replace(/"/g, '\"')}"`;
      break;
    case 'python':
      command = `python -c "${scriptContent.replace(/"/g, '\"')}"`;
      break;
    case 'bash':
    default:
      command = `bash -c "${scriptContent.replace(/"/g, '\"')}"`;
      break;
  }

  debug('Executing command: ' + command);

  try {
    const { stdout } = await execPromise(command);
    const rawSystemInfo = stdout;

    const parsedInfo = rawSystemInfo.trim().split('\n').reduce((acc: { [key: string]: string }, line) => {
      const parts = line.split(':');
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      acc[key] = value;
      return acc;
    }, {});

    // Map the parsed data to match the SystemInfo type
    const systemInfoObj: SystemInfo = {
      homeFolder: parsedInfo["homeFolder"],
      type: parsedInfo["type"],
      release: parsedInfo["release"],
      platform: parsedInfo["platform"],
      architecture: parsedInfo["architecture"],
      totalMemory: Number(parsedInfo["totalMemory"]),
      freeMemory: Number(parsedInfo["freeMemory"]),
      uptime: Number(parsedInfo["uptime"]),
      currentFolder: parsedInfo["currentFolder"]
    };

    debug('Retrieved system information: ' + JSON.stringify(systemInfoObj));
    return systemInfoObj;

  } catch (error: unknown) {
    if (error instanceof Error) {
      debug('Error retrieving system information: ' + error.message);
      throw new Error('Error retrieving system information: ' + error.message);
    }
    debug('Unknown error retrieving system information');
    throw new Error('Unknown error retrieving system information');
  }
}

/**
 * Retrieve the script content based on the shell type.
 * @param shell - The shell type.
 * @returns The content of the script.
 */
function getScriptContent(shell: string): string {
  let scriptFilePath: string;
  switch (shell) {
    case 'powershell':
      scriptFilePath = getScriptPath('powershell');
      break;
    case 'python':
      scriptFilePath = getScriptPath('python');
      break;
    case 'bash':
    default:
      scriptFilePath = getScriptPath('bash');
scriptFilePath = path.join(__dirname, '../../../scripts/remote_system_info.ts');      scriptFilePath = path.join(__dirname, '../../../scripts/remote_system_info.js');
      break;
  }
  debug(`Loading script content from: ${scriptFilePath}`);
  return fs.readFileSync(scriptFilePath, 'utf8');
}
