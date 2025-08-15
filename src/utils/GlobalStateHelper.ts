// src/utils/GlobalStateHelper.ts

import fs from 'fs';
import path from 'path';
import Debug from 'debug';
import { getDefaultModel } from '../common/models';

const debug = Debug('app:GlobalStateHelper');

const isTestEnv = process.env.NODE_ENV === 'test';
const defaultServer = process.env.DEFAULT_SERVER || 'localhost';
const configDir = process.env.NODE_CONFIG_DIR
  ? path.resolve(process.env.NODE_CONFIG_DIR)
  : path.resolve(__dirname, '..', '..', 'config'); // Adjusted to ensure correct relative path
const stateFilePath = path.join(configDir, 'globalState.json');

interface GlobalState {
  selectedServer: string;
  presentWorkingDirectory: string;
  selectedModel: string;
}

let globalState: GlobalState = {
  selectedServer: defaultServer,
  presentWorkingDirectory: process.cwd(), // Initialize to current working directory
  selectedModel: process.env.DEFAULT_MODEL || getDefaultModel(),
};

/**
 * Ensures that the configuration directory exists.
 */
const ensureConfigDirExists = (): void => {
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

/**
 * Loads the global state from the state file.
 * If the file doesn't exist or is malformed, initializes with default values.
 */
const loadGlobalState = (): GlobalState => {
  debug('Loading global state from file.');
  ensureConfigDirExists();

  try {
    if (fs.existsSync(stateFilePath)) {
      const rawData = fs.readFileSync(stateFilePath, 'utf8');
      debug(`Raw data read from state file: ${rawData}`);
      const data = JSON.parse(rawData);

      // Validate and sanitize loaded data
      const selectedServer = typeof data.selectedServer === 'string' && data.selectedServer.trim() !== ''
        ? data.selectedServer
        : defaultServer;

      const presentWorkingDirectory = typeof data.presentWorkingDirectory === 'string' && data.presentWorkingDirectory.trim() !== ''
        ? path.resolve(data.presentWorkingDirectory) // Ensure absolute path
        : process.cwd();

      const selectedModel = typeof data.selectedModel === 'string' && data.selectedModel.trim() !== ''
        ? data.selectedModel
        : (process.env.DEFAULT_MODEL || getDefaultModel());

      // Ensure the directory exists
      if (!fs.existsSync(presentWorkingDirectory)) {
        debug(`Configured presentWorkingDirectory does not exist: ${presentWorkingDirectory}. Reverting to process.cwd()`);
        return {
          selectedServer,
          presentWorkingDirectory: process.cwd(),
        };
      }

      debug(`Global state loaded: selectedServer=${selectedServer}, presentWorkingDirectory=${presentWorkingDirectory}`);
      return {
        selectedServer,
        presentWorkingDirectory,
        selectedModel,
      };
    } else {
      debug(`Global state file does not exist: ${stateFilePath}. Initializing with default values.`);
    }
  } catch (error) {
    debug('Error loading global state: ' + String(error));
  }

  // Initialize with default values if loading failed
  const initialState: GlobalState = {
    selectedServer: defaultServer,
    presentWorkingDirectory: process.cwd(),
    selectedModel: process.env.DEFAULT_MODEL || getDefaultModel(),
  };
  saveGlobalState(initialState);
  return initialState;
};

/**
 * Saves the global state to the state file.
 * @param state - The global state to save.
 */
const saveGlobalState = (state: GlobalState): void => {
  debug('Saving global state to file.');
  try {
    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf8');
    debug('Global state successfully saved.');
  } catch (error) {
    debug('Error saving global state: ' + String(error));
    throw new Error('Unable to save global state.');
  }
};

/**
 * Retrieves the current global state.
 * @returns The global state.
 */
const getGlobalState = (): GlobalState => {
  if (isTestEnv) {
    debug('Test environment detected. Returning in-memory global state.');
    return globalState;
  }

  globalState = loadGlobalState();
  return globalState;
};

/**
 * Updates the global state with the provided updates and persists it.
 * @param updates - Partial updates to apply to the global state.
 */
const setGlobalState = (updates: Partial<GlobalState>): void => {
  debug(`Updating global state with: ${JSON.stringify(updates)}`);
  const currentState = getGlobalState();
  const newState: GlobalState = { ...currentState, ...updates };

  // Resolve and validate presentWorkingDirectory
  if (updates.presentWorkingDirectory) {
    const resolvedPath = path.resolve(updates.presentWorkingDirectory);
    if (!fs.existsSync(resolvedPath)) {
      debug(`Attempted to set presentWorkingDirectory to a non-existent path: ${resolvedPath}`);
      throw new Error(`Directory does not exist: ${resolvedPath}`);
    }
    newState.presentWorkingDirectory = resolvedPath;
    debug(`presentWorkingDirectory updated to: ${resolvedPath}`);
  }

  // Update selectedServer if provided
  if (updates.selectedServer) {
    newState.selectedServer = updates.selectedServer;
    debug(`selectedServer updated to: ${updates.selectedServer}`);
  }

  // Update selectedModel if provided
  if (updates.selectedModel) {
    newState.selectedModel = updates.selectedModel;
    debug(`selectedModel updated to: ${updates.selectedModel}`);
  }

  if (!isTestEnv) {
    saveGlobalState(newState);
  } else {
    globalState = newState;
    debug('Test environment: Global state updated in-memory.');
  }

  debug('Global state after update: ' + JSON.stringify(newState, null, 2));
};

/**
 * Retrieves the selected server from the global state.
 * @returns The selected server.
 */
export const getSelectedServer = (): string => {
  const selectedServer = getGlobalState().selectedServer;
  debug('Selected server retrieved: ' + selectedServer);
  return selectedServer;
};

/**
 * Sets the selected server in the global state.
 * @param server - The server to set as selected.
 */
export const setSelectedServer = (server: string): void => {
  debug('Setting selected server to: ' + server);
  if (!server || typeof server !== 'string' || server.trim() === '') {
    debug('Invalid server value provided: ' + server);
    throw new Error('Server must be a non-empty string.');
  }
  setGlobalState({ selectedServer: server });
  debug('Selected server set to: ' + server);
};

/**
 * Retrieves the selected model from the global state.
 * @returns The selected model identifier.
 */
export const getSelectedModel = (): string => {
  const selectedModel = getGlobalState().selectedModel;
  debug('Selected model retrieved: ' + selectedModel);
  return selectedModel;
};

/**
 * Sets the selected model in the global state.
 * @param model - The model to set as selected.
 */
export const setSelectedModel = (model: string): void => {
  debug('Setting selected model to: ' + model);
  if (!model || typeof model !== 'string' || model.trim() === '') {
    debug('Invalid model value provided: ' + model);
    throw new Error('Model must be a non-empty string.');
  }
  setGlobalState({ selectedModel: model });
  debug('Selected model set to: ' + model);
};

/**
 * Retrieves the present working directory from the global state.
 * @returns The present working directory.
 */
export const getPresentWorkingDirectory = (): string => {
  const cwd = getGlobalState().presentWorkingDirectory;
  debug('Present working directory retrieved: ' + cwd);
  return cwd;
};

/**
 * Changes the present working directory in the global state.
 * @param folder - The directory to change to.
 */
export const changeDirectory = (folder: string): void => {
  debug('Changing directory to: ' + folder);
  if (!folder || typeof folder !== 'string' || folder.trim() === '') {
    debug('Invalid folder value provided: ' + folder);
    throw new Error('Folder must be a non-empty string.');
  }

  const resolvedPath = path.resolve(folder);
  if (!fs.existsSync(resolvedPath)) {
    debug(`Directory does not exist: ${resolvedPath}`);
    throw new Error(`Directory does not exist: ${resolvedPath}`);
  }

  setGlobalState({ presentWorkingDirectory: resolvedPath });
  debug('Present working directory successfully changed to: ' + resolvedPath);
};

// Initialize global state on module load
if (!isTestEnv) {
  globalState = loadGlobalState();
}

export default {
  getSelectedServer,
  setSelectedServer,
  getSelectedModel,
  setSelectedModel,
  getPresentWorkingDirectory,
  changeDirectory,
};
