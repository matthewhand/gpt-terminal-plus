import fs from 'fs';
import path from 'path';
import Debug from 'debug';

const debug = Debug('app:GlobalStateHelper');

const isTestEnv = process.env.NODE_ENV === 'test';
const defaultServer = process.env.DEFAULT_SERVER || 'localhost';
const stateFilePath = path.join(process.env.NODE_CONFIG_DIR || 'config', 'globalState.json');

interface GlobalState {
  selectedServer: string;
  presentWorkingDirectory: string;
}

let globalState: GlobalState = {
  selectedServer: defaultServer,
  presentWorkingDirectory: '/',
};

// Ensure the config directory exists
const ensureConfigDirExists = (): void => {
  const configDir = path.dirname(stateFilePath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    debug('Config directory created at: ' + configDir);
  }
};

// Fetch the global state from the filesystem, defaulting to 'localhost' if not set
const getGlobalState = (): GlobalState => {
  if (isTestEnv) {
    return globalState;
  }

  ensureConfigDirExists();
  if (fs.existsSync(stateFilePath)) {
    try {
      const rawData = fs.readFileSync(stateFilePath, 'utf8');
      const data = JSON.parse(rawData);
      return {
        selectedServer: data.selectedServer || defaultServer,
        presentWorkingDirectory: data.presentWorkingDirectory || '/',
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        debug('Error reading or parsing global state file: ' + error.message);
      } else {
        debug('Error reading global state file: ' + String(error));
      }
      const initState = { selectedServer: defaultServer, presentWorkingDirectory: '/' };
      fs.writeFileSync(stateFilePath, JSON.stringify(initState, null, 2), 'utf8');
      debug('Initial global state created with default values due to error.');
      return initState;
    }
  }
  const initState = { selectedServer: defaultServer, presentWorkingDirectory: '/' };
  fs.writeFileSync(stateFilePath, JSON.stringify(initState, null, 2), 'utf8');
  debug('Initial global state created with default values.');
  return initState;
};

// Update the global state and persist it to the filesystem
const setGlobalState = (updates: Partial<GlobalState>): void => {
  const currentState = getGlobalState();
  const newState = { ...currentState, ...updates };
  if (!isTestEnv) {
    ensureConfigDirExists();
    fs.writeFileSync(stateFilePath, JSON.stringify(newState, null, 2), 'utf8');
  } else {
    globalState = newState;
  }
  debug('Global state updated: ' + JSON.stringify(newState, null, 2));
};

export const getSelectedServer = (): string => {
  const selectedServer = getGlobalState().selectedServer;
  debug('Selected server retrieved: ' + selectedServer);
  return selectedServer;
};

export const setSelectedServer = (server: string): void => {
  setGlobalState({ selectedServer: server });
  debug('Selected server set to: ' + server);
};

export const presentWorkingDirectory = (): string => {
  const presentWorkingDirectory = getGlobalState().presentWorkingDirectory;
  debug('Present working directory retrieved: ' + presentWorkingDirectory);
  return presentWorkingDirectory;
};

export const changeDirectory = (folder: string): void => {
  setGlobalState({ presentWorkingDirectory: folder });
  debug('Present working directory set to: ' + folder);
};
