declare const selectedServer: string; 

declare global {
  // Define a custom global variable
  var shouldRunSshTests: boolean;


}

// This file must be a module to allow the 'declare global' syntax.
// Exporting an empty object is a workaround to satisfy this requirement.
export {};
