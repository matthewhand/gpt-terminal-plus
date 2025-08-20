# Execution System Guide

## Endpoint Boundaries

### `/command/execute-shell` - For Shells
- **Purpose**: Execute shell commands
- **Supported**: `bash`, `sh`, `powershell`
- **Use for**: File operations, system commands, shell scripts
- **Example**: `{"command": "ls -la", "shell": "bash"}`

### `/command/execute-code` - For Interpreters  
- **Purpose**: Execute code in interpreters
- **Supported**: `python`, `python3`, `node`, `nodejs`
- **Use for**: Running code snippets, scripts
- **Example**: `{"code": "print('hello')", "language": "python"}`

## Error Handling

### Unsupported Language
```json
{
  "error": "Language 'bash' not supported",
  "message": "executeCode is for interpreters only. Supported: python, node",
  "hint": "For shell commands like bash, use /command/execute-shell instead"
}
```

### Missing Interpreter
```json
{
  "error": "Interpreter 'python3' not available", 
  "message": "python interpreter (python3) is not installed or not in PATH",
  "hint": "Install python3 or use a different language"
}
```

## File Operations

File operations are controlled by `files.enabled` setting:
- **Enabled**: Shell commands can create/modify files
- **Disabled**: File operations blocked with clear error message

## Configuration

```bash
# Allow specific shells
SHELL_ALLOWED=bash,sh,powershell

# Enable/disable file operations  
FILES_ENABLED=true

# Execution timeout
EXECUTE_TIMEOUT_MS=120000
```