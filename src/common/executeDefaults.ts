export type Mode = 'shell' | 'python' | 'llm';

export type ExecuteDefaults = {
  /** Default modes to run if client does not specify any */
  modes: Mode[];
  /** Server-side toggles that FORCE a mode on regardless of client request */
  force: { shell: boolean; python: boolean; llm: boolean };
  /** Shell selection policy */
  shell: 'bash' | 'sh' | 'powershell' | 'cmd';
  /** Python engine (name/path) */
  pythonEngine: string;
  /** Simple remote descriptor (expand later as needed) */
  remote: { protocol: 'local' | 'ssh' | 'ssm'; host?: string; user?: string };
};

const allowedModes: Mode[] = ['shell', 'python', 'llm'];

let STATE: ExecuteDefaults = {
  modes: ['shell'],
  force: { shell: true, python: false, llm: false }, // shell always on by default
  shell: 'bash',
  pythonEngine: 'python3',
  remote: { protocol: 'local' },
};

export function listAvailableModes(): Mode[] {
  return [...allowedModes];
}

export function getExecuteDefaults(): ExecuteDefaults {
  return { ...STATE, force: { ...STATE.force }, remote: { ...STATE.remote } };
}

export function setExecuteDefaults(next: Partial<ExecuteDefaults>): ExecuteDefaults {
  STATE = {
    ...STATE,
    ...(next || {}),
    force: { ...STATE.force, ...(next?.force || {}) },
    remote: { ...STATE.remote, ...(next?.remote || {}) },
  };
  // sanitize modes
  const input = (next?.modes ?? STATE.modes).map(String) as string[];
  STATE.modes = input
    .map(m => m.toLowerCase().trim())
    .filter((m): m is Mode => (allowedModes as string[]).includes(m));
  return getExecuteDefaults();
}

/** Resolve modes to run = (client requested OR defaults) UNION all server-forced-on */
export function resolveModes(requested?: unknown): Mode[] {
  const d = getExecuteDefaults();
  const fromClient = Array.isArray(requested) && requested.length
    ? (requested as unknown[]).map(v => String(v).toLowerCase().trim())
    : d.modes;

  const forced: string[] = Object.entries(d.force)
    .filter(([, on]) => !!on)
    .map(([k]) => k);

  const union = Array.from(new Set([...fromClient, ...forced]))
    .filter((m): m is Mode => (allowedModes as string[]).includes(m));

  return union.length ? union : ['shell']; // always have at least one
}
