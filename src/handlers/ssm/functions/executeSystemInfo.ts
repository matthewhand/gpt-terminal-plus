import * as AWS from "aws-sdk";

/**
 * Executes the command to get system information on an SSM instance.
 * @param {AWS.SSM} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @returns {Promise<string>} - The system information.
 */
export async function executeSystemInfo(ssmClient: AWS.SSM, instanceId: string): Promise<string> {
  const commandOutput = await ssmClient.sendCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: ["uname -a"]
    }
  }).promise();

  return commandOutput.StandardOutputContent;
}

