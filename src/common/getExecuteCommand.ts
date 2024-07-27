/**
 * Generates the command to execute a script file based on the server's shell environment.
 * @param {string} shell - The shell environment.
 * @param {string} filePath - The path of the script file to execute.
 * @returns {string} The command string to execute the file.
 */
export const getExecuteCommand = (shell: string, filePath: string): string => {
  switch (shell) {
    case "powershell": return "Powershell -File " + filePath;
    case "python": return "python " + filePath;
    default: return "bash " + filePath;
  }
};
export const getExecuteCommand = (shell: string, filePath: string): string => {
  switch (shell) {
    case "powershell": return "Powershell -File " + filePath;
    case "python": return "python " + filePath;
    default: return "bash " + filePath;
  }
};
