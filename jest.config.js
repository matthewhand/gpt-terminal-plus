module.exports = {
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\.|/)(test|spec))\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/',
  },
  setupFiles: ['module-alias/register'],
};
