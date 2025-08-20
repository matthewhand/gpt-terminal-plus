import Debug from 'debug';
import cfg from 'config';

const debug = Debug('app:safety');

const DEFAULT_CONFIRM_PATTERNS = [
  /\brm\s+-rf\b/i,
  /\bmkfs\b/i,
  /\bdd\s+if=\b/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
  /\buserdel\b/i,
  /\biptables\s+-F\b/i,
  /\bsystemctl\s+stop\b/i
];

const DEFAULT_DENY_PATTERNS = [
  /:\/$/, // guard against commands like rm -rf /
];

function parsePatternsFromStringList(val?: string, defaults: RegExp[] = []): RegExp[] {
  try {
    if (!val) return defaults;
    const parts = val.split(',').map(s => s.trim()).filter(Boolean);
    return parts.map(p => new RegExp(p, 'i'));
  } catch (e) {
    debug('Failed to parse patterns: ' + String(e));
    return defaults;
  }
}

export interface SafetyDecision {
  hardDeny: boolean;
  needsConfirm: boolean;
  reasons: string[];
}

export function evaluateCommandSafety(cmd: string): SafetyDecision {
  // Env takes precedence, else config.safety.{denyRegex,confirmRegex}, else defaults
  let deny: RegExp[] = [];
  let confirm: RegExp[] = [];

  const envDeny = process.env.DENY_COMMAND_REGEX;
  const envConfirm = process.env.CONFIRM_COMMAND_REGEX;
  if (envDeny) deny = parsePatternsFromStringList(envDeny, DEFAULT_DENY_PATTERNS);
  if (envConfirm) confirm = parsePatternsFromStringList(envConfirm, DEFAULT_CONFIRM_PATTERNS);

  if (!envDeny || !envConfirm) {
    try {
      if (!envDeny && cfg.has('safety.denyRegex')) {
        const r = cfg.get<any>('safety.denyRegex');
        const s = Array.isArray(r) ? r.join(',') : String(r);
        deny = parsePatternsFromStringList(s, DEFAULT_DENY_PATTERNS);
      }
      if (!envConfirm && cfg.has('safety.confirmRegex')) {
        const r = cfg.get<any>('safety.confirmRegex');
        const s = Array.isArray(r) ? r.join(',') : String(r);
        confirm = parsePatternsFromStringList(s, DEFAULT_CONFIRM_PATTERNS);
      }
    } catch (e) {
      debug('Config safety parse error: ' + String(e));
    }
  }
  if (deny.length === 0) deny = DEFAULT_DENY_PATTERNS;
  if (confirm.length === 0) confirm = DEFAULT_CONFIRM_PATTERNS;
  const reasons: string[] = [];
  let hardDeny = false;
  let needsConfirm = false;

  for (const r of deny) {
    if (r.test(cmd)) { hardDeny = true; reasons.push(`Denied by pattern: ${r}`); }
  }
  for (const r of confirm) {
    if (r.test(cmd)) { needsConfirm = true; reasons.push(`Needs confirmation by pattern: ${r}`); }
  }
  return { hardDeny, needsConfirm, reasons };
}
