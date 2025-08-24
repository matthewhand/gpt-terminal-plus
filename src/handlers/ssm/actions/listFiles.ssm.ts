import { SSMClient, SendCommandCommand, GetCommandInvocationCommand, SendCommandResult } from "@aws-sdk/client-ssm";
import Debug from "debug";
import { ListParams } from '../../../types/ListParams';

const debug = Debug("app:ssmUtils");

/**
 * Lists files in a directory on an SSM instance.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {ListParams} params - The parameters for listing files.
 * @returns {Promise<string[]>} - The list of files.
 */
export const listFiles = async (
  ssmClient: SSMClient,
  instanceId: string,
  params: ListParams
): Promise<string[]> => {
  const { directory = ".", limit = 42, offset = 0, orderBy = "filename" } = params;

  // Command to list files with applied offset and limit
  let command = "ls -l " + directory + " | tail -n +2 | awk '{print $9, $5, $6, $7}' | sort ";

  // Apply sorting order
  if (orderBy === "filename") {
    command += "-k1"; // Sort by filename
  } else if (orderBy === "datetime") {
    command += "-k3,4"; // Sort by date and time
  }

  // Apply limit and offset
  command += " | tail -n +" + (offset + 1) + " | head -n " + limit;

  debug("Listing files with command: " + command);

  const result: SendCommandResult = await ssmClient.send(new SendCommandCommand({
    InstanceIds: [instanceId],
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: [command],
    },
  }));

  // Fetching command invocation output using another API call (assuming it exists)
  const commandId = result.Command?.CommandId;
  if (!commandId) {
    debug("Command ID not found.");
    throw new Error("Failed to retrieve command ID.");
  }

  // Polling for the command result using the command ID
  const commandInvocationResult = await ssmClient.send(new GetCommandInvocationCommand({
    CommandId: commandId,
    InstanceId: instanceId,
  }));

  const commandOutput = commandInvocationResult.StandardOutputContent || "";

  // Extract the command output from the result
  const fileList = commandOutput.trim().split("\n").filter(line => line.length > 0);

  debug("Files listed: " + fileList.join(", "));

  return fileList;
};
