import { planCommand } from '../../engines/llmEngine';
import { costTracker } from '../../utils/costTracker';

jest.mock('../../config/convictConfig');
jest.mock('../../utils/costTracker');

describe('LLM Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (costTracker.checkBudget as jest.Mock).mockReturnValue({ allowed: true, remaining: 10 });
    (costTracker.addCost as jest.Mock).mockImplementation(() => {});
  });

  test('should plan command with valid input', async () => {
    const result = await planCommand('list files');
    expect(result).toHaveProperty('command');
    expect(result).toHaveProperty('explanation');
    expect(result.command).toBeTruthy();
    expect(costTracker.addCost).toHaveBeenCalled();
  });

  test('should handle different command types', async () => {
    const result = await planCommand('find python files');
    expect(result.command).toBeTruthy();
    expect(result.explanation).toContain('command');
  });

  test('should reject when budget exceeded', async () => {
    (costTracker.checkBudget as jest.Mock).mockReturnValue({ allowed: false, remaining: 0 });
    await expect(planCommand('test')).rejects.toThrow('budget exceeded');
  });

  test('should track costs for commands', async () => {
    await planCommand('simple command');
    expect(costTracker.addCost).toHaveBeenCalledWith(expect.any(Number));
  });

  test('should handle valid command planning', async () => {
    const result = await planCommand('valid input');
    expect(result.command).toBeDefined();
    expect(result.explanation).toBeDefined();
  });

  test('should handle empty input validation', async () => {
    await expect(planCommand('')).rejects.toThrow('Input is required for command planning');
  });
});