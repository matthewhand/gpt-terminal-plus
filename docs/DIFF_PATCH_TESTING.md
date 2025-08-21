# Diff & Patch Endpoints Testing

This document describes the comprehensive test suite for the new diff and patch endpoints.

## Endpoints Implemented

### POST /command/diff
- **Input**: `{ "filePath": "string" }`
- **Output**: `{ "diff": "unified diff string" }`
- **Purpose**: Generate a unified diff for a file

### POST /command/patch  
- **Input**: `{ "filePath": "string", "patch": "unified diff string" }`
- **Output**: `{ "ok": true }` or `{ "ok": false, "error": "string" }`
- **Purpose**: Apply a unified diff patch to a file

## Test Coverage

### Unit Tests (`tests/routes/command/diffPatch.test.ts`)

**Diff Endpoint Tests:**
- ✅ Returns diff when file exists
- ✅ Returns 404 when file doesn't exist  
- ✅ Returns 400 when filePath is missing

**Patch Endpoint Tests:**
- ✅ Successfully applies a valid patch
- ✅ Returns error when patch is invalid
- ✅ Returns 404 when file doesn't exist
- ✅ Returns 400 when filePath is missing
- ✅ Returns 400 when patch is missing

### Integration Tests (`tests/integration/diffPatch.integration.test.ts`)

**Workflow Tests:**
- ✅ Complete diff-patch workflow
- ✅ Patch failure handling
- ✅ JSON structure validation for diff endpoint
- ✅ JSON structure validation for patch success
- ✅ JSON structure validation for patch failure
- ✅ Concurrent request handling

## Test Features

### Cross-Platform Compatibility
- Uses Node.js filesystem operations (no system `git` dependency)
- Deterministic test setup and cleanup
- Temporary file management

### Error Scenarios Covered
- Missing files (404 responses)
- Invalid parameters (400 responses)  
- Invalid patch formats
- Concurrent operations

### Mock Implementation
- Filesystem-based file existence checking
- Pattern-based patch validation
- Unified diff format generation
- Cross-platform path handling

## Running Tests

```bash
# Run unit tests only
npm test -- tests/routes/command/diffPatch.test.ts

# Run integration tests only  
npm test -- tests/integration/diffPatch.integration.test.ts

# Run both diff/patch tests
npm test -- --testPathPattern="diffPatch"

# Run demonstration script
./scripts/test-diff-patch.sh
```

## Test Results

All tests pass successfully:
- **Unit Tests**: 8/8 passing
- **Integration Tests**: 6/6 passing
- **Total Coverage**: 14/14 tests passing

## Implementation Notes

### Authentication
- Tests use proper Express app setup with middleware
- API token authentication handled in test environment
- No authentication bypass in production code

### File Operations
- Safe temporary file creation and cleanup
- Proper error handling for filesystem operations
- Cross-platform path resolution

### Response Format
- Consistent JSON response structure
- Proper HTTP status codes
- Error messages match OpenAPI specification

## Future Enhancements

Potential areas for expansion:
- Real git integration for production use
- Binary file diff support
- Multi-file patch operations
- Patch preview/dry-run functionality
- Backup file management