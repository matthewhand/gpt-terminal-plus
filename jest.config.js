module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Robustly ignore build outputs, e2e, legacy specs, and any non-.ts test sources
  // to prevent running stale compiled tests from dist/ (old src/tests/) or stray .js artifacts
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/dist/tests/',
    '/e2e/',
    'tests/e2e/',
    '\\.spec\\.ts$',
    '\\.spec\\.js$',
    '\\.js$',
    '\\.d\\.ts$'
  ],
  // Explicitly only execute source TypeScript tests under tests/; excludes everything in dist/, *.js, specs, etc.
  testMatch: [
    '**/tests/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@handlers/(.*)$': '<rootDir>/src/handlers/$1',
    '^@managers/(.*)$': '<rootDir>/src/managers/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1'
  }
};