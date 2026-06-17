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
    delimiter = "EOF_" + Math.random().toString(36).substring(2, 8);
  }
  return delimiter;
};

/**
 * Creates a file on an SSM instance.
 * Optionally backs up the existing file if backup is enabled.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} directory - The directory where the file should be created.
 * @param {string} filename - The name of the file to create.
 * @param {string} content - The content to write to the file.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was created successfully.
 */
export const createFile = async (
  ssmClient: SSMClient,
  instanceId: string,
  filePath: string,
  content: string,
  backup: boolean = true
): Promise<boolean> => {
  const delimiter = generateUniqueDelimiter(content);

  // Backup existing file if backup is true
  const backupCommand = backup ? "[ -f " + filePath + " ] && cp " + filePath + " " + filePath + ".bak;" : '';
  
  const command = backupCommand + " cat <<'" + delimiter + "' > " + filePath + "\n" + content + "\n" + delimiter;
  
  debug("Creating file with command: " + command);
  
  const result = await ssmClient.send(new SendCommandCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }));
  
  return !!result.Command;
};
