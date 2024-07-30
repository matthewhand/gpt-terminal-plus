// src/interfaces/SystemInfoRetriever.ts

import { SystemInfo } from '../types/SystemInfo';

/**
 * Interface for retrieving system information from a remote server.
 */
export interface SystemInfoRetriever {
    /**
     * Returns default system information in case of an error.
     * @returns {SystemInfo} - The default system information.
     */
    getDefaultSystemInfo(): SystemInfo;

    /**
     * Returns the script based on the shell type.
     * @returns {string} - The script to be executed.
     */
    getSystemInfoScript(): string;
}
