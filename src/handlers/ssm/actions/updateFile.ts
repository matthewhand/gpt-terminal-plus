import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import Debug from "debug";
import { escapeSpecialChars } from "../../../common/escapeSpecialChars";

const debug = Debug("app:ssmUtils");

/**
 * Updates a file on an SSM instance by replacing specified patterns.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} filePath - The path of the file to update.
 * @param {string} pattern - The text pattern to replace.
 * @param {string} replacement - The new text to replace the pattern.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was updated successfully.
 */
export const updateFile = async (
  ssmClient: SSMClient,
  instanceId: string,
  filePath: string,
  pattern: string,
  replacement: string,
  backup: boolean = true
): Promise<boolean> => {
  // Validate inputs
  if (!ssmClient || !(ssmClient instanceof SSMClient)) {
    const errorMessage = 'SSM client must be provided and must be an instance of SSMClient.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!instanceId || typeof instanceId !== 'string') {
    const errorMessage = 'Instance ID must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!filePath || typeof filePath !== 'string') {
    const errorMessage = 'File path must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!pattern || typeof pattern !== 'string') {
    const errorMessage = 'Pattern must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!replacement || typeof replacement !== 'string') {
    const errorMessage = 'Replacement must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  // Prepare the command with an optional backup
  const backupFlag = backup ? '.bak' : '';
  const escapedPattern = escapeSpecialChars(pattern);
  const escapedReplacement = escapeSpecialChars(replacement);
  const command = "sed -i" + backupFlag + " 's/" + escapedPattern + "/" + escapedReplacement + "/g' " + filePath;

  debug("Updating file with command: " + command);

  const result = await ssmClient.send(new SendCommandCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }));

  return !!result.Command;
};
