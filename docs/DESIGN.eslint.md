# ESLint Configuration Design for gpt-terminal-plus

## Insights and Best Practices

### ESLint Configuration with FlatCompat

- ESLint's flat configuration format requires proper module support.
- Use `import.meta.url` to define `__dirname` and `__filename` in ES modules.

### Steps to Configure ESLint

1. **Convert ESLint configuration to `eslint.config.js`**:
    - Ensure the project type is set to module by adding `"type": "module"` in `package.json`.
    - Use `FlatCompat` to migrate from traditional configurations.

2. **Handle `__dirname` and `__filename` in ES modules**:
    - Define `__dirname` and `__filename` using `import.meta.url` when using `path` module functions.


### Example Configuration

```javascript
import { fileURLToPath } from 'url';
import path from 'path';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ["dist/**", "node_modules/**", "build/**"],
  },
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "semi": ["error", "always"],
    },
  },
];
```
