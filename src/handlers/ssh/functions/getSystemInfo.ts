import { executeSSHSystemInfoScript } from "../../../common/executeSystemInfoScript";
import { Client } from "ssh2";

/**
 * Retrieves system information from an SSH server using the specified shell and script.
 * @param {Client} sshClient - The SSH client.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<string>} - The system information.
 */
export async function getSystemInfo(sshClient: Client, shell: string, scriptPath: string): Promise<string> {
  return executeSSHSystemInfoScript(sshClient, shell, scriptPath);
}

