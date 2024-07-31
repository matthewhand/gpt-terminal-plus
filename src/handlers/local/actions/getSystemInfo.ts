import { executeLocalSystemInfoScript } from "../../../common/executeSystemInfoScript";
import { SystemInfo } from "../../../types/SystemInfo";
import Debug from 'debug';

const debug = Debug('app:getSystemInfo');

/**
 * Retrieves system information from the localhost using the specified shell and script.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<SystemInfo>} - The system information.
 */
export async function getSystemInfo(shell: string, scriptPath: string): Promise<SystemInfo> {
  // Validate inputs
  if (!shell || typeof shell !== 'string') {
    const errorMessage = 'Shell must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!scriptPath || typeof scriptPath !== 'string') {
    const errorMessage = 'Script path must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  debug('Retrieving system information with shell: ' + shell + ', scriptPath: ' + scriptPath);
  const rawSystemInfo = await executeLocalSystemInfoScript(shell, scriptPath);

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
}
