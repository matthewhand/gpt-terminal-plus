export interface GlobalState {
  selectedServer: any;
  presentWorkingDirectory: string;
  selectedModel: string;
}

let state: GlobalState | null = null;

export function getGlobalState(): GlobalState {
  if (!state) {
    state = {
      selectedServer: '',
      presentWorkingDirectory: '',
      selectedModel: '',
    };
    
    // Auto-select default localhost server if none selected (skip in tests)
    if (process.env.NODE_ENV !== 'test' && !state.selectedServer) {
      initializeDefaultServer();
    }
  }
  return state;
}

function initializeDefaultServer(): void {
  try {
    // Try to get registered servers first
    const { listRegisteredServers } = require('../managers/serverRegistry');
    const registeredServers = listRegisteredServers();
    
    // Look for localhost server with current working directory
    let defaultServer = registeredServers.find((s: any) => 
      s.hostname === 'localhost' && 
      s.protocol === 'local' &&
      (s.directory === '.' || s.directory === process.cwd())
    );
    
    // If not found, look for any localhost server
    if (!defaultServer) {
      defaultServer = registeredServers.find((s: any) => 
        s.hostname === 'localhost' && s.protocol === 'local'
      );
    }
    
    // If still not found, create a default localhost server
    if (!defaultServer) {
      const { ServerManager } = require('../managers/ServerManager');
      defaultServer = ServerManager.getDefaultLocalServerConfig();
      
      // Register it in memory
      const { registerServerInMemory } = require('../managers/serverRegistry');
      registerServerInMemory({
        ...defaultServer,
        registeredAt: new Date().toISOString(),
        modes: ['shell', 'code'],
        directory: '.'
      });
    }
    
    if (defaultServer && state) {
      state.selectedServer = defaultServer.hostname;
      console.log(`🚀 Auto-selected default server: ${defaultServer.hostname}`);
    }
  } catch (error) {
    console.warn('Failed to initialize default server:', error);
  }
}

export function _resetGlobalStateForTests(init?: Partial<GlobalState>) {
  state = {
    selectedServer: '',
    presentWorkingDirectory: '',
    selectedModel: '',
    ...init,
  };
}

/** Legacy-style accessors used throughout the code/tests */
export function getSelectedServer() {
  return getGlobalState().selectedServer;
}
export function setSelectedServer(s: any) {
  getGlobalState().selectedServer = s;
}

export function getPresentWorkingDirectory() {
  return getGlobalState().presentWorkingDirectory;
}
export function setPresentWorkingDirectory(dir: string) {
  getGlobalState().presentWorkingDirectory = dir;
}

export function getSelectedModel() {
  return getGlobalState().selectedModel;
}
export function setSelectedModel(model: string) {
  getGlobalState().selectedModel = model;
}

export function setCurrentServerHandler(handler: any) {
  setSelectedServer(handler);
}

export function getCurrentServerHandler() {
  return getSelectedServer();
}

export function clearGlobalState() {
  state = null;
}

export default {
  getGlobalState,
  _resetGlobalStateForTests,
  getSelectedServer,
  setSelectedServer,
  getPresentWorkingDirectory,
  setPresentWorkingDirectory,
  getSelectedModel,
  setSelectedModel,
  setCurrentServerHandler,
  getCurrentServerHandler,
  clearGlobalState,
};
