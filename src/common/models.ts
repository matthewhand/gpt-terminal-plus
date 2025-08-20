import Debug from 'debug';

const debug = Debug('app:models');

// Central registry for supported models
const SUPPORTED_MODELS = [
  'gpt-oss:20b'
];

export const getSupportedModels = (): string[] => {
  debug('Fetching supported models');
  return SUPPORTED_MODELS.slice();
};

export const isSupportedModel = (model: string): boolean => {
  const supported = getSupportedModels();
  const ok = !!model && supported.includes(model);
  debug(`Model ${model} supported: ${ok}`);
  return ok;
};

export const getDefaultModel = (): string => {
  const envModel = process.env.DEFAULT_MODEL;
  if (envModel && isSupportedModel(envModel)) {
    debug('Using DEFAULT_MODEL from environment: ' + envModel);
    return envModel;
  }
  const fallback = SUPPORTED_MODELS[0];
  debug('Using fallback default model: ' + fallback);
  return fallback;
};

