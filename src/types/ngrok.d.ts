declare module '@ngrok/ngrok' {
  // Add minimal type definitions for ngrok
  export function connect(config: any): Promise<any>;
  export function disconnect(): Promise<void>;
  export function kill(): Promise<void>;
  export function authtoken(token: string): void;
  export function forward(config: any): Promise<any>;
}