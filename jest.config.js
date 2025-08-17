module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@command/(.*)$": "<rootDir>/src/command/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@llm/(.*)$": "<rootDir>/src/llm/$1",
    "^@message/(.*)$": "<rootDir>/src/message/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@webhook/(.*)$": "<rootDir>/src/webhook/$1",
    "^@integrations/(.*)$": "<rootDir>/src/integrations/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1"
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};
