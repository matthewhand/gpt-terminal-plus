# Testing Design for gpt-terminal-plus

This document outlines the testing design for the `gpt-terminal-plus` project, including the imports used, the file structure, and the commands from `package.json` that handle testing.

## Imports

### Used Imports

1. **Jest**: Primary testing framework used for writing and running tests.
   - Mocking functions and modules.
   - Assertions and test runners.

2. **Chai**: Assertion library used for BDD/TDD assertions.
   - Provides expressive language for writing tests.
   - Used alongside Jest for more readable assertions.

3. **ssh2**: Used for creating SSH connections and executing commands.
   - Mocked in tests to simulate SSH operations.

### Not Used Imports

1. **Sinon**: Not used in our tests. Jest's built-in mocking capabilities are utilized instead.

2. **Mocha**: Not used as Jest is our primary testing framework.

## TypeScript Configuration

- **baseUrl**: Set to "." to ensure paths are relative to the root directory.
- **paths**: Define module aliases to streamline imports.
- **types**: Include Jest and Node types in `tsconfig.json`.

### Example `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "types": ["jest", "node"],
    "baseUrl": ".",
    "typeRoots": ["node_modules/@types", "src/types"],
    "paths": {
      "@types/*": ["src/types/*"],
      "@handlers/*": ["src/handlers/*"],
      "@utils/*": ["src/utils/*"]
    },
    "incremental": true,
    "skipLibCheck": true,
    "downlevelIteration": true,
    "noEmitOnError": true
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ],
  "files": [
    "src/types/express.d.ts",
    "src/global.d.ts"
  ]
}
```

## File Structure
## File Structure

The following is an overview of the test file structure:

```
project-root/
├── docs/
│   └── DESIGN.testing.md
├── src/
│   ├── handlers/
│   │   ├── SshServerHandler.ts
│   │   ├── LocalHandler.ts
│   │   ├── SsmHandler.ts
│   │   └── ...
│   └── ...
├── tests/
│   ├── handlers/
│   │   ├── SshServerHandler.test.ts
│   │   ├── LocalHandler.test.ts
│   │   ├── SsmHandler.test.ts
│   │   └── ...
│   └── ...
├── package.json
└── ...
```

## Commands from `package.json`

The `package.json` file includes several scripts for running tests. Here are the relevant commands:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

### Explanation of Commands

- `test`: Runs all tests once using Jest.
  ```bash
  npm test
  ```
- `test:watch`: Runs tests in watch mode, rerunning tests when files change.
  ```bash
  npm run test:watch
  ```
- `test:coverage`: Runs tests and generates a code coverage report.
  ```bash
  npm run test:coverage
  ```
- `lint`: Runs ESLint to check for code quality issues.
  ```bash
  npm run lint
  ```
- `lint:fix`: Runs ESLint with the `--fix` option to automatically fix issues where possible.
  ```bash
  npm run lint:fix
  ```

## Summary

This document provides an overview of the testing design for the `gpt-terminal-plus` project, including the used imports, file structure, and commands from `package.json` to run tests and lint the code. Use this guide to understand the testing setup and how to effectively run and manage tests in the project.
