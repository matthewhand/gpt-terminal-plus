import fs from 'fs';
import path from 'path';
import Debug from 'debug';

const debug = Debug('app:GlobalStateHelper');

const isTestEnv = process.env.NODE_ENV === 'test';
const defaultServer = process.env.DEFAULT_SERVER || 'localhost';
const stateFilePath = path.join('/data', 'globalState.json'); // TODO: convert into envvar

interface GlobalState {
  selectedServer: string;
  currentFolder: string;
}

let globalState: GlobalState = {
  selectedServer: defaultServer,
  currentFolder: '/',
};

// Ensure the data directory exists
const ensureDataDirExists = (): void => {
  const dataDir = path.dirname(stateFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    debug(`Data directory created at: ${dataDir}`);
  }
};

// Fetch the global state from the filesystem, defaulting to 'localhost' if not set
const getGlobalState = (): GlobalState => {
  if (isTestEnv) {
    return globalState;
  }

  ensureDataDirExists();
  if (fs.existsSync(stateFilePath)) {
    try {
      const rawData = fs.readFileSync(stateFilePath, 'utf8');
      const data = JSON.parse(rawData);
      return {
        selectedServer: data.selectedServer || defaultServer,
        currentFolder: data.currentFolder || '/',
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        debug(`Error reading or parsing global state file: ${error.message}`);
      } else {
        debug(`Error reading global state file: ${String(error)}`);
      }
      const initState = { selectedServer: defaultServer, currentFolder: '/' };
      fs.writeFileSync(stateFilePath, JSON.stringify(initState, null, 2), 'utf8');
      debug(`Initial global state created with default values due to error.`);
      return initState;
    }
  }
  const initState = { selectedServer: defaultServer, currentFolder: '/' };
  fs.writeFileSync(stateFilePath, JSON.stringify(initState, null, 2), 'utf8');
  debug(`Initial global state created with default values.`);
  return initState;
};

// Update the global state and persist it to the filesystem
const setGlobalState = (updates: Partial<GlobalState>): void => {
  const currentState = getGlobalState();
  const newState = { ...currentState, ...updates };
  if (!isTestEnv) {
    ensureDataDirExists();
    fs.writeFileSync(stateFilePath, JSON.stringify(newState, null, 2), 'utf8');
  } else {
    globalState = newState;
  }
  debug(`Global state updated: ${JSON.stringify(newState, null, 2)}`);
};

export const getSelectedServer = (): string => {
  const selectedServer = getGlobalState().selectedServer;
  debug(`Selected server retrieved: ${selectedServer}`);
  return selectedServer;
};

export const setSelectedServer = (server: string): void => {
  setGlobalState({ selectedServer: server });
  debug(`Selected server set to: ${server}`);
};

export const getCurrentFolder = (): string => {
  const currentFolder = getGlobalState().currentFolder;
  debug(`Current folder retrieved: ${currentFolder}`);
  return currentFolder;
};

export const setCurrentFolder = (folder: string): void => {
  setGlobalState({ currentFolder: folder });
  debug(`Current folder set to: ${folder}`);
};
