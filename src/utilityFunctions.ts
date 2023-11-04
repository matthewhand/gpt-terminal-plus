// This file contains utility functions for index.ts

// Initialize SSH Connection
export function initializeSshConnection() {
  const conn = startNewSshConnection();
  if (!conn) {
    return [null, { error: 'SSH connection failed' }];
  }
  return [conn, null];
}

// Handle Command Timeout
export function handleCommandTimeout(timeout: number, commandFinished: boolean, stdoutBuffer: string, stderrBuffer: string) {
  setTimeout(() => {
    if (!commandFinished) {
      return { warning: 'Command timed out - please validate execution', stdout: stdoutBuffer, stderr: stderrBuffer };
    }
  }, timeout);
}

// Format and Send Response
export function formatAndSendResponse(code: number, stdoutBuffer: string, stderrBuffer: string, res: any) {
  const fullResponse = { result: code !== 0 ? `Exit code: (${code})` : 'Command executed successfully', stdout: stdoutBuffer, stderr: stderrBuffer };
  const responseString = JSON.stringify(fullResponse);
  if (responseString.length > maxResponse) {
    const responseId = generateResponseId();
    return res.status(200).json({ responseId, page: 0, numPages: (responseString.length / maxResponse), data: responseString.substr(0, maxResponse) });
  } else {
    return res.status(200).json(fullResponse);
  }
}
