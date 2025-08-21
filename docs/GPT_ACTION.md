# ChatGPT Custom GPT Action Configuration

This document provides the complete configuration for creating a Custom GPT that uses GPT Terminal Plus as its backend.

## GPT Action Schema

Use this OpenAPI schema in your Custom GPT Actions configuration:

```yaml
openapi: 3.1.0
info:
  title: GPT Terminal Plus
  description: Execute commands, manage files, and control servers via ChatGPT
  version: 1.0.0
servers:
  - url: https://your-domain.com
    description: Your GPT Terminal Plus deployment
paths:
  /command/execute-shell:
    post:
      operationId: executeShell
      summary: Execute shell commands
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                command:
                  type: string
                  description: Shell command to execute
                shell:
                  type: string
                  description: Shell type (bash, powershell, etc.)
                args:
                  type: array
                  items:
                    type: string
                  description: Command arguments for literal mode
              required:
                - command
      responses:
        '200':
          description: Command executed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: object
                    properties:
                      stdout:
                        type: string
                      stderr:
                        type: string
                      exitCode:
                        type: integer
                      success:
                        type: boolean
  /file/create:
    post:
      operationId: createFile
      summary: Create or update a file
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                filePath:
                  type: string
                  description: Path to the file
                content:
                  type: string
                  description: File content
                backup:
                  type: boolean
                  description: Create backup before overwriting
              required:
                - filePath
                - content
      responses:
        '200':
          description: File created successfully
  /file/read:
    post:
      operationId: readFile
      summary: Read file contents
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                filePath:
                  type: string
                  description: Path to the file
                startLine:
                  type: integer
                  description: Start line (1-based)
                endLine:
                  type: integer
                  description: End line (1-based)
              required:
                - filePath
      responses:
        '200':
          description: File content retrieved
  /command/execute-llm:
    post:
      operationId: executeLlm
      summary: Delegate task to specialized AI model
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                instructions:
                  type: string
                  description: Natural language task description
                provider:
                  type: string
                  description: LLM provider (ollama, lmstudio, openai)
                model:
                  type: string
                  description: Specific model to use
                dryRun:
                  type: boolean
                  description: Plan without executing
              required:
                - instructions
      responses:
        '200':
          description: Task delegated and executed
  /file/list:
    post:
      operationId: listFiles
      summary: List files in directory
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                directory:
                  type: string
                  description: Directory path to list
                limit:
                  type: integer
                  description: Maximum files to return
              required:
                - directory
      responses:
        '200':
          description: Files listed successfully
  /server/list:
    get:
      operationId: listServers
      summary: List available servers
      responses:
        '200':
          description: Servers listed successfully
  /server/register:
    post:
      operationId: registerServer
      summary: Register a new server
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                hostname:
                  type: string
                  description: Server hostname
                protocol:
                  type: string
                  enum: [local, ssh, ssm]
                  description: Connection protocol
                config:
                  type: object
                  description: Server-specific configuration
              required:
                - hostname
                - protocol
      responses:
        '200':
          description: Server registered successfully
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
security:
  - BearerAuth: []
```

## Authentication Setup

1. In your Custom GPT Actions configuration, set Authentication to "API Key"
2. Set Auth Type to "Bearer"
3. Use your `API_TOKEN` from the `.env` file as the API Key

## Custom GPT Instructions

Add this to your Custom GPT instructions:

```
You are a System Administrator Assistant with access to a powerful terminal backend. You can:

1. Execute shell commands on local and remote servers
2. Execute code (Python, Node.js, etc.) with interpreters
3. Create, read, and modify files with diff/patch support
4. Delegate specialized tasks to domain-expert AI models
5. Manage multiple server connections (Local, SSH, SSM)
6. Register new servers dynamically

IMPORTANT USAGE GUIDELINES:
- Always confirm destructive operations before executing
- Use literal mode for complex commands: provide "args" array instead of single "command" string
- Check server list before operations to know available targets
- Use appropriate file operations instead of shell heredocs when possible
- For specialized tasks (database, code analysis, DevOps), consider using execute-llm to delegate to expert AI models
- Explain what you're doing before executing commands

SAFETY FEATURES:
- All operations are authenticated and logged
- File operations include backup options
- Commands are validated before execution
- Multi-server support with proper isolation

When users ask for system administration tasks, use these tools to provide real, working solutions.
```

## Deployment URLs

Replace `https://your-domain.com` in the schema with your actual deployment:

### Local Development
```
http://localhost:5004
```

### Fly.io Deployment
```
https://your-app-name.fly.dev
```

### Vercel Deployment
```
https://your-app-name.vercel.app
```

## Testing Your GPT Action

1. Create the Custom GPT with the above configuration
2. Test basic functionality:
   - "List available servers"
   - "Execute: echo 'Hello from GPT Terminal Plus'"
   - "Create a test file with some content"
   - "List files in the current directory"

## Security Considerations

- Keep your API_TOKEN secure and rotate regularly
- Use HTTPS in production deployments
- Configure CORS_ORIGIN to restrict access to ChatGPT domains
- Monitor logs for unusual activity
- Consider IP whitelisting for additional security