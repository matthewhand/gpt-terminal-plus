import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import { escapeRegExp } from '../utils/escapeRegExp';
import { psSystemInfoCmd } from './psSystemInfoCommand'; // Importing PowerShell command
import { shSystemInfoCmd } from './shSystemInfoCommand'; // Importing Shell command

export default class LocalServerHandler extends ServerHandler {
  // Explicitly type serverConfig as ServerConfig
  protected serverConfig: ServerConfig;

  private execAsync = promisify(exec);

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.serverConfig = serverConfig;
  }

// Assuming this method is part of the LocalServerHandler class within src/handlers/LocalServerHandler.ts
async getSystemInfo(): Promise<SystemInfo> {
  let shellCommand, execShell;

  if (this.serverConfig.shell) {
      shellCommand = this.serverConfig.shell === 'powershell' ? psSystemInfoCmd : shSystemInfoCmd;
      execShell = this.serverConfig.shell;
  } else {
      shellCommand = process.platform === 'win32' ? psSystemInfoCmd : shSystemInfoCmd;
  }

  try {
      const execOptions = execShell ? { shell: execShell } : {};
      const { stdout } = await this.execAsync(shellCommand, execOptions);

      // Debugging: Log raw stdout
      console.log("Raw stdout:", stdout);

      // Pre-parsing transformation to ensure valid JSON
      const transformedStdout = stdout
          .trim()
          .replace(/(\w+):/g, '"$1":') // Ensure keys are quoted
          .replace(/,\s*}/, '}') // Remove trailing commas before closing braces
          .replace(/:\s*,/g, ':"",'); // Replace missing values with empty strings

      try {
          const result = JSON.parse(transformedStdout);
          console.log("Parsed system info:", result); // Additional logging for debugging
          return this.constructSystemInfo(result);
      } catch (parseError) {
          console.error(`Error parsing JSON from transformed stdout. Transformed output: ${transformedStdout}`, parseError);
          return this.getDefaultSystemInfo();
      }
  } catch (error) {
      console.error(`Error getting system information:`, error);
      return this.getDefaultSystemInfo();
  }
}

protected getDefaultSystemInfo(): SystemInfo {
  return {
      homeFolder: process.env.HOME || process.env.USERPROFILE || '/',
      type: process.platform,
      release: 'N/A',
      platform: 'N/A',
      powershellVersion: 'N/A',
      architecture: process.arch,
      totalMemory: Math.round(os.totalmem() / 1024 / 1024), // In MB
      freeMemory: Math.round(os.freemem() / 1024 / 1024), // In MB
      uptime: process.uptime(), // In seconds
      currentFolder: process.cwd()
  };
}

private constructSystemInfo(rawData: any): SystemInfo {
    // Construct the SystemInfo object from the parsed JSON data
    return {
        homeFolder: rawData.homeFolder || '',
        type: rawData.type || '',
        release: rawData.release || '',
        platform: rawData.platform || '',
        powershellVersion: rawData.powershellVersion || '',
        architecture: rawData.architecture || '',
        totalMemory: rawData.totalMemory || 0,
        freeMemory: rawData.freeMemory || 0,
        uptime: rawData.uptime || 0,
        currentFolder: rawData.defaultFolder || ''
        // Add other fields as necessary, based on your JSON structure
    };
}
async executeCommand(command: string, options: { timeout?: number, directory?: string, linesPerPage?: number } = {}): Promise<{ stdout?: string, stderr?: string, pages?: string[], totalPages?: number, responseId?: string }> {
  const { timeout = 5000, directory = '', linesPerPage = 100 } = options;
  const execOptions = {
      timeout,
      cwd: directory || process.cwd(),
      shell: this.serverConfig.shell ? this.serverConfig.shell.toString() : undefined
  };

  try {
      const { stdout, stderr } = await this.execAsync(command, execOptions);

      if (linesPerPage > 0) {
          const output = stdout + (stderr ? `\nErrors:\n${stderr}` : '');
          const lines = output.split('\n');
          const pages = [];
          for (let i = 0; i < lines.length; i += linesPerPage) {
              pages.push(lines.slice(i, i + linesPerPage).join('\n'));
          }
          return {
              stdout,  // Optional: include raw stdout for completeness
              stderr,  // Optional: include raw stderr for completeness
              pages,
              totalPages: pages.length,
              responseId: this.generateResponseId()
          };
      }

      return { stdout, stderr };
  } catch (error) {
      console.error('Error executing command:', error);
      throw new Error('Failed to execute command');
  }
}

  // setDefaultDirectory(directory: string): boolean {
  //   if (fs.existsSync(directory)) {
  //     this.defaultDirectory = directory;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  async listFiles(directory: string, limit = 42, offset = 0, orderBy = 'filename'): Promise<{ items: string[]; totalPages: number; responseId: string }> {
    try {
        // Debug: Log the input parameters
        if (process.env.DEBUG === 'true') {
            console.log(`Listing files with parameters - Directory: ${directory}, Limit: ${limit}, Offset: ${offset}, OrderBy: ${orderBy}`);
        }

        const fullPaths = await fs.promises.readdir(directory, { withFileTypes: true });

        // Debug: Log the full paths retrieved
        if (process.env.DEBUG === 'true') {
            console.log('Full paths retrieved:', fullPaths);
        }

        let fileNames = fullPaths.filter(dirent => dirent.isFile()).map(dirent => dirent.name);

        if (orderBy === 'datetime') {
            const filesWithStats = await Promise.all(fileNames.map(async fileName => {
                const fullPath = path.join(directory, fileName);
                const stats = await fs.promises.stat(fullPath);
                return { name: fileName, mtime: stats.mtime };
            }));

            // Log filesWithStats before sorting
            console.log('Before sorting:', filesWithStats);

            fileNames = filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()).map(file => file.name);

            // Log fileNames after sorting
            console.log('After sorting:', fileNames);
        } else {
            fileNames.sort();
        }

        // Debug: Print the filenames before pagination
        if (process.env.DEBUG === 'true') {
            console.log('Files found:', fileNames);
        }

        // Calculate total pages
        const totalPages = Math.ceil(fileNames.length / limit);
        // Perform the slice operation to paginate the file names
        const paginatedFiles = fileNames.slice(offset, offset + limit);

        // Debug: Print the paginated files
        if (process.env.DEBUG === 'true') {
            console.log(`Paginated files (offset: ${offset}, limit: ${limit}):`, paginatedFiles);
        }

        // Return the paginated list of files with a unique response ID
        return {
            items: paginatedFiles,
            totalPages: totalPages,
            responseId: uuidv4() // Generate a unique ID for this operation
        };

    } catch (error) {
        if (process.env.DEBUG === 'true') {
            console.error('Error listing files:', error);
        }
        throw error; // Ensure to re-throw the error to maintain error propagation
    }
}
      
    async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
      const filePath = path.join(directory, filename);
      try {
        if (backup && fs.existsSync(filePath)) {
          const backupPath = filePath + '.bak';
          fs.copyFileSync(filePath, backupPath);
        }
  
        fs.writeFileSync(filePath, content);
        return true;
      } catch (error) {
        if (process.env.DEBUG === 'true') {
          console.error('Error creating file:', error);
        }
        return false;
      }
    }
  
    async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
      const fullPath = path.join(this.defaultDirectory, filePath);
      try {
        if (process.env.DEBUG === 'true') {
          console.log('Updating file:', fullPath);
        }
  
        let fileContent = fs.readFileSync(fullPath, 'utf8');
        const regexPattern = new RegExp(escapeRegExp(pattern), 'g');
        fileContent = fileContent.replace(regexPattern, replacement);
  
        if (backup) {
          const backupPath = fullPath + '.bak';
          fs.copyFileSync(fullPath, backupPath);
        }
  
        fs.writeFileSync(fullPath, fileContent);
  
        // Check the server configuration for the 'code' option
        const shouldOpenInEditor = this.serverConfig.code === true;
  
        if (shouldOpenInEditor) {
          // Open in VSCode at the first occurrence of the pattern
          const match = regexPattern.exec(fileContent);
          if (match) {
            const lineNumber = fileContent.substring(0, match.index).split('\n').length;
            exec(`code --goto ${fullPath}:${lineNumber}:1`);
          }
        }
  
        return true;
      } catch (error) {
        if (process.env.DEBUG === 'true') {
          console.error('Error updating file:', error);
        }
        return false;
      }
    }
    
    async amendFile(filePath: string, content: string): Promise<boolean> {
      const fullPath = path.join(this.defaultDirectory, filePath);
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const amendedContent = fileContent + content;
        fs.writeFileSync(fullPath, amendedContent);
        return true;
      } catch (error) {
        if (process.env.DEBUG === 'true') {
          console.error('Error amending file:', error);
        }
        return false;
      }
    }

  // getdefaultDirectory(): Promise<string> {
  //   return Promise.resolve(this.defaultDirectory);
  // }
  
}
