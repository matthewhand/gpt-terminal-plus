import { chatForServer } from '../src/llm';

// Mock all LLM providers with consistent responses
jest.mock('../src/llm/providers/ollama', () => ({
  chatWithOllama: jest.fn(async () => ({
    provider: 'ollama',
    model: 'llama2:7b',
    choices: [{ index: 0, message: { role: 'assistant', content: 'Ollama response' } }]
  })),
  chatWithOllamaStream: jest.fn()
}));

jest.mock('../src/llm/providers/lmstudio', () => ({
  chatWithLmStudio: jest.fn(async () => ({
    provider: 'lmstudio',
    model: 'local-model',
    choices: [{ index: 0, message: { role: 'assistant', content: 'LM Studio response' } }]
  })),
  chatWithLmStudioStream: jest.fn()
}));

jest.mock('../src/llm/providers/openai', () => ({
  chatWithOpenAI: jest.fn(async () => ({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    choices: [{ index: 0, message: { role: 'assistant', content: 'OpenAI response' } }]
  })),
  chatWithOpenAIStream: jest.fn()
}));

describe('LLM Provider Routing', () => {
  const mockMessages = [{ role: 'user', content: 'Test message' }];
  const mockChatRequest = { model: 'test-model', messages: mockMessages };

  describe('Provider Selection', () => {
    it('routes to Ollama provider', async () => {
      const server = {
        hostname: 'localhost',
        protocol: 'local',
        llm: { provider: 'ollama', baseUrl: 'http://localhost:11434' }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('ollama');
      expect(res.choices[0].message.content).toBe('Ollama response');
    });

    it('routes to LM Studio provider', async () => {
      const server = {
        hostname: 'localhost',
        protocol: 'local',
        llm: { provider: 'lmstudio', baseUrl: 'http://localhost:1234' }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('lmstudio');
      expect(res.choices[0].message.content).toBe('LM Studio response');
    });

    it('routes to OpenAI provider', async () => {
      const server = {
        hostname: 'localhost',
        protocol: 'local',
        llm: { provider: 'openai', baseUrl: 'https://api.openai.com' }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('openai');
      expect(res.choices[0].message.content).toBe('OpenAI response');
    });
  });

  describe('Provider Configuration Validation', () => {
    it('validates Ollama configuration', async () => {
      const server = {
        hostname: 'ollama-server',
        protocol: 'local',
        llm: {
          provider: 'ollama',
          baseUrl: 'http://ollama-server:11434',
          model: 'llama2:7b'
        }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('ollama');
    });

    it('validates LM Studio configuration', async () => {
      const server = {
        hostname: 'lmstudio-server',
        protocol: 'local',
        llm: {
          provider: 'lmstudio',
          baseUrl: 'http://lmstudio-server:1234',
          apiKey: 'lm-studio-key'
        }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('lmstudio');
    });

    it('validates OpenAI configuration', async () => {
      const server = {
        hostname: 'openai-proxy',
        protocol: 'local',
        llm: {
          provider: 'openai',
          baseUrl: 'https://api.openai.com',
          apiKey: 'sk-test-key'
        }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('openai');
    });
  });

  describe('Error Handling', () => {
    it('handles missing provider configuration', async () => {
      const server = {
        hostname: 'test-server',
        protocol: 'local',
        llm: {} // Missing provider
      };

      await expect(chatForServer(server as any, mockChatRequest as any))
        .rejects.toThrow();
    });

    it('handles invalid provider', async () => {
      const server = {
        hostname: 'test-server',
        protocol: 'local',
        llm: { provider: 'invalid-provider', baseUrl: 'http://test' }
      };

      await expect(chatForServer(server as any, mockChatRequest as any))
        .rejects.toThrow();
    });

    it('handles missing baseUrl', async () => {
      const server = {
        hostname: 'test-server',
        protocol: 'local',
        llm: { provider: 'ollama' } // Missing baseUrl
      };

      await expect(chatForServer(server as any, mockChatRequest as any))
        .rejects.toThrow();
    });
  });

  describe('Provider-Specific Features', () => {
    it('handles Ollama-specific parameters', async () => {
      const server = {
        hostname: 'localhost',
        protocol: 'local',
        llm: {
          provider: 'ollama',
          baseUrl: 'http://localhost:11434',
          temperature: 0.7,
          top_p: 0.9
        }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('ollama');
    });

    it('handles OpenAI-specific parameters', async () => {
      const server = {
        hostname: 'localhost',
        protocol: 'local',
        llm: {
          provider: 'openai',
          baseUrl: 'https://api.openai.com',
          apiKey: 'sk-test',
          max_tokens: 1000,
          temperature: 0.5
        }
      };

      const res = await chatForServer(server as any, mockChatRequest as any);
      expect(res.provider).toBe('openai');
    });
  });

  describe('Response Format Consistency', () => {
    it('ensures consistent response structure across providers', async () => {
      const providers = ['ollama', 'lmstudio', 'openai'];
      
      for (const provider of providers) {
        const server = {
          hostname: 'localhost',
          protocol: 'local',
          llm: { provider, baseUrl: `http://localhost:${provider === 'openai' ? '443' : '11434'}` }
        };

        const res = await chatForServer(server as any, mockChatRequest as any);
        
        expect(res).toHaveProperty('provider');
        expect(res).toHaveProperty('model');
        expect(res).toHaveProperty('choices');
        expect(Array.isArray(res.choices)).toBe(true);
        expect(res.choices[0]).toHaveProperty('index');
        expect(res.choices[0]).toHaveProperty('message');
        expect(res.choices[0].message).toHaveProperty('role');
        expect(res.choices[0].message).toHaveProperty('content');
      }
    });
  });

  describe('Provider Fallback', () => {
    it('handles provider failures gracefully', async () => {
      const { chatWithOllama } = require('../src/llm/providers/ollama');
      chatWithOllama.mockRejectedValueOnce(new Error('Provider unavailable'));

      const server = {
        hostname: 'localhost',
        protocol: 'local',
        llm: { provider: 'ollama', baseUrl: 'http://localhost:11434' }
      };

      await expect(chatForServer(server as any, mockChatRequest as any))
        .rejects.toThrow('Provider unavailable');
    });
  });

  describe('Message Processing', () => {
    it('passes messages correctly to providers', async () => {
      const { chatWithOllama } = require('../src/llm/providers/ollama');
      
      const server = {
        hostname: 'localhost',
        protocol: 'local',
        llm: { provider: 'ollama', baseUrl: 'http://localhost:11434' }
      };

      const complexMessages = [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' }
      ];

      await chatForServer(server as any, { model: 'test', messages: complexMessages } as any);
      
      expect(chatWithOllama).toHaveBeenCalledWith(
        expect.objectContaining({ messages: complexMessages }),
        expect.any(Object)
      );
    });
  });
});

