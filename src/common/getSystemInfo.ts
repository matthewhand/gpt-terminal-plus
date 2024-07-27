export async function getSystemInfo(executionFunction: () => Promise<string>): Promise<string> {
  try {
    return await executionFunction();
  } catch (error) {
    console.error(`Failed to retrieve system information: ${error}`);
    throw error;
  }
}

