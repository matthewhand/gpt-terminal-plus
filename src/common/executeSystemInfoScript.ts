import { exec } from "child_process";
import { SSMClient, SendCommandCommand, SendCommandCommandOutput, GetCommandInvocationCommand } from "@aws-sdk/client-ssm";
import { Client } from "ssh2";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Executes a system info script based on the shell type.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<string>} - The output of the script execution.
 */
async function executeLocalSystemInfoScript(shell: string, scriptPath: string): Promise<string> {
  try {
    const { stdout } = await execPromise(`${shell} ${scriptPath}`);
    return stdout;
  } catch (error) {
    console.error(`Failed to execute local system info script: ${error}`);
    throw error;
  }
}

async function executeSSMSystemInfoScript(ssmClient: SSMClient, instanceId: string, shell: string, scriptPath: string): Promise<string> {
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
      
      return invocation.StandardOutputContent || "";
    } else {
      throw new Error("Command execution failed");
    }
  } catch (error) {
    console.error(`Failed to execute SSM system info script: ${error}`);
    throw error;
  }
}

async function executeSSHSystemInfoScript(sshClient: Client, shell: string, scriptPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let commandOutput = "";
    sshClient.exec(`${shell} ${scriptPath}`, (err, stream) => {
      if (err) {
        reject(`Error: ${err}`);
      } else {
        stream.on("data", (data: Buffer) => { // Explicitly typing data as Buffer
          commandOutput += data.toString();
        }).on("close", () => {
          resolve(commandOutput);
        });
      }
    });
  });
}

export { executeLocalSystemInfoScript, executeSSMSystemInfoScript, executeSSHSystemInfoScript };

