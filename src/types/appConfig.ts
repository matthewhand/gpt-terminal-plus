import { ServerConfig } from './serverConfig'; export interface AppConfig { serverConfig: ServerConfig[]; commandTimeout: number; maxResponse: number; port: number; }
