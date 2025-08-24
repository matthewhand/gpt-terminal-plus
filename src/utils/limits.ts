import { convictConfig } from '../config/convictConfig';

export interface LimitConfig {
  maxInputChars: number;
  maxOutputChars: number;
  maxSessionDurationSec: number;
  maxSessionIdleSec: number;
  maxLlmCostUsd: number | null;
  allowTruncation: boolean;
}

export function getLimitConfig(): LimitConfig {
  const cfg = convictConfig();

  // Base limits from global config (convict)
  const base: LimitConfig = {
    maxInputChars: safeNat(cfg.get('limits.maxInputChars'), 200000),
    maxOutputChars: safeNat(cfg.get('limits.maxOutputChars'), 200000),
    maxSessionDurationSec: safeNat(cfg.get('limits.maxSessionDurationSec'), 7200),
    maxSessionIdleSec: safeNat(cfg.get('limits.maxSessionIdleSec'), 600),
    maxLlmCostUsd: safeNumOrNull(cfg.get('limits.maxLlmCostUsd')),
    allowTruncation: !!cfg.get('limits.allowTruncation'),
  };

  // Merge active profile session overrides, if any
  try {
    const profiles = cfg.get('profiles') as any[] | undefined;
    const activeName = cfg.get('activeProfile') as string | undefined;
    const active =
      Array.isArray(profiles)
        ? (profiles.find((p: any) => p?.name === activeName) || profiles[0])
        : null;

    const session = (active as any)?.session;
    if (session && typeof session === 'object') {
      if (session.maxInputChars !== undefined) {
        base.maxInputChars = safeNat(session.maxInputChars, base.maxInputChars);
      }
      if (session.maxOutputChars !== undefined) {
        base.maxOutputChars = safeNat(session.maxOutputChars, base.maxOutputChars);
      }
      if (session.maxDuration !== undefined) {
        base.maxSessionDurationSec = safeNat(session.maxDuration, base.maxSessionDurationSec);
      }
      if (session.maxIdle !== undefined) {
        base.maxSessionIdleSec = safeNat(session.maxIdle, base.maxSessionIdleSec);
      }
      // Note: budget/allowTruncation remain global for now
    }
  } catch {
    // Non-fatal: ignore profile overlay errors
  }

  return base;
}

function safeNat(v: any, def: number): number { const n = Number(v); return isFinite(n) && n >= 0 ? n : def; }
function safeNumOrNull(v: any): number | null { if (v === null || v === undefined || v === '') return null; const n = Number(v); return isFinite(n) ? n : null; }

export function enforceInputLimit(kind: string, input: string): { ok: true } | { ok: false; payload: any } | { ok: true; truncated: true; value: string } {
  const { maxInputChars, allowTruncation } = getLimitConfig();
  if (!input) return { ok: true };
  if (input.length <= maxInputChars) return { ok: true };
  if (allowTruncation) {
    const value = input.slice(0, maxInputChars);
    return { ok: true, truncated: true, value };
  }
  return {
    ok: false,
    payload: {
      error: 'Input exceeded limit',
      truncated: true,
      stdout: String(input).slice(0, maxInputChars)
    }
  };
}

export function clipOutput(stdout: string, stderr: string): { stdout: string; stderr: string; truncated: boolean } {
  const { maxOutputChars } = getLimitConfig();
  const total = (stdout?.length || 0) + (stderr?.length || 0);
  if (total <= maxOutputChars) return { stdout, stderr, truncated: false };
  const ratio = stdout.length / Math.max(1, total);
  const stdoutMax = Math.floor(maxOutputChars * ratio);
  const stderrMax = maxOutputChars - stdoutMax;
  return {
    stdout: stdout.slice(0, stdoutMax),
    stderr: stderr.slice(0, stderrMax),
    truncated: true
  };
}

