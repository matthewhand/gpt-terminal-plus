import { LocalServerHandler } from './handlers/LocalServerHandler';
import { RemoteServerHandler } from './handlers/RemoteServerHandler';
import servers from './servers';
import { config } from './config';

// Type definition for system information
type SystemInfo = {
  currentFolder: string;
};

// Function to initialize the server handler based on the server configuration
export async function initializeServerHandler(serverAddress: string): Promise<[LocalServerHandler | RemoteServerHandler | null, SystemInfo | null, string | null]> {
  const serverConfig = servers.find(server => server.address === serverAddress);

  if (!serverConfig) {
    console.error('Server not found in predefined list:', serverAddress);
    return [null, null, 'Server not in predefined list.'];
  }

  let serverHandler: LocalServerHandler | RemoteServerHandler | null = null;
  let systemInfo: SystemInfo | null = null;

  if (serverConfig.address === 'localhost') {
    serverHandler = new LocalServerHandler();
    // Assuming getLocalhostSystemInfo is an async function that retrieves system info
    systemInfo = await getLocalhostSystemInfo();
    serverHandler.setCurrentDirectory(systemInfo.currentFolder);
  } else {
    serverHandler = new RemoteServerHandler(serverConfig.address, serverConfig.keyPath, serverConfig.posix);
    if (serverConfig.remoteInfo) {
      try {
        // Assuming executeRemotePythonCode is an async function that retrieves system info
        const remoteSystemInfo = await serverHandler.executeRemotePythonCode(serverConfig.remoteInfo);
        systemInfo = JSON.parse(remoteSystemInfo);
        serverHandler.setCurrentDirectory(systemInfo.currentFolder);
      } catch (error) {
        console.error('Error executing remote command or parsing response:', error.message);
        return [null, null, 'Error executing remote command or parsing response'];
      }
    }
  }

  // Update the global config with the selected server
  config.server = serverConfig.address;

  return [serverHandler, systemInfo, null];
}
