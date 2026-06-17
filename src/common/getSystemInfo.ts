import Debug from 'debug';

const debug = Debug('app:getSystemInfo');

/**
 * Retrieves system information by executing a provided function.
 * @param {() => Promise<string>} executionFunction - The function to execute for retrieving system information.
 * @returns {Promise<string>} - The system information.
 * @throws Will throw an error if the execution function fails.
 */
export async function getSystemInfo(executionFunction: () => Promise<string>): Promise<string> {
  // Validate the execution function
  if (typeof executionFunction !== 'function') {
    const errorMessage = 'Execution function must be provided and must be a function.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    debug('Executing system information retrieval function.');
    const result = await executionFunction();
    debug('System information retrieved successfully: ' + result);
    return result;
  } catch (error) {
    const errorMessage = `Failed to retrieve system information: ${error instanceof Error ? error.message : String(error)}`;
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
