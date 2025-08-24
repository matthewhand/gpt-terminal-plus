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

  test('should plan command with codex engine', async () => {
    const result = await planCommand('list files');
    expect(result.command).toContain('echo');
    expect(result.explanation).toContain('Generated command');
    expect(costTracker.addCost).toHaveBeenCalled();
  });

  test('should reject when budget exceeded', async () => {
    (costTracker.checkBudget as jest.Mock).mockReturnValue({ allowed: false, remaining: 0 });
    await expect(planCommand('test')).rejects.toThrow('budget exceeded');
  });
});