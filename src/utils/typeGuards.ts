// Type guards for runtime type checking

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function hasProperty<T extends string>(
  obj: unknown,
  prop: T
): obj is Record<T, unknown> {
  return isObject(obj) && prop in obj;
}

export function isValidCommand(value: unknown): value is { command: string } {
  return isObject(value) && hasProperty(value, 'command') && isString(value.command);
}

export function isValidFilePath(value: unknown): value is { filePath: string } {
  return isObject(value) && hasProperty(value, 'filePath') && isString(value.filePath);
}

export function isValidCode(value: unknown): value is { code: string; language: string } {
  return isObject(value) && 
         hasProperty(value, 'code') && isString(value.code) &&
         hasProperty(value, 'language') && isString(value.language);
}