import { convictConfig } from '../config/convictConfig';

class CostTracker {
  private totalCost = 0;

  addCost(amount: number): void {
    this.totalCost += amount;
  }

  getTotalCost(): number {
    return this.totalCost;
  }

  checkBudget(): { allowed: boolean; remaining: number } {
    const cfg = convictConfig();
    const maxCost = Number(cfg.get('limits.maxLlmCostUsd') || 0);
    
    if (maxCost <= 0) {
      return { allowed: true, remaining: Infinity };
    }

    const remaining = maxCost - this.totalCost;
    return { 
      allowed: remaining > 0, 
      remaining: Math.max(0, remaining) 
    };
  }

  reset(): void {
    this.totalCost = 0;
  }
}

export const costTracker = new CostTracker();