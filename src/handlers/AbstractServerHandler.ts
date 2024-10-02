import { ExecutionResult } from '../types/ExecutionResult';
import { PaginatedResponse } from '../types/PaginatedResponse';

export abstract class AbstractServerHandler {
  protected serverConfig: { hostname: string; protocol: string; };

  constructor(serverConfig: { hostname?: string; protocol?: string; }) {
    // Assign default values if properties are undefined
    this.serverConfig = {
      hostname: serverConfig.hostname || 'localhost',
      protocol: serverConfig.protocol || 'local',
    };
  }

  abstract executeCommand(command: string, timeout?: number): Promise<ExecutionResult>;
  abstract listFiles(directory: string, limit?: number, offset?: number): Promise<PaginatedResponse<string>>;
}
