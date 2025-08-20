export function escapeSpecialChars(input: string): string {
  // Implementation...
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
