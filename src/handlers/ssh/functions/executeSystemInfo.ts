import { Client } from "ssh2";

/**
 * Executes the command to get system information on an SSH server.
 * @param {Client} sshClient - The SSH client.
 * @returns {Promise<string>} - The system information.
 */
export async function executeSystemInfo(sshClient: Client): Promise<string> {
  return new Promise((resolve, reject) => {
    let commandOutput = "";
    sshClient.exec("uname -a", (err, stream) => {
      if (err) {
        reject(`Error: ${err}`);
      } else {
        stream.on("data", data => {
          commandOutput += data;
        }).on("close", () => {
          resolve(commandOutput);
        });
      }
    });
  });
}

