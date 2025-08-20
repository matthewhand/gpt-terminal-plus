/**
 * Represents the system information retrieved from the local server.
 */
export interface SystemInfo {
  type: string;
  platform: string;
  architecture: string;
  totalMemory: number;
  freeMemory: number;
  uptime: number;
  currentFolder: string;
}
