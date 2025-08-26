import { GlobalState, getGlobalState, _resetGlobalStateForTests, clearGlobalState } from '../../src/utils/GlobalStateHelper';

describe('GlobalStateHelper', () => {
  beforeEach(() => {
    _resetGlobalStateForTests();
  });

  afterEach(() => {
    _resetGlobalStateForTests();
  });

  describe('getGlobalState', () => {
    it('should return initial state with default values', () => {
      const state = getGlobalState();
      expect(state.selectedServer).toBe('');
      expect(state.presentWorkingDirectory).toBe('');
      expect(state.selectedModel).toBe('');
    });

    it('should return the same instance on multiple calls', () => {
      const state1 = getGlobalState();
      const state2 = getGlobalState();
      expect(state1).toBe(state2);
    });
  });

  describe('selectedServer', () => {
    it('should get and set selectedServer', () => {
      const state = getGlobalState();
      state.selectedServer = 'test-server';
      expect(state.selectedServer).toBe('test-server');
    });

    it('should persist selectedServer across getGlobalState calls', () => {
      const state1 = getGlobalState();
      state1.selectedServer = 'persistent-server';
      
      const state2 = getGlobalState();
      expect(state2.selectedServer).toBe('persistent-server');
    });

    it('should handle empty string', () => {
      const state = getGlobalState();
      state.selectedServer = '';
      expect(state.selectedServer).toBe('');
    });

    it('should handle special characters in server name', () => {
      const state = getGlobalState();
      const specialServer = 'server-with-special@chars#123';
      state.selectedServer = specialServer;
      expect(state.selectedServer).toBe(specialServer);
    });
  });

  describe('presentWorkingDirectory', () => {
    it('should get and set presentWorkingDirectory', () => {
      const state = getGlobalState();
      state.presentWorkingDirectory = '/home/user/project';
      expect(state.presentWorkingDirectory).toBe('/home/user/project');
    });

    it('should persist presentWorkingDirectory across getGlobalState calls', () => {
      const state1 = getGlobalState();
      state1.presentWorkingDirectory = '/persistent/path';
      
      const state2 = getGlobalState();
      expect(state2.presentWorkingDirectory).toBe('/persistent/path');
    });

    it('should handle relative paths', () => {
      const state = getGlobalState();
      state.presentWorkingDirectory = './relative/path';
      expect(state.presentWorkingDirectory).toBe('./relative/path');
    });

    it('should handle Windows-style paths', () => {
      const state = getGlobalState();
      state.presentWorkingDirectory = 'C:\\Users\\test\\project';
      expect(state.presentWorkingDirectory).toBe('C:\\Users\\test\\project');
    });

    it('should handle empty string', () => {
      const state = getGlobalState();
      state.presentWorkingDirectory = '';
      expect(state.presentWorkingDirectory).toBe('');
    });
  });

  describe('selectedModel', () => {
    it('should get and set selectedModel', () => {
      const state = getGlobalState();
      state.selectedModel = 'gpt-4';
      expect(state.selectedModel).toBe('gpt-4');
    });

    it('should persist selectedModel across getGlobalState calls', () => {
      const state1 = getGlobalState();
      state1.selectedModel = 'claude-3';
      
      const state2 = getGlobalState();
      expect(state2.selectedModel).toBe('claude-3');
    });

    it('should handle model names with versions', () => {
      const state = getGlobalState();
      state.selectedModel = 'gpt-4-turbo-preview';
      expect(state.selectedModel).toBe('gpt-4-turbo-preview');
    });

    it('should handle empty string', () => {
      const state = getGlobalState();
      state.selectedModel = '';
      expect(state.selectedModel).toBe('');
    });
  });

  describe('clearGlobalState', () => {
    it('should reset all state properties to empty strings', () => {
      const state = getGlobalState();
      state.selectedServer = 'test-server';
      state.presentWorkingDirectory = '/test/path';
      state.selectedModel = 'test-model';
      
      clearGlobalState();
      
      expect(state.selectedServer).toBe('');
      expect(state.presentWorkingDirectory).toBe('');
      expect(state.selectedModel).toBe('');
    });

    it('should maintain singleton behavior after clearing', () => {
      const state1 = getGlobalState();
      state1.selectedServer = 'test';
      
      clearGlobalState();
      
      const state2 = getGlobalState();
      expect(state1).toBe(state2);
      expect(state2.selectedServer).toBe('');
    });
  });

  describe('_resetGlobalStateForTests', () => {
    it('should reset state for testing purposes', () => {
      const state = getGlobalState();
      state.selectedServer = 'test-server';
      state.presentWorkingDirectory = '/test/path';
      state.selectedModel = 'test-model';
      
      _resetGlobalStateForTests();
      
      const newState = getGlobalState();
      expect(newState.selectedServer).toBe('');
      expect(newState.presentWorkingDirectory).toBe('');
      expect(newState.selectedModel).toBe('');
    });
  });

  describe('state mutations', () => {
    it('should handle multiple property updates', () => {
      const state = getGlobalState();
      
      state.selectedServer = 'server1';
      state.presentWorkingDirectory = '/path1';
      state.selectedModel = 'model1';
      
      expect(state.selectedServer).toBe('server1');
      expect(state.presentWorkingDirectory).toBe('/path1');
      expect(state.selectedModel).toBe('model1');
      
      state.selectedServer = 'server2';
      expect(state.selectedServer).toBe('server2');
      expect(state.presentWorkingDirectory).toBe('/path1'); // unchanged
      expect(state.selectedModel).toBe('model1'); // unchanged
    });

    it('should handle concurrent access patterns', () => {
      const state1 = getGlobalState();
      const state2 = getGlobalState();
      
      state1.selectedServer = 'concurrent-server';
      expect(state2.selectedServer).toBe('concurrent-server');
      
      state2.presentWorkingDirectory = '/concurrent/path';
      expect(state1.presentWorkingDirectory).toBe('/concurrent/path');
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const state = getGlobalState();
      const longString = 'a'.repeat(1000);
      
      state.selectedServer = longString;
      expect(state.selectedServer).toBe(longString);
      expect(state.selectedServer.length).toBe(1000);
    });

    it('should handle unicode characters', () => {
      const state = getGlobalState();
      const unicodeString = '🚀 server-测试-🔥';
      
      state.selectedServer = unicodeString;
      expect(state.selectedServer).toBe(unicodeString);
    });

    it('should handle null-like values as strings', () => {
      const state = getGlobalState();
      
      state.selectedServer = 'null';
      expect(state.selectedServer).toBe('null');
      
      state.selectedServer = 'undefined';
      expect(state.selectedServer).toBe('undefined');
    });
  });
});