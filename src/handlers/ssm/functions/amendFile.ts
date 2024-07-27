import * as AWS from "aws-sdk";
import Debug from "debug";

const debug = Debug("app:ssmUtils");

/**
 * Amends a file on an SSM instance by appending content to it.
 * @param {AWS.SSM} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} filePath - The path of the file to amend.
 * @param {string} content - The content to append to the file.
 * @returns {Promise<boolean>} - True if the file was amended successfully.
 */
export const amendFile = async (
  ssmClient: AWS.SSM,
  instanceId: string,
  filePath: string,
  content: string
): Promise<boolean> => {
  // Correcting escape sequence
  const escapedContent = content.replace(/"/g, '\\"');
  const command = `echo "${escapedContent}" >> ${filePath}`;
  debug("Amending file with command: " + command);
  const result = await ssmClient.sendCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }).promise();
  return !!result.Command;
};
