// serverHandlerInstance.ts
import { LocalServerHandler } from '../handlers/LocalServerHandler';
import { RemoteServerHandler } from '../handlers/RemoteServerHandler';
import { ServerConfig } from '../handlers/types';

class ServerHandlerSingleton {
  static instance: LocalServerHandler | RemoteServerHandler | null = null;

  public static getInstance(serverConfig: ServerConfig): LocalServerHandler | RemoteServerHandler {
    if (ServerHandlerSingleton.instance === null) {
      // Check if connectionString is undefined, empty, or 'localhost'
      if (!serverConfig.connectionString || serverConfig.connectionString === 'localhost') {
        ServerHandlerSingleton.instance = new LocalServerHandler();
      } else {
        ServerHandlerSingleton.instance = new RemoteServerHandler(serverConfig.connectionString);
      }
    }
    return ServerHandlerSingleton.instance;
  }
}

export default ServerHandlerSingleton;
