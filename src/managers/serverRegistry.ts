import { ServerConfig } from '../types/ServerConfig';

export interface ServerInfo extends ServerConfig {
  registeredAt: string;
  modes?: string[];
}

const registeredServers: Record<string, ServerInfo> = {};

export function registerServerInMemory(server: ServerInfo): void {
  if (!server.hostname || !server.protocol) {
    throw new Error('Server must have hostname and protocol');
  }
  registeredServers[server.hostname] = server;
}

export function listRegisteredServers(): ServerInfo[] {
  return Object.values(registeredServers);
}

export function getRegisteredServer(hostname: string): ServerInfo | undefined {
  return registeredServers[hostname];
}

export function unregisterServer(hostname: string): boolean {
  if (registeredServers[hostname]) {
    delete registeredServers[hostname];
    return true;
  }
  return false;
}