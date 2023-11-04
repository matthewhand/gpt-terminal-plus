export function escapeSed(string: string) {
    return string.replace(/&/g, '\\$&').replace(/\//g, '\\/');
  }
  