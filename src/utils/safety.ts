import Debug from 'debug';

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

function parsePatterns(envVar?: string, defaults: RegExp[] = []): RegExp[] {
  try {
    if (!envVar) return defaults;
    const parts = envVar.split(',').map(s => s.trim()).filter(Boolean);
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
  const deny = parsePatterns(process.env.DENY_COMMAND_REGEX, DEFAULT_DENY_PATTERNS);
  const confirm = parsePatterns(process.env.CONFIRM_COMMAND_REGEX, DEFAULT_CONFIRM_PATTERNS);
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

