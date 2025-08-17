import Debug from 'debug';
import { getSupportedModels } from '../common/models';
import { getSelectedModel } from '../utils/GlobalStateHelper';
import { llmConfig } from '../common/llmConfig';
import { chat } from './index';

const debug = Debug('app:llm:errorAdvisor');

export interface ErrorContext {
  kind: 'command' | 'code' | 'file';
  input: string; // command string, code snippet, or filename
  language?: string; // for code
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  cwd?: string;
}

export interface ErrorAnalysis {
  model: string;
  text: string;
}

function getLlmClient() {
  return { chat };
}

export async function analyzeError(ctx: ErrorContext): Promise<ErrorAnalysis | null> {
  // Evaluate feature flag and llm config early
  const cfg = llmConfig;
  const auto = process.env.AUTO_ANALYZE_ERRORS !== 'false';
  if (!auto) return null;
  if (process.env.LLM_ENABLED === 'false' || (cfg as any).provider === 'none') return null;

  const client = getLlmClient();
  if (!client) return null;

  const supported = getSupportedModels();
  const prefer = 'gpt-oss:20b';
  const model = supported.includes(prefer) ? prefer : getSelectedModel();
  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are an expert devops and software engineer. Analyze the failure output and provide concise, actionable fixes. Suggest commands, config changes, or code snippets. Keep it pragmatic and prioritize root causes.'
      },
      {
        role: 'user',
        content: JSON.stringify({
          task: 'Analyze failure and propose fixes',
          context: ctx.kind,
          input: ctx.input,
          language: ctx.language,
          exitCode: ctx.exitCode,
          stderr: trimTo(ctx.stderr, 8000),
          stdout: trimTo(ctx.stdout, 2000),
          cwd: ctx.cwd
        })
      }
    ];

    const resp = await client.chat({ model, messages } as any);
    const text = resp?.choices?.[0]?.message?.content || '';
    return { model, text };
  } catch (err) {
    debug('Error during AI analysis: ' + String(err));
    return null;
  }
}

function trimTo(s: string | undefined, n: number): string | undefined {
  if (!s) return s;
  if (s.length <= n) return s;
  return s.substring(0, n) + '\n... (truncated)';
}

