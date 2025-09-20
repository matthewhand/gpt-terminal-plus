# Endpoint Status for Web UI Development

## WORKING ENDPOINTS (SAFE TO USE)
These endpoints are fully functional and tested:

- `POST /command/execute-shell` - Execute shell commands safely
- `POST /command/execute-code` - Execute code in various languages  
- `GET /server/list` - List all configured servers
- `GET /activity/list` - List session activities
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system diagnostics
- `GET /settings` - Get security/redacted settings

## BROKEN ENDPOINTS (AVOID COMPLETELY)  
These endpoints are completely broken and return 404 errors:

- `POST /shell/session/start` - Shell session start
- `GET /shell/session/list` - List shell sessions  
- `POST /shell/session/:id/exec` - Execute commands in sessions
- `GET /shell/session/:id/logs` - Get session logs
- `POST /shell/session/:id/stop` - Stop shell sessions

## PARTIAL ENDPOINTS (USE WITH CAUTION)
These endpoints have basic functionality but limited features:

- `POST /file/create` - Create files (basic CRUD only)
- `POST /file/read` - Read files (basic CRUD only)  
- `POST /file/update` - Update files (basic CRUD only)
- `POST /file/delete` - Delete files (basic CRUD only)

## DEVELOPMENT RECOMMENDATION

**START WITH WORKING ENDPOINTS FIRST** to avoid wasting time on broken features.

The shell session endpoints are completely broken due to router mounting issues and should be avoided until fixed.

You can check the current endpoint status at any time by accessing:
`http://localhost:5004/endpoint-status.json`