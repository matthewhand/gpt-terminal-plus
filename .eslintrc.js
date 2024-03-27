module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  ignorePatterns: ['src/handlers/shSystemInfoCommand.ts', '**/*.d.ts'], // Added '**/*.d.ts' here

  rules: {
      "@typescript-eslint/no-unused-vars": "off",
      
    },
};
