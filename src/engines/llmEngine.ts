import { convictConfig } from '../config/convictConfig';
import { costTracker } from '../utils/costTracker';

export interface LLMResponse {
  command?: string;
  explanation?: string;
  needsApproval?: boolean;
  cost?: number;
}

export async function planCommand(userInput: string): Promise<LLMResponse> {
  // Validate input
  if (!userInput || userInput.trim() === '') {
    throw new Error('Input is required for command planning');
  }
  
  let cfg: any;
  try { cfg = convictConfig(); } catch {}
  const engine = safeGet(cfg, 'llm.engine', 'codex');
  
  // Check budget first
  const budget = costTracker.checkBudget();
  if (!budget.allowed) {
    throw new Error(`LLM budget exceeded. Remaining: $${budget.remaining}`);
  }
  
  switch (engine) {
    case 'codex':
      return await handleCodex(userInput);
    case 'interpreter':
      return await handleInterpreter(userInput);
    case 'ollama':
      return await handleOllama(userInput);
    default:
      throw new Error(`Unknown LLM engine: ${engine}`);
  }
}

async function handleCodex(input: string): Promise<LLMResponse> {
  let cfg: any; try { cfg = convictConfig(); } catch {}
  const model = safeGet(cfg, 'codex.model', 'gpt-4');
  const fullAuto = !!safeGet(cfg, 'codex.fullAuto', false);
  
  // Simplified implementation - would integrate with actual OpenAI API
  const estimatedCost = 0.01; // Mock cost
  
  try {
    costTracker.addCost(estimatedCost);
  } catch (error) {
    // Cost tracking failed, but don't fail the command planning
    console.warn('Cost tracking failed:', error);
  }
  
  // Basic command sanitization
  const sanitizedInput = input.replace(/rm\s+-rf\s*\//g, 'echo "Dangerous command blocked"');
  
  return {
    command: `echo "Planned command for: ${sanitizedInput}"`,
    explanation: `Generated command using ${model}`,
    needsApproval: !fullAuto,
    cost: estimatedCost,
  };
}

async function handleInterpreter(input: string): Promise<LLMResponse> {
  let cfg: any; try { cfg = convictConfig(); } catch {}
  const autoRun = !!safeGet(cfg, 'interpreter.autoRun', false);
  
  const estimatedCost = 0.02;
  costTracker.addCost(estimatedCost);
  
  return {
    command: `python -c "print('Interpreter result for: ${input}')"`,
    explanation: 'Generated via interpreter engine',
    needsApproval: !autoRun,
    cost: estimatedCost,
  };
}

async function handleOllama(input: string): Promise<LLMResponse> {
  let cfg: any; try { cfg = convictConfig(); } catch {}
  const host = String(safeGet(cfg, 'ollama.host', 'http://localhost:11434'));
  
  // Ollama is typically free/local
  return {
    command: `curl -s "${host}/api/generate" -d '{"model":"llama2","prompt":"${input}"}'`,
    explanation: 'Generated via Ollama',
    needsApproval: false,
    cost: 0,
  };
}

function safeGet(cfg: any, path: string, def: any) {
  try { return cfg?.get?.(path) ?? def; } catch { return def; }
}
