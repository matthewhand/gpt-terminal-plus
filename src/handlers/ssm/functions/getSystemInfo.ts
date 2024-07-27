import { executeSSMSystemInfoScript } from "../../../common/executeSystemInfoScript";
import * as AWS from "aws-sdk";

/**
 * Retrieves system information from an SSM instance using the specified shell and script.
 * @param {AWS.SSM} ssmClient - The SSM client.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<string>} - The system information.
 */
export async function getSystemInfo(ssmClient: AWS.SSM, instanceId: string, shell: string, scriptPath: string): Promise<string> {
  return executeSSMSystemInfoScript(ssmClient, instanceId, shell, scriptPath);
}

