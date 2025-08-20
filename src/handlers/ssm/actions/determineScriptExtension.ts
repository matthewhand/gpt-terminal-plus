/**
 * Determines the appropriate script file extension based on the server's shell configuration.
 * @param {string} shell - The shell environment.
 * @returns {string} The file extension as a string.
 */
export const determineScriptExtension = (shell: string): string => {
  switch (shell) {
    case "powershell": return ".ps1";
    case "python": return ".py";
    default: return ".sh";
  }
};

