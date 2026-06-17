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
  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt >= (retries || 1)) {
        debug("Operation failed after " + retries + " attempts.");
        throw error;
      }
      debug("Attempt " + (attempt + 1) + "/" + retries + ": Operation failed, retrying in " + waitTime + "ms...", error);
      const effectiveWait = process.env.NODE_ENV === 'test' ? 0 : waitTime;
      const delayPromise = effectiveWait === 0 ? Promise.resolve() : new Promise(resolve => setTimeout(resolve, effectiveWait));
      await delayPromise;
    }
  }
};

