import Debug from "debug";

const debug = Debug("app:getExecuteCommand");

/**
 * Generates the command to execute a script file based on the server's shell environment.
 * @param {string} shell - The shell environment.
 * @param {string} filePath - The path of the script file to execute.
 * @returns {string} The command string to execute the file.
 */
export const getExecuteCommand = (shell: string, filePath: string): string => {
  // Validate the inputs
  if (!shell || typeof shell !== 'string') {
    const errorMessage = 'Shell must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!filePath || typeof filePath !== 'string') {
    const errorMessage = 'File path must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  debug("Generating execute command for shell: " + shell + ", filePath: " + filePath);

  // Quote the file path if it contains spaces or common special characters
  const needsQuoting = /[\s()&|;<>]/.test(filePath);
  const safePath = needsQuoting ? `"${filePath}"` : filePath;

  let command: string;
  switch (shell.toLowerCase()) {
    case "powershell":
      command = "Powershell -File " + safePath;
      break;
    case "python":
      command = "python " + safePath;
      break;
    default:
      command = "bash " + safePath;
      break;
  }

  debug("Generated command: " + command);
  return command;
};
