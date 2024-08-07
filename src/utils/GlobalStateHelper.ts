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
  debug(`Ensuring config directory exists: ${configDir}`);
  try {
    if (!fs.existsSync(configDir)) {
      debug(`Config directory does not exist, creating: ${configDir}`);
      fs.mkdirSync(configDir, { recursive: true });
      debug('Config directory created at: ' + configDir);
    } else {
      debug('Config directory already exists: ' + configDir);
    }
  } catch (error) {
    debug('Error creating config directory: ' + String(error));
    throw new Error('Unable to create config directory.');
  }
};

// Fetch the global state from the filesystem, defaulting to 'localhost' if not set
const getGlobalState = (): GlobalState => {
  debug('Fetching global state');
  if (isTestEnv) {
    debug('Test environment detected, returning in-memory state');
    return globalState;
  }

  ensureConfigDirExists();
  try {
    if (fs.existsSync(stateFilePath)) {
      debug(`Global state file exists: ${stateFilePath}`);
      const rawData = fs.readFileSync(stateFilePath, 'utf8');
      debug(`Raw data read from state file: ${rawData}`);
      const data = JSON.parse(rawData);
      debug(`Parsed data: ${JSON.stringify(data)}`);
      return {
        selectedServer: data.selectedServer || defaultServer,
        presentWorkingDirectory: data.presentWorkingDirectory || '/',
      };
    } else {
      debug(`Global state file does not exist: ${stateFilePath}`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      debug('Error reading or parsing global state file: ' + error.message);
    } else {
      debug('Error reading global state file: ' + String(error));
    }
  }

  const initState = { selectedServer: defaultServer, presentWorkingDirectory: '/' };
  debug(`Initial global state: ${JSON.stringify(initState)}`);
  try {
    fs.writeFileSync(stateFilePath, JSON.stringify(initState, null, 2), 'utf8');
    debug('Initial global state created with default values.');
  } catch (error) {
    debug('Error writing initial global state: ' + String(error));
    throw new Error('Unable to write initial global state.');
  }

  return initState;
};

// Update the global state and persist it to the filesystem
const setGlobalState = (updates: Partial<GlobalState>): void => {
  debug(`Updating global state with: ${JSON.stringify(updates)}`);
  const currentState = getGlobalState();
  debug(`Current state: ${JSON.stringify(currentState)}`);
  const newState = { ...currentState, ...updates };
  debug(`New state: ${JSON.stringify(newState)}`);
  if (!isTestEnv) {
    ensureConfigDirExists();
    try {
      fs.writeFileSync(stateFilePath, JSON.stringify(newState, null, 2), 'utf8');
      debug('Global state successfully updated and written to file.');
    } catch (error) {
      debug('Error writing global state: ' + String(error));
      throw new Error('Unable to write global state.');
    }
  } else {
    globalState = newState;
    debug('Test environment: global state updated in-memory.');
  }
  debug('Global state updated: ' + JSON.stringify(newState, null, 2));
};

export const getSelectedServer = (): string => {
  const selectedServer = getGlobalState().selectedServer;
  debug('Selected server retrieved: ' + selectedServer);
  return selectedServer;
};

export const setSelectedServer = (server: string): void => {
  debug('Setting selected server to: ' + server);
  if (!server || typeof server !== 'string') {
    debug('Invalid server value provided: ' + server);
    throw new Error('Server must be a non-empty string.');
  }
  setGlobalState({ selectedServer: server });
  debug('Selected server set to: ' + server);
};

export const presentWorkingDirectory = (): string => {
  const presentWorkingDirectory = getGlobalState().presentWorkingDirectory;
  debug('Present working directory retrieved: ' + presentWorkingDirectory);
  return presentWorkingDirectory;
};

export const changeDirectory = (folder: string): void => {
  debug('Changing directory to: ' + folder);
  if (!folder || typeof folder !== 'string') {
    debug('Invalid folder value provided: ' + folder);
    throw new Error('Folder must be a non-empty string.');
  }
  setGlobalState({ presentWorkingDirectory: folder });
  debug('Present working directory set to: ' + folder);
};
