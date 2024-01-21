import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import { escapeRegExp } from '../utils/escapeRegExp';

export default class LocalServerHandler extends ServerHandler {
  // Explicitly type serverConfig as ServerConfig
  protected serverConfig: ServerConfig;

private psSystemInfoCmd = `
	$info = @{}
	$info['homeFolder'] = [System.Environment]::GetFolderPath('UserProfile')
	$info['type'] = (Get-WmiObject -Class Win32_OperatingSystem).Caption
	$info['release'] = (Get-WmiObject -Class Win32_OperatingSystem).Version
	$info['platform'] = [System.Environment]::OSVersion.Platform
	$info['architecture'] = [System.Environment]::Is64BitOperatingSystem
	$info['totalMemory'] = [System.Math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
	$info['freeMemory'] = [System.Math]::Round((Get-WmiObject -Class Win32_OperatingSystem).FreePhysicalMemory / 1MB, 2)
	$info['uptime'] = (Get-WmiObject -Class Win32_OperatingSystem).LastBootUpTime
	$info['currentFolder'] = Get-Location
	$info['powershellVersion'] = $PSVersionTable.PSVersion.ToString()
	$info | ConvertTo-Json
	`;

private shSystemInfoCmd = `
echo "{
  \"homeFolder\": \"$HOME\",
  \"type\": \"$(uname -o | tr -d '\n')\",
  \"release\": \"$(uname -r | tr -d '\n')\",
  \"platform\": \"$(uname -m | tr -d '\n')\",
  \"architecture\": \"$(lscpu | grep Architecture | awk '{print $2}' | tr -d '\n')\",
  \"totalMemory\": \"$(free -m | grep Mem: | awk '{print $2}' | tr -d '\n')\",
  \"freeMemory\": \"$(free -m | grep Mem: | awk '{print $7}' | tr -d '\n')\",
  \"uptime\": \"$(awk '{print $1}' /proc/uptime | tr -d '\n')\",
  \"currentFolder\": \"$(pwd | tr -d '\n')\"
}"
`

  private execAsync = promisify(exec);

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.serverConfig = serverConfig;
  }

// Implement this method to return a default SystemInfo object
getDefaultSystemInfo(): SystemInfo {
  return {
    homeFolder: '',
    type: '',
    release: '',
    platform: '',
    powershellVersion: '',
    architecture: '',
    totalMemory: 0,
    freeMemory: 0,
    uptime: 0,
    currentFolder: ''
    // Provide default values for all SystemInfo properties
  };
}

  async getSystemInfo(): Promise<SystemInfo> {
    let shellCommand, execShell;

    if (this.serverConfig.shell) {
      if (this.serverConfig.shell === 'powershell') {
        shellCommand = this.psSystemInfoCmd;
        execShell = 'powershell';
      } else {
        shellCommand = this.shSystemInfoCmd;
        execShell = this.serverConfig.shell;
      }
    } else {
      shellCommand = (process.platform === 'win32') ? this.psSystemInfoCmd : this.shSystemInfoCmd;
    }

    try {
        const execOptions = execShell ? { shell: execShell } : {};
        const { stdout } = await this.execAsync(shellCommand, execOptions);
        try {

      const result = JSON.parse(stdout.trim());

        return {
          homeFolder: result.homeFolder,
          type: result.type,
          release: result.release,
          platform: result.platform.toString(),
          powershellVersion: result.powershellVersion,
          architecture: result.architecture ? 'x64' : 'x86',
          totalMemory: result.totalMemory,
          freeMemory: result.freeMemory,
          uptime: new Date(result.uptime).getTime() / 1000, // Convert to seconds
          currentFolder: result.currentFolder.Path
        };

        } catch (parseError) {
            console.error(`Error parsing JSON:`, parseError);
            return this.getDefaultSystemInfo();
        }

    } catch (error) {
      console.error(`Error getting system information:`, error);
      throw error;
    }
  }

  async executeCommand(command: string, timeout: number = 5000, directory: string): Promise<{ stdout: string; stderr: string }> {
    const execOptions = {
      timeout,
      cwd: directory || this.currentDirectory,
      shell: this.serverConfig.shell || undefined
    };

    try {
      const { stdout, stderr } = await this.execAsync(command, execOptions);
      return { stdout, stderr };
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error types if needed, e.g., timeout or execution errors
        if (error.message.includes('ETIMEOUT')) {
          // Handle timeout-specific logic
          throw new Error('Command execution timed out.');
        }
        if (error.message.includes('EACCES')) {
          // Handle permission-related errors
          throw new Error('Permission denied while executing the command.');
        }
        // Add more specific error types as needed

        // Generic error handler for other cases
        throw new Error(`Error executing command: ${error.message}`);
      } else {
        // Handle non-Error exceptions
        throw new Error('An unknown error occurred while executing the command.');
      }
    }
  }


  setCurrentDirectory(directory: string): boolean {
    if (fs.existsSync(directory)) {
      this.currentDirectory = directory;
      return true;
    } else {
      return false;
    }
  }

  async listFiles(directory: string, limit = 42, offset = 0, orderBy = 'filename'): Promise<string[]> {
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
  
      // Perform the slice operation to paginate the file names
      const paginatedFiles = fileNames.slice(offset, offset + limit);
  
      // Debug: Print the paginated files
      if (process.env.DEBUG === 'true') {
        console.log(`Paginated files (offset: ${offset}, limit: ${limit}):`, paginatedFiles);
      }
  
      // Return the paginated list of files
      return paginatedFiles;
  
    } catch (error) {
      if (process.env.DEBUG === 'true') {
        console.error('Error listing files:', error);
      }
      throw error;
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
      const fullPath = path.join(this.currentDirectory, filePath);
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
      const fullPath = path.join(this.currentDirectory, filePath);
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

  getCurrentDirectory(): Promise<string> {
    return Promise.resolve(this.currentDirectory);
  }
  
}
