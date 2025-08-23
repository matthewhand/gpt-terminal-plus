import { handleShellWebSocket } from '../../../routes/shell/websocket';
import { WebSocket } from 'ws';
import { spawn } from 'child_process';

jest.mock('child_process');
jest.mock('../../../config/convictConfig', () => ({
  convictConfig: () => ({ get: () => 'bash' })
}));

describe('WebSocket Handler', () => {
  let mockWs: any;
  let mockChild: any;

  beforeEach(() => {
    mockWs = {
      readyState: 1, // WebSocket.OPEN
      send: jest.fn(),
      on: jest.fn(),
      close: jest.fn()
    };
    mockChild = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      stdin: { write: jest.fn() },
      on: jest.fn(),
      kill: jest.fn()
    };
    (spawn as jest.Mock).mockReturnValue(mockChild);
  });

  test('should handle WebSocket shell connection', () => {
    handleShellWebSocket(mockWs);
    
    expect(spawn).toHaveBeenCalledWith('bash', [], { stdio: 'pipe' });
    expect(mockWs.send).toHaveBeenCalledWith(
      expect.stringContaining('ready')
    );
  });

  test('should handle stdout data', () => {
    handleShellWebSocket(mockWs);
    
    const stdoutCallback = mockChild.stdout.on.mock.calls.find(
            (call: any) => call[0] === 'data'
    )[1];
    
    stdoutCallback(Buffer.from('test output'));
    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'stdout', data: 'test output' })
    );
  });

  test('should handle process exit', () => {
    handleShellWebSocket(mockWs);
    
    const exitCallback = mockChild.on.mock.calls.find(
            (call: any) => call[0] === 'exit'
    )[1];
    
    exitCallback(0);
    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'exit', code: 0 })
    );
  });
});