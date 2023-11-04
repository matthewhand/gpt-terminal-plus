import { Request, Response } from 'express';
import { config } from './config';
import { LocalServerHandler } from './handlers/LocalServerHandler';
import { RemoteServerHandler } from './handlers/RemoteServerHandler';
import servers from './servers';
import { getLocalhostSystemInfo } from './localhost_info';
import { executeRemotePythonCode } from './remoteCommandHandler';

let serverHandler: LocalServerHandler | RemoteServerHandler | null = null;

export const setServer = async (req: Request, res: Response) => {
  const newServerAddress = req.body.server;
  const serverConfig = servers.find(server => server.address === newServerAddress);

  if (!serverConfig) {
    console.error('Server not found in predefined list:', newServerAddress);
    return res.status(400).json({ output: 'Server not in predefined list.' });
  }

  console.log(`Using serverConfig: ${JSON.stringify(serverConfig)}`);
  config.server = serverConfig.address;
  let systemInfo;

  if (config.server === 'localhost') {
    serverHandler = new LocalServerHandler();
    systemInfo = getLocalhostSystemInfo();
    serverHandler.setCurrentDirectory(systemInfo.currentFolder);
  } else {
    serverHandler = new RemoteServerHandler(serverConfig.address, serverConfig.keyPath, serverConfig.posix);
    if (serverConfig.remoteInfo) {
      try {
        console.log('Executing remote Python code:', pythonCode);
        const remoteSystemInfo = await executeRemotePythonCode(pythonCode, serverHandler);
        console.log("Remote response:", remoteSystemInfo);
        systemInfo = JSON.parse(remoteSystemInfo);
        serverHandler.setCurrentDirectory(systemInfo.currentFolder);
      } catch (error) {
        console.error('Error executing remote command or parsing response:', error.message);
        return res.status(500).json({ output: 'Error executing remote command or parsing response', error: error.message });
      }
    }
  }

  return res.status(200).json({ output: 'Server set to ' + (config.server === '' ? '[undefined]' : config.server), systemInfo });
};

export const getCurrentFolder = async (_: Request, res: Response) => {
  if (!serverHandler) {
    return res.status(500).json({ error: 'Server handler not initialized' });
  }
  const currentFolder = serverHandler.getCurrentDirectory();
  return res.status(200).json({ current_folder: currentFolder });
};

export const setCurrentFolder = async (req: Request, res: Response) => {
  const directory = req.body.directory;
  if (!serverHandler) {
    return res.status(500).json({ error: 'Server handler not initialized' });
  }
  try {
    serverHandler.setCurrentDirectory(directory);
    return res.status(200).json({ output: 'Current directory set to ' + directory });
  } catch (error) {
    return res.status(400).json({ output: 'Directory does not exist.', error: error.message });
  }
};
