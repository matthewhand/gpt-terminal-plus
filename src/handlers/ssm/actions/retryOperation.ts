import Debug from "debug";
const debug = Debug("app:ssmUtils");

/**
 * Handles retry logic for an operation.
 * @param {Function} operation - The operation to retry.
 * @param {number} retries - The number of retries.
 * @param {number} waitTime - The wait time between retries in milliseconds.
 * @returns {Promise<any>} The result of the operation.
 */
export const retryOperation = async (operation: Function, retries: number, waitTime: number) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= retries - 1) {
        debug("Operation failed after " + retries + " attempts.");
        throw error;
      }
      attempt++;
      debug("Attempt " + (attempt + 1) + "/" + retries + ": Operation failed, retrying in " + waitTime + "ms...", error);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

