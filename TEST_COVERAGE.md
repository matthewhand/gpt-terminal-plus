# Test Coverage Report

## ✅ Complete Test Suite

### Unit Tests
- **LLM Engine** (`src/tests/engines/llmEngine.test.ts`)
  - Command planning with different engines
  - Budget enforcement and cost tracking
  - Error handling for budget exceeded

- **Cost Tracker** (`src/tests/utils/costTracker.test.ts`)
  - Cost accumulation and tracking
  - Budget limit validation
  - Reset functionality

- **File Engine** (`src/tests/engines/fileEngine.test.ts`)
  - File operations (read, write, delete, list, mkdir)
  - Security path validation
  - Unauthorized access prevention

- **Remote Engine** (`src/tests/engines/remoteEngine.test.ts`)
  - SSH session creation and management
  - SSM session handling
  - Connection failure scenarios

- **Session Persistence** (`src/tests/utils/sessionPersistence.test.ts`)
  - Session state saving to disk
  - Session recovery from disk
  - Error handling for missing files

### Middleware Tests
- **Rate Limiter** (`src/tests/middlewares/rateLimiter.test.ts`)
  - Request counting per IP
  - Rate limit enforcement
  - Time window reset

- **Command Validator** (`src/tests/middlewares/commandValidator.test.ts`)
  - Safe command approval
  - Dangerous command blocking
  - Policy regex enforcement

### Route Tests
- **Shell Session Routes** (`src/tests/routes/shell/session.test.ts`)
  - Session creation and management
  - Command execution with circuit breakers
  - Input length validation
  - Session listing and logs

- **LLM Routes** (`src/tests/routes/llm.test.ts`)
  - Command planning API
  - Input validation
  - Budget exceeded handling

### Integration Tests
- **Circuit Breakers** (`src/tests/integration/circuitBreakers.test.ts`)
  - MAX_INPUT_CHARS validation
  - Output truncation behavior
  - Long-running command uplift to sessions
  - Timeout handling

## 🔧 Test Configuration

### Jest Setup
- **Config**: `jest.config.js` with TypeScript support
- **Coverage**: HTML, LCOV, and text reports
- **Environment**: Node.js test environment
- **Setup**: Global test configuration in `src/tests/setup.ts`

### Coverage Targets
```javascript
collectCoverageFrom: [
  'src/**/*.ts',
  '!src/**/*.d.ts',
  '!src/tests/**',
  '!src/index.ts',
]
```

### Test Scripts
```bash
npm test              # Run all tests
npm run test:coverage # Run with coverage report
npm run test:watch    # Watch mode for development
npm run test:ci       # CI/CD optimized run
```

## 📊 Coverage Areas

### Core Features Tested
- ✅ Circuit breakers (input/output limits, cost tracking)
- ✅ Session persistence and recovery
- ✅ LLM integration with multiple engines
- ✅ Remote execution (SSH/SSM)
- ✅ File operations with security
- ✅ Rate limiting and command validation
- ✅ WebSocket functionality (mocked)
- ✅ Configuration management

### Security Features Tested
- ✅ Path traversal prevention
- ✅ Dangerous command blocking
- ✅ Rate limiting enforcement
- ✅ Budget limit validation
- ✅ Input sanitization

### Error Scenarios Covered
- ✅ Network failures
- ✅ File system errors
- ✅ Budget exceeded conditions
- ✅ Invalid input handling
- ✅ Session not found cases
- ✅ Process spawn failures

## 🚀 Running Tests

### Local Development
```bash
# Install dependencies
npm install

# Run tests with coverage
npm run test:coverage

# Watch mode for TDD
npm run test:watch
```

### CI/CD Pipeline
```bash
# Optimized for CI environments
npm run test:ci
```

### Coverage Reports
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Data**: `coverage/lcov.info`
- **Console Output**: Real-time coverage summary

All critical paths and edge cases are covered with comprehensive test coverage across the entire codebase.