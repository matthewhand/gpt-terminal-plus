import { activityTools, executeTool, getToolDefinitions } from '../../src/llm/activityTools';
import fs from 'fs/promises';
import path from 'path';

describe('Activity Tools', () => {
  const testDir = path.join('data', 'activity', '2025-08-21');
  const testSession = 'session_test_123';
  const testSessionDir = path.join(testDir, testSession);

  beforeAll(async () => {
    // Create test activity data
    await fs.mkdir(testSessionDir, { recursive: true });
    await fs.writeFile(
      path.join(testSessionDir, 'meta.json'),
      JSON.stringify({ sessionId: testSession, startedAt: new Date().toISOString() })
    );
    await fs.writeFile(
      path.join(testSessionDir, '01-test.json'),
      JSON.stringify({ type: 'test', data: 'test data' })
    );
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await fs.rm(testSessionDir, { recursive: true, force: true });
    } catch {}
  });

  describe('getToolDefinitions', () => {
    it('should return tool definitions in correct format', () => {
      const definitions = getToolDefinitions();
      
      expect(Array.isArray(definitions)).toBe(true);
      expect(definitions.length).toBeGreaterThan(0);
      
      definitions.forEach(def => {
        expect(def).toHaveProperty('type', 'function');
        expect(def).toHaveProperty('function');
        expect(def.function).toHaveProperty('name');
        expect(def.function).toHaveProperty('description');
        expect(def.function).toHaveProperty('parameters');
      });
    });
  });

  describe('listSessions tool', () => {
    it('should list sessions for a given date', async () => {
      const result = await executeTool('listSessions', { date: '2025-08-21' });
      const sessions = JSON.parse(result);
      
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions).toContain(testSession);
    });

    it('should return empty array for non-existent date', async () => {
      const result = await executeTool('listSessions', { date: '2025-01-01' });
      const sessions = JSON.parse(result);
      
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBe(0);
    });

    it('should use today as default date', async () => {
      const result = await executeTool('listSessions', {});
      const sessions = JSON.parse(result);
      
      expect(Array.isArray(sessions)).toBe(true);
    });
  });

  describe('readFile tool', () => {
    it('should read activity log files', async () => {
      const filePath = path.join(testSessionDir, 'meta.json');
      const result = await executeTool('readFile', { path: filePath });
      
      const data = JSON.parse(result);
      expect(data).toHaveProperty('sessionId', testSession);
    });

    it('should reject non-activity paths', async () => {
      const result = await executeTool('readFile', { path: 'package.json' });
      
      const data = JSON.parse(result);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Access denied');
    });

    it('should handle non-existent files', async () => {
      const result = await executeTool('readFile', { path: 'data/activity/2025-01-01/nonexistent.json' });
      
      const data = JSON.parse(result);
      expect(data).toHaveProperty('error');
    });
  });

  describe('executeTool', () => {
    it('should throw error for unknown tool', async () => {
      await expect(executeTool('unknownTool', {})).rejects.toThrow('Tool unknownTool not found');
    });
  });
});