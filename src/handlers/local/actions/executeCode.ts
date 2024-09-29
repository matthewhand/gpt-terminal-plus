import { exec } from 'child_process';

interface ExecuteCommandResult {
  stdout: string;
  stderr: string;
}

export async function executeCode(code: string, language: string): Promise<ExecuteCommandResult> {
  if (!code || typeof code !== 'string') {
    throw new Error('Code is required for execution.');
  }

  if (!language || typeof language !== 'string') {
    throw new Error('Language is required for code execution.');
  }

  return new Promise((resolve, reject) => {
    exec(`${language} -c "${code}"`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error('Failed to execute code: ' + error.message));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}
