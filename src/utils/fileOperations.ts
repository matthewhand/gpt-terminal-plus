import config from 'config';

export function areFileOperationsEnabled(): boolean {
  try {
    const val = (config as any).get('files.enabled');
    if (val === false) return false;
    if (val === 0) return false;
    if (val === '') return false;
    // undefined/null -> default allow
    if (val === undefined || val === null) return true;
    return true;
  } catch {
    return true; // Default to enabled if config missing
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
