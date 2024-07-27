import { ServerConfig } from './ServerConfig'; export interface AppConfig { ServerConfig: ServerConfig[]; commandTimeout: number; maxResponse: number; port: number; }
