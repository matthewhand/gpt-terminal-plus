import * as AWS from "aws-sdk";
import Debug from "debug";

const debug = Debug("app:ssmUtils");

/**
 * Updates a file on an SSM instance by replacing specified patterns.
 * @param {AWS.SSM} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} filePath - The path of the file to update.
 * @param {string} pattern - The text pattern to replace.
 * @param {string} replacement - The new text to replace the pattern.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was updated successfully.
 */
export const updateFile = async (
  ssmClient: AWS.SSM,
  instanceId: string,
  filePath: string,
  pattern: string,
  replacement: string,
  backup: boolean = true
): Promise<boolean> => {
  const command = `sed -i.bak s///g ${filePath}`;
  debug("Updating file with command: " + command);
  const result = await ssmClient.sendCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }).promise();
  return !!result.Command;
};

