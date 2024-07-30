/**
 * Interface representing system information.
 */
export interface SystemInfo {
    /** The home folder of the user. */
    homeFolder: string;

    /** The type of operating system. */
    type: string;

    /** The release version of the operating system. */
    release: string;

    /** The platform of the operating system (e.g., 'linux', 'win32'). */
    platform: string;

    /** The architecture of the operating system (e.g., 'x64', 'arm'). */
    architecture: string;

    /** The total amount of memory in bytes. */
    totalMemory: number;

    /** The amount of free memory in bytes. */
    freeMemory: number;

    /** The system uptime in seconds. */
    uptime: number;

    /** The current working directory of the process. */
    currentFolder: string;
}
