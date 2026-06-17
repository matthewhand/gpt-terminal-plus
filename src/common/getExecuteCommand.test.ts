import { getExecuteCommand } from './getExecuteCommand';

describe('getExecuteCommand', () => {
  test('should return the correct command for bash shell', () => {
    const shell = 'bash';
    const filePath = '/path/to/script.sh';
    const expectedCommand = 'bash /path/to/script.sh';
    const result = getExecuteCommand(shell, filePath);
    expect(result).toBe(expectedCommand);
  });

  test('should return the correct command for powershell', () => {
    const shell = 'powershell';
    const filePath = 'C:\\scripts\\script.ps1';
    const expectedCommand = 'Powershell -File C:\\scripts\\script.ps1';
    const result = getExecuteCommand(shell, filePath);
    expect(result).toBe(expectedCommand);
  });

  test('should return the correct command for python', () => {
    const shell = 'python';
    const filePath = '/app/script.py';
    const expectedCommand = 'python /app/script.py';
    const result = getExecuteCommand(shell, filePath);
    expect(result).toBe(expectedCommand);
  });

  test('should quote paths with spaces for bash', () => {
    const shell = 'bash';
    const filePath = '/path/with spaces/my script.sh';
    const expectedCommand = 'bash "/path/with spaces/my script.sh"';
    const result = getExecuteCommand(shell, filePath);
    expect(result).toBe(expectedCommand);
  });

  test('should quote paths with spaces for powershell', () => {
    const shell = 'powershell';
    const filePath = 'C:\\Program Files\\Scripts\\script.ps1';
    const expectedCommand = 'Powershell -File "C:\\Program Files\\Scripts\\script.ps1"';
    const result = getExecuteCommand(shell, filePath);
    expect(result).toBe(expectedCommand);
  });

  test('should throw error if shell is not provided', () => {
    const filePath = '/path/to/script.sh';
    expect(() => getExecuteCommand('', filePath)).toThrow('Shell must be provided and must be a string.');
  });

  test('should throw error if filePath is not provided', () => {
    const shell = 'bash';
    expect(() => getExecuteCommand(shell, '')).toThrow('File path must be provided and must be a string.');
  });
});
