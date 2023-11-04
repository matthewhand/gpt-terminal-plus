import servers from './servers';
import { config } from './config';

import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

let conn: Client | null = null;

const commandTimeout = 180000; // Timeout for commands in milliseconds
const maxResponse = 2000; // Characters to return
// let currentDirectory = os.homedir();
let currentDirectory = "";

// Pagination response storage
const responseStorage: { [id: string]: string } = {};

// Counter for generating unique response IDs
let responseCounter = 0;

// Function to generate a unique response ID
function generateResponseId() {
  return (responseCounter++).toString();
}

import SFTPClient from 'ssh2-sftp-client';

function createSFTPConnection(server: string) {
  if (!server || !server.includes('@')) {
    throw new Error('Invalid server format. Expected username@host.');
  }

  const [username, host] = server.split('@');
  console.log(`DEBUG SFTPClient: ${username}@${host}`);
  const privateKey = fs.readFileSync(getPrivateKeyPath(server)); // Assuming getPrivateKeyPath is defined

  const client = new SFTPClient();

  const config = {
    host: host,
    username: username,
    privateKey: privateKey,
    debug: msg => { console.error(msg); }
  };

  return { client, config };
}

function handleErrorResponse(res: any, err: any) {
  res.status(500).json({ error: err.message });
}

// Refactored handleRemoteFileCreation to return a Promise
export function handleRemoteFileCreation(server: string, filePath: string, content: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const [username, host] = server.split('@');
    const client = new SFTPClient();

    client.connect({
      host: host,
      username: username,
      privateKey: fs.readFileSync(getPrivateKeyPath(server)),
    })
    .then(() => {
      return client.put(Buffer.from(content), filePath);
    })
    .then(() => {
      resolve({
        message: 'File created or replaced successfully on remote server.',
        bytesWritten: content.length,
      });
      return client.end();
    })
    .catch((err: any) => {
      console.error('Connection error:', err);
      reject(err);
    });
  });
}

// Modified executeRemotePythonCode function to use handleRemoteFileCreation
export async function executeRemotePythonCode(server: string, pythonCode: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // Dynamically generate a unique temporary file path
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const remoteTempFilePath = `/tmp/remote_python_code_${timestamp}_${randomNum}.py`;

    try {
      // Create the temporary Python file
      await handleRemoteFileCreation(server, remoteTempFilePath, pythonCode);

      // Execute the Python code
      const stdout = await executeRemoteCommand(`python3 ${remoteTempFilePath}`);

      // Clean up the temporary file
      await executeRemoteCommand(`rm ${remoteTempFilePath}`);

      resolve(stdout);
    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
      reject(err);
    }
  });
}

export function handleRemoteFileAmendment(
  server: string,
  filePath: string,
  content: string,
  res: any
) {
  console.log(`DEBUG handleRemoteFileAmendment: ${filePath} - ${content}`);

  // const client = createSFTPConnection(server);

  // client.connect()
  //   .then(() => {
  //     return client.get(filePath);
  //   })
  //   .then((stream: any) => {
  //     let data = '';
  //     stream.on('data', (chunk: any) => {
  //       data += chunk.toString('utf8');
  //     });
  //     stream.on('end', () => {
  //       const amendedContent = [data.slice(0, data.length), content, data.slice(data.length)].join('');
  //       return client.put(Buffer.from(amendedContent), filePath);
  //     });
  //   })
  //   .then(() => {
  //     res.status(200).json({
  //       message: 'File amended successfully on remote server.',
  //       bytesWritten: content.length,
  //     });
  //     return client.end();
  //   })
  //   .catch((err: any) => {
  //     handleErrorResponse(res, err);
  //   });
}


export function getPrivateKeyPath(serverAddress: string = "") {
  // Find the server object based on the address
  const server = servers.find(s => s.address === serverAddress);

  // // If server is not found, handle the error
   if (!server) {
     console.error(`Server not found: ${serverAddress}`);
  //   throw new Error("Server not found");
   }

  // If keyPath is specified, use it
  if (server && server.keyPath) {
    const keyPath = path.join(process.env.HOME || '', server.keyPath);
    console.log(`Constructed key path: ${keyPath}`);
    if (fs.existsSync(keyPath)) {
      console.log(`Using specified key path: ${keyPath}`);
      return keyPath;
    } else {
      console.warn(`Specified key path does not exist: ${keyPath}`);
    }
  }

  // Default behavior
  const defaultKeyPath = path.join(process.env.HOME || '', '.ssh', 'id_rsa');
  if (fs.existsSync(defaultKeyPath)) {
    console.log(`Using default key path: ${defaultKeyPath}`);
    return defaultKeyPath;
  } else {
    console.error(`Default key path does not exist: ${defaultKeyPath}`);
    throw new Error("Private key not found");
  }
}

export function startNewSshConnection() {
  // if (!conn) {
    conn = new Client();
    const [username, host] = config.server!.split('@');
    conn.on('error', (err) => {
      console.error('Connection error:', err);
      conn = null; // Reset the connection
    });
    conn.connect({
      host: host,
      username: username,
      privateKey: fs.readFileSync(getPrivateKeyPath(config.server)),
    });
  // }
  return conn;
}

export function executeRemoteCommand(command: string, directory?: string): Promise<string> {
  console.log("Debug: Entering executeRemoteCommand");
  return new Promise((resolve, reject) => {
    console.log("Debug: Inside Promise");
    const conn = startNewSshConnection();
    let stdoutBuffer = '';
    if (conn) {
      console.log("Debug: Connection established");
      conn.on('ready', () => {
        console.log("Debug: Connection ready");
        const fullCommand = directory ? `cd ${directory} && ${command}` : command;
        conn.exec(fullCommand, (err: any, stream: any) => {
          if (err) {
            console.error('Command execution error:', err);
            reject(err.message);
            return;
          }
          stream.on('data', (data: any) => {
            stdoutBuffer += data.toString();
          }).stderr.on('data', (data: any) => {
            console.error('Remote command stderr:', data.toString());
          });
          stream.on('close', (code: number) => {
            console.log(`Debug: Command exited with code ${code}`);
            if (code !== 0) {
              reject(`Remote command exited with code ${code}`);
            } else {
              resolve(stdoutBuffer);
            }
            conn.end(); // Close the connection
          });
        });
      });
    } else {
      console.log("Debug: Connection not established");
      reject('Connection not established');
    }
  });
}

export function handleRemoteCommand(command: string, res: any, timeout: number = commandTimeout, callback?: (remoteInfo: any) => void) {
  const conn = startNewSshConnection();
  let commandFinished = false;
  let stdoutBuffer = '';
  let stderrBuffer = '';
  let responseSent = false; 

  const sendResponse = (status: number, payload: any) => {
    if (!responseSent) {  // Check the flag before sending a response
      res.status(status).json(payload);
      responseSent = true;  // Set the flag to true after sending a response
    }
  };

  if (!conn) {
    return sendResponse(500, { error: 'SSH connection failed' });
  }

  if (timeout > 0) {
    setTimeout(() => {
      if (!commandFinished) {
        sendResponse(500, { warning: 'Command timed out - buffers included in response for analysis', stdout: stdoutBuffer, stderr: stderrBuffer });
      }
    }, timeout);
  }

  conn.on('ready', () => {
    conn.exec(command, (err: any, stream: any) => {
      if (err) {
        console.error('Command execution error:', err);
        return res.status(500).json({ error: err.message });
      }
      stream.on('data', (data: any) => {
        stdoutBuffer += data.toString();
      }).stderr.on('data', (data: any) => {
        stderrBuffer += data.toString();
      });

      stream.on('close', (code: number) => {
        commandFinished = true;
        const fullResponse = { result: code !== 0 ? `Exit code: (${code})` : 'Command executed successfully', stdout: stdoutBuffer, stderr: stderrBuffer };
        const responseString = JSON.stringify(fullResponse);

        if (responseString.length > maxResponse) {
          const responseId = generateResponseId(); // Function to generate a unique ID
          responseStorage[responseId] = responseString;
          sendResponse(200,
            { responseId, page: 0, numPages: (responseString.length / maxResponse), data: responseString.substr(0, maxResponse) }
            );
        } else {
          sendResponse(200, fullResponse);  // Use sendResponse instead of res.status().json()
        }

        conn.end(); // Close the connection
        console.log(`Command exited with code ${code}`); // Log the exit code

        if (typeof callback === 'function') {
          callback(fullResponse); // Call the callback with the response if provided
        }

      });
    });
  }).on('error', (err: any) => {
    console.error('SSH connection error:', err);
    return sendResponse(500, { error: 'SSH connection error: ' + err.message });
  });
}


export async function listFilesRemote(req: any, res: any) {
    const directory = req.body.directory;
    const orderBy = req.body.orderBy; // 'datetime' or 'filename'
    const limit = req.body.limit || 42;
    const offset = req.body.offset || 0;
 
  try {
    // Translate arguments into shell cmds
      const command = `ls -1 ${directory}`;
      handleRemoteCommand(command, res, undefined, (remoteInfo: any) => {
        let files = remoteInfo.stdout ? remoteInfo.stdout.split('\n').filter(Boolean) : [];

        if (orderBy === 'datetime') {
          // Assuming remote system supports 'ls -lt'
          const commandForDatetime = `ls -lt ${directory} | awk '{print $9}'`;
          handleRemoteCommand(commandForDatetime, res, undefined, (datetimeInfo: any) => {
            files = datetimeInfo.stdout ? datetimeInfo.stdout.split('\n').filter(Boolean) : [];
          });
        } else if (orderBy === 'filename') {
          files = files.sort();
        }

        const paginatedFiles = files.slice(offset, offset + limit);
        return res.status(200).json({ files: paginatedFiles });
      });
  } catch (error) {
    console.error('An exception occurred:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
