module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@handlers/(.*)$': '<rootDir>/src/handlers/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  }
};
