import config from 'config';

export function areFileOperationsEnabled(): boolean {
  try {
    const val = (config as any).get('files.enabled');
    if (val === undefined || val === null) return true;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.trim() !== '';
    return true;
  } catch {
    // If config is missing or throws, default to enabled
    return true;
  }
}

export function validateFileOperations(): { allowed: boolean; error?: string } {
  if (!areFileOperationsEnabled()) {
    return {
      allowed: false,
      error: 'File operations are disabled. Set files.enabled=true in config or FILES_ENABLED=true in environment.'
    };
  }
  return { allowed: true };
}
