import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  }
];
