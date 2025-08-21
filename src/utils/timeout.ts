import config from 'config';

// Get timeout from environment variable or settings
export function getExecuteTimeout(operation: 'shell' | 'code' | 'llm'): number {
  // Check environment variable first
  const envTimeout = process.env.EXECUTE_TIMEOUT_MS;
  if (envTimeout && !isNaN(Number(envTimeout))) {
    return Number(envTimeout);
  }

  // Check specific operation timeout
  const specificEnvVar = `EXECUTE_${operation.toUpperCase()}_TIMEOUT_MS`;
  const specificTimeout = process.env[specificEnvVar];
  if (specificTimeout && !isNaN(Number(specificTimeout))) {
    return Number(specificTimeout);
  }

  // Fall back to config or default (2 minutes)
  try {
    return config.get(`features.execute${operation.charAt(0).toUpperCase() + operation.slice(1)}.timeoutMs`) || 120_000;
  } catch {
    return 120_000; // 2 minutes default
  }
}