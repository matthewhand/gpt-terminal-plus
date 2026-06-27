export type FeatureFlags = {
  executeShellEnabled: boolean
  executeCodeEnabled: boolean
};

export function getFeatureFlags(): FeatureFlags {
  // Defaults are permissive so tests run without external deps
  return {
    executeShellEnabled: true,
    executeCodeEnabled: true,
  };
}
