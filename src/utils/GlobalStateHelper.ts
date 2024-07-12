import fs from 'fs';
import path from 'path';

const defaultServer = process.env.DEFAULT_SERVER || 'localhost'; // Use environment variable or default to 'localhost'
// const stateFilePath = path.join(__dirname, '..', 'data', 'globalState.json');
const stateFilePath = path.join('/data', 'globalState.json'); // TODO convert into envvar

interface GlobalState {
  selectedServer: string;
  currentFolder: string;
}

// Ensure the data directory exists
const ensureDataDirExists = (): void => {
  const dataDir = path.dirname(stateFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Fetch the global state from the filesystem, defaulting to 'localhost' if not set
const getGlobalState = (): GlobalState => {
  ensureDataDirExists();
  if (fs.existsSync(stateFilePath)) {
    const rawData = fs.readFileSync(stateFilePath, 'utf8');
    const data = JSON.parse(rawData);
    // Ensure that selectedServer defaults to localhost if not set
    return {
      selectedServer: data.selectedServer || defaultServer,
      currentFolder: data.currentFolder || '/',
    };
  }
  // Initialize state with default values if the state file does not exist
  const initState = { selectedServer: defaultServer, currentFolder: '/' };
  fs.writeFileSync(stateFilePath, JSON.stringify(initState, null, 2), 'utf8');
  return initState;
};

// Update the global state and persist it to the filesystem
const setGlobalState = (updates: Partial<GlobalState>): void => {
  const currentState = getGlobalState();
  const newState = { ...currentState, ...updates };
  ensureDataDirExists();
  fs.writeFileSync(stateFilePath, JSON.stringify(newState, null, 2), 'utf8');
};

export const getSelectedServer = (): string => getGlobalState().selectedServer;
export const setSelectedServer = (server: string): void => setGlobalState({ selectedServer: server });
export const getCurrentFolder = (): string => getGlobalState().currentFolder;
export const setCurrentFolder = (folder: string): void => setGlobalState({ currentFolder: folder });
