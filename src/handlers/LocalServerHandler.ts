import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { exec } from 'child_process';
import { ServerHandler } from './ServerHandler';
import { SystemInfo } from './types';

export class LocalServerHandler extends ServerHandler {
  constructor() {
    super(os.homedir()); // Initialize with the current working directory
  }

  // Implement the abstract method from ServerHandler
  getSystemInfo(): Promise<SystemInfo> {
    // Implementation to get system info on the local server
    // This is a placeholder, you'll need to implement the logic to retrieve the system info
    return Promise.resolve({
      homeFolder: process.env.HOME || '',
      type: os.type(),
      release: os.release(),
      platform: os.platform(),
      pythonVersion: '', // You would need to execute a command to get this
      cpuArchitecture: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      currentFolder: this.currentDirectory,
    });
  }

  executeCommand(command: string, timeout: number = 5000): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(command, { timeout, cwd: this.currentDirectory }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  setCurrentDirectory(directory: string): boolean {
    if (fs.existsSync(directory)) {
      this.currentDirectory = directory;
      return true;
    } else {
      return false;
    }
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    const filePath = path.join(directory, filename);
    try {
      // Check if backup is needed
      if (backup && fs.existsSync(filePath)) {
        const backupPath = filePath + '.bak';
        fs.copyFileSync(filePath, backupPath);
      }
      // Perform the file creation logic here
      fs.writeFileSync(filePath, content);
      return true; // Resolve the promise with true if successful
    } catch (error) {
      console.error('Error creating file:', error);
      return false; // Resolve the promise with false if there is an error
    }
  }
  

  updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
    const fullPath = path.join(this.currentDirectory, filePath);
    return new Promise((resolve, reject) => {
      try {
        let fileContent = fs.readFileSync(fullPath, 'utf8');
        const regexPattern = new RegExp(pattern, 'g');
        fileContent = fileContent.replace(regexPattern, replacement);
        fs.writeFileSync(fullPath, fileContent);
        resolve(true);
      } catch (error) {
        console.error('Error updating file:', error);
        reject(false);
      }
    });
  }

  amendFile(filePath: string, content: string): Promise<boolean> {
    const fullPath = path.join(this.currentDirectory, filePath);
    return new Promise((resolve, reject) => {
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const amendedContent = fileContent + content;
        fs.writeFileSync(fullPath, amendedContent);
        resolve(true);
      } catch (error) {
        console.error('Error amending file:', error);
        reject(false);
      }
    });
  }

// Correctly implement listFiles to match the expected signature
async listFiles(directory: string, limit = 42, offset = 0, orderBy = 'filename'): Promise<string[]> {
  try {
    // Get the full paths of all items in the directory using the promise-based API
    const fullPaths = await fs.promises.readdir(directory, { withFileTypes: true });
    
    // Filter out directories and get file names only
    let fileNames = fullPaths.filter(dirent => dirent.isFile()).map(dirent => dirent.name);

    // Order the files if needed
    if (orderBy === 'datetime') {
      // Get file details including the modification time using the promise-based API
      const filesWithStats = await Promise.all(fileNames.map(async fileName => {
        const fullPath = path.join(directory, fileName);
        const stats = await fs.promises.stat(fullPath);
        return { name: fileName, mtime: stats.mtime };
      }));

      // Sort by modification time
      fileNames = filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()).map(file => file.name);
    } else {
      // Default order by filename
      fileNames.sort();
    }

    // Apply limit and offset for pagination
    const paginatedFiles = fileNames.slice(offset, offset + limit);

    return paginatedFiles;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}


  // Correctly implement getCurrentDirectory to match the expected signature
  getCurrentDirectory(): Promise<string> {
    // If the value needs to be resolved immediately, use Promise.resolve
    return Promise.resolve(this.currentDirectory);
  }
  
}
