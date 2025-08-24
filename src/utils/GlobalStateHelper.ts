export interface GlobalState {
  selectedServer: string;
  presentWorkingDirectory: string;
  selectedModel: string;
}

// Maintain a stable singleton reference
const state: GlobalState = {
  selectedServer: '',
  presentWorkingDirectory: '',
  selectedModel: '',
};

export function getGlobalState(): GlobalState {
  return state;
}

export function _resetGlobalStateForTests(init?: Partial<GlobalState>) {
  state.selectedServer = '';
  state.presentWorkingDirectory = '';
  state.selectedModel = '';
  if (init) {
    if (init.selectedServer !== undefined) state.selectedServer = init.selectedServer as string;
    if (init.presentWorkingDirectory !== undefined) state.presentWorkingDirectory = init.presentWorkingDirectory as string;
    if (init.selectedModel !== undefined) state.selectedModel = init.selectedModel as string;
  }
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
  state.selectedServer = '';
  state.presentWorkingDirectory = '';
  state.selectedModel = '';
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
