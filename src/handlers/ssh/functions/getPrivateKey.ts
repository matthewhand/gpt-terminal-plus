import * as fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ServerConfig } from '../../../types/index';

export async function getPrivateKey(config: ServerConfig): Promise<Buffer> {
  const privateKeyPath = config.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
  try {
    return await fs.readFile(privateKeyPath);
  } catch (error) {
    throw new Error('Failed to read private key from ' + privateKeyPath + ': ' + error);
  }
}

