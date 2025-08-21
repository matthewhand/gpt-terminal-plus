import config from 'config';

export function areFileOperationsEnabled(): boolean {
  try {
    return config.get('files.enabled') !== false;
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