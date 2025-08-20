import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import Debug from "debug";

const debug = Debug("app:ssmUtils");

/**
 * Generates a unique delimiter for the EOF marker.
 * @param {string} content - The content to check against.
 * @returns {string} - A unique delimiter.
 */
const generateUniqueDelimiter = (content: string): string => {
  let delimiter = "EOF";
  while (content.includes(delimiter)) {
    delimiter = `EOF_${Math.random().toString(36).substring(2, 8)}`;
  }
  return delimiter;
};

/**
 * Amends a file on an SSM instance by appending content to it.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} filePath - The path of the file to amend.
 * @param {string} content - The content to append to the file.
 * @returns {Promise<boolean>} - True if the file was amended successfully.
 */
export const amendFile = async (
  ssmClient: SSMClient,
  instanceId: string,
  filePath: string,
  content: string
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
  if (!content || typeof content !== 'string') {
    const errorMessage = 'Content must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  const delimiter = generateUniqueDelimiter(content);
  const command = `cat <<'${delimiter}' >> ${filePath}\n${content}\n${delimiter}`;
  debug("Amending file with command: " + command);
  const result = await ssmClient.send(new SendCommandCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }));
  return !!result.Command;
};
