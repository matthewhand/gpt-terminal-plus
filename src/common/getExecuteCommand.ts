import Debug from "debug";

const debug = Debug("app:getExecuteCommand");

/**
 * Generates the command to execute a script file based on the server's shell environment.
 * @param {string} shell - The shell environment.
 * @param {string} filePath - The path of the script file to execute.
 * @returns {string} The command string to execute the file.
 */
export const getExecuteCommand = (shell: string, filePath: string): string => {
  debug("Generating execute command for shell: " + shell + ", filePath: " + filePath);

  let command: string;
  switch (shell) {
    case "powershell":
      command = "Powershell -File " + filePath;
      break;
    case "python":
      command = "python " + filePath;
      break;
    default:
      command = "bash " + filePath;
      break;
  }

  debug("Generated command: " + command);
  return command;
};
