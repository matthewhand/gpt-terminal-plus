import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import Debug from 'debug';

const debug = Debug('app:ssmUtils');

const DEFAULT_RETRIES = parseInt(process.env.SSM_RETRIES || '3');
const DEFAULT_WAIT_TIME = parseInt(process.env.SSM_WAIT_TIME || '5000');

/**
 * Determines the appropriate script file extension based on the server's shell configuration.
 * @param {string} shell - The shell environment.
 * @returns {string} The file extension as a string.
 */
export const determineScriptExtension = (shell: string): string => {
  switch (shell) {
    case 'powershell': return '.ps1';
    case 'python': return '.py';
    default: return '.sh';
  }
};

/**
 * Generates the command to execute a script file based on the server's shell environment.
 * @param {string} shell - The shell environment.
 * @param {string} filePath - The path of the script file to execute.
 * @returns {string} The command string to execute the file.
 */
export const getExecuteCommand = (shell: string, filePath: string): string => {
  switch (shell) {
    case 'powershell': return `Powershell -File ${filePath}`;
    case 'python': return `python ${filePath}`;
    default: return `bash ${filePath}`;
  }
};

/**
 * Executes a command on an SSM instance with retry logic.
 * @param {AWS.SSM} ssmClient - The SSM client.
 * @param {string} command - The command to execute.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} documentName - The name of the SSM document.
 * @param {number} [timeout=60] - The timeout in seconds.
 * @param {string} [directory] - The directory to execute the command from.
 * @param {number} [retries=DEFAULT_RETRIES] - The number of retries.
 * @returns {Promise<{stdout?: string, stderr?: string, pages?: string[], totalPages?: number, responseId?: string}>} The command output details.
 */
export const executeCommand = async (
  ssmClient: AWS.SSM,
  command: string,
  instanceId: string,
  documentName: string,
  timeout: number = 60,  // Increased default timeout
  directory?: string,
  retries: number = DEFAULT_RETRIES    // Default retries set to 3
): Promise<{ stdout?: string; stderr?: string; pages?: string[]; totalPages?: number; responseId?: string }> => {
  if (!command) {
    debug(`Error: No command provided for execution.`);
    throw new Error('No command provided for execution.');
  }

  debug(`Executing command: ${command} on instance: ${instanceId}`);
  const formattedCommand = documentName.includes('ShellScript')
    ? (directory ? `cd ${directory}; ${command}` : command)
    : (directory ? `Set-Location -Path '${directory}'; ${command}` : command);

  const params: AWS.SSM.SendCommandRequest = {
    InstanceIds: [instanceId],
    DocumentName: documentName,
    Parameters: { 'commands': [formattedCommand] },
    TimeoutSeconds: timeout
  };

  return await retryOperation(async () => {
    const commandResponse = await ssmClient.sendCommand(params).promise();
    if (!commandResponse.Command || !commandResponse.Command.CommandId) {
      debug(`Failed to retrieve command response or CommandId is undefined.`);
      throw new Error('Failed to retrieve command response or CommandId is undefined.');
    }

    const result = await ssmClient.getCommandInvocation({
      CommandId: commandResponse.Command.CommandId,
      InstanceId: instanceId,
    }).promise();

    debug(`Command status: ${result.Status}`);
    if (result && result.StandardOutputContent) {
      const pages = paginateOutput(result.StandardOutputContent);

      return {
        stdout: result.StandardOutputContent,
        stderr: result.StandardErrorContent,
        pages,
        totalPages: pages.length,
        responseId: uuidv4()
      };
    } else {
      const errorMessage = `Command execution failed with status: ${result.Status} for command: ${command} on instance: ${instanceId}`;
      debug(errorMessage);
      throw new Error(errorMessage);
    }
  }, retries, DEFAULT_WAIT_TIME);
};

/**
 * Handles retry logic for an operation.
 * @param {Function} operation - The operation to retry.
 * @param {number} retries - The number of retries.
 * @param {number} waitTime - The wait time between retries in milliseconds.
 * @returns {Promise<any>} The result of the operation.
 */
const retryOperation = async (operation: Function, retries: number, waitTime: number) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= retries - 1) {
        debug(`Operation failed after ${retries} attempts.`);
        throw error;
      }
      attempt++;
      debug(`Attempt ${attempt + 1}/${retries}: Operation failed, retrying in ${waitTime}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

/**
 * Paginates the command output.
 * @param {string} stdout - The standard output from the command.
 * @param {number} [linesPerPage=100] - The number of lines per page.
 * @returns {string[]} An array of strings representing paginated output.
 */
const paginateOutput = (stdout: string, linesPerPage: number = 100): string[] => {
  const pages: string[] = [];
  if (stdout) {
    const lines = stdout.split('\n');
    for (let i = 0; i < lines.length; i += linesPerPage) {
      pages.push(lines.slice(i, i + linesPerPage).join('\n'));
    }
  }
  return pages;
};

/**
 * Creates a temporary script file on the server.
 * @param {string} scriptContent - The content of the script to create.
 * @param {string} scriptExtension - The file extension for the script.
 * @param {string} directory - The directory to create the script in.
 * @returns {Promise<string>} The path to the created script file.
 */
export const createTempScript = async (
  scriptContent: string,
  scriptExtension: string,
  directory: string
): Promise<string> => {
  const tempFileName = `${uuidv4()}${scriptExtension}`;
  const tempFilePath = path.join(directory, tempFileName);
  debug(`Creating temporary script at: ${tempFilePath}`);
  fs.writeFileSync(tempFilePath, scriptContent, { mode: 0o700 }); // Setting secure permissions
  return tempFilePath;
};
