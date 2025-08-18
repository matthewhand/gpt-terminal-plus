export interface GlobalState {
  selectedServer: any;
  presentWorkingDirectory: string;
  selectedModel: string;
}

let state: GlobalState | null = null;

export function getGlobalState(): GlobalState {
  if (!state) {
    state = {
      selectedServer: null,
      presentWorkingDirectory: process.cwd(),
      selectedModel: process.env.DEFAULT_MODEL || 'auto',
    };
  }
  return state;
}

export function _resetGlobalStateForTests(init?: Partial<GlobalState>) {
  state = {
    selectedServer: null,
    presentWorkingDirectory: process.cwd(),
    selectedModel: 'auto',
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
