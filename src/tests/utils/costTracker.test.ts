import { costTracker } from '../../utils/costTracker';

jest.mock('../../config/convictConfig', () => ({
  convictConfig: () => ({
    get: (key: string) => key === 'limits.maxLlmCostUsd' ? 5.0 : 0
  })
}));

describe('Cost Tracker', () => {
  beforeEach(() => {
    costTracker.reset();
  });

  test('should track costs', () => {
    costTracker.addCost(1.5);
    expect(costTracker.getTotalCost()).toBe(1.5);
  });

  test('should check budget limits', () => {
    costTracker.addCost(3.0);
    const budget = costTracker.checkBudget();
    expect(budget.allowed).toBe(true);
    expect(budget.remaining).toBe(2.0);
  });

  test('should block when budget exceeded', () => {
    costTracker.addCost(6.0);
    const budget = costTracker.checkBudget();
    expect(budget.allowed).toBe(false);
    expect(budget.remaining).toBe(0);
  });
});