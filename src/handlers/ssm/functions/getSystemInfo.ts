import { SSMClient, SendCommandCommand, GetCommandInvocationCommand } from "@aws-sdk/client-ssm";
import Debug from "debug";

const debug = Debug("app:ssmUtils");

/**
 * Gets system information from an SSM instance.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} shell - The shell to use (bash or powershell).
 * @param {string} scriptPath - The path to the system info script.
 * @returns {Promise<string>} - The system information as a string.
 */
export const getSystemInfo = async (
  ssmClient: SSMClient,
  instanceId: string,
  shell: string,
  scriptPath: string
): Promise<string> => {
  const command = shell === "bash" ? `sh ${scriptPath}` : `powershell -File ${scriptPath}`;

  const params = {
    InstanceIds: [instanceId],
    DocumentName: 'AWS-RunShellScript',
    Parameters: { commands: [command] },
  };

  try {
    const commandResponse = await ssmClient.send(new SendCommandCommand(params));
    if (!commandResponse.Command || !commandResponse.Command.CommandId) {
      debug("Failed to retrieve command response or CommandId is undefined.");
      throw new Error("Failed to retrieve command response or CommandId is undefined.");
    }

    const result = await ssmClient.send(new GetCommandInvocationCommand({
      CommandId: commandResponse.Command.CommandId,
      InstanceId: instanceId,
    }));

    debug("Command status: " + result.Status);
    if (result && result.StandardOutputContent) {
      return result.StandardOutputContent;
    } else {
      const errorMessage = `Command execution failed with status: ${result.Status} for instance: ${instanceId}`;
      debug(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(`Failed to get system info: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};
