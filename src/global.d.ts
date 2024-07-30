/**
 * Declares the selected server as a global constant.
 */
declare const selectedServer: string;

declare global {
  /**
   * Defines a custom global variable to determine if SSH tests should run.
   */
  var shouldRunSshTests: boolean;
}

// This file must be a module to allow the 'declare global' syntax.
// Exporting an empty object is a workaround to satisfy this requirement.
export {};
