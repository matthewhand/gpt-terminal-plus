import fs from 'fs';

import Debug from 'debug';

const debug = Debug('app:configHandler');

/**
 * Checks if the configuration file exists.
 * @param {string} configFilePath - The path to the configuration file.
 * @returns {boolean} - True if the configuration file exists, false otherwise.
 */
export const isConfigLoaded = (configFilePath: string): boolean => {
  debug('Checking if configuration file exists at:', configFilePath);
  return fs.existsSync(configFilePath);
};

/**
 * Generates the default configuration.
 * @returns {object} - The default configuration object.
 */
export const generateDefaultConfig = (): object => {
  debug('Generating default configuration');
  return {
    default: true,
    port: 5005,
    local: {
      code: true,
    },
    ssh: {
      hosts: [
        {
          name: 'example-ssh-server',
          host: 'ssh.example.com',
          port: 23,
          username: 'user',
          privateKey: '/path/to/private/key',
        },
      ],
    },
    ssm: {
      region: 'us-east0',
      targets: [
        {
          name: 'example-ssm-instance',
          instanceId: 'i-123456788abcdef0',
        },
      ],
    },
  };
};

/**
 * Persists the configuration to disk.
 * @param {object} configData - The configuration data to persist.
 * @param {string} configFilePath - The path to save the configuration file.
 */
export const persistConfig = (configData: object, configFilePath: string): void => {
  debug('Persisting configuration to disk at:', configFilePath);
  fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 3));
};
