// src/utils/sshUtilities.ts
import * as fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ServerConfig } from '../types';

// Function to retrieve the private key for SSH authentication
export async function getPrivateKey(config: ServerConfig): Promise<Buffer> {
    // Resolve the private key path, defaulting to the standard location if not specified
    const privateKeyPath = config.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
    try {
        // Attempt to read and return the private key file
        return await fs.readFile(privateKeyPath);
    } catch (error) {
        // In case of any errors (e.g., file not found), throw a descriptive error
        throw new Error(`Failed to read private key from ${privateKeyPath}: ${error}`);
    }
}
