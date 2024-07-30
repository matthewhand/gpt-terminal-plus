import { exec } from "child_process";
import { SSMClient, SendCommandCommand, SendCommandCommandOutput, GetCommandInvocationCommand } from "@aws-sdk/client-ssm";
import { Client } from "ssh2";
import { promisify } from "util";
import Debug from "debug";

const debug = Debug("app:executeSystemInfoScript");

const execPromise = promisify(exec);

/**
 * Executes a system info script based on the shell type.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<string>} - The output of the script execution.
 * @throws Will throw an error if the script execution fails.
 */
async function executeLocalSystemInfoScript(shell: string, scriptPath: string): Promise<string> {
  // Validate inputs
  if (!shell || typeof shell !== "string") {
    const errorMessage = "Shell must be provided and must be a string.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!scriptPath || typeof scriptPath !== "string") {
    const errorMessage = "Script path must be provided and must be a string.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  debug(`Executing local system info script with shell: ${shell}, scriptPath: ${scriptPath}`);
  try {
    const { stdout } = await execPromise(`${shell} ${scriptPath}`);
    debug(`Local script executed successfully: ${stdout}`);
    return stdout;
  } catch (error) {
    const errorMessage = `Failed to execute local system info script: ${error instanceof Error ? error.message : "Unknown error"}`;
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Executes a system info script on an AWS SSM instance.
 * @param {SSMClient} ssmClient - The SSM client.
 * @param {string} instanceId - The instance ID.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<string>} - The output of the script execution.
 * @throws Will throw an error if the script execution fails.
 */
async function executeSSMSystemInfoScript(ssmClient: SSMClient, instanceId: string, shell: string, scriptPath: string): Promise<string> {
  // Validate inputs
  if (!ssmClient) {
    const errorMessage = "SSM client must be provided.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!instanceId || typeof instanceId !== "string") {
    const errorMessage = "Instance ID must be provided and must be a string.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!shell || typeof shell !== "string") {
    const errorMessage = "Shell must be provided and must be a string.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!scriptPath || typeof scriptPath !== "string") {
    const errorMessage = "Script path must be provided and must be a string.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  debug(`Executing SSM system info script on instance: ${instanceId} with shell: ${shell}, scriptPath: ${scriptPath}`);
  try {
    const command = `${shell} ${scriptPath}`;
    const commandOutput: SendCommandCommandOutput = await ssmClient.send(new SendCommandCommand({
      InstanceIds: [instanceId],
      DocumentName: "AWS-RunShellScript",
      Parameters: {
        commands: [command]
      }
    }));

    if (commandOutput.Command?.StatusDetails === "Success") {
      const invocation = await ssmClient.send(new GetCommandInvocationCommand({
        CommandId: commandOutput.Command.CommandId!,
        InstanceId: instanceId
      }));

      const result = invocation.StandardOutputContent || "";
      debug(`SSM script executed successfully: ${result}`);
      return result;
    } else {
      throw new Error("Command execution failed");
    }
  } catch (error) {
    const errorMessage = `Failed to execute SSM system info script: ${error instanceof Error ? error.message : "Unknown error"}`;
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Executes a system info script on an SSH client.
 * @param {Client} sshClient - The SSH client.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<string>} - The output of the script execution.
 * @throws Will throw an error if the script execution fails.
 */
async function executeSSHSystemInfoScript(sshClient: Client, shell: string, scriptPath: string): Promise<string> {
  // Validate inputs
  if (!sshClient) {
    const errorMessage = "SSH client must be provided.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!shell || typeof shell !== "string") {
    const errorMessage = "Shell must be provided and must be a string.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!scriptPath || typeof scriptPath !== "string") {
    const errorMessage = "Script path must be provided and must be a string.";
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  debug(`Executing SSH system info script with shell: ${shell}, scriptPath: ${scriptPath}`);
  return new Promise((resolve, reject) => {
    let commandOutput = "";
    sshClient.exec(`${shell} ${scriptPath}`, (err, stream) => {
      if (err) {
        const errorMessage = `Error executing SSH command: ${err.message}`;
        debug(errorMessage);
        reject(new Error(errorMessage));
      } else {
        stream.on("data", (data: Buffer) => {
          commandOutput += data.toString();
        }).on("close", () => {
          debug(`SSH script executed successfully: ${commandOutput}`);
          resolve(commandOutput);
        });
      }
    });
  });
}

export { executeLocalSystemInfoScript, executeSSMSystemInfoScript, executeSSHSystemInfoScript };
