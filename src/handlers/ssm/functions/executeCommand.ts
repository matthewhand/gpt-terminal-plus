import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import Debug from "debug";
import { retryOperation } from "./retryOperation";
import { paginateOutput } from "./paginateOutput";

const debug = Debug("app:ssmUtils");
const DEFAULT_RETRIES = parseInt(process.env.SSM_RETRIES || "3");
const DEFAULT_WAIT_TIME = parseInt(process.env.SSM_WAIT_TIME || "5000");

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
  timeout: number = 60,
  directory?: string,
  retries: number = DEFAULT_RETRIES
): Promise<{ stdout?: string; stderr?: string; pages?: string[]; totalPages?: number; responseId?: string }> => {
  if (!command) {
    debug("Error: No command provided for execution.");
    throw new Error("No command provided for execution.");
  }

  debug("Executing command: " + command + " on instance: " + instanceId);
  const formattedCommand = documentName.includes("ShellScript")
    ? (directory ? "cd " + directory + "; " + command : command)
    : (directory ? "Set-Location -Path '" + directory + "'; " + command : command);

  const params: AWS.SSM.SendCommandRequest = {
    InstanceIds: [instanceId],
    DocumentName: documentName,
    Parameters: { "commands": [formattedCommand] },
    TimeoutSeconds: timeout,
  };

  return await retryOperation(async () => {
    const commandResponse = await ssmClient.sendCommand(params).promise();
    if (!commandResponse.Command || !commandResponse.Command.CommandId) {
      debug("Failed to retrieve command response or CommandId is undefined.");
      throw new Error("Failed to retrieve command response or CommandId is undefined.");
    }

    const result = await ssmClient.getCommandInvocation({
      CommandId: commandResponse.Command.CommandId,
      InstanceId: instanceId,
    }).promise();

    debug("Command status: " + result.Status);
    if (result && result.StandardOutputContent) {
      const pages = paginateOutput(result.StandardOutputContent);

      return {
        stdout: result.StandardOutputContent,
        stderr: result.StandardErrorContent,
        pages,
        totalPages: pages.length,
        responseId: uuidv4(),
      };
    } else {
      const errorMessage = "Command execution failed with status: " + result.Status + " for command: " + command + " on instance: " + instanceId;
      debug(errorMessage);
      throw new Error(errorMessage);
    }
  }, retries, DEFAULT_WAIT_TIME);
};
