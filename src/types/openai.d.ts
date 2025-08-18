// Ambient type shim for optional 'openai' package to allow compilation without the dependency installed.
// Defines a default-exported class so it can be used as both a value and a type.
declare module 'openai' {
  export default class OpenAI {
    constructor(config?: any);
    chat: {
      completions: {
        create: (...args: any[]) => any;
      };
    };
    responses?: any;
  }
}