import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import Debug from "debug";

const debug = Debug("app:ssmUtils");

/**
 * Creates a temporary script file on the server.
 * @param {string} scriptContent - The content of the script to create.
 * @param {string} scriptExtension - The file extension for the script.
 * @param {string} directory - The directory to create the script in.
 * @returns {Promise<string>} The path to the created script file.
 */
export const createTempScript = async (
  scriptContent: string,
  scriptExtension: string,
  directory: string
): Promise<string> => {
  const tempFileName = uuidv4() + scriptExtension;
  const tempFilePath = path.join(directory, tempFileName);
  debug("Creating temporary script at: " + tempFilePath);
  fs.writeFileSync(tempFilePath, scriptContent, { mode: 0o700 }); // Setting secure permissions
  return tempFilePath;
};

