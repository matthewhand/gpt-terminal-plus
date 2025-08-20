import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";

/**
 * Executes a system info command on an SSM instance.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - The system info as a string.
 */
export async function executeSystemInfo(
  ssmClient: SSMClient,
  instanceId: string,
  command: string
): Promise<string> {
  const params = {
    InstanceIds: [instanceId],
    DocumentName: 'AWS-RunShellScript',
    Parameters: { commands: [command] }
  };

  try {
    const commandOutput = await ssmClient.send(new SendCommandCommand(params));
    return commandOutput.Command?.StatusDetails || '';
  } catch (error) {
    console.error(`Failed to execute system info command: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
