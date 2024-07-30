import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import Debug from "debug";

const debug = Debug("app:ssmUtils");

/**
 * Lists files in a directory on an SSM instance.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} [directory=""] - The directory to list files from.
 * @param {number} [limit=42] - The maximum number of files to return.
 * @param {number} [offset=0] - The offset for file listing.
 * @param {"filename" | "datetime"} [orderBy="filename"] - The criteria to order the files by.
 * @returns {Promise<any>} - The list of files.
 */
export const listFiles = async (
  ssmClient: SSMClient,
  instanceId: string,
  directory: string = "",
  limit: number = 42,
  offset: number = 0,
  orderBy: "filename" | "datetime" = "filename"
): Promise<any> => {
  const command = `ls -l ${directory} | tail -n +2 | awk '{print $9, $5, $6, $7}'`;
  debug("Listing files with command: " + command);
  const result = await ssmClient.send(new SendCommandCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }));
  return result.Command;
};
