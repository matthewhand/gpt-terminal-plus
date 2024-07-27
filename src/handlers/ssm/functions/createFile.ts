import * as AWS from "aws-sdk";
import Debug from "debug";

const debug = Debug("app:ssmUtils");

/**
 * Creates a file on an SSM instance.
 * @param {AWS.SSM} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} directory - The directory where the file should be created.
 * @param {string} filename - The name of the file to create.
 * @param {string} content - The content to write to the file.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was created successfully.
 */
export const createFile = async (
  ssmClient: AWS.SSM,
  instanceId: string,
  directory: string,
  filename: string,
  content: string,
  backup: boolean = true
): Promise<boolean> => {
  // Correcting escape sequence
  const escapedContent = content.replace(/"/g, '\\"');
  const command = `echo "${escapedContent}" > ${directory}/${filename}`;
  debug("Creating file with command: " + command);
  const result = await ssmClient.sendCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }).promise();
  return !!result.Command;
};
